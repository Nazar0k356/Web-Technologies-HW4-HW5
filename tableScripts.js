document.addEventListener('DOMContentLoaded', () => {
    const cartData = getCartData();
    createTable(cartData);
    
});

document.getElementById('return-btn').addEventListener('click', () => {
    window.location.href = 'main.html';
});

function getCartData() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    return cart;
}

function createTable(cart) {
    const tableContainer = document.getElementById('table-container');

    if (cart.length === 0) {
        tableContainer.innerHTML = '<p>No items in cart.</p>';
        return;
    }

    const table = document.createElement('table');

    const headerRow = document.createElement('tr');
    const headers = ['Назва піци', 'Ціна', 'Діаметр', 'Вага', 'Кількість'];
    headers.forEach(header => {
        const th = document.createElement('th');
        th.textContent = header;
        headerRow.appendChild(th);
    });
    table.appendChild(headerRow);

    let totalPrice = 0;
    let totalWeight = 0;
    let totalAmount = 0;

    cart.forEach(item => {
        const row = document.createElement('tr');
        const fieldsToDisplay = ['name', 'price', 'diameter', 'weight', 'quantity'];
        fieldsToDisplay.forEach(field => {
            const value = item[field];
            if (value !== null && value !== '') {
                const td = document.createElement('td');
                if(field === 'price' || field === 'weight'){
                    td.textContent = parseFloat(value) * parseFloat(item['quantity']);
                } else {
                    td.textContent = value;
                }
                row.appendChild(td);
            }
        });
        totalPrice += parseFloat(item.price) * parseFloat(item.quantity) || 0;
        totalWeight += parseFloat(item.weight) * parseFloat(item.quantity) || 0;
        totalAmount += parseFloat(item.quantity) || 0;
        table.appendChild(row);
    });

    const summaryRow = document.createElement('tr');
    summaryRow.classList.add("summary-row");

    const summaryNameCell = document.createElement('td');
    summaryNameCell.textContent = 'Total';
    summaryRow.appendChild(summaryNameCell);

    const summaryPriceCell = document.createElement('td');
    summaryPriceCell.textContent = totalPrice.toFixed(2) + ' грн';
    summaryRow.appendChild(summaryPriceCell);

    const summaryDiameterCell = document.createElement('td');
    summaryDiameterCell.textContent = '-';
    summaryRow.appendChild(summaryDiameterCell);

    const summaryWeightCell = document.createElement('td');
    summaryWeightCell.textContent = totalWeight.toFixed(2) + ' грамів';
    summaryRow.appendChild(summaryWeightCell);

    const summaryAmountCell = document.createElement('td');
    summaryAmountCell.textContent = totalAmount.toFixed(2);
    summaryRow.appendChild(summaryAmountCell);

    table.appendChild(summaryRow);


    tableContainer.appendChild(table);
}
