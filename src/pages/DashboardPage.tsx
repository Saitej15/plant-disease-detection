import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Leaf, AlertTriangle, CheckCircle, Activity, Camera } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useAuthStore } from '../store/authStore';
import { Navbar } from '../components/layout/Navbar';
import { formatRelativeDate, getHealthColor, getSeverityBadgeClass } from '../lib/utils';
import type { Scan } from '../types';

// Demo data for UI (replaced by real API calls when backend is connected)
const demoScans: Scan[] = [
    {
        id: '1', user_id: 'u1', image_url: '', plant_name: 'Tomato',
        scientific_name: 'Solanum lycopersicum', confidence: 97, health_score: 32,
        growth_stage: 'vegetative', disease_detected: true, disease_name: 'Late Blight',
        severity: 'severe', created_at: new Date(Date.now() - 86400000).toISOString(),
        full_analysis: {} as never,
    },
    {
        id: '2', user_id: 'u1', image_url: '', plant_name: 'Basil',
        scientific_name: 'Ocimum basilicum', confidence: 99, health_score: 88,
        growth_stage: 'flowering', disease_detected: false, disease_name: undefined,
        severity: 'none', created_at: new Date(Date.now() - 172800000).toISOString(),
        full_analysis: {} as never,
    },
    {
        id: '3', user_id: 'u1', image_url: '', plant_name: 'Rose',
        scientific_name: 'Rosa damascena', confidence: 94, health_score: 61,
        growth_stage: 'flowering', disease_detected: true, disease_name: 'Black Spot',
        severity: 'mild', created_at: new Date(Date.now() - 259200000).toISOString(),
        full_analysis: {} as never,
    },
];

const demoChartData = Array.from({ length: 14 }, (_, i) => ({
    date: new Date(Date.now() - (13 - i) * 86400000).toLocaleDateString('en', { month: 'short', day: 'numeric' }),
    score: Math.floor(55 + Math.random() * 35),
}));

function StatCard({ icon: Icon, label, value, trend, color }: {
    icon: React.ElementType;
    label: string;
    value: string | number;
    trend?: string;
    color?: string;
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="card"
            style={{ padding: 24 }}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                <div style={{
                    width: 36, height: 36, borderRadius: 9,
                    background: `${color || '#4ade80'}18`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                    <Icon size={16} color={color || '#4ade80'} />
                </div>
                {trend && (
                    <span style={{ fontSize: 12, color: trend.startsWith('+') ? '#4ade80' : '#ef4444', display: 'flex', alignItems: 'center', gap: 2 }}>
                        {trend.startsWith('+') ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                        {trend}
                    </span>
                )}
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 28, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>
                {value}
            </div>
            <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>{label}</div>
        </motion.div>
    );
}

const tips = [
    "Water in the morning to prevent fungal diseases by allowing foliage to dry during the day.",
    "Check the underside of leaves weekly — most pests hide there and are caught early.",
    "Yellowing lower leaves often indicate nitrogen deficiency — add balanced fertilizer.",
];

export function DashboardPage() {
    const { user } = useAuthStore();
    const [tipIdx, setTipIdx] = useState(0);
    const hour = new Date().getHours();
    const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
            <Navbar />

            <main style={{ paddingTop: 80, maxWidth: 1280, margin: '0 auto', padding: '80px 32px 64px' }}>
                {/* Welcome banner */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 40, flexWrap: 'wrap', gap: 16 }}>
                    <div>
                        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 700, letterSpacing: '-0.02em' }}>
                            {greeting}, <span style={{ color: '#4ade80' }}>{user?.full_name?.split(' ')[0] || 'there'}</span> 👋
                        </h1>
                        <p style={{ color: 'var(--text-muted)', marginTop: 4, fontSize: 14 }}>
                            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                        </p>
                    </div>
                    <Link to="/scan">
                        <button
                            className="btn-primary"
                            style={{ padding: '12px 24px', gap: 8, boxShadow: '0 0 30px rgba(74,222,128,0.25)' }}
                        >
                            <Camera size={16} /> Scan a Plant
                        </button>
                    </Link>
                </div>

                {/* Stats row */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20, marginBottom: 40 }}>
                    <StatCard icon={Activity} label="Total Scans" value="3" trend="+2" />
                    <StatCard icon={CheckCircle} label="Healthy Plants" value="1" color="#4ade80" trend="+1" />
                    <StatCard icon={AlertTriangle} label="Diseases Detected" value="2" color="#ef4444" trend="+2" />
                    <StatCard icon={Leaf} label="Plants Identified" value="3" trend="+3" />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24, marginBottom: 24 }}>
                    {/* Health trend chart */}
                    <div className="card" style={{ padding: 24 }}>
                        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 600, marginBottom: 20 }}>
                            Health Score Trend
                        </h3>
                        <ResponsiveContainer width="100%" height={200}>
                            <AreaChart data={demoChartData}>
                                <defs>
                                    <linearGradient id="greenGrad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#4ade80" stopOpacity={0.2} />
                                        <stop offset="95%" stopColor="#4ade80" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="date" tick={{ fontSize: 10, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                                <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                                <Tooltip
                                    contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12 }}
                                    labelStyle={{ color: 'var(--text-muted)' }}
                                    itemStyle={{ color: '#4ade80' }}
                                />
                                <Area type="monotone" dataKey="score" stroke="#4ade80" strokeWidth={2} fill="url(#greenGrad)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Quick tips */}
                    <div className="card" style={{ padding: 24, display: 'flex', flexDirection: 'column' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 600 }}>
                                💡 Plant Care Tip
                            </h3>
                            <div style={{ display: 'flex', gap: 4 }}>
                                <button
                                    onClick={() => setTipIdx((i) => (i - 1 + tips.length) % tips.length)}
                                    style={{ width: 28, height: 28, background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: 12 }}>
                                    ‹
                                </button>
                                <button
                                    onClick={() => setTipIdx((i) => (i + 1) % tips.length)}
                                    style={{ width: 28, height: 28, background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: 12 }}>
                                    ›
                                </button>
                            </div>
                        </div>
                        <motion.p
                            key={tipIdx}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7, flex: 1 }}
                        >
                            {tips[tipIdx]}
                        </motion.p>
                        <div style={{ display: 'flex', gap: 4, marginTop: 16 }}>
                            {tips.map((_, i) => (
                                <div key={i} style={{ height: 3, flex: 1, borderRadius: 2, background: i === tipIdx ? '#4ade80' : 'var(--border)', transition: 'background 300ms' }} />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Recent scans table */}
                <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                    <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 600 }}>Recent Scans</h3>
                        <Link to="/history" style={{ fontSize: 13, color: '#4ade80', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
                            View all <TrendingUp size={12} />
                        </Link>
                    </div>
                    <div>
                        {/* Header */}
                        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 120px', padding: '10px 24px', borderBottom: '1px solid var(--border)', fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                            <span>Plant</span>
                            <span>Status</span>
                            <span>Health Score</span>
                            <span>Date</span>
                            <span>Action</span>
                        </div>
                        {demoScans.map((scan, i) => (
                            <motion.div
                                key={scan.id}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: i * 0.08 }}
                                className="table-row"
                                style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 120px', padding: '14px 24px', alignItems: 'center' }}
                            >
                                <div>
                                    <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>{scan.plant_name}</div>
                                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{scan.scientific_name}</div>
                                </div>
                                <span className={`badge ${getSeverityBadgeClass(scan.severity || 'none')}`}>
                                    {scan.disease_detected ? (scan.severity === 'severe' ? 'Severe' : 'Mild') : 'Healthy'}
                                </span>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <div style={{ flex: 1, height: 4, background: 'var(--bg-secondary)', borderRadius: 2, maxWidth: 80 }}>
                                        <div style={{ height: '100%', width: `${scan.health_score}%`, background: getHealthColor(scan.health_score), borderRadius: 2 }} />
                                    </div>
                                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: getHealthColor(scan.health_score) }}>
                                        {scan.health_score}
                                    </span>
                                </div>
                                <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>{formatRelativeDate(scan.created_at)}</span>
                                <Link to={`/results/${scan.id}`}>
                                    <button className="btn-ghost" style={{ padding: '6px 12px', fontSize: 12 }}>View</button>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
}
