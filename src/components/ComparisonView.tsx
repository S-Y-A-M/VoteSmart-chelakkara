import { motion } from "framer-motion";
import type { Candidate } from "../types";

interface ComparisonViewProps {
  candidates: Candidate[];
}

function parseAssets(assets: string): number {
  const m = assets.match(/[\d.]+/);
  if (!m) return 0;
  const n = parseFloat(m[0]);
  if (assets.includes("lakh")) return n / 100;
  return n;
}

export function ComparisonView({ candidates }: ComparisonViewProps) {
  const maxAssets = Math.max(...candidates.map((c) => parseAssets(c.assets)), 0.01);

  const rows = [
    {
      label: "Education",
      key: "education" as const,
      render: (c: Candidate) => c.education,
    },
    {
      label: "Criminal cases",
      key: "criminal_cases" as const,
      render: (c: Candidate) => String(c.criminal_cases),
    },
    {
      label: "Assets (₹ cr, approx.)",
      key: "assets" as const,
      render: (c: Candidate) => parseAssets(c.assets).toFixed(2),
    },
    {
      label: "Performance (recent wins)",
      key: "performance" as const,
      render: (c: Candidate) =>
        String(c.past_performance.filter((p) => p.result === "Won").length),
    },
  ];

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[520px] border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-slate-200">
            <th className="sticky left-0 bg-white/95 py-3 pr-4 font-display text-xs font-semibold uppercase tracking-wide text-slate-500">
              Metric
            </th>
            {candidates.map((c) => (
              <th key={c.id} className="px-2 py-3 font-display text-sm font-semibold text-slate-900">
                <div className="max-w-[10rem] leading-tight">{c.name}</div>
                <div className="mt-0.5 text-xs font-normal text-teal-700">{c.party}</div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <motion.tr
              key={row.key}
              className="border-b border-slate-100"
              initial={{ opacity: 0, y: 6 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: ri * 0.05 }}
            >
              <td className="sticky left-0 bg-white/95 py-3 pr-4 font-medium text-slate-600">
                {row.label}
              </td>
              {candidates.map((c) => (
                <td key={c.id} className="px-2 py-3 text-slate-800">
                  {row.key === "assets" ? (
                    <div className="flex items-center gap-2">
                      <span className="tabular-nums">{row.render(c)}</span>
                      <div className="h-1.5 flex-1 max-w-[4rem] overflow-hidden rounded-full bg-slate-100">
                        <motion.div
                          className="h-full rounded-full bg-teal-500"
                          initial={{ width: 0 }}
                          whileInView={{
                            width: `${(parseAssets(c.assets) / maxAssets) * 100}%`,
                          }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.5 }}
                        />
                      </div>
                    </div>
                  ) : (
                    <span className="leading-snug">{row.render(c)}</span>
                  )}
                </td>
              ))}
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
