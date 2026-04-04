import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useState } from "react";
import type { ElectionData } from "../types";
import { CandidateNode } from "./CandidateNode";
import { CountdownTimer } from "./CountdownTimer";
import { RecentElectionsChart, ConstituencyDevelopments, WinningChancePieChart } from "./Timeline";
import { ElectionHistoryRoadmap } from "./ElectionHistoryRoadmap";

const STEP_KEYS = [
  "start",
  "overview",
  "candidates",
  "performance",
  "work",
  "overall",
] as const;

const STEP_LABELS = [
  "Start",
  "Overview",
  "Candidates",
  "Past performance",
  "Work & achievements",
  "Overall",
];


interface RoadmapContainerProps {
  data: ElectionData;
}

export function RoadmapContainer({ data }: RoadmapContainerProps) {
  const [step, setStep] = useState(0);
  const [selectedCandidateId, setSelectedCandidateId] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(true);

  const maxStep = STEP_KEYS.length - 1;
  // const decisionStep = STEP_KEYS.indexOf("overall");
  const goNext = useCallback(() => setStep((s) => Math.min(s + 1, maxStep)), [maxStep]);
  const goPrev = useCallback(() => setStep((s) => Math.max(s - 1, 0)), []);
  const goTo = useCallback((i: number) => setStep(Math.max(0, Math.min(i, maxStep))), [maxStep]);

  const contentVariants = {
    initial: { opacity: 0, x: 24 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -16 },
  };

  return (
    <div className="min-h-screen pb-24 sm:pb-8">
      {/* Persistent top bar */}
      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <div className="min-w-0">
            <p className="truncate font-display text-sm font-semibold text-slate-900 sm:text-base">
              Chelakkara journey
            </p>
            <p className="text-xs text-slate-500">Thrissur · Kerala</p>
          </div>
          <CountdownTimer targetDate={data.election_date} />
        </div>
      </header>

      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-6 lg:flex-row lg:gap-10 lg:px-6">
        {/* Roadmap rail */}
        <nav
          className="lg:w-56 lg:shrink-0"
          aria-label="Journey steps">
          <div className="lg:sticky lg:top-24">
            <p className="mb-3 hidden text-xs font-semibold uppercase tracking-wide text-slate-500 lg:block">
               Your path
            </p>
            <div className="flex gap-1 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible lg:pb-0">
              {STEP_LABELS.map((label, i) => {
                const done = i < step;
                const active = i === step;
                return (
                  <button
                    key={STEP_KEYS[i]}
                    type="button"
                    onClick={() => goTo(i)}
                    className="group flex shrink-0 items-center gap-3 rounded-xl px-2 py-2 text-left transition-colors lg:w-full lg:px-3"
                  >
                    <span className="relative flex h-8 w-8 shrink-0 items-center justify-center">
                      {i < STEP_LABELS.length - 1 && (
                        <span
                          className={`absolute left-1/2 top-8 hidden h-6 w-px -translate-x-1/2 lg:block ${
                            done ? "bg-teal-400" : "bg-slate-200"
                          }`}
                        />
                      )}
                      <span
                        className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-colors ${
                          active
                            ? "bg-teal-600 text-white shadow-md"
                            : done
                              ? "bg-teal-100 text-teal-800"
                              : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {i + 1}
                      </span>
                    </span>
                    <span
                      className={`hidden text-sm font-medium sm:inline lg:inline ${
                        active ? "text-slate-900" : "text-slate-600"
                      }`}
                    >
                      {label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </nav>

        {/* Main stage */}
        <main className="min-w-0 flex-1">
          <AnimatePresence mode="wait">
            {step === 0 && (
              <motion.section
                key="start"
                role="region"
                aria-labelledby="entry-title"
                variants={contentVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.3 }}
                className="flex min-h-[60vh] flex-col items-center justify-center text-center"
              >
                <motion.div
                  initial={{ scale: 0.96, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.4 }}
                  className="max-w-lg"
                >
                  <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-500 to-teal-700 text-2xl font-display font-bold text-white shadow-lg">
                    C
                  </div>
                  <h1
                    id="entry-title"
                    className="font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl"
                  >
                    Chelakkara Constituency Election Dashboard
                  </h1>
                  <p className="mt-3 text-lg text-slate-600">Understand before you vote</p>
                  <motion.button
                    type="button"
                    onClick={goNext}
                    className="mt-10 rounded-full bg-teal-600 px-10 py-3.5 text-base font-semibold text-white shadow-lg shadow-teal-500/25 transition hover:bg-teal-700"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Start exploring
                  </motion.button>
                </motion.div>
              </motion.section>
            )}

            {step === 1 && (
              <motion.section
                key="overview"
                variants={contentVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.4 }}
                className="rounded-3xl border border-slate-200/80 bg-white/90 p-6 shadow-sm sm:p-8"
              >
                <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-teal-700">
                  Constituency overview
                </div>
                <h2 className="font-display text-2xl font-bold text-slate-900">
                  {data.constituency.name}
                </h2>
                <p className="mt-1 text-slate-600">District: {data.constituency.district}</p>
                <div className="mt-6 space-y-6">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                      <p className="text-xs font-semibold uppercase tracking-wide text-teal-700">Assembly No</p>
                      <p className="mt-1 text-lg font-bold text-slate-900">{data.constituency["ASSEMBLY NO"]}</p>
                    </div>
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                      <p className="text-xs font-semibold uppercase tracking-wide text-teal-700">Polling Booths</p>
                      <p className="mt-1 text-lg font-bold text-slate-900">{data.constituency["Poliing Booths"]}</p>
                    </div>
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                      <p className="text-xs font-semibold uppercase tracking-wide text-teal-700">Voters</p>
                      <p className="mt-1 text-lg font-bold text-slate-900">{data.constituency.Voters}</p>
                    </div>
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                      <p className="text-xs font-semibold uppercase tracking-wide text-teal-700">Geographical Area</p>
                      <p className="mt-1 text-lg font-bold text-slate-900">{data.constituency["geographical area"]}</p>
                    </div>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-sm font-semibold text-slate-800">Local Bodies</p>
                    <ul className="mt-2 space-y-1 text-sm text-slate-600">
                      {data.constituency.local_bodies.map((body) => (
                        <li key={body.name} className="flex justify-between">
                          <span>{body.name}</span>
                          <span className="text-slate-500">({body.type})</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-sm font-semibold text-slate-800">Polling Station List</p>
                    <a
                      href="https://voterlist.co.in/chelakkara/polling-station-list/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-teal-600 hover:text-teal-800 underline"
                    >
                      Check here for polling station details
                    </a>
                  </div>
                </div>
                <StepNav onBack={goPrev} onNext={goNext} showBack={false} />
              </motion.section>
            )}

            {step === 2 && (
              <motion.section
                key="candidates"
                variants={contentVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.3 }}
                className="overflow-visible rounded-3xl border border-slate-200/80 bg-white/90 p-6 shadow-sm sm:p-8"
              >
                <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-teal-700">
                   Candidates on the journey
                </div>
                <h2 className="font-display text-2xl font-bold text-slate-900">Meet the candidates</h2>
                <p className="mt-2 max-w-2xl text-sm text-slate-600">
                 
                </p>

                <div
                  className={`relative mt-10 ${
                    selectedCandidateId ? "min-h-[20rem] sm:min-h-[18rem]" : ""
                  }`}
                >
                  <div className="pointer-events-none absolute left-0 right-0 top-1/2 hidden h-1 -translate-y-1/2 bg-gradient-to-r from-slate-200 via-teal-200 to-slate-200 sm:block" />
                  <div className="relative flex flex-col items-stretch justify-center gap-10 sm:flex-row sm:items-start sm:gap-6 md:gap-10">
                    {data.candidates.map((c, i) => (
                      <CandidateNode
                        key={c.id}
                        candidate={c}
                        index={i}
                        isSelected={selectedCandidateId === c.id}
                        isRunning={isRunning}
                        onSelect={() => {
                          if (selectedCandidateId === c.id) {
                            setSelectedCandidateId(null);
                            setIsRunning(true);
                          } else {
                            setSelectedCandidateId(c.id);
                            setIsRunning(false);
                          }
                        }}
                      />
                    ))}
                  </div>
                </div>

                <StepNav onBack={goPrev} onNext={goNext} />
              </motion.section>
            )}

            {step === 3 && (
              <motion.section
                key="performance"
                variants={contentVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.3 }}
                className="rounded-3xl border border-slate-200/80 bg-white/90 p-6 shadow-sm sm:p-8"
              >
                {/* <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-teal-700">
                   Recent election performance
                </div>
         */}
            
                <div className="mt-8">
                  <RecentElectionsChart recentElections={data.recent_elections} />
                </div>

                <div className="mt-10 rounded-3xl border border-teal-500/40 bg-teal-50/15 p-4">
                  <h3 className="mb-2 text-lg font-semibold text-teal-600">Historic election timeline (1967-2021)</h3>
                  <ElectionHistoryRoadmap data={data} compact />
                </div>

                <StepNav onBack={goPrev} onNext={goNext} />
              </motion.section>
            )}

            {step === 4 && (
              <motion.section
                key="work"
                variants={contentVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.3 }}
                className="rounded-3xl border border-slate-200/80 bg-white/90 p-6 shadow-sm sm:p-8"
              >
                <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-teal-700">
                   Work & achievements
                </div>
                <p className="mt-2 text-sm text-slate-600">
                  Key developments and achievements in Chelakkara over the past decade.
                </p>
                {data.constituency_overview && (
                  <div className="mt-8 space-y-8">
                    <div className="rounded-2xl border border-slate-100 bg-gradient-to-b from-white to-slate-50/50 p-4 sm:p-6">
                      <h3 className="mb-2 text-lg font-semibold text-teal-600">Overview ({data.constituency_overview.period})</h3>
                      <p className="text-sm text-slate-700">{data.constituency_overview.overview}</p>
                    </div>
                    <div>
                      <h3 className="mb-4 text-lg font-semibold text-teal-600">Key Developments</h3>
                      <ConstituencyDevelopments developments={data.constituency_overview.key_developments} />
                    </div>
                    <div>
                      <h3 className="mb-4 text-lg font-semibold text-teal-600">Key Local Issues</h3>
                      <ul className="space-y-2">
                        {data.constituency.issues.map((item, index) => (
                          <li key={index} className="flex gap-2">
                            <span className="text-teal-600">→</span>
                            <span className="text-sm text-slate-700">{item.issue}</span>
                            <span className="text-sm text-slate-500">({item.source})</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
                <StepNav onBack={goPrev} onNext={goNext} />
              </motion.section>
            )}

            {step === 5 && (
              <motion.section
                key="overall"
                variants={contentVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.3 }}
                className="rounded-3xl border border-slate-200/80 bg-white/90 p-6 shadow-sm sm:p-8"
              >
              


              
                <div className="mt-10 rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
                  <h3 className="mb-4 text-lg font-semibold text-teal-600">Party win share from historical elections</h3>
                  <WinningChancePieChart electionHistory={data.electionHistory} />
                </div>
                <motion.div
                  className="mt-10 rounded-2xl bg-gradient-to-r from-teal-600 to-teal-700 p-6 text-center text-white shadow-lg"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <p className="font-display text-lg font-semibold">
                    Vote smart. Decide with data.
                  </p>
                  <p className="mt-2 text-sm text-teal-100">
                    This dashboard uses datas from the wikipedia page of the Chelakkara constituency, and other public sources. We encourage you to explore the data yourself and make your own informed decision.
                  </p>
                </motion.div>
                <StepNav
                  onBack={goPrev}
                  onNext={() => goTo(0)}
                  nextLabel="Start again"
                />
              </motion.section>
            )}
          </AnimatePresence>
        </main>
      </div>

      {/* Mobile bottom step controls */}
      <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-slate-200 bg-white/95 p-3 backdrop-blur-md sm:hidden">
        <div className="mx-auto flex max-w-lg items-center justify-between gap-2">
          <button
            type="button"
            onClick={goPrev}
            disabled={step === 0}
            className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 disabled:opacity-40"
          >
            Back
          </button>
          <span className="text-xs text-slate-500">
            {step + 1} / {STEP_LABELS.length}
          </span>
          <button
            type="button"
            onClick={step >= maxStep ? () => goTo(0) : goNext}
            className="rounded-full bg-teal-600 px-4 py-2 text-sm font-semibold text-white"
          >
            {step >= maxStep ? "Start again" : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
}

function StepNav({
  onBack,
  onNext,
  showBack = true,
  showNext = true,
  nextLabel = "Next",
}: {
  onBack: () => void;
  onNext: () => void;
  showBack?: boolean;
  showNext?: boolean;
  nextLabel?: string;
}) {
  return (
    <div className="mt-8 hidden flex-wrap items-center justify-between gap-3 sm:flex">
      {showBack ? (
        <motion.button
          type="button"
          onClick={onBack}
          className="rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Back
        </motion.button>
      ) : (
        <span />
      )}
      {showNext && (
        <motion.button
          type="button"
          onClick={onNext}
          className="rounded-full bg-teal-600 px-6 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-teal-700"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {nextLabel}
        </motion.button>
      )}
    </div>
  );
}
