// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract WERC1155 is ERC1155("0x00") {
    address public owner;

    constructor() {
        owner = msg.sender;
    }

    function typeConversion(address value) public pure returns (uint256) {
        uint256 res = uint256(uint160(value));
        return res;
    }

    function mint(address id, uint256 value, bytes memory data) external {
        _transferFrom(msg.sender, address(this), value, id);
        _mint(msg.sender, typeConversion(id), value, data);
    }

    function _transferFrom(address from, address to, uint256 amount, address tokenContract) internal {
        ERC20 token = ERC20(tokenContract);
        require(token.allowance(from, to) >= amount, "Insufficient allowance!");
        token.transferFrom(from, to, amount);
    }

    function _transfer(address to, uint256 amount, address tokenContract) internal {
        ERC20 token = ERC20(tokenContract);
        require(token.balanceOf(address(this)) >= amount, "Insufficient address(this) balance!");
        token.transfer(to, amount);
    }

    function burn(address id, uint256 value) external {
        require(balanceOf(msg.sender, typeConversion(id)) >= value, "Insufficient msg.sender balance!");
        _burn(msg.sender, typeConversion(id), value);
        _transfer(msg.sender, value, id);
    }

}
