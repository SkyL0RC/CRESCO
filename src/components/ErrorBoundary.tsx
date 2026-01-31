'use client';

import React, { Component, ReactNode } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error?: Error;
    errorInfo?: React.ErrorInfo;
}

export class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error('Error caught by boundary:', error, errorInfo);
        this.setState({ errorInfo });

        // TODO: Send to error tracking service (Sentry, LogRocket, etc.)
        // logErrorToService(error, errorInfo);
    }

    handleReset = () => {
        this.setState({ hasError: false, error: undefined, errorInfo: undefined });
    };

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <div className="flex flex-col items-center justify-center min-h-screen bg-[#0E0E10] text-white p-8">
                    {/* Animated Background */}
                    <div className="absolute inset-0 z-0">
                        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#0066FF] rounded-full blur-[120px] opacity-10" />
                        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#0066FF] rounded-full blur-[120px] opacity-10" />
                    </div>

                    <div className="relative z-10 max-w-2xl w-full glass-card rounded-2xl p-12 text-center">
                        {/* Error Icon */}
                        <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                            <AlertCircle className="w-12 h-12 text-red-500" />
                        </div>

                        {/* Error Title */}
                        <h1 className="text-3xl font-bold mb-3">Something went wrong</h1>

                        {/* Error Message */}
                        <p className="text-gray-400 mb-6">
                            {this.state.error?.message || 'An unexpected error occurred'}
                        </p>

                        {/* Error Details (Development only) */}
                        {process.env.NODE_ENV === 'development' && this.state.errorInfo && (
                            <details className="mb-6 text-left bg-black/20 rounded-lg p-4 max-h-60 overflow-auto">
                                <summary className="cursor-pointer text-sm font-medium mb-2 hover:text-[#0066FF] transition-colors">
                                    Error Details (Dev Mode)
                                </summary>
                                <pre className="text-xs text-gray-500 whitespace-pre-wrap break-words">
                                    {this.state.error?.stack}
                                    {'\n\n'}
                                    {this.state.errorInfo.componentStack}
                                </pre>
                            </details>
                        )}

                        {/* Action Buttons */}
                        <div className="flex gap-4 justify-center">
                            <button
                                onClick={this.handleReset}
                                className="flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                            >
                                <RefreshCw className="w-4 h-4" />
                                Try Again
                            </button>
                            <button
                                onClick={() => window.location.href = '/'}
                                className="px-6 py-3 bg-gradient-to-r from-[#0066FF] to-[#0066FF] rounded-lg hover:opacity-90 transition-opacity"
                            >
                                Go to Homepage
                            </button>
                        </div>

                        {/* Help Text */}
                        <p className="text-sm text-gray-500 mt-6">
                            If this problem persists, please contact support
                        </p>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
