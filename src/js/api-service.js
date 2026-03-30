class PortfolioAPI {
    constructor() {
        this.API_URL = 'http://localhost:5000/api';
        this.token = localStorage.getItem('adminToken');
    }

    async getData() {
        try {
            const response = await fetch(`${this.API_URL}/portfolio`);
            return await response.json();
        } catch (error) {
            console.error('Error:', error);
            return this.getDefaultData();
        }
    }

    async updateData(data) {
        const response = await fetch(`${this.API_URL}/portfolio`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token': this.token
            },
            body: JSON.stringify(data)
        });
        return await response.json();
    }

    async uploadImage(file) {
        const formData = new FormData();
        formData.append('image', file);
        
        const response = await fetch(`${this.API_URL}/portfolio/upload`, {
            method: 'POST',
            headers: { 'x-auth-token': this.token },
            body: formData
        });
        return await response.json();
    }

    // Navigation methods
    async getNavigation() {
        const data = await this.getData();
        return data.navigation || [];
    }

    async updateNavigation(navigation) {
        const response = await fetch(`${this.API_URL}/portfolio/navigation`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token': this.token
            },
            body: JSON.stringify(navigation)
        });
        return await response.json();
    }

    async addNavigationItem(item) {
        const response = await fetch(`${this.API_URL}/portfolio/navigation`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token': this.token
            },
            body: JSON.stringify(item)
        });
        return await response.json();
    }

    async deleteNavigationItem(index) {
        const response = await fetch(`${this.API_URL}/portfolio/navigation/${index}`, {
            method: 'DELETE',
            headers: { 'x-auth-token': this.token }
        });
        return await response.json();
    }

    // Project methods
    async addProject(project) {
        const response = await fetch(`${this.API_URL}/portfolio/projects`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token': this.token
            },
            body: JSON.stringify(project)
        });
        return await response.json();
    }

    async deleteProject(id) {
        const response = await fetch(`${this.API_URL}/portfolio/projects/${id}`, {
            method: 'DELETE',
            headers: { 'x-auth-token': this.token }
        });
        return await response.json();
    }

    // ... other methods similarly
}

window.portfolioAPI = new PortfolioAPI();