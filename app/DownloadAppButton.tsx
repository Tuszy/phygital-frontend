"use client";

// UI
import Button from "./Button";

const DownloadAppButton = function ({
  onShowQRCode,
}: {
  onShowQRCode: () => void;
}) {
  return <Button onClick={async () => onShowQRCode()}>Download App</Button>;
};

export default DownloadAppButton;
