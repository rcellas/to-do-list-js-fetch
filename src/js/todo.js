const API_URL = 'http://localhost:3000/todos';
const STORAGE_KEY = 'todos';
const newTodoInput = document.querySelector("#new-todo input");
const submitButton = document.querySelector("#submit");
let isEditingTask = false;
let editButtonTodoID = '';
let isComplete = false;
let isOnline = true;

// localStorage functions
function saveTodosToLocalStorage(todos) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

function getTodosFromLocalStorage() {
    const todos = localStorage.getItem(STORAGE_KEY);
    return todos ? JSON.parse(todos) : [];
}

function generateId() {
    return Date.now() + Math.floor(Math.random() * 1000);
}

// CRUD Operations
async function getTodos() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Error al obtener las tareas');
        const todos = await response.json();
        // Sincronizar con localStorage
        saveTodosToLocalStorage(todos);
        isOnline = true;
        return todos;
    } catch (error) {
        console.error("Error:", error);
        console.log("Cargando desde localStorage...");
        isOnline = false;
        return getTodosFromLocalStorage();
    }
}

async function createTodo(data) {
    const newTodo = {
        ...data,
        id: generateId(),
        completed: false,
        createdAt: new Date().toISOString()
    };

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newTodo),
        });
        if (!response.ok) throw new Error("Error al crear la tarea");
        const todo = await response.json();
        isOnline = true;
        
        // Actualizar localStorage también
        const todos = getTodosFromLocalStorage();
        todos.push(todo);
        saveTodosToLocalStorage(todos);
        
        return todo;
    } catch (error) {
        console.error("Error:", error);
        console.log("Guardando en localStorage...");
        isOnline = false;
        
        // Fallback a localStorage
        const todos = getTodosFromLocalStorage();
        todos.push(newTodo);
        saveTodosToLocalStorage(todos);
        return newTodo;
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
        const updatedTodo = await response.json();
        isOnline = true;
        
        // Actualizar localStorage también
        const todos = getTodosFromLocalStorage();
        const index = todos.findIndex(t => t.id == id);
        if (index !== -1) {
            todos[index] = updatedTodo;
            saveTodosToLocalStorage(todos);
        }
        
        return updatedTodo;
    } catch (error) {
        console.error("Error:", error);
        console.log("Actualizando en localStorage...");
        isOnline = false;
        
        // Fallback a localStorage
        const todos = getTodosFromLocalStorage();
        const index = todos.findIndex(t => t.id == id);
        if (index !== -1) {
            todos[index] = { ...todos[index], ...data, updatedAt: new Date().toISOString() };
            saveTodosToLocalStorage(todos);
            return todos[index];
        }
        return null;
    }
}

async function deleteTodo(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: "DELETE"
        });
        if (!response.ok) throw new Error("Error al eliminar la tarea");
        isOnline = true;
        
        // Eliminar de localStorage también
        const todos = getTodosFromLocalStorage();
        const filteredTodos = todos.filter(t => t.id != id);
        saveTodosToLocalStorage(filteredTodos);
        
        return true;
    } catch (error) {
        console.error("Error:", error);
        console.log("Eliminando de localStorage...");
        isOnline = false;
        
        // Fallback a localStorage
        const todos = getTodosFromLocalStorage();
        const filteredTodos = todos.filter(t => t.id != id);
        saveTodosToLocalStorage(filteredTodos);
        return true;
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

    // Mostrar estado de conexión
    const statusMessage = isOnline ? "" : " (Modo offline)";
    
    if (todos.length === 0) {
        todoListContainer.innerHTML = `
            <div class="todo">
                <span>No tienes ninguna tarea pendiente${statusMessage}</span>
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
    
    // Mostrar indicador de estado
    if (!isOnline) {
        console.log("⚠️ Modo offline - Los cambios se guardan localmente");
    }
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
