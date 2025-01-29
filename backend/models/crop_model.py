
# def train_and_save_model():
#     import pandas as pd
#     from sklearn.model_selection import train_test_split
#     from sklearn.ensemble import RandomForestClassifier
#     import joblib

#     # Load the dataset
#     data = pd.read_csv('datasets/crop_data.csv')

#     # Features and labels
#     features = data[['N', 'P', 'K', 'ph', 'temperature', 'humidity', 'rainfall']]
#     labels = data['label']

#     # Split the data into training and testing sets
#     X_train, X_test, y_train, y_test = train_test_split(features, labels, test_size=0.2, random_state=42)

#     # Train the model
#     model = RandomForestClassifier(random_state=42)
#     model.fit(X_train, y_train)

#     # Save the trained model
#     joblib.dump(model, 'models/crop_model.pkl')
#     print("Model trained and saved successfully.")


import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
import joblib
import os

def train_and_save_model():
    try:
        # Check if the dataset exists
        dataset_path = 'datasets/crop_data.csv'
        if not os.path.exists(dataset_path):
            raise FileNotFoundError(f"Dataset not found at {dataset_path}")

        # Load the dataset
        data = pd.read_csv(dataset_path)

        # Check if required columns are present in the dataset
        required_columns = ['N', 'P', 'K', 'ph', 'temperature', 'humidity', 'rainfall', 'label']
        if not all(col in data.columns for col in required_columns):
            raise ValueError(f"Dataset must contain the following columns: {', '.join(required_columns)}")

        # Features and labels
        features = data[['N', 'P', 'K', 'ph', 'temperature', 'humidity', 'rainfall']]
        labels = data['label']

        # Split the data into training and testing sets
        X_train, X_test, y_train, y_test = train_test_split(features, labels, test_size=0.2, random_state=42)

        # Train the model
        model = RandomForestClassifier(random_state=42)
        model.fit(X_train, y_train)

        # Save the trained model
        model_save_path = 'models/crop_model.pkl'
        joblib.dump(model, model_save_path)
        print("Model trained and saved successfully.")

        # Optionally, you can also print model performance
        accuracy = model.score(X_test, y_test)
        print(f"Model accuracy on test data: {accuracy * 100:.2f}%")

    except Exception as e:
        print(f"Error during model training: {str(e)}")

if __name__ == '__main__':
    train_and_save_model()
