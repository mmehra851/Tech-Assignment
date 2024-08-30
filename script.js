document.addEventListener('DOMContentLoaded', () => {
    const userTable = document.getElementById('userTable').getElementsByTagName('tbody')[0];
    const userFormModal = document.getElementById('userFormModal');
    const closeBtn = document.getElementsByClassName('close')[0];
    const addUserBtn = document.getElementById('addUserBtn');
    const userForm = document.getElementById('userForm');

    let users = [];

    // Fetch users from API
    const fetchUsers = () => {
        fetch('https://jsonplaceholder.typicode.com/users')
            .then(response => response.json())
            .then(data => {
                users = data;
                renderUsers();
            });
    };

    // Render users in the table
    const renderUsers = () => {
        userTable.innerHTML = '';
        users.forEach(user => {
            const row = userTable.insertRow();
            row.innerHTML = `
                <td>${user.id}</td>
                <td>${user.name}</td>
                <td>${user.username}</td>
                <td>${user.email}</td>
                <td>
                    <button class="edit-btn" data-id="${user.id}">Edit</button>
                    <button class="delete-btn" data-id="${user.id}">Delete</button>
                </td>
            `;
        });

        // Add event listeners to Edit and Delete buttons
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', openEditUserForm);
        });

        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', deleteUser);
        });
    };

    // Open Add User Form
    addUserBtn.addEventListener('click', () => {
        userForm.reset();
        document.getElementById('userId').value = '';
        userFormModal.style.display = 'block';
    });

    // Close the modal
    closeBtn.addEventListener('click', () => {
        userFormModal.style.display = 'none';
    });

    // Handle form submission for adding/editing a user
    userForm.addEventListener('submit', event => {
        event.preventDefault();
        const userId = document.getElementById('userId').value;
        const userData = {
            name: document.getElementById('name').value,
            username: document.getElementById('username').value,
            email: document.getElementById('email').value,
        };

        if (userId) {
            // Edit user
            fetch(`https://jsonplaceholder.typicode.com/users/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            })
            .then(response => response.json())
            .then(data => {
                users = users.map(user => user.id === parseInt(userId) ? data : user);
                renderUsers();
                userFormModal.style.display = 'none';
            });
        } else {
            // Add user
            fetch('https://jsonplaceholder.typicode.com/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            })
            .then(response => response.json())
            .then(data => {
                users.push(data);
                renderUsers();
                userFormModal.style.display = 'none';
            });
        }
    });

    // Open the Edit User Form
    const openEditUserForm = event => {
        const userId = event.target.getAttribute('data-id');
        const user = users.find(u => u.id == userId);

        document.getElementById('userId').value = user.id;
        document.getElementById('name').value = user.name;
        document.getElementById('username').value = user.username;
        document.getElementById('email').value = user.email;

        userFormModal.style.display = 'block';
    };

    // Delete user
    const deleteUser = event => {
        const userId = event.target.getAttribute('data-id');
        fetch(`https://jsonplaceholder.typicode.com/users/${userId}`, {
            method: 'DELETE'
        })
        .then(() => {
            users = users.filter(user => user.id !== parseInt(userId));
            renderUsers();
        });
    };

    // Fetch users when the page loads
    fetchUsers();
});
