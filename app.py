from flask import Flask, render_template, request, jsonify
import joblib
import numpy as np

app = Flask(__name__)

# Load the model
model = joblib.load(r"C:\Users\mirya\OneDrive\Desktop\mini pro\heart-disease-project\92heart-disease.pkl")

@app.route('/')
def index():
    return render_template("index.html")  # This will serve index.html

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()
    features = [
        data['Age'], data['Sex'], data['ChestPainType'], data['RestingBP'], data['Cholesterol'],
        data['FastingBS'], data['RestingECG'], data['MaxHR'], data['ExerciseAngina'],
        data['Oldpeak'], data['ST_Slope']
    ]
    features = np.array(features).reshape(1, -1)
    prediction = model.predict(features)[0]
    return jsonify({'result': int(prediction)})

if __name__ == '__main__':
    app.run(debug=True)
