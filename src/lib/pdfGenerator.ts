import jsPDF from 'jspdf';
import type { Scan } from '../types';

export async function downloadPDF(scan: Scan) {
    const analysis = scan.full_analysis;
    const doc = new jsPDF();
    
    let y = 20;
    const lineHeight = 7;
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    const maxWidth = pageWidth - (margin * 2);

    // Helper function to add text with word wrap
    const addText = (text: string, fontSize: number = 10, isBold: boolean = false) => {
        doc.setFontSize(fontSize);
        if (isBold) doc.setFont('helvetica', 'bold');
        else doc.setFont('helvetica', 'normal');
        
        const lines = doc.splitTextToSize(text, maxWidth);
        lines.forEach((line: string) => {
            if (y > 280) {
                doc.addPage();
                y = 20;
            }
            doc.text(line, margin, y);
            y += lineHeight;
        });
    };

    const addSection = (title: string) => {
        y += 5;
        doc.setFillColor(74, 222, 128);
        doc.rect(margin, y - 5, maxWidth, 8, 'F');
        doc.setTextColor(8, 13, 10);
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text(title, margin + 2, y);
        doc.setTextColor(0, 0, 0);
        y += 10;
    };

    // Header
    doc.setFillColor(74, 222, 128);
    doc.rect(0, 0, pageWidth, 30, 'F');
    doc.setTextColor(8, 13, 10);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('PlantIQ Analysis Report', margin, 15);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(new Date(scan.created_at).toLocaleDateString(), margin, 23);
    doc.setTextColor(0, 0, 0);
    y = 40;

    // Plant Info
    addText(analysis.plant_name, 18, true);
    addText(analysis.scientific_name, 12);
    addText(`Family: ${analysis.plant_family}`, 10);
    addText(`Confidence: ${analysis.confidence_percent}%`, 10);
    addText(`Health Score: ${analysis.health_score}/100`, 10, true);
    y += 3;
    addText(analysis.plant_description, 10);

    // Disease Analysis
    if (analysis.disease_detected) {
        addSection('DISEASE ANALYSIS');
        addText(`Disease: ${analysis.disease_name}`, 12, true);
        addText(`Severity: ${analysis.severity}`, 10);
        addText(`Affected Area: ${analysis.affected_area_percent}%`, 10);
        y += 2;
        addText(analysis.disease_description, 10);

        // Immediate Actions
        y += 5;
        addText('Immediate Actions:', 11, true);
        analysis.immediate_actions.forEach((action, i) => {
            addText(`${i + 1}. ${action}`, 9);
        });

        // Natural Remedies
        y += 5;
        addText('Natural Remedies:', 11, true);
        analysis.natural_remedies.forEach((remedy, i) => {
            if (typeof remedy === 'string') {
                addText(`${i + 1}. ${remedy}`, 9);
            } else {
                addText(`${i + 1}. ${remedy.remedy}`, 9, true);
                addText(`   Method: ${remedy.method}`, 9);
                addText(`   Frequency: ${remedy.frequency}`, 9);
            }
        });

        // Chemical Treatments
        if (analysis.chemical_treatments && analysis.chemical_treatments.length > 0) {
            y += 5;
            addText('Chemical Treatments:', 11, true);
            analysis.chemical_treatments.forEach((treatment, i) => {
                if (typeof treatment === 'string') {
                    addText(`${i + 1}. ${treatment}`, 9);
                } else {
                    addText(`${i + 1}. ${treatment.product_type}`, 9, true);
                    addText(`   Active Ingredient: ${treatment.active_ingredient}`, 9);
                    addText(`   Dosage: ${treatment.dosage}`, 9);
                    addText(`   Frequency: ${treatment.frequency}`, 9);
                    addText(`   Precautions: ${treatment.precautions}`, 9);
                }
            });
        }

        // Prevention
        y += 5;
        addText('Prevention Tips:', 11, true);
        analysis.prevention_tips.forEach((tip, i) => {
            addText(`${i + 1}. ${tip}`, 9);
        });
    }

    // Care Prescription
    addSection('CARE PRESCRIPTION');
    addText(`Sunlight: ${analysis.sunlight_hours}h/day (${analysis.sunlight_intensity} intensity)`, 10);
    addText(`Watering: Every ${analysis.watering_frequency_days} days, ${analysis.watering_amount_ml}ml per session`, 10);
    addText(`Soil: pH ${analysis.soil_ph_min}-${analysis.soil_ph_max}, ${analysis.soil_type}`, 10);
    addText(`Fertilizer: ${analysis.fertilizer_npk} (${analysis.fertilizer_type}), every ${analysis.fertilizer_frequency_weeks} weeks`, 10);
    addText(`Temperature: ${analysis.temperature_min_c}-${analysis.temperature_max_c}°C`, 10);
    addText(`Humidity: ${analysis.humidity_min_percent}-${analysis.humidity_max_percent}%`, 10);
    addText(`Pruning: ${analysis.pruning_frequency} - ${analysis.pruning_tips}`, 10);

    // Expert Summary
    if (analysis.expert_summary) {
        addSection('EXPERT SUMMARY');
        addText(`"${analysis.expert_summary}"`, 10);
        addText('— Dr. Flora, PlantIQ AI', 9);
    }

    // Footer
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(`Scan ID: ${scan.id}`, margin, doc.internal.pageSize.getHeight() - 10);
    doc.text('Generated by PlantIQ', pageWidth - margin - 40, doc.internal.pageSize.getHeight() - 10);

    // Download
    doc.save(`PlantIQ-${analysis.plant_name}-${new Date().toISOString().split('T')[0]}.pdf`);
}
