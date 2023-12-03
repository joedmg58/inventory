console.log('app.js loaded');

//Initialize JsBarCode
if (document.querySelector('.barcode') != null)
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

if(toggle !=null) {
    toggle.onclick = function() {
        sideBar.classList.toggle('menu-toggle-active');
        main.classList.toggle('menu-toggle-active');
    }
}

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

// Attributes

let attributeSelected = {};

const trTableAttributeList = document.querySelectorAll('#table-attributes tr');
const attributeSelectedEl = document.querySelector('#attribute-selected');

function activateAttribute() {
    trTableAttributeList.forEach( item => item.classList.remove('selected'));
    this.classList.add('selected');
    attributeSelected = {
        id: this.dataset.attrId,
        name: this.dataset.attrName
    }
    attributeSelectedEl.innerHTML = `Values of attribute: ${attributeSelected.name}`;
    refreshAttrValues();
}

if (trTableAttributeList) trTableAttributeList.forEach( item => item.addEventListener('click', activateAttribute));

function refreshAttrValues() {
    //disable the refresh button

    if (attributeSelected) {
        //fetch the request
        fetch(`/api/attribute-values?id=${attributeSelected.id}`)
            .then( res => res.json())
            .then( data => {
                //clear old data
                clearAttributeValues();
                //show new data
                fillTableAttributeValues(data.data);
            })
            .catch(error => {
                console.log(error);
            })
    }
    
}

function clearAttributeValues() {
    const tableBody = document.querySelector('#table-attributes-values').querySelector('tbody');
    tableBody.innerHTML = '';
}

function fillTableAttributeValues(items) {
    if (items) {
        const tableBody = document.querySelector('#table-attributes-values').querySelector('tbody');
        items.forEach( (item, index) => {
            const row = document.createElement('tr'); 
            
            const col1 = document.createElement('td');
            col1.innerHTML = index + 1;
            
            const col2 = document.createElement('td');
            col2.innerHTML = item.value;
            
            const col3 = document.createElement('td');
            col3.innerHTML = '';

            const col4 = document.createElement('td');
            col4.classList.add('fs-5');

            const icon1 = document.createElement('i');
            icon1.classList.add('actions', 'text-primary', 'bi', 'bi-pencil-square');
            icon1.setAttribute('data-attr-value-id', item.id);
            icon1.setAttribute('data-attr-value-value', item.value);
            icon1.setAttribute('onclick', 'editAttrValue(this)');

            const icon2 = document.createElement('i');
            icon2.classList.add('actions', 'text-danger', 'ms-2', 'bi', 'bi-trash');
            icon2.setAttribute('onclick', `delAttrValue('${item.id}')`);


            col4.append(icon1, icon2);
            
            row.append(col1, col2, col3, col4);
            tableBody.appendChild(row);
        });
    } 
}

function addAttribute() {
    document.querySelector('#btn-add-attr').disabled = true;

    const tableBody = document.querySelector('#table-attributes').querySelector('tbody');
    const rowCount = tableBody.querySelectorAll('tr').length;
    const row = document.createElement('tr'); 
    row.setAttribute('id', 'new-attr-row');
    
    const col1 = document.createElement('td');
    col1.innerHTML = rowCount + 1;
    
    const col2 = document.createElement('td');
    const formFloating1 = document.createElement('div');
    formFloating1.classList.add('form-floating');
    const input1 = document.createElement('input');
    input1.classList.add('form-control');
    input1.setAttribute('type', 'text');
    input1.setAttribute('id', 'input-attribute');
    input1.setAttribute('name', 'attribute');
    input1.setAttribute('placeholder', 'Attribute name');
    const label1 = document.createElement('label');
    label1.setAttribute('for', 'input-attribute');
    label1.innerHTML='Attribute name';
    formFloating1.append(input1, label1);
    col2.appendChild(formFloating1);

    const col3 = document.createElement('td');
    col3.classList.add('fs-5');
    const icon1 = document.createElement('i');
    icon1.classList.add('actions', 'text-primary', 'bi', 'bi-check2');
    // icon1.setAttribute('data-attr-value-id', item.id);
    // icon1.setAttribute('data-attr-value-value', item.value);
    icon1.setAttribute('onclick', 'newAttribute()');
    const icon2 = document.createElement('i');
    icon2.classList.add('actions', 'text-danger', 'ms-2', 'bi', 'bi-x-circle');
    icon2.setAttribute('onclick', 'cancelNewAttribute()');
    col3.append(icon1, icon2);
    
    row.append(col1, col2, col3);
    tableBody.appendChild(row);

    input1.focus();
}

function cancelNewAttribute() {
    const newRow = document.querySelector('#new-attr-row');
    newRow.remove();
    document.querySelector('#btn-add-attr').disabled = false;
}

function newAttribute() {
    //Get data from the form and convert to JSON format
    const newAttrForm = document.querySelector('#form-attributes');
    const formData = new FormData(newAttrForm);
    const plainFormData = Object.fromEntries(formData.entries());
    const formDataJsonString = JSON.stringify(plainFormData);

    //fetch the request
    fetch('/api/attributes', {
        method: 'POST',
        body: formDataJsonString,
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    })
        .then( res => res.json())
        .then( data => {
            //Add new attribute in the table
            const message = data.message;
            successMessage(message);
            const attr = data.data;
            addTableAttr(attr);
        })
        .catch(error => {
            errorMessage('Error creating new attribute.')
        })
}

function addTableAttr(attr) {

}
