// Crypto
import { Contract, Provider, Signer } from "ethers";

// ERC725
import ERC725, { ERC725JSONSchema } from "@erc725/erc725.js";
import LSP3ProfileMetadataSchema from "@erc725/erc725.js/schemas/LSP3ProfileMetadata.json";

// Interfaces
import { LSP0ERC725AccountABIInterface } from "./Interfaces";

// Validation
import { throwIfAddressIsNotAERC725Account } from "./contract-validation";
import { KeyManagerERC725, permissionData } from "./permission";

export class UniversalProfile {
  private _up: Contract;
  private _erc725: ERC725;
  private _hasPermissions: boolean = false;
  constructor(private signer: Signer, private universalProfileAddress: string) {
    this._up = new Contract(
      this.universalProfileAddress,
      LSP0ERC725AccountABIInterface,
      this.signer
    );

    this._erc725 = new ERC725(
      LSP3ProfileMetadataSchema as ERC725JSONSchema[],
      this.universalProfileAddress,
      this.signer.provider,
      { ipfsGateway: process.env.NEXT_PUBLIC_IPFS_GATEWAY }
    );
  }

  public get hasPermissions() {
    return this._hasPermissions;
  }

  public async init() {
    await throwIfAddressIsNotAERC725Account(
      this.signer.provider!,
      this.universalProfileAddress
    );

    this._hasPermissions = await this.hasNecessaryPermissions();
  }

  public async hasNecessaryPermissions() {
    try {
      const data = await this._up["getDataBatch(bytes32[])"](
        permissionData.keys
      );
      const decodedPermissions = KeyManagerERC725.decodePermissions(data[0]);
      const allowedCall = ((data[1] as string) ?? "").toLowerCase();
      this._hasPermissions =
        decodedPermissions.CALL && permissionData.values[1] === allowedCall;
      return this._hasPermissions;
    } catch (e) {}

    this._hasPermissions = false;

    return false;
  }

  public async setNecessaryPermissions() {
    try {
      const tx = await this._up["setDataBatch(bytes32[],bytes[])"](
        permissionData.keys,
        permissionData.values,
        { gasLimit: 3000000 }
      );
      await tx.wait();
      this._hasPermissions = true;
      return true;
    } catch (e) {
      console.error(e);
    }
    return false;
  }

  public address() {
    return this.universalProfileAddress;
  }
}
