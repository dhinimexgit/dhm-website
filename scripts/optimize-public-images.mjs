/**
 * In-place optimizer for the raster images in `public/`.
 *
 * Filenames and formats are preserved, so no code references change — only the
 * pixel dimensions and encoder settings do. Everything here is tracked by git,
 * so `git checkout -- public` reverts the whole run.
 *
 * Usage:
 *   node scripts/optimize-public-images.mjs --dry     # report only
 *   node scripts/optimize-public-images.mjs           # write in place
 *
 * Sizing rationale: nothing on the site renders wider than ~1600 CSS px, so a
 * 2x-DPR source caps out around 2560. Logos render at 48-360 px, so 1200 is
 * already generous for them.
 */
import sharp from "sharp";
import { readdir, rename, stat, unlink, writeFile } from "node:fs/promises";
import path from "node:path";

const ROOT = path.resolve("public");
const DRY = process.argv.includes("--dry");

// Longest-side caps by role. First matching rule wins.
const RULES = [
  // Brand logos: displayed between 48px and 360px wide.
  { test: (p) => p.includes("brands/") || p.includes("brands\\"), max: 1200, role: "logo" },
  // Timeline stills already have optimized/v2 webp derivatives that the app
  // actually references; the originals here are only kept as masters.
  { test: (p) => p.includes("biz-portfolio-timeline"), max: 2000, role: "timeline" },
  // Everything else: full-bleed heroes and section art.
  { test: () => true, max: 2560, role: "content" },
];

const EXTS = new Set([".png", ".jpg", ".jpeg", ".webp"]);

async function walk(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walk(full)));
    else if (EXTS.has(path.extname(entry.name).toLowerCase())) out.push(full);
  }
  return out;
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/**
 * OneDrive intermittently locks files mid-sync, surfacing as errno -4094
 * (`UNKNOWN`) on open-for-write. Retry with backoff, then fall back to a
 * write-temp-and-rename, which OneDrive tolerates better than truncation.
 */
async function writeInPlace(file, buf) {
  let lastErr;
  for (let attempt = 0; attempt < 4; attempt++) {
    try {
      await writeFile(file, buf);
      return;
    } catch (e) {
      lastErr = e;
      await sleep(150 * (attempt + 1));
    }
  }
  const tmp = `${file}.opt-tmp`;
  try {
    await writeFile(tmp, buf);
    await rename(tmp, file);
    return;
  } catch (e) {
    try {
      await unlink(tmp);
    } catch {}
    throw lastErr || e;
  }
}

const files = (await walk(ROOT)).sort();
let totalIn = 0;
let totalOut = 0;
let touched = 0;
const rows = [];
const skipped = [];

for (const file of files) {
  const rel = path.relative(ROOT, file).split(path.sep).join("/");
  const sizeIn = (await stat(file)).size;
  totalIn += sizeIn;

  const rule = RULES.find((r) => r.test(rel));

  let img;
  let meta;
  try {
    // Some brand logos are >268MP, which trips sharp's default guard.
    img = sharp(file, { limitInputPixels: false });
    meta = await img.metadata();
  } catch (e) {
    rows.push([rel, sizeIn, sizeIn, `SKIP (unreadable: ${e.message})`]);
    totalOut += sizeIn;
    continue;
  }

  const longest = Math.max(meta.width || 0, meta.height || 0);
  const needsResize = longest > rule.max;
  const fmt = (meta.format || "").toLowerCase();

  let pipeline = img;
  if (needsResize) {
    pipeline = pipeline.resize(rule.max, rule.max, {
      fit: "inside",
      withoutEnlargement: true,
    });
  }

  if (fmt === "png") {
    // Palette quantisation is a huge win on logos (flat colour, few tones) and
    // a bad trade on photographs, where 256 colours bands visible gradients —
    // measured RMSE 2.72 on product-hero.png. So: palette for brand marks,
    // full colour everywhere else.
    pipeline = pipeline.png({
      compressionLevel: 9,
      effort: 10,
      palette: rule.role === "logo",
    });
  } else if (fmt === "jpeg" || fmt === "jpg") {
    pipeline = pipeline.jpeg({ quality: 80, mozjpeg: true, progressive: true });
  } else if (fmt === "webp") {
    pipeline = pipeline.webp({ quality: 80, effort: 6 });
  } else {
    rows.push([rel, sizeIn, sizeIn, `SKIP (format ${fmt})`]);
    totalOut += sizeIn;
    continue;
  }

  let buf;
  try {
    buf = await pipeline.toBuffer();
  } catch (e) {
    rows.push([rel, sizeIn, sizeIn, `SKIP (encode: ${e.message})`]);
    totalOut += sizeIn;
    continue;
  }

  // Never make a file bigger.
  if (buf.length >= sizeIn) {
    rows.push([rel, sizeIn, sizeIn, "keep (already optimal)"]);
    totalOut += sizeIn;
    continue;
  }

  if (!DRY) {
    try {
      await writeInPlace(file, buf);
    } catch (e) {
      // OneDrive holds transient locks on files it is syncing (errno -4094).
      rows.push([rel, sizeIn, sizeIn, `SKIP (locked: ${e.code || e.message})`]);
      totalOut += sizeIn;
      skipped.push(rel);
      continue;
    }
  }
  totalOut += buf.length;
  touched++;
  const dims = needsResize
    ? `${meta.width}x${meta.height} -> ${rule.max} max`
    : `${meta.width}x${meta.height}`;
  rows.push([rel, sizeIn, buf.length, `${rule.role} ${dims}`]);
}

const mb = (n) => (n / 1048576).toFixed(2);
rows
  .filter((r) => r[1] !== r[2])
  .sort((a, b) => b[1] - b[2] - (a[1] - a[2]))
  .slice(0, 30)
  .forEach(([rel, i, o, note]) =>
    console.log(`${mb(i).padStart(7)} -> ${mb(o).padStart(7)} MB  ${rel}  [${note}]`)
  );

console.log(
  `\n${DRY ? "[DRY RUN] " : ""}${touched}/${files.length} files rewritten. ` +
    `${mb(totalIn)} MB -> ${mb(totalOut)} MB ` +
    `(saved ${mb(totalIn - totalOut)} MB, ${(((totalIn - totalOut) / totalIn) * 100).toFixed(1)}%)`
);

if (skipped.length) {
  console.log(`\n${skipped.length} file(s) skipped, re-run to pick them up:`);
  skipped.forEach((s) => console.log(`  ${s}`));
  process.exitCode = 1;
}
