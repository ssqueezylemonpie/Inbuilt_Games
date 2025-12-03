// Minimal UI script for modals, demo auth (localStorage) and leaderboard
(() => {
	const $ = (s, ctx=document) => ctx.querySelector(s);
	const $$ = (s, ctx=document) => Array.from(ctx.querySelectorAll(s));

	function openModal(modal){
		modal.setAttribute('aria-hidden','false');
		modal.classList.add('open');
	}
	function closeModal(modal){
		modal.setAttribute('aria-hidden','true');
		modal.classList.remove('open');
	}

	// Elements
	const modalLogin = $('#modalLogin');
	const modalRegister = $('#modalRegister');
	const modalLeaderboard = $('#modalLeaderboard');
	const btnLogin = $('#btn-login');
	const btnRegister = $('#btn-register');
	const btnLeaderboard = $('#btn-leaderboard');
	const registerForm = $('#registerForm');
	const loginForm = $('#loginForm');
	const leaderboardList = $('#leaderboardList');

	// Close buttons
	$$('[data-close]').forEach(btn => btn.addEventListener('click', e => {
		const m = e.target.closest('.modal');
		if(m) closeModal(m);
	}));

	// Click outside modal to close
	[modalLogin, modalRegister, modalLeaderboard].forEach(m => {
		m.addEventListener('click', e => {
			if(e.target === m) closeModal(m);
		});
	});

	btnLogin && btnLogin.addEventListener('click', ()=> openModal(modalLogin));
	btnRegister && btnRegister.addEventListener('click', ()=> openModal(modalRegister));
	btnLeaderboard && btnLeaderboard.addEventListener('click', ()=> { renderLeaderboard(); openModal(modalLeaderboard); });

	// Simple localStorage-backed demo auth
	function loadUsers(){
		try { return JSON.parse(localStorage.getItem('ig_users')||'[]'); } catch(e){ return []; }
	}
	function saveUsers(u){ localStorage.setItem('ig_users', JSON.stringify(u)); }

	registerForm && registerForm.addEventListener('submit', e => {
		e.preventDefault();
		const fd = new FormData(registerForm);
		const name = fd.get('name').trim();
		const email = fd.get('email').trim().toLowerCase();
		const password = fd.get('password');
		const users = loadUsers();
		if(users.find(u=>u.email===email)){
			alert('Account with that email already exists');
			return;
		}
		users.push({name,email,password});
		saveUsers(users);
		localStorage.setItem('ig_current', email);
		alert('Registered — you are now logged in');
		closeModal(modalRegister);
	});

	loginForm && loginForm.addEventListener('submit', e => {
		e.preventDefault();
		const fd = new FormData(loginForm);
		const email = fd.get('email').trim().toLowerCase();
		const password = fd.get('password');
		const users = loadUsers();
		const user = users.find(u=>u.email===email && u.password===password);
		if(!user){ alert('Invalid credentials'); return; }
		localStorage.setItem('ig_current', email);
		alert('Logged in as '+(user.name||user.email));
		closeModal(modalLogin);
	});

	// Leaderboard rendering
	function loadLeaderboard(){
		try { return JSON.parse(localStorage.getItem('ig_leaderboard')||'[]'); } catch(e){ return []; }
	}
	function saveLeaderboard(lb){ localStorage.setItem('ig_leaderboard', JSON.stringify(lb)); }

	function renderLeaderboard(){
		const list = loadLeaderboard();
		// sort descending by score
		list.sort((a,b)=> (b.score||0) - (a.score||0));
		if(!leaderboardList) return;
		leaderboardList.innerHTML = '';
		if(list.length===0){
			leaderboardList.innerHTML = '<li>No scores yet. Play a game to add your score!</li>';
			return;
		}
		list.forEach((entry, idx) => {
			const li = document.createElement('li');
			li.innerHTML = `<span>${idx+1}. ${entry.name||entry.email||'Anonymous'} <small class="muted">(${entry.game||'—'})</small></span><strong>${entry.score}</strong>`;
			leaderboardList.appendChild(li);
		});
	}

	// Utility for game pages: add score and optionally return to library
	window.IG = window.IG || {};
	window.IG.addScore = function({name, email, score, game}){
		const lb = loadLeaderboard();
		lb.push({name,email,score,game,ts:Date.now()});
		saveLeaderboard(lb);
		return true;
	};

	// On load, ensure there's a small sample leaderboard if empty (optional)
	if(loadLeaderboard().length===0){
		const sample = [
			{name:'Alex',score:1200,game:'Target Practice'},
			{name:'Mina',score:940,game:'Memory Match'}
		];
		saveLeaderboard(sample);
	}
})();
