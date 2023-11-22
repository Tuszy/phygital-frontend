"use client";

// Context
import { useContext, useState } from "react";
import EthersContext from "@/context/EthersContext/EthersContext";

// UI
import LoginButton from "./LoginButton";
import SetPermissionsButton from "./SetPermissionsButton";
import LogoutButton from "./LogoutButton";
import AppLoginCodeButton from "./AppLoginCodeButton";
import Profile from "./Profile";
import QRCode from "./QRCode";

export default function Menu() {
  const [qrCodeData, setQRCodeData] = useState<{
    text: string;
    data: string;
  } | null>(null);
  const { universalProfile } = useContext(EthersContext);

  const onHideQRCode = () => setQRCodeData(null);
  const showUniversalProfileQRCode = () =>
    universalProfile &&
    setQRCodeData({
      text: "Universal Profile Address",
      data: `ethereum:${universalProfile!.address}@${process.env.CHAIN_ID}`,
    });

  const showUniversalProfileLoginQRCode = (jwt: String) =>
    universalProfile &&
    setQRCodeData({
      text: "App Login",
      data: `ethereum:${universalProfile!.address}@${
        process.env.CHAIN_ID
      }:${jwt}`,
    });

  return (
    <div className="flex flex-col gap-12 items-start sm:mt-0 sm:items-center justify-center flex-1 w-full px-12">
      {!Boolean(universalProfile) ? (
        <LoginButton />
      ) : (
        <>
          <Profile onShowQRCode={showUniversalProfileQRCode} />
          {!universalProfile?.hasPermissions ? (
            <SetPermissionsButton />
          ) : (
            <AppLoginCodeButton
              onShowQRCode={showUniversalProfileLoginQRCode}
            />
          )}
          <LogoutButton />
          {qrCodeData && <QRCode {...qrCodeData} onClose={onHideQRCode} />}
        </>
      )}
    </div>
  );
}
