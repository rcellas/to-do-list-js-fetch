/**
 * UI module - Maneja toda la interfaz de usuario
 */
const UI = {
    // Referencias a elementos del DOM
    todoForm: null,
    todoInput: null,
    todosList: null,
    loadingEl: null,
    emptyState: null,
    notification: null,
    totalCount: null,
    pendingCount: null,
    completedCount: null,

    /**
     * Inicializa las referencias del DOM
     */
    init() {
        this.todoForm = document.getElementById('todo-form');
        this.todoInput = document.getElementById('todo-input');
        this.todosList = document.getElementById('todos-list');
        this.loadingEl = document.getElementById('loading');
        this.emptyState = document.getElementById('empty-state');
        this.notification = document.getElementById('notification');
        this.totalCount = document.getElementById('total-count');
        this.pendingCount = document.getElementById('pending-count');
        this.completedCount = document.getElementById('completed-count');
    },

    /**
     * Muestra el estado de carga
     */
    showLoading() {
        this.loadingEl?.classList.remove('hidden');
        this.emptyState?.classList.add('hidden');
        this.todosList.innerHTML = '';
    },

    /**
     * Oculta el estado de carga
     */
    hideLoading() {
        this.loadingEl?.classList.add('hidden');
    },

    /**
     * Muestra el estado vacío
     */
    showEmptyState() {
        this.emptyState?.classList.remove('hidden');
        this.todosList.innerHTML = '';
    },

    /**
     * Oculta el estado vacío
     */
    hideEmptyState() {
        this.emptyState?.classList.add('hidden');
    },

    /**
     * Renderiza la lista completa de tareas
     */
    renderTodos(todos) {
        this.hideLoading();
        
        if (!todos || todos.length === 0) {
            this.showEmptyState();
            return;
        }

        this.hideEmptyState();
        this.todosList.innerHTML = '';

        todos.forEach(todo => {
            const todoElement = this.createTodoElement(todo);
            this.todosList.appendChild(todoElement);
        });

        this.updateStats(todos);
    },

    /**
     * Crea un elemento de tarea
     */
    createTodoElement(todo) {
        const li = document.createElement('li');
        li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
        li.dataset.id = todo.id;

        li.innerHTML = `
            <div class="todo-content">
                <span class="todo-text ${todo.completed ? 'completed' : ''}">${this.escapeHtml(todo.title)}</span>
                <div class="todo-actions">
                    <button class="btn btn-small btn-success toggle-btn" data-id="${todo.id}">
                        ${todo.completed ? '↩️' : '✅'}
                    </button>
                    <button class="btn btn-small btn-danger delete-btn" data-id="${todo.id}">
                        🗑️
                    </button>
                </div>
            </div>
        `;

        return li;
    },

    /**
     * Actualiza las estadísticas
     */
    updateStats(todos) {
        const total = todos.length;
        const completed = todos.filter(todo => todo.completed).length;
        const pending = total - completed;

        this.totalCount.textContent = total;
        this.completedCount.textContent = completed;
        this.pendingCount.textContent = pending;
    },

    /**
     * Limpia el formulario
     */
    clearForm() {
        this.todoInput.value = '';
        this.todoInput.focus();
    },

    /**
     * Obtiene el valor del input
     */
    getInputValue() {
        return this.todoInput.value.trim();
    },

    /**
     * Muestra una notificación
     */
    showNotification(message, type = 'info') {
        this.notification.textContent = message;
        this.notification.className = `notification ${type}`;
        
        // Mostrar notificación
        setTimeout(() => {
            this.notification.classList.add('show');
        }, 100);

        // Ocultar después de 3 segundos
        setTimeout(() => {
            this.hideNotification();
        }, 3000);
    },

    /**
     * Oculta la notificación
     */
    hideNotification() {
        this.notification.classList.remove('show');
    },

    /**
     * Actualiza un elemento de tarea específico
     */
    updateTodoElement(todo) {
        const todoElement = document.querySelector(`[data-id="${todo.id}"]`);
        if (todoElement) {
            const newElement = this.createTodoElement(todo);
            todoElement.replaceWith(newElement);
        }
    },

    /**
     * Elimina un elemento de tarea del DOM
     */
    removeTodoElement(id) {
        const todoElement = document.querySelector(`[data-id="${id}"]`);
        if (todoElement) {
            todoElement.remove();
        }
    },

    /**
     * Agrega un nuevo elemento de tarea al DOM
     */
    addTodoElement(todo) {
        this.hideEmptyState();
        const todoElement = this.createTodoElement(todo);
        this.todosList.insertBefore(todoElement, this.todosList.firstChild);
    },

    /**
     * Escapa caracteres HTML para prevenir XSS
     */
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    },

    /**
     * Confirma una acción con el usuario
     */
    confirm(message) {
        return window.confirm(message);
    },

    /**
     * Muestra una alerta
     */
    alert(message) {
        window.alert(message);
    }
};
