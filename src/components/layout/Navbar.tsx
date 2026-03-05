import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Leaf, Bell, ChevronDown, User, Settings, Clock, LogOut, Sparkles, Languages } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuthStore } from '../../store/authStore';
import { useLanguageStore, LANGUAGES, type Language } from '../../store/languageStore';
import { getInitials } from '../../lib/utils';

const navLinks = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Scan', href: '/scan' },
    { label: 'History', href: '/history' },
    { label: 'Encyclopedia', href: '/encyclopedia' },
];

export function Navbar() {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuthStore();
    const { language, setLanguage } = useLanguageStore();
    const [scrolled, setScrolled] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [langDropdownOpen, setLangDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const langDropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 10);
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setDropdownOpen(false);
            }
            if (langDropdownRef.current && !langDropdownRef.current.contains(e.target as Node)) {
                setLangDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <header
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                zIndex: 1000,
                background: scrolled ? 'rgba(8,13,10,0.9)' : 'transparent',
                backdropFilter: scrolled ? 'blur(20px) saturate(180%)' : 'none',
                borderBottom: scrolled ? '1px solid rgba(74,222,128,0.08)' : '1px solid transparent',
                transition: 'all 400ms cubic-bezier(0.16,1,0.3,1)',
            }}
        >
            <div
                style={{
                    maxWidth: 1280,
                    margin: '0 auto',
                    padding: '0 24px',
                    height: 64,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                }}
            >
                {/* Logo */}
                <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
                    <div
                        style={{
                            width: 32,
                            height: 32,
                            background: 'rgba(74,222,128,0.15)',
                            border: '1px solid rgba(74,222,128,0.3)',
                            borderRadius: 8,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <Leaf size={16} color="#4ade80" />
                    </div>
                    <span
                        style={{
                            fontFamily: 'var(--font-display)',
                            fontWeight: 700,
                            fontSize: 18,
                            color: 'var(--text-primary)',
                            letterSpacing: '-0.02em',
                        }}
                    >
                        Plant<span style={{ color: '#4ade80' }}>IQ</span>
                    </span>
                </Link>

                {/* Nav Links */}
                <nav style={{ display: 'flex', alignItems: 'center', gap: 4, position: 'relative' }}>
                    {navLinks.map((link) => {
                        const isActive = location.pathname === link.href;
                        return (
                            <Link
                                key={link.href}
                                to={link.href}
                                style={{
                                    position: 'relative',
                                    padding: '6px 14px',
                                    textDecoration: 'none',
                                    fontSize: 14,
                                    fontWeight: isActive ? 600 : 400,
                                    color: isActive ? 'var(--text-primary)' : 'var(--text-muted)',
                                    transition: 'color 200ms',
                                    borderRadius: 8,
                                }}
                            >
                                {link.label}
                                {isActive && (
                                    <motion.div
                                        layoutId="nav-indicator"
                                        style={{
                                            position: 'absolute',
                                            bottom: -2,
                                            left: 14,
                                            right: 14,
                                            height: 2,
                                            background: '#4ade80',
                                            borderRadius: 2,
                                        }}
                                        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                                    />
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* Right side */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
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
                                transition: 'border-color 200ms',
                            }}
                        >
                            <Languages size={14} />
                            <span>{LANGUAGES[language].nativeName}</span>
                            <ChevronDown
                                size={12}
                                style={{
                                    transform: langDropdownOpen ? 'rotate(180deg)' : 'rotate(0)',
                                    transition: 'transform 200ms',
                                }}
                            />
                        </button>

                        <AnimatePresence>
                            {langDropdownOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: -8, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: -8, scale: 0.95 }}
                                    transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
                                    style={{
                                        position: 'absolute',
                                        top: 'calc(100% + 8px)',
                                        right: 0,
                                        width: 160,
                                        background: 'var(--bg-card)',
                                        border: '1px solid var(--border)',
                                        borderRadius: 14,
                                        boxShadow: 'var(--shadow-md)',
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
                                                toast.success(`Language changed to ${LANGUAGES[lang].nativeName}`);
                                            }}
                                            style={{
                                                width: '100%',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'space-between',
                                                padding: '10px 16px',
                                                background: language === lang ? 'rgba(74,222,128,0.06)' : 'transparent',
                                                border: 'none',
                                                fontSize: 13,
                                                color: language === lang ? '#4ade80' : 'var(--text-secondary)',
                                                textAlign: 'left',
                                                transition: 'background 150ms',
                                            }}
                                            onMouseEnter={(e) => {
                                                if (language !== lang) {
                                                    (e.currentTarget as HTMLElement).style.background = 'rgba(74,222,128,0.03)';
                                                }
                                            }}
                                            onMouseLeave={(e) => {
                                                if (language !== lang) {
                                                    (e.currentTarget as HTMLElement).style.background = 'transparent';
                                                }
                                            }}
                                        >
                                            <span>{LANGUAGES[lang].nativeName}</span>
                                            {language === lang && (
                                                <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#4ade80' }} />
                                            )}
                                        </button>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Scan CTA */}
                    <Link to="/scan">
                        <button
                            className="btn-primary"
                            style={{ padding: '8px 16px', fontSize: 13, gap: 6 }}
                        >
                            <Sparkles size={14} />
                            New Scan
                        </button>
                    </Link>

                    {/* Notification Bell */}
                    <button
                        style={{
                            width: 36,
                            height: 36,
                            background: 'rgba(74,222,128,0.06)',
                            border: '1px solid var(--border)',
                            borderRadius: 10,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'var(--text-muted)',
                            transition: 'border-color 200ms, color 200ms',
                        }}
                    >
                        <Bell size={15} />
                    </button>

                    {/* User Avatar */}
                    <div ref={dropdownRef} style={{ position: 'relative' }}>
                        <button
                            onClick={() => setDropdownOpen((v) => !v)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 8,
                                padding: '4px 8px 4px 4px',
                                background: 'rgba(74,222,128,0.06)',
                                border: '1px solid var(--border)',
                                borderRadius: 10,
                                transition: 'border-color 200ms',
                            }}
                        >
                            <div
                                style={{
                                    width: 28,
                                    height: 28,
                                    borderRadius: 7,
                                    background: 'linear-gradient(135deg, #4ade80, #16a34a)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: 11,
                                    fontWeight: 700,
                                    color: '#080d0a',
                                }}
                            >
                                {user?.full_name ? getInitials(user.full_name) : 'U'}
                            </div>
                            <ChevronDown
                                size={13}
                                color="var(--text-muted)"
                                style={{
                                    transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0)',
                                    transition: 'transform 200ms',
                                }}
                            />
                        </button>

                        <AnimatePresence>
                            {dropdownOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: -8, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: -8, scale: 0.95 }}
                                    transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
                                    style={{
                                        position: 'absolute',
                                        top: 'calc(100% + 8px)',
                                        right: 0,
                                        width: 220,
                                        background: 'var(--bg-card)',
                                        border: '1px solid var(--border)',
                                        borderRadius: 14,
                                        boxShadow: 'var(--shadow-md)',
                                        overflow: 'hidden',
                                        zIndex: 100,
                                    }}
                                >
                                    {/* User info */}
                                    <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)' }}>
                                        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>
                                            {user?.full_name || 'User'}
                                        </div>
                                        <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
                                            {user?.email}
                                        </div>
                                    </div>

                                    {/* Menu items */}
                                    {[
                                        { icon: User, label: 'Profile', href: '/profile' },
                                        { icon: Settings, label: 'Settings', href: '/profile' },
                                        { icon: Clock, label: 'Scan History', href: '/history' },
                                    ].map(({ icon: Icon, label, href }) => (
                                        <Link
                                            key={label}
                                            to={href}
                                            onClick={() => setDropdownOpen(false)}
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 10,
                                                padding: '10px 16px',
                                                textDecoration: 'none',
                                                fontSize: 13,
                                                color: 'var(--text-secondary)',
                                                transition: 'background 150ms',
                                            }}
                                            onMouseEnter={(e) => {
                                                (e.currentTarget as HTMLElement).style.background = 'rgba(74,222,128,0.06)';
                                            }}
                                            onMouseLeave={(e) => {
                                                (e.currentTarget as HTMLElement).style.background = 'transparent';
                                            }}
                                        >
                                            <Icon size={14} />
                                            {label}
                                        </Link>
                                    ))}

                                    <div style={{ borderTop: '1px solid var(--border)', marginTop: 4 }}>
                                        <button
                                            onClick={handleLogout}
                                            style={{
                                                width: '100%',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 10,
                                                padding: '10px 16px',
                                                background: 'none',
                                                border: 'none',
                                                fontSize: 13,
                                                color: '#ef4444',
                                                textAlign: 'left',
                                                transition: 'background 150ms',
                                            }}
                                            onMouseEnter={(e) => {
                                                (e.currentTarget as HTMLElement).style.background = 'rgba(239,68,68,0.06)';
                                            }}
                                            onMouseLeave={(e) => {
                                                (e.currentTarget as HTMLElement).style.background = 'transparent';
                                            }}
                                        >
                                            <LogOut size={14} />
                                            Sign Out
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </header>
    );
}
