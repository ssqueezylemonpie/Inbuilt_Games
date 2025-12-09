// Memory Match game (4x4 grid) — integrates with the existing leaderboard system
(function(){

  /* ------------------------------------------------------------
      Game Setup
     ------------------------------------------------------------ */

  // 8 unique emojis → duplicated → 16 cards total
  const EMOJIS = ['🍎','🍌','🍇','🍓','🍑','🍍','🥝','🍉'];

  // Fisher–Yates shuffle for randomizing card positions
  function shuffle(arr){
    for(let i = arr.length - 1; i > 0; i--){
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  /* ------------------------------------------------------------
      Card Creation
     ------------------------------------------------------------ */

  // Creates a single card element (button)
  function createCard(value){
    const el = document.createElement('button');
    el.className = 'match-card';
    el.type = 'button';
    el.dataset.value = value;
    el.setAttribute('aria-pressed','false');

    // Basic card styles (inherits site CSS variables)
    el.style.background = 'var(--card)';
    el.style.color = 'transparent';      // hidden until flipped
    el.style.border = '1px solid rgba(255,255,255,0.04)';
    el.style.borderRadius = '8px';
    el.style.padding = '18px 8px';
    el.style.fontSize = '28px';
    el.style.cursor = 'pointer';
    el.style.transition = 'transform .18s ease, background .18s ease, color .12s ease';
    el.style.display = 'flex';
    el.style.alignItems = 'center';
    el.style.justifyContent = 'center';

    // Default face-down view
    el.textContent = '❓';

    return el;
  }

  /* ------------------------------------------------------------
      Initialization (runs when DOM is ready)
     ------------------------------------------------------------ */

  function init(){
    const board = document.getElementById('matchBoard');
    if(!board) return; // Stop if page does not contain this game

    /* ------------------------------
       UI Controls (Score, Moves, Reset, Submit)
       ------------------------------ */

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

    // Insert control bar before the game board
    board.parentNode.insertBefore(ctrl, board);

    /* ------------------------------
       Game State
       ------------------------------ */

    // Duplicate emojis → shuffle → assign to board
    const symbols = shuffle(EMOJIS.concat(EMOJIS).slice());

    let first = null;   // first selected card
    let lock = false;   // prevents clicking during animations
    let matches = 0;    // number of pairs matched
    let moves = 0;      // number of card flips (2 flips = 1 move)

    /* ------------------------------------------------------------
       Rendering the board
       ------------------------------------------------------------ */

    function renderBoard(){
      board.innerHTML = '';
      symbols.forEach(sym => {
        const c = createCard(sym);
        c.addEventListener('click', onCardClick); // card click handler
        board.appendChild(c);
      });
      updateLabels();
    }

    function updateLabels(){
      scoreLabel.textContent = 'Matches: ' + matches;
      movesLabel.textContent = 'Moves: ' + moves;
    }

    /* ------------------------------------------------------------
        Card Click Logic
       ------------------------------------------------------------ */

    function onCardClick(e){
      const el = e.currentTarget;

      // Prevent invalid clicks
      if(lock) return;
      if(el.classList.contains('matched')) return;
      if(el === first) return; // same card

      // Reveal card
      el.textContent = el.dataset.value;
      el.style.color = 'inherit';
      el.style.transform = 'scale(1.02)';

      // First card selected
      if(!first){
        first = el;
        return;
      }

      // Second card selected
      moves += 1;
      const second = el;

      // If match
      if(first.dataset.value === second.dataset.value){
        first.classList.add('matched');
        second.classList.add('matched');

        // Styling for matched cards
        first.style.background = 'linear-gradient(90deg,#06b6d4,#4f46e5)';
        second.style.background = 'linear-gradient(90deg,#06b6d4,#4f46e5)';

        matches += 1;
        first = null;
        updateLabels();

        // Check for win condition
        if(matches === EMOJIS.length){
          setTimeout(()=>{
            alert('You matched all pairs! Matches: ' + matches + ', Moves: ' + moves);

            // Auto-submit score (integrates with your IG leaderboard)
            if(window.IG && typeof window.IG.addScore === 'function'){
              window.IG.addScore({
                name: 'Player',
                email: '',
                score: matches * 100,
                game: 'Memory Match'
              });
            }
          }, 180);
        }
        return;
      }

      // If NOT a match — flip back after delay
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

    /* ------------------------------------------------------------
        Reset Button (reshuffle + restart)
       ------------------------------------------------------------ */

    resetBtn.addEventListener('click', ()=>{
      const pool = EMOJIS.concat(EMOJIS).slice();
      shuffle(pool);

      // Replace symbols with the new shuffled version
      for(let i = 0; i < symbols.length; i++){
        symbols[i] = pool[i];
      }

      first = null;
      lock = false;
      matches = 0;
      moves = 0;

      renderBoard();
    });

    /* ------------------------------------------------------------
        Submit Score Button
       ------------------------------------------------------------ */

    submitBtn.addEventListener('click', ()=>{
      const score = matches * 100;

      if(window.IG && typeof window.IG.addScore === 'function'){
        window.IG.addScore({
          name: 'Player',
          email: '',
          score: score,
          game: 'Memory Match'
        });
        alert('Score submitted: ' + score);
      } else {
        alert('No leaderboard available — local score: ' + score);
      }
    });

    /* ------------------------------------------------------------
       Render initial board
       ------------------------------------------------------------ */

    renderBoard();
  }

  /* ------------------------------------------------------------
      Wait for DOM to load before initializing
     ------------------------------------------------------------ */

  if(document.readyState === 'loading')
    document.addEventListener('DOMContentLoaded', init);
  else
    init();

})();
