/**
 * API module - Maneja todas las comunicaciones con json-server
 */
const API = {
    BASE_URL: 'http://localhost:3000',
    
    /**
     * Obtiene todas las tareas
     */
    async getTodos() {
        try {
            const response = await fetch(`${this.BASE_URL}/todos`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching todos:', error);
            throw error;
        }
    },

    /**
     * Crea una nueva tarea
     */
    async createTodo(todoData) {
        try {
            const response = await fetch(`${this.BASE_URL}/todos`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(todoData)
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error creating todo:', error);
            throw error;
        }
    },

    /**
     * Actualiza una tarea existente
     */
    async updateTodo(id, todoData) {
        try {
            const response = await fetch(`${this.BASE_URL}/todos/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(todoData)
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error updating todo:', error);
            throw error;
        }
    },

    /**
     * Elimina una tarea
     */
    async deleteTodo(id) {
        try {
            const response = await fetch(`${this.BASE_URL}/todos/${id}`, {
                method: 'DELETE'
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            return true;
        } catch (error) {
            console.error('Error deleting todo:', error);
            throw error;
        }
    },

    /**
     * Verifica si la API está disponible
     */
    async isOnline() {
        try {
            const response = await fetch(`${this.BASE_URL}/todos`, {
                method: 'HEAD',
                mode: 'cors'
            });
            return response.ok;
        } catch (error) {
            return false;
        }
    }
};
