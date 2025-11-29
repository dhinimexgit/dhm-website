"use client";

import { useState } from "react";
import { db } from "@/lib/firebase";
import { doc, setDoc, Timestamp } from "firebase/firestore";

// Helper to strip HTML (browser-safe)
function stripHtml(html: string): string {
  if (!html) return "";
  if (typeof document === "undefined") {
    // Fallback for SSR - basic regex strip
    return html.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").trim();
  }
  const tmp = document.createElement("DIV");
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || "";
}

// Extract text from HTML, preserving structure
function extractTextFromHtml(html: string): string {
  return stripHtml(html).trim();
}

// Parse career data from HTML content
function parseCareerFromHtml(html: string, slug: string, title: string) {
  if (typeof document === "undefined") {
    // Fallback for SSR
    return {
      description: extractTextFromHtml(html),
      keyResponsibilities: [] as string[],
      requirements: [] as string[],
      whatWeOffer: [] as string[],
      howToApply: "",
    };
  }

  const tmp = document.createElement("DIV");
  tmp.innerHTML = html;

  // Try to extract structured data
  const description = extractTextFromHtml(html);
  
  // Look for lists (responsibilities, requirements, etc.)
  const lists = tmp.querySelectorAll("ul, ol");
  const responsibilities: string[] = [];
  const requirements: string[] = [];
  const offers: string[] = [];

  lists.forEach((list, index) => {
    const items = Array.from(list.querySelectorAll("li")).map(li => stripHtml(li.innerHTML).trim()).filter(Boolean);
    // Heuristic: first list might be responsibilities, second requirements, third offers
    if (index === 0 && items.length > 0) {
      responsibilities.push(...items);
    } else if (index === 1 && items.length > 0) {
      requirements.push(...items);
    } else if (index === 2 && items.length > 0) {
      offers.push(...items);
    }
  });

  return {
    description,
    keyResponsibilities: responsibilities,
    requirements,
    whatWeOffer: offers,
    howToApply: "",
  };
}

export function SeedCareersFromWPButton() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  const handleSeed = async () => {
    if (!confirm("This will fetch job openings from https://www.dhinimex.com/careers/ and populate Firebase. Existing careers with the same slug will be updated. Continue?")) {
      return;
    }

    setLoading(true);
    setStatus("Fetching careers from WordPress...");

    try {
      // Known career slugs from the website
      const careerSlugs = [
        "technical-manager",
        "technical-supervisor",
        "admin-hr-team-leader",
        "legal-officer",
        "design-engineer",
        "sales-and-marketing-executive",
        "sales-executive",
      ];

      // Career data from the website (based on the search results)
      const careersData = [
        {
          slug: "technical-manager",
          title: "Technical Manager",
          location: "Phnom Penh",
          position: "Full-time",
          deadline: "September 20, 2026",
          summary: "Lead technical operations and ensure quality standards across engineering projects.",
        },
        {
          slug: "technical-supervisor",
          title: "Technical Supervisor",
          location: "Phnom Penh",
          position: "Full-time",
          deadline: "September 20, 2026",
          summary: "Supervise technical teams and oversee project execution.",
        },
        {
          slug: "admin-hr-team-leader",
          title: "Admin & HR Team Leader",
          location: "Phnom Penh",
          position: "Full-time",
          deadline: "September 20, 2026",
          summary: "Drive recruitment, engagement, and learning programs for a 500+ person workforce.",
        },
        {
          slug: "legal-officer",
          title: "Legal Officer",
          location: "Phnom Penh",
          position: "Full-time",
          deadline: "September 20, 2026",
          summary: "Support compliance, contracts, and regulatory submissions for utilities concessions.",
        },
        {
          slug: "design-engineer",
          title: "Design Engineer (Electrical)",
          location: "Phnom Penh",
          position: "Full-time",
          deadline: "September 20, 2026",
          summary: "Develop LV/MV drawings, calculations, and material submittals that meet Dhinimex standards.",
        },
        {
          slug: "sales-and-marketing-executive",
          title: "Sales & Marketing Executive",
          location: "Phnom Penh",
          position: "Full-time",
          deadline: "September 20, 2026",
          summary: "Engage public and private sector clients with tailored equipment and services proposals.",
        },
        {
          slug: "sales-executive",
          title: "Sales Executive (Projection)",
          location: "Phnom Penh",
          position: "Full-time",
          deadline: "September 30, 2025",
          summary: "Forecast demand and support market entry initiatives for new products.",
        },
      ];

      let count = 0;
      let skipped = 0;

      for (const careerInfo of careersData) {
        try {
          setStatus(`Processing: ${careerInfo.title}...`);

          // Try to fetch full details from WordPress API (might be a page or custom post type)
          let fullContent = "";
          let parsedData = {
            description: "",
            keyResponsibilities: [] as string[],
            requirements: [] as string[],
            whatWeOffer: [] as string[],
            howToApply: "",
          };

          // Try fetching as a page first
          try {
            const pageResponse = await fetch(`https://www.dhinimex.com/wp-json/wp/v2/pages?slug=${careerInfo.slug}`);
            if (pageResponse.ok) {
              const pages = await pageResponse.json();
              if (pages.length > 0) {
                fullContent = pages[0].content?.rendered || "";
                parsedData = parseCareerFromHtml(fullContent, careerInfo.slug, careerInfo.title);
              }
            }
          } catch (e) {
            console.log(`Could not fetch page for ${careerInfo.slug}`);
          }

          // If no page found, try as a post
          if (!fullContent) {
            try {
              const postResponse = await fetch(`https://www.dhinimex.com/wp-json/wp/v2/posts?slug=${careerInfo.slug}`);
              if (postResponse.ok) {
                const posts = await postResponse.json();
                if (posts.length > 0) {
                  fullContent = posts[0].content?.rendered || "";
                  parsedData = parseCareerFromHtml(fullContent, careerInfo.slug, careerInfo.title);
                }
              }
            } catch (e) {
              console.log(`Could not fetch post for ${careerInfo.slug}`);
            }
          }

          const careerData = {
            slug: careerInfo.slug,
            title: careerInfo.title,
            location: careerInfo.location,
            position: careerInfo.position,
            deadline: careerInfo.deadline,
            url: `https://www.dhinimex.com/careers/${careerInfo.slug}/`,
            summary: careerInfo.summary,
            description: parsedData.description || careerInfo.summary,
            keyResponsibilities: parsedData.keyResponsibilities.length > 0 ? parsedData.keyResponsibilities : [],
            requirements: parsedData.requirements.length > 0 ? parsedData.requirements : [],
            whatWeOffer: parsedData.whatWeOffer.length > 0 ? parsedData.whatWeOffer : [],
            howToApply: parsedData.howToApply || `Submit your CV to **recruitment@dhinimex.com** with the subject line: _${careerInfo.title} Application_.`,
            updatedAt: Timestamp.now(),
            updatedBy: "wordpress-import",
          };

          // Use setDoc with merge to update or create
          await setDoc(doc(db, "careers", careerInfo.slug), {
            ...careerData,
            createdAt: Timestamp.now(),
            createdBy: "wordpress-import",
          }, { merge: true });

          console.log(`Seeded: ${careerData.title}`);
          count++;
        } catch (error) {
          console.error(`Error processing career ${careerInfo.slug}:`, error);
          skipped++;
        }
      }

      setStatus(`Success! Processed ${count} careers${skipped > 0 ? `, skipped ${skipped}` : ""}.`);
      setTimeout(() => setStatus(""), 5000);
    } catch (error) {
      console.error("Seeding error:", error);
      setStatus(`Error: ${error instanceof Error ? error.message : "Failed to fetch careers"}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-4">
      {status && <span className="text-sm text-slate-600 animate-pulse">{status}</span>}
      <button
        onClick={handleSeed}
        disabled={loading}
        className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
      >
        {loading ? "Fetching & Seeding..." : "Seed from WordPress"}
      </button>
    </div>
  );
}

