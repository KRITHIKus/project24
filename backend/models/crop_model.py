
def train_and_save_model():
    import pandas as pd
    from sklearn.model_selection import train_test_split
    from sklearn.ensemble import RandomForestClassifier
    import joblib

    # Load the dataset
    data = pd.read_csv('datasets/crop_data.csv')

    # Features and labels
    features = data[['N', 'P', 'K', 'ph', 'temperature', 'humidity', 'rainfall']]
    labels = data['label']

    # Split the data into training and testing sets
    X_train, X_test, y_train, y_test = train_test_split(features, labels, test_size=0.2, random_state=42)

    # Train the model
    model = RandomForestClassifier(random_state=42)
    model.fit(X_train, y_train)

    # Save the trained model
    joblib.dump(model, 'models/crop_model.pkl')
    print("Model trained and saved successfully.")
