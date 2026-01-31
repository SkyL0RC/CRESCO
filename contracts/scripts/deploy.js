const hre = require("hardhat");

async function main() {
    console.log("Deploying Monad Flow contracts...");

    // Deploy QuestManager
    const QuestManager = await hre.ethers.getContractFactory("QuestManager");
    // Explicitly set high gas price for Monad Devnet
    const overrides = {
        gasPrice: 200000000000n // 200 Gwei
    };

    const questManager = await QuestManager.deploy(overrides);
    await questManager.waitForDeployment();
    const questManagerAddress = await questManager.getAddress();
    console.log("QuestManager deployed to:", questManagerAddress);

    // Deploy BadgeNFT
    const BadgeNFT = await hre.ethers.getContractFactory("BadgeNFT");
    const badgeNFT = await BadgeNFT.deploy(overrides);
    await badgeNFT.waitForDeployment();
    const badgeNFTAddress = await badgeNFT.getAddress();
    console.log("BadgeNFT deployed to:", badgeNFTAddress);

    // Save deployment info
    console.log("\n=== Deployment Summary ===");
    console.log("QuestManager:", questManagerAddress);
    console.log("BadgeNFT:", badgeNFTAddress);
    console.log("\nAdd these addresses to your .env file:");
    console.log(`NEXT_PUBLIC_QUEST_MANAGER_CONTRACT=${questManagerAddress}`);
    console.log(`NEXT_PUBLIC_BADGE_NFT_CONTRACT=${badgeNFTAddress}`);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
