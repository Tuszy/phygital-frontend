import { BrowserProvider, Eip1193Provider, Networkish } from "ethers";

export class UniversalProfileExtension extends BrowserProvider {
  private lukso: boolean;
  constructor(
    provider: Eip1193Provider & {
      isUniversalProfileExtension?: boolean;
    },
    network?: Networkish
  ) {
    super(provider, network);
    this.lukso = Boolean(provider.isUniversalProfileExtension);
  }

  public get isUniversalProfileExtension() {
    return this.lukso;
  }

  request({
    method,
    params,
  }: {
    method: string;
    params: Array<any>;
  }): Promise<any> {
    return super.send(method, params);
  }
}
