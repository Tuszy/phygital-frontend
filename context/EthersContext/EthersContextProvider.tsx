"use client";

// React
import React, {
  PropsWithChildren,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

// Crypto
import { Eip1193Provider, hashMessage } from "ethers";
import { SiweMessage } from "siwe";

// React Toast
import { Id, toast } from "react-toastify";

// Context
import type { EthersContextValue } from "./EthersContext";
import EthersContext from "./EthersContext";

// Lukso
import { UniversalProfileExtension } from "@/util/UniversalProfileExtension";

// Universal Profile
import { UniversalProfile } from "@/util/UniversalProfile";

// Constants
export const UP_BROWSER_EXTENSION_URL =
  "https://docs.lukso.tech/guides/browser-extension/install-browser-extension/";
export const REQUESTING_PENDING: number = -32002;
export const USER_REJECTED_REQUEST: number = 4001;

// Context Provider
const EthersContextProvider = ({ children }: PropsWithChildren) => {
  const provider = useRef<null | UniversalProfileExtension>(null);
  const [universalProfile, setUniversalProfile] =
    useState<null | UniversalProfile>(null);

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<null | Id>(null);

  const showError = (content: null | string | React.ReactNode) => {
    if (error) {
      toast.dismiss(error);
    }

    if (content) {
      setError(toast.error(content));
    }
  };

  const clearError = () => showError(null);

  const requestingAccountSucceeded = async () => {
    if (!(await guard())) return;

    const signer = await provider.current!.getSigner();
    const universalProfileAddress = await signer.getAddress();
    let universalProfile = new UniversalProfile(
      signer,
      universalProfileAddress
    );

    try {
      await universalProfile.init();
    } catch (e: any) {
      setUniversalProfile(null);
      console.error(
        `❌ fetching universal profile data failed: ${universalProfileAddress}`,
        e.message
      );
      showError(
        <a href={UP_BROWSER_EXTENSION_URL} target="_blank">
          Fetching universal profile data for {universalProfileAddress} failed.
          Please make sure that you are using the Lukso UP browser extension.
        </a>
      );
      return;
    }

    setUniversalProfile(universalProfile);

    clearError();

    console.log(
      "✅ eth_requestAccounts succeeded: ",
      universalProfileAddress,
      universalProfile
    );
  };

  const requestingAccountPending = () => clearError();

  const requestingAccountFailed = async (code: string, message: string) => {
    if (code !== "ACTION_REJECTED") {
      showError(message as string);
    }
    console.error("❌ eth_requestAccounts failed: ", message, code);
  };

  const connectUniversalProfile = async () => {
    if (!(await guard())) return;

    clearError();
    setUniversalProfile(null);
    setLoading(true);

    try {
      await provider.current!.send("eth_requestAccounts", []);
      await requestingAccountSucceeded();
      setLoading(false);
    } catch (e: any) {
      if (e.code === REQUESTING_PENDING) {
        requestingAccountPending();
        return;
      } else if (e.code === USER_REJECTED_REQUEST) {
        setLoading(false);
        return;
      }

      await requestingAccountFailed(e.code as string, e.message as string);
      setLoading(false);
    }
  };

  const setPermissions = async () => {
    if (!(await guard())) return;

    setLoading(true);
    if (!(await universalProfile?.setNecessaryPermissions())) {
      showError("Failed to set the necessary permissions.");
    } else {
      toast.success("Successfully set the necessary permissions.");
    }
    setLoading(false);
  };

  const login = async (): Promise<string | null> => {
    if (!(await guard())) return null;

    if (!universalProfile?.hasPermissions) {
      showError(
        "Please set the permissions first before creating the app login qr code"
      );
      return null;
    }

    try {
      const signer = await provider.current?.getSigner();
      if (!signer) {
        return null;
      }

      const siweMessage = new SiweMessage({
        domain: window.location.host,
        address: universalProfile.address,
        statement: "I want to create a QR Code to login into the Phygital app.",
        uri: window.location.origin,
        version: "1",
        chainId: parseInt(process.env.NEXT_PUBLIC_CHAIN_ID!),
        resources: ["https://phygital.tuszy.com"],
      }).prepareMessage();
      const hash = hashMessage(siweMessage);

      const signature = await signer.signMessage(siweMessage);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            universal_profile_address: universalProfile!.address,
            signature,
            hash,
          }),
        }
      );

      if (response.status !== 200) throw new Error("Login request failed");
      const json = await response.json();
      if (!Boolean(json.token)) throw new Error("Invalid login response");

      return json.token ?? null;
    } catch (e: any) {
      console.error(`❌ signing login message failed: `, e.message);
      showError("Failed to create the QR Code for the app login");
    }

    return null;
  };

  const logout = async () => setUniversalProfile(null);

  const guard = async () => {
    if (!provider.current || !provider.current?.isUniversalProfileExtension) {
      showError(
        <a href={UP_BROWSER_EXTENSION_URL} target="_blank">
          Please download the Lukso UP browser extension.
        </a>
      );
      return false;
    }
    if (loading) return false;

    const chainId = parseInt(process.env.NEXT_PUBLIC_CHAIN_ID!);
    if (!chainId) return false;

    const chainIdAsHex = "0x" + chainId.toString(16);
    if (chainIdAsHex.toLowerCase() === window.lukso.chainId) return true;

    try {
      console.log(chainId, chainIdAsHex);
      await provider.current.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: chainIdAsHex }],
      });

      return true;
    } catch (e) {
      return false;
    }
  };

  useEffect(() => {
    if (!provider.current) {
      if (window?.lukso === undefined) return;
      provider.current = new UniversalProfileExtension(window?.lukso);
    }
  }, []);

  const value: EthersContextValue = useMemo<EthersContextValue>(
    () => ({
      provider: provider.current,
      universalProfile,
      connectUniversalProfile,
      setPermissions,
      login,
      logout,
      loading,
    }),
    [provider, universalProfile, loading, error]
  );

  return (
    <EthersContext.Provider value={value}>{children}</EthersContext.Provider>
  );
};

declare global {
  interface Window {
    lukso: Eip1193Provider & {
      chainId: string;
      on: (event: string, handler: () => void) => void;
      removeAllListeners: (event: string) => void;
    };
  }
}

export default EthersContextProvider;
