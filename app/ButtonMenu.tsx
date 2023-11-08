"use client";

// Context
import { useContext } from "react";
import EthersContext from "@/context/EthersContext/EthersContext";

// UI
import LoginButton from "./LoginButton";
import SetPermissionsButton from "./SetPermissionsButton";
import LogoutButton from "./LogoutButton";

export default function ButtonMenu() {
  const { universalProfile } = useContext(EthersContext);

  return (
    <div className="mt-16 flex items-start sm:mt-0 sm:items-center justify-center flex-1 w-full pb-24">
      {!Boolean(universalProfile) ? (
        <LoginButton />
      ) : (
        <>
          {!universalProfile?.hasPermissions && <SetPermissionsButton />}
          <LogoutButton />
        </>
      )}
    </div>
  );
}
