import pandas as pd
import os

def clean_public_health_data(input_path, output_path):
    df = pd.read_csv(input_path)
    # Basic cleaning: handle missing values
    df = df.dropna()
    # Normalize gender
    df['Gender'] = df['Gender'].str.capitalize()
    df.to_csv(output_path, index=False)
    print(f"Cleaned Public Health Data saved to {output_path}")

def clean_symptom_disease_data(input_path, output_path):
    df = pd.read_csv(input_path)
    df = df.dropna()
    df.to_csv(output_path, index=False)
    print(f"Cleaned Symptom-Disease Data saved to {output_path}")

def clean_healthcare_data(input_path, output_path):
    df = pd.read_csv(input_path)
    df = df.dropna()
    # Ensure symptoms are consistent (e.g., lower case, stripped)
    df['Symptoms'] = df['Symptoms'].apply(lambda x: ", ".join([s.strip().lower() for s in x.split(",")]))
    df.to_csv(output_path, index=False)
    print(f"Cleaned Healthcare Data saved to {output_path}")

if __name__ == "__main__":
    os.makedirs('data/processed', exist_ok=True)
    clean_public_health_data('data/raw/public_health_surveillance_dataset.csv', 'data/processed/public_health_clean.csv')
    clean_symptom_disease_data('data/raw/Community_Healthcare_MultiSymptomsDisease_Diagnostic_Dataset.csv', 'data/processed/symptom_disease_clean.csv')
    clean_healthcare_data('data/raw/Healthcare.csv', 'data/processed/healthcare_clean.csv')
