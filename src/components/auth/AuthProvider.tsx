import { useEffect } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { supabase } from '../../lib/supabase';

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const { setUser, setLoading } = useAuthStore();

    useEffect(() => {
        // Get initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session?.user) {
                setUser({
                    id: session.user.id,
                    email: session.user.email ?? '',
                    full_name: session.user.user_metadata?.full_name,
                    avatar_url: session.user.user_metadata?.avatar_url,
                    plan: 'free',
                    scans_this_month: 0,
                    created_at: session.user.created_at,
                });
            }
            setLoading(false);
        });

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session?.user) {
                setUser({
                    id: session.user.id,
                    email: session.user.email ?? '',
                    full_name: session.user.user_metadata?.full_name,
                    avatar_url: session.user.user_metadata?.avatar_url,
                    plan: 'free',
                    scans_this_month: 0,
                    created_at: session.user.created_at,
                });
            } else {
                setUser(null);
            }
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, [setUser, setLoading]);

    return <>{children}</>;
}

export function ProtectedRoute() {
    const { isAuthenticated, isLoading } = useAuthStore();
    const navigate = useNavigate();

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            navigate('/login', { replace: true, state: { returnUrl: window.location.pathname } });
        }
    }, [isAuthenticated, isLoading, navigate]);

    if (isLoading) {
        return (
            <div
                style={{
                    minHeight: '100vh',
                    background: 'var(--bg-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 16,
                    }}
                >
                    <div
                        style={{
                            width: 40,
                            height: 40,
                            borderRadius: '50%',
                            border: '2px solid rgba(74,222,128,0.2)',
                            borderTopColor: '#4ade80',
                            animation: 'spin 0.8s linear infinite',
                        }}
                    />
                    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) return null;

    return <Outlet />;
}
