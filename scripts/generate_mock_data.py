import pandas as pd
import numpy as np
import os
from datetime import timedelta, date

os.makedirs('data/raw', exist_ok=True)

def generate_public_health_data(n=2000):
    np.random.seed(42)
    # Generate realistic seasonal data
    dates = pd.date_range(start='2022-01-01', periods=n, freq='D')
    
    # Base cases with seasonality (sin wave) + noise
    time_series = np.arange(n)
    seasonal_effect = 20 * np.sin(2 * np.pi * time_series / 365)
    trend_effect = time_series * 0.01
    noise = np.random.normal(0, 5, n)
    
    daily_cases = np.clip(30 + seasonal_effect + trend_effect + noise, 5, 200).astype(int)
    
    # Transmission rate loosely correlated with cases
    transmission_rate = np.clip((daily_cases / 30) + np.random.normal(0, 0.2, n), 0.5, 4.5)
    
    df = pd.DataFrame({
        'Date': dates,
        'Location': np.random.choice(['Urban', 'Suburban', 'Rural'], n, p=[0.6, 0.3, 0.1]),
        'Daily_New_Cases': daily_cases,
        'Transmission_Rate': round(pd.Series(transmission_rate), 2)
    })
    
    # Introduce a few massive 'outbreak' spikes
    outbreak_indices = [150, 400, 750, 1100, 1400, 1800]
    for idx in outbreak_indices:
        df.loc[idx:idx+14, 'Daily_New_Cases'] *= np.random.randint(2, 5)
        df.loc[idx:idx+14, 'Transmission_Rate'] += np.random.uniform(1.0, 2.5)
        
    df.to_csv('data/raw/public_health_surveillance_dataset.csv', index=False)
    print("Generated realistic public_health_surveillance_dataset.csv")

def generate_symptom_disease_data(n=5000):
    np.random.seed(42)
    disease_profiles = {
        'COVID-19': {'cough': 0.8, 'fever': 0.9, 'fatigue': 0.7, 'loss_of_taste': 0.6},
        'Influenza': {'fever': 0.8, 'body_ache': 0.8, 'fatigue': 0.8, 'cough': 0.6},
        'Asthma': {'shortness_of_breath': 0.9, 'wheezing': 0.8, 'chest_tightness': 0.7, 'cough': 0.5},
        'Diabetes': {'polyuria': 0.8, 'polydipsia': 0.8, 'fatigue': 0.6, 'weight_loss': 0.5},
        'Pneumonia': {'fever': 0.8, 'cough': 0.9, 'shortness_of_breath': 0.8, 'chest_pain': 0.6},
        'Hyperthyroidism': {'weight_loss': 0.7, 'palpitations': 0.8, 'sweating': 0.7, 'anxiety': 0.6},
        'Dengue': {'fever': 0.9, 'severe_headache': 0.8, 'joint_pain': 0.8, 'rash': 0.5}
    }
    
    diseases = list(disease_profiles.keys())
    all_symptoms = list(set([symp for d in disease_profiles.values() for symp in d.keys()]))
    all_symptoms += ['nausea', 'vomiting', 'diarrhea', 'dizziness'] # Add some noise symptoms
    
    data = []
    for _ in range(n):
        disease = np.random.choice(diseases)
        profile = disease_profiles[disease]
        
        row = {'disease': disease}
        for symp in all_symptoms:
            # probability of having this symptom based on disease profile, or base 5% chance
            prob = profile.get(symp, 0.05)
            row[f'symptom_{symp}'] = np.random.choice([0, 1], p=[1-prob, prob])
        data.append(row)
    
    df = pd.DataFrame(data)
    df.to_csv('data/raw/Community_Healthcare_MultiSymptomsDisease_Diagnostic_Dataset.csv', index=False)
    print("Generated realistic Community_Healthcare_MultiSymptomsDisease_Diagnostic_Dataset.csv")

def generate_healthcare_csv(n=5000):
    np.random.seed(42)
    df = pd.read_csv('data/raw/Community_Healthcare_MultiSymptomsDisease_Diagnostic_Dataset.csv')
    
    data = []
    for i in range(len(df)):
        row = df.iloc[i]
        active_symps = [col.replace('symptom_', '').replace('_', ' ').title() for col in df.columns if col.startswith('symptom_') and row[col] == 1]
        
        if not active_symps:
            active_symps = ['Fatigue'] # fallback
            
        data.append({
            'Patient_ID': f"PT-{i:06d}",
            'Age': int(np.random.normal(45, 15)),
            'Gender': np.random.choice(['Male', 'Female'], p=[0.48, 0.52]),
            'Symptoms': ", ".join(active_symps),
            'Symptom_Count': len(active_symps),
            'Disease': row['disease']
        })
    
    df_healthcare = pd.DataFrame(data)
    df_healthcare['Age'] = np.clip(df_healthcare['Age'], 1, 95)
    df_healthcare.to_csv('data/raw/Healthcare.csv', index=False)
    print("Generated realistic Healthcare.csv")

if __name__ == "__main__":
    generate_public_health_data()
    generate_symptom_disease_data()
    generate_healthcare_csv()
