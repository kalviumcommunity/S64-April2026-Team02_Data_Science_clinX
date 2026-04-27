import pandas as pd

def check_distribution():
    df = pd.read_csv('data/processed/healthcare_clean.csv')
    print("Disease Distribution:")
    print(df['Disease'].value_counts())
    
    all_symptoms = []
    df['Symptoms'].str.split(',').apply(lambda x: all_symptoms.extend([s.strip() for s in x]))
    unique_symps = set(all_symptoms)
    print("\nTotal Unique Symptoms:", len(unique_symps))
    print("Symptoms Sample:", list(unique_symps)[:10])

if __name__ == "__main__":
    check_distribution()
