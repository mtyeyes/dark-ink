/*global customAlert*/
(function () {
  let inputsArray = document.querySelectorAll('.form__input');
  let submitBtn = document.querySelector('.form__btn');

  for (let input of inputsArray) {
    input.addEventListener('blur', function () {
      input.classList.add('form__input--changed');
    });
  }

  submitBtn.addEventListener('click', function (event) {
    event.preventDefault();
    for (let input of inputsArray) {
      if (input.required === true) {
        if (!input.checkValidity()) {
          customAlert.show('Form is not filled correctly');
          for (let input of inputsArray) {
            input.classList.add('form__input--changed');
          }
          return;
        }
      }
    }
    customAlert.show('We will contact you as soon as possible!');
    for (let input of inputsArray) {
      input.value = '';
    }
  });
})();
