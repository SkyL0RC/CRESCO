import { writeContract, readContract, waitForTransactionReceipt } from '@wagmi/core';
import { contracts } from '.';
import { config } from '@/lib/wagmi';
import { parseEther } from 'viem'; // Assuming parseEther comes from viem

// Extract questManager details from the contracts object
const questManagerAddress = contracts.questManager.address;
const QUEST_MANAGER_ABI = contracts.questManager.abi;

/**
 * Create a new quest on-chain with budget deposit
 * @param data Quest creation parameters
 * @returns Transaction result with quest ID
 */
export async function createQuestOnChain(data: {
    title: string;
    description: string;
    rewardAmount: number; // In MON tokens (will be converted to Wei)
    rewardToken: `0x${string}`;
    maxCompletions: number;
    totalBudget: number; // Total budget in MON
}): Promise<{ hash: `0x${string}`; questId: bigint; wait: () => Promise<any> }> {
    if (!questManagerAddress) {
        throw new Error('Quest Manager contract not configured');
    }

    try {
        // Convert amounts to Wei (assuming 18 decimals for MON token)
        const rewardAmountWei = parseEther(data.rewardAmount.toString());
        const totalBudgetWei = parseEther(data.totalBudget.toString());

        // For now, we'll use ETH as the reward token (address(0))
        // In production, this should be the MON token address
        const rewardTokenAddress = '0x0000000000000000000000000000000000000000';

        const hash = await writeContract(config, {
            address: questManagerAddress,
            abi: QUEST_MANAGER_ABI,
            functionName: 'createQuest',
            args: [
                data.title,
                data.description,
                rewardAmountWei,
                rewardTokenAddress as `0x${string}`,
                BigInt(data.maxCompletions),
            ],
            value: totalBudgetWei, // Send budget as native token
        });

        // Wait for transaction and get quest ID from event
        // Add 60s timeout to prevent infinite hanging
        const receipt = await waitForTransactionReceipt(config, { hash, timeout: 60000 });

        // Find the QuestCreated event log
        let questId = BigInt(0);

        // Find log that matches QuestCreated event signature or topic
        // Topic 0 for QuestCreated(uint256,address,uint256)
        // We can look for the log that comes from our contract
        const log = receipt.logs.find((l) => l.address.toLowerCase() === questManagerAddress.toLowerCase());

        if (log && log.topics && log.topics[1]) {
            // topic[1] is the first indexed argument: questId
            questId = BigInt(log.topics[1]);
        }

        return {
            hash,
            questId,
            wait: async () => receipt,
        };
    } catch (error) {
        console.error('Error creating quest on-chain:', error);
        throw error;
    }
}

/**
 * Complete a quest and claim reward
 */
export async function completeQuestOnChain(params: {
    questId: number;
    userAddress: `0x${string}`;
    txHash: `0x${string}`;
}) {
    const hash = await writeContract(config, {
        ...contracts.questManager,
        functionName: 'completeQuest',
        args: [BigInt(params.questId), params.userAddress, params.txHash],
    });

    const receipt = await waitForTransactionReceipt(config, { hash });
    return receipt;
}

/**
 * Get quest details from contract
 */
export async function getQuestFromContract(questId: number) {
    const quest = await readContract(config, {
        ...contracts.questManager,
        functionName: 'quests',
        args: [BigInt(questId)],
    });

    return quest;
}

/**
 * Check if user completed a quest
 */
export async function hasUserCompletedQuest(questId: number, userAddress: `0x${string}`) {
    const completed = await readContract(config, {
        ...contracts.questManager,
        functionName: 'hasUserCompletedQuest',
        args: [BigInt(questId), userAddress],
    });

    return completed as boolean;
}

/**
 * Mint a badge NFT to user
 */
export async function mintBadgeNFT(userAddress: `0x${string}`, badgeId: number) {
    const hash = await writeContract(config, {
        ...contracts.badgeNFT,
        functionName: 'mintBadge',
        args: [userAddress, BigInt(badgeId)],
    });

    const receipt = await waitForTransactionReceipt(config, { hash });
    return receipt;
}

/**
 * Get user's badge count
 */
export async function getUserBadgeCount(userAddress: `0x${string}`) {
    const count = await readContract(config, {
        ...contracts.badgeNFT,
        functionName: 'getUserBadgeCount',
        args: [userAddress],
    });

    return Number(count);
}

/**
 * Get all user's badges
 */
export async function getUserBadges(userAddress: `0x${string}`) {
    const badges = await readContract(config, {
        ...contracts.badgeNFT,
        functionName: 'getUserBadges',
        args: [userAddress],
    });

    return badges as bigint[];
}

/**
 * Check if user has specific badge
 */
export async function userHasBadge(userAddress: `0x${string}`, badgeId: number) {
    const hasBadge = await readContract(config, {
        ...contracts.badgeNFT,
        functionName: 'userHasBadge',
        args: [userAddress, BigInt(badgeId)],
    });

    return hasBadge as boolean;
}
