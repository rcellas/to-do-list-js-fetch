/**
 * Main App module - Controlador principal de la aplicación
 */
class TodoApp {
    constructor() {
        this.todos = [];
        this.isOnline = false;
        this.init();
    }

    /**
     * Inicializa la aplicación
     */
    async init() {
        UI.init();
        this.bindEvents();
        await this.loadTodos();
    }

    /**
     * Vincula eventos del DOM
     */
    bindEvents() {
        // Formulario de nueva tarea
        UI.todoForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleAddTodo();
        });

        // Eventos de la lista de tareas (delegación de eventos)
        UI.todosList.addEventListener('click', (e) => {
            const id = e.target.dataset.id;
            if (!id) return;

            if (e.target.classList.contains('toggle-btn')) {
                this.handleToggleTodo(id);
            } else if (e.target.classList.contains('delete-btn')) {
                this.handleDeleteTodo(id);
            }
        });

        // Cerrar notificaciones al hacer click
        UI.notification.addEventListener('click', () => {
            UI.hideNotification();
        });
    }

    /**
     * Carga todas las tareas
     */
    async loadTodos() {
        UI.showLoading();
        
        try {
            // Verificar si estamos online
            this.isOnline = await API.isOnline();
            
            if (this.isOnline) {
                // Cargar desde API
                this.todos = await API.getTodos();
                // Sincronizar con localStorage
                Storage.saveTodos(this.todos);
                UI.showNotification('Datos cargados desde el servidor', 'success');
            } else {
                // Cargar desde localStorage como respaldo
                this.todos = Storage.loadTodos();
                UI.showNotification('Modo offline - Datos cargados localmente', 'info');
            }
        } catch (error) {
            console.error('Error loading todos:', error);
            // Fallback a localStorage
            this.todos = Storage.loadTodos();
            UI.showNotification('Error del servidor - Datos cargados localmente', 'error');
        }
        
        UI.renderTodos(this.todos);
    }

    /**
     * Maneja la adición de una nueva tarea
     */
    async handleAddTodo() {
        const title = UI.getInputValue();
        
        if (!title) {
            UI.showNotification('Por favor, ingresa una tarea', 'error');
            return;
        }

        const newTodo = {
            id: this.generateId(),
            title: title,
            completed: false,
            createdAt: new Date().toISOString()
        };

        try {
            if (this.isOnline) {
                // Intentar crear en API
                const createdTodo = await API.createTodo(newTodo);
                this.todos.unshift(createdTodo);
                // Sincronizar con localStorage
                Storage.saveTodos(this.todos);
                UI.showNotification('Tarea agregada exitosamente', 'success');
            } else {
                // Agregar solo localmente
                this.todos.unshift(newTodo);
                Storage.addTodo(newTodo);
                UI.showNotification('Tarea agregada localmente', 'info');
            }
            
            UI.addTodoElement(newTodo);
            UI.updateStats(this.todos);
            UI.clearForm();
            
        } catch (error) {
            console.error('Error adding todo:', error);
            // Fallback a localStorage
            this.todos.unshift(newTodo);
            Storage.addTodo(newTodo);
            UI.addTodoElement(newTodo);
            UI.updateStats(this.todos);
            UI.clearForm();
            UI.showNotification('Tarea agregada localmente (sin conexión)', 'info');
        }
    }

    /**
     * Maneja el toggle de completado de una tarea
     */
    async handleToggleTodo(id) {
        const todo = this.todos.find(t => t.id === parseInt(id));
        if (!todo) return;

        const updatedTodo = {
            ...todo,
            completed: !todo.completed,
            updatedAt: new Date().toISOString()
        };

        try {
            if (this.isOnline) {
                // Intentar actualizar en API
                await API.updateTodo(id, updatedTodo);
                UI.showNotification('Tarea actualizada exitosamente', 'success');
            } else {
                UI.showNotification('Tarea actualizada localmente', 'info');
            }
            
            // Actualizar localmente
            const index = this.todos.findIndex(t => t.id === parseInt(id));
            this.todos[index] = updatedTodo;
            Storage.saveTodos(this.todos);
            
            UI.updateTodoElement(updatedTodo);
            UI.updateStats(this.todos);
            
        } catch (error) {
            console.error('Error updating todo:', error);
            // Fallback a localStorage
            const index = this.todos.findIndex(t => t.id === parseInt(id));
            this.todos[index] = updatedTodo;
            Storage.updateTodo(parseInt(id), updatedTodo);
            UI.updateTodoElement(updatedTodo);
            UI.updateStats(this.todos);
            UI.showNotification('Tarea actualizada localmente (sin conexión)', 'info');
        }
    }

    /**
     * Maneja la eliminación de una tarea
     */
    async handleDeleteTodo(id) {
        if (!UI.confirm('¿Estás seguro de que quieres eliminar esta tarea?')) {
            return;
        }

        try {
            if (this.isOnline) {
                // Intentar eliminar de API
                await API.deleteTodo(id);
                UI.showNotification('Tarea eliminada exitosamente', 'success');
            } else {
                UI.showNotification('Tarea eliminada localmente', 'info');
            }
            
            // Eliminar localmente
            this.todos = this.todos.filter(t => t.id !== parseInt(id));
            Storage.saveTodos(this.todos);
            
            UI.removeTodoElement(id);
            UI.updateStats(this.todos);
            
            // Mostrar estado vacío si no hay tareas
            if (this.todos.length === 0) {
                UI.showEmptyState();
            }
            
        } catch (error) {
            console.error('Error deleting todo:', error);
            // Fallback a localStorage
            this.todos = this.todos.filter(t => t.id !== parseInt(id));
            Storage.deleteTodo(parseInt(id));
            UI.removeTodoElement(id);
            UI.updateStats(this.todos);
            
            if (this.todos.length === 0) {
                UI.showEmptyState();
            }
            
            UI.showNotification('Tarea eliminada localmente (sin conexión)', 'info');
        }
    }

    /**
     * Genera un ID único para nuevas tareas
     */
    generateId() {
        return Date.now() + Math.floor(Math.random() * 1000);
    }

    /**
     * Sincroniza datos locales con el servidor
     */
    async syncWithServer() {
        if (!this.isOnline) return;

        try {
            const serverTodos = await API.getTodos();
            const localTodos = Storage.loadTodos();
            
            // Lógica de sincronización simple
            // En una aplicación real, esto sería más complejo
            this.todos = serverTodos;
            Storage.saveTodos(this.todos);
            UI.renderTodos(this.todos);
            UI.showNotification('Datos sincronizados con el servidor', 'success');
        } catch (error) {
            console.error('Error syncing with server:', error);
        }
    }
}

// Inicializar la aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.todoApp = new TodoApp();
    
    // Verificar conexión periódicamente
    setInterval(async () => {
        if (window.todoApp) {
            const wasOnline = window.todoApp.isOnline;
            window.todoApp.isOnline = await API.isOnline();
            
            // Si recuperamos la conexión, sincronizar
            if (!wasOnline && window.todoApp.isOnline) {
                UI.showNotification('Conexión restaurada - Sincronizando...', 'info');
                await window.todoApp.syncWithServer();
            }
        }
    }, 30000); // Verificar cada 30 segundos
});