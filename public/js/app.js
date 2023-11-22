JsBarcode(".barcode", '123456', {height: 40, displayValue: false}).init();

//Menu toggle

const toggle = document.getElementById('menu-toggle');
const sideBar = document.querySelector('.side-bar');
const main = document.querySelector('.main');

toggle.onclick = function() {
    sideBar.classList.toggle('menu-toggle-active');
    main.classList.toggle('menu-toggle-active');
}

function deleteUser(userId) {
    alert(`Deleting userid ${userId}`);
}

function editUser(userId) {
    alert(`Editing userid ${userId}`);
}