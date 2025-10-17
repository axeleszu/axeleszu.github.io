document.addEventListener('DOMContentLoaded', function () {
    fetch('header.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('main-header').innerHTML = data;
            const backBtn = document.getElementById('back-btn');
            if (window.location.pathname.indexOf('login.html') !== -1 || window.location.pathname.indexOf('/index.html') !== -1 || window.location.pathname.substr(window.location.pathname.length - 1) === '/') {
                backBtn.style.display = 'none';
            }
            backBtn.addEventListener('click', function (e) {
                e.preventDefault();
                history.back();
                return false;
            });
        })
        .catch(error => console.error('Error loading header:', error));
    fetch('footer.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('footer-nav').innerHTML = data;
        })
        .catch(error => console.error('Error loading footer:', error));
});
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Intenta registrar el archivo sw.js
        navigator.serviceWorker.register('./sw.js')
            .then(registration => {
                console.log('Service Worker registrado con éxito:', registration);
            })
            .catch(error => {
                console.log('Error al registrar el Service Worker:', error);
            });
    });
}