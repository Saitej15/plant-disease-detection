import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

export function CustomCursor() {
    const dotRef = useRef<HTMLDivElement>(null);
    const ringRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const dot = dotRef.current;
        const ring = ringRef.current;
        if (!dot || !ring) return;

        let mouseX = 0;
        let mouseY = 0;
        let ringX = 0;
        let ringY = 0;

        const onMouseMove = (e: MouseEvent) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            dot.style.transform = `translate(${mouseX - 4}px, ${mouseY - 4}px)`;
        };

        let animFrameId: number;
        const animate = () => {
            ringX += (mouseX - ringX) * 0.12;
            ringY += (mouseY - ringY) * 0.12;
            ring.style.transform = `translate(${ringX - 18}px, ${ringY - 18}px)`;
            animFrameId = requestAnimationFrame(animate);
        };
        animate();

        const onMouseEnterLink = () => ring.classList.add('cursor-ring-hover');
        const onMouseLeaveLink = () => ring.classList.remove('cursor-ring-hover');

        document.addEventListener('mousemove', onMouseMove);
        document.querySelectorAll('a, button, [role="button"]').forEach((el) => {
            el.addEventListener('mouseenter', onMouseEnterLink);
            el.addEventListener('mouseleave', onMouseLeaveLink);
        });

        return () => {
            document.removeEventListener('mousemove', onMouseMove);
            cancelAnimationFrame(animFrameId);
        };
    }, []);

    return (
        <>
            <div
                ref={dotRef}
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: 8,
                    height: 8,
                    background: '#4ade80',
                    borderRadius: '50%',
                    pointerEvents: 'none',
                    zIndex: 99999,
                    transition: 'transform 0ms',
                    mixBlendMode: 'difference',
                }}
            />
            <div
                ref={ringRef}
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: 36,
                    height: 36,
                    border: '1.5px solid rgba(74,222,128,0.5)',
                    borderRadius: '50%',
                    pointerEvents: 'none',
                    zIndex: 99998,
                    transition: 'width 200ms, height 200ms, border-color 200ms',
                }}
            />
            <style>{`
        .cursor-ring-hover {
          width: 48px !important;
          height: 48px !important;
          border-color: #4ade80 !important;
        }
      `}</style>
        </>
    );
}

// Page transition wrapper
export function PageTransition({ children }: { children: React.ReactNode }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        >
            {children}
        </motion.div>
    );
}
