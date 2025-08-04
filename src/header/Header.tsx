import { JSX } from "react";

interface HeaderProps {
  title: string;
  renderLeft: () => JSX.Element | null;
  renderRight: () => JSX.Element | null;
}

export default function Header({
  title,
  renderLeft,
  renderRight,
}: HeaderProps) {
  return (
    <div className="relative w-full p-4 shadow flex justify-between items-center">
      <div>{renderLeft && renderLeft()}</div>
      <div className="absolute left-1/2 -translate-x-1/2 text-2xl font-bold">
        {title}
      </div>
      <div>{renderRight && renderRight()}</div>
    </div>
  );
}
