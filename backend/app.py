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

@app.route('/aimtrainer')
def aimtrainer():
    return render_template('aimtrainer.html')

@app.route('/match')
def match():
    return render_template('match.html')

if __name__ == '__main__':
    app.run(debug=True)


app.run(debug=True)