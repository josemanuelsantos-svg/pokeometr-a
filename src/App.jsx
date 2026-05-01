import React, { useState, useEffect, useRef } from 'react';

// --- AUTO-INSTALADOR DE ESTILOS Y FUENTES (MODERNO) ---
if (typeof document !== 'undefined') {
  if (!document.getElementById('tailwind-cdn')) {
    const script = document.createElement('script');
    script.id = 'tailwind-cdn';
    script.src = 'https://cdn.tailwindcss.com';
    document.head.appendChild(script);
  }
  if (!document.getElementById('gamer-font')) {
    const link = document.createElement('link');
    link.id = 'gamer-font';
    link.href = 'https://fonts.googleapis.com/css2?family=Rajdhani:wght@500;600;700;900&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  }
}

// --- UTILIDADES MATEMÁTICAS Y CONFIG ---
const PI = 3;
const APP_VERSION = "v11.0 - RANKED E-SPORTS EDITION";

// --- RECURSOS MODERNOS ---
const BG_LOBBY = "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=1000"; 
const BG_STADIUM = "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&q=80&w=1000"; 
const BG_FOREST = "https://images.unsplash.com/photo-1618336753974-aae8e04506aa?auto=format&fit=crop&q=80&w=1000"; 
const BG_CASTLE = "https://images.unsplash.com/photo-1635322966219-b75ed372eb01?auto=format&fit=crop&q=80&w=1000"; 
const BG_SPACE = "https://images.unsplash.com/photo-1462332420958-a05d1e002413?auto=format&fit=crop&q=80&w=1000"; 

// Sonidos con enlaces directos estables
const SOUNDS = {
  click: 'https://cdn.pixabay.com/audio/2021/08/04/audio_0625c1539c.mp3',
  hit: 'https://cdn.pixabay.com/audio/2022/03/15/audio_78f14b6209.mp3',
  error: 'https://cdn.pixabay.com/audio/2021/08/04/audio_bb630cc098.mp3',
  heal: 'https://cdn.pixabay.com/audio/2022/03/15/audio_0d03b0c80d.mp3',
  snap: 'https://cdn.pixabay.com/audio/2021/11/25/audio_91b3cb1ce1.mp3',
  victory: 'https://cdn.pixabay.com/audio/2021/08/04/audio_12b0c7443c.mp3'
};

const playSound = (soundName, isMuted) => {
  if (isMuted) return;
  const audio = new Audio(SOUNDS[soundName]);
  audio.volume = soundName === 'hit' ? 0.3 : 0.5;
  audio.play().catch(e => console.log("Audio block", e));
};

// Función para calcular el rango en la victoria
const getRank = (damage) => {
  if (damage >= 12000) return { rank: 'S', color: 'from-purple-400 to-pink-600', text: 'NIVEL DIOS', shadow: 'shadow-[0_0_50px_rgba(192,132,252,0.8)]' };
  if (damage >= 8000) return { rank: 'A', color: 'from-yellow-300 to-amber-500', text: 'ÉLITE GEOMÉTRICA', shadow: 'shadow-[0_0_40px_rgba(250,204,21,0.6)]' };
  if (damage >= 5000) return { rank: 'B', color: 'from-cyan-300 to-blue-500', text: 'PROFESIONAL', shadow: 'shadow-[0_0_30px_rgba(34,211,238,0.5)]' };
  return { rank: 'C', color: 'from-green-400 to-emerald-600', text: 'NOVATO APROBADO', shadow: 'shadow-[0_0_20px_rgba(74,222,128,0.4)]' };
};

// --- MOTORES DE PREGUNTAS ---
const generateMathQuestion = (difficulty) => {
  let availableTypes = [];
  
  if (difficulty === 1) {
    availableTypes = ['perimetro_basico', 'area_cuadrado', 'area_rectangulo', 'area_romboide', 'conversion_simple'];
  } else if (difficulty === 2) {
    availableTypes = ['area_triangulo', 'area_rombo', 'area_trapecio', 'area_poligono_regular', 'volumen_cubo', 'volumen_ortoedro', 'equivalencia_capacidad'];
  } else {
    availableTypes = ['volumen_prisma_regular', 'volumen_piramide_regular', 'area_circulo', 'volumen_cilindro', 'volumen_cono', 'volumen_esfera', 'equivalencia_masa'];
  }

  const type = availableTypes[Math.floor(Math.random() * availableTypes.length)];
  let questionText = '', correctAnswer = 0, unit = '', formulaInfo = '';

  switch (type) {
    case 'perimetro_basico':
      const isSquare = Math.random() > 0.5;
      if (isSquare) {
        const lp = [5, 6, 7, 8, 12][Math.floor(Math.random() * 5)];
        questionText = `Perímetro de un cuadrado de lado ${lp} cm`; correctAnswer = lp * 4; unit = 'cm'; formulaInfo = 'P = Lado × 4 (Suma de lados)';
      } else {
        const polyName = ['pentágono', 'hexágono', 'octógono'][Math.floor(Math.random() * 3)];
        const polySides = polyName === 'pentágono' ? 5 : (polyName === 'hexágono' ? 6 : 8);
        const lpoly = [3, 4, 5, 10][Math.floor(Math.random() * 4)];
        questionText = `Perímetro de un ${polyName} regular de lado ${lpoly} cm`; correctAnswer = lpoly * polySides; unit = 'cm'; formulaInfo = 'P = Nº lados × Lado';
      }
      break;
    case 'area_cuadrado':
      const l_cuad = [4, 5, 6, 7, 8, 9, 10, 11, 12][Math.floor(Math.random() * 9)];
      questionText = `Área cuadrado: lado ${l_cuad} cm`; correctAnswer = l_cuad * l_cuad; unit = 'cm²'; formulaInfo = 'A = Lado × Lado'; break;
    case 'area_rectangulo':
      const b_rect = [5, 6, 8, 10, 12][Math.floor(Math.random() * 5)], h_rect = [3, 4, 5, 7][Math.floor(Math.random() * 4)];
      questionText = `Área rectángulo: base ${b_rect} cm, altura ${h_rect} cm`; correctAnswer = b_rect * h_rect; unit = 'cm²'; formulaInfo = 'A = Base × Altura'; break;
    case 'area_romboide':
      const b_romb = [6, 8, 10, 15][Math.floor(Math.random() * 4)], h_romb = [4, 5, 6][Math.floor(Math.random() * 3)];
      questionText = `Área romboide: base ${b_romb} cm, altura ${h_romb} cm`; correctAnswer = b_romb * h_romb; unit = 'cm²'; formulaInfo = 'A = Base × Altura'; break;
    case 'area_triangulo':
      const b_tri = [4, 6, 8, 10, 12][Math.floor(Math.random() * 5)], h_tri = [3, 5, 7, 9][Math.floor(Math.random() * 4)];
      questionText = `Área triángulo: base ${b_tri} cm, altura ${h_tri} cm`; correctAnswer = (b_tri * h_tri) / 2; unit = 'cm²'; formulaInfo = 'A = (Base × Altura) / 2'; break;
    case 'area_rombo':
      const D = [6, 8, 10, 12][Math.floor(Math.random() * 4)], d = [4, 6, 8][Math.floor(Math.random() * 3)];
      questionText = `Área rombo: Diagonal mayor ${D} cm, diagonal menor ${d} cm`; correctAnswer = (D * d) / 2; unit = 'cm²'; formulaInfo = 'A = (D × d) / 2'; break;
    case 'area_trapecio':
      const B_trap = [8, 10, 12][Math.floor(Math.random() * 3)], b_trap = [4, 6, 8][Math.floor(Math.random() * 3)], h_trap = [3, 4, 5][Math.floor(Math.random() * 3)];
      questionText = `Área trapecio: bases ${B_trap} y ${b_trap} cm, altura ${h_trap} cm`; correctAnswer = ((B_trap + b_trap) * h_trap) / 2; unit = 'cm²'; formulaInfo = 'A = ((B + b) × h) / 2'; break;
    case 'area_poligono_regular':
      const n_pol = [5, 6][Math.floor(Math.random() * 2)]; 
      const name_pol = n_pol === 5 ? 'pentágono' : 'hexágono';
      const l_pol = [2, 4, 6][Math.floor(Math.random() * 3)];
      const ap_pol = [3, 5, 10][Math.floor(Math.random() * 3)];
      questionText = `Área ${name_pol} reg: lado ${l_pol} cm, apotema ${ap_pol} cm`; 
      correctAnswer = (n_pol * l_pol * ap_pol) / 2; 
      unit = 'cm²'; formulaInfo = 'A = (Perímetro × Apotema) / 2'; break;
    case 'area_circulo':
      const r_circ = [3, 4, 5, 6, 10][Math.floor(Math.random() * 5)];
      questionText = `Área círculo: radio ${r_circ} cm (usa π=3)`; correctAnswer = PI * r_circ * r_circ; unit = 'cm²'; formulaInfo = 'A = π × r²'; break;
    case 'volumen_cubo':
      const arista = [3, 4, 5, 6, 10][Math.floor(Math.random() * 5)];
      questionText = `Volumen cubo: arista ${arista} cm`; correctAnswer = arista * arista * arista; unit = 'cm³'; formulaInfo = 'V = Arista³'; break;
    case 'volumen_ortoedro':
      const lo = [3, 4, 5][Math.floor(Math.random() * 3)], wo = [2, 3][Math.floor(Math.random() * 2)], ho = [4, 5, 10][Math.floor(Math.random() * 3)];
      questionText = `Volumen prisma rectangular: ${lo}x${wo}x${ho} cm`; correctAnswer = lo * wo * ho; unit = 'cm³'; formulaInfo = 'V = Largo × Ancho × Altura'; break;
    case 'volumen_prisma_regular':
      const n_pr = 6; 
      const l_pr = [2, 3, 4][Math.floor(Math.random() * 3)];
      const a_pr = [3, 5][Math.floor(Math.random() * 2)];
      const h_pr = [4, 10][Math.floor(Math.random() * 2)];
      questionText = `Vol. prisma hexagonal: lado base ${l_pr} cm, apotema ${a_pr} cm, altura ${h_pr} cm`;
      const areaBasePrisma = (n_pr * l_pr * a_pr) / 2;
      correctAnswer = areaBasePrisma * h_pr;
      unit = 'cm³'; formulaInfo = 'V = Área Base × h. (Calcula el área de la base primero)'; break;
    case 'volumen_piramide_regular':
      const n_pir = [5, 6][Math.floor(Math.random() * 2)]; 
      const name_pir = n_pir === 5 ? 'pentagonal' : 'hexagonal';
      const l_pir = [2, 4][Math.floor(Math.random() * 2)]; 
      const a_pir = [3, 5][Math.floor(Math.random() * 2)];
      const h_pir = [3, 6, 9][Math.floor(Math.random() * 3)]; 
      questionText = `Vol. pirámide ${name_pir}: lado base ${l_pir} cm, ap. ${a_pir} cm, altura ${h_pir} cm`;
      const areaBasePiramide = (n_pir * l_pir * a_pir) / 2;
      correctAnswer = (areaBasePiramide * h_pir) / 3;
      unit = 'cm³'; formulaInfo = 'V = (Área Base × h) / 3. (Calcula el área de la base primero)'; break;
    case 'volumen_cilindro':
      const rCil = [2, 3, 4, 5][Math.floor(Math.random() * 4)], hCil = [2, 3, 4, 5, 10][Math.floor(Math.random() * 5)];
      questionText = `Volumen cilindro: r=${rCil} cm, h=${hCil} cm (usa π=3)`; correctAnswer = PI * rCil * rCil * hCil; unit = 'cm³'; formulaInfo = 'V = Área base(π·r²) × h'; break;
    case 'volumen_cono':
      const rCono = [2, 3, 4, 5][Math.floor(Math.random() * 4)], hCono = [2, 3, 4, 5, 10][Math.floor(Math.random() * 5)];
      questionText = `Volumen cono: r=${rCono} cm, h=${hCono} cm (usa π=3)`; correctAnswer = rCono * rCono * hCono; unit = 'cm³'; formulaInfo = 'V = (π × r² × h)/3. ¡Si π=3 se anula el 3!'; break;
    case 'volumen_esfera':
      const rEsf = [2, 3, 4, 5][Math.floor(Math.random() * 4)];
      questionText = `Volumen esfera: radio ${rEsf} cm (usa π=3)`; correctAnswer = 4 * Math.pow(rEsf, 3); unit = 'cm³'; formulaInfo = 'V = (4/3) × π × r³. ¡Si π=3 queda 4 × r³!'; break;
    case 'conversion_simple':
      const subType1 = Math.floor(Math.random() * 3);
      if (subType1 === 0) { const kg = [2, 5, 12][Math.floor(Math.random() * 3)]; questionText = `Pasa ${kg} kg a gramos (g)`; correctAnswer = kg * 1000; unit = 'g'; formulaInfo = '1 kg = 1000 g'; }
      else if (subType1 === 1) { const ml = [3000, 5000, 15000][Math.floor(Math.random() * 3)]; questionText = `Pasa ${ml} mL a Litros (L)`; correctAnswer = ml / 1000; unit = 'L'; formulaInfo = '1000 mL = 1 L'; }
      else { const m = [4, 8, 25][Math.floor(Math.random() * 3)]; questionText = `Pasa ${m} metros (m) a cm`; correctAnswer = m * 100; unit = 'cm'; formulaInfo = '1 m = 100 cm'; }
      break;
    case 'equivalencia_capacidad':
      const subType2 = Math.floor(Math.random() * 2);
      if (subType2 === 0) { const dm3 = [12, 25, 50][Math.floor(Math.random() * 3)]; questionText = `¿Cuántos Litros (L) son ${dm3} dm³?`; correctAnswer = dm3; unit = 'L'; formulaInfo = '1 dm³ = 1 Litro'; }
      else { const m3 = [3, 5, 10][Math.floor(Math.random() * 3)]; questionText = `¿Cuántos Litros (L) son ${m3} m³?`; correctAnswer = m3 * 1000; unit = 'L'; formulaInfo = '1 m³ = 1000 L'; }
      break;
    case 'equivalencia_masa':
      const subType3 = Math.floor(Math.random() * 2);
      if (subType3 === 0) { const m3 = [2, 4, 10][Math.floor(Math.random() * 3)]; questionText = `Masa (kg) de ${m3} m³ de agua pura`; correctAnswer = m3 * 1000; unit = 'kg'; formulaInfo = '1 m³ = 1000L = 1000kg'; }
      else { const cm3 = [5000, 8000, 12000][Math.floor(Math.random() * 3)]; questionText = `Masa (kg) de ${cm3} cm³ de agua pura`; correctAnswer = cm3 / 1000; unit = 'kg'; formulaInfo = '1000 cm³ = 1L = 1kg'; }
      break;
    default:
      questionText = `Área cuadrado lado 5 cm`; correctAnswer = 25; unit = 'cm²'; formulaInfo = 'A = Lado × Lado';
  }

  const options = new Set([correctAnswer]);
  while (options.size < 4) {
    let wrongAnswer;
    if (correctAnswer >= 100 && correctAnswer % 10 === 0 && Math.random() > 0.3) {
      const tweaks = [correctAnswer * 10, correctAnswer / 10, correctAnswer / 100, correctAnswer * 100, correctAnswer + 1000];
      wrongAnswer = tweaks[Math.floor(Math.random() * tweaks.length)];
    } else {
      const offset = [1, 2, 3, 5, 10, 20][Math.floor(Math.random() * 6)];
      wrongAnswer = correctAnswer + (offset * (Math.random() > 0.5 ? 1 : -1));
    }
    if (wrongAnswer > 0 && wrongAnswer !== correctAnswer && wrongAnswer % 1 === 0) options.add(wrongAnswer);
  }
  return { context: 'ATTACK', text: questionText, options: Array.from(options).sort(() => Math.random() - 0.5), correctAnswer, unit, formulaInfo };
};

const generateHealQuestion = () => {
  const formulas = [
    { name: 'Perímetro (General)', correct: 'Suma de sus lados', wrongs: ['Base × Altura', 'Lado × Lado', 'Lado³'] },
    { name: 'Perím. Polígono Reg.', correct: 'Nº Lados × Lado', wrongs: ['Base × Altura', '(Lado × Apotema)/2', 'Lado³'] },
    { name: 'Área Cuadrado', correct: 'Lado × Lado', wrongs: ['Base × Altura', 'Lado × 4', 'Lado³'] },
    { name: 'Área Rect. / Romboide', correct: 'Base × Altura', wrongs: ['(Base × Altura) / 2', 'Lado × Lado', 'Base + Altura'] },
    { name: 'Área Triángulo', correct: '(Base × Altura) / 2', wrongs: ['Base × Altura', '(Base × Altura) / 3', 'Lado × 3'] },
    { name: 'Área del Rombo', correct: '(D × d) / 2', wrongs: ['D × d', '(D + d) / 2', 'Lado × 4'] },
    { name: 'Área del Trapecio', correct: '((B + b) × h) / 2', wrongs: ['(B × b × h) / 2', '(B + b) × h', 'Base × Altura'] },
    { name: 'Área Polígono Reg.', correct: '(Perímetro × Apotema) / 2', wrongs: ['Perímetro × Apotema', '(Nº Lados × Apotema) / 2', 'Lado × Apotema'] },
    { name: 'Área Círculo', correct: 'π × r²', wrongs: ['2 × π × r', 'π × r³', '(π × r²) / 2'] },
    { name: 'Volumen Prisma', correct: 'Área de la base × Altura', wrongs: ['(Área base × Altura)/2', '(Área base × Altura)/3', 'Lado × Lado × Altura'] },
    { name: 'Volumen Pirámide', correct: '(Área de la base × Altura)/3', wrongs: ['Área base × Altura', '(Área base × Altura)/2', '(Base × Altura)/3'] },
    { name: 'Volumen Cilindro', correct: 'π × r² × Altura', wrongs: ['(π × r² × h) / 3', '2 × π × r × h', 'Base × Altura'] },
    { name: 'Volumen Cono', correct: '(π × r² × Altura) / 3', wrongs: ['π × r² × Altura', '(Base × Altura) / 3', '(4/3) × π × r³'] },
    { name: 'Volumen Esfera', correct: '(4/3) × π × r³', wrongs: ['π × r³', '(3/4) × π × r²', '4 × π × r²'] },
    { name: 'Capacidad m³ a L', correct: '1 m³ = 1000 L', wrongs: ['1 m³ = 100 L', '1 L = 1000 m³', '1 dm³ = 1000 L'] },
    { name: 'Masa del Agua', correct: '1 dm³ = 1 kg', wrongs: ['1 m³ = 1 kg', '1 cm³ = 1 kg', '1 L = 1000 kg'] }
  ];
  const q = formulas[Math.floor(Math.random() * formulas.length)];
  return {
    context: 'HEAL',
    text: `[CORTAFUEGOS] Fórmula de: ${q.name}`,
    options: [q.correct, ...q.wrongs].sort(() => Math.random() - 0.5),
    correctAnswer: q.correct,
    unit: '',
    formulaInfo: q.correct
  };
};

const generateUltimateQuestion = () => {
  const hacks = [
    { text: 'Volumen Cono: V = (π × r² × h) / [ ? ]', correct: '3', wrongs: ['2', '4', 'r'] },
    { text: 'Área Triángulo: A = (b × h) / [ ? ]', correct: '2', wrongs: ['3', '4', 'h'] },
    { text: 'Área Trapecio: A = ((B + b) × h) / [ ? ]', correct: '2', wrongs: ['3', '4', 'B'] },
    { text: 'Área Políg. Reg: A = (Perímetro × [ ? ]) / 2', correct: 'Apotema', wrongs: ['Lado', 'Altura', 'Radio'] },
    { text: 'Volumen Esfera: V = ([ ? ] / 3) × π × r³', correct: '4', wrongs: ['2', '3', '1'] },
    { text: 'Masa Agua: 1 [ ? ] = 1 Litro = 1 kg', correct: 'dm³', wrongs: ['m³', 'cm³', 'mm³'] },
    { text: 'Capacidad: 1 m³ = [ ? ] Litros', correct: '1000', wrongs: ['100', '10', '10000'] }
  ];
  const q = hacks[Math.floor(Math.random() * hacks.length)];
  return {
    context: 'ULTIMATE',
    text: `[HACKEO Z] Completa: ${q.text}`,
    options: [q.correct, ...q.wrongs].sort(() => Math.random() - 0.5),
    correctAnswer: q.correct,
    unit: '',
    formulaInfo: q.correct
  };
};

// --- BASE DE DATOS DE PERSONAJES ---
const HEROES = [
  { id: 'ironman', name: 'Iron Man', img: 'https://i.ibb.co/27K5dCBM/b751779a4a3bbc38f9268036cdb5af5a.gif', fallback: '🤖', glow: 'shadow-[0_0_20px_#ef4444]', attacks: [{ name: 'Rayo Repulsor', diff: 1, dmg: 15 }, { name: 'Misil Tracker', diff: 2, dmg: 35 }, { name: 'Unirrayo Max', diff: 3, dmg: 60 }] },
  { id: 'cap', name: 'Cap. América', img: 'https://i.ibb.co/XqT34sz/189868-C0-D40619-AD55-4-B4-C-BE57-9005-D2506967-0-1643400842.gif', fallback: '🛡️', glow: 'shadow-[0_0_20px_#3b82f6]', attacks: [{ name: 'Golpe Escudo', diff: 1, dmg: 15 }, { name: 'Rebote Táctico', diff: 2, dmg: 35 }, { name: 'Carga Heroica', diff: 3, dmg: 60 }] },
  { id: 'thor', name: 'Thor', img: 'https://i.ibb.co/PsFhhF1g/f604e46c6979b173d319fc064ed5c0dc.gif', fallback: '⚡', glow: 'shadow-[0_0_20px_#eab308]', attacks: [{ name: 'Golpe Mjolnir', diff: 1, dmg: 15 }, { name: 'Trueno', diff: 2, dmg: 35 }, { name: 'Rayo Divino', diff: 3, dmg: 60 }] },
  { id: 'widow', name: 'Viuda Negra', img: 'https://i.ibb.co/JjJQnWcH/0c2a5632830679-569563b0d45b2.gif', fallback: '🕷️', glow: 'shadow-[0_0_20px_#8b5cf6]', attacks: [{ name: 'Ataque Marcial', diff: 1, dmg: 15 }, { name: 'Picadura Widow', diff: 2, dmg: 35 }, { name: 'Takedown Letal', diff: 3, dmg: 60 }] },
  { id: 'strange', name: 'Dr. Strange', img: 'https://i.ibb.co/M5VX25W0/tumblr-n11ui8-Bh-NU1r8bj4ko1-500.gif', fallback: '👁️', glow: 'shadow-[0_0_20px_#f97316]', attacks: [{ name: 'Látigo Místico', diff: 1, dmg: 15 }, { name: 'Escudo Tao', diff: 2, dmg: 35 }, { name: 'Ojo Agamotto', diff: 3, dmg: 60 }] },
  { id: 'hulk', name: 'Hulk', img: 'https://i.ibb.co/BV1dZJCH/tumblr-nkx9ln-Ha8c1tiwiyxo1-640.gif', fallback: '💪', glow: 'shadow-[0_0_20px_#22c55e]', attacks: [{ name: 'Gancho Fuerte', diff: 1, dmg: 15 }, { name: 'Lanzar Roca', diff: 2, dmg: 35 }, { name: '¡HULK APLASTA!', diff: 3, dmg: 60 }] }
];

const VILLAINS = [
  { name: 'Ultron', hp: 250, maxHp: 250, level: 1, img: 'https://i.ibb.co/tpVWKW0d/marvel-future-fight-infinity-ultron.gif', fallback: '🦾', bg: BG_STADIUM, trait: 'IA Robótica: Combate estándar.' },
  { name: 'Loki', hp: 500, maxHp: 500, level: 2, img: 'https://i.ibb.co/C34250d4/7afks59all771.gif', fallback: '🐍', bg: BG_FOREST, trait: 'Ilusionista: Inmune a Ataques Fáciles.' },
  { name: 'Dr. Doom', hp: 900, maxHp: 900, level: 3, img: 'https://i.ibb.co/67dZ8jpD/doctor-doom-transparent-marvel-comics.gif', fallback: '🦹', bg: BG_CASTLE, trait: 'Escudo Místico: Reduce Ataques Medios a la mitad.' },
  { name: 'Thanos', hp: 1500, maxHp: 1500, level: 4, img: 'https://i.ibb.co/7NjPsfgb/183d8eefe6fe041dd1169fdeaab016f8.gif', fallback: '🧤', bg: BG_SPACE, trait: 'Titán Loco: Vulnerable (Daño x2) a Ataques Definitivos.' },
  { name: 'Galactus', hp: 3000, maxHp: 3000, level: 5, img: 'https://i.ibb.co/PGkCWzKV/marvel-future-fight-galactus.gif', fallback: '🪐', bg: BG_SPACE, trait: 'Devorador: Armadura Cósmica. Mitiga 70% daño fácil/medio.' },
];

// --- COMPONENTES VISUALES ---
const SlantedAvatar = ({ src, alt, fallback, className, isEnemy }) => {
  const [imgError, setImgError] = useState(false);
  const glow = isEnemy ? "drop-shadow-[0_0_15px_rgba(239,68,68,0.8)]" : "drop-shadow-[0_0_15px_rgba(6,182,212,0.8)]";
  
  return (
    <div className={`relative ${glow} group`}>
      <div 
        className={`w-20 h-24 sm:w-36 sm:h-44 flex items-center justify-center bg-slate-900 border-2 ${isEnemy ? 'border-red-500' : 'border-cyan-400'} overflow-hidden relative z-10 transition-transform duration-300 group-hover:scale-105`}
        style={{ clipPath: 'polygon(15% 0%, 100% 0%, 85% 100%, 0% 100%)' }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10"></div>
        {imgError || !src ? (
          <div className="text-3xl sm:text-5xl relative z-20">{fallback}</div>
        ) : (
          <img src={src} alt={alt} onError={() => setImgError(true)} className="w-full h-full object-cover relative z-0" />
        )}
      </div>
    </div>
  );
};

const CyberHealthBar = ({ current, max, label, isEnemy }) => {
  const percent = Math.max(0, (current / max) * 100);
  const bgGradient = isEnemy 
    ? (percent < 30 ? 'bg-gradient-to-r from-red-700 to-red-500' : 'bg-gradient-to-r from-rose-600 to-fuchsia-600')
    : (percent < 30 ? 'bg-gradient-to-r from-red-600 to-orange-500' : 'bg-gradient-to-r from-blue-600 to-cyan-400');

  return (
    <div className="w-full">
      <div className="flex justify-between items-end mb-1 px-1">
        <span className={`text-[10px] sm:text-xs font-bold uppercase tracking-widest ${isEnemy ? 'text-rose-400' : 'text-cyan-400'}`}>{label}</span>
        <span className="text-[10px] sm:text-xs font-bold text-white tracking-widest">{current} / {max}</span>
      </div>
      <div className="h-2 sm:h-2.5 w-full bg-slate-900/80 rounded-full overflow-hidden border border-white/10 backdrop-blur-sm shadow-inner">
        <div className={`h-full ${bgGradient} transition-all duration-300 ease-out shadow-[0_0_10px_currentColor]`} style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
};

// COMPONENTE PRINCIPAL
function MarvelMathGame() {
  const [gameState, setGameState] = useState('START'); 
  const [selectedHero, setSelectedHero] = useState(null);
  const [playerHp, setPlayerHp] = useState(100);
  const [maxPlayerHp, setMaxPlayerHp] = useState(100);
  const [enemyIndex, setEnemyIndex] = useState(0);
  const [currentEnemy, setCurrentEnemy] = useState(null);
  
  const [messages, setMessages] = useState([]);
  const [question, setQuestion] = useState(null);
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [currentAttackInfo, setCurrentAttackInfo] = useState({ name: '', damage: 0, diff: 1 });
  
  const [shakePlayer, setShakePlayer] = useState(false);
  const [shakeEnemy, setShakeEnemy] = useState(false);
  const [flashEnemy, setFlashEnemy] = useState(false);
  const [flashPlayer, setFlashPlayer] = useState(false);
  const [flashSnap, setFlashSnap] = useState(false);
  
  const [combo, setCombo] = useState(0);
  const [isDefending, setIsDefending] = useState(false);
  const [heroLevel, setHeroLevel] = useState(1);
  const [energy, setEnergy] = useState(0);
  const [timeLeft, setTimeLeft] = useState(100);
  const [consecutiveHeals, setConsecutiveHeals] = useState(0);
  const [showJarvis, setShowJarvis] = useState(false);
  
  const [totalDamage, setTotalDamage] = useState(0); 
  const [highScore, setHighScore] = useState(0);
  const [isNewRecord, setIsNewRecord] = useState(false);
  const [thanosSnapped, setThanosSnapped] = useState(false);

  // Audio HTML Tag Control
  const [isMuted, setIsMuted] = useState(false);
  const bgMusicRef = useRef(null);

  useEffect(() => {
    const savedRecord = localStorage.getItem('marvelMathRecordGamer');
    if (savedRecord) setHighScore(parseInt(savedRecord));
  }, []);

  const toggleMute = () => {
    setIsMuted(!isMuted);
    playSound('click', !isMuted);
    if (bgMusicRef.current) {
      if (isMuted) bgMusicRef.current.play().catch(e=>console.log(e));
      else bgMusicRef.current.pause();
    }
  };

  useEffect(() => {
    let timer;
    if (question && !showJarvis) {
      setTimeLeft(100);
      timer = setInterval(() => setTimeLeft(prev => Math.max(0, prev - 1)), 600); 
    }
    return () => clearInterval(timer);
  }, [question, showJarvis]);

  const addMessage = (msg) => {
    setMessages(prev => {
      const newMessages = [...prev, msg];
      return newMessages.length > 3 ? newMessages.slice(1) : newMessages;
    });
  };

  const startHeroSelection = () => {
    playSound('click', isMuted);
    // Solucion definitiva para la música: reproducir la etiqueta audio HTML.
    if (bgMusicRef.current && !isMuted) {
       bgMusicRef.current.volume = 0.25;
       bgMusicRef.current.play().catch(e => console.log("Audio block", e));
    }
    setGameState('SELECT_HERO');
  };

  const initBattle = (hero) => {
    playSound('click', isMuted);
    setSelectedHero(hero); setPlayerHp(100); setMaxPlayerHp(100);
    setEnemyIndex(0); setCombo(0); setIsDefending(false);
    setHeroLevel(1); setEnergy(0); setTotalDamage(0);
    setIsNewRecord(false); setThanosSnapped(false); setConsecutiveHeals(0);
    startEncounter(0, hero);
    setGameState('BATTLE');
    setMessages([`INICIANDO ENLACE NEURAL...`, `¡${VILLAINS[0].name.toUpperCase()} DETECTADO EN ÁREA!`]);
  };

  const startEncounter = (index, hero = selectedHero) => {
    if (index >= VILLAINS.length) {
      if (totalDamage > highScore) {
        localStorage.setItem('marvelMathRecordGamer', totalDamage);
        setHighScore(totalDamage); setIsNewRecord(true);
      }
      playSound('victory', isMuted);
      setGameState('VICTORY');
      return;
    }
    setCurrentEnemy({ ...VILLAINS[index] });
    setIsPlayerTurn(true);
  };

  // BOTONES ACCION
  const handleAttackClick = (difficulty, attackName, baseDamage) => {
    if (!isPlayerTurn) return;
    playSound('click', isMuted);
    setCurrentAttackInfo({ name: attackName, damage: baseDamage, diff: difficulty });
    setQuestion(generateMathQuestion(difficulty));
  };

  const handleUltimateClick = () => {
    if (!isPlayerTurn || energy < 100) return;
    playSound('click', isMuted);
    setCurrentAttackInfo({ name: 'IMPACTO Z', damage: 200, diff: 3, isUltimate: true });
    setQuestion(generateUltimateQuestion());
  };

  const handleHealInit = () => {
    if (!isPlayerTurn || playerHp >= maxPlayerHp || consecutiveHeals >= 2) return;
    playSound('click', isMuted);
    addMessage(`[SISTEMA] Verificando Protocolo de Curación...`);
    setQuestion(generateHealQuestion());
  };

  const handleJoker5050 = () => {
    if (energy >= 50 && question && question.options.length > 2) {
      playSound('heal', isMuted);
      setEnergy(prev => prev - 50);
      const wrongOptions = question.options.filter(o => o !== question.correctAnswer);
      const randomWrong = wrongOptions[Math.floor(Math.random() * wrongOptions.length)];
      setQuestion(prev => ({...prev, options: [question.correctAnswer, randomWrong].sort(() => Math.random() - 0.5)}));
      addMessage(`[SISTEMA] Asistencia 50/50 activada.`);
    }
  };

  // RESOLUCIÓN DE PREGUNTAS
  const handleAnswer = (selectedOption) => {
    if (!question) return;
    const isCorrect = (selectedOption === question.correctAnswer);
    const qContext = question.context; 
    
    setQuestion(null);
    setIsPlayerTurn(false);

    if (qContext === 'HEAL') {
       if (isCorrect) {
          playSound('heal', isMuted);
          const heal = Math.floor(Math.random() * 10) + 25;
          setPlayerHp(prev => Math.min(prev + heal, maxPlayerHp));
          setIsDefending(true);
          setConsecutiveHeals(prev => prev + 1);
          addMessage(`>> CORTAFUEGOS PASADO: Escudos regenerados.`);
          setTimeout(enemyTurn, 1500);
       } else {
          playSound('error', isMuted);
          addMessage(`[ERROR] Cortafuegos fallido. Fórmula rechazada.`);
          addMessage(`[HUD] Corrección: ${question.formulaInfo}`);
          setTimeout(enemyTurn, 2500);
       }
       return;
    }

    if (qContext === 'ULTIMATE') {
       if (isCorrect) {
          setEnergy(0);
          setConsecutiveHeals(0);
          const finalDamage = Math.floor(currentAttackInfo.damage * (1 + (heroLevel - 1) * 0.2) * (currentEnemy.name === 'Thanos' || currentEnemy.name === 'Galactus' ? 2 : 1));
          addMessage(`>> HACKEO EXITOSO: ¡${selectedHero.name} lanza IMPACTO Z!`);
          setTotalDamage(prev => prev + finalDamage);
          setTimeout(() => playSound('hit', isMuted), 200);
          triggerEnemyDamage(finalDamage);
       } else {
          playSound('error', isMuted);
          setEnergy(0);
          addMessage(`[ERROR] Hackeo fallido. Energía purgada.`);
          addMessage(`[HUD] La respuesta era ${question.formulaInfo}`);
          setTimeout(enemyTurn, 2500);
       }
       return;
    }

    // ATAQUE NORMAL
    setConsecutiveHeals(0);
    if (isCorrect) {
      const newCombo = combo + 1;
      setCombo(newCombo);
      
      const variance = Math.floor(currentAttackInfo.damage * 0.2);
      let finalDamage = currentAttackInfo.damage - variance + Math.floor(Math.random() * (variance * 2 + 1));
      finalDamage = Math.floor(finalDamage * (1 + (heroLevel - 1) * 0.2));
      let timeBonus = timeLeft > 0 ? 1.5 : 1;
      finalDamage = Math.floor(finalDamage * (1 + (newCombo * 0.1)) * timeBonus);
      
      let attackEffectivenessMsg = '';
      if (currentEnemy.name === 'Loki' && currentAttackInfo.diff === 1) {
          finalDamage = 0; attackEffectivenessMsg = '[ALERTA] Daño evadido por ilusión.';
      } else if (currentEnemy.name === 'Doctor Doom' && currentAttackInfo.diff === 2) {
          finalDamage = Math.floor(finalDamage * 0.5); attackEffectivenessMsg = '[ALERTA] Escudo mitigó el impacto.';
      } else if (currentEnemy.name === 'Thanos' && currentAttackInfo.diff === 3) {
          finalDamage = finalDamage * 2; attackEffectivenessMsg = '[CRÍTICO] Punto débil explotado.';
      } else if (currentEnemy.name === 'Galactus' && currentAttackInfo.diff < 3 && !currentAttackInfo.isUltimate) {
          finalDamage = Math.floor(finalDamage * 0.3); attackEffectivenessMsg = '[ALERTA] Armadura Cósmica absorbió 70% daño.';
      }

      setEnergy(prev => Math.min(100, prev + 25));

      addMessage(`>> ${selectedHero.name} ejecuta ${currentAttackInfo.name}!`);
      if (attackEffectivenessMsg) addMessage(attackEffectivenessMsg);
      if (newCombo > 1 && finalDamage > 0) addMessage(`[COMBO x${newCombo}] Multiplicador activo.`);
      
      setTotalDamage(prev => prev + finalDamage);
      setTimeout(() => playSound('hit', isMuted), 200);
      triggerEnemyDamage(finalDamage);
    } else {
      playSound('error', isMuted);
      setCombo(0); 
      addMessage(`>> Cálculo fallido. Ataque cancelado.`);
      addMessage(`[HUD] Corrección: ${question.formulaInfo}`);
      setTimeout(enemyTurn, 2500);
    }
  };

  const handleOpenJarvis = () => {
    playSound('click', isMuted);
    if (gameState === 'BATTLE' && isPlayerTurn) {
        playSound('hit', isMuted);
        const damage = 15;
        setPlayerHp(prev => {
            const newHp = prev - damage;
            if (newHp <= 0) setTimeout(() => setGameState('GAME_OVER'), 1000);
            return newHp;
        });
        addMessage(`[PELIGRO] Enemigo atacó durante lectura de datos.`);
        setShakePlayer(true); setFlashPlayer(true);
        setTimeout(() => { setShakePlayer(false); setFlashPlayer(false); }, 500);
    }
    setShowJarvis(true);
  };

  const triggerEnemyDamage = (damage) => {
    if(damage > 0) {
      setShakeEnemy(true); setFlashEnemy(true);
      setTimeout(() => { setShakeEnemy(false); setFlashEnemy(false); }, 500);
    }
    
    setCurrentEnemy(prev => {
      const newHp = prev.hp - damage;
      if (prev.name === 'Thanos' && newHp > 0 && newHp <= prev.maxHp / 2 && !thanosSnapped) {
        setThanosSnapped(true);
        setTimeout(() => {
          playSound('snap', isMuted);
          setFlashSnap(true);
          addMessage(`[ANOMALÍA] THANOS HA CHASQUEADO LOS DEDOS...`);
          setPlayerHp(current => Math.floor(current / 2));
          setTimeout(() => setFlashSnap(false), 1500);
        }, 1500);
      }
      if (newHp <= 0) {
        setTimeout(() => handleEnemyDefeat(), 1000);
        return { ...prev, hp: 0 };
      }
      setTimeout(enemyTurn, thanosSnapped ? 3500 : 1500);
      return { ...prev, hp: newHp };
    });
  };

  const handleEnemyDefeat = () => {
    addMessage(`>> Objetivo neutralizado.`);
    setTimeout(() => {
      const nextIndex = enemyIndex + 1;
      if (nextIndex < VILLAINS.length) {
         const newMaxHp = maxPlayerHp + 30;
         setMaxPlayerHp(newMaxHp);
         setPlayerHp(prev => Math.min(prev + Math.floor(newMaxHp * 0.5), newMaxHp));
         setHeroLevel(prev => prev + 1);
         playSound('heal', isMuted);
         addMessage(`[SISTEMA] Nivel aumentado a ${heroLevel + 1}!`);
         setTimeout(() => {
             addMessage(`¡NUEVO OBJETIVO: ${VILLAINS[nextIndex].name.toUpperCase()}!`);
             setEnemyIndex(nextIndex); startEncounter(nextIndex);
         }, 2000);
      } else {
          if (totalDamage > highScore) { localStorage.setItem('marvelMathRecordGamer', totalDamage); setHighScore(totalDamage); setIsNewRecord(true); }
          setGameState('VICTORY');
      }
    }, 2000);
  };

  const enemyTurn = () => {
    addMessage(`>> ${currentEnemy.name} lanza un ataque ofensivo.`);
    setTimeout(() => {
      const isCritical = Math.random() > 0.8;
      let baseDamage = Math.floor(Math.random() * 5) + 5 + (currentEnemy.level * 5);
      if (isDefending) { baseDamage = Math.floor(baseDamage * 0.5); setIsDefending(false); }
      const finalDamage = isCritical ? Math.floor(baseDamage * 1.5) : baseDamage;
      
      playSound('hit', isMuted);
      setShakePlayer(true); setFlashPlayer(true);
      setTimeout(() => { setShakePlayer(false); setFlashPlayer(false); }, 500);
      if (isCritical) addMessage(`[DAÑO CRÍTICO RECIBIDO]`);
      
      setPlayerHp(prev => {
        const newHp = prev - finalDamage;
        if (newHp <= 0) { setTimeout(() => setGameState('GAME_OVER'), 1000); return 0; }
        setIsPlayerTurn(true); return newHp;
      });
    }, 1500);
  };

  const MusicToggle = () => (
    <button onClick={toggleMute} className="absolute top-4 left-4 z-50 bg-slate-900/80 backdrop-blur border border-white/20 p-3 rounded-full text-white hover:bg-slate-700 active:scale-95 transition-all shadow-[0_0_15px_rgba(255,255,255,0.2)]">
       {isMuted ? '🔇' : '🎵'}
    </button>
  );

  // --- VISTAS MENÚ ---
  if (gameState === 'START') {
    return (
      <div className="min-h-screen bg-slate-950 bg-cover bg-center flex items-center justify-center p-4 relative" style={{ backgroundImage: `linear-gradient(to bottom, rgba(15,23,42,0.8), rgba(15,23,42,0.95)), url(${BG_LOBBY})`, fontFamily: "'Rajdhani', sans-serif" }}>
        {/* Etiqueta HTML pura para la música (mucho más fiable) */}
        <audio ref={bgMusicRef} src="https://cdn.pixabay.com/audio/2022/10/25/audio_51a24d35c2.mp3" loop preload="auto"></audio>
        
        <MusicToggle />
        <div className="max-w-lg w-full bg-slate-900/60 backdrop-blur-xl border border-cyan-500/30 p-8 sm:p-10 text-center shadow-[0_0_50px_rgba(6,182,212,0.15)] rounded-2xl relative">
          <div className="absolute top-3 right-5 text-xs font-bold text-cyan-500/50 uppercase tracking-widest">{APP_VERSION}</div>
          
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-black mb-2 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 uppercase tracking-widest drop-shadow-[0_0_15px_rgba(6,182,212,0.5)] mt-4 leading-none pb-2">
            POKENGERS<br/><span className="text-3xl sm:text-5xl text-white block mt-2">GEOMETRY FIGHT</span>
          </h1>
          
          <div className="mb-8 mt-6 text-[10px] sm:text-xs text-slate-400 tracking-widest uppercase border-b border-white/10 pb-4">
            Diseñado y desarrollado por <span className="text-cyan-300 font-bold">Jose Manuel Santos</span>
          </div>

          {highScore > 0 && <div className="mb-8 text-sm font-bold text-yellow-300 bg-yellow-500/10 py-3 rounded-lg border border-yellow-500/30 shadow-[0_0_15px_rgba(234,179,8,0.2)] animate-pulse tracking-widest">🏆 HIGH SCORE: {highScore} DMG</div>}
          
          <p className="mb-10 text-slate-300 text-base sm:text-lg leading-relaxed bg-black/40 p-5 rounded-xl border border-white/5">
            Calcula áreas y volúmenes de cabeza <strong className="text-cyan-400">(Usa π=3)</strong>. Curarse requerirá saberse la teoría pura.
          </p>
          <button onClick={startHeroSelection} className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold py-5 rounded-xl uppercase tracking-[0.2em] transition-all text-xl shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:shadow-[0_0_30px_rgba(6,182,212,0.6)] active:scale-95">INICIAR ENLACE</button>
        </div>
      </div>
    );
  }

  if (gameState === 'SELECT_HERO') {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative" style={{ backgroundImage: `linear-gradient(to bottom, rgba(15,23,42,0.9), rgba(15,23,42,0.95)), url(${BG_LOBBY})`, backgroundSize: 'cover', fontFamily: "'Rajdhani', sans-serif" }}>
        <MusicToggle />
        <div className="max-w-4xl w-full bg-slate-900/60 backdrop-blur-xl border border-white/10 p-8 sm:p-12 text-center shadow-2xl rounded-3xl">
          <h2 className="text-3xl font-black mb-10 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 uppercase tracking-widest">Selecciona tu Operador</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
            {HEROES.map((hero) => (
              <button key={hero.id} onClick={() => { initBattle(hero); }} className={`bg-slate-800/50 backdrop-blur border border-white/10 p-6 hover:bg-slate-700/50 transition-all flex flex-col items-center group relative overflow-hidden ${hero.glow} hover:-translate-y-2`} style={{ clipPath: 'polygon(10% 0%, 100% 0%, 90% 100%, 0% 100%)' }}>
                <div className="absolute inset-0 bg-gradient-to-t from-cyan-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="w-24 h-24 sm:w-28 sm:h-28 mb-4 flex items-center justify-center overflow-hidden rounded-full border-2 border-white/20 shadow-inner relative z-10 bg-slate-900"><img src={hero.img} alt={hero.name} className="w-full h-full object-cover mix-blend-screen opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-all" /></div>
                <span className="text-white font-bold text-xl uppercase tracking-widest relative z-10">{hero.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (gameState === 'GAME_OVER') {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
        <div className="absolute inset-0 bg-red-900/20 animate-pulse"></div>
        <MusicToggle />
        <div className="max-w-md w-full bg-slate-900/80 backdrop-blur-xl border border-red-500/50 p-10 text-center shadow-[0_0_50px_rgba(220,38,38,0.3)] rounded-2xl relative z-10">
          <h1 className="text-5xl font-black mb-6 text-red-500 uppercase tracking-widest drop-shadow-[0_0_15px_rgba(220,38,38,0.8)]">ENLACE PERDIDO</h1>
          <p className="mb-10 text-lg text-slate-300 bg-black/50 p-5 rounded-xl border border-red-500/20 leading-relaxed">El operador {selectedHero?.name} ha caído en combate. Repasa los algoritmos matemáticos e inténtalo de nuevo.</p>
          <button onClick={startHeroSelection} className="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-5 rounded-xl uppercase tracking-widest transition-all text-xl shadow-[0_0_20px_rgba(220,38,38,0.4)] active:scale-95">REINICIAR SISTEMA</button>
        </div>
      </div>
    );
  }

  if (gameState === 'VICTORY') {
    const finalRank = getRank(totalDamage);
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 relative overflow-hidden" style={{ backgroundImage: `linear-gradient(to bottom, rgba(15,23,42,0.8), rgba(15,23,42,0.95)), url(${BG_SPACE})`, backgroundSize: 'cover', fontFamily: "'Rajdhani', sans-serif" }}>
        <MusicToggle />
        <div className={`max-w-2xl w-full bg-slate-900/70 backdrop-blur-2xl border border-white/10 p-10 text-center rounded-3xl flex flex-col items-center relative z-10 ${finalRank.shadow}`}>
          
          {isNewRecord && <div className="bg-gradient-to-r from-yellow-600 to-yellow-400 text-black px-8 py-2 font-black text-xl uppercase tracking-[0.3em] shadow-[0_0_30px_rgba(234,179,8,0.8)] rounded-full mb-8 animate-pulse">NUEVO RÉCORD DE CLASE</div>}
          
          {/* SISTEMA DE RANGOS */}
          <div className={`text-8xl sm:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-br ${finalRank.color} drop-shadow-[0_0_15px_rgba(255,255,255,0.5)] mb-2 animate-bounce`}>
            {finalRank.rank}
          </div>
          <div className={`text-2xl sm:text-3xl font-bold uppercase tracking-[0.3em] text-transparent bg-clip-text bg-gradient-to-r ${finalRank.color} mb-8`}>
             RANGO: {finalRank.text}
          </div>

          <div className="mb-10 text-slate-200 bg-black/40 p-8 rounded-2xl border border-white/10 w-full shadow-inner flex flex-col items-center">
            <p className="text-xl mb-6">El universo está a salvo gracias a tu velocidad de cálculo.</p>
            <div className={`font-black text-3xl text-white px-6 py-3 rounded-xl border border-white/30 bg-gradient-to-r ${finalRank.color} shadow-[0_0_15px_rgba(255,255,255,0.2)]`}>
              DAÑO INFLIGIDO: {totalDamage}
            </div>
          </div>
          <button onClick={startHeroSelection} className="px-12 bg-white hover:bg-slate-200 text-black font-black py-5 rounded-full uppercase tracking-widest text-xl shadow-[0_0_30px_rgba(255,255,255,0.5)] active:scale-95 transition-all">NUEVA MISIÓN</button>
        </div>
      </div>
    );
  }

  // --- PANTALLA BATALLA ---
  const qContextColors = {
    ATTACK: 'bg-slate-800/80 border-white/5',
    HEAL: 'bg-green-900/60 border-green-500/50 shadow-[0_0_30px_rgba(34,197,94,0.2)]',
    ULTIMATE: 'bg-yellow-900/60 border-yellow-500/50 shadow-[0_0_30px_rgba(234,179,8,0.2)]'
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center sm:p-4 relative" style={{fontFamily: "'Rajdhani', sans-serif"}}>
      <MusicToggle />
      {flashSnap && <div className="fixed inset-0 bg-white z-[100] pointer-events-none transition-opacity duration-1000 opacity-100 mix-blend-overlay"></div>}

      {showJarvis && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-4">
          <div className="bg-slate-900/90 border border-cyan-500/50 w-full max-w-2xl shadow-[0_0_50px_rgba(6,182,212,0.3)] rounded-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-cyan-900/50 to-blue-900/50 text-cyan-400 p-4 sm:p-5 flex justify-between items-center border-b border-cyan-500/30">
              <h3 className="text-xl sm:text-2xl font-black uppercase tracking-[0.2em] flex items-center gap-3"><span className="w-3 h-3 bg-cyan-400 rounded-full animate-pulse shadow-[0_0_10px_#22d3ee]"></span> BASE DE DATOS HUD</h3>
              <button onClick={() => {playSound('click', isMuted); setShowJarvis(false);}} className="text-cyan-400 text-lg sm:text-xl font-bold hover:text-white transition-colors">CERRAR [X]</button>
            </div>
            <div className="p-4 sm:p-8 text-slate-300 text-base sm:text-lg max-h-[65vh] overflow-y-auto grid sm:grid-cols-2 gap-4 sm:gap-6">
              <div className="bg-black/50 p-4 sm:p-5 rounded-xl border border-white/5"><p className="font-bold text-orange-400 border-b border-orange-400/30 mb-3 pb-1 tracking-widest uppercase text-xs sm:text-sm">Áreas 2D</p><ul className="space-y-1 sm:space-y-2"><li><b>Cuadrado:</b> Lado × Lado</li><li><b>Rect/Para:</b> Base × Altura</li><li><b>Triángulo:</b> (Base × Alt) / 2</li><li><b>Círculo:</b> π × r²</li></ul></div>
              <div className="bg-black/50 p-4 sm:p-5 rounded-xl border border-white/5"><p className="font-bold text-blue-400 border-b border-blue-400/30 mb-3 pb-1 tracking-widest uppercase text-xs sm:text-sm">Volúmenes Base</p><ul className="space-y-1 sm:space-y-2"><li><b>Cubo:</b> Arista³</li><li><b>Prisma:</b> Largo × Ancho × Altura</li></ul></div>
              <div className="bg-black/50 p-4 sm:p-5 rounded-xl border border-white/5 sm:col-span-2"><p className="font-bold text-purple-400 border-b border-purple-400/30 mb-3 pb-1 tracking-widest uppercase text-xs sm:text-sm">Volúmenes (¡Truco π=3!)</p><ul className="grid sm:grid-cols-2 gap-2"><li><b>Cilindro:</b> π × r² × Alt</li><li><b>Pirámide:</b> (AreaBase × Alt) / 3</li><li><b>Cono:</b> (π × r² × Alt) / 3</li><li><b>Esfera:</b> (4/3) × π × r³</li></ul></div>
              <div className="bg-black/50 p-4 sm:p-5 rounded-xl border border-white/5 sm:col-span-2"><p className="font-bold text-green-400 border-b border-green-400/30 mb-3 pb-1 tracking-widest uppercase text-xs sm:text-sm">Equivalencias</p><ul className="flex flex-col sm:flex-row justify-around gap-2"><li><b>Capacidad:</b> 1m³ = 1000L</li><li><b>Masa:</b> 1dm³ = 1kg</li></ul></div>
            </div>
          </div>
        </div>
      )}

      {/* CONTENEDOR PRINCIPAL CON FLEXBOX LÍQUIDO */}
      <div className="w-full max-w-5xl bg-slate-900 sm:rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col h-[100dvh] sm:h-[90vh] max-h-[900px] relative border border-white/10">
        
        {/* ESCENARIO DE BATALLA */}
        <div className={`flex-[1.3] sm:flex-[1.4] min-h-0 w-full relative bg-slate-950 ${flashEnemy ? 'bg-red-900/50' : ''} ${flashPlayer ? 'bg-rose-900/50' : ''} transition-colors duration-300 flex flex-col justify-between py-4 px-3 sm:p-6 z-10`}>
          
          {currentEnemy?.bg && <><div className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-screen pointer-events-none" style={{ backgroundImage: `url(${currentEnemy.bg})` }}></div><div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-transparent to-slate-950 pointer-events-none"></div></>}

          {/* FILA SUPERIOR: ENEMIGO */}
          <div className="flex justify-between items-start z-20 w-full relative gap-2">
             <div className="flex-1 max-w-[200px] sm:max-w-xs bg-black/60 backdrop-blur-md p-2 sm:p-4 rounded-2xl border border-rose-500/30 shadow-[0_0_20px_rgba(225,29,72,0.2)]">
                <div className="flex justify-between items-baseline mb-1 sm:mb-2">
                   <h2 className="font-black text-[11px] sm:text-xl uppercase text-white tracking-widest drop-shadow-[0_0_5px_rgba(255,255,255,0.8)] truncate pr-1">{currentEnemy?.name}</h2>
                   <span className="text-[9px] sm:text-sm font-bold text-rose-400 bg-rose-500/10 px-1.5 py-0.5 rounded">Lv{currentEnemy?.level}</span>
                </div>
                <CyberHealthBar current={currentEnemy?.hp} max={currentEnemy?.maxHp} label="INTEGRIDAD" isEnemy={true} />
             </div>

             <div className={`shrink-0 transition-all duration-150 ${shakeEnemy ? 'translate-x-6 -translate-y-2 brightness-150 saturate-150' : ''}`}>
               <SlantedAvatar isEnemy={true} src={currentEnemy?.img} alt={currentEnemy?.name} fallback={currentEnemy?.fallback} />
             </div>
          </div>

          {/* FILA INFERIOR: JUGADOR */}
          <div className="flex justify-between items-end z-20 w-full relative gap-2">
             <div className={`shrink-0 z-30 transition-all duration-150 ${shakePlayer ? '-translate-x-6 translate-y-2 brightness-150 saturate-150' : ''}`}>
                <SlantedAvatar isEnemy={false} src={selectedHero?.img} alt={selectedHero?.name} fallback={selectedHero?.fallback} />
             </div>

             <div className="flex-1 max-w-[200px] sm:max-w-xs bg-black/60 backdrop-blur-md p-2 sm:p-4 rounded-2xl border border-cyan-500/30 shadow-[0_0_20px_rgba(6,182,212,0.2)] relative z-20">
                <div className="flex justify-between items-baseline mb-1 sm:mb-2">
                   <h2 className="font-black text-[11px] sm:text-xl uppercase text-white tracking-widest drop-shadow-[0_0_5px_rgba(255,255,255,0.8)] truncate pr-1">{selectedHero?.name}</h2>
                   <span className="text-[9px] sm:text-sm font-bold text-cyan-400 bg-cyan-500/10 px-1.5 py-0.5 rounded">Lv{heroLevel}</span>
                </div>
                <CyberHealthBar current={playerHp} max={maxPlayerHp} label="ESCUDOS" isEnemy={false} />
                <div className="mt-1 sm:mt-2">
                  <div className="flex justify-between items-end mb-1"><span className="text-[8px] sm:text-[10px] font-bold uppercase tracking-widest text-yellow-400">ENERGÍA Z</span><span className="text-[9px] sm:text-xs font-bold text-white">{energy}%</span></div>
                  <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden border border-white/10"><div className="h-full bg-gradient-to-r from-yellow-500 to-amber-300 shadow-[0_0_10px_currentColor] transition-all duration-300" style={{ width: `${energy}%` }} /></div>
                </div>
             </div>
          </div>
        </div>

        {/* UI INFERIOR (Controles y Diálogo) */}
        <div className="flex-1 min-h-0 w-full bg-slate-900 border-t border-white/10 p-2 sm:p-4 flex flex-col relative z-20">
          {question ? (
             <div className={`h-full w-full backdrop-blur rounded-2xl p-2 sm:p-4 flex flex-col animate-in slide-in-from-bottom-4 border ${qContextColors[question.context]} min-h-0 overflow-y-auto`}>
                <div className="flex justify-between items-center gap-2 sm:gap-4 mb-2 sm:mb-3 shrink-0">
                   <div className={`bg-black/60 border p-2 sm:p-3 text-xs sm:text-xl font-bold text-center flex-1 rounded-xl tracking-wide ${question.context === 'HEAL' ? 'border-green-500/50 text-green-300' : question.context === 'ULTIMATE' ? 'border-yellow-500/50 text-yellow-300' : 'border-white/10 text-white'}`}>
                     {question.text}
                   </div>
                   {question.options.length > 2 && (
                       <button onClick={handleJoker5050} disabled={energy < 50} className="w-14 sm:w-20 shrink-0 bg-blue-600/20 hover:bg-blue-600/40 disabled:bg-slate-800 disabled:opacity-50 border border-blue-400/50 disabled:border-slate-700 rounded-xl font-bold text-blue-300 flex flex-col items-center justify-center p-1 sm:p-2 transition-all active:scale-95 shadow-[0_0_15px_rgba(59,130,246,0.1)]">
                         <span className="text-xs sm:text-lg">50/50</span><span className="text-[7px] sm:text-[10px] opacity-80 uppercase tracking-widest">-50 EN</span>
                       </button>
                   )}
                </div>
                
                <div className="w-full h-1.5 sm:h-2 bg-slate-900 mb-2 sm:mb-3 rounded-full overflow-hidden relative border border-white/5 shrink-0">
                  <div className={`absolute left-0 top-0 h-full ${timeLeft > 20 ? 'bg-cyan-400 shadow-[0_0_10px_#22d3ee]' : 'bg-red-500 animate-pulse shadow-[0_0_10px_#ef4444]'}`} style={{ width: `${timeLeft}%` }} />
                </div>

                <div className={`grid gap-1.5 sm:gap-3 flex-1 min-h-0 ${question.options.length === 2 ? 'grid-cols-1' : 'grid-cols-2'}`}>
                  {question.options.map((opt, idx) => (
                    <button key={idx} onClick={() => handleAnswer(opt)} className="bg-slate-800/80 hover:bg-cyan-600/40 border border-slate-600 hover:border-cyan-400 font-bold text-white transition-all flex items-center justify-center text-sm sm:text-2xl rounded-xl hover:shadow-[0_0_20px_rgba(6,182,212,0.2)] active:scale-95 py-1.5 sm:py-2 px-2 sm:px-4 text-center leading-tight">
                      {opt} <span className="text-[10px] sm:text-base ml-1 text-slate-400">{question.unit}</span>
                    </button>
                  ))}
                </div>
             </div>
          ) : (
            <div className="h-full w-full flex flex-col sm:flex-row gap-2 sm:gap-4 overflow-hidden min-h-0">
              {/* REGISTRO COMBATE */}
              <div className="flex-1 sm:flex-[1.2] bg-black/40 rounded-2xl border border-white/5 p-2 sm:p-3 relative flex flex-col shadow-inner overflow-hidden min-h-0">
                 <div className="flex justify-between items-center mb-1 border-b border-white/10 pb-1 shrink-0">
                    <span className="text-[9px] sm:text-xs font-bold text-slate-500 uppercase tracking-[0.2em]">Registro</span>
                    <button onClick={handleOpenJarvis} className="bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 px-2 py-0.5 rounded border border-cyan-500/30 text-[9px] sm:text-xs font-bold uppercase tracking-widest transition-all active:scale-95 flex items-center gap-1">
                       <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse"></span> HUD
                    </button>
                 </div>
                 <div className="flex-1 overflow-y-auto flex flex-col justify-end space-y-0.5 pr-1">
                   {messages.map((msg, i) => (
                     <div key={i} className={`flex items-start gap-1 sm:gap-2 ${i === messages.length - 1 ? 'text-white drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]' : 'text-slate-500'} text-xs sm:text-lg font-medium tracking-wide`}>
                       <p dangerouslySetInnerHTML={{ __html: msg }}></p>
                     </div>
                   ))}
                   {isPlayerTurn && <p className="font-black text-cyan-400 text-sm sm:text-xl mt-1 sm:mt-2 animate-pulse">¿ORDEN DE ATAQUE?</p>}
                 </div>
              </div>

              {/* CONTROLES */}
              {isPlayerTurn && (
                <div className="w-full sm:w-[45%] flex flex-col gap-1.5 sm:gap-2 overflow-y-auto pr-1 min-h-0 shrink-0 sm:shrink">
                  <div className="grid grid-cols-2 gap-1.5 sm:gap-2 flex-1 min-h-0">
                    {selectedHero?.attacks.map((attack, index) => {
                      const glowColors = ['hover:border-blue-400 hover:shadow-[0_0_15px_rgba(96,165,250,0.3)] text-blue-300', 'hover:border-purple-400 hover:shadow-[0_0_15px_rgba(192,132,252,0.3)] text-purple-300', 'hover:border-rose-400 hover:shadow-[0_0_15px_rgba(251,113,133,0.3)] text-rose-300'];
                      return (
                        <button key={index} onClick={() => handleAttackClick(attack.diff, attack.name, attack.dmg)} className={`bg-slate-800/50 border border-slate-700 rounded-xl flex flex-col items-center justify-center p-1.5 sm:p-2 transition-all active:scale-95 min-h-[40px] sm:min-h-[50px] ${glowColors[index]}`}>
                          <span className="font-bold uppercase text-[10px] sm:text-sm md:text-base tracking-widest text-center leading-none">{attack.name}</span>
                        </button>
                      )
                    })}
                    <button onClick={handleHealInit} disabled={playerHp >= maxPlayerHp || consecutiveHeals >= 2} className="bg-slate-800/50 hover:bg-green-900/30 border border-slate-700 hover:border-green-400 hover:shadow-[0_0_15px_rgba(74,222,128,0.3)] text-green-400 rounded-xl flex flex-col items-center justify-center p-1.5 sm:p-2 transition-all active:scale-95 disabled:opacity-30 disabled:hover:border-slate-700 disabled:active:scale-100 min-h-[40px] sm:min-h-[50px]">
                      <span className="font-bold uppercase text-[10px] sm:text-sm md:text-base tracking-widest text-center leading-none">{consecutiveHeals >= 2 ? 'LÍMITE' : 'REGENERAR'}</span>
                    </button>
                  </div>
                  {energy >= 100 && (
                    <button onClick={handleUltimateClick} className="w-full shrink-0 bg-gradient-to-r from-yellow-600 to-yellow-400 hover:from-yellow-500 hover:to-yellow-300 text-black font-black uppercase text-[11px] sm:text-lg tracking-[0.2em] py-2 rounded-xl shadow-[0_0_20px_rgba(234,179,8,0.4)] active:scale-95 transition-all animate-pulse mt-0.5">
                      HACKEO ATAQUE Z
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const checkStyles = setInterval(() => { if (window.tailwind) { setReady(true); clearInterval(checkStyles); } }, 100);
    return () => clearInterval(checkStyles);
  }, []);

  if (!ready) return <div style={{background:'#0f172a', color:'#22d3ee', height:'100vh', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'sans-serif', fontSize:'24px', fontWeight:'bold', letterSpacing:'0.2em'}}>INICIANDO SISTEMAS...</div>;
  return <MarvelMathGame />;
}
