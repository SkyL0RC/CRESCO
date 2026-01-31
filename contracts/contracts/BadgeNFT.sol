// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

/**
 * @title BadgeNFT
 * @dev NFT badges for user achievements and tiers
 */
contract BadgeNFT is ERC721, Ownable {
    using Strings for uint256;

    struct Badge {
        string name;
        string description;
        uint256 tier; // 1 = Free, 2 = KYC, 3 = Staker
        string metadataURI;
    }

    mapping(uint256 => Badge) public badges;
    mapping(address => uint256[]) public userBadges;
    mapping(address => mapping(uint256 => bool)) public hasBadge;
    
    uint256 public badgeCounter;
    
    // Badge type constants
    uint256 public constant BADGE_ZK_KYC = 1;
    uint256 public constant BADGE_MONAD_STAKER = 2;
    uint256 public constant BADGE_VETERAN = 3;
    uint256 public constant BADGE_EARLY_ADOPTER = 4;

    event BadgeCreated(uint256 indexed badgeId, string name, uint256 tier);
    event BadgeMinted(address indexed user, uint256 indexed badgeId);

    constructor() ERC721("Monad Flow Badge", "MFB") Ownable(msg.sender) {
        // Initialize default badges
        _createBadge("ZK-KYC", "Verified human with zero-knowledge proof", 2, "");
        _createBadge("Monad Staker", "Staked MON tokens", 3, "");
        _createBadge("Cross-Chain Veteran", "Active on multiple chains", 2, "");
        _createBadge("Early Adopter", "One of the first users", 1, "");
    }

    /**
     * @dev Create a new badge type (only owner)
     */
    function _createBadge(
        string memory _name,
        string memory _description,
        uint256 _tier,
        string memory _metadataURI
    ) internal returns (uint256) {
        badgeCounter++;
        
        badges[badgeCounter] = Badge({
            name: _name,
            description: _description,
            tier: _tier,
            metadataURI: _metadataURI
        });

        emit BadgeCreated(badgeCounter, _name, _tier);
        
        return badgeCounter;
    }

    /**
     * @dev Mint a badge to a user
     */
    function mintBadge(address _user, uint256 _badgeId) external onlyOwner {
        require(_badgeId > 0 && _badgeId <= badgeCounter, "Invalid badge ID");
        require(!hasBadge[_user][_badgeId], "User already has this badge");

        uint256 tokenId = (_badgeId * 1000000) + getUserBadgeCount(_user);
        
        _safeMint(_user, tokenId);
        userBadges[_user].push(_badgeId);
        hasBadge[_user][_badgeId] = true;

        emit BadgeMinted(_user, _badgeId);
    }

    /**
     * @dev Get all badge IDs owned by a user
     */
    function getUserBadges(address _user) external view returns (uint256[] memory) {
        return userBadges[_user];
    }

    /**
     * @dev Get count of badges owned by a user
     */
    function getUserBadgeCount(address _user) public view returns (uint256) {
        return userBadges[_user].length;
    }

    /**
     * @dev Check if user has a specific badge
     */
    function userHasBadge(address _user, uint256 _badgeId) external view returns (bool) {
        return hasBadge[_user][_badgeId];
    }

    /**
     * @dev Get badge details
     */
    function getBadge(uint256 _badgeId) external view returns (Badge memory) {
        require(_badgeId > 0 && _badgeId <= badgeCounter, "Invalid badge ID");
        return badges[_badgeId];
    }

    /**
     * @dev Badges are non-transferable (soulbound)
     */
    function _update(
        address to,
        uint256 tokenId,
        address auth
    ) internal virtual override returns (address) {
        address from = _ownerOf(tokenId);
        
        // Allow minting (from == address(0))
        // Disallow transfers (from != address(0))
        require(from == address(0), "Badges are non-transferable");
        
        return super._update(to, tokenId, auth);
    }

    /**
     * @dev Override tokenURI if metadata is set
     */
    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(ownerOf(tokenId) != address(0), "Token does not exist");
        
        uint256 badgeId = tokenId / 1000000;
        Badge memory badge = badges[badgeId];
        
        if (bytes(badge.metadataURI).length > 0) {
            return badge.metadataURI;
        }
        
        // Return default metadata
        return string(abi.encodePacked("https://monadflow.xyz/metadata/badge/", badgeId.toString()));
    }
}
