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
            row.setAttribute('data-attr-value-id', item.id);
            row.setAttribute('data-attr-value-value', item.value);
            row.setAttribute('data-attr-value-index', index+1);
            
            const col1 = document.createElement('td');
            col1.innerHTML = index + 1;
            
            const col2 = document.createElement('td');
            col2.innerHTML = item.value;
            
            const col3 = document.createElement('td');
            col3.classList.add('fs-5');

            const icon1 = document.createElement('i');
            icon1.classList.add('actions', 'text-primary', 'bi', 'bi-pencil-square');
            icon1.setAttribute('onclick', 'editAttrValue(this)');

            const icon2 = document.createElement('i');
            icon2.classList.add('actions', 'text-danger', 'ms-2', 'bi', 'bi-trash');
            icon2.setAttribute('onclick', `delAttrValue(this)`);

            col3.append(icon1, icon2);
            
            row.append(col1, col2, col3);
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

var attrValueEditing = false;

function newAttrValRow(tblBody) {
    const rowCount = tblBody.querySelectorAll('tr').length;
    const tr = document.createElement('tr');
    tr.dataset.attrValueIndex = rowCount + 1;

    const td1 = document.createElement('td');
    td1.innerHTML = rowCount + 1;

    const td2 = document.createElement('td');

    const div = document.createElement('div');
    div.classList.add('form-floating');

    const input = document.createElement('input');
    input.classList.add('form-control');
    input.setAttribute('type', 'text');
    input.setAttribute('id', 'input-attribute-value');
    input.setAttribute('name', 'value');
    input.setAttribute('placeholder', 'Attribute value');

    const label = document.createElement('label');
    label.setAttribute('for', 'input-attribute-value');
    label.innerHTML='Attribute value';

    div.append(input, label);
    td2.appendChild(div);

    const td3 = document.createElement('td');
    td3.classList.add('fs-5');
    const i1 = document.createElement('i');
    i1.classList.add('actions', 'text-success', 'bi', 'bi-check2');
    i1.setAttribute('onclick', 'fetchAttributeValue(event, this)');
    const i2 = document.createElement('i');
    i2.classList.add('actions', 'text-danger', 'ms-2', 'bi', 'bi-x-circle');
    i2.setAttribute('onclick', 'cancelNewAttrValue(this)');
    
    td3.append(i1, i2);

    tr.append(td1, td2, td3);
    tblBody.appendChild(tr);

    input.focus();
}

function editAttrValRow(row) {
    const attrVal = {
        index: row.dataset.attrValueIndex,
        id: row.dataset.attrValueId,
        value: row.dataset.attrValueValue
    }

    row.innerHTML = '';

    const td1 = document.createElement('td');
    td1.innerHTML = attrVal.index;

    const td2 = document.createElement('td');

    const div = document.createElement('div');
    div.classList.add('form-floating');

    const input = document.createElement('input');
    input.classList.add('form-control');
    input.setAttribute('type', 'text');
    input.setAttribute('id', 'input-attribute-value');
    input.setAttribute('name', 'value');
    input.setAttribute('value', attrVal.value);
    input.setAttribute('placeholder', 'Attribute value');

    const label = document.createElement('label');
    label.setAttribute('for', 'input-attribute-value');
    label.innerHTML='Attribute value';

    div.append(input, label);
    td2.appendChild(div);

    const td3 = document.createElement('td');
    td3.classList.add('fs-5');
    const i1 = document.createElement('i');
    i1.classList.add('actions', 'text-success', 'bi', 'bi-check2');
    i1.setAttribute('onclick', 'fetchAttributeValue(event, this)');
    const i2 = document.createElement('i');
    i2.classList.add('actions', 'text-danger', 'ms-2', 'bi', 'bi-x-circle');
    i2.setAttribute('onclick', 'cancelEditAttrValue(this)');
    
    td3.append(i1, i2);

    row.append(td1, td2, td3);

    input.focus();
}

function resetAttrValueView(el, attrVal) {
    const tr = el.parentElement.parentElement;
    tr.innerHTML = '';
    tr.dataset.attrValueId = attrVal.id;
    tr.dataset.attrValueValue = attrVal.value;

    const td1 = document.createElement('td');
    td1.innerHTML = tr.dataset.attrValueIndex;

    const td2 = document.createElement('td');
    td2.innerHTML = attrVal.value;

    const td3 = document.createElement('td');
    td3.classList.add('fs-5');
    const i1 = document.createElement('i');
    i1.classList.add('actions', 'text-primary', 'bi', 'bi-pencil-square');
    i1.setAttribute('onclick', 'editAttrValue(this)');
    const i2 = document.createElement('i');
    i2.classList.add('actions', 'text-danger', 'ms-2', 'bi', 'bi-trash');
    i2.setAttribute('onclick', 'delAttrValue(this)');
    
    td3.append(i1, i2);

    tr.append(td1, td2, td3);

    attrValueEditing = false;
}

function cancelNewAttrValue(el) {
    el.parentElement.parentElement.remove();
    attrValueEditing = false;
}

function fetchAttributeValue(e, el) {
    e.stopPropagation();

    const tr = el.parentElement.parentElement;

    const currentValue = {
        index: tr.dataset.attrValueIndex,
        id: tr.dataset.attrValueId,
        value: tr.dataset.attrValueValue,
        attribute_id: attributeSelected.id
    }

    const form = document.querySelector('#form-attribute-values');
    const formData = new FormData(form);

    const newValue = {
        index: tr.dataset.attrValueIndex,
        id: tr.dataset.attrValueId,
        value: formData.get('value'),
        attribute_id: attributeSelected.id
    }


    if (!currentValue.id) {
        //creating new attribute value
        fetch('/api/attribute-values', {
            method: 'POST',
            body: JSON.stringify(newValue),
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        })
            .then( res => res.json())
            .then( data => {
                if (data.code === 200){
                    //if fetch succeed
                    resetAttrValueView(el, newValue); 
                } else {
                    //if fail, remove row.
                    tr.remove();
                }
            })
            .catch(error => {
                errorMessage('Error creating attribute value.');
                
            })
    } else {
        //editing existing attribute value
        fetch('/api/attribute-values', {
            method: 'PUT',
            body: JSON.stringify(newValue),
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        })
            .then( res => res.json())
            .then( data => {
                if (data.code === 200){
                    //if fetch succeed
                    resetAttrValueView(el, newValue); 
                } else {
                    //if fail, restore to previous value
                    resetAttrValueView(el, currentValue);
                }
            })
            .catch(error => {
                errorMessage('Error creating attribute value.');
                //if fail, restore to previous value
                resetAttrValueView(el, currentValue);
            })

        attrValueEditing = false;
        
    }

    
}

function newAttrVal() {
    if (attrValueEditing) return;
    if (!attributeSelected.name) return;
    attrValueEditing = true;
    const tableBody = document.querySelector('#table-attributes-values tbody');
    newAttrValRow(tableBody);
}

function editAttrValue(el) {
    if (attrValueEditing) return;
    attrValueEditing = true;

    const tr = el.parentElement.parentElement;
    editAttrValRow(tr);
}

function delAttrValue(el) {
    const tr = el.parentElement.parentElement;

    const attrVal = { 
        index: tr.dataset.attrValueIndex,
        id: tr.dataset.attrValueId,
        value: tr.dataset.attrValueValue
    }

    if (window.confirm(`Do you want to delete the attribute value\n${attrVal.value}`)) {
        //fetch delete
    }
}