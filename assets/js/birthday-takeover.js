(() => {
  "use strict";
  // Exact Detroit calendar dates; automatically inactive after November 15, 2026.
  const parts = Object.fromEntries(new Intl.DateTimeFormat("en-US",{timeZone:"America/Detroit",year:"numeric",month:"2-digit",day:"2-digit"}).formatToParts(new Date()).filter(p=>p.type!=="literal").map(p=>[p.type,p.value]));
  const today = parts.year+"-"+parts.month+"-"+parts.day;
  if(today<"2026-11-13"||today>"2026-11-15") return;
  const init=()=>{
    if(document.body.classList.contains("birthday-takeover"))return;
    document.body.classList.add("birthday-takeover");
    const ribbon=document.createElement("div");ribbon.className="birthday-ribbon";ribbon.setAttribute("role","region");ribbon.setAttribute("aria-label","Fifth anniversary celebration");
    ribbon.innerHTML='<span aria-hidden="true">🎉</span><span>GREEN LABS TURNS <strong>5!</strong> · NOV 13–15</span><a href="#deals">SEE THE BIRTHDAY DEALS</a><span aria-hidden="true">🎂</span>';
    const header=document.querySelector(".sticky")||document.querySelector("header");
    if(header)header.insertAdjacentElement("afterend",ribbon);else document.body.prepend(ribbon);
    const gift=document.createElement("button");gift.type="button";gift.className="birthday-floating-gift";gift.setAttribute("aria-haspopup","dialog");gift.textContent="🎁 OPEN YOUR BIRTHDAY INVITE";document.body.append(gift);
    const dialog=document.createElement("div");dialog.className="birthday-gift-dialog";dialog.hidden=true;dialog.setAttribute("role","dialog");dialog.setAttribute("aria-modal","true");dialog.setAttribute("aria-labelledby","birthday-dialog-title");
    dialog.innerHTML='<div class="birthday-gift-card"><button type="button" class="birthday-gift-close" aria-label="Close birthday invitation">×</button><div aria-hidden="true" style="font-size:48px">🎂🎈</div><h2 id="birthday-dialog-title">CHEERS TO 5 YEARS!</h2><p><strong>FRIDAY · NOV 13</strong><br>50% off select brands + food truck</p><p><strong>SATURDAY & SUNDAY · NOV 14–15</strong><br>50% off storewide (accessories excluded)</p><p>Birthday giveaways, raffle entries and more. Come celebrate with us!</p><a href="#deals">EXPLORE TODAY’S DEALS</a><p style="font-size:12px">21+ only. While supplies last. Restrictions may apply.</p></div>';
    document.body.append(dialog);const close=dialog.querySelector(".birthday-gift-close");let previousFocus=null;
    const dismiss=()=>{dialog.hidden=true;(previousFocus||gift).focus()};
    const burst=(count)=>{
      if(window.matchMedia("(prefers-reduced-motion: reduce)").matches)return;
      const layer=document.createElement("div");layer.className="birthday-confetti-layer";layer.setAttribute("aria-hidden","true");document.body.append(layer);
      const colors=["#087e58","#f2c46f","#f4a9c4","#ffffff","#e7797c","#8acac1"];
      for(let i=0;i<count;i++){const p=document.createElement("i");p.className="birthday-confetti-piece";p.style.left=(Math.random()*100)+"%";p.style.setProperty("--delay",(Math.random()*1.1)+"s");p.style.setProperty("--duration",(2.5+Math.random()*1.8)+"s");p.style.setProperty("--drift",((Math.random()-.5)*180)+"px");p.style.setProperty("--color",colors[i%colors.length]);layer.append(p)}
      setTimeout(()=>layer.remove(),5600);
    };
    gift.addEventListener("click",()=>{previousFocus=document.activeElement;dialog.hidden=false;close.focus();burst(55)});
    close.addEventListener("click",dismiss);
    dialog.addEventListener("click",e=>{if(e.target===dialog)dismiss();if(e.target.closest('a[href="#deals"]'))dismiss()});
    document.addEventListener("keydown",e=>{if(dialog.hidden)return;if(e.key==="Escape"){dismiss();return}if(e.key==="Tab"){const controls=[close,dialog.querySelector('a[href="#deals"]')];const i=controls.indexOf(document.activeElement);if(e.shiftKey&&i===0){e.preventDefault();controls[1].focus()}else if(!e.shiftKey&&i===1){e.preventDefault();controls[0].focus()}}});
    try{const key="gl-birthday-confetti-"+today;if(!sessionStorage.getItem(key)){sessionStorage.setItem(key,"1");setTimeout(()=>burst(65),750)}}catch{setTimeout(()=>burst(65),750)}
  };
  document.readyState==="loading"?document.addEventListener("DOMContentLoaded",init,{once:true}):init();
})();
