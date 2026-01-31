'use client';

import { useNotifications } from '@/lib/hooks/useNotifications';
import { Bell } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function NotificationBell() {
    const {
        unreadCount,
        recentUnread,
        markAsRead,
        markAllAsRead
    } = useNotifications();

    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="relative">
            {/* Bell Icon */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {/* Notifications Dropdown */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <div
                            className="fixed inset-0 z-40"
                            onClick={() => setIsOpen(false)}
                        />

                        {/* Dropdown */}
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="absolute right-0 mt-2 w-96 bg-[#1A1A1D] border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden"
                        >
                            {/* Header */}
                            <div className="p-4 border-b border-white/10 flex justify-between items-center">
                                <h3 className="font-semibold text-white">Notifications</h3>
                                {unreadCount > 0 && (
                                    <button
                                        onClick={() => markAllAsRead()}
                                        className="text-xs text-[#0066FF] hover:text-[#0066FF] transition-colors"
                                    >
                                        Mark all as read
                                    </button>
                                )}
                            </div>

                            {/* Notifications List */}
                            <div className="max-h-96 overflow-y-auto">
                                {recentUnread.length === 0 ? (
                                    <div className="p-8 text-center text-gray-400">
                                        <Bell className="w-12 h-12 mx-auto mb-2 opacity-20" />
                                        <p>No new notifications</p>
                                    </div>
                                ) : (
                                    recentUnread.map((notification) => (
                                        <div
                                            key={notification.id}
                                            className={`p-4 border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer ${!notification.is_read ? 'bg-[#0066FF]/5' : ''
                                                }`}
                                            onClick={() => {
                                                markAsRead(notification.id);
                                            }}
                                        >
                                            {/* Notification Icon */}
                                            <div className="flex gap-3">
                                                <div className="flex-shrink-0">
                                                    {notification.type === 'quest_completed' && '🎉'}
                                                    {notification.type === 'badge_earned' && '🏆'}
                                                    {notification.type === 'reward_received' && '💰'}
                                                    {notification.type === 'system' && '📢'}
                                                    {notification.type === 'project_approved' && '✅'}
                                                </div>

                                                {/* Content */}
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium text-white mb-1">
                                                        {notification.title}
                                                    </p>
                                                    <p className="text-xs text-gray-400 line-clamp-2">
                                                        {notification.message}
                                                    </p>
                                                    <p className="text-xs text-gray-500 mt-1">
                                                        {new Date(notification.created_at).toLocaleDateString('tr-TR', {
                                                            hour: '2-digit',
                                                            minute: '2-digit',
                                                        })}
                                                    </p>
                                                </div>

                                                {/* Unread Indicator */}
                                                {!notification.is_read && (
                                                    <div className="flex-shrink-0">
                                                        <div className="w-2 h-2 bg-[#0066FF] rounded-full" />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>

                            {/* Footer */}
                            {recentUnread.length > 0 && (
                                <div className="p-3 bg-white/5 text-center">
                                    <button
                                        onClick={() => setIsOpen(false)}
                                        className="text-xs text-gray-400 hover:text-white transition-colors"
                                    >
                                        Close
                                    </button>
                                </div>
                            )}
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
