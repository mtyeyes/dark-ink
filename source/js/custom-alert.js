const customAlert = {
  modalAlert: document.querySelector('.modal-alert'),
  modalText: document.querySelector('.modal-alert__text'),
  show: function (message) {
    this.modalText.textContent = message;
    this.modalAlert.classList.add('modal-alert--show');
  },
  hide: function () {
    this.modalAlert.classList.remove('modal-alert--show');
  },
};

document
  .querySelector('.modal-alert__close-btn')
  .addEventListener('click', function () {
    customAlert.hide();
  });
