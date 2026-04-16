import pandas as pd
import json
import os

def run_eda():
    # Load processed data
    pub_health = pd.read_csv('data/processed/public_health_clean.csv')
    healthcare = pd.read_csv('data/processed/healthcare_clean.csv')
    symp_dis = pd.read_csv('data/processed/symptom_disease_clean.csv')
    
    insights = {}
    
    # 1. Frequently reported symptoms (from healthcare.csv)
    all_symptoms = []
    healthcare['Symptoms'].str.split(',').apply(lambda x: all_symptoms.extend([s.strip() for s in x]))
    symptom_freq = pd.Series(all_symptoms).value_counts().to_dict()
    insights['top_symptoms'] = symptom_freq
    
    # 2. Disease distribution by Gender (from healthcare.csv)
    disease_gender = healthcare.groupby(['Disease', 'Gender']).size().unstack(fill_value=0).to_dict()
    insights['disease_by_gender'] = disease_gender
    
    # 3. Seasonal trends (from public_health_clean.csv)
    pub_health['Date'] = pd.to_datetime(pub_health['Date'])
    pub_health['Month'] = pub_health['Date'].dt.month_name()
    monthly_cases = pub_health.groupby('Month')['Daily_New_Cases'].sum().to_dict()
    insights['monthly_outbreak_trends'] = monthly_cases
    
    # 4. Symptom-Disease relationships (from symptom_disease_clean.csv)
    # Calculate most common symptoms for each disease
    symptom_cols = [c for c in symp_dis.columns if c.startswith('symptom_')]
    disease_symptoms = {}
    for disease in symp_dis['disease'].unique():
        subset = symp_dis[symp_dis['disease'] == disease]
        top_symps = subset[symptom_cols].sum().sort_values(ascending=False).head(5)
        disease_symptoms[disease] = top_symps[top_symps > 0].index.tolist()
    insights['disease_symptom_map'] = disease_symptoms
    
    # Save insights to JSON for frontend/backend use
    os.makedirs('data/processed', exist_ok=True)
    with open('data/processed/eda_insights.json', 'w') as f:
        json.dump(insights, f, indent=4)
    print("EDA insights saved to data/processed/eda_insights.json")

if __name__ == "__main__":
    run_eda()
