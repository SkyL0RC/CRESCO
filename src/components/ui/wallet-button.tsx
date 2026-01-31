'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Button } from '@/components/ui/button';
import { Loader2, Wallet } from 'lucide-react';

export function WalletButton() {
    return (
        <ConnectButton.Custom>
            {({
                account,
                chain,
                openAccountModal,
                openChainModal,
                openConnectModal,
                authenticationStatus,
                mounted,
            }) => {
                const ready = mounted && authenticationStatus !== 'loading';
                const connected =
                    ready &&
                    account &&
                    chain &&
                    (!authenticationStatus ||
                        authenticationStatus === 'authenticated');

                return (
                    <div
                        {...(!ready && {
                            'aria-hidden': true,
                            'style': {
                                opacity: 0,
                                pointerEvents: 'none',
                                userSelect: 'none',
                            },
                        })}
                    >
                        {(() => {
                            if (!connected) {
                                return (
                                    <button
                                        onClick={openConnectModal}
                                        type="button"
                                        className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200
                                                 bg-[#0066FF]/10 hover:bg-[#0066FF]/20 
                                                 border border-[#0066FF]/30 hover:border-[#0066FF]/50
                                                 text-[#0066FF] hover:text-[#0066FF]
                                                 backdrop-blur-md shadow-[0_0_15px_rgba(0,102,255,0.1)] hover:shadow-[0_0_20px_rgba(0,102,255,0.2)]"
                                    >
                                        <Wallet className="w-4 h-4" />
                                        Connect Wallet
                                    </button>
                                );
                            }

                            if (chain.unsupported) {
                                return (
                                    <button
                                        onClick={openChainModal}
                                        type="button"
                                        className="px-4 py-2 rounded-lg font-medium bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20 transition-all"
                                    >
                                        Wrong network
                                    </button>
                                );
                            }

                            return (
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={openChainModal}
                                        style={{ display: 'flex', alignItems: 'center' }}
                                        type="button"
                                        className="flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-all duration-200
                                                 bg-[#0066FF]/10 hover:bg-[#0066FF]/20 
                                                 border border-[#0066FF]/30 
                                                 text-white backdrop-blur-md"
                                    >
                                        {chain.hasIcon && (
                                            <div
                                                style={{
                                                    background: chain.iconBackground,
                                                    width: 18,
                                                    height: 18,
                                                    borderRadius: 999,
                                                    overflow: 'hidden',
                                                    marginRight: 4,
                                                }}
                                            >
                                                {chain.iconUrl && (
                                                    <img
                                                        alt={chain.name ?? 'Chain icon'}
                                                        src={chain.iconUrl}
                                                        style={{ width: 18, height: 18 }}
                                                    />
                                                )}
                                            </div>
                                        )}
                                        {chain.name}
                                    </button>

                                    <button
                                        onClick={openAccountModal}
                                        type="button"
                                        className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200
                                                 bg-[#0066FF]/10 hover:bg-[#0066FF]/20 
                                                 border border-[#0066FF]/30 hover:border-[#0066FF]/50
                                                 text-white
                                                 backdrop-blur-md shadow-[0_0_15px_rgba(0,102,255,0.1)] hover:shadow-[0_0_20px_rgba(0,102,255,0.2)]"
                                    >
                                        {account.displayName}
                                        {account.displayBalance
                                            ? ` (${account.displayBalance})`
                                            : ''}
                                    </button>
                                </div>
                            );
                        })()}
                    </div>
                );
            }}
        </ConnectButton.Custom>
    );
}
