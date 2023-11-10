// Crypto
import { isAddress, Contract, Provider } from "ethers";

// Interfaces
import {
  LSP0ERC725AccountInterface,
  LSP6KeyManagerInterface,
  PhygitalAssetInterface,
  interfaceIdOfPhygitalAsset,
} from "./Interfaces";

// Constants
import { INTERFACE_IDS } from "@lukso/lsp-smart-contracts";

export function throwIfInvalidAddress(address: string) {
  if (!isAddress(address)) throw Error(`${address} is an invalid address`);
}

export async function throwIfAddressIsNotAERC725Account(
  provider: Provider,
  address: string
) {
  throwIfInvalidAddress(address);

  const erc725Account = new Contract(
    address,
    LSP0ERC725AccountInterface,
    provider
  );

  try {
    const isERC725Account = await erc725Account.supportsInterface(
      INTERFACE_IDS.LSP0ERC725Account
    );
    if (!isERC725Account) throw new Error();
  } catch (e) {
    throw new Error(`${address} is not an instance of type LSP0ERC725Account`);
  }
}

export async function throwIfAddressIsNotALSP6KeyManager(
  provider: Provider,
  address: string
) {
  throwIfInvalidAddress(address);

  const lsp6KeyManager = new Contract(
    address,
    LSP6KeyManagerInterface,
    provider
  );

  try {
    const isKeyManager = await lsp6KeyManager.supportsInterface(
      INTERFACE_IDS.LSP6KeyManager
    );
    if (!isKeyManager) throw new Error();
  } catch (e) {
    throw new Error(`${address} is not an instance of type LSP6KeyManager`);
  }
}

export async function throwIfAddressIsNotAPhygitalAsset(
  provider: Provider,
  address: string
) {
  throwIfInvalidAddress(address);

  const phygitalAsset = new Contract(address, PhygitalAssetInterface, provider);

  try {
    const isPhygitalAsset = await phygitalAsset.supportsInterface(
      interfaceIdOfPhygitalAsset
    );
    if (!isPhygitalAsset) throw new Error();
  } catch (e) {
    throw new Error(`${address} is not an instance of type PhygitalAsset`);
  }
}
