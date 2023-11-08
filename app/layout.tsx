import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ToastContainer } from "react-toastify";
import "./globals.css";
import "react-toastify/dist/ReactToastify.css";

// Ethers
import EthersContextProvider from "@/context/EthersContext/EthersContextProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Phygital",
  description:
    "Connecting the physical with the digital world through Phygitals powered by the LUKSO blockchain.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ToastContainer theme="colored" autoClose={10000} />
        <EthersContextProvider>{children}</EthersContextProvider>
      </body>
    </html>
  );
}
