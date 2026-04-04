import { AnimatePresence, motion } from "framer-motion";
import type { Candidate } from "../types";

interface CandidateNodeProps {
  candidate: Candidate;
  index: number;
  isSelected: boolean;
  isRunning: boolean;
  onSelect: () => void;
}

const partyColors: Record<string, string> = {
  UDF: "from-blue-500 to-indigo-600",
  LDF: "from-red-600 to-red-800",
  BJP: "from-orange-500 to-amber-600",
  AAP: "from-blue-700 to-white-500",
  SDPI: "from-green-600 to-red-500"
};

function partyKey(party: string): string {
  if (party.includes("UDF")) return "UDF";
  if (party.includes("LDF")) return "LDF";
  if (party.includes("BJP")) return "BJP";
  if (party.includes("AAP")) return "AAP";
  if (party.includes("SDPI")) return "SDPI";
  return "UDF";
}

export function CandidateNode({
  candidate,
  index,
  isSelected,
  isRunning,
  onSelect,
}: CandidateNodeProps) {
  const gradient = partyColors[partyKey(candidate.party)] ?? partyColors.UDF
  

  const vehicleMotion = isRunning
    ? {
        x: [0, 60, 0, 8, 0],
        y: [0, 0, 0, 2, 0],
        rotate: [0, -9, 0, 9, 0],
      }
    : { x: 0, y: 0, rotate: 0 };

  return (
    <div className="relative flex flex-col items-center">
      <motion.button
        type="button"
        onClick={onSelect}
        animate={vehicleMotion}
        transition={{
          repeat: isRunning ? Infinity : 0,
          duration: 3,
          ease: "linear",
          delay: index * 0.2,
        }}
        className={`relative z-10 flex h-14 w-14 items-center justify-center rounded-full shadow-md ring-2 ring-offset-2 ring-offset-transparent transition-shadow sm:h-16 sm:w-16 ${
          isSelected
            ? "ring-teal-500 shadow-lg ring-offset-2"
            : "ring-0 hover:ring-slate-300/80"
        }`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.98 }}
        layout
      >
        <span
          className={`flex h-full w-full items-center justify-center rounded-full bg-gradient-to-br text-sm font-bold text-white sm:text-base ${gradient}`}
        >
          {index + 1}
        </span>
      </motion.button>
      <p className="mt-2 max-w-[7rem] text-center text-xs font-medium leading-tight text-slate-700 sm:max-w-[9rem] sm:text-sm">
        {candidate.name.split(" ")[0]}
        <span className="hidden sm:inline"> {candidate.name.split(" ").slice(1).join(" ")}</span>
      </p>

      <AnimatePresence>
        {isSelected && (
          <motion.div
            initial={{ opacity: 0, y: 8, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: 4, height: 0 }}
            transition={{ duration: 0.25 }}
            className="absolute left-1/2 top-full z-20 mt-16 w-[min(100vw-2rem,22rem)] -translate-x-1/2 overflow-hidden sm:mt-20 sm:w-[26rem]"
          >
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xl">
              <div className="border-b border-slate-100 pb-3">
                <p className="font-display text-lg font-semibold text-slate-900">
                  {candidate.name}
                </p>
                <p className="text-sm text-teal-700">{candidate.party}</p>
              </div>
              <dl className="mt-3 space-y-2 text-sm">
                <div>
                  <dt className="text-xs font-medium uppercase text-slate-500">Education</dt>
                  <dd className="text-slate-800">{candidate.education}</dd>
                </div>

                <div>
                  <dt className="text-xs font-medium uppercase text-slate-500">Address</dt>
                  <dd className="text-slate-800">{candidate.address}</dd>
                </div>

                 <div>
                  <dt className="text-xs font-medium uppercase text-slate-500">Age</dt>
                  <dd className="text-slate-800">{candidate.age}</dd>
                </div>
                <div>
               
              <dd>
               <img
                src={candidate.image}
                alt={candidate.name}
                className="w-24 h-24 rounded-lg object-cover border"
                onError={(e) => (e.currentTarget.src = "/default-avatar.png")}
               />
             </dd>
            </div>
                {/* <div>
                  <dt className="text-xs font-mdium uppercase text-slate-500">Criminal cases</dt>
                  <dd className="tabular-nums text-slate-800">{candidate.criminal_cases}</dd>
                </div> */}
                {/* <div>
                  <dt className="text-xs font-medium uppercase text-slate-500">Assets</dt>
                  <dd className="text-slate-800">{candidate.assets}</dd>
                </div> */}
              </dl>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
