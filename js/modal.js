let visibleModal = null;
const isOpenClass = "modal-is-open";
const openingClass = "modal-is-opening";
const closingClass = "modal-is-closing";
const scrollbarWidthCssVar = "--scrollbar-width";
const animationDuration = 300;


const toggleModal = (event) => {
    event.preventDefault();
    const target = event.currentTarget.getAttribute("data-target");

    if (target === "cleanModal") {
        const textarea = document.querySelector('#container div[data-language="css"]');
        if (!textarea) {console.error('Textarea bulunamadı!');return;}
        originalCSS = textarea.innerText;
        if (!originalCSS.trim()) {AlertBox('Lütfen CSS kodu girin!', 'warning');return;}
    }

    if (!target) return;
    const modal = document.getElementById(target);
    if (!modal) return;
    modal && (modal.hasAttribute("open") ? closeModal(modal) : openModal(modal));
};

const openModal = (modal) => {
    const { documentElement: html } = document;
    const scrollbarWidth = getScrollbarWidth();
    if (scrollbarWidth) {
        html.style.setProperty(scrollbarWidthCssVar, `${scrollbarWidth}px`);
    }
    html.classList.add(isOpenClass, openingClass);
    modal.setAttribute("open", "");
    modal.querySelector("article").focus(); // Odak yönetimini ekle
    setTimeout(() => {
        visibleModal = modal;
        html.classList.remove(openingClass);
    }, animationDuration);
};

const closeModal = (modal) => {
    visibleModal = null;
    const { documentElement: html } = document;
    html.classList.add(closingClass);
    setTimeout(() => {
        html.classList.remove(closingClass, isOpenClass);
        html.style.removeProperty(scrollbarWidthCssVar);
        modal.removeAttribute("open");
    }, animationDuration);
};

document.addEventListener("click", (event) => {
    if (visibleModal === null) return;
    const modalContent = visibleModal.querySelector("article");
    const isClickInside = modalContent.contains(event.target);
    const isCloseButton = event.target.classList.contains("close-btn");
    if (!isClickInside || isCloseButton) {
        closeModal(visibleModal);
    }
});

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        const openDropdowns = document.querySelectorAll('details.dropdown[open]');
        //modal kapat
        if (visibleModal){closeModal(visibleModal);}
        // dropdown kapat
        openDropdowns.forEach(dropdown => {dropdown.removeAttribute('open');});
    }

    if (event.key === "Enter" && visibleModal) {
        const primaryBtn = visibleModal.querySelector('footer[role="modal"] button');
        // modal ilk button enter
        if (primaryBtn) {primaryBtn.click();}
    }

    if (event.key === "Delete") {
        const activeElement = document.activeElement;
        const tagName = activeElement.tagName.toLowerCase();
        const isContentEditable = activeElement.hasAttribute('contenteditable') &&  activeElement.getAttribute('contenteditable') === 'true';
        
        // İzin verilmeyen element türleri
        const isForbidden = 
            activeElement.id === 'cssEditor' ||
            tagName === 'textarea' ||
            tagName === 'input' ||
            isContentEditable ||
            (activeElement.closest('#cssEditor') !== null);
        
        // Eğer izin verilen bir elementteysek devam et
        if (!isForbidden) {
            const modal = document.getElementById("cleanModal");
            if (modal && !modal.hasAttribute("open")) {
                // CSS kontrolü yap
                const textarea = document.querySelector('#container div[data-language="css"]');
                if (textarea) {
                    originalCSS = textarea.innerText;
                    if (!originalCSS.trim()) {return;}
                }
                openModal(modal);
            }
        }
    }

});

const getScrollbarWidth = () => {
    return window.innerWidth > document.documentElement.clientWidth ? window.innerWidth - document.documentElement.clientWidth : 0;
};