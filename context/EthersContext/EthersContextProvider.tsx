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
import { Eip1193Provider } from "ethers";

// React Toast
import { Id, toast } from "react-toastify";

// Context
import type { EthersContextValue } from "./EthersContext";
import EthersContext from "./EthersContext";

// Constants
import { REQUESTING_PENDING, USER_REJECTED_REQUEST } from "./EthersConstants";

// Lukso
import { UniversalProfileExtension } from "@/util/UniversalProfileExtension";

// Universal Profile
import { UniversalProfile } from "@/util/UniversalProfile";

const UP_BROWSER_EXTENSION_URL =
  "https://docs.lukso.tech/guides/browser-extension/install-browser-extension/";

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
    if (!provider.current) return;

    const signer = await provider.current.getSigner();
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
    if (loading) return;

    if (!provider.current || !provider.current?.isUniversalProfileExtension()) {
      showError(
        <a href={UP_BROWSER_EXTENSION_URL} target="_blank">
          Please download the Lukso UP browser extension.
        </a>
      );
      return;
    }

    clearError();
    setUniversalProfile(null);
    setLoading(true);

    try {
      await provider.current.send("eth_requestAccounts", []);
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
    if (!provider.current || !universalProfile || loading) return;

    setLoading(true);
    if (!(await universalProfile?.setNecessaryPermissions())) {
      showError("Failed to set the necessary permissions.");
    }
    setLoading(false);
  };

  const logout = () => setUniversalProfile(null);

  useEffect(() => {
    if (!provider.current) {
      if (window?.lukso === undefined) return;
      provider.current = new UniversalProfileExtension(window?.lukso);
    } else {
      return;
    }

    return () => {
      provider.current?.removeAllListeners("network");
    };
  }, []);

  const value: EthersContextValue = useMemo<EthersContextValue>(
    () => ({
      provider: provider.current,
      universalProfile,
      connectUniversalProfile,
      setPermissions,
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
    lukso: Eip1193Provider;
  }
}

export default EthersContextProvider;
