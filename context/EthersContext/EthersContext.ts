"use client";

// React
import { createContext } from "react";

// Crypto
import { ethers } from "ethers";

// UniversalProfile
import { UniversalProfile } from "@/util/UniversalProfile";

export interface EthersContextValue {
  provider: null | ethers.BrowserProvider;
  universalProfile: null | UniversalProfile;
  connectUniversalProfile: () => void;
  logout: () => void;
  loading: boolean;
}

const EthersContext = createContext<EthersContextValue>({
  provider: null,
  universalProfile: null,
  connectUniversalProfile: () => {},
  logout: () => {},
  loading: false,
});

export default EthersContext;
