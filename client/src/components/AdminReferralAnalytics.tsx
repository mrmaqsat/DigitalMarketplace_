import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminReferralAnalytics = () => {
    const [analytics, setAnalytics] = useState({
        totalUsers: 0,
        totalReferrals: 0,
        activeReferrers: 0,
        averageReferralsPerUser: 0,
        topReferrers: []
    });
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const response = await axios.get('/api/admin/referral/analytics');
                setAnalytics(response.data);
            } catch (err) {
                setError(err);
            }
        };

        fetchAnalytics();
    }, []);

    if (error) {
        return <div className="error">Failed to load referral analytics.</div>;
    }

    return (
        <div className="admin-referral-analytics">
            <h2>Referral Analytics</h2>
            
            <div className="analytics-summary">
                <div className="stat">
                    <h3>Total Users</h3>
                    <p>{analytics.totalUsers}</p>
                </div>
                <div className="stat">
                    <h3>Total Referrals</h3>
                    <p>{analytics.totalReferrals}</p>
                </div>
                <div className="stat">
                    <h3>Active Referrers</h3>
                    <p>{analytics.activeReferrers}</p>
                </div>
                <div className="stat">
                    <h3>Average Referrals per User</h3>
                    <p>{analytics.averageReferralsPerUser.toFixed(2)}</p>
                </div>
            </div>

            <div className="top-referrers">
                <h3>Top Referrers</h3>
                <table>
                    <thead>
                        <tr>
                            <th>User</th>
                            <th>Referral Code</th>
                            <th>Total Referrals</th>
                        </tr>
                    </thead>
                    <tbody>
                        {analytics.topReferrers.map((referrer, index) => (
                            <tr key={index}>
                                <td>{referrer.fullName} ({referrer.username})</td>
                                <td>{referrer.referralCode}</td>
                                <td>{referrer.totalReferrals}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminReferralAnalytics;
