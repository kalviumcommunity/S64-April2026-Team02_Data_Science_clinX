import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report
import joblib
import os

def train_model():
    # Load dataset
    df = pd.read_csv('data/processed/symptom_disease_clean.csv')
    
    # Features and Target
    X = df.drop('disease', axis=1)
    y = df['disease']
    
    # Split
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    # Train
    model = RandomForestClassifier(n_estimators=100, random_state=42)
    model.fit(X_train, y_train)
    
    # Evaluate
    y_pred = model.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred)
    print(f"Model Accuracy: {accuracy * 100:.2f}%")
    print(classification_report(y_test, y_pred))
    
    # Save model and feature names
    os.makedirs('ml/models', exist_ok=True)
    joblib.dump(model, 'ml/models/diagnosis_model.joblib')
    joblib.dump(X.columns.tolist(), 'ml/models/feature_names.joblib')
    print("Model saved to ml/models/diagnosis_model.joblib")

if __name__ == "__main__":
    train_model()
