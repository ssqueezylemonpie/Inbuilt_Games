// Memory Match game (4x4) — uses existing CSS variables and does not modify leaderboard logic
(function(){
  const EMOJIS = ['🍎','🍌','🍇','🍓','🍑','🍍','🥝','🍉']; // 8 unique -> 16 cards

  function shuffle(arr){
    for(let i = arr.length-1; i>0; i--){
      const j = Math.floor(Math.random()*(i+1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  function createCard(value){
    const el = document.createElement('button');
    el.className = 'match-card';
    el.type = 'button';
    el.dataset.value = value;
    el.setAttribute('aria-pressed','false');
    // basic appearance — leverages existing CSS variables
    el.style.background = 'var(--card)';
    el.style.color = 'transparent';
    el.style.border = '1px solid rgba(255,255,255,0.04)';
    el.style.borderRadius = '8px';
    el.style.padding = '18px 8px';
    el.style.fontSize = '28px';
    el.style.cursor = 'pointer';
    el.style.transition = 'transform .18s ease, background .18s ease, color .12s ease';
    el.style.display = 'flex';
    el.style.alignItems = 'center';
    el.style.justifyContent = 'center';

    el.textContent = '❓';
    return el;
  }

  function init(){
    const board = document.getElementById('matchBoard');
    if(!board) return;

    // create control bar above board (score, moves, reset, submit)
    const ctrl = document.createElement('div');
    ctrl.style.display = 'flex';
    ctrl.style.gap = '12px';
    ctrl.style.alignItems = 'center';
    ctrl.style.margin = '6px 0 12px 0';

    const scoreLabel = document.createElement('div');
    scoreLabel.id = 'matchScore';
    scoreLabel.textContent = 'Matches: 0';
    scoreLabel.className = 'muted';

    const movesLabel = document.createElement('div');
    movesLabel.id = 'matchMoves';
    movesLabel.textContent = 'Moves: 0';
    movesLabel.className = 'muted';

    const resetBtn = document.createElement('button');
    resetBtn.type = 'button';
    resetBtn.className = 'primary';
    resetBtn.textContent = 'Reset';

    const submitBtn = document.createElement('button');
    submitBtn.type = 'button';
    submitBtn.className = 'primary';
    submitBtn.style.background = 'linear-gradient(90deg,#06b6d4,#4f46e5)';
    submitBtn.textContent = 'Submit Score';

    ctrl.appendChild(scoreLabel);
    ctrl.appendChild(movesLabel);
    ctrl.appendChild(resetBtn);
    ctrl.appendChild(submitBtn);

    board.parentNode.insertBefore(ctrl, board);

    const symbols = shuffle(EMOJIS.concat(EMOJIS).slice());

    let first = null;
    let lock = false;
    let matches = 0;
    let moves = 0;

    function renderBoard(){
      board.innerHTML = '';
      symbols.forEach(sym => {
        const c = createCard(sym);
        c.addEventListener('click', onCardClick);
        board.appendChild(c);
      });
      updateLabels();
    }

    function updateLabels(){
      scoreLabel.textContent = 'Matches: ' + matches;
      movesLabel.textContent = 'Moves: ' + moves;
    }

    function onCardClick(e){
      const el = e.currentTarget;
      if(lock) return;
      if(el.classList.contains('matched')) return;
      if(el === first) return;

      // reveal
      el.textContent = el.dataset.value;
      el.style.color = 'inherit';
      el.style.transform = 'scale(1.02)';

      if(!first){
        first = el;
        return;
      }

      // second card
      moves += 1;
      const second = el;
      if(first.dataset.value === second.dataset.value){
        // match
        first.classList.add('matched');
        second.classList.add('matched');
        first.style.background = 'linear-gradient(90deg,#06b6d4,#4f46e5)';
        second.style.background = 'linear-gradient(90deg,#06b6d4,#4f46e5)';
        matches += 1;
        first = null;
        updateLabels();
        if(matches === EMOJIS.length){
          setTimeout(()=>{
            alert('You matched all pairs! Matches: ' + matches + ', Moves: ' + moves);
            // auto-submit score
            if(typeof window.IG === 'object' && typeof window.IG.addScore === 'function'){
              const scoreObj = { name: 'Player', email: '', score: matches*100, game: 'Memory Match' };
              window.IG.addScore(scoreObj);
            }
          }, 180);
        }
        return;
      }

      // not a match: flip back after a short delay
      lock = true;
      setTimeout(()=>{
        first.textContent = '❓';
        first.style.color = 'transparent';
        first.style.transform = '';
        second.textContent = '❓';
        second.style.color = 'transparent';
        second.style.transform = '';
        first = null;
        lock = false;
        updateLabels();
      }, 700);
    }

    resetBtn.addEventListener('click', ()=>{
      // reshuffle and reset
      const pool = EMOJIS.concat(EMOJIS).slice();
      shuffle(pool);
      for(let i=0;i<symbols.length;i++) symbols[i]=pool[i];
      first = null; lock = false; matches = 0; moves = 0;
      renderBoard();
    });

    submitBtn.addEventListener('click', ()=>{
      // Manual submit button (in case user wants to resubmit or the game hasn't finished yet)
      if(typeof window.IG === 'object' && typeof window.IG.addScore === 'function'){
        const scoreObj = { name: 'Player', email: '', score: matches*100, game: 'Memory Match' };
        window.IG.addScore(scoreObj);
        alert('Score submitted: ' + (matches*100));
      } else {
        alert('No leaderboard present — local score: ' + matches + ' matches (' + (matches*100) + ' points)');
      }
    });

    renderBoard();
  }

  // init on DOM ready
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
