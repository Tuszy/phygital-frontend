"use client";

// QR
import { toCanvas } from "qrcode";
import { useEffect } from "react";

export default function QRCode({
  text,
  data,
  onClose,
}: {
  text: string;
  data: string;
  onClose: () => void;
}) {
  useEffect(() => {
    toCanvas(
      document.getElementById("qr-code-canvas"),
      data,
      { width: 400 },
      function (error: any) {
        if (error) console.error(error);
      }
    );
  }, [text, data]);

  return (
    <div
      onClick={onClose}
      className="fixed cursor-pointer grid place-content-center z-10 inset-0 text-black bg-[#000b] backdrop-blur-[3px] overflow-hidden"
    >
      <div className="flex flex-col items-center justify-center gap-8">
        <div className="text-white w-full flex-center font-bold text-3xl text-center">
          {text}
        </div>
        <div className="bg-white h-80 w-80 rounded-xl ring-4 ring-offset-2 ring-slate-300 grid place-content-center overflow-hidden">
          <canvas id="qr-code-canvas"></canvas>
        </div>
      </div>
    </div>
  );
}
