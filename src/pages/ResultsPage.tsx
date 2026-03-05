import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer } from 'recharts';
import { Share2, Download, Sun, Droplets, Leaf, FlaskConical, Thermometer, Scissors, ChevronRight, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';
import { Navbar } from '../components/layout/Navbar';
import { useScanStore } from '../store/scanStore';
import { getHealthColor, getSeverityBadgeClass } from '../lib/utils';
import { downloadPDF } from '../lib/pdfGenerator';
import type { Scan, PlantAnalysis } from '../types';

const GROWTH_STAGES = ['seedling', 'vegetative', 'flowering', 'fruiting', 'mature'];
const TREATMENT_TABS = ['Immediate Actions', 'Natural Remedies', 'Chemical Treatment', 'Prevention'];

function HealthGauge({ score }: { score: number }) {
    const r = 52;
    const circ = 2 * Math.PI * r;
    const offset = circ - (score / 100) * circ;
    const color = getHealthColor(score);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <svg width={130} height={130} viewBox="0 0 130 130">
                <circle cx={65} cy={65} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={12} />
                <motion.circle
                    cx={65} cy={65} r={r}
                    fill="none"
                    stroke={color}
                    strokeWidth={12}
                    strokeLinecap="round"
                    strokeDasharray={circ}
                    strokeDashoffset={circ}
                    animate={{ strokeDashoffset: offset }}
                    transition={{ duration: 1.5, ease: [0.34, 1.56, 0.64, 1] }}
                    transform="rotate(-90 65 65)"
                />
                <text x={65} y={60} textAnchor="middle" fill={color} fontSize={24} fontWeight={700} fontFamily="JetBrains Mono">{score}</text>
                <text x={65} y={78} textAnchor="middle" fill="var(--text-muted)" fontSize={11}>/ 100</text>
            </svg>
            <span style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>Health Score</span>
        </div>
    );
}

function PrescriptionCard({ icon: Icon, title, metric, desc, color }: {
    icon: React.ElementType;
    title: string;
    metric: string;
    desc: string;
    color?: string;
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="card"
            style={{ padding: 20 }}
        >
            <div style={{ width: 36, height: 36, background: `${color || '#4ade80'}18`, borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
                <Icon size={16} color={color || '#4ade80'} />
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>{title}</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 18, color: color || '#4ade80', fontWeight: 700, marginBottom: 4 }}>{metric}</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.5 }}>{desc}</div>
        </motion.div>
    );
}

export function ResultsPage() {
    const { scanId } = useParams<{ scanId: string }>();
    const { currentScan } = useScanStore();
    const [scan, setScan] = useState<Scan | null>(currentScan);
    const [activeTab, setActiveTab] = useState(0);

    useEffect(() => {
        if (!scan && scanId) {
            const scans: Scan[] = JSON.parse(localStorage.getItem('plantiq_scans') || '[]');
            const found = scans.find(s => s.id === scanId);
            if (found) setScan(found);
        }
    }, [scanId, scan]);

    if (!scan) {
        return (
            <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Navbar />
                <div style={{ textAlign: 'center' }}>
                    <p style={{ color: 'var(--text-muted)', marginBottom: 16 }}>Scan result not found.</p>
                    <Link to="/scan"><button className="btn-primary">New Scan</button></Link>
                </div>
            </div>
        );
    }

    const a: PlantAnalysis = scan.full_analysis;
    const stageIdx = GROWTH_STAGES.indexOf(a.growth_stage);

    const nutrientData = (a.nutrient_deficiencies || []).slice(0, 6).map(n => ({
        subject: n.nutrient, value: n.severity === 'severe' ? 30 : n.severity === 'moderate' ? 60 : 80,
    }));

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
            <Navbar />
            <main style={{ maxWidth: 1000, margin: '0 auto', padding: '96px 32px 64px' }}>
                {/* Breadcrumb */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--text-muted)', marginBottom: 24 }}>
                    <Link to="/dashboard" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Dashboard</Link>
                    <ChevronRight size={12} />
                    <Link to="/history" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Scan History</Link>
                    <ChevronRight size={12} />
                    <span style={{ color: 'var(--text-secondary)' }}>{scan.plant_name}</span>
                </div>

                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
                    <div>
                        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 40, fontWeight: 700, letterSpacing: '-0.03em', marginBottom: 6 }}>
                            {a.plant_name}
                        </h1>
                        <p style={{ fontSize: 16, color: 'var(--text-muted)', fontStyle: 'italic' }}>{a.scientific_name}</p>
                        <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                            <span className="badge badge-green">{a.confidence_percent}% Confidence</span>
                            <span className="badge" style={{ background: 'rgba(74,222,128,0.06)', color: 'var(--text-muted)', border: '1px solid var(--border)' }}>{a.plant_family}</span>
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                        <button 
                            className="btn-ghost" 
                            style={{ padding: '8px 14px', gap: 6, fontSize: 13 }}
                            onClick={async () => {
                                try {
                                    if (navigator.share) {
                                        await navigator.share({
                                            title: `${a.plant_name} - PlantIQ Analysis`,
                                            text: `Check out my plant analysis: ${a.plant_name} (${a.scientific_name}). Health Score: ${a.health_score}/100`,
                                            url: window.location.href,
                                        });
                                        toast.success('Shared successfully!');
                                    } else {
                                        // Fallback: Copy link to clipboard
                                        await navigator.clipboard.writeText(window.location.href);
                                        toast.success('Link copied to clipboard!');
                                    }
                                } catch (err) {
                                    console.error('Share error:', err);
                                    toast.error('Failed to share');
                                }
                            }}
                        >
                            <Share2 size={13} /> Share
                        </button>
                        <button 
                            className="btn-ghost" 
                            style={{ padding: '8px 14px', gap: 6, fontSize: 13 }}
                            onClick={async () => {
                                try {
                                    toast.loading('Generating PDF...');
                                    await downloadPDF(scan);
                                    toast.dismiss();
                                    toast.success('PDF downloaded successfully!');
                                } catch (err) {
                                    console.error('PDF error:', err);
                                    toast.dismiss();
                                    toast.error('Failed to generate PDF');
                                }
                            }}
                        >
                            <Download size={13} /> PDF
                        </button>
                    </div>
                </div>

                {/* Image + quick stats row */}
                <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 24, marginBottom: 32 }}>
                    <div style={{ borderRadius: 16, overflow: 'hidden', border: '1px solid var(--border)', background: 'var(--bg-card)' }}>
                        {scan.image_url ? (
                            <img src={scan.image_url} alt={scan.plant_name} style={{ width: '100%', height: 260, objectFit: 'cover' }} />
                        ) : (
                            <div style={{ height: 260, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-secondary)' }}>
                                <Leaf size={48} color="rgba(74,222,128,0.2)" />
                            </div>
                        )}
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                        <div className="card" style={{ padding: 20, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <HealthGauge score={a.health_score} />
                        </div>
                        <div className="card" style={{ padding: 20 }}>
                            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Growth Stage</div>
                            <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 600, textTransform: 'capitalize', marginBottom: 12 }}>{a.growth_stage}</div>
                            <div style={{ display: 'flex', gap: 4 }}>
                                {GROWTH_STAGES.map((s, i) => (
                                    <div key={s} title={s} style={{ flex: 1, height: 4, borderRadius: 2, background: i <= stageIdx ? '#4ade80' : 'var(--border)', transition: 'background 300ms' }} />
                                ))}
                            </div>
                            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 8 }}>{a.weeks_to_next_stage}w to next stage</div>
                        </div>
                        <div className="card" style={{ padding: 20 }}>
                            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Disease Status</div>
                            <span className={`badge ${getSeverityBadgeClass(a.severity)}`} style={{ fontSize: 13, padding: '4px 10px' }}>
                                {a.disease_detected ? (a.disease_name || 'Disease Detected') : 'Healthy'}
                            </span>
                            {a.disease_detected && (
                                <div style={{ marginTop: 8, fontSize: 11, color: 'var(--text-muted)' }}>
                                    {a.affected_area_percent}% area affected
                                </div>
                            )}
                        </div>
                        <div className="card" style={{ padding: 20 }}>
                            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Growth Rate</div>
                            <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 600, textTransform: 'capitalize', color: a.growth_rate === 'fast' ? '#4ade80' : a.growth_rate === 'slow' ? '#f59e0b' : 'var(--text-primary)' }}>
                                {a.growth_rate}
                            </div>
                            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4, lineHeight: 1.4 }}>{a.growth_rate_reason}</div>
                        </div>
                    </div>
                </div>

                {/* Disease Analysis */}
                {a.disease_detected && (
                    <div
                        className="card"
                        style={{
                            marginBottom: 24,
                            borderLeft: `3px solid ${a.severity === 'severe' ? '#ef4444' : a.severity === 'moderate' ? '#f59e0b' : '#4ade80'}`,
                            padding: 28,
                        }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                            <div>
                                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700, marginBottom: 4 }}>{a.disease_name}</h2>
                                <span className={`badge ${getSeverityBadgeClass(a.severity)}`}>{a.severity} severity</span>
                            </div>
                            <AlertTriangle size={20} color={a.severity === 'severe' ? '#ef4444' : '#f59e0b'} />
                        </div>

                        {/* Affected area bar */}
                        <div style={{ marginBottom: 16 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--text-muted)', marginBottom: 6 }}>
                                <span>Affected Area</span>
                                <span>{a.affected_area_percent}%</span>
                            </div>
                            <div style={{ height: 6, background: 'var(--bg-secondary)', borderRadius: 3 }}>
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${a.affected_area_percent}%` }}
                                    transition={{ duration: 1, ease: 'easeOut' }}
                                    style={{ height: '100%', background: a.severity === 'severe' ? '#ef4444' : '#f59e0b', borderRadius: 3 }}
                                />
                            </div>
                        </div>

                        <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 16 }}>{a.disease_description}</p>

                        {/* Treatment Tabs */}
                        <div>
                            <div style={{ display: 'flex', gap: 4, marginBottom: 20, borderBottom: '1px solid var(--border)', paddingBottom: 0 }}>
                                {TREATMENT_TABS.map((tab, i) => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(i)}
                                        style={{
                                            padding: '8px 14px',
                                            background: 'none',
                                            border: 'none',
                                            fontSize: 13,
                                            fontWeight: activeTab === i ? 600 : 400,
                                            color: activeTab === i ? '#4ade80' : 'var(--text-muted)',
                                            borderBottom: `2px solid ${activeTab === i ? '#4ade80' : 'transparent'}`,
                                            marginBottom: -1,
                                            transition: 'color 200ms',
                                        }}
                                    >
                                        {tab}
                                    </button>
                                ))}
                            </div>

                            <motion.div key={activeTab} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
                                {activeTab === 0 && (
                                    <ol style={{ paddingLeft: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
                                        {a.immediate_actions.map((action, i) => (
                                            <li key={i} style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{action}</li>
                                        ))}
                                    </ol>
                                )}
                                {activeTab === 1 && (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                        {(a.natural_remedies || []).map((r, i) => (
                                            <div key={i} style={{ background: 'var(--bg-secondary)', borderRadius: 10, padding: 14 }}>
                                                {typeof r === 'string' ? (
                                                    <div style={{ fontSize: 14, color: 'var(--text-secondary)' }}>{r}</div>
                                                ) : (
                                                    <>
                                                        <div style={{ fontSize: 14, fontWeight: 600, color: '#4ade80', marginBottom: 4 }}>{r.remedy}</div>
                                                        <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>{r.method} · {r.frequency}</div>
                                                    </>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                                {activeTab === 2 && (
                                    <div style={{ overflowX: 'auto' }}>
                                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                                            <thead>
                                                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                                                    {['Treatment', 'Details'].map(h => (
                                                        <th key={h} style={{ padding: '8px 12px', textAlign: 'left', color: 'var(--text-muted)', fontWeight: 600, fontSize: 11, textTransform: 'uppercase' }}>{h}</th>
                                                    ))}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {(a.chemical_treatments || []).map((c, i) => (
                                                    <tr key={i} className="table-row">
                                                        {typeof c === 'string' ? (
                                                            <>
                                                                <td style={{ padding: '10px 12px', color: 'var(--text-secondary)' }}>Product</td>
                                                                <td style={{ padding: '10px 12px', color: 'var(--text-muted)' }}>{c}</td>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <td style={{ padding: '10px 12px', color: 'var(--text-secondary)' }}>
                                                                    <div style={{ fontWeight: 500, color: '#f59e0b', marginBottom: 2 }}>{c.product_type}</div>
                                                                    <div style={{ fontSize: 11 }}>{c.active_ingredient}</div>
                                                                </td>
                                                                <td style={{ padding: '10px 12px', color: 'var(--text-muted)' }}>
                                                                    <div>{c.dosage} · {c.frequency}</div>
                                                                    <div style={{ fontSize: 11, marginTop: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
                                                                        <AlertTriangle size={10} /> {c.precautions}
                                                                    </div>
                                                                </td>
                                                            </>
                                                        )}
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                                {activeTab === 3 && (
                                    <ul style={{ paddingLeft: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
                                        {a.prevention_tips.map((tip, i) => (
                                            <li key={i} style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{tip}</li>
                                        ))}
                                    </ul>
                                )}
                            </motion.div>
                        </div>
                    </div>
                )}

                {/* Growth Prescription */}
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 700, marginBottom: 20, letterSpacing: '-0.02em' }}>
                    Growth Prescription
                </h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 32 }}>
                    <PrescriptionCard icon={Sun} title="Sunlight" color="#f59e0b"
                        metric={`${a.sunlight_hours}h / day`}
                        desc={`${a.sunlight_intensity} intensity`} />
                    <PrescriptionCard icon={Droplets} title="Water" color="#60a5fa"
                        metric={`Every ${a.watering_frequency_days}d`}
                        desc={`${a.watering_amount_ml}ml per session`} />
                    <PrescriptionCard icon={Leaf} title="Soil"
                        metric={`pH ${a.soil_ph_min}–${a.soil_ph_max}`}
                        desc={a.soil_type} />
                    <PrescriptionCard icon={FlaskConical} title="Fertilizer" color="#a78bfa"
                        metric={a.fertilizer_npk}
                        desc={`${a.fertilizer_type} every ${a.fertilizer_frequency_weeks}w`} />
                    <PrescriptionCard icon={Thermometer} title="Climate" color="#ef4444"
                        metric={`${a.temperature_min_c}–${a.temperature_max_c}°C`}
                        desc={`${a.humidity_min_percent}–${a.humidity_max_percent}% humidity`} />
                    <PrescriptionCard icon={Scissors} title="Pruning" color="#4ade80"
                        metric={a.pruning_frequency}
                        desc={a.pruning_tips} />
                </div>

                {/* Nutrient radar chart */}
                {nutrientData.length > 0 && (
                    <div className="card" style={{ padding: 24, marginBottom: 24 }}>
                        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 600, marginBottom: 20 }}>
                            Nutrient Status
                        </h3>
                        <ResponsiveContainer width="100%" height={240}>
                            <RadarChart data={nutrientData}>
                                <PolarGrid stroke="rgba(74,222,128,0.1)" />
                                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} />
                                <Radar name="Nutrient" dataKey="value" stroke="#4ade80" fill="#4ade80" fillOpacity={0.15} strokeWidth={2} />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>
                )}

                {/* Companion plants */}
                {a.companion_plants?.length > 0 && (
                    <div className="card" style={{ padding: 24, marginBottom: 24 }}>
                        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 600, marginBottom: 16 }}>
                            Companion Plants
                        </h3>
                        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                            {a.companion_plants.map((p) => (
                                <span key={p} className="badge badge-green" style={{ fontSize: 12, padding: '4px 10px' }}>
                                    <Leaf size={10} /> {p}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Common mistakes */}
                {a.common_mistakes?.length > 0 && (
                    <div className="card" style={{ padding: 24 }}>
                        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 600, marginBottom: 16 }}>
                            Common Mistakes to Avoid
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                            {a.common_mistakes.map((m, i) => (
                                <div key={i} style={{ display: 'flex', gap: 10, padding: 12, background: 'rgba(239,68,68,0.04)', border: '1px solid rgba(239,68,68,0.15)', borderRadius: 10 }}>
                                    <AlertTriangle size={14} color="#ef4444" style={{ marginTop: 2, flexShrink: 0 }} />
                                    <span style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{m}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Expert summary */}
                {a.expert_summary && (
                    <div style={{ marginTop: 24, padding: 24, background: 'rgba(74,222,128,0.04)', border: '1px solid rgba(74,222,128,0.12)', borderRadius: 16 }}>
                        <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.8, fontStyle: 'italic' }}>
                            "{a.expert_summary}"
                        </p>
                        <div style={{ marginTop: 12, fontSize: 12, color: 'var(--text-muted)' }}>— Dr. Flora, PlantIQ AI</div>
                    </div>
                )}
            </main>
        </div>
    );
}
