import { mainData, cardTemplate, showAlert, categoryOptions, carouselItem, verticalCard, carouselInner, galleryResponse } from "./helpers.js";

//* Main containers
// Filtering form
const filteringForm = document.querySelector('.filtering-form')
// Extract category selector / select input type from filtering form
const categorySelector = document.querySelector('.filter_category_select')
// Vertical card items container
const verticalCardInner = document.getElementById('vertical-card-inner') 
// Cards container
const cardsContainer = document.getElementById('cards_container')
//* Carousel
galleryResponse.then(data => {
    data = data.slice(0,6)
    data.forEach((item, index) => {
        const activeClass = index == 0 ? 'active' : ''
        carouselInner.innerHTML += carouselItem(item.name, item.description, item.categories, item.image, item.price, item.stock, activeClass)
    })
})
//* Apply category set to categories input located on filtering form
categoryOptions(categorySelector)
//* Vertical card inner
galleryResponse.then(data => {
    data = data.slice(0,8)
    data.forEach(item => {
        verticalCardInner.innerHTML += verticalCard(item.name, item.description, item.categories, item.image, item.price, item.stock)
    })
})
//* Gallery section
galleryResponse.then(data => {
    data.forEach(item => {
        cardsContainer.innerHTML += cardTemplate(item.name, item.description, item.categories, item.price, item.image, item.stock)
    })
})
// Catching error
.catch(error => 
    // Llamamos a la función para mostrar el toast
    showAlert('Backend server not running')
)
//* Applying filters
filteringForm.addEventListener('submit', async (e) => {
    // prevent default actions
    e.preventDefault()
    // set empty manage container
    cardsContainer.innerHTML = ''
    // extract name field value
    const name = document.getElementById('name').value
    // extract min and max stock number type inputs from filtering form
    const minStock = document.getElementById('min-stock').value
    const maxStock = document.getElementById('max-stock').value
    // extract min and max value number type inputs from filtering form
    const minValue = document.getElementById('min-val').value
    const maxValue = document.getElementById('max-val').value
    //extract ordering filter
    const order = document.getElementById('filter-ordering').value
    // extract set values from category selector input
    const values = [...categorySelector.selectedOptions].map(op => op.value)
    // request new data for manage container
    let listData = await mainData(`gallery?ordering=${order}&categories__in=${values}&price_min=${minValue}&price_max=${maxValue}&name=${name}&stock_max=${maxStock}&stock_min=${minStock}`)
    // remove duplicated items
    listData = listData.filter((item, i, arr) => i === arr.findIndex(x => x.id === item.id))
    // map new set to manage container
    listData.map(item => {
        cardsContainer.innerHTML += cardTemplate(item.name, item.description, item.categories, item.price, item.image, item.stock)
    })
})
//* Excel report generation
document.getElementById('excelReport').addEventListener('click', async () => {
    const response = await fetch('http://127.0.0.1:8000/ecommerce/gallery-report');
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