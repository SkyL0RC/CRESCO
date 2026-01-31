// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title QuestManager
 * @dev Manages quest creation, completion verification, and reward distribution
 */
contract QuestManager is Ownable, ReentrancyGuard {
    struct Quest {
        uint256 id;
        address creator;
        string title;
        string description;
        uint256 rewardAmount;
        address rewardToken; // 0x0 for native token
        uint256 totalBudget;
        uint256 remainingBudget;
        bool isActive;
        uint256 createdAt;
    }

    struct QuestCompletion {
        uint256 questId;
        address user;
        bytes32 txHash;
        uint256 completedAt;
        bool rewardPaid;
    }

    // Quest storage
    mapping(uint256 => Quest) public quests;
    mapping(uint256 => mapping(address => bool)) public userCompletedQuest;
    mapping(address => uint256[]) public userQuests;
    
    uint256 public questCounter;
    uint256 public platformFee = 1000; // 10% in basis points (1000/10000 = 10%)
    
    // Events
    event QuestCreated(uint256 indexed questId, address indexed creator, uint256 rewardAmount);
    event QuestCompleted(uint256 indexed questId, address indexed user, uint256 rewardAmount);
    event QuestDeactivated(uint256 indexed  questId);
    event FundsWithdrawn(uint256 indexed questId, address indexed creator, uint256 amount);

    constructor() Ownable(msg.sender) {}

    /**
     * @dev Create a new quest
     */
    function createQuest(
        string memory _title,
        string memory _description,
        uint256 _rewardAmount,
        address _rewardToken,
        uint256 _maxCompletions
    ) external payable returns (uint256) {
        require(_rewardAmount > 0, "Reward must be greater than 0");
        require(_maxCompletions > 0, "Max completions must be greater than 0");

        uint256 totalBudget = _rewardAmount * _maxCompletions;
        
        // If native token, ensure enough was sent
        if (_rewardToken == address(0)) {
            require(msg.value >= totalBudget, "Insufficient funds sent");
        }

        questCounter++;
        
        quests[questCounter] = Quest({
            id: questCounter,
            creator: msg.sender,
            title: _title,
            description: _description,
            rewardAmount: _rewardAmount,
            rewardToken: _rewardToken,
            totalBudget: totalBudget,
            remainingBudget: totalBudget,
            isActive: true,
            createdAt: block.timestamp
        });

        emit QuestCreated(questCounter, msg.sender, _rewardAmount);
        
        return questCounter;
    }

    /**
     * @dev Mark quest as completed and distribute reward
     * @param _questId Quest ID
     * @param _user User who completed the quest
     * @param _txHash Transaction hash proving completion
     */
    function completeQuest(
        uint256 _questId,
        address _user,
        bytes32 _txHash
    ) external nonReentrant {
        Quest storage quest = quests[_questId];
        
        require(quest.isActive, "Quest is not active");
        require(!userCompletedQuest[_questId][_user], "User already completed this quest");
        require(quest.remainingBudget >= quest.rewardAmount, "Insufficient budget remaining");

        // Mark as completed
        userCompletedQuest[_questId][_user] = true;
        userQuests[_user].push(_questId);

        // Calculate platform fee
        uint256 fee = (quest.rewardAmount * platformFee) / 10000;
        uint256 userReward = quest.rewardAmount - fee;

        // Update budget
        quest.remainingBudget -= quest.rewardAmount;

        // Distribute reward (assuming native token for now)
        if (quest.rewardToken == address(0)) {
            (bool success, ) = payable(_user).call{value: userReward}("");
            require(success, "Reward transfer failed");
            
            if (fee > 0) {
                (bool feeSuccess, ) = payable(owner()).call{value: fee}("");
                require(feeSuccess, "Fee transfer failed");
            }
        }

        emit QuestCompleted(_questId, _user, userReward);

        // Deactivate quest if budget exhausted
        if (quest.remainingBudget < quest.rewardAmount) {
            quest.isActive = false;
            emit QuestDeactivated(_questId);
        }
    }

    /**
     * @dev Deactivate a quest (only creator)
     */
    function deactivateQuest(uint256 _questId) external {
        Quest storage quest = quests[_questId];
        require(msg.sender == quest.creator, "Only creator can deactivate");
        require(quest.isActive, "Quest already inactive");
        
        quest.isActive = false;
        emit QuestDeactivated(_questId);
    }

    /**
     * @dev Withdraw remaining funds from deactivated quest (only creator)
     */
    function withdrawRemainingFunds(uint256 _questId) external nonReentrant {
        Quest storage quest = quests[_questId];
        require(msg.sender == quest.creator, "Only creator can withdraw");
        require(!quest.isActive, "Quest must be deactivated first");
        require(quest.remainingBudget > 0, "No funds to withdraw");

        uint256 amount = quest.remainingBudget;
        quest.remainingBudget = 0;

        if (quest.rewardToken == address(0)) {
            (bool success, ) = payable(msg.sender).call{value: amount}("");
            require(success, "Withdrawal failed");
        }

        emit FundsWithdrawn(_questId, msg.sender, amount);
    }

    /**
     * @dev Update platform fee (only owner)
     */
    function setPlatformFee(uint256 _newFee) external onlyOwner {
        require(_newFee <= 1000, "Fee cannot exceed 10%");
        platformFee = _newFee;
    }

    /**
     * @dev Get user's completed quests
     */
    function getUserQuests(address _user) external view returns (uint256[] memory) {
        return userQuests[_user];
    }

    /**
     * @dev Check if user completed a quest
     */
    function hasUserCompletedQuest(uint256 _questId, address _user) external view returns (bool) {
        return userCompletedQuest[_questId][_user];
    }
}
