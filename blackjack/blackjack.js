// ===== STATE =====
const SUITS = ['♠','♥','♦','♣'];
const VALUES = ['A','2','3','4','5','6','7','8','9','10','J','Q','K'];
const RED_SUITS = new Set(['♥','♦']);
const BET = 2;

let chips     = 100;
let hand      = [];   // [{value, suit, numeric}]
let sum       = 0;
let isAlive   = false;
let roundOver = false;

// ===== DOM =====
const chipsEl  = document.getElementById('chips-el');
const betEl    = document.getElementById('bet-el');
const sumEl    = document.getElementById('sum-el');
const cardsArea= document.getElementById('cards-area');
const msgEl    = document.getElementById('message-el');
const dealBtn  = document.getElementById('deal-btn');
const hitBtn   = document.getElementById('hit-btn');
const promptEl = document.getElementById('prompt-el');

// ===== CARD LOGIC =====
function randomCard() {
  const suit  = SUITS[Math.floor(Math.random() * 4)];
  const value = VALUES[Math.floor(Math.random() * 13)];
  let numeric;
  if (value === 'A')                    numeric = 11;
  else if (['J','Q','K'].includes(value)) numeric = 10;
  else                                   numeric = parseInt(value);
  return { suit, value, numeric };
}

function calcSum(cards) {
  let total = cards.reduce((acc, c) => acc + c.numeric, 0);
  // Adjust aces from 11 → 1 if bust
  let aces = cards.filter(c => c.value === 'A').length;
  while (total > 21 && aces > 0) { total -= 10; aces--; }
  return total;
}

// ===== RENDER =====
function renderCard(card, delay = 0) {
  const el = document.createElement('div');
  el.className = 'card' + (RED_SUITS.has(card.suit) ? ' red' : '');
  el.style.animationDelay = delay + 's';

  const top = document.createElement('div');
  top.className = 'card-value';
  top.textContent = card.value + card.suit;

  const bot = document.createElement('div');
  bot.className = 'card-value bottom';
  bot.textContent = card.value + card.suit;

  el.appendChild(top);
  el.appendChild(bot);
  cardsArea.appendChild(el);
}

function renderHand() {
  cardsArea.innerHTML = '';
  hand.forEach((card, i) => renderCard(card, i * 0.08));
}

function updateHUD() {
  chipsEl.textContent = '$' + chips;
  betEl.textContent   = '$' + BET;
  sumEl.textContent   = sum > 0 ? sum : '—';
}

function setMessage(text, colour) {
  msgEl.textContent = text;
  msgEl.style.color = colour || 'var(--gold-light)';
}

// ===== GAME FLOW =====
function startGame() {
  if (chips < BET) {
    setMessage('No chips left — refresh to restart.', '#e74c3c');
    dealBtn.disabled = true;
    return;
  }

  // Deduct bet
  chips -= BET;
  hand = [randomCard(), randomCard()];
  sum  = calcSum(hand);
  isAlive   = true;
  roundOver = false;

  renderHand();
  updateHUD();

  dealBtn.textContent = 'Re-deal';
  hitBtn.disabled = false;

  if (sum === 21) {
    endRound('blackjack');
  } else {
    setMessage('Hit to draw another card, or re-deal to fold.');
  }
}

function newCard() {
  if (!isAlive || roundOver) return;
  chips -= BET;
  const card = randomCard();
  hand.push(card);
  sum = calcSum(hand);
  renderCard(card, 0);
  updateHUD();

  if (sum > 21)      endRound('bust');
  else if (sum === 21) endRound('blackjack');
  else setMessage('Sum: ' + sum + ' — keep going or re-deal?');
}

function endRound(result) {
  isAlive   = false;
  roundOver = true;
  hitBtn.disabled = true;

  if (result === 'blackjack') {
    chips += BET + 5;   // bet back + $3 bonus
    updateHUD();
    setMessage('🎉 Blackjack! You win $3 bonus!', '#2ecc71');
  } else {
    setMessage('💥 Bust! You went over 21.', '#e74c3c');
    updateHUD();
  }
}
