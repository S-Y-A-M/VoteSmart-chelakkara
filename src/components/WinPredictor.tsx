import { motion } from "framer-motion";
import type { Candidate } from "../types";

interface WinPredictorProps {
  candidates: Candidate[];
}

function computeScores(candidates: Candidate[]) {
  const maxWins = Math.max(
    ...candidates.map((c) => c.past_performance.filter((p) => p.result === "Won").length),
    1
  );
  const maxPerception = Math.max(...candidates.map((c) => c.public_perception_score), 1);

  return candidates.map((c) => {
    const wins = c.past_performance.filter((p) => p.result === "Won").length;
    const winScore = (wins / maxWins) * 45;
    const perceptionScore = (c.public_perception_score / maxPerception) * 55;
    const total = winScore + perceptionScore;
    return { candidate: c, total };
  });
}

export function WinPredictor({ candidates }: WinPredictorProps) {
  const scored = computeScores(candidates);
  const sorted = [...scored].sort((a, b) => b.total - a.total);
  const top = sorted[0];
  const sum = scored.reduce((s, x) => s + x.total, 0) || 1;

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white/80 p-4 shadow-sm backdrop-blur-sm sm:p-5">
      <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="font-display text-lg font-semibold text-slate-900">
          Win predictor
        </h3>
        <p className="max-w-xs text-xs text-slate-500">
          Mock score: past wins (45%) + public perception (55%). Not a forecast.
        </p>
      </div>

      {top && (
        <motion.div
          className="mb-4 rounded-xl border border-teal-100 bg-gradient-to-br from-teal-50 to-white p-4"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <p className="text-xs font-medium uppercase tracking-wide text-teal-800">
            Predicted lean
          </p>
          <p className="mt-1 font-display text-xl font-bold text-slate-900">
            {top.candidate.name}
          </p>
          <p className="text-sm text-slate-600">{top.candidate.party}</p>
          <p className="mt-2 text-2xl font-bold tabular-nums text-teal-700">
            {Math.round((top.total / sum) * 100)}%
            <span className="ml-1 text-sm font-normal text-slate-500">relative probability</span>
          </p>
        </motion.div>
      )}

      <ul className="space-y-2">
        {sorted.map((row, i) => (
          <li key={row.candidate.id} className="flex items-center gap-3">
            <span className="w-6 text-right text-xs font-medium text-slate-400">{i + 1}</span>
            <div className="min-w-0 flex-1">
              <div className="flex justify-between gap-2 text-sm">
                <span className="truncate font-medium text-slate-800">{row.candidate.name}</span>
                <span className="shrink-0 tabular-nums text-slate-600">
                  {Math.round((row.total / sum) * 100)}%
                </span>
              </div>
              <div className="mt-1 h-2 overflow-hidden rounded-full bg-slate-100">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-teal-500 to-teal-400"
                  initial={{ width: 0 }}
                  animate={{ width: `${(row.total / sum) * 100}%` }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                />
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
