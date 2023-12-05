// Attributes

let attributeSelected = {};

//if (trTableAttributeList) trTableAttributeList.forEach( item => item.addEventListener('click', activateAttribute));

const attributeSelectedEl = document.querySelector('#attribute-selected');

function activateAttribute(el) {
    const trTableAttributeList = document.querySelectorAll('#table-attributes tr');
    trTableAttributeList.forEach( item => item.classList.remove('selected'));
    el.classList.add('selected');
    attributeSelected = {
        id: el.dataset.attrId,
        name: el.dataset.attrName
    }
    attributeSelectedEl.innerHTML = `Values of attribute: ${attributeSelected.name}`;
    refreshAttrValues();
}


function refreshAttrValues() {
    //disable the refresh button

    if (attributeSelected.name) {
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
    } else {
        clearAttributeValues();
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
            row.setAttribute('onclick', 'activateAttribute(this)');
            row.setAttribute('data-attr-value-id', item.id);
            row.setAttribute('data-attr-value-value', item.value);
            row.setAttribute('data-attr-index', index+1);
            
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
            icon1.setAttribute('onclick', 'editAttrValue(this)');

            const icon2 = document.createElement('i');
            icon2.classList.add('actions', 'text-danger', 'ms-2', 'bi', 'bi-trash');
            icon2.setAttribute('onclick', `delAttrValue(this)`);


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
            const code = data.code;

            if (code === 200) {
                successMessage(message);
                const attr = data.data;

                cancelNewAttribute();

                addTableAttr(attr);
            } else {
                errorMessage(message);
            }
            
        })
        .catch(error => {
            errorMessage('Error creating new attribute.');
        })
}

function clearTableAttributes() {
    const tableBody = document.querySelector('#table-attributes').querySelector('tbody');
    tableBody.innerHTML = '';
}

function addTableAttr(attr) {
    const tableBody = document.querySelector('#table-attributes').querySelector('tbody');
    const rowCount = tableBody.querySelectorAll('tr').length;
    const row = document.createElement('tr'); 
    row.setAttribute('onclick', 'activateAttribute(this)');
    row.setAttribute('data-attr-id', attr.id);
    row.setAttribute('data-attr-name', attr.name);
    row.setAttribute('data-attr-index', rowCount + 1);
    
    const col1 = document.createElement('td');
    col1.innerHTML = rowCount + 1;
    
    const col2 = document.createElement('td');
    col2.innerHTML = attr.name;
    
    const col3 = document.createElement('td');
    col3.classList.add('fs-5');
    const icon1 = document.createElement('i');
    icon1.classList.add('actions', 'text-primary', 'bi', 'bi-pencil-square');
    icon1.setAttribute('onclick', 'editAttribute(event, this)');
    const icon2 = document.createElement('i');
    icon2.classList.add('actions', 'text-danger', 'ms-2', 'bi', 'bi-trash');
    icon2.setAttribute('onclick', `deleteAttribute(event, this)`);
    col3.append(icon1, icon2);
    
    row.append(col1, col2, col3);
    tableBody.appendChild(row);
}

function refreshAttributes() {
    fetch('/api/attributes', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    })
        .then( res => res.json())
        .then( data => {
            if (data.code === 200){
                clearTableAttributes();
                data.data.forEach( attribute => addTableAttr(attribute) );
            }
        })
        .catch(error => {
            errorMessage('Error refreshing attributes.');
        })
}

let editInProgress = false;

function editAttribute(event, el) {
    event.stopPropagation();

    if (editInProgress) return; 
    else editInProgress = true;

    const tableRow = el.parentElement.parentElement;
    tableRow.innerHTML = '';

    const attribute = { 
        index: tableRow.dataset.attrIndex,
        id: tableRow.dataset.attrId,
        name: tableRow.dataset.attrName
    }

    const col1 = document.createElement('td');
    col1.innerHTML = attribute.index;

    const col2 = document.createElement('td');
    const formFloating1 = document.createElement('div');
    formFloating1.classList.add('form-floating');
    const input1 = document.createElement('input');
    input1.classList.add('form-control');
    input1.setAttribute('type', 'text');
    input1.setAttribute('id', 'input-attribute');
    input1.setAttribute('name', 'attribute');
    input1.setAttribute('placeholder', 'Attribute name');
    input1.value = attribute.name;
    const label1 = document.createElement('label');
    label1.setAttribute('for', 'input-attribute');
    label1.innerHTML='Attribute name';
    formFloating1.append(input1, label1);
    col2.appendChild(formFloating1);

    const col3 = document.createElement('td');
    col3.classList.add('fs-5');
    const icon1 = document.createElement('i');
    icon1.classList.add('actions', 'text-primary', 'bi', 'bi-check2');
    icon1.setAttribute('onclick', 'fetchEditAttribute(event, this)');
    const icon2 = document.createElement('i');
    icon2.classList.add('actions', 'text-danger', 'ms-2', 'bi', 'bi-x-circle');
    icon2.setAttribute('onclick', 'cancelEditAttribute(this)');
    col3.append(icon1, icon2);

    tableRow.append(col1, col2, col3);
    input1.focus();
}

function cancelEditAttribute(el) {
    editInProgress = false;

    const tableRow = el.parentElement.parentElement;
    tableRow.innerHTML = '';

    const attribute = { 
        index: tableRow.dataset.attrIndex,
        id: tableRow.dataset.attrId,
        name: tableRow.dataset.attrName
    }
    
    const col1 = document.createElement('td');
    col1.innerHTML = attribute.index;
    
    const col2 = document.createElement('td');
    col2.innerHTML = attribute.name;
    
    const col3 = document.createElement('td');
    col3.classList.add('fs-5');
    const icon1 = document.createElement('i');
    icon1.classList.add('actions', 'text-primary', 'bi', 'bi-pencil-square');
    icon1.setAttribute('onclick', 'editAttribute(event, this)');
    const icon2 = document.createElement('i');
    icon2.classList.add('actions', 'text-danger', 'ms-2', 'bi', 'bi-trash');
    icon2.setAttribute('onclick', `deleteAttribute(event, this)`);
    col3.append(icon1, icon2);
    
    tableRow.append(col1, col2, col3);
}

function fetchEditAttribute(event, el) {
    event.stopPropagation();

    const tableRow = el.parentElement.parentElement;
    const attrId = tableRow.dataset.attrId;

    //Get data from the form and convert to JSON format
    const newAttrForm = document.querySelector('#form-attributes');
    const formData = new FormData(newAttrForm);
    formData.append('id', attrId);
    const plainFormData = Object.fromEntries(formData.entries());
    const formDataJsonString = JSON.stringify(plainFormData);

    //fecth new value to API
    fetch('/api/attributes', {
        method: 'PUT',
        body: formDataJsonString,
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    })
        .then( res => res.json())
        .then( data => {
            if (data.code === 200){
               //update the value set new value to dataset on the element
               tableRow.dataset.attrName = formData.get('attribute');
            }
        })
        .catch(error => {
            errorMessage('Error modifying attributes.');
        })
        .finally( () => {
            cancelEditAttribute(el);
        })
    
}

function deleteAttribute(event, el) {
    event.stopPropagation();

    const tableRow = el.parentElement.parentElement;

    const attribute = { 
        index: tableRow.dataset.attrIndex,
        id: tableRow.dataset.attrId,
        name: tableRow.dataset.attrName
    }

    if (window.confirm(`Do you want to delete the attribute named\n${attribute.name}`)) {
        //fetch to API
        fetch('/api/attributes', {
            method: 'DELETE',
            body: JSON.stringify(attribute),
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        })
            .then( res => res.json())
            .then( data => {
                if (data.code === 200){
                    tableRow.remove();

                    if (attributeSelected.name === attribute.name) {
                        attributeSelected = {};
                        attributeSelectedEl.innerHTML = '[No attribute selected]';
                        refreshAttrValues();
                    }
                }
            })
            .catch(error => {
                errorMessage('Error deleting attributes.');
            })

    }
}

// =============== Attribute Values ===========================

function newAttrValRow() {
    const tr = document.createElement('tr');
}

function newAttrVal() {
    const tableBody = document.querySelector('#table-attributes-values tbody')
}