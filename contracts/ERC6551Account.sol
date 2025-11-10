// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/utils/introspection/IERC165.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/interfaces/IERC1271.sol";
import "@openzeppelin/contracts/utils/cryptography/SignatureChecker.sol";

interface IERC6551Account {
    function token() external view returns (uint256 chainId, address tokenContract, uint256 tokenId);
    function state() external view returns (uint256);
    function isValidSigner(address signer, bytes calldata context) external view returns (bytes4 magicValue);
}

interface IERC6551Executable {
    function execute(address to, uint256 value, bytes calldata data, uint8 operation) external payable returns (bytes memory);
}

contract ERC6551Account is IERC165, IERC1271, IERC6551Account, IERC6551Executable {
    uint256 immutable public chainId;
    address immutable public tokenContract;
    uint256 immutable public tokenId;
    uint256 public state;

    event Executed(address indexed to, uint256 value, bytes data, uint8 operation, bytes32 returnDataHash);

    constructor() {
        (uint256 _chainId, address _tokenContract, uint256 _tokenId) = _parseImmutableArgs();
        chainId = _chainId;
        tokenContract = _tokenContract;
        tokenId = _tokenId;
    }

    receive() external payable {}

    function execute(
        address to,
        uint256 value,
        bytes calldata data,
        uint8 operation
    ) external payable virtual returns (bytes memory) {
        require(_isValidSigner(msg.sender), "Invalid signer");
        require(operation == 0, "Only CALL supported"); 

        ++state;

        (bool success, bytes memory result) = to.call{value: value}(data);
        require(success, "Execution failed");
        

        emit Executed(to, value, data, operation, keccak256(result));

        return result;
    }

    function isValidSigner(address signer, bytes calldata) external view virtual returns (bytes4) {
        return _isValidSigner(signer) ? IERC6551Account.isValidSigner.selector : bytes4(0);
    }

    function isValidSignature(bytes32 hash, bytes memory signature) external view virtual returns (bytes4) {
        return SignatureChecker.isValidSignatureNow(owner(), hash, signature) ? IERC1271.isValidSignature.selector : bytes4(0);
    }

    function supportsInterface(bytes4 interfaceId) external pure virtual returns (bool) {
        return 
            interfaceId == type(IERC165).interfaceId ||
            interfaceId == type(IERC6551Account).interfaceId ||
            interfaceId == type(IERC6551Executable).interfaceId;
    }

    function token() public view returns (uint256, address, uint256) {
        return (chainId, tokenContract, tokenId);
    }

    function owner() public view virtual returns (address) {
        if (chainId != block.chainid) return address(0);
        return IERC721(tokenContract).ownerOf(tokenId);
    }

    function _isValidSigner(address signer) internal view virtual returns (bool) {
        return signer == owner();
    }

    function _parseImmutableArgs() private view returns (uint256, address, uint256) {
    
        bytes memory data = new bytes(85);
        uint256 offset = 27;
        
        assembly {
            extcodecopy(address(), add(data, 0x20), offset, 85)
        }

        uint256 _chainId;
        address _tokenContract;
        uint256 _tokenId;
        
        assembly {
            _chainId := mload(add(data, 0x20))     
            _tokenContract := mload(add(data, 0x40)) 
            _tokenContract := shr(96, _tokenContract) 
            _tokenId := mload(add(data, 0x60))   
        }
        
        return (_chainId, _tokenContract, _tokenId);
    }
    
    function getBalance() external view returns (uint256) {
        return address(this).balance;
    }
}