"use client";

// Context
import { useContext, useState } from "react";
import EthersContext from "@/context/EthersContext/EthersContext";

// UI
import LoginButton from "./LoginButton";
import SetPermissionsButton from "./SetPermissionsButton";
import LogoutButton from "./LogoutButton";
import DownloadAppButton from "./DownloadAppButton";
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
  const showAppDownloadLinkQRCode = () =>
    setQRCodeData({
      text: "App Download",
      data: "https://phygital-app.tuszy.com",
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
            <DownloadAppButton onShowQRCode={showAppDownloadLinkQRCode} />
          )}
          <LogoutButton />
          {qrCodeData && <QRCode {...qrCodeData} onClose={onHideQRCode} />}
        </>
      )}
    </div>
  );
}
