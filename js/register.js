import { getCookie, categoryOptions, showAlert } from "./helpers.js";

const inputSelector = document.getElementById('category')

categoryOptions(inputSelector)

document.addEventListener('DOMContentLoaded', function() {
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
                    'Authorization': 'Token ed93d9f561688cb8d1ed22776cba55173890673c'
                },
                body: formData
            })
            .then(data => {
                window.location.href = 'http://127.0.0.1:5500/index.html'
            })
            .catch(error => 
                showAlert('Backend server not running')
            );
        });
    }
});