import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Load insights from ML processed data
const getInsights = () => {
    const filePath = path.join(__dirname, '../../data/processed/eda_insights.json');
    if (fs.existsSync(filePath)) {
        return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    }
    return { error: 'Insights not found' };
};

const getOutbreaks = () => {
    const filePath = path.join(__dirname, '../../data/processed/outbreaks.json');
    if (fs.existsSync(filePath)) {
        return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    }
    return [];
};

app.get('/api/insights', (req, res) => {
    res.json(getInsights());
});

app.get('/api/outbreaks', (req, res) => {
    res.json(getOutbreaks());
});

app.get('/api/health', (req, res) => {
    res.json({ status: 'Backend is running' });
});

// Notifications
let notifications = [
    { id: '1', title: 'New Outbreak Detected', message: 'Spike in fever cases in Region A', isRead: false, createdAt: new Date() },
    { id: '2', title: 'Data Cleaning Complete', message: 'The latest batch of symptom data has been processed.', isRead: true, createdAt: new Date() }
];

app.get('/api/notifications', (req, res) => {
    res.json(notifications);
});

app.patch('/api/notifications/:id/read', (req, res) => {
    const { id } = req.params;
    notifications = notifications.map(n => n.id === id ? { ...n, isRead: true } : n);
    res.json({ success: true });
});

app.patch('/api/notifications/mark-all', (req, res) => {
    notifications = notifications.map(n => ({ ...n, isRead: true }));
    res.json({ success: true });
});

// Reports
app.get('/api/reports/summary', (req, res) => {
    const insights = getInsights();
    const outbreaks = getOutbreaks();
    
    res.json({
        totalUsers: 15, // Mocked
        totalDiseases: Object.keys(insights?.disease_symptom_map || {}).length,
        totalCases: outbreaks.length,
        outbreakTrends: Object.entries(insights?.monthly_outbreak_trends || {}).map(([month, count]) => ({ date: month, count })),
        diseaseStats: Object.entries(insights?.top_symptoms || {}).map(([name, count]) => ({ title: name.replace('symptom_', ''), count })),
        categoryData: [
            { name: 'Viral', value: 45 },
            { name: 'Bacterial', value: 30 },
            { name: 'Fungal', value: 15 },
            { name: 'Other', value: 10 }
        ]
    });
});

import { Parser } from 'json2csv';
import PDFDocument from 'pdfkit';

app.get('/api/reports/export/csv', (req, res) => {
    try {
        const insights = getInsights();
        const data = Object.entries(insights?.top_symptoms || {}).map(([name, count]) => ({ 
            symptom: name.replace('symptom_', ''), 
            count 
        }));

        const fields = ['symptom', 'count'];
        const json2csvParser = new Parser({ fields });
        const csv = json2csvParser.parse(data);

        res.header('Content-Type', 'text/csv');
        res.attachment('clinical_report.csv');
        return res.send(csv);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/reports/export/pdf', (req, res) => {
    try {
        const insights = getInsights();
        const outbreaks = getOutbreaks();
        const doc = new PDFDocument();
        
        res.setHeader('Content-disposition', 'attachment; filename="clinical_report.pdf"');
        res.setHeader('Content-type', 'application/pdf');

        doc.fontSize(25).text('ClinX Clinical Report', { align: 'center' });
        doc.moveDown();
        doc.fontSize(12).text(`Generated on: ${new Date().toLocaleString()}`);
        doc.moveDown();

        doc.fontSize(18).text('Platform Summary:');
        doc.fontSize(14).text(`Total Disease Signatures: ${Object.keys(insights?.disease_symptom_map || {}).length}`);
        doc.text(`Total Active Outbreaks: ${outbreaks.length}`);
        doc.moveDown();

        doc.fontSize(18).text('Top Symptom Frequencies:');
        Object.entries(insights?.top_symptoms || {}).slice(0, 10).forEach(([name, count]) => {
            doc.fontSize(12).text(`${name.replace('symptom_', '')}: ${count}`);
        });

        doc.pipe(res);
        doc.end();
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
