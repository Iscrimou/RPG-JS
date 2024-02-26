let xp = 0;
let health = 100;
let gold = 50;
let currentWeapon = 0;
let fighting;
let monsterHealth;
let inventory = ["graveto"];

const button1 = document.querySelector('#button1');
const button2 = document.querySelector("#button2");
const button3 = document.querySelector("#button3");
const text = document.querySelector("#text");
const xpText = document.querySelector("#xpText");
const healthText = document.querySelector("#healthText");
const goldText = document.querySelector("#goldText");
const monsterStats = document.querySelector("#monsterStats");
const monsterName = document.querySelector("#monsterName");
const monsterHealthText = document.querySelector("#monsterHealth");
const weapons = [
  { name: 'graveto', power: 5, value: 0 },
  { name: 'adaga', power: 30, value: 30 },
  { name: 'espada curta', power: 50, value: 50 },
  { name: 'espada longa', power: 100, value: 100 }
];
const monsters = [
  {
    name: "Slime",
    level: 2,
    health: 15
  },
  {
    name: "Fera Dentada",
    level: 8,
    health: 60
  },
  {
    name: "Dragão",
    level: 20,
    health: 300
  }
]
const locations = [
  {
    name: "town square",
    "button text": ["Vá para a Loja", "Vá para a caverna", "Lute contra o Dragão"],
    "button functions": [goStore, goCave, fightDragon],
    text: "Você está no Centro da Cidade. Você vê uma placa que diz \"Loja\", a entrada para uma caverna e o Dragão peleja na entrada da cidade."
  },
  {
    name: "store",
    "button text": ["Comprar 10 de vida (10 ouro)", "Comprar arma (30 ouro)", "Vá para o Centro da Cidade"],
    "button functions": [buyHealth, buyWeapon, goTown],
    text: "Você entra na Loja."
  },
  {
    name: "cave",
    "button text": ["Lutar contra Slime", "Lutar contra Fera Dentada", "Vá para o Centro da Cidade"],
    "button functions": [fightSlime, fightBeast, goTown],
    text: "Você entra na caverna. Você vê alguns monstros."
  },
  {
    name: "fight",
    "button text": ["Atacar", "Esquivar", "Correr"],
    "button functions": [attack, dodge, goTown],
    text: "Você está lutando contra um monstro."
  },
  {
    name: "kill monster",
    "button text": ["Vá para o Centro da Cidade", "Vá para o Centro da Cidade", "Vá para o Centro da Cidade"],
    "button functions": [goTown, goTown, easterEgg],
    text: 'O monstro agoniza "Arg!" e então ele morre. Você ganhou pontos de experiência e encontro ouro.'
  },
  {
    name: "lose",
    "button text": ["REPLAY?", "REPLAY?", "REPLAY?"],
    "button functions": [restart, restart, restart],
    text: "Você morre. &#x2620;"
  },
  { 
    name: "win", 
    "button text": ["REPLAY?", "REPLAY?", "REPLAY?"], 
    "button functions": [restart, restart, restart], 
    text: "Você derrotou o Dragão! VOCÊ VENCEU O JOGO! &#x1F389;" 
  },
  {
    name: "easter egg",
    "button text": ["2", "8", "Vá para o Centro da Cidade?"],
    "button functions": [pickTwo, pickEight, goTown],
    text: "Você encontrou o jogo secreto. Escolha um numero acima. Você joga 10 vezes um D10. Se o número que você escolheu cair alguma vez, você vence!"
  }
];

// initialize buttons
button1.onclick = goStore;
button2.onclick = goCave;
button3.onclick = fightDragon;

function toggleButtons() {
  button1.disabled = !button1.disabled;
  button2.disabled = !button2.disabled;
  button3.disabled = !button3.disabled;
}

function playMonsterDeadAudio() {
  var audio;
  switch (fighting) {
    case 0:
      audio = new Audio('./Sounds/slime.wav');
      break;
    case 1:
      audio = new Audio('./Sounds/beast.wav');
      break;
      case 2:
      audio = new Audio('./Sounds/dragon.wav');
      break;
  }
  audio.play();
}

function playNewWeaponSound() {
  const audio = new Audio('./Sounds/new_weapon.wav');
  audio.play();
}

function playHealthSound() {
  const audio = new Audio('./Sounds/health.wav');
  audio.play();
}

function update(location) {
  monsterStats.style.display = "none";
  button1.innerText = location["button text"][0];
  button2.innerText = location["button text"][1];
  button3.innerText = location["button text"][2];
  button1.onclick = location["button functions"][0];
  button2.onclick = location["button functions"][1];
  button3.onclick = location["button functions"][2];
  text.innerHTML = location.text;
}

function goTown() {
  update(locations[0]);
}

function goStore() {
  update(locations[1]);
}

function goCave() {
  update(locations[2]);
}

function buyHealth() {
  if (gold >= 10) {
    playHealthSound();
    gold -= 10;
    health += 10;
    goldText.innerText = gold;
    healthText.innerText = health;
  } else {
    text.innerText = "Você não tem dinheiro para comprar vida.";
  }
}

function buyWeapon() {
  if (currentWeapon < weapons.length - 1) {
    if (gold >= 30) {
      playNewWeaponSound();
      gold -= 30;
      currentWeapon++;
      goldText.innerText = gold;
      let newWeapon = weapons[currentWeapon].name;
      text.innerText = "Você agora tem uma " + newWeapon + ".";
      inventory.push(newWeapon);
      text.innerText += " No seu inventário tem: " + inventory;
    } else {
      text.innerText = "Você não tem ouro o suficiente para comprar uma arma.";
    }
  } else {
    text.innerText = "Você já tem a arma mais poderosa!";
    button2.innerText = "Vender arma por 15 ouro";
    button2.onclick = sellWeapon;
  }
}

function sellWeapon() {
  if (inventory.length > 1) {
    gold += 15;
    goldText.innerText = gold;
    let currentWeapon = inventory.shift();
    text.innerText = "Você vendeu a " + currentWeapon + ".";
    text.innerText += " No seu invetário tem: " + inventory;
  } else {
    text.innerText = "Não venda sua unica arma!";
  }
}

function fightSlime() {
  fighting = 0;
  goFight();
}

function fightBeast() {
  fighting = 1;
  goFight();
}

function fightDragon() {
  fighting = 2;
  goFight();
}

function goFight() {
  update(locations[3]);
  monsterHealth = monsters[fighting].health;
  monsterStats.style.display = "block";
  monsterName.innerText = monsters[fighting].name;
  monsterHealthText.innerText = monsterHealth;
}

function attack() {
  text.innerText = "O " + monsters[fighting].name + " ataca.";
  text.innerText += " Você ataca com sua " + weapons[currentWeapon].name + ".";
  health -= getMonsterAttackValue(monsters[fighting].level);
  if (isMonsterHit()) {
    const hit = weapons[currentWeapon].power + Math.floor(Math.random() * xp) + 1;
    monsterHealth -= hit;
    text.innerText += "Você arranca " + hit + " de dano!";
  } else {
    text.innerText += " Você erra.";
  }
  healthText.innerText = health;
  monsterHealthText.innerText = monsterHealth;
  if (health <= 0) {
    lose();
  } else if (monsterHealth <= 0) {
    toggleButtons();
    playMonsterDeadAudio();
    setTimeout(() => {
      if (fighting === 2) {
        winGame();
      } else {
        defeatMonster();
      }
    }, 2000);
  }
  if (inventory.length !== 1 && Math.random() <= .1) { // Chance da arma quebrar
    text.innerText += " Sua " + inventory.pop() + " quebrou.";
    currentWeapon--;
  }
}

function getMonsterAttackValue(level) {
  const hit = (level * 5) - (Math.floor(Math.random() * xp));
  return hit > 0 ? hit : 0;
}

function isMonsterHit() {
  return Math.random() > .2 || health < 20;
}

function dodge() {
  text.innerText = "Você desvia do ataque do " + monsters[fighting].name;
}

function defeatMonster() {
  gold += Math.floor(monsters[fighting].level * 6.7);
  xp += monsters[fighting].level;
  goldText.innerText = gold;
  xpText.innerText = xp;
  toggleButtons();
  update(locations[4]);
}

function lose() {
  update(locations[5]);
}

function winGame() {
  toggleButtons();
  update(locations[6]);
}

function restart() {
  xp = 0;
  health = 100;
  gold = 50;
  currentWeapon = 0;
  inventory = ["graveto"];
  goldText.innerText = gold;
  healthText.innerText = health;
  xpText.innerText = xp;
  goTown();
}

function easterEgg() {
  update(locations[7]);
}

function pickTwo() {
  pick(2);
}

function pickEight() {
  pick(8);
}

function pick(guess) {
  const numbers = [];
  while (numbers.length < 10) {
    numbers.push(Math.floor(Math.random() * 11));
  }
  text.innerText = "Você escolheu " + guess + ". Aqui são os numeros que tirou:\n";
  for (let i = 0; i < 10; i++) {
    text.innerText += numbers[i] + "\n";
  }
  if (numbers.includes(guess)) {
    text.innerText += "Isso! Você ganhou 20 gold!";
    gold += 20;
    goldText.innerText = gold;
  } else {
    text.innerText += "Errado! Você perdeu 10 de vida!";
    health -= 10;
    healthText.innerText = health;
    if (health <= 0) {
      lose();
    }
  }
}