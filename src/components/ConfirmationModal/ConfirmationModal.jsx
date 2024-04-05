import { useEffect, useRef } from 'react';

export default function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  message,
  cancelButtonText = '취소',
  confirmButtonText = '확인',
  showCancelButton = true,
  showConfirmButton = true,
  buttonStyles = {
    cancel: 'rounded bg-gray200 px-4 py-2 hover:bg-gray300',
    confirm: 'rounded bg-primary px-4 py-2 text-white hover:bg-indigo-700',
  },
  modalStyles = 'rounded-lg bg-white p-6 shadow-lg',
}) {
  const cancelButtonRef = useRef(null);
  const confirmButtonRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen || e.key !== 'Tab') return;

      const focusableModalElements = [
        cancelButtonRef.current,
        confirmButtonRef.current,
      ].filter((el) => el !== null);

      const firstElement = focusableModalElements[0];
      const lastElement =
        focusableModalElements[focusableModalElements.length - 1];

      if (e.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        // Tab
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, showCancelButton, showConfirmButton]); // 의존성 배열에 버튼 표시 여부를 추가

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className={modalStyles}>
        <h2 className="mb-4 text-lg font-bold">확인</h2>
        <p>{message}</p>
        <div className="mt-6 flex justify-end gap-3">
          {showCancelButton && (
            <button
              ref={cancelButtonRef}
              className={buttonStyles.cancel}
              onClick={onClose}
            >
              {cancelButtonText}
            </button>
          )}
          {showConfirmButton && (
            <button
              ref={confirmButtonRef}
              className={buttonStyles.confirm}
              onClick={onConfirm}
            >
              {confirmButtonText}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
