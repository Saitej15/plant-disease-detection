import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Lock, Trash2, Bell, Eye, EyeOff } from 'lucide-react';
import { Navbar } from '../components/layout/Navbar';
import { useAuthStore } from '../store/authStore';
import { getInitials } from '../lib/utils';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

export function ProfilePage() {
    const { user } = useAuthStore();
    const [deleteInput, setDeleteInput] = useState('');
    const [showPass, setShowPass] = useState(false);
    const [newPass, setNewPass] = useState('');
    const [notifications, setNotifications] = useState({
        scan_complete: true,
        weekly_tips: true,
        disease_alerts: false,
    });

    const handleUpdatePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        const { error } = await supabase.auth.updateUser({ password: newPass });
        if (error) toast.error(error.message);
        else { toast.success('Password updated!'); setNewPass(''); }
    };

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
            <Navbar />
            <main style={{ maxWidth: 720, margin: '0 auto', padding: '96px 32px 64px' }}>
                <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 36, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 40 }}>
                    Profile & Settings
                </h1>

                {/* Avatar & Stats */}
                <div className="card" style={{ padding: 28, marginBottom: 24, display: 'flex', gap: 24, alignItems: 'center' }}>
                    <div style={{
                        width: 72, height: 72, borderRadius: 18,
                        background: 'linear-gradient(135deg, #4ade80, #16a34a)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 24, fontWeight: 700, color: '#080d0a',
                        flexShrink: 0,
                    }}>
                        {user?.full_name ? getInitials(user.full_name) : 'U'}
                    </div>
                    <div style={{ flex: 1 }}>
                        <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700 }}>
                            {user?.full_name || 'User'}
                        </div>
                        <div style={{ color: 'var(--text-muted)', fontSize: 14, marginTop: 2 }}>{user?.email}</div>
                        <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                            <span className="badge badge-green" style={{ textTransform: 'capitalize' }}>{user?.plan || 'free'} plan</span>
                        </div>
                    </div>
                </div>

                {/* Profile Info */}
                <div className="card" style={{ padding: 28, marginBottom: 24 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
                        <User size={16} color="#4ade80" />
                        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 600 }}>Personal Info</h2>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        <div>
                            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>Display Name</label>
                            <input className="input" type="text" defaultValue={user?.full_name || ''} />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>Email Address</label>
                            <div style={{ position: 'relative' }}>
                                <input className="input" type="email" value={user?.email || ''} disabled style={{ opacity: 0.6, paddingRight: 80 }} />
                                <span className="badge" style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'rgba(74,222,128,0.1)', color: 'var(--text-muted)', border: '1px solid var(--border)' }}>
                                    verified
                                </span>
                            </div>
                        </div>
                        <button className="btn-primary" style={{ alignSelf: 'flex-start' }}>Save Changes</button>
                    </div>
                </div>

                {/* Change Password */}
                <div className="card" style={{ padding: 28, marginBottom: 24 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
                        <Lock size={16} color="#4ade80" />
                        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 600 }}>Change Password</h2>
                    </div>
                    <form onSubmit={handleUpdatePassword} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        <div>
                            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>New Password</label>
                            <div style={{ position: 'relative' }}>
                                <input
                                    className="input"
                                    type={showPass ? 'text' : 'password'}
                                    placeholder="Min. 8 characters"
                                    value={newPass}
                                    onChange={e => setNewPass(e.target.value)}
                                    required
                                    minLength={8}
                                    style={{ paddingRight: 40 }}
                                />
                                <button type="button" onClick={() => setShowPass(v => !v)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', display: 'flex' }}>
                                    {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
                                </button>
                            </div>
                        </div>
                        <button type="submit" className="btn-ghost" style={{ alignSelf: 'flex-start' }}>Update Password</button>
                    </form>
                </div>

                {/* Notification Preferences */}
                <div className="card" style={{ padding: 28, marginBottom: 24 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
                        <Bell size={16} color="#4ade80" />
                        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 600 }}>Notifications</h2>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                        {([
                            { key: 'scan_complete' as const, label: 'Scan Complete', desc: 'Get notified when analysis finishes' },
                            { key: 'weekly_tips' as const, label: 'Weekly Plant Tips', desc: 'Personalized tips based on your plants' },
                            { key: 'disease_alerts' as const, label: 'Disease Alerts', desc: 'Seasonal disease and pest warnings' },
                        ]).map(({ key, label, desc }, i) => (
                            <div key={key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0', borderBottom: i < 2 ? '1px solid var(--border)' : 'none' }}>
                                <div>
                                    <div style={{ fontSize: 14, fontWeight: 500 }}>{label}</div>
                                    <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{desc}</div>
                                </div>
                                <button
                                    onClick={() => setNotifications(n => ({ ...n, [key]: !n[key] }))}
                                    style={{
                                        width: 44, height: 24, borderRadius: 12,
                                        background: notifications[key] ? '#4ade80' : 'var(--bg-secondary)',
                                        border: `1px solid ${notifications[key] ? '#4ade80' : 'var(--border)'}`,
                                        position: 'relative',
                                        transition: 'all 200ms',
                                    }}
                                >
                                    <motion.div
                                        animate={{ x: notifications[key] ? 20 : 2 }}
                                        style={{ position: 'absolute', top: 3, left: 0, width: 16, height: 16, borderRadius: '50%', background: '#fff' }}
                                        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                                    />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Danger Zone */}
                <div style={{ border: '1px solid rgba(239,68,68,0.2)', borderRadius: 16, padding: 28 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                        <Trash2 size={16} color="#ef4444" />
                        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 600, color: '#ef4444' }}>Danger Zone</h2>
                    </div>
                    <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 16, lineHeight: 1.6 }}>
                        Permanently delete your account and all scan data. This action cannot be undone.
                    </p>
                    <input
                        className="input"
                        placeholder='Type "DELETE" to confirm'
                        value={deleteInput}
                        onChange={e => setDeleteInput(e.target.value)}
                        style={{ marginBottom: 12, borderColor: deleteInput === 'DELETE' ? '#ef4444' : 'var(--border)' }}
                    />
                    <button
                        disabled={deleteInput !== 'DELETE'}
                        style={{
                            padding: '10px 20px',
                            background: 'rgba(239,68,68,0.1)',
                            border: '1px solid rgba(239,68,68,0.3)',
                            borderRadius: 10,
                            color: '#ef4444',
                            fontSize: 14,
                            fontWeight: 600,
                            opacity: deleteInput !== 'DELETE' ? 0.4 : 1,
                            transition: 'opacity 200ms',
                        }}
                    >
                        Delete My Account
                    </button>
                </div>
            </main>
        </div>
    );
}
