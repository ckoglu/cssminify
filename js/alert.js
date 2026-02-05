function AlertBox(message, type = 'info', duration = 3000) {
    let container = document.getElementById('alertBox');
    if (!container) {
        container = document.createElement('div');
        container.id = 'alertBox';
        document.body.appendChild(container);
    }

    const alertBox = document.createElement('div');
    alertBox.className = `alert-box ${type}`;
    alertBox.innerHTML = `<div class="alertContent"><div class="alertIcon">${getIcon(type)}</div><div class="alertMessage">${message}</div></div>`;
    container.prepend(alertBox);
    requestAnimationFrame(() => {alertBox.classList.add('show');});

    // Otomatik kapanma
    const timeoutId = setTimeout(() => {
        alertBox.classList.remove('show');
        alertBox.addEventListener('transitionend', () => {alertBox.remove();}, { once: true });
    }, duration);

    // Mouse gelince duraklat 
    alertBox.addEventListener('mouseenter', () => clearTimeout(timeoutId));
    alertBox.addEventListener('mouseleave', () => {
        if (alertBox.classList.contains('show')) {
            setTimeout(() => {
                alertBox.classList.remove('show');
                alertBox.addEventListener('transitionend', () => alertBox.remove(), { once: true });
            }, duration);
        }
    });
}

function getIcon(type) {
    const icons = {
        success: '<data data-size="0.9"><i icon="check"></i></data>',
        error: '<data data-size="0.9"><i icon="danger"></i></data>',
        warning: '<data data-size="0.9"><i icon="warning"></i></data>',
        info: '<data data-size="0.9"><i icon="info"></i></data>',
        copy: '<data data-size="0.9"><i icon="copy"></i></data>'
    };
    return icons[type] || icons.info;
}
