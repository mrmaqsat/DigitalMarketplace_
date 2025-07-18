import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ReferralDashboard = () => {
    const [referralLink, setReferralLink] = useState('');
    const [referralStats, setReferralStats] = useState({ totalReferrals: 0, recentReferrals: [] });
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchReferralData = async () => {
            try {
                const linkResponse = await axios.get('/api/referral/link');
                setReferralLink(linkResponse.data.referralLink);

                const statsResponse = await axios.get('/api/referral/stats');
                setReferralStats(statsResponse.data);
            } catch (err) {
                setError(err);
            }
        };

        fetchReferralData();
    }, []);

    return (
        <div className="referral-dashboard">
            <h2>Your Referral Dashboard</h2>
            {error && <p className="error">Failed to load referral data.</p>}
            <div className="referral-link">
                <strong>Referral Link: </strong>
                <a href={referralLink}>{referralLink}</a>
                <p>Share this link to refer new users and earn rewards!</p>
            </div>
            <div className="referral-stats">
                <h3>Referral Stats</h3>
                <p>Total Referrals: {referralStats.totalReferrals}</p>
                <h4>Recent Referrals</h4>
                <ul>
                    {referralStats.recentReferrals.map((referral, index) => (
                        <li key={index}>{referral.fullName} joined on {new Date(referral.createdAt).toLocaleDateString()}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default ReferralDashboard;
