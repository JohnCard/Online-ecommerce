import { mainData, cardTemplate, showAlert, categoryOptions, carouselItem, verticalCard, carouselInner, galleryResponse } from "./helpers.js";

// HTML containers
const cardsContainer = document.getElementById('cards_container');
const verticalCardInner = document.getElementById('vertical-card-inner') 

// Carousel section
galleryResponse.then(data => {
    data = data.data.slice(0,6)
    data.forEach(item => {
        carouselInner.innerHTML += carouselItem(item.name, item.description, item.category.name, item.image, item.price)
    })
})

// Vertical card inner
galleryResponse.then(data => {
    data = data.data.slice(0,8)
    data.forEach(item => {
        verticalCardInner.innerHTML += verticalCard(item.name, item.description, item.category, item.image, item.price)
    })
})

// Gallery section
galleryResponse.then(data => {
    data.data.forEach(item => {
        cardsContainer.insertAdjacentHTML('afterbegin', cardTemplate(item.name, item.description, item.category.name, item.price, item.image));
    })
})
// Catching error
.catch(error => 
    // Llamamos a la función para mostrar el toast
    showAlert('Backend server not running')
);

// Search form input by name field
let searchForm = document.getElementById('search_form');
searchForm.addEventListener('submit', function(e) {
    e.preventDefault();
    cardsContainer.innerHTML = '';
    let searchInput = document.getElementById('search_input').value;
    let listData = mainData(`gallery?name=${searchInput}`);
    listData.then(data => {
        data.data.forEach(item => {
            cardsContainer.innerHTML += cardTemplate(item.name, item.description, item.category.name, item.price, item.image);
        })
    })
})

// Filter prices
const formPrice = document.getElementById('filter_price_gallery')
formPrice.addEventListener('submit', function(e){
    e.preventDefault()
    cardsContainer.innerHTML = ''
    const minValue = document.getElementById('min_val').value
    const maxValue = document.getElementById('max_val').value
    const listData = mainData(`gallery?price_range_min=${minValue}&price_range_max=${maxValue}`)
    listData.then(data => {
        data.data.forEach(item => {
            cardsContainer.innerHTML += cardTemplate(item.name, item.description, item.category.name, item.price, item.image)
        })
    })
})

// Filter by category id
const categorySelector = document.getElementById('filter_category_select')
categoryOptions(categorySelector)
document.getElementById('filter_category_form').addEventListener('submit', function(e){
    e.preventDefault()
    cardsContainer.innerHTML = ''
    let categoryId = document.getElementById('filter_category_select').value
    let listData = mainData(`gallery-filters?category=${categoryId}`)
    listData.then(data => {
        data.data.forEach(item => {
            cardsContainer.innerHTML += cardTemplate(item.name, item.description, item.category.name, item.price, item.image)
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