import type { Product } from "@/data/site-content";

type Props = {
  product: Product;
  language?: 'en' | 'kh';
};

export function SpecTable({ product, language = 'en' }: Props) {
  const entries = Object.entries(product.specs);
  return (
    <table className="w-full table-auto border-collapse overflow-hidden rounded-lg bg-white text-sm shadow-sm">
      <tbody>
        {entries.map(([label, value], index) => (
          <tr
            key={label}
            className="border-b border-slate-100 last:border-none"
          >
            <th className="w-1/3 px-6 py-4 text-left font-semibold text-brand-navy bg-slate-50/50">
              {label}
            </th>
            <td className="px-6 py-4 text-slate-700">{value}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

