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
