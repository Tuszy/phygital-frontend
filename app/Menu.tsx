"use client";

// Context
import { useContext } from "react";
import EthersContext from "@/context/EthersContext/EthersContext";

// UI
import LoginButton from "./LoginButton";
import SetPermissionsButton from "./SetPermissionsButton";
import LogoutButton from "./LogoutButton";
import DownloadAppButton from "./DownloadAppButton";

export default function Menu() {
  const { universalProfile } = useContext(EthersContext);

  return (
    <div className="flex flex-col gap-12 items-start sm:mt-0 sm:items-center justify-center flex-1 w-full px-12">
      {!Boolean(universalProfile) ? (
        <LoginButton />
      ) : (
        <>
          <div className="text-2xl w-full flex flex-col items-center gap-4 font-black tracking-widest [-webkit-text-stroke:_1px_#0ff] [-webkit-text-fill-color:_white] font-mono drop-shadow-[0_0_12px_#00ffff] select-none">
            Welcome {universalProfile?.nameWithAddress}
            {Boolean(universalProfile?.data?.profileImage?.length > 0) && (
              <img
                draggable={false}
                src={universalProfile?.data?.profileImage[0].url}
                width={100}
                height={100}
                alt="Profile image"
                className="drop-shadow-[0_0_1px_#00ffff77] select-none rounded-full ring-slate-400 ring-4 ring-offset-2"
              />
            )}
          </div>
          {!universalProfile?.hasPermissions ? (
            <SetPermissionsButton />
          ) : (
            <DownloadAppButton />
          )}
          <LogoutButton />
        </>
      )}
    </div>
  );
}
