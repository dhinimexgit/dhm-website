import type { Faq } from "@/data/site-content";

type Props = {
  faqs: Faq[];
};

export function FAQAccordion({ faqs }: Props) {
  return (
    <div className="space-y-3">
      {faqs.map((faq) => (
        <details
          key={faq.question}
          className="group overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm"
        >
          <summary className="flex cursor-pointer list-none items-center justify-between px-6 py-5 text-left font-semibold text-brand-navy transition-colors duration-300 hover:bg-slate-50">
            <span className="text-lg">{faq.question}</span>
            <svg 
              className="ml-4 h-5 w-5 flex-shrink-0 text-brand-navy transition-transform duration-900 ease-in-out group-open:rotate-180" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </summary>
          <div className="border-t border-slate-200 bg-white px-6 py-5 overflow-hidden">
            <p className="text-base leading-relaxed text-slate-700">{faq.answer}</p>
          </div>
        </details>
      ))}
    </div>
  );
}

