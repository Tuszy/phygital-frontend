// Interfaces
import {
  PhygitalAssetInterface,
  INTERFACE_ID_OF_PHYGITAL_ASSET,
} from "./Interfaces";

// ERC725
import ERC725, { ERC725JSONSchema } from "@erc725/erc725.js";

// Schema
import LSP6KeyManagerSchema from "../schema/LSP6KeyManager.json";

const controllerKey = process.env.NEXT_PUBLIC_KEY as string;

export const KeyManagerERC725 = new ERC725(
  LSP6KeyManagerSchema as ERC725JSONSchema[]
);

const restrictCallOperation = "0x00000002"; // restriction 'call' operation
const allowCallingAnyContractInstance =
  "0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF"; // // allow calling any contract

// https://github.com/lukso-network/LIPs/blob/main/LSPs/LSP-6-KeyManager.md
const allowedCallPermission = [
  [
    restrictCallOperation,
    allowCallingAnyContractInstance,
    INTERFACE_ID_OF_PHYGITAL_ASSET, // contract must support the PhygitalAsset interface
    PhygitalAssetInterface.getFunction("mint")!.selector, // allow calling the 'mint' function
  ],
  [
    restrictCallOperation,
    allowCallingAnyContractInstance,
    INTERFACE_ID_OF_PHYGITAL_ASSET, // contract must support the PhygitalAsset interface
    PhygitalAssetInterface.getFunction("verifyOwnershipAfterTransfer")!
      .selector, // allow calling the 'verifyOwnershipAfterTransfer' function
  ],
  [
    restrictCallOperation,
    allowCallingAnyContractInstance,
    INTERFACE_ID_OF_PHYGITAL_ASSET, // contract must support the PhygitalAsset interface
    PhygitalAssetInterface.getFunction("transfer")!.selector, // allow calling the 'transfer' function
  ],
];

export const permissionData = KeyManagerERC725.encodeData([
  {
    keyName: "AddressPermissions:Permissions:<address>",
    dynamicKeyParts: controllerKey,
    value: KeyManagerERC725.encodePermissions({ CALL: true }),
  },
  {
    keyName: "AddressPermissions:AllowedCalls:<address>",
    dynamicKeyParts: controllerKey,
    // @ts-ignore
    value: allowedCallPermission,
  },
]);

console.log("Permission data", permissionData);
console.log(
  "mint selector",
  PhygitalAssetInterface.getFunction("mint")!.selector
);
console.log(
  "verifyOwnershipAfterTransfer selector",
  PhygitalAssetInterface.getFunction("verifyOwnershipAfterTransfer")!.selector
);
console.log(
  "transfer selector",
  PhygitalAssetInterface.getFunction("transfer")!.selector
);
