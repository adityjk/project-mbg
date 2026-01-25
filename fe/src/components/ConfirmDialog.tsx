import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MdWarning, MdClose, MdCheck, MdDelete } from 'react-icons/md';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info';
  loading?: boolean;
}

export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title = 'Konfirmasi',
  message = 'Apakah kamu yakin ingin melanjutkan?',
  confirmText = 'Ya, Lanjutkan',
  cancelText = 'Batal',
  type = 'danger',
  loading = false,
}: ConfirmDialogProps) {
  
  const getTypeStyles = () => {
    switch (type) {
      case 'danger':
        return {
          iconBg: 'bg-error/20',
          iconColor: 'text-error',
          confirmBtn: 'bg-error hover:bg-error/80 text-base-100',
          icon: MdDelete,
        };
      case 'warning':
        return {
          iconBg: 'bg-warning/20',
          iconColor: 'text-warning',
          confirmBtn: 'bg-warning hover:bg-warning/80 text-neutral',
          icon: MdWarning,
        };
      default:
        return {
          iconBg: 'bg-info/20',
          iconColor: 'text-info',
          confirmBtn: 'bg-info hover:bg-info/80 text-base-100',
          icon: MdCheck,
        };
    }
  };

  const styles = getTypeStyles();
  const IconComponent = styles.icon;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-neutral/60 backdrop-blur-sm z-[200]"
            onClick={onClose}
          />
          
          {/* Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-[201] flex items-center justify-center p-4"
          >
            <div className="bg-base-100 rounded-[2rem] border-2 border-neutral shadow-neo max-w-md w-full overflow-hidden">
              {/* Header */}
              <div className="p-6 pb-4 flex items-start gap-4">
                <div className={`p-3 rounded-xl ${styles.iconBg}`}>
                  <IconComponent size={28} className={styles.iconColor} />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-black text-base-content">{title}</h3>
                  <p className="text-muted-themed mt-1 text-sm leading-relaxed">{message}</p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-base-200 transition-colors text-muted-themed hover:text-base-content"
                >
                  <MdClose size={20} />
                </button>
              </div>
              
              {/* Actions */}
              <div className="p-6 pt-2 flex gap-3">
                <button
                  onClick={onClose}
                  disabled={loading}
                  className="flex-1 btn h-12 bg-base-200 hover:bg-base-300 text-base-content border-2 border-neutral rounded-xl font-bold transition-all"
                >
                  {cancelText}
                </button>
                <button
                  onClick={onConfirm}
                  disabled={loading}
                  className={`flex-1 btn h-12 border-2 border-neutral rounded-xl font-bold shadow-neo-sm hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all flex items-center justify-center gap-2 ${styles.confirmBtn}`}
                >
                  {loading ? (
                    <span className="loading loading-spinner loading-sm"></span>
                  ) : (
                    <>
                      <IconComponent size={18} />
                      {confirmText}
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// Custom hook for easier usage
export function useConfirmDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [config, setConfig] = useState<{
    title?: string;
    message?: string;
    confirmText?: string;
    cancelText?: string;
    type?: 'danger' | 'warning' | 'info';
    onConfirm: () => void | Promise<void>;
  }>({
    onConfirm: () => {},
  });
  const [loading, setLoading] = useState(false);

  const showConfirm = useCallback((options: typeof config) => {
    setConfig(options);
    setIsOpen(true);
  }, []);

  const handleConfirm = useCallback(async () => {
    setLoading(true);
    try {
      await config.onConfirm();
      setIsOpen(false);
    } catch (error) {
      console.error('Confirm action failed:', error);
    } finally {
      setLoading(false);
    }
  }, [config]);

  const handleClose = useCallback(() => {
    if (!loading) {
      setIsOpen(false);
    }
  }, [loading]);

  const DialogComponent = (
    <ConfirmDialog
      isOpen={isOpen}
      onClose={handleClose}
      onConfirm={handleConfirm}
      title={config.title}
      message={config.message}
      confirmText={config.confirmText}
      cancelText={config.cancelText}
      type={config.type}
      loading={loading}
    />
  );

  return { showConfirm, DialogComponent };
}
