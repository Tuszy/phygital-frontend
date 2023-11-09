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
  private _upData?: Record<string, any>;
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

    try {
      const { value } = await this._erc725.fetchData("LSP3Profile");
      this._upData =
        value instanceof Object && "LSP3Profile" in value
          ? value.LSP3Profile
          : undefined;

      if (this._upData?.profileImage?.length > 0) {
        this._upData!.profileImage = this._upData?.profileImage.map(
          (image: { url: string }) => ({
            ...image,
            url: getURLWithIPFSGateway(image.url),
          })
        );
      }

      if (this._upData?.backgroundImage?.length > 0) {
        this._upData!.backgroundImage = this._upData?.backgroundImage.map(
          (image: { url: string }) => ({
            ...image,
            url: getURLWithIPFSGateway(image.url),
          })
        );
      }
    } catch (e) {
      this._upData = undefined;
      console.error("Failed to fetch LSP3Profile", e);
    }
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
    } catch (e) {
      console.error(e);
      this._hasPermissions = false;
    }

    return this._hasPermissions;
  }

  public async setNecessaryPermissions() {
    try {
      const tx = await this._up["setDataBatch(bytes32[],bytes[])"](
        permissionData.keys,
        permissionData.values
      );

      await this.signer.provider?.waitForTransaction(tx.hash);
      this._hasPermissions = await this.hasNecessaryPermissions();

      return this._hasPermissions;
    } catch (e) {
      console.error(e);
      if (await this.hasNecessaryPermissions()) return true;
    }
    return false;
  }

  public get address() {
    return this.universalProfileAddress;
  }

  public get nameWithAddress() {
    return `@${
      this._upData?.name || "ANONYMOUS"
    }#${this.universalProfileAddress.substring(2, 6)}`;
  }

  public get data() {
    return this._upData;
  }
}

const getURLWithIPFSGateway = (ipfsURL: string): string =>
  `${process.env.NEXT_PUBLIC_IPFS_GATEWAY}/${ipfsURL.replace("ipfs://", "")}`;
