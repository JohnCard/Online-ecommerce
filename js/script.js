import { mainData, acortarTexto, SearchForm } from "./helpers.js";

// index.html
function cardTemplate(title, paragraph, category, price, img) {
    return `
    <div class="col-xxl-4">
        <div class="card">
            <div class="row align-items-center">
                <div class="col-md-4">
                    <img src="${img.replace('http://127.0.0.1:8000/https%3A', '/')}" class="img-fluid rounded" alt="Desktop MacBook">
                </div>
                <div class="col-md-8">
                    <div class="card-body">
                        <h5 class="card-title">${title}</h5>
                        <p class="card-text">${acortarTexto(paragraph, 250)}</p>
                        <p class="card-text">Category - ${category}</p>
                        <p class="card-text">Price - <mark>$${price}</mark></p>
                    </div>
                </div>
            </div>
        </div>
    </div>`;
}

const cards_container = document.getElementById('cards_container');

const itemsList = mainData('gallery')
itemsList.then(data => {
    data.data.forEach(item => {
        cards_container.insertAdjacentHTML('afterbegin', cardTemplate(item.name, item.description, item.category.name, item.price, item.image));
    })
})
.catch(error => cards_container.innerHTML = `<h2 class="text-center fw-bold">No items found: ${error}</h2>`);

let searchForm = document.getElementById('search_form');
SearchForm(searchForm, cards_container);