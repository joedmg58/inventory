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

//Form elements

const createFormFloatingInputEl = (id, type, name, labelTxt) => {
    const formFloating = document.createElement('div');
    formFloating.classList.add('form-floating');

    const input = document.createElement('input');
    input.classList.add('form-control');
    input.setAttribute('type', type);
    input.setAttribute('id', id);
    input.setAttribute('name', name);
    input.setAttribute('placeholder', labelTxt);

    const label = document.createElement('label');
    label.setAttribute('for', id);
    label.innerHTML= labelTxt;

    formFloating.append(input, label);
    return formFloating;
}

const createTableRowWithFields = (index, object, editFunc, delFunc) => {
    const tr = document.createElement('tr');

    const col1 = document.createElement('td');
    col1.innerHTML = index;
    tr.appendChild(col1);

    console.log(object);

    for ( const [key, value] of Object.entries(object)) {
        console.log(key, value);
        let td = document.createElement('td');
        td.innerHTML = value;
        tr.appendChild( td );
    }

    coln = document.createElement('td');
    coln.classList.add('fs-5');

    const icon1 = document.createElement('i');
    icon1.classList.add('actions', 'text-primary', 'bi', 'bi-pencil-square');
    icon1.setAttribute('onclick', editFunc);

    const icon2 = document.createElement('i');
    icon2.classList.add('actions', 'text-danger', 'ms-2', 'bi', 'bi-trash');
    icon2.setAttribute('onclick', delFunc);

    coln.append(icon1, icon2);

    tr.appendChild(coln);

    return tr;
}


