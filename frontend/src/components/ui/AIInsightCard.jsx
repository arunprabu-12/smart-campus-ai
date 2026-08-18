import { Card } from './Card'
import { Badge } from './Badge'
import { Button } from './Button'

export function AIInsightCard({ title = "Smart Academia AI", text, items = [], onViewDetails, onGenerateReport, onApprove, onReject, isRecommendation = false }) {
  return (
    <Card p="p-6" className="bg-gradient-to-br from-purple-50/50 via-white to-blue-50/40 dark:from-purple-950/20 dark:via-slate-800 dark:to-blue-950/20 border-purple-200/80 dark:border-purple-800/60 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🤖</span>
          <div>
            <h4 className="font-bold text-slate-900 dark:text-white text-base leading-snug">{title}</h4>
            <span className="text-[11px] font-semibold text-purple-600 dark:text-purple-400">
              AI-generated insight — verify before taking action
            </span>
          </div>
        </div>
        <Badge variant="info">Human-in-the-Loop</Badge>
      </div>

      {text && (
        <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
          "{text}"
        </p>
      )}

      {items.length > 0 && (
        <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300 list-disc list-inside">
          {items.map((item, idx) => (
            <li key={idx} className="leading-snug">{item}</li>
          ))}
        </ul>
      )}

      <div className="flex items-center gap-3 pt-2 flex-wrap">
        {onViewDetails && (
          <Button variant="outline" size="sm" onClick={onViewDetails}>
            View Details
          </Button>
        )}
        {onGenerateReport && (
          <Button variant="primary" size="sm" onClick={onGenerateReport}>
            Generate Report
          </Button>
        )}
        {isRecommendation && (
          <>
            {onApprove && (
              <Button variant="primary" size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white" onClick={onApprove}>
                ✓ Approve
              </Button>
            )}
            {onReject && (
              <Button variant="danger" size="sm" onClick={onReject}>
                ✕ Reject
              </Button>
            )}
          </>
        )}
      </div>
    </Card>
  )
}
