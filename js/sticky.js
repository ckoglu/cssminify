// sticky.js
(function() {
    // Elementi bulmak için yardımcı fonksiyon
    function findMetricHead() {
        let head = document.querySelector('.metric-head');
        if (!head) {head = document.querySelector('.metrics-list-section .metric-head');}
        if (!head) {
            const allHeads = document.querySelectorAll('[class*="metric-head"], [class*="metricHead"]');
            if (allHeads.length > 0) {head = allHeads[0];}
        }
        return head;
    }
    
    function initSticky() {
        const metricHead = findMetricHead();
        if (!metricHead) {setTimeout(initSticky, 500);return;}
        let ticking = false;
        
        function checkSticky() {
            const rect = metricHead.getBoundingClientRect();
            const style = window.getComputedStyle(metricHead);
            const topValue = parseFloat(style.top) || 0;
            const isSticky = rect.top <= topValue;

            if (isSticky) {
                if (!metricHead.classList.contains('sticky-active')) {
                    metricHead.classList.add('sticky-active');
                }
            } else {
                if (metricHead.classList.contains('sticky-active')) {
                    metricHead.classList.remove('sticky-active');
                }
            }
            ticking = false;
        }
        
        window.addEventListener('scroll', function() {
            if (!ticking) {
                window.requestAnimationFrame(function() { checkSticky();});
                ticking = true;
            }
        });

        checkSticky();
        window.addEventListener('resize', checkSticky);
    }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initSticky);
    } else {
        setTimeout(initSticky, 100);
    }
})();

// advanced-smooth-scroll.js
class SmoothScrollManager {
    constructor() {
        this.mainTopValue = 0;
        this.isScrolling = false;
        this.scrollDuration = 600; // ms
        this.init();
    }
    
    init() {
        this.calculateMainTop();
        this.bindEvents();
        this.handleInitialHash();
        
        // Window resize'da main-top'u yeniden hesapla
        window.addEventListener('resize', () => {
            this.calculateMainTop();
        });
    }
    
    calculateMainTop() {
        try {
            const root = document.documentElement;
            const value = getComputedStyle(root).getPropertyValue('--main-top').trim();
            
            if (value.endsWith('px')) {
                this.mainTopValue = parseFloat(value);
            } else if (value.endsWith('rem')) {
                const rem = parseFloat(value);
                this.mainTopValue = rem * parseFloat(getComputedStyle(root).fontSize);
            } else if (value.endsWith('em')) {
                const em = parseFloat(value);
                this.mainTopValue = em * parseFloat(getComputedStyle(document.body).fontSize);
            } else if (value.endsWith('vh')) {
                const vh = parseFloat(value);
                this.mainTopValue = (vh * window.innerHeight) / 100;
            } else {
                this.mainTopValue = parseFloat(value) || 0;
            }
            
            // Minimum değer
            this.mainTopValue = Math.max(0, this.mainTopValue);
        } catch (error) {
            this.mainTopValue = 0;
        }
    }
    
    bindEvents() {
        // Linkleri seç
        document.querySelectorAll('a[href^="#"]').forEach(link => {
            link.addEventListener('click', (e) => this.handleClick(e));
        });
        
        // Alt tuşu ile tıklanırsa normal hash davranışına izin ver
        document.addEventListener('keydown', (e) => {
            if (e.altKey) {
                document.querySelectorAll('a[href^="#"]').forEach(link => {
                    link.dataset.allowHash = 'true';
                });
            }
        });
        
        document.addEventListener('keyup', (e) => {
            if (!e.altKey) {
                document.querySelectorAll('a[href^="#"]').forEach(link => {
                    delete link.dataset.allowHash;
                });
            }
        });
    }
    
    handleClick(event) {
        const link = event.currentTarget;
        
        // Alt tuşu basılıysa normal hash davranışına izin ver
        if (link.dataset.allowHash === 'true' || event.altKey) {
            return;
        }
        
        event.preventDefault();
        
        const href = link.getAttribute('href');
        const targetId = href.substring(1);
        
        if (targetId) {
            this.scrollToElement(targetId);
        }
    }
    
    handleInitialHash() {
        if (window.location.hash) {
            const hash = window.location.hash.substring(1);
            
            // Hash'i URL'den temizle
            history.replaceState(null, null, window.location.pathname + window.location.search);
            
            // Sayfa yüklendikten sonra scroll yap
            setTimeout(() => {
                this.scrollToElement(hash, false);
            }, 800);
        }
    }
    
    scrollToElement(elementId, animate = true) {
        if (this.isScrolling) return;
        
        const element = document.getElementById(elementId);
        if (!element) return;
        
        this.isScrolling = true;
        
        const startPosition = window.pageYOffset;
        const targetPosition = element.getBoundingClientRect().top + startPosition - this.mainTopValue;
        const distance = targetPosition - startPosition;
        const startTime = performance.now();
        
        const easeInOutCubic = (t) => {
            return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
        };
        
        const animateScroll = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / this.scrollDuration, 1);
            const easeProgress = easeInOutCubic(progress);
            
            window.scrollTo(0, startPosition + distance * easeProgress);
            
            if (progress < 1) {
                requestAnimationFrame(animateScroll);
            } else {
                this.isScrolling = false;
                
                // Focus'u hedef elemente ver (erişilebilirlik için)
                element.setAttribute('tabindex', '-1');
                element.focus({ preventScroll: true });
                
                // Bir süre sonra tabindex'i kaldır
                setTimeout(() => {
                    element.removeAttribute('tabindex');
                }, 1000);
            }
        };
        
        if (animate) {
            requestAnimationFrame(animateScroll);
        } else {
            window.scrollTo(0, targetPosition);
            this.isScrolling = false;
        }
    }
}

// Sayfa yüklendiğinde başlat
document.addEventListener('DOMContentLoaded', () => {
    new SmoothScrollManager();
});