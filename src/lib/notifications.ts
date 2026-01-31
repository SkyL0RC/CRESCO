'use client';

import { toast } from 'sonner';

type NotificationType = 'success' | 'error' | 'info' | 'warning';

interface NotificationProps {
    title: string;
    message: string;
    type?: NotificationType;
}

export const showNotification = ({ title, message, type = 'info' }: NotificationProps) => {
    switch (type) {
        case 'success':
            toast.success(title, { description: message });
            break;
        case 'error':
            toast.error(title, { description: message });
            break;
        case 'warning':
            toast.warning(title, { description: message });
            break;
        default:
            toast.info(title, { description: message });
    }
};
