const DB_VERSION = 3;
const DB_NAME = 'ascensao-os-pro';
const STORE = 'state';
const ranks = ['Recruta', 'Soldado', 'Sargento', 'Cavaleiro', 'Centurião', 'Guardião'];
const phases = ['Pressão', 'Força', 'Domínio', 'Legado'];

const AREAS = {
  identidade: { titulo: '🧠 Identidade', objetivos: ['Disciplina', 'Consistência'], acoes: ['Planejar 3 prioridades', 'Postura 2min', 'Sem impulso por 1h'] },
  shape: { titulo: '🏋️ Shape', objetivos: ['Perder gordura', 'Ganhar massa'], acoes: ['Treino completo', 'Bater proteína', 'Sono 7h+'] },
  beleza: { titulo: '🧴 Beleza', objetivos: ['Skincare', 'Grooming'], acoes: ['Skincare', 'Cabelo/Barba', 'Roupa alinhada'] },
  financeiro: { titulo: '💰 Financeiro', objetivos: ['Zero aposta', 'Renda crescente'], acoes: ['Registrar gasto', 'Meta caixa', 'Ação ativo'] },
  academico: { titulo: '🎓 Acadêmico', objetivos: ['Estudo diário', 'Revisão ativa'], acoes: ['Sprint 30min', 'Resolver lista', 'Revisão'] },
  espiritual: { titulo: '✝️ Espiritual', objetivos: ['Oração', 'Missa'], acoes: ['Leitura bíblica', 'Oração curta', 'Exame'] },
  social: { titulo: '🌍 Social', objetivos: ['Comunicação', 'Influência'], acoes: ['Iniciar conversa', 'Treino fala', 'Contato'] },
  internet: { titulo: '🌐 Internet', objetivos: ['Conteúdo', 'Audiência'], acoes: ['Publicar', 'Métricas', 'Planejar post'] },
  intelectual: { titulo: '📚 Intelectual', objetivos: ['Tomás', 'Clássicos'], acoes: ['Ler 20min', 'Resumo', 'Nota crítica'] },
  mental: { titulo: '🧘 Mental', objetivos: ['Sem compulsões', 'Estabilidade'], acoes: ['Respiração 90s', 'Água+caminhada', 'Log gatilho'] },
  organizacao: { titulo: '🧭 Organização', objetivos: ['Rotina', 'Plano execução'], acoes: ['Revisar agenda', 'Limpar pendências', 'Planejar amanhã'] }
};

const defaultState = {
  meta: { version: DB_VERSION, lastPlanDate: null },
  profile: {
    objective: 'Cutting', weight: 85, bf: 25, activity: 'Baixa', routineProfile: 'Interior', strictMode: true, scanlines: true,
    sound: true, bgMusic: false, volume: 0.3, preferenciaTreino: 'casa'
  },
  scheduleProfiles: {
    Interior: { acordar: '04:00', faculdadeInicio: '07:30', faculdadeFim: '12:00', servicoInicio: '13:30', servicoFim: '16:00', treinoInicio: '16:30', treinoFim: '18:30', noiteInicio: '19:00', dormir: '20:00' },
    Cidade: { acordar: '05:00', faculdadeInicio: '08:00', faculdadeFim: '12:30', servicoInicio: '14:30', servicoFim: '18:00', treinoInicio: '18:15', treinoFim: '19:30', noiteInicio: '20:00', dormir: '22:00' }
  },
  focusWindows: [
    { start: '04:00', end: '07:00', hub: 'guiado' },
    { start: '07:00', end: '12:30', hub: 'academico' },
    { start: '12:30', end: '18:30', hub: 'shape' },
    { start: '18:30', end: '21:30', hub: 'espiritual' }
  ],
  trainingDB: { casa: ['Flexão', 'Agachamento', 'Remada', 'Prancha'], academia: ['Supino', 'Agacho', 'Remada', 'Terra'] },
  studyPlans: { materias: ['Anatomia', 'Bioquímica', 'Fisiologia'] },
  catholicLibrary: { dailyReadings: ['Mt 5:1-12', 'Sl 23', 'Rm 8:1-11', 'Jo 15:1-11'] },
  game: { xp: 0, level: 1, integrity: 100, streak: 0, achievements: ['Boot iniciado'] },
  areaScores: Object.fromEntries(Object.keys(AREAS).map((k) => [k, 10])),
  customTasks: {},
  music: { name: '', dataUrl: '' },
  logs: [],
  dailyPlan: null,
  runtime: { currentBlock: 0, currentStep: 0, timerEndsAt: null, recoveryModeUntil: null }
};

let state, db, bgAudio = new Audio();
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
  merged.meta.version = DB_VERSION;
  merged.areaScores = { ...defaultState.areaScores, ...(s?.areaScores || {}) };
  merged.customTasks = s?.customTasks || {};
  merged.music = { ...defaultState.music, ...(s?.music || {}) };
  merged.profile = { ...defaultState.profile, ...(s?.profile || {}) };
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
const todayKey = () => new Date().toISOString().slice(0, 10);
const inWindow = (t, a, b) => t >= a && t <= b;
const currentAllowedHub = () => state.focusWindows.find((w) => inWindow(nowHHMM(), w.start, w.end))?.hub || 'hoje';

function mkBlock(name, steps) { return { name, completed: false, steps: steps.map((s, i) => ({ id: i + 1, text: s, done: false, timerSec: stepTimer(s) })) }; }
function stepTimer(t) { if (t.includes('Sprint')) return 1800; if (t.includes('Descanso')) return 60; if (t.includes('Respiração')) return 90; if (t.includes('Oração')) return 180; return 0; }
function todayReading() { return state.catholicLibrary.dailyReadings[new Date().getDate() % state.catholicLibrary.dailyReadings.length]; }
function todayTasks() { return (state.customTasks[todayKey()] || []).sort((a, b) => a.time.localeCompare(b.time)); }

function generatePlan() {
  const today = todayKey();
  if (state.meta.lastPlanDate === today && state.dailyPlan) return;
  const reduced = state.runtime.recoveryModeUntil && new Date(state.runtime.recoveryModeUntil) > new Date();
  const stepsTreino = [];
  state.trainingDB[state.profile.preferenciaTreino].forEach((e) => {
    stepsTreino.push(`Exercício: ${e}`);
    for (let i = 1; i <= (reduced ? 2 : 3); i += 1) stepsTreino.push(`Série ${i} de ${e}`);
    stepsTreino.push('Descanso 60s');
  });
  const custom = todayTasks().map((t) => `${t.time} • ${t.title}`);
  state.dailyPlan = {
    date: today,
    mission: reduced ? 'Modo recuperação: mínimo impecável.' : 'Execução forte e estável em todas as áreas.',
    blocks: [
      mkBlock('Identidade', ['Planejar 3 prioridades', 'Arrumar ambiente', 'Reforçar postura']),
      mkBlock('Shape', stepsTreino),
      mkBlock('Acadêmico', [`Sprint 30min ${state.studyPlans.materias[0]}`, 'Revisão ativa 10min']),
      mkBlock('Espiritual', [`Leitura ${todayReading()}`, 'Oração 3min', 'Exame breve']),
      mkBlock('Financeiro', ['Revisar gastos', 'Meta anti-aposta', 'Ação de renda']),
      mkBlock('Tarefas Custom', custom.length ? custom : ['Sem tarefas extras hoje']),
      mkBlock('Organização', ['Fechamento do dia', 'Relatório diário', 'Planejar amanhã'])
    ]
  };
  state.meta.lastPlanDate = today;
  state.runtime.currentBlock = 0;
  state.runtime.currentStep = 0;
}
function currentStepRef() {
  const block = state.dailyPlan?.blocks[state.runtime.currentBlock];
  if (!block) return null;
  const step = block.steps[state.runtime.currentStep];
  return step ? { block, step } : null;
}

function toast(msg) { const el = $('#toast'); el.textContent = msg; el.classList.add('show'); setTimeout(() => el.classList.remove('show'), 1400); }
function pulse() { if (navigator.vibrate) navigator.vibrate(40); }
function beep(kind = 'ok') {
  if (!state.profile.sound) return;
  const a = new (window.AudioContext || window.webkitAudioContext)();
  const o = a.createOscillator(); const g = a.createGain();
  o.frequency.value = { ok: 740, warn: 320, penalty: 180 }[kind] || 620; o.type = 'square';
  g.gain.value = 0.05 * Number(state.profile.volume || 0.3);
  o.connect(g).connect(a.destination); o.start(); o.stop(a.currentTime + 0.08);
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
  if (!['hoje', 'config', 'registros', 'guiado'].includes(target) && target !== allow) {
    state.game.integrity = Math.max(0, state.game.integrity - 2);
    log('penalidade', `fora_da_janela:${target}`);
    beep('penalty');
    toast(`Modo estrito: foco em ${allow.toUpperCase()}`);
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
  state.runtime.currentStep += 1;
  if (state.runtime.currentStep >= ref.block.steps.length) {
    ref.block.completed = true;
    state.runtime.currentStep = 0;
    state.runtime.currentBlock += 1;
    toast(`${ref.block.name} concluído`);
  }
  state.runtime.timerEndsAt = null;
  beep(skipped ? 'warn' : 'ok'); pulse(); saveState(); render();
}

function renderAreas() {
  $('#areasCompact').innerHTML = Object.entries(AREAS).map(([k, v]) => {
    const s = state.areaScores[k] || 0;
    return `<div class="area-score"><span>${v.titulo}</span><strong>${s}%</strong><div class="progress"><i style="width:${s}%"></i></div></div>`;
  }).join('');
  Object.entries(AREAS).forEach(([k, v]) => {
    const s = state.areaScores[k] || 0;
    const el = $(`#hub-${k}`); if (!el) return;
    el.innerHTML = `<div class="card"><h2>${v.titulo}</h2><p>${v.objetivos.join(' • ')}</p><div class="area-score"><span>Progresso</span><strong>${s}%</strong><div class="progress"><i style="width:${s}%"></i></div></div></div>
      <div class="card"><h3>Ações rápidas</h3><div class="row-wrap">${v.acoes.map((a) => `<button class="chip" data-area-action="${k}|${a}">${a}</button>`).join('')}</div></div>`;
  });
  $$('[data-area-action]').forEach((b) => b.onclick = () => {
    const [area, action] = b.dataset.areaAction.split('|');
    state.areaScores[area] = Math.min(100, (state.areaScores[area] || 0) + 2);
    state.game.xp += 6;
    log('area_action', `${area}:${action}`);
    toast(`+XP em ${AREAS[area].titulo}`); beep('ok'); pulse(); render();
  });
}

function renderTasks() {
  const tasks = todayTasks();
  $('#todayTasksList').innerHTML = tasks.length ? tasks.map((t, i) => `<li>${t.time} • ${t.title} (${t.area}) <button class="chip" data-done-task="${i}">feito</button></li>`).join('') : '<li>Sem tarefas do dia.</li>';
  $('#configTasksList').innerHTML = tasks.length ? tasks.map((t, i) => `<li>${t.time} • ${t.title} (${t.area}) <button class="chip" data-del-task="${i}">apagar</button></li>`).join('') : '<li>Nenhuma tarefa adicionada.</li>';
  $$('[data-del-task]').forEach((b) => b.onclick = () => {
    const i = Number(b.dataset.delTask);
    state.customTasks[todayKey()].splice(i, 1);
    saveState(); generatePlan(); render();
  });
  $$('[data-done-task]').forEach((b) => b.onclick = () => {
    const i = Number(b.dataset.doneTask);
    const task = state.customTasks[todayKey()][i];
    if (!task) return;
    state.customTasks[todayKey()].splice(i, 1);
    state.game.xp += 8;
    state.areaScores[task.area] = Math.min(100, (state.areaScores[task.area] || 0) + 3);
    log('task_done', task.title);
    toast('Tarefa concluída');
    saveState(); generatePlan(); render();
  });
}

function buildWeeklyReport() {
  const week = Date.now() - 7 * 24 * 3600 * 1000;
  const logs = state.logs.filter((l) => new Date(l.ts).getTime() >= week);
  return `Ações: ${logs.filter((l) => l.type === 'area_action').length}\nTarefas concluídas: ${logs.filter((l) => l.type === 'task_done').length}\nRecaídas: ${logs.filter((l) => l.type === 'recaida').length}\nIntegridade: ${state.game.integrity}`;
}

function exportData(type) {
  const payload = { date: todayKey(), profile: state.profile, areas: state.areaScores, logs: state.logs, tasks: todayTasks() };
  let text = '', mime = 'text/plain';
  if (type === 'txt') text = `Relatório\n${JSON.stringify(payload, null, 2)}\n${buildWeeklyReport()}`;
  if (type === 'json') { text = JSON.stringify(payload, null, 2); mime = 'application/json'; }
  if (type === 'csv') { text = `date,xp,integrity\n${todayKey()},${state.game.xp},${state.game.integrity}`; mime = 'text/csv'; }
  const blob = new Blob([text], { type: mime });
  const url = URL.createObjectURL(blob); const a = document.createElement('a');
  a.href = url; a.download = `ascensao-relatorio.${type}`; a.click(); URL.revokeObjectURL(url);
}

function applyMusicSource() {
  bgAudio.loop = true;
  bgAudio.volume = Number(state.profile.volume || 0.3);
  if (state.music.dataUrl) bgAudio.src = state.music.dataUrl;
  $('#musicStatusText').textContent = state.music.name ? `Música: ${state.music.name}` : 'Sem música carregada.';
}

function render() {
  $('#missionLine').textContent = `Missão principal: ${state.dailyPlan?.mission || 'N/D'}`;
  $('#xpValue').textContent = state.game.xp;
  $('#levelValue').textContent = state.game.level;
  $('#integrityValue').textContent = state.game.integrity;
  const ref = currentStepRef();
  const nextTask = todayTasks().find((t) => t.time >= nowHHMM());
  const nextTaskTxt = nextTask ? `Próxima tarefa ${nextTask.time}: ${nextTask.title}` : '';
  $('#nextActionText').textContent = ref?.step.text || nextTaskTxt || 'Plano concluído. Revisar e preparar amanhã.';
  $('#guidedBlockInfo').textContent = ref ? `Bloco ${state.runtime.currentBlock + 1}/${state.dailyPlan.blocks.length}: ${ref.block.name}` : 'Todos os blocos concluídos';
  $('#guidedStepText').textContent = ref ? `Step ${state.runtime.currentStep + 1}: ${ref.step.text}` : 'Sem step pendente';
  $('#timerText').textContent = ref?.step.timerSec ? `Timer: ${Math.floor(ref.step.timerSec / 60)} min` : 'Sem timer';
  $('#blocksList').innerHTML = state.dailyPlan.blocks.map((b, i) => `<li>${b.completed ? '✅' : '⬜'} ${i + 1}. ${b.name}</li>`).join('');

  $('#rankText').textContent = `Rank: ${ranks[Math.min(ranks.length - 1, Math.floor(state.game.level / 3))]}`;
  $('#phaseText').textContent = `Fase: ${phases[Math.min(phases.length - 1, Math.floor(state.game.streak / 7))]}`;
  $('#skillsTree').innerHTML = Object.entries(state.areaScores).slice(0, 5).map(([k, v]) => `<p>${k}: ${'█'.repeat(Math.floor(v / 10))}${'.'.repeat(10 - Math.floor(v / 10))}</p>`).join('');
  $('#achievementsList').innerHTML = state.game.achievements.map((a) => `<li>${a}</li>`).join('');

  renderAreas();
  renderTasks();

  const sched = state.scheduleProfiles[state.profile.routineProfile];
  $('#scheduleEditor').innerHTML = Object.entries(sched).map(([k, v]) => `<label>${k}<input type="time" data-skey="${k}" value="${v}"/></label>`).join('');
  $('#taskAreaSelect').innerHTML = Object.keys(AREAS).map((k) => `<option value="${k}">${AREAS[k].titulo}</option>`).join('');

  $('#goalSelect').value = state.profile.objective;
  $('#weightInput').value = state.profile.weight;
  $('#bfInput').value = state.profile.bf;
  $('#activitySelect').value = state.profile.activity;
  $('#routineProfileSelect').value = state.profile.routineProfile;
  $('#strictModeToggle').checked = state.profile.strictMode;
  $('#scanlineToggle').checked = state.profile.scanlines;
  $('#soundToggle').checked = state.profile.sound;
  $('#bgMusicToggle').checked = state.profile.bgMusic;
  $('#volumeRange').value = state.profile.volume;
  document.body.classList.toggle('scanlines', state.profile.scanlines);

  $('#weeklyReport').textContent = buildWeeklyReport();
  applyMusicSource();
}

function bind() {
  $$('.tabbar button').forEach((b) => b.onclick = () => openHub(b.dataset.hub));
  $('#startBtn').onclick = () => { beep('ok'); $('#bootOverlay').classList.remove('active'); if (state.profile.bgMusic && state.music.dataUrl) bgAudio.play().catch(() => {}); };
  $('#continueGuidedBtn').onclick = () => openHub('guiado');
  $('#completeStepBtn').onclick = () => completeStep(false);
  $('#skipStepBtn').onclick = () => completeStep(true);
  $('#impulseBtn').onclick = () => { state.dailyPlan.blocks.unshift(mkBlock('Anti-Impulso', ['Respiração 90s', 'Água', 'Caminhada 5min', 'Oração curta'])); state.runtime.currentBlock = 0; state.runtime.currentStep = 0; log('recaida', 'impulso'); toast('Modo recuperação ativado'); render(); openHub('guiado'); };

  $('#saveScheduleBtn').onclick = () => {
    const p = state.profile.routineProfile;
    $$('#scheduleEditor input').forEach((i) => { state.scheduleProfiles[p][i.dataset.skey] = i.value; });
    toast('Horários salvos'); saveState();
  };

  $('#goalSelect').onchange = (e) => { state.profile.objective = e.target.value; saveState(); };
  $('#weightInput').onchange = (e) => { state.profile.weight = Number(e.target.value || 0); saveState(); };
  $('#bfInput').onchange = (e) => { state.profile.bf = Number(e.target.value || 0); saveState(); };
  $('#activitySelect').onchange = (e) => { state.profile.activity = e.target.value; saveState(); };
  $('#routineProfileSelect').onchange = (e) => { state.profile.routineProfile = e.target.value; saveState(); render(); };
  $('#strictModeToggle').onchange = (e) => { state.profile.strictMode = e.target.checked; saveState(); };
  $('#scanlineToggle').onchange = (e) => { state.profile.scanlines = e.target.checked; saveState(); render(); };
  $('#soundToggle').onchange = (e) => { state.profile.sound = e.target.checked; saveState(); };
  $('#bgMusicToggle').onchange = (e) => { state.profile.bgMusic = e.target.checked; if (!e.target.checked) bgAudio.pause(); saveState(); };
  $('#volumeRange').oninput = (e) => { state.profile.volume = Number(e.target.value); bgAudio.volume = state.profile.volume; saveState(); };

  $('#addTaskBtn').onclick = () => {
    const title = $('#taskTitleInput').value.trim();
    const time = $('#taskTimeInput').value;
    const area = $('#taskAreaSelect').value;
    if (!title || !time) return toast('Preencha tarefa e horário');
    if (!state.customTasks[todayKey()]) state.customTasks[todayKey()] = [];
    state.customTasks[todayKey()].push({ title, time, area });
    $('#taskTitleInput').value = '';
    log('task_add', title);
    generatePlan(); saveState(); render(); toast('Tarefa adicionada');
  };

  $('#musicFileInput').onchange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      state.music = { name: file.name, dataUrl: String(reader.result || '') };
      saveState(); applyMusicSource(); toast('Música salva offline');
      if (state.profile.bgMusic) bgAudio.play().catch(() => toast('Toque START para liberar áudio'));
    };
    reader.readAsDataURL(file);
  };
  $('#playMusicBtn').onclick = () => { if (!state.music.dataUrl) return toast('Sem música'); bgAudio.play().then(() => toast('Play')).catch(() => toast('Toque START primeiro')); };
  $('#stopMusicBtn').onclick = () => { bgAudio.pause(); toast('Stop'); };
  $('#deleteMusicBtn').onclick = () => { bgAudio.pause(); state.music = { name: '', dataUrl: '' }; saveState(); render(); toast('Música apagada'); };

  $('#exportBackupBtn').onclick = () => exportData('json');
  $('#importBackupInput').onchange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    file.text().then((txt) => {
      const data = JSON.parse(txt);
      state.profile = { ...state.profile, ...(data.profile || {}) };
      state.areaScores = { ...state.areaScores, ...(data.areas || {}) };
      state.logs = Array.isArray(data.logs) ? data.logs : state.logs;
      saveState(); render(); toast('Backup importado');
    }).catch(() => toast('JSON inválido'));
  };
  $('#resetAllBtn').onclick = () => {
    state = structuredClone(defaultState);
    saveState(); generatePlan(); render(); toast('Reset total feito');
  };

  const logs = [['peso', 'Peso'], ['treino', 'Treino'], ['study', 'Estudo'], ['dieta', 'Dieta'], ['recaida', 'Recaída(aposta)']];
  $('#logButtons').innerHTML = logs.map(([k, t]) => `<button class="chip" data-log="${k}">${t}</button>`).join('');
  $$('[data-log]').forEach((b) => b.onclick = () => { log(b.dataset.log, b.dataset.log === 'recaida' ? 'aposta' : '1toque'); toast('Registro salvo'); render(); });
  $$('[data-export]').forEach((b) => b.onclick = () => exportData(b.dataset.export));
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
  if (nowHHMM() > state.scheduleProfiles[state.profile.routineProfile].dormir) toast('ALERTA VERMELHO: DORMIR');
  if ('serviceWorker' in navigator) navigator.serviceWorker.register('./sw.js');
  saveState();
}
init();
