import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { Toaster } from "@/components/ui/sonner";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import NeuralBackground from "@/components/ui/flow-field-background";

const spaceGrotesk = Space_Grotesk({
    subsets: ["latin"],
    variable: "--font-space-grotesk",
});

export const metadata: Metadata = {
    title: "CRESCO - Real Users. Real Yield. Zero Bots.",
    description: "Performance-based user acquisition platform on Monad Blockchain",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className="dark">
            <body className={`${spaceGrotesk.variable} bg-transparent font-sans antialiased`}>
                <div className="fixed inset-0 z-0 h-full w-full">
                    <NeuralBackground
                        color="#0066FF"
                        speed={0.8}
                        trailOpacity={0.15}
                        particleCount={400}
                    />
                </div>
                <div className="relative z-10">
                    <ErrorBoundary>
                        <Providers>
                            {children}
                        </Providers>
                        <Toaster />
                    </ErrorBoundary>
                </div>
            </body>
        </html>
    );
}
