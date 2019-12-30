
const modalAlert = document.querySelector('.modal-alert');
const modalText = document.querySelector('.modal-alert__text');
const show = message => {
  modalText.textContent = message;
  modalAlert.classList.add('modal-alert--show');
};
const hide = () => {
  modalAlert.classList.remove('modal-alert--show');
};

document.querySelector('.modal-alert__close-btn').addEventListener('click', function(event) {
  hide();
});

export {show};
