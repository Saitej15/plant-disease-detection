import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Leaf } from 'lucide-react';
import { Navbar } from '../components/layout/Navbar';

const POPULAR_PLANTS = [
    { name: 'Tomato', family: 'Solanaceae', difficulty: 'easy', emoji: '🍅' },
    { name: 'Rose', family: 'Rosaceae', difficulty: 'medium', emoji: '🌹' },
    { name: 'Basil', family: 'Lamiaceae', difficulty: 'easy', emoji: '🌿' },
    { name: 'Orchid', family: 'Orchidaceae', difficulty: 'hard', emoji: '🌺' },
    { name: 'Aloe Vera', family: 'Asphodelaceae', difficulty: 'easy', emoji: '🪴' },
    { name: 'Lavender', family: 'Lamiaceae', difficulty: 'easy', emoji: '💜' },
    { name: 'Sunflower', family: 'Asteraceae', difficulty: 'easy', emoji: '🌻' },
    { name: 'Mint', family: 'Lamiaceae', difficulty: 'easy', emoji: '🌱' },
];

const DIFFICULTY_COLORS: Record<string, string> = {
    easy: '#4ade80',
    medium: '#f59e0b',
    hard: '#ef4444',
};

export function EncyclopediaPage() {
    const [query, setQuery] = useState('');
    const filtered = POPULAR_PLANTS.filter(p =>
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.family.toLowerCase().includes(query.toLowerCase())
    );

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
            <Navbar />
            <main style={{ maxWidth: 1200, margin: '0 auto', padding: '96px 32px 64px' }}>
                {/* Hero search */}
                <div style={{ textAlign: 'center', maxWidth: 600, margin: '0 auto 64px', paddingTop: 24 }}>
                    <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 44, fontWeight: 700, letterSpacing: '-0.03em', marginBottom: 16 }}>
                        Plant Encyclopedia
                    </h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: 16, marginBottom: 28 }}>
                        Discover care guides, growing tips, and expert insights for thousands of plants.
                    </p>
                    <div style={{ position: 'relative' }}>
                        <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', left: 18, top: '50%', transform: 'translateY(-50%)' }} />
                        <input
                            className="input"
                            placeholder="Search plants by name or family..."
                            value={query}
                            onChange={e => setQuery(e.target.value)}
                            style={{ paddingLeft: 48, paddingRight: 20, fontSize: 16, borderRadius: 14, padding: '16px 20px 16px 48px' }}
                        />
                    </div>
                </div>

                {/* Popular Plants Header */}
                {!query && (
                    <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 600, marginBottom: 20 }}>
                        Popular Plants
                    </h2>
                )}

                {/* Plant Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 20 }}>
                    {filtered.map((plant, i) => (
                        <motion.div
                            key={plant.name}
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.06 }}
                            className="card"
                            style={{ padding: 24, cursor: 'pointer' }}
                        >
                            <div style={{ fontSize: 48, marginBottom: 16, lineHeight: 1 }}>{plant.emoji}</div>
                            <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 600, marginBottom: 4 }}>
                                {plant.name}
                            </div>
                            <div style={{ fontSize: 13, color: 'var(--text-muted)', fontStyle: 'italic', marginBottom: 12 }}>
                                {plant.family}
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span
                                    className="badge"
                                    style={{
                                        background: `${DIFFICULTY_COLORS[plant.difficulty]}18`,
                                        color: DIFFICULTY_COLORS[plant.difficulty],
                                        border: `1px solid ${DIFFICULTY_COLORS[plant.difficulty]}30`,
                                        textTransform: 'capitalize',
                                    }}
                                >
                                    {plant.difficulty}
                                </span>
                                <span style={{ fontSize: 12, color: '#4ade80', display: 'flex', alignItems: 'center', gap: 4 }}>
                                    <Leaf size={10} /> Care guide
                                </span>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {filtered.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '64px 32px' }}>
                        <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
                        <p style={{ color: 'var(--text-muted)', fontSize: 16 }}>
                            No plants found for "<strong>{query}</strong>". Try scanning a plant to identify it!
                        </p>
                    </div>
                )}
            </main>
        </div>
    );
}
