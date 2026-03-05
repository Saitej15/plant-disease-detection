import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Microscope, Zap, BarChart3, Shield, Leaf, Star, ChevronRight, ArrowRight, Play, Languages } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useLanguageStore, LANGUAGES, type Language } from '../store/languageStore';

const features = [
    {
        icon: Microscope,
        title: 'Disease Detection',
        desc: 'Identify 180+ plant diseases with clinical precision using Google Gemini Vision AI.',
        accent: '#4ade80',
    },
    {
        icon: Zap,
        title: 'Instant Analysis',
        desc: 'Get complete plant health reports in under 10 seconds. Upload, scan, treat.',
        accent: '#f59e0b',
    },
    {
        icon: BarChart3,
        title: 'Growth Analytics',
        desc: 'Track growth stages, nutrient levels, and health trends over time.',
        accent: '#4ade80',
    },
    {
        icon: Shield,
        title: 'Treatment Plans',
        desc: 'Receive expert-curated immediate actions, natural remedies, and chemical treatments.',
        accent: '#60a5fa',
    },
    {
        icon: Leaf,
        title: 'Care Prescriptions',
        desc: 'Get personalized watering, sunlight, soil, and fertilizer schedules.',
        accent: '#4ade80',
    },
    {
        icon: Star,
        title: 'PDF Reports',
        desc: 'Export professional-grade analysis reports for agronomists and farm records.',
        accent: '#a78bfa',
    },
];

const steps = [
    { num: '01', title: 'Upload Image', desc: 'Drag & drop or take a photo of your plant.' },
    { num: '02', title: 'AI Analysis', desc: 'Gemini Vision AI scans for diseases, growth stage, and health.' },
    { num: '03', title: 'Get Prescription', desc: 'Receive a full treatment plan and personalized care guide.' },
];

const testimonials = [
    {
        quote: "PlantIQ diagnosed late blight on my tomatoes before I could see it with the naked eye. Saved the entire season.",
        name: "Marcus T.",
        role: "Commercial Farmer, California",
    },
    {
        quote: "The precision of the analysis is remarkable. I've recommended it to all my botany students.",
        name: "Dr. Sarah Chen",
        role: "Professor of Horticulture, MIT",
    },
    {
        quote: "Finally, an app that takes plant care seriously. The treatment tabs (natural vs chemical) are brilliant.",
        name: "Priya K.",
        role: "Rooftop Garden Enthusiast",
    },
];

const plans = [
    { name: 'Free', price: 0, scans: '10 scans/month', features: ['Disease detection', 'Growth analysis', 'Basic reports'], highlight: false },
    { name: 'Pro', price: 9, scans: 'Unlimited scans', features: ['Everything in Free', 'PDF export', 'Scan history', 'Priority AI'], highlight: true },
    { name: 'Enterprise', price: null, scans: 'Custom volume', features: ['Everything in Pro', 'API access', 'Team features', 'Dedicated support'], highlight: false },
];

export function LandingPage() {
    const { language, setLanguage } = useLanguageStore();
    const [langDropdownOpen, setLangDropdownOpen] = useState(false);
    const langDropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (langDropdownRef.current && !langDropdownRef.current.contains(e.target as Node)) {
                setLangDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    return (
        <div style={{ background: 'var(--bg-primary)', minHeight: '100vh' }}>
            {/* Top Nav */}
            <header style={{
                position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
                borderBottom: '1px solid var(--border)',
                background: 'rgba(8,13,10,0.8)',
                backdropFilter: 'blur(20px)',
            }}>
                <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 32px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ width: 30, height: 30, background: 'rgba(74,222,128,0.15)', border: '1px solid rgba(74,222,128,0.3)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Leaf size={14} color="#4ade80" />
                        </div>
                        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18 }}>
                            Plant<span style={{ color: '#4ade80' }}>IQ</span>
                        </span>
                    </div>
                    <nav style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                        {[{ label: 'Features', href: '#features' }, { label: 'How it Works', href: '#how' }, { label: 'Pricing', href: '#pricing' }].map(l => (
                            <a key={l.label} href={l.href} style={{ padding: '6px 12px', fontSize: 14, color: 'var(--text-muted)', textDecoration: 'none', transition: 'color 200ms' }}
                                onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-primary)')}
                                onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}>{l.label}</a>
                        ))}
                    </nav>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                        {/* Language Selector */}
                        <div ref={langDropdownRef} style={{ position: 'relative' }}>
                            <button
                                onClick={() => setLangDropdownOpen((v) => !v)}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 6,
                                    padding: '8px 12px',
                                    background: 'rgba(74,222,128,0.06)',
                                    border: '1px solid var(--border)',
                                    borderRadius: 10,
                                    fontSize: 13,
                                    color: 'var(--text-secondary)',
                                }}
                            >
                                <Languages size={14} />
                                <span>{LANGUAGES[language].nativeName}</span>
                            </button>

                            <AnimatePresence>
                                {langDropdownOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -8 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -8 }}
                                        style={{
                                            position: 'absolute',
                                            top: 'calc(100% + 8px)',
                                            right: 0,
                                            width: 140,
                                            background: 'var(--bg-card)',
                                            border: '1px solid var(--border)',
                                            borderRadius: 12,
                                            overflow: 'hidden',
                                            zIndex: 100,
                                        }}
                                    >
                                        {(Object.keys(LANGUAGES) as Language[]).map((lang) => (
                                            <button
                                                key={lang}
                                                onClick={() => {
                                                    setLanguage(lang);
                                                    setLangDropdownOpen(false);
                                                }}
                                                style={{
                                                    width: '100%',
                                                    padding: '10px 14px',
                                                    background: language === lang ? 'rgba(74,222,128,0.06)' : 'transparent',
                                                    border: 'none',
                                                    fontSize: 13,
                                                    color: language === lang ? '#4ade80' : 'var(--text-secondary)',
                                                    textAlign: 'left',
                                                }}
                                            >
                                                {LANGUAGES[lang].nativeName}
                                            </button>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                        <Link to="/login"><button className="btn-ghost" style={{ padding: '8px 16px', fontSize: 13 }}>Sign In</button></Link>
                        <Link to="/register"><button className="btn-primary" style={{ padding: '8px 16px', fontSize: 13 }}>Start Free</button></Link>
                    </div>
                </div>
            </header>

            {/* Hero */}
            <section className="aurora-bg" style={{ paddingTop: 160, paddingBottom: 96, textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
                {/* Glow orbs */}
                <div style={{ position: 'absolute', top: '20%', left: '10%', width: 400, height: 400, background: 'radial-gradient(circle, rgba(74,222,128,0.08) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />
                <div style={{ position: 'absolute', top: '30%', right: '5%', width: 300, height: 300, background: 'radial-gradient(circle, rgba(74,222,128,0.06) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />

                <div style={{ maxWidth: 800, margin: '0 auto', padding: '0 32px', position: 'relative' }}>
                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                        style={{ marginBottom: 16 }}
                    >
                        <span className="badge badge-green" style={{ fontSize: 12 }}>
                            <Leaf size={10} />
                            AI-Powered Plant Intelligence
                        </span>
                    </motion.div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                        {['Diagnose.', 'Treat.', 'Grow.'].map((word, i) => (
                            <motion.h1
                                key={word}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.1 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                                style={{
                                    fontFamily: 'var(--font-display)',
                                    fontSize: 'clamp(52px, 8vw, 88px)',
                                    fontWeight: 700,
                                    color: i === 2 ? '#4ade80' : 'var(--text-primary)',
                                    lineHeight: 1.0,
                                    letterSpacing: '-0.04em',
                                }}
                            >
                                {word}
                            </motion.h1>
                        ))}
                    </div>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.5 }}
                        style={{ fontSize: 18, color: 'var(--text-muted)', marginTop: 24, marginBottom: 40, maxWidth: 560, margin: '24px auto 40px' }}
                    >
                        AI-powered plant intelligence for farmers, botanists, and plant enthusiasts. Identify diseases, get treatment plans, and optimize growth — in seconds.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.6 }}
                        style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}
                    >
                        <Link to="/register">
                            <button className="btn-primary" style={{ padding: '14px 28px', fontSize: 15, gap: 8 }}>
                                Start Scanning Free <ArrowRight size={15} />
                            </button>
                        </Link>
                        <button className="btn-ghost" style={{ padding: '14px 28px', fontSize: 15, gap: 8 }}>
                            <Play size={14} fill="currentColor" /> Watch Demo
                        </button>
                    </motion.div>
                </div>
            </section>

            {/* Stats bar */}
            <section style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', padding: '40px 32px' }}>
                <div style={{ maxWidth: 900, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 0 }}>
                    {[
                        { value: 2000000, suffix: '+', label: 'Plants Analyzed' },
                        { value: 94.7, suffix: '%', label: 'Detection Accuracy' },
                        { value: 180, suffix: '+', label: 'Disease Types' },
                    ].map((stat, i) => (
                        <div key={stat.label} style={{ textAlign: 'center', padding: '0 32px', borderRight: i < 2 ? '1px solid var(--border)' : 'none' }}>
                            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 40, fontWeight: 700, color: '#4ade80' }}>
                                {stat.value.toLocaleString()}{stat.suffix}
                            </div>
                            <div style={{ fontSize: 14, color: 'var(--text-muted)', marginTop: 4 }}>{stat.label}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Features */}
            <section id="features" style={{ padding: '96px 32px', maxWidth: 1200, margin: '0 auto' }}>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4 }}
                    style={{ textAlign: 'center', marginBottom: 64 }}
                >
                    <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 42, fontWeight: 700, letterSpacing: '-0.03em' }}>
                        Everything your plant needs to thrive
                    </h2>
                    <p style={{ color: 'var(--text-muted)', marginTop: 16, fontSize: 17 }}>
                        Built for serious growers. Powered by frontier AI.
                    </p>
                </motion.div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
                    {features.map((f, i) => (
                        <motion.div
                            key={f.title}
                            initial={{ opacity: 0, y: 24 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: i * 0.08 }}
                            className="card"
                            style={{ padding: 28, borderTop: `2px solid ${f.accent}` }}
                        >
                            <div
                                style={{
                                    width: 40,
                                    height: 40,
                                    background: `${f.accent}18`,
                                    borderRadius: 10,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginBottom: 16,
                                }}
                            >
                                <f.icon size={18} color={f.accent} />
                            </div>
                            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 17, fontWeight: 600, marginBottom: 8 }}>{f.title}</h3>
                            <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.6 }}>{f.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* How it works */}
            <section id="how" style={{ padding: '96px 32px', background: 'var(--bg-secondary)' }}>
                <div style={{ maxWidth: 1000, margin: '0 auto' }}>
                    <motion.h2
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        style={{ fontFamily: 'var(--font-display)', fontSize: 40, textAlign: 'center', marginBottom: 64, letterSpacing: '-0.03em' }}
                    >
                        How it works
                    </motion.h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 40, position: 'relative' }}>
                        {/* Connecting line */}
                        <div style={{ position: 'absolute', top: 32, left: '20%', right: '20%', height: 1, background: 'repeating-linear-gradient(90deg, var(--accent-primary) 0px, var(--accent-primary) 8px, transparent 8px, transparent 16px)', opacity: 0.3, zIndex: 0 }} />

                        {steps.map((step, i) => (
                            <motion.div
                                key={step.num}
                                initial={{ opacity: 0, y: 24 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.4, delay: i * 0.15 }}
                                style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}
                            >
                                <div
                                    style={{
                                        width: 64,
                                        height: 64,
                                        background: 'rgba(74,222,128,0.08)',
                                        border: '1px solid rgba(74,222,128,0.2)',
                                        borderRadius: '50%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        margin: '0 auto 20px',
                                    }}
                                >
                                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 18, fontWeight: 700, color: '#4ade80' }}>{step.num}</span>
                                </div>
                                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 600, marginBottom: 8 }}>{step.title}</h3>
                                <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.6 }}>{step.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section style={{ padding: '96px 32px', maxWidth: 1200, margin: '0 auto' }}>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 40, textAlign: 'center', marginBottom: 64, letterSpacing: '-0.03em' }}>
                    Trusted by growers worldwide
                </h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
                    {testimonials.map((t, i) => (
                        <motion.div
                            key={t.name}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: i * 0.1 }}
                            className="card"
                            style={{ padding: 28 }}
                        >
                            <div style={{ display: 'flex', gap: 2, marginBottom: 16 }}>
                                {[1, 2, 3, 4, 5].map(s => <Star key={s} size={12} color="#f59e0b" fill="#f59e0b" />)}
                            </div>
                            <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 20, fontStyle: 'italic' }}>
                                "{t.quote}"
                            </p>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg, #4ade80, #16a34a)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: '#080d0a' }}>
                                    {t.name[0]}
                                </div>
                                <div>
                                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{t.name}</div>
                                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{t.role}</div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Pricing */}
            <section id="pricing" style={{ padding: '96px 32px', background: 'var(--bg-secondary)' }}>
                <div style={{ maxWidth: 1000, margin: '0 auto' }}>
                    <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 40, textAlign: 'center', marginBottom: 16, letterSpacing: '-0.03em' }}>
                        Simple, transparent pricing
                    </h2>
                    <p style={{ color: 'var(--text-muted)', textAlign: 'center', marginBottom: 64, fontSize: 16 }}>
                        Start free. Upgrade when you're ready.
                    </p>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
                        {plans.map((plan, i) => (
                            <motion.div
                                key={plan.name}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                style={{
                                    background: plan.highlight ? 'rgba(74,222,128,0.06)' : 'var(--bg-card)',
                                    border: `1px solid ${plan.highlight ? 'rgba(74,222,128,0.4)' : 'var(--border)'}`,
                                    borderRadius: 16,
                                    padding: 32,
                                    position: 'relative',
                                }}
                            >
                                {plan.highlight && (
                                    <div style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)' }}>
                                        <span className="badge badge-green">Most Popular</span>
                                    </div>
                                )}
                                <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, marginBottom: 8 }}>{plan.name}</div>
                                <div style={{ marginBottom: 8 }}>
                                    {plan.price !== null ? (
                                        <>
                                            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 36, fontWeight: 700, color: '#4ade80' }}>${plan.price}</span>
                                            <span style={{ color: 'var(--text-muted)', fontSize: 14 }}>/month</span>
                                        </>
                                    ) : (
                                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 28, fontWeight: 700, color: '#4ade80' }}>Custom</span>
                                    )}
                                </div>
                                <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 24 }}>{plan.scans}</div>
                                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 28 }}>
                                    {plan.features.map((f) => (
                                        <li key={f} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--text-secondary)' }}>
                                            <ChevronRight size={12} color="#4ade80" /> {f}
                                        </li>
                                    ))}
                                </ul>
                                <Link to="/register" style={{ display: 'block' }}>
                                    <button
                                        className={plan.highlight ? 'btn-primary' : 'btn-ghost'}
                                        style={{ width: '100%', justifyContent: 'center' }}
                                    >
                                        {plan.price === null ? 'Contact Sales' : 'Get Started'}
                                    </button>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer style={{ background: 'var(--bg-primary)', borderTop: '1px solid var(--border)', padding: '48px 32px' }}>
                <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 32, flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ width: 28, height: 28, background: 'rgba(74,222,128,0.15)', border: '1px solid rgba(74,222,128,0.3)', borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Leaf size={12} color="#4ade80" />
                        </div>
                        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16 }}>
                            Plant<span style={{ color: '#4ade80' }}>IQ</span>
                        </span>
                    </div>
                    <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                        © 2026 PlantIQ. AI-powered plant intelligence platform.
                    </p>
                    <div style={{ display: 'flex', gap: 24 }}>
                        {['Privacy', 'Terms', 'Contact'].map(l => (
                            <a key={l} href="#" style={{ fontSize: 13, color: 'var(--text-muted)', textDecoration: 'none', transition: 'color 200ms' }}
                                onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-primary)')}
                                onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}>{l}</a>
                        ))}
                    </div>
                </div>
            </footer>
        </div>
    );
}
