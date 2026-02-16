// js/noflash.js
(function() {
    document.documentElement.classList.add('preload');
    let theme = 'light';
    try {
        const settings = localStorage.getItem('css-minify');
        if (settings) {
            theme = JSON.parse(settings).theme || 'light';
        }
    } catch (e) {
        console.error('LocalStorage error:', e);
    }

    if (theme === 'auto') {
        const hour = new Date().getHours();
        theme = (hour >= 6 && hour < 18) ? 'light' : 'dark';
    } else if (theme === 'system') {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            theme = 'dark';
        } else {
            theme = 'light';
        }
    }
    document.documentElement.setAttribute('data-theme', theme);
})();

document.addEventListener("DOMContentLoaded", function() {
  setTimeout(() => {document.documentElement.classList.remove('preload');}, 100);
});
