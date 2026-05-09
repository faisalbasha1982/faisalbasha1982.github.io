// chat-widget.js — drop-in AI assistant for faisalbinbasha.com.
// Add to your site with: <script src="chat-widget.js" defer></script>
(function () {
  'use strict';

  // ── Configure ──────────────────────────────────────────────────────────────
  const ENDPOINT = 'https://YOUR-WORKER.your-subdomain.workers.dev/chat';
  const ASSISTANT_NAME = 'Ask Faisal AI';
  const GREETING = "Hi! I'm Faisal's AI assistant. Ask me about his experience, skills, certifications, or services.";
  const SUGGESTIONS = [
    'What does Faisal specialize in?',
    'Tell me about his Kubernetes experience',
    'What certifications does he hold?',
    'Is he available for consulting?',
  ];
  // ───────────────────────────────────────────────────────────────────────────

  const css = `
.fb-root, .fb-root * { box-sizing: border-box; font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif; }
.fb-fab {
  position: fixed; bottom: 24px; right: 24px; z-index: 99998;
  width: 56px; height: 56px; border-radius: 28px;
  background: #0b0f14; color: #d4f0ff;
  border: 1px solid rgba(255,255,255,0.12);
  cursor: pointer; display: grid; place-items: center;
  box-shadow: 0 12px 32px rgba(0,0,0,0.35);
  transition: transform .15s ease, background .15s ease;
}
.fb-fab:hover { transform: translateY(-2px); background: #131922; }
.fb-fab svg { width: 24px; height: 24px; stroke: currentColor; fill: none; stroke-width: 1.8; }

.fb-panel {
  position: fixed; bottom: 96px; right: 24px; z-index: 99999;
  width: min(380px, calc(100vw - 32px));
  height: min(580px, calc(100vh - 140px));
  background: #0b0f14; color: #e7eef5;
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 16px; overflow: hidden;
  display: none; flex-direction: column;
  box-shadow: 0 24px 64px rgba(0,0,0,0.5);
  font-size: 14px; line-height: 1.5;
}
.fb-panel.open { display: flex; }

.fb-header {
  padding: 14px 16px; display: flex; align-items: center; gap: 10px;
  border-bottom: 1px solid rgba(255,255,255,0.06);
}
.fb-avatar {
  width: 32px; height: 32px; border-radius: 16px;
  background: linear-gradient(135deg,#1d3a52,#2a5f7c); color: #d4f0ff;
  display: grid; place-items: center; font-weight: 600; font-size: 12px;
}
.fb-title { font-weight: 500; font-size: 14px; }
.fb-subtitle { font-size: 11px; color: rgba(255,255,255,0.5); margin-top: 1px; }
.fb-close {
  margin-left: auto; background: none; border: 0; cursor: pointer;
  color: rgba(255,255,255,0.5); padding: 4px; font-size: 20px; line-height: 1;
}
.fb-close:hover { color: #fff; }

.fb-messages {
  flex: 1; overflow-y: auto; padding: 16px;
  display: flex; flex-direction: column; gap: 10px;
}
.fb-msg {
  padding: 10px 14px; border-radius: 14px;
  max-width: 85%; word-wrap: break-word; white-space: pre-wrap;
}
.fb-msg-user { align-self: flex-end; background: #1f3349; color: #e7eef5; border-bottom-right-radius: 4px; }
.fb-msg-bot  { align-self: flex-start; background: #161c24; color: #d8e0e8; border-bottom-left-radius: 4px; }
.fb-cursor {
  display: inline-block; width: 2px; height: 14px; vertical-align: -2px;
  background: rgba(255,255,255,0.6); animation: fb-blink 1s step-end infinite; margin-left: 1px;
}
@keyframes fb-blink { 50% { opacity: 0; } }

.fb-suggestions { display: flex; flex-wrap: wrap; gap: 6px; padding: 0 16px 12px; }
.fb-suggestion {
  padding: 6px 10px; font-size: 12px;
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 12px; cursor: pointer; color: rgba(255,255,255,0.75);
}
.fb-suggestion:hover { background: rgba(255,255,255,0.08); color: #fff; }

.fb-input {
  display: flex; gap: 8px; padding: 12px;
  border-top: 1px solid rgba(255,255,255,0.06);
}
.fb-input textarea {
  flex: 1; resize: none; min-height: 38px; max-height: 120px;
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 10px; padding: 9px 12px;
  color: #e7eef5; font: inherit; outline: none;
}
.fb-input textarea:focus { border-color: rgba(255,255,255,0.2); }
.fb-input button {
  background: #d4f0ff; color: #0b0f14; border: 0;
  padding: 0 14px; border-radius: 10px; cursor: pointer;
  font-weight: 500; font-size: 13px;
}
.fb-input button:disabled { opacity: 0.4; cursor: not-allowed; }
.fb-footer {
  padding: 0 12px 8px; font-size: 10px;
  color: rgba(255,255,255,0.35); text-align: center;
}
`;

  // Inject styles.
  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  // Build DOM.
  const root = document.createElement('div');
  root.className = 'fb-root';
  root.innerHTML = `
    <button class="fb-fab" aria-label="Open chat">
      <svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 12a9 9 0 0 1-13.5 7.79L3 21l1.21-4.5A9 9 0 1 1 21 12z"/>
      </svg>
    </button>
    <div class="fb-panel" role="dialog" aria-label="${ASSISTANT_NAME}">
      <div class="fb-header">
        <div class="fb-avatar">FB</div>
        <div>
          <div class="fb-title">${ASSISTANT_NAME}</div>
          <div class="fb-subtitle">Ask about Faisal's work</div>
        </div>
        <button class="fb-close" aria-label="Close">×</button>
      </div>
      <div class="fb-messages"></div>
      <div class="fb-suggestions"></div>
      <div class="fb-input">
        <textarea placeholder="Type your question..." rows="1" aria-label="Message"></textarea>
        <button>Send</button>
      </div>
      <div class="fb-footer">Powered by Claude. Responses may not be 100% accurate.</div>
    </div>
  `;
  document.body.appendChild(root);

  const fab = root.querySelector('.fb-fab');
  const panel = root.querySelector('.fb-panel');
  const closeBtn = root.querySelector('.fb-close');
  const messagesEl = root.querySelector('.fb-messages');
  const suggestionsEl = root.querySelector('.fb-suggestions');
  const textarea = root.querySelector('textarea');
  const sendBtn = root.querySelector('.fb-input button');

  let history = []; // [{ role, content }]
  let busy = false;

  function render() {
    messagesEl.innerHTML = '';
    if (history.length === 0) {
      const greeting = document.createElement('div');
      greeting.className = 'fb-msg fb-msg-bot';
      greeting.textContent = GREETING;
      messagesEl.appendChild(greeting);
      renderSuggestions();
    } else {
      history.forEach(m => {
        const el = document.createElement('div');
        el.className = `fb-msg fb-msg-${m.role === 'user' ? 'user' : 'bot'}`;
        el.textContent = m.content;
        if (m.streaming) el.appendChild(cursor());
        messagesEl.appendChild(el);
      });
      suggestionsEl.innerHTML = '';
    }
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  function cursor() {
    const c = document.createElement('span');
    c.className = 'fb-cursor';
    return c;
  }

  function renderSuggestions() {
    suggestionsEl.innerHTML = '';
    SUGGESTIONS.forEach(s => {
      const btn = document.createElement('button');
      btn.className = 'fb-suggestion';
      btn.textContent = s;
      btn.onclick = () => { textarea.value = s; send(); };
      suggestionsEl.appendChild(btn);
    });
  }

  function open() {
    panel.classList.add('open');
    fab.style.display = 'none';
    setTimeout(() => textarea.focus(), 50);
    if (history.length === 0) render();
  }

  function close() {
    panel.classList.remove('open');
    fab.style.display = 'grid';
  }

  fab.onclick = open;
  closeBtn.onclick = close;

  textarea.addEventListener('input', () => {
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
  });

  textarea.addEventListener('keydown', e => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  });

  sendBtn.onclick = send;

  async function send() {
    if (busy) return;
    const text = textarea.value.trim();
    if (!text) return;

    history.push({ role: 'user', content: text });
    textarea.value = '';
    textarea.style.height = 'auto';
    busy = true;
    sendBtn.disabled = true;

    const botMsg = { role: 'assistant', content: '', streaming: true };
    history.push(botMsg);
    render();

    try {
      const res = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: history
            .filter(m => !m.streaming)
            .map(({ role, content }) => ({ role, content })),
        }),
      });

      if (!res.ok || !res.body) throw new Error('Request failed: ' + res.status);

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        const events = buffer.split('\n\n');
        buffer = events.pop(); // last (possibly incomplete) event stays in buffer

        for (const ev of events) {
          const dataLine = ev.split('\n').find(l => l.startsWith('data: '));
          if (!dataLine) continue;
          const data = dataLine.slice(6).trim();
          if (!data || data === '[DONE]') continue;
          try {
            const parsed = JSON.parse(data);
            if (parsed.type === 'content_block_delta' && parsed.delta?.text) {
              botMsg.content += parsed.delta.text;
              render();
            }
          } catch {
            /* ignore parse errors on partial events */
          }
        }
      }
    } catch (err) {
      botMsg.content = "Sorry, I couldn't reach the assistant. Please try again, or email faisalbasha.andd@gmail.com directly.";
      console.error(err);
    } finally {
      botMsg.streaming = false;
      busy = false;
      sendBtn.disabled = false;
      render();
    }
  }
})();
