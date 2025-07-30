import { ReactNode } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  showClose?: boolean;
}

export default function Modal({
  isOpen,
  onClose,
  children,
  showClose = true,
}: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-start z-[1000]">
      <div
        className="bg-white pt-10 pb-6 px-4 rounded max-w-[90%] min-w-[300px] relative shadow-lg mt-[10vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {showClose && (
          <button
            className="absolute top-1 right-2 text-2xl leading-none cursor-pointer"
            onClick={onClose}
          >
            &times;
          </button>
        )}
        {children}
      </div>
    </div>
  );
}
