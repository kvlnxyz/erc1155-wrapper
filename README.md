# Wrapped ERC1155

## Motivation

### Yesterday, Guillaume Lambert tweeted about how an ERC1155 contract could be used as a general token wrapper. The ERC1155 standard simplifies batch token transfers and token interoperability. If several tokens are wrapped under one contract the promise is greater efficiency and security is realized.

- Original tweet now deleted but read as follows: "Has anyone ever created an ERC1155 token wrapper? i.e. a contract that, when you send ERC20 tokens to it, issues an ERC1155 token with a tokenID given by the address of the ERC20 token and a balance equal to the sent amount?"
- [Follow up tweet](https://twitter.com/guil_lambert/status/1686687296458723329)

## Implementation

- The WERC1155.sol contract enables anyone to mint a wrapped token by depositing an arbitrary ERC20 token.
- Of course, this model can be expanded beyond the ERC20 standard.
- The depositor is credited a token. The token's ID is derived from its contract's address. This enables permissionless deposits of any ERC20 token.
- Tests are located in the /test directory. Mint, burn, approval, balanceOf, and transfer functionality is all tested.
- Batch transfers along with other popular ERC1155 functionality is enabled.
- Testnet contract deployed at [0xf0ec671842a6a43606af69c1e7dce37c68eae716](https://mumbai.polygonscan.com/address/0xf0ec671842a6a43606af69c1e7dce37c68eae716)
