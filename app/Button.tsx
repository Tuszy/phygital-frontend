"use client";

import { PropsWithChildren } from "react";

const Button = function ({
  children,
  onClick,
  className,
  disabled,
}: {
  active?: boolean;
  onClick: (value: any) => void;
  className?: string;
  value?: any;
  disabled?: boolean;
} & PropsWithChildren) {
  return (
    <button
      aria-disabled={disabled}
      className={
        "drop-shadow-[0_0_12px_#00ffff] flex cursor-pointer items-center justify-center overflow-hidden rounded-lg shadow-black ring-4 ring-offset-2 mx-12 p-4 " +
        ((className ?? "") +
          " bg-[#0ff6] ring-slate-400 text-black hover:bg-[#0ff8] active:opacity-[0.9]")
      }
      onClick={onClick}
    >
      <div className="select-none uppercase break-word z-10 flex flex-grow flex-col flex-wrap items-center justify-center gap-2 text-center text-3xl font-black tracking-widest [-webkit-text-stroke:_1px_#0ff] [-webkit-text-fill-color:_white] font-mono">
        {children}
      </div>
    </button>
  );
};

export default Button;
