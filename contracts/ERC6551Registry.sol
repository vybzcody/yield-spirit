// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/utils/Create2.sol";
import "@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol";

interface IERC6551Registry {
    event Deploy(
        address indexed implementation,
        bytes32 indexed salt,
        uint256 indexed chainId,
        address tokenContract,
        uint256 tokenId
    );

    function createAccount(
        address implementation,
        bytes32 salt,
        uint256 chainId,
        address tokenContract,
        uint256 tokenId
    ) external returns (address);

    function account(
        address implementation,
        bytes32 salt,
        uint256 chainId,
        address tokenContract,
        uint256 tokenId
    ) external view returns (address);
}

contract ERC6551Registry is IERC6551Registry {
    error InvalidChainId();

    function createAccount(
        address implementation,
        bytes32 salt,
        uint256 chainId,
        address tokenContract,
        uint256 tokenId
    ) external returns (address) {
        if (chainId != block.chainid) revert InvalidChainId();

        address account = _createAccount(
            implementation,
            salt,
            chainId,
            tokenContract,
            tokenId
        );

        emit Deploy(
            implementation,
            salt,
            chainId,
            tokenContract,
            tokenId
        );

        return account;
    }

    function account(
        address implementation,
        bytes32 salt,
        uint256 chainId,
        address tokenContract,
        uint256 tokenId
    ) external view returns (address) {
        if (chainId != block.chainid) return address(0);

        bytes32 bytecodeHash = _bytecodeHash(
            implementation,
            salt,
            chainId,
            tokenContract,
            tokenId
        );

        return Create2.computeAddress(salt, bytecodeHash);
    }

    function _createAccount(
        address implementation,
        bytes32 salt,
        uint256 chainId,
        address tokenContract,
        uint256 tokenId
    ) private returns (address) {
        bytes32 bytecodeHash = _bytecodeHash(
            implementation,
            salt,
            chainId,
            tokenContract,
            tokenId
        );

        address account = Create2.deploy(
            0,
            salt,
            _bytecode(implementation, salt, chainId, tokenContract, tokenId)
        );

        if (account.code.length == 0) {
            // In the case of a CREATE2 collision, return the pre-existing account
            return Create2.computeAddress(salt, bytecodeHash);
        }

        return account;
    }

    function _bytecode(
        address implementation,
        bytes32 salt,
        uint256 chainId,
        address tokenContract,
        uint256 tokenId
    ) private pure returns (bytes memory) {
        return abi.encodePacked(
            type(ERC1967Proxy).creationCode,
            abi.encode(implementation, "")
        );
    }

    function _bytecodeHash(
        address implementation,
        bytes32 salt,
        uint256 chainId,
        address tokenContract,
        uint256 tokenId
    ) private pure returns (bytes32) {
        return keccak256(_bytecode(implementation, salt, chainId, tokenContract, tokenId));
    }
}