/** generate.js */

// Global değişkenler
let originalCSS = '';
let minifiedCSS = '';
let cssRules = []; // Artık recursive tree yapısında olacak
let Comments = true;
let selectedMode = 'line'; // 'line', 'multiline', veya 'format'
let fileInput = null;
const editor = document.querySelector('.css-content[data-language="css"]');
const editorContainer = document.querySelector('.css-scroller');
const html = document.documentElement;

// Basit ve güvenilir CSS parser
function parseCSSRules(cssText) {
    const rules = [];
    let i = 0;
    let buffer = '';
    
    while (i < cssText.length) {
        // Yorum yakala (/* ... */)
        if (cssText[i] === '/' && i + 1 < cssText.length && cssText[i + 1] === '*') {
            const commentStart = i;
            i += 2;
            while (i < cssText.length && !(cssText[i] === '*' && i + 1 < cssText.length && cssText[i + 1] === '/')) {
                i++;
            }
            if (i < cssText.length) i += 2; // */ geç
            const comment = cssText.substring(commentStart, i);
            rules.push({ type: 'comment', content: comment });
            buffer = ''; // Yorumdan sonra buffer sıfırla
            continue;
        }
        
        // @ kurallarını yakala (değişmedi)
        if (cssText[i] === '@') {
            let end = i;
            let braceCount = 0;
            
            while (end < cssText.length) {
                if (cssText[end] === '{') braceCount++;
                if (cssText[end] === '}') {
                    braceCount--;
                    if (braceCount === 0) {
                        end++;
                        break;
                    }
                }
                if (braceCount === 0 && cssText[end] === ';') {
                    end++;
                    break;
                }
                end++;
            }
            
            const rule = cssText.substring(i, end).trim();
            if (rule.includes('{')) {
                rules.push({ type: 'at-rule-complex', content: rule });
            } else {
                rules.push({ type: 'at-rule-simple', content: rule });
            }
            
            i = end;
            buffer = '';
            continue;
        }
        
        // Normal kuralları yakala
        if (cssText[i] === '{') {
            const selector = buffer.trim();
            buffer = '';
            let end = i + 1;
            let braceCount = 1;
            
            while (end < cssText.length && braceCount > 0) {
                if (cssText[end] === '{') braceCount++;
                if (cssText[end] === '}') braceCount--;
                end++;
            }
            
            const content = cssText.substring(i + 1, end - 1).trim();
            rules.push({
                type: 'normal-rule',
                selector: selector,
                properties: content
            });
            
            i = end;
            buffer = '';
            continue;
        }
        
        buffer += cssText[i];
        i++;
    }
    
    return rules;
}

// CSS minify
function minifyCSS() {
    originalCSS = getCSS();

    if (!originalCSS.trim()) {
        AlertBox('Lütfen CSS kodu girin!', 'warning');
        return;
    }
    
    try {
        // Parse CSS
        cssRules = parseCSSRules(originalCSS);
        minifiedCSS = cleanMinifiedCSS(minifiedCSS);
        // Editöre yükle (zaten container'a yazıyoruz)
        editor.textContent = minifiedCSS;
        const statsSection = document.getElementById('report-css-container');
        if (statsSection) statsSection.classList.remove("hidden");
        // Güncellemeler
        updateButtonsHide();
        updateComments();
        
        setTimeout(reportCSS, 50);
    } catch (error) {
        console.error('Minify hatası:', error);
        console.error('Stack trace:', error.stack);
        AlertBox('Minify hatası: ' + error.message, 'error');
    }
}

function removeComments(text) {
    let result = '';
    let i = 0;
    while (i < text.length) {
        if (text[i] === '/' && text[i + 1] === '*') {
            i += 2;
            while (i < text.length && !(text[i] === '*' && text[i + 1] === '/')) {
                i++;
            }
            if (i < text.length) i += 2;
        } else {
            result += text[i];
            i++;
        }
    }
    return result;
}

// Satır satır minify
function minifyLineByLine(rules) {
    const result = [];
    for (let i = 0; i < rules.length; i++) {
        const rule = rules[i];
        switch (rule.type) {
            case 'comment':
                if (Comments) {result.push(rule.content);}
                break;
            case 'at-rule-simple':
                result.push(minifySimpleAtRule(rule.content));
                break;
            case 'at-rule-complex':
                const minifiedAtRule = minifyComplexAtRule(rule.content, true);
                result.push(minifiedAtRule);
                break;
            case 'normal-rule':
                // Selector'daki fazla boşlukları temizle
                const cleanSelector = rule.selector.replace(/\s+/g, ' ').replace(/\s*,\s*/g, ', ');
                const minifiedProps = minifyProperties(rule.properties);
                const minifiedRule = cleanSelector + '{' + minifiedProps + '}';
                result.push(minifiedRule);
                break;
        }
    }
    const finalResult = result.join('\n');
    return finalResult;
}

// Tek satır minify
function minifySingleLine(rules) {
    const result = [];
    for (let i = 0; i < rules.length; i++) {
        const rule = rules[i];
        switch (rule.type) {
            case 'comment':
                if (Comments) {result.push(rule.content.replace(/\s+/g, ' '));}
                break;
            case 'at-rule-simple':
                result.push(minifySimpleAtRule(rule.content));
                break;
            case 'at-rule-complex':
                const minifiedAtRule = minifyComplexAtRule(rule.content, false);
                result.push(minifiedAtRule);
                break;
            case 'normal-rule':
                // Selector'daki fazla boşlukları temizle
                const cleanSelector = rule.selector.replace(/\s+/g, ' ').replace(/\s*,\s*/g, ', ');
                const minifiedProps = minifyProperties(rule.properties);
                result.push(cleanSelector + '{' + minifiedProps + '}');
                break;
        }
    }
    return result.join('');
}

// Basit @ kuralı minify
function minifySimpleAtRule(content) {
    return content.replace(/\s+/g, ' ').trim();
}

// Karmaşık @ kuralı minify )
function minifyComplexAtRule(content, lineByLine) {
    // @ kuralını parçala
    const atMatch = content.match(/^(@[^{]+)\{([\s\S]+)\}$/);
    if (!atMatch) {return minifyCSSContent(content);}
    const atPart = atMatch[1].trim();
    let innerContent = atMatch[2].trim();
    if (!Comments) {innerContent = removeComments(innerContent);}
    // İç içe @ kuralları için özel işleme
    if (innerContent.includes('@')) {return minifyNestedAtRule(atPart, innerContent, lineByLine);}
    // Normal içerik minify
    const minifiedInner = minifyProperties(innerContent);
    if (lineByLine) {
        // Satır satır modda iç kuralları ayrı satırlara yaz
        if (innerContent.includes('{') && innerContent.includes('}')) {
            // İçinde kurallar var
            const innerRules = extractInnerRules(innerContent);
            let result = atPart + ' {\n';
            innerRules.forEach(innerRule => {
                // Selector'daki boşlukları temizle
                const cleanSelector = innerRule.selector.replace(/\s+/g, ' ').replace(/\s*,\s*/g, ', ');
                const props = minifyProperties(innerRule.properties);
                result += '    ' + cleanSelector + '{' + props + '}\n';
            });
            result += '}';
            return result;
        } else {
            // Sadece properties var
            return atPart + '{' + minifiedInner + '}';
        }
    } else {
        // Tek satır mod - içeriği tamamen minify et
        if (innerContent.includes('{') && innerContent.includes('}')) {
            // İç kuralları tek satırda birleştir
            const innerRules = extractInnerRules(innerContent);
            let innerResult = '';
            innerRules.forEach(innerRule => {
                // Selector'daki boşlukları temizle
                const cleanSelector = innerRule.selector.replace(/\s+/g, ' ').replace(/\s*,\s*/g, ', ');
                const props = minifyProperties(innerRule.properties);
                innerResult += cleanSelector + '{' + props + '}';
            });
            return atPart + '{' + innerResult + '}';
        } else {
            // Sadece properties var
            return atPart + '{' + minifiedInner + '}';
        }
    }
}

// İç içe @ kuralları minify
function minifyNestedAtRule(atPart, innerContent, lineByLine) {
    // İçerikteki kuralları çıkar
    const innerRules = extractInnerRules(innerContent);
    if (lineByLine) {
        let result = atPart + ' {\n';
        innerRules.forEach(rule => {
            if (rule.selector.startsWith('@')) {
                // İç @ kuralı
                const innerAtMatch = rule.selector.match(/^(@[^{]+)/);
                if (innerAtMatch) {
                    const innerAtPart = innerAtMatch[1].trim();
                    const innerProps = minifyProperties(rule.properties);
                    result += '    ' + innerAtPart + '{\n';
                    // İç @ kuralının içindeki kurallar
                    const deepestRules = extractInnerRules(rule.properties);
                    deepestRules.forEach(deepestRule => {
                        const deepestProps = minifyProperties(deepestRule.properties);
                        result += '        ' + deepestRule.selector + '{' + deepestProps + '}\n';
                    });
                    result += '    }\n';
                }
            } else {
                // Normal kural
                const props = minifyProperties(rule.properties);
                result += '    ' + rule.selector + '{' + props + '}\n';
            }
        });
        result += '}';
        return result;
    } else {
        // Tek satır mod
        let innerResult = '';
        innerRules.forEach(rule => {
            if (rule.selector.startsWith('@')) {
                // İç @ kuralı
                const innerAtMatch = rule.selector.match(/^(@[^{]+)/);
                if (innerAtMatch) {
                    const innerAtPart = innerAtMatch[1].trim();
                    const innerProps = minifyProperties(rule.properties);
                    // İç @ kuralının içindeki kurallar
                    const deepestRules = extractInnerRules(rule.properties);
                    let deepestResult = '';
                    deepestRules.forEach(deepestRule => {
                        const deepestProps = minifyProperties(deepestRule.properties);
                        deepestResult += deepestRule.selector + '{' + deepestProps + '}';
                    });
                    innerResult += innerAtPart + '{' + deepestResult + '}';
                }
            } else {
                // Normal kural
                const props = minifyProperties(rule.properties);
                innerResult += rule.selector + '{' + props + '}';
            }
        });
        return atPart + '{' + innerResult + '}';
    }
}
// İç kuralları çıkar
function extractInnerRules(content) {
    const rules = [];
    let i = 0;
    let inString = false;
    let stringChar = '';
    let braceDepth = 0;
    let inSelector = true;
    let currentSelector = '';
    let currentContent = '';
    
    while (i < content.length) {
        const char = content[i];
        
        // String kontrolü
        if (char === '"' || char === "'") {
            if (!inString) {
                inString = true;
                stringChar = char;
            } else if (char === stringChar && content[i - 1] !== '\\') {
                inString = false;
            }
        }
        
        if (!inString) {
            if (char === '{') {
                braceDepth++;
                if (braceDepth === 1) {
                    // Selector bitti, içerik başlıyor
                    inSelector = false;
                    i++;
                    continue;
                }
            } else if (char === '}') {
                braceDepth--;
                if (braceDepth === 0) {
                    // Kural bitti
                    rules.push({
                        selector: currentSelector.trim(),
                        properties: currentContent.trim()
                    });
                    
                    // Sıfırla
                    currentSelector = '';
                    currentContent = '';
                    inSelector = true;
                    i++;
                    continue;
                }
            }
        }
        
        if (inSelector) {
            currentSelector += char;
        } else {
            if (braceDepth > 0 || (char !== '}' && braceDepth === 0)) {
                currentContent += char;
            }
        }
        
        i++;
    }
    return rules.filter(rule => rule.selector && rule.properties);
}

// Minify işleminden sonra temizlik fonksiyonu
function cleanMinifiedCSS(css) {
    let result = css;
    // 1. `&amp;` yerine `&` koy
    result = result.replace(/&amp;/g, '&');
    // 2. Seçicilerdeki `>;` hatalarını düzelt
    result = result.replace(/>\s*;\s*/g, '>');
    // 3. Boş `;{}` bloklarını temizle
    result = result.replace(/;\s*\{\s*\}/g, '');
    // 4. @ kuralları içindeki fazladan `;` karakterlerini temizle
    result = result.replace(/(@[^{]+)\{([^}]+);\s*\}/g, '$1{$2}');
    
    // 5. Girinti sorunlarını düzelt (iç kurallar için 8 boşluk)
    const lines = result.split('\n');
    let inAtRule = 0;
    const cleanedLines = lines.map(line => {
        const trimmed = line.trim();
        // Kural başlangıcı
        if (trimmed.includes('{') && !trimmed.includes('}')) {inAtRule++;}
        // Kural sonu
        if (trimmed.includes('}') && !trimmed.includes('{')) {inAtRule = Math.max(0, inAtRule - 1);}
        // İç kural ise (at-rule içinde ve normal kural)
        if (inAtRule > 0 && trimmed && 
            !trimmed.startsWith('@') && 
            trimmed.includes('{') && 
            trimmed.includes('}')) {
            // Girinti ekle (her seviye için 4 boşluk)
            const indent = ' '.repeat(inAtRule * 4);
            return indent + trimmed;
        } 
        return line;
    });
    return cleanedLines.join('\n');
}

// Properties minify
function minifyProperties(properties) {
    if (!properties) return '';
    // Önce seçicilerdeki `>` karakterini koruyalım
    let result = properties;
    if (!Comments) {result = removeComments(result);}
    // Property'leri ayır ve işle - seçicileri koru
    const propList = [];
    let currentProp = '';
    let inSelector = false;
    let braceDepth = 0;
    
    for (let i = 0; i < result.length; i++) {
        const char = result[i];
        if (char === '{') {
            inSelector = false;
            braceDepth++;
            currentProp += char;
        } else if (char === '}') {
            braceDepth--;
            currentProp += char;
        } else if (char === ';' && braceDepth === 1) {
            // Sadece en düzeydeki ; karakterlerini property ayırıcı olarak kabul et
            propList.push(currentProp.trim());
            currentProp = '';
        } else {
            currentProp += char;
        }
    }
    
    // Son property'i ekle
    if (currentProp.trim()) {propList.push(currentProp.trim());}
    const minifiedProps = propList.map(prop => {
        const trimmed = prop.trim();
        if (!trimmed) return '';
        
        // Seçiciyi koru (içinde : olabilir ama property değildir)
        if (!trimmed.includes(':') || trimmed.endsWith('{') || trimmed.startsWith('@')) {return trimmed;}
        const colonIndex = trimmed.indexOf(':');
        if (colonIndex === -1) return trimmed;
        const name = trimmed.substring(0, colonIndex).trim();
        let value = trimmed.substring(colonIndex + 1).trim();
        // Value minify
        value = minifyCSSValue(value);
        return name + ':' + value;
    }).filter(p => p); 
    const finalResult = minifiedProps.join(';');
    return finalResult;
}

// CSS değeri minify
function minifyCSSValue(value) {
    let result = value;
    // Fazla boşlukları kaldır
    result = result.replace(/\s+/g, ' ');
    // RGB'yi hex'e çevir
    result = result.replace(/rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/gi, function(match, r, g, b) {
        const toHex = (n) => {
            const hex = parseInt(n).toString(16).padStart(2, '0');
            return hex;
        };
        return '#' + toHex(r) + toHex(g) + toHex(b);
    });
    // 0px -> 0
    result = result.replace(/(^|\s|,)0(px|em|rem|%|vw|vh|vmin|vmax)\b/gi, '$10');
    // 0.5 -> .5
    result = result.replace(/(^|\s|,)0\.(\d+)/g, '$1.$2');
    // Parantez içindeki boşlukları kaldır
    result = result.replace(/\(\s+/g, '(');
    result = result.replace(/\s+\)/g, ')');
    result = result.replace(/,\s+/g, ',');
    return result.trim();
}

// CSS içeriği minify
function minifyCSSContent(content) {return content
    .replace(/\s+/g, ' ')
    .replace(/\s*{\s*/g, '{')
    .replace(/\s*}\s*/g, '}')
    .replace(/\s*;\s*/g, ';')
    .replace(/\s*:\s*/g, ':')
    .replace(/\s*,\s*/g, ',')
    .replace(/;}/g, '}')
    .trim();
}

// Editörü temizle (gelişmiş versiyon)
function clearEditor() {
    // Değişim: container'dan al
    if (!editor) {
        console.error('Editor bulunamadı!');
        return;
    }
    editor.style.minHeight = "200px";
    if (!originalCSS.trim()) {return;}

    try {
        // Görünümü sıfırla
        const inputSection = document.querySelector('.code-section:first-of-type');
        const statsSection = document.getElementById('report-css-container');

        if (inputSection) { inputSection.classList.remove("hidden"); }
        if (statsSection) { statsSection.classList.add("hidden"); }

        // Değişim: Sadece editor'ı temizle
        if (editor) {
            editor.textContent = '';
            editor.innerHTML = '';
        }
        
        // İstatistikleri temizle
        const statsList = document.getElementById('statsList');
        if (statsList) { statsList.innerHTML = ''; }
        updateButtonsHide();
        originalCSS = '';
        minifiedCSS = '';
        cssRules = [];
        Comments = true;
        closeCleanModal();
  
        const storedData = localStorage.getItem('css-minify');
        if (storedData) {
            const parsed = JSON.parse(storedData);
            if (parsed) {
                delete parsed.css;
                delete parsed.original;
                delete parsed.lineByLine;
                delete parsed.Comments;
                if (Object.keys(parsed).length === 0) {
                    localStorage.removeItem('css-minify');
                } else {
                    localStorage.setItem('css-minify', JSON.stringify(parsed));
                }
            }
        }
        
        AlertBox('Editör temizlendi!', 'info');
    } catch (error) {
        console.error('Clear editor error:', error);
        console.error('Stack trace:', error.stack);
        AlertBox('Temizleme hatası: ' + error.message, 'error');
    }
}

// Scroll kontrol fonksiyonu
function initializeEditorScroll() {
    if (!editorContainer || !editor) {
        console.warn('Editor container veya editor bulunamadı');
        return;
    }

    // Scroll özelliklerini zorla uygula
    editorContainer.style.overflowY = 'auto';
    editorContainer.style.overflowX = 'hidden';
    editorContainer.style.display = 'block';
    
    // İçerik yüksekliğini ayarla
    function updateScrollHeight() {
        const contentHeight = editor.scrollHeight;
        const containerHeight = editorContainer.clientHeight;
        if (contentHeight > containerHeight) {
            editorContainer.style.overflowY = 'scroll';
        } else {
            editorContainer.style.overflowY = 'auto';
        }
        // Editor'ün min yüksekliğini ayarla
        const newHeight = Math.max(200, contentHeight);
        editor.style.minHeight = newHeight + 'px';
    }
    
    // İlk yüklemeyi yap
    updateScrollHeight();
    
    // MutationObserver - DÜZENLENMİŞ VERSİYON
    const observer = new MutationObserver(function(mutations) {
        // Kullanıcı scroll yapmıyorsa ve cursor görünür değilse
        if (!isUserScrolling) {
            // Scroll pozisyonunu güncelle ama cursor'ı takip et
            updateScrollHeight();
            
            // Cursor'ın görünür kalmasını sağla
            const sel = window.getSelection();
            if (sel.rangeCount > 0) {
                const range = sel.getRangeAt(0);
                const rect = range.getBoundingClientRect();
                const containerRect = editorContainer.getBoundingClientRect();
                
                // Cursor container içinde görünür mü?
                if (rect.top < containerRect.top || rect.bottom > containerRect.bottom) {
                    // Cursor görünmüyorsa, biraz bekleyip düzelt
                    setTimeout(() => {
                        const newRange = sel.getRangeAt(0);
                        const newRect = newRange.getBoundingClientRect();
                        
                        if (newRect.top < containerRect.top) {
                            editorContainer.scrollTop -= (containerRect.top - newRect.top) + 20;
                        } else if (newRect.bottom > containerRect.bottom) {
                            editorContainer.scrollTop += (newRect.bottom - containerRect.bottom) + 20;
                        }
                    }, 50);
                }
            }
        }
    });
    
    observer.observe(editor, {
        childList: true,
        subtree: true,
        characterData: true
    });
    
    // Input event'lerini dinle - scroll pozisyonunu koru
    editor.addEventListener('input', function() {
        // Input sırasında scroll pozisyonunu koru
        requestAnimationFrame(() => {
            updateScrollHeight();
        });
    });
    
    // Window resize
    window.addEventListener('resize', function() {setTimeout(updateScrollHeight, 100);});
    // Editörü tıklanabilir yap
    editor.setAttribute('tabindex', '0');
    editor.style.outline = 'none';
    return updateScrollHeight;
}

// Cursor takip sistemi
let cursorTracker = {
    lastKnownPosition: 0,
    lastKnownScroll: 0,
    isTracking: false
};

function trackCursor() {
    const sel = window.getSelection();
    if (sel.rangeCount > 0 && editor.contains(sel.anchorNode)) {
        const range = sel.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        const containerRect = editorContainer.getBoundingClientRect();
        cursorTracker = {
            lastKnownPosition: editorContainer.scrollTop + (rect.top - containerRect.top),
            lastKnownScroll: editorContainer.scrollTop,
            isTracking: true
        };
    }
}

function restoreCursorPosition() {
    if (cursorTracker.isTracking) {
        requestAnimationFrame(() => {
            editorContainer.scrollTop = cursorTracker.lastKnownScroll;
            cursorTracker.isTracking = false;
        });
    }
}

// Editör event'lerine cursor takibi ekle
document.addEventListener('selectionchange', trackCursor);

// Smooth scroll fonksiyonu
function smoothScrollToBottom() {
    const editorContainer = document.querySelector('.css-scroller');
    if (!editorContainer) return;
    
    const start = editorContainer.scrollTop;
    const end = editorContainer.scrollHeight - editorContainer.clientHeight;
    const duration = 300;
    const startTime = performance.now();
    
    function scrollStep(timestamp) {
        const elapsed = timestamp - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Ease in-out fonksiyonu
        const ease = progress < 0.5 ? 2 * progress * progress : -1 + (4 - 2 * progress) * progress;
        editorContainer.scrollTop = start + (end - start) * ease;
        if (progress < 1) {requestAnimationFrame(scrollStep);}
    }

    requestAnimationFrame(scrollStep);
}

function closeCleanModal() {
    const modal = document.getElementById('cleanModal');
    if (modal && typeof toggleModal === 'function') {
        // toggleModal fonksiyonu modal.js'den geliyor
        // Ancak toggleModal event beklediği için manuel kapatma yapalım
        if (modal.hasAttribute('open')) {
            modal.close();
            modal.removeAttribute('open');
            // Modal.js'in kapatma animasyonunu tetikle
            const { documentElement: html } = document;
            const closingClass = 'modal-is-closing';
            const isOpenClass = 'modal-is-open';
            html.classList.add(closingClass);
            
            setTimeout(() => {
                html.classList.remove(closingClass, isOpenClass);
                html.style.removeProperty('--scrollbar-width');
            }, 200);
        }
    }
}

// Formatla butonu için düzgün formatlama fonksiyonu
function formatCSS(css) {
    originalCSS = css;
    
    if (!originalCSS.trim()) {
        AlertBox('Lütfen CSS kodu girin!', 'warning');
        return;
    }

    try {
        // CSS'i parse et (yorumlar artık rule olarak geliyor)
        cssRules = parseCSSRules(originalCSS);
        let formatted = '';
        
        // Her kuralı düzgün formatta işle
        cssRules.forEach((rule, index) => {
            switch (rule.type) {
                case 'comment':
                    if (Comments) {formatted += rule.content + '\n\n';}
                    break;
                case 'at-rule-simple':
                    formatted += rule.content + '\n\n';
                    break;
                case 'at-rule-complex':
                    const atMatch = rule.content.match(/^(@[^{]+)\{([\s\S]+)\}$/);
                    if (atMatch) {
                        const atPart = atMatch[1].trim();
                        let innerContent = atMatch[2].trim();
                        formatted += atPart + ' {\n';
                        if (innerContent.includes('{') && innerContent.includes('}')) {
                            const innerRules = extractInnerRules(innerContent);
                            innerRules.forEach(innerRule => {
                                formatted += '    ' + innerRule.selector + ' {\n';
                                const props = formatProperties(innerRule.properties);
                                props.forEach(prop => {formatted += '        ' + prop + '\n';});
                                formatted += '    }\n';
                            });
                        } else {
                            const props = formatProperties(innerContent);
                            props.forEach(prop => {formatted += '    ' + prop + '\n';});
                        }
                        formatted += '}\n\n';
                    } else {
                        formatted += rule.content + '\n\n';
                    }
                    break;
                case 'normal-rule':
                    formatted += rule.selector + ' {\n';
                    const props = formatProperties(rule.properties);
                    props.forEach(prop => {formatted += '  ' + prop + '\n';});
                    formatted += '}\n\n';
                    break;
            }
        });
        
        // Editöre yükle
        if (editor) {editor.textContent = formatted.trim();}
        
        // Görünümü değiştir
        const inputSection = document.querySelector('.code-section:first-of-type');
        const editorSection = document.getElementById('editorSection');
        const statsSection = document.getElementById('report-css-container');

        if (inputSection) inputSection.classList.add("hidden");
        if (editorSection) editorSection.classList.remove("hidden");
        if (statsSection) statsSection.classList.remove("hidden");

        // Güncellemeler
        updateButtonsHide();
        updateComments();
        
        setTimeout(reportCSS, 50);
        SaveCSSToLocal(false);
    } catch (error) {
        console.error('Format error:', error);
        console.error('Stack trace:', error.stack);
        AlertBox('Formatlama hatası: ' + error.message, 'error');
    }
}

function formatCSSContent(css) {
    let result = '';
    let indent = 0;
    let inRule = false;
    const lines = css.split('\n');
    for (let line of lines) {
        const trimmed = line.trim();
        if (!trimmed) {
            result += '\n';
            continue;
        }
        // Yorum satırları
        if (trimmed.startsWith('/*')) {
            result += ' '.repeat(indent * 4) + trimmed + '\n';
            continue;
        }
        // @ kuralları
        if (trimmed.startsWith('@')) {
            result += ' '.repeat(indent * 4) + trimmed + '\n';
            if (trimmed.includes('{')) indent++;
            continue;
        }
        // Kural sonu
        if (trimmed === '}') {
            indent = Math.max(0, indent - 1);
            result += ' '.repeat(indent * 4) + trimmed + '\n';
            continue;
        }
        // Kural başlangıcı
        if (trimmed.includes('{') && !trimmed.includes('}')) {
            result += ' '.repeat(indent * 4) + trimmed + '\n';
            indent++;
            continue;
        }
        // Property
        if (trimmed.includes(':')) {
            result += ' '.repeat(indent * 4) + trimmed + '\n';
            continue;
        }
        result += ' '.repeat(indent * 4) + trimmed + '\n';
    }
    return result.trim();
}

// CSS'i indir (gelişmiş versiyon)
function downloadCSS() {
    if (!editor) {AlertBox('CSS bulunamadı!', 'warning');return;}
    // Kopyalanacak metni hazırla
    const cssText = getCSS();
    try {
        // Dosya adını oluştur
        const timestamp = new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-');
        const filename = `css-styles-${timestamp}.css`;
        // Dosya içeriğini hazırla (header ekleyebiliriz)
        const fileContent = `/* 
 * CSS
 * Generated: ${new Date().toISOString()}
 * Original size: ${originalCSS.length} bytes
 * Minified size: ${cssText.length} bytes
 * Compression: ${originalCSS.length > 0 ? Math.round((1 - (cssText.length / originalCSS.length)) * 100) : 0}%
 */
${cssText}`;
        
        // Blob oluştur ve indir
        const blob = new Blob([fileContent], { type: 'text/css' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        // Görünmez yap ve tıkla
        a.classList.add("hidden");
        document.body.appendChild(a);
        a.click();
        // Temizle
        setTimeout(() => {
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }, 100);
        AlertBox(`CSS dosyası indirildi: ${filename}`, 'success');
    } catch (error) {
        console.error('Download error:', error);
        console.error('Stack trace:', error.stack);
        AlertBox('İndirme hatası: ' + error.message, 'error');
    }
}

// CSS'i kopyala (gelişmiş versiyon)
function copyCSS() {
    if (!editor) {AlertBox('CSS bulunamadı!', 'warning');return;}
    // Kopyalanacak metni hazırla
    const textToCopy = getCSS();
    // Modern clipboard API kullan
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(textToCopy).then(() => {
                AlertBox('CSS panoya kopyalandı!', 'copy');
            }).catch(err => {
                console.error('Clipboard API error:', err);
                // Fallback: eski yöntem
                AlertBox('Clipboard API error', 'danger');
            });
    } else {
        // Fallback: eski yöntem
        AlertBox('Clipboard nesnesi yok! ', 'danger');
    }
}

// Properties'leri formatla (her property ayrı satırda)
function formatProperties(properties) {
    if (!properties) return [];
    const propList = properties.split(';').filter(p => p.trim());
    const formattedProps = propList.map(prop => {
        const trimmed = prop.trim();
        if (!trimmed) return '';
        const colonIndex = trimmed.indexOf(':');
        if (colonIndex === -1) return trimmed + ';';
        const name = trimmed.substring(0, colonIndex).trim();
        const value = trimmed.substring(colonIndex + 1).trim();
        return name + ': ' + value + ';';
    }).filter(p => p);
    return formattedProps;
}

// ============================================
// FILE UPLOAD & URL LOAD FUNCTIONS
// ============================================

/**
 * URL'den CSS dosyası yükler
 */
function loadCSSFromURL() {
    const urlInput = document.getElementById('cssUrl');
    if (!urlInput) {return;}
    const url = urlInput.value.trim();
    if (!url) {
        AlertBox('Lütfen bir URL girin!', 'warning');
        urlInput.focus();
        return;
    }
    
    // URL validasyonu
    try {
        new URL(url);
    } catch (error) {
        AlertBox('Geçersiz URL formatı!', 'error');
        urlInput.focus();
        return;
    }
    // Yükleme durumunu göster
    showURLLoadingState(url);
    // CORS proxy kullanarak dosyayı yükle
    const proxyUrl = 'https://proxy.ckoglu.workers.dev/?url=';
    const fetchUrl = proxyUrl + encodeURIComponent(url);
    
    fetch(fetchUrl)
        .then(response => {
            // console.log("Fetch response status:", response.status);
            if (!response.ok) {throw new Error(`HTTP ${response.status}: ${response.statusText}`);}
            return response.text();
            
        })
        .then(cssContent => {
            // console.log("CSS başarıyla yüklendi, uzunluk:", cssContent.length);
            processLoadedCSS(cssContent, url);
            updateButtonsHide();
        })
        .catch(error => {
            console.error('URL yükleme hatası:', error);
            showURLErrorState(error.message, url);
        });
        
        setTimeout(reportCSS, 50);
}

/**
 * URL yükleme durumunu gösterir
 */
function showURLLoadingState(url) {
    document.getElementById('urlLoading').classList.remove("hidden");
    document.getElementById('loadingUrl').textContent = url + ' yükleniyor...';
}

/**
 * URL hata durumunu gösterir
 */
function showURLErrorState(errorMessage, url) {
    document.getElementById('urlLoading').classList.add("hidden");
    document.getElementById('urlError').classList.remove("hidden");
    document.getElementById('errorMessage').innerHTML = '<b>Hata:</b> ' + errorMessage;
}

/**
 * Yüklenen CSS'i işler
 */
// CSS'i yükledikten sonra scroll ayarı
function processLoadedCSS(cssContent, url) {
  
    if (editor && editorContainer) {
        editor.textContent = cssContent;
        originalCSS = cssContent;
        
        // Scroll'u güncelle
        setTimeout(function() {
            window.updateEditorScroll();
            editorContainer.scrollTop = 0;
        }, 100);
        
        // Modal'ı kapat
        const modal = document.getElementById('urlModal');
        if (modal) { modal.close(); }
        
        // Başarı mesajı
        const fileName = getFileNameFromURL(url);
        AlertBox(`${fileName} başarıyla yüklendi!`, 'success');
        SaveCSSToLocal(true);
        setTimeout(reportCSS, 100);
    }
}

/**
 * URL modalını sıfırlar
 */
function resetURLModal() {
    document.getElementById('urlError').classList.add("hidden");
    document.getElementById('urlLoading').classList.add("hidden");
    document.getElementById('urlForm').classList.remove("hidden");
    document.getElementById('cssUrl').value = '';
    document.getElementById('cssUrl').focus();
    updateButtonsHide();
}

/**
 * URL'den dosya adını alır
 */
function getFileNameFromURL(url) {
    const urlParts = url.split('/');
    const fileName = urlParts[urlParts.length - 1] || 'styles.css';
    return fileName.replace('.css', '').replace('.min', '');
}

/**
 * Dosya input'unu tetikler
 */
function triggerFileInput() {
    if (!fileInput) {fileInput = document.getElementById('cssFileInput');}
    if (fileInput) {fileInput.click();}
}

/**
 * Dosya seçimi işleyici
 */
function handleFileSelect(event) {
    if (event.target.files && event.target.files.length > 0) {
        const file = event.target.files[0];
        processUploadedFile(file);
    }
}

/**
 * Yüklenen dosyayı işler
 */
// Dosya yükleme sonrası scroll
function processUploadedFile(file) {
    // Dosya türü kontrolü
    if (!file.name.endsWith('.css') && file.type !== 'text/css') {
        AlertBox('Sadece CSS dosyaları yüklenebilir (.css uzantılı)', 'warning');
        return;
    }
    
    // Dosyayı oku
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const cssContent = e.target.result;
            
            if (editor && editorContainer) {
                editor.textContent = cssContent;
                originalCSS = cssContent;
                
                // Scroll'u güncelle
                setTimeout(function() {
                    window.updateEditorScroll();
                    editorContainer.scrollTop = 0;
                }, 100);

                // Input'u temizle
                if (fileInput) { fileInput.value = ''; }
                AlertBox(`${file.name} başarıyla yüklenildi!`, 'success');
                updateButtonsHide();
                setTimeout(() => {
                    SaveCSSToLocal(true);
                    setTimeout(reportCSS, 100);
                }, 50);
            }
        } catch (error) {
            console.error('Dosya okuma hatası:', error);
            AlertBox('Dosya okuma hatası: ' + error.message, 'error');
        }
    };
    reader.onerror = function(e) {
        console.error('FileReader error:', e);
        AlertBox('Dosya okunamadı!', 'error');
    };
    reader.readAsText(file);
}
/**
 * Drag & Drop işlemleri için ana alana event listener'lar ekler
 */
function initializeDragDrop() {
    const editorSectionZone = document.getElementById('editorSection');
    const dropZones = [editorSectionZone].filter(zone => zone !== null);

    if (!editor || dropZones.length === 0) {
        console.error("CSS editor veya drop zone alanları bulunamadı");
        return;
    }

    // Scroll değişkenleri global kalsın
    let originalBodyOverflow = '';
    let originalBodyHeight = '';

    // --- Yardımcı Fonksiyonlar ---
    function disableScroll() {
        if (document.body.style.overflow !== 'hidden') {
            originalBodyOverflow = document.body.style.overflow;
            originalBodyHeight = document.body.style.height;
            document.body.style.overflow = 'hidden';
            document.body.style.height = '100vh';
            document.documentElement.style.overflow = 'hidden';
            document.documentElement.style.height = '100vh';
        }
    }

    function enableScroll() {
        document.body.style.overflow = originalBodyOverflow || '';
        document.body.style.height = originalBodyHeight || '';
        document.documentElement.style.overflow = '';
        document.documentElement.style.height = '';
    }

    // --- Event Listener'ları Döngü ile Ekleme ---
    
    // Her bir drop zone için ayrı ayrı işlem yapıyoruz
    dropZones.forEach(zone => {
        // Her bölge için kendi sayacını tutuyoruz (karışıklığı önlemek için)
        let dragCounter = 0;

        // Drag enter
        zone.addEventListener('dragenter', function(e) {
            e.preventDefault();
            e.stopPropagation();
            dragCounter++;
            this.classList.add('drag-over');
            disableScroll();
        });

        // Drag over
        zone.addEventListener('dragover', function(e) {
            e.preventDefault();
            e.stopPropagation();
            disableScroll();
        });

        // Drag leave
        zone.addEventListener('dragleave', function(e) {
            e.preventDefault();
            e.stopPropagation();
            dragCounter--;

            if (dragCounter === 0) {
                this.classList.remove('drag-over');
                // Sadece tüm bölgelerden çıkıldıysa scroll'u açmak daha güvenli olabilir
                // ama şimdilik bölge bazlı bırakıyoruz, drop olduğunda düzelir.
                enableScroll(); 
            }
        });

        // Drop
        zone.addEventListener('drop', function(e) {
            e.preventDefault();
            e.stopPropagation();
            dragCounter = 0;
            this.classList.remove('drag-over');
            enableScroll();
            if (e.dataTransfer.files.length > 0) {
                const file = e.dataTransfer.files[0];
                if (file.name.endsWith('.css') || file.type === 'text/css') {
                    // Hangi bölgeye bırakılırsa bırakılsın aynı islevi cagir
                    processUploadedFile(file); 
                } else {
                    AlertBox('Lütfen sadece CSS dosyası yükleyin (.css uzantılı)', 'warning');
                }
            }
        });

        // Drag end
        zone.addEventListener('dragend', function(e) {
            dragCounter = 0;
            this.classList.remove('drag-over');
            enableScroll();
        });

        // Touch move (Mobil için)
        zone.addEventListener('touchmove', function(e) {
            if (this.classList.contains('drag-over')) {e.preventDefault();}
        }, { passive: false });
    });

    // --- Global Window Events ---
    // Pencereden çıkma durumu (Genel kontrol)
    window.addEventListener('dragleave', function(e) {
        if (e.clientX <= 0 || e.clientY <= 0 || 
            e.clientX >= window.innerWidth || e.clientY >= window.innerHeight) {
            dropZones.forEach(zone => {zone.classList.remove('drag-over');});
            enableScroll();
        }
    });
}

/**
 * URL modalı event listener'larını başlatır
 */
function initializeURLModalEvents() {
    const urlModal = document.getElementById('urlModal');
    if (urlModal) {
        urlModal.addEventListener('close', function() {setTimeout(() => {resetURLModal();}, 300);});
        urlModal.addEventListener('click', function(e) {
            if (e.target === this) {
                const urlInput = document.getElementById('cssUrl');
                if (urlInput) {setTimeout(() => urlInput.focus(), 50);}
            }
        });
    }
    
    // Enter tuşu ile URL yükleme
    document.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            const urlModal = document.getElementById('urlModal');
            if (urlModal && urlModal.hasAttribute('open')) {
                const activeElement = document.activeElement;
                if (activeElement && activeElement.id === 'cssUrl') {
                    e.preventDefault();
                    loadCSSFromURL();
                }
            }
        }
    });
}

// Update butonlarını güncellerken scroll'u da güncelle
function updateButtonsHide() {
    const repeatBtn = document.getElementById('editor-repeat');
    const trashBtn = document.getElementById('editor-trash');
    const mnfyBtnM = document.getElementById('editor-re-byline');
    const mnfyBtnL = document.getElementById('editor-re-line');
    const commentBtn = document.getElementById('editor-comment');
    const NocommentBtn = document.getElementById('editor-no-comment');
    const editorDownload = document.getElementById('editor-download');
    const editorCopy = document.getElementById('editor-copy');
    const reportButton = document.getElementById('report-button');
    
    if (editor && editor.textContent.length > 0) {
        // Editor doluysa hidden sınıfını kaldır
        repeatBtn.classList.remove('hidden');
        trashBtn.classList.remove('hidden');
        mnfyBtnM.classList.remove('hidden');
        mnfyBtnL.classList.remove('hidden');
        editorDownload.classList.remove('hidden');
        editorCopy.classList.remove('hidden');
        reportButton.classList.remove('hidden');
        updateComments();
        // Scroll'u güncelle
        setTimeout(() => {if (typeof window.updateEditorScroll === 'function') {window.updateEditorScroll();}}, 100);
    } else {
        // Editor boşsa hidden sınıfını ekle
        repeatBtn.classList.add('hidden');
        trashBtn.classList.add('hidden');
        mnfyBtnM.classList.add('hidden');
        mnfyBtnL.classList.add('hidden');
        commentBtn.classList.add('hidden');
        NocommentBtn.classList.add('hidden');
        editorDownload.classList.add('hidden');
        editorCopy.classList.add('hidden');
        reportButton.classList.add('hidden');
        setTimeout(() => {}, 100);
    }
    editor.style.minHeight = "200px";
}

// check span change
function updateEditorMode() {
    const lineRadio = document.getElementById('line');
    const multilineRadio = document.getElementById('multiline');
    const formatRadio = document.getElementById('format');
    
    if (selectedMode === 'multiline' || selectedMode === 'format') {
        container.classList.add("ws-pre");
        container.classList.remove("ws-normal");
    } else {
        container.classList.remove("ws-pre");
        container.classList.add("ws-normal");
    }
    
    // Radio button'ları güncelle
    if (lineRadio) lineRadio.checked = (selectedMode === 'line');
    if (multilineRadio) multilineRadio.checked = (selectedMode === 'multiline');
    if (formatRadio) formatRadio.checked = (selectedMode === 'format');
}

function MultiLineCSS() {
    document.getElementById('multiline').checked = true;
    selectedMode = 'multiline';
    handleModeChange(false);
}

function OnlyLineCSS() {
    document.getElementById('line').checked = true;
    selectedMode = 'line';
    handleModeChange(false);
}

function formatRunCSS() {
    document.getElementById('format').checked = true;
    selectedMode = 'format';
    handleModeChange(false);
}

function commentAdd() {
    document.getElementById('nocomment').checked = true;
    Comments = false;
    handleModeChange(true);
    updateComments();
}

function commentRemove() {
    document.getElementById('comment').checked = true;
    Comments = true;
    handleModeChange(true);
    updateComments();
}

function updateEditorMode() {
    const lineRadio = document.getElementById('line');
    const multilineRadio = document.getElementById('multiline');
    const formatRadio = document.getElementById('format');
    
    if (selectedMode === 'multiline' || selectedMode === 'format') {
        container.classList.add("ws-pre");
        container.classList.remove("ws-normal");
    } else {
        container.classList.remove("ws-pre");
        container.classList.add("ws-normal");
    }
    
    // Radio button'ları güncelle
    if (lineRadio) lineRadio.checked = (selectedMode === 'line');
    if (multilineRadio) multilineRadio.checked = (selectedMode === 'multiline');
    if (formatRadio) formatRadio.checked = (selectedMode === 'format');
}

function updateComments() {
    const commentRadio = document.getElementById('comment');
    const nocommentRadio = document.getElementById('nocomment');

    if (commentRadio) commentRadio.checked = Comments;
    if (nocommentRadio) nocommentRadio.checked = !Comments;
    
    // Editor butonlarını güncelle
    const editorNoComment = document.getElementById('editor-no-comment');
    const editorComment = document.getElementById('editor-comment');
    
    if (Comments) {
        editorNoComment.classList.add("hidden");
        editorComment.classList.remove("hidden");
    } else {
        editorNoComment.classList.remove("hidden");
        editorComment.classList.add("hidden");
    }
}

// Debounce fonksiyonu
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Debounce'lu saveCSSToLocal
const SaveCSSToLocal = debounce(function(save) {
    editor.style.minHeight = "200px";
    let cssContent = getCSS();  
    const storedData = localStorage.getItem('css-minify');
    let data = {};
    if (storedData) {
        try {
            data = JSON.parse(storedData);
        } catch (e) {
            console.error('LocalStorage verisi bozuk, sıfırlanıyor:', e);
            data = {};
        }
    }

    data.css = cssContent;
    data.mode = selectedMode;
    data.Comments = Comments;

    if (save === true || save === 'true') {
        data.original = cssContent;
        originalCSS = cssContent;
    }

    // Quota kontrolü
    const estimatedSize = new Blob([JSON.stringify(data)]).size;
    if (estimatedSize > 4 * 1024 * 1024) {
        AlertBox(`CSS çok büyük (${(estimatedSize / 1024 / 1024).toFixed(2)} MB)! Yerel depolamaya kaydedilemedi.`, 'error');
        return;
    }

    try {
        localStorage.setItem('css-minify', JSON.stringify(data));
    } catch (e) {
        if (e.name === 'QuotaExceededError') {
            AlertBox('Yerel depolama kotası aşıldı! CSS çok büyük. Tarayıcıda localStorage\'ı temizleyin.', 'error');
        } else {
            AlertBox('Kaydetme hatası: ' + e.message, 'error');
        }
        console.error('Kaydetme hatası:', e);
    }
}, 4000); 

function loadCSSFromLocal() {
    const storedData = localStorage.getItem('css-minify');
    if (storedData) {
        let parsed;
        try {
            parsed = JSON.parse(storedData);
        } catch (e) {
            console.error('LocalStorage verisi bozuk, sıfırlanıyor:', e);
            localStorage.removeItem('css-minify');
            return;
        }

        // 1. Original (her zaman yorumlu hali) yükle
        if (parsed.original) {originalCSS = parsed.original;} 
        else if (parsed.css) {originalCSS = parsed.css;}

        // 2. Mode ve Comments durumunu yükle
        if (parsed.mode) {selectedMode = parsed.mode;}
        if (parsed.Comments !== undefined) {Comments = parsed.Comments;}

        // 3. UI (radio button'lar vs.) güncelle
        updateEditorMode();
        updateComments();

        // 4. Original'dan başlayarak mevcut mode + Comments durumuna göre yeniden işle
        if (originalCSS && originalCSS.trim()) {
            try {
                // Parse et (yorumlar korunur)
                cssRules = parseCSSRules(originalCSS);
                switch(selectedMode) {
                    case 'line':
                        editor.textContent = minifySingleLine(cssRules);
                        editor.classList.remove("ws-pre");
                        editor.classList.add("ws-normal");
                        break;
                    case 'multiline':
                        editor.textContent = minifyLineByLine(cssRules);
                        editor.classList.add("ws-pre");
                        editor.classList.remove("ws-normal");
                        break;
                    case 'format':
                        // formatCSS kendi içinde parse yapıyor ve Comments'e göre yorum ekliyor/kaldırıyor
                        formatCSS(originalCSS);
                        break;
                }
                // MinifiedCSS'i de güncelle (istatistik vs. için)
                minifiedCSS = getCSS();

            } catch (error) {
                console.error('Yeniden işleme hatası:', error);
                // Hata olursa fallback: eski css'i yükle
                if (parsed.css) {editor.textContent = parsed.css;}
            }
        } else if (parsed.css) {
            // Original yoksa (çok eski veri) son işlenmiş css'i yükle
            editor.textContent = parsed.css;
            minifiedCSS = parsed.css;
        }

        // 5. Görünüm güncellemeleri
        setTimeout(function() {
            window.updateEditorScroll();
            if (editorContainer) editorContainer.scrollTop = 0;
        }, 100);

        updateButtonsHide();
        setTimeout(reportCSS, 100);
        editor.style.minHeight = "200px";
    }
}

function initModeRadios() {
    const modeRadios = document.querySelectorAll('input[name="mode"]');
    modeRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            selectedMode = this.value;
            handleModeChange(false);
            SaveCSSToLocal(false);
        });
    });
}

// Comment radio button event listener'larını başlat
function initCommentRadios() {
    const commentRadios = document.querySelectorAll('input[name="comment"]');
    commentRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            Comments = (this.value === 'comment');
            handleModeChange(true);
            SaveCSSToLocal(false);
        });
    });
}

// Mode değiştiğinde çalışacak fonksiyon
function handleModeChange(comment) {
    if (!editor) return;
    
    // Kullanıcının mevcut scroll pozisyonunu kaydet
    saveScrollPosition();
    let cssContent = "";
    if (comment === true) {
        // Yorum değişikliğinde her zaman yorumlu original'dan başla
        const storedData = localStorage.getItem('css-minify');
        if (storedData) {
            const parsed = JSON.parse(storedData);
            if (parsed && parsed.original) {
                cssContent = parsed.original;
            } else if (parsed && parsed.css) {
                cssContent = parsed.css; // fallback
            }
        }
    } else {// Mod değişikliğinde mevcut (işlenmiş) CSS'ten devam et
        cssContent = getCSS();
    }

    if (!cssContent.trim()) return;
    // originalCSS her zaman yorumlu hali olur
    originalCSS = cssContent;
    
    try {
        const rules = parseCSSRules(cssContent);
        // İşlem öncesi scroll pozisyonunu kaydet
        const editorContainer = document.querySelector('.css-scroller');
        const scrollTopBefore = editorContainer ? editorContainer.scrollTop : 0;
        // Moda göre işlem yap
        switch(selectedMode) {
            case 'line':
                editor.textContent = minifySingleLine(rules);
                editor.classList.remove("ws-pre");
                editor.classList.add("ws-normal");
                break;
            case 'multiline':
                editor.textContent = minifyLineByLine(rules);
                editor.classList.add("ws-pre");
                editor.classList.remove("ws-normal");
                break; 
            case 'format':
                formatCSS(cssContent);
                editor.classList.add("ws-pre");
                editor.classList.remove("ws-normal");
                break;
        }
        
        // İstatistikleri güncelle
        const statsSection = document.getElementById('report-css-container');
        if (statsSection) statsSection.classList.remove("hidden");

        SaveCSSToLocal(false);
        setTimeout(reportCSS, 50);
        editor.style.minHeight = "200px";
        
        // Scroll'u güncelle ve eski pozisyona dön
        setTimeout(function() {
            if (typeof window.updateEditorScroll === 'function') {window.updateEditorScroll();}
            // Scroll pozisyonunu koru - kullanıcının orijinal pozisyonuna dön
            if (editorContainer) {
                requestAnimationFrame(() => {
                    editorContainer.scrollTop = scrollTopBefore;
                    scrollPosition.top = scrollTopBefore;
                });
            }
        }, 100);
        
    } catch (error) {
        console.error('Mode change error:', error);
        AlertBox('İşlem hatası: ' + error.message, 'error');
    }
}

// Editör klavye olayları
function initializeEditorEvents() {
    if (!editor || !editorContainer) return;
    // Scroll takibini başlat
    setupScrollTracking();
    // Scroll sistemini başlat
    const scrollUpdateFunc = initializeEditorScroll();
    // Cursor pozisyonunu takip etmek için
    let lastCursorPosition = 0;
    let lastScrollTop = 0;
    
    // 1. Input event - YAZI YAZARKEN
    editor.addEventListener('input', function() {
        // Mevcut cursor pozisyonunu kaydet
        const sel = window.getSelection();
        if (sel.rangeCount > 0) {
            const range = sel.getRangeAt(0);
            const cursorNode = range.startContainer;
            const cursorOffset = range.startOffset;
            // Cursor pozisyonunu hesapla
            const tempRange = document.createRange();
            tempRange.selectNodeContents(editor);
            tempRange.setEnd(cursorNode, cursorOffset);
            lastCursorPosition = tempRange.toString().length;
        }
        
        // Scroll pozisyonunu kaydet
        lastScrollTop = editorContainer.scrollTop;
        originalCSS = getCSS();
        SaveCSSToLocal(false);
        updateButtonsHide();
        // console.log("initializeEditorEvents: input");
        // Input işlemi bittikten sonra scroll pozisyonunu koru
        setTimeout(() => {
            if (typeof window.updateEditorScroll === 'function') {
                window.updateEditorScroll();
            }
            // Cursor hala aynı pozisyonda kalmalı
            editorContainer.scrollTop = lastScrollTop;
        }, 10);
    });

    // 2. Klavye olayları - ENTER için özel işleme
    editor.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            // Enter'a basıldığında cursor pozisyonunu kaydet
            const sel = window.getSelection();
            if (sel.rangeCount > 0) {
                const range = sel.getRangeAt(0);
                const rect = range.getBoundingClientRect();
                lastScrollTop = editorContainer.scrollTop;
                
                // Cursor'un görünür kalmasını sağla
                const cursorTop = rect.top;
                const containerTop = editorContainer.getBoundingClientRect().top;
                const visibleHeight = editorContainer.clientHeight;
                
                // Cursor container'ın görünür alanında mı kontrol et
                if (cursorTop < containerTop + 50 || cursorTop > containerTop + visibleHeight - 50) {
                    // Cursor görünmüyorsa, biraz bekleyip scroll'u ayarla
                    setTimeout(() => {
                        const newRect = range.getBoundingClientRect();
                        if (newRect.top < containerTop + 50) {
                            editorContainer.scrollTop -= (containerTop + 50 - newRect.top);
                        } else if (newRect.top > containerTop + visibleHeight - 50) {
                            editorContainer.scrollTop += (newRect.top - (containerTop + visibleHeight - 50));
                        }
                    }, 10);
                }
            }
            // Diğer işlemleri yap
            setTimeout(() => {
                updateButtonsHide();
                SaveCSSToLocal(false);
                window.updateEditorScroll();
            }, 50);
        }
        
        if (['Tab', 'Backspace', 'Delete'].includes(e.key)) {
            // Mevcut scroll pozisyonunu kaydet
            lastScrollTop = editorContainer.scrollTop;
            setTimeout(() => {
                window.updateEditorScroll();
                editorContainer.scrollTop = lastScrollTop; // Scroll pozisyonunu koru
                updateButtonsHide();
                SaveCSSToLocal(false);
            }, 10);
        }
        
        // Ctrl/Cmd + A (Select All)
        if ((e.ctrlKey || e.metaKey) && e.key === 'a') {
            e.preventDefault();
            const range = document.createRange();
            range.selectNodeContents(editor);
            const selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);
            updateButtonsHide();
            SaveCSSToLocal(false);
        }
    });

    // 3. Paste event
    editor.addEventListener('paste', function(e) {
        const currentCSS = getCSS();
        const pastedText = e.clipboardData.getData('text/plain');
        lastScrollTop = editorContainer.scrollTop;
        setTimeout(() => {
            window.updateEditorScroll();
            editorContainer.scrollTop = lastScrollTop; // Scroll pozisyonunu koru
            updateButtonsHide();
            // console.log("initializeEditorEvents: copy:" + pastedText === currentCSS);
            if (pastedText !== currentCSS) {
                SaveCSSToLocal(true);
            } else {
                SaveCSSToLocal(false);
            }
        }, 100);
    });

    // 4. Click event (focus için)
    editor.addEventListener('click', function() {
        this.focus();
        // console.log("initializeEditorEvents: click");
    });

    editor.addEventListener('blur', function() {
        this.style.backgroundColor = '';
        this.style.borderLeft = '';
        // console.log("initializeEditorEvents: blur");
    });

    // 5. Editör focus olduğunda cursor'ı takip et
    editor.addEventListener('focus', function() {
        // Focus olduğunda scroll pozisyonunu koru
        setTimeout(() => {
            if (editorContainer.scrollTop !== lastScrollTop) {
                editorContainer.scrollTop = lastScrollTop;
            }
        }, 50);
    });

    // Global erişim için yerel fonksiyonu ata
    window.updateEditorScroll = scrollUpdateFunc;
}

// Global fonksiyon - tıklama olayını dinle
function setupGlobalClickListener() {
    document.addEventListener('click', function(e) {
        if (e.target && e.target.getAttribute) {
            const buttonName = e.target.getAttribute('name');
            if (buttonName === 'next' || buttonName === 'prev') {triggerScroll()}
        }
        
        if (e.target && e.target.closest) {
            const button = e.target.closest('[name="next"], [name="prev"]');
            if (button) {triggerScroll()}
        }
    });
}

// Global fonksiyon - klavye olayını dinle (Enter tuşu - sadece search için)
function setupGlobalKeydownListener() {
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.keyCode === 13) {
            const activeElement = document.activeElement;
            const elementName = activeElement.getAttribute('name');
            // Sadece name="search" olan elementte Enter'a basıldığında
            if (elementName === 'search') {
                triggerScroll();
                console.log("search için enter tuşu listener");
            }
        }
    });
}

function triggerScroll() {setTimeout(() => {window.scrollBy({top: -150, behavior: 'smooth'});}, 100);}

// Sayfa yüklendiğinde başlatma fonksiyonu
function initializeApp() {
    try {
        if (!editor || !editorContainer) {
            console.error('Editor veya container bulunamadı');
            setTimeout(initializeApp, 500);
            return;
        }

        if (editor) {editor.addEventListener('input', updateButtonsHide);} 
        else {console.warn("Editör elementi bulunamadı. Lütfen seçiciyi kontrol edin.");}
        
        originalCSS = getCSS();

        setupGlobalClickListener();
        setupGlobalKeydownListener();

        // İlk scroll pozisyonunu ayarla
        scrollPosition = { top: 0, left: 0 };
        isUserScrolling = false;
        initializeEditorEvents();

        // 7. Radio button'ları başlat
        initModeRadios();
        initCommentRadios();
        
        // 8. UI güncellemeleri
        updateComments();
        updateEditorMode();
        updateButtonsHide();
        
        // 9. İlk scroll ayarı - EN BAŞTA olacak şekilde
        setTimeout(function() {
            if (typeof window.updateEditorScroll === 'function') {
                window.updateEditorScroll();
            }
            editorContainer.scrollTop = 0;
            scrollPosition.top = 0;
        }, 300);
        
        // 10. Diğer başlatma işlemleri
        initializeReportSystem();
        loadCSSFromLocal();
        initializeDragDrop();
        initializeURLModalEvents(); 
    } catch (error) {
        console.error('App init error:', error);
        AlertBox('Uygulama başlatma hatası: ' + error.message, 'error');
    }
}

// DOM yüklendiğinde
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(function() {
        if (editor && editorContainer) {
            openMenuFuc();
            initializeApp();
        } else {
            console.warn('Editor elements not found, retrying...');
            setTimeout(initializeApp, 500);
        }
    }, 100);
});

// Window load event'i de ekleyebiliriz
window.addEventListener('load', function() {
    setTimeout(function() {
        if (typeof window.updateEditorScroll === 'function') {window.updateEditorScroll();}
    }, 1000);
});

// Scroll pozisyonunu saklamak için değişkenler
let scrollPosition = { top: 0, left: 0 };
let isUserScrolling = false;

// Editörden CSS al
function getCSS() { 
    return window.editor ? window.editor.state.doc.toString() : (document.querySelector('.css-content[data-language="css"]')?.textContent || ''); 
}

// Scroll pozisyonunu kaydet
function saveScrollPosition() {
    if (editorContainer) {
        scrollPosition = {top: editorContainer.scrollTop, left: editorContainer.scrollLeft};
    }
}

// Scroll pozisyonunu geri yükle
function restoreScrollPosition() {
    if (editorContainer && !isUserScrolling) {
        requestAnimationFrame(() => {
            editorContainer.scrollTop = scrollPosition.top;
            editorContainer.scrollLeft = scrollPosition.left;
        });
    }
}

// Kullanıcı scroll'u tespit et
function setupScrollTracking() {
    if (!editorContainer) return;
    
    editorContainer.addEventListener('scroll', () => {
        isUserScrolling = true;
        clearTimeout(editorContainer.scrollTimeout);
        editorContainer.scrollTimeout = setTimeout(() => {isUserScrolling = false;}, 150);
        // Pozisyonu güncelle
        scrollPosition = {top: editorContainer.scrollTop, left: editorContainer.scrollLeft};
    });
}

// OPEN BUTTON MENU
function openMenuFuc() {
    // Global openMenu 
    window.openMenu = function(value) {
        const html = document.documentElement;

        // Güncel element referansları
        const metricMenu = document.getElementById("metrik-list-menu");
        const editorMenu = document.getElementById("editor-list-menu");
        const themeMenu   = document.getElementById("theme-list-menu");

        const menus = {
            metrik: metricMenu,
            editor: editorMenu,
            theme:  themeMenu
        };

        // 1. Diğer menüleri kapat (tıklanan hariç)
        Object.keys(menus).forEach(key => {
            if (key !== value && menus[key]) {
                menus[key].classList.remove("open");
            }
        });

        // 2. Tıklanan menüyü toggle et
        if (menus[value]) {menus[value].classList.toggle("open");}

        // 3. Herhangi bir menü açık mı? (modal-is-open için)
        const anyOpen = 
            (metricMenu && metricMenu.classList.contains("open")) ||
            (editorMenu && editorMenu.classList.contains("open")) ||
            (themeMenu && themeMenu.classList.contains("open"));

        if (anyOpen) {
            html.classList.add("modal-is-open");
        } else {
            html.classList.remove("modal-is-open");
        }
    };

    // Global closeMenu – tüm menüleri kapatır
    window.closeMenu = function() {
        document.documentElement.classList.remove("modal-is-open");
        const metricMenu = document.getElementById("metrik-list-menu");
        const editorMenu = document.getElementById("editor-list-menu");
        const themeMenu   = document.getElementById("theme-list-menu");
        if (metricMenu) metricMenu.classList.remove("open");
        if (editorMenu) editorMenu.classList.remove("open");
        if (themeMenu)   themeMenu.classList.remove("open");
    };

    // Dışarı tıklama listener’ı (sadece bir kere eklenir)
    if (!document.body.dataset.menuClickListenerAdded) {
        document.addEventListener('click', function(event) {
            const metricMenu = document.getElementById("metrik-list-menu");
            const editorMenu = document.getElementById("editor-list-menu");
            const themeMenu   = document.getElementById("theme-list-menu");

            const isClickInsideMenu = 
                (metricMenu && metricMenu.contains(event.target)) ||
                (editorMenu && editorMenu.contains(event.target)) ||
                (themeMenu && themeMenu.contains(event.target));

            const isClickOnButton = 
                event.target.closest('.data-btn.mobil[onclick*="metrik"]') ||
                event.target.closest('.data-btn.mobil[onclick*="editor"]') ||
                event.target.closest('summary[onclick*="theme"]');

            if (!isClickInsideMenu && !isClickOnButton) {window.closeMenu();}
        });
        document.body.dataset.menuClickListenerAdded = "true";
    }
}

// GLOBAL FONK
window.minifyCSS = minifyCSS;
window.formatCSS = formatCSS;
window.downloadCSS = downloadCSS;
window.copyCSS = copyCSS;
window.clearEditor = clearEditor;
window.MultiLineCSS = MultiLineCSS;
window.OnlyLineCSS = OnlyLineCSS;

// Yeni fonksiyonlar
window.loadCSSFromURL = loadCSSFromURL;
window.resetURLModal = resetURLModal;
window.triggerFileInput = triggerFileInput;
window.handleFileSelect = handleFileSelect;

// Yardımcı global fonksiyonlar
window.getOriginalCSS = function() { return originalCSS; };
window.getMinifiedCSS = function() { return minifiedCSS; };
window.getCSSRules = function() { return cssRules; };
window.resetEditor = clearEditor;