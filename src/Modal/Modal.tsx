import { ReactNode } from "react";

interface ModalProps {
  title?: string;
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  showClose?: boolean;
}

export default function Modal({
  title,
  isOpen,
  onClose,
  children,
  showClose = true,
}: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-start z-[1000]">
      <div
        className="bg-white py-3 px-4 rounded max-w-[90%] min-w-[300px] relative shadow-lg mt-[5vh] max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative flex items-center">
          <div className="font-medium">{title}</div>
          {showClose && (
            <button
              className="absolute top-0 right-2 text-2xl leading-none cursor-pointer"
              onClick={onClose}
            >
              &times;
            </button>
          )}
        </div>

        <div className="flex-1 overflow-auto">{children}</div>
      </div>
    </div>
  );
}
