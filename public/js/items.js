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
    const field1 = createFormFloatingInputEl('item-sku', 'text', 'item-sku', 'SKU');
    col2.appendChild(field1);

    const col3 = document.createElement('td');
    const field2 = createFormFloatingInputEl('item-name', 'text', 'item-name', 'Name');
    col3.appendChild(field2);

    const col4 = document.createElement('td');

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
}

function cancelNewItem() {
    const newRow = document.querySelector('#new-item-row');     //catch the new created row
    newRow.remove();                                            //remove it
    document.querySelector('#btn-add-item').disabled = false;   //enable the add button
}