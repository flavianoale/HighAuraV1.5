const DB_VERSION = 2;
const DB_NAME = 'ascensao-os-pro';
const STORE = 'state';

const ranks = ['Recruta', 'Soldado', 'Sargento', 'Cavaleiro', 'Centurião', 'Guardião'];
const phases = ['Pressão', 'Força', 'Domínio', 'Legado'];

const AREAS = {
  identidade: {
    titulo: '🧠 Identidade',
    objetivos: ['Disciplina', 'Consistência', 'Controle emocional', 'Presença forte'],
    acoes: ['Planejar 3 prioridades', 'Postura 2min', 'Sem impulso por 1h']
  },
  shape: {
    titulo: '🏋️ Shape / Físico',
    objetivos: ['Perder gordura', 'Ganhar massa', 'Progressão de carga', 'Treino 5-6x'],
    acoes: ['Treino completo', 'Bater proteína do dia', 'Sono 7h+']
  },
  beleza: {
    titulo: '🧴 Beleza / Estética',
    objetivos: ['Skincare', 'Cabelo alinhado', 'Aparência masculina forte'],
    acoes: ['Skincare manhã/noite', 'Higiene visual', 'Checklist grooming']
  },
  financeiro: {
    titulo: '💰 Financeiro',
    objetivos: ['Zero apostas', 'Organização financeira', 'Renda crescente'],
    acoes: ['Registrar gastos', 'Revisar meta de caixa', 'Ação de ativo']
  },
  academico: {
    titulo: '🎓 Acadêmico',
    objetivos: ['Estudar diário', 'Revisão ativa', 'Ser referência'],
    acoes: ['Sprint 30min', 'Resolver lista', 'Revisão espaçada']
  },
  espiritual: {
    titulo: '✝️ Espiritual',
    objetivos: ['Oração diária', 'Missa', 'Confissão regular'],
    acoes: ['Leitura bíblica', 'Oração curta', 'Exame de consciência']
  },
  social: {
    titulo: '🌍 Social',
    objetivos: ['Comunicação', 'Presença natural', 'Influência'],
    acoes: ['Iniciar conversa', 'Treinar comunicação', 'Ato social positivo']
  },
  internet: {
    titulo: '🌐 Internet / Fama',
    objetivos: ['Conteúdo', 'Crescimento de audiência', 'Estratégia online'],
    acoes: ['Publicar conteúdo', 'Analisar métricas', 'Planejar próximo post']
  },
  intelectual: {
    titulo: '📚 Intelectual',
    objetivos: ['São Tomás', 'Filosofia', 'Clássicos'],
    acoes: ['Leitura 20min', 'Resumo 5 linhas', 'Nota crítica']
  },
  mental: {
    titulo: '🧘 Mental / Emocional',
    objetivos: ['Sem compulsões', 'Estabilidade emocional', 'Dopamina regulada'],
    acoes: ['Respiração 90s', 'Água + caminhada', 'Registrar gatilho']
  },
  organizacao: {
    titulo: '🧭 Vida Organizada',
    objetivos: ['Rotina estruturada', 'Plano 3 anos', 'Execução diária'],
    acoes: ['Revisão agenda', 'Limpar pendências', 'Planejar amanhã']
  }
};

const defaultState = {
  meta: { version: DB_VERSION, lastPlanDate: null },
  profile: {
    routineProfile: 'Interior', strictMode: true, sound: true, scanlines: true, preferenciaTreino: 'casa'
  },
  scheduleProfiles: {
    Interior: { acordar: '04:00', faculdade: '07:30', almoco: '13:30', trabalho: '14:00', dormir: '20:00' },
    Cidade: { acordar: '05:00', faculdade: '08:00', almoco: '12:30', trabalho: '14:30', dormir: '22:00' }
  },
  focusWindows: [
    { start: '04:00', end: '07:00', hub: 'guiado' },
    { start: '07:00', end: '12:30', hub: 'academico' },
    { start: '12:30', end: '18:30', hub: 'shape' },
    { start: '18:30', end: '21:30', hub: 'espiritual' }
  ],
  foodDB: [
    { id: 'arroz-cozido', kcal: 130, p: 2.5, c: 28, f: 0.3 },
    { id: 'feijao-cozido', kcal: 76, p: 4.8, c: 13.6, f: 0.5 },
    { id: 'frango-peito', kcal: 165, p: 31, c: 0, f: 3.6 },
    { id: 'ovo', kcal: 72, p: 6.3, c: 0.4, f: 4.8 }
  ],
  trainingDB: { casa: ['Flexão', 'Agachamento', 'Remada', 'Prancha'], academia: ['Supino', 'Agacho', 'Remada baixa', 'Terra romeno'] },
  studyPlans: { materias: ['Anatomia', 'Bioquímica', 'Fisiologia'] },
  catholicLibrary: { dailyReadings: ['Mt 5:1-12', 'Sl 23', 'Rm 8:1-11', 'Jo 15:1-11'] },
  game: { xp: 0, level: 1, integrity: 100, streak: 0, achievements: ['Boot iniciado'] },
  areaScores: Object.fromEntries(Object.keys(AREAS).map((k) => [k, 10])),
  logs: [],
  dailyPlan: null,
  runtime: { currentBlock: 0, currentStep: 0, timerEndsAt: null, recoveryModeUntil: null }
};

let state, db;
const $ = (s) => document.querySelector(s);
const $$ = (s) => [...document.querySelectorAll(s)];

async function initDB() {
  if (!('indexedDB' in window)) return null;
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => { if (!req.result.objectStoreNames.contains(STORE)) req.result.createObjectStore(STORE); };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

function migrate(s) {
  const merged = { ...structuredClone(defaultState), ...(s || {}) };
  merged.meta = merged.meta || { version: DB_VERSION };
  merged.meta.version = DB_VERSION;
  merged.areaScores = { ...defaultState.areaScores, ...(s?.areaScores || {}) };
  return merged;
}

async function loadState() {
  try {
    db = await initDB();
    if (db) {
      const tx = db.transaction(STORE, 'readonly');
      const req = tx.objectStore(STORE).get('root');
      const data = await new Promise((res) => { req.onsuccess = () => res(req.result); req.onerror = () => res(null); });
      return migrate(data);
    }
  } catch {}
  return migrate(localStorage.getItem('ascensao_state') ? JSON.parse(localStorage.getItem('ascensao_state')) : null);
}

function saveState() {
  if (db) db.transaction(STORE, 'readwrite').objectStore(STORE).put(state, 'root');
  localStorage.setItem('ascensao_state', JSON.stringify(state));
}

const nowHHMM = () => new Date().toTimeString().slice(0, 5);
const inWindow = (t, a, b) => t >= a && t <= b;
const currentAllowedHub = () => state.focusWindows.find((w) => inWindow(nowHHMM(), w.start, w.end))?.hub || 'hoje';

function generatePlan() {
  const today = new Date().toISOString().slice(0, 10);
  if (state.meta.lastPlanDate === today && state.dailyPlan) return;
  const reduced = state.runtime.recoveryModeUntil && new Date(state.runtime.recoveryModeUntil) > new Date();
  const treino = state.profile.preferenciaTreino;
  const stepsTreino = [];
  state.trainingDB[treino].forEach((ex) => {
    stepsTreino.push(`Exercício: ${ex}`);
    for (let i = 1; i <= (reduced ? 2 : 3); i += 1) stepsTreino.push(`Série ${i} de ${ex}`);
    stepsTreino.push('Descanso 60s');
  });
  const mat = state.studyPlans.materias[0] || 'Matéria';
  state.dailyPlan = {
    date: today,
    mission: reduced ? 'Modo recuperação: mínimo impecável.' : 'Execução forte e estável em todas as áreas.',
    blocks: [
      mkBlock('Identidade', ['Planejar 3 prioridades', 'Arrumar ambiente', 'Reforçar postura']),
      mkBlock('Shape', stepsTreino),
      mkBlock('Acadêmico', [`Sprint 30min ${mat}`, 'Revisão ativa 10min']),
      mkBlock('Espiritual', [`Leitura ${todayReading()}`, 'Oração 3min', 'Exame breve']),
      mkBlock('Financeiro', ['Revisar gastos', 'Meta anti-aposta', 'Ação de renda']),
      mkBlock('Mental', ['Respiração 90s', 'Água + caminhada 5min', 'Registrar gatilho']),
      mkBlock('Organização', ['Fechamento do dia', 'Relatório diário', 'Planejar amanhã'])
    ]
  };
  state.meta.lastPlanDate = today;
  state.runtime.currentBlock = 0;
  state.runtime.currentStep = 0;
}

function mkBlock(name, steps) { return { name, completed: false, steps: steps.map((s, i) => ({ id: i + 1, text: s, done: false, timerSec: stepTimer(s) })) }; }
function stepTimer(txt) { if (txt.includes('Sprint')) return 1800; if (txt.includes('Descanso')) return 60; if (txt.includes('Respiração')) return 90; if (txt.includes('Oração')) return 180; return 0; }
function todayReading() { return state.catholicLibrary.dailyReadings[new Date().getDate() % state.catholicLibrary.dailyReadings.length]; }
function currentStepRef() {
  const block = state.dailyPlan?.blocks[state.runtime.currentBlock];
  if (!block) return null;
  const step = block.steps[state.runtime.currentStep];
  return step ? { block, step } : null;
}

function toast(msg) {
  const el = $('#toast'); el.textContent = msg; el.classList.add('show'); setTimeout(() => el.classList.remove('show'), 1400);
}
function pulse() { if (navigator.vibrate) navigator.vibrate(40); }
function beep(kind = 'ok') {
  if (!state.profile.sound) return;
  const a = new (window.AudioContext || window.webkitAudioContext)();
  const o = a.createOscillator(); const g = a.createGain();
  o.frequency.value = { ok: 740, warn: 320, penalty: 180 }[kind] || 600; o.type = 'square'; g.gain.value = 0.05;
  o.connect(g).connect(a.destination); o.start(); o.stop(a.currentTime + .08);
}

function log(type, value) {
  state.logs.push({ ts: new Date().toISOString(), type, value });
  if (type === 'recaida') {
    state.runtime.recoveryModeUntil = new Date(Date.now() + 24 * 3600 * 1000).toISOString();
    state.game.integrity = Math.max(0, state.game.integrity - 8);
    state.areaScores.mental = Math.max(0, state.areaScores.mental - 5);
    state.areaScores.financeiro = Math.max(0, state.areaScores.financeiro - (value === 'aposta' ? 7 : 0));
  }
  saveState();
}

function strictGate(target) {
  if (!state.profile.strictMode) return true;
  const allow = currentAllowedHub();
  const always = ['hoje', 'config', 'registros'];
  if (!always.includes(target) && target !== allow && target !== 'guiado') {
    state.game.integrity = Math.max(0, state.game.integrity - 2);
    log('penalidade', `fora_da_janela:${target}`);
    toast(`Modo estrito: foco em ${allow.toUpperCase()}`);
    beep('penalty');
    return false;
  }
  return true;
}

function openHub(name) {
  if (!strictGate(name)) return;
  $$('.hub').forEach((h) => h.classList.remove('active'));
  $$('.tabbar button').forEach((b) => b.classList.remove('active'));
  $(`#hub-${name}`)?.classList.add('active');
  $(`.tabbar button[data-hub="${name}"]`)?.classList.add('active');
}

function completeStep(skipped = false) {
  const ref = currentStepRef();
  if (!ref) return;
  ref.step.done = !skipped;
  state.game.xp += skipped ? 1 : 10;
  if (!skipped && state.game.xp % 100 === 0) state.game.level += 1;
  if (!skipped) state.game.integrity = Math.min(100, state.game.integrity + 1);
  state.areaScores.identidade = Math.min(100, state.areaScores.identidade + (skipped ? 0 : 1));
  state.runtime.currentStep += 1;
  if (state.runtime.currentStep >= ref.block.steps.length) {
    ref.block.completed = true;
    state.runtime.currentStep = 0;
    state.runtime.currentBlock += 1;
    toast(`${ref.block.name} concluído`);
  }
  state.runtime.timerEndsAt = null;
  beep(skipped ? 'warn' : 'ok');
  pulse();
  saveState();
  render();
}

function renderAreas() {
  const compact = Object.entries(AREAS).map(([k, v]) => {
    const score = state.areaScores[k] || 0;
    return `<div class="area-score"><span>${v.titulo}</span><strong>${score}%</strong><div class="progress"><i style="width:${score}%"></i></div></div>`;
  }).join('');
  $('#areasCompact').innerHTML = compact;

  Object.entries(AREAS).forEach(([k, v]) => {
    const score = state.areaScores[k] || 0;
    const el = $(`#hub-${k}`);
    if (!el) return;
    el.innerHTML = `
      <div class="card">
        <h2>${v.titulo}</h2>
        <p>Foco: ${v.objetivos.join(' • ')}</p>
        <div class="area-score"><span>Progresso da área</span><strong>${score}%</strong><div class="progress"><i style="width:${score}%"></i></div></div>
      </div>
      <div class="card">
        <h3>Ações rápidas</h3>
        <div class="row-wrap">${v.acoes.map((a) => `<button class="chip" data-area-action="${k}|${a}">${a}</button>`).join('')}</div>
      </div>
    `;
  });

  $$('[data-area-action]').forEach((b) => {
    b.addEventListener('click', () => {
      const [area, action] = b.dataset.areaAction.split('|');
      state.areaScores[area] = Math.min(100, (state.areaScores[area] || 0) + 2);
      state.game.xp += 6;
      log('area_action', `${area}:${action}`);
      toast(`+XP em ${AREAS[area].titulo}`);
      beep('ok');
      pulse();
      render();
    });
  });
}

function buildWeeklyReport() {
  const week = Date.now() - 7 * 24 * 3600 * 1000;
  const logs = state.logs.filter((l) => new Date(l.ts).getTime() >= week);
  const rec = logs.filter((l) => l.type === 'recaida').length;
  const done = logs.filter((l) => l.type === 'area_action').length;
  const best = Object.entries(state.areaScores).sort((a, b) => b[1] - a[1])[0];
  return `Ações concluídas: ${done}\nRecaídas: ${rec}\nIntegridade: ${state.game.integrity}\nÁrea mais forte: ${best?.[0] || '-'} (${best?.[1] || 0}%)`;
}

function exportData(type) {
  const data = {
    date: state.dailyPlan.date,
    mission: state.dailyPlan.mission,
    integrity: state.game.integrity,
    xp: state.game.xp,
    areas: state.areaScores
  };
  let text = '', mime = 'text/plain';
  if (type === 'txt') text = `Relatório\n${JSON.stringify(data, null, 2)}\n${buildWeeklyReport()}`;
  if (type === 'json') { text = JSON.stringify({ data, logs: state.logs }, null, 2); mime = 'application/json'; }
  if (type === 'csv') { text = `date,integrity,xp\n${data.date},${data.integrity},${data.xp}`; mime = 'text/csv'; }
  const blob = new Blob([text], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href = url; a.download = `ascensao-relatorio.${type}`; a.click();
  URL.revokeObjectURL(url);
}

function render() {
  $('#missionLine').textContent = `Missão principal: ${state.dailyPlan?.mission || 'N/D'}`;
  $('#xpValue').textContent = state.game.xp;
  $('#levelValue').textContent = state.game.level;
  $('#integrityValue').textContent = state.game.integrity;

  const ref = currentStepRef();
  $('#nextActionText').textContent = ref?.step.text || 'Plano concluído. Revisar e preparar amanhã.';
  $('#guidedBlockInfo').textContent = ref ? `Bloco ${state.runtime.currentBlock + 1}/${state.dailyPlan.blocks.length}: ${ref.block.name}` : 'Todos os blocos concluídos';
  $('#guidedStepText').textContent = ref ? `Step ${state.runtime.currentStep + 1}: ${ref.step.text}` : 'Sem step pendente';
  $('#timerText').textContent = ref?.step.timerSec ? `Timer: ${Math.floor(ref.step.timerSec / 60)} min` : 'Sem timer';
  $('#blocksList').innerHTML = state.dailyPlan.blocks.map((b, i) => `<li>${b.completed ? '✅' : '⬜'} ${i + 1}. ${b.name}</li>`).join('');

  $('#rankText').textContent = `Rank: ${ranks[Math.min(ranks.length - 1, Math.floor(state.game.level / 3))]}`;
  $('#phaseText').textContent = `Fase: ${phases[Math.min(phases.length - 1, Math.floor(state.game.streak / 7))]}`;
  $('#skillsTree').innerHTML = Object.entries(state.areaScores).slice(0, 5).map(([k, v]) => `<p>${k}: ${'█'.repeat(Math.floor(v / 10))}${'.'.repeat(10 - Math.floor(v / 10))}</p>`).join('');
  $('#achievementsList').innerHTML = state.game.achievements.map((a) => `<li>${a}</li>`).join('');

  renderAreas();

  const sched = state.scheduleProfiles[state.profile.routineProfile];
  $('#scheduleEditor').innerHTML = Object.entries(sched).map(([k, v]) => `<label>${k}<input type="time" data-skey="${k}" value="${v}"/></label>`).join('');
  $('#routineProfileSelect').value = state.profile.routineProfile;
  $('#strictModeToggle').checked = state.profile.strictMode;
  $('#scanlineToggle').checked = state.profile.scanlines;
  $('#soundToggle').checked = state.profile.sound;
  document.body.classList.toggle('scanlines', state.profile.scanlines);

  $('#weeklyReport').textContent = buildWeeklyReport();
}

function bind() {
  $$('.tabbar button').forEach((b) => b.addEventListener('click', () => openHub(b.dataset.hub)));
  $('#startBtn').addEventListener('click', () => { beep('ok'); $('#bootOverlay').classList.remove('active'); });
  $('#continueGuidedBtn').addEventListener('click', () => openHub('guiado'));
  $('#completeStepBtn').addEventListener('click', () => completeStep(false));
  $('#skipStepBtn').addEventListener('click', () => completeStep(true));
  $('#impulseBtn').addEventListener('click', () => {
    state.dailyPlan.blocks.unshift(mkBlock('Anti-Impulso', ['Respiração 90s', 'Água', 'Caminhada 5min', 'Oração curta']));
    state.runtime.currentBlock = 0; state.runtime.currentStep = 0;
    log('recaida', 'impulso'); toast('Modo recuperação ativado'); render(); openHub('guiado');
  });

  $('#routineProfileSelect').addEventListener('change', (e) => { state.profile.routineProfile = e.target.value; saveState(); render(); });
  $('#strictModeToggle').addEventListener('change', (e) => { state.profile.strictMode = e.target.checked; saveState(); });
  $('#scanlineToggle').addEventListener('change', (e) => { state.profile.scanlines = e.target.checked; saveState(); render(); });
  $('#soundToggle').addEventListener('change', (e) => { state.profile.sound = e.target.checked; saveState(); });
  $('#saveScheduleBtn').addEventListener('click', () => {
    const p = state.profile.routineProfile;
    $$('#scheduleEditor input').forEach((i) => { state.scheduleProfiles[p][i.dataset.skey] = i.value; });
    toast('Horários salvos'); saveState();
  });

  const logs = [['peso', 'Peso'], ['treino', 'Treino'], ['study', 'Estudo'], ['dieta', 'Dieta'], ['recaida', 'Recaída(aposta)']];
  $('#logButtons').innerHTML = logs.map(([k, t]) => `<button class="chip" data-log="${k}">${t}</button>`).join('');
  $$('[data-log]').forEach((b) => b.addEventListener('click', () => { log(b.dataset.log, b.dataset.log === 'recaida' ? 'aposta' : '1toque'); toast('Registro salvo'); render(); }));
  $$('[data-export]').forEach((b) => b.addEventListener('click', () => exportData(b.dataset.export)));
}

async function init() {
  state = await loadState();
  generatePlan();
  bind();
  render();

  setInterval(() => {
    const ref = currentStepRef();
    if (!ref?.step?.timerSec) { state.runtime.timerEndsAt = null; return; }
    if (!state.runtime.timerEndsAt) state.runtime.timerEndsAt = Date.now() + ref.step.timerSec * 1000;
    const left = Math.max(0, Math.floor((state.runtime.timerEndsAt - Date.now()) / 1000));
    $('#timerText').textContent = `Timer: ${Math.floor(left / 60)}:${String(left % 60).padStart(2, '0')}`;
    if (left === 0) { state.runtime.timerEndsAt = null; toast('Timer finalizado'); beep('ok'); }
  }, 1000);

  const dormir = state.scheduleProfiles[state.profile.routineProfile].dormir;
  if (nowHHMM() > dormir) toast('ALERTA VERMELHO: DORMIR');

  if ('serviceWorker' in navigator) navigator.serviceWorker.register('./sw.js');
  saveState();
}

init();
