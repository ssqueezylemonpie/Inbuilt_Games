# Inbuilt Games

A small web-based game collection you can play directly in your browser.  
The project includes two games (Target Practice and Memory Test) and a backend with login, leaderboard, and progress saving.

---


## 🚀 Features

- 🔐 **Login & Register** — Create an account to save progress  
- 🏆 **Leaderboard** — Compare your high scores with others  
- 🎮 **Game Library** — Currently includes:
  - Target Practice (Aim Trainer)
  - Memory Test  
- 💾 **Database Integration** (for accounts & scores)
- 🌐 **Web Server** running on Linux

---

## 🗂️ Planning and To-Do List

1. Set up HTML/CSS/JS for the games  
2. Deploy backend server on Linux with MariaDB  
3. Integrate database for:
   - User authentication  
   - Leaderboard system  
   - Saving user progress  
4. Improve UI and add more games (in the future)

---

## 📁 Folder Structure

```
Inbuilt_Games
├── backend/
│   └── app.py
├── static/
│   └── css/
│       └── style.css
├── templates/
│   ├── index.html
│   ├── game1.html
│   ├── game2.html
│   ├── js.script
│   └── style.css
└── README.md
```

---

## 🧩 Technologies Used

- Python (Flask)
- HTML, CSS, JavaScript
- MariaDB
- Linux (web server)

---



---

### 🛠️ Installation

- **Essentials**: Python 3.10+ and `pip` installed. A virtual environment is recommended.

Windows (PowerShell) quick start:

```
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt  # if you have one
# or, install the minimal dependency:
pip install Flask
```

Run the server:

```
python backend\app.py
```
The app will be available at `http://127.0.0.1:5000` by default.

### ⚙️ Usage

- Open your browser and go to `http://127.0.0.1:5000`.
- Use the site navigation to access the games (Target Practice / Aim Trainer, Memory Test).
- Create an account or log in to create a account.
- Follow on-screen instructions for each game; use your mouse (or keyboard if supported) to play.
---

## 📌 Future Improvements

- Add more games  
- Improve UI/UX
- Add database(MariaDB)
- Fix the leaderboard shows the current top scores
- Add that users can be saved in the database

---