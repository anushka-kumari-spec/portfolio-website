const todoForm = document.querySelector(".todo-form");
const taskInput = document.querySelector("[name='task']");
const priorityInput = document.querySelector("[name='priority']");
const dueDateInput = document.querySelector("[name='dueDate']");
const taskList = document.querySelector(".task-list");
const emptyState = document.querySelector(".empty-state");
const filterButtons = document.querySelectorAll("[data-filter]");
const searchInput = document.querySelector(".search-input");
const clearCompletedButton = document.querySelector(".clear-completed");
const totalStat = document.querySelector("[data-stat='total']");
const activeStat = document.querySelector("[data-stat='active']");
const completedStat = document.querySelector("[data-stat='completed']");

const storageKey = "anushka.todo.tasks";
let tasks = JSON.parse(localStorage.getItem(storageKey)) || [];
let currentFilter = "all";
let searchTerm = "";

function createTaskId() {
    if (window.crypto && crypto.randomUUID) {
        return crypto.randomUUID();
    }

    return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function escapeHtml(value) {
    return value
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

function saveTasks() {
    localStorage.setItem(storageKey, JSON.stringify(tasks));
}

function formatDate(dateValue) {
    if (!dateValue) return "No due date";

    const date = new Date(`${dateValue}T00:00:00`);
    return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric"
    });
}

function getVisibleTasks() {
    return tasks.filter((task) => {
        const matchesFilter =
            currentFilter === "all" ||
            (currentFilter === "active" && !task.completed) ||
            (currentFilter === "completed" && task.completed);
        const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase());

        return matchesFilter && matchesSearch;
    });
}

function updateStats() {
    const completedCount = tasks.filter((task) => task.completed).length;

    totalStat.textContent = tasks.length;
    activeStat.textContent = tasks.length - completedCount;
    completedStat.textContent = completedCount;
}

function renderTasks() {
    const visibleTasks = getVisibleTasks();

    taskList.innerHTML = visibleTasks.map((task) => {
        const safeTitle = escapeHtml(task.title);

        return `
        <li class="task-item ${task.completed ? "completed" : ""}">
            <input class="task-check" type="checkbox" ${task.completed ? "checked" : ""} data-action="toggle" data-id="${task.id}" aria-label="Mark ${safeTitle} complete">
            <div>
                <p class="task-title">${safeTitle}</p>
                <div class="task-meta">
                    <span class="priority-${task.priority}">${task.priority}</span>
                    <span>${formatDate(task.dueDate)}</span>
                </div>
            </div>
            <button class="delete-task" type="button" data-action="delete" data-id="${task.id}" aria-label="Delete ${safeTitle}">Delete</button>
        </li>
    `;
    }).join("");

    emptyState.classList.toggle("visible", visibleTasks.length === 0);
    updateStats();
}

todoForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const title = taskInput.value.trim();
    if (!title) return;

    tasks.unshift({
        id: createTaskId(),
        title,
        priority: priorityInput.value,
        dueDate: dueDateInput.value,
        completed: false
    });

    todoForm.reset();
    priorityInput.value = "medium";
    saveTasks();
    renderTasks();
    taskInput.focus();
});

taskList.addEventListener("click", (event) => {
    const target = event.target;
    const action = target.dataset.action;
    const id = target.dataset.id;

    if (!action || !id) return;

    if (action === "toggle") {
        tasks = tasks.map((task) => (
            task.id === id ? { ...task, completed: target.checked } : task
        ));
    }

    if (action === "delete") {
        tasks = tasks.filter((task) => task.id !== id);
    }

    saveTasks();
    renderTasks();
});

filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
        currentFilter = button.dataset.filter;

        filterButtons.forEach((item) => {
            item.classList.toggle("active", item === button);
        });

        renderTasks();
    });
});

searchInput.addEventListener("input", () => {
    searchTerm = searchInput.value.trim();
    renderTasks();
});

clearCompletedButton.addEventListener("click", () => {
    tasks = tasks.filter((task) => !task.completed);
    saveTasks();
    renderTasks();
});

renderTasks();
