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

function SearchForm(searchForm, cards_container){
    searchForm.addEventListener('submit', function(event) {
        event.preventDefault();
        cards_container.innerHTML = '';
        let searchInput = document.getElementById('search_input').value.toLowerCase();
        let listData = mainData(`gallery?price=${searchInput}`);
        listData.then(data => {
            data.data.forEach(item => {
                cards_container.innerHTML += cardTemplate(item.name, item.description, item.category.name, item.price);
            })
        })
    })
}

export { mainData, getCookie, acortarTexto, SearchForm };