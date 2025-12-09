import os
from flask import Flask, render_template
from flask_sqlalchemy import SQLAlchemy

# Get the absolute path of the current file's directory
basedir = os.path.abspath(os.path.dirname(__file__))

# Get the parent directory (your project's root folder)
parent_dir = os.path.dirname(basedir)

# Create the Flask app
# You manually override template_folder and static_folder so that they point
# to the parent directory instead of the same folder as this file.
app = Flask(
    __name__,
    template_folder=os.path.join(parent_dir, 'templates'),
    static_folder=os.path.join(parent_dir, 'static')
)

# Configure SQLite database using SQLAlchemy
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'   # DB file stored in project folder
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False              # Disable extra overhead

# Initialize SQLAlchemy
db = SQLAlchemy(app)

# Define a database model (table) named "User"
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)           # Auto-incrementing primary key
    username = db.Column(db.String(80), unique=True, nullable=False)  # Unique username column

# Route for homepage -> renders templates/index.html
@app.route('/')
def home():
    return render_template('index.html')

# Route for aim trainer page -> renders templates/aimtrainer.html
@app.route('/aimtrainer')
def aimtrainer():
    return render_template('aimtrainer.html')

# Route for match page -> renders templates/match.html
@app.route('/match')
def match():
    return render_template('match.html')

# Run the Flask development server
if __name__ == '__main__':
    app.run(debug=True)

# Create tables in the database (must run inside app context)
with app.app_context():
    db.create_all()
