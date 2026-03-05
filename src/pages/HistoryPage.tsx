import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Trash2, Eye, Leaf } from 'lucide-react';
import { Navbar } from '../components/layout/Navbar';
import { getHealthColor, getSeverityBadgeClass, formatDate } from '../lib/utils';
import type { Scan } from '../types';

const PAGE_SIZE = 12;

export function HistoryPage() {
    const [scans, setScans] = useState<Scan[]>([]);
    const [query, setQuery] = useState('');
    const [filter, setFilter] = useState<'all' | 'healthy' | 'diseased'>('all');
    const [sort, setSort] = useState<'newest' | 'oldest' | 'score'>('newest');
    const [page, setPage] = useState(1);

    useEffect(() => {
        const stored: Scan[] = JSON.parse(localStorage.getItem('plantiq_scans') || '[]');
        setScans(stored);
    }, []);

    const deleteScan = (id: string) => {
        const updated = scans.filter(s => s.id !== id);
        setScans(updated);
        localStorage.setItem('plantiq_scans', JSON.stringify(updated));
    };

    const filtered = scans
        .filter(s => s.plant_name.toLowerCase().includes(query.toLowerCase()))
        .filter(s => filter === 'all' ? true : filter === 'healthy' ? !s.disease_detected : s.disease_detected)
        .sort((a, b) => {
            if (sort === 'newest') return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
            if (sort === 'oldest') return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
            return b.health_score - a.health_score;
        });

    const pageCount = Math.ceil(filtered.length / PAGE_SIZE);
    const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
            <Navbar />
            <main style={{ maxWidth: 1280, margin: '0 auto', padding: '96px 32px 64px' }}>
                <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 36, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 8 }}>
                    Scan History
                </h1>
                <p style={{ color: 'var(--text-muted)', marginBottom: 32 }}>{scans.length} plants analyzed</p>

                {/* Filters */}
                <div style={{ display: 'flex', gap: 12, marginBottom: 32, flexWrap: 'wrap', alignItems: 'center' }}>
                    <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
                        <Search size={14} color="var(--text-muted)" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
                        <input
                            className="input"
                            placeholder="Search by plant name..."
                            value={query}
                            onChange={e => { setQuery(e.target.value); setPage(1); }}
                            style={{ paddingLeft: 36 }}
                        />
                    </div>
                    <div style={{ display: 'flex', gap: 6 }}>
                        {(['all', 'healthy', 'diseased'] as const).map(f => (
                            <button
                                key={f}
                                onClick={() => { setFilter(f); setPage(1); }}
                                style={{
                                    padding: '8px 14px',
                                    borderRadius: 10,
                                    border: `1px solid ${filter === f ? 'rgba(74,222,128,0.4)' : 'var(--border)'}`,
                                    background: filter === f ? 'rgba(74,222,128,0.08)' : 'transparent',
                                    color: filter === f ? '#4ade80' : 'var(--text-muted)',
                                    fontSize: 13,
                                    fontWeight: filter === f ? 600 : 400,
                                    textTransform: 'capitalize',
                                    transition: 'all 200ms',
                                }}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                    <select
                        value={sort}
                        onChange={e => setSort(e.target.value as typeof sort)}
                        className="input"
                        style={{ width: 'auto', padding: '8px 14px' }}
                    >
                        <option value="newest">Newest First</option>
                        <option value="oldest">Oldest First</option>
                        <option value="score">Health Score</option>
                    </select>
                </div>

                {/* Grid */}
                {paged.length === 0 ? (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: 'center', padding: '96px 32px' }}>
                        <div style={{ width: 80, height: 80, background: 'rgba(74,222,128,0.06)', borderRadius: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                            <Leaf size={36} color="rgba(74,222,128,0.3)" />
                        </div>
                        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 22, marginBottom: 8 }}>No scans yet</h3>
                        <p style={{ color: 'var(--text-muted)', marginBottom: 24 }}>Upload your first plant image to get started.</p>
                        <Link to="/scan"><button className="btn-primary">Scan a Plant</button></Link>
                    </motion.div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 20, marginBottom: 32 }}>
                        {paged.map((scan, i) => (
                            <motion.div
                                key={scan.id}
                                initial={{ opacity: 0, y: 16 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 }}
                                className="card"
                                style={{ overflow: 'hidden', position: 'relative' }}
                            >
                                {/* Hover action overlay */}
                                <div
                                    style={{
                                        position: 'absolute',
                                        inset: 0,
                                        background: 'rgba(8,13,10,0.7)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: 8,
                                        opacity: 0,
                                        transition: 'opacity 200ms',
                                        zIndex: 2,
                                        borderRadius: 14,
                                    }}
                                    onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
                                    onMouseLeave={e => (e.currentTarget.style.opacity = '0')}
                                >
                                    <Link to={`/results/${scan.id}`}>
                                        <button className="btn-primary" style={{ padding: '8px 14px', gap: 6, fontSize: 12 }}>
                                            <Eye size={12} /> View
                                        </button>
                                    </Link>
                                    <button
                                        onClick={() => deleteScan(scan.id)}
                                        style={{ width: 34, height: 34, background: 'rgba(239,68,68,0.2)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ef4444' }}
                                    >
                                        <Trash2 size={13} />
                                    </button>
                                </div>

                                {/* Image */}
                                <div style={{ height: 140, background: 'var(--bg-secondary)', overflow: 'hidden' }}>
                                    {scan.image_url ? (
                                        <img src={scan.image_url} alt={scan.plant_name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    ) : (
                                        <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <Leaf size={32} color="rgba(74,222,128,0.2)" />
                                        </div>
                                    )}
                                </div>

                                {/* Info */}
                                <div style={{ padding: 16 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                                        <div>
                                            <div style={{ fontSize: 14, fontWeight: 600 }}>{scan.plant_name}</div>
                                            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{formatDate(scan.created_at)}</div>
                                        </div>
                                        <span className={`badge ${getSeverityBadgeClass(scan.severity || 'none')}`}>
                                            {scan.disease_detected ? 'Disease' : 'Healthy'}
                                        </span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                        <div style={{ flex: 1, height: 4, background: 'var(--bg-secondary)', borderRadius: 2 }}>
                                            <div style={{ height: '100%', width: `${scan.health_score}%`, background: getHealthColor(scan.health_score), borderRadius: 2 }} />
                                        </div>
                                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: getHealthColor(scan.health_score) }}>
                                            {scan.health_score}
                                        </span>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {pageCount > 1 && (
                    <div style={{ display: 'flex', justifyContent: 'center', gap: 6 }}>
                        {Array.from({ length: pageCount }, (_, i) => i + 1).map(p => (
                            <button
                                key={p}
                                onClick={() => setPage(p)}
                                style={{
                                    width: 36, height: 36, borderRadius: 9,
                                    background: p === page ? '#4ade80' : 'var(--bg-card)',
                                    border: `1px solid ${p === page ? '#4ade80' : 'var(--border)'}`,
                                    color: p === page ? '#080d0a' : 'var(--text-muted)',
                                    fontSize: 13, fontWeight: p === page ? 700 : 400,
                                    transition: 'all 200ms',
                                }}
                            >{p}</button>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
