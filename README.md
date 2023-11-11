# Phygital Frontend

Web frontend is only used for adding a controller with specific permissions to the key manager of the universal profile allowing better ux within the [phygital app](https://github.com/Tuszy/phygital-app).

# Restriction
Only supports the [Universal Profile Extension](https://docs.lukso.tech/guides/browser-extension/install-browser-extension/) - no Metamask or any other Web3 wallet. For this reason, you cannot use a mobile phone at the time of writing, you must have a computer to log in with your Universal Profile and set the required permissions.

# Simple Workflow

1. Login with Universal Profile
2. Set Permissions

# Set Permissions

Controller: 0xAc11803507C05A21daAF9D354F7100B1dC9CD590

1. [AddressPermissions:Permissions](https://github.com/lukso-network/LIPs/blob/main/LSPs/LSP-6-KeyManager.md#addresspermissionspermissionsaddress)
   1. call
2. [AddressPermissions:AllowedCalls](https://github.com/lukso-network/LIPs/blob/main/LSPs/LSP-6-KeyManager.md#addresspermissionsallowedcallsaddress)
   1. restrictionOperations: call
   2. allowedAddress: all contract addresses (0xffffffffffffffffffffffffffffffffffffffff)
   3. allowedInterfaceId: Interface id of [PhygitalAsset contract](https://github.com/Tuszy/phygital-smart-contract/blob/main/contracts/PhygitalAsset.sol) (see [_INTERFACEID_PHYGITAL_ASSET](https://github.com/Tuszy/phygital-smart-contract/blob/main/contracts/PhygitalAssetConstants.sol))
   4. allowedFunction: selectors of
      1. function **mint**(address phygitalAddress, uint phygitalIndex, bytes memory phygitalSignature, bytes32[] memory merkleProofOfCollection, bool force)
      2. function **verifyOwnershipAfterTransfer**(address phygitalAddress, bytes memory phygitalSignature)
      3. function **transfer**(address from, address to, bytes32 tokenId, bool force, bytes memory data)