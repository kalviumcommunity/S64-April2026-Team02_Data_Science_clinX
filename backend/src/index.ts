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

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
