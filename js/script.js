// True Talk Therapy – Client-side chat logic

const SYSTEM_PROMPT = `You are True Talk, a warm, grounded, emotionally intelligent support companion for people in South Africa (especially Johannesburg / Gauteng).

Your personality:
- Speak like a trusted older sibling or close friend.
- Use natural South African English. Lightly use township slang (fam, eish, sharp, shame, yoh, my bro, my sis) only when it feels natural.
- Be warm, real, non-judgmental, and honest.
- You understand load shedding stress, family pressure, hustle culture, feeling different, generational challenges, and the weight of city life.

Critical rules you must always follow:
1. You are NOT a licensed therapist, counsellor, or medical professional. Never claim to be one.
2. When conversations become heavy or serious, remind the person: "Remember, I'm not a professional. If this is getting too heavy, please reach out to SADAG on 0800 567 567 or a local counsellor."
3. If the user mentions self-harm, suicide, or being in immediate danger, respond with care and immediately encourage them to contact emergency services or SADAG (0800 567 567). Do not dig deeper [...]
4. Keep responses conversational and reasonably short (mobile-friendly).
5. Never judge the person's identity, sexuality, religion, race, or life choices.
6. Stay in character as True Talk at all times.

Start every new conversation by being open and welcoming.`;

const chatContainer = document.getElementById('chat-container');
const userInput = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');

let messages = [];
let isWaiting = false;

// ---------- Crisis Detection ----------
const CRISIS_RE = /\b(suicid|kill (myself|me)|end (it|my life)|self[- ]?harm|wanna die|want to die|no reason to live|hurt(ing)? myself)\b/i;

// ---------- Chat UI ----------
function addMessage(role, text) {
  const div = document.createElement('div');
  div.className = `message ${role}`;
  div.textContent = text;
  div.setAttribute('role', role === 'system' ? 'status' : 'article');
  chatContainer.appendChild(div);
  chatContainer.scrollTop = chatContainer.scrollHeight;
}

function showTyping() {
  const div = document.createElement('div');
  div.className = 'message bot typing';
  div.id = 'typingIndicator';
  div.setAttribute('aria-label', 'True Talk is typing...');
  div.innerHTML = '<span></span><span></span><span></span>';
  chatContainer.appendChild(div);
  chatContainer.scrollTop = chatContainer.scrollHeight;
}

function hideTyping() {
  const el = document.getElementById('typingIndicator');
  if (el) el.remove();
}

function startConversation() {
  // Welcome message (complete text)
  const welcome = "Hey there… welcome to True Talk Therapy. This is a safe space for real talk, no judgment. Whatever's weighing on your spirit tonight — load shedding stress, family, money, h[...]
  addMessage('bot', welcome);
  messages.push({ role: 'model', parts: [{ text: welcome }] });
}

// ---------- True Talk API Call ----------
async function sendToTrueTalk(text) {
  // 1. Crisis guard — runs locally, before any network call
  if (CRISIS_RE.test(text)) {
    return "I hear you, and I'm really glad you said that out loud. I'm an AI, not a professional — please call SADAG right now on 0800 567 567 (free, 24/7). You deserve real support, my friend. 🙏";
  }
  // 2. Proxy
  try {
    const r = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: text, history: messages }),
    });
    if (r.ok) return (await r.json()).reply;
  } catch (_) { /* offline or quota */ }
  // 3. Never a dead chat
  return localFallback(text);
}

// ---------- Send Message ----------
async function handleSend() {
  const text = userInput.value.trim();
  if (!text || isWaiting) return;

  isWaiting = true;
  sendBtn.disabled = true;
  userInput.value = '';
  autoResize();

  addMessage('user', text);
  messages.push({ role: 'user', parts: [{ text }] });

  showTyping();

  const reply = await sendToTrueTalk(text);

  hideTyping();
  addMessage('bot', reply);
  messages.push({ role: 'model', parts: [{ text: reply }] });

  isWaiting = false;
  sendBtn.disabled = false;
  userInput.focus();
}

// ---------- Input helpers ----------
function autoResize() {
  userInput.style.height = 'auto';
  userInput.style.height = Math.min(userInput.scrollHeight, 120) + 'px';
}

userInput.addEventListener('input', autoResize);

userInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    handleSend();
  }
});

sendBtn.addEventListener('click', handleSend);

// ========== Theme Toggle ==========
const themeToggle = document.getElementById('themeToggle');
const sunIcon = themeToggle?.querySelector('.sun-icon');
const moonIcon = themeToggle?.querySelector('.moon-icon');

function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('trueTalkTheme', theme);

  if (theme === 'light') {
    if (sunIcon) sunIcon.style.display = 'none';
    if (moonIcon) moonIcon.style.display = 'block';
    themeToggle?.setAttribute('aria-label', 'Switch to dark mode');
  } else {
    if (sunIcon) sunIcon.style.display = 'block';
    if (moonIcon) moonIcon.style.display = 'none';
    themeToggle?.setAttribute('aria-label', 'Switch to light mode');
  }
}

// Load saved theme (default = dark)
const savedTheme = localStorage.getItem('trueTalkTheme') || 'dark';
setTheme(savedTheme);

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme') || 'dark';
    setTheme(current === 'dark' ? 'light' : 'dark');
  });
}

// Handle system theme preference if no saved theme
if (!localStorage.getItem('trueTalkTheme') && window.matchMedia) {
  const darkMode = window.matchMedia('(prefers-color-scheme: dark)');
  if (!darkMode.matches) {
    setTheme('light');
  }
}

// ---------- Prevent scroll bouncing on iOS ----------
document.addEventListener('touchmove', function(e) {
  if (e.target.closest('#userInput, .chat-container, .modal-content')) {
    return;
  }
  e.preventDefault();
}, { passive: false });

// ---------- Handle window resize ----------
window.addEventListener('orientationchange', () => {
  setTimeout(() => {
    userInput.style.height = 'auto';
    autoResize();
    chatContainer.scrollTop = chatContainer.scrollHeight;
  }, 100);
});

// ---------- Init ----------
startConversation();
userInput.focus();
