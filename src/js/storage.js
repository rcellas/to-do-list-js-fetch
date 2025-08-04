/**
 * Storage module - Maneja localStorage como respaldo
 */
const Storage = {
    STORAGE_KEY: 'simple-todo-list',
    
    /**
     * Guarda las tareas en localStorage
     */
    saveTodos(todos) {
        try {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(todos));
            return true;
        } catch (error) {
            console.error('Error saving to localStorage:', error);
            return false;
        }
    },

    /**
     * Carga las tareas desde localStorage
     */
    loadTodos() {
        try {
            const stored = localStorage.getItem(this.STORAGE_KEY);
            return stored ? JSON.parse(stored) : [];
        } catch (error) {
            console.error('Error loading from localStorage:', error);
            return [];
        }
    },

    /**
     * Limpia todas las tareas de localStorage
     */
    clearTodos() {
        try {
            localStorage.removeItem(this.STORAGE_KEY);
            return true;
        } catch (error) {
            console.error('Error clearing localStorage:', error);
            return false;
        }
    },

    /**
     * Verifica si localStorage está disponible
     */
    isAvailable() {
        try {
            const test = 'test';
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
            return true;
        } catch (error) {
            return false;
        }
    },

    /**
     * Obtiene una tarea específica por ID
     */
    getTodoById(id) {
        const todos = this.loadTodos();
        return todos.find(todo => todo.id === id);
    },

    /**
     * Actualiza una tarea específica en localStorage
     */
    updateTodo(id, updatedTodo) {
        const todos = this.loadTodos();
        const index = todos.findIndex(todo => todo.id === id);
        
        if (index !== -1) {
            todos[index] = { ...todos[index], ...updatedTodo };
            return this.saveTodos(todos);
        }
        
        return false;
    },

    /**
     * Elimina una tarea específica de localStorage
     */
    deleteTodo(id) {
        const todos = this.loadTodos();
        const filteredTodos = todos.filter(todo => todo.id !== id);
        return this.saveTodos(filteredTodos);
    },

    /**
     * Agrega una nueva tarea a localStorage
     */
    addTodo(todo) {
        const todos = this.loadTodos();
        todos.push(todo);
        return this.saveTodos(todos);
    }
};
