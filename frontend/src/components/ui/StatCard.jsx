export function StatCard({ label, value, icon, trend, accentColor = 'text-blue-600 dark:text-blue-400' }) {
  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 shadow-sm flex items-center justify-between">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">{label}</p>
        <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{value}</p>
        {trend && <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{trend}</p>}
      </div>
      {icon && (
        <div className={`w-12 h-12 rounded-xl bg-slate-50 dark:bg-slate-700/50 flex items-center justify-center text-2xl shrink-0 ${accentColor}`}>
          {icon}
        </div>
      )}
    </div>
  );
}
