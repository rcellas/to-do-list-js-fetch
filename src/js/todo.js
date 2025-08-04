const API_URL = 'http://localhost:3000/todos';
const newTodoInput = document.querySelector("#new-todo input");
const submitButton = document.querySelector("#submit");
let isEditingTask = false;
let editButtonTodoID = '';
let isComplete = false;

// CRUD Operations
async function getTodos() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Error al obtener las tareas');
        return await response.json();
    } catch (error) {
        console.error("Error:", error);
        return [];
    }
}

async function createTodo(data) {
    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                ...data,
                completed: false,
                createdAt: new Date().toISOString()
            }),
        });
        if (!response.ok) throw new Error("Error al crear la tarea");
        return await response.json();
    } catch (error) {
        console.error("Error:", error);
    }
}

async function updateTodo(id, data) {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                ...data,
                updatedAt: new Date().toISOString()
            }),
        });
        if (!response.ok) throw new Error("Error al actualizar la tarea");
        return await response.json();
    } catch (error) {
        console.error("Error:", error);
    }
}

async function deleteTodo(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: "DELETE"
        });
        if (!response.ok) throw new Error("Error al eliminar la tarea");
        return true;
    } catch (error) {
        console.error("Error:", error);
    }
}

// UI Functions
async function addTask() {
    const title = newTodoInput.value.trim();
    if (!title) return;
    
    try {
        const result = await createTodo({ title });
        if (result) {
            await displayTodos();
            newTodoInput.value = "";
        } else {
            console.error("No se pudo crear la tarea");
        }
    } catch (error) {
        console.error("Error al añadir la tarea:", error);
    }
}

async function editTask() {
    const title = newTodoInput.value.trim();
    if (!title) return;
    
    await updateTodo(editButtonTodoID, { title, completed: isComplete });
    displayTodos();
    
    newTodoInput.value = "";
    isEditingTask = false;
    submitButton.innerHTML = "Añadir";
}

async function displayTodos() {
    const todos = await getTodos();
    const todoListContainer = document.querySelector("#todos");
    todoListContainer.innerHTML = "";

    if (todos.length === 0) {
        todoListContainer.innerHTML = `
            <div class="todo">
                <span>No tienes ninguna tarea pendiente</span>
            </div>
        `;
        return;
    }

    todos.forEach(todo => {
        todoListContainer.innerHTML += `
            <div class="todo">
                <span id="todoname"
                    style="text-decoration: ${todo.completed ? "line-through" : "none"}"
                    data-iscomplete="${todo.completed}"
                    data-id="${todo.id}">
                    ${todo.title}
                </span>
                <div class="actions">
                    <button data-id="${todo.id}" class="edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button data-id="${todo.id}" class="delete">
                        <i class="far fa-trash-alt"></i>
                    </button>
                </div>
            </div>
        `;
    });

    setupEventListeners();
}

function setupEventListeners() {
    // Delete buttons
    document.querySelectorAll(".delete").forEach(button => {
        button.onclick = async () => {
            const id = button.getAttribute("data-id");
            await deleteTodo(id);
            displayTodos();
        };
    });

    // Edit buttons
    document.querySelectorAll(".edit").forEach(button => {
        button.onclick = () => {
            const todoSpan = button.parentNode.parentNode.querySelector("#todoname");
            newTodoInput.value = todoSpan.innerText;
            submitButton.innerHTML = "Editar";
            isEditingTask = true;
            editButtonTodoID = button.getAttribute("data-id");
            isComplete = JSON.parse(todoSpan.getAttribute("data-iscomplete"));
        };
    });

    // Toggle completion
    document.querySelectorAll("#todoname").forEach(span => {
        span.onclick = async () => {
            const id = span.getAttribute("data-id");
            const completed = JSON.parse(span.getAttribute("data-iscomplete"));
            await updateTodo(id, {
                title: span.innerText,
                completed: !completed
            });
            displayTodos();
        };
    });
}

// Initial setup
document.addEventListener('DOMContentLoaded', () => {
    submitButton.addEventListener('click', () => {
        if (isEditingTask) {
            editTask();
        } else {
            addTask();
        }
    });

    newTodoInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            if (isEditingTask) {
                editTask();
            } else {
                addTask();
            }
        }
    });

    // Cargar las tareas iniciales
    displayTodos();
});

// Load initial todos
displayTodos();
