"use client";

// UI
import { PropsWithChildren, useContext, useState } from "react";

// Context
import EthersContext from "@/context/EthersContext/EthersContext";

const Button = function ({
  children,
  onClick,
  className,
  disabled,
}: {
  active?: boolean;
  onClick: undefined | (() => Promise<void>);
  className?: string;
  value?: any;
  disabled?: boolean;
} & PropsWithChildren) {
  const { loading } = useContext(EthersContext);
  const [busy, setBusy] = useState<boolean>(false);
  const isClickable = !(disabled || busy || loading);
  const click = async () => {
    if (onClick === undefined || !isClickable) return;
    setBusy(true);
    try {
      await onClick();
    } catch (e) {
      console.error(e);
    }
    setBusy(false);
  };
  return (
    <button
      disabled={!isClickable}
      aria-disabled={!isClickable}
      className={
        "drop-shadow-[0_0_12px_#00ffff] flex cursor-default items-center justify-center overflow-hidden rounded-lg shadow-black ring-4 ring-offset-2 mx-12 p-4 bg-[#0ff4] ring-slate-400 " +
        (className ?? "") +
        (isClickable
          ? "bg-[#0ff6] hover:bg-[#0ff8] active:opacity-[0.9] cursor-pointer"
          : "")
      }
      onClick={click}
    >
      <div className="relative select-none uppercase break-word z-10 flex flex-grow flex-row flex-wrap items-center justify-center gap-2 text-center text-3xl font-black tracking-widest [-webkit-text-stroke:_1px_#0ff] [-webkit-text-fill-color:_white] font-mono">
        <div style={{ opacity: busy ? 0 : 1 }}>{children}</div>
        {busy && (
          <svg
            id="svg-spinner"
            xmlns="http://www.w3.org/2000/svg"
            width="48"
            height="48"
            viewBox="0 0 48 48"
            className="w-[48px] h-[48px] absolute m-auto"
          >
            <circle cx="24" cy="4" r="4" fill="#ddffff" />
            <circle cx="12.19" cy="7.86" r="3.7" fill="#ccffff" />
            <circle cx="5.02" cy="17.68" r="3.4" fill="#bbffff" />
            <circle cx="5.02" cy="30.32" r="3.1" fill="#aaffff" />
            <circle cx="12.19" cy="40.14" r="2.8" fill="#99ffff" />
            <circle cx="24" cy="44" r="2.5" fill="#88ffff" />
            <circle cx="35.81" cy="40.14" r="2.2" fill="#77ffff" />
            <circle cx="42.98" cy="30.32" r="1.9" fill="#66ffff" />
            <circle cx="42.98" cy="17.68" r="1.6" fill="#55ffff" />
            <circle cx="35.81" cy="7.86" r="1.3" fill="#44ffff" />
          </svg>
        )}
      </div>
    </button>
  );
};

export default Button;
