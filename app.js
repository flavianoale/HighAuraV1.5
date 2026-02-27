/* ASCENSÃO OS PRO – offline single-file */
const APP_VERSION = 4;
const STORAGE_KEY = 'ascensao_os_state_v4';
const TOTAL_BIBLE_CHAPTERS = 1189;

const RANKS = [
  {name:'Recruta', min:0},{name:'Soldado', min:500},{name:'Elite', min:2000},
  {name:'Comandante', min:6000},{name:'General', min:15000},{name:'Lenda', min:35000}
];
const BIBLE_PLAN = [
  {book:'Gênesis', chapters:50},{book:'Êxodo', chapters:40},{book:'Levítico', chapters:27},
  {book:'Números', chapters:36},{book:'Deuteronômio', chapters:34},{book:'Mateus', chapters:28},
  {book:'Marcos', chapters:16},{book:'Lucas', chapters:24},{book:'João', chapters:21},{book:'Atos', chapters:28}
];
const FIN_CATS = ['Alimentação','Treino','Higiene','Casa','Carro','Estudos','Projetos','Outros'];

function mkMeal(name, kcal, p, c, g){ return {name,kcal,p,c,g}; }
const MEALS = {
  cafe:[mkMeal('Ovos + pão',430,22,40,20),mkMeal('Ovos + aveia',520,28,55,22),mkMeal('Iogurte + banana + aveia',420,20,62,10),mkMeal('Sanduíche frango',540,38,58,14)],
  almoco:[mkMeal('Arroz + feijão + frango',650,45,80,14),mkMeal('Arroz + feijão + carne',720,42,78,22),mkMeal('Macarrão + frango',700,44,92,12),mkMeal('Tilápia + arroz',680,46,84,12)],
  lanche:[mkMeal('Whey + fruta',260,24,28,3),mkMeal('Iogurte + aveia',320,16,46,6),mkMeal('Banana + pasta amendoim',340,8,34,18),mkMeal('Pão + atum',420,30,48,10)],
  jantar:[mkMeal('Arroz + frango',580,42,70,10),mkMeal('Ovos + salada + arroz',620,26,76,22),mkMeal('Tilápia + legumes',610,44,62,12),mkMeal('Frango + legumes',520,46,18,22)]
};

const HOME_WORKOUT = { Peito:['Flexão','Flexão inclinada','Supino halter'], Costas:['Barra fixa','Remada halter'], Pernas:['Agachamento','Avanço','RDL'], Ombro:['Desenvolvimento','Elevação lateral'], Core:['Prancha','Abdominal'] };
const GYM_WORKOUT = { Peito:['Supino reto','Supino inclinado'], Costas:['Puxada','Remada baixa'], Pernas:['Agachamento','Leg press'], Ombro:['Desenvolvimento','Face pull'], Core:['Prancha','Ab máquina'] };

const TAB_DEFS = [
  {id:'DASH',label:'HUD'},{id:'PROTO',label:'Protocolo'},{id:'DIETA',label:'Dieta'},{id:'TREINO',label:'Treino'},
  {id:'ESTUDO',label:'Estudo'},{id:'BIBLIA',label:'Bíblia'},{id:'TASKS',label:'Tarefas'},{id:'SOCIAL',label:'Social'},
  {id:'OPS',label:'Projetos'},{id:'LOG',label:'Finanças'},{id:'DIARIO',label:'Diário'},{id:'REL',label:'Relatórios'},{id:'CFG',label:'Config'}
];

const idb = {
  db:null,
  async open(){ if(this.db) return this.db; return new Promise((res,rej)=>{ const r=indexedDB.open('ascensao_os_db',2); r.onupgradeneeded=()=>{const db=r.result; if(!db.objectStoreNames.contains('kv')) db.createObjectStore('kv');}; r.onsuccess=()=>{this.db=r.result;res(this.db)}; r.onerror=()=>rej(r.error);}); },
  async get(k){ const db=await this.open(); return new Promise((res,rej)=>{ const q=db.transaction('kv','readonly').objectStore('kv').get(k); q.onsuccess=()=>res(q.result); q.onerror=()=>rej(q.error); });},
  async set(k,v){ const db=await this.open(); return new Promise((res,rej)=>{ const q=db.transaction('kv','readwrite').objectStore('kv').put(v,k); q.onsuccess=()=>res(true); q.onerror=()=>rej(q.error); });},
  async del(k){ const db=await this.open(); return new Promise((res,rej)=>{ const q=db.transaction('kv','readwrite').objectStore('kv').delete(k); q.onsuccess=()=>res(true); q.onerror=()=>rej(q.error); });}
};

function todayKey(d=new Date()){ return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`; }
function defaultState(){
  const start = new Date();
  return {
    v:APP_VERSION, createdAt:start.toISOString(), campaignStart:start.toISOString(),
    class:'conquistador', strictMode:false,
    theme:{crt:true}, sounds:{enabled:true,music:true,volume:0.6},
    windows:{wake:'04:40',morningEnd:'07:30',studyStart:'08:30',studyEnd:'11:30',workStart:'12:00',workEnd:'16:00',trainStart:'16:30',trainEnd:'18:30',nightStart:'19:00',sleep:'21:30'},
    targets:{goal:'cutting',weightKg:90,bfPct:25,activity:'moderada',kcal:2500,p:180,c:250,g:70},
    rpg:{xp:0,integrity:100,streak:0,level:1,rank:'Recruta'},
    bible:{idx:0,perDay:3}, bibleLog:{}, bibleLogAdv:{},
    training:{environment:'home',history:[]}, study:{history:[]},
    diet:{history:[]},
    proto:{itemsMorning:['Arrumar cama','Água','Skincare','Alongamento','Oração','Planejar dia'], itemsNight:['Higiene','Skincare','Exame rápido','Roupas','Oração','Dormir no horário'], history:[]},
    tasks:{byDate:{}},
    social:{history:[]}, ops:{history:[]}, finance:{history:[]},
    diary:{history:[]}, streakLog:{},
    lastAction:null
  };
}

let S = loadState();
let activeTab = 'DASH';
let audioCtx, musicAudio;
let timer = {running:false, total:0, left:0, startedAt:0, paused:false, topic:''};
let timerInterval;

const $ = (q)=>document.querySelector(q);
const view = $('#view'); const tabs = $('#tabs'); const toast = $('#toast');
const modal = $('#modal'); const modalTitle = $('#modalTitle'); const modalSub = $('#modalSub'); const modalBody = $('#modalBody');

function loadState(){ try{ const raw=localStorage.getItem(STORAGE_KEY); if(!raw) return defaultState(); return migrate(JSON.parse(raw)); }catch{return defaultState();} }
function migrate(st){ const d=defaultState(); return {...d,...st, theme:{...d.theme,...(st.theme||{})}, sounds:{...d.sounds,...(st.sounds||{})}, windows:{...d.windows,...(st.windows||{})}, targets:{...d.targets,...(st.targets||{})}, rpg:{...d.rpg,...(st.rpg||{})}, bible:{...d.bible,...(st.bible||{})}, tasks:{...d.tasks,...(st.tasks||{})} }; }
function saveState(){ localStorage.setItem(STORAGE_KEY, JSON.stringify(S)); }

function showToast(msg, ms=1500){ toast.textContent=msg; toast.classList.add('show'); setTimeout(()=>toast.classList.remove('show'), ms); }
function openModal(title, sub, bodyHtml){ modalTitle.textContent=title; modalSub.textContent=sub||''; modalBody.innerHTML=bodyHtml; modal.classList.add('show'); modal.setAttribute('aria-hidden','false'); }
function closeModal(){ modal.classList.remove('show'); modal.setAttribute('aria-hidden','true'); }
$('#modalClose').addEventListener('click', closeModal); modal.addEventListener('click', (e)=>{ if(e.target===modal) closeModal(); });

function beep(freq=880,dur=0.06,g=0.08){ if(!S.sounds.enabled) return; try{ audioCtx = audioCtx || new (window.AudioContext||window.webkitAudioContext)(); const o=audioCtx.createOscillator(); const ga=audioCtx.createGain(); o.type='square'; o.frequency.value=freq; ga.gain.value=g*(S.sounds.volume||0.6); o.connect(ga); ga.connect(audioCtx.destination); o.start(); setTimeout(()=>o.stop(), dur*1000);}catch{} }

async function loadMusicIfAny(){ try{ const blob=await idb.get('music'); if(!blob) return; if(musicAudio){musicAudio.pause(); musicAudio=null;} const url=URL.createObjectURL(blob); musicAudio = new Audio(url); musicAudio.loop=true; musicAudio.volume=S.sounds.volume||0.6; }catch{} }
function startMusic(){ if(S.sounds.enabled && S.sounds.music && musicAudio){ musicAudio.volume=S.sounds.volume||0.6; musicAudio.play().catch(()=>{});} }
function stopMusic(){ if(musicAudio) musicAudio.pause(); }

const hmToMin=(hm)=>{const [h,m]=hm.split(':').map(Number);return h*60+m;};
const nowMin=()=>{const d=new Date(); return d.getHours()*60+d.getMinutes();};
function currentWindow(){ const w=S.windows,n=nowMin(); const T=(k)=>hmToMin(w[k]); const order=[ {id:'wake',name:'Rotina Matinal',start:T('wake'),end:T('morningEnd'),tab:'PROTO'}, {id:'study',name:'Estudo',start:T('studyStart'),end:T('studyEnd'),tab:'ESTUDO'}, {id:'work',name:'Projetos',start:T('workStart'),end:T('workEnd'),tab:'OPS'}, {id:'train',name:'Treino',start:T('trainStart'),end:T('trainEnd'),tab:'TREINO'}, {id:'night',name:'Noite',start:T('nightStart'),end:T('sleep'),tab:'BIBLIA'}, {id:'sleep',name:'Dormir',start:T('sleep'),end:1440,tab:'DASH'} ]; for(const it of order){ if(n>=it.start && n<it.end) return it; } return {id:'late',name:'Fora da janela',start:0,end:T('wake'),tab:'DASH'}; }
function timeLeftInWindow(win){ const left=Math.max(0, win.end-nowMin()); return `${String(Math.floor(left/60)).padStart(2,'0')}:${String(left%60).padStart(2,'0')}h`; }
function campaignDay(){ const s=new Date(S.campaignStart), n=new Date(); return Math.floor((Date.UTC(n.getFullYear(),n.getMonth(),n.getDate())-Date.UTC(s.getFullYear(),s.getMonth(),s.getDate()))/86400000)+1; }
function phaseForDay(day){ if(day<=14) return {id:1,name:'Pressão',mult:1}; if(day<=45) return {id:2,name:'Consistência',mult:.8}; if(day<=90) return {id:3,name:'Autonomia',mult:.6}; return {id:4,name:'Ferramenta',mult:.4}; }
function xpForLevel(lvl){ return Math.floor(150*(lvl-1)*(lvl-1)+100*(lvl-1)); }
function computeLevel(xp){ let lvl=1; while(xp>=xpForLevel(lvl+1)) lvl++; return lvl; }
function computeRank(xp){ let r=RANKS[0].name; for(const k of RANKS){if(xp>=k.min) r=k.name;} return r; }
function xpBonusFactor(){ if(S.class==='guerreiro') return {train:1.15,diet:1.05,study:.95,bible:.95,proto:1,ops:1,social:1}; if(S.class==='estrategista') return {train:.95,diet:1,study:1.15,bible:1,proto:1,ops:1,social:1}; if(S.class==='monge') return {train:.95,diet:1,study:1,bible:1.15,proto:1.05,ops:1,social:1}; return {train:1,diet:1,study:1,bible:1,proto:1,ops:1,social:1}; }
function addXP(base,tag='generic'){ const ph=phaseForDay(campaignDay()); const bonus=xpBonusFactor(); const gain=Math.max(1,Math.round(base*ph.mult*(bonus[tag]||1)*(S.rpg.integrity/100))); S.rpg.xp+=gain; S.rpg.level=computeLevel(S.rpg.xp); S.rpg.rank=computeRank(S.rpg.xp); saveState(); beep(920,.05,.09); refreshHUD(); return gain; }
function adjustIntegrity(d){ S.rpg.integrity=Math.max(0,Math.min(100,S.rpg.integrity+d)); saveState(); refreshHUD(); }

function getTodayObj(arr){ return arr.find(x=>x.date===todayKey()); }
function upsertToday(arr,obj){ const i=arr.findIndex(x=>x.date===todayKey()); if(i>=0) arr[i]=obj; else arr.push(obj); }
function todayProgress(){ const k=todayKey(); const proto=(S.proto.history.find(x=>x.date===k)?.morningDone?.length||0)>=3; const study=S.study.history.filter(x=>x.date===k).reduce((a,b)=>a+b.minutes,0)>=25; const diet=!!(S.diet.history.find(x=>x.date===k)?.selections?.cafe); const train=S.training.history.filter(x=>x.date===k).length>=3; const bible=(S.bibleLog?.[k]===true); const done=[proto,study,diet,train,bible].filter(Boolean).length; return {proto,study,diet,train,bible,done,total:5,pct:Math.round(done/5*100)}; }

function setLastAction(a){ S.lastAction=a; saveState(); }
function undoLastAction(){ const a=S.lastAction; if(!a) return showToast('Nada pra desfazer'); const k=todayKey(); try{
  if(a.type==='proto'){ const t=getTodayObj(S.proto.history); if(t){ const arr=a.tag==='morning'?t.morningDone:t.nightDone; if(a.undo==='remove'){ const i=arr.indexOf(a.idx); if(i>=0) arr.splice(i,1);} else if(!arr.includes(a.idx)) arr.push(a.idx); }}
  if(a.type==='dietSelect'){ const d=ensureDietToday(); d.selections[a.meal]=a.prev; }
  if(a.type==='dietMult'){ const d=ensureDietToday(); d.mult[a.meal]=a.prev; }
  if(a.type==='trainSet'){ const i=S.training.history.lastIndexOf(a.entry); if(i>=0) S.training.history.splice(i,1); }
  if(a.type==='studyAdd'){ for(let i=S.study.history.length-1;i>=0;i--){const x=S.study.history[i]; if(x.date===a.date&&x.minutes===a.minutes&&x.topic===a.topic){S.study.history.splice(i,1);break;}} }
  if(a.type==='taskAdd'){ const arr=(S.tasks.byDate[k]||[]); arr.pop(); }
  S.lastAction=null; saveState(); showToast('Desfeito'); render();
}catch{ showToast('Falhou desfazer'); }}

function applyTheme(){ document.body.classList.toggle('crt', !!S.theme.crt); }
function refreshHUD(){ $('#hudLevel').textContent=S.rpg.level; $('#hudXP').textContent=S.rpg.xp; $('#hudRank').textContent=S.rpg.rank; $('#hudInt').textContent=S.rpg.integrity; $('#hudStreak').textContent=S.rpg.streak; $('#phaseBadge').textContent=`D${campaignDay()}`; const win=currentWindow(); $('#missionLine').innerHTML=`MISSÃO DO MOMENTO: <b>${win.name}</b> • fecha em <b>${timeLeftInWindow(win)}</b>`; }

function renderTabs(){ tabs.innerHTML=''; const win=currentWindow(); for(const t of TAB_DEFS){ const b=document.createElement('button'); b.className='tabbtn'+(t.id===activeTab?' active':''); b.textContent=t.label; b.onclick=()=>{ if(S.strictMode){ const allow=['CFG','REL']; if(!(t.id===win.tab||allow.includes(t.id))){ adjustIntegrity(-2); beep(220,.08,.08); showToast('Modo estrito: volta pra missão'); activeTab=win.tab; return render(); }} activeTab=t.id; render(); }; tabs.appendChild(b);} }

function pressurePanelHTML(){ const win=currentWindow(), prog=todayProgress(); const risk=prog.done<=1?'ALTO':prog.done<=2?'MÉDIO':'BAIXO'; return `<div class="list"><div class="item"><div><div class="name">Risco</div><div class="meta">${risk} (${prog.done}/5 pilares)</div></div><span class="badge">${risk}</span></div><div class="item"><div><div class="name">Janela atual</div><div class="meta">${win.name} • ${timeLeftInWindow(win)}</div></div><span class="badge">AGORA</span></div><div class="item"><div><div class="name">Modo estrito</div><div class="meta">${S.strictMode?'ATIVO':'DESLIGADO'}</div></div><span class="badge">${S.strictMode?'ON':'OFF'}</span></div></div>`; }

function viewHUD(){ const day=campaignDay(), ph=phaseForDay(day), prog=todayProgress(); const win=currentWindow(); const xpNext=xpForLevel(S.rpg.level+1), xpThis=xpForLevel(S.rpg.level), lvlPct=Math.max(0,Math.min(100,Math.round((S.rpg.xp-xpThis)/(xpNext-xpThis)*100))); const tasks=(S.tasks.byDate[todayKey()]||[]).sort((a,b)=>a.time.localeCompare(b.time));
  view.innerHTML=`<div class="card"><div class="kpi"><div><div class="big">MISSÃO ATIVA: ${win.name}</div><div class="small">Janela fecha em <b>${timeLeftInWindow(win)}</b> • Fase ${ph.id}/4: ${ph.name} • Dia ${day}/90</div></div><button class="btn primary" id="btnExec">EXECUTAR AGORA</button></div><div class="progress"><div style="width:${prog.pct}%"></div></div><div class="hint">Progresso do dia ${prog.pct}% • mínimo: 3 pilares</div></div>
  <div class="grid"><div class="card g6"><h2>Level</h2><div class="small">${S.rpg.xp}/${xpNext} XP</div><div class="progress"><div style="width:${lvlPct}%"></div></div></div><div class="card g6"><h2>Pilares</h2><div class="list">${['Protocolo','Estudo','Dieta','Treino','Bíblia'].map((n,i)=>{const k=['proto','study','diet','train','bible'][i];return `<div class='item'><div><div class='name'>${n}</div><div class='meta'>${prog[k]?'Concluído':'Pendente'}</div></div><span class='badge'>${prog[k]?'OK':'—'}</span></div>`;}).join('')}</div><div class="row"><button class="btn" id="btnCloseDay">FECHAR O DIA</button><button class="btn danger" id="btnUndo">DESFAZER</button></div></div></div>
  <div class="card"><h2>Tarefas com horário</h2><div class="list">${tasks.length?tasks.map((t,i)=>`<div class='item'><div><div class='name'>${t.time} • ${t.title}</div><div class='meta'>${t.cat}</div></div><button class='btn' data-donetask='${i}'>FEITO</button></div>`).join(''):'<div class="hint">Sem tarefas de hoje.</div>'}</div></div>
  <div class="card"><h2>Pressão inteligente</h2>${pressurePanelHTML()}</div>`;
  $('#btnExec').onclick=()=>{activeTab=win.tab||'DASH';render();};
  $('#btnCloseDay').onclick=()=>{const k=todayKey(); if(S.streakLog[k]) return showToast('Dia já fechado'); const v=prog.done===5; if(v){S.rpg.streak++; addXP(120); adjustIntegrity(+4); showToast('Dia perfeito');} else if(prog.done>=3){addXP(40); adjustIntegrity(+1); showToast('Sobreviveu')} else {S.rpg.streak=0; adjustIntegrity(-6); showToast('Dia falhou')}; S.streakLog[k]=true; saveState(); render();};
  $('#btnUndo').onclick=undoLastAction;
  view.querySelectorAll('[data-donetask]').forEach(b=>b.onclick=()=>{const i=Number(b.dataset.donetask); const arr=S.tasks.byDate[todayKey()]||[]; const it=arr[i]; if(!it) return; arr.splice(i,1); addXP(15,'ops'); adjustIntegrity(+1); saveState(); showToast('Tarefa concluída'); render();});
}

function viewProtocolo(){ let t=getTodayObj(S.proto.history); if(!t){ t={date:todayKey(), morningDone:[], nightDone:[]}; upsertToday(S.proto.history,t); saveState(); }
  const listHtml=(items,done,tag)=>items.map((name,idx)=>`<div class='item'><div><div class='name'>${name}</div><div class='meta'>${tag}</div></div><button class='btn ${done.includes(idx)?'primary':'ghost'}' data-idx='${idx}' data-tag='${tag}'>${done.includes(idx)?'FEITO':'MARCAR'}</button></div>`).join('');
  view.innerHTML=`<div class='card'><h2>Protocolo Matinal</h2><div class='list'>${listHtml(S.proto.itemsMorning,t.morningDone,'morning')}</div></div><div class='card'><h2>Protocolo Noturno</h2><div class='list'>${listHtml(S.proto.itemsNight,t.nightDone,'night')}</div></div><div class='card'><div class='row'><button class='btn' id='btnProtoBonus'>VALIDAR BÔNUS</button><button class='btn danger' id='btnProtoClear'>DESMARCAR TUDO</button></div></div>`;
  view.querySelectorAll('button[data-idx]').forEach(b=>b.onclick=()=>{const idx=Number(b.dataset.idx), tag=b.dataset.tag; const arr=tag==='morning'?t.morningDone:t.nightDone; const had=arr.includes(idx); if(had){arr.splice(arr.indexOf(idx),1);setLastAction({type:'proto',tag,idx,undo:'add'});adjustIntegrity(-1);} else {arr.push(idx);setLastAction({type:'proto',tag,idx,undo:'remove'});addXP(10,'proto');adjustIntegrity(+1);} saveState();render();});
  $('#btnProtoBonus').onclick=()=>{let bonus=0; if(t.morningDone.length>=S.proto.itemsMorning.length) bonus+=60; if(t.nightDone.length>=S.proto.itemsNight.length) bonus+=60; bonus?showToast(`Bônus +${addXP(bonus,'proto')} XP`):showToast('Sem bônus');};
  $('#btnProtoClear').onclick=()=>{t.morningDone=[];t.nightDone=[];adjustIntegrity(-4);saveState();render();};
}

function calcTargetsAuto(){ const w=S.targets.weightKg,bf=S.targets.bfPct,goal=S.targets.goal,activity=S.targets.activity; const lbm=w*(1-bf/100); const bmr=370+21.6*lbm; const act=activity==='baixa'?1.35:activity==='moderada'?1.55:1.75; let kcal=bmr*act; if(goal==='cutting') kcal-=450; if(goal==='bulk') kcal+=250; const p=Math.round((goal==='bulk'?2.2:goal==='cutting'?2.1:1.8)*w), g=Math.round(.8*w), c=Math.max(0,Math.round((kcal-(p*4+g*9))/4)); return {kcal:Math.round(kcal),p,c,g}; }
function ensureDietToday(){ let d=getTodayObj(S.diet.history); if(!d){ d={date:todayKey(), selections:{cafe:null,almoco:null,lanche:null,jantar:null}, mult:{cafe:1,almoco:1,lanche:1,jantar:1}, locked:{cafe:false,almoco:false,lanche:false,jantar:false}}; S.diet.history.push(d); saveState(); } return d; }
function sumDiet(d){ let kcal=0,p=0,c=0,g=0; for(const key of ['cafe','almoco','lanche','jantar']){ const i=d.selections[key]; if(i==null) continue; const m=MEALS[key][i], mult=d.mult[key]||1; kcal+=m.kcal*mult;p+=m.p*mult;c+=m.c*mult;g+=m.g*mult; } return {kcal:Math.round(kcal),p:Math.round(p),c:Math.round(c),g:Math.round(g)}; }
function mealCard(meal,idx,current,mult){ const sel=idx===current, kcal=Math.round(meal.kcal*mult), p=Math.round(meal.p*mult), c=Math.round(meal.c*mult), g=Math.round(meal.g*mult); return `<div class='item'><div><div class='name'>${meal.name}</div><div class='meta'>${kcal}kcal • P${p} C${c} G${g}</div></div><button class='btn ${sel?'primary':'ghost'}' data-mealidx='${idx}'>${sel?'ESCOLHIDO':'ESCOLHER'}</button></div>`; }
function dietSection(title,key,d){ const sel=d.selections[key],mult=d.mult[key],locked=d.locked[key]; return `<div class='card' data-meal='${key}'><div class='kpi'><div><div class='big'>${title}</div><div class='small'>${sel==null?'Nenhuma opção':MEALS[key][sel].name}</div></div><span class='badge'>${mult}x ${locked?'•TRAVADO':''}</span></div><div class='row'><button class='btn' data-dec='${key}'>- porção</button><button class='btn' data-inc='${key}'>+ porção</button><button class='btn ${locked?'danger':'ghost'}' data-lock='${key}'>${locked?'DESTRAVAR':'TRAVAR'}</button></div><div class='list'>${MEALS[key].map((m,i)=>mealCard(m,i,sel,mult)).join('')}</div></div>`; }
function viewDieta(){ Object.assign(S.targets, calcTargetsAuto()); saveState(); const d=ensureDietToday(); const t=sumDiet(d); const pct=Math.round(t.kcal/(S.targets.kcal||1)*100); view.innerHTML=`<div class='card'><h2>Dieta inteligente</h2><div class='small'>Meta ${S.targets.kcal}kcal • P${S.targets.p} C${S.targets.c} G${S.targets.g}</div><div class='progress'><div style='width:${Math.max(0,Math.min(100,pct))}%'></div></div><div class='hint'>Aderência: ${Math.round((Math.max(0,100-Math.abs(100-pct))*0.55 + Math.min(100,Math.round(t.p/(S.targets.p||1)*100))*0.45))}%</div></div>${dietSection('Café','cafe',d)}${dietSection('Almoço','almoco',d)}${dietSection('Lanche','lanche',d)}${dietSection('Jantar','jantar',d)}<div class='card'><div class='row'><button class='btn' id='btnDietUndo'>DESFAZER</button><button class='btn danger' id='btnDietReset'>RESET HOJE</button></div></div>`;
  ['cafe','almoco','lanche','jantar'].forEach(key=>{ view.querySelectorAll(`[data-meal='${key}'] button[data-mealidx]`).forEach(btn=>btn.onclick=()=>{ if(d.locked[key]) return showToast('Travado'); const idx=Number(btn.dataset.mealidx), prev=d.selections[key]; d.selections[key]=idx; setLastAction({type:'dietSelect',meal:key,prev,next:idx}); addXP(18,'diet'); adjustIntegrity(+1); saveState(); render();}); const dec=view.querySelector(`[data-dec='${key}']`), inc=view.querySelector(`[data-inc='${key}']`), lock=view.querySelector(`[data-lock='${key}']`); dec.onclick=()=>{if(d.locked[key])return; const prev=d.mult[key]; d.mult[key]=Math.max(.5,Math.round((d.mult[key]-0.25)*100)/100); setLastAction({type:'dietMult',meal:key,prev,next:d.mult[key]}); saveState(); render();}; inc.onclick=()=>{if(d.locked[key])return; const prev=d.mult[key]; d.mult[key]=Math.min(2,Math.round((d.mult[key]+0.25)*100)/100); setLastAction({type:'dietMult',meal:key,prev,next:d.mult[key]}); saveState(); render();}; lock.onclick=()=>{d.locked[key]=!d.locked[key]; saveState(); render();}; });
  $('#btnDietUndo').onclick=undoLastAction; $('#btnDietReset').onclick=()=>{ d.selections={cafe:null,almoco:null,lanche:null,jantar:null}; d.mult={cafe:1,almoco:1,lanche:1,jantar:1}; d.locked={cafe:false,almoco:false,lanche:false,jantar:false}; adjustIntegrity(-4); saveState(); render(); };
}

function viewTreino(){ const env=S.training.environment, lib=env==='home'?HOME_WORKOUT:GYM_WORKOUT, k=todayKey(), today=S.training.history.filter(x=>x.date===k); view.innerHTML=`<div class='card'><div class='kpi'><div><div class='big'>Treino</div><div class='small'>Ambiente: ${env==='home'?'Casa':'Academia'} • sets hoje: ${today.length}</div></div><button class='btn' id='btnEnv'>TROCAR</button></div><div class='grid'><div class='g6'><label>Grupo</label><select id='selGroup'>${Object.keys(lib).map(g=>`<option>${g}</option>`).join('')}</select></div><div class='g6'><label>Exercício</label><select id='selEx'></select></div><div class='g6'><label>Reps</label><select id='selReps'><option>5</option><option>8</option><option>10</option><option>12</option><option>15</option></select></div><div class='g6'><label>Carga</label><select id='selLoad'><option>0</option><option>5</option><option>10</option><option>15</option><option>20</option><option>30</option><option>40</option></select></div><div class='g12'><button class='btn primary wide' id='btnAddSet'>REGISTRAR 1 SET</button></div></div></div><div class='card'><h2>Sets de hoje</h2><div class='list'>${today.length?today.map((x,i)=>`<div class='item'><div><div class='name'>${x.group} • ${x.exercise}</div><div class='meta'>${x.sets[0].reps} reps • ${x.sets[0].load}kg</div></div><span class='badge'>#${i+1}</span></div>`).join(''):'<div class="hint">Nenhum set.</div>'}</div><div class='row'><button class='btn' id='btnTrainUndo'>DESFAZER</button><button class='btn danger' id='btnTrainReset'>RESET HOJE</button></div></div>`;
  const sg=$('#selGroup'), sx=$('#selEx'); const refresh=()=>{sx.innerHTML=(lib[sg.value]||[]).map(e=>`<option>${e}</option>`).join('')}; sg.onchange=refresh; refresh();
  $('#btnAddSet').onclick=()=>{ const entry={date:k,group:sg.value,exercise:sx.value,sets:[{reps:Number($('#selReps').value),load:Number($('#selLoad').value)}]}; S.training.history.push(entry); setLastAction({type:'trainSet',entry}); addXP(20,'train'); adjustIntegrity(+1); saveState(); render(); };
  $('#btnEnv').onclick=()=>{S.training.environment=S.training.environment==='home'?'gym':'home'; saveState(); render();};
  $('#btnTrainUndo').onclick=undoLastAction; $('#btnTrainReset').onclick=()=>{S.training.history=S.training.history.filter(x=>x.date!==k); adjustIntegrity(-4); saveState(); render();};
}

function fmtMMSS(sec){ return `${String(Math.floor(sec/60)).padStart(2,'0')}:${String(sec%60).padStart(2,'0')}`; }
function viewEstudo(){ const k=todayKey(), mins=S.study.history.filter(x=>x.date===k).reduce((a,b)=>a+b.minutes,0); view.innerHTML=`<div class='card'><h2>Estudo (timer)</h2><div class='small'>Hoje: ${mins} min</div><div class='grid'><div class='g6'><label>Duração</label><select id='studyDur'><option value='25'>25</option><option value='50'>50</option><option value='90'>90</option></select></div><div class='g6'><label>Matéria</label><select id='studyTopic'><option>Genética</option><option>Morfologia</option><option>Cálculo</option><option>Outros</option></select></div><div class='g12'><div class='card'><div class='kpi'><div><div class='big' id='timerBig'>${fmtMMSS(timer.left||0)}</div><div class='small' id='timerSmall'>Pronto.</div></div><span class='badge' id='timerState'>PARADO</span></div><div class='row'><button class='btn primary' id='btnStartTimer'>INICIAR</button><button class='btn' id='btnPauseTimer'>PAUSAR</button><button class='btn danger' id='btnAbortTimer'>ABANDONAR</button></div></div></div></div></div><div class='card'><h2>Hoje</h2><div class='list'>${S.study.history.filter(x=>x.date===k).map((e,i)=>`<div class='item'><div><div class='name'>${e.topic}</div><div class='meta'>${e.minutes} min</div></div><span class='badge'>#${i+1}</span></div>`).join('')||'<div class="hint">Sem blocos.</div>'}</div></div>`;
  $('#btnStartTimer').onclick=()=>startTimer(Number($('#studyDur').value)*60,$('#studyTopic').value);
  $('#btnPauseTimer').onclick=togglePause; $('#btnAbortTimer').onclick=abortTimer; updateTimerUI();
}
function startTimer(totalSec,topic){ if(timer.running) return; timer={running:true,total:totalSec,left:totalSec,topic,startedAt:Date.now(),paused:false}; clearInterval(timerInterval); timerInterval=setInterval(tickTimer,250); beep(1200,.06,.1); updateTimerUI(); }
function tickTimer(){ if(!timer.running||timer.paused) return; timer.left=Math.max(0,timer.total-Math.floor((Date.now()-timer.startedAt)/1000)); if(timer.left<=0) finishTimer(); updateTimerUI(); }
function togglePause(){ if(!timer.running) return; if(timer.paused){timer.paused=false; timer.startedAt=Date.now()-(timer.total-timer.left)*1000; beep(900,.05,.07);} else {timer.paused=true;beep(500,.05,.06);} updateTimerUI(); }
function abortTimer(){ if(!timer.running) return; timer.running=false; clearInterval(timerInterval); adjustIntegrity(-3); addXP(3,'study'); showToast('Abandonou'); timer.left=0; updateTimerUI(); }
function finishTimer(){ timer.running=false; clearInterval(timerInterval); const m=Math.round(timer.total/60), k=todayKey(); S.study.history.push({date:k,minutes:m,topic:timer.topic}); setLastAction({type:'studyAdd',date:k,minutes:m,topic:timer.topic}); addXP(35+Math.round(m*0.8),'study'); adjustIntegrity(+2); saveState(); timer.left=0; showToast('Bloco concluído'); render(); }
function updateTimerUI(){ const big=$('#timerBig'), small=$('#timerSmall'), st=$('#timerState'); if(!big) return; big.textContent=fmtMMSS(timer.left||0); st.textContent=timer.running?(timer.paused?'PAUSADO':'RODANDO'):'PARADO'; small.textContent=timer.running?(timer.paused?'Pausado':`Foco: ${timer.topic}`):'Pronto.'; }

function locatePlan(pos){ let p=pos; while(true){ for(const b of BIBLE_PLAN){ if(p<b.chapters) return {book:b.book,chapter:p+1}; p-=b.chapters; } } }
function nextBibleChapters(i,n){ return Array.from({length:n},(_,x)=>locatePlan(i+x)); }
function viewBiblia(){ const k=todayKey(), done=!!S.bibleLog[k], per=S.bible.perDay||3, plan=nextBibleChapters(S.bible.idx, per), pct=Math.round(S.bible.idx/TOTAL_BIBLE_CHAPTERS*100); view.innerHTML=`<div class='card'><div class='kpi'><div><div class='big'>Bíblia (automático)</div><div class='small'>Hoje ${per} cap. • Progresso ${pct}%</div></div><button class='btn ${done?'danger':'primary'}' id='btnBibleDone'>${done?'DESMARCAR':'MARCAR HOJE'}</button></div><div class='progress'><div style='width:${pct}%'></div></div><div class='list'>${plan.map((p,i)=>`<div class='item'><div><div class='name'>${p.book} ${p.chapter}</div><div class='meta'>Cap ${i+1}/${per}</div></div><span class='badge'>HOJE</span></div>`).join('')}</div><div class='row'><button class='btn' id='btnBiblePerDay'>AJUSTAR/DIA</button><button class='btn danger' id='btnBibleReset'>RESETAR</button></div></div>`;
  $('#btnBibleDone').onclick=()=>{ if(done){ S.bibleLog[k]=false; if(S.bibleLogAdv[k]){S.bible.idx=Math.max(0,S.bible.idx-per); delete S.bibleLogAdv[k];} adjustIntegrity(-1); } else {S.bibleLog[k]=true; if(!S.bibleLogAdv[k]){S.bible.idx=Math.min(TOTAL_BIBLE_CHAPTERS,S.bible.idx+per); S.bibleLogAdv[k]=true;} addXP(30,'bible'); adjustIntegrity(+2);} saveState(); render();};
  $('#btnBiblePerDay').onclick=()=>openModal('Capítulos/dia','Ajuste',`<select id='perDaySel'><option>1</option><option>2</option><option selected>3</option><option>4</option><option>5</option></select><div class='row'><button class='btn primary' id='savePerDay'>Salvar</button></div>`), setTimeout(()=>{const s=$('#perDaySel'); if(!s) return; s.value=String(S.bible.perDay||3); $('#savePerDay').onclick=()=>{S.bible.perDay=Number(s.value);saveState();closeModal();render();};},0);
  $('#btnBibleReset').onclick=()=>{S.bible.idx=0; S.bibleLog={}; S.bibleLogAdv={}; adjustIntegrity(-3); saveState(); render();};
}

function viewTasks(){ const k=todayKey(); const tasks=(S.tasks.byDate[k]||[]).sort((a,b)=>a.time.localeCompare(b.time)); view.innerHTML=`<div class='card'><h2>Tarefas com horário</h2><div class='grid'><div class='g6'><label>Título</label><input id='taskTitle' placeholder='Ex: Revisar genética'></div><div class='g6'><label>Horário</label><input id='taskTime' type='time'></div><div class='g6'><label>Categoria</label><select id='taskCat'><option>Estudo</option><option>Treino</option><option>Espiritual</option><option>Projeto</option><option>Social</option><option>Financeiro</option></select></div><div class='g6'><label>Duração (min)</label><select id='taskDur'><option>15</option><option>25</option><option>40</option><option>60</option><option>90</option></select></div><div class='g12'><button class='btn primary wide' id='btnTaskAdd'>ADICIONAR</button></div></div></div><div class='card'><h2>Lista de hoje</h2><div class='list'>${tasks.length?tasks.map((t,i)=>`<div class='item'><div><div class='name'>${t.time} • ${t.title}</div><div class='meta'>${t.cat} • ${t.dur}min</div></div><div class='row'><button class='btn' data-taskdone='${i}'>FEITO</button><button class='btn danger' data-taskdel='${i}'>APAGAR</button></div></div>`).join(''):'<div class="hint">Sem tarefas.</div>'}</div></div>`;
  $('#btnTaskAdd').onclick=()=>{ const title=$('#taskTitle').value.trim(), time=$('#taskTime').value, cat=$('#taskCat').value, dur=Number($('#taskDur').value); if(!title||!time) return showToast('Título e horário'); if(!S.tasks.byDate[k]) S.tasks.byDate[k]=[]; const entry={title,time,cat,dur}; S.tasks.byDate[k].push(entry); setLastAction({type:'taskAdd',entry}); addXP(8,'ops'); saveState(); showToast('Tarefa adicionada'); render();};
  view.querySelectorAll('[data-taskdel]').forEach(b=>b.onclick=()=>{ const i=Number(b.dataset.taskdel); S.tasks.byDate[k].splice(i,1); saveState(); render(); });
  view.querySelectorAll('[data-taskdone]').forEach(b=>b.onclick=()=>{ const i=Number(b.dataset.taskdone); const t=S.tasks.byDate[k][i]; if(!t) return; S.tasks.byDate[k].splice(i,1); addXP(20,'ops'); adjustIntegrity(+2); saveState(); showToast('Tarefa concluída'); render(); });
}

function viewSocial(){ const k=todayKey(), todays=S.social.history.filter(x=>x.date===k), missions=[{id:'S1',name:'Cumprimentar 1 pessoa',xp:12},{id:'S2',name:'Pergunta curta',xp:18},{id:'S3',name:'Conversa 2 min',xp:28},{id:'S4',name:'Conversa 5 min',xp:40}]; view.innerHTML=`<div class='card'><h2>Social / Exposição</h2><div class='list'>${missions.map(m=>`<div class='item'><div><div class='name'>${m.name}</div><div class='meta'>+${m.xp} XP</div></div><button class='btn primary' data-mid='${m.id}'>REGISTRAR</button></div>`).join('')}</div></div><div class='card'><h2>Hoje</h2><div class='list'>${todays.length?todays.map((x,i)=>`<div class='item'><div><div class='name'>${x.missionName}</div><div class='meta'>Ansiedade ${x.before}→${x.after}</div></div><span class='badge'>#${i+1}</span></div>`).join(''):'<div class="hint">Nada.</div>'}</div></div>`;
  view.querySelectorAll('[data-mid]').forEach(b=>b.onclick=()=>{ const m=missions.find(x=>x.id===b.dataset.mid); openModal('Registrar missão',m.name,`<label>Ansiedade antes</label><select id='anxB'><option>1</option><option>2</option><option>3</option><option selected>4</option><option>5</option></select><label>Ansiedade depois</label><select id='anxA'><option>1</option><option>2</option><option selected>3</option><option>4</option><option>5</option></select><div class='row'><button class='btn primary' id='saveSocial'>Salvar</button></div>`); setTimeout(()=>{ $('#saveSocial').onclick=()=>{ S.social.history.push({date:k,missionId:m.id,missionName:m.name,before:Number($('#anxB').value),after:Number($('#anxA').value)}); addXP(m.xp,'social'); adjustIntegrity(+2); saveState(); closeModal(); render(); }; },0); });
}

function viewOps(){ const k=todayKey(), today=S.ops.history.filter(x=>x.date===k), presets={Fazenda:['Buscar lenha','Organizar paiol','Estufa: checar'],Casa:['Arrumar quarto','Limpar cozinha'],Projetos:['Roteiro','Editar','Postar'],Estudos:['Separar material','Revisar lista']}; view.innerHTML=`<div class='card'><h2>Projetos / Operações</h2><div class='grid'><div class='g6'><label>Categoria</label><select id='opsCat'>${Object.keys(presets).map(c=>`<option>${c}</option>`).join('')}</select></div><div class='g6'><label>Tarefa</label><select id='opsTask'></select></div><div class='g6'><label>Tempo</label><select id='opsMin'><option>10</option><option>20</option><option>30</option><option>45</option><option>60</option><option>90</option></select></div><div class='g6'><label>Tipo</label><select id='opsType'><option>Execução</option><option>Manutenção</option><option>Planejamento</option></select></div><div class='g12'><button class='btn primary wide' id='btnOpsAdd'>REGISTRAR</button></div></div></div><div class='card'><h2>Hoje</h2><div class='list'>${today.length?today.map((x,i)=>`<div class='item'><div><div class='name'>${x.category}: ${x.task}</div><div class='meta'>${x.minutes}min • ${x.type}</div></div><span class='badge'>#${i+1}</span></div>`).join(''):'<div class="hint">Nada.</div>'}</div></div>`;
  const c=$('#opsCat'), t=$('#opsTask'); const rf=()=>t.innerHTML=presets[c.value].map(x=>`<option>${x}</option>`).join(''); c.onchange=rf; rf();
  $('#btnOpsAdd').onclick=()=>{ S.ops.history.push({date:k,category:c.value,task:t.value,minutes:Number($('#opsMin').value),type:$('#opsType').value}); addXP(10+Math.round(Number($('#opsMin').value)/3),'ops'); adjustIntegrity(+1); saveState(); render(); };
}

function viewLog(){ const k=todayKey(), today=S.finance.history.filter(x=>x.date===k), sum=today.reduce((a,x)=>a+x.amount,0); view.innerHTML=`<div class='card'><h2>Compras/Finanças</h2><div class='grid'><div class='g6'><label>Categoria</label><select id='finCat'>${FIN_CATS.map(c=>`<option>${c}</option>`).join('')}</select></div><div class='g6'><label>Valor (R$)</label><select id='finAmt'><option>5</option><option>10</option><option>20</option><option>30</option><option>50</option><option>80</option><option>100</option><option>150</option><option>200</option></select></div><div class='g12'><button class='btn primary wide' id='btnFinAdd'>REGISTRAR</button></div></div><div class='hint'>Hoje: R$ ${sum.toFixed(2)}</div></div><div class='card'><div class='list'>${today.length?today.map((x,i)=>`<div class='item'><div><div class='name'>${x.cat}</div><div class='meta'>R$ ${x.amount.toFixed(2)}</div></div><span class='badge'>#${i+1}</span></div>`).join(''):'<div class="hint">Nada.</div>'}</div></div>`;
  $('#btnFinAdd').onclick=()=>{ const e={date:k,cat:$('#finCat').value,amount:Number($('#finAmt').value)}; S.finance.history.push(e); if(e.amount>=150) adjustIntegrity(-1); addXP(4); saveState(); render(); };
}

function scaleRow(label,key,val){ return `<div class='item'><div><div class='name'>${label}</div><div class='meta'>1–5</div></div><div class='row'>${[1,2,3,4,5].map(n=>`<button class='btn ${n===val?'primary':'ghost'}' data-key='${key}' data-val='${n}'>${n}</button>`).join('')}</div></div>`; }
function viewDiario(){ const k=todayKey(); let d=S.diary.history.find(x=>x.date===k); if(!d){ d={date:k,energy:3,mood:3,anxiety:3,compulsion:3,porn:0,focus:3,note:''}; S.diary.history.push(d); saveState(); }
  view.innerHTML=`<div class='card'><h2>Diário operacional</h2>${scaleRow('Energia','energy',d.energy)}${scaleRow('Humor','mood',d.mood)}${scaleRow('Ansiedade','anxiety',d.anxiety)}${scaleRow('Compulsão','compulsion',d.compulsion)}${scaleRow('Foco','focus',d.focus)}<div class='item'><div><div class='name'>Pornografia hoje?</div><div class='meta'>0 não • 1 sim</div></div><button class='btn ${d.porn?'danger':'primary'}' id='btnPorn'>${d.porn?'SIM':'NÃO'}</button></div><label>Nota curta</label><input id='diaryNote' value='${(d.note||'').replace(/'/g,'&#39;')}'><div class='row'><button class='btn primary' id='btnDiarySave'>SALVAR</button></div></div>`;
  view.querySelectorAll('button[data-key]').forEach(b=>b.onclick=()=>{ d[b.dataset.key]=Number(b.dataset.val); saveState(); render(); });
  $('#btnPorn').onclick=()=>{ d.porn=d.porn?0:1; d.porn?adjustIntegrity(-6):adjustIntegrity(+2); saveState(); render(); };
  $('#btnDiarySave').onclick=()=>{ d.note=$('#diaryNote').value.slice(0,140); saveState(); addXP(6); showToast('Diário salvo'); };
}

function buildDailyReport(k){ const prog=todayProgress(); const study=S.study.history.filter(x=>x.date===k).reduce((a,b)=>a+b.minutes,0); const sets=S.training.history.filter(x=>x.date===k).length; const diet=sumDiet(ensureDietToday()); const rec=[]; if(study<25) rec.push('Estudo abaixo do mínimo'); if(sets<3) rec.push('Treino abaixo do mínimo'); if(!S.bibleLog[k]) rec.push('Bíblia pendente'); if(S.rpg.integrity<70) rec.push('Integridade baixa: priorize sono'); return [`ASCENSÃO OS – Relatório ${k}`,`Nível ${S.rpg.level} • XP ${S.rpg.xp} • Rank ${S.rpg.rank} • Integridade ${S.rpg.integrity}`,`Pilares ${prog.done}/5 (${prog.pct}%)`,`Estudo: ${study} min`,`Treino: ${sets} sets`,`Dieta: ${diet.kcal} kcal • P ${diet.p}`,'Recomendações:',...(rec.length?rec.map(x=>`- ${x}`):['- Você está no trilho.'])].join('\n'); }
function downloadText(name,text){ const blob=new Blob([text],{type:'text/plain'}); const url=URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url;a.download=name; document.body.appendChild(a); a.click(); a.remove(); setTimeout(()=>URL.revokeObjectURL(url),600); }
function viewRel(){ const k=todayKey(), report=buildDailyReport(k); view.innerHTML=`<div class='card'><div class='kpi'><div><div class='big'>Relatório</div><div class='small'>Diário e exportável</div></div><button class='btn' id='btnCopy'>COPIAR</button></div><pre>${report}</pre><div class='row'><button class='btn' id='btnExportTXT'>EXPORTAR TXT</button><button class='btn' id='btnExportJSON'>EXPORTAR JSON</button></div></div>`; $('#btnCopy').onclick=async()=>{try{await navigator.clipboard.writeText(report); showToast('Copiado');}catch{showToast('Não consegui copiar')}}; $('#btnExportTXT').onclick=()=>downloadText(`ascensao-${k}.txt`,report); $('#btnExportJSON').onclick=()=>downloadText(`ascensao-backup-${k}.json`,JSON.stringify(S,null,2)); }

function viewCfg(){ view.innerHTML=`<div class='card'><h2>Config</h2><div class='grid'><div class='g6'><label>Objetivo</label><select id='cfgGoal'><option value='cutting'>Cutting</option><option value='maint'>Manutenção</option><option value='bulk'>Lean bulk</option></select></div><div class='g6'><label>Peso (kg)</label><input id='cfgW' type='number' min='40' max='200' value='${S.targets.weightKg}'></div><div class='g6'><label>BF (%)</label><input id='cfgBF' type='number' min='5' max='45' value='${S.targets.bfPct}'></div><div class='g6'><label>Atividade</label><select id='cfgAct'><option value='baixa'>Baixa</option><option value='moderada'>Moderada</option><option value='alta'>Alta</option></select></div><div class='g6'><label>Modo estrito</label><select id='cfgStrict'><option value='0'>Desligado</option><option value='1'>Ativo</option></select></div><div class='g6'><label>CRT</label><select id='cfgCRT'><option value='1'>Ativo</option><option value='0'>Desligado</option></select></div><div class='g6'><label>Sons</label><select id='cfgSound'><option value='1'>Ativo</option><option value='0'>Desligado</option></select></div><div class='g6'><label>Música de fundo</label><select id='cfgMusic'><option value='1'>Ativo</option><option value='0'>Desligado</option></select></div><div class='g12'><label>Volume</label><input id='cfgVol' type='range' min='0' max='1' step='0.05' value='${S.sounds.volume||0.6}'></div></div><hr><div class='grid'>${Object.entries(S.windows).map(([k,v])=>`<div class='g6'><label>${k}</label><input id='w_${k}' type='time' value='${v}'></div>`).join('')}</div><button class='btn primary wide' id='btnCfgSave'>SALVAR CONFIG</button></div>
  <div class='card'><h2>Música</h2><div class='hint'>Upload mp3/m4a salvo offline no IndexedDB.</div><input id='musicFile' type='file' accept='audio/*'><div class='row'><button class='btn' id='btnMusicPlay'>PLAY</button><button class='btn' id='btnMusicStop'>STOP</button><button class='btn danger' id='btnMusicDelete'>APAGAR</button></div></div>
  <div class='card'><h2>Backup</h2><div class='row'><button class='btn' id='btnExport'>EXPORTAR JSON</button><button class='btn' id='btnImport'>IMPORTAR JSON</button><input id='importFile' type='file' accept='application/json' style='display:none'></div><button class='btn danger' id='btnWipe'>RESET TOTAL</button></div>`;
  $('#cfgGoal').value=S.targets.goal; $('#cfgAct').value=S.targets.activity; $('#cfgStrict').value=S.strictMode?'1':'0'; $('#cfgCRT').value=S.theme.crt?'1':'0'; $('#cfgSound').value=S.sounds.enabled?'1':'0'; $('#cfgMusic').value=S.sounds.music?'1':'0';
  $('#btnCfgSave').onclick=()=>{ S.targets.goal=$('#cfgGoal').value; S.targets.weightKg=Number($('#cfgW').value); S.targets.bfPct=Number($('#cfgBF').value); S.targets.activity=$('#cfgAct').value; S.strictMode=$('#cfgStrict').value==='1'; S.theme.crt=$('#cfgCRT').value==='1'; S.sounds.enabled=$('#cfgSound').value==='1'; S.sounds.music=$('#cfgMusic').value==='1'; S.sounds.volume=Math.max(0,Math.min(1,Number($('#cfgVol').value))); Object.keys(S.windows).forEach(k=>S.windows[k]=$(`#w_${k}`).value||S.windows[k]); saveState(); applyTheme(); if(!S.sounds.enabled) stopMusic(); showToast('Config salva'); render(); };
  $('#musicFile').onchange=async(e)=>{ const f=e.target.files?.[0]; if(!f) return; await idb.set('music',f); await loadMusicIfAny(); showToast('Música salva'); };
  $('#btnMusicPlay').onclick=()=>{ startMusic(); showToast('Play'); };
  $('#btnMusicStop').onclick=()=>{ stopMusic(); showToast('Stop'); };
  $('#btnMusicDelete').onclick=async()=>{ await idb.del('music'); if(musicAudio){musicAudio.pause();musicAudio=null;} showToast('Música apagada'); };
  $('#btnExport').onclick=()=>downloadText(`ascensao-backup-${todayKey()}.json`,JSON.stringify(S,null,2));
  $('#btnImport').onclick=()=>$('#importFile').click();
  $('#importFile').onchange=async(e)=>{ const f=e.target.files?.[0]; if(!f) return; try{ S=migrate(JSON.parse(await f.text())); saveState(); applyTheme(); await loadMusicIfAny(); showToast('Importado'); render(); }catch{ showToast('JSON inválido'); } };
  $('#btnWipe').onclick=()=>{ openModal('RESET TOTAL','Apaga tudo',`<button class='btn danger' id='confirmWipe'>CONFIRMAR</button>`); setTimeout(()=>{ $('#confirmWipe').onclick=async()=>{ localStorage.removeItem(STORAGE_KEY); await idb.del('music'); S=defaultState(); saveState(); closeModal(); location.reload(); }; },0); };
}

function render(){ refreshHUD(); renderTabs(); if(currentWindow().id==='sleep' && S.strictMode) beep(140,.09,.08);
  switch(activeTab){
    case 'DASH': return viewHUD(); case 'PROTO': return viewProtocolo(); case 'DIETA': return viewDieta(); case 'TREINO': return viewTreino();
    case 'ESTUDO': return viewEstudo(); case 'BIBLIA': return viewBiblia(); case 'TASKS': return viewTasks(); case 'SOCIAL': return viewSocial();
    case 'OPS': return viewOps(); case 'LOG': return viewLog(); case 'DIARIO': return viewDiario(); case 'REL': return viewRel(); case 'CFG': return viewCfg();
    default: return viewHUD();
  }
}

(function init(){
  applyTheme();
  loadMusicIfAny();
  $('#startClass').value=S.class;
  $('#btnStart').onclick=()=>{ S.class=$('#startClass').value; saveState(); $('#start').style.display='none'; $('#start').setAttribute('aria-hidden','true'); activeTab=currentWindow().tab||'DASH'; startMusic(); render(); };
  refreshHUD();
})();

setInterval(()=>{ refreshHUD(); if(S.strictMode){ const win=currentWindow(); if(activeTab!==win.tab && !['CFG','REL'].includes(activeTab)){ activeTab=win.tab; render(); }} }, 30000);
