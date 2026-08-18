export function PageHeader({ title, description, action, children }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">{title}</h1>
        {description && <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{description}</p>}
      </div>
      {(action || children) && (
        <div className="flex items-center gap-3 shrink-0 flex-wrap sm:flex-nowrap">
          {action}
          {children}
        </div>
      )}
    </div>
  );
}
