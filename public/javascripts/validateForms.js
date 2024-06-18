(function () {
    'use strict'

    // Fetch all forms we want to apply custom validation to
    const forms = document.querySelectorAll('.validated-form')

    // Loop over all forms and prevent submission
    Array.from(forms)
        .forEach(function (form) {
            form.addEventListener('submit', function (event) {
                if (!form.checkValidity()) {
                    event.preventDefault()
                    event.stopPropagation()
                }

                form.classList.add('was-validated')
            }, false)
        })
})()