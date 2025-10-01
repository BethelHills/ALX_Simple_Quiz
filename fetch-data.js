// API endpoints
const API_ENDPOINTS = {
    users: 'https://jsonplaceholder.typicode.com/users',
    posts: 'https://jsonplaceholder.typicode.com/posts',
    comments: 'https://jsonplaceholder.typicode.com/comments'
};

// DOM elements
const loadingElement = document.getElementById('loading');
const dataTitle = document.getElementById('data-title');
const dataContent = document.getElementById('data-content');
const errorElement = document.getElementById('error');
const errorMessage = document.getElementById('error-message');

// Button elements
const fetchUsersBtn = document.getElementById('fetch-users');
const fetchPostsBtn = document.getElementById('fetch-posts');
const fetchCommentsBtn = document.getElementById('fetch-comments');
const clearDataBtn = document.getElementById('clear-data');

// Show loading state
function showLoading() {
    loadingElement.style.display = 'block';
    errorElement.style.display = 'none';
}

// Hide loading state
function hideLoading() {
    loadingElement.style.display = 'none';
}

// Show error message
function showError(message) {
    errorElement.style.display = 'block';
    errorMessage.textContent = message;
    hideLoading();
}

// Hide error message
function hideError() {
    errorElement.style.display = 'none';
}

// Fetch data from API
async function fetchData(url, dataType) {
    try {
        showLoading();
        hideError();
        
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        displayData(data, dataType);
        
    } catch (error) {
        console.error('Error fetching data:', error);
        showError(`Failed to fetch ${dataType}: ${error.message}`);
    } finally {
        hideLoading();
    }
}

// Display fetched data
function displayData(data, dataType) {
    dataTitle.textContent = `${dataType.charAt(0).toUpperCase() + dataType.slice(1)} (${data.length} items)`;
    
    if (data.length === 0) {
        dataContent.innerHTML = '<p class="placeholder">No data available.</p>';
        return;
    }
    
    let html = '<div class="data-grid">';
    
    data.forEach((item, index) => {
        html += createDataCard(item, dataType, index);
    });
    
    html += '</div>';
    dataContent.innerHTML = html;
}

// Create data card based on data type
function createDataCard(item, dataType, index) {
    let cardHtml = '<div class="data-card">';
    cardHtml += `<span class="id">ID: ${item.id || index + 1}</span>`;
    
    switch (dataType) {
        case 'users':
            cardHtml += `
                <h3>${item.name}</h3>
                <p><strong>Username:</strong> ${item.username}</p>
                <p><strong>Email:</strong> ${item.email}</p>
                <p><strong>Phone:</strong> ${item.phone}</p>
                <p><strong>Website:</strong> ${item.website}</p>
                <p><strong>Company:</strong> ${item.company.name}</p>
                <p><strong>Address:</strong> ${item.address.street}, ${item.address.city}, ${item.address.zipcode}</p>
            `;
            break;
            
        case 'posts':
            cardHtml += `
                <h3>${item.title}</h3>
                <p><strong>User ID:</strong> ${item.userId}</p>
                <p><strong>Body:</strong> ${item.body}</p>
            `;
            break;
            
        case 'comments':
            cardHtml += `
                <h3>Comment</h3>
                <p><strong>Post ID:</strong> ${item.postId}</p>
                <p><strong>Name:</strong> ${item.name}</p>
                <p><strong>Email:</strong> ${item.email}</p>
                <p><strong>Body:</strong> ${item.body}</p>
            `;
            break;
    }
    
    cardHtml += '</div>';
    return cardHtml;
}

// Clear all data
function clearData() {
    dataTitle.textContent = 'Select a data type to fetch';
    dataContent.innerHTML = '<p class="placeholder">Click one of the buttons above to fetch data from the API.</p>';
    hideError();
}

// Event listeners
fetchUsersBtn.addEventListener('click', () => {
    fetchData(API_ENDPOINTS.users, 'users');
});

fetchPostsBtn.addEventListener('click', () => {
    fetchData(API_ENDPOINTS.posts, 'posts');
});

fetchCommentsBtn.addEventListener('click', () => {
    fetchData(API_ENDPOINTS.comments, 'comments');
});

clearDataBtn.addEventListener('click', clearData);

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    console.log('Data Fetcher application loaded');
    
    // Add keyboard shortcuts
    document.addEventListener('keydown', function(event) {
        if (event.ctrlKey || event.metaKey) {
            switch(event.key) {
                case '1':
                    event.preventDefault();
                    fetchUsersBtn.click();
                    break;
                case '2':
                    event.preventDefault();
                    fetchPostsBtn.click();
                    break;
                case '3':
                    event.preventDefault();
                    fetchCommentsBtn.click();
                    break;
                case 'c':
                    event.preventDefault();
                    clearDataBtn.click();
                    break;
            }
        }
    });
});

// Add some utility functions for data manipulation
const DataUtils = {
    // Filter data by search term
    filterData: function(data, searchTerm, fields) {
        if (!searchTerm) return data;
        
        return data.filter(item => {
            return fields.some(field => {
                const value = this.getNestedValue(item, field);
                return value && value.toString().toLowerCase().includes(searchTerm.toLowerCase());
            });
        });
    },
    
    // Get nested object value using dot notation
    getNestedValue: function(obj, path) {
        return path.split('.').reduce((current, key) => current && current[key], obj);
    },
    
    // Sort data by field
    sortData: function(data, field, ascending = true) {
        return data.sort((a, b) => {
            const aVal = this.getNestedValue(a, field);
            const bVal = this.getNestedValue(b, field);
            
            if (aVal < bVal) return ascending ? -1 : 1;
            if (aVal > bVal) return ascending ? 1 : -1;
            return 0;
        });
    }
};

// Export for potential module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { fetchData, DataUtils };
}
