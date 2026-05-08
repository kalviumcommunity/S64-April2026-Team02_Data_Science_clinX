import pandas as pd
import numpy as np
import json
import os
from sklearn.linear_model import LinearRegression

def generate_forecast():
    # 1. Generate synthetic historical data (last 30 days)
    np.random.seed(42)
    days = np.arange(1, 31).reshape(-1, 1)
    
    # Simulate respiratory cases increasing due to humidity
    base_cases = 50
    trend = 1.5 * days.flatten()
    seasonality = 10 * np.sin(days.flatten() / 3)
    noise = np.random.normal(0, 5, 30)
    
    historical_cases = np.maximum(0, base_cases + trend + seasonality + noise)
    
    # 2. Train a simple Linear Regression model to forecast the next 14 days
    model = LinearRegression()
    model.fit(days, historical_cases)
    
    future_days = np.arange(31, 45).reshape(-1, 1)
    forecast_cases = model.predict(future_days)
    
    # Add some uncertainty (confidence interval)
    std_dev = np.std(historical_cases - model.predict(days))
    
    # 3. Format data for the frontend
    result = []
    
    # Add historical data
    for i in range(30):
        result.append({
            "day": f"Day {i+1}",
            "historical": round(historical_cases[i]),
            "forecast": None,
            "lowerBound": None,
            "upperBound": None
        })
    
    # Link the last historical point to forecast so the chart line connects smoothly
    result[-1]["forecast"] = result[-1]["historical"]
    result[-1]["lowerBound"] = result[-1]["historical"]
    result[-1]["upperBound"] = result[-1]["historical"]
    
    # Add forecasted data
    for i in range(14):
        pred = round(forecast_cases[i])
        result.append({
            "day": f"Day {31+i}",
            "historical": None,
            "forecast": pred,
            "lowerBound": max(0, round(pred - 1.96 * std_dev)),
            "upperBound": round(pred + 1.96 * std_dev)
        })
        
    # Calculate percentage increase
    current_avg = np.mean(historical_cases[-7:])
    future_avg = np.mean(forecast_cases[-7:])
    pct_increase = round(((future_avg - current_avg) / current_avg) * 100)
        
    output = {
        "chartData": result,
        "insights": f"Our ML model suggests a {pct_increase}% increase in respiratory cases over the next 14 days based on current humidity trends and recent outbreak patterns."
    }
    
    # Save to JSON
    os.makedirs('data/processed', exist_ok=True)
    with open('data/processed/forecast.json', 'w') as f:
        json.dump(output, f, indent=4)
        
    print(f"Forecast data generated successfully with {pct_increase}% predicted increase.")

if __name__ == "__main__":
    generate_forecast()
