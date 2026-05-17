function patchLapisCV() {
    // this way is too persistent; that's why still writing directly in css file

    var _body = document.querySelector('body');
    _body.style.setProperty('--default-font', 'sans-serif');

    var style = document.createElement('style');
    style.innerHTML = `
    h2, .markdown-rendered h2 {
        font-family: var(--default-font);
    }`.trim();
    document.head.appendChild(style);
}

// patchLapisCV();
