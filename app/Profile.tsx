"use client";
// Next
import Image from "next/image";

// Context
import { useContext } from "react";
import EthersContext from "@/context/EthersContext/EthersContext";

export default function Profile({
  onShowQRCode,
}: {
  onShowQRCode: () => void;
}) {
  const { universalProfile } = useContext(EthersContext);

  return (
    <div className="text-2xl w-full flex flex-col items-center gap-4 font-black tracking-widest [-webkit-text-stroke:_1px_#0ff] [-webkit-text-fill-color:_white] font-mono drop-shadow-[0_0_12px_#00ffff] select-none">
      <div
        title={universalProfile?.address}
        className="cursor-pointer"
        onClick={onShowQRCode}
      >
        {universalProfile?.nameWithAddress}
      </div>
      {Boolean(universalProfile?.data?.profileImage?.length > 0) && (
        <Image
          onClick={onShowQRCode}
          draggable={false}
          src={universalProfile?.data?.profileImage[0].url}
          width={100}
          height={100}
          alt="Profile image"
          className="drop-shadow-[0_0_1px_#00ffff77] select-none rounded-full ring-slate-400 ring-4 ring-offset-2 cursor-pointer hover:scale-110"
        />
      )}
    </div>
  );
}
