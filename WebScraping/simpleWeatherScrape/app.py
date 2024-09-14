from flask import Flask, send_from_directory, jsonify
import json
import os
import subprocess

app = Flask(__name__)

@app.route('/')
def index():
    return send_from_directory('.', 'index.html')

@app.route('/styles.css')
def css():
    return send_from_directory('.', 'styles.css')

@app.route('/script.js')
def js():
    return send_from_directory('.', 'script.js')

@app.route('/weather_data.json')
def weather_data():
    # Run the main.py script to update weather_data.json
    subprocess.run(['python', 'main.py'], check=True)
    return send_from_directory('.', 'weather_data.json')

if __name__ == '__main__':
    app.run(debug=True)
