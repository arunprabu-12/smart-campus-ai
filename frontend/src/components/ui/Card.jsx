export function Card({ children, className = '', p = 'p-6', ...props }) {
  return (
    <div className={`bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm ${p} ${className}`} {...props}>
      {children}
    </div>
  );
}
