const formEl = document.querySelector(".form");
const inputEl = document.querySelector(".input");
const datetimeEl = document.querySelector(".datetime");
const ulEl = document.querySelector(".list");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// Initialize tasks on page load
if (tasks.length) {
  tasks.forEach((task) => renderTask(task));
}

formEl.addEventListener("submit", (event) => {
  event.preventDefault();
  const taskName = inputEl.value.trim();
  const taskTime = datetimeEl.value;

  if (!taskName || !taskTime) {
    alert("Please enter both a task and a date/time.");
    return;
  }

  const task = {
    id: Date.now(),
    name: taskName,
    datetime: taskTime,
    completed: false,
  };

  tasks.push(task);
  saveToLocalStorage();
  renderTask(task);
  formEl.reset();
});

function renderTask(task) {
  const liEl = document.createElement("li");
  liEl.dataset.id = task.id;

  const taskContent = document.createElement("div");
  taskContent.className = "task-content";
  taskContent.innerHTML = `
    <strong>${task.name}</strong>
    <div class="datetime-display">${new Date(task.datetime).toLocaleString()}</div>
  `;

  if (task.completed) {
    liEl.classList.add("checked");
  }

  const actions = document.createElement("div");
  actions.className = "actions";

  const checkBtn = document.createElement("i");
  checkBtn.className = "fas fa-check";
  checkBtn.addEventListener("click", () => toggleComplete(liEl));

  const editBtn = document.createElement("i");
  editBtn.className = "fas fa-edit";
  editBtn.addEventListener("click", () => editTask(liEl));

  const deleteBtn = document.createElement("i");
  deleteBtn.className = "fas fa-trash";
  deleteBtn.addEventListener("click", () => deleteTask(liEl));

  actions.append(checkBtn, editBtn, deleteBtn);
  liEl.append(taskContent, actions);
  ulEl.appendChild(liEl);
}

function toggleComplete(liEl) {
  const taskId = liEl.dataset.id;
  const task = tasks.find((t) => t.id == taskId);
  task.completed = !task.completed;
  liEl.classList.toggle("checked");
  saveToLocalStorage();
}

function editTask(liEl) {
  const taskId = liEl.dataset.id;
  const task = tasks.find((t) => t.id == taskId);

  const newName = prompt("Edit task name:", task.name);
  const newDatetime = prompt(
    "Edit task date/time:",
    task.datetime
  );

  if (newName && newDatetime) {
    task.name = newName;
    task.datetime = newDatetime;
    liEl.querySelector(".task-content").innerHTML = `
      <strong>${task.name}</strong>
      <div class="datetime-display">${new Date(task.datetime).toLocaleString()}</div>
    `;
    saveToLocalStorage();
  }
}

function deleteTask(liEl) {
  const taskId = liEl.dataset.id;
  tasks = tasks.filter((task) => task.id != taskId);
  liEl.remove();
  saveToLocalStorage();
}

function saveToLocalStorage() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}