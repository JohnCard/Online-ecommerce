// Función para obtener el token CSRF de la cookie
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let cookie of cookies) {
            cookie = cookie.trim();
            if (cookie.startsWith(name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

// HTML container
const carouselInner = document.querySelector('.carousel-inner')

async function mainData(char){
    let csrftoken = getCookie('csrftoken');
    try{
        const res = await fetch(`https://codeandote-interview-production.up.railway.app/ecommerce/${char}`,
            {
            headers: {
                'X-CSRFToken': csrftoken,
                'Authorization': 'Token ed93d9f561688cb8d1ed22776cba55173890673c'
            },
            });
        const data = await res.json();
        return { ok: true, data: data.results };
    } catch (error) {
        return { ok: false, message: error };
    }
}

// Main gallery data
let galleryResponse = mainData('gallery')

function categoryOptions(categorySelector, idCategory=null){
    const categoriesResponse = mainData('categories')
    categoriesResponse.then(resp => {
        const data = resp['data']
        data.forEach(item => {
            let option = document.createElement('option')
            option.value = item.id
            option.textContent = item.name
            if (idCategory == option.value) {
                option.setAttribute('selected', '')
            }
            categorySelector.appendChild(option)
        })
    })
}

function shortenText(texto, maxLongitud) {
  if (texto.length <= maxLongitud) {
    return texto;
  }
  return texto.slice(0, maxLongitud) + '...';
}

function cardTemplate(title, paragraph, category, price, img) {
    img = img.replace('https://codeandote-interview-production.up.railway.app/img/https%3A', '/')
    return `
    <div class="col-xxl-4">
        <div class="card">
            <div class="row align-items-center min-h-300 px-3">
                <div class="col-md-4">
                    <img src="${img}" class="img-fluid rounded" alt="Desktop MacBook">
                </div>
                <div class="col-md-8">
                    <div class="card-body">
                        <h5 class="card-title">${title}</h5>
                        <p class="card-text">${shortenText(paragraph, 150)}</p>
                        <p class="card-text">Category - ${category}</p>
                        <p class="card-text">Price - $<mark>${price}</mark></p>
                    </div>
                </div>
            </div>
        </div>
    </div>`;
}

function showAlert(error) {
    const alertToast = document.getElementById('alert-toast');
    
    // Muestra el alert
    alertToast.style.display = 'block'; // Cambia el display a block para hacerlo visible
    document.getElementById('alert-toast-error').innerText = error
    
    // Añadimos la clase 'show' que aplica la animación
    setTimeout(() => {
        alertToast.classList.add('show');
    }, 10); // Esperamos un poquito para aplicar la animación

    // Ocultamos el alert después de 3 segundos
    setTimeout(() => {
        alertToast.classList.remove('show');
        setTimeout(() => {
            alertToast.style.display = 'none'; // Ocultamos el alert después de la animación
        }, 500); // Esperamos que termine la animación antes de ocultarlo
    }, 3000); // 3 segundos de duración del toast
}

function updateForm(id){
    const csrftoken = getCookie('csrftoken');
    let form = document.getElementById(id);
    const formData = new FormData(form);

    id = id.split('-')[1]

    fetch(`https://codeandote-interview-production.up.railway.app/ecommerce/gallery/${id}`, {
        method: 'PUT',
        headers: {
            'X-CSRFToken': csrftoken
        },
        body: formData
    })
    .then(data => {
        window.location.href = 'http://127.0.0.1:5500/index.html'
    })
    .catch(error => console.error(error));
}

function deleteForm(id){
    const csrftoken = getCookie('csrftoken');

    id = id.split('-')[1]

    fetch(`https://codeandote-interview-production.up.railway.app/ecommerce/gallery/${id}`, {
    method: 'DELETE',
    headers: {
        'X-CSRFToken': csrftoken
    },
    })
    .then(data => {
        window.location.href = 'http://127.0.0.1:5500/index.html'
    }
    )
    .catch(error => console.error(error));
}

function PutDelTemplate(id, title, description, price, img) {
    return `
    <div class="col-xxl-4 mb-4">
        <form id="update_form-${id}" class="mb-2">
            <fieldset>
                <legend>${title}</legend>
                <img src="${img.replace('https://codeandote-interview-production.up.railway.app/img/https%3A', '/')}" class="mx-auto d-block py-3" alt="${title}-img" width="250" height="200">
                <input type="text" name="name" class="form-control mb-3" value="${title}" aria-describedby="product name">
                <textarea name="description" class="form-control mb-3" aria-describedby="product description">${description}</textarea>
                <input type="number" name="price" class="form-control mb-3" value="${price}" aria-describedby="product value">
                <select name="category" id="selector-${id}" class="form-select mb-3" aria-describedby="product category">
                </select>
                <input type="submit" class="btn btn-success w-100" value="Update">
            </fieldset>
        </form>
        <form id="delete_form-${id}">
            <input type="submit" class="btn btn-danger w-100" value="Delete">
        </form>
    </div>`;
}

function carouselItem(name, paragraph, category, img, price){
    img = img.replace('https://codeandote-interview-production.up.railway.app/img/https%3A', '/')
    return `
    <div class="carousel-item" data-bs-interval="5000">
        <div class="row">
            <div class="col-xxl-8">
                <div class="bg-body">
                    <h5>${name}</h5>
                    <p>${shortenText(paragraph, 250)}</p>
                    <p>Category - ${category}</p>
                    <p>Price - $<mark>${price}</mark></p>
                </div>
            </div>
            <div class="col-xxl-4">
                <img src="${img}" class="h-250" alt="${name}-image">
            </div>
        </div>
    </div>
    `
}

function verticalCard(name, description, category, img, price){
    img = img.replace('https://codeandote-interview-production.up.railway.app/img/https%3A', '/')
    return `
    <div class="col-xxl-4">
        <div class="card min-h-450 mb-4">
            <img src="${img}" class="card-img-top max-h-240 p-4" alt="${name}-img">
            <div class="card-body">
                <h5 class="card-title">${name}</h5>
                <p class="card-text">${shortenText(description, 150)}</p>
                <p class="card-text">Price - $<small class="text-body-secondary">${price}</small></p>
                <p class="card-text">Category - ${category.name}</p>
            </div>
        </div>
    </div>
    `
}

export { mainData, getCookie, cardTemplate, categoryOptions, showAlert, updateForm, deleteForm, PutDelTemplate, carouselItem, carouselInner, galleryResponse, verticalCard};