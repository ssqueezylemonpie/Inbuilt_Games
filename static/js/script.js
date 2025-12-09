// Minimal UI script for modals, demo auth (localStorage) and leaderboard
(() => {

	// Shortcuts for DOM selection
	const $ = (selector, ctx = document) => ctx.querySelector(selector);
	const $$ = (selector, ctx = document) => Array.from(ctx.querySelectorAll(selector));

	/* ------------------------------
	   Modal open/close helpers
	------------------------------ */
	function openModal(modal) {
		modal.setAttribute('aria-hidden', 'false'); // For accessibility
		modal.classList.add('open');               // Show modal (via CSS)
	}
	function closeModal(modal) {
		modal.setAttribute('aria-hidden', 'true');
		modal.classList.remove('open');
	}

	/* ------------------------------
	   Element references
	------------------------------ */
	const modalLogin = $('#modalLogin');
	const modalRegister = $('#modalRegister');
	const modalLeaderboard = $('#modalLeaderboard');

	const btnLogin = $('#btn-login');
	const btnRegister = $('#btn-register');
	const btnLeaderboard = $('#btn-leaderboard');

	const registerForm = $('#registerForm');
	const loginForm = $('#loginForm');

	const leaderboardList = $('#leaderboardList');

	/* ------------------------------
	   Close buttons inside modals
	------------------------------ */
	$$('[data-close]').forEach(btn =>
		btn.addEventListener('click', e => {
			const modal = e.target.closest('.modal');
			if (modal) closeModal(modal);
		})
	);

	/* ------------------------------
	   Click outside modal content closes modal
	------------------------------ */
	[modalLogin, modalRegister, modalLeaderboard].forEach(modal => {
		modal.addEventListener('click', e => {
			if (e.target === modal) closeModal(modal);
		});
	});

	/* ------------------------------
	   Open modals from nav buttons
	------------------------------ */
	btnLogin     && btnLogin.addEventListener('click', () => openModal(modalLogin));
	btnRegister  && btnRegister.addEventListener('click', () => openModal(modalRegister));
	btnLeaderboard && btnLeaderboard.addEventListener('click', () => {
		renderLeaderboard();
		openModal(modalLeaderboard);
	});

	/* ------------------------------
	   LocalStorage "demo auth"
	   This is NOT secure — only for UI prototype
	------------------------------ */
	function loadUsers() {
		try {
			return JSON.parse(localStorage.getItem('ig_users') || '[]');
		} catch (e) {
			return [];
		}
	}
	function saveUsers(users) {
		localStorage.setItem('ig_users', JSON.stringify(users));
	}

	/* ------------------------------
	   Registration form handler
	------------------------------ */
	registerForm && registerForm.addEventListener('submit', e => {
		e.preventDefault();

		const fd = new FormData(registerForm);
		const name = fd.get('name').trim();
		const email = fd.get('email').trim().toLowerCase();
		const password = fd.get('password');

		const users = loadUsers();

		// Prevent duplicate emails
		if (users.find(u => u.email === email)) {
			alert('Account with that email already exists');
			return;
		}

		// Store new user
		users.push({ name, email, password });
		saveUsers(users);

		// Auto-login the new user
		localStorage.setItem('ig_current', email);

		alert('Registered — you are now logged in');
		closeModal(modalRegister);
	});

	/* ------------------------------
	   Login form handler
	------------------------------ */
	loginForm && loginForm.addEventListener('submit', e => {
		e.preventDefault();

		const fd = new FormData(loginForm);
		const email = fd.get('email').trim().toLowerCase();
		const password = fd.get('password');

		const users = loadUsers();

		// Match email + password
		const user = users.find(u => u.email === email && u.password === password);

		if (!user) {
			alert('Invalid credentials');
			return;
		}

		localStorage.setItem('ig_current', email);

		alert('Logged in as ' + (user.name || user.email));
		closeModal(modalLogin);
	});

	/* ------------------------------
	   Leaderboard (localStorage)
	------------------------------ */
	function loadLeaderboard() {
		try {
			return JSON.parse(localStorage.getItem('ig_leaderboard') || '[]');
		} catch (e) {
			return [];
		}
	}
	function saveLeaderboard(lb) {
		localStorage.setItem('ig_leaderboard', JSON.stringify(lb));
	}

	// Render leaderboard modal list
	function renderLeaderboard() {
		const list = loadLeaderboard();

		// Sort by score (highest first)
		list.sort((a, b) => (b.score || 0) - (a.score || 0));

		if (!leaderboardList) return;

		leaderboardList.innerHTML = '';

		// No entries
		if (list.length === 0) {
			leaderboardList.innerHTML = '<li>No scores yet. Play a game to add your score!</li>';
			return;
		}

		// Add entries
		list.forEach((entry, idx) => {
			const li = document.createElement('li');
			li.innerHTML = `
				<span>${idx + 1}. ${entry.name || entry.email || 'Anonymous'} 
				<small class="muted">(${entry.game || '—'})</small></span>
				<strong>${entry.score}</strong>
			`;
			leaderboardList.appendChild(li);
		});
	}

	/* ------------------------------
	   Expose function for game pages
	   Usage: IG.addScore({name,email,score,game})
	------------------------------ */
	window.IG = window.IG || {};
	window.IG.addScore = function ({ name, email, score, game }) {
		const lb = loadLeaderboard();
		lb.push({ name, email, score, game, ts: Date.now() });
		saveLeaderboard(lb);
		return true;
	};

	/* ------------------------------
	   Populate(adding sample content) with sample scores 
	   (only if leaderboard empty)
	------------------------------ */
	if (loadLeaderboard().length === 0) {
		const sample = [
			{ name: 'Alex', score: 1200, game: 'Target Practice' },
			{ name: 'Daris', score: 940, game: 'Memory Match' }
		];
		saveLeaderboard(sample);
	}

})();
