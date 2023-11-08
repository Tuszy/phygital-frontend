// Crypto
import { Contract, Provider } from "ethers";

// ERC725
import ERC725, { ERC725JSONSchema } from "@erc725/erc725.js";
import LSP3ProfileMetadataSchema from "@erc725/erc725.js/schemas/LSP3ProfileMetadata.json";
import LSP6KeyManagerSchema from "../schema/LSP6KeyManager.json";

// Interfaces
import {
  LSP0ERC725AccountABIInterface,
  PhygitalAssetInterface,
  interfaceIdOfPhygitalAsset,
} from "./Interfaces";

// Validation
import { throwIfAddressIsNotAERC725Account } from "./contract-validation";

export class UniversalProfile {
  private up: Contract;
  private erc725: ERC725;
  private hasNecessaryPermissions?: () => Promise<boolean>;
  private setNecessaryPermissions?: () => Promise<boolean>;
  constructor(
    private provider: Provider,
    private universalProfileAddress: string
  ) {
    this.up = new Contract(
      this.universalProfileAddress,
      LSP0ERC725AccountABIInterface,
      this.provider
    );

    this.erc725 = new ERC725(
      LSP3ProfileMetadataSchema as ERC725JSONSchema[],
      this.universalProfileAddress,
      this.provider,
      { ipfsGateway: process.env.NEXT_PUBLIC_IPFS_GATEWAY }
    );
  }

  public async init() {
    await throwIfAddressIsNotAERC725Account(
      this.provider,
      this.universalProfileAddress
    );

    const { hasNecessaryPermissions, setNecessaryPermissions } =
      await this.createPermissionFunctions();

    this.hasNecessaryPermissions = hasNecessaryPermissions;
    this.setNecessaryPermissions = setNecessaryPermissions;
  }

  public async createPermissionFunctions() {
    const lsp6KeyManagerAddress = await this.up.owner();
    const controllerKey = process.env.NEXT_PUBLIC_KEY as string;
    const keyManager = new ERC725(
      LSP6KeyManagerSchema as ERC725JSONSchema[],
      lsp6KeyManagerAddress,
      this.provider,
      { ipfsGateway: process.env.NEXT_PUBLIC_IPFS_GATEWAY }
    );

    const restrictCallOperation = "0x00000010"; // restriction 'call' operation
    const allowCallingAnyContractInstance =
      "0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF"; // // allow calling any contract

    // https://github.com/lukso-network/LIPs/blob/main/LSPs/LSP-6-KeyManager.md
    const allowedCallPermission = [
      [
        restrictCallOperation,
        allowCallingAnyContractInstance,
        interfaceIdOfPhygitalAsset, // contract must support the PhygitalAsset interface
        PhygitalAssetInterface.getFunction("mint")!.selector, // allow calling the 'mint' function
      ],
      [
        restrictCallOperation,
        allowCallingAnyContractInstance,
        interfaceIdOfPhygitalAsset, // contract must support the PhygitalAsset interface
        PhygitalAssetInterface.getFunction("verifyOwnershipAfterTransfer")!
          .selector, // allow calling the 'verifyOwnershipAfterTransfer' function
      ],
    ];

    const permissionData = keyManager.encodeData([
      {
        keyName: "AddressPermissions:Permissions:<address>",
        dynamicKeyParts: controllerKey,
        value: keyManager.encodePermissions({ CALL: true }),
      },
      {
        keyName: "AddressPermissions:AllowedCalls:<address>",
        dynamicKeyParts: controllerKey,
        value: allowedCallPermission,
      },
    ]);

    const hasNecessaryPermissions = async () => {
      try {
        const data = await this.up["getDataBatch(bytes32[])"](
          permissionData.keys
        );
        const decodedPermissions = keyManager.decodePermissions(data[0]);
        const allowedCall = ((data[1] as string) ?? "").toLowerCase();
        return (
          decodedPermissions.CALL && permissionData.values[1] === allowedCall
        );
      } catch (e) {}

      return false;
    };

    const setNecessaryPermissions = async (): Promise<boolean> => {
      try {
        const tx = await this.up["setDataBatch(bytes32[],bytes[])"](
          permissionData.keys,
          permissionData.values,
          { gasLimit: 3000000 }
        );
        await tx.wait();
        return true;
      } catch (e) {}
      return false;
    };

    return {
      hasNecessaryPermissions,
      setNecessaryPermissions,
    };
  }

  public address() {
    return this.universalProfileAddress;
  }
}
