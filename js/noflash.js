// js/noflash.js
(function() {
    // 1. CSS geçişlerini (transition) engellemek için bir class ekle
    document.documentElement.classList.add('preload');

    // 2. localStorage'dan ayarları al
    let theme = 'light';
    try {
        const settings = localStorage.getItem('css-minify');
        if (settings) {
            theme = JSON.parse(settings).theme || 'light';
        }
    } catch (e) {
        console.error('LocalStorage error:', e);
    }

    // 3. Auto ve System mantığını hesapla
    if (theme === 'auto') {
        const hour = new Date().getHours();
        theme = (hour >= 6 && hour < 18) ? 'light' : 'dark';
    } else if (theme === 'system') {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            theme = 'dark';
        } else {
            theme = 'light'; // Sistem dark değilse light varsay
        }
    }

    // 4. Temayı HTML etiketine uygula (Bu anında gerçekleşir)
    document.documentElement.setAttribute('data-theme', theme);
    
    // Body görünürlüğünü JS ile değil, CSS ile yöneteceğiz.
    // Burada body'ye müdahale etme çünkü body henüz yok!
})();

document.addEventListener("DOMContentLoaded", function() {// Küçük bir gecikme transition patlamasını önler
  setTimeout(() => {document.documentElement.classList.remove('preload');}, 100);
});