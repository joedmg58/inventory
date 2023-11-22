//Initialize JsBarCode
JsBarcode(".barcode", '123456', {height: 40, displayValue: false}).init();

//Initialize BS Tooltips
const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))

//Menu toggle

const toggle = document.getElementById('menu-toggle');
const sideBar = document.querySelector('.side-bar');
const main = document.querySelector('.main');

toggle.onclick = function() {
    sideBar.classList.toggle('menu-toggle-active');
    main.classList.toggle('menu-toggle-active');
}

//Users

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

    const editUserEl = document.querySelector('#edit-user');
    editUserEl.dataset.userId = user.id;
    const editUserNameEl = document.querySelector('#edit-user-name');
    editUserNameEl.value = user.name;
    const editUserEmailEl = document.querySelector('#edit-user-email');
    editUserEmailEl.value = user.email;

    const editUserModal = new bootstrap.Modal( '#edit-user-modal' );
    editUserModal.show();
}

function fetchEditUser(e) {
    e.preventDefault();

    const editUserModal = new bootstrap.Modal( '#edit-user-modal' );
    editUserModal.close();

    const editUserEl = document.querySelector('#edit-user');
    console.log(editUserEl.dataset.userId);
}