import {show as showCustomAlert} from './custom-alert.js';

let links = document.querySelectorAll('a[href=""]');

for (let link of links) {
    link.addEventListener('click', function(event) {
      event.preventDefault();
      showCustomAlert('For now, only this page is available');
    });
};
