import React, { useState, useEffect } from 'react';

// --- AUTO-INSTALADOR DE ESTILOS (TAILWIND) ---
// Esto garantiza que el juego se vea bien en cualquier plataforma sin configurar nada
if (
  typeof document !== 'undefined' &&
  !document.getElementById('tailwind-cdn')
) {
  const script = document.createElement('script');
  script.id = 'tailwind-cdn';
  script.src = 'https://cdn.tailwindcss.com';
  document.head.appendChild(script);
}

// --- UTILIDADES MATEMÁTICAS ---
const PI = 3.14;

const roundToTwo = (num) => Math.round(num * 100) / 100;

const generateQuestion = (difficulty) => {
  let availableTypes = [];

  if (difficulty === 1) {
    availableTypes = ['volumen_cubo', 'volumen_prisma', 'conversion_simple'];
  } else if (difficulty === 2) {
    availableTypes = [
      'volumen_cilindro',
      'volumen_piramide',
      'equivalencia_capacidad',
    ];
  } else {
    availableTypes = ['volumen_cono', 'volumen_esfera', 'equivalencia_masa'];
  }

  const type =
    availableTypes[Math.floor(Math.random() * availableTypes.length)];

  let questionText = '';
  let correctAnswer = 0;
  let unit = '';
  let formulaInfo = '';

  switch (type) {
    case 'volumen_cubo':
      const arista = Math.floor(Math.random() * 6) + 3;
      questionText = `Calcula el volumen de un cubo de arista ${arista} cm.`;
      correctAnswer = arista * arista * arista;
      unit = 'cm³';
      formulaInfo = 'V = Arista³ (Lado × Lado × Lado)';
      break;
    case 'volumen_prisma':
      const l = Math.floor(Math.random() * 6) + 3;
      const w = Math.floor(Math.random() * 4) + 2;
      const h = Math.floor(Math.random() * 8) + 4;
      questionText = `Calcula el volumen de un prisma rectangular de dimensiones ${l}x${w}x${h} cm.`;
      correctAnswer = l * w * h;
      unit = 'cm³';
      formulaInfo = 'V = Largo × Ancho × Altura';
      break;
    case 'volumen_piramide':
      const baseL = Math.floor(Math.random() * 6) + 3;
      const hPir = Math.floor(Math.random() * 6) + 4;
      questionText = `Calcula el volumen de una pirámide de base cuadrada (lado ${baseL} cm) y altura ${hPir} cm.`;
      correctAnswer = roundToTwo((baseL * baseL * hPir) / 3);
      unit = 'cm³';
      formulaInfo = 'V = (Área de la base × Altura) / 3';
      break;
    case 'volumen_cilindro':
      const rCil = Math.floor(Math.random() * 4) + 2;
      const hCil = Math.floor(Math.random() * 6) + 4;
      questionText = `Calcula el volumen de un cilindro de radio ${rCil} cm y altura ${hCil} cm (usa pi = 3.14).`;
      correctAnswer = roundToTwo(PI * rCil * rCil * hCil);
      unit = 'cm³';
      formulaInfo = 'V = π × r² × Altura';
      break;
    case 'volumen_cono':
      const rCono = Math.floor(Math.random() * 5) + 3;
      const hCono = Math.floor(Math.random() * 6) + 4;
      questionText = `Calcula el volumen de un cono de radio ${rCono} cm y altura ${hCono} cm (usa pi = 3.14).`;
      correctAnswer = roundToTwo((PI * rCono * rCono * hCono) / 3);
      unit = 'cm³';
      formulaInfo = 'V = (π × r² × Altura) / 3';
      break;
    case 'volumen_esfera':
      const rEsf = Math.floor(Math.random() * 4) + 2;
      questionText = `Calcula el volumen de una esfera de radio ${rEsf} cm (usa pi = 3.14).`;
      correctAnswer = roundToTwo((4 * PI * Math.pow(rEsf, 3)) / 3);
      unit = 'cm³';
      formulaInfo = 'V = (4/3) × π × r³';
      break;
    case 'conversion_simple':
      const litros = Math.floor(Math.random() * 15) + 2;
      questionText = `Convierte ${litros} Litros (L) a mililitros (mL).`;
      correctAnswer = litros * 1000;
      unit = 'mL';
      formulaInfo = '1 Litro = 1000 mililitros';
      break;
    case 'equivalencia_capacidad':
      const m3 = Math.floor(Math.random() * 8) + 2;
      questionText = `¿Cuántos litros (L) de capacidad tiene una piscina de ${m3} m³ de volumen?`;
      correctAnswer = m3 * 1000;
      unit = 'L';
      formulaInfo = '1 m³ = 1000 Litros';
      break;
    case 'equivalencia_masa':
      const dm3 = Math.floor(Math.random() * 50) + 15;
      questionText = `Si tienes un depósito con ${dm3} dm³ de agua pura, ¿cuál es su masa en kilogramos (kg)?`;
      correctAnswer = dm3;
      unit = 'kg';
      formulaInfo = '1 dm³ de agua = 1 Litro = 1 kg';
      break;
    default:
      questionText = `Calcula el volumen de un cubo de arista 5 cm.`;
      correctAnswer = 125;
      unit = 'cm³';
      formulaInfo = 'V = Arista³';
  }

  const options = new Set([correctAnswer]);
  while (options.size < 4) {
    let wrongAnswer;
    let baseOffset = correctAnswer > 100 ? 10 : 2;
    let randomFactor =
      Math.floor(Math.random() * (correctAnswer > 100 ? 50 : 10)) + baseOffset;
    const sign = Math.random() > 0.5 ? 1 : -1;

    if (correctAnswer % 1 !== 0) {
      wrongAnswer = roundToTwo(correctAnswer + randomFactor * sign * 1.5);
    } else {
      wrongAnswer = roundToTwo(correctAnswer + randomFactor * sign);
    }

    if (wrongAnswer > 0 && wrongAnswer !== correctAnswer) {
      options.add(wrongAnswer);
    }
  }

  return {
    text: questionText,
    options: Array.from(options).sort(() => Math.random() - 0.5),
    correctAnswer: correctAnswer,
    unit: unit,
    formula: formulaInfo,
  };
};

// --- BASE DE DATOS DE PERSONAJES ---
const HEROES = [
  {
    id: 'ironman',
    name: 'Iron Man',
    img: 'https://i.ibb.co/27K5dCBM/b751779a4a3bbc38f9268036cdb5af5a.gif',
    fallback: '🤖',
    color: 'border-red-500',
    attacks: [
      { name: 'Rayo Repulsor', diff: 1, dmg: 15 },
      { name: 'Misil Táctico', diff: 2, dmg: 35 },
      { name: 'Unirrayo', diff: 3, dmg: 60 },
    ],
  },
  {
    id: 'cap',
    name: 'Capitán América',
    img: 'https://i.ibb.co/XqT34sz/189868-C0-D40619-AD55-4-B4-C-BE57-9005-D2506967-0-1643400842.gif',
    fallback: '🛡️',
    color: 'border-blue-500',
    attacks: [
      { name: 'Golpe de Escudo', diff: 1, dmg: 15 },
      { name: 'Lanzamiento', diff: 2, dmg: 35 },
      { name: 'Carga Heroica', diff: 3, dmg: 60 },
    ],
  },
  {
    id: 'thor',
    name: 'Thor',
    img: 'https://i.ibb.co/PsFhhF1g/f604e46c6979b173d319fc064ed5c0dc.gif',
    fallback: '⚡',
    color: 'border-yellow-400',
    attacks: [
      { name: 'Golpe Mjolnir', diff: 1, dmg: 15 },
      { name: 'Trueno', diff: 2, dmg: 35 },
      { name: 'Tormenta Divina', diff: 3, dmg: 60 },
    ],
  },
  {
    id: 'widow',
    name: 'Viuda Negra',
    img: 'https://i.ibb.co/JjJQnWcH/0c2a5632830679-569563b0d45b2.gif',
    fallback: '🕷️',
    color: 'border-gray-500',
    attacks: [
      { name: 'Ataque Marcial', diff: 1, dmg: 15 },
      { name: 'Picadura', diff: 2, dmg: 35 },
      { name: 'Takedown', diff: 3, dmg: 60 },
    ],
  },
  {
    id: 'strange',
    name: 'Dr. Strange',
    img: 'https://i.ibb.co/M5VX25W0/tumblr-n11ui8-Bh-NU1r8bj4ko1-500.gif',
    fallback: '👁️',
    color: 'border-orange-500',
    attacks: [
      { name: 'Látigo Místico', diff: 1, dmg: 15 },
      { name: 'Escudo Seraphim', diff: 2, dmg: 35 },
      { name: 'Ojo de Agamotto', diff: 3, dmg: 60 },
    ],
  },
  {
    id: 'hulk',
    name: 'Hulk',
    img: 'https://i.ibb.co/BV1dZJCH/tumblr-nkx9ln-Ha8c1tiwiyxo1-640.gif',
    fallback: '💪',
    color: 'border-green-500',
    attacks: [
      { name: 'Puñetazo', diff: 1, dmg: 15 },
      { name: 'Lanzar Roca', diff: 2, dmg: 35 },
      { name: '¡HULK APLASTA!', diff: 3, dmg: 60 },
    ],
  },
];

const VILLAINS = [
  {
    name: 'Ultron',
    hp: 120,
    maxHp: 120,
    level: 1,
    img: 'https://i.ibb.co/tpVWKW0d/marvel-future-fight-infinity-ultron.gif',
    fallback: '🦾',
    bgImg:
      'https://images.unsplash.com/photo-1505506874110-6a7a4c9d2433?auto=format&fit=crop&q=80&w=1000',
    trait: 'Robot: Combate estándar.',
  },
  {
    name: 'Loki',
    hp: 180,
    maxHp: 180,
    level: 1,
    img: 'https://i.ibb.co/Ps65bscK/loki.gif',
    fallback: '🐍',
    bgImg:
      'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&q=80&w=1000',
    trait: 'Ilusiones: Inmune a Ataques Fáciles.',
  },
  {
    name: 'Doctor Doom',
    hp: 260,
    maxHp: 260,
    level: 2,
    img: 'https://i.ibb.co/67dZ8jpD/doctor-doom-transparent-marvel-comics.gif',
    fallback: '🦹',
    bgImg:
      'https://images.unsplash.com/photo-1509904297379-379e436f5193?auto=format&fit=crop&q=80&w=1000',
    trait: 'Escudo Mágico: Reduce Ataques Medios.',
  },
  {
    name: 'Thanos',
    hp: 400,
    maxHp: 400,
    level: 3,
    img: 'https://i.ibb.co/7NjPsfgb/183d8eefe6fe041dd1169fdeaab016f8.gif',
    fallback: '🧤',
    bgImg:
      'https://images.unsplash.com/photo-1462332420958-a05d1e002413?auto=format&fit=crop&q=80&w=1000',
    trait: 'Titán Loco: Recibe Daño x2 de Ataques Definitivos.',
  },
];

const Avatar = ({ src, alt, fallback, className, isEnemy }) => {
  const [imgError, setImgError] = useState(false);

  return (
    <div className="relative flex flex-col items-center justify-end">
      {/* Plataforma Holográfica Estilo Pokémon */}
      <div
        className={`absolute bottom-0 w-[120%] h-[30%] rounded-[100%] z-0 blur-[2px] ${
          isEnemy ? 'bg-red-900/60' : 'bg-cyan-900/60'
        } border-b-2 ${isEnemy ? 'border-red-500' : 'border-cyan-400'}`}
      ></div>

      {imgError || !src ? (
        <div
          className={`flex items-center justify-center bg-slate-800 text-4xl shadow-inner relative z-10 ${className}`}
        >
          {fallback}
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          onError={() => setImgError(true)}
          className={`object-cover bg-black relative z-10 ${className}`}
        />
      )}
    </div>
  );
};

export default function App() {
  const [gameState, setGameState] = useState('START');
  const [selectedHero, setSelectedHero] = useState(null);

  const [playerHp, setPlayerHp] = useState(100);
  const [maxPlayerHp, setMaxPlayerHp] = useState(100);
  const [enemyIndex, setEnemyIndex] = useState(0);
  const [currentEnemy, setCurrentEnemy] = useState(null);

  const [messages, setMessages] = useState([]);
  const [question, setQuestion] = useState(null);
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [currentAttackInfo, setCurrentAttackInfo] = useState({
    name: '',
    damage: 0,
    diff: 1,
    isUltimate: false,
  });

  const [shakePlayer, setShakePlayer] = useState(false);
  const [shakeEnemy, setShakeEnemy] = useState(false);

  const [combo, setCombo] = useState(0);
  const [isDefending, setIsDefending] = useState(false);
  const [flashEnemy, setFlashEnemy] = useState(false);
  const [flashPlayer, setFlashPlayer] = useState(false);

  const [heroLevel, setHeroLevel] = useState(1);
  const [energy, setEnergy] = useState(0);
  const [timeLeft, setTimeLeft] = useState(100);

  const [showJarvis, setShowJarvis] = useState(false);

  useEffect(() => {
    let timer;
    if (question && !showJarvis) {
      setTimeLeft(100);
      timer = setInterval(() => {
        setTimeLeft((prev) => Math.max(0, prev - 1));
      }, 600);
    }
    return () => clearInterval(timer);
  }, [question, showJarvis]);

  const addMessage = (msg) => {
    setMessages((prev) => {
      const newMessages = [...prev, msg];
      return newMessages.length > 5 ? newMessages.slice(1) : newMessages;
    });
  };

  const startHeroSelection = () => setGameState('SELECT_HERO');

  const initBattle = (hero) => {
    setSelectedHero(hero);
    setPlayerHp(100);
    setMaxPlayerHp(100);
    setEnemyIndex(0);
    setCombo(0);
    setIsDefending(false);
    setHeroLevel(1);
    setEnergy(0);
    startEncounter(0, hero);
    setGameState('BATTLE');
    setMessages([
      `¡Adelante, ${hero.name}!`,
      `¡Un ${VILLAINS[0].name} salvaje apareció!`,
    ]);
  };

  const startEncounter = (index, hero = selectedHero) => {
    if (index >= VILLAINS.length) {
      setGameState('VICTORY');
      return;
    }
    const enemyProfile = { ...VILLAINS[index] };
    setCurrentEnemy(enemyProfile);
    setIsPlayerTurn(true);
  };

  const handleAttackClick = (
    difficulty,
    attackName,
    baseDamage,
    isUltimate = false
  ) => {
    if (!isPlayerTurn) return;
    setCurrentAttackInfo({
      name: attackName,
      damage: baseDamage,
      diff: difficulty,
      isUltimate,
    });
    const newQuestion = generateQuestion(difficulty);
    setQuestion(newQuestion);
  };

  const handleAnswer = (selectedOption) => {
    if (!question) return;
    setQuestion(null);
    setIsPlayerTurn(false);

    if (selectedOption === question.correctAnswer) {
      const newCombo = combo + 1;
      setCombo(newCombo);

      const variance = Math.floor(currentAttackInfo.damage * 0.2);
      let finalDamage =
        currentAttackInfo.damage -
        variance +
        Math.floor(Math.random() * (variance * 2 + 1));

      finalDamage = Math.floor(finalDamage * (1 + (heroLevel - 1) * 0.2));
      let timeBonus = 1;
      if (timeLeft > 0) {
        timeBonus = 1.5;
      }

      const comboMultiplier = 1 + newCombo * 0.1;
      finalDamage = Math.floor(finalDamage * comboMultiplier * timeBonus);

      let attackEffectivenessMsg = '';
      if (currentEnemy.name === 'Loki' && currentAttackInfo.diff === 1) {
        finalDamage = 0;
        attackEffectivenessMsg = 'No afectó al enemigo... (Inmune a fácil)';
      } else if (
        currentEnemy.name === 'Doctor Doom' &&
        currentAttackInfo.diff === 2
      ) {
        finalDamage = Math.floor(finalDamage * 0.5);
        attackEffectivenessMsg = 'No es muy efectivo... (Escudo reduce medio)';
      } else if (
        currentEnemy.name === 'Thanos' &&
        currentAttackInfo.diff === 3
      ) {
        finalDamage = finalDamage * 2;
        attackEffectivenessMsg = '¡Es súper efectivo! (Daño x2)';
      }

      if (currentAttackInfo.isUltimate) {
        setEnergy(0);
        addMessage(`¡${selectedHero.name} usó ${currentAttackInfo.name}!`);
      } else {
        setEnergy((prev) => Math.min(100, prev + 25));
        addMessage(`¡${selectedHero.name} usó ${currentAttackInfo.name}!`);
      }

      if (attackEffectivenessMsg) addMessage(attackEffectivenessMsg);
      if (newCombo > 1 && finalDamage > 0)
        addMessage(`¡Golpe en racha x${newCombo}!`);

      triggerEnemyDamage(finalDamage);
    } else {
      setCombo(0);
      if (currentAttackInfo.isUltimate) setEnergy(0);

      addMessage(`¡${selectedHero.name} falló su ataque!`);
      addMessage(`J.A.R.V.I.S.: La fórmula correcta era: ${question.formula}`);
      setTimeout(enemyTurn, 2500);
    }
  };

  const handleHealClick = () => {
    if (!isPlayerTurn) return;
    const heal = Math.floor(Math.random() * 10) + 20;
    const newHp = Math.min(playerHp + heal, maxPlayerHp);
    setPlayerHp(newHp);
    setIsDefending(true);
    addMessage(`¡${selectedHero.name} usó Regenerar!`);
    addMessage(`Recupera PS y aumenta su defensa.`);
    setIsPlayerTurn(false);
    setTimeout(enemyTurn, 1500);
  };

  const handleOpenJarvis = () => {
    if (gameState === 'BATTLE' && isPlayerTurn) {
      const damage = 15;
      setPlayerHp((prev) => {
        const newHp = prev - damage;
        if (newHp <= 0) setTimeout(() => setGameState('GAME_OVER'), 1000);
        return newHp;
      });
      addMessage(
        `¡El enemigo atacó mientras mirabas la Pokédex/J.A.R.V.I.S! Pierdes ${damage} PS.`
      );
      setShakePlayer(true);
      setFlashPlayer(true);
      setTimeout(() => {
        setShakePlayer(false);
        setFlashPlayer(false);
      }, 500);
    }
    setShowJarvis(true);
  };

  const triggerEnemyDamage = (damage) => {
    setShakeEnemy(true);
    setFlashEnemy(true);
    setTimeout(() => {
      setShakeEnemy(false);
      setFlashEnemy(false);
    }, 500);

    setCurrentEnemy((prev) => {
      const newHp = prev.hp - damage;
      if (newHp <= 0) {
        setTimeout(() => handleEnemyDefeat(), 1000);
        return { ...prev, hp: 0 };
      } else {
        setTimeout(enemyTurn, 1500);
        return { ...prev, hp: newHp };
      }
    });
  };

  const handleEnemyDefeat = () => {
    addMessage(`¡${currentEnemy.name} se ha debilitado!`);
    setTimeout(() => {
      const nextIndex = enemyIndex + 1;
      if (nextIndex < VILLAINS.length) {
        const newMaxHp = maxPlayerHp + 30;
        const healAmount = Math.floor(newMaxHp * 0.5);
        setMaxPlayerHp(newMaxHp);
        setPlayerHp((prev) => Math.min(prev + healAmount, newMaxHp));
        setHeroLevel((prev) => prev + 1);
        addMessage(`¡${selectedHero.name} subió al Nivel ${heroLevel + 1}!`);
        setTimeout(() => {
          addMessage(`¡Un ${VILLAINS[nextIndex].name} salvaje apareció!`);
          setEnemyIndex(nextIndex);
          startEncounter(nextIndex);
        }, 1500);
      } else {
        setGameState('VICTORY');
      }
    }, 2000);
  };

  const enemyTurn = () => {
    addMessage(`¡${currentEnemy.name} usó Ataque Villano!`);

    setTimeout(() => {
      const isCritical = Math.random() > 0.8;
      let baseDamage =
        Math.floor(Math.random() * 5) + 5 + currentEnemy.level * 5;

      if (isDefending) {
        baseDamage = Math.floor(baseDamage * 0.5);
        setIsDefending(false);
      }

      const finalDamage = isCritical
        ? Math.floor(baseDamage * 1.5)
        : baseDamage;

      setShakePlayer(true);
      setFlashPlayer(true);
      setTimeout(() => {
        setShakePlayer(false);
        setFlashPlayer(false);
      }, 500);

      if (isCritical) addMessage(`¡Un golpe crítico!`);

      setPlayerHp((prev) => {
        const newHp = prev - finalDamage;
        if (newHp <= 0) {
          setTimeout(() => setGameState('GAME_OVER'), 1000);
          return 0;
        }
        setIsPlayerTurn(true);
        return newHp;
      });
    }, 1500);
  };

  // --- COMPONENTES UI ESTILO POKÉMON ---
  const PokeHealthBar = ({ current, max, label, colorClass = '' }) => {
    const percent = Math.max(0, (current / max) * 100);
    let barColor = 'bg-green-500';
    if (!colorClass) {
      if (percent <= 20) barColor = 'bg-red-500';
      else if (percent <= 50) barColor = 'bg-yellow-400';
    } else {
      barColor = colorClass;
    }

    return (
      <div className="w-full">
        <div className="flex justify-between items-end mb-1">
          <span className="text-[10px] sm:text-xs font-black uppercase text-slate-800 tracking-wider bg-slate-200 px-2 rounded-tl-lg rounded-br-lg border border-slate-400 shadow-sm">
            {label}
          </span>
          <span className="text-[9px] sm:text-[10px] font-bold text-slate-600">
            {current} / {max}
          </span>
        </div>
        <div className="h-2.5 sm:h-3 w-full bg-slate-300 rounded-full overflow-hidden border-2 border-slate-700 shadow-inner">
          <div
            className={`h-full ${barColor} transition-all duration-500 ease-out`}
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>
    );
  };

  // VISTAS DE MENÚ PRINCIPAL
  if (gameState === 'START') {
    return (
      <div className="min-h-screen bg-slate-800 flex items-center justify-center p-4 font-sans">
        <div className="max-w-md w-full bg-slate-100 rounded-3xl border-[12px] border-slate-700 p-8 text-center shadow-2xl relative overflow-hidden">
          <h1 className="text-4xl font-black mb-2 text-slate-800 uppercase tracking-widest drop-shadow-md">
            Pokémon
            <br />
            <span className="text-red-600 text-2xl">Edición Vengadores</span>
          </h1>
          <h2 className="text-lg font-bold mb-6 text-blue-600 uppercase tracking-widest border-b-4 border-slate-300 pb-4">
            Liga del Volumen
          </h2>
          <p className="mb-8 text-slate-700 font-medium leading-relaxed bg-white p-4 rounded-xl border-4 border-slate-300 shadow-inner text-sm">
            ¡Bienvenido a la región S.H.I.E.L.D.! Calcula volúmenes y
            capacidades para derrotar a los villanos. Memoriza las fórmulas o el
            profesor J.A.R.V.I.S. te cobrará el precio.
          </p>
          <button
            onClick={startHeroSelection}
            className="w-full bg-red-600 hover:bg-red-500 text-white font-black py-4 rounded-xl uppercase tracking-wider transition-all border-b-4 border-red-800 active:border-b-0 active:translate-y-1 text-lg shadow-lg flex items-center justify-center gap-2"
          >
            <span className="text-2xl">▶️</span> Pulsar START
          </button>
        </div>
      </div>
    );
  }

  if (gameState === 'SELECT_HERO') {
    return (
      <div className="min-h-screen bg-slate-800 flex items-center justify-center p-4 font-sans">
        <div className="max-w-2xl w-full bg-slate-100 rounded-3xl border-[12px] border-slate-700 p-8 text-center shadow-2xl">
          <h2 className="text-2xl font-black mb-6 text-slate-800 uppercase tracking-widest">
            Elige a tu Compañero
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
            {HEROES.map((hero) => (
              <button
                key={hero.id}
                onClick={() => initBattle(hero)}
                className={`group flex flex-col items-center bg-white p-4 rounded-2xl border-4 border-slate-300 hover:${hero.color} transition-all hover:-translate-y-1 hover:shadow-xl`}
              >
                <div className="w-20 h-20 rounded-full border-4 border-slate-200 mb-3 overflow-hidden bg-slate-800 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <img
                    src={hero.img}
                    alt={hero.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="text-slate-800 font-black text-sm uppercase">
                  {hero.name}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (gameState === 'GAME_OVER') {
    return (
      <div className="min-h-screen bg-slate-800 flex items-center justify-center p-4 font-sans">
        <div className="max-w-md w-full bg-slate-100 rounded-3xl border-[12px] border-slate-700 p-8 text-center shadow-2xl relative overflow-hidden">
          <h1 className="text-4xl font-black mb-4 uppercase tracking-widest text-red-600">
            ¡Te han vencido!
          </h1>
          <div className="mb-8 text-slate-700 font-medium leading-relaxed bg-white p-4 rounded-xl border-4 border-slate-300 shadow-inner text-sm">
            {selectedHero?.name} no tiene más energía para luchar. ¡Sal
            corriendo al centro de curación y estudia las fórmulas!
          </div>
          <button
            onClick={startHeroSelection}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-4 rounded-xl transition-all border-b-4 border-blue-800 active:border-b-0 active:translate-y-1 uppercase tracking-wider text-lg shadow-lg flex justify-center items-center gap-2"
          >
            <span className="text-2xl">🔄</span> Volver a Empezar
          </button>
        </div>
      </div>
    );
  }

  if (gameState === 'VICTORY') {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4 font-sans relative overflow-hidden">
        <style>
          {`
            @keyframes confetti-fall {
              0% { transform: translateY(-10vh) rotate(0deg); opacity: 1; }
              100% { transform: translateY(110vh) rotate(720deg); opacity: 0; }
            }
            .animate-confetti {
              animation: confetti-fall linear infinite;
            }
          `}
        </style>

        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
          {[...Array(80)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-confetti"
              style={{
                left: `${Math.random() * 100}%`,
                top: `-10%`,
                backgroundColor: [
                  '#ef4444',
                  '#3b82f6',
                  '#eab308',
                  '#22c55e',
                  '#a855f7',
                  '#06b6d4',
                ][Math.floor(Math.random() * 6)],
                width: `${Math.random() * 12 + 6}px`,
                height: `${Math.random() * 12 + 6}px`,
                animationDelay: `${Math.random() * 4}s`,
                animationDuration: `${Math.random() * 3 + 2}s`,
                borderRadius: Math.random() > 0.5 ? '50%' : '0',
              }}
            />
          ))}
        </div>

        <div className="relative z-10 flex flex-col items-center">
          <div className="animate-bounce mb-6 relative group">
            <div className="absolute inset-0 bg-yellow-400 blur-[40px] opacity-60 rounded-full animate-pulse"></div>
            <img
              src={selectedHero?.img}
              alt={selectedHero?.name}
              className="w-40 h-40 md:w-56 md:h-56 object-cover rounded-full border-8 border-yellow-400 shadow-[0_0_50px_rgba(250,204,21,1)] relative z-10 bg-black"
            />
          </div>

          <h1 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-yellow-500 to-yellow-200 animate-pulse uppercase tracking-widest text-center drop-shadow-[0_5px_5px_rgba(0,0,0,0.8)] mb-4">
            ¡Misión Cumplida!
          </h1>

          <div className="mb-8 text-slate-800 font-medium leading-relaxed bg-slate-100 p-6 rounded-2xl border-4 border-yellow-500 shadow-[0_0_30px_rgba(250,204,21,0.4)] text-center max-w-lg relative">
            <p className="text-2xl font-black text-blue-700 mb-2 uppercase">
              ¡{selectedHero?.name} es Leyenda!
            </p>
            <p className="text-sm font-bold text-slate-700">
              Has derrotado a Thanos y te has convertido en el maestro
              indiscutible de los Volúmenes y Capacidades. ¡El universo está a
              salvo gracias a tus matemáticas!
            </p>
          </div>

          <button
            onClick={startHeroSelection}
            className="px-10 bg-yellow-500 hover:bg-yellow-400 text-slate-900 font-black py-4 rounded-full transition-all border-b-8 border-yellow-700 active:border-b-0 active:translate-y-2 uppercase tracking-widest text-xl shadow-[0_0_20px_rgba(250,204,21,0.6)]"
          >
            Jugar de Nuevo
          </button>
        </div>
      </div>
    );
  }

  // --- PANTALLA DE BATALLA ---
  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-2 sm:p-4 font-sans select-none">
      {/* MODAL J.A.R.V.I.S. (Pokédex) */}
      {showJarvis && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-900/90 p-4">
          <div className="bg-red-600 border-8 border-slate-800 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="bg-red-700 p-4 flex justify-between items-center border-b-4 border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-blue-400 border-4 border-white shadow-inner flex items-center justify-center">
                  <span className="text-lg">📖</span>
                </div>
                <h3 className="text-white font-black tracking-widest">
                  Pokédex J.A.R.V.I.S.
                </h3>
              </div>
              <button
                onClick={() => setShowJarvis(false)}
                className="text-white font-bold bg-slate-800 px-3 py-1 rounded-full hover:bg-slate-700 border-2 border-white"
              >
                ❌
              </button>
            </div>
            <div className="p-4 bg-slate-100 m-4 rounded-xl border-4 border-slate-800 shadow-inner space-y-3 text-sm max-h-[60vh] overflow-y-auto">
              <div className="bg-white p-3 rounded-lg border-2 border-slate-300">
                <h4 className="text-blue-600 font-black mb-1 uppercase">
                  Volúmenes Básicos
                </h4>
                <p>
                  <b>Cubo:</b> V = Arista³
                </p>
                <p>
                  <b>Prisma:</b> V = Largo × Ancho × Altura
                </p>
              </div>
              <div className="bg-white p-3 rounded-lg border-2 border-slate-300">
                <h4 className="text-purple-600 font-black mb-1 uppercase">
                  Con Base Circular / Puntiagudas
                </h4>
                <p>
                  <b>Cilindro:</b> V = π × r² × Altura
                </p>
                <p>
                  <b>Pirámide:</b> V = (Área base × Altura) / 3
                </p>
                <p>
                  <b>Cono:</b> V = (π × r² × Altura) / 3
                </p>
                <p>
                  <b>Esfera:</b> V = (4/3) × π × r³
                </p>
              </div>
              <div className="bg-white p-3 rounded-lg border-2 border-slate-300">
                <h4 className="text-green-600 font-black mb-1 uppercase">
                  Equivalencias
                </h4>
                <p>
                  <b>Capacidad:</b> 1 Litro = 1000 mL | 1 m³ = 1000 Litros
                </p>
                <p>
                  <b>Masa:</b> 1 dm³ agua = 1 Litro = 1 kg
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Consola Principal */}
      <div className="w-full max-w-3xl bg-slate-800 rounded-t-3xl rounded-b-xl border-[16px] border-slate-700 shadow-2xl overflow-hidden flex flex-col h-[95vh] min-h-[650px] max-h-[900px] relative">
        {/* ÁREA DE COMBATE (Mitad superior) */}
        <div
          className={`flex-[1.5] relative overflow-hidden transition-colors duration-1000 bg-slate-200 border-b-[8px] border-slate-800`}
        >
          {currentEnemy?.bgImg && (
            <div
              className="absolute inset-0 bg-cover bg-center opacity-60 z-0"
              style={{ backgroundImage: `url(${currentEnemy.bgImg})` }}
            />
          )}
          <div className="absolute inset-0 bg-blue-900/20 pointer-events-none z-0 mix-blend-multiply"></div>

          {flashEnemy && (
            <div className="absolute inset-0 bg-red-500/50 z-30 pointer-events-none transition-opacity"></div>
          )}
          {flashPlayer && (
            <div className="absolute inset-0 bg-red-600/50 z-30 pointer-events-none transition-opacity"></div>
          )}

          {/* --- ZONA ENEMIGO (Arriba Izquierda / Derecha) --- */}
          {/* Caja Estado Enemigo (Top Left) */}
          <div className="absolute top-4 left-2 sm:left-6 z-20 w-44 sm:w-60">
            <div className="bg-white/95 p-2 sm:p-3 rounded-xl border-4 border-slate-800 shadow-[4px_4px_0_rgba(15,23,42,0.5)] rounded-br-3xl">
              <div className="flex justify-between items-baseline mb-2 border-b-2 border-slate-200 pb-1">
                <h2 className="font-black text-[11px] sm:text-sm uppercase text-slate-800 truncate pr-2">
                  {currentEnemy?.name}
                </h2>
                <span className="text-[10px] sm:text-xs font-bold text-slate-500">
                  Lv{currentEnemy?.level}
                </span>
              </div>
              <PokeHealthBar
                current={currentEnemy?.hp}
                max={currentEnemy?.maxHp}
                label="HP"
              />
            </div>
          </div>

          {/* Avatar Enemigo (Top Right) */}
          <div className="absolute top-8 right-4 sm:right-12 z-10">
            <div
              className={`transition-all duration-100 ${
                shakeEnemy ? 'translate-x-3 -translate-y-3 brightness-150' : ''
              }`}
            >
              <Avatar
                isEnemy={true}
                src={currentEnemy?.img}
                alt={currentEnemy?.name}
                fallback={currentEnemy?.fallback}
                className="w-24 h-24 sm:w-36 sm:h-36 rounded-full border-4 border-slate-800 shadow-xl"
              />
            </div>
          </div>

          {/* --- ZONA JUGADOR (Abajo Izquierda / Derecha) --- */}
          {/* Avatar Jugador (Bottom Left) */}
          <div className="absolute bottom-6 left-4 sm:left-12 z-20">
            <div
              className={`transition-all duration-100 ${
                shakePlayer ? '-translate-x-3 translate-y-3 brightness-150' : ''
              }`}
            >
              <Avatar
                isEnemy={false}
                src={selectedHero?.img}
                alt={selectedHero?.name}
                fallback={selectedHero?.fallback}
                className="w-24 h-24 sm:w-36 sm:h-36 rounded-full border-4 border-slate-800 shadow-xl"
              />
            </div>
          </div>

          {/* Caja Estado Jugador (Bottom Right) */}
          <div className="absolute bottom-4 right-2 sm:right-6 z-30 w-48 sm:w-64">
            <div className="bg-white/95 p-2 sm:p-3 rounded-xl border-4 border-slate-800 shadow-[4px_4px_0_rgba(15,23,42,0.5)] rounded-tl-3xl">
              <div className="flex justify-between items-baseline mb-2 border-b-2 border-slate-200 pb-1 pl-4">
                <h2 className="font-black text-[11px] sm:text-sm uppercase text-slate-800 truncate pr-2">
                  {selectedHero?.name}
                </h2>
                <span className="text-[10px] sm:text-xs font-bold text-slate-500">
                  Lv{heroLevel}
                </span>
              </div>
              <PokeHealthBar current={playerHp} max={maxPlayerHp} label="HP" />
              <div className="mt-1.5">
                <PokeHealthBar
                  current={energy}
                  max={100}
                  label="EN"
                  colorClass="bg-blue-400"
                />
              </div>
            </div>
          </div>
        </div>

        {/* ÁREA DE UI INFERIOR (Controles y Diálogo) */}
        <div className="flex-1 bg-slate-300 p-2 sm:p-4 flex flex-col relative">
          {question ? (
            // PANEL DE PREGUNTA MATEMÁTICA
            <div className="h-full bg-slate-800 border-4 border-slate-900 rounded-xl p-2 sm:p-4 shadow-inner flex flex-col animate-in slide-in-from-bottom-4">
              <div className="bg-slate-100 text-slate-800 p-2 sm:p-3 rounded-lg border-2 border-slate-400 text-xs sm:text-sm font-black text-center mb-2 shadow-inner">
                {question.text}
              </div>

              {/* Barra de Tiempo */}
              <div className="w-full h-3 bg-slate-600 mb-3 rounded-full overflow-hidden border-2 border-slate-900 relative">
                <div
                  className="absolute left-0 top-0 h-full bg-yellow-400 transition-all duration-150 ease-linear"
                  style={{ width: `${timeLeft}%` }}
                />
              </div>

              <div className="grid grid-cols-2 gap-2 flex-1">
                {question.options.map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleAnswer(opt)}
                    className="bg-white hover:bg-slate-200 border-4 border-slate-400 hover:border-blue-500 rounded-lg font-black text-slate-800 shadow-[0_4px_0_rgba(148,163,184,1)] active:shadow-none active:translate-y-1 transition-all flex items-center justify-center text-sm sm:text-base uppercase"
                  >
                    {opt} {question.unit}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            // CAJA DE DIÁLOGO Y MENÚ CLÁSICO
            <div className="h-full bg-white border-8 border-double border-slate-800 rounded-xl shadow-inner flex flex-col sm:flex-row p-2 sm:p-3 gap-2">
              {/* Lado Izquierdo: Diálogo */}
              <div className="flex-1 overflow-y-auto pr-2">
                <div className="flex items-center justify-between mb-2 pb-1 border-b-2 border-slate-200">
                  <span className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase">
                    Registro de Batalla
                  </span>
                  <button
                    onClick={handleOpenJarvis}
                    className="flex items-center gap-1 bg-blue-100 hover:bg-blue-200 text-blue-800 px-2 py-1 rounded-full border-2 border-blue-300 transition-colors text-[9px] sm:text-[10px] font-black uppercase"
                  >
                    <span className="text-xs">📖</span> Pokédex J.A.R.V.I.S.
                  </button>
                </div>
                {messages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex items-start gap-1 sm:gap-2 mb-1.5 ${
                      i === messages.length - 1
                        ? 'text-slate-800 font-black'
                        : 'text-slate-500 font-medium'
                    } text-xs sm:text-sm leading-snug`}
                  >
                    <span className="mt-0.5 shrink-0 text-slate-800 text-xs">
                      ▶️
                    </span>
                    <p
                      dangerouslySetInnerHTML={{
                        __html: msg
                          .replace(
                            /J\.A\.R\.V\.I\.S\.:/g,
                            '<strong class="text-blue-600">J.A.R.V.I.S.:</strong>'
                          )
                          .replace(
                            /Fórmula correcta:/g,
                            '<strong class="text-red-600">Fórmula correcta:</strong>'
                          ),
                      }}
                    ></p>
                  </div>
                ))}
                {/* Mensaje principal de turno */}
                {isPlayerTurn && (
                  <p className="font-black text-slate-800 text-sm sm:text-base mt-2 ml-4 animate-pulse">
                    ¿Qué debería hacer {selectedHero?.name}?
                  </p>
                )}
              </div>

              {/* Lado Derecho: Acciones (Solo si es el turno del jugador) */}
              {isPlayerTurn && (
                <div className="w-full sm:w-1/2 md:w-2/5 shrink-0 flex flex-col gap-2 border-t-4 sm:border-t-0 sm:border-l-4 border-slate-200 pt-2 sm:pt-0 sm:pl-2">
                  <div className="grid grid-cols-2 gap-2 flex-1">
                    {selectedHero?.attacks.map((attack, index) => {
                      const bgColors = [
                        'bg-blue-100 hover:bg-blue-200 border-blue-400 text-blue-900',
                        'bg-purple-100 hover:bg-purple-200 border-purple-400 text-purple-900',
                        'bg-red-100 hover:bg-red-200 border-red-400 text-red-900',
                      ];
                      return (
                        <button
                          key={index}
                          onClick={() =>
                            handleAttackClick(
                              attack.diff,
                              attack.name,
                              attack.dmg
                            )
                          }
                          className={`${bgColors[index]} rounded-lg border-b-4 active:border-b-0 active:translate-y-1 transition-all p-1 sm:p-2 flex flex-col items-center justify-center`}
                        >
                          <span className="font-black uppercase text-[9px] sm:text-[11px] leading-tight text-center">
                            {attack.name}
                          </span>
                        </button>
                      );
                    })}
                    <button
                      onClick={handleHealClick}
                      disabled={playerHp >= maxPlayerHp}
                      className="bg-green-100 hover:bg-green-200 border-green-400 text-green-900 border-b-4 active:border-b-0 active:translate-y-1 rounded-lg transition-all p-1 sm:p-2 flex flex-col items-center justify-center disabled:opacity-50 disabled:active:border-b-4 disabled:active:translate-y-0"
                    >
                      <span className="font-black uppercase text-[9px] sm:text-[11px] leading-tight text-center">
                        Regenerar
                      </span>
                    </button>
                  </div>
                  {/* Botón Ultimate */}
                  {energy >= 100 && (
                    <button
                      onClick={() =>
                        handleAttackClick(3, '💥 IMPACTO CÓSMICO 💥', 200, true)
                      }
                      className="w-full bg-yellow-400 hover:bg-yellow-300 text-slate-900 font-black uppercase text-xs sm:text-sm py-2 rounded-lg border-b-4 border-yellow-600 active:border-b-0 active:translate-y-1 transition-all flex flex-col items-center justify-center animate-pulse"
                    >
                      <span>Poder Definitivo</span>
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
