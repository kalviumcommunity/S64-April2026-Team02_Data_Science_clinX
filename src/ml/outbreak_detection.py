import pandas as pd
import json
import os

def detect_outbreaks():
    # Load public health data
    df = pd.read_csv('data/processed/public_health_clean.csv')
    df['Date'] = pd.to_datetime(df['Date'])
    
    # Define thresholds
    CASE_THRESHOLD = 40
    RATE_THRESHOLD = 2.0
    
    # Filter for potential outbreaks
    outbreaks = df[(df['Daily_New_Cases'] > CASE_THRESHOLD) | (df['Transmission_Rate'] > RATE_THRESHOLD)]
    
    # Sort by date
    outbreaks = outbreaks.sort_values(by='Date', ascending=False)
    
    # Convert to list of dicts for reporting
    outbreak_list = outbreaks.head(20).to_dict(orient='records')
    
    # Save to processed data for frontend
    with open('data/processed/outbreaks.json', 'w') as f:
        # Convert datetime to string for JSON serialization
        json.dump(outbreak_list, f, indent=4, default=str)
    
    print(f"Detected {len(outbreaks)} potential outbreak events. Top 20 saved to data/processed/outbreaks.json")

if __name__ == "__main__":
    detect_outbreaks()
