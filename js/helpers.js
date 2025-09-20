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

async function mainData(char){
    let csrftoken = getCookie('csrftoken');
    try{
        const res = await fetch(`http://127.0.0.1:8000/ecommerce/${char}`,
            {
            headers: {
                'X-CSRFToken': csrftoken,
                'Authorization': 'Token 53178c45167ec6e86c74d2e676c743eafb87ddbc'
            },
            });
        const data = await res.json();
        return { ok: true, data: data.results };
    } catch (error) {
        return { ok: false, message: error };
    }
}

function categoryOptions(id){
    let categoriesResponse = mainData('categories')
    categoriesResponse.then(resp => {
        if (resp['ok'] == true){
            let categorySelector = document.querySelector(`.category_selector-${id}`);
            const data = resp['data']
            data.forEach(item => {
                categorySelector.innerHTML += `<option value="${item.id}">${item.name}</option>`;
            })
        }
        else{
            let categorySelector = document.querySelector(`.category_selector-${id}`);
            categorySelector.innerHTML = `<option>Something went wrong: ${resp['message']}</option>`
        }
    })
}

function acortarTexto(texto, maxLongitud) {
  if (texto.length <= maxLongitud) {
    return texto;
  }
  return texto.slice(0, maxLongitud) + '...';
}

function cardTemplate(title, paragraph, category, price, img) {
    return `
    <div class="col-xxl-4">
        <div class="card">
            <div class="row align-items-center min-h-300 px-3">
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

export { mainData, getCookie, acortarTexto, cardTemplate };