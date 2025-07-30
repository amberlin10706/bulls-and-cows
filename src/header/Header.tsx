import { JSX } from "react";

interface HeaderProps {
  title: string;
  renderRight: () => JSX.Element | null;
}

export default function Header({ title, renderRight }: HeaderProps) {
  return (
    <div className="relative w-full p-4 shadow flex justify-end items-center">
      <div className="absolute left-1/2 -translate-x-1/2 text-2xl font-bold">
        {title}
      </div>
      <div>{renderRight && renderRight()}</div>
    </div>
  );
}
