//Items

function addItem() {
    document.querySelector('#btn-add-item').disabled = true;    //disable the add button

    const tb = document.querySelector('#table-items').querySelector('tbody');
    const rowCount = tb.querySelectorAll('tr').length;

    const row = document.createElement('tr'); 
    row.setAttribute('id', 'new-item-row');
    row.dataset.itemIndex = rowCount + 1;

    const col1 = document.createElement('td');
    col1.innerHTML = rowCount + 1;

    const col2 = document.createElement('td');
    const field1 = createFormFloatingInputEl('item-sku', 'text', 'sku', 'SKU');
    col2.appendChild(field1);

    const col3 = document.createElement('td');
    const field2 = createFormFloatingInputEl('item-name', 'text', 'name', 'Name');
    col3.appendChild(field2);

    const col4 = document.createElement('td');
    const field3 = createFormFloatingInputEl('item-description', 'text', 'description', 'Description');
    col4.appendChild(field3);

    const col5 = document.createElement('td');
    col5.classList.add('fs-5');
    const icon1 = document.createElement('i');
    icon1.classList.add('actions', 'text-primary', 'bi', 'bi-check2');
    icon1.setAttribute('onclick', 'newItem()');
    const icon2 = document.createElement('i');
    icon2.classList.add('actions', 'text-danger', 'ms-2', 'bi', 'bi-x-circle');
    icon2.setAttribute('onclick', 'cancelNewItem()');
    col5.append(icon1, icon2);

    row.append(col1, col2, col3, col4, col5);
    tb.appendChild(row);
    document.querySelector('#item-sku').focus();
}

function addItemToTable(item) {
    const tb = document.querySelector('#table-items').querySelector('tbody');
    const rowCount = tb.querySelectorAll('tr').length;

    createTableRowWithFields(rowCount+1, item, '', '');
}

function cancelNewItem() {
    const newRow = document.querySelector('#new-item-row');     //catch the new created row
    newRow.remove();                                            //remove it
    document.querySelector('#btn-add-item').disabled = false;   //enable the add button
}

function newItem() {
    const formItems = document.querySelector('#form-items')
    const formData = new FormData( formItems );
    const plainFormData = Object.fromEntries(formData.entries());
    const formDataJsonString = JSON.stringify(plainFormData);

    //fetch the request
    fetch('/api/items', {
        method: 'POST',
        body: formDataJsonString,
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    })
        .then( res => res.json())
        .then( data => {
            //Add new item in the table
            const message = data.message;
            const code = data.code;

            if (code === 200) {
                successMessage(message);
                const item = data.data;

                cancelNewItem();

                addItemToTable(item);
            } else {
                errorMessage(message);
            }
            
        })
        .catch(error => {
            errorMessage('Error creating new item.');
        })
        .finally(() => {
            document.querySelector('#btn-add-item').disabled = false;    //enable the add button
        }) 
}