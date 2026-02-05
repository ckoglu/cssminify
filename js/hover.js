// hover.js
"use strict";
class HoverTooltipManager {
    constructor() {
        this.currentTooltip = null;
        this.hoverTimer = null;
        this.pendingData = null;
        this.lastHoveredElement = null;
        this.lastHoveredText = null;
        this.isTooltipActive = false;
        this.isMouseOverText = false;
        this.scrollTimeout = null;
        this.lastMouseX = 0;
        this.lastMouseY = 0;

        // HTML element kategorileri (constructor içinde tanımlanmalı)
        this.htmlElementTypes = {
            // 1. BELGE YAPISI (Document Structure)
            'document': ['html', 'head', 'body', '!doctype'],
            
            // 2. META VERİ (Metadata)
            'metadata': [
                'title', 'meta', 'link', 'style', 'script', 'noscript', 'base', 'basefont'
            ],
            
            // 3. İÇERİK BÖLÜMLEME (Content Sectioning)
            'sectioning': [
                'div', 'span', 'p', 'br', 'hr', 'wbr', 'main',
                'section', 'article', 'aside', 'nav', 'header', 'footer',
                'address', 'blockquote', 'pre', 'figure', 'figcaption', 'hgroup'
            ],
            
            // 4. METİN İÇERİĞİ (Text Content)
            'heading': ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
            
            // 5. METİN SEMANTİĞİ (Text Semantics)
            'text-semantic': [
                'em', 'strong', 'i', 'b', 'u', 's', 'small', 'mark',
                'sub', 'sup', 'ins', 'del', 'abbr', 'cite', 'dfn',
                'q', 'ruby', 'rt', 'rp', 'bdi', 'bdo', 'time', 'data',
                'var', 'samp', 'kbd', 'output', 'progress', 'meter',
                'code', 'kbd', 'samp', 'var'
            ],
            
            // 6. LİSTELER (Lists)
            'list': [
                'ul', 'ol', 'li', 'dl', 'dt', 'dd', 'menu', 'dir', 'menuitem'
            ],
            
            // 7. TABLOLAR (Tables)
            'table': [
                'table', 'caption', 'colgroup', 'col', 'thead', 'tbody',
                'tfoot', 'tr', 'td', 'th'
            ],
            
            // 8. FORMLAR (Forms)
            'form': [
                'form', 'input', 'textarea', 'select', 'option', 'optgroup',
                'button', 'label', 'fieldset', 'legend', 'datalist',
                'output', 'progress', 'meter', 'keygen'
            ],
            
            // 9. MEDYA (Media)
            'media': [
                'img', 'picture', 'source', 'audio', 'video', 'track',
                'embed', 'object', 'param', 'canvas', 'svg', 'map', 'area',
                'math', 'iframe'
            ],
            
            // 10. ETKİLEŞİM (Interactive)
            'interactive': [
                'a', 'button', 'details', 'summary', 'dialog'
            ],
            
            // 11. WEB COMPONENTS & TEMPLATES
            'web-component': [
                'template', 'slot', 'portal', 'shadow', 'content'
            ],
            
            // 12. SEMANTİK ELEMENTLER (HTML5 Semantic)
            'semantic': [
                'main', 'section', 'article', 'aside', 'nav', 'header',
                'footer', 'figure', 'figcaption', 'mark', 'time', 'data',
                'details', 'summary', 'dialog'
            ],
            
            // 13. KULLANIMI ÖNERİLMEYEN (Deprecated)
            'deprecated': [
                'acronym', 'applet', 'basefont', 'big', 'center', 'dir',
                'font', 'frame', 'frameset', 'isindex', 'listing',
                'marquee', 'multicol', 'nextid', 'noembed', 'plaintext',
                'spacer', 'strike', 'tt', 'xmp'
            ],
            
            // 14. ESKİMİŞ (Obsolete)
            'obsolete': [
                'blink', 'bgsound', 'keygen', 'menuitem', 'nobr',
                'noembed', 'plaintext', 'rb', 'rtc', 'spacer'
            ],
            
            // 15. SVG ELEMENTLERİ
            'svg': [
                'svg', 'circle', 'rect', 'ellipse', 'line', 'polyline',
                'polygon', 'path', 'text', 'g', 'defs', 'symbol', 'use',
                'image', 'clipPath', 'mask', 'pattern', 'filter',
                'feGaussianBlur', 'linearGradient', 'radialGradient'
            ],
            
            // 16. MATHML ELEMENTLERİ
            'mathml': [
                'math', 'mi', 'mo', 'mn', 'ms', 'mtext', 'mspace',
                'msqrt', 'mroot', 'mfrac', 'msub', 'msup', 'msubsup',
                'munder', 'mover', 'munderover', 'mtable', 'mtr', 'mtd'
            ],
            
            // 17. ÖZEL ELEMENTLER (Special)
            'special': [
                'noscript', 'script', 'style', 'link', 'meta', 'base',
                'title', '!doctype', '!--'
            ]
        };

        // Tüm HTML elementlerini al
        this.htmlTags = this.getAllHTMLElements();
        
        // CSS keyword listesi
        this.cssKeywords = new Set([
            'initial', 'inherit', 'unset', 'auto', 'none', 'normal', 'bold', 'italic',
            'underline', 'overline', 'line-through', 'block', 'inline', 'inline-block',
            'flex', 'grid', 'table', 'absolute', 'relative', 'fixed', 'sticky',
            'static', 'hidden', 'visible', 'scroll', 'collapse',
            'row', 'column', 'wrap', 'nowrap', 'center', 'left', 'right', 'justify',
            'start', 'end', 'top', 'middle', 'bottom', 'baseline',
            'solid', 'dashed', 'dotted', 'double', 'groove', 'ridge', 'inset', 'outset',
            'thin', 'medium', 'thick', 'transparent', 'currentcolor',
            'repeat', 'repeat-x', 'repeat-y', 'no-repeat',
            'cover', 'contain', 'pointer', 'cursor', 'wait'
        ]);
        
        this.cssPropertyMap = {};
        this.cssValueMap = {};
        
        this.initializeData();
        this.setupEventListeners();
        
        // Method'ları bind et
        this.handleMouseMove = this.handleMouseMove.bind(this);
        this.showTooltip = this.showTooltip.bind(this);
        this.hideTooltip = this.hideTooltip.bind(this);
        this.handleScroll = this.handleScroll.bind(this);
    }
    
    // Tüm elementleri bir array'de toplamak için yardımcı fonksiyon
    getAllHTMLElements() {
        const allElements = new Set();
        
        for (const category in this.htmlElementTypes) {
            this.htmlElementTypes[category].forEach(element => {
                if (!element.startsWith('!') && !element.startsWith('<!--')) {
                    allElements.add(element.toLowerCase());
                }
            });
        }
        
        return Array.from(allElements);
    }
    
    // Element tipini bulma fonksiyonu
    getElementType(elementName) {
        const lowerElement = elementName.toLowerCase();
        
        for (const [type, elements] of Object.entries(this.htmlElementTypes)) {
            if (elements.map(el => el.toLowerCase()).includes(lowerElement)) {
                const typeDescriptions = {
                    'document': 'Document Structure Element',
                    'metadata': 'Metadata Element',
                    'sectioning': 'Content Sectioning Element',
                    'heading': 'Heading Element',
                    'text-semantic': 'Text Semantic Element',
                    'list': 'List Element',
                    'table': 'Table Element',
                    'form': 'Form Element',
                    'media': 'Media Element',
                    'interactive': 'Interactive Element',
                    'web-component': 'Web Component',
                    'semantic': 'HTML5 Semantic Element',
                    'deprecated': 'Deprecated Element (do not use)',
                    'obsolete': 'Obsolete Element (do not use)',
                    'svg': 'SVG Element',
                    'mathml': 'MathML Element',
                    'special': 'Special Element'
                };
                
                return typeDescriptions[type] || 'HTML Element';
            }
        }
        
        return 'HTML Element';
    }
    
    initializeData() {
        if (window.ko && window.ko.properties) {
            window.ko.properties.forEach(prop => {
                const propName = prop.name.toLowerCase();
                this.cssPropertyMap[propName] = prop;
                
                if (prop.values) {
                    prop.values.forEach(val => {
                        const valName = val.name.toLowerCase();
                        if (!this.cssValueMap[valName]) {
                            this.cssValueMap[valName] = {
                                description: val.description,
                                parentProperty: prop.name
                            };
                        }
                    });
                }
                
                // Vendor prefixes için
                if (propName.startsWith('-webkit-') || propName.startsWith('-moz-') || 
                    propName.startsWith('-ms-') || propName.startsWith('-o-')) {
                    const unprefixed = propName.replace(/^-[a-z]+-/, '');
                    if (!this.cssPropertyMap[unprefixed]) {
                        this.cssPropertyMap[unprefixed] = prop;
                    }
                }
            });
        }
    }
    
    setupEventListeners() {
        const editorDom = document.querySelector(".css-editor-container");
        if (!editorDom) {
            console.warn("Editor container not found");
            return;
        }
        
        // Mousemove throttling
        let lastMoveTime = 0;
        let lastMoveX = 0;
        let lastMoveY = 0;
        
        const handleMouseMove = (event) => {
            const now = Date.now();
            const deltaX = Math.abs(event.clientX - lastMoveX);
            const deltaY = Math.abs(event.clientY - lastMoveY);
            
            if (now - lastMoveTime < 30 && deltaX < 3 && deltaY < 3) {
                return;
            }
            
            lastMoveTime = now;
            lastMoveX = event.clientX;
            lastMoveY = event.clientY;
            
            this.lastMouseX = event.clientX;
            this.lastMouseY = event.clientY;
            
            this.handleMouseMove(event);
        };
        
        editorDom.addEventListener("mousemove", handleMouseMove);
        
        editorDom.addEventListener("mouseleave", (event) => {
            this.isMouseOverText = false;
            
            setTimeout(() => {
                if (!this.isMouseOverText && this.currentTooltip && 
                    !this.currentTooltip.contains(event.relatedTarget)) {
                    this.hideTooltip();
                }
            }, 50);
        });
        
        // Scroll events
        const handleScroll = () => this.handleScroll();
        editorDom.addEventListener('scroll', handleScroll);
        window.addEventListener('scroll', handleScroll, true);
        
        // Click outside to close
        document.addEventListener('click', (event) => {
            if (this.currentTooltip && !this.currentTooltip.contains(event.target)) {
                this.hideTooltip();
            }
        });
    }
    
    handleScroll() {
        if (this.currentTooltip) {
            this.hideTooltip();
        }
        
        if (this.hoverTimer) {
            clearTimeout(this.hoverTimer);
            this.hoverTimer = null;
        }
        
        this.pendingData = null;
    }
    
    handleMouseMove(event) {
        if (this.currentTooltip && this.currentTooltip.contains(event.target)) {
            return;
        }
        
        const wordData = this.getWordFromPoint(event.clientX, event.clientY);
        
        if (!wordData || !wordData.text || wordData.text.length < 1) {
            this.isMouseOverText = false;
            this.hideTooltip();
            return;
        }
        
        const originalText = wordData.text;
        const cleanText = originalText.toLowerCase().replace(/[^a-z0-9\.#@:_-]/g, '');
        
        const type = this.determineWordType(originalText, cleanText);
        
        if (type) {
            this.isMouseOverText = true;
            
            if (this.lastHoveredText === cleanText && this.currentTooltip) {
                if (this.currentTooltip && (Math.abs(this.lastMouseX - event.clientX) > 5 || 
                    Math.abs(this.lastMouseY - event.clientY) > 5)) {
                    this.positionTooltip(this.currentTooltip);
                }
                return;
            }
            
            this.lastHoveredText = cleanText;
            
            this.pendingData = {
                text: originalText,
                cleanText: cleanText,
                type: type,
                elementRect: wordData.rect
            };
            
            if (this.hoverTimer) {
                clearTimeout(this.hoverTimer);
            }
            
            // Arrow function kullanarak this context'ini koru
            this.hoverTimer = setTimeout(() => {
                if (this.pendingData && this.isMouseOverText) {
                    this.showTooltip();
                }
            }, 350);
        } else {
            this.isMouseOverText = false;
            this.hideTooltip();
        }
    }
    
    determineWordType(originalText, cleanText) {
        // 1. CSS selectors
        if (cleanText.match(/^[.#:@\[][a-z0-9_-]+/i) || 
            originalText.startsWith('.') || 
            originalText.startsWith('#') ||
            originalText.startsWith('@') ||
            originalText.startsWith(':') ||
            originalText.startsWith('[')) {
            return 'selector';
        }
        
        // 2. HTML tags
        if (cleanText.match(/^[a-z][a-z0-9]*$/)) {
            if (this.htmlTags.includes(cleanText)) {
                return 'html-tag';
            }
        }
        
        // 3. CSS properties
        const lowerText = originalText.toLowerCase();
        if (this.cssPropertyMap[lowerText]) {
            return 'property';
        }
        
        // 4. CSS values
        if (this.cssValueMap[lowerText]) {
            return 'value';
        }
        
        // 5. CSS keywords
        if (this.cssKeywords.has(lowerText)) {
            return 'value';
        }
        
        // 6. CSS functions
        if (originalText.includes('(') && originalText.includes(')')) {
            return 'css-function';
        }
        
        return null;
    }
    
    getWordFromPoint(x, y) {
        // Fallback DOM method
        let range;
        let text = "";
        let rect = null;
        
        try {
            if (document.caretRangeFromPoint) {
                range = document.caretRangeFromPoint(x, y);
            } else if (document.caretPositionFromPoint) {
                const pos = document.caretPositionFromPoint(x, y);
                if (pos) {
                    range = document.createRange();
                    range.setStart(pos.offsetNode, pos.offset);
                    range.setEnd(pos.offsetNode, pos.offset);
                }
            }
            
            if (range && range.startContainer) {
                const node = range.startContainer;
                const nodeText = node.textContent || "";
                const offset = range.startOffset;
                
                const cssWordChars = /[a-zA-Z0-9\.#@:_-]/;
                
                let start = offset;
                while (start > 0 && cssWordChars.test(nodeText.charAt(start - 1))) {
                    start--;
                }
                
                let end = offset;
                while (end < nodeText.length && cssWordChars.test(nodeText.charAt(end))) {
                    end++;
                }
                
                if (start < end) {
                    text = nodeText.substring(start, end);
                    
                    const newRange = document.createRange();
                    newRange.setStart(node, start);
                    newRange.setEnd(node, end);
                    rect = newRange.getBoundingClientRect();
                }
            }
        } catch (error) {
            console.warn('getWordFromPoint error:', error);
        }
        
        if (!text || text.trim().length === 0) {
            const element = document.elementFromPoint(x, y);
            if (element) {
                text = element.textContent || "";
                rect = element.getBoundingClientRect();
            }
        }
        
        return { text: text.trim(), rect };
    }
    
    showTooltip() {
        if (!this.pendingData) {
            return;
        }
        
        const pending = this.pendingData;
        this.hideTooltip();
        
        const { text, type } = pending;
        const content = this.createTooltipContent(text, type);
        
        if (!content) {
            return;
        }
        
        const tooltip = document.createElement("div");
        tooltip.className = "css-hover-tooltip";
        tooltip.innerHTML = content;
        
        this.positionTooltip(tooltip);
        
        tooltip.addEventListener('mouseenter', () => {
            if (this.hoverTimer) {
                clearTimeout(this.hoverTimer);
                this.hoverTimer = null;
            }
            this.isTooltipActive = true;
        });
        
        tooltip.addEventListener('mouseleave', () => {
            this.isTooltipActive = false;
            setTimeout(() => {
                if (!this.isTooltipActive && this.currentTooltip === tooltip) {
                    this.hideTooltip();
                }
            }, 200);
        });
        
        document.body.appendChild(tooltip);
        this.currentTooltip = tooltip;
        this.isTooltipActive = true;
    }
    
    createTooltipContent(text, type) {
        let description = "", support = "", syntax = "", url = "#";
        let displayText = text;
        
        switch (type) {
            case 'selector':
                if (text.startsWith('.')) {
                    description = `CSS Class: <code>.${text.substring(1)}</code>`;
                    syntax = `<code>&lt;div class="${text.substring(1)}"&gt;</code>`;
                    support = `Specificity: ${this.calculateSpecificity(text)}`;
                } else if (text.startsWith('#')) {
                    description = `CSS ID: <code>#${text.substring(1)}</code>`;
                    syntax = `<code>&lt;div id="${text.substring(1)}"&gt;</code>`;
                    support = `Specificity: ${this.calculateSpecificity(text)}`;
                } else if (text.startsWith(':')) {
                    description = `CSS Pseudo-class: <code>${text}</code>`;
                    syntax = `<code>a${text} { color: blue; }</code>`;
                    support = `Specificity: ${this.calculateSpecificity(text)}`;
                } else if (text.startsWith('@')) {
                    description = `CSS At-rule: <code>${text}</code>`;
                    if (text === '@media') {
                        syntax = 'Media query for responsive design';
                        url = 'https://developer.mozilla.org/en-US/docs/Web/CSS/@media';
                    } else if (text === '@keyframes') {
                        syntax = 'Animation keyframes definition';
                        url = 'https://developer.mozilla.org/en-US/docs/Web/CSS/@keyframes';
                    } else if (text === '@import') {
                        syntax = 'Import external CSS stylesheet';
                        url = 'https://developer.mozilla.org/en-US/docs/Web/CSS/@import';
                    }
                } else {
                    description = `CSS Selector: <code>${text}</code>`;
                    support = `Specificity: ${this.calculateSpecificity(text)}`;
                }
                break;
                
            case 'html-tag':
                description = `HTML Element: <code>&lt;${text}&gt;</code>`;
                support = this.getElementType(text);
                url = `https://developer.mozilla.org/en-US/docs/Web/HTML/Element/${text}`;
                break;
                
            case 'property':
                const propData = this.cssPropertyMap[text.toLowerCase()];
                if (propData) {
                    description = `CSS Property: <code>${propData.name || text}</code>`;
                    syntax = propData.syntax || '';
                    support = propData.description || '';
                    url = propData.references && propData.references[0] ? 
                          propData.references[0].url : 
                          `https://developer.mozilla.org/en-US/docs/Web/CSS/${text}`;
                } else {
                    description = `CSS Property: <code>${text}</code>`;
                    url = `https://developer.mozilla.org/en-US/docs/Web/CSS/${text}`;
                }
                break;
                
            case 'value':
            case 'css-function':
                const valData = this.cssValueMap[text.toLowerCase()];
                if (valData) {
                    description = `CSS Value: <code>${text}</code>`;
                    support = valData.description || '';
                    syntax = `Property: <code>${valData.parentProperty}</code>`;
                    url = `https://developer.mozilla.org/en-US/docs/Web/CSS/${valData.parentProperty}`;
                } else if (text.includes('(')) {
                    description = `CSS Function: <code>${text}</code>`;
                    if (text.startsWith('rgb')) syntax = 'Color function (Red, Green, Blue)';
                    else if (text.startsWith('hsl')) syntax = 'Color function (Hue, Saturation, Lightness)';
                    else if (text.startsWith('calc')) syntax = 'Calculation function';
                    else if (text.startsWith('var')) syntax = 'CSS Custom Property reference';
                    else if (text.startsWith('linear-gradient')) syntax = 'Linear gradient function';
                    else if (text.startsWith('radial-gradient')) syntax = 'Radial gradient function';
                } else if (this.cssKeywords.has(text.toLowerCase())) {
                    description = `CSS Keyword: <code>${text}</code>`;
                    support = 'Standard CSS keyword value';
                }
                break;
        }
        
        if (!description) return null;
        
        return `
        <div class="hover-tooltip-section">
            <p class="tooltip-header">${description}</p>
            ${support ? `<p class="tooltip-info">${support}</p>` : ''}
            ${syntax ? `<p class="tooltip-info">${syntax}</p>` : ''}
            ${url !== '#' ? `<a href="${url}" target="_blank" rel="noopener noreferrer" class="tooltip-link">MDN Reference</a>` : ''}
        </div>`;
    }
    
    calculateSpecificity(selector) {
        let a = 0, b = 0, c = 0;
        
        a = (selector.match(/#[a-z0-9_-]+/gi) || []).length;
        
        b = (selector.match(/\.[a-z0-9_-]+/gi) || []).length;
        b += (selector.match(/\[[^\]]+\]/g) || []).length;
        b += (selector.match(/:(?!:)[a-z0-9_-]+/gi) || []).length;
        
        c = (selector.match(/(^|[ \s\+>~])[a-z][a-z0-9_-]*/gi) || []).length;
        c += (selector.match(/::[a-z0-9_-]+/gi) || []).length;
        
        if (selector.startsWith('.')) b = Math.max(b, 1);
        if (selector.startsWith('#')) a = Math.max(a, 1);
        
        return `(${a}, ${b}, ${c})`;
    }
    
    positionTooltip(tooltip) {
        tooltip.style.visibility = 'hidden';
        tooltip.style.display = 'block';
        document.body.appendChild(tooltip);
        
        const tooltipRect = tooltip.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        
        // Farenin soluna -5px, üstüne +5px
        let left = this.lastMouseX - 5;
        let top = this.lastMouseY + 5;
        
        // Sağa taşma kontrolü
        if (left + tooltipRect.width > viewportWidth - 10) {
            left = viewportWidth - tooltipRect.width - 10;
        }
        
        // Aşağıya taşma kontrolü
        if (top + tooltipRect.height > viewportHeight - 10) {
            top = this.lastMouseY - tooltipRect.height - 10;
        }
        
        // Sola taşma kontrolü
        if (left < 10) {
            left = 10;
        }
        
        // Yukarıya taşma kontrolü
        if (top < 10) {
            top = 10;
        }
        
        tooltip.style.position = 'fixed';
        tooltip.style.left = `${left}px`;
        tooltip.style.top = `${top}px`;
        tooltip.style.visibility = 'visible';
        tooltip.style.zIndex = '10000';
        tooltip.style.pointerEvents = 'auto';
    }
    
    hideTooltip() {
        if (this.hoverTimer) {
            clearTimeout(this.hoverTimer);
            this.hoverTimer = null;
        }
        
        if (this.currentTooltip) {
            this.currentTooltip.remove();
            this.currentTooltip = null;
        }
        
        this.isTooltipActive = false;
        this.pendingData = null;
        this.lastHoveredText = null;
    }
}

// Global instance
window.HoverTooltipManager = HoverTooltipManager;

// Başlatma
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => {
            try {
                const manager = new HoverTooltipManager();
                window.tooltipManager = manager;
            } catch (error) {
                console.error('❌ Failed to initialize hover tooltip manager:', error);
            }
        }, 1000);
    });
} else {
    setTimeout(() => {
        try {
            const manager = new HoverTooltipManager();
            window.tooltipManager = manager;
        } catch (error) {
            console.error('❌ Failed to initialize hover tooltip manager:', error);
        }
    }, 1000);
}