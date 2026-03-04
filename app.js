/* ASCENSÃO OS PRO – offline single-file */
const APP_VERSION = 5;
const STORAGE_KEY = 'ascensao_os_state_v5';
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


const TRAINING_PROGRAMS = {
  home: {
    label:'Plano Casa (PUSH/PULL/LEGS/UPPER)',
    split:['PUSH','PULL','LEGS','UPPER'],
    weekly:'Seg Push • Ter Pull • Qui Legs • Sex Upper',
    periodization:'Sem 1-3 base (RPE 7.5-8.5) • Sem 4 intensificação (RPE 9) • Sem 5 deload (50%) • Sem 6-8 pesado',
    days:{
      PUSH:[
        {name:'Supino halteres no chão',sets:4,reps:'6-8',rpe:'8',tempo:'3-1-1',rest:150,tip:'Escápulas retraídas e cotovelo 45°.'},
        {name:'Supino inclinado improvisado',sets:3,reps:'8-10',rpe:'8',tempo:'3-1-1',rest:120,tip:'Alongamento máximo do peitoral.'},
        {name:'Desenvolvimento halteres',sets:3,reps:'6-8',rpe:'8',tempo:'2-1-1',rest:120,tip:'Sem arquear lombar.'},
        {name:'Elevação lateral',sets:4,reps:'12-15',rpe:'9',tempo:'2-1-2',rest:90,tip:'Última série com parciais.'},
        {name:'Tríceps francês',sets:3,reps:'10-12',rpe:'8.5',tempo:'3-1-1',rest:90,tip:'Descida controlada.'}
      ],
      PULL:[
        {name:'Barra fixa',sets:4,reps:'6-10',rpe:'8',tempo:'2-0-3',rest:180,tip:'Se >10 reps, adicionar carga.'},
        {name:'Remada curvada halteres',sets:4,reps:'8-10',rpe:'8',tempo:'3-1-1',rest:120,tip:'Alongar dorsal.'},
        {name:'Remada unilateral',sets:3,reps:'10-12',rpe:'9',tempo:'2-1-2',rest:90,tip:'Sem girar tronco.'},
        {name:'Rosca alternada',sets:3,reps:'8-10',rpe:'8',tempo:'3-1-1',rest:90,tip:'Sem balançar corpo.'},
        {name:'Rosca inclinada',sets:3,reps:'10-12',rpe:'9',tempo:'3-1-2',rest:90,tip:'Última série com LLP.'}
      ],
      LEGS:[
        {name:'Agachamento goblet',sets:4,reps:'8-10',rpe:'8',tempo:'3-1-1',rest:150,tip:'Desça profundo.'},
        {name:'Afundo búlgaro',sets:3,reps:'8-10/ perna',rpe:'9',tempo:'2-1-2',rest:120,tip:'Controle máximo.'},
        {name:'RDL com halteres',sets:4,reps:'8-10',rpe:'8',tempo:'3-1-1',rest:120,tip:'Alongar posterior.'},
        {name:'Panturrilha',sets:4,reps:'12-15',rpe:'9',tempo:'1-2-1',rest:90,tip:'Pausa no alongamento.'}
      ],
      UPPER:[
        {name:'Supino',sets:3,reps:'5-6',rpe:'8',tempo:'3-1-1',rest:120,tip:'Intensidade alta, volume menor.'},
        {name:'Barra fixa',sets:3,reps:'6-8',rpe:'8',tempo:'2-0-3',rest:180,tip:'Cadência estrita.'},
        {name:'Elevação lateral',sets:3,reps:'15',rpe:'9',tempo:'2-1-2',rest:60,tip:'Queima controlada.'},
        {name:'Rosca',sets:3,reps:'8',rpe:'8',tempo:'3-1-1',rest:90,tip:'Sem roubar.'},
        {name:'Tríceps',sets:3,reps:'10',rpe:'8',tempo:'2-1-2',rest:90,tip:'Amplitude completa.'}
      ]
    }
  },
  gym: {
    label:'Plano Academia PRO Natural',
    split:['PUSH_PESADO','PULL_PESADO','LEGS_PESADO','UPPER_HIPER','LOWER_HIPER'],
    weekly:'Push • Pull • Legs • Descanso • Upper • Lower',
    periodization:'Sem 1-3 base • Sem 4 intensificação • Sem 5 deload • Sem 6-8 pesado',
    days:{
      PUSH_PESADO:[
        {name:'Supino barra',sets:4,reps:'4-6',rpe:'8',tempo:'3-1-1',rest:180,tip:'Base de força.'},
        {name:'Supino inclinado halter',sets:3,reps:'6-8',rpe:'8',tempo:'3-1-1',rest:120,tip:'Peitoral alto.'},
        {name:'Crucifixo máquina',sets:3,reps:'10-12',rpe:'8.5',tempo:'2-1-2',rest:90,tip:'Alongar e contrair.'},
        {name:'Desenvolvimento máquina',sets:3,reps:'6-8',rpe:'8',tempo:'2-1-1',rest:120,tip:'Controle tronco.'},
        {name:'Elevação lateral',sets:4,reps:'12-15',rpe:'9',tempo:'2-1-2',rest:60,tip:'Sem trapacear.'},
        {name:'Tríceps corda',sets:3,reps:'10-12',rpe:'8.5',tempo:'2-1-2',rest:90,tip:'Extensão total.'}
      ],
      PULL_PESADO:[
        {name:'Barra fixa',sets:4,reps:'6-8',rpe:'8',tempo:'2-0-3',rest:180,tip:'Amplitude completa.'},
        {name:'Remada barra',sets:4,reps:'6-8',rpe:'8',tempo:'3-1-1',rest:150,tip:'Coluna firme.'},
        {name:'Remada máquina',sets:3,reps:'8-10',rpe:'8',tempo:'2-1-2',rest:120,tip:'Escápula ativa.'},
        {name:'Pulldown',sets:3,reps:'10-12',rpe:'8.5',tempo:'2-1-3',rest:90,tip:'Última com LLP.'},
        {name:'Rosca barra',sets:3,reps:'6-8',rpe:'8',tempo:'3-1-1',rest:120,tip:'Sem balanço.'},
        {name:'Rosca inclinada',sets:3,reps:'10-12',rpe:'9',tempo:'3-1-2',rest:90,tip:'Última com LLP.'}
      ],
      LEGS_PESADO:[
        {name:'Agachamento',sets:4,reps:'4-6',rpe:'8',tempo:'3-1-1',rest:180,tip:'Profundidade e técnica.'},
        {name:'Leg press',sets:3,reps:'8',rpe:'8',tempo:'2-1-2',rest:120,tip:'Controle joelho.'},
        {name:'RDL',sets:4,reps:'6-8',rpe:'8',tempo:'3-1-1',rest:150,tip:'Posterior forte.'},
        {name:'Flexora',sets:3,reps:'10',rpe:'8.5',tempo:'2-1-3',rest:90,tip:'Última com LLP.'},
        {name:'Panturrilha',sets:4,reps:'12-15',rpe:'9',tempo:'1-2-1',rest:90,tip:'Pausa alongada.'}
      ],
      UPPER_HIPER:[
        {name:'Supino inclinado',sets:3,reps:'8-10',rpe:'8.5',tempo:'2-1-2',rest:90,tip:'Hipertrofia limpa.'},
        {name:'Puxada',sets:3,reps:'10',rpe:'8.5',tempo:'2-1-2',rest:90,tip:'Costas cheias.'},
        {name:'Remada',sets:3,reps:'12',rpe:'8.5',tempo:'2-1-2',rest:90,tip:'Controle total.'},
        {name:'Elevação lateral',sets:4,reps:'15',rpe:'9',tempo:'2-1-2',rest:60,tip:'Queima.'},
        {name:'Bíceps',sets:3,reps:'12',rpe:'8.5',tempo:'2-1-2',rest:90,tip:'Pico de contração.'},
        {name:'Tríceps',sets:3,reps:'10',rpe:'8.5',tempo:'2-1-2',rest:90,tip:'Amplitude completa.'}
      ],
      LOWER_HIPER:[
        {name:'Hack',sets:4,reps:'8-10',rpe:'8.5',tempo:'2-1-2',rest:120,tip:'Quadríceps alvo.'},
        {name:'Extensora',sets:3,reps:'12',rpe:'9',tempo:'2-1-2',rest:90,tip:'Última com LLP.'},
        {name:'RDL',sets:3,reps:'10',rpe:'8.5',tempo:'3-1-1',rest:120,tip:'Posterior alongado.'},
        {name:'Flexora',sets:3,reps:'12',rpe:'8.5',tempo:'2-1-2',rest:90,tip:'Controle excêntrico.'},
        {name:'Panturrilha sentado',sets:4,reps:'15',rpe:'9',tempo:'1-2-1',rest:90,tip:'Pausa embaixo.'}
      ]
    }
  }
};


const TAB_DEFS = [
  {id:'DASH',label:'HUD'},{id:'PROTO',label:'Protocolo'},{id:'DIETA',label:'Dieta'},{id:'TREINO',label:'Treino'},{id:'SHAPE',label:'Shape'},{id:'TESTO',label:'Testosterona'},
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
    loading:{imageSeconds:3},
    windows:{wake:'04:40',morningEnd:'07:30',studyStart:'08:30',studyEnd:'11:30',workStart:'12:00',workEnd:'16:00',trainStart:'16:30',trainEnd:'18:30',nightStart:'19:00',sleep:'21:30'},
    targets:{goal:'cutting',weightKg:90,bfPct:25,activity:'moderada',kcal:2500,p:180,c:250,g:70},
    rpg:{xp:0,integrity:100,streak:0,level:1,rank:'Recruta',combo:0},
    bible:{idx:0,perDay:3}, bibleLog:{}, bibleLogAdv:{},
    training:{environment:'home',history:[],program:{track:'home',dayKey:'PUSH',week:1,session:null},naturalMode:true,anthro:{femur:'medio',braco:'medio',torso:'medio'}}, shape:{history:[]}, study:{history:[]},
    diet:{history:[]}, hormonal:{history:[]},
    proto:{itemsMorning:['Arrumar cama','Água','Skincare','Alongamento','Oração','Planejar dia'], itemsNight:['Higiene','Skincare','Exame rápido','Roupas','Oração','Dormir no horário'], history:[]},
    tasks:{byDate:{}},
    social:{history:[]}, ops:{history:[]}, finance:{history:[]},
    diary:{history:[]}, streakLog:{},
    lastAction:null
  };
}

let S = loadState();
let activeTab = 'DASH';
let audioCtx, musicAudio, startSfxAudio, tabClickAudio;
let loadingImageUrls = [];
let timer = {running:false, total:0, left:0, startedAt:0, paused:false, topic:''};
let timerInterval;
let workoutTimer = {running:false, mode:'idle', left:0, total:0, startedAt:0, paused:false};
let workoutInterval;

const $ = (q)=>document.querySelector(q);
const view = $('#view'); const tabs = $('#tabs'); const toast = $('#toast');
const modal = $('#modal'); const modalTitle = $('#modalTitle'); const modalSub = $('#modalSub'); const modalBody = $('#modalBody');

function loadState(){ try{ const raw=localStorage.getItem(STORAGE_KEY); if(!raw) return defaultState(); return migrate(JSON.parse(raw)); }catch{return defaultState();} }
function migrate(st){ const d=defaultState(); return {...d,...st, theme:{...d.theme,...(st.theme||{})}, sounds:{...d.sounds,...(st.sounds||{})}, loading:{...d.loading,...(st.loading||{})}, windows:{...d.windows,...(st.windows||{})}, targets:{...d.targets,...(st.targets||{})}, rpg:{...d.rpg,...(st.rpg||{})}, bible:{...d.bible,...(st.bible||{})}, tasks:{...d.tasks,...(st.tasks||{})}, hormonal:{...d.hormonal,...(st.hormonal||{})}, training:{...d.training,...(st.training||{}), program:{...d.training.program,...(st.training?.program||{})}, anthro:{...d.training.anthro,...(st.training?.anthro||{})}}, shape:{...d.shape,...(st.shape||{})} }; }
function saveState(){ localStorage.setItem(STORAGE_KEY, JSON.stringify(S)); }

function showToast(msg, ms=1500){ toast.textContent=msg; toast.classList.add('show'); setTimeout(()=>toast.classList.remove('show'), ms); }
function openModal(title, sub, bodyHtml){ modalTitle.textContent=title; modalSub.textContent=sub||''; modalBody.innerHTML=bodyHtml; modal.classList.add('show'); modal.setAttribute('aria-hidden','false'); }
function closeModal(){ modal.classList.remove('show'); modal.setAttribute('aria-hidden','true'); }
$('#modalClose').addEventListener('click', closeModal); modal.addEventListener('click', (e)=>{ if(e.target===modal) closeModal(); });

function beep(freq=880,dur=0.06,g=0.08){ if(!S.sounds.enabled) return; try{ audioCtx = audioCtx || new (window.AudioContext||window.webkitAudioContext)(); const o=audioCtx.createOscillator(); const ga=audioCtx.createGain(); o.type='square'; o.frequency.value=freq; ga.gain.value=g*(S.sounds.volume||0.6); o.connect(ga); ga.connect(audioCtx.destination); o.start(); setTimeout(()=>o.stop(), dur*1000);}catch{} }

async function loadMusicIfAny(){ try{ const blob=await idb.get('music'); if(!blob) return; if(musicAudio){musicAudio.pause(); musicAudio=null;} const url=URL.createObjectURL(blob); musicAudio = new Audio(url); musicAudio.loop=true; musicAudio.volume=S.sounds.volume||0.6; }catch{} }
function startMusic(){ if(S.sounds.enabled && S.sounds.music && musicAudio){ musicAudio.volume=S.sounds.volume||0.6; musicAudio.play().catch(()=>{});} }
function stopMusic(){ if(musicAudio) musicAudio.pause(); }
async function loadStartSfxIfAny(){ try{ const blob=await idb.get('start_sfx'); if(!blob) return; const url=URL.createObjectURL(blob); startSfxAudio = new Audio(url); startSfxAudio.volume=S.sounds.volume||0.6; }catch{} }
async function loadTabClickSfxIfAny(){ try{ const blob=await idb.get('tab_click_sfx'); if(!blob) return; const url=URL.createObjectURL(blob); tabClickAudio = new Audio(url); tabClickAudio.volume=S.sounds.volume||0.6; }catch{} }
async function loadLoadingImagesIfAny(){
  try{
    loadingImageUrls.forEach((u)=>URL.revokeObjectURL(u));
    loadingImageUrls = [];
    for(let i=1;i<=5;i++){
      const blob = await idb.get(`loading_image_${i}`);
      if(blob) loadingImageUrls.push(URL.createObjectURL(blob));
    }
  }catch{}
}
async function loadStartupAssets(){ await Promise.all([loadMusicIfAny(), loadStartSfxIfAny(), loadTabClickSfxIfAny(), loadLoadingImagesIfAny()]); }
function playStartSound(){
  beep(940,.08,.1);
  if(!S.sounds.enabled) return Promise.resolve();
  if(!startSfxAudio) return Promise.resolve();
  return new Promise((resolve)=>{
    startSfxAudio.currentTime=0;
    startSfxAudio.volume=S.sounds.volume||0.6;
    const done=()=>{ startSfxAudio.removeEventListener('ended',done); resolve(); };
    startSfxAudio.addEventListener('ended',done,{once:true});
    startSfxAudio.play().then(()=>setTimeout(done,2500)).catch(done);
  });
}
function runLoadingScreen(){
  const panel=$('#loadingScreen');
  const visual=$('#loadingVisual');
  const bar=$('#loadingBarFill');
  const secs=Math.max(1,Number(S.loading?.imageSeconds)||3);
  const totalSlides=loadingImageUrls.length||5;
  const totalMs=totalSlides*secs*1000;
  const fallback='linear-gradient(135deg,#0b0b0b,#1f1f1f 45%,#0a0a0a)';
  panel.style.display='flex';
  panel.setAttribute('aria-hidden','false');
  startMusic();
  return new Promise((resolve)=>{
    const startAt=performance.now();
    const tick=()=>{
      const elapsed=performance.now()-startAt;
      const pct=Math.max(0,Math.min(100,(elapsed/totalMs)*100));
      const idx=Math.min(totalSlides-1,Math.floor(elapsed/(secs*1000)));
      const img=loadingImageUrls[idx]||null;
      visual.style.backgroundImage=img?`url('${img}')`:fallback;
      bar.style.width=`${pct}%`;
      if(elapsed>=totalMs){
        stopMusic();
        panel.style.display='none';
        panel.setAttribute('aria-hidden','true');
        resolve();
        return;
      }
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });
}

function dopamineHit(gain, tag='generic'){
  const layerId='dopamineLayer';
  let layer=document.getElementById(layerId);
  if(!layer){ layer=document.createElement('div'); layer.id=layerId; document.body.appendChild(layer); }
  const pop=document.createElement('div');
  pop.className='xp-pop';
  const x=Math.max(24, Math.min(window.innerWidth-24, window.innerWidth*0.5 + (Math.random()*120-60)));
  const y=Math.max(120, Math.min(window.innerHeight-120, window.innerHeight*0.35 + (Math.random()*80-40)));
  pop.style.left = `${x}px`;
  pop.style.top = `${y}px`;
  pop.textContent = `+${gain} XP ${tag.toUpperCase()}`;
  layer.appendChild(pop);
  setTimeout(()=>pop.remove(), 980);
  if(navigator.vibrate) navigator.vibrate([18,35,18]);
  const hud=document.querySelector('.hud');
  if(hud){ hud.classList.add('hud-boost'); setTimeout(()=>hud.classList.remove('hud-boost'), 500); }
}

async function forceRefreshApp(){
  try{
    if('serviceWorker' in navigator){
      const regs = await navigator.serviceWorker.getRegistrations();
      await Promise.all(regs.map((r)=>r.unregister()));
    }
    if('caches' in window){
      const keys = await caches.keys();
      await Promise.all(keys.map((k)=>caches.delete(k)));
    }
    showToast('Cache limpo. Recarregando...');
    setTimeout(()=>location.reload(), 300);
  }catch{
    showToast('Não consegui limpar cache');
  }
}

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
function addXP(base,tag='generic'){ const ph=phaseForDay(campaignDay()); const bonus=xpBonusFactor(); const gain=Math.max(1,Math.round(base*ph.mult*(bonus[tag]||1)*(S.rpg.integrity/100))); S.rpg.xp+=gain; S.rpg.level=computeLevel(S.rpg.xp); S.rpg.rank=computeRank(S.rpg.xp); S.rpg.combo=Math.min(999,(S.rpg.combo||0)+1); saveState(); beep(920,.05,.09); dopamineHit(gain, tag); refreshHUD(); return gain; }
function adjustIntegrity(d){ S.rpg.integrity=Math.max(0,Math.min(100,S.rpg.integrity+d)); if(d<0) S.rpg.combo=Math.max(0,(S.rpg.combo||0)-1); saveState(); refreshHUD(); }

function getTodayObj(arr){ return arr.find(x=>x.date===todayKey()); }
function upsertToday(arr,obj){ const i=arr.findIndex(x=>x.date===todayKey()); if(i>=0) arr[i]=obj; else arr.push(obj); }
function todayProgress(){ const k=todayKey(); const proto=(S.proto.history.find(x=>x.date===k)?.morningDone?.length||0)>=3; const study=S.study.history.filter(x=>x.date===k).reduce((a,b)=>a+b.minutes,0)>=25; const dietObj=S.diet.history.find(x=>x.date===k); const diet=!!(dietObj?.entries?.length || dietObj?.selections?.cafe!=null); const train=S.training.history.filter(x=>x.date===k).length>=3; const bible=(S.bibleLog?.[k]===true); const done=[proto,study,diet,train,bible].filter(Boolean).length; return {proto,study,diet,train,bible,done,total:5,pct:Math.round(done/5*100)}; }

function setLastAction(a){ S.lastAction=a; saveState(); }
function undoLastAction(){ const a=S.lastAction; if(!a) return showToast('Nada pra desfazer'); const k=todayKey(); try{
  if(a.type==='proto'){ const t=getTodayObj(S.proto.history); if(t){ const arr=a.tag==='morning'?t.morningDone:t.nightDone; if(a.undo==='remove'){ const i=arr.indexOf(a.idx); if(i>=0) arr.splice(i,1);} else if(!arr.includes(a.idx)) arr.push(a.idx); }}
  if(a.type==='dietSelect'){ const d=ensureDietToday(); d.selections[a.meal]=a.prev; }
  if(a.type==='dietMult'){ const d=ensureDietToday(); d.mult[a.meal]=a.prev; }
  if(a.type==='dietQuickAdd'){ const d=ensureDietToday(); d.entries.pop(); }
  if(a.type==='dietWeight'){ const d=ensureDietToday(); d.weights.pop(); }
  if(a.type==='trainSet'){ const i=S.training.history.lastIndexOf(a.entry); if(i>=0) S.training.history.splice(i,1); }
  if(a.type==='studyAdd'){ for(let i=S.study.history.length-1;i>=0;i--){const x=S.study.history[i]; if(x.date===a.date&&x.minutes===a.minutes&&x.topic===a.topic){S.study.history.splice(i,1);break;}} }
  if(a.type==='taskAdd'){ const arr=(S.tasks.byDate[k]||[]); arr.pop(); }
  S.lastAction=null; saveState(); showToast('Desfeito'); render();
}catch{ showToast('Falhou desfazer'); }}

function applyTheme(){ document.body.classList.toggle('crt', !!S.theme.crt); }
function refreshHUD(){ $('#hudLevel').textContent=S.rpg.level; $('#hudXP').textContent=S.rpg.xp; $('#hudRank').textContent=S.rpg.rank; $('#hudInt').textContent=S.rpg.integrity; $('#hudStreak').textContent=S.rpg.streak; $('#hudCombo').textContent=S.rpg.combo||0; $('#phaseBadge').textContent=`D${campaignDay()} • v${APP_VERSION}`; const win=currentWindow(); $('#missionLine').innerHTML=`MISSÃO DO MOMENTO: <b>${win.name}</b> • fecha em <b>${timeLeftInWindow(win)}</b>`; }

function playTabClickSound(){
  if(!S.sounds.enabled) return;
  if(tabClickAudio){
    tabClickAudio.currentTime=0;
    tabClickAudio.volume=S.sounds.volume||0.6;
    tabClickAudio.play().catch(()=>beep(760,.03,.05));
    return;
  }
  beep(760,.03,.05);
}
function renderTabs(){ tabs.innerHTML=''; const win=currentWindow(); for(const t of TAB_DEFS){ const b=document.createElement('button'); b.className='tabbtn'+(t.id===activeTab?' active':''); b.textContent=t.label; b.onclick=()=>{ if(S.strictMode){ const allow=['CFG','REL']; if(!(t.id===win.tab||allow.includes(t.id))){ adjustIntegrity(-2); beep(220,.08,.08); showToast('Modo estrito: volta pra missão'); activeTab=win.tab; return render(); }} activeTab=t.id; playTabClickSound(); render(); }; tabs.appendChild(b);} }

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

const FOOD_DB = [
  {name:'Arroz cozido', grams:100, kcal:130,p:2.5,c:28,g:0.3,fiber:0.4,sodium:1,chol:0,micros:{vitA:0,vitB1:0.02,vitB2:0.01,vitB3:0.4,vitB5:0.4,vitB6:0.1,vitB9:3,vitB12:0,vitC:0,vitD:0,vitE:0.1,vitK:0.1,calcio:10,ferro:0.2,magnesio:12,zinco:0.5,potassio:35,selenio:7,fosforo:43,iodo:2}},
  {name:'Feijão carioca cozido', grams:100, kcal:77,p:4.8,c:14,g:0.5,fiber:8.5,sodium:1,chol:0,micros:{vitA:0,vitB1:0.1,vitB2:0.03,vitB3:0.3,vitB5:0.2,vitB6:0.1,vitB9:150,vitB12:0,vitC:0,vitD:0,vitE:0.1,vitK:2,calcio:27,ferro:1.3,magnesio:42,zinco:0.8,potassio:255,selenio:1,fosforo:87,iodo:1}},
  {name:'Peito de frango grelhado', grams:100, kcal:165,p:31,c:0,g:3.6,fiber:0,sodium:74,chol:85,micros:{vitA:13,vitB1:0.07,vitB2:0.1,vitB3:14,vitB5:1.1,vitB6:0.6,vitB9:4,vitB12:0.3,vitC:0,vitD:0,vitE:0.3,vitK:0.3,calcio:15,ferro:1,magnesio:29,zinco:1,potassio:256,selenio:24,fosforo:220,iodo:6}},
  {name:'Carne bovina magra', grams:100, kcal:217,p:26,c:0,g:12,fiber:0,sodium:72,chol:90,micros:{vitA:0,vitB1:0.06,vitB2:0.15,vitB3:5.8,vitB5:0.5,vitB6:0.4,vitB9:6,vitB12:2.2,vitC:0,vitD:0.1,vitE:0.2,vitK:1.5,calcio:18,ferro:2.6,magnesio:22,zinco:4.8,potassio:318,selenio:18,fosforo:200,iodo:7}},
  {name:'Aveia', grams:100, kcal:389,p:17,c:66,g:7,fiber:10.6,sodium:2,chol:0,micros:{vitA:0,vitB1:0.76,vitB2:0.14,vitB3:0.96,vitB5:1.3,vitB6:0.12,vitB9:56,vitB12:0,vitC:0,vitD:0,vitE:0.4,vitK:2,calcio:54,ferro:4.7,magnesio:177,zinco:4,potassio:429,selenio:28,fosforo:523,iodo:6}},
  {name:'Banana', grams:100, kcal:89,p:1.1,c:23,g:0.3,fiber:2.6,sodium:1,chol:0,micros:{vitA:3,vitB1:0.03,vitB2:0.07,vitB3:0.7,vitB5:0.3,vitB6:0.37,vitB9:20,vitB12:0,vitC:8.7,vitD:0,vitE:0.1,vitK:0.5,calcio:5,ferro:0.3,magnesio:27,zinco:0.2,potassio:358,selenio:1,fosforo:22,iodo:2}},
  {name:'Ovo inteiro', grams:100, kcal:143,p:13,c:1.1,g:9.5,fiber:0,sodium:142,chol:373,micros:{vitA:160,vitB1:0.04,vitB2:0.5,vitB3:0.1,vitB5:1.4,vitB6:0.17,vitB9:47,vitB12:1.1,vitC:0,vitD:2,vitE:1.1,vitK:0.3,calcio:56,ferro:1.8,magnesio:12,zinco:1.3,potassio:138,selenio:30,fosforo:198,iodo:24}},
  {name:'Batata doce', grams:100, kcal:86,p:1.6,c:20,g:0.1,fiber:3,sodium:55,chol:0,micros:{vitA:709,vitB1:0.08,vitB2:0.06,vitB3:0.6,vitB5:0.8,vitB6:0.2,vitB9:11,vitB12:0,vitC:2.4,vitD:0,vitE:0.3,vitK:1.8,calcio:30,ferro:0.6,magnesio:25,zinco:0.3,potassio:337,selenio:0.6,fosforo:47,iodo:1}},
  {name:'Iogurte natural', grams:100, kcal:61,p:3.5,c:4.7,g:3.3,fiber:0,sodium:46,chol:13,micros:{vitA:27,vitB1:0.04,vitB2:0.14,vitB3:0.1,vitB5:0.4,vitB6:0.04,vitB9:7,vitB12:0.4,vitC:0.6,vitD:0.1,vitE:0.1,vitK:0.2,calcio:121,ferro:0.1,magnesio:12,zinco:0.6,potassio:155,selenio:3,fosforo:95,iodo:37}},
  {name:'Salmão', grams:100, kcal:208,p:20,c:0,g:13,fiber:0,sodium:59,chol:55,micros:{vitA:40,vitB1:0.2,vitB2:0.4,vitB3:8.6,vitB5:1.6,vitB6:0.9,vitB9:25,vitB12:3.2,vitC:3.9,vitD:10,vitE:1.1,vitK:0.1,calcio:9,ferro:0.3,magnesio:29,zinco:0.6,potassio:363,selenio:36,fosforo:252,iodo:30}},
  {name:'Castanhas', grams:100, kcal:607,p:20,c:21,g:54,fiber:8,sodium:12,chol:0,micros:{vitA:1,vitB1:0.42,vitB2:0.06,vitB3:1.1,vitB5:0.5,vitB6:0.3,vitB9:22,vitB12:0,vitC:0.5,vitD:0,vitE:5.7,vitK:34,calcio:114,ferro:2.8,magnesio:260,zinco:3,potassio:565,selenio:9,fosforo:484,iodo:4}},
  {name:'Whey protein', grams:30, kcal:120,p:24,c:3,g:1.5,fiber:0.4,sodium:70,chol:10,micros:{vitA:0,vitB1:0.04,vitB2:0.09,vitB3:0.3,vitB5:0.2,vitB6:0.1,vitB9:8,vitB12:0.2,vitC:0,vitD:0,vitE:0.1,vitK:0,calcio:120,ferro:0.3,magnesio:20,zinco:0.5,potassio:160,selenio:4,fosforo:100,iodo:3}}
];
const MICRO_TARGETS = {vitA:900,vitB1:1.2,vitB2:1.3,vitB3:16,vitB5:5,vitB6:1.7,vitB9:400,vitB12:2.4,vitC:90,vitD:15,vitE:15,vitK:120,calcio:1000,ferro:8,magnesio:420,zinco:11,potassio:3400,selenio:55,fosforo:700,iodo:150};
const PHYSIO_MODES = {
  cutting:{label:'Cutting',rate:[-0.8,-0.5],energy:-380,proteinKg:2.2,fatKg:0.7,carbTiming:'Carbo alto pré/pós treino'},
  aggressive:{label:'Cutting agressivo',rate:[-1.2,-1],energy:-620,proteinKg:2.4,fatKg:0.65,carbTiming:'Carbo focado apenas janela de treino'},
  maintenance:{label:'Manutenção',rate:[-0.1,0.1],energy:0,proteinKg:2.0,fatKg:0.8,carbTiming:'Carbo distribuído uniforme'},
  lean_bulk:{label:'Lean Bulk',rate:[0.25,0.5],energy:240,proteinKg:1.9,fatKg:0.8,carbTiming:'Carbo progressivo no pré e intra'}
};
const DIET_FAVORITES = [
  {name:'Arroz + feijão + carne', grams:450, foods:[['Arroz cozido',180],['Feijão carioca cozido',120],['Carne bovina magra',150]]},
  {name:'Frango + arroz', grams:350, foods:[['Arroz cozido',170],['Peito de frango grelhado',180]]},
  {name:'Ovo + pão', grams:220, foods:[['Ovo inteiro',120],['Aveia',40],['Banana',60]]},
  {name:'Banana', grams:100, foods:[['Banana',100]]},
  {name:'Café', grams:30, foods:[['Iogurte natural',100]]},
  {name:'Shake proteína', grams:30, foods:[['Whey protein',30]]},
  {name:'Almoço caseiro', grams:500, foods:[['Arroz cozido',200],['Feijão carioca cozido',120],['Peito de frango grelhado',180]]},
  {name:'Janta padrão', grams:420, foods:[['Batata doce',200],['Peito de frango grelhado',180],['Castanhas',40]]}
];
const SIZE_PRESETS = {pequena:0.75,medio:1,grande:1.3};
const TRIGGER_OPTIONS = ['fome','ansiedade','tedio','estresse','social'];

function foodByName(name){ return FOOD_DB.find(x=>x.name===name); }
function microsZero(){ const m={}; Object.keys(MICRO_TARGETS).forEach(k=>m[k]=0); return m; }
function sumMicros(base,add,factor=1){ Object.keys(base).forEach(k=>base[k]+=((add[k]||0)*factor)); }
function mealFromFoods(label, foods){
  const r={name:label,grams:0,kcal:0,p:0,c:0,g:0,fiber:0,sodium:0,chol:0,micros:microsZero()};
  foods.forEach(([fname,grams])=>{ const f=foodByName(fname); if(!f) return; const mult=grams/f.grams; r.grams+=grams; r.kcal+=f.kcal*mult; r.p+=f.p*mult; r.c+=f.c*mult; r.g+=f.g*mult; r.fiber+=f.fiber*mult; r.sodium+=f.sodium*mult; r.chol+=(f.chol||0)*mult; sumMicros(r.micros,f.micros,mult); });
  return r;
}
function ensureDietToday(){
  let d=getTodayObj(S.diet.history);
  if(!d){ d={date:todayKey(), mode:'cutting', entries:[], triggerMap:{fome:0,ansiedade:0,tedio:0,estresse:0,social:0}, favoritesStats:{}, weights:[], routine:{steps:8000,awakeHours:16,activityLevel:'moderada'}, mental:{fatigue:45,compulsion:0}, autoTargets:null, weeklyAdjust:null}; S.diet.history.push(d); }
  d.entries=d.entries||[]; d.weights=d.weights||[]; d.favoritesStats=d.favoritesStats||{}; d.mode=d.mode||'cutting';
  d.triggerMap=d.triggerMap||{fome:0,ansiedade:0,tedio:0,estresse:0,social:0}; d.routine=d.routine||{steps:8000,awakeHours:16,activityLevel:'moderada'}; d.mental=d.mental||{fatigue:45,compulsion:0};
  return d;
}
function collectIntegratedSignals(){
  const d=ensureDietToday(), k=todayKey();
  const weekTrain=S.training.history.filter(x=>{ const dt=new Date(x.date||k); return (Date.now()-dt.getTime())<=7*86400000; });
  const volume=weekTrain.length;
  const daysTrained=new Set(weekTrain.map(x=>x.date)).size;
  const avgReps=weekTrain.reduce((a,e)=>a+((e.sets||[]).reduce((s,it)=>s+(Number(it.reps)||0),0)),0)/Math.max(1,volume);
  const intensity=avgReps<=6?0.9:avgReps<=10?0.78:0.65;
  const cardioMinutes=Math.round(volume*8);
  const gastoTreino=Math.round(volume*42 + cardioMinutes*7);
  const shapeWeights=(S.diet.history||[]).slice(-14).flatMap(x=>x.weights||[]).map(x=>x.kg).filter(Boolean);
  const weightNow=shapeWeights.at(-1)||S.targets.weightKg;
  const weightAvg7=(shapeWeights.slice(-7).reduce((a,b)=>a+b,0)/Math.max(1,shapeWeights.slice(-7).length))||weightNow;
  const trendWeek=((shapeWeights.length>=8)?(shapeWeights.at(-1)-shapeWeights.at(-8)):0);
  const bf=S.targets.bfPct;
  const shape={weightNow,weightAvg7,bf,trendWeek,measurements:{cintura:92,braco:39,coxa:62}};
  const rotina={steps:d.routine.steps,awakeHours:d.routine.awakeHours,activity:d.routine.activityLevel};
  const mental={compulsion:d.mental.compulsion+(d.entries.filter(x=>x.mode==='realidade').length),fatigue:d.mental.fatigue};
  return {treino:{volume,gastoTreino,daysTrained,intensity,cardioMinutes},shape,rotina,mental};
}
function sumDiet(d){
  const totals={kcal:0,p:0,c:0,g:0,fiber:0,sodium:0,chol:0,micros:microsZero()};
  (d.entries||[]).forEach(e=>{ totals.kcal+=e.kcal||0; totals.p+=e.p||0; totals.c+=e.c||0; totals.g+=e.g||0; totals.fiber+=e.fiber||0; totals.sodium+=e.sodium||0; totals.chol+=e.chol||0; sumMicros(totals.micros,e.micros||{}); });
  ['kcal','p','c','g','fiber','sodium','chol'].forEach(k=>totals[k]=Math.round(totals[k]));
  return totals;
}
function dynamicTDEE(signals){
  const lbm=signals.shape.weightAvg7*(1-signals.shape.bf/100);
  const bmr=370+21.6*lbm;
  const neat=signals.rotina.steps*0.035 + Math.max(0,signals.rotina.awakeHours-14)*22;
  const treino=signals.treino.gastoTreino/7;
  const adaptPenalty=Math.max(0,Math.abs(signals.shape.trendWeek)*120);
  return Math.round(bmr+neat+treino-adaptPenalty);
}
function calcTargetsAuto(){
  const d=ensureDietToday(), signals=collectIntegratedSignals(), mode=PHYSIO_MODES[d.mode]||PHYSIO_MODES.cutting;
  const tdee=dynamicTDEE(signals);
  let kcal=tdee+mode.energy;
  const weeklyRate=((signals.shape.trendWeek/signals.shape.weightAvg7)*100);
  if(weeklyRate>mode.rate[1]) kcal-=120;
  if(weeklyRate<mode.rate[0]) kcal+=90;
  if(signals.mental.fatigue>=70) kcal+=60;
  const p=Math.round(mode.proteinKg*signals.shape.weightAvg7);
  const g=Math.round(Math.max(45,mode.fatKg*signals.shape.weightAvg7));
  const c=Math.max(60,Math.round((kcal-(p*4+g*9))/4));
  const carbHeavy=Math.round(c*0.62), carbRest=Math.round(c*0.38);
  d.autoTargets={kcal:Math.round(kcal),p,c,g,tdee,rateTarget:mode.rate,mode:mode.label,carbTiming:mode.carbTiming,trainCarb:carbHeavy,restCarb:carbRest,signals};
  return d.autoTargets;
}
function micronutrientStatus(totals){
  return Object.entries(MICRO_TARGETS).map(([k,v])=>{ const pct=(totals.micros[k]||0)/v*100; const status=pct>=95?'✅ Adequado':pct>=70?'⚠ Baixo':'❌ Deficiente'; return {k,target:v,val:Math.round((totals.micros[k]||0)*10)/10,pct:Math.round(pct),status}; });
}
function suggestMicroFix(item){
  if(item.status==='✅ Adequado') return 'Manter padrão atual.';
  const map={magnesio:'Magnésio baixo — adicionar aveia ou castanhas.',vitD:'Vitamina D baixa — incluir salmão/sol diário ou suplementação.',ferro:'Ferro baixo — priorizar carne magra e feijão.',potassio:'Potássio baixo — adicionar banana e batata doce.',iodo:'Iodo baixo — usar sal iodado e peixes.'};
  return map[item.k]||`${item.k} baixo — aumentar alimentos ricos nesse micronutriente.`;
}
function favoriteList(d){ return DIET_FAVORITES.map(f=>({f,count:d.favoritesStats[f.name]||0})).sort((a,b)=>b.count-a.count).map(x=>x.f); }
function registerDietEntry(d,meal,mode='favoritos'){ d.entries.push({...meal,mode,at:new Date().toISOString()}); setLastAction({type:'dietQuickAdd'}); addXP(14,'diet'); adjustIntegrity(mode==='realidade'?-1:+1); }
function parseVoice(text){
  const s=(text||'').toLowerCase();
  if(!s.trim()) return null;
  if(s.includes('arroz')&&s.includes('feijão')&&s.includes('frango')) return mealFromFoods('Voz: arroz + feijão + frango', [['Arroz cozido',180],['Feijão carioca cozido',120],['Peito de frango grelhado',170]]);
  if(s.includes('whey')||s.includes('shake')) return mealFromFoods('Voz: shake proteína', [['Whey protein',30],['Banana',100]]);
  if(s.includes('ovo')) return mealFromFoods('Voz: ovos', [['Ovo inteiro',150]]);
  return mealFromFoods(`Voz: ${text}`, [['Arroz cozido',150],['Peito de frango grelhado',120]]);
}
function visualEstimate(size){ const mult=SIZE_PRESETS[size]||1; return mealFromFoods(`Estimativa ${size}`, [['Arroz cozido',160*mult],['Peito de frango grelhado',130*mult],['Feijão carioca cozido',90*mult]]); }
function applyTrigger(d,key){ if(!TRIGGER_OPTIONS.includes(key)) return; d.triggerMap[key]=(d.triggerMap[key]||0)+1; if(key==='ansiedade'||key==='estresse') d.mental.compulsion=(d.mental.compulsion||0)+1; }
function weeklyAutoAdjust(d,targets,totals){
  const days=(S.diet.history||[]).slice(-7); const adherence=Math.round((days.filter(x=>(x.entries||[]).length>0).length/7)*100);
  const realTrend=((d.autoTargets?.signals?.shape?.trendWeek||0)/Math.max(1,d.autoTargets?.signals?.shape?.weightAvg7||1))*100;
  let action='Manter macros'; let kcalDelta=0;
  if(realTrend>-0.3 && d.mode!=='lean_bulk'){ action='Estagnado: reduzir 120 kcal'; kcalDelta=-120; }
  if(realTrend<-1.3 && d.mode!=='lean_bulk'){ action='Perda excessiva: subir 90 kcal'; kcalDelta=90; }
  if(d.autoTargets.signals.mental.fatigue>72){ action+=' + subir carbo treino'; }
  d.weeklyAdjust={adherence,realTrend:Math.round(realTrend*100)/100,action,kcalDelta,performance:d.autoTargets.signals.treino.intensity};
  return d.weeklyAdjust;
}
function metabolicRisk(d,targets,totals){
  const risks=[];
  if(totals.g<targets.g*0.85) risks.push('baixa ingestão gordura');
  if((d.entries||[]).filter(x=>x.mode==='realidade').length>=2) risks.push('fome crônica/compulsão');
  if(targets.kcal<targets.tdee*0.72) risks.push('déficit extremo prolongado');
  if(d.mental.fatigue>=75) risks.push('queda performance');
  if(risks.length>=2) return {msg:'Risco metabólico alto: ativar refeed automático.',plan:'Refeed: +40% carbs por 1 dia.'};
  if(risks.length===1) return {msg:`Risco detectado: ${risks[0]}.`,plan:'Sugerir diet break de 4-7 dias se persistir.'};
  return {msg:'Sem risco metabólico crítico.',plan:'Seguimento padrão do protocolo.'};
}
function dietStatus(t,targets){ if(t.kcal<=targets.kcal*1.03 && t.p>=targets.p) return '✅ Controle total'; if(t.kcal<=targets.kcal*1.15) return '⚠ Atenção'; return '❌ Fora do plano'; }
function microStatusHTML(micro){ return `<div class='list'>${micro.map(m=>`<div class='item'><div><div class='name'>${m.k}</div><div class='meta'>${m.val}/${m.target}</div></div><span class='badge'>${m.status}</span></div>`).join('')}</div>`; }

function viewDieta(){
  syncMetabolicSystems();
  const d=ensureDietToday();
  const targets=calcTargetsAuto();
  const totals=sumDiet(d);
  const status=dietStatus(totals,targets);
  const weekly=weeklyAutoAdjust(d,targets,totals);
  const micro=micronutrientStatus(totals);
  const risk=metabolicRisk(d,targets,totals);
  const rest=Math.max(0,targets.kcal-totals.kcal);
  const pct=Math.max(0,Math.min(100,Math.round(totals.kcal/Math.max(1,targets.kcal)*100)));
  const fatRate=(-weekly.realTrend||0);
  const bfForecast=Math.max(5,Math.round((S.targets.bfPct - (Math.max(0,fatRate)*4))*10)/10);
  const weeksTo12=Math.max(0,Math.round(((S.targets.bfPct-12)/Math.max(0.1,fatRate))*10)/10);
  const weeksToStage=Math.max(0,Math.round(((S.targets.bfPct-6)/Math.max(0.1,fatRate))*10)/10);
  const score=(totals.p>=targets.p?10:0)+(totals.kcal<=targets.kcal?10:0)+(micro.filter(m=>m.status==='✅ Adequado').length>=12?10:0)+(weekly.adherence>=80?10:0);

  view.innerHTML=`
  <div class='card'><div class='kpi'><div><h2>DIETA — Motor Metabólico</h2><div class='small'>Objetivo: cutting para competição natural</div></div><button class='btn primary' id='btnEat'>+ COMER</button></div></div>
  <div class='card'><div class='row'><label>Modo fisiológico<select id='dietMode'>${Object.entries(PHYSIO_MODES).map(([k,v])=>`<option value='${k}' ${d.mode===k?'selected':''}>${v.label}</option>`).join('')}</select></label><div class='small'>${targets.carbTiming}</div></div></div>
  <div class='card'><div class='kpi'><div><div class='name'>Calorias hoje</div><div class='big'>${totals.kcal}</div></div><div><div class='name'>Restantes</div><div class='big'>${rest}</div></div></div><div class='small'>Proteína ${totals.p}/${targets.p}g • Meta ${Math.round(targets.kcal)} kcal</div><div class='progress'><div style='width:${pct}%'></div></div><div class='kpi'><div class='badge'>${status}</div><div class='badge'>TDEE ${targets.tdee}</div></div></div>
  <div class='card'><h2>Integração TREINO/SHAPE/ROTINA/MENTAL</h2><div class='small'>Treino: volume ${targets.signals.treino.volume} • dias ${targets.signals.treino.daysTrained} • intensidade ${Math.round(targets.signals.treino.intensity*100)}% • cardio ${targets.signals.treino.cardioMinutes}min</div><div class='small'>Shape: peso ${targets.signals.shape.weightNow}kg • média 7d ${Math.round(targets.signals.shape.weightAvg7*10)/10}kg • BF ${targets.signals.shape.bf}%</div><div class='small'>Rotina: ${targets.signals.rotina.steps} passos • ${targets.signals.rotina.awakeHours}h acordado • atividade ${targets.signals.rotina.activity}</div><div class='small'>Mental: fadiga ${targets.signals.mental.fatigue} • compulsão ${targets.signals.mental.compulsion}</div></div>
  <div class='card'><h2>Periodização Nutricional</h2><div class='small'>Dia treino pesado: carbo ${targets.trainCarb}g • Dia descanso: carbo ${targets.restCarb}g • proteína constante.</div><div class='small'>Velocidade alvo: ${targets.rateTarget[0]}% a ${targets.rateTarget[1]}% peso/semana</div></div>
  <div class='card'><h2>Controle de Compulsão</h2><div class='small'>O que motivou?</div><div class='row'>${TRIGGER_OPTIONS.map(t=>`<button class='btn' data-trigger='${t}'>${t}</button>`).join('')}</div></div>
  <div class='card'><h2>Status Nutricional (Micronutrientes)</h2>${microStatusHTML(micro.slice(0,8))}<div class='hint'>${suggestMicroFix(micro.sort((a,b)=>a.pct-b.pct)[0])}</div></div>
  <div class='card'><h2>Risco Metabólico</h2><div class='small'>${risk.msg}</div><div class='hint'>${risk.plan}</div></div>
  <div class='card'><h2>Dashboard Cutting</h2><div class='small'>Taxa real perda: ${fatRate.toFixed(2)}%/semana • Previsão BF: ${bfForecast}% • Semanas até 12%: ${weeksTo12} • Semanas até palco: ${weeksToStage}</div></div>
  <div class='card'><h2>Auto-ajuste semanal</h2><div class='small'>Aderência ${weekly.adherence}% • tendência ${weekly.realTrend}% • ajuste: ${weekly.action}</div></div>
  <div class='card'><h2>Score Dieta (Ascensão)</h2><div class='small'>XP diário base: ${score} • integra Integridade/Combo/Streak.</div></div>
  <div class='card'><div class='row'><button class='btn' id='btnWeight'>Registrar peso</button><button class='btn' id='btnRoutine'>Atualizar rotina/mental</button><button class='btn' id='btnDietUndo'>DESFAZER</button><button class='btn danger' id='btnDietReset'>RESET HOJE</button></div></div>`;

  $('#dietMode').onchange=(e)=>{ d.mode=e.target.value; saveState(); render(); };
  $('#btnEat').onclick=()=>{ openModal('Registro inteligente','< 3s',`<div class='row'><button class='btn primary' data-mode='favoritos'>Favoritos</button><button class='btn' data-mode='peso'>Peso real</button><button class='btn' data-mode='visual'>Estimativa visual</button><button class='btn' data-mode='voz'>Voz</button></div><div id='dietModePanel'></div>`); const panel=()=>modalBody.querySelector('#dietModePanel');
    const bind=(mode)=>{
      if(mode==='favoritos') panel().innerHTML=`<div class='list'>${favoriteList(d).map(f=>`<button class='btn wide' data-fav='${f.name}'>${f.name}</button>`).join('')}</div>`;
      if(mode==='peso') panel().innerHTML=`<div class='row'><select id='foodSel'>${FOOD_DB.map(f=>`<option>${f.name}</option>`).join('')}</select><input id='foodGrams' type='number' value='120' min='10' step='5'/><button class='btn primary' id='addFood'>Registrar</button></div>`;
      if(mode==='visual') panel().innerHTML=`<div class='row'><button class='btn' data-size='pequena'>Pequeno</button><button class='btn' data-size='medio'>Médio</button><button class='btn' data-size='grande'>Grande</button></div>`;
      if(mode==='voz') panel().innerHTML=`<div class='row'><input id='voiceText' placeholder='Comi arroz, feijão e frango'/><button class='btn primary' id='voiceAdd'>Registrar voz</button></div>`;
      panel().querySelectorAll('[data-fav]').forEach(b=>b.onclick=()=>{ const fav=DIET_FAVORITES.find(x=>x.name===b.dataset.fav); const meal=mealFromFoods(fav.name,fav.foods); d.favoritesStats[fav.name]=(d.favoritesStats[fav.name]||0)+1; registerDietEntry(d,meal,'favoritos'); saveState(); closeModal(); render(); });
      const addFood=panel().querySelector('#addFood'); if(addFood) addFood.onclick=()=>{ const f=foodByName(panel().querySelector('#foodSel').value), grams=Number(panel().querySelector('#foodGrams').value||0); if(!f||grams<=0) return; registerDietEntry(d,mealFromFoods(`${f.name} (${grams}g)`,[[f.name,grams]]),'peso'); saveState(); closeModal(); render(); };
      panel().querySelectorAll('[data-size]').forEach(b=>b.onclick=()=>{ registerDietEntry(d,visualEstimate(b.dataset.size),'visual'); saveState(); closeModal(); render(); });
      const voice=panel().querySelector('#voiceAdd'); if(voice) voice.onclick=()=>{ const meal=parseVoice(panel().querySelector('#voiceText').value||''); if(!meal) return showToast('Fale o que comeu'); registerDietEntry(d,meal,'voz'); saveState(); closeModal(); render(); };
    };
    bind('favoritos');
    modalBody.querySelectorAll('[data-mode]').forEach(b=>b.onclick=()=>bind(b.dataset.mode));
  };

  $('#btnWeight').onclick=()=>{ const kg=Number(prompt('Peso atual (kg):', String(S.targets.weightKg||90))); if(!kg||kg<40||kg>250) return showToast('Peso inválido'); d.weights.push({kg,at:new Date().toISOString()}); S.targets.weightKg=kg; setLastAction({type:'dietWeight'}); saveState(); render(); };
  $('#btnRoutine').onclick=()=>{ const steps=Number(prompt('Passos/dia:', String(d.routine.steps||8000))); const awake=Number(prompt('Horas acordado:', String(d.routine.awakeHours||16))); const fatigue=Number(prompt('Fadiga percebida (0-100):', String(d.mental.fatigue||45))); if(steps>0) d.routine.steps=steps; if(awake>0) d.routine.awakeHours=awake; if(fatigue>=0) d.mental.fatigue=Math.max(0,Math.min(100,fatigue)); saveState(); render(); };
  view.querySelectorAll('[data-trigger]').forEach(btn=>btn.onclick=()=>{ applyTrigger(d,btn.dataset.trigger); saveState(); render(); });
  $('#btnDietUndo').onclick=undoLastAction;
  $('#btnDietReset').onclick=()=>{ d.entries=[]; d.triggerMap={fome:0,ansiedade:0,tedio:0,estresse:0,social:0}; adjustIntegrity(-4); saveState(); render(); };
}


function ensureHormonalToday(){
  let h=getTodayObj(S.hormonal.history||[]);
  if(!h){ h={date:todayKey(), sleepHours:7.5, sleepQuality:75, stress:45, sunMin:20, recovery:70, notes:''}; (S.hormonal.history||(S.hormonal.history=[])).push(h); }
  return h;
}

function syncMetabolicSystems(){
  const d=ensureDietToday();
  const h=ensureHormonalToday();
  const targets=calcTargetsAuto();
  const totals=sumDiet(d);
  const micro=micronutrientStatus(totals);
  const z=micro.find(x=>x.k==='zinco')?.pct||0, mg=micro.find(x=>x.k==='magnesio')?.pct||0, vd=micro.find(x=>x.k==='vitD')?.pct||0;
  d.mental.fatigue=Math.round((d.mental.fatigue*0.75) + ((h.stress + (100-h.recovery))/2)*0.25);
  d.routine.awakeHours=Math.max(12,Math.min(19,24-(h.sleepHours||7.5)));
  h.hormonalSignals={deficitPct:Math.round(((targets.tdee-targets.kcal)/Math.max(1,targets.tdee))*100),fatIntake:totals.g,cholIntake:totals.chol,microCore:Math.round((z+mg+vd)/3),trainLoad:targets.signals.treino.volume};
  h.lastSync=new Date().toISOString();
  return {d,h,targets,totals,micro};
}
function rollingRisk(days=3){
  const ds=(S.diet.history||[]).slice(-days);
  const hs=(S.hormonal.history||[]).slice(-days);
  const deficits=ds.map(x=>x.autoTargets ? Math.round(((x.autoTargets.tdee-x.autoTargets.kcal)/Math.max(1,x.autoTargets.tdee))*100) : 0);
  const lowSleep=hs.filter(x=>(x.sleepHours||0)<6.5).length;
  const hardDef=deficits.filter(x=>x>25).length;
  return {hardDef,lowSleep,days,isChronic:(hardDef>=2 || lowSleep>=2)};
}

function lineChartSVG(points,{w=560,h=180,color='#00ff8c',bg='rgba(0,255,140,0.08)',unit='',decimals=0}={}){
  const vals=(points||[]).map(p=>Number(p.v)||0);
  if(!vals.length) return '';
  const min=Math.min(...vals);
  const max=Math.max(...vals);
  const padX=20,padY=20;
  const iw=w-padX*2, ih=h-padY*2;
  const y=(v)=>padY + (max===min?ih/2:((max-v)/(max-min))*ih);
  const x=(i)=>padX + (i/(Math.max(1,vals.length-1)))*iw;
  const pts=points.map((p,i)=>`${x(i).toFixed(1)},${y(p.v).toFixed(1)}`).join(' ');
  const last=points.at(-1);
  const labels=points.map((p,i)=>`<text x='${x(i).toFixed(1)}' y='${h-4}' text-anchor='middle' fill='#9adfbe' font-size='10'>${p.label}</text>`).join('');
  return `<svg viewBox='0 0 ${w} ${h}' class='trend-chart' role='img' aria-label='Gráfico de projeção'>
    <rect x='1' y='1' width='${w-2}' height='${h-2}' rx='12' fill='${bg}' stroke='rgba(0,255,140,.35)'/>
    <polyline fill='none' stroke='${color}' stroke-width='3' points='${pts}'/>
    ${points.map((p,i)=>`<circle cx='${x(i).toFixed(1)}' cy='${y(p.v).toFixed(1)}' r='3.6' fill='${color}'/>`).join('')}
    <text x='${w-12}' y='18' text-anchor='end' fill='${color}' font-size='12'>${(Number(last.v)||0).toFixed(decimals)}${unit}</text>
    ${labels}
  </svg>`;
}

function estimateTestosteroneProjection(t){
  const baseline=Math.max(250,Math.min(1400,Number(S.hormonal?.baselineTotalT)||800));
  const room={
    sleep:((100-t.components.sleepScore)/100)*0.12,
    bodyfat:((100-t.components.bodyfatScore)/100)*0.1,
    stress:((100-t.components.stressScore)/100)*0.08,
    micronutrients:((100-t.components.microScore)/100)*0.07,
    fatAndChol:((100-((t.components.fatScore+t.components.cholScore)/2))/100)*0.05,
    trainingLoad:((100-t.components.loadScore)/100)*0.05,
    energyDeficit:((100-t.components.deficitScore)/100)*0.05
  };
  const estimatedGainPct=Math.max(0, Object.values(room).reduce((a,b)=>a+b,0)*0.7);
  const capPct=baseline>=750?0.16:0.3;
  const target=Math.min(1100, baseline*(1+Math.min(capPct,estimatedGainPct)));
  const steps=[0,1,2,3].map(m=>{
    const adapt=[0,0.55,0.82,1][m];
    return {label:m===0?'Hoje':`M${m}`,v:baseline + (target-baseline)*adapt};
  });
  const certainty=Math.round(Math.max(35,Math.min(85,55 + (t.score-60)*0.35)));
  return {baseline,target,steps,certainty,room};
}

function estimateShapeProjection(d,tp){
  const targets=calcTargetsAuto();
  const weightNow=targets.signals.shape.weightAvg7||targets.signals.shape.weightNow||S.targets.weightKg||90;
  const bfNow=Math.max(4,Math.min(45,d.p7.bf));
  const lbmNow=weightNow*(1-bfNow/100);
  const sessions=(S.training.history||[]).length;
  const tier=sessions<70?'iniciante':sessions<220?'intermediário':'avançado';
  const baseRate=tier==='iniciante'?0.009:tier==='intermediário'?0.006:0.0035; // % do peso/mês
  const readiness=(d.muscleLevel*0.45 + d.t.score*0.3 + d.consistency*0.25)/100;
  const testosteroneBoost=((tp.target-tp.baseline)/Math.max(1,tp.baseline))*0.3;
  const monthlyLeanGain=Math.max(0.08,weightNow*baseRate*(0.55+readiness*0.8+testosteroneBoost));
  const monthlyFatDelta=Math.max(0.15,weightNow*((S.targets?.goal==='cutting'?0.007:0.003)*(0.7+readiness*0.4)));
  const months=[0,1,2,3].map(m=>{
    const lbm=lbmNow + monthlyLeanGain*m;
    const fatMass=Math.max(weightNow*bfNow/100 - monthlyFatDelta*m, weightNow*0.08);
    const weight=lbm+fatMass;
    const bf=(fatMass/Math.max(1,weight))*100;
    return {label:m===0?'Hoje':`M${m}`,lbm,bf,weight,muscleGain:m===0?0:monthlyLeanGain};
  });
  return {tier,monthlyLeanGain,monthlyFatDelta,months};
}

function testosteroneEngine(){
  const {d,h,targets,totals,micro}=syncMetabolicSystems();
  const mBy=(k)=>micro.find(x=>x.k===k)||{pct:0,val:0};
  const treino=targets.signals.treino;
  const bf=targets.signals.shape.bf;
  const deficit=Math.max(0,targets.tdee-targets.kcal);
  const deficitPct=Math.round((deficit/Math.max(1,targets.tdee))*100);
  const sleepScore=Math.max(0,Math.min(100,Math.round((h.sleepHours/8)*60 + (h.sleepQuality/100)*40)));
  const bodyfatScore=bf<7?35:bf>18?45:90;
  const fatScore=Math.max(0,Math.min(100,Math.round((totals.g/Math.max(1,targets.g))*100)));
  const microScore=Math.round((mBy('zinco').pct + mBy('magnesio').pct + mBy('vitD').pct)/3);
  const loadScore=Math.max(0,Math.min(100, Math.round(100 - (treino.volume>28?35:0) - (treino.intensity>0.88?20:0) + (h.recovery>70?8:0))));
  const stressScore=Math.max(0,100-h.stress);
  const deficitScore=deficitPct>28?30:deficitPct>22?55:85;
  const cholScore=Math.max(0,Math.min(100,Math.round((totals.chol/250)*100)));
  const score=Math.round(sleepScore*0.21 + bodyfatScore*0.11 + fatScore*0.13 + microScore*0.18 + loadScore*0.12 + deficitScore*0.1 + stressScore*0.08 + cholScore*0.07);
  const flags=[];
  if(deficitPct>25) flags.push('Déficit agressivo prolongado');
  if(h.sleepHours<6.5 || h.sleepQuality<60) flags.push('Sono insuficiente');
  if(treino.volume>30 || (treino.intensity>0.9 && h.recovery<60)) flags.push('Sinal de overtraining');
  if(bf<7 || bf>18) flags.push('BF fora da faixa hormonal ótima');
  const suggestions=[];
  const idealSleep=`Sono alvo: ${S.windows.sleep} → ${S.windows.wake} (7h30–8h30).`;
  suggestions.push(idealSleep);
  if(h.sunMin<20 || mBy('vitD').pct<70) suggestions.push('Exposição solar diária: 20–30 min no meio do dia.');
  if(totals.g<targets.g) suggestions.push('Aumentar gorduras boas (+10 a +15g), reduzir carbo em mesma caloria.');
  if(treino.volume>28) suggestions.push('Reduzir volume de treino em 15–25% por 1 semana.');
  if(h.recovery<60 || h.stress>65) suggestions.push('Inserir 1 dia extra de recuperação ativa esta semana.');
  if(deficitPct>25) suggestions.push('Preservação hormonal no cutting: subir 100–150 kcal (carbo + gordura).');
  if(totals.chol<220) suggestions.push('Colesterol dietético baixo: incluir ovos/carnes magras no plano.');
  const chronic=rollingRisk(3);
  if(chronic.isChronic) flags.push('Risco crônico (3 dias): déficit/sono comprometido');
  return {score,flags,suggestions,components:{sleepScore,bodyfatScore,fatScore,microScore,loadScore,deficitScore,stressScore,cholScore},deficitPct,totals,targets,micro,h,treino,bf,chronic};
}

function ensureShapeToday(){
  const k=todayKey();
  let sh=(S.shape.history||[]).find(x=>x.date===k);
  if(!sh){
    sh={date:k,sex:'male',age:Math.max(16,Number(S.shape?.age)||25),pollock7:{peitoral:0,axilar:0,triceps:0,subescapular:0,suprailiaca:0,abdominal:0,coxa:0},notes:''};
    if(!S.shape.history) S.shape.history=[];
    S.shape.history.push(sh);
  }
  return sh;
}
function pollock7BodyFat(mm, age, sex='male'){
  const vals=Object.values(mm||{}).map(v=>Math.max(0,Number(v)||0));
  const sum=vals.reduce((a,b)=>a+b,0);
  const A=Math.max(16, Number(age)||25);
  const density = sex==='female'
    ? 1.097 - (0.00046971*sum) + (0.00000056*(sum**2)) - (0.00012828*A)
    : 1.112 - (0.00043499*sum) + (0.00000055*(sum**2)) - (0.00028826*A);
  const bf=Math.max(3,Math.min(65,(495/Math.max(0.9,density))-450));
  return {sum:Math.round(sum*10)/10,density,bf:Math.round(bf*10)/10};
}
function shapeIntelligence(){
  const sh=ensureShapeToday();
  const p7=pollock7BodyFat(sh.pollock7, sh.age, sh.sex);
  const t=testosteroneEngine();
  const a=trainingAnalytics();
  const d=ensureDietToday();
  const weekSets=S.training.history.filter(x=>x.date>=todayKey(new Date(Date.now()-6*86400000))).length;
  const consistency=Math.round((todayProgress().pct*0.5)+Math.min(100,weekSets*4));
  const nutrQuality=Math.round(Math.max(0,Math.min(100, 100-(d.mental?.fatigue||45)*0.45 + Math.min(30,(d.entries||[]).length*3))));
  const muscleLevel=Math.round(Math.max(1,Math.min(100, a.hyper*0.45 + a.stimulus*0.25 + t.score*0.2 + consistency*0.1 )));
  const status = p7.bf<9 ? 'SHREDDED' : p7.bf<13 ? 'ATLÉTICO' : p7.bf<18 ? 'FIT' : p7.bf<24 ? 'EM RECOMPOSIÇÃO' : 'CUTTING PRIORITÁRIO';
  const shapeScore=Math.round(Math.max(1,Math.min(100, (100-Math.min(55,p7.bf*2))*0.35 + muscleLevel*0.4 + t.score*0.15 + nutrQuality*0.1 )));
  const avatar={
    shoulder:Math.max(34,Math.min(68, 36 + muscleLevel*0.26 - p7.bf*0.15)),
    waist:Math.max(26,Math.min(62, 58 - muscleLevel*0.18 + p7.bf*0.28)),
    glow:Math.max(0.25,Math.min(1, shapeScore/100)),
    definition:Math.max(0.15,Math.min(0.95, (muscleLevel/100)-(p7.bf/100)*0.35 + 0.25 ))
  };
  const ideas=[];
  if(p7.bf>16) ideas.push('Aplicar mini-cut de 14 dias: -250 kcal e +2k passos/dia.');
  if(muscleLevel<60) ideas.push('Adicionar bloco de especialização (2 grupos fracos) por 4 semanas.');
  if(t.score<65) ideas.push('Priorizar sono 7h30+ e reduzir volume 20% por 1 semana para proteger hormônios.');
  if(a.plateau) ideas.push('Trocar estímulo principal: exercício base com variação de rep range 6-10 → 10-15.');
  if(!ideas.length) ideas.push('Shape em boa trajetória: mantenha progressão de carga e avaliação semanal Pollock 7.');
  return {sh,p7,t,a,muscleLevel,shapeScore,status,consistency,nutrQuality,avatar,ideas};
}
function shapeAvatarSVG(v){
  return `<svg viewBox='0 0 220 260' class='shape-avatar-svg' role='img' aria-label='Avatar IA de shape'>
    <defs>
      <linearGradient id='gBody' x1='0' x2='1'>
        <stop offset='0%' stop-color='rgba(0,255,140,${(0.3+v.glow*0.4).toFixed(2)})'/>
        <stop offset='100%' stop-color='rgba(90,110,255,${(0.2+v.glow*0.35).toFixed(2)})'/>
      </linearGradient>
      <filter id='fGlow'><feGaussianBlur stdDeviation='4' result='b'/><feMerge><feMergeNode in='b'/><feMergeNode in='SourceGraphic'/></feMerge></filter>
    </defs>
    <circle cx='110' cy='30' r='18' fill='url(#gBody)' filter='url(#fGlow)'/>
    <path d='M ${110-v.shoulder/2} 70 Q 110 52 ${110+v.shoulder/2} 70 L ${110+v.waist/2} 180 Q 110 205 ${110-v.waist/2} 180 Z' fill='url(#gBody)' stroke='rgba(0,255,140,0.9)' stroke-width='2'/>
    <line x1='95' y1='95' x2='95' y2='170' stroke='rgba(255,255,255,${v.definition.toFixed(2)})' stroke-width='2'/>
    <line x1='110' y1='90' x2='110' y2='175' stroke='rgba(255,255,255,${(v.definition*0.8).toFixed(2)})' stroke-width='2'/>
    <line x1='125' y1='95' x2='125' y2='170' stroke='rgba(255,255,255,${(v.definition*0.9).toFixed(2)})' stroke-width='2'/>
    <line x1='${110-v.shoulder/2}' y1='80' x2='${70-v.waist/10}' y2='145' stroke='rgba(0,255,140,0.8)' stroke-width='8' stroke-linecap='round'/>
    <line x1='${110+v.shoulder/2}' y1='80' x2='${150+v.waist/10}' y2='145' stroke='rgba(0,255,140,0.8)' stroke-width='8' stroke-linecap='round'/>
    <line x1='96' y1='180' x2='86' y2='245' stroke='rgba(0,255,140,0.8)' stroke-width='10' stroke-linecap='round'/>
    <line x1='124' y1='180' x2='134' y2='245' stroke='rgba(0,255,140,0.8)' stroke-width='10' stroke-linecap='round'/>
  </svg>`;
}
function viewShape(){
  const d=shapeIntelligence();
  const tProj=estimateTestosteroneProjection(d.t);
  const sProj=estimateShapeProjection(d,tProj);
  const p=d.sh.pollock7;
  const shapeLine=sProj.months.map((m)=>({label:m.label,v:m.weight}));
  const bfLine=sProj.months.map((m)=>({label:m.label,v:m.bf}));
  view.innerHTML=`
  <div class='card'><div class='kpi'><div><h2>SHAPE INTELIGENTE</h2><div class='small'>DIETA ↔ TREINO ↔ TESTO ↔ RECUPERAÇÃO</div></div><span class='badge'>Score ${d.shapeScore}/100</span></div><div class='progress'><div style='width:${d.shapeScore}%'></div></div><div class='hint'>Status atual: ${d.status} • Nível muscular ${d.muscleLevel}/100</div></div>
  <div class='card'><div class='grid'>
    <div class='g6'><h2>Avatar IA do shape</h2><div class='shape-avatar'>${shapeAvatarSVG(d.avatar)}</div><div class='hint'>Render paramétrico com base em BF, nível muscular e recuperação.</div></div>
    <div class='g6'><h2>Status integrado</h2>
      <div class='item'><div><div class='name'>Body Fat (Pollock 7)</div><div class='meta'>Soma das dobras: ${d.p7.sum} mm</div></div><span class='badge'>${d.p7.bf}%</span></div>
      <div class='item'><div><div class='name'>Testo Engine</div><div class='meta'>Preservação hormonal</div></div><span class='badge'>${d.t.score}</span></div>
      <div class='item'><div><div class='name'>Hypertrophy Potential</div><div class='meta'>Motor de treino</div></div><span class='badge'>${d.a.hyper}</span></div>
      <div class='item'><div><div class='name'>Consistência 7 dias</div><div class='meta'>Ações concluídas + sets</div></div><span class='badge'>${d.consistency}</span></div>
      <div class='item'><div><div class='name'>Qualidade nutricional</div><div class='meta'>Entradas alimentares e fadiga</div></div><span class='badge'>${d.nutrQuality}</span></div>
    </div>
  </div></div>
  <div class='card'><h2>Projeção do shape (1-3 meses)</h2>
    <div class='small'>Potencial de ganho magro estimado: <b>${sProj.monthlyLeanGain.toFixed(2)} kg/mês</b> • redução de gordura estimada: ${sProj.monthlyFatDelta.toFixed(2)} kg/mês • nível ${sProj.tier}.</div>
    <div class='trend-wrap'>${lineChartSVG(shapeLine,{unit:'kg',decimals:1,color:'#00ff8c'})}</div>
    <div class='trend-wrap'>${lineChartSVG(bfLine,{unit:'%',decimals:1,color:'#5fb4ff',bg:'rgba(95,180,255,.08)'})}</div>
    <div class='hint'>Modelo fisiológico simplificado para naturais: combina consistência, estímulo, recuperação, BF e ambiente hormonal (estimativa, não diagnóstico).</div>
  </div>
  <div class='card'><h2>Pollock 7 dobras (Jackson & Pollock)</h2>
    <div class='grid'>
      <div class='g6'><label>Sexo biológico</label><select id='shapeSex'><option value='male'>Masculino</option><option value='female'>Feminino</option></select></div>
      <div class='g6'><label>Idade</label><input id='shapeAge' type='number' min='16' max='80' value='${d.sh.age}'></div>
      <div class='g6'><label>Peitoral (mm)</label><input id='p_peitoral' type='number' min='0' max='60' value='${p.peitoral}'></div>
      <div class='g6'><label>Axilar média (mm)</label><input id='p_axilar' type='number' min='0' max='60' value='${p.axilar}'></div>
      <div class='g6'><label>Tríceps (mm)</label><input id='p_triceps' type='number' min='0' max='60' value='${p.triceps}'></div>
      <div class='g6'><label>Subescapular (mm)</label><input id='p_subescapular' type='number' min='0' max='60' value='${p.subescapular}'></div>
      <div class='g6'><label>Supra-ilíaca (mm)</label><input id='p_suprailiaca' type='number' min='0' max='60' value='${p.suprailiaca}'></div>
      <div class='g6'><label>Abdominal (mm)</label><input id='p_abdominal' type='number' min='0' max='60' value='${p.abdominal}'></div>
      <div class='g6'><label>Coxa (mm)</label><input id='p_coxa' type='number' min='0' max='60' value='${p.coxa}'></div>
    </div>
    <div class='row'><button class='btn primary' id='btnShapeSave'>Salvar medição</button><button class='btn' id='btnShapeSyncTarget'>Usar BF no app</button></div>
    <div class='hint'>A medição alimenta metas do cutting, motor hormonal e recomendações de treino automaticamente.</div>
  </div>
  <div class='card'><h2>Ideias criativas para próxima semana</h2><div class='list'>${d.ideas.map(i=>`<div class='item'><div class='meta'>${i}</div></div>`).join('')}</div></div>`;
  $('#shapeSex').value=d.sh.sex;
  $('#btnShapeSave').onclick=()=>{
    d.sh.sex=$('#shapeSex').value;
    d.sh.age=Math.max(16,Number($('#shapeAge').value)||25);
    d.sh.pollock7={
      peitoral:Number($('#p_peitoral').value)||0,
      axilar:Number($('#p_axilar').value)||0,
      triceps:Number($('#p_triceps').value)||0,
      subescapular:Number($('#p_subescapular').value)||0,
      suprailiaca:Number($('#p_suprailiaca').value)||0,
      abdominal:Number($('#p_abdominal').value)||0,
      coxa:Number($('#p_coxa').value)||0
    };
    S.shape.age=d.sh.age;
    saveState();
    addXP(28,'train');
    showToast('Medição de shape salva e integrada.');
    render();
  };
  $('#btnShapeSyncTarget').onclick=()=>{
    const now=pollock7BodyFat(d.sh.pollock7,d.sh.age,d.sh.sex);
    S.targets.bfPct=now.bf;
    saveState();
    showToast('BF sincronizado com metas globais.');
    render();
  };
}

function viewTestosterona(){
  const h=ensureHormonalToday();
  const t=testosteroneEngine();
  const proj=estimateTestosteroneProjection(t);
  const critical=['zinco','magnesio','vitD'];
  const microCritical=t.micro.filter(x=>critical.includes(x.k));
  const status=t.score>=80?'✅ Ambiente hormonal forte':t.score>=60?'⚠ Preservação parcial':'❌ Risco hormonal';
  const chart=lineChartSVG(proj.steps,{unit:' ng/dL',decimals:0,color:'#00ff8c'});
  const factorOrder=Object.entries(proj.room).sort((a,b)=>b[1]-a[1]);
  view.innerHTML=`
  <div class='card'><div class='kpi'><div><h2>TESTOSTERONA NATURAL</h2><div class='small'>Integração DIETA + TREINO + SONO + ROTINA</div></div><span class='badge'>Score ${t.score}/100</span></div><div class='progress'><div style='width:${t.score}%'></div></div><div class='hint'>${status}</div></div>
  <div class='card'><h2>Estimativa personalizada (base científica)</h2>
    <div class='grid'>
      <div class='g6'><label>Testosterona total atual (ng/dL)</label><input id='baseTInput' type='number' min='250' max='1400' value='${Math.round(proj.baseline)}'></div>
      <div class='g6'><div class='item'><div><div class='name'>Potencial natural estimado</div><div class='meta'>janela de 3 meses com otimização de hábitos</div></div><span class='badge'>${Math.round(proj.target)} ng/dL</span></div><div class='hint'>Confiança estimada do modelo: ${proj.certainty}%.</div></div>
    </div>
    <div class='trend-wrap'>${chart}</div>
    <div class='small'>Com baseline alto (ex.: 800 ng/dL mesmo sob estresse), o espaço fisiológico tende a ser menor; foco principal vira manutenção alta + melhora de performance/recuperação.</div>
  </div>
  <div class='card'><h2>Monitoramento endocrinológico</h2><div class='small'>Sono: ${h.sleepHours}h • qualidade ${h.sleepQuality}% • BF ${t.bf}% • gordura dieta ${t.totals.g}g</div><div class='small'>Micros críticos: Zinco ${Math.round((microCritical.find(x=>x.k==='zinco')||{pct:0}).pct)}% • Magnésio ${Math.round((microCritical.find(x=>x.k==='magnesio')||{pct:0}).pct)}% • Vit D ${Math.round((microCritical.find(x=>x.k==='vitD')||{pct:0}).pct)}%</div><div class='small'>Colesterol dieta: ${t.totals.chol}mg • Treino: volume ${t.treino.volume} • intensidade ${Math.round(t.treino.intensity*100)}% • déficit ${t.deficitPct}%</div></div>
  <div class='card'><h2>Fatores que mais movem sua testosterona (prioridade)</h2><div class='list'>${factorOrder.map(([k,v])=>`<div class='item'><div><div class='name'>${({sleep:'Sono',bodyfat:'Composição corporal (BF)',stress:'Estresse/ansiedade',micronutrients:'Micronutrientes (Zn/Mg/VitD)',fatAndChol:'Gorduras + colesterol dieta',trainingLoad:'Carga de treino/recuperação',energyDeficit:'Déficit calórico'}[k])}</div><div class='meta'>impacto potencial relativo</div></div><span class='badge'>${Math.round(v*100)}%</span></div>`).join('')}</div></div>
  <div class='card'><h2>Faixas de efeito com suporte em estudos</h2><div class='list'>
    <div class='item'><div><div class='name'>Sono</div><div class='meta'>Restrição de sono reduz testosterona; normalizar 7h30–8h30 ajuda a recuperar níveis.</div></div><span class='badge'>~5–15%</span></div>
    <div class='item'><div><div class='name'>BF e composição corporal</div><div class='meta'>Excesso de gordura piora ambiente androgênico; recomposição melhora eixo hormonal.</div></div><span class='badge'>~5–20%</span></div>
    <div class='item'><div><div class='name'>Treino e recuperação</div><div class='meta'>Força/hipertrofia com volume recuperável sustenta testosterona melhor que excesso crônico.</div></div><span class='badge'>~3–10%</span></div>
    <div class='item'><div><div class='name'>Energia/micronutrientes</div><div class='meta'>Déficit agressivo e baixa ingestão de zinco/magnésio/vit D podem derrubar score hormonal.</div></div><span class='badge'>~3–12%</span></div>
  </div><div class='hint'>Faixas populacionais para orientação prática (não substitui exame/laboratório).</div></div>
  <div class='card'><h2>Detecção automática</h2><div class='list'>${(t.flags.length?t.flags:['Sem alertas críticos']).map(f=>`<div class='item'><div class='name'>${f}</div></div>`).join('')}</div></div>
  <div class='card'><h2>Ajustes automáticos (evidência: ISSN/Helms/Schoenfeld/Hackney)</h2><div class='list'>${t.suggestions.map(s=>`<div class='item'><div class='meta'>${s}</div></div>`).join('')}</div></div>
  <div class='card'><h2>Integração com Cutting</h2><div class='small'>Objetivo: preservar testosterona durante perda de gordura e manter performance/massa magra.</div><div class='small'>Se score < 60 por 3 dias: priorizar recovery + ajustar déficit + revisar volume.</div></div>
  <div class='card'><h2>Sincronia dos módulos</h2><div class='small'>Última sincronização: ${t.h.lastSync?new Date(t.h.lastSync).toLocaleString('pt-BR'):'agora'} • risco crônico 3d: ${t.chronic.isChronic?'ALTO':'controlado'}.</div><div class='small'>DIETA↔TREINO↔SONO↔ROTINA↔MENTAL recalculados automaticamente a cada abertura.</div></div>
  <div class='card'><div class='row'><button class='btn' id='btnHormonalLog'>Atualizar sono/estresse</button><button class='btn' id='btnHormonalApply'>Aplicar ajustes sugeridos</button></div></div>`;
  $('#btnHormonalLog').onclick=()=>{
    const sh=Number(prompt('Horas de sono:', String(h.sleepHours)));
    const sq=Number(prompt('Qualidade do sono (0-100):', String(h.sleepQuality)));
    const st=Number(prompt('Estresse percebido (0-100):', String(h.stress)));
    const sm=Number(prompt('Exposição solar (min):', String(h.sunMin)));
    const rc=Number(prompt('Recuperação (0-100):', String(h.recovery)));
    if(sh>0) h.sleepHours=sh; if(sq>=0) h.sleepQuality=Math.max(0,Math.min(100,sq)); if(st>=0) h.stress=Math.max(0,Math.min(100,st)); if(sm>=0) h.sunMin=sm; if(rc>=0) h.recovery=Math.max(0,Math.min(100,rc));
    saveState(); render();
  };
  $('#baseTInput').onchange=(e)=>{ S.hormonal.baselineTotalT=Math.max(250,Math.min(1400,Number(e.target.value)||800)); saveState(); render(); };
  $('#btnHormonalApply').onclick=()=>{
    const d=ensureDietToday();
    if(t.deficitPct>25) d.mode='cutting';
    if(t.deficitPct>25) d.autoTargets.kcal=Math.round(d.autoTargets.kcal+120);
    if(t.totals.g<t.targets.g) d.autoTargets.g=Math.round(d.autoTargets.g+10);
    if(t.treino.volume>28) S.training.program.week=Math.max(1,(S.training.program.week||1)-1);
    h.recovery=Math.min(100,h.recovery+8);
    adjustIntegrity(+1);
    saveState();
    render();
  };
}

function getProgramAndDay(){
  const track=S.training.program.track||'home';
  const prog=TRAINING_PROGRAMS[track];
  const dayKey=S.training.program.dayKey && prog.days[S.training.program.dayKey] ? S.training.program.dayKey : prog.split[0];
  return {track,prog,dayKey,exercises:prog.days[dayKey]||[]};
}
function tempoToSec(tempo){ return String(tempo).split('-').map((n)=>Number(n)||0).reduce((a,b)=>a+b,0); }
function fmtTimerSec(sec){ const s=Math.max(0,Math.floor(sec)); const m=Math.floor(s/60); return `${String(m).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`; }
function mentorSpeak(text){
  if(!S.sounds.enabled || !('speechSynthesis' in window)) return;
  try{
    const u=new SpeechSynthesisUtterance(text);
    u.lang='pt-BR';
    u.rate=1;
    u.pitch=1;
    speechSynthesis.cancel();
    speechSynthesis.speak(u);
  }catch{}
}
function startWorkoutTimer(sec, mode, opts={}){
  const onEnd=opts.onEnd||null;
  workoutTimer={running:true,mode,left:sec,total:sec,startedAt:Date.now(),paused:false,warned10:false};
  beep(mode==='exec'?980:620,.08,.1);
  mentorSpeak(mode==='exec' ? 'Iniciando execução da série. Controle total.' : 'Iniciando descanso. Respire e prepare a próxima série.');
  clearInterval(workoutInterval);
  workoutInterval=setInterval(()=>{
    if(!workoutTimer.running||workoutTimer.paused) return;
    workoutTimer.left=Math.max(0, workoutTimer.total - Math.floor((Date.now()-workoutTimer.startedAt)/1000));
    const el=$('#workTimerBig'); const state=$('#workTimerState');
    if(el) el.textContent=fmtTimerSec(workoutTimer.left);
    if(state) state.textContent=workoutTimer.mode==='exec'?'EXECUÇÃO':'DESCANSO';

    if(workoutTimer.left===10 && !workoutTimer.warned10){
      workoutTimer.warned10=true;
      beep(1400,.06,.11);
      mentorSpeak('Faltam dez segundos.');
      showToast('⚠️ 10 segundos restantes');
    }

    if(workoutTimer.left<=0){
      workoutTimer.running=false;
      clearInterval(workoutInterval);
      beep(mode==='exec'?1300:1100,.09,.12);
      mentorSpeak(mode==='exec' ? 'Execução finalizada. Inicie descanso.' : 'Descanso finalizado. Próxima série.');
      showToast(mode==='exec'?'Execução finalizada':'Descanso finalizado');
      if(typeof onEnd==='function') onEnd();
    }
  }, 1000);
}
function pauseWorkoutTimer(){
  if(!workoutTimer.running) return;
  if(workoutTimer.paused){
    workoutTimer.paused=false;
    workoutTimer.startedAt = Date.now() - (workoutTimer.total-workoutTimer.left)*1000;
    mentorSpeak('Timer retomado.');
  } else {
    workoutTimer.paused=true;
    mentorSpeak('Timer pausado.');
  }
}
function stopWorkoutTimer(){
  workoutTimer.running=false;
  clearInterval(workoutInterval);
  workoutTimer.left=0;
  const el=$('#workTimerBig');
  if(el) el.textContent='00:00';
  mentorSpeak('Timer encerrado.');
}
function currentProgramExercise(){
  const {exercises}=getProgramAndDay();
  const ses=S.training.program.session;
  if(!ses || !ses.active) return null;
  const ex=exercises[ses.exIndex];
  if(!ex) return null;
  return ex;
}
function advanceProgramSet(){
  const ses=S.training.program.session; if(!ses||!ses.active) return;
  const {exercises}=getProgramAndDay();
  const ex=exercises[ses.exIndex];
  if(!ex) return;
  if(ses.setNo < ex.sets){ ses.setNo += 1; }
  else { ses.exIndex += 1; ses.setNo = 1; }
  if(ses.exIndex >= exercises.length){
    ses.active=false;
    addXP(120,'train');
    adjustIntegrity(+3);
    showToast('Treino programado concluído');
  }
  saveState();
}

function estimate1RM(load,reps){ if(!load||!reps) return 0; return Math.round(load*(1+reps/30)); }
function trainingAnalytics(){
  const k=todayKey();
  const last30=S.training.history.slice(-120);
  const daySets=S.training.history.filter(x=>x.date===k);
  const avgRpe=8.2;
  const perfTrend = last30.length>8 ? (last30.slice(-4).reduce((a,x)=>a+(x.sets?.[0]?.reps||0),0) / Math.max(1,last30.slice(-8,-4).reduce((a,x)=>a+(x.sets?.[0]?.reps||0),0))) : 1;
  const sleepOnTime = nowMin() <= hmToMin(S.windows.sleep)+30 ? 1 : 0.6;
  const mood=(S.diary.history.find(x=>x.date===k)?.mood||3)/5;
  const energy=(S.diary.history.find(x=>x.date===k)?.energy||3)/5;
  const fatigue = Math.round(Math.max(0,Math.min(100, 35 + (avgRpe*6) + (daySets.length*2) - (sleepOnTime*18) - (energy*10))));
  const readiness = Math.round(Math.max(0,Math.min(100, 100-fatigue + mood*8 + sleepOnTime*10)));
  const stimulus = Math.round(Math.max(0,Math.min(100, daySets.length*7 + (perfTrend>=1?18:8) + (S.training.naturalMode?10:0))));
  const hyper = Math.round(Math.max(0,Math.min(100, stimulus - Math.abs(daySets.length-16)*2 + 20)));
  const neural = Math.round(Math.max(0,Math.min(100, (S.training.program.week>=4?65:52) + (perfTrend>=1?8:-6))));
  const globalPerf = Math.round((todayProgress().pct*0.25) + (readiness*0.25) + (stimulus*0.25) + (Math.min(100,S.rpg.integrity)*0.25));

  const byMuscle={};
  for(const e of daySets){ byMuscle[e.group]=(byMuscle[e.group]||0)+1; }
  const lowMuscles = Object.keys(byMuscle).filter(m=>byMuscle[m]<3);
  const highFatigue = fatigue>=72;
  const plateau = perfTrend<0.92 && daySets.length>=8;

  return {fatigue,readiness,stimulus,hyper,neural,globalPerf,byMuscle,lowMuscles,highFatigue,plateau,perfTrend};
}
function trainingIntelligenceHTML(a){
  const muscleRows = Object.keys(a.byMuscle).length ? Object.entries(a.byMuscle).map(([m,v])=>`<div class='item'><div><div class='name'>${m}</div><div class='meta'>Volume semanal estimado</div></div><span class='badge'>${v} sets</span></div>`).join('') : '<div class="hint">Sem dados de volume ainda.</div>';
  return `<div class='card'><h2>AI Training Engine</h2>
  <div class='grid'>
    <div class='g6'><div class='item'><div><div class='name'>Stimulus Efficiency Score</div><div class='meta'>Estímulo vs fadiga</div></div><span class='badge'>${a.stimulus}</span></div></div>
    <div class='g6'><div class='item'><div><div class='name'>Fatigue Index</div><div class='meta'>Performance + sono + humor + volume</div></div><span class='badge'>${a.fatigue}</span></div></div>
    <div class='g6'><div class='item'><div><div class='name'>Recovery Readiness</div><div class='meta'>Pronto para intensidade</div></div><span class='badge'>${a.readiness}</span></div></div>
    <div class='g6'><div class='item'><div><div class='name'>Hypertrophy Potential</div><div class='meta'>Proximidade de MAV natural</div></div><span class='badge'>${a.hyper}</span></div></div>
    <div class='g6'><div class='item'><div><div class='name'>Neural Drive</div><div class='meta'>Força e drive neural</div></div><span class='badge'>${a.neural}</span></div></div>
    <div class='g6'><div class='item'><div><div class='name'>Performance Global Score</div><div class='meta'>Treino + foco + disciplina + sono</div></div><span class='badge'>${a.globalPerf}</span></div></div>
  </div>
  <div class='row'>
    <button class='btn' id='btnRunAiAdjust'>RODAR AJUSTE SEMANAL</button>
    <button class='btn' id='btnSuggestSwap'>SUGERIR TROCA EXERCÍCIOS</button>
  </div>
  <div class='hint' id='aiDecision'>MEV/MAV/MRV dinâmico: aguardando análise.</div>
  </div>
  <div class='card'><h2>Digital Muscle Map</h2><div class='list'>${muscleRows}</div>
  <div class='hint'>Subestimulados: ${a.lowMuscles.length?a.lowMuscles.join(', '):'nenhum crítico'} • Fadiga alta: ${a.highFatigue?'SIM':'NÃO'}</div>
  </div>
  <div class='card'><h2>Adaptive Deload System</h2>
    <div class='hint'>Regra: se performance cair >8% por 2 sessões ou fadiga >72 → reduzir volume 35% por 1 semana.</div>
    <div class='row'><button class='btn' id='btnApplyDeload'>APLICAR DELOAD ADAPTATIVO</button></div>
  </div>
  <div class='card'><h2>Simulador de Progresso</h2>
    <div class='hint'>Estimativa natural baseada em consistência e volume atual.</div>
    <div class='item'><div><div class='name'>3 meses</div><div class='meta'>Massa +0.8 a +2.0kg (se consistência >80%)</div></div><span class='badge'>Projeção</span></div>
    <div class='item'><div><div class='name'>6 meses</div><div class='meta'>Massa +1.8 a +4.0kg • Força +8–18%</div></div><span class='badge'>Projeção</span></div>
    <div class='item'><div><div class='name'>12 meses</div><div class='meta'>Massa +3.5 a +7kg • Força +15–35%</div></div><span class='badge'>Projeção</span></div>
  </div>`;
}
function viewTreino(){
  const env=S.training.environment, lib=env==='home'?HOME_WORKOUT:GYM_WORKOUT, k=todayKey(), today=S.training.history.filter(x=>x.date===k);
  const {track,prog,dayKey,exercises}=getProgramAndDay();
  if(!S.training.program.session) S.training.program.session={active:false,exIndex:0,setNo:1};
  const session=S.training.program.session;
  const exNow=currentProgramExercise();
  const week=S.training.program.week||1;
  const phaseTxt = week<=3 ? 'Base (RPE 7.5–8.5)' : week===4 ? 'Intensificação (RPE 9)' : week===5 ? 'Deload (50%)' : 'Bloco pesado';

  view.innerHTML=`<div class='card'><div class='kpi'><div><div class='big'>Treino Programado</div><div class='small'>${prog.label} • ${prog.weekly}</div></div><button class='btn' id='btnEnv'>TROCAR AMBIENTE</button></div>
  <div class='grid'>
    <div class='g6'><label>Plano</label><select id='trainTrack'><option value='home'>Casa</option><option value='gym'>Academia</option></select></div>
    <div class='g6'><label>Dia do treino</label><select id='trainDay'>${prog.split.map((d)=>`<option value='${d}'>${d}</option>`).join('')}</select></div>
    <div class='g6'><label>Semana do bloco (1-8)</label><input id='trainWeek' type='range' min='1' max='8' step='1' value='${week}'></div>
    <div class='g6'><label>Fase atual</label><input value='${phaseTxt}' disabled></div>
  </div>
  <div class='hint'>Periodização: ${prog.periodization}</div>
  <div class='row'><button class='btn primary' id='btnStartProgram'>INICIAR SESSÃO PROGRAMADA</button><button class='btn' id='btnResetProgram'>RESETAR SESSÃO</button></div>
  </div>

  <div class='card'><h2>Plano do dia (${dayKey})</h2><div class='list'>${exercises.map((e,i)=>`<div class='item'><div><div class='name'>${i+1}. ${e.name}</div><div class='meta'>${e.sets}x${e.reps} • RPE ${e.rpe} • tempo ${e.tempo} • descanso ${Math.round(e.rest/60)}-${e.rest%60?':30':''} min<br>${e.tip}</div></div><span class='badge'>${e.sets} sets</span></div>`).join('')}</div></div>

  <div class='card'><h2>Runner da sessão</h2>
    <div class='kpi'><div><div class='big'>${session.active && exNow ? exNow.name : 'Sessão parada'}</div><div class='small'>${session.active && exNow ? `Exercício ${session.exIndex+1}/${exercises.length} • Série ${session.setNo}/${exNow.sets}` : 'Inicie para executar com timers em segundos.'}</div></div><span class='badge' id='workTimerState'>${workoutTimer.mode==='rest'?'DESCANSO':'EXECUÇÃO'}</span></div>
    <div class='big' id='workTimerBig'>${fmtTimerSec(workoutTimer.left||0)}</div>
    <div class='grid'>
      <div class='g6'><label>Reps realizadas</label><input id='doneReps' type='number' min='1' max='40' value='${exNow?String(exNow.reps).split('-')[0]:'8'}'></div>
      <div class='g6'><label>Carga (kg)</label><input id='doneLoad' type='number' min='0' max='300' step='0.5' value='0'></div>
    </div>
    <div class='row'>
      <button class='btn primary' id='btnExecTimer'>INICIAR EXECUÇÃO</button>
      <button class='btn' id='btnRestTimer'>INICIAR DESCANSO</button>
      <button class='btn' id='btnPauseWorkTimer'>PAUSAR/RETOMAR</button>
      <button class='btn danger' id='btnStopWorkTimer'>PARAR TIMER</button>
      <button class='btn primary' id='btnConcluirSerie'>CONCLUIR SÉRIE</button>
      <button class='btn' id='btnAutoSerie'>GUIA AUTO (EXEC→REST)</button>
    </div>
  </div>

  <div class='card'><h2>Registro rápido manual</h2><div class='kpi'><div><div class='big'>Treino manual</div><div class='small'>Ambiente: ${env==='home'?'Casa':'Academia'} • sets hoje: ${today.length}</div></div></div><div class='grid'><div class='g6'><label>Grupo</label><select id='selGroup'>${Object.keys(lib).map(g=>`<option>${g}</option>`).join('')}</select></div><div class='g6'><label>Exercício</label><select id='selEx'></select></div><div class='g6'><label>Reps</label><select id='selReps'><option>5</option><option>8</option><option>10</option><option>12</option><option>15</option></select></div><div class='g6'><label>Carga</label><select id='selLoad'><option>0</option><option>5</option><option>10</option><option>15</option><option>20</option><option>30</option><option>40</option></select></div><div class='g12'><button class='btn primary wide' id='btnAddSet'>REGISTRAR 1 SET</button></div></div></div>

  <div class='card'><h2>Sets de hoje</h2><div class='list'>${today.length?today.map((x,i)=>`<div class='item'><div><div class='name'>${x.group} • ${x.exercise}</div><div class='meta'>${x.sets[0].reps} reps • ${x.sets[0].load}kg</div></div><span class='badge'>#${i+1}</span></div>`).join(''):'<div class="hint">Nenhum set.</div>'}</div><div class='row'><button class='btn' id='btnTrainUndo'>DESFAZER</button><button class='btn danger' id='btnTrainReset'>RESET HOJE</button></div></div>`;

  $('#trainTrack').value=track;
  $('#trainDay').value=dayKey;
  $('#trainTrack').onchange=(e)=>{ S.training.program.track=e.target.value; const np=TRAINING_PROGRAMS[e.target.value]; S.training.program.dayKey=np.split[0]; S.training.environment=e.target.value; saveState(); render(); };
  $('#trainDay').onchange=(e)=>{ S.training.program.dayKey=e.target.value; saveState(); render(); };
  $('#trainWeek').oninput=(e)=>{ S.training.program.week=Number(e.target.value); saveState(); render(); };
  $('#btnStartProgram').onclick=()=>{ S.training.program.session={active:true,exIndex:0,setNo:1}; saveState(); showToast('Sessão iniciada'); render(); };
  $('#btnResetProgram').onclick=()=>{ S.training.program.session={active:false,exIndex:0,setNo:1}; stopWorkoutTimer(); saveState(); render(); };

  $('#btnExecTimer').onclick=()=>{ const ex=currentProgramExercise(); if(!ex) return showToast('Inicie sessão'); const execSec=Math.max(1,tempoToSec(ex.tempo)*Number(ex.reps.split('-')[0]||8)); startWorkoutTimer(execSec,'exec'); };
  $('#btnRestTimer').onclick=()=>{ const ex=currentProgramExercise(); if(!ex) return showToast('Inicie sessão'); startWorkoutTimer(ex.rest,'rest'); };
  $('#btnAutoSerie').onclick=()=>{ const ex=currentProgramExercise(); if(!ex) return showToast('Inicie sessão'); const execSec=Math.max(1,tempoToSec(ex.tempo)*Number(ex.reps.split('-')[0]||8)); startWorkoutTimer(execSec,'exec',{onEnd:()=>startWorkoutTimer(ex.rest,'rest')}); };
  $('#btnPauseWorkTimer').onclick=pauseWorkoutTimer;
  $('#btnStopWorkTimer').onclick=()=>{ stopWorkoutTimer(); showToast('Timer parado'); };
  $('#btnConcluirSerie').onclick=()=>{
    const ex=currentProgramExercise();
    if(!ex) return showToast('Sem sessão ativa');
    const reps=Number($('#doneReps').value||0);
    const load=Number($('#doneLoad').value||0);
    const entry={date:k, group:dayKey, exercise:ex.name, sets:[{reps,load}], note:`RPE ${ex.rpe} • tempo ${ex.tempo}`};
    S.training.history.push(entry);
    setLastAction({type:'trainSet',entry});
    addXP(24,'train');
    adjustIntegrity(+1);
    advanceProgramSet();
    saveState();
    render();
  };

  const ai=trainingAnalytics();
  view.insertAdjacentHTML('beforeend', trainingIntelligenceHTML(ai));
  $('#btnRunAiAdjust').onclick=()=>{
    const a=trainingAnalytics();
    let msg='Sem ajuste necessário.';
    if(a.highFatigue || a.plateau){
      msg='Ajuste aplicado: -35% volume por 7 dias + manter intensidade em RPE 7-8.';
      S.training.program.week=Math.min(8, (S.training.program.week||1)+1);
      adjustIntegrity(+1);
      addXP(12,'train');
    } else if(a.stimulus<55){
      msg='Ajuste aplicado: +1 série nos principais e microloading de +1kg.';
      addXP(10,'train');
    }
    saveState();
    $('#aiDecision').textContent=msg;
    mentorSpeak(msg);
    showToast('AI Engine atualizou o bloco');
  };
  $('#btnSuggestSwap').onclick=()=>{
    const ant=S.training.anthro||{};
    const tips=[
      ant.femur==='longo' ? 'Fêmur longo: priorize agacho goblet/hack e mais inclinação de tronco controlada.' : 'Fêmur médio/curto: agachamento livre como base.',
      ant.braco==='longo' ? 'Braço longo: para peito use maior amplitude com halter e pausa no alongado.' : 'Braço médio/curto: foque em estabilidade e progressão de carga.',
      'Se dor articular subir, troque para variação máquina/halter com melhor SFR.'
    ].join(' ');
    $('#aiDecision').textContent=tips;
    mentorSpeak('Sugestão biomecânica disponível na tela.');
  };
  $('#btnApplyDeload').onclick=()=>{
    const msg='Deload adaptativo ativado: reduzir 50% do volume por 1 semana, manter técnica e RPE 6-7.';
    S.training.program.week=5;
    saveState();
    $('#aiDecision').textContent=msg;
    mentorSpeak(msg);
    showToast('Deload ativado');
  };

  const sg=$('#selGroup'), sx=$('#selEx'); const refresh=()=>{sx.innerHTML=(lib[sg.value]||[]).map(e=>`<option>${e}</option>`).join('')}; sg.onchange=refresh; refresh();
  $('#btnAddSet').onclick=()=>{ const entry={date:k,group:sg.value,exercise:sx.value,sets:[{reps:Number($('#selReps').value),load:Number($('#selLoad').value)}]}; S.training.history.push(entry); setLastAction({type:'trainSet',entry}); addXP(20,'train'); adjustIntegrity(+1); saveState(); render(); };
  $('#btnEnv').onclick=()=>{S.training.environment=S.training.environment==='home'?'gym':'home'; S.training.program.track=S.training.environment; saveState(); render();};
  $('#btnTrainUndo').onclick=undoLastAction;
  $('#btnTrainReset').onclick=()=>{S.training.history=S.training.history.filter(x=>x.date!==k); adjustIntegrity(-4); saveState(); render();};
}

function fmtMMSS(sec){ return `${String(Math.floor(sec/60)).padStart(2,'0')}:${String(sec%60).padStart(2,'0')}`; }
function viewEstudo(){ const k=todayKey(), mins=S.study.history.filter(x=>x.date===k).reduce((a,b)=>a+b.minutes,0); view.innerHTML=`<div class='card'><h2>Estudo (timer)</h2><div class='small'>Hoje: ${mins} min</div><div class='grid'><div class='g6'><label>Duração</label><select id='studyDur'><option value='25'>25</option><option value='50'>50</option><option value='90'>90</option></select></div><div class='g6'><label>Matéria</label><select id='studyTopic'><option>Genética</option><option>Morfologia</option><option>Cálculo</option><option>Outros</option></select></div><div class='g12'><div class='card'><div class='kpi'><div><div class='big' id='timerBig'>${fmtMMSS(timer.left||0)}</div><div class='small' id='timerSmall'>Pronto.</div></div><span class='badge' id='timerState'>PARADO</span></div><div class='row'><button class='btn primary' id='btnStartTimer'>INICIAR</button><button class='btn' id='btnPauseTimer'>PAUSAR</button><button class='btn danger' id='btnAbortTimer'>ABANDONAR</button></div></div></div></div></div><div class='card'><h2>Hoje</h2><div class='list'>${S.study.history.filter(x=>x.date===k).map((e,i)=>`<div class='item'><div><div class='name'>${e.topic}</div><div class='meta'>${e.minutes} min</div></div><span class='badge'>#${i+1}</span></div>`).join('')||'<div class="hint">Sem blocos.</div>'}</div></div>`;
  $('#btnStartTimer').onclick=()=>startTimer(Number($('#studyDur').value)*60,$('#studyTopic').value);
  $('#btnPauseTimer').onclick=togglePause; $('#btnAbortTimer').onclick=abortTimer; updateTimerUI();
}
function startTimer(totalSec,topic){ if(timer.running) return; timer={running:true,total:totalSec,left:totalSec,startedAt:Date.now(),paused:false,topic,warned10:false}; clearInterval(timerInterval); timerInterval=setInterval(tickTimer,250); beep(1200,.06,.1); mentorSpeak('Bloco de estudo iniciado. Foco total.'); updateTimerUI(); }
function tickTimer(){ if(!timer.running||timer.paused) return; timer.left=Math.max(0,timer.total-Math.floor((Date.now()-timer.startedAt)/1000)); if(timer.left===10 && !timer.warned10){ timer.warned10=true; beep(1400,.06,.11); mentorSpeak('Faltam dez segundos no estudo.'); } if(timer.left<=0) finishTimer(); updateTimerUI(); }
function togglePause(){ if(!timer.running) return; if(timer.paused){timer.paused=false; timer.startedAt=Date.now()-(timer.total-timer.left)*1000; beep(900,.05,.07);} else {timer.paused=true;beep(500,.05,.06);} updateTimerUI(); }
function abortTimer(){ if(!timer.running) return; timer.running=false; clearInterval(timerInterval); adjustIntegrity(-3); addXP(3,'study'); mentorSpeak('Bloco abortado. Reorganize e tente novamente.'); showToast('Abandonou'); timer.left=0; updateTimerUI(); }
function finishTimer(){ timer.running=false; clearInterval(timerInterval); const m=Math.round(timer.total/60), k=todayKey(); S.study.history.push({date:k,minutes:m,topic:timer.topic}); setLastAction({type:'studyAdd',date:k,minutes:m,topic:timer.topic}); addXP(35+Math.round(m*0.8),'study'); adjustIntegrity(+2); mentorSpeak('Bloco concluído. Excelente execução.'); saveState(); timer.left=0; showToast('Bloco concluído'); render(); }
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

function viewCfg(){ view.innerHTML=`<div class='card'><h2>Config</h2><div class='grid'><div class='g6'><label>Objetivo</label><select id='cfgGoal'><option value='cutting'>Cutting</option><option value='maint'>Manutenção</option><option value='bulk'>Lean bulk</option></select></div><div class='g6'><label>Peso (kg)</label><input id='cfgW' type='number' min='40' max='200' value='${S.targets.weightKg}'></div><div class='g6'><label>BF (%)</label><input id='cfgBF' type='number' min='5' max='45' value='${S.targets.bfPct}'></div><div class='g6'><label>Atividade</label><select id='cfgAct'><option value='baixa'>Baixa</option><option value='moderada'>Moderada</option><option value='alta'>Alta</option></select></div><div class='g6'><label>Modo estrito</label><select id='cfgStrict'><option value='0'>Desligado</option><option value='1'>Ativo</option></select></div><div class='g6'><label>CRT</label><select id='cfgCRT'><option value='1'>Ativo</option><option value='0'>Desligado</option></select></div><div class='g6'><label>Sons</label><select id='cfgSound'><option value='1'>Ativo</option><option value='0'>Desligado</option></select></div><div class='g6'><label>Música de fundo</label><select id='cfgMusic'><option value='1'>Ativo</option><option value='0'>Desligado</option></select></div><div class='g6'><label>Modo atleta natural</label><select id='cfgNatural'><option value='1'>Ativo</option><option value='0'>Desligado</option></select></div><div class='g6'><label>Fêmur</label><select id='cfgFemur'><option value='curto'>Curto</option><option value='medio'>Médio</option><option value='longo'>Longo</option></select></div><div class='g6'><label>Braço</label><select id='cfgBraco'><option value='curto'>Curto</option><option value='medio'>Médio</option><option value='longo'>Longo</option></select></div><div class='g6'><label>Duração por imagem (seg)</label><input id='cfgLoadSec' type='number' min='1' max='10' value='${S.loading?.imageSeconds||3}'></div><div class='g12'><label>Volume</label><input id='cfgVol' type='range' min='0' max='1' step='0.05' value='${S.sounds.volume||0.6}'></div></div><hr><div class='grid'>${Object.entries(S.windows).map(([k,v])=>`<div class='g6'><label>${k}</label><input id='w_${k}' type='time' value='${v}'></div>`).join('')}</div><button class='btn primary wide' id='btnCfgSave'>SALVAR CONFIG</button></div>
  <div class='card'><h2>Áudios</h2><div class='hint'>Upload da música de fundo, som de clique no START e som de clique nas abas.</div><label>Música de fundo</label><input id='musicFile' type='file' accept='audio/*'><label>Som do botão START</label><input id='startSfxFile' type='file' accept='audio/*'><label>Som de clique das abas</label><input id='tabSfxFile' type='file' accept='audio/*'><div class='row'><button class='btn' id='btnMusicPlay'>PLAY</button><button class='btn' id='btnMusicStop'>STOP</button><button class='btn danger' id='btnMusicDelete'>APAGAR MÚSICA</button><button class='btn danger' id='btnStartSfxDelete'>APAGAR SOM START</button><button class='btn danger' id='btnTabSfxDelete'>APAGAR SOM ABAS</button></div></div>
  <div class='card'><h2>Tela de carregamento (5 imagens)</h2><div class='hint'>As imagens aparecem em sequência, 3s cada (ou valor configurado acima), estilo loading de jogo.</div><div class='grid'>${[1,2,3,4,5].map((n)=>`<div class='g6'><label>Imagem ${n}</label><input type='file' id='loadImg${n}' accept='image/*'></div>`).join('')}</div><div class='row'><button class='btn' id='btnSaveLoadingImages'>SALVAR IMAGENS</button><button class='btn danger' id='btnDeleteLoadingImages'>APAGAR TODAS</button></div></div>
  <div class='card'><h2>Backup</h2><div class='row'><button class='btn' id='btnExport'>EXPORTAR JSON</button><button class='btn' id='btnImport'>IMPORTAR JSON</button><input id='importFile' type='file' accept='application/json' style='display:none'></div><button class='btn danger' id='btnWipe'>RESET TOTAL</button>
  <button class='btn' id='btnForceRefresh'>FORÇAR ATUALIZAÇÃO APP</button></div>`;
  $('#cfgGoal').value=S.targets.goal; $('#cfgAct').value=S.targets.activity; $('#cfgStrict').value=S.strictMode?'1':'0'; $('#cfgCRT').value=S.theme.crt?'1':'0'; $('#cfgSound').value=S.sounds.enabled?'1':'0'; $('#cfgMusic').value=S.sounds.music?'1':'0'; $('#cfgNatural').value=S.training.naturalMode?'1':'0'; $('#cfgFemur').value=(S.training.anthro||{}).femur||'medio'; $('#cfgBraco').value=(S.training.anthro||{}).braco||'medio';
  $('#btnCfgSave').onclick=()=>{ S.targets.goal=$('#cfgGoal').value; S.targets.weightKg=Number($('#cfgW').value); S.targets.bfPct=Number($('#cfgBF').value); S.targets.activity=$('#cfgAct').value; S.strictMode=$('#cfgStrict').value==='1'; S.theme.crt=$('#cfgCRT').value==='1'; S.sounds.enabled=$('#cfgSound').value==='1'; S.sounds.music=$('#cfgMusic').value==='1'; S.training.naturalMode=$('#cfgNatural').value==='1'; S.training.anthro={...(S.training.anthro||{}), femur:$('#cfgFemur').value, braco:$('#cfgBraco').value}; S.loading={...(S.loading||{}), imageSeconds:Math.max(1,Math.min(10,Number($('#cfgLoadSec').value)||3))}; S.sounds.volume=Math.max(0,Math.min(1,Number($('#cfgVol').value))); Object.keys(S.windows).forEach(k=>S.windows[k]=$(`#w_${k}`).value||S.windows[k]); saveState(); applyTheme(); if(!S.sounds.enabled) stopMusic(); showToast('Config salva'); render(); };
  $('#musicFile').onchange=async(e)=>{ const f=e.target.files?.[0]; if(!f) return; await idb.set('music',f); await loadMusicIfAny(); showToast('Música salva'); };
  $('#startSfxFile').onchange=async(e)=>{ const f=e.target.files?.[0]; if(!f) return; await idb.set('start_sfx',f); await loadStartSfxIfAny(); showToast('Som START salvo'); };
  $('#tabSfxFile').onchange=async(e)=>{ const f=e.target.files?.[0]; if(!f) return; await idb.set('tab_click_sfx',f); await loadTabClickSfxIfAny(); showToast('Som das abas salvo'); };
  $('#btnMusicPlay').onclick=()=>{ startMusic(); showToast('Play'); };
  $('#btnMusicStop').onclick=()=>{ stopMusic(); showToast('Stop'); };
  $('#btnMusicDelete').onclick=async()=>{ await idb.del('music'); if(musicAudio){musicAudio.pause();musicAudio=null;} showToast('Música apagada'); };
  $('#btnStartSfxDelete').onclick=async()=>{ await idb.del('start_sfx'); startSfxAudio=null; showToast('Som START apagado'); };
  $('#btnTabSfxDelete').onclick=async()=>{ await idb.del('tab_click_sfx'); tabClickAudio=null; showToast('Som das abas apagado'); };
  $('#btnSaveLoadingImages').onclick=async()=>{ for(let i=1;i<=5;i++){ const f=$(`#loadImg${i}`).files?.[0]; if(f) await idb.set(`loading_image_${i}`,f); } await loadLoadingImagesIfAny(); showToast('Imagens de loading salvas'); };
  $('#btnDeleteLoadingImages').onclick=async()=>{ for(let i=1;i<=5;i++) await idb.del(`loading_image_${i}`); await loadLoadingImagesIfAny(); showToast('Imagens de loading apagadas'); };
  $('#btnExport').onclick=()=>downloadText(`ascensao-backup-${todayKey()}.json`,JSON.stringify(S,null,2));
  $('#btnImport').onclick=()=>$('#importFile').click();
  $('#importFile').onchange=async(e)=>{ const f=e.target.files?.[0]; if(!f) return; try{ S=migrate(JSON.parse(await f.text())); saveState(); applyTheme(); await loadStartupAssets(); showToast('Importado'); render(); }catch{ showToast('JSON inválido'); } };
  $('#btnWipe').onclick=()=>{ openModal('RESET TOTAL','Apaga tudo',`<button class='btn danger' id='confirmWipe'>CONFIRMAR</button>`); setTimeout(()=>{ $('#confirmWipe').onclick=async()=>{ localStorage.removeItem(STORAGE_KEY); await idb.del('music'); await idb.del('start_sfx'); await idb.del('tab_click_sfx'); for(let i=1;i<=5;i++) await idb.del(`loading_image_${i}`); S=defaultState(); saveState(); closeModal(); location.reload(); }; },0); };
  $('#btnForceRefresh').onclick=forceRefreshApp;
}

function render(){ refreshHUD(); renderTabs(); if(currentWindow().id==='sleep' && S.strictMode) beep(140,.09,.08);
  switch(activeTab){
    case 'DASH': return viewHUD(); case 'PROTO': return viewProtocolo(); case 'DIETA': return viewDieta(); case 'TREINO': return viewTreino(); case 'SHAPE': return viewShape(); case 'TESTO': return viewTestosterona();
    case 'ESTUDO': return viewEstudo(); case 'BIBLIA': return viewBiblia(); case 'TASKS': return viewTasks(); case 'SOCIAL': return viewSocial();
    case 'OPS': return viewOps(); case 'LOG': return viewLog(); case 'DIARIO': return viewDiario(); case 'REL': return viewRel(); case 'CFG': return viewCfg();
    default: return viewHUD();
  }
}

(function init(){
  applyTheme();
  loadStartupAssets();
  $('#startClass').value=S.class;
  $('#btnStart').onclick=async()=>{
    const btn=$('#btnStart');
    btn.disabled=true;
    S.class=$('#startClass').value;
    saveState();
    await playStartSound();
    await runLoadingScreen();
    $('#start').style.display='none';
    $('#start').setAttribute('aria-hidden','true');
    activeTab=currentWindow().tab||'DASH';
    render();
    btn.disabled=false;
  };
  refreshHUD();
})();

setInterval(()=>{ refreshHUD(); if((S.rpg.combo||0)>0){ S.rpg.combo=Math.max(0,S.rpg.combo-1); saveState(); } if(S.strictMode){ const win=currentWindow(); if(activeTab!==win.tab && !['CFG','REL'].includes(activeTab)){ activeTab=win.tab; render(); }} }, 30000);
