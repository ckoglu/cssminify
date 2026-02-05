// theme.js
(function() {'use strict';
    
    const tText = document.getElementById("theme-text");
    // locale'dan tema ayarını oku
    function loadTheme() {
        const settingsJson = localStorage.getItem('css-minify');
        let theme = 'light'; // varsayılan tema
        if (settingsJson) {
            try {
                const settings = JSON.parse(settingsJson);
                if (settings.theme) {theme = settings.theme;}
            } catch (e) {
                console.error('Tema ayarları okunurken hata:', e);
            }
        }
        return theme;
    }
    
    // locale'a ayarları yaz
    function saveTheme(theme) {
        const settingsJson = localStorage.getItem('css-minify');
        let settings = {};
        
        if (settingsJson) {
            try {
                settings = JSON.parse(settingsJson);
            } catch (e) {
                settings = {};
            }
        }
        
        settings.theme = theme;
        localStorage.setItem('css-minify', JSON.stringify(settings));
        // Temayı hemen uygula
        applyTheme(theme);
    }
    
    // Temayı uygula
    function applyTheme(themeSetting) {
        let actualTheme = themeSetting;
        
        if (themeSetting === 'auto') {
            const hour = new Date().getHours();
            actualTheme = (hour >= 6 && hour < 18) ? 'light' : 'dark';
        }

        else if (themeSetting === 'system') {
            if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                actualTheme = 'dark';
            } else {
                actualTheme = 'light';
            }
        }
        
        document.documentElement.setAttribute('data-theme', actualTheme);
        // Sistem teması listener'larını yeniden başlat
        restartThemeListeners(themeSetting);
        
        // Tema metnini güncelle
        if (tText) {
          if (themeSetting === "light") {tText.innerText = "☀️";}
          if (themeSetting === "dark") {tText.innerText = "🌙";}
          if (themeSetting === "auto") {tText.innerText = "🌓";}
          if (themeSetting === "system") {tText.innerText = "🖥️";}
        }
    }
    
    // Tema listener'larını yeniden başlat
    function restartThemeListeners(themeSetting) {
        // Eski listener'ları temizle
        if (window.themeInterval) {clearInterval(window.themeInterval);}
        
        // Auto modu için interval 1 saat = 60 * 60 * 1000 = 3600000
        if (themeSetting === 'auto') {
            window.themeInterval = setInterval(function() {
                const hour = new Date().getHours();
                const newTheme = (hour >= 6 && hour < 18) ? 'light' : 'dark';
                const currentTheme = document.documentElement.getAttribute('data-theme');
                if (newTheme !== currentTheme) {document.documentElement.setAttribute('data-theme', newTheme);}
            }, 3600000); // 1 saat
        }
    }
    
    // Tema değiştiriciyi başlat
    function initThemeSwitcher() {
        const switchers = document.querySelectorAll('[data-theme-switcher]');
        switchers.forEach(switcher => {
            switcher.addEventListener('click', function(e) {
                e.preventDefault();
                const theme = this.getAttribute('data-theme-switcher');
                saveTheme(theme);
            });
        });
    }
    
    // DOM hazır olduğunda çalıştır
    if (document.readyState === 'loading') {
        document.addEventListener("DOMContentLoaded", function() {
            // Başlangıçta temayı yükle
            const initialTheme = loadTheme();
            applyTheme(initialTheme);
            // Tema değiştiriciyi başlat
            initThemeSwitcher();
        });
    } else {
        // Eğer DOM zaten hazırsa
        const initialTheme = loadTheme();
        applyTheme(initialTheme);
        initThemeSwitcher();
    }
})();

document.addEventListener('click', function (event) {
    // 1. Tüm açık dropdownları bul
    const allDropdowns = document.querySelectorAll('details.dropdown[open]');
    const html = document.documentElement;
    allDropdowns.forEach(dropdown => {
        
        // Eğer tıklanan yer bu dropdown'ın kendisi değilse kapat (Dışarı tıklama)
        if (!dropdown.contains(event.target)) {
            dropdown.removeAttribute('open');
            if (html.classList.contains("modal-is-open")) {html.classList.remove("modal-is-open");}
            if (document.getElementById("theme-list-menu")) {document.getElementById("theme-list-menu").classList.remove("open");}
        }

        // Eğer tıklanan yer bir liste elemanı (veya içindeki link) ise kapat (İçeri tıklama)
        // 'summary' kısmına tıklanmadığından emin oluyoruz ki menü açılırken hemen kapanmasın
        else if (event.target.closest('ul')) {
            // Küçük bir gecikme: Tıklama efektinin görülmesi ve data-attribute işlemlerinin tamamlanması için
            setTimeout(() => {
                dropdown.removeAttribute('open');
                if (html.classList.contains("modal-is-open")) {html.classList.remove("modal-is-open");}
                            if (document.getElementById("theme-list-menu")) {document.getElementById("theme-list-menu").classList.remove("open");}
            }, 10);
            
        }
    });
});