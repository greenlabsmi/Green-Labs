/* Seasonal theme: Harvest Week 2026. No dependencies. */
(() => {
  const day = () => new Intl.DateTimeFormat('en-CA',{timeZone:'America/Detroit',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
  const active = () => day() >= '2026-11-25' && day() < '2026-11-30';
  if (!active()) return;
  const root=document.documentElement, motion=matchMedia('(prefers-reduced-motion: reduce)');
  root.classList.add('harvest-week');
  const style=document.createElement('style');
  style.textContent=`
.harvest-week .hero__media {border-radius:18px;box-shadow:0 0 0 1px #d9a64e,0 0 32px #e6a33b38;animation:harvest-glow 5s ease-in-out infinite}
.harvest-week .hero__badge {border-color:#c99a4c;color:#ffe2a0}
.harvest-week .deli-banner {background:linear-gradient(90deg,#693015,#a24c1b,#693015);border-block:1px solid #d9a64e}
.harvest-week .section h2:not(.sr-only) {text-shadow:0 0 20px #d7a04a40}
.harvest-week .btn:hover {box-shadow:0 0 18px #e6a33b55}
.harvest-week #weeklyPromoPopup button {border-color:#d9a64e}
.harvest-week .footer {border-top:1px solid #c99a4c}
.harvest-greeting {text-align:center;padding:12px;color:#f4d398;font-weight:700;letter-spacing:.06em}
#harvest-atmosphere {position:fixed;inset:0;overflow:hidden;pointer-events:none;z-index:35}
.harvest-falling {position:absolute;top:-90px;left:var(--x);width:var(--w);height:auto;opacity:0;animation:harvest-fall var(--t) linear var(--delay) infinite;will-change:transform,opacity}
.harvest-spark {position:absolute;left:var(--x);bottom:-10px;width:3px;height:3px;border-radius:50%;background:#ffd584;box-shadow:0 0 8px #ffbc46;animation:harvest-rise var(--t) linear var(--delay) infinite}
@keyframes harvest-fall {0%{transform:translate3d(0,-20px,0) rotate(0);opacity:0}10%{opacity:.8}45%{transform:translate3d(var(--wind),45vh,0) rotate(160deg)}85%{opacity:.65}100%{transform:translate3d(calc(var(--wind) * -1),calc(100vh + 120px),0) rotate(360deg);opacity:0}}
@keyframes harvest-rise {0%{transform:translateY(0);opacity:0}25%{opacity:.6}100%{transform:translateY(-105vh);opacity:0}}
@keyframes harvest-glow {50%{box-shadow:0 0 0 1px #ffe1a0,0 0 38px #e6a33b66}}
@media(prefers-reduced-motion:reduce){#harvest-atmosphere{display:none}.harvest-week .hero__media{animation:none}}
`;
  document.head.append(style);
  const layer=document.createElement('div');layer.id='harvest-atmosphere';layer.setAttribute('aria-hidden','true');document.body.append(layer);
  const base='https://raw.githubusercontent.com/greenlabsmi/Dutch-Republic/6bd22fd7db047e621b1ef57ca57aebccfa655131/assets/img/';
  const names=['leaf-gold.png','leaf-red.png','leaf-brown.png'];
  function populate(){
    layer.replaceChildren();if(motion.matches)return;
    const mobile=innerWidth<700,count=mobile?16:30;
    for(let i=0;i<count;i++){
      const el=document.createElement('img');el.className='harvest-falling';el.alt='';el.src=base+names[i%3];el.style.cssText='--x:'+((i+.3)*100/count)+'%;--w:'+(mobile?22+Math.random()*23:30+Math.random()*43)+'px;--t:'+(10+Math.random()*13)+'s;--delay:-'+(Math.random()*20)+'s;--wind:'+((Math.random()-.5)*160)+'px';el.onerror=()=>el.remove();layer.append(el);
    }
    for(let i=0;i<(mobile?7:15);i++){const el=document.createElement('span');el.className='harvest-spark';el.style.cssText='--x:'+Math.random()*100+'%;--t:'+(13+Math.random()*12)+'s;--delay:-'+Math.random()*20+'s';layer.append(el);}
  }
  populate();motion.addEventListener('change',populate);
  const footer=document.querySelector('.footer');const greeting=document.createElement('div');greeting.className='harvest-greeting';greeting.textContent='🍂 Stay grateful. Keep it Dutch. Happy Harvest Week! 🍂';footer?.prepend(greeting);
  const timer=setInterval(()=>{if(!active()){clearInterval(timer);root.classList.remove('harvest-week');layer.remove();style.remove();greeting.remove();motion.removeEventListener('change',populate);}},60000);
})();
