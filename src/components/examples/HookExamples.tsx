// Example: Using useDailyCheckin hook in dashboard
import { useDailyCheckin } from '@/lib/hooks/useDailyCheckin';

function DashboardCheckin() {
    const { checkin, hasCheckedInToday, currentStreak, isCheckingIn } = useDailyCheckin();

    return (
        <div className="card">
            <h3>Daily Check-in</h3>
            <p>Current Streak: {currentStreak} days</p>
            <button
                onClick={() => checkin()}
                disabled={hasCheckedInToday || isCheckingIn}
                className="btn-primary"
            >
                {hasCheckedInToday ? 'Already Checked In' : 'Check In Today'}
            </button>
        </div>
    );
}

// Example: Using useStaking hook
import { useStaking } from '@/lib/hooks/useStaking';

function StakingCard() {
    const { stake, unstake, activeStakes, totalStaked, isLoading } = useStaking();

    const handleStake = async () => {
        const amount = 100; // MON tokens
        const durationDays = 30; // days
        await stake({ amount, durationDays });
    };

    const handleUnstake = async (stakeId: string) => {
        await unstake(stakeId);
    };

    return (
        <div className="card">
            <h3>Staking</h3>
            <p>Total Staked: {totalStaked} MON</p>
            <button onClick={handleStake} disabled={isLoading}>
                Stake 100 MON (30 days)
            </button>

            {activeStakes?.map((s) => (
                <div key={s.id}>
                    <p>{s.amount} MON - {s.duration_days} days</p>
                    <button onClick={() => handleUnstake(s.id)}>Unstake</button>
                </div>
            ))}
        </div>
    );
}

// Example: Using useNotifications hook
import { useNotifications } from '@/lib/hooks/useNotifications';

function NotificationBell() {
    const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();

    return (
        <div className="notifications">
            <button className="bell-icon">
                🔔 {unreadCount > 0 && <span>{unreadCount}</span>}
            </button>

            <div className="notifications-dropdown">
                <button onClick={() => markAllAsRead()}>Mark All Read</button>
                {notifications?.map(notif => (
                    <div
                        key={notif.id}
                        className={notif.is_read ? 'read' : 'unread'}
                        onClick={() => markAsRead(notif.id)}
                    >
                        <h4>{notif.title}</h4>
                        <p>{notif.message}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export { DashboardCheckin, StakingCard, NotificationBell };
