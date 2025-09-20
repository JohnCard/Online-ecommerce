import { mainData, getCookie } from "./helpers.js";

// Update and Delete forms handling

function updateForm(id){
    const csrftoken = getCookie('csrftoken');
    let form = document.getElementById(id);
    const formData = new FormData(form);

    id = id.split('-')[1]

    fetch(`http://127.0.0.1:8000/ecommerce/gallery/${id}`, {
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

    fetch(`http://127.0.0.1:8000/ecommerce/gallery/${id}`, {
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
    <div class="col-xxl-4">
        <form id="update_form-${id}" class="mb-2 ${id}">
            <fieldset>
                <legend>${title}</legend>
                <img src="${img.replace('http://127.0.0.1:8000/https%3A', '/')}" class="mx-auto " alt="${title}-img" width="250" height="200">
                <input type="text" name="name" class="form-control mb-3" value="${title}">
                <textarea name="description" class="form-control mb-3">${description}</textarea>
                <input type="number" name="price" class="form-control mb-3" placeholder="${price}">
                <input type="submit" class="btn btn-success w-100" value="Update">
            </fieldset>
        </form>
        <form id="delete_form-${id}" class="${id}">
            <input type="submit" class="btn btn-danger w-100" value="Delete">
        </form>
    </div>`;
}

const manage_container = document.getElementById('manage_container');

let galleryResponse = mainData('gallery')
galleryResponse.then(resp => {
    if (resp['ok'] == true){
        const data = resp['data']
        data.forEach(item => {
            manage_container.innerHTML += PutDelTemplate(item.id, item.name, item.description, item.price, item.image);
        })
    }
    else{
        manage_container.innerHTML += `<p>Something went wrong: ${resp['message']}</p>`
    }
})

manage_container.addEventListener('submit', function(e) {
    e.preventDefault();
    let id = e.target.id
    if (id.includes('update')) {
        updateForm(id);
    }
    else {
        deleteForm(id);
    }
})