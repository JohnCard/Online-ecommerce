import { mainData, cardTemplate } from "./helpers.js";

// index.html

const cards_container = document.getElementById('cards_container');

const itemsList = mainData('gallery')
itemsList.then(data => {
    data.data.forEach(item => {
        cards_container.insertAdjacentHTML('afterbegin', cardTemplate(item.name, item.description, item.category.name, item.price, item.image));
    })
})
.catch(error => cards_container.innerHTML = `<h3 class="text-center fw-bold">No items found: ${error}</h2>`);

let searchForm = document.getElementById('search_form');
searchForm.addEventListener('submit', function(event) {
        event.preventDefault();
        cards_container.innerHTML = '';
        let searchInput = document.getElementById('search_input').value.toLowerCase();
        let listData = mainData(`gallery?price=${eval(searchInput)}`);
        listData.then(data => {
            data.data.forEach(item => {
                cards_container.innerHTML += cardTemplate(item.name, item.description, item.category.name, item.price, item.image);
            })
        })
})

// Excel report generation
document.getElementById('excelReport').addEventListener('click', async () => {
    const response = await fetch('http://127.0.0.1:8000/ecommerce/ecommerce-report');
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'excel_report.xlsx';
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
});
