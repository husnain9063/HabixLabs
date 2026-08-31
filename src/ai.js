import "./style.css";

const scrollEl = document.getElementById("chat-scroll");
const logEl = document.getElementById("chat-log");
const emptyEl = document.getElementById("chat-empty");
const formEl = document.getElementById("chat-form");
const inputEl = document.getElementById("chat-input");
const sendEl = document.getElementById("chat-send");

const history = []; // [{ role: "user" | "model", text: string }]

function autoGrow() {
  inputEl.style.height = "auto";
  inputEl.style.height = Math.min(inputEl.scrollHeight, 152) + "px";
}

function updateSendState() {
  const active = inputEl.value.trim().length > 0;
  sendEl.disabled = !active;
  sendEl.dataset.active = String(active);
}

function scrollToBottom() {
  scrollEl.scrollTo({ top: scrollEl.scrollHeight, behavior: "smooth" });
}

function addBubble(role, text) {
  emptyEl.style.display = "none";

  const row = document.createElement("div");
  row.className = "flex " + (role === "user" ? "justify-end" : "justify-start");

  const bubble = document.createElement("div");
  bubble.className =
    "chat-bubble " + (role === "user" ? "chat-bubble-user" : role === "error" ? "chat-bubble-error" : "chat-bubble-ai");
  bubble.textContent = text;

  row.appendChild(bubble);
  logEl.appendChild(row);
  scrollToBottom();
  return bubble;
}

function addTypingBubble() {
  const row = document.createElement("div");
  row.className = "flex justify-start";
  row.innerHTML =
    '<div class="chat-bubble chat-bubble-ai"><span class="chat-typing"><span></span><span></span><span></span></span></div>';
  logEl.appendChild(row);
  scrollToBottom();
  return row;
}

async function sendMessage(text) {
  addBubble("user", text);
  history.push({ role: "user", text });
  inputEl.value = "";
  autoGrow();
  updateSendState();

  const typingRow = addTypingBubble();

  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: history }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Request failed (${res.status})`);
    }

    const data = await res.json();
    typingRow.remove();
    addBubble("model", data.reply);
    history.push({ role: "model", text: data.reply });
  } catch (err) {
    typingRow.remove();
    const isMissingBackend = /404|failed to fetch/i.test(err.message || "");
    addBubble(
      "error",
      isMissingBackend
        ? "The AI backend isn't set up yet on this deployment — it only runs on the live Vercel site once the API key is configured."
        : "Something went wrong: " + err.message,
    );
  }
}

formEl.addEventListener("submit", (e) => {
  e.preventDefault();
  const text = inputEl.value.trim();
  if (!text) return;
  sendMessage(text);
});

inputEl.addEventListener("input", () => {
  autoGrow();
  updateSendState();
});

inputEl.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    formEl.requestSubmit();
  }
});

inputEl.focus();
