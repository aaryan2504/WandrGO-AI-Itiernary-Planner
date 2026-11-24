/* ═══════════════════════════════════════════════════════════════════════════
   WandrGo Itinerary Planner — Client-side Application Logic
   ═══════════════════════════════════════════════════════════════════════════ */

const API = '';  // Same origin
let currentItinerary = null;
const sessionId = 'session-' + Date.now();

/* ─── Tab Switching ───────────────────────────────────────────────────────── */
function switchTab(tab) {
  document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.tab-page').forEach(p => p.classList.remove('active'));

  document.getElementById('tab-' + tab).classList.add('active');
  document.getElementById('page-' + tab).classList.add('active');
}

/* ─── Interest Chips ──────────────────────────────────────────────────────── */
function toggleChip(el) {
  el.classList.toggle('selected');
}

function getSelectedInterests() {
  return Array.from(document.querySelectorAll('.interest-chip.selected'))
    .map(el => el.dataset.value);
}

/* ─── Calendar & Date Management ─────────────────────────────────────────── */
function openDatePicker(input) {
  try {
    if (input.showPicker) input.showPicker();
  } catch (e) {}
}

function formatDateISO(d) {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function initDatePickers() {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const startInput = document.getElementById('inp-date');
  const endInput = document.getElementById('inp-end-date');
  const daysInput = document.getElementById('inp-days');

  if (startInput) {
    startInput.min = formatDateISO(today);
    if (!startInput.value) {
      startInput.value = formatDateISO(tomorrow);
    }
  }

  const days = parseInt(daysInput ? daysInput.value : 5) || 5;
  if (endInput) {
    if (startInput && startInput.value) {
      endInput.min = startInput.value;
      if (!endInput.value) {
        const start = new Date(startInput.value);
        const end = new Date(start);
        end.setDate(start.getDate() + days);
        endInput.value = formatDateISO(end);
      }
    }
  }
}

function onStartDateChange() {
  const startInput = document.getElementById('inp-date');
  const endInput = document.getElementById('inp-end-date');
  const daysInput = document.getElementById('inp-days');
  if (!startInput || !startInput.value) return;

  if (endInput) {
    endInput.min = startInput.value;
    if (endInput.value && endInput.value >= startInput.value) {
      const start = new Date(startInput.value);
      const end = new Date(endInput.value);
      const diffDays = Math.max(1, Math.round((end - start) / (1000 * 60 * 60 * 24)));
      if (daysInput) daysInput.value = diffDays;
      updateQuickDayActive(diffDays);
    } else {
      const start = new Date(startInput.value);
      const days = parseInt(daysInput ? daysInput.value : 5) || 5;
      const end = new Date(start);
      end.setDate(start.getDate() + days);
      endInput.value = formatDateISO(end);
    }
  }
}

function onEndDateChange() {
  const startInput = document.getElementById('inp-date');
  const endInput = document.getElementById('inp-end-date');
  const daysInput = document.getElementById('inp-days');
  if (!endInput || !endInput.value) return;

  if (!startInput || !startInput.value) {
    const end = new Date(endInput.value);
    const start = new Date(end);
    const days = parseInt(daysInput ? daysInput.value : 5) || 5;
    start.setDate(end.getDate() - days);
    if (startInput) startInput.value = formatDateISO(start);
  } else {
    const start = new Date(startInput.value);
    const end = new Date(endInput.value);
    if (end < start) {
      startInput.value = endInput.value;
      if (daysInput) daysInput.value = 1;
      updateQuickDayActive(1);
    } else {
      const diffDays = Math.max(1, Math.round((end - start) / (1000 * 60 * 60 * 24)));
      if (daysInput) daysInput.value = diffDays;
      updateQuickDayActive(diffDays);
    }
  }
}

function onDaysInputChange() {
  const startInput = document.getElementById('inp-date');
  const endInput = document.getElementById('inp-end-date');
  const daysInput = document.getElementById('inp-days');
  const days = parseInt(daysInput ? daysInput.value : 1) || 1;

  if (startInput && startInput.value && endInput) {
    const start = new Date(startInput.value);
    const end = new Date(start);
    end.setDate(start.getDate() + days);
    endInput.value = formatDateISO(end);
  }
  updateQuickDayActive(days);
}

function setTripDuration(days, btn) {
  const daysInput = document.getElementById('inp-days');
  if (daysInput) daysInput.value = days;

  const startInput = document.getElementById('inp-date');
  const endInput = document.getElementById('inp-end-date');
  if (startInput && startInput.value && endInput) {
    const start = new Date(startInput.value);
    const end = new Date(start);
    end.setDate(start.getDate() + days);
    endInput.value = formatDateISO(end);
  }

  document.querySelectorAll('.quick-day-btn').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
}

function updateQuickDayActive(days) {
  document.querySelectorAll('.quick-day-btn').forEach(btn => {
    const text = btn.textContent;
    if (text.includes(`(${days}d)`) || text.includes(`${days} Days`)) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
}

/* ─── Collect Form Data ───────────────────────────────────────────────────── */
function getFormParams() {
  const startDate = document.getElementById('inp-date').value || 'flexible';
  const endEl = document.getElementById('inp-end-date');
  const endDate = endEl ? endEl.value : '';
  const dateStr = endDate ? `${startDate} to ${endDate}` : startDate;

  return {
    destination: document.getElementById('inp-dest').value.trim(),
    origin: document.getElementById('inp-origin').value.trim() || 'not specified',
    days: parseInt(document.getElementById('inp-days').value) || 5,
    start_date: dateStr,
    travellers: parseInt(document.getElementById('inp-travellers').value) || 2,
    budget: parseInt(document.getElementById('inp-budget').value) || 25000,
    budget_style: document.getElementById('inp-budget-style').value,
    group_type: document.getElementById('inp-group').value,
    interests: getSelectedInterests(),
    pace: document.getElementById('inp-pace').value,
    accommodation: document.getElementById('inp-accommodation').value,
    dietary: document.getElementById('inp-dietary').value.trim() || 'no restrictions',
    notes: document.getElementById('inp-notes').value.trim() || 'none',
  };
}

/* ═══════════════════════════════════════════════════════════════════════════
   ITINERARY GENERATION
   ═══════════════════════════════════════════════════════════════════════════ */

async function generateItinerary() {
  const params = getFormParams();
  const outputArea = document.getElementById('output-area');
  const btn = document.getElementById('btn-generate');

  if (!params.destination) {
    outputArea.innerHTML = `<div class="status-msg error">❌ Please enter a destination! (e.g. Kyoto, Japan or Goa, India)</div>`;
    outputArea.scrollIntoView({ behavior: 'smooth', block: 'center' });
    return;
  }

  // Show loading with live elapsed seconds timer
  btn.disabled = true;
  btn.textContent = '⏳ Generating Itinerary...';
  let elapsed = 0;
  outputArea.innerHTML = `
    <div class="loading-container">
      <div class="loading-title" id="loading-timer">⏳ Crafting your journey with local AI… (0s)</div>
      <div class="loading-step active" id="step-0"><div class="loading-spinner"></div> Researching destination complexity & visas…</div>
      <div class="loading-step" id="step-1"><div class="loading-spinner"></div> Estimating complete budget in INR (₹)…</div>
      <div class="loading-step" id="step-2"><div class="loading-spinner"></div> Scheduling unique day-by-day activities…</div>
      <div class="loading-step" id="step-3"><div class="loading-spinner"></div> Finding distinct local food recommendations…</div>
      <div class="loading-step" id="step-4"><div class="loading-spinner"></div> Personalizing packing tips & insights…</div>
      <div style="font-size:0.75rem; color:var(--muted); margin-top:12px; font-style:italic">
        Running locally on your LLM. Complex trips usually take ~20–45 seconds.
      </div>
    </div>`;
  outputArea.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

  const timer = setInterval(() => {
    elapsed += 1;
    const timerEl = document.getElementById('loading-timer');
    if (timerEl) {
      timerEl.textContent = `⏳ Crafting your journey with local AI… (${elapsed}s)`;
    }
    const stepIdx = Math.min(4, Math.floor(elapsed / 6));
    const stepEl = document.getElementById(`step-${stepIdx}`);
    if (stepEl) stepEl.classList.add('active');
  }, 1000);

  try {
    const res = await fetch(API + '/api/generate-itinerary', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    clearInterval(timer);
    const data = await res.json();

    if (res.ok && data.success) {
      currentItinerary = data.itinerary;
      outputArea.innerHTML = `<div class="status-msg success">✅ Itinerary successfully generated in ${elapsed}s! See your trip below.</div>`;
      outputArea.innerHTML += renderItinerary(data.itinerary, params);
      outputArea.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      const errMsg = data.error || data.detail || 'Failed to generate itinerary.';
      outputArea.innerHTML = `<div class="status-msg error">❌ Generation Error: ${errMsg}<br>
        <span style="font-weight:400;font-size:0.82rem;color:var(--muted)">Check if Ollama is running (<code>ollama serve</code>) and has a model pulled.</span></div>`;
    }
  } catch (err) {
    clearInterval(timer);
    outputArea.innerHTML = `<div class="status-msg error">❌ Connection error: ${err.message}<br>
      <span style="font-weight:400;font-size:0.82rem;color:var(--muted)">Make sure the backend server (<code>uvicorn main:app --reload --port 8000</code>) and Ollama (<code>ollama serve</code>) are running.</span></div>`;
  }

  btn.disabled = false;
  btn.textContent = '✦ Generate My AI Itinerary';
}


/* ═══════════════════════════════════════════════════════════════════════════
   ITINERARY RENDERER
   ═══════════════════════════════════════════════════════════════════════════ */

function formatINR(val) {
  if (val === null || val === undefined || val === '') return '';
  if (typeof val === 'number') {
    return '₹' + val.toLocaleString('en-IN');
  }
  let s = String(val).trim().replace(/\$/g, '₹');
  if (/^\d+/.test(s)) {
    const num = parseInt(s);
    if (!isNaN(num)) return '₹' + num.toLocaleString('en-IN');
    return '₹' + s;
  }
  return s;
}

function renderItinerary(it, params) {
  const c = it.researchComplexity || {};
  const b = it.budgetEstimation || {};
  const complexityColors = { Easy: '#72C98A', Moderate: '#D4A843', Complex: '#E8935A', Expert: '#E85A6A' };
  const cc = complexityColors[c.level] || '#E8935A';

  const destParts = (it.destination || '').split(',');
  const destCity = destParts[0] || '';
  const destRest = destParts.slice(1).join(',');

  let html = `<div class="itinerary-result">`;

  // ── Header ──
  html += `
    <div class="itin-header">
      <div class="itin-dest">${esc(destCity)}<span>${esc(destRest)}</span></div>
      <div class="itin-tag">${esc(it.tagline || '')}</div>
      <div class="itin-chips">
        <div class="itin-chip">👥 ${params.travellers} ${params.group_type}</div>
        <div class="itin-chip">📅 ${params.days} days</div>
        <div class="itin-chip">💼 ${params.budget_style}</div>
        <div class="itin-chip">🗣 ${esc(c.language || '')}</div>
        <div class="itin-chip">💱 ${esc(c.currency || 'INR (₹)')}</div>
        <div class="itin-chip">🕐 ${esc(c.timezone || '')}</div>
      </div>
    </div>`;

  // ── Stats Row 1 ──
  html += `
    <div class="stats-row">
      <div class="stat-card">
        <div class="stat-label">Total Days</div>
        <div class="stat-value color-blue">${params.days}</div>
        <div class="stat-sub">days of exploration</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Budget/Person</div>
        <div class="stat-value color-gold">₹${(b.totalPerPerson || 0).toLocaleString('en-IN')}</div>
        <div class="stat-sub">estimated total (INR)</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Daily Average</div>
        <div class="stat-value color-accent">₹${(b.dailyAverage || 0).toLocaleString('en-IN')}</div>
        <div class="stat-sub">per person/day (INR)</div>
      </div>
    </div>`;

  // ── Stats Row 2 ──
  html += `
    <div class="stats-row">
      <div class="stat-card">
        <div class="stat-label">Research Complexity</div>
        <div class="stat-value" style="color:${cc}">${esc(c.level || '')}</div>
        <div class="complexity-bar"><div class="complexity-fill" style="width:${(c.score || 5) * 10}%;background:${cc}"></div></div>
        <div class="stat-sub">${esc(c.reason || '')}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Best Season</div>
        <div class="stat-value color-green" style="font-size:1rem">${esc(c.bestSeason || '')}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Visa Required</div>
        <div class="stat-value" style="font-size:1rem;color:${c.visaRequired ? '#E85A6A' : '#72C98A'}">
          ${c.visaRequired ? '✓ Yes' : '✗ No'}
        </div>
        <div class="stat-sub">${esc((c.visaInfo || '').slice(0, 60))}…</div>
      </div>
    </div>`;

  // ── Trip Overview ──
  html += `
    <div class="panel">
      <div class="panel-header"><span>📋</span><h3>Trip Overview</h3></div>
      <div class="panel-body">
        <div style="font-size:0.87rem;line-height:1.7;margin-bottom:12px">${esc(it.summary || '')}</div>
        <div class="highlights-grid">
          ${(it.highlights || []).map(h => `<div class="hl-item"><span class="marker">✦</span>${esc(h)}</div>`).join('')}
        </div>
      </div>
    </div>`;

  // ── Personalized Insight ──
  html += `
    <div class="insight-box">
      <div class="insight-label">✨ Personalised Just For You</div>
      <div class="insight-text">${esc(it.personalizedInsight || '')}</div>
    </div>`;

  // ── Day-by-Day ──
  html += `<div class="panel"><div class="panel-header"><span>🗓</span><h3>Day-by-Day Itinerary</h3></div>`;
  for (const day of (it.days || [])) {
    html += `<div class="day-section">`;
    html += `<div class="day-header">Day ${day.day} — ${esc(day.title || '')}</div>`;
    html += `<div class="day-sub">${esc(day.theme || '')} · ${esc(day.transportNote || '')}</div>`;

    for (const act of (day.activities || [])) {
      const tipTag = act.tip ? `<span class="tag tag-tip">💡 ${esc(act.tip)}</span>` : '';
      const foodTag = act.type === 'food' ? `<span class="tag tag-food">🍽 Food</span>` : '';
      html += `
        <div class="activity-card">
          <div class="act-time">${esc(act.time || '')}</div>
          <div class="act-body">
            <div class="act-name">${esc(act.name || '')}</div>
            <div class="act-desc">${esc(act.description || '')}</div>
            <div class="tags">
              ${act.duration ? `<span class="tag tag-dur">⏱ ${esc(act.duration)}</span>` : ''}
              ${act.cost ? `<span class="tag tag-cost">💰 ${esc(formatINR(act.cost))}</span>` : ''}
              ${foodTag}${tipTag}
            </div>
          </div>
        </div>`;
    }

    const meals = day.meals || {};
    html += `
      <div class="meals-row">
        <div><div class="meal-label">🌅 Breakfast</div><div class="meal-val">${esc(meals.breakfast || '—')}</div></div>
        <div><div class="meal-label">☀ Lunch</div><div class="meal-val">${esc(meals.lunch || '—')}</div></div>
        <div><div class="meal-label">🌙 Dinner</div><div class="meal-val">${esc(meals.dinner || '—')}</div></div>
      </div>
      <div class="day-cost">Est. daily spend: ${esc(formatINR(day.dailyCost))}</div>
    </div>`;
  }
  html += `</div>`;

  // ── 2-Column Grid ──
  html += `<div class="content-grid"><div>`;

  // Places to Visit
  html += `<div class="panel"><div class="panel-header"><span>🗺</span><h3>Places to Visit</h3></div><div class="panel-body">`;
  for (const p of (it.placesToVisit || [])) {
    html += `
      <div class="place-card">
        <div class="place-icon">📍</div>
        <div style="flex:1">
          <div class="place-name">${esc(p.name || '')}<span class="cat-badge">${esc(p.category || '')}</span></div>
          <div class="place-desc">${esc(p.description || '')}</div>
          <div class="tags">
            ${p.duration ? `<span class="tag tag-dur">⏱ ${esc(p.duration)}</span>` : ''}
            ${p.cost ? `<span class="tag tag-cost">💰 ${esc(formatINR(p.cost))}</span>` : ''}
            ${p.bestTime ? `<span class="tag tag-tip">🕐 Best: ${esc(p.bestTime)}</span>` : ''}
          </div>
        </div>
      </div>`;
  }
  html += `</div></div>`;

  // Food Recommendations
  html += `<div class="panel"><div class="panel-header"><span>🍽</span><h3>Food Recommendations</h3></div><div class="panel-body"><div class="food-grid">`;
  for (const f of (it.foodRecommendations || [])) {
    html += `
      <div class="food-card">
        <div class="food-name">🍽 ${esc(f.name || '')}</div>
        <div class="food-desc">${esc(f.description || '')}</div>
        <div class="tags" style="margin-top:6px">
          <span class="tag tag-food">${esc(f.type || '')}</span>
          <span class="tag tag-cost">${esc(String(f.priceRange || '').replace(/\$/g, '₹'))}</span>
          ${f.dietaryNotes ? `<span class="tag tag-tip">${esc(f.dietaryNotes)}</span>` : ''}
        </div>
      </div>`;
  }
  html += `</div></div></div>`;

  html += `</div><div>`; // Right column

  // Budget Breakdown
  const budgetRows = [
    ['✈ Flights', 'flightEstimate'], ['🏨 Accommodation', 'accommodation'],
    ['🍜 Food', 'food'], ['🚌 Transport', 'transport'],
    ['🎟 Activities', 'activities'], ['🛍 Misc', 'misc']
  ];
  html += `<div class="panel"><div class="panel-header"><span>💰</span><h3>Budget Breakdown (INR)</h3></div><div class="panel-body">`;
  for (const [label, key] of budgetRows) {
    html += `<div class="budget-row"><span>${label}</span><span style="color:#D4A843">₹${(b[key] || 0).toLocaleString('en-IN')}</span></div>`;
  }
  html += `<div class="budget-total"><span>Total per Person</span><span style="color:#E8935A">₹${(b.totalPerPerson || 0).toLocaleString('en-IN')}</span></div>`;

  html += `<div style="margin-top:14px"><div style="font-size:0.68rem;text-transform:uppercase;letter-spacing:0.8px;color:#8A8A9A;margin-bottom:6px">💡 Budget Tips</div>`;
  for (const tip of (b.budgetTips || [])) {
    html += `<div class="note-item">${esc(tip)}</div>`;
  }
  html += `</div></div></div>`;

  // Packing Tips
  html += `<div class="panel"><div class="panel-header"><span>🎒</span><h3>Packing Tips</h3></div><div class="panel-body">`;
  for (const tip of (it.packingTips || [])) {
    html += `<div class="note-item">${esc(tip)}</div>`;
  }
  html += `</div></div>`;

  // Important Notes
  html += `<div class="panel"><div class="panel-header"><span>⚠</span><h3>Important Notes</h3></div><div class="panel-body">`;
  for (const note of (it.importantNotes || [])) {
    html += `<div class="note-item">${esc(note)}</div>`;
  }
  html += `</div></div>`;

  html += `</div></div>`; // close right column + grid
  html += `</div>`; // close itinerary-result

  return html;
}


/* ═══════════════════════════════════════════════════════════════════════════
   CHAT
   ═══════════════════════════════════════════════════════════════════════════ */

function initChat() {
  const win = document.getElementById('chat-window');
  win.innerHTML = renderMsg('ai',
    "Hi! I'm your <strong>WandrGo AI Assistant</strong> 🌍<br><br>" +
    "I can help with travel tips, activity suggestions, food, budgeting, " +
    "packing, safety and more.<br><br>" +
    "<em style='color:#E8935A'>Generate a trip first for context-aware responses, or just ask me anything!</em>"
  );
}

function renderMsg(role, text) {
  // Convert **bold** and *italic* for AI messages
  if (role === 'ai') {
    text = text.replace(/\*\*(.*?)\*\*/g, '<strong style="color:#D4A843">$1</strong>');
    text = text.replace(/\*(.*?)\*/g, '<em style="color:#E8935A">$1</em>');
    text = text.replace(/\n/g, '<br>');
  }

  const isAI = role === 'ai';
  const avatar = isAI ? '✦' : '👤';

  return `
    <div class="msg ${role}">
      ${isAI ? `<div class="msg-avatar">${avatar}</div>` : ''}
      <div class="msg-bubble">${text}</div>
      ${!isAI ? `<div class="msg-avatar">${avatar}</div>` : ''}
    </div>`;
}

function sendQuick(btn) {
  document.getElementById('chat-input').value = btn.textContent;
  sendChat();
}

async function sendChat() {
  const input = document.getElementById('chat-input');
  const msg = input.value.trim();
  if (!msg) return;

  const win = document.getElementById('chat-window');
  const sendBtn = document.getElementById('btn-send');

  input.value = '';
  sendBtn.disabled = true;

  // Show user message
  win.innerHTML += renderMsg('user', esc(msg));
  win.innerHTML += `<div class="thinking-indicator" id="thinking">✦ Thinking…</div>`;
  win.scrollTop = win.scrollHeight;

  try {
    const res = await fetch(API + '/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: msg,
        session_id: sessionId,
        itinerary_context: currentItinerary,
      }),
    });
    const data = await res.json();

    // Remove thinking indicator
    const thinking = document.getElementById('thinking');
    if (thinking) thinking.remove();

    if (data.success) {
      win.innerHTML += renderMsg('ai', data.reply);
    } else {
      win.innerHTML += renderMsg('ai', `Sorry, something went wrong: ${data.detail || 'Unknown error'}`);
    }
  } catch (err) {
    const thinking = document.getElementById('thinking');
    if (thinking) thinking.remove();
    win.innerHTML += renderMsg('ai', `Connection error: ${err.message}. Make sure Ollama is running.`);
  }

  sendBtn.disabled = false;
  win.scrollTop = win.scrollHeight;
}


/* ─── Utility ─────────────────────────────────────────────────────────────── */
function esc(str) {
  if (!str) return '';
  const div = document.createElement('div');
  div.textContent = String(str);
  return div.innerHTML;
}


/* ─── Init ────────────────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initChat();
  initDatePickers();

  // Check Ollama health on load
  fetch(API + '/api/health')
    .then(r => r.json())
    .then(data => {
      if (!data.ollama) {
        document.getElementById('output-area').innerHTML =
          `<div class="status-msg error">⚠ Ollama is not running. Start it with <code>ollama serve</code></div>`;
      } else if (!data.model_ready) {
        document.getElementById('output-area').innerHTML =
          `<div class="status-msg error">⚠ Model not found. Pull it with <code>ollama pull ${data.model}</code></div>`;
      }
    })
    .catch(() => {});
});
