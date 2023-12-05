//Users

const newUserModal = document.querySelector('#new-user-modal') ? new bootstrap.Modal( '#new-user-modal' ) : null;
const editUserModal = document.querySelector('#edit-user-modal') ? new bootstrap.Modal( '#edit-user-modal' ) : null;
const deleteUserModalEl = document.querySelector('#delete-user-modal');
const deleteUserModal = deleteUserModalEl ? new bootstrap.Modal( deleteUserModalEl ) : null;

const clearUsers = () => {
    const tableBody = document.querySelector('tbody');
    tableBody.innerHTML = '';
}

const fillTableUsers = (users) => {
    const tableBody = document.querySelector('tbody');

    users.forEach( (user, index) => {
        const row = document.createElement('tr');

        const col1 = document.createElement('td');
        col1.innerHTML = index + 1;

        const col2 = document.createElement('td');
        col2.innerHTML = user.name;

        const col3 = document.createElement('td');
        col3.innerHTML = user.email;

        const col4 = document.createElement('td');
        col4.classList.add('fs-5');

        const icon1 = document.createElement('i');
        icon1.classList.add('actions', 'text-primary', 'bi', 'bi-pencil-square');
        icon1.setAttribute('data-user-id', user.id);
        icon1.setAttribute('data-user-name', user.name);
        icon1.setAttribute('data-user-email', user.email);
        icon1.setAttribute('onclick', 'editUser(this)');

        const icon2 = document.createElement('i');
        icon2.classList.add('actions', 'text-danger', 'ms-2', 'bi', 'bi-trash');
        icon2.setAttribute('onclick', `deleteUser('${user.id}')`);


        col4.append(icon1, icon2);

        row.append(col1, col2, col3, col4);
        tableBody.appendChild(row);
    } );
}

function refreshUsers() {
    //disable the refresh button

    //fetch the request
    fetch('/api/users')
        .then( res => res.json())
        .then( data => {
            //clear old data
            clearUsers();
            //show new data
            fillTableUsers(data.data);
        })
        .catch(error => {
            console.log(error);
        })
}

function deleteUser(userId) {
    deleteUserModalEl.dataset.userId = userId;
    deleteUserModal.show();
}

function fetchDeleteUser() {
    userId = deleteUserModalEl.dataset.userId;
    console.log('deleting id', userId);
    deleteUserModal.hide();
    fetch('/api/users', {
        method: 'DELETE',
        body: JSON.stringify({userId: userId}),
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    })
        .then( res => res.json())
        .then( data => {
            if (data.code === 200) {
                refreshUsers();
                return successMessage(data.message)
            }
            else return errorMessage(data.error)
        })
        .catch(error => {
            errorMessage('Error creating new user.')
        })
}

function editUser(e) {
    const user = {
        id: e.dataset.userId,
        name: e.dataset.userName,
        email: e.dataset.userEmail
    }

    const editUserEl = document.querySelector('#edit-user-form');
    editUserEl.dataset.userId = user.id;
    const editUserNameEl = document.querySelector('#edit-user-name');
    editUserNameEl.value = user.name;
    const editUserEmailEl = document.querySelector('#edit-user-email');
    editUserEmailEl.value = user.email;

    
    editUserModal.show();
}

function fetchEditUser(e) {
    e.preventDefault();

    // const editUserEl = document.querySelector('#edit-user');
    // console.log(editUserEl.dataset.userId);

    editUserModal.hide();

    console.log('hidding editUserModal')
}

function addUser() {
    newUserModal.show();
}

function fetchNewUser(e) {
    e.preventDefault();
    //Get data from the form and convert to JSON format
    const newUserForm = e.currentTarget;
    const formData = new FormData(newUserForm);
    const plainFormData = Object.fromEntries(formData.entries());
	const formDataJsonString = JSON.stringify(plainFormData);

    //fetch the request
    fetch('/api/users', {
        method: 'POST',
        body: formDataJsonString,
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    })
        .then( res => res.json())
        .then( data => {
            //Add new user in the table
            const message = data.message;
            successMessage(message);
            const user = data.data;
            addTableUser(user);
        })
        .catch(error => {
            errorMessage('Error creating new user.')
        })

    newUserModal.hide();
}

function addTableUser(user) {
    const tableBody = document.querySelector('tbody');

    const row = document.createElement('tr');

        const col1 = document.createElement('td');
        col1.innerHTML = tableBody.childNodes.length;

        const col2 = document.createElement('td');
        col2.innerHTML = user.name;

        const col3 = document.createElement('td');
        col3.innerHTML = user.email;

        const col4 = document.createElement('td');
        col4.classList.add('fs-5');

        const icon1 = document.createElement('i');
        icon1.classList.add('actions', 'text-primary', 'bi', 'bi-pencil-square');
        icon1.setAttribute('data-user-id', user.id);
        icon1.setAttribute('data-user-name', user.name);
        icon1.setAttribute('data-user-email', user.email);
        icon1.setAttribute('onclick', 'editUser(this)');

        const icon2 = document.createElement('i');
        icon2.classList.add('actions', 'text-danger', 'ms-2', 'bi', 'bi-trash');
        icon2.setAttribute('onclick', `deleteUser('${user.id}')`);


        col4.append(icon1, icon2);

        row.append(col1, col2, col3, col4);
        tableBody.appendChild(row);
}