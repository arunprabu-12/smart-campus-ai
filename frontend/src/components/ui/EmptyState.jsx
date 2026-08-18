export function EmptyState({ icon = '📋', title = 'No items found', description = 'There are no items to display at this time.' }) {
  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-12 text-center shadow-sm">
      <div className="text-4xl mb-3">{icon}</div>
      <h3 className="text-base font-semibold text-slate-900 dark:text-white">{title}</h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">{description}</p>
    </div>
  );
}
