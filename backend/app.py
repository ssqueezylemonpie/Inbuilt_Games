import os
from flask import Flask, render_template
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__,
            template_folder='templates',
            static_folder='static')


app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)


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
