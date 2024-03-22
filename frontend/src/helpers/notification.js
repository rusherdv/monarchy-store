import Toastify from 'toastify-js'

export default function showNotification(message,type) {
  Toastify({
    text: message,
    duration: 3000,
    newWindow: true,
    gravity: "bottom",
    position: "right",
    style: {
      background: type === 'success' ? "green" : "red",
    },
    onClick: function(){}
  }).showToast();
}