const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("tasklist"); 

function addTask() {
  const text = taskInput.value.trim();
  if (text === "") return; // don't add empty tasks

  const li = document.createElement("li");
  li.innerHTML = `
    <span class="task-text">${text}</span>
    <div>
      <button class="edit-btn">Edit</button>
      <button class="delete-btn">Delete</button>
    </div>
  `;

  taskList.appendChild(li);
  taskInput.value = ""; // clear input

  saveTasks();
}

addBtn.addEventListener("click", addTask);
taskInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") addTask();
});

taskList.addEventListener("click", (e) => {
  if (e.target.classList.contains("delete-btn")) {
    e.target.closest("li").remove();
    saveTasks();
  }
});

taskList.addEventListener("click", (e) => {
  if (!e.target.classList.contains("edit-btn")) return;

  const li = e.target.closest("li");
  const editBtn = e.target;

  if (editBtn.textContent === "Edit") {
    // Switch to edit mode: span -> input
    const span = li.querySelector(".task-text");
    const input = document.createElement("input");
    input.type = "text";
    input.value = span.textContent;
    input.className = "task-text";
    span.replaceWith(input);
    input.focus();
    editBtn.textContent = "Save";
  } else {
    // Switch back: input -> span
    const input = li.querySelector(".task-text");
    const newText = input.value.trim();
    if (newText === "") return;
    const span = document.createElement("span");
    span.className = "task-text";
    span.textContent = newText;
    input.replaceWith(span);
    editBtn.textContent = "Edit";
    saveTasks();
  }
});

const searchInput = document.getElementById("search");

searchInput.addEventListener("input", (e) => {
  const query = e.target.value.toLowerCase().trim();
  const items = taskList.querySelectorAll("li");

  items.forEach((li) => {
    const text = li.querySelector(".task-text").textContent.toLowerCase();
    if (text.includes(query)) {
      li.style.display = "";
    } else {
      li.style.display = "none";
    }
  });
});


function saveTasks() {
  const tasks = [];
  taskList.querySelectorAll("li").forEach((li) => {
    tasks.push(li.querySelector(".task-text").textContent);
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
  const saved = localStorage.getItem("tasks");
  if (!saved) return;
  const tasks = JSON.parse(saved);
  tasks.forEach((text) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <span class="task-text">${text}</span>
      <div>
        <button class="edit-btn">Edit</button>
        <button class="delete-btn">Delete</button>
      </div>
    `;
    taskList.appendChild(li);
  });
}

loadTasks(); // call once when the page loads