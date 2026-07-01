import { getCookie, categoryOptions, showAlert } from "./helpers.js";

const token = window.CONFIG.TOKEN
const inputSelector = document.getElementById('category-select')
const form = document.getElementById('register_form')

categoryOptions(inputSelector)

if(form){
    form.addEventListener('submit', function(e) {
        e.preventDefault()
        const csrftoken = getCookie('csrftoken');
        const formData = new FormData(form);
        fetch(form.action, {
            method: 'POST',
            headers: {
                'X-CSRFToken': csrftoken,
                'Authorization': `Token ${token}`
            },
            body: formData
        })
        .then(data => {
            window.location.href = '../index.html'
        })
        .catch(error => 
            showAlert('Backend server not running')
        );
    });
}