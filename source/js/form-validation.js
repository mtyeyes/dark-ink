( function() {
  let inputsArray = document.querySelectorAll('.form__input');
  let submitBtn = document.querySelector('.form__btn');
  let modalAlert = document.querySelector('.modal-alert');
  let modalText = modalAlert.querySelector('.modal-alert__text');
  let modalBtn = modalAlert.querySelector('.modal-alert__close-btn')

  for (let input of inputsArray) {
    input.addEventListener('blur', function() {
      input.classList.add('form__input--changed');
    })
  };

  submitBtn.addEventListener('click', function( event ) {
    event.preventDefault();
    for (let input of inputsArray) {
      if (input.required === true) {
        if(!input.checkValidity()) {
          modalText.textContent = 'Form is not filled correctly';
          modalAlert.classList.add('modal-alert--show');
          for (let input of inputsArray) {
            input.classList.add('form__input--changed');
          }
          return
        }
      }
    }
    modalText.textContent = 'We will contact you as soon as possible!';
    modalAlert.classList.add('modal-alert--show');
    for (let input of inputsArray) {
      input.value = '';
    }
  });

  modalBtn.addEventListener('click', function() {
    modalAlert.classList.remove('modal-alert--show');
    submitBtn.disabled = false;
  });
}());
