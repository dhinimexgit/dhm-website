"use client";

import { useEffect, useMemo, useState } from "react";
import { db } from "@/lib/firebase";
import { doc, getDoc, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";
import {
  subscribeItemCodes,
  buildStem,
  nextCode,
  suggestDescription,
  findDuplicates,
  matchesSearch,
  normalizeSegment,
  isValidCode,
  getDomain,
  DOMAINS,
  COMPANIES,
  TOOL_BRANDS,
  TOOL_CATEGORIES,
  TOOL_FAMILIES,
  CATEGORIES_WITHOUT_FAMILY,
  UOMS,
  DEFAULT_UOM,
  COSTING_METHODS,
  type ItemCodeRecord,
  type ItemStatus,
  type CodeDraft,
  type DuplicateHit,
  type CodeRow,
} from "@/lib/item-codes";

const INPUT =
  "w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-700 shadow-sm focus:border-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-navy/20";
const LABEL = "mb-1.5 block text-sm font-semibold text-slate-700";

type SubTab = "register" | "new" | "reference";

export function ItemCodeManager() {
  const [items, setItems] = useState<ItemCodeRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [sub, setSub] = useState<SubTab>("register");

  useEffect(() => {
    const unsub = subscribeItemCodes((list) => {
      setItems(list);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-6 border-b border-slate-200 pb-6 sm:pb-8">
        <div className="min-w-0 space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-brand-red sm:text-sm">Database</p>
          <h1 className="text-2xl font-semibold leading-tight text-brand-navy sm:text-3xl md:text-4xl">Item Code</h1>
          <p className="max-w-2xl text-base text-slate-600 sm:text-lg">
            One item, one code — for the whole DHM Group. Build policy-compliant codes, check for
            duplicates, and keep the item master clean.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {([
            ["register", "Item Register"],
            ["new", "New Item Code"],
            ["reference", "Code Reference"],
          ] as [SubTab, string][]).map(([id, label]) => (
            <button
              key={id}
              onClick={() => setSub(id)}
              className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
                sub === id
                  ? "bg-brand-navy text-white shadow"
                  : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12 text-slate-500">Loading item codes...</div>
      ) : sub === "register" ? (
        <ItemRegister items={items} />
      ) : sub === "new" ? (
        <NewItemCode items={items} onCreated={() => setSub("register")} />
      ) : (
        <CodeReference />
      )}
    </div>
  );
}

// ===========================================================================
//   ITEM REGISTER
// ===========================================================================
const STATUS_STYLE: Record<ItemStatus, string> = {
  active: "bg-green-100 text-green-700",
  inactive: "bg-slate-100 text-slate-500",
  obsolete: "bg-red-100 text-red-700",
};

function ItemRegister({ items }: { items: ItemCodeRecord[] }) {
  const [term, setTerm] = useState("");
  const [domainFilter, setDomainFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState<ItemStatus | "all">("active");

  const filtered = useMemo(
    () =>
      items.filter((it) => {
        if (domainFilter !== "all" && it.domain !== domainFilter) return false;
        if (statusFilter !== "all" && it.status !== statusFilter) return false;
        return matchesSearch(it, term);
      }),
    [items, term, domainFilter, statusFilter],
  );

  const domainsInUse = useMemo(() => {
    const set = new Set(items.map((i) => i.domain));
    return DOMAINS.filter((d) => set.has(d.code));
  }, [items]);

  const setStatus = async (it: ItemCodeRecord, status: ItemStatus) => {
    try {
      await updateDoc(doc(db, "itemCodes", it.id), { status, updatedAt: serverTimestamp() });
    } catch (err) {
      console.error("Failed to update item status:", err);
      alert("Failed to update status.");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative min-w-[15rem] flex-1">
          <input
            className={`${INPUT} pl-10`}
            placeholder="Search code, description, model, barcode..."
            value={term}
            onChange={(e) => setTerm(e.target.value)}
          />
          <svg className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z" />
          </svg>
        </div>
        <select className={`${INPUT} w-auto`} value={domainFilter} onChange={(e) => setDomainFilter(e.target.value)}>
          <option value="all">All domains</option>
          {domainsInUse.map((d) => (
            <option key={d.code} value={d.code}>{d.code} — {d.labelEn}</option>
          ))}
        </select>
        <select className={`${INPUT} w-auto`} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as ItemStatus | "all")}>
          <option value="all">All statuses</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="obsolete">Obsolete</option>
        </select>
        <span className="ml-auto text-sm text-slate-500">{filtered.length} of {items.length}</span>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-600">
            <tr>
              <th className="px-4 py-4 font-semibold">Code</th>
              <th className="px-4 py-4 font-semibold">Description</th>
              <th className="px-4 py-4 font-semibold">Domain</th>
              <th className="px-4 py-4 font-semibold">UOM</th>
              <th className="px-4 py-4 font-semibold">Company</th>
              <th className="px-4 py-4 font-semibold">Status</th>
              <th className="px-4 py-4 text-right font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((it) => (
              <tr key={it.id} className="hover:bg-slate-50/50">
                <td className="px-4 py-3 font-mono text-xs text-brand-navy">{it.code}</td>
                <td className="px-4 py-3">
                  <p className="max-w-xs truncate font-medium text-slate-700">{it.description}</p>
                  {it.model ? <p className="text-xs text-slate-400">{it.model}{it.barcode ? ` · ${it.barcode}` : ""}</p> : null}
                </td>
                <td className="px-4 py-3 text-xs">{it.domain}</td>
                <td className="px-4 py-3 text-xs">{it.uom}</td>
                <td className="px-4 py-3 text-xs">{it.companyCode}</td>
                <td className="px-4 py-3">
                  <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLE[it.status]}`}>
                    {it.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-1.5">
                    {it.status !== "active" && (
                      <button onClick={() => setStatus(it, "active")} className="rounded-lg border border-green-200 bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700 transition hover:bg-green-100">Activate</button>
                    )}
                    {it.status === "active" && (
                      <button onClick={() => setStatus(it, "inactive")} className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-600 transition hover:bg-slate-100">Deactivate</button>
                    )}
                    {it.status !== "obsolete" && (
                      <button onClick={() => setStatus(it, "obsolete")} className="rounded-lg border border-red-200 bg-red-50 px-2.5 py-1 text-xs font-medium text-red-600 transition hover:bg-red-100">Obsolete</button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                  {items.length === 0
                    ? "No item codes yet. Open “New Item Code” to create the first one."
                    : "No items match your filters."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ===========================================================================
//   NEW ITEM CODE (builder)
// ===========================================================================
const DUP_LABEL: Record<DuplicateHit["reason"], string> = {
  code: "Same item code",
  model: "Same model number",
  barcode: "Same barcode",
  supplierPart: "Same supplier part number",
  description: "Same description",
};

function NewItemCode({ items, onCreated }: { items: ItemCodeRecord[]; onCreated: () => void }) {
  const [domain, setDomain] = useState("TL");
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState("");
  const [family, setFamily] = useState("");
  const [model, setModel] = useState("");

  const [description, setDescription] = useState("");
  const [descTouched, setDescTouched] = useState(false);
  const [uom, setUom] = useState("");
  const [uomTouched, setUomTouched] = useState(false);
  const [supplierPartNumber, setSupplierPartNumber] = useState("");
  const [barcode, setBarcode] = useState("");
  const [companyCode, setCompanyCode] = useState("DHM");
  const [minStockLevel, setMinStockLevel] = useState("");
  const [reorderLevel, setReorderLevel] = useState("");
  const [warrantyPeriod, setWarrantyPeriod] = useState("");
  const [taxCategory, setTaxCategory] = useState("");
  const [costingMethod, setCostingMethod] = useState("AVG");
  const [compatibleModel, setCompatibleModel] = useState("");
  const [hsCode, setHsCode] = useState("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [created, setCreated] = useState<string | null>(null);

  const dom = getDomain(domain);
  const isTools = !!dom?.tools;
  const familyTable = isTools ? TOOL_FAMILIES[category] : undefined;
  const familyIsFree = !familyTable || CATEGORIES_WITHOUT_FAMILY.includes(category);
  const isSparePart = isTools && category === "SP";

  const draft: CodeDraft = { domain, brand, category, family, model };
  const stem = buildStem(draft);
  const code = useMemo(() => nextCode(stem, items), [stem, items]);

  const autoUom = isTools ? DEFAULT_UOM[category] ?? "PCS" : "PCS";
  const effectiveUom = uomTouched ? uom : autoUom;
  const autoDesc = suggestDescription(draft, effectiveUom);
  const effectiveDesc = descTouched ? description : autoDesc;

  const dupes = useMemo(
    () => findDuplicates({ code, model, barcode, supplierPartNumber, description: effectiveDesc }, items),
    [code, model, barcode, supplierPartNumber, effectiveDesc, items],
  );
  const blocked = dupes.some((d) => d.blocking);

  const canCreate =
    !!stem && isValidCode(code) && !!effectiveDesc.trim() && !!effectiveUom && !!companyCode && !blocked && !saving;

  function resetForm() {
    setBrand(""); setCategory(""); setFamily(""); setModel("");
    setDescription(""); setDescTouched(false);
    setUom(""); setUomTouched(false);
    setSupplierPartNumber(""); setBarcode("");
    setMinStockLevel(""); setReorderLevel("");
    setWarrantyPeriod(""); setTaxCategory(""); setCompatibleModel(""); setHsCode(""); setNotes("");
  }

  async function onCreate() {
    if (!canCreate) return;
    setSaving(true);
    try {
      const ref = doc(db, "itemCodes", code); // code IS the id → unique
      const existing = await getDoc(ref);
      if (existing.exists()) {
        alert(`Item code ${code} already exists.`);
        return;
      }
      const email =
        (typeof document !== "undefined" &&
          document.querySelector("main[data-user-email]")?.getAttribute("data-user-email")) || "";
      await setDoc(ref, {
        code,
        domain,
        brand: normalizeSegment(brand),
        category: isTools ? normalizeSegment(category) : "",
        family: normalizeSegment(family),
        model: normalizeSegment(model),
        seq: parseInt(code.match(/-(\d+)$/)?.[1] ?? "1", 10),
        description: effectiveDesc.trim(),
        supplierPartNumber: supplierPartNumber.trim(),
        barcode: barcode.trim(),
        uom: effectiveUom,
        minStockLevel: minStockLevel === "" ? null : Number(minStockLevel),
        reorderLevel: reorderLevel === "" ? null : Number(reorderLevel),
        warrantyPeriod: warrantyPeriod.trim(),
        taxCategory: taxCategory.trim(),
        costingMethod,
        compatibleModel: compatibleModel.trim(),
        hsCode: hsCode.trim(),
        companyCode,
        status: "active" as ItemStatus,
        notes: notes.trim(),
        createdBy: email,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      setCreated(code);
      resetForm();
    } catch (err) {
      console.error("Failed to create item code:", err);
      alert("Failed to create item code.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_20rem]">
      {/* form */}
      <div className="space-y-5">
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-slate-500">1 · Code segments</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={LABEL}>Domain</label>
              <select className={INPUT} value={domain} onChange={(e) => { setDomain(e.target.value); setBrand(""); setCategory(""); setFamily(""); }}>
                {DOMAINS.map((d) => (
                  <option key={d.code} value={d.code} disabled={!d.active}>
                    {d.code} — {d.labelEn}{d.active ? "" : " (reserved)"}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className={LABEL}>{isTools ? "Brand" : "Sub-type"}</label>
              {isTools ? (
                <select className={INPUT} value={brand} onChange={(e) => setBrand(e.target.value)}>
                  <option value="">—</option>
                  {TOOL_BRANDS.map((b) => <option key={b.code} value={b.code}>{b.code} — {b.labelEn}</option>)}
                </select>
              ) : (
                <input className={`${INPUT} font-mono uppercase`} placeholder="e.g. CU, MV, PVC" value={brand} onChange={(e) => setBrand(e.target.value)} />
              )}
            </div>

            {isTools && (
              <div>
                <label className={LABEL}>Category</label>
                <select className={INPUT} value={category} onChange={(e) => { setCategory(e.target.value); setFamily(""); }}>
                  <option value="">—</option>
                  {TOOL_CATEGORIES.map((c) => <option key={c.code} value={c.code}>{c.code} — {c.labelEn}</option>)}
                </select>
              </div>
            )}

            <div>
              <label className={LABEL}>Product family</label>
              {familyTable && !familyIsFree ? (
                <select className={INPUT} value={family} onChange={(e) => setFamily(e.target.value)}>
                  <option value="">—</option>
                  {familyTable.map((f) => <option key={f.code} value={f.code}>{f.code} — {f.labelEn}</option>)}
                </select>
              ) : (
                <input className={`${INPUT} font-mono uppercase`} placeholder="e.g. BW, DIS, ELB" value={family} onChange={(e) => setFamily(e.target.value)} />
              )}
            </div>

            <div className="sm:col-span-2">
              <label className={LABEL}>Model / spec</label>
              <input className={`${INPUT} font-mono uppercase`} placeholder="e.g. DCD796  ·  2.5MM → 2P5MM" value={model} onChange={(e) => setModel(e.target.value)} />
              <p className="mt-1 text-xs text-slate-500">Decimal points become “P” (2.5MM → 2P5MM); no spaces or symbols.</p>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-slate-500">2 · Master data</h3>

          <div className="mb-4">
            <label className={LABEL}>Item description</label>
            <input className={INPUT} value={effectiveDesc} onChange={(e) => { setDescTouched(true); setDescription(e.target.value); }} />
            <p className="mt-1 text-xs text-slate-500">Brand + Type + Model/Size + Spec + UOM (auto-suggested; editable).</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Base UOM">
              <select className={INPUT} value={effectiveUom} onChange={(e) => { setUomTouched(true); setUom(e.target.value); }}>
                {UOMS.map((u) => <option key={u.code} value={u.code}>{u.code} — {u.labelEn}</option>)}
              </select>
            </Field>
            <Field label="Holding / selling company" hint="A field only — never part of the code.">
              <select className={INPUT} value={companyCode} onChange={(e) => setCompanyCode(e.target.value)}>
                {COMPANIES.map((c) => <option key={c.code} value={c.code}>{c.code} — {c.name}</option>)}
              </select>
            </Field>
            <Field label="Supplier part number"><input className={INPUT} value={supplierPartNumber} onChange={(e) => setSupplierPartNumber(e.target.value)} /></Field>
            <Field label="Barcode"><input className={INPUT} value={barcode} onChange={(e) => setBarcode(e.target.value)} /></Field>
            <Field label="Minimum stock level"><input type="number" className={INPUT} value={minStockLevel} onChange={(e) => setMinStockLevel(e.target.value)} /></Field>
            <Field label="Reorder level"><input type="number" className={INPUT} value={reorderLevel} onChange={(e) => setReorderLevel(e.target.value)} /></Field>
            <Field label="Warranty period"><input className={INPUT} placeholder="e.g. 12 months" value={warrantyPeriod} onChange={(e) => setWarrantyPeriod(e.target.value)} /></Field>
            <Field label="Tax category"><input className={INPUT} placeholder="e.g. VAT 10%" value={taxCategory} onChange={(e) => setTaxCategory(e.target.value)} /></Field>
            <Field label="Costing method">
              <select className={INPUT} value={costingMethod} onChange={(e) => setCostingMethod(e.target.value)}>
                {COSTING_METHODS.map((m) => <option key={m.code} value={m.code}>{m.labelEn}</option>)}
              </select>
            </Field>
            <Field label="HS code"><input className={INPUT} value={hsCode} onChange={(e) => setHsCode(e.target.value)} /></Field>
          </div>

          {isSparePart && (
            <div className="mt-4">
              <label className={LABEL}>Compatible tool model</label>
              <input className={`${INPUT} font-mono uppercase`} placeholder="e.g. DCD796" value={compatibleModel} onChange={(e) => setCompatibleModel(e.target.value)} />
              <p className="mt-1 text-xs text-slate-500">Link the spare part to its parent tool model.</p>
            </div>
          )}

          <div className="mt-4">
            <label className={LABEL}>Notes</label>
            <textarea rows={2} className={`${INPUT} resize-none`} value={notes} onChange={(e) => setNotes(e.target.value)} />
          </div>
        </section>
      </div>

      {/* preview + duplicates */}
      <aside className="space-y-4 lg:sticky lg:top-4 lg:self-start">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Generated item code</p>
          <div className="mt-2 flex items-center gap-2">
            <code className={`flex-1 break-all rounded-lg px-3 py-2 font-mono text-sm ${code ? "bg-brand-navy text-white" : "bg-slate-100 text-slate-400"}`}>
              {code || "Fill segments to preview"}
            </code>
            {code && (
              <button onClick={() => navigator.clipboard?.writeText(code)} title="Copy" className="rounded-lg border border-slate-200 px-2 py-2 text-slate-500 transition hover:bg-slate-50">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
              </button>
            )}
          </div>
          {effectiveDesc && <p className="mt-2 text-xs text-slate-500">{effectiveDesc}</p>}
        </div>

        <DuplicatePanel dupes={dupes} blocked={blocked} />

        <button onClick={onCreate} disabled={!canCreate} className="w-full rounded-lg bg-brand-red px-6 py-3 text-sm font-bold text-white shadow-lg transition hover:bg-brand-red/90 disabled:cursor-not-allowed disabled:opacity-50">
          {saving ? "Creating..." : "Create item code"}
        </button>
        {blocked && <p className="text-center text-xs font-medium text-red-600">Resolve the duplicate item code before creating.</p>}

        {created && (
          <div className="flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 p-3 text-sm text-green-800">
            <svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            <span>Created <code className="font-mono">{created}</code>. It’s now in the register.</span>
            <button onClick={onCreated} className="ml-auto text-xs font-semibold text-green-700 underline">View</button>
          </div>
        )}
      </aside>
    </div>
  );
}

function DuplicatePanel({ dupes, blocked }: { dupes: DuplicateHit[]; blocked: boolean }) {
  if (dupes.length === 0) {
    return (
      <div className="flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 p-3 text-sm text-green-800">
        <svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
        No duplicates found.
      </div>
    );
  }
  return (
    <div className={`rounded-xl border p-3 ${blocked ? "border-red-200 bg-red-50" : "border-amber-200 bg-amber-50"}`}>
      <p className={`text-sm font-semibold ${blocked ? "text-red-700" : "text-amber-800"}`}>
        {blocked ? "Duplicate item code — blocked" : "Possible duplicate — please review"}
      </p>
      <ul className="mt-2 space-y-2">
        {dupes.map((d) => (
          <li key={d.item.id + d.reason} className="rounded-lg bg-white/70 p-2 text-xs">
            <p className="font-semibold text-slate-700">{DUP_LABEL[d.reason]}</p>
            <p className="font-mono text-slate-600">{d.item.code}</p>
            <p className="truncate text-slate-500">{d.item.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className={LABEL}>{label}</label>
      {children}
      {hint ? <p className="mt-1 text-xs text-slate-500">{hint}</p> : null}
    </div>
  );
}

// ===========================================================================
//   CODE REFERENCE
// ===========================================================================
function CodeReference() {
  const [openCat, setOpenCat] = useState(Object.keys(TOOL_FAMILIES)[0]);
  const catLabel = (c: string) => TOOL_CATEGORIES.find((x) => x.code === c)?.labelEn ?? c;

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm text-slate-600">
        <p className="font-semibold text-brand-navy">Code structure</p>
        <p className="mt-1">Tools division: <code className="font-mono">TL-BR-CAT-FAM-MODEL-SEQ</code></p>
        <p className="mt-0.5">Group format: <code className="font-mono">DOM-SUB-FAM-MODEL-SEQ</code></p>
        <p className="mt-2 text-xs text-slate-500">
          Codes are UPPERCASE with no dots, spaces or symbols; a size decimal is written with “P”.
          One item = one code across every company; obsolete items are marked inactive, never deleted.
        </p>
      </div>

      <RefBlock title="Product domains (first segment)" rows={DOMAINS.map((d) => ({ code: d.code, labelEn: `${d.labelEn}${d.active ? "" : "  ·  reserved"}` }))} />
      <RefBlock title="Company codes" note="Recorded as a master-data field — never part of the item code." rows={COMPANIES.map((c) => ({ code: c.code, labelEn: `${c.name} — ${c.role}` }))} />
      <RefBlock title="Tools brands" rows={TOOL_BRANDS} />
      <RefBlock title="Tools categories" rows={TOOL_CATEGORIES} />

      <div>
        <h3 className="mb-2 text-sm font-bold uppercase tracking-wide text-slate-500">Tools product families</h3>
        <div className="mb-3 flex flex-wrap gap-1.5">
          {Object.keys(TOOL_FAMILIES).map((c) => (
            <button key={c} onClick={() => setOpenCat(c)} className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${openCat === c ? "bg-brand-navy text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}>
              {c} — {catLabel(c)}
            </button>
          ))}
        </div>
        <CodeGrid rows={TOOL_FAMILIES[openCat]} />
      </div>

      <RefBlock title="Units of measure" rows={UOMS} />
    </div>
  );
}

function RefBlock({ title, rows, note }: { title: string; rows: CodeRow[]; note?: string }) {
  return (
    <div>
      <h3 className="mb-2 text-sm font-bold uppercase tracking-wide text-slate-500">{title}</h3>
      {note ? <p className="mb-2 text-xs text-slate-400">{note}</p> : null}
      <CodeGrid rows={rows} />
    </div>
  );
}

function CodeGrid({ rows }: { rows: CodeRow[] }) {
  return (
    <div className="grid gap-1.5 sm:grid-cols-2 lg:grid-cols-3">
      {rows.map((r) => (
        <div key={r.code + r.labelEn} className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm">
          <code className="rounded bg-brand-navy px-1.5 py-0.5 font-mono text-xs text-white">{r.code}</code>
          <span className="min-w-0 truncate text-slate-600">{r.labelEn}</span>
        </div>
      ))}
    </div>
  );
}
