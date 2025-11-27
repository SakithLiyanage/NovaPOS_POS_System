import { AlertTriangle } from 'lucide-react';
import Modal from './Modal';
import Button from './Button';

const ConfirmDialog = ({
  open,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed?',
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'destructive',
  loading = false,
}) => {
  return (
    <Modal open={open} onClose={onClose} size="sm">
      <div className="text-center">
        <div className={`w-12 h-12 mx-auto mb-4 rounded-full flex items-center justify-center ${
          variant === 'destructive' ? 'bg-red-100' : 'bg-amber-100'
        }`}>
          <AlertTriangle className={`w-6 h-6 ${
            variant === 'destructive' ? 'text-red-600' : 'text-amber-600'
          }`} />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 mb-6">{message}</p>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={onClose} className="flex-1" disabled={loading}>
            {cancelLabel}
          </Button>
          <Button
            variant={variant}
            onClick={onConfirm}
            className="flex-1"
            loading={loading}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmDialog;
