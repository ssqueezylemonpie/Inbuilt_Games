import os
from flask import Flask, render_template
from flask_sqlalchemy import SQLAlchemy

# Get the parent directory (project root)
basedir = os.path.abspath(os.path.dirname(__file__))
parent_dir = os.path.dirname(basedir)

app = Flask(__name__,
            template_folder=os.path.join(parent_dir, 'templates'),
            static_folder=os.path.join(parent_dir, 'static'))


app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)

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




with app.app_context():
    db.create_all()  
