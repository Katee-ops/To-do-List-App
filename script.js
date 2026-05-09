let tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
let filter = 'all';

/* ── Theme ── */
function setTheme(name, el) {
  document.body.className = 'theme-' + name;
  document.querySelectorAll('.dot').forEach(d => d.classList.remove('active'));
  el.classList.add('active');
}

/* ── Add ── */
function addTask() {
  const input = document.getElementById('taskInput');
  const text  = input.value.trim();
  if (!text) { input.focus(); return; }

  const date = document.getElementById('taskDate').value;
  const time = document.getElementById('taskTime').value;

  tasks.unshift({
    id: Date.now(),
    text,
    date,
    time,
    done: false
  });

  input.value = '';
  save(); render();
}

function handleKey(e) {
  if (e.key === 'Enter') addTask();
}

/* ── Toggle complete ── */
function toggleTask(id) {
  const t = tasks.find(t => t.id === id);
  if (t) t.done = !t.done;
  save(); render();
}

/* ── Delete ── */
function deleteTask(id) {
  tasks = tasks.filter(t => t.id !== id);
  save(); render();
}

/* ── Filter ── */
function setFilter(f, el) {
  filter = f;
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  el.classList.add('active');
  render();
}

/* ── Render ── */
function render() {
  const list  = document.getElementById('taskList');
  const total = tasks.length;
  const done  = tasks.filter(t => t.done).length;

  document.getElementById('totalCount').textContent = total + ' task' + (total !== 1 ? 's' : '');
  document.getElementById('doneCount').textContent  = done + ' completed';

  const visible = tasks.filter(t => {
    if (filter === 'active')    return !t.done;
    if (filter === 'completed') return  t.done;
    return true;
  });

  if (!visible.length) {
    list.innerHTML = `
      <div class="empty-state">
        <div class="icon">✅</div>
        <p>No tasks yet!</p>
      </div>`;
    return;
  }

  list.innerHTML = visible.map(t => {
    const meta = [t.date, t.time].filter(Boolean).join(' · ');
    return `
      <div class="task-card ${t.done ? 'completed' : ''}">
        <div class="task-check ${t.done ? 'checked' : ''}" onclick="toggleTask(${t.id})"></div>
        <div class="task-body">
          <div class="task-text">${escHtml(t.text)}</div>
          ${meta ? `<div class="task-meta">${meta}</div>` : ''}
        </div>
        <button class="delete-btn" onclick="deleteTask(${t.id})" title="Delete">✕</button>
      </div>`;
  }).join('');
}

function escHtml(s) {
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function save() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

render();