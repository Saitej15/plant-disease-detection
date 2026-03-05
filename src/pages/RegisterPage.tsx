import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Eye, EyeOff, Leaf } from 'lucide-react';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

function PasswordStrength({ password }: { password: string }) {
    const checks = [
        password.length >= 8,
        /[A-Z]/.test(password),
        /[0-9]/.test(password),
        /[^A-Za-z0-9]/.test(password),
    ];
    const strength = checks.filter(Boolean).length;
    const labels = ['', 'Weak', 'Fair', 'Good', 'Strong'];
    const colors = ['', '#ef4444', '#f59e0b', '#4ade80', '#4ade80'];

    if (!password) return null;

    return (
        <div style={{ marginTop: 8 }}>
            <div style={{ display: 'flex', gap: 4, marginBottom: 4 }}>
                {[1, 2, 3, 4].map((i) => (
                    <div
                        key={i}
                        style={{
                            flex: 1,
                            height: 3,
                            borderRadius: 2,
                            background: i <= strength ? colors[strength] : 'var(--border)',
                            transition: 'background 300ms',
                        }}
                    />
                ))}
            </div>
            <span style={{ fontSize: 11, color: colors[strength] }}>{labels[strength]}</span>
        </div>
    );
}

export function RegisterPage() {
    const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
    const [showPass, setShowPass] = useState(false);
    const [loading, setLoading] = useState(false);
    const [verified, setVerified] = useState(false);

    const setField = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
        setForm((f) => ({ ...f, [key]: e.target.value }));

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        if (form.password !== form.confirm) {
            toast.error('Passwords do not match');
            return;
        }
        if (form.password.length < 8) {
            toast.error('Password must be at least 8 characters');
            return;
        }
        setLoading(true);
        const { error } = await supabase.auth.signUp({
            email: form.email,
            password: form.password,
            options: { data: { full_name: form.name } },
        });
        setLoading(false);
        if (error) {
            toast.error(error.message);
        } else {
            setVerified(true);
        }
    };

    if (verified) {
        return (
            <div style={{
                minHeight: '100vh',
                background: 'var(--bg-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 24,
            }}>
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    style={{ textAlign: 'center', maxWidth: 400 }}
                >
                    <motion.div
                        animate={{ y: [0, -10, 0] }}
                        transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                        style={{ fontSize: 64, marginBottom: 24 }}
                    >
                        ✉️
                    </motion.div>
                    <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 28, marginBottom: 12 }}>
                        Check your inbox
                    </h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: 15 }}>
                        We sent a verification email to <strong style={{ color: 'var(--text-secondary)' }}>{form.email}</strong>.
                        Click the link to activate your account.
                    </p>
                    <Link to="/login" style={{ display: 'inline-block', marginTop: 32 }}>
                        <button className="btn-primary">Back to Sign In</button>
                    </Link>
                </motion.div>
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-primary)' }}>
            {/* Left panel */}
            <div
                style={{
                    flex: 1,
                    background: 'linear-gradient(135deg, #080d0a 0%, #0a1a0f 50%, #071209 100%)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 64,
                    position: 'relative',
                    overflow: 'hidden',
                }}
                className="hidden-mobile"
            >
                {/* Animated background dots */}
                {Array.from({ length: 30 }).map((_, i) => (
                    <motion.div
                        key={i}
                        style={{
                            position: 'absolute',
                            width: Math.random() * 4 + 1,
                            height: Math.random() * 4 + 1,
                            borderRadius: '50%',
                            background: 'rgba(74,222,128,0.4)',
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                        }}
                        animate={{
                            y: [0, -30, 0],
                            opacity: [0.2, 0.6, 0.2],
                        }}
                        transition={{
                            duration: Math.random() * 4 + 3,
                            repeat: Infinity,
                            delay: Math.random() * 3,
                        }}
                    />
                ))}
                <div style={{ position: 'relative', textAlign: 'center' }}>
                    <div
                        style={{
                            width: 64,
                            height: 64,
                            background: 'rgba(74,222,128,0.1)',
                            border: '1px solid rgba(74,222,128,0.2)',
                            borderRadius: 18,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 24px',
                        }}
                    >
                        <Leaf size={28} color="#4ade80" />
                    </div>
                    <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 36, fontWeight: 700, lineHeight: 1.1, letterSpacing: '-0.03em' }}>
                        Start your plant <span style={{ color: '#4ade80' }}>journey</span>.
                    </h1>
                    <p style={{ color: 'var(--text-muted)', marginTop: 16, fontSize: 15 }}>
                        Free plan includes 10 scans/month, disease detection, and growth analysis.
                    </p>
                </div>
            </div>

            {/* Right: Form */}
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
                    <h2
                        style={{
                            fontFamily: 'var(--font-display)',
                            fontSize: 28,
                            fontWeight: 700,
                            marginBottom: 8,
                            letterSpacing: '-0.02em',
                        }}
                    >
                        Create account
                    </h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 32 }}>
                        It's free — no credit card required.
                    </p>

                    <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        {/* Full name */}
                        <div>
                            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>
                                Full name
                            </label>
                            <div style={{ position: 'relative' }}>
                                <User size={14} color="var(--text-muted)" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
                                <input className="input" type="text" placeholder="Jane Smith" value={form.name} onChange={setField('name')} required style={{ paddingLeft: 36 }} />
                            </div>
                        </div>

                        {/* Email */}
                        <div>
                            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>
                                Email address
                            </label>
                            <div style={{ position: 'relative' }}>
                                <Mail size={14} color="var(--text-muted)" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
                                <input className="input" type="email" placeholder="you@example.com" value={form.email} onChange={setField('email')} required style={{ paddingLeft: 36 }} />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>
                                Password
                            </label>
                            <div style={{ position: 'relative' }}>
                                <Lock size={14} color="var(--text-muted)" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
                                <input className="input" type={showPass ? 'text' : 'password'} placeholder="Min. 8 characters" value={form.password} onChange={setField('password')} required style={{ paddingLeft: 36, paddingRight: 40 }} />
                                <button type="button" onClick={() => setShowPass((v) => !v)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', display: 'flex' }}>
                                    {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
                                </button>
                            </div>
                            <PasswordStrength password={form.password} />
                        </div>

                        {/* Confirm password */}
                        <div>
                            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>
                                Confirm password
                            </label>
                            <div style={{ position: 'relative' }}>
                                <Lock size={14} color="var(--text-muted)" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
                                <input className="input" type="password" placeholder="Repeat password" value={form.confirm} onChange={setField('confirm')} required style={{ paddingLeft: 36 }} />
                            </div>
                        </div>

                        <label style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.4 }}>
                            <input type="checkbox" required style={{ accentColor: '#4ade80', marginTop: 2 }} />
                            I agree to the{' '}
                            <a href="#" style={{ color: '#4ade80', textDecoration: 'none' }}>Terms of Service</a>{' '}
                            and{' '}
                            <a href="#" style={{ color: '#4ade80', textDecoration: 'none' }}>Privacy Policy</a>
                        </label>

                        <button type="submit" className="btn-primary" disabled={loading} style={{ width: '100%', justifyContent: 'center', opacity: loading ? 0.7 : 1 }}>
                            {loading ? 'Creating account...' : 'Create Free Account'}
                        </button>
                    </form>

                    <p style={{ marginTop: 24, textAlign: 'center', fontSize: 13, color: 'var(--text-muted)' }}>
                        Already have an account?{' '}
                        <Link to="/login" style={{ color: '#4ade80', textDecoration: 'none', fontWeight: 600 }}>Sign in</Link>
                    </p>
                </motion.div>
            </div>
        </div>
    );
}
