// Simple Aim Trainer
(function(){
  const DEFAULT_TIME = 30; // seconds

  function rand(min,max){ return Math.floor(Math.random()*(max-min+1))+min; }

  function createTarget(playArea, onHit){
    const target = document.createElement('div');
    const size = rand(48,88); // slightly larger to fit crosshair
    target.className = 'aim-target';
    target.style.width = size + 'px';
    target.style.height = size + 'px';
    target.style.position = 'absolute';
    target.style.cursor = 'crosshair';
    target.style.display = 'flex';
    target.style.alignItems = 'center';
    target.style.justifyContent = 'center';
    target.style.background = 'transparent';
    target.style.transform = 'translateZ(0)';

    // create an inline SVG crosshair (scales with size)
    const svgNS = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(svgNS, 'svg');
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '100%');
    svg.setAttribute('viewBox', '0 0 100 100');
    svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');

    // outer ring (thick black stroke, blue fill)
    const outerRing = document.createElementNS(svgNS, 'circle');
    outerRing.setAttribute('cx', '50'); outerRing.setAttribute('cy', '50');
    outerRing.setAttribute('r', '42');
    outerRing.setAttribute('fill', 'none');
    outerRing.setAttribute('stroke', '#000');
    outerRing.setAttribute('stroke-width', '5');
    svg.appendChild(outerRing);

    // middle ring (thick black stroke)
    const midRing = document.createElementNS(svgNS, 'circle');
    midRing.setAttribute('cx', '50'); midRing.setAttribute('cy', '50');
    midRing.setAttribute('r', '28');
    midRing.setAttribute('fill', 'none');
    midRing.setAttribute('stroke', '#000');
    midRing.setAttribute('stroke-width', '4');
    svg.appendChild(midRing);

    // inner ring (thick black stroke)
    const innerRing = document.createElementNS(svgNS, 'circle');
    innerRing.setAttribute('cx', '50'); innerRing.setAttribute('cy', '50');
    innerRing.setAttribute('r', '14');
    innerRing.setAttribute('fill', 'none');
    innerRing.setAttribute('stroke', '#000');
    innerRing.setAttribute('stroke-width', '4');
    svg.appendChild(innerRing);

    // vertical crosshair line (top to bottom)
    const vLine = document.createElementNS(svgNS, 'line');
    vLine.setAttribute('x1', '50'); vLine.setAttribute('y1', '2');
    vLine.setAttribute('x2', '50'); vLine.setAttribute('y2', '98');
    vLine.setAttribute('stroke', '#000');
    vLine.setAttribute('stroke-width', '3');
    svg.appendChild(vLine);

    // horizontal crosshair line (left to right)
    const hLine = document.createElementNS(svgNS, 'line');
    hLine.setAttribute('x1', '2'); hLine.setAttribute('y1', '50');
    hLine.setAttribute('x2', '98'); hLine.setAttribute('y2', '50');
    hLine.setAttribute('stroke', '#000');
    hLine.setAttribute('stroke-width', '3');
    svg.appendChild(hLine);

    // tick marks (4 short lines on cardinal directions)
    const ticks = [
      { x1: 50, y1: 0, x2: 50, y2: 6 },    // top
      { x1: 50, y1: 94, x2: 50, y2: 100 }, // bottom
      { x1: 0, y1: 50, x2: 6, y2: 50 },    // left
      { x1: 94, y1: 50, x2: 100, y2: 50 }  // right
    ];
    ticks.forEach(t => {
      const tick = document.createElementNS(svgNS, 'line');
      tick.setAttribute('x1', t.x1); tick.setAttribute('y1', t.y1);
      tick.setAttribute('x2', t.x2); tick.setAttribute('y2', t.y2);
      tick.setAttribute('stroke', '#000');
      tick.setAttribute('stroke-width', '4');
      svg.appendChild(tick);
    });

    // center red dot (like a bullseye)
    const dot = document.createElementNS(svgNS, 'circle');
    dot.setAttribute('cx', '50'); dot.setAttribute('cy', '50');
    dot.setAttribute('r', '5');
    dot.setAttribute('fill', '#ff0000');
    svg.appendChild(dot);

    // clear previous children then append svg
    target.innerHTML = '';
    target.appendChild(svg);

    const pw = Math.max(0, playArea.clientWidth - size - 6);
    const ph = Math.max(0, playArea.clientHeight - size - 6);
    const x = rand(6, pw);
    const y = rand(6, ph);
    target.style.left = x + 'px';
    target.style.top = y + 'px';

    target.addEventListener('click', function(e){
      e.stopPropagation();
      // quick pulse to indicate hit
      svg.style.transform = 'scale(0.9)';
      svg.style.transition = 'transform .12s ease';
      setTimeout(()=> svg.style.transform = '', 120);
      onHit(target);
    });

    return target;
  }

  function init(){
    const playArea = document.getElementById('playArea');
    const btnStart = document.getElementById('btnStart');
    const btnSubmit = document.getElementById('btnSubmit');
    const timeEl = document.getElementById('time');
    const scoreEl = document.getElementById('score');

    if(!playArea || !btnStart || !timeEl || !scoreEl) return;

    let score = 0;
    let timeLeft = DEFAULT_TIME;
    let timer = null;
    let target = null;

    function spawnTarget(){
      if(target) target.remove();
      target = createTarget(playArea, onHit);
      playArea.appendChild(target);
    }

    function onHit(el){
      score += Math.round(10 + Math.random()*20);
      scoreEl.textContent = score;
      // simple click animation
      el.style.transform = 'scale(0.85)';
      setTimeout(()=>{
        el.style.transform = '';
        spawnTarget();
      }, 120);
    }

    function tick(){
      timeLeft -= 1;
      timeEl.textContent = timeLeft;
      if(timeLeft <= 0){
        clearInterval(timer);
        timer = null;
        if(target) target.remove();
        target = null;
        alert('Finished! Your score: ' + score);
        // keep score local; user can submit via button
      }
    }

    btnStart.addEventListener('click', ()=>{
      if(timer) return; // already running
      score = 0; timeLeft = DEFAULT_TIME;
      scoreEl.textContent = score; timeEl.textContent = timeLeft;
      spawnTarget();
      timer = setInterval(tick, 1000);
    });

    btnSubmit.addEventListener('click', ()=>{
      // Use existing leaderboard API if present
      if(typeof window.IG === 'object' && typeof window.IG.addScore === 'function'){
        const current = localStorage.getItem('ig_current') || '';
        const users = JSON.parse(localStorage.getItem('ig_users')||'[]');
        const name = current ? (users.find(u=>u.email===current)?.name || current) : 'Guest';
        window.IG.addScore({name, email: current, score, game:'Target Practice'});
        alert('Score submitted: '+score);
      } else {
        alert('Local score: ' + score + '. No leaderboard available.');
      }
    });
  }

  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
