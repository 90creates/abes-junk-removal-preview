// Abe's number from his flyer. Hours: Google shows 7 AM–6 PM; confirm the full week with Abe.
const PHONE="9097080853";
const HOURS=[[7,18],[7,18],[7,18],[7,18],[7,18],[7,18],[7,18]];
const DAYS=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
const fmt=h=>(h%12||12)+" "+(h>=12?"PM":"AM");
const now=new Date(new Date().toLocaleString("en-US",{timeZone:"America/Los_Angeles"}));
const d=now.getDay(),h=now.getHours()+now.getMinutes()/60;

const st=document.getElementById("status");
if(st){
  const t=HOURS[d],open=t&&h>=t[0]&&h<t[1];
  st.classList.add(open?"open":"closed");
  let msg;
  if(open)msg=`Open now · call or text until ${fmt(t[1])}`;
  else{let n=d,today=t&&h<t[0];if(!today)do{n=(n+1)%7}while(!HOURS[n]);msg=`Closed · text anytime, we open ${today?"today":DAYS[n]} at ${fmt(HOURS[n][0])}`}
  st.lastElementChild.textContent=msg;
}

function sendQuote(e){
  e.preventDefault();
  const v=id=>document.getElementById(id).value.trim();
  const body=`Hi Abe! Free estimate request from ${v("qn")}${v("qc")?" in "+v("qc"):""}.\nService: ${v("qs")}\n${v("qd")}\n(I'll attach photos)`;
  location.href=`sms:+1${PHONE}?&body=${encodeURIComponent(body)}`;
  return false;
}
// Before/after reveal: drag (mouse or touch) or use arrow keys. Vertical swipes still scroll the page.
const reduceMotion=matchMedia("(prefers-reduced-motion: reduce)").matches;
document.querySelectorAll(".ba").forEach(el=>{
  let pos=50,dragging=false;
  const set=p=>{
    pos=Math.max(0,Math.min(100,p));
    el.style.setProperty("--pos",pos+"%");
    el.setAttribute("aria-valuenow",Math.round(pos));
    el.querySelector(".ba-tag.b").style.opacity=pos<12?0:1;
    el.querySelector(".ba-tag.a").style.opacity=pos>88?0:1;
  };
  const fromEvent=e=>{const r=el.getBoundingClientRect();set((e.clientX-r.left)/r.width*100)};
  el.addEventListener("pointerdown",e=>{dragging=true;el.classList.add("dragging");el.setPointerCapture(e.pointerId);fromEvent(e)});
  el.addEventListener("pointermove",e=>{if(dragging)fromEvent(e)});
  const stop=()=>{dragging=false;el.classList.remove("dragging")};
  el.addEventListener("pointerup",stop);el.addEventListener("pointercancel",stop);
  el.addEventListener("keydown",e=>{
    const step=e.shiftKey?20:5;
    if(e.key==="ArrowLeft"){set(pos-step);e.preventDefault()}
    else if(e.key==="ArrowRight"){set(pos+step);e.preventDefault()}
    else if(e.key==="Home"){set(0);e.preventDefault()}
    else if(e.key==="End"){set(100);e.preventDefault()}
  });
  set(50);
  // One-time wiggle when it scrolls into view, so people know it moves.
  if(!reduceMotion&&"IntersectionObserver" in window){
    const io=new IntersectionObserver(([en])=>{
      if(!en.isIntersecting)return;io.disconnect();
      const frames=[50,32,68,50],dur=1400;let t0;
      const tick=t=>{
        t0??=t;
        if(dragging)return;
        const k=Math.min(1,(t-t0)/dur),seg=k*(frames.length-1),i=Math.min(frames.length-2,Math.floor(seg)),f=seg-i;
        const ease=f<.5?2*f*f:1-Math.pow(-2*f+2,2)/2;
        set(frames[i]+(frames[i+1]-frames[i])*ease);
        if(k<1)requestAnimationFrame(tick);
      };
      setTimeout(()=>requestAnimationFrame(tick),300);
    },{threshold:.6});
    io.observe(el);
  }
});

document.querySelectorAll(".yr").forEach(e=>e.textContent=now.getFullYear());
