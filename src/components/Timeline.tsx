import { motion } from "framer-motion";
import type { Candidate, PastPerformance, RecentElection, WorkItem, ConstituencyOverview, ElectionHistoryItem } from "../types";

interface PerformanceTimelineProps {
  candidate: Candidate;
}

interface RecentElectionsChartProps {
  recentElections?: RecentElection[];
}

export function PerformanceTimeline({ candidate }: PerformanceTimelineProps) {
  const items = [...candidate.past_performance].sort((a, b) => a.year - b.year);

  return (
    <div className="relative py-2">
      <div className="mb-3 flex items-center justify-between gap-2">
        <h4 className="font-display text-base font-semibold text-slate-900">
          {candidate.name.split(" ")[0]} — past results
        </h4>
        <span className="text-xs text-slate-500">Last {items.length} elections</span>
      </div>
      <div className="-mx-2 overflow-x-auto px-2 pb-2 sm:mx-0 sm:overflow-visible sm:px-0">
        <div className="flex min-w-min flex-row gap-4 sm:flex-wrap sm:gap-4">
          {items.map((row, i) => (
            <TimelineRow key={row.year} item={row} isLast={i === items.length - 1} />
          ))}
        </div>
      </div>
    </div>
  );
}

interface TimelineRowProps {
  item: PastPerformance;
  isLast: boolean;
}

function TimelineRow({ item, isLast }: TimelineRowProps) {
  const won = item.result === "Won";

  return (
    <motion.div
      className="flex min-w-[6.5rem] shrink-0 flex-col items-center sm:min-w-[7rem] sm:flex-1"
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      <div className="flex w-full flex-col items-center">
        <span className="font-mono text-sm font-bold text-slate-800">{item.year}</span>
        <div className="my-2 flex w-full items-center gap-2">
          <div className="h-px flex-1 bg-slate-200" />
          <div
            className={`h-3 w-3 shrink-0 rounded-full ${
              won ? "bg-emerald-500 ring-2 ring-emerald-200" : "bg-slate-300 ring-2 ring-slate-100"
            }`}
          />
          <div className="h-px flex-1 bg-slate-200" />
        </div>
        <span className="text-xs tabular-nums text-slate-600">
          {item.votes.toLocaleString("en-IN")} votes
        </span>
        <span
          className={`mt-1 rounded-full px-2 py-0.5 text-xs font-semibold ${
            won ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-600"
          }`}
        >
          {item.result}
        </span>
      </div>
      {!isLast && <div className="hidden h-px w-8 sm:block" />}
    </motion.div>
  );
}

interface WorkTimelineProps {
  items: WorkItem[];
  title: string;
}

const categoryStyle: Record<string, string> = {
  Infrastructure: "border-amber-200 bg-amber-50 text-amber-900",
  Welfare: "border-emerald-200 bg-emerald-50 text-emerald-900",
  Development: "border-violet-200 bg-violet-50 text-violet-900",
  "Infrastructure & Roads": "border-amber-200 bg-amber-50 text-amber-900",
  Education: "border-blue-200 bg-blue-50 text-blue-900",
  Healthcare: "border-green-200 bg-green-50 text-green-900",
  "SC/ST Development": "border-purple-200 bg-purple-50 text-purple-900",
};

export function WorkTimeline({ items, title }: WorkTimelineProps) {
  const sorted = [...items].sort((a, b) => b.year - a.year);

  return (
    <div>
      <h4 className="mb-3 font-display text-base font-semibold text-slate-900">{title}</h4>
      <div className="relative border-l-2 border-slate-200 pl-6">
        {sorted.map((w, i) => (
          <motion.div
            key={`${w.year}-${w.title}`}
            className="relative pb-8 last:pb-0"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
          >
            <div className="absolute -left-[calc(0.5rem+0.125rem)] top-1 h-3 w-3 rounded-full border-2 border-white bg-teal-500 shadow-sm" />
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-sm font-bold text-slate-800">{w.year}</span>
              <span
                className={`rounded-full border px-2 py-0.5 text-xs font-medium ${categoryStyle[w.category]}`}
              >
                {w.category}
              </span>
            </div>
            <p className="mt-1 font-medium text-slate-900">{w.title}</p>
            <p className="mt-0.5 text-sm text-slate-600">{w.detail}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export function RecentElectionsChart({ recentElections = [] }: RecentElectionsChartProps) {
  const elections = [...recentElections].sort((a, b) => b.year - a.year);

  if (elections.length === 0) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 text-center text-sm text-slate-600">
        Recent election results are not available.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-teal-700">Recent election performance</p>
            <h3 className="mt-2 text-2xl font-semibold text-slate-900">Recent vote share trend</h3>
            <p className="mt-2 max-w-2xl text-sm text-slate-600">
              Visualizing the most recent elections from the constituency data with vote share bars, margin strength, and year markers.
            </p>
          </div>
          <div className="rounded-3xl bg-slate-900/5 px-4 py-3 text-sm font-semibold text-slate-900">
            Latest: {elections[0].year} • {elections[0].winner.party}
          </div>
        </div>

        <div className="mt-6 overflow-x-auto">
          <div className="flex min-w-max items-center gap-6 rounded-3xl border border-slate-200 bg-slate-950/5 p-4">
            {elections.map((item) => (
              <div key={item.year} className="flex min-w-[7rem] flex-col items-center gap-2 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-teal-600 text-sm font-bold text-white shadow-sm">
                  {item.year}
                </div>
                <span className="text-xs uppercase tracking-[0.2em] text-slate-500">{item.type}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 space-y-4">
          {elections.map((item) => (
            <div key={item.year} className="rounded-3xl border border-slate-200 bg-slate-50 p-4 shadow-sm">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-900">{item.year} • {item.type === "general" ? "General" : "By-election"}</p>
                  <p className="text-sm text-slate-600">
                    {item.winner.name} ({item.winner.party}) beat {item.runner_up.name} ({item.runner_up.party})
                  </p>
                </div>
                <div className="rounded-2xl bg-teal-600/10 px-3 py-2 text-sm font-semibold text-teal-700">
                  {item.margin_votes.toLocaleString("en-IN")} votes • {item.margin_percentage.toFixed(2)}%
                </div>
              </div>

              <div className="mt-4">
                <div className="mb-2 flex items-center justify-between text-xs uppercase tracking-[0.2em] text-slate-500">
                  <span className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-red-600" /> Winner
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-blue-600" /> Runner-up
                  </span>
                </div>
                <div className="relative h-6 overflow-hidden rounded-full bg-slate-200 shadow-inner">
                  <div className="absolute inset-y-0 left-0 bg-red-600" style={{ width: `${item.winner.vote_percentage}%` }} />
                  <div className="absolute inset-y-0 right-0 bg-blue-600" style={{ width: `${item.runner_up.vote_percentage}%` }} />
                  <div className="relative flex h-full items-center justify-between px-3 text-[11px] font-semibold text-white">
                    <span>{item.winner.vote_percentage.toFixed(1)}%</span>
                    <span>{item.runner_up.vote_percentage.toFixed(1)}%</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/** Vertical layout for all candidates' past performance (step 3) */
export function AllCandidatesPerformanceTimeline({
  candidates,
}: {
  candidates: Candidate[];
}) {
  return (
    <div className="space-y-10">
      {candidates.map((c) => (
        <div key={c.id} className="rounded-2xl border border-slate-100 bg-white/60 p-4 sm:p-5">
          <PerformanceTimeline candidate={c} />
        </div>
      ))}
    </div>
  );
}

interface WinningChancePieChartProps {
  electionHistory?: ElectionHistoryItem[];
}

const partyWinColors: Record<string, string> = {
  "Indian National Congress": "#2563eb",
  "INC": "#2563eb",
  "Communist Party of India": "#dc2626",
  "CPI(M)": "#dc2626",
  "BJP": "#f59e0b",
};

export function WinningChancePieChart({ electionHistory = [] }: WinningChancePieChartProps) {
  if (electionHistory.length === 0) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-6 text-center text-sm text-slate-500">
        No historical win data available for this constituency.
      </div>
    );
  }

  const winsByParty = electionHistory.reduce<Record<string, number>>((acc, item) => {
    acc[item.party] = (acc[item.party] ?? 0) + 1;
    return acc;
  }, {});

  const totalWins = electionHistory.length;
  const slices = Object.entries(winsByParty)
    .map(([party, count]) => ({
      party,
      count,
      percentage: (count / totalWins) * 100,
      color: partyWinColors[party] ?? "#64748b",
    }))
    .sort((a, b) => b.percentage - a.percentage);

  let currentDegree = 0;
  const gradient = slices
    .map((slice) => {
      const from = currentDegree;
      currentDegree += slice.percentage * 3.6;
      return `${slice.color} ${from}deg ${currentDegree}deg`;
    })
    .join(", ");

  return (
    <div className="space-y-5">
      <div
        className="mx-auto flex h-56 w-56 items-center justify-center rounded-full border border-slate-200 bg-slate-50 shadow-sm"
        style={{ background: `conic-gradient(${gradient})` }}
      >
        <div className="flex h-32 w-32 flex-col items-center justify-center rounded-full bg-white text-center shadow-sm">
          <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Wins</p>
          <p className="text-3xl font-semibold text-slate-900">{totalWins}</p>
          <p className="text-xs text-slate-500">historical elections</p>
        </div>
      </div>
      <div className="space-y-3">
        {slices.map((slice) => (
          <div key={slice.party} className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-3 text-sm">
            <div className="flex items-center gap-3">
              <span
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: slice.color }}
              />
              <span className="font-medium text-slate-700">{slice.party}</span>
            </div>
            <span className="font-semibold text-slate-900">
              {slice.count} win{slice.count === 1 ? "" : "s"} • {slice.percentage.toFixed(0)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

interface ConstituencyDevelopmentsProps {
  developments: ConstituencyOverview['key_developments'];
}

export function ConstituencyDevelopments({ developments }: ConstituencyDevelopmentsProps) {
  return (
    <div className="space-y-6">
      {developments.map((dev, i) => (
        <motion.div
          key={`${dev.category}-${dev.title}`}
          className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.05 }}
        >
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span
              className={`rounded-full border px-2 py-0.5 text-xs font-medium ${categoryStyle[dev.category as keyof typeof categoryStyle] || 'border-slate-200 bg-slate-50 text-slate-900'}`}
            >
              {dev.category}
            </span>
          </div>
          <h4 className="font-medium text-slate-900">{dev.title}</h4>
          <p className="mt-1 text-sm text-slate-600">{dev.description}</p>
        </motion.div>
      ))}
    </div>
  );
}
