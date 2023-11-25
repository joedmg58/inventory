//Initialize JsBarCode
JsBarcode(".barcode", '123456', {height: 40, displayValue: false}).init();

//Initialize BS Tooltips
const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))

//Initialize toasts
const successToastEl = document.querySelector('#toast-success');
const successToast = successToastEl ? new bootstrap.Toast(successToastEl, {autohide: true, delay: 3000}) : null;

function successMessage(message) {
    const toastSuccessMessageEl = document.querySelector('#toast-success-message');
    toastSuccessMessageEl.innerHTML = message;
    successToast.show();
}

const errorToastEl = document.querySelector('#toast-error');
const errorToast = new bootstrap.Toast(errorToastEl, {autohide: true, delay: 3000});

function errorMessage(message) {
    const toastErrorMessageEl = document.querySelector('#toast-error-message');
    toastErrorMessageEl.innerHTML = message;
    errorToast.show();
}

//Menu toggle

const toggle = document.getElementById('menu-toggle');
const sideBar = document.querySelector('.side-bar');
const main = document.querySelector('.main');

toggle.onclick = function() {
    sideBar.classList.toggle('menu-toggle-active');
    main.classList.toggle('menu-toggle-active');
}

//Users
const newUserModal = new bootstrap.Modal( '#new-user-modal' );
const editUserModal = new bootstrap.Modal( '#edit-user-modal' );

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
    // alert(`Deleting userid ${userId}`);
    const deleteUserModal = new bootstrap.Modal( '#delete-user-modal' );
    deleteUserModal.show();
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
            console.log(error);
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