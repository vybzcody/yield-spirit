// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract YieldSpirit is ERC721, Ownable {
    uint256 private _tokenIdCounter;

    // Mapping from token ID to the associated TBA address
    mapping(uint256 => address) public tokenBoundAccounts;

    // Store information about each NFT's strategy
    struct Strategy {
        string name;
        uint256 minAPY; // Minimum APY in basis points (100 = 1%)
        string[] targetChains;
        string[] targetAssets;
        bool active;
    }

    // Store information about SideShift swaps initiated by the NFT
    struct SideShiftSwap {
        string quoteId;
        address tokenOwner;
        address tbaAddress;
        string depositMethodId;
        string settleMethodId;
        string settleAddress;
        uint256 depositAmount;
        uint256 minReturnAmount;
        uint256 deadline;
        bool executed;
        bool cancelled;
    }

    mapping(uint256 => Strategy) public strategies;
    mapping(uint256 => SideShiftSwap[]) public sideShiftSwaps;

    // Events
    event YieldSpiritMinted(uint256 indexed tokenId, address indexed owner);
    event StrategySet(uint256 indexed tokenId, string name, uint256 minAPY);
    event TBAAssociated(uint256 indexed tokenId, address indexed tba);
    event SideShiftSwapInitiated(uint256 indexed tokenId, string quoteId, string depositMethodId, string settleMethodId);
    event SideShiftSwapExecuted(uint256 indexed tokenId, string quoteId);
    event SideShiftSwapCancelled(uint256 indexed tokenId, string quoteId);

    constructor() ERC721("YieldSpirit", "YS") Ownable() {}

    function safeMint(address to) public returns (uint256) {
        uint256 tokenId = _tokenIdCounter;
        _tokenIdCounter++;
        _safeMint(to, tokenId);

        emit YieldSpiritMinted(tokenId, to);
        return tokenId;
    }

    function setStrategy(uint256 tokenId, string memory name, uint256 minAPY, string[] memory targetChains, string[] memory targetAssets) public {
        require(ownerOf(tokenId) == msg.sender, "Not token owner");

        strategies[tokenId] = Strategy({
            name: name,
            minAPY: minAPY,
            targetChains: targetChains,
            targetAssets: targetAssets,
            active: true
        });

        emit StrategySet(tokenId, name, minAPY);
    }

    function associateTBA(uint256 tokenId, address tbaAddress) public {
        require(ownerOf(tokenId) == msg.sender, "Not token owner");
        require(tbaAddress != address(0), "Invalid TBA address");

        tokenBoundAccounts[tokenId] = tbaAddress;
        emit TBAAssociated(tokenId, tbaAddress);
    }

    // Function to initiate a SideShift swap for this NFT's TBA
    function initiateSideShiftSwap(
        uint256 tokenId,
        string memory quoteId,
        string memory depositMethodId,
        string memory settleMethodId,
        string memory settleAddress,
        uint256 depositAmount,
        uint256 minReturnAmount,
        uint256 deadline
    ) external {
        require(ownerOf(tokenId) == msg.sender, "Not token owner");
        require(tokenBoundAccounts[tokenId] != address(0), "TBA not associated");
        require(bytes(quoteId).length > 0, "Quote ID required");
        require(block.timestamp < deadline, "Deadline passed");

        SideShiftSwap memory swap = SideShiftSwap({
            quoteId: quoteId,
            tokenOwner: ownerOf(tokenId),
            tbaAddress: tokenBoundAccounts[tokenId],
            depositMethodId: depositMethodId,
            settleMethodId: settleMethodId,
            settleAddress: settleAddress,
            depositAmount: depositAmount,
            minReturnAmount: minReturnAmount,
            deadline: deadline,
            executed: false,
            cancelled: false
        });

        sideShiftSwaps[tokenId].push(swap);
        emit SideShiftSwapInitiated(tokenId, quoteId, depositMethodId, settleMethodId);
    }

    // Function to mark a swap as executed
    function executeSideShiftSwap(uint256 tokenId, uint256 swapIndex) external {
        require(ownerOf(tokenId) == msg.sender, "Not token owner");
        require(swapIndex < sideShiftSwaps[tokenId].length, "Invalid swap index");
        
        SideShiftSwap storage swap = sideShiftSwaps[tokenId][swapIndex];
        require(!swap.executed, "Swap already executed");
        require(!swap.cancelled, "Swap cancelled");

        swap.executed = true;
        emit SideShiftSwapExecuted(tokenId, swap.quoteId);
    }

    // Function to cancel a pending swap
    function cancelSideShiftSwap(uint256 tokenId, uint256 swapIndex) external {
        require(ownerOf(tokenId) == msg.sender, "Not token owner");
        require(swapIndex < sideShiftSwaps[tokenId].length, "Invalid swap index");
        
        SideShiftSwap storage swap = sideShiftSwaps[tokenId][swapIndex];
        require(!swap.executed, "Swap already executed");
        require(!swap.cancelled, "Swap already cancelled");
        require(block.timestamp > swap.deadline, "Swap not expired yet");

        swap.cancelled = true;
        emit SideShiftSwapCancelled(tokenId, swap.quoteId);
    }

    function getStrategy(uint256 tokenId) public view returns (
        string memory name,
        uint256 minAPY,
        string[] memory targetChains,
        string[] memory targetAssets,
        bool active
    ) {
        Strategy memory strategy = strategies[tokenId];
        return (
            strategy.name,
            strategy.minAPY,
            strategy.targetChains,
            strategy.targetAssets,
            strategy.active
        );
    }

    function getYieldSpiritDetails(uint256 tokenId) public view returns (
        address owner,
        address tba,
        Strategy memory strategy
    ) {
        owner = ownerOf(tokenId);
        tba = tokenBoundAccounts[tokenId];
        strategy = strategies[tokenId];
    }

    function getSideShiftSwaps(uint256 tokenId) external view returns (SideShiftSwap[] memory) {
        return sideShiftSwaps[tokenId];
    }

    function getSideShiftSwapCount(uint256 tokenId) external view returns (uint256) {
        return sideShiftSwaps[tokenId].length;
    }

    // Function to get the next token ID that will be minted
    function nextTokenId() public view returns (uint256) {
        return _tokenIdCounter;
    }
}