// Crypto
import { Interface } from "ethers";

// ABI
import LSP0ERC725AccountArtifact from "@lukso/lsp-smart-contracts/artifacts/LSP0ERC725Account.json";
import LSP6KeyManagerArtifact from "@lukso/lsp-smart-contracts/artifacts/LSP6KeyManager.json";
import PhygitalAssetArtifact from "../artifact/PhygitalAsset.json";

export const LSP0ERC725AccountABIInterface = new Interface(
  LSP0ERC725AccountArtifact.abi
);
export const LSP6KeyManagerInterface = new Interface(
  LSP6KeyManagerArtifact.abi
);
export const PhygitalAssetInterface = new Interface(PhygitalAssetArtifact.abi);

// Constants
export const interfaceIdOfPhygitalAsset = "0x5f5b600b";
