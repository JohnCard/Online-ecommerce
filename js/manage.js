import { mainData, showAlert, categoryOptions, updateForm, deleteForm, PutDelTemplate, carouselInner, carouselItem, galleryResponse } from "./helpers.js";

//* Functions
// Apply category set function
function applyOptions(dataList){
    // Apply options for each selector
    dataList.then(response => {
        response.forEach(item => {
            const selectorId = document.getElementById(`selector-${item.id}`)
            categoryOptions(selectorId, item.categories)
        })
    })
    .catch(() =>{
        showAlert('Backend server not running well.')
    })
}
//* Init variables
// Request category set
const categorySet = await mainData('categories')
// Filtering form
const filteringForm = document.querySelector('.filtering-form')
// Extract category selector / select input type from filtering form
const categorySelector = document.querySelector('.filter_category_select')
// Extract manage container
const manageContainer = document.getElementById('manage_container');
//* Filling input and containers with main data
// Carousel
galleryResponse.then(data => {
    data = data.slice(0,6)
    data.forEach((item, index) => {
        const activeClass = index == 0 ? 'active' : ''
        carouselInner.innerHTML += carouselItem(item.name, item.description, item.categories, item.image, item.price, item.stock, activeClass)
    })
})
//* Apply category set to categories input located on filtering form
categoryOptions(categorySelector)
//* Filling manage (.row) container
galleryResponse.then(response => {
    response.forEach(item => {
        manageContainer.innerHTML += PutDelTemplate(item.id, item.name, item.description, item.price, item.image, item.stock)
    })
    //* Apply category sets to all PUT/DELETE template category selector or (`<select>`) inputs
    applyOptions(galleryResponse)
}) //! Backend server not running
.catch(() =>{
    showAlert('Backend server not running well.')
})
//* Applying filters
filteringForm.addEventListener('submit', async (e) => {
    // prevent default actions
    e.preventDefault()
    // set empty manage container
    manageContainer.innerHTML = ''
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
        manageContainer.innerHTML += PutDelTemplate(item.id, item.name, item.description, item.price, item.image, item.stock)
        const selector = document.getElementById(`selector-${item.id}`)
        let itemCategories = item.categories
        categorySet.forEach(item => {
            const option = document.createElement('option')
            option.value = item.id
            option.textContent = item.name
            if(itemCategories.some(elem => elem.id == item.id)){
                option.setAttribute('selected', '')
            }
            selector.appendChild(option)
        })
    })
})
// Delete/Put
manageContainer.addEventListener('submit', (e) => {
    e.preventDefault();
    let id = e.target.id
    if (id.includes('update')) {
        updateForm(id);
    }
    else {
        deleteForm(id);
    }
})