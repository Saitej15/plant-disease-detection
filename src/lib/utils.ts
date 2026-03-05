import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date): string {
    return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    }).format(new Date(date));
}

export function formatRelativeDate(date: string | Date): string {
    const now = new Date();
    const d = new Date(date);
    const diffMs = now.getTime() - d.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
    return formatDate(date);
}

export function getHealthColor(score: number): string {
    if (score <= 40) return '#ef4444';
    if (score <= 70) return '#f59e0b';
    return '#4ade80';
}

export function getSeverityColor(severity: string): string {
    switch (severity) {
        case 'severe': return '#ef4444';
        case 'moderate': return '#f59e0b';
        case 'mild': return '#fbbf24';
        default: return '#4ade80';
    }
}

export function getSeverityBadgeClass(severity: string): string {
    switch (severity) {
        case 'severe': return 'badge-red';
        case 'moderate': return 'badge-amber';
        case 'mild': return 'badge-amber';
        default: return 'badge-green';
    }
}

export function getInitials(name: string): string {
    return name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
}

export function fileToDataUrl(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}
