import pandas as pd
import json
import os

def get_clinic_insights():
    raw_dir = 'data/raw'
    
    # 1. Hospitals and Beds Statewise
    df_statewise = pd.read_csv(os.path.join(raw_dir, 'Hospitals_and_Beds_statewise.csv'))
    # The header seems to be shifted or has an empty first col
    # Looking at the output: ,PHC,CHC,SDH,DH,Total,
    # Andaman & Nicobar Islands,27,4,,3,34,1246
    df_statewise.columns = ['State/UT', 'PHC', 'CHC', 'SDH', 'DH', 'Total_Hospitals', 'Total_Beds']
    df_statewise = df_statewise.dropna(subset=['State/UT'])
    
    # 2. Government Hospitals Rural/Urban
    # Row 0: States/UTs,Rural hospitals,,Urban hospitals,,As on
    # Row 1: ,No.,Beds,No.,Beds,
    df_rural_urban = pd.read_csv(os.path.join(raw_dir, 'Government_Hospitals_and_Beds_Rural_Urban.csv'), skiprows=2, header=None)
    df_rural_urban.columns = ['State/UT', 'Rural_Hospitals', 'Rural_Beds', 'Urban_Hospitals', 'Urban_Beds', 'As_on']
    
    # Clean data (convert to numeric, handle NAs)
    for col in ['PHC', 'CHC', 'SDH', 'DH', 'Total_Hospitals', 'Total_Beds']:
        df_statewise[col] = pd.to_numeric(df_statewise[col], errors='coerce').fillna(0)
        
    for col in ['Rural_Hospitals', 'Rural_Beds', 'Urban_Hospitals', 'Urban_Beds']:
        df_rural_urban[col] = pd.to_numeric(df_rural_urban[col], errors='coerce').fillna(0)

    insights = {
        "statewise_distribution": df_statewise.set_index('State/UT')[['Total_Hospitals', 'Total_Beds']].to_dict('index'),
        "rural_vs_urban_beds": {
            "total_rural_beds": int(df_rural_urban['Rural_Beds'].sum()),
            "total_urban_beds": int(df_rural_urban['Urban_Beds'].sum())
        },
        "top_states_by_beds": df_statewise.sort_values(by='Total_Beds', ascending=False).head(5)[['State/UT', 'Total_Beds']].to_dict('records'),
        "facility_types": {
            "PHC": int(df_statewise['PHC'].sum()),
            "CHC": int(df_statewise['CHC'].sum()),
            "SDH": int(df_statewise['SDH'].sum()),
            "DH": int(df_statewise['DH'].sum())
        }
    }
    
    print(json.dumps(insights, indent=4))

if __name__ == "__main__":
    get_clinic_insights()
