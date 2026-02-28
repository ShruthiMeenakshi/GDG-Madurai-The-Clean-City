// Simple in-page chatbot widget (local demo).
(function () {
  if (document.querySelector('.muig-chatbot')) return;

  function createNode(html) {
    var t = document.createElement('template');
    t.innerHTML = html.trim();
    return t.content.firstChild;
  }

  const widget = createNode(`
    <div class="muig-chatbot" aria-hidden="false">
      <button class="chat-toggle" aria-label="Open chat">💬</button>
      <div class="chat-panel" role="dialog" aria-label="Chatbot" hidden>
        <div class="chat-header"><span>Assistant</span><button class="chat-close" aria-label="Close">✕</button></div>
        <div class="chat-messages" role="log"></div>
        <form class="chat-form">
          <input class="chat-input" placeholder="Ask about routing, maps, AI..." autocomplete="off" />
          <button class="chat-send" type="submit">Send</button>
        </form>
      </div>
    </div>
  `);

  // Basic message append helper
  function appendMessage(role, text) {
    const messages = widget.querySelector('.chat-messages');
    const el = document.createElement('div');
    el.className = 'chat-msg ' + (role === 'user' ? 'user' : 'bot');
    el.textContent = text;
    messages.appendChild(el);
    messages.scrollTop = messages.scrollHeight;
  }

  function getReply(text) {
    const t = text.toLowerCase();
    if (t.includes('route') || t.includes('optimi')) return 'To optimize routes, choose trucks, select hotspots and click Optimize. I can start a pilot conversion if you want.';
    if (t.includes('map') || t.includes('leaflet')) return 'Maps are powered by Leaflet. You can zoom, click markers, and filter wards from the side panel.';
    if (t.includes('ai') || t.includes('detection')) return 'AI Detection shows camera and citizen reports; open the AI Detection page for image tools.';
    if (t.includes('deploy') || t.includes('prod')) return 'For production, build the client with `npm run build` and serve with a static host (nginx/docker).';
    if (t.length < 3) return 'Could you provide more details or ask a specific question?';
    return 'I can help with migration, routing, and map questions. Try: "How to optimize routes" or "How to convert dashboard to React".';
  }

  // Toggle behavior
  const toggle = widget.querySelector('.chat-toggle');
  const panel = widget.querySelector('.chat-panel');
  const closeBtn = widget.querySelector('.chat-close');
  const form = widget.querySelector('.chat-form');
  const input = widget.querySelector('.chat-input');

  toggle.addEventListener('click', () => {
    panel.hidden = false;
    toggle.style.display = 'none';
    input.focus();
    // Welcome message
    setTimeout(() => appendMessage('bot', 'Hi — I can help with the dashboard, routing, and migration. How can I assist?'), 300);
  });

  closeBtn.addEventListener('click', () => {
    panel.hidden = true;
    toggle.style.display = '';
  });

  form.addEventListener('submit', (ev) => {
    ev.preventDefault();
    const text = input.value.trim();
    if (!text) return;
    appendMessage('user', text);
    input.value = '';
    // Bot reply after brief delay
    setTimeout(() => appendMessage('bot', getReply(text)), 500);
  });

  // keyboard shortcut: Ctrl+K to open
  window.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      if (panel.hidden) toggle.click(); else closeBtn.click();
    }
  });

  // inject lightweight accessibility improvements
  widget.querySelector('.chat-input').setAttribute('aria-label', 'Chat message input');

  document.body.appendChild(widget);
})();

/* End of chatbot.js */
