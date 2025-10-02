import type { ReactNode } from "react";

interface Props {
  title: string;
  description: string;
  children?: ReactNode;
}

export default function SuccessEmailAction({ title, description, children }: Props) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center">
      <h2
        className="text-[32px] font-bold text-white leading-tight mb-6 text-center"
        role="heading"
        aria-level={2}
      >
        {title}
      </h2>
      <p className="text-[17px] font-normal mx-auto max-w-[400px] text-white mb-4 text-center ">{description}</p>
      {children}
    </div>
  );
}
