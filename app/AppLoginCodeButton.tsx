"use client";

// UI
import Button from "./Button";

// Context
import { useContext } from "react";
import EthersContext from "@/context/EthersContext/EthersContext";

const DownloadAppButton = function ({
  onShowQRCode,
}: {
  onShowQRCode: (jwt: string) => void;
}) {
  const { universalProfile, login, loading } = useContext(EthersContext);

  const onCreateLoginQrCode = async () => {
    if (loading) return;
    const jwt = await login();
    if (jwt == null) return;
    onShowQRCode(jwt!);
  };

  return (
    <Button onClick={onCreateLoginQrCode}>Create App Login QR Code</Button>
  );
};

export default DownloadAppButton;
