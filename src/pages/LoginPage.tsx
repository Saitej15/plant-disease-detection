import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, Leaf } from 'lucide-react';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

// Botanical particle
interface Particle {
    id: number;
    x: number;
    y: number;
    size: number;
    speed: number;
    opacity: number;
    drift: number;
}

function BotanicalParticles() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const particlesRef = useRef<Particle[]>([]);
    const rafRef = useRef<number>(0);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const resize = () => {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
        };
        resize();
        window.addEventListener('resize', resize);

        // Init particles
        particlesRef.current = Array.from({ length: 40 }, (_, i) => ({
            id: i,
            x: Math.random() * canvas.width,
            y: canvas.height + Math.random() * 200,
            size: Math.random() * 4 + 2,
            speed: Math.random() * 0.5 + 0.2,
            opacity: Math.random() * 0.4 + 0.1,
            drift: (Math.random() - 0.5) * 0.3,
        }));

        const drawLeaf = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, alpha: number) => {
            ctx.save();
            ctx.globalAlpha = alpha;
            ctx.translate(x, y);
            ctx.rotate(Date.now() * 0.0002 * size);
            ctx.beginPath();
            ctx.moveTo(0, -size);
            ctx.bezierCurveTo(size, -size / 2, size, size / 2, 0, size);
            ctx.bezierCurveTo(-size, size / 2, -size, -size / 2, 0, -size);
            ctx.fillStyle = `rgba(74, 222, 128, ${alpha})`;
            ctx.fill();
            // Vein
            ctx.beginPath();
            ctx.moveTo(0, -size);
            ctx.lineTo(0, size);
            ctx.strokeStyle = `rgba(74, 222, 128, ${alpha * 0.6})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
            ctx.restore();
        };

        let last = 0;
        const animate = (now: number) => {
            const dt = now - last;
            last = now;

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Draw connection lines between close particles
            particlesRef.current.forEach((p, i) => {
                particlesRef.current.slice(i + 1).forEach((p2) => {
                    const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
                    if (dist < 80) {
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.strokeStyle = `rgba(74,222,128,${0.04 * (1 - dist / 80)})`;
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                });

                // Update
                p.y -= p.speed * (dt / 16);
                p.x += p.drift * (dt / 16);
                if (p.y < -20) {
                    p.y = canvas.height + 20;
                    p.x = Math.random() * canvas.width;
                }
                drawLeaf(ctx, p.x, p.y, p.size, p.opacity);
            });

            rafRef.current = requestAnimationFrame(animate);
        };
        rafRef.current = requestAnimationFrame(animate);

        return () => {
            cancelAnimationFrame(rafRef.current);
            window.removeEventListener('resize', resize);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            style={{ width: '100%', height: '100%', display: 'block' }}
        />
    );
}

export function LoginPage() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPass, setShowPass] = useState(false);
    const [loading, setLoading] = useState(false);
    const [shake, setShake] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        setLoading(false);
        if (error) {
            setShake(true);
            setTimeout(() => setShake(false), 600);
            toast.error(error.message);
        } else {
            toast.success('Welcome back!');
            navigate('/dashboard');
        }
    };

    const handleGoogle = async () => {
        await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: { redirectTo: `${window.location.origin}/dashboard` },
        });
    };

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-primary)' }}>
            {/* Left: Particle Panel */}
            <div
                style={{
                    flex: 1,
                    position: 'relative',
                    overflow: 'hidden',
                    background: 'linear-gradient(135deg, #080d0a 0%, #0a1a0f 50%, #071209 100%)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 48,
                }}
                className="hidden-mobile"
            >
                {/* Canvas particles */}
                <div style={{ position: 'absolute', inset: 0 }}>
                    <BotanicalParticles />
                </div>

                {/* Content overlay */}
                <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', maxWidth: 400 }}>
                    <div
                        style={{
                            width: 72,
                            height: 72,
                            background: 'rgba(74,222,128,0.1)',
                            border: '1px solid rgba(74,222,128,0.2)',
                            borderRadius: 20,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 24px',
                        }}
                    >
                        <Leaf size={32} color="#4ade80" />
                    </div>
                    <h1
                        style={{
                            fontFamily: 'var(--font-display)',
                            fontSize: 40,
                            fontWeight: 700,
                            color: 'var(--text-primary)',
                            lineHeight: 1.1,
                            marginBottom: 16,
                            letterSpacing: '-0.03em',
                        }}
                    >
                        Plant intelligence,{' '}
                        <span style={{ color: '#4ade80' }}>reimagined.</span>
                    </h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: 16, lineHeight: 1.6 }}>
                        Join 50,000+ growers using AI to diagnose, treat, and grow healthier plants.
                    </p>

                    {/* Stats */}
                    <div
                        style={{
                            display: 'flex',
                            gap: 32,
                            marginTop: 40,
                            justifyContent: 'center',
                        }}
                    >
                        {[
                            { value: '2M+', label: 'Plants Analyzed' },
                            { value: '94.7%', label: 'Accuracy' },
                            { value: '180+', label: 'Disease Types' },
                        ].map((stat) => (
                            <div key={stat.label} style={{ textAlign: 'center' }}>
                                <div
                                    style={{
                                        fontFamily: 'var(--font-mono)',
                                        fontSize: 22,
                                        fontWeight: 700,
                                        color: '#4ade80',
                                    }}
                                >
                                    {stat.value}
                                </div>
                                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
                                    {stat.label}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right: Auth Form */}
            <div
                style={{
                    width: 480,
                    minWidth: 480,
                    background: 'var(--bg-secondary)',
                    borderLeft: '1px solid var(--border)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 48,
                }}
            >
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    style={{ width: '100%', maxWidth: 380 }}
                >
                    {/* Logo small */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 40 }}>
                        <div
                            style={{
                                width: 28,
                                height: 28,
                                background: 'rgba(74,222,128,0.15)',
                                border: '1px solid rgba(74,222,128,0.3)',
                                borderRadius: 7,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <Leaf size={14} color="#4ade80" />
                        </div>
                        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16 }}>
                            Plant<span style={{ color: '#4ade80' }}>IQ</span>
                        </span>
                    </div>

                    <h2
                        style={{
                            fontFamily: 'var(--font-display)',
                            fontSize: 28,
                            fontWeight: 700,
                            color: 'var(--text-primary)',
                            marginBottom: 8,
                            letterSpacing: '-0.02em',
                        }}
                    >
                        Welcome back
                    </h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 32 }}>
                        Sign in to your PlantIQ account
                    </p>

                    {/* Google */}
                    <button
                        onClick={handleGoogle}
                        style={{
                            width: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 10,
                            padding: '11px 16px',
                            background: 'rgba(255,255,255,0.04)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: 10,
                            color: 'var(--text-primary)',
                            fontSize: 14,
                            fontWeight: 500,
                            marginBottom: 20,
                            transition: 'background 200ms',
                        }}
                        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.08)'; }}
                        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)'; }}
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                        </svg>
                        Continue with Google
                    </button>

                    {/* Divider */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                        <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
                        <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>or</span>
                        <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
                    </div>

                    {/* Form */}
                    <motion.form
                        onSubmit={handleLogin}
                        animate={shake ? { x: [-8, 8, -6, 6, -4, 4, 0] } : { x: 0 }}
                        transition={{ duration: 0.4 }}
                    >
                        <div style={{ marginBottom: 16 }}>
                            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>
                                Email address
                            </label>
                            <div style={{ position: 'relative' }}>
                                <Mail
                                    size={14}
                                    color="var(--text-muted)"
                                    style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }}
                                />
                                <input
                                    className="input"
                                    type="email"
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    style={{ paddingLeft: 36 }}
                                />
                            </div>
                        </div>

                        <div style={{ marginBottom: 8 }}>
                            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>
                                Password
                            </label>
                            <div style={{ position: 'relative' }}>
                                <Lock
                                    size={14}
                                    color="var(--text-muted)"
                                    style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }}
                                />
                                <input
                                    className="input"
                                    type={showPass ? 'text' : 'password'}
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    style={{ paddingLeft: 36, paddingRight: 40 }}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPass((v) => !v)}
                                    style={{
                                        position: 'absolute',
                                        right: 12,
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        background: 'none',
                                        border: 'none',
                                        color: 'var(--text-muted)',
                                        display: 'flex',
                                    }}
                                >
                                    {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
                                </button>
                            </div>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--text-muted)' }}>
                                <input type="checkbox" style={{ accentColor: '#4ade80' }} />
                                Remember me
                            </label>
                            <Link
                                to="/forgot-password"
                                style={{ fontSize: 13, color: '#4ade80', textDecoration: 'none' }}
                            >
                                Forgot password?
                            </Link>
                        </div>

                        <button
                            type="submit"
                            className="btn-primary"
                            disabled={loading}
                            style={{ width: '100%', justifyContent: 'center', opacity: loading ? 0.7 : 1 }}
                        >
                            {loading ? 'Signing in...' : 'Sign In'}
                        </button>
                    </motion.form>

                    <p style={{ marginTop: 24, textAlign: 'center', fontSize: 13, color: 'var(--text-muted)' }}>
                        Don't have an account?{' '}
                        <Link to="/register" style={{ color: '#4ade80', textDecoration: 'none', fontWeight: 600 }}>
                            Create one free
                        </Link>
                    </p>
                </motion.div>
            </div>
        </div>
    );
}
