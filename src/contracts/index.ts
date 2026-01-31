// Contract addresses - Update after deployment
export const QUEST_MANAGER_ADDRESS = (process.env.NEXT_PUBLIC_QUEST_MANAGER_CONTRACT || '0x5FbDB2315678afecb367f032d93F642f64180aa3') as `0x${string}`;
export const BADGE_NFT_ADDRESS = (process.env.NEXT_PUBLIC_BADGE_NFT_CONTRACT || '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512') as `0x${string}`;

// Import ABIs
import QuestManagerArtifact from './abis/QuestManager.json';
import BadgeNFTArtifact from './abis/BadgeNFT.json';

// Export ABIs
export const QuestManagerABI = QuestManagerArtifact.abi;
export const BadgeNFTABI = BadgeNFTArtifact.abi;

// Contract config for wagmi
export const contracts = {
    questManager: {
        address: QUEST_MANAGER_ADDRESS,
        abi: QuestManagerABI,
    },
    badgeNFT: {
        address: BADGE_NFT_ADDRESS,
        abi: BadgeNFTABI,
    },
} as const;
