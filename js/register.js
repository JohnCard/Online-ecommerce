import { getCookie, categoryOptions, showAlert } from "./helpers.js";

const inputSelector = document.getElementById('category')

categoryOptions(inputSelector)

const form = document.getElementById('register_form');
if (form) {
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        const csrftoken = getCookie('csrftoken');
        const formData = new FormData(form);
        fetch(form.action, {
            method: 'POST',
            headers: {
                'X-CSRFToken': csrftoken,
                'Authorization': 'Token 203bb7f875ebe1e7a9dc5008b1f5e03e1eab9ba4'
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