import { mainData, showAlert, categoryOptions, updateForm, deleteForm, PutDelTemplate, carouselInner, carouselItem, galleryResponse } from "./helpers.js";

function applyOptions(dataList){
    // Apply options for each selector
    dataList.then(resp => {
        const data = resp['data']
        data.forEach(item => {
            const selectorId = document.getElementById(`selector-${item.id}`)
            categoryOptions(selectorId, item.category.id)
        })
    })
    .catch(error =>{
        showAlert('Backend server not running well.')
    })
}

// HTML container
const manageContainer = document.getElementById('manage_container');

// Carousel section
galleryResponse.then(data => {
    data = data.data.slice(0,6)
    data.forEach(item => {
        carouselInner.innerHTML += carouselItem(item.name, item.description, item.cateogry, item.image, item.price)
    })
})

// Main section
galleryResponse.then(resp => {
    const data = resp['data']
    data.forEach(item => {
        manageContainer.innerHTML += PutDelTemplate(item.id, item.name, item.description, item.price, item.image);
    })
})
.catch(error =>{
    showAlert('Backend server not running well.')
})

applyOptions(galleryResponse)

// Filtrar por categoría
const categorySelector = document.getElementById('filter_category_select')
categoryOptions(categorySelector)
document.getElementById('filter_category_form').addEventListener('submit', function(e){
    e.preventDefault()
    manageContainer.innerHTML = ''
    let categoryId = document.getElementById('filter_category_select').value
    let listData = mainData(`gallery-filters?category=${categoryId}`)
    listData.then(data => {
        data.data.forEach(item => {
            manageContainer.innerHTML += PutDelTemplate(item.id, item.name, item.description, item.price, item.image)
        })
    })
    applyOptions(listData)
})

// Filter prices
const formPrice = document.getElementById('filter_price_gallery')
formPrice.addEventListener('submit', function(e){
    e.preventDefault()
    manageContainer.innerHTML = ''
    const minValue = document.getElementById('min_val').value
    const maxValue = document.getElementById('max_val').value
    const listData = mainData(`gallery?price_range_min=${minValue}&price_range_max=${maxValue}`)
    listData.then(data => {
        data.data.forEach(item => {
            manageContainer.innerHTML += PutDelTemplate(item.id ,item.name, item.description, item.price, item.image)
        })
    })
    applyOptions(listData)
})

// Search form input
let searchForm = document.getElementById('search_form');
searchForm.addEventListener('submit', function(e) {
    e.preventDefault();
    manageContainer.innerHTML = '';
    let searchInput = document.getElementById('search_input').value;
    let listData = mainData(`gallery?name=${searchInput}`);
    listData.then(data => {
        data.data.forEach(item => {
            manageContainer.innerHTML += PutDelTemplate(item.id, item.name, item.description, item.price, item.image);
        })
    })
    applyOptions(listData)
})

// Delete/Put
manageContainer.addEventListener('submit', function(e) {
    e.preventDefault();
    let id = e.target.id
    if (id.includes('update')) {
        updateForm(id);
    }
    else {
        deleteForm(id);
    }
})