import { Modal } from './Modal'
import { Button } from './Button'

export function ConfirmDialog({ isOpen, onClose, onConfirm, title = "Confirm Action", message = "Are you sure you want to proceed? This action cannot be undone.", confirmLabel = "Delete", isDanger = true }) {
  if (!isOpen) return null

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="space-y-4">
        <p className="text-sm text-slate-600 dark:text-slate-300">{message}</p>
        <div className="flex items-center justify-end gap-3 pt-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant={isDanger ? "danger" : "primary"}
            onClick={() => {
              onConfirm()
              onClose()
            }}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
