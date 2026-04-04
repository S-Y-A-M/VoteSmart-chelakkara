import { useMemo } from "react";
import type { ElectionData } from "../types";

const partyColors: Record<string, string> = {
  "Indian National Congress": "#2563eb",
  "Communist Party of India": "#ef4444",
  "Left Democratic Front (LDF)": "#ef4444",
  "Bharatiya Janata Party (BJP)": "#fb923c",
  "Social Democratic Party Of India(SDPI)": "#22c55e",
  "Aam Aadmi Party(AAP)": "#2563eb",
  "Independent": "#6b7280",
};

interface Props {
  data: ElectionData;
  compact?: boolean;
}

export function ElectionHistoryRoadmap({ data, compact = false }: Props) {
  const history = useMemo(() => {
    if (data.electionHistory && data.electionHistory.length > 0) {
      return data.electionHistory
        .filter((h) => h.year >= 1967 && h.year <= 2021)
        .sort((a, b) => a.year - b.year);
    }

    const yearMap = new Map<number, { year: number; winner: string; party: string }>();

    for (const candidate of data.candidates ?? []) {
      for (const performance of candidate.past_performance ?? []) {
        if (performance.result === "Won") {
          const existing = yearMap.get(performance.year);
          if (!existing) {
            yearMap.set(performance.year, {
              year: performance.year,
              winner: candidate.name,
              party: candidate.party,
            });
          }
        }
      }
    }

    return Array.from(yearMap.values()).sort((a, b) => a.year - b.year);
  }, [data.candidates, data.electionHistory]);

  const electionYears = useMemo(() => {
    const start = 1967;
    const end = 2021;
    const years: number[] = [];
    for (let year = start; year <= end; year += 5) {
      years.push(year);
    }
    // include common early 90s/direct election years not every 5 for alignment
    const extras = [1970, 1971, 1977, 1980, 1984, 1989, 1991, 1996, 1998, 1999, 2004, 2009, 2014, 2019];
    extras.forEach((y) => {
      if (y >= start && y <= end && !years.includes(y)) years.push(y);
    });
    return Array.from(new Set(years)).sort((a, b) => a - b);
  }, []);

  const filteredHistory = useMemo(() => history.filter((item) => item.year >= 1967 && item.year <= 2021), [history]);

  if (history.length === 0) {
    if (compact) {
      return (
        <div className="rounded-2xl border border-rose-200 bg-rose-950/30 p-4 text-sm text-white">
          Election history data (1967-2021) not available.
        </div>
      );
    }

    return (
      <main className="min-h-screen bg-slate-950 text-slate-100 p-6 sm:p-10">
        <section className="mx-auto max-w-6xl rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-2xl backdrop-blur-md">
          <header className="mb-6 text-center">
            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">History of Election (1967 - 2021)</h1>
            <p className="mt-2 text-sm text-slate-300 sm:text-base">No election history data found in JSON.</p>
          </header>
        </section>
      </main>
    );
  }

  const partyStats = useMemo(() => {
    const counts = new Map<string, number>();
    for (const item of filteredHistory) {
      const party = item.party;
      counts.set(party, (counts.get(party) ?? 0) + 1);
    }
    const total = filteredHistory.length || 1;
    const segments: { party: string; count: number; percent: number; color: string }[] = [];

    let start = 0;
    for (const [party, count] of counts) {
      const percent = (count / total) * 100;
      segments.push({ party, count, percent, color: partyColors[party] ?? "#9ca3af" });
      start += percent;
    }

    const gradient = segments
      .map((seg, idx) => {
        const prev = segments.slice(0, idx).reduce((acc, p) => acc + p.percent, 0);
        const from = prev;
        const to = prev + seg.percent;
        return `${seg.color} ${from}% ${to}%`;
      })
      .join(", ");

    return { segments, gradient };
  }, [history]);

  if (compact) {
    return (
      <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
        <h3 className="text-lg font-semibold text-white">History of Election (1967 - 2021)</h3>
        <p className="text-xs text-slate-400">Hover each year to see winner and party.</p>

        <div className="relative mt-4">
          <div className="absolute bottom-1/2 h-px w-full bg-slate-700 opacity-70 hidden md:block" />
          <div className="flex flex-wrap gap-4 justify-center">
            {filteredHistory.map((item) => {
              const hasData = true;
              let bgClass = "bg-gray-500";
              if (item.party === "Indian National Congress") bgClass = "bg-blue-600";
              else if (item.party === "Communist Party of India") bgClass = "bg-red-500";
              else bgClass = "bg-gray-500";
              return (
                <div key={item.year} className="relative flex flex-col items-center text-center">
                  <div className="group relative">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-full text-xs font-semibold text-white shadow-inner transition-transform duration-300 cursor-pointer flex-shrink-0 ${bgClass} ${hasData ? "hover:scale-110" : "opacity-50"}`}
                    >
                      {item.year.toString().slice(-2)}
                    </div>
                    <div className="pointer-events-none absolute top-12 left-1/2 hidden w-40 -translate-x-1/2 rounded-lg border border-slate-600 bg-slate-800 p-2 text-xs text-slate-200 opacity-0 transition-all duration-300 group-hover:block group-hover:opacity-100 z-50">
                      <p className="font-semibold text-white">Candidate: {item.winner}</p>
                      <p>Party: {item.party}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-6 sm:p-10">
      <section className="mx-auto max-w-6xl rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-2xl backdrop-blur-md">
        <header className="mb-6 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">History of Election (1967 - 2021)</h1>
          <p className="mt-2 text-sm text-slate-300 sm:text-base">
            Election roadmap from 1967 to 2021 in modern style, with interactive hover details and party pie chart.
          </p>
        </header>

        <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
            <h2 className="text-xl font-semibold text-white">Year-based winner roadmap</h2>
            <p className="text-xs text-slate-400">Hover a node to see the winner & party</p>
          </div>

          <div className="relative mt-8 flex items-center justify-center">
            <div className="absolute bottom-1/2 h-px w-full bg-slate-700 opacity-70" />
            <div className="flex items-center justify-between gap-6 overflow-x-auto py-2 px-2 sm:px-4">
              {electionYears.map((year) => {
                const item = filteredHistory.find((h) => h.year === year);
                const hasData = Boolean(item);
                let bgClass = "bg-gray-500";
                if (item) {
                  if (item.party === "Indian National Congress") bgClass = "bg-blue-600";
                  else if (item.party === "Communist Party of India") bgClass = "bg-red-500";
                  else bgClass = "bg-gray-500";
                }
                return (
                  <div key={year} className="relative flex flex-col items-center text-center">
                    <div className="group relative">
                      <div
                        className={`flex h-14 w-14 items-center justify-center rounded-full text-sm font-semibold text-white shadow-inner transition-transform duration-300 hover:scale-110 flex-shrink-0 ${bgClass}`}
                      >
                        {year}
                      </div>
                      <div className="pointer-events-none absolute top-16 left-1/2 hidden w-52 -translate-x-1/2 rounded-xl border border-slate-600 bg-slate-800 p-2 text-xs text-slate-200 opacity-0 transition-all duration-300 group-hover:block group-hover:opacity-100 z-50">
                        {item ? (
                          <>
                            <p className="font-semibold text-white">Candidate: {item.winner}</p>
                            <p>Party: {item.party}</p>
                          </>
                        ) : (
                          <p className="text-slate-300">No data available</p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
          <article className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5">
            <h3 className="mb-3 text-lg font-semibold text-white">Party win distribution (pie chart)</h3>
            <div className="relative mx-auto h-56 w-56 rounded-full border border-slate-700 bg-slate-900" style={{ background: `conic-gradient(${partyStats.gradient})` }} />
            <div className="mt-4 space-y-2">
              {partyStats.segments.map((seg) => (
                <div key={seg.party} className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span style={{ backgroundColor: seg.color }} className="h-3 w-3 rounded-full" />
                    <span className="text-sm text-slate-200">{seg.party}</span>
                  </div>
                  <span className="text-xs text-slate-400">{seg.count} win(s) • {seg.percent.toFixed(1)}%</span>
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5">
            <h3 className="mb-3 text-lg font-semibold text-white">Election road map details</h3>
            <ul className="space-y-3 text-sm text-slate-300">
              {history.map((item) => (
                <li key={item.year} className="rounded-xl border border-slate-700 bg-slate-900/60 p-3">
                  <p className="text-slate-200">{item.year} → {item.winner}</p>
                  <p className="text-xs text-slate-400">Party: {item.party}</p>
                </li>
              ))}
            </ul>
          </article>
        </div>
      </section>
    </main>
  );
}
