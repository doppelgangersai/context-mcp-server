// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract DataOwnershipNFT is ERC721URIStorage, Ownable {
    uint256 private _nextTokenId;

    // Mapping to track which URLs have already been registered (to prevent duplicates)
    // We store the keccak256 hash of the URL, not the whole string, to save gas.
    mapping(bytes32 => bool) public urlRegistry;

    // Event for your Backend (MongoDB) to listen to
    event UrlRegistered(uint256 indexed tokenId, address indexed owner, string url);

    constructor() ERC721("DataOwnershipKey", "DOK") Ownable(msg.sender) {}

    /**
     * @dev Mint a new NFT representing ownership of a specific URL.
     * @param to The wallet address receiving the NFT.
     * @param targetUrl The social media URL (e.g. "https://twitter.com/profile").
     */
    function mintOwnership(address to, string memory targetUrl) public {
        // 1. Create a unique hash of the URL
        bytes32 urlHash = keccak256(abi.encodePacked(targetUrl));

        // 2. Check if this URL is already owned by someone else
        require(!urlRegistry[urlHash], "Error: This URL has already been registered.");

        // 3. Mark the URL as registered
        urlRegistry[urlHash] = true;

        // 4. Mint the Token
        uint256 tokenId = _nextTokenId++;
        _safeMint(to, tokenId);

        // 5. Store the URL in the metadata field
        // Note: You can wrap this in JSON if you want it to look pretty on OpenSea,
        // but passing the raw URL works for your internal logic.
        _setTokenURI(tokenId, targetUrl);

        // 6. Emit the event so your backend can update MongoDB
        emit UrlRegistered(tokenId, to, targetUrl);
    }
}