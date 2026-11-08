/* Hidden admin tool. Open with Ctrl + Alt + Shift + A.
   The login is stored only as a SHA-256 hash (HASH below). To change it, run:
   python3 -c "import hashlib;print(hashlib.sha256(b'signal-admin::username:YOURPASSWORD').hexdigest())"  (username in lowercase)
   and paste the result into HASH. Everything here only changes THIS browser's saved progress. */
(function(){
const SALT="signal-admin::",HASH="f7e625a53f3e685d0c5abec691fdcac88ba2bcbcb2789b1c24b8e9eec16363f4";
const sha=async t=>{const b=await crypto.subtle.digest("SHA-256",new TextEncoder().encode(SALT+t));return[...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,"0")).join("")};
var _st=stats;stats=function(){var r=_st();r.xp=Math.max(0,r.xp+(+S.xpAdj||0));return r};
const mk=id=>{var d=$(id);if(!d){d=document.createElement("dialog");d.id=id;document.body.appendChild(d)}return d};
var fails=0,lockUntil=0;
function ask(){var d=mk("adm-pw");
 d.innerHTML='<div class="dl"><h3>Admin</h3><label for="adm-u">Username</label><br><input id="adm-u" class="srch" autocomplete="off" autocapitalize="off"><br><label for="adm-p">Password</label><br><input id="adm-p" type="password" class="srch" autocomplete="off"> <button class="btn" id="adm-go">Enter</button> <button class="btn ghost" id="adm-x">Cancel</button><p class="fb" id="adm-m" aria-live="polite"></p></div>';
 d.showModal();var p=$("adm-p"),u=$("adm-u");u.focus();
 const go=async()=>{if(Date.now()<lockUntil){$("adm-m").textContent="Too many tries. Wait a moment.";return}
  if(!(window.crypto&&crypto.subtle)){$("adm-m").textContent="This browser can't check passwords here (needs https).";return}
  if(await sha(u.value.trim().toLowerCase()+":"+p.value)===HASH){fails=0;sessionStorage.setItem("signal-adm","1");d.close();panel()}
  else{fails++;p.value="";if(fails>=5){lockUntil=Date.now()+30000;fails=0;$("adm-m").textContent="Locked for 30 seconds."}else $("adm-m").textContent="Wrong username or password."}};
 $("adm-go").onclick=go;p.onkeydown=u.onkeydown=e=>{if(e.key==="Enter")go()};$("adm-x").onclick=()=>d.close()}
const ST=["Helpful","Use with care","Avoid"];
function answers(){var h='';
 MODS.forEach(m=>{h+='<details class="deep" style="--mc:'+m.color+'"><summary>'+m.name+'</summary>'+m.lessons.map(l=>'<p><strong>'+l.t+'</strong><br>'+l.q+'<br>✓ '+l.o[l.a]+'</p>').join("")+'<p><strong>Module quiz answers</strong></p>'+QUIZ[m.id].map(q=>'<p>'+q[0]+'<br>✓ '+q[1][q[2]]+'</p>').join("")+'</details>'});
 h+='<details class="deep" style="--mc:var(--c1)"><summary>Final exam</summary><p>The final exam draws 3 random questions from each module quiz above, so every answer is listed there.</p></details>';
 h+='<details class="deep" style="--mc:var(--c3)"><summary>Activities</summary><p><strong>Spot the hallucination</strong></p>'+HR.map(r=>'<p>'+r.p+'<br>False: '+r.s[r.a]+'</p>').join("")+'<p><strong>Sort the use</strong></p>'+SORT.map(s=>'<p>'+s[0]+'<br>✓ '+ST[s[1]]+'</p>').join("")+'<p><strong>What would you do?</strong></p>'+SCEN.map(s=>'<p>'+s.s+'<br>✓ '+s.c.filter(c=>c[1]==="good").map(c=>c[0]).join("")+'</p>').join("")+'<p><strong>Prompt builder:</strong> choose an option in all four boxes. <strong>Footprint explorer:</strong> move all three sliders.</p></details>';
 return h}
function panel(){var d=mk("adm");d.style.maxHeight="88vh";d.style.overflow="auto";
 d.innerHTML='<div class="dl"><h3>Admin panel</h3><p class="note">Changes only affect this browser. Press Esc to close.</p><h4>XP</h4><p>Current XP: <strong>'+stats().xp+'</strong></p><input id="a-in" type="number" class="srch" style="max-width:140px" placeholder="Amount"> <button class="chip" data-a="add">Add or subtract</button> <button class="chip" data-a="set">Set total to</button><h4>Skip ahead</h4><div class="btns"><button class="chip" data-a="lessons">Complete all lessons</button><button class="chip" data-a="quizzes">Pass all quizzes</button><button class="chip" data-a="final">Pass final exam</button><button class="chip" data-a="acts">Finish all activities</button><button class="chip" data-a="all">Do everything</button><button class="chip" data-a="reset">Reset all</button><button class="chip" data-a="lock">Lock admin</button></div><h4>By module</h4>'+MODS.map(m=>'<p style="margin:6px 0">'+m.name+' <button class="chip" data-a="mod" data-m="'+m.id+'">Complete</button> <button class="chip" data-a="clr" data-m="'+m.id+'">Clear</button></p>').join("")+'<h4>All answers</h4>'+answers()+'<p><button class="btn ghost" id="adm-c">Close</button></p></div>';
 d.showModal();$("adm-c").onclick=()=>d.close();
 d.onclick=e=>{var b=e.target.closest("[data-a]");if(!b)return;var a=b.dataset.a,m=MODS.find(x=>x.id===b.dataset.m),n=parseFloat($("a-in").value);
  const doneAll=mm=>mm.lessons.forEach((l,i)=>S.done[mm.id+"-"+i]=20);
  if(a==="add"&&!isNaN(n))S.xpAdj=(+S.xpAdj||0)+n;
  else if(a==="set"&&!isNaN(n))S.xpAdj=(+S.xpAdj||0)+n-stats().xp;
  else if(a==="lessons")MODS.forEach(doneAll);
  else if(a==="quizzes")MODS.forEach(x=>S.quiz[x.id]=5);
  else if(a==="final")S.final=15;
  else if(a==="acts")ACT_IDS.forEach(k=>S.act[k]=1);
  else if(a==="all"){MODS.forEach(x=>{doneAll(x);S.quiz[x.id]=5});S.final=15;ACT_IDS.forEach(k=>S.act[k]=1)}
  else if(a==="mod"&&m)doneAll(m);
  else if(a==="clr"&&m){m.lessons.forEach((l,i)=>delete S.done[m.id+"-"+i]);delete S.quiz[m.id]}
  else if(a==="reset"){if(!confirm("Reset all progress?"))return;S={done:{},quiz:{},act:{}}}
  else if(a==="lock"){sessionStorage.removeItem("signal-adm");d.close();return}
  else return;
  save();location.reload()}}
addEventListener("keydown",e=>{if(e.ctrlKey&&e.altKey&&e.shiftKey&&e.code==="KeyA"){e.preventDefault();sessionStorage.getItem("signal-adm")==="1"?panel():ask()}});
})();
