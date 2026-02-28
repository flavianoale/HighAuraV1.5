/* ASCENSÃO OS PRO – offline single-file */
const APP_VERSION = 6;
const STORAGE_KEY = 'ascensao_os_state_v6';
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


const PERSONAL_PROFILE_DEFAULT = {
  weightKg:86,
  heightCm:171,
  age:23,
  bodyFatPct:25,
  trainingYears:1,
  trainingConsistency:'0-1 ano real',
  currentGym:'casa',
  goals:['Estética','Hipertrofia natural máxima','Força como consequência','Performance atlética secundária'],
  weakPoints:['Abdômen','Peitoral superior','Deltoide lateral','Largura de costas','Visual facial (redução de BF)'],
  style:'Hardcore agressivo com técnica disciplinada'
};

const PERSONAL_TRAINING_DB = {
  home:{
    program_name:'Fase 1 - Recomp Estética Natural 12 Semanas',
    split:'upper_lower_4x',
    frequency_per_week:4,
    schedule:['Upper_A','Lower_A','Rest','Upper_B','Lower_B'],
    progression_model:'double_progression',
    global_rules:{compound_rest_sec:150,isolation_rest_sec:75,last_set_extra_rest_sec:20,deload_trigger:{performance_drop_percent:8,fatigue_threshold:75,volume_multiplier:0.65}},
    sessions:[
      {name:'Upper_A',estimated_duration_min:60,exercises:[
        {name:'Barra Fixa Pronada',sets:4,reps_range:[6,8],RPE:8,cadence:{eccentric:3,pause:1,concentric:2},rest:180,focus:'largura_dorsal',type:'compound',muscle:'Costas'},
        {name:'Supino Inclinado Halter',sets:4,reps_range:[8,12],RPE:8,cadence:{eccentric:3,pause:1,concentric:1},rest:120,focus:'peitoral_superior',type:'compound',muscle:'Peito superior'},
        {name:'Remada Unilateral Halter',sets:3,reps_range:[8,12],RPE:8,cadence:{eccentric:2,pause:1,concentric:2},rest:120,focus:'espessura_costas',type:'compound',muscle:'Costas'},
        {name:'Elevação Lateral',sets:5,reps_range:[12,20],RPE:9,cadence:{eccentric:2,pause:1,concentric:2},rest:75,special:'ultima_serie_parciais',type:'isolation',muscle:'Deltoide lateral'},
        {name:'Crunch Controlado',sets:3,reps_range:[12,20],RPE:9,cadence:{eccentric:2,pause:1,concentric:2},rest:60,type:'core',muscle:'Abdômen'}
      ]},
      {name:'Lower_A',estimated_duration_min:55,exercises:[
        {name:'Goblet Squat',sets:4,reps_range:[8,12],RPE:8,cadence:{eccentric:3,pause:1,concentric:1},rest:150,type:'compound',muscle:'Quadríceps'},
        {name:'RDL Halter',sets:4,reps_range:[8,12],RPE:8,cadence:{eccentric:3,pause:1,concentric:1},rest:120,type:'compound',muscle:'Posterior'},
        {name:'Bulgarian Split Squat',sets:3,reps_range:[8,12],RPE:9,cadence:{eccentric:2,pause:1,concentric:2},rest:120,type:'compound',muscle:'Quadríceps/Glúteo'},
        {name:'Panturrilha Unilateral',sets:5,reps_range:[10,15],RPE:9,cadence:{eccentric:1,pause:2,concentric:1},rest:60,type:'isolation',muscle:'Panturrilha'}
      ]},
      {name:'Upper_B',estimated_duration_min:60,exercises:[
        {name:'Chin-Up',sets:4,reps_range:[5,8],RPE:8,cadence:{eccentric:3,pause:1,concentric:2},rest:180,type:'compound',muscle:'Costas'},
        {name:'Supino Halter no Chão',sets:4,reps_range:[6,10],RPE:8,cadence:{eccentric:3,pause:1,concentric:1},rest:150,type:'compound',muscle:'Peito'},
        {name:'Remada Curvada Halter',sets:3,reps_range:[8,12],RPE:9,cadence:{eccentric:3,pause:1,concentric:1},rest:120,type:'compound',muscle:'Costas'},
        {name:'Elevação Lateral',sets:4,reps_range:[15,20],RPE:9,cadence:{eccentric:2,pause:1,concentric:2},rest:60,type:'isolation',muscle:'Deltoide lateral'},
        {name:'Tríceps Francês',sets:3,reps_range:[10,14],RPE:9,cadence:{eccentric:3,pause:1,concentric:1},rest:75,type:'isolation',muscle:'Tríceps'}
      ]},
      {name:'Lower_B',estimated_duration_min:55,exercises:[
        {name:'Goblet Squat Pesado',sets:5,reps_range:[6,8],RPE:8,cadence:{eccentric:3,pause:1,concentric:1},rest:180,type:'compound',muscle:'Quadríceps'},
        {name:'RDL Halter',sets:3,reps_range:[8,10],RPE:8,cadence:{eccentric:3,pause:1,concentric:1},rest:150,type:'compound',muscle:'Posterior'},
        {name:'Passada Alternada',sets:3,reps_range:[10,14],RPE:9,cadence:{eccentric:2,pause:0,concentric:2},rest:120,type:'compound',muscle:'Pernas'},
        {name:'Panturrilha Bilateral',sets:4,reps_range:[12,20],RPE:9,cadence:{eccentric:1,pause:2,concentric:1},rest:60,type:'isolation',muscle:'Panturrilha'}
      ]}
    ]
  },
  gym:{
    program_name:'Academia Pro Natural 12 Semanas',
    split:'push_pull_legs_upper_lower',
    frequency_per_week:5,
    sessions:[
      {name:'Push',estimated_duration_min:75,exercises:[
        {name:'Supino Inclinado Barra',sets:4,reps_range:[6,8],RPE:8,cadence:{eccentric:3,pause:1,concentric:1},rest:180,type:'compound',muscle:'Peito superior'},
        {name:'Supino Reto Halter',sets:3,reps_range:[8,10],RPE:8,cadence:{eccentric:3,pause:1,concentric:1},rest:150,type:'compound',muscle:'Peito'},
        {name:'Crucifixo Cabo',sets:3,reps_range:[10,14],RPE:9,cadence:{eccentric:2,pause:1,concentric:2},rest:90,type:'isolation',muscle:'Peito'},
        {name:'Elevação Lateral Máquina',sets:5,reps_range:[12,20],RPE:9,cadence:{eccentric:2,pause:1,concentric:2},rest:75,type:'isolation',muscle:'Deltoide lateral'},
        {name:'Tríceps Corda',sets:3,reps_range:[10,14],RPE:9,cadence:{eccentric:2,pause:1,concentric:2},rest:75,type:'isolation',muscle:'Tríceps'}
      ]},
      {name:'Pull',estimated_duration_min:75,exercises:[
        {name:'Barra Fixa',sets:4,reps_range:[5,8],RPE:8,cadence:{eccentric:3,pause:1,concentric:2},rest:180,type:'compound',muscle:'Costas'},
        {name:'Puxada Alta Neutra',sets:3,reps_range:[8,12],RPE:8,cadence:{eccentric:2,pause:1,concentric:2},rest:150,type:'compound',muscle:'Costas'},
        {name:'Remada Baixa Cabo',sets:3,reps_range:[10,12],RPE:9,cadence:{eccentric:2,pause:1,concentric:2},rest:120,type:'compound',muscle:'Costas'},
        {name:'Pullover Cabo',sets:3,reps_range:[12,15],RPE:9,cadence:{eccentric:2,pause:1,concentric:2},rest:90,type:'isolation',muscle:'Costas'},
        {name:'Rosca Inclinado',sets:3,reps_range:[10,14],RPE:9,cadence:{eccentric:3,pause:1,concentric:2},rest:90,type:'isolation',muscle:'Bíceps'}
      ]},
      {name:'Legs',estimated_duration_min:80,exercises:[
        {name:'Agachamento Livre',sets:4,reps_range:[4,6],RPE:8,cadence:{eccentric:3,pause:1,concentric:1},rest:180,type:'compound',muscle:'Quadríceps'},
        {name:'Leg Press',sets:3,reps_range:[8,12],RPE:9,cadence:{eccentric:2,pause:1,concentric:2},rest:150,type:'compound',muscle:'Quadríceps'},
        {name:'Mesa Flexora',sets:3,reps_range:[10,14],RPE:9,cadence:{eccentric:2,pause:1,concentric:2},rest:120,type:'isolation',muscle:'Posterior'},
        {name:'Panturrilha em Pé',sets:5,reps_range:[10,15],RPE:9,cadence:{eccentric:1,pause:2,concentric:1},rest:75,type:'isolation',muscle:'Panturrilha'}
      ]},
      {name:'Upper',estimated_duration_min:70,exercises:[
        {name:'Supino Inclinado Halter',sets:3,reps_range:[8,10],RPE:8,cadence:{eccentric:3,pause:1,concentric:1},rest:120,type:'compound',muscle:'Peito superior'},
        {name:'Remada Máquina',sets:3,reps_range:[10,12],RPE:8,cadence:{eccentric:2,pause:1,concentric:2},rest:120,type:'compound',muscle:'Costas'},
        {name:'Puxada',sets:3,reps_range:[10,12],RPE:8,cadence:{eccentric:2,pause:1,concentric:2},rest:90,type:'compound',muscle:'Costas'},
        {name:'Lateral',sets:4,reps_range:[15,20],RPE:9,cadence:{eccentric:2,pause:1,concentric:2},rest:60,type:'isolation',muscle:'Deltoide lateral'}
      ]},
      {name:'Lower',estimated_duration_min:70,exercises:[
        {name:'Hack Squat',sets:4,reps_range:[8,10],RPE:8,cadence:{eccentric:3,pause:1,concentric:1},rest:150,type:'compound',muscle:'Quadríceps'},
        {name:'RDL',sets:3,reps_range:[8,10],RPE:8,cadence:{eccentric:3,pause:1,concentric:1},rest:150,type:'compound',muscle:'Posterior'},
        {name:'Extensora',sets:3,reps_range:[12,15],RPE:9,cadence:{eccentric:2,pause:1,concentric:2},rest:75,type:'isolation',muscle:'Quadríceps'},
        {name:'Panturrilha Sentado',sets:4,reps_range:[12,20],RPE:9,cadence:{eccentric:1,pause:2,concentric:1},rest:60,type:'isolation',muscle:'Panturrilha'}
      ]}
    ]
  }
};

const TRAINING_SQL_SCHEMA = `CREATE TABLE muscle_groups (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50),
  mev INT,
  mav_min INT,
  mav_max INT,
  mrv INT,
  rest_compound INT,
  rest_isolation INT,
  fatigue_factor DECIMAL(3,2)
);

CREATE TABLE exercises (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100),
  primary_muscle_id INT REFERENCES muscle_groups(id),
  type VARCHAR(20),
  stimulus_multiplier DECIMAL(3,2),
  fatigue_multiplier DECIMAL(3,2),
  equipment_type VARCHAR(20)
);

CREATE TABLE programs (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100),
  duration_weeks INT
);

CREATE TABLE sessions (
  id SERIAL PRIMARY KEY,
  program_id INT REFERENCES programs(id),
  name VARCHAR(50)
);

CREATE TABLE session_exercises (
  id SERIAL PRIMARY KEY,
  session_id INT REFERENCES sessions(id),
  exercise_id INT REFERENCES exercises(id),
  sets INT,
  rep_min INT,
  rep_max INT,
  rest INT,
  cadence_ecc INT,
  cadence_pause INT,
  cadence_con INT
);

CREATE TABLE user_performance (
  id SERIAL PRIMARY KEY,
  exercise_id INT,
  weight DECIMAL(6,2),
  reps INT,
  rpe DECIMAL(3,1),
  date DATE
);`;

const EXERCISE_VISUALS = {
  db_floor_press:'assets/exercises/db-floor-press.svg',
  pull_up:'assets/exercises/pull-up.svg',
  goblet_squat:'assets/exercises/goblet-squat.svg',
  rdl_db:'assets/exercises/rdl.svg',
  lateral_raise:'assets/exercises/lateral-raise.svg',
  curl:'assets/exercises/curl.svg',
  triceps_ext:'assets/exercises/triceps-ext.svg',
  calf_raise:'assets/exercises/calf-raise.svg'
};

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



const MUSCLE_GROUPS = [
  {id:'chest', name:'Peito', MEV:6, MAV_min:10, MAV_max:16, MRV:20, rest_compound_seconds:180, rest_isolation_seconds:90, tempo_default:'3-1-1', fatigue_factor:1.0},
  {id:'back', name:'Costas', MEV:8, MAV_min:12, MAV_max:18, MRV:22, rest_compound_seconds:180, rest_isolation_seconds:90, tempo_default:'2-1-2', fatigue_factor:1.1},
  {id:'quads', name:'Quadríceps', MEV:6, MAV_min:10, MAV_max:16, MRV:20, rest_compound_seconds:180, rest_isolation_seconds:90, tempo_default:'3-1-1', fatigue_factor:1.2},
  {id:'hamstrings', name:'Posterior', MEV:6, MAV_min:10, MAV_max:14, MRV:18, rest_compound_seconds:170, rest_isolation_seconds:90, tempo_default:'3-1-1', fatigue_factor:1.2},
  {id:'delts', name:'Deltoide lateral', MEV:6, MAV_min:10, MAV_max:18, MRV:22, rest_compound_seconds:150, rest_isolation_seconds:75, tempo_default:'2-1-2', fatigue_factor:0.9},
  {id:'biceps', name:'Bíceps', MEV:4, MAV_min:8, MAV_max:14, MRV:18, rest_compound_seconds:120, rest_isolation_seconds:75, tempo_default:'3-1-2', fatigue_factor:0.8},
  {id:'triceps', name:'Tríceps', MEV:4, MAV_min:8, MAV_max:14, MRV:18, rest_compound_seconds:120, rest_isolation_seconds:75, tempo_default:'2-1-2', fatigue_factor:0.85},
  {id:'calves', name:'Panturrilha', MEV:6, MAV_min:10, MAV_max:16, MRV:20, rest_compound_seconds:75, rest_isolation_seconds:60, tempo_default:'1-2-1', fatigue_factor:0.7}
];

const EXERCISES_DB = [
  {id:'db_floor_press', name:'Supino halteres no chão', primary_muscle_id:'chest', secondary_muscle_id:'triceps', type:'compound', resistance_curve:'mid', stimulus_multiplier:1.0, fatigue_multiplier:1.0, equipment_type:'casa'},
  {id:'pull_up', name:'Barra fixa', primary_muscle_id:'back', secondary_muscle_id:'biceps', type:'compound', resistance_curve:'lengthened', stimulus_multiplier:1.1, fatigue_multiplier:1.1, equipment_type:'ambos'},
  {id:'goblet_squat', name:'Agachamento goblet', primary_muscle_id:'quads', secondary_muscle_id:'hamstrings', type:'compound', resistance_curve:'lengthened', stimulus_multiplier:1.1, fatigue_multiplier:1.2, equipment_type:'casa'},
  {id:'rdl_db', name:'RDL com halteres', primary_muscle_id:'hamstrings', secondary_muscle_id:'back', type:'compound', resistance_curve:'lengthened', stimulus_multiplier:1.05, fatigue_multiplier:1.15, equipment_type:'ambos'},
  {id:'lateral_raise', name:'Elevação lateral', primary_muscle_id:'delts', secondary_muscle_id:'triceps', type:'isolation', resistance_curve:'shortened', stimulus_multiplier:0.95, fatigue_multiplier:0.75, equipment_type:'ambos'},
  {id:'curl', name:'Rosca alternada', primary_muscle_id:'biceps', secondary_muscle_id:'back', type:'isolation', resistance_curve:'lengthened', stimulus_multiplier:0.95, fatigue_multiplier:0.7, equipment_type:'ambos'},
  {id:'triceps_ext', name:'Tríceps francês', primary_muscle_id:'triceps', secondary_muscle_id:'chest', type:'isolation', resistance_curve:'lengthened', stimulus_multiplier:0.95, fatigue_multiplier:0.75, equipment_type:'ambos'},
  {id:'calf_raise', name:'Panturrilha', primary_muscle_id:'calves', secondary_muscle_id:'quads', type:'isolation', resistance_curve:'lengthened', stimulus_multiplier:0.9, fatigue_multiplier:0.6, equipment_type:'ambos'}
];

const PROGRAM_BLOCKS = [
  {phase:'Base', week_start:1, week_end:3, RPE_min:7.5, RPE_max:8.5, volume_multiplier:1.0},
  {phase:'Intensification', week_start:4, week_end:4, RPE_min:8.5, RPE_max:9.2, volume_multiplier:0.9},
  {phase:'Deload', week_start:5, week_end:5, RPE_min:6, RPE_max:6.5, volume_multiplier:0.65},
  {phase:'Base', week_start:6, week_end:8, RPE_min:7.8, RPE_max:8.8, volume_multiplier:1.05}
];

const REP_TO_1RM_PCT = {4:0.85,6:0.80,8:0.75,10:0.70,12:0.65};

const TAB_DEFS = [
  {id:'DASH',label:'HUD'},{id:'PROTO',label:'Protocolo'},{id:'DIETA',label:'Dieta'},{id:'TREINO',label:'Treino'},
  {id:'ESTUDO',label:'Estudo'},{id:'BIBLIA',label:'Bíblia'},{id:'TASKS',label:'Tarefas'},{id:'SOCIAL',label:'Social'},
  {id:'OPS',label:'Projetos'},{id:'LOG',label:'Finanças'},{id:'DIARIO',label:'Diário'},{id:'REL',label:'Relatórios'},{id:'CFG',label:'Config'}
];

const CHANGE_CHOICES = [
  {id:'study', title:'Estudar', tab:'ESTUDO', desc:'Foco total em estudo'},
  {id:'work', title:'Trabalhar', tab:'OPS', desc:'Executar trabalho/projeto'},
  {id:'train', title:'Treinar', tab:'TREINO', desc:'Sessão física completa'},
  {id:'plan', title:'Planejar', tab:'REL', desc:'Planejamento e revisão'},
  {id:'discipline', title:'Protocolo', tab:'PROTO', desc:'Rotina e disciplina'},
  {id:'tasks', title:'Tarefas', tab:'TASKS', desc:'Atacar pendências com prazo'}
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
    rpg:{xp:0,integrity:100,streak:0,level:1,rank:'Recruta',combo:0},
    bible:{idx:0,perDay:3}, bibleLog:{}, bibleLogAdv:{},
    training:{environment:'home',history:[],performance:[],oneRMByExercise:{},program:{track:'home',dayKey:'PUSH',week:1,session:null},naturalMode:true,anthro:{femur:'medio',braco:'medio',torso:'medio'},voice:{mode:'hardcore',intensity:2,frequency:'normal'},competition:{enabled:false,weeksUntilEvent:16,targetBodyFat:10,priorityMuscles:['delts','chest']}}, study:{history:[]},
    diet:{history:[]},
    proto:{itemsMorning:['Arrumar cama','Água','Skincare','Alongamento','Oração','Planejar dia'], itemsNight:['Higiene','Skincare','Exame rápido','Roupas','Oração','Dormir no horário'], history:[]},
    tasks:{byDate:{}},
    social:{history:[]}, ops:{history:[]}, finance:{history:[]},
    diary:{history:[]}, streakLog:{},
    ui:{drawerOpen:true, dopamineFx:true, attrs:{forca:55,vitalidade:52,foco:48,carisma:45,disciplina:50,sabedoria:47}},
    modeChange:{enabled:false, durationMin:45, active:null},
    profile:{...PERSONAL_PROFILE_DEFAULT},
    features:{
      mentorVoice:true, beeps:true, vibrateFx:true, auto10sWarn:true, autoWindowRedirect:true,
      strictNavigation:true, dopaminePopups:true, comboDecay:true, workoutAutoFlow:true,
      studyVoice:true, aiInsights:true
    },
    lastAction:null
  };
}

let S = loadState();
let activeTab = 'DASH';
let audioCtx, musicAudio;
let timer = {running:false, total:0, left:0, startedAt:0, paused:false, topic:''};
let timerInterval;
let workoutTimer = {running:false, mode:'idle', left:0, total:0, startedAt:0, paused:false};
let workoutInterval;
let cadenceRunner={running:false,phase:'idle',label:'Pronto',left:0,rep:0,targetReps:0,set:1,targetSets:1,startedAt:0,pause:false,log:[]};
let cadenceInterval;

const $ = (q)=>document.querySelector(q);
const view = $('#view'); const tabs = $('#tabs'); const toast = $('#toast');
const modal = $('#modal'); const modalTitle = $('#modalTitle'); const modalSub = $('#modalSub'); const modalBody = $('#modalBody');

function loadState(){ try{ const raw=localStorage.getItem(STORAGE_KEY); if(!raw) return defaultState(); return migrate(JSON.parse(raw)); }catch{return defaultState();} }
function migrate(st){ const d=defaultState(); return {...d,...st, theme:{...d.theme,...(st.theme||{})}, sounds:{...d.sounds,...(st.sounds||{})}, windows:{...d.windows,...(st.windows||{})}, targets:{...d.targets,...(st.targets||{})}, rpg:{...d.rpg,...(st.rpg||{})}, bible:{...d.bible,...(st.bible||{})}, tasks:{...d.tasks,...(st.tasks||{})}, ui:{...d.ui,...(st.ui||{}), attrs:{...d.ui.attrs,...(st.ui?.attrs||{})}}, modeChange:{...d.modeChange,...(st.modeChange||{})}, profile:{...d.profile,...(st.profile||{})}, features:{...d.features,...(st.features||{})}, training:{...d.training,...(st.training||{}), performance:[...(d.training.performance||[]), ...((st.training&&st.training.performance)||[])], oneRMByExercise:{...(d.training.oneRMByExercise||{}), ...((st.training&&st.training.oneRMByExercise)||{})}, program:{...d.training.program,...(st.training?.program||{})}, anthro:{...d.training.anthro,...(st.training?.anthro||{})}, voice:{...d.training.voice,...(st.training?.voice||{})}, competition:{...d.training.competition,...(st.training?.competition||{})}} }; }
function saveState(){ localStorage.setItem(STORAGE_KEY, JSON.stringify(S)); }
const featureOn = (k)=> !!(S.features?.[k]);

function applyTheme(){ document.body.classList.toggle('crt', !!(S.theme&&S.theme.crt)); }

function showToast(msg, ms=1500){ toast.textContent=msg; toast.classList.add('show'); setTimeout(()=>toast.classList.remove('show'), ms); }
function openModal(title, sub, bodyHtml){ modalTitle.textContent=title; modalSub.textContent=sub||''; modalBody.innerHTML=bodyHtml; modal.classList.add('show'); modal.setAttribute('aria-hidden','false'); }
function closeModal(){ modal.classList.remove('show'); modal.setAttribute('aria-hidden','true'); }
$('#modalClose').addEventListener('click', closeModal); modal.addEventListener('click', (e)=>{ if(e.target===modal) closeModal(); });

function beep(freq=880,dur=0.06,g=0.08){ if(!S.sounds.enabled || !featureOn('beeps')) return; try{ audioCtx = audioCtx || new (window.AudioContext||window.webkitAudioContext)(); const o=audioCtx.createOscillator(); const ga=audioCtx.createGain(); o.type='square'; o.frequency.value=freq; ga.gain.value=g*(S.sounds.volume||0.6); o.connect(ga); ga.connect(audioCtx.destination); o.start(); setTimeout(()=>o.stop(), dur*1000);}catch{} }

async function loadMusicIfAny(){ try{ const blob=await idb.get('music'); if(!blob) return; if(musicAudio){musicAudio.pause(); musicAudio=null;} const url=URL.createObjectURL(blob); musicAudio = new Audio(url); musicAudio.loop=true; musicAudio.volume=S.sounds.volume||0.6; }catch{} }
function startMusic(){ if(S.sounds.enabled && S.sounds.music && musicAudio){ musicAudio.volume=S.sounds.volume||0.6; musicAudio.play().catch(()=>{});} }
function stopMusic(){ if(musicAudio) musicAudio.pause(); }

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
  if(featureOn('vibrateFx') && navigator.vibrate) navigator.vibrate([18,35,18]);
  if(!featureOn('dopaminePopups')) return;
  const hud=document.querySelector('.hud');
  if(hud){ hud.classList.add('hud-boost'); setTimeout(()=>hud.classList.remove('hud-boost'), 500); }

  for(let i=0;i<8;i++){
    const spark=document.createElement('div');
    spark.className='spark';
    spark.style.left=`${x + (Math.random()*24-12)}px`;
    spark.style.top=`${y + (Math.random()*24-12)}px`;
    spark.style.setProperty('--dx', `${Math.random()*140-70}px`);
    spark.style.setProperty('--dy', `${-40 - Math.random()*120}px`);
    layer.appendChild(spark);
    setTimeout(()=>spark.remove(), 900);
  }
}

function microPulse(el){
  if(!el) return;
  el.classList.remove('pulse-hit');
  void el.offsetWidth;
  el.classList.add('pulse-hit');
  setTimeout(()=>el.classList.remove('pulse-hit'), 320);
}

function cadenceSpeak(state, ctx={}){ return VoiceEngine.dispatch(state, ctx); }


const VOICE_STATES = {
  PRE_WORKOUT:'PRE_WORKOUT', PRE_SET:'PRE_SET', ECCENTRIC:'ECCENTRIC', PAUSE:'PAUSE', CONCENTRIC:'CONCENTRIC',
  MID_SET_PUSH:'MID_SET_PUSH', LAST_REP_PUSH:'LAST_REP_PUSH', REST_START:'REST_START', REST_MID:'REST_MID', REST_END:'REST_END',
  LAST_SET_ALERT:'LAST_SET_ALERT', FATIGUE_WARNING:'FATIGUE_WARNING', PR_DETECTED:'PR_DETECTED', WORKOUT_COMPLETE:'WORKOUT_COMPLETE'
};

const VoiceEngine = {
  StateController:{state:VOICE_STATES.PRE_WORKOUT,set(next){this.state=next;},canSpeak(state,ctx={}){const cfg=S.training?.voice||{}; if(cfg.mode==='silent') return false; if(cfg.frequency==='reduced'&&[VOICE_STATES.ECCENTRIC,VOICE_STATES.PAUSE,VOICE_STATES.CONCENTRIC].includes(state)&&(ctx.rep||1)%2===0) return false; return true;}},
  ScriptLibrary:{
    PRE_WORKOUT:['Hoje você constrói o físico que outros só imaginam.','Disciplina acima da motivação.','Sem distrações. Só execução.'],
    PRE_SET:{compound:['Escápulas firmes. Base sólida.','Respira fundo. Estabiliza.','Essa série constrói estrutura.'],isolation:['Foco no músculo.','Conexão total.','Controle absoluto.']},
    ECCENTRIC:['Controla.','Sem deixar cair.','Força na descida.'],PAUSE:['Segura.','Tensão.','Não relaxa.'],CONCENTRIC:['Explode com controle.','Sobe firme.','Força limpa.'],
    MID_SET_PUSH:['Agora começa.','Mantém padrão.','Sem quebrar técnica.'],LAST_REP_PUSH:['Essa define você.','Mais uma.','Não negocia.'],
    REST_START:{compound:['Recuperação neural. 3 minutos.','Respiração profunda.'],isolation:['Controle a respiração.','Mais 60 segundos.']},REST_MID:['Mantém respiração controlada.','Recupera e organiza técnica.'],REST_END:['Prepara.','Foco.','Últimos segundos.'],
    LAST_SET_ALERT:['Última série.','Entrega técnica máxima.','Sem ego. Só execução.'],FATIGUE_WARNING:['Fadiga alta. Técnica acima de tudo.','Reduz velocidade se necessário.','Controle total.'],
    PR_DETECTED:['Novo recorde.','Evolução registrada.','Consistência vence talento.'],WORKOUT_COMPLETE:['Treino concluído.','Você construiu algo hoje.','Disciplina validada.'],
    SUB_PRIORITY:['Peito superior está atrasado. Hoje é prioridade.','Foco total nesse ângulo.','Constrói onde falta.'],
    EXCESS_WARNING:['Volume alto acumulado. Controle a execução.','Sem forçar além do necessário.'],
    PERFORMANCE_ALERT:['Performance caiu nas últimas semanas.','Foco na consistência.','Sem ego.'],
    WEAKPOINT_FOCUS:['Esse é seu ponto fraco.','Construa largura.','Ombro lateral define seu shape.'],
    POST_VALIDATE:['Disciplina executada.','Você fez o que precisava ser feito.','Consistência acima da motivação.'],
    POST_IDENTITY:['Você está construindo padrão.','Isso já não é esforço. É identidade.','Homens disciplinados vencem no longo prazo.'],
    POST_PROGRESS:['Evolução registrada.','Progresso mensurável.','Hoje você ficou mais forte.'],
    POST_PR:['Novo recorde.','Seu limite mudou.','Você não é mais o mesmo.'],
    POST_FATIGUE:['Recuperação agora é estratégica.','Sono e nutrição definem o próximo treino.'],
    POST_WEAKPOINT:['Você atacou seu ponto fraco.','O shape está sendo construído.'],
    POST_FUTURE:['Recupere bem. O próximo passo já está definido.'],
    COMP_PRE:['Você não está treinando. Você está sendo avaliado.','Cada repetição constrói o palco.','Sem margem para mediocridade.'],
    COMP_BF_HIGH:['O físico ainda está em construção.','Condicionamento define campeões.'],
    COMP_PRIORITY:['Esse músculo decide seu shape.','Construa largura.','Ombro lateral abre palco.'],
    COMP_HEAVY:['Controle sob pressão.','Força limpa.'],
    COMP_RPE9:['Agora você separa atletas de curiosos.','Última margem.','Mantém padrão sob fadiga.'],
    COMP_REST:['Respira. Visualiza palco.','Postura.','Controle mental.'],
    COMP_POST:['Sessão registrada.','Você avançou.','O físico está sendo lapidado.'],
    COMP_POST_STREAK:['Ritmo de atleta.','Continua.']
  },
  MuscleContextLayer:{chest:['Abre o peito.','Controle no alongamento.'],back:['Cotovelo para o quadril.','Dorsal contrai.'],delts:['Não rouba.','Lento na descida.'],quads:['Desce profundo.','Joelho estável.'],hamstrings:['Quadril para trás.','Alongamento máximo.'],calves:['Segura dois segundos.','Completo embaixo.'],core:['Costelas para baixo.','Contração total.']},
  pick(list, seed='x'){ if(!Array.isArray(list)||!list.length) return ''; const i=Math.abs(String(seed).split('').reduce((a,c)=>a+c.charCodeAt(0),0))%list.length; return list[i]; },
  resolve(state,ctx={}){ const compOn=ctx.mode==='competition'; if(compOn){ if(state===VOICE_STATES.PRE_WORKOUT) return this.pick(this.ScriptLibrary.COMP_PRE,ctx.session_type||ctx.exerciseName); if(state===VOICE_STATES.PRE_SET && Number(ctx.current_bodyfat||0)>Number(ctx.target_bodyfat||10)+4) return this.pick(this.ScriptLibrary.COMP_BF_HIGH,ctx.exerciseName); if(state===VOICE_STATES.PRE_SET && (ctx.isPriorityMuscle||false)) return this.pick(this.ScriptLibrary.COMP_PRIORITY,ctx.exerciseName); if([VOICE_STATES.MID_SET_PUSH,VOICE_STATES.LAST_REP_PUSH].includes(state) && Number(ctx.rpe||8)>=9) return this.pick(this.ScriptLibrary.COMP_RPE9,ctx.exerciseName); if(state===VOICE_STATES.REST_START) return this.pick(this.ScriptLibrary.COMP_REST,ctx.exerciseName); if(state===VOICE_STATES.WORKOUT_COMPLETE){ if((ctx.consistency_streak_days||0)>=7) return this.pick(this.ScriptLibrary.COMP_POST_STREAK,ctx.exerciseName); return this.pick(this.ScriptLibrary.COMP_POST,ctx.exerciseName);} } if((ctx.fatigueScore||0)>70 && [VOICE_STATES.PRE_SET,VOICE_STATES.REST_START].includes(state)) state=VOICE_STATES.FATIGUE_WARNING; if(state===VOICE_STATES.PRE_SET){ if((ctx.mav_percent||100)<70) return this.pick(this.ScriptLibrary.SUB_PRIORITY,ctx.exerciseName); if((ctx.mav_percent||0)>130) return this.pick(this.ScriptLibrary.EXCESS_WARNING,ctx.exerciseName); if((ctx.fatigue_score||0)>70) return this.pick(this.ScriptLibrary.FATIGUE_WARNING,ctx.exerciseName); if((ctx.isWeakPoint||false)) return this.pick(this.ScriptLibrary.WEAKPOINT_FOCUS,ctx.exerciseName); const t=ctx.exerciseType==='compound'?'compound':'isolation'; return this.pick(this.ScriptLibrary.PRE_SET[t],ctx.exerciseName);} if(state===VOICE_STATES.REST_START){const t=ctx.exerciseType==='compound'?'compound':'isolation'; return this.pick(this.ScriptLibrary.REST_START[t],ctx.exerciseName);} if(state===VOICE_STATES.WORKOUT_COMPLETE && (ctx.trend_pct||0)<-5) return this.pick(this.ScriptLibrary.PERFORMANCE_ALERT,ctx.exerciseName); return this.pick(this.ScriptLibrary[state]||[],`${ctx.exerciseName||''}${ctx.rep||1}${ctx.setNo||1}`); },
  enrich(text,ctx={}){ const cfg=S.training?.voice||{}; const phasePrefix=ctx.phase==='deload'?'Semana estratégica. Recuperar é evoluir. ':ctx.phase==='intensification'?'Bloco de intensificação. ':ctx.phase==='base'?'Base técnica. ':''; const cue=this.pick(this.MuscleContextLayer[ctx.muscleId]||[],`${ctx.exerciseName||''}${ctx.rep||1}`); const base=`${phasePrefix}${text}`.trim(); const withCue=(cfg.mode==='hardcore'&&cue&&[VOICE_STATES.PRE_SET,VOICE_STATES.ECCENTRIC,VOICE_STATES.CONCENTRIC].includes(ctx.state))?`${base} ${cue}`:base; const level=Number(cfg.intensity||2); if(level>=3||Number(ctx.rpe||8)>=10) return `Máximo foco. ${withCue.split('. ')[0]}.`; if(level===2||Number(ctx.rpe||8)>=9||ctx.phase==='intensification') return `Firme. ${withCue}`; return withCue; },
  dispatch(state,ctx={}){ if(!this.StateController.canSpeak(state,ctx)) return; this.StateController.set(state); const raw=this.resolve(state,ctx); if(!raw) return; mentorSpeak(this.enrich(raw,{...ctx,state})); },
  preSet(ex,ctx={}){ this.dispatch(VOICE_STATES.PRE_SET,{...ctx,exerciseName:ex.name,exerciseType:ex.type,muscleId:ex.primary_muscle_id}); },
  eccentric(ctx={}){ this.dispatch(VOICE_STATES.ECCENTRIC,ctx); }, pause(ctx={}){ this.dispatch(VOICE_STATES.PAUSE,ctx); }, concentric(ctx={}){ this.dispatch(VOICE_STATES.CONCENTRIC,ctx); },
  restStart(ctx={}){ this.dispatch(VOICE_STATES.REST_START,ctx); }, restEnd(ctx={}){ this.dispatch(VOICE_STATES.REST_END,ctx); }, lastSet(ctx={}){ this.dispatch(VOICE_STATES.LAST_SET_ALERT,ctx); },
  fatigueWarning(ctx={}){ this.dispatch(VOICE_STATES.FATIGUE_WARNING,ctx); }, prDetected(ctx={}){ this.dispatch(VOICE_STATES.PR_DETECTED,ctx); }, workoutComplete(ctx={}){ this.dispatch(VOICE_STATES.WORKOUT_COMPLETE,ctx); },
  postWorkoutCoach(input={}){
    if(!input.workout_completed) return;
    const seq=[];
    seq.push(this.pick(this.ScriptLibrary.POST_VALIDATE,'val'));
    if(input.new_pr) seq.push(this.pick(this.ScriptLibrary.POST_PR,'pr'));
    if((input.volume_vs_last_week_percent||0)>0) seq.push(this.pick(this.ScriptLibrary.POST_PROGRESS,'vol'));
    if((input.consistency_streak_days||0)>=7) seq.push(this.pick(this.ScriptLibrary.POST_IDENTITY,'id'));
    const weakIds=(S.profile?.weakPoints||[]).map(mapWeakPointToMuscleId).filter(Boolean);
    if((input.target_muscles_trained||[]).some(m=>weakIds.includes(m))) seq.push(this.pick(this.ScriptLibrary.POST_WEAKPOINT,'weak'));
    if((input.fatigue_score||0)>70) seq.push(this.pick(this.ScriptLibrary.POST_FATIGUE,'fat'));
    if(input.mode==='competition'){
      seq.push(this.pick(this.ScriptLibrary.COMP_POST,'cpost'));
      if((input.consistency_streak_days||0)>=7) seq.push(this.pick(this.ScriptLibrary.COMP_POST_STREAK,'cstreak'));
    }
    seq.push(this.pick(this.ScriptLibrary.POST_FUTURE,'future'));
    const phrase=seq.filter(Boolean).join(' ');
    if(phrase) mentorSpeak(phrase);
  }
};

function cadenceStartPhase(sec, label, onEnd){
  cadenceRunner.phase=label;
  cadenceRunner.label=label;
  cadenceRunner.left=sec;
  cadenceRunner.startedAt=Date.now();
  clearInterval(cadenceInterval);
  cadenceInterval=setInterval(()=>{
    if(!cadenceRunner.running || cadenceRunner.pause) return;
    cadenceRunner.left=Math.max(0, sec - Math.floor((Date.now()-cadenceRunner.startedAt)/1000));
    const big=$('#cadBig'); const lbl=$('#cadLabel'); const rep=$('#cadRepLine');
    if(big) big.textContent=fmtTimerSec(cadenceRunner.left);
    if(lbl) lbl.textContent=cadenceRunner.label;
    if(rep) rep.textContent=`REP ${cadenceRunner.rep}/${cadenceRunner.targetReps} • SÉRIE ${cadenceRunner.set}/${cadenceRunner.targetSets}`;
    if(cadenceRunner.left<=0){ clearInterval(cadenceInterval); if(onEnd) onEnd(); }
  },250);
}

function startCadenceSetFlow(exObj, opts={}){
  const reps=opts.repsTarget||Math.round((exObj.reps_range?.[0]+exObj.reps_range?.[1])/2)||8;
  cadenceRunner={...cadenceRunner,running:true,pause:false,rep:1,targetReps:reps,set:opts.setNo||1,targetSets:opts.sets||exObj.sets||1,log:[]};
  VoiceEngine.dispatch(VOICE_STATES.PRE_WORKOUT,{exerciseName:exObj.name,phase:opts.phase||'base',rpe:Number(exObj.RPE||8),...opts});
  VoiceEngine.preSet({name:exObj.name,type:exObj.type,primary_muscle_id:exObj.primary_muscle_id||'chest'},{phase:opts.phase||'base',rpe:Number(exObj.RPE||8),setNo:opts.setNo||1,fatigueScore:opts.fatigueScore||0,exerciseType:exObj.type||'compound',mav_percent:opts.mavPercent||100,trend_pct:opts.trend||0,isWeakPoint:!!opts.isWeakPoint,isPriorityMuscle:!!opts.isPriorityMuscle,...opts});
  if((opts.setNo||1)>=(opts.sets||exObj.sets||1)) VoiceEngine.lastSet({exerciseName:exObj.name,phase:opts.phase||'base',rpe:Number(exObj.RPE||8)});
  const cad=exObj.cadence_seconds||{eccentric:3,pause:1,concentric:1};
  const runRep=()=>{
    cadenceStartPhase(cad.eccentric,'Descida',()=>{
      VoiceEngine.eccentric({exerciseName:exObj.name,rep:cadenceRunner.rep,setNo:cadenceRunner.set,phase:opts.phase||'base',rpe:Number(exObj.RPE||8),muscleId:exObj.primary_muscle_id||'chest'});
      cadenceStartPhase(cad.pause,'Pausa',()=>{
        VoiceEngine.pause({exerciseName:exObj.name,rep:cadenceRunner.rep,setNo:cadenceRunner.set,phase:opts.phase||'base',rpe:Number(exObj.RPE||8)});
        cadenceStartPhase(cad.concentric,'Subida',()=>{
          VoiceEngine.concentric({exerciseName:exObj.name,rep:cadenceRunner.rep,setNo:cadenceRunner.set,phase:opts.phase||'base',rpe:Number(exObj.RPE||8),muscleId:exObj.primary_muscle_id||'chest'});
          if(cadenceRunner.rep>=Math.ceil(cadenceRunner.targetReps*0.6)) VoiceEngine.dispatch(VOICE_STATES.MID_SET_PUSH,{exerciseName:exObj.name,rep:cadenceRunner.rep,setNo:cadenceRunner.set,phase:opts.phase||'base',rpe:Number(exObj.RPE||8),isPriorityMuscle:!!opts.isPriorityMuscle,...opts});
          if(cadenceRunner.rep===cadenceRunner.targetReps-1) VoiceEngine.dispatch(VOICE_STATES.LAST_REP_PUSH,{exerciseName:exObj.name,rep:cadenceRunner.rep,setNo:cadenceRunner.set,phase:opts.phase||'base',rpe:Number(exObj.RPE||8),isPriorityMuscle:!!opts.isPriorityMuscle,...opts});
          if(cadenceRunner.rep < cadenceRunner.targetReps){ cadenceRunner.rep+=1; runRep(); }
          else {
            cadenceRunner.running=false;
            cadenceRunner.label='Execução concluída';
            const big=$('#cadBig'); if(big) big.textContent='00:00';
            const rest=scientificRestSeconds({type:exObj.type, primary_muscle_id:(exObj.muscle||'').toLowerCase().includes('pant')?'calves':'chest'}, cadenceRunner.set>=cadenceRunner.targetSets);
            VoiceEngine.restStart({exerciseName:exObj.name,setNo:cadenceRunner.set,phase:opts.phase||'base',rpe:Number(exObj.RPE||8),exerciseType:exObj.type||'compound'});
            startWorkoutTimer(rest,'rest');
          }
        });
      });
    });
  };
  runRep();
}

function stopCadenceFlow(){ cadenceRunner.running=false; clearInterval(cadenceInterval); cadenceRunner.label='Interrompido'; const big=$('#cadBig'); if(big) big.textContent='00:00'; }

const AnalyticsDashboard = {
  summary(k){
    const weeklyStats=getWeeklyMuscleStats();
    const trainedMin=Math.round((S.training.history.filter(x=>x.date===k).length*4.5));
    const consistency=Math.min(100, Math.round((S.training.history.slice(-28).length/20)*100));
    return {weeklyStats,trainedMin,consistency};
  }
};

const IntegrationLayer = {
  performanceGlobal(){ return computePerformanceGlobalScore(); },
  trainingContribution(){ return Math.round(computePerformanceGlobalScore().treino*0.4); }
};
function mentorSpeak(text){
  if(!S.sounds.enabled || !featureOn('mentorVoice') || !('speechSynthesis' in window)) return;
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
  workoutTimer={running:true,mode,left:sec,total:sec,startedAt:Date.now(),paused:false,warned10:false,warnedMid:false};
  beep(mode==='exec'?980:620,.08,.1);
  mentorSpeak(mode==='exec' ? 'Iniciando execução da série. Controle total.' : 'Iniciando descanso. Respire e prepare a próxima série.');
  clearInterval(workoutInterval);
  workoutInterval=setInterval(()=>{
    if(!workoutTimer.running||workoutTimer.paused) return;
    workoutTimer.left=Math.max(0, workoutTimer.total - Math.floor((Date.now()-workoutTimer.startedAt)/1000));
    const el=$('#workTimerBig'); const state=$('#workTimerState');
    if(el) el.textContent=fmtTimerSec(workoutTimer.left);
    if(state) state.textContent=workoutTimer.mode==='exec'?'EXECUÇÃO':'DESCANSO';

    if(workoutTimer.mode==='rest' && !workoutTimer.warnedMid && workoutTimer.left===Math.floor(workoutTimer.total/2)){ workoutTimer.warnedMid=true; VoiceEngine.dispatch(VOICE_STATES.REST_MID,{}); }

    if(featureOn('auto10sWarn') && workoutTimer.left===10 && !workoutTimer.warned10){
      workoutTimer.warned10=true;
      beep(1400,.06,.11);
      VoiceEngine.restEnd({});
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

function weeklyTrainingSets(offsetWeeks=0){
  const now=new Date();
  const d=new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const day=d.getDay();
  const diff=(day+6)%7;
  d.setDate(d.getDate()-diff - offsetWeeks*7);
  const start=new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const end=new Date(start); end.setDate(end.getDate()+7);
  return (S.training.history||[]).filter(x=>{
    const t=new Date(x.date).getTime();
    return t>=start.getTime() && t<end.getTime();
  }).length;
}
function buildPostWorkoutCoachingInputs(){
  const ses=S.training.program.session||{};
  const duration_minutes=Math.max(1, Math.round(((Date.now()-(ses.startedAt||Date.now()))/60000)));
  const thisWeek=weeklyTrainingSets(0);
  const lastWeek=weeklyTrainingSets(1);
  const volume_vs_last_week_percent = lastWeek>0 ? Number((((thisWeek-lastWeek)/lastWeek)*100).toFixed(1)) : (thisWeek>0?100:0);
  const fatigue_score=Math.max(0, Math.min(100, trainingAnalytics().fatigue||0));
  const k=todayKey();
  const target_muscles_trained=[...new Set((S.training.history||[]).filter(x=>x.date===k).map(x=>{const ex=getExerciseDefByName(x.exercise||'');return ex?.primary_muscle_id||'';}).filter(Boolean))];
  const comp=getCompetitionContext(S.training.program?.dayKey||'');
  return {
    workout_completed:true,
    duration_minutes,
    volume_vs_last_week_percent,
    new_pr:!!ses.prHit,
    consistency_streak_days:Number(S.rpg.streak||0),
    fatigue_score,
    target_muscles_trained,
    ...comp
  };
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
    const coachInput=buildPostWorkoutCoachingInputs();
    VoiceEngine.workoutComplete(coachInput);
    VoiceEngine.postWorkoutCoach(coachInput);
  }
  saveState();
}

function estimate1RMRounded(load,reps){ if(!load||!reps) return 0; return Math.round(load*(1+reps/30)); }
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


function getCompetitionContext(session_type=''){
  const comp=S.training?.competition||{};
  return {
    mode: comp.enabled ? 'competition' : 'normal',
    weeks_until_event: Number(comp.weeksUntilEvent||16),
    current_bodyfat: Number(S.targets?.bfPct||S.profile?.bodyFatPct||22),
    target_bodyfat: Number(comp.targetBodyFat||10),
    priority_muscles: comp.priorityMuscles||['delts','chest'],
    fatigue_score: trainingAnalytics().fatigue,
    session_type
  };
}
function mapWeakPointToMuscleId(text=''){
  const t=String(text).toLowerCase();
  if(t.includes('peito')) return 'chest';
  if(t.includes('costa')) return 'back';
  if(t.includes('deltoide')||t.includes('ombro')) return 'delts';
  if(t.includes('abd')) return 'core';
  if(t.includes('quadr')) return 'quads';
  if(t.includes('posterior')) return 'hamstrings';
  if(t.includes('pant')) return 'calves';
  return '';
}
function getVoiceDashboardContext(exDef, payload){
  const muscleId=exDef?.primary_muscle_id || 'chest';
  const m=(payload?.muscles||[]).find(x=>x.muscle_id===muscleId) || null;
  const weakIds=(S.profile?.weakPoints||[]).map(mapWeakPointToMuscleId).filter(Boolean);
  return {
    muscleId,
    status:m?.status||'ideal',
    mav_percent:m?.mav_percent||100,
    fatigue_score:m?.fatigue_score||0,
    trend_pct:m?.trend_pct||0,
    priority:m?.priority||'normal',
    isWeakPoint:weakIds.includes(muscleId)
  };
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
  const week=S.training.program.week||1;
  const phaseName=getPhase(week);
  const phaseObj=phaseConfig(phaseName);
  const activeProgram=ProgramGenerator.getProgram(env);
  const weeklyStats=getWeeklyMuscleStats();
  const deterministic=generateDeterministicWorkout({days:env==='home'?4:5, environment:env==='home'?'casa':'academia', level:'intermediario', phase:phaseName==='base'?'Base':phaseName==='intensification'?'Intensification':phaseName==='deload'?'Deload':'Base', weeklyStats});
  const autoDeload=shouldAutoDeload(weeklyStats);
  const globalScore=computePerformanceGlobalScore();
  const dashboardPayload=getMuscleDashboardPayload();
  const profile=S.profile||PERSONAL_PROFILE_DEFAULT;
  const weakTargets=(profile.weakPoints||[]).join(' • ');
  const coachTone=profile.style||'Hardcore técnico';
  const {track,prog,dayKey,exercises}=getProgramAndDay();
  const personalSession = ProgramGenerator.getSession(dayKey, env);
  const sessionWithPhase = ProgramGenerator.applyPhaseVolume(personalSession, phaseObj.volume_multiplier || 1);
  const profileOneRM = Math.max(40, Math.round((S.targets.weightKg||86)*1.1));
  if(autoDeload && S.training.program.week!==5){
    S.training.program.week=5;
    showToast('Deload automático: volume 0.65x e RPE alvo 6');
    saveState();
  }
  if(!S.training.program.session) S.training.program.session={active:false,exIndex:0,setNo:1};
  const session=S.training.program.session;
  const exNow=currentProgramExercise();
  const phaseTxt = `${phaseName.toUpperCase()} (vol x${phaseObj.volume_multiplier})`;

  view.innerHTML=`<div class='card'><div class='kpi'><div><div class='big'>Treino Programado</div><div class='small'>${activeProgram.program_name} • ${activeProgram.split}</div></div><button class='btn' id='btnEnv'>TROCAR AMBIENTE</button></div>
  <div class='grid'>
    <div class='g6'><label>Plano</label><select id='trainTrack'><option value='home'>Casa</option><option value='gym'>Academia</option></select></div>
    <div class='g6'><label>Dia do treino</label><select id='trainDay'>${prog.split.map((d)=>`<option value='${d}'>${d}</option>`).join('')}</select></div>
    <div class='g6'><label>Semana do bloco (1-12)</label><input id='trainWeek' type='range' min='1' max='12' step='1' value='${week}'></div>
    <div class='g6'><label>Fase atual</label><input value='${phaseTxt}' disabled></div>
  </div>
  <div class='hint'>Periodização 12 semanas automática ativa.</div>
  <div class='row'><button class='btn primary' id='btnStartProgram'>INICIAR SESSÃO PROGRAMADA</button><button class='btn' id='btnResetProgram'>RESETAR SESSÃO</button></div>
  </div>

  <div class='card'><h2>Coach Briefing Personalizado</h2><div class='list'><div class='item'><div><div class='name'>Seu perfil</div><div class='meta'>${profile.weightKg}kg • ${profile.heightCm}cm • ${profile.age} anos • BF ${profile.bodyFatPct}% • treino consistente ${profile.trainingConsistency}</div></div><span class='badge'>Personalizado</span></div><div class='item'><div><div class='name'>Objetivo principal</div><div class='meta'>${(profile.goals||[]).join(' • ')}</div></div><span class='badge'>Foco</span></div><div class='item'><div><div class='name'>Pontos fracos atacados</div><div class='meta'>${weakTargets}</div></div><span class='badge'>Prioridade</span></div><div class='item'><div><div class='name'>Estilo do treinador</div><div class='meta'>${coachTone}. Sem enrolação: execução perfeita, progressão contínua e consistência diária.</div></div><span class='badge'>Hardcore</span></div></div></div>

  <div class='card'><h2>Guia Intuitivo (passo a passo)</h2><div class='hint'>Aquecimento 8-10 min: mobilidade 2 min + 2 séries rampa no primeiro exercício. Regra de progressão: topo da faixa com RPE ≤8 = +2% carga.</div><div class='list'>${(sessionWithPhase?.exercises||[]).map((e,i)=>{ const repTarget=Math.round((e.reps_range[0]+e.reps_range[1])/2); const targetLoad=ProgramGenerator.targetLoadFrom1RM(profileOneRM, repTarget); return `<div class='item'><div><div class='name'>${i+1}) ${e.name}</div><div class='meta'>${e.sets} séries • ${e.reps_range[0]}-${e.reps_range[1]} reps • RPE ${e.RPE_target||e.RPE||8} • Cadência ${e.cadence.eccentric}-${e.cadence.pause}-${e.cadence.concentric} • Descanso ${e.rest_sec||e.rest||90}s • Carga alvo ~${targetLoad}kg<br>Coach: ${e.type==='compound'?'Controle técnico e sem ego.':'Busca conexão mente-músculo total.'}</div></div><span class='badge'>${e.muscle||e.focus||'Foco'}</span></div>`}).join('')}</div></div>

  <div class='card'><h2>Plano do dia (${dayKey})</h2><div class='list'>${exercises.map((e,i)=>`<div class='item'><div><div class='name'>${i+1}. ${e.name}</div><div class='meta'>${e.sets}x${e.reps} • RPE ${e.rpe} • tempo ${e.tempo} • descanso ${Math.round(e.rest/60)}-${e.rest%60?':30':''} min<br>${e.tip}</div></div><span class='badge'>${e.sets} sets</span></div>`).join('')}</div></div>

  <div class='card'><h2>Core Fisiológico Determinístico</h2><div class='hint'>Split ${deterministic.split} • Bloco ${deterministic.block.phase} (${deterministic.block.RPE_min}-${deterministic.block.RPE_max}) • Mult volume ${deterministic.volumeMultiplier}</div><div class='list'>${deterministic.picks.map((e,i)=>`<div class='item'><div style='display:flex; gap:10px; align-items:center'><img class='ex-thumb' src='${EXERCISE_VISUALS[e.id]||'assets/icon.svg'}' alt='${e.name}'><div><div class='name'>${i+1}. ${e.name}</div><div class='meta'>${e.type} • curva ${e.resistance_curve} • estímulo ${e.stimulus_multiplier}<br>Explicação: ${e.primary_muscle_id==='chest'?'Peitoral superior e estabilidade de ombro.':e.primary_muscle_id==='back'?'Largura dorsal e força de puxada.':e.primary_muscle_id==='delts'?'Deltoide lateral para estética 3D.':e.primary_muscle_id==='quads'?'Base de força e pernas densas.':e.primary_muscle_id==='hamstrings'?'Posterior forte para proteção lombar.':'Foco local com técnica.'}</div></div></div><span class='badge'>${e.type==='compound'?deterministic.repRange.compound:deterministic.repRange.isolation}</span></div>`).join('')}</div><div class='item'><div><div class='name'>Distribuição por sessão</div><div class='meta'>40% composto principal • 30% composto secundário • 20% isolador • 10% alongada</div></div><span class='badge'>ok</span></div><div class='item'><div><div class='name'>Deload automático</div><div class='meta'>${autoDeload?'ATIVAR: fadiga/queda > limiar':'Normal'} • queda >8% em 2 sessões = -20% volume</div></div><span class='badge'>${autoDeload?'DELOAD':'NORMAL'}</span></div><div class='list'>${MUSCLE_GROUPS.map(m=>{const st=weeklyStats[m.id]; return `<div class='item'><div><div class='name'>${m.name}</div><div class='meta'>eReps ${st.weeklyEffectiveReps.toFixed(1)} • fadiga ${st.fatigue.toFixed(1)} • sets ${st.weeklySets}</div></div><span class='badge'>${st.status}</span></div>`}).join('')}</div><div class='item'><div><div class='name'>PerformanceGlobalScore</div><div class='meta'>Treino ${globalScore.treino}% • Sono ${globalScore.sleep}% • Disciplina ${globalScore.disciplina}% • Foco ${globalScore.foco}%</div></div><span class='badge'>${globalScore.score}</span></div><div class='row'><button class='btn' id='btnDetApplyDeload'>APLICAR DELOAD 0.65x</button></div></div>

  ${muscleDashboardHTML(dashboardPayload)}

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

  <div class='card'><h2>Timer de Cadência Real</h2>
    <div class='kpi'><div><div class='big' id='cadLabel'>${cadenceRunner.label||'Pronto'}</div><div class='small' id='cadRepLine'>REP ${cadenceRunner.rep||0}/${cadenceRunner.targetReps||0} • SÉRIE ${cadenceRunner.set||1}/${cadenceRunner.targetSets||1}</div></div><span class='badge'>E-P-C</span></div>
    <div class='big' id='cadBig'>${fmtTimerSec(cadenceRunner.left||0)}</div>
    <div class='row'>
      <button class='btn primary' id='btnCadenceStart'>INICIAR TIMER CADÊNCIA</button>
      <button class='btn' id='btnCadencePause'>PAUSAR/RETOMAR</button>
      <button class='btn danger' id='btnCadenceStop'>PARAR</button>
      <button class='btn' id='btnCadenceAdvance'>AVANÇAR MANUAL</button>
    </div>
    <div class='hint'>Execução: Descida → Pausa → Subida por rep. Descanso com aviso nos 10s finais. Pode avançar manual se terminar antes.</div>
  </div>

  <div class='card'><h2>Analytics Dashboard</h2><div class='list'>${(()=>{const a=AnalyticsDashboard.summary(k); return `<div class='item'><div><div class='name'>Tempo total treinado hoje</div><div class='meta'>${a.trainedMin} min estimados</div></div><span class='badge'>tempo</span></div><div class='item'><div><div class='name'>Consistência (4 semanas)</div><div class='meta'>Frequência de sessões registradas</div></div><span class='badge'>${a.consistency}%</span></div>`})()}</div><div class='item'><div><div class='name'>Integração com score global</div><div class='meta'>Treino vale 40% do PerformanceGlobalScore</div></div><span class='badge'>${IntegrationLayer.performanceGlobal().score}</span></div>
  </div>

  <div class='card'><h2>Registro rápido manual</h2><div class='kpi'><div><div class='big'>Treino manual</div><div class='small'>Ambiente: ${env==='home'?'Casa':'Academia'} • sets hoje: ${today.length}</div></div></div><div class='grid'><div class='g6'><label>Grupo</label><select id='selGroup'>${Object.keys(lib).map(g=>`<option>${g}</option>`).join('')}</select></div><div class='g6'><label>Exercício</label><select id='selEx'></select></div><div class='g6'><label>Reps</label><select id='selReps'><option>5</option><option>8</option><option>10</option><option>12</option><option>15</option></select></div><div class='g6'><label>Carga</label><select id='selLoad'><option>0</option><option>5</option><option>10</option><option>15</option><option>20</option><option>30</option><option>40</option></select></div><div class='g12'><button class='btn primary wide' id='btnAddSet'>REGISTRAR 1 SET</button></div></div></div>

  <div class='card'><h2>Sets de hoje</h2><div class='list'>${today.length?today.map((x,i)=>`<div class='item'><div><div class='name'>${x.group} • ${x.exercise}</div><div class='meta'>${x.sets[0].reps} reps • ${x.sets[0].load}kg</div></div><span class='badge'>#${i+1}</span></div>`).join(''):'<div class="hint">Nenhum set.</div>'}</div><div class='row'><button class='btn' id='btnTrainUndo'>DESFAZER</button><button class='btn danger' id='btnTrainReset'>RESET HOJE</button></div></div>`;

  $('#trainTrack').value=track;
  $('#trainDay').value=dayKey;
  $('#trainTrack').onchange=(e)=>{ S.training.program.track=e.target.value; const np=TRAINING_PROGRAMS[e.target.value]; S.training.program.dayKey=np.split[0]; S.training.environment=e.target.value; saveState(); render(); };
  $('#trainDay').onchange=(e)=>{ S.training.program.dayKey=e.target.value; saveState(); render(); };
  $('#trainWeek').oninput=(e)=>{ S.training.program.week=Number(e.target.value); saveState(); render(); };
  $('#btnStartProgram').onclick=()=>{ S.training.program.session={active:true,exIndex:0,setNo:1,startedAt:Date.now(),prHit:false}; const compCtx=getCompetitionContext(dayKey); VoiceEngine.dispatch(VOICE_STATES.PRE_WORKOUT,{...compCtx,session_type:dayKey}); saveState(); showToast('Sessão iniciada'); render(); };
  $('#btnResetProgram').onclick=()=>{ S.training.program.session={active:false,exIndex:0,setNo:1,startedAt:null,prHit:false}; stopWorkoutTimer(); saveState(); render(); };
  const detDeload=$('#btnDetApplyDeload');
  if(detDeload) detDeload.onclick=()=>{ S.training.program.week=5; exercises.forEach(e=>{ e.sets=Math.max(1, Math.round(e.sets*0.65)); e.rpe='6'; }); showToast('Deload aplicado: volume 0.65x e RPE 6'); saveState(); render(); };

  $('#btnExecTimer').onclick=()=>{ const ex=currentProgramExercise(); if(!ex) return showToast('Inicie sessão'); const exDef=getExerciseDefByName(ex.name) || EXERCISES_DB[0]; mentorSpeak(deterministicTTS(exDef, phaseName, autoDeload, false, 'pre')); const execSec=Math.max(1,tempoToSec((getMuscle(exDef.primary_muscle_id)?.tempo_default)||ex.tempo)*Number(ex.reps.split('-')[0]||8)); startWorkoutTimer(execSec,'exec'); mentorSpeak(deterministicTTS(exDef, phaseName, autoDeload, false, 'exec')); };
  $('#btnRestTimer').onclick=()=>{ const ex=currentProgramExercise(); if(!ex) return showToast('Inicie sessão'); const ses=S.training.program.session||{setNo:1}; const exDef=getExerciseDefByName(ex.name) || EXERCISES_DB[0]; const rest=scientificRestSeconds(exDef, ses.setNo>=ex.sets); startWorkoutTimer(rest,'rest'); mentorSpeak(deterministicTTS(exDef, phaseName, autoDeload, ses.setNo>=ex.sets, 'rest')); };
  $('#btnAutoSerie').onclick=()=>{ const ex=currentProgramExercise(); if(!ex) return showToast('Inicie sessão'); const execSec=Math.max(1,tempoToSec(ex.tempo)*Number(ex.reps.split('-')[0]||8)); if(featureOn('workoutAutoFlow')) startWorkoutTimer(execSec,'exec',{onEnd:()=>startWorkoutTimer(ex.rest,'rest')}); else startWorkoutTimer(execSec,'exec'); };
  $('#btnPauseWorkTimer').onclick=pauseWorkoutTimer;
  $('#btnStopWorkTimer').onclick=()=>{ stopWorkoutTimer(); showToast('Timer parado'); };
  $('#btnCadenceStart').onclick=()=>{
    const ex=currentProgramExercise();
    const template=(sessionWithPhase?.exercises||[])[0];
    const source = template || {name:ex?.name||'Exercício', reps_range:[8,10], cadence:{eccentric:3,pause:1,concentric:1}, sets:ex?.sets||3, rest_sec:120, type:'compound', muscle:'Peito'};
    const sourceDef=getExerciseDefByName(source.name)||EXERCISES_DB[0];
    const vctx=getVoiceDashboardContext(sourceDef,dashboardPayload);
    const compCtx=getCompetitionContext(dayKey);
    const isPriorityMuscle=(compCtx.priority_muscles||[]).includes(sourceDef.primary_muscle_id);
    if(autoDeload) VoiceEngine.fatigueWarning(vctx);
    VoiceEngine.preSet({...source,primary_muscle_id:sourceDef.primary_muscle_id,type:source.type||sourceDef.type},{phase:phaseName,rpe:Number(source.RPE||8),setNo:(S.training.program.session?.setNo||1),fatigueScore:vctx.fatigue_score,exerciseType:source.type||sourceDef.type,isPriorityMuscle,...vctx,...compCtx});
    TimerEngine.startExecutionTimer({...source,primary_muscle_id:sourceDef.primary_muscle_id,type:source.type||sourceDef.type,RPE:Number(source.RPE||8)},(S.training.program.session?.setNo||1),(source.sets||3),{phase:phaseName,fatigueScore:vctx.fatigue_score,mavPercent:vctx.mav_percent,trend:vctx.trend_pct,isWeakPoint:vctx.isWeakPoint,isPriorityMuscle,...compCtx});
  };
  $('#btnCadencePause').onclick=()=>{ TimerEngine.pause(); showToast(cadenceRunner.pause?'Cadência pausada':'Cadência retomada'); };
  $('#btnCadenceStop').onclick=()=>{ stopCadenceFlow(); showToast('Cadência encerrada'); };
  $('#btnCadenceAdvance').onclick=()=>{ TimerEngine.skip(); showToast('Avanço manual registrado'); };

  view.querySelectorAll('[data-muscle-open]').forEach((b)=>b.onclick=()=>{
    const id=b.dataset.muscleOpen;
    const payload=getMuscleDashboardPayload();
    const m=payload.muscles.find(x=>x.muscle_id===id);
    if(!m) return;
    openModal(`Músculo: ${m.name}`,'Detalhe determinístico',`<div class='list'><div class='item'><div><div class='name'>Status</div><div class='meta'>${m.status} • ${m.mav_percent}% MAV</div></div><span class='badge'>sets ${m.weekly_sets}</span></div><div class='item'><div><div class='name'>Stimulus/Fadiga</div><div class='meta'>Stimulus ${m.stimulus_score} • Fadiga ${m.fatigue_score}</div></div><span class='badge'>trend ${m.trend_pct}%</span></div></div>`);
  });

  const prioritySort=$('#prioritySort');
  if(prioritySort){
    prioritySort.onchange=(e)=>{
      const payload=getMuscleDashboardPayload();
      let arr=[...payload.muscles];
      if(e.target.value==='mav') arr.sort((a,b)=>a.mav_percent-b.mav_percent);
      if(e.target.value==='fatigue') arr.sort((a,b)=>b.fatigue_score-a.fatigue_score);
      if(e.target.value==='trend') arr.sort((a,b)=>a.trend_pct-b.trend_pct);
      const list=$('#priorityList');
      if(list) list.innerHTML=arr.map((m,i)=>`<div class='item'><div><div class='name'>${i+1}. ${m.name}</div><div class='meta'>MAV ${m.mav_percent}% • Fadiga ${m.fatigue_score} • Tendência ${m.trend_pct}%</div></div><span class='badge'>${m.priority}</span></div>`).join('');
    };
  }
  $('#btnConcluirSerie').onclick=()=>{
    const ex=currentProgramExercise();
    if(!ex) return showToast('Sem sessão ativa');
    const reps=Number($('#doneReps').value||0);
    const load=Number($('#doneLoad').value||0);
    const entry={date:k, group:dayKey, exercise:ex.name, sets:[{reps,load}], note:`RPE ${ex.rpe} • tempo ${ex.tempo}`};
    S.training.history.push(entry);
    const exDef=getExerciseDefByName(ex.name) || EXERCISES_DB[0];
    const perf={exercise_id:exDef.id, weight:load, reps, RPE:Number(ex.rpe)||8, date:new Date().toISOString()};
    S.training.performance.push(perf);
    const newEstimated1RM = estimate1RMRounded(load, reps);
    const current1RM = Number(S.training.oneRMByExercise?.[exDef.id]||0);
    if(newEstimated1RM > current1RM){
      S.training.oneRMByExercise[exDef.id]=newEstimated1RM;
      S.training.program.session={...(S.training.program.session||{}), prHit:true};
      VoiceEngine.prDetected({exerciseName:ex.name,rpe:Number(ex.rpe)||8});
    }
    const met=calcSetDeterministicMetrics(perf, exDef);
    const top=Number(String(ex.reps).split('-').pop())||8;
    const progMsg=`${progressionRule(perf, top)} • eReps ${met.effectiveReps.toFixed(1)} • Int ${(met.intensity*100).toFixed(0)}%`;
    showToast(progMsg);
    mentorSpeak(`Boa série. ${progMsg}. Disciplina técnica acima de tudo.`);
    const setVoiceCtx=getVoiceDashboardContext(exDef,dashboardPayload);
    if(setVoiceCtx.trend_pct<-5) VoiceEngine.dispatch(VOICE_STATES.WORKOUT_COMPLETE,{exerciseName:ex.name,phase:phaseName,trend_pct:setVoiceCtx.trend_pct,rpe:Number(ex.rpe)||8,...setVoiceCtx});
    setLastAction({type:'trainSet',entry});
    addXP(24,'train');
    adjustIntegrity(+1);
    advanceProgramSet();
    saveState();
    render();
  };

  if(featureOn('aiInsights')){
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
  }

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
function tickTimer(){ if(!timer.running||timer.paused) return; timer.left=Math.max(0,timer.total-Math.floor((Date.now()-timer.startedAt)/1000)); if(featureOn('studyVoice') && featureOn('auto10sWarn') && timer.left===10 && !timer.warned10){ timer.warned10=true; beep(1400,.06,.11); mentorSpeak('Faltam dez segundos no estudo.'); } if(timer.left<=0) finishTimer(); updateTimerUI(); }
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

function viewCfg(){
  const toggleRows=[
    ['mentorVoice','Mentor por voz'],['beeps','Bipes do sistema'],['vibrateFx','Vibração/haptics'],
    ['auto10sWarn','Aviso de 10s'],['autoWindowRedirect','Auto redirecionar para missão'],['strictNavigation','Bloqueio de navegação estrita'],
    ['dopaminePopups','Popups de recompensa'],['comboDecay','Combo decay automático'],['workoutAutoFlow','Fluxo automático treino'],
    ['studyVoice','Voz no timer de estudo'],['aiInsights','Insights IA de treino']
  ];
  view.innerHTML=`<div class='card'><h2>Config geral</h2><div class='grid'><div class='g6'><label>Objetivo</label><select id='cfgGoal'><option value='cutting'>Cutting</option><option value='maint'>Manutenção</option><option value='bulk'>Lean bulk</option></select></div><div class='g6'><label>Peso (kg)</label><input id='cfgW' type='number' min='40' max='200' value='${S.targets.weightKg}'></div><div class='g6'><label>BF (%)</label><input id='cfgBF' type='number' min='5' max='45' value='${S.targets.bfPct}'></div><div class='g6'><label>Atividade</label><select id='cfgAct'><option value='baixa'>Baixa</option><option value='moderada'>Moderada</option><option value='alta'>Alta</option></select></div><div class='g6'><label>Modo estrito</label><select id='cfgStrict'><option value='0'>Desligado</option><option value='1'>Ativo</option></select></div><div class='g6'><label>CRT</label><select id='cfgCRT'><option value='1'>Ativo</option><option value='0'>Desligado</option></select></div><div class='g6'><label>Sons</label><select id='cfgSound'><option value='1'>Ativo</option><option value='0'>Desligado</option></select></div><div class='g6'><label>Música de fundo</label><select id='cfgMusic'><option value='1'>Ativo</option><option value='0'>Desligado</option></select></div><div class='g6'><label>Modo atleta natural</label><select id='cfgNatural'><option value='1'>Ativo</option><option value='0'>Desligado</option></select></div><div class='g6'><label>Modo Change</label><select id='cfgModeChange'><option value='0'>Desligado</option><option value='1'>Ativo</option></select></div><div class='g6'><label>Duração modo change (min)</label><input id='cfgModeMins' type='number' min='10' max='240' step='5' value='${S.modeChange.durationMin||45}'></div><div class='g6'><label>Fêmur</label><select id='cfgFemur'><option value='curto'>Curto</option><option value='medio'>Médio</option><option value='longo'>Longo</option></select></div><div class='g6'><label>Braço</label><select id='cfgBraco'><option value='curto'>Curto</option><option value='medio'>Médio</option><option value='longo'>Longo</option></select></div><div class='g6'><label>Voz treinador (modo)</label><select id='cfgVoiceMode'><option value='technical'>Técnico</option><option value='hardcore'>Hardcore</option><option value='silent'>Silencioso</option></select></div><div class='g6'><label>Intensidade da voz</label><select id='cfgVoiceIntensity'><option value='1'>1 - leve</option><option value='2'>2 - moderado</option><option value='3'>3 - agressivo</option></select></div><div class='g6'><label>Frequência de fala</label><select id='cfgVoiceFreq'><option value='normal'>Normal</option><option value='reduced'>Reduzida</option></select></div><div class='g6'><label>Modo competição</label><select id='cfgComp'><option value='0'>Desligado</option><option value='1'>Ativo</option></select></div><div class='g6'><label>Semanas até evento</label><input id='cfgCompWeeks' type='number' min='1' max='52' value='${S.training.competition?.weeksUntilEvent||16}'></div><div class='g6'><label>BF alvo evento (%)</label><input id='cfgCompBf' type='number' min='4' max='20' value='${S.training.competition?.targetBodyFat||10}'></div><div class='g12'><label>Músculos prioritários (competição)</label><select id='cfgCompPrio' multiple><option value='delts'>Deltoide lateral</option><option value='chest'>Peito superior</option><option value='back'>Costas</option><option value='quads'>Quadríceps</option><option value='hamstrings'>Posterior</option><option value='calves'>Panturrilha</option><option value='core'>Core</option></select></div><div class='g12'><label>Volume</label><input id='cfgVol' type='range' min='0' max='1' step='0.05' value='${S.sounds.volume||0.6}'></div></div><hr><div class='grid'>${Object.entries(S.windows).map(([k,v])=>`<div class='g6'><label>${k}</label><input id='w_${k}' type='time' value='${v}'></div>`).join('')}</div><button class='btn primary wide' id='btnCfgSave'>SALVAR CONFIG</button></div>
  <div class='card'><h2>Controle total (ativar/desativar tudo)</h2><div class='list'>${toggleRows.map(([k,label])=>`<div class='item'><div><div class='name'>${label}</div><div class='meta'>Chave: ${k}</div></div><button class='btn ${featureOn(k)?'primary':'ghost'}' data-ft='${k}'>${featureOn(k)?'ATIVO':'INATIVO'}</button></div>`).join('')}</div></div>
  <div class='card'><h2>Música</h2><div class='hint'>Upload mp3/m4a salvo offline no IndexedDB.</div><input id='musicFile' type='file' accept='audio/*'><div class='row'><button class='btn' id='btnMusicPlay'>PLAY</button><button class='btn' id='btnMusicStop'>STOP</button><button class='btn danger' id='btnMusicDelete'>APAGAR</button></div></div>
  <div class='card'><h2>Backup</h2><div class='row'><button class='btn' id='btnExport'>EXPORTAR JSON</button><button class='btn' id='btnImport'>IMPORTAR JSON</button><input id='importFile' type='file' accept='application/json' style='display:none'></div><button class='btn danger' id='btnWipe'>RESET TOTAL</button>
  <button class='btn' id='btnForceRefresh'>FORÇAR ATUALIZAÇÃO APP</button></div>`;
  $('#cfgGoal').value=S.targets.goal; $('#cfgAct').value=S.targets.activity; $('#cfgStrict').value=S.strictMode?'1':'0'; $('#cfgCRT').value=S.theme.crt?'1':'0'; $('#cfgSound').value=S.sounds.enabled?'1':'0'; $('#cfgMusic').value=S.sounds.music?'1':'0'; $('#cfgNatural').value=S.training.naturalMode?'1':'0'; $('#cfgModeChange').value=S.modeChange.enabled?'1':'0'; $('#cfgFemur').value=(S.training.anthro||{}).femur||'medio'; $('#cfgBraco').value=(S.training.anthro||{}).braco||'medio'; $('#cfgVoiceMode').value=(S.training.voice||{}).mode||'hardcore'; $('#cfgVoiceIntensity').value=String((S.training.voice||{}).intensity||2); $('#cfgVoiceFreq').value=(S.training.voice||{}).frequency||'normal'; $('#cfgComp').value=(S.training.competition?.enabled?'1':'0'); const compSel=$('#cfgCompPrio'); const compPri=(S.training.competition?.priorityMuscles||['delts','chest']); Array.from(compSel.options).forEach(o=>o.selected=compPri.includes(o.value));
  $('#btnCfgSave').onclick=()=>{ S.targets.goal=$('#cfgGoal').value; S.targets.weightKg=Number($('#cfgW').value); S.targets.bfPct=Number($('#cfgBF').value); S.targets.activity=$('#cfgAct').value; S.strictMode=$('#cfgStrict').value==='1'; S.theme.crt=$('#cfgCRT').value==='1'; S.sounds.enabled=$('#cfgSound').value==='1'; S.sounds.music=$('#cfgMusic').value==='1'; S.training.naturalMode=$('#cfgNatural').value==='1'; S.modeChange.enabled=$('#cfgModeChange').value==='1'; S.modeChange.durationMin=Math.max(10,Math.min(240,Number($('#cfgModeMins').value)||45)); if(!S.modeChange.enabled) S.modeChange.active=null; S.training.anthro={...(S.training.anthro||{}), femur:$('#cfgFemur').value, braco:$('#cfgBraco').value}; S.training.voice={...(S.training.voice||{}), mode:$('#cfgVoiceMode').value, intensity:Number($('#cfgVoiceIntensity').value)||2, frequency:$('#cfgVoiceFreq').value}; S.training.competition={...(S.training.competition||{}), enabled:$('#cfgComp').value==='1', weeksUntilEvent:Math.max(1,Math.min(52,Number($('#cfgCompWeeks').value)||16)), targetBodyFat:Math.max(4,Math.min(20,Number($('#cfgCompBf').value)||10)), priorityMuscles:Array.from($('#cfgCompPrio').selectedOptions).map(o=>o.value)}; S.sounds.volume=Math.max(0,Math.min(1,Number($('#cfgVol').value))); Object.keys(S.windows).forEach(k=>S.windows[k]=$(`#w_${k}`).value||S.windows[k]); saveState(); applyTheme(); if(!S.sounds.enabled) stopMusic(); showToast('Config salva'); render(); };
  view.querySelectorAll('[data-ft]').forEach(b=>b.onclick=()=>{ const key=b.dataset.ft; S.features[key]=!S.features[key]; saveState(); render(); });
  $('#musicFile').onchange=async(e)=>{ const f=e.target.files?.[0]; if(!f) return; await idb.set('music',f); await loadMusicIfAny(); showToast('Música salva'); };
  $('#btnMusicPlay').onclick=()=>{ startMusic(); showToast('Play'); };
  $('#btnMusicStop').onclick=()=>{ stopMusic(); showToast('Stop'); };
  $('#btnMusicDelete').onclick=async()=>{ await idb.del('music'); if(musicAudio){musicAudio.pause();musicAudio=null;} showToast('Música apagada'); };
  $('#btnExport').onclick=()=>downloadText(`ascensao-backup-${todayKey()}.json`,JSON.stringify(S,null,2));
  $('#btnImport').onclick=()=>$('#importFile').click();
  $('#importFile').onchange=async(e)=>{ const f=e.target.files?.[0]; if(!f) return; try{ S=migrate(JSON.parse(await f.text())); saveState(); applyTheme(); await loadMusicIfAny(); showToast('Importado'); render(); }catch{ showToast('JSON inválido'); } };
  $('#btnWipe').onclick=()=>{ openModal('RESET TOTAL','Apaga tudo',`<button class='btn danger' id='confirmWipe'>CONFIRMAR</button>`); setTimeout(()=>{ $('#confirmWipe').onclick=async()=>{ localStorage.removeItem(STORAGE_KEY); await idb.del('music'); S=defaultState(); saveState(); closeModal(); location.reload(); }; },0); };
  $('#btnForceRefresh').onclick=forceRefreshApp;
}

function render(){ refreshHUD(); renderTabs(); if(currentMissionWindow().id==='sleep' && S.strictMode && featureOn('beeps')) beep(140,.09,.08);
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
  $('#btnStart').onclick=()=>{ S.class=$('#startClass').value; saveState(); $('#start').style.display='none'; $('#start').setAttribute('aria-hidden','true'); activeTab=currentMissionWindow().tab||'DASH'; startMusic(); render(); };
  document.addEventListener('click', (e)=>{
    const el=e.target.closest('.btn');
    if(!el) return;
    microPulse(el);
  });
  refreshHUD();
})();

setInterval(()=>{ ensureModeChangeValidity(); refreshHUD(); if(featureOn('comboDecay') && (S.rpg.combo||0)>0){ S.rpg.combo=Math.max(0,S.rpg.combo-1); saveState(); } if(S.strictMode && featureOn('autoWindowRedirect')){ const win=currentMissionWindow(); if(activeTab!==win.tab && !['CFG','REL'].includes(activeTab)){ activeTab=win.tab; render(); }} }, 1000);
