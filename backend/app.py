import os
from flask import Flask, render_template

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '../'))

app = Flask(
    __name__,
    template_folder=os.path.join(BASE_DIR, 'templates'),
    static_folder=os.path.join(BASE_DIR, 'static')
)

@app.route('/')
def home():
    return render_template('index.html')

app.run(debug=True)