import { useEffect, useState } from "react";
import { motion } from "framer-motion";

function pad(n: number) {
  return n.toString().padStart(2, "0");
}

interface CountdownTimerProps {
  targetDate: string;
}

export function CountdownTimer({ targetDate }: CountdownTimerProps) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const target = new Date(targetDate).getTime();
  const diff = Math.max(0, target - now);
  const days = Math.floor(diff / (24 * 60 * 60 * 1000));
  const hours = Math.floor((diff % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
  const minutes = Math.floor((diff % (60 * 60 * 1000)) / (60 * 1000));
  const seconds = Math.floor((diff % (60 * 1000)) / 1000);

  const units = [
    { label: "Days", value: days },
    { label: "Hrs", value: hours },
    { label: "Min", value: minutes },
    { label: "Sec", value: seconds },
  ];

  return (
    <motion.div
      layout
      className="flex flex-wrap items-center gap-2 sm:gap-3 rounded-full border border-teal-200/80 bg-white/90 px-3 py-1.5 shadow-sm backdrop-blur-sm"
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      <span className="hidden text-xs font-semibold uppercase tracking-wide text-teal-800 sm:inline">
        Election in
      </span>
      <div className="flex items-center gap-1.5 sm:gap-2">
        {units.map((u) => (
          <div
            key={u.label}
            className="flex min-w-[2.5rem] flex-col items-center rounded-lg bg-teal-50 px-1.5 py-0.5 sm:min-w-[3rem] sm:px-2"
          >
            <span className="font-mono text-sm font-bold tabular-nums text-teal-900 sm:text-base">
              {u.label === "Days" ? u.value : pad(u.value)}
            </span>
            <span className="text-[10px] font-medium uppercase text-teal-700 sm:text-[11px]">
              {u.label}
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
