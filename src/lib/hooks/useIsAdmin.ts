import { useAccount } from 'wagmi';

export function useIsAdmin() {
    const { address, isConnected } = useAccount();
    const adminWallet = process.env.NEXT_PUBLIC_ADMIN_WALLET?.toLowerCase();

    if (!isConnected || !address || !adminWallet) return false;

    return address.toLowerCase() === adminWallet;
}
