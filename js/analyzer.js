
// ============================================
// CSS ANALİZ SİSTEMİ
// ============================================

// Performans metrikleri için sabitler
const BAD_ANIMATION_PROPERTIES = [
  // Layout oluşturan özellikler
  'width', 'height', 'margin', 'padding', 'top', 'left', 'right', 'bottom',
  'border', 'border-width', 'margin-left', 'margin-right', 'margin-top', 'margin-bottom',
  'padding-left', 'padding-right', 'padding-top', 'padding-bottom',
  'min-width', 'max-width', 'min-height', 'max-height',
  'font-size', 'line-height', // Font değişiklikleri layout'a neden olur
  'position', // Özellikle fixed/absolute değişimi
  'display', // Display değişimi layout + paint + composite
  'float', 'clear',
  'overflow', 'overflow-x', 'overflow-y',
  'flex', 'flex-grow', 'flex-shrink', 'flex-basis',
  'grid-template-columns', 'grid-template-rows',
  'justify-content', 'align-items',
  'order', // Flexbox order değişimi
  'columns', 'column-gap', 'column-count',
  'table-layout',
  'visibility', // hidden/visible geçişleri
  'z-index', // Stacking context oluşturur
  'border-width', 'border-top-width', 'border-right-width', 'border-bottom-width', 'border-left-width',
  'border-spacing', 'border-collapse',
  'outline', 'outline-width', 'outline-color', 'outline-style',
  'text-decoration', 'text-decoration-color',
  'vertical-align', 'text-align',
  'white-space', 'word-spacing', 'letter-spacing',
  'font-family', 'font-weight', 'font-style',
  'background', 'background-image', 'background-size', 'background-position',
  'list-style', 'list-style-type', 'list-style-position',
  'cursor',
  'content', // ::before/::after için
  'quotes',
  'counter-reset', 'counter-increment',
  'resize',
  'text-indent',
  'word-wrap', 'word-break', 'hyphens',
  'direction',
  'unicode-bidi',
  'writing-mode',
  'text-orientation',
  'text-combine-upright',
  'text-emphasis', 'text-emphasis-color', 'text-emphasis-style',
  'text-shadow',
  'text-transform',
  'text-underline-position',
  'text-overflow',
  'line-break',
  'overflow-wrap',
  'tab-size',
  'font-kerning',
  'font-variant', 'font-variant-caps', 'font-variant-ligatures',
  'font-feature-settings',
  'font-variation-settings',
  'font-synthesis',
  'font-stretch'
];

const GOOD_ANIMATION_PROPERTIES = [
  // Composite-only animasyonlar (en iyiler)
  'transform', 'opacity', 'translate', 'scale', 'rotate',
  'translateX', 'translateY', 'translateZ', 'translate3d',
  'scaleX', 'scaleY', 'scaleZ', 'scale3d',
  'rotateX', 'rotateY', 'rotateZ',
  'perspective', 'matrix', 'matrix3d',
  'will-change', // Hints for browser (doğru kullanıldığında)
  'clip', 'clip-path', // Modern tarayıcılarda composite-only olabilir
  'mask', 'mask-image', // Yeni tarayıcılarda
  'backface-visibility',
  'transform-origin',
  'backdrop-filter', // Modern tarayıcılarda composite
  'filter', // Modern tarayıcılarda composite (bazı durumlar hariç)
  'mix-blend-mode', // Composite layer oluşturur
  'isolation', // Stacking context için
  'contain', // Layout/paint containment
  'content-visibility', // Modern performans özelliği
  'offset', 'offset-path', 'offset-distance', 'offset-rotate',
  'scroll-snap-type', 'scroll-snap-align',
  'overscroll-behavior',
  'touch-action',
  'scroll-behavior',
  'image-rendering'
];

const EXPENSIVE_PROPERTIES = [
  // Paint'a neden olan özellikler
  'box-shadow', 'border-radius', 'filter', 'backdrop-filter', 'blur',
  'background', 'background-color', 'background-image', 'background-size',
  'background-position', 'background-attachment',
  'border', 'border-color', 'border-image', 'border-style',
  'outline', 'outline-color', 'outline-width',
  'text-shadow',
  'color', // Text repaint
  'visibility', // paint tetikleyebilir
  'opacity', // Not: opacity genelde iyidir ama bazı durumlarda pahalı olabilir
  'width', 'height', // Hem layout hem paint
  'font-family', 'font-weight', // Text reflow + repaint
  'text-align', 'vertical-align',
  'word-spacing', 'letter-spacing',
  'mix-blend-mode',
  'gradient', // background gradients
  'border-image', 'border-image-source', 'border-image-slice', 'border-image-width', 'border-image-outset', 'border-image-repeat',
  'background-blend-mode',
  'clip-path', // Complex clip-path'ler pahalı olabilir
  'shape-outside', 'shape-margin', 'shape-image-threshold',
  'mask', 'mask-border', 'mask-composite', 'mask-mode',
  'backdrop-filter', // GPU intensive
  'filter', // GPU intensive (blur, drop-shadow vb.)
  'blur', 'brightness', 'contrast', 'drop-shadow', 'grayscale', 'hue-rotate', 'invert', 'saturate', 'sepia',
  'perspective', // 3D transform'lar
  'transition', 'animation', // Complex animasyonlar
  'will-change', // Yanlış kullanılırsa pahalı
  'contain', // Yan etkileri olabilir
  'content', // Dynamic content
  'counter-increment', 'counter-reset',
  'quotes',
  'cursor', // Custom cursor images
  'list-style-image',
  'image-rendering', // High-quality scaling
  'text-decoration-skip-ink',
  'text-underline-offset',
  'text-emphasis', 'text-emphasis-position'
];

const PAINT_TRIGGERING_PROPERTIES = [
  // Boya işlemi tetikleyen özellikler
  'color',
  'background-color',
  'background-image',
  'background',
  'background-size',
  'background-position',
  'background-repeat',
  'background-attachment',
  'background-clip',
  'background-origin',
  'border-color',
  'border-style',
  'border-image',
  'border',
  'border-top', 'border-right', 'border-bottom', 'border-left',
  'border-radius',
  'box-shadow',
  'text-shadow',
  'outline',
  'outline-color',
  'outline-style',
  'outline-width',
  'opacity', // < 1 olduğunda
  'visibility',
  'clip-path', // Complex path'ler
  'mask',
  'mask-image',
  'filter',
  'backdrop-filter',
  'mix-blend-mode',
  'background-blend-mode',
  'text-decoration',
  'text-decoration-color',
  'text-emphasis',
  'text-emphasis-color',
  '-webkit-text-stroke',
  '-webkit-text-stroke-color',
  'fill',
  'stroke',
  'stroke-width'
];

const COMPOSITE_ONLY_PROPERTIES = [
  // Sadece composite aşamasını etkileyen özellikler (en iyi performans)
  'transform',
  'translate',
  'translateX', 'translateY', 'translateZ', 'translate3d',
  'scale',
  'scaleX', 'scaleY', 'scaleZ', 'scale3d',
  'rotate',
  'rotateX', 'rotateY', 'rotateZ',
  'skew', 'skewX', 'skewY',
  'matrix', 'matrix3d',
  'perspective',
  'opacity', // Genellikle composite-only (bazı edge case'ler hariç)
  'will-change', // Doğru kullanıldığında
  'backface-visibility',
  'contain', // strict veya content değerleri
  'isolation',
  'z-index', // Stacking context değişikliği
  'position', // fixed, sticky (yeni layer)
  'mix-blend-mode', // Yeni layer gerektirir
  'filter', // Modern tarayıcılarda (bazı filtreler)
  'clip-path', // Simple shapes için
  'mask', // Modern tarayıcılarda
  'backdrop-filter' // Modern tarayıcılarda
];

const LAYOUT_TRIGGERING_PROPERTIES = [
  // Layout/reflow tetikleyen özellikler
  'width', 'height',
  'min-width', 'min-height',
  'max-width', 'max-height',
  'margin', 'margin-top', 'margin-right', 'margin-bottom', 'margin-left',
  'padding', 'padding-top', 'padding-right', 'padding-bottom', 'padding-left',
  'border-width',
  'top', 'right', 'bottom', 'left',
  'position',
  'display',
  'float',
  'clear',
  'overflow', 'overflow-x', 'overflow-y',
  'font-size',
  'font-family',
  'font-weight',
  'line-height',
  'text-align',
  'vertical-align',
  'white-space',
  'word-spacing',
  'letter-spacing',
  'visibility', // hidden → visible
  'flex', 'flex-grow', 'flex-shrink', 'flex-basis',
  'flex-direction', 'flex-wrap', 'flex-flow',
  'justify-content', 'align-items', 'align-content', 'align-self',
  'order',
  'grid-template-columns', 'grid-template-rows',
  'grid-template-areas',
  'grid-template',
  'grid-auto-columns', 'grid-auto-rows',
  'grid-auto-flow',
  'grid-column', 'grid-row',
  'grid-area',
  'gap', 'row-gap', 'column-gap',
  'columns', 'column-width', 'column-count', 'column-gap', 'column-rule', 'column-span',
  'table-layout',
  'border-collapse',
  'border-spacing',
  'caption-side',
  'empty-cells',
  'list-style', 'list-style-type', 'list-style-position',
  'counter-reset', 'counter-increment',
  'content',
  'quotes',
  'resize',
  'text-indent',
  'word-wrap', 'word-break',
  'writing-mode',
  'direction',
  'unicode-bidi'
];

// Tüm metrikleri hesapla
function calculateAllMetrics(cssText, rules, selectors, declarations) {
    const results = {
        general: {},
        maintainability: {},
        complexity: {},
        performance: {},
        suggestions: [],
        problematicCode: {
            maintainability: [],
            complexity: [],
            performance: []
        },
        categories: {
            all: [],
            maintainability: [],
            complexity: [],
            performance: [],
            error: [] // Boş başlat
        },
        allCSS: cssText
    };
    // ==================== GENEL İSTATİSTİKLER ====================
    const sourceLines = cssText.split('\n').filter(line => line.trim()).length;
    results.general = {
        totalRules: rules.length,
        totalSelectors: selectors.length,
        totalDeclarations: declarations.length,
        sourceLinesOfCode: sourceLines,
        fileSize: {
            original: (cssText.length / 1024).toFixed(2) + ' KB',
            minified: (cssText.replace(/\s+/g, ' ').length / 1024).toFixed(2) + ' KB',
            savings: ((cssText.length - cssText.replace(/\s+/g, ' ').length) / 1024).toFixed(2) + ' KB'
        }
    };
  
    // ==================== BAKIM KOLAYLIĞI METRİKLERİ ====================
    const maintainabilityMetrics = calculateMaintainabilityMetricsCK(rules, selectors, declarations);
    results.maintainability = {
        ...maintainabilityMetrics,
        score: calculateMaintainabilityScore(maintainabilityMetrics),
        metrics: generateMaintainabilityMetricsDisplay(maintainabilityMetrics, cssText, rules)
    };
  
    // ==================== KOMPLEKSİTE METRİKLERİ ====================
    const complexityMetrics = calculateComplexityMetricsCK(selectors, cssText, declarations);
    results.complexity = {
        ...complexityMetrics,
        score: calculateComplexityScore(complexityMetrics),
        topComplexSelectors: complexityMetrics.topComplexSelectors,
        metrics: generateComplexityMetricsDisplay(complexityMetrics, cssText, selectors) // selectors parametresi eklendi
    };
  
    // ==================== PERFORMANS METRİKLERİ ====================
    const performanceMetrics = calculatePerformanceMetricsCK(cssText, declarations, rules); // RULES EKLENDİ!
    results.performance = {
        ...performanceMetrics,
        score: calculatePerformanceScore(performanceMetrics, declarations.length),
        metrics: generatePerformanceMetricsDisplay(performanceMetrics, cssText, rules, declarations)
    };
  
    // ==================== TÜM METRİKLERİ BİRLEŞTİR ====================
    results.allMetrics = [
        ...results.maintainability.metrics,
        ...results.complexity.metrics,
        ...results.performance.metrics
    ];
  
    // ==================== ÖNERİLER OLUŞTUR ====================
    // Önce metrikleri güncelle
    results.allMetrics = addSuggestionsToMetrics(results.allMetrics, results);
   
    // Sonra genel önerileri oluştur
    results.suggestions = generateSuggestions(results);
  
    // ==================== GENEL SKOR HESAPLA ====================
    results.overallScore = calculateOverallScore(
        results.maintainability.score,
        results.complexity.score,
        results.performance.score
    );
  
    // YENİ: ERROR/VALIDATION METRİĞİNİ EKLE
    const validationMetrics = validateCSS(cssText); // Doğrulamayı burada çalıştır
    if (validationMetrics.length > 0) {
        results.categories.error = validationMetrics;
        validationMetrics.forEach(metric => results.allMetrics.push(metric));
    }
  
    return results;
}

// ==================== METRİK HESAPLAMA FONKSİYONLARI ====================

// BAKIM KOLAYLIĞI
function calculateMaintainabilityMetricsCK(rules, selectors, declarations) {
    const metrics = {};
    
    // 1. TEK KURALDA ÇOK DEKLARASYON
    metrics.maxDeclarationsPerRule = rules.filter(r => r.declarationCount > 10).length;
    
    // 2. KURAL BAŞINA ORTALAMA DEKLARASYON
    metrics.avgDeclarationsPerRule = rules.length > 0 
        ? (rules.reduce((sum, r) => sum + r.declarationCount, 0) / rules.length)
        : 0;
    
    // 3. DEKLARASYON TEKRARI
    const declarationFrequency = new Map();
    declarations.forEach(dec => {
        const key = `${dec.property}:${dec.value}`.toLowerCase();
        declarationFrequency.set(key, (declarationFrequency.get(key) || 0) + 1);
    });
    
    const duplicateDeclarations = Array.from(declarationFrequency.entries())
        .filter(([_, count]) => count > 1);
    
    metrics.declarationDuplicationPercentage = declarations.length > 0
        ? ((duplicateDeclarations.reduce((sum, [_, count]) => sum + (count - 1), 0) / declarations.length) * 100)
        : 0;
    
    // 4. BOŞ KURALLAR: 0 olmalı
    metrics.emptyRulesets = rules.filter(r => r.declarationCount === 0).length;
    
    // 5. SEÇİCİ TEKRARI
    const selectorFrequency = new Map();
    selectors.forEach(sel => {
        selectorFrequency.set(sel, (selectorFrequency.get(sel) || 0) + 1);
    });
    
    const duplicateSelectors = Array.from(selectorFrequency.entries())
        .filter(([_, count]) => count > 1);
    
    metrics.selectorDuplicationPercentage = selectors.length > 0
        ? ((duplicateSelectors.length / selectors.length) * 100)
        : 0;
    
    // 6. KURAL BAŞINA ORTALAMA SEÇİCİ
    metrics.avgSelectorsPerRule = rules.length > 0
        ? (rules.reduce((sum, r) => sum + r.selectorCount, 0) / rules.length)
        : 0;
    
    // 7. TEK KURALDA ÇOK SEÇİCİ
    metrics.maxSelectorsPerRule = Math.max(...rules.map(r => r.selectorCount), 0);
    
    // 8. EN YAYGIN DEKLARASYON SAYISI
    metrics.largeDeclarationBlocksOver20 = rules.filter(r => r.declarationCount > 20).length;

    // 9. EN YAYGIN SEÇİCİ SAYISI
    const selectorCountFreq = new Map();
    rules.forEach(r => {
        selectorCountFreq.set(r.selectorCount, (selectorCountFreq.get(r.selectorCount) || 0) + 1);
    });
    
    let mostCommonSelectorCount = 0;
    let mostCommonSelectorFrequency = 0;
    selectorCountFreq.forEach((frequency, count) => {
        if (frequency > mostCommonSelectorFrequency) {
            mostCommonSelectorFrequency = frequency;
            mostCommonSelectorCount = count;
        }
    });
    
    metrics.mostCommonSelectorCount = mostCommonSelectorCount;
    metrics.largerThanCommonSelectorPercentage = rules.length > 0
        ? ((rules.filter(r => r.selectorCount > mostCommonSelectorCount).length / rules.length) * 100)
        : 0;
    
    return metrics;
}

// KOMPLEKSİTE hesaplaması
function calculateComplexityMetricsCK(selectors, cssText, declarations) {
    const metrics = {};
    
    // 1. SEÇİCİ KOMPLEKSİTESİ
    const complexities = selectors.map(sel => ({
        selector: sel,
        complexity: calculateCKComplexity(sel)
    }));
    
    metrics.maxSelectorComplexity = Math.max(...complexities.map(c => c.complexity), 0);
    metrics.avgSelectorComplexity = complexities.length > 0
        ? (complexities.reduce((sum, c) => sum + c.complexity, 0) / complexities.length)
        : 0;
    
    // 2. EN YAYGIN KOMPLEKSİTEDEN FAZLA OLANLAR
    const complexityMap = new Map();
    complexities.forEach(sc => {
        complexityMap.set(sc.complexity, (complexityMap.get(sc.complexity) || 0) + 1);
    });
    
    let mostCommonComplexity = 0;
    let mostCommonComplexityFrequency = 0;
    complexityMap.forEach((frequency, complexity) => {
        if (frequency > mostCommonComplexityFrequency) {
            mostCommonComplexityFrequency = frequency;
            mostCommonComplexity = complexity;
        }
    });
    
    metrics.mostCommonComplexity = mostCommonComplexity;
    const moreComplexThanCommon = complexities.filter(sc => sc.complexity > mostCommonComplexity);
    metrics.moreComplexThanCommonPercentage = complexities.length > 0
        ? ((moreComplexThanCommon.length / complexities.length) * 100)
        : 0;
    
    // 3. SEÇİCİ SPESİFİSİTESİ
    const specificities = selectors.map(sel => ({
        selector: sel,
        specificity: calculateCKSpecificity(sel)
    }));
    
    // En yüksek spesifisite
    metrics.maxSpecificity = Math.max(...specificities.map(s => s.specificity.total), 0);
    
    // 4. EN YAYGIN SPESİFİSİTEDEN FAZLA OLANLAR
    const specificityTotalMap = new Map();
    specificities.forEach(s => {
        specificityTotalMap.set(s.specificity.total, (specificityTotalMap.get(s.specificity.total) || 0) + 1);
    });
    
    let mostCommonSpecificityTotal = 0;
    let mostCommonSpecificityFrequency = 0;
    specificityTotalMap.forEach((frequency, total) => {
        if (frequency > mostCommonSpecificityFrequency) {
            mostCommonSpecificityFrequency = frequency;
            mostCommonSpecificityTotal = total;
        }
    });
    
    metrics.mostCommonSpecificityTotal = mostCommonSpecificityTotal;
    const moreSpecificThanCommon = specificities.filter(s => s.specificity.total > mostCommonSpecificityTotal);
    metrics.moreSpecificThanCommonPercentage = specificities.length > 0
        ? ((moreSpecificThanCommon.length / specificities.length) * 100)
        : 0;
    
    // 5. ID SEÇİCİ YÜZDESİ
    const idSelectors = selectors.filter(sel => {
        // Sadece # ile başlayan ID'ler, pseudo-class içindeki #'lar değil
        const cleanSel = sel.replace(/:.*?#/g, '');
        return /#(?!\{)[a-zA-Z][\w-]*/.test(cleanSel);
    });
    
    metrics.idSelectorPercentage = selectors.length > 0
        ? ((idSelectors.length / selectors.length) * 100)
        : 0;
    
    // 6. !important KULLANIMI
    const lines = cssText.split('\n');
    let importantLines = 0;
    lines.forEach(line => {
        if (line.includes('!important') && !line.trim().startsWith('//') && !line.trim().startsWith('/*')) {
            importantLines++;
        }
    });
    
    metrics.importantUsageCount = (cssText.match(/!important/g) || []).length;
    metrics.importantLines = importantLines;
    metrics.importantUsagePercentage = declarations.length > 0
        ? ((metrics.importantUsageCount / declarations.length) * 100)
        : 0;
    
    // 7. @import SAYISI
    metrics.importRules = (cssText.match(/@import\s+(url\()?['"][^'"]+['"]/g) || []).length;
    
    // 8. En karmaşık 5 seçici
    metrics.topComplexSelectors = complexities
        .filter(sc => sc.complexity > 5)
        .sort((a, b) => b.complexity - a.complexity)
        .slice(0, 5);
    
    return metrics;
}

// PERFORMANS - performans metriği
function calculatePerformanceMetricsCK(cssText, declarations, rules) {
    const metrics = {};
    
    // 1. DOSYA BOYUTU (62.2KB medyan)
    metrics.fileSizeBytes = cssText.length;
    metrics.fileSizeKB = cssText.length / 1024;
    
    // 2. YORUM BOYUTU
    const comments = cssText.match(/\/\*[\s\S]*?\*\//g) || [];
    metrics.commentSizeBytes = comments.reduce((sum, comment) => sum + comment.length, 0);
    metrics.commentSizeKB = metrics.commentSizeBytes / 1024;
    
    // 3. BASE64 GÖMÜLÜ İÇERİK
    const base64Pattern = /url\(['"]?data:[^)]+['"]?\)/gi;
    const embeddedMatches = cssText.match(base64Pattern) || [];
    metrics.embeddedContentBytes = embeddedMatches.reduce((sum, match) => sum + match.length, 0);
    metrics.embeddedSizeKB = metrics.embeddedContentBytes / 1024;
    
    // 4. KAYNAK KOD SATIRI (SLOC)
    const lines = cssText.split('\n');
    metrics.sourceLinesOfCode = lines.filter(line => {
        const trimmed = line.trim();
        return trimmed.length > 0 && 
               !trimmed.startsWith('//') && 
               !trimmed.startsWith('/*') && 
               trimmed !== '*/';
    }).length;
    
    // 5. PERFORMANS SORUNLU ANİMASYONLAR
    metrics.badAnimationCount = 0;
    metrics.badAnimationExamples = [];
    
    if (rules && Array.isArray(rules)) {
        rules.forEach(rule => {
            // Bu kuralda transition veya animation var mı?
            const hasTransitionOrAnimation = rule.declarations && rule.declarations.some(dec => 
                dec.property === 'transition' || dec.property === 'animation'
            );
            
            if (hasTransitionOrAnimation) {
                // Bu kuraldaki BAD_ANIMATION_PROPERTIES'leri bul
                rule.declarations.forEach(dec => {
                    if (BAD_ANIMATION_PROPERTIES.some(prop => 
                        dec.property && dec.property.includes(prop))) {
                        metrics.badAnimationCount++;
                        
                        // Transition/animation değerini bul
                        const transitionDecl = rule.declarations.find(d => 
                            d.property === 'transition' || d.property === 'animation'
                        );
                        
                        metrics.badAnimationExamples.push({
                            selector: rule.selector,
                            property: dec.property,
                            value: dec.value,
                            line: findLineNumber(cssText, rule.selector),
                            transition: transitionDecl ? transitionDecl.value : null
                        });
                    }
                });
            }
        });
    }
    
    // 6. PERFORMANSLI ANİMASYONLAR
    metrics.goodAnimationCount = 0;
    metrics.goodAnimationExamples = [];
    if (declarations && Array.isArray(declarations)) {
        declarations.forEach(dec => {
            if (GOOD_ANIMATION_PROPERTIES.some(prop => 
                dec.property && dec.property.includes(prop))) {
                metrics.goodAnimationCount++;
                
                const matchingRule = rules ? rules.find(r => 
                    r.declarations && r.declarations.some(d => 
                        d.property === dec.property && 
                        d.value === dec.value
                    )
                ) : null;
                
                metrics.goodAnimationExamples.push({
                    selector: matchingRule ? matchingRule.selector : 'Bilinmeyen',
                    property: dec.property,
                    value: dec.value,
                    line: matchingRule ? findLineNumber(cssText, matchingRule.selector) : 0
                });
            }
        });
    }
    
    // 7. PAHALI CSS ÖZELLİKLERİ
    metrics.expensivePropertyCount = 0;
    metrics.expensiveExamples = [];
    if (declarations && Array.isArray(declarations)) {
        declarations.forEach(dec => {
            if (EXPENSIVE_PROPERTIES.some(prop => 
                dec.property && dec.property.includes(prop))) {
                metrics.expensivePropertyCount++;
                
                const matchingRule = rules ? rules.find(r => 
                    r.declarations && r.declarations.some(d => 
                        d.property === dec.property && 
                        d.value === dec.value
                    )
                ) : null;
                
                metrics.expensiveExamples.push({
                    selector: matchingRule ? matchingRule.selector : 'Bilinmeyen',
                    property: dec.property,
                    value: dec.value,
                    line: matchingRule ? findLineNumber(cssText, matchingRule.selector) : 0
                });
            }
        });
    }
    
    // YENİ EKLENEN METRİKLER:
    
    // 8. PAINT TRIGGERING PROPERTIES
    metrics.paintTriggeringCount = 0;
    metrics.paintTriggeringExamples = [];
    if (declarations && Array.isArray(declarations)) {
        declarations.forEach(dec => {
            if (PAINT_TRIGGERING_PROPERTIES.some(prop => 
                dec.property && dec.property.includes(prop))) {
                metrics.paintTriggeringCount++;
                
                const matchingRule = rules ? rules.find(r => 
                    r.declarations && r.declarations.some(d => 
                        d.property === dec.property && 
                        d.value === dec.value
                    )
                ) : null;
                
                if (metrics.paintTriggeringExamples.length < 5) {
                    metrics.paintTriggeringExamples.push({
                        selector: matchingRule ? matchingRule.selector : 'Bilinmeyen',
                        property: dec.property,
                        value: dec.value,
                        line: matchingRule ? findLineNumber(cssText, matchingRule.selector) : 0
                    });
                }
            }
        });
    }
    
    // 9. COMPOSITE ONLY PROPERTIES
    metrics.compositeOnlyCount = 0;
    metrics.compositeOnlyExamples = [];
    if (declarations && Array.isArray(declarations)) {
        declarations.forEach(dec => {
            if (COMPOSITE_ONLY_PROPERTIES.some(prop => 
                dec.property && dec.property.includes(prop))) {
                metrics.compositeOnlyCount++;
                
                const matchingRule = rules ? rules.find(r => 
                    r.declarations && r.declarations.some(d => 
                        d.property === dec.property && 
                        d.value === dec.value
                    )
                ) : null;
                
                if (metrics.compositeOnlyExamples.length < 5) {
                    metrics.compositeOnlyExamples.push({
                        selector: matchingRule ? matchingRule.selector : 'Bilinmeyen',
                        property: dec.property,
                        value: dec.value,
                        line: matchingRule ? findLineNumber(cssText, matchingRule.selector) : 0
                    });
                }
            }
        });
    }
    
    // 10. LAYOUT TRIGGERING PROPERTIES
    metrics.layoutTriggeringCount = 0;
    metrics.layoutTriggeringExamples = [];
    if (declarations && Array.isArray(declarations)) {
        declarations.forEach(dec => {
            if (LAYOUT_TRIGGERING_PROPERTIES.some(prop => 
                dec.property && dec.property.includes(prop))) {
                metrics.layoutTriggeringCount++;
                
                const matchingRule = rules ? rules.find(r => 
                    r.declarations && r.declarations.some(d => 
                        d.property === dec.property && 
                        d.value === dec.value
                    )
                ) : null;
                
                if (metrics.layoutTriggeringExamples.length < 5) {
                    metrics.layoutTriggeringExamples.push({
                        selector: matchingRule ? matchingRule.selector : 'Bilinmeyen',
                        property: dec.property,
                        value: dec.value,
                        line: matchingRule ? findLineNumber(cssText, matchingRule.selector) : 0
                    });
                }
            }
        });
    }
    
    // 11. PERFORMANS YÜZDELERİ
    const totalDeclarations = declarations.length || 1; // Sıfıra bölmeyi önle
    metrics.expensivePercentage = (metrics.expensivePropertyCount / totalDeclarations) * 100;
    metrics.paintTriggeringPercentage = (metrics.paintTriggeringCount / totalDeclarations) * 100;
    metrics.compositeOnlyPercentage = (metrics.compositeOnlyCount / totalDeclarations) * 100;
    metrics.layoutTriggeringPercentage = (metrics.layoutTriggeringCount / totalDeclarations) * 100;
    
    return metrics;
}

// 2. Empty rulesets için düzeltilmiş parse fonksiyonu
function parseCSSForAnalysis(cssText) {
    const rules = [];
    const cleanedCSS = cssText.replace(/\/\*[\s\S]*?\*\//g, ''); // Yorumları kaldır
    let i = 0;
   
    while (i < cleanedCSS.length) {
        // @ kurallarını atla (basit analiz için)
        if (cleanedCSS[i] === '@') {
            let end = i + 1;
            let braceDepth = 0;
            while (end < cleanedCSS.length) {
                if (cleanedCSS[end] === '{') braceDepth++;
                if (cleanedCSS[end] === '}') braceDepth--;
                if (braceDepth === 0 && cleanedCSS[end] === '}') {
                    end++;
                    break;
                }
                end++;
            }
            i = end;
            continue;
        }
       
        // Normal kural arama
        const ruleStart = cleanedCSS.indexOf('{', i);
        if (ruleStart === -1) break;
       
        const selector = cleanedCSS.substring(i, ruleStart).trim();
       
        let ruleEnd = ruleStart + 1;
        let braceDepth = 1;
        while (ruleEnd < cleanedCSS.length && braceDepth > 0) {
            if (cleanedCSS[ruleEnd] === '{') braceDepth++;
            if (cleanedCSS[ruleEnd] === '}') braceDepth--;
            ruleEnd++;
        }
       
        const declarationText = cleanedCSS.substring(ruleStart + 1, ruleEnd - 1).trim();
       
        const rule = {
            selector: selector,
            declarations: declarationText ? declarationText.split(';')
                .filter(dec => dec.trim())
                .map(dec => {
                    const [property, ...valueParts] = dec.split(':');
                    return {
                        property: property ? property.trim() : '',
                        value: valueParts.length > 0 ? valueParts.join(':').trim() : '',
                        full: dec.trim()
                    };
                }) : [],
            selectorCount: selector.split(',').length,
            declarationCount: declarationText ? declarationText.split(';').filter(d => d.trim()).length : 0
        };
       
        // Boş kuralları da dahil et
        rules.push(rule);
       
        i = ruleEnd;
    }
   
    return rules;
}

// 3-4-5. Complexity metrikleri için düzeltilmiş hesaplama fonksiyonu
function calculateComplexityMetricsCK(selectors, cssText, declarations) {
    const metrics = {};
    
    // 1. SEÇİCİ KOMPLEKSİTESİ
    const complexities = selectors.map(sel => ({
        selector: sel,
        complexity: calculateCKComplexity(sel)
    }));
    
    metrics.maxSelectorComplexity = Math.max(...complexities.map(c => c.complexity), 0);
    metrics.avgSelectorComplexity = complexities.length > 0
        ? (complexities.reduce((sum, c) => sum + c.complexity, 0) / complexities.length)
        : 0;
    
    // Ortalama karmaşıklık üstündeki seçicileri bul
    metrics.aboveAvgComplexitySelectors = complexities
        .filter(sc => sc.complexity > metrics.avgSelectorComplexity)
        .sort((a, b) => b.complexity - a.complexity)
        .slice(0, 5);
    
    // 2. EN YAYGIN KOMPLEKSİTEDEN FAZLA OLANLAR
    const complexityMap = new Map();
    complexities.forEach(sc => {
        complexityMap.set(sc.complexity, (complexityMap.get(sc.complexity) || 0) + 1);
    });
    
    let mostCommonComplexity = 0;
    let mostCommonComplexityFrequency = 0;
    complexityMap.forEach((frequency, complexity) => {
        if (frequency > mostCommonComplexityFrequency) {
            mostCommonComplexityFrequency = frequency;
            mostCommonComplexity = complexity;
        }
    });
    
    metrics.mostCommonComplexity = mostCommonComplexity;
    const moreComplexThanCommon = complexities.filter(sc => sc.complexity > mostCommonComplexity);
    metrics.moreComplexThanCommonPercentage = complexities.length > 0
        ? ((moreComplexThanCommon.length / complexities.length) * 100)
        : 0;
    
    // Yaygın olandan karmaşık seçicileri kaydet
    metrics.moreComplexThanCommonExamples = moreComplexThanCommon
        .sort((a, b) => b.complexity - a.complexity)
        .slice(0, 5);
    
    // 3. SEÇİCİ SPESİFİSİTESİ
    const specificities = selectors.map(sel => ({
        selector: sel,
        specificity: calculateCKSpecificity(sel)
    }));
    
    metrics.maxSpecificity = Math.max(...specificities.map(s => s.specificity.total), 0);
    
    // 4. EN YAYGIN SPESİFİSİTEDEN FAZLA OLANLAR
    const specificityTotalMap = new Map();
    specificities.forEach(s => {
        specificityTotalMap.set(s.specificity.total, (specificityTotalMap.get(s.specificity.total) || 0) + 1);
    });
    
    let mostCommonSpecificityTotal = 0;
    let mostCommonSpecificityFrequency = 0;
    specificityTotalMap.forEach((frequency, total) => {
        if (frequency > mostCommonSpecificityFrequency) {
            mostCommonSpecificityFrequency = frequency;
            mostCommonSpecificityTotal = total;
        }
    });
    
    metrics.mostCommonSpecificityTotal = mostCommonSpecificityTotal;
    const moreSpecificThanCommon = specificities.filter(s => s.specificity.total > mostCommonSpecificityTotal);
    metrics.moreSpecificThanCommonPercentage = specificities.length > 0
        ? ((moreSpecificThanCommon.length / specificities.length) * 100)
        : 0;
    
    // Yaygın olandan spesifik seçicileri kaydet
    metrics.moreSpecificThanCommonExamples = moreSpecificThanCommon
        .sort((a, b) => b.specificity.total - a.specificity.total)
        .slice(0, 5);
    
    // 5. ID SEÇİCİ YÜZDESİ
    const idSelectors = selectors.filter(sel => {
        const cleanSel = sel.replace(/:.*?#/g, '');
        return /#(?!\{)[a-zA-Z][\w-]*/.test(cleanSel);
    });
    
    metrics.idSelectorPercentage = selectors.length > 0
        ? ((idSelectors.length / selectors.length) * 100)
        : 0;
    
    // 6. !important KULLANIMI
    const lines = cssText.split('\n');
    let importantLines = 0;
    lines.forEach(line => {
        if (line.includes('!important') && !line.trim().startsWith('//') && !line.trim().startsWith('/*')) {
            importantLines++;
        }
    });
    
    metrics.importantUsageCount = (cssText.match(/!important/g) || []).length;
    metrics.importantLines = importantLines;
    metrics.importantUsagePercentage = declarations.length > 0
        ? ((metrics.importantUsageCount / declarations.length) * 100)
        : 0;
    
    // 7. @import SAYISI
    metrics.importRules = (cssText.match(/@import\s+(url\()?['"][^'"]+['"]/g) || []).length;
    
    // 8. En karmaşık 5 seçici
    metrics.topComplexSelectors = complexities
        .filter(sc => sc.complexity > 5)
        .sort((a, b) => b.complexity - a.complexity)
        .slice(0, 5);
    
    return metrics;
}

// KOMPLEKSİTE HESAPLAMA
function calculateCKComplexity(selector) {
    if (!selector) return 0;
    
    let complexity = 0;
    
    // 1. Her seçici (element, class, id) = +1
    // 2. Her combinator ( > + ~ ) = +1
    // 3. Her pseudo-class/element = +1
    // 4. Her attribute selector = +1
    
    // Basit parçalama
    const parts = selector.split(/(?=[ >+~])|(?<=[ >+~])/).filter(p => p.trim());
    
    parts.forEach(part => {
        const trimmed = part.trim();
        
        // Combinator kontrolü
        if (/^[ >+~]$/.test(trimmed)) {
            complexity += 1;
            return;
        }
        
        // Seçici sayısı
        // Class selector (.class)
        complexity += (trimmed.match(/\.[a-zA-Z_][\w-]*/g) || []).length;
        
        // ID selector (#id)
        complexity += (trimmed.match(/#[a-zA-Z_][\w-]*/g) || []).length;
        
        // Attribute selector ([attr=value])
        complexity += (trimmed.match(/\[[^\]]+\]/g) || []).length;
        
        // Pseudo-class (:hover)
        complexity += (trimmed.match(/:+[a-zA-Z-]+(?:\([^)]+\))?/g) || []).length;
        
        // Element selector (div, span)
        if (/^[a-zA-Z][a-zA-Z0-9]*$/.test(trimmed) && 
            !['not', 'is', 'has', 'where'].includes(trimmed.toLowerCase())) {
            complexity += 1;
        }
    });
    
    return complexity;
}

// SPESİFİSİTE HESAPLAMA
function calculateCKSpecificity(selector) {
    // a = !important
    // b = ID sayısı
    // c = class, attribute, pseudo-class sayısı
    // d = element, pseudo-element sayısı
    
    let a = 0; // genelde 0, !important ayrı metrik
    let b = 0; // ID'ler
    let c = 0; // Class, attribute, pseudo-class
    let d = 0; // Element, pseudo-element
    
    // ID selector'ları (#id)
    b += (selector.match(/#[a-zA-Z_][\w-]*/g) || []).length;
    
    // Class selector'ları (.class)
    c += (selector.match(/\.[a-zA-Z_][\w-]*/g) || []).length;
    
    // Attribute selector'ları ([attr])
    c += (selector.match(/\[[^\]]+\]/g) || []).length;
    
    // Pseudo-class'lar (:hover, :nth-child)
    const pseudoClasses = selector.match(/:+[a-zA-Z-]+(?:\([^)]+\))?/g) || [];
    pseudoClasses.forEach(pseudo => {
        // :not, :is, :has gibi functional pseudo-class'lar içindeki seçicileri de say
        if (pseudo.includes('(') && pseudo.includes(')')) {
            const inner = pseudo.match(/\(([^)]+)\)/);
            if (inner) {
                const innerSpecificity = calculateCKSpecificity(inner[1]);
                b += innerSpecificity.b;
                c += innerSpecificity.c;
                d += innerSpecificity.d;
            }
        }
        c += 1; // Pseudo-class kendisi
    });
    
    // Element selector'ları (div, span)
    const elements = selector.split(/(?=[ >+~])|(?<=[ >+~])/)
        .map(p => p.trim())
        .filter(p => p && !/^[ >+~]$/.test(p));
    
    elements.forEach(element => {
        const elementOnly = element.replace(/[.#\[].*$/, '');
        if (elementOnly && /^[a-zA-Z][a-zA-Z0-9]*$/.test(elementOnly)) {
            d += 1;
        }
    });
    
    // Pseudo-element'ler (::before, ::after)
    d += (selector.match(/::[a-zA-Z-]+/g) || []).length;
    
    return {
        a, b, c, d,
        total: a * 1000 + b * 100 + c * 10 + d
    };
}

// ==================== METRİK GÖSTERİM FONKSİYONLARI ====================

function generateMaintainabilityMetricsDisplay(metrics, cssText, rules) {
    const rulesWithManyDeclarations = rules.filter(r => r.declarationCount > 10);
    const emptyRulesets = rules.filter(r => r.declarationCount === 0);
    const largeDeclarationBlocks = rules.filter(r => r.declarationCount > 20);
    const largerThanCommonSelectorLists = rules.filter(r => r.selectorCount > metrics.mostCommonSelectorCount);
    
    // Duplicate declarations için detaylı kod
    const declarationFrequency = new Map();
    const declarationExamples = new Map();
    
    rules.forEach(rule => {
        rule.declarations.forEach(dec => {
            const key = `${dec.property.trim().toLowerCase()}:${dec.value.trim().toLowerCase()}`;
            if (!declarationFrequency.has(key)) {
                declarationFrequency.set(key, []);
            }
            declarationFrequency.get(key).push({
                rule,
                line: findLineNumber(cssText, rule.selector),
                declaration: dec
            });
        });
    });
    
    const duplicateDeclarations = Array.from(declarationFrequency.entries())
        .filter(([_, items]) => items.length > 1);
    
    // Duplicate selectors için detaylı kod
    const selectorMap = new Map();
    rules.flatMap(r => r.selector.split(',').map(s => s.trim())).forEach(sel => {
        if (!selectorMap.has(sel)) {
            selectorMap.set(sel, []);
        }
        const rule = rules.find(r => r.selector.includes(sel));
        selectorMap.get(sel).push({
            selector: sel,
            line: findLineNumber(cssText, sel),
            rule: rule
        });
    });
    
    const duplicateSelectors = Array.from(selectorMap.entries())
        .filter(([_, items]) => items.length > 1);
    
    // Ortalama üstü deklarasyon içeren kurallar
    const aboveAvgDeclarationRules = rules.filter(r => r.declarationCount > metrics.avgDeclarationsPerRule);
    
    // Ortalama üstü seçici içeren kurallar
    const aboveAvgSelectorRules = rules.filter(r => r.selectorCount > metrics.avgSelectorsPerRule);
    
    // Çok seçici içeren kurallar
    const manySelectorRules = rules.filter(r => r.selectorCount > 3);
    
    return [
        {
            id: 'max-declarations',
            title: 'Tek bir kural setinde birçok bildiriden kaçının',
            value: (metrics.maxDeclarationsPerRule) + ' adet',
            target: 10,
            category: 'maintainability',
            description: 'Tek bir kural setindeki maksimum bildiri sayısı düşük olmalıdır. Büyük sayı, kural setini taramanın zor olduğu ve doğru bildiriyi bulmanın zor olabileceği anlamına gelir.',
            status: metrics.maxDeclarationsPerRule < 10 ? 'good' : metrics.maxDeclarationsPerRule < 28 ? 'medium' : 'bad',
            problematicCodes: rulesWithManyDeclarations.length === 0 ? 
                [`<div class="code-icon">✅</div><div class="code-text">Maksimum deklarasyon sayısı: ${metrics.maxDeclarationsPerRule} (hedef: < 10)</div>`] : 
                rulesWithManyDeclarations.slice(0, 3).map(r =>
                    `<div class="code-icon">⚠️</div><div class="code-text">${findLineNumber(cssText, r.selector)}. satır: ${r.selector} \n   ${truncateText(r.declarations.map(d => `${d.property}: ${d.value}`).join('; '), 80)}</div>`
                )
        },
        {
            id: 'avg-declarations',
            title: 'RuleSet başına ortalama beyanları düşük tutun',
            value: parseFloat(metrics.avgDeclarationsPerRule.toFixed(2)),
            target: 6.15,
            category: 'maintainability',
            description: 'Declaration block boyutu, CSS\'deki tutarsızlıkları önlemek için tutarlı ve küçük olmalıdır, bu da hata ayıklamayı zorlaştırabilir.',
            status: metrics.avgDeclarationsPerRule <= 6.15 ? 'good' : metrics.avgDeclarationsPerRule <= 8 ? 'medium' : 'bad',
            problematicCodes: aboveAvgDeclarationRules.length === 0 ? 
                [`<div class="code-icon">✅</div><div class="code-text">Ortalama deklarasyon: ${metrics.avgDeclarationsPerRule.toFixed(2)} (hedef: ≤ 6.15)</div>`] : 
                aboveAvgDeclarationRules.slice(0, 3).map(r =>
                    `<div class="code-icon">⚠️</div><div class="code-text">${findLineNumber(cssText, r.selector)}. satır: ${r.selector} (${r.declarationCount} deklarasyon)\n   Örnek: ${truncateText(r.declarations[0]?.property + ': ' + r.declarations[0]?.value, 60)}</div>`
                )
        },
        {
            id: 'declaration-duplications',
            title: 'Beyan Tekrarları',
            value: '%' + (parseFloat(metrics.declarationDuplicationPercentage.toFixed(1))),
            target: 50,
            category: 'maintainability',
            description: 'Dosya boyutunu minimumda tutmak için, beyannameler çok sık tekrarlanmamalıdır.',
            status: metrics.declarationDuplicationPercentage <= 50 ? 'good' : metrics.declarationDuplicationPercentage <= 80 ? 'medium' : 'bad',
            problematicCodes: duplicateDeclarations.length === 0 ? 
                [`<div class="code-icon">✅</div><div class="code-text">Deklarasyon tekrarı: %${metrics.declarationDuplicationPercentage.toFixed(1)} (hedef: ≤ 50%)</div>`] : 
                duplicateDeclarations.slice(0, 3).map(([key, items]) =>
                    `<div class="code-icon">⚠️</div><div class="code-text">"${key}" ${items.length} kez tekrarlandı:\n${items.slice(0, 2).map(item => 
                        `   <br>${item.line}. satır: ${truncateText(item.rule.selector, 40)}`
                    ).join('\n')}</div>`
                )
        },
        {
            id: 'larger-declaration-blocks',
            title: 'Normalden daha büyük bildiri bloklarından kaçının',
            value: (metrics.largeDeclarationBlocksOver20 || largeDeclarationBlocks.length) + ' adet',
            target: 0,
            category: 'maintainability',
            description: 'Declaration block boyutu, CSS\'deki tutarsızlıkları önlemek için tutarlı ve küçük olmalıdır.',
            status: (function() {
                const count = metrics.largeDeclarationBlocksOver20 || largeDeclarationBlocks.length;
                return count < 1 ? 'good' : count < 10 ? 'medium' : 'bad';
            })(),
            problematicCodes: largeDeclarationBlocks.length === 0 ? 
                [`<div class="code-icon">✅</div><div class="code-text">Büyük deklarasyon bloğu bulunmadı (20+ deklarasyon)</div>`] : 
                largeDeclarationBlocks.slice(0, 3).map(r =>
                    `<div class="code-icon">⚠️</div><div class="code-text">${findLineNumber(cssText, r.selector)}. satır: ${r.selector} \n   Toplam ${r.declarationCount} deklarasyon:\n${r.declarations.slice(0, 3).map(d => 
                        `   <br>${d.property}. satır: ${truncateText(d.value, 40)}`
                    ).join('\n')}${r.declarationCount > 3 ? `\n   ... ve ${r.declarationCount - 3} daha` : ''}</div>`
                )
        },
        {
            id: 'empty-rulesets',
            title: 'Boş kural setlerini kaldır',
            value: (metrics.emptyRulesets) + ' adet',
            target: 0,
            category: 'maintainability',
            description: 'Boş kural setleri herhangi bir stile katkıda bulunmaz ve kaldırılmalıdır.',
            status: metrics.emptyRulesets === 0 ? 'good' : metrics.emptyRulesets <= 3 ? 'medium' : 'bad',
            problematicCodes: emptyRulesets.length === 0 ? 
                [`<div class="code-icon">✅</div><div class="code-text">Boş kural seti bulunmadı</div>`] : 
                emptyRulesets.slice(0, 3).map(r =>
                    `<div class="code-icon">⚠️</div><div class="code-text">${findLineNumber(cssText, r.selector)}. satır: ${r.selector} \n   Bu kural seti boş, hiç deklarasyon içermiyor.</div>`
                )
        },
        {
            id: 'selector-duplications',
            title: 'Birçok selector kod fazlalığından kaçının',
            value: '%' + (parseFloat(metrics.selectorDuplicationPercentage.toFixed(1))),
            target: 23.5,
            category: 'maintainability',
            description: 'Dosya boyutunu minimumda tutmak için seçiciler çok sık tekrarlanmamalıdır.',
            status: metrics.selectorDuplicationPercentage <= 23.5 ? 'good' : metrics.selectorDuplicationPercentage <= 35 ? 'medium' : 'bad',
            problematicCodes: duplicateSelectors.length === 0 ? 
                [`<div class="code-icon">✅</div><div class="code-text">Seçici tekrarı: %${metrics.selectorDuplicationPercentage.toFixed(1)} (hedef: ≤ 23.5%)</div>`] : 
                duplicateSelectors.slice(0, 3).map(([selector, items]) =>
                    `<div class="code-icon">⚠️</div><div class="code-text">"${selector}" ${items.length} kez tekrarlandı:\n${items.slice(0, 2).map(item => 
                        `   <br>${item.line}. satır: ${truncateText(item.rule?.selector || selector, 50)}`
                    ).join('\n')}</div>`
                )
        },
        {
            id: 'avg-selectors',
            title: 'RuleSet başına ortalama seçicileri düşük tutun',
            value: parseFloat(metrics.avgSelectorsPerRule.toFixed(2)),
            target: 1.09,
            category: 'maintainability',
            description: 'Kural seti başına ortalama seçici sayısı düşük olmalı.',
            status: metrics.avgSelectorsPerRule <= 1.09 ? 'good' : metrics.avgSelectorsPerRule <= 1.5 ? 'medium' : 'bad',
            problematicCodes: aboveAvgSelectorRules.length === 0 ? 
                [`<div class="code-icon">✅</div><div class="code-text">Ortalama seçici sayısı: ${metrics.avgSelectorsPerRule.toFixed(2)} (hedef: ≤ 1.09)</div>`] : 
                aboveAvgSelectorRules.slice(0, 3).map(r =>
                    `<div class="code-icon">⚠️</div><div class="code-text">${findLineNumber(cssText, r.selector)}. satır: ${r.selector} \n   ${r.selectorCount} seçici: ${r.selector.split(',').length > 3 ? 
                        r.selector.split(',').slice(0, 3).join(', ') + '...' : 
                        r.selector}</div>`
                )
        },
        {
            id: 'max-selectors',
            title: 'RuleSet\'de çok sayıda seçiciden kaçının',
            value: (metrics.maxSelectorsPerRule) + ' satır',
            target: 3,
            category: 'maintainability',
            description: 'Tek bir kural setindeki maksimum seçici sayısı düşük olmalıdır.',
            status: metrics.maxSelectorsPerRule <= 3 ? 'good' : metrics.maxSelectorsPerRule <= 5 ? 'medium' : 'bad',
            problematicCodes: manySelectorRules.length === 0 ? 
                [`<div class="code-icon">✅</div><div class="code-text">Maksimum seçici sayısı: ${metrics.maxSelectorsPerRule} (hedef: ≤ 3)</div>`] : 
                manySelectorRules.slice(0, 3).map(r =>
                    `<div class="code-icon">⚠️</div><div class="code-text">${findLineNumber(cssText, r.selector)}. satır: ${r.selector} \n   Toplam ${r.selectorCount} seçici:\n${r.selector.split(',').slice(0, 3).map((sel, i) => 
                        `   <br>${sel.trim()}`
                    ).join('\n')}${r.selectorCount > 3 ? `\n   ... ve ${r.selectorCount - 3} daha` : ''}</div>`
                )
        },
        {
            id: 'larger-selectorlists',
            title: 'Yaygın SelectorList\'lerden daha büyük olmaktan kaçının',
            value: '%' + (parseFloat(metrics.largerThanCommonSelectorPercentage.toFixed(1))),
            target: 0,
            category: 'maintainability',
            description: 'SelectorList uzunluğu tutarlı ve küçük olmalıdır.',
            status: metrics.largerThanCommonSelectorPercentage <= 20 ? 'good' : metrics.largerThanCommonSelectorPercentage <= 40 ? 'medium' : 'bad',
            problematicCodes: largerThanCommonSelectorLists.length === 0 ? 
                [`<div class="code-icon">✅</div><div class="code-text">Yaygın olandan büyük seçici listesi: %${metrics.largerThanCommonSelectorPercentage.toFixed(1)} (hedef: ≤ 20%)</div>`] : 
                largerThanCommonSelectorLists.slice(0, 3).map(r =>
                    `<div class="code-icon">⚠️</div><div class="code-text">${findLineNumber(cssText, r.selector)}. satır: ${r.selector} \n   ${r.selectorCount} seçici (ortalamadan fazla: ${metrics.mostCommonSelectorCount})</div>`
                )
        }
    ];
}

function generateComplexityMetricsDisplay(metrics, cssText, selectors) {
    // more-complex-than-common için örnek kodlar
    const moreComplexExamples = [];
    if (metrics.moreComplexThanCommonExamples && Array.isArray(metrics.moreComplexThanCommonExamples)) {
        metrics.moreComplexThanCommonExamples.slice(0, 3).forEach(sc => {
            if (sc && sc.selector) {
                const line = findLineNumber(cssText, sc.selector);
                const context = getLineContaining(cssText, sc.selector, 60);
                moreComplexExamples.push(`<div class="code-icon">⚠️</div><div class="code-text">${line}. satır: ${truncateText(context, 80)}\n   Karmaşıklık: ${sc.complexity || 0} (en yaygın: ${metrics.mostCommonComplexity || 0})</div>`);
            }
        });
    }
    
    // more-specific-than-common için örnek kodlar
    const moreSpecificExamples = [];
    if (metrics.moreSpecificThanCommonExamples && Array.isArray(metrics.moreSpecificThanCommonExamples)) {
        metrics.moreSpecificThanCommonExamples.slice(0, 3).forEach(s => {
            if (s && s.selector) {
                const line = findLineNumber(cssText, s.selector);
                const context = getLineContaining(cssText, s.selector, 60);
                moreSpecificExamples.push(`<div class="code-icon">⚠️</div><div class="code-text">${line}. satır: ${truncateText(context, 80)}\n   Spesifisite: ${(s.specificity && s.specificity.total) || 0} (en yaygın: ${metrics.mostCommonSpecificityTotal || 0})</div>`);
            }
        });
    }
    
    // avg-selector-complexity için örnek kodlar
    const aboveAvgComplexityExamples = [];
    if (metrics.aboveAvgComplexitySelectors && Array.isArray(metrics.aboveAvgComplexitySelectors)) {
        metrics.aboveAvgComplexitySelectors.slice(0, 3).forEach(sc => {
            if (sc && sc.selector) {
                const line = findLineNumber(cssText, sc.selector);
                const context = getLineContaining(cssText, sc.selector, 60);
                aboveAvgComplexityExamples.push(`<div class="code-icon">⚠️</div><div class="code-text">${line}. satır: ${truncateText(context, 80)}\n   Karmaşıklık: ${sc.complexity || 0} (ortalama: ${(metrics.avgSelectorComplexity || 0).toFixed(2)})</div>`);
            }
        });
    }
    
    // ID seçici örnekleri
    const idSelectorPattern = /#[a-zA-Z][\w-]*(?![^{]*\})/g;
    const idMatches = cssText.match(idSelectorPattern) || [];
    const idExamples = idMatches.slice(0, 3).map(id => {
        const line = findLineNumber(cssText, id);
        const context = getLineContaining(cssText, id, 50);
        return `<div class="code-icon">⚠️</div><div class="code-text">${line}. satır: ${truncateText(context, 80)}</div>`;
    });
    
    // !important örnekleri
    const lines = cssText.split('\n');
    const importantLines = [];
    lines.forEach((line, index) => {
        if (line.includes('!important') && !line.trim().startsWith('//') && !line.trim().startsWith('/*')) {
            importantLines.push(`<div class="code-icon">⚠️</div><div class="code-text">${index + 1}. satır: ${truncateText(line.trim(), 80)}</div>`);
        }
    });
    
    // @import örnekleri
    const importMatches = cssText.match(/@import\s+(url\()?['"][^'"]+['"]/g) || [];
    const importExamples = importMatches.slice(0, 3).map(imp => {
        const line = findLineNumber(cssText, imp);
        return `<div class="code-icon">⚠️</div><div class="code-text">${line}. satır: ${truncateText(imp, 80)}</div>`;
    });
    
    return [
        {
            id: 'more-complex-than-common',
            title: 'Yaygın seçici karmaşıklığından kaçının',
            value: '%' + (parseFloat((metrics.moreComplexThanCommonPercentage || 0).toFixed(1))),
            target: 60.2,
            category: 'complexity',
            description: 'Selector Karmaşıklığı, özgüllük sorunları veya geliştiricilerin farklı Selector adlandırma kuralları nedeniyle kafalarını karıştırmasını önlemek için tutarlı olmalıdır.',
            status: (metrics.moreComplexThanCommonPercentage || 0) <= 60.2 ? 'good' : (metrics.moreComplexThanCommonPercentage || 0) <= 70 ? 'medium' : 'bad',
            problematicCodes: (metrics.moreComplexThanCommonPercentage || 0) <= 60.2 ? 
                [`<div class="code-icon">✅</div><div class="code-text">Yaygın olandan karmaşık seçiciler: %${(metrics.moreComplexThanCommonPercentage || 0).toFixed(1)} (hedef: ≤ 60.2%)</div>`] : 
                moreComplexExamples.length > 0 ? moreComplexExamples : 
                [`<div class="code-icon">⚠️</div><div class="code-text">Yüksek oranda karmaşık seçici: %${(metrics.moreComplexThanCommonPercentage || 0).toFixed(1)} (hedef: ≤ 60.2%)</div>`]
        },
        {
            id: 'more-specific-than-common',
            title: 'Yüksek seçici özgüllüğünden kaçının',
            value: '%' + (parseFloat((metrics.moreSpecificThanCommonPercentage || 0).toFixed(1))),
            target: 63.0,
            category: 'complexity',
            description: 'Selector Specificity, özgüllük sorunları veya geliştiricilerin farklı selector adlandırma kuralları nedeniyle kafalarını karıştırmasını önlemek için tutarlı olmalıdır.',
            status: (metrics.moreSpecificThanCommonPercentage || 0) <= 63.0 ? 'good' : (metrics.moreSpecificThanCommonPercentage || 0) <= 75 ? 'medium' : 'bad',
            problematicCodes: (metrics.moreSpecificThanCommonPercentage || 0) <= 63.0 ? 
                [`<div class="code-icon">✅</div><div class="code-text">Yaygın olandan spesifik seçiciler: %${(metrics.moreSpecificThanCommonPercentage || 0).toFixed(1)} (hedef: ≤ 63.0%)</div>`] : 
                moreSpecificExamples.length > 0 ? moreSpecificExamples : 
                [`<div class="code-icon">⚠️</div><div class="code-text">Yüksek oranda spesifik seçici: %${(metrics.moreSpecificThanCommonPercentage || 0).toFixed(1)} (hedef: ≤ 63.0%)</div>`]
        },
        {
            id: 'avg-selector-complexity',
            title: 'Ortalama selector karmaşıklığını düşük tutun',
            value: parseFloat((metrics.avgSelectorComplexity || 0).toFixed(2)),
            target: 1.95,
            category: 'complexity',
            description: 'Düşük seçici karmaşıklığı genellikle seçicilerin basit olduğu anlamına gelir.',
            status: (metrics.avgSelectorComplexity || 0) <= 1.95 ? 'good' : (metrics.avgSelectorComplexity || 0) <= 2.5 ? 'medium' : 'bad',
            problematicCodes: (metrics.avgSelectorComplexity || 0) <= 2.5 ? 
                [`<div class="code-icon">✅</div><div class="code-text">Ortalama karmaşıklık: ${(metrics.avgSelectorComplexity || 0).toFixed(2)} (hedef: ≤ 1.95)</div>`] : 
                aboveAvgComplexityExamples.length > 0 ? aboveAvgComplexityExamples : 
                [`<div class="code-icon">⚠️</div><div class="code-text">Yüksek ortalama karmaşıklık: ${(metrics.avgSelectorComplexity || 0).toFixed(2)} (hedef: ≤ 1.95)</div>`]
        },
        {
            id: 'avoid-complex-selectors',
            title: 'Karmaşık seçicilerden kaçının',
            value: (metrics.maxSelectorComplexity) + ' satır',
            target: 6,
            category: 'complexity',
            description: 'Yüksek karmaşıklık, bir seçicinin birkaç bölümden oluşması ve her biri seçicinin hedeflediği şeyi anlamanın karmaşıklığını artırır.',
            status: metrics.maxSelectorComplexity <= 6 ? 'good' : metrics.maxSelectorComplexity <= 10 ? 'medium' : 'bad',
            problematicCodes: metrics.maxSelectorComplexity <= 6 ? 
                [`<div class="code-icon">✅</div><div class="code-text">Maksimum karmaşıklık: ${metrics.maxSelectorComplexity} (hedef: ≤ 6)</div>`] : 
                metrics.topComplexSelectors && metrics.topComplexSelectors.length > 0 ? 
                metrics.topComplexSelectors.slice(0, 3).map(sc => {
                    const line = findLineNumber(cssText, sc.selector);
                    const context = getLineContaining(cssText, sc.selector, 70);
                    return `<div class="code-icon">⚠️</div><div class="code-text">${line}. satır: ${truncateText(context, 80)}\n   Karmaşıklık: ${sc.complexity} (hedef: ≤ 6)</div>`;
                }) : 
                [`<div class="code-icon">⚠️</div><div class="code-text">En karmaşık seçici: ${metrics.maxSelectorComplexity} karmaşıklık değeri (hedef: ≤ 6)</div>`]
        },
        {
            id: 'avoid-import',
            title: '@import kullanımından kaçının',
            value: (metrics.importRules) + ' adet',
            target: 0,
            category: 'complexity',
            description: 'Performans nedenleriyle CSS\'de kullanılmamalıdır.',
            status: metrics.importRules === 0 ? 'good' : metrics.importRules <= 2 ? 'medium' : 'bad',
            problematicCodes: metrics.importRules === 0 ? 
                [`<div class="code-icon">✅</div><div class="code-text">@import kuralı bulunmadı</div>`] : 
                importExamples.length > 0 ? importExamples : 
                [`<div class="code-icon">⚠️</div><div class="code-text">${metrics.importRules} adet @import kuralı bulundu</div>`]
        },
        {
            id: 'avoid-id-selectors',
            title: 'ID selector kullanımını düşük tutun',
            value: '%' + (parseFloat(metrics.idSelectorPercentage.toFixed(1))),
            target: 7.1,
            category: 'complexity',
            description: 'CSS dosyasındaki ID selector sayısı özgüllük sorunlarından kaçınmak için düşük olmalıdır.',
            status: metrics.idSelectorPercentage <= 7.1 ? 'good' : metrics.idSelectorPercentage <= 15 ? 'medium' : 'bad',
            problematicCodes: metrics.idSelectorPercentage <= 7.1 ? 
                [`<div class="code-icon">✅</div><div class="code-text">ID seçici oranı: %${metrics.idSelectorPercentage.toFixed(1)} (hedef: ≤ 7.1%)</div>`] : 
                idExamples.length > 0 ? idExamples : 
                [`<div class="code-icon">⚠️</div><div class="code-text">Yüksek ID seçici oranı: %${metrics.idSelectorPercentage.toFixed(1)} (hedef: ≤ 7.1%)</div>`]
        },
        {
            id: 'keep-important-low',
            title: '!important kullanımını düşük tutun',
            value: (parseFloat(metrics.importantUsagePercentage.toFixed(1))) + ' adet',
            target: 2,
            category: 'complexity',
            description: '!important CSS\'deki Bildiri miktarı az olmalı, böylece özgüllük sorunları önlenebilir.',
            status: metrics.importantUsagePercentage <= 2 ? 'good' : metrics.importantUsagePercentage <= 5 ? 'medium' : 'bad',
            problematicCodes: metrics.importantUsageCount === 0 ? 
                [`<div class="code-icon">✅</div><div class="code-text">!important kullanımı bulunmadı</div>`] : 
                importantLines.length > 0 ? importantLines.slice(0, 3) : 
                [`<div class="code-icon">⚠️</div><div class="code-text">${metrics.importantUsageCount} adet !important kullanımı (%${metrics.importantUsagePercentage.toFixed(1)})</div>`]
        }
    ];
}

function generatePerformanceMetricsDisplay(metrics, cssText, rules, declarations) {
    // 1. Dosya boyutu için detaylar
    const fileSizeExamples = [];
    if (metrics.fileSizeKB > 62.2) {
        // En büyük 3 kuralı bul
        const largestRules = [...rules].sort((a, b) => {
            const aSize = JSON.stringify(a).length;
            const bSize = JSON.stringify(b).length;
            return bSize - aSize;
        }).slice(0, 3);
        
        largestRules.forEach(r => {
            const ruleSize = JSON.stringify(r).length;
            const line = findLineNumber(cssText, r.selector);
            fileSizeExamples.push(`<div class="code-icon">📏</div><div class="code-text">${line}. satır: ${truncateText(r.selector, 50)} (${ruleSize} karakter)</div>`);
        });
    }
    
    // 2. Yorum boyutu için detaylar
    const comments = cssText.match(/\/\*[\s\S]*?\*\//g) || [];
    const problematicComments = comments
        .filter(comment => comment.length > 100)
        .sort((a, b) => b.length - a.length)
        .slice(0, 3)
        .map(c => {
            const line = findLineNumber(cssText, c.substring(0, Math.min(50, c.length)));
            const lines = c.split('\n').length;
            return `<div class="code-icon">💬</div><div class="code-text">${line}. satır: ${lines} satırlık yorum (${c.length} karakter)\n   ${truncateText(c.replace(/\n/g, ' '), 100)}...</div>`;
        });
    
    // 3. Gömülü içerik için detaylar
    const embeddedPattern = /url\(['"]?data:[^)]+['"]?\)/gi;
    const embeddedMatches = cssText.match(embeddedPattern) || [];
    const embeddedExamples = embeddedMatches.slice(0, 3).map(e => {
        const line = findLineNumber(cssText, e.substring(0, Math.min(30, e.length)));
        const size = e.length;
        const typeMatch = e.match(/data:([^;,]+)/);
        const type = typeMatch ? typeMatch[1] : 'bilinmeyen';
        return `<div class="code-icon">📦</div><div class="code-text">${line}. satır: ${type} (${size} karakter)\n   ${truncateText(e, 80)}</div>`;
    });
    
    // 4. Kaynak kodu satırları için detaylar
    const sourceLines = cssText.split('\n');
    const sourceLineExamples = sourceLines.length > 2649 ? [
        `<div class="code-icon">📝</div><div class="code-text">Toplam ${sourceLines.length} satır (hedef: 2649)</div>`,
        `<div class="code-icon">📝</div><div class="code-text">İlk 5 satır:</div>`,
        ...sourceLines.slice(0, 5).map((line, i) => `<div class="code-icon">📝</div><div class="code-text">${i+1}: ${truncateText(line.trim(), 80)}</div>`)
    ] : [];
    
    // 5. Performanssız animasyonlar için detaylar - GÜNCELLENDİ
    const badAnimationExamples = [];
    
    // CSS'den animasyon ve transition kurallarını bul
    const animationRegex = /@keyframes\s+([^{]+)\s*{([^}]+)}/g;
    const animationMatches = [...cssText.matchAll(animationRegex)];
    
    animationMatches.forEach(match => {
        const animationName = match[1].trim();
        const animationContent = match[2];
        
        // Eğer animation içinde kötü özellikler varsa
        if (BAD_ANIMATION_PROPERTIES.some(prop => 
            animationContent.includes(prop + ':') ||
            animationContent.includes(prop + ' :'))) {
            
            const line = findLineNumber(cssText, animationName);
            const badProps = BAD_ANIMATION_PROPERTIES.filter(prop => 
                animationContent.includes(prop + ':') || animationContent.includes(prop + ' :'));
            
            badAnimationExamples.push(`<div class="code-icon">🎬</div><div class="code-text">${line}. satır: @keyframes ${animationName}\n   Kötü özellikler: ${badProps.join(', ')}</div>`);
        }
    });
    
    // Ayrıca transition kullanan ve kötü özellik animasyonu yapan kuralları bul
    rules.forEach(rule => {
        const hasBadAnimation = rule.declarations.some(dec => 
            BAD_ANIMATION_PROPERTIES.includes(dec.property) && 
            (dec.value.includes('animation') || dec.value.includes('transition'))
        );
        
        const hasTransition = rule.declarations.find(dec => dec.property === 'transition');
        const hasAnimation = rule.declarations.find(dec => dec.property === 'animation');
        
        if (hasBadAnimation || (hasTransition || hasAnimation)) {
            const badProps = rule.declarations
                .filter(dec => BAD_ANIMATION_PROPERTIES.includes(dec.property))
                .map(dec => dec.property);
            
            if (badProps.length > 0) {
                const line = findLineNumber(cssText, rule.selector);
                const transitionValue = hasTransition ? hasTransition.value : '';
                const animationValue = hasAnimation ? hasAnimation.value : '';
                
                badAnimationExamples.push(`<div class="code-icon">⚡</div><div class="code-text">${line}. satır: ${rule.selector}\n   Kötü animasyon özellikleri: ${badProps.join(', ')}\n   Transition: ${transitionValue || 'yok'}\n   Animation: ${animationValue || 'yok'}</div>`);
            }
        }
    });
    
    // 6. Performanslı animasyonlar için detaylar
    const goodAnimationExamples = [];
    rules.forEach(rule => {
        const goodProps = rule.declarations
            .filter(dec => GOOD_ANIMATION_PROPERTIES.includes(dec.property))
            .map(dec => dec.property);
        
        if (goodProps.length > 0) {
            const line = findLineNumber(cssText, rule.selector);
            const sampleDeclarations = rule.declarations
                .filter(dec => GOOD_ANIMATION_PROPERTIES.includes(dec.property))
                .slice(0, 2)
                .map(dec => `${dec.property}: ${truncateText(dec.value, 30)}`)
                .join(', ');
            
            goodAnimationExamples.push(`<div class="code-icon">✨</div><div class="code-text">${line}. satır: ${truncateText(rule.selector, 40)}\n   ${sampleDeclarations}</div>`);
        }
    });
    
    // 7. Pahalı özellikler için detaylar
    const expensiveExamples = [];
    rules.forEach(rule => {
        const expensiveDeclarations = rule.declarations.filter(dec => 
            EXPENSIVE_PROPERTIES.some(prop => dec.property.includes(prop))
        );
        
        if (expensiveDeclarations.length > 0) {
            const line = findLineNumber(cssText, rule.selector);
            const propList = expensiveDeclarations
                .map(dec => `${dec.property}: ${truncateText(dec.value, 30)}`)
                .join(', ');
            
            expensiveExamples.push(`<div class="code-icon">💸</div><div class="code-text">${line}. satır: ${truncateText(rule.selector, 40)}\n   ${propList}</div>`);
        }
    });
    
    // 8. Performanslı özellikler için detaylar (pahalı olmayanlar)
    const nonExpensiveExamples = [];
    if (declarations.length > 0) {
        const nonExpensiveCount = declarations.length - metrics.expensivePropertyCount;
        const sampleRules = rules
            .filter(rule => !rule.declarations.some(dec => 
                EXPENSIVE_PROPERTIES.some(prop => dec.property.includes(prop))
            ))
            .slice(0, 3);
        
        sampleRules.forEach(rule => {
            const line = findLineNumber(cssText, rule.selector);
            const sampleDecl = rule.declarations.slice(0, 2)
                .map(dec => `${dec.property}: ${truncateText(dec.value, 20)}`)
                .join(', ');
            
            nonExpensiveExamples.push(`<div class="code-icon">✅</div><div class="code-text">${line}. satır: ${truncateText(rule.selector, 40)}\n   ${sampleDecl}</div>`);
        });
    }

    // 9. Paint triggering properties için detaylar
    const paintExamples = [];
    if (metrics.paintTriggeringExamples && metrics.paintTriggeringExamples.length > 0) {
        metrics.paintTriggeringExamples.slice(0, 3).forEach(ex => {
            paintExamples.push(`<div class="code-icon">🎨</div><div class="code-text">${ex.line}. satır: ${truncateText(ex.selector, 40)}\n   ${ex.property}: ${truncateText(ex.value, 30)}</div>`);
        });
    }
    
    // 10. Composite-only properties için detaylar
    const compositeExamples = [];
    if (metrics.compositeOnlyExamples && metrics.compositeOnlyExamples.length > 0) {
        metrics.compositeOnlyExamples.slice(0, 3).forEach(ex => {
            compositeExamples.push(`<div class="code-icon">⚡</div><div class="code-text">${ex.line}. satır: ${truncateText(ex.selector, 40)}\n   ${ex.property}: ${truncateText(ex.value, 30)}</div>`);
        });
    }
    
    // 11. Layout triggering properties için detaylar
    const layoutExamples = [];
    if (metrics.layoutTriggeringExamples && metrics.layoutTriggeringExamples.length > 0) {
        metrics.layoutTriggeringExamples.slice(0, 3).forEach(ex => {
            layoutExamples.push(`<div class="code-icon">📐</div><div class="code-text">${ex.line}. satır: ${truncateText(ex.selector, 40)}\n   ${ex.property}: ${truncateText(ex.value, 30)}</div>`);
        });
    }
    
    // Toplam deklarasyon sayısı
    const totalDeclarations = declarations.length;
    const expensivePercentage = totalDeclarations > 0 ? 
        (metrics.expensivePropertyCount / totalDeclarations) * 100 : 0;
    
    // Olumlu örnekler için
    const positiveExamples = [];
    if (metrics.fileSizeKB <= 62.2) {
        positiveExamples.push(`<div class="code-icon">✅</div><div class="code-text">Dosya boyutu: ${metrics.fileSizeKB.toFixed(2)}KB (hedef: ≤ 62.2KB)</div>`);
    }
    if (metrics.commentSizeBytes <= 142) {
        positiveExamples.push(`<div class="code-icon">✅</div><div class="code-text">Yorum boyutu: ${metrics.commentSizeBytes} B (hedef: ≤ 142 B)</div>`);
    }
    if (metrics.embeddedContentBytes === 0) {
        positiveExamples.push(`<div class="code-icon">✅</div><div class="code-text">Gömülü içerik bulunmadı</div>`);
    }
    if (metrics.sourceLinesOfCode <= 2649) {
        positiveExamples.push(`<div class="code-icon">✅</div><div class="code-text">Kaynak kodu satırı: ${metrics.sourceLinesOfCode} (hedef: ≤ 2649)</div>`);
    }
    if (metrics.badAnimationCount === 0) {
        positiveExamples.push(`<div class="code-icon">✅</div><div class="code-text">Performansı düşük animasyon bulunmadı</div>`);
    }
    if (expensivePercentage <= 2) {
        positiveExamples.push(`<div class="code-icon">✅</div><div class="code-text">Pahalı özellik oranı: %${expensivePercentage.toFixed(1)} (hedef: ≤ 2%)</div>`);
    }
    
    return [
        {
            id: 'keep-filesize-low',
            title: 'Dosya boyutunu düşük tutun',
            value: (parseFloat(metrics.fileSizeKB.toFixed(2))) + ' KB',
            target: 62.2,
            category: 'performance',
            description: 'Büyük CSS dosyaları web sayfanızı yavaşlatır. Dosya boyutunu düşük tutmak kritik önem taşır. 62.2KB medyan değeridir.',
            status: metrics.fileSizeKB <= 62.2 ? 'good' : metrics.fileSizeKB <= 100 ? 'medium' : 'bad',
            problematicCodes: metrics.fileSizeKB <= 62.2 ? 
                [`<div class="code-icon">✅</div><div class="code-text">Dosya boyutu: ${parseFloat(metrics.fileSizeKB).toFixed(2)}KB (hedef: ≤ 62.2KB)</div>`] : 
                [
                    `<div class="code-icon">⚠️</div><div class="code-text">Dosya boyutu: ${parseFloat(metrics.fileSizeKB).toFixed(2)}KB (hedef: ≤ 62.2KB)</div>`,
                    `<div class="code-icon">📊</div><div class="code-text">En büyük kurallar:</div>`,
                    ...fileSizeExamples.slice(0, 3)
                ]
        },
        {
            id: 'limit-css-comments',
            title: 'CSS yorumlarını sınırlayın',
            value: (metrics.commentSizeBytes) + ' byte',
            target: 142,
            category: 'performance',
            description: 'Yorumlar geliştiriciler için faydalıdır ama kullanıcılar için değil. Büyük yorumlar dosya boyutunu artırır ve yükleme süresini uzatır.',
            status: metrics.commentSizeBytes <= 142 ? 'good' : metrics.commentSizeBytes <= 500 ? 'medium' : 'bad',
            problematicCodes: metrics.commentSizeBytes <= 142 ? 
                [`<div class="code-icon">✅</div><div class="code-text">Yorum boyutu: ${metrics.commentSizeBytes} B (hedef: ≤ 142 B)</div>`] : 
                problematicComments.length > 0 ? problematicComments : 
                [
                    `<div class="code-icon">⚠️</div><div class="code-text">Yorum boyutu: ${metrics.commentSizeBytes} B (hedef: ≤ 142 B)</div>`,
                    `<div class="code-icon">📝</div><div class="code-text">${comments.length} adet yorum bulundu</div>`
                ]
        },
        {
            id: 'limit-embedded-content',
            title: 'Gömülü içeriği sınırlayın',
            value: (metrics.embeddedContentBytes) + ' byte',
            target: 0,
            category: 'performance',
            description: 'Base64 kodlamalı resimler ve diğer gömülü içerikler CSS boyutunu önemli ölçüde artırır. HTTP isteklerini azaltsa da genellikle optimal değildir.',
            status: metrics.embeddedContentBytes === 0 ? 'good' : metrics.embeddedContentBytes <= 1024 ? 'medium' : 'bad',
            problematicCodes: metrics.embeddedContentBytes === 0 ? 
                [`<div class="code-icon">✅</div><div class="code-text">Gömülü içerik bulunmadı</div>`] : 
                embeddedExamples.length > 0 ? embeddedExamples : 
                [
                    `<div class="code-icon">⚠️</div><div class="code-text">Gömülü içerik boyutu: ${metrics.embeddedContentBytes} B</div>`,
                    `<div class="code-icon">🔍</div><div class="code-text">${embeddedMatches.length} adet gömülü içerik bulundu</div>`
                ]
        },
        {
            id: 'avoid-many-sloc',
            title: 'Çok fazla kaynak kodu satırından kaçının',
            value: (metrics.sourceLinesOfCode) + ' satır',
            target: 2649,
            category: 'performance',
            description: 'Fazla kod satırı CSS yönetimini zorlaştırır, hata ayıklamayı uzatır ve dosya boyutunu artırır. 2649 satır medyan değeridir.',
            status: metrics.sourceLinesOfCode <= 2649 ? 'good' : metrics.sourceLinesOfCode <= 4000 ? 'medium' : 'bad',
            problematicCodes: metrics.sourceLinesOfCode <= 2649 ? 
                [`<div class="code-icon">✅</div><div class="code-text">Toplam satır: ${metrics.sourceLinesOfCode} (hedef: ≤ 2649)</div>`] : 
                sourceLineExamples.length > 0 ? sourceLineExamples : 
                [
                    `<div class="code-icon">⚠️</div><div class="code-text">Toplam satır: ${metrics.sourceLinesOfCode} (hedef: ≤ 2649)</div>`,
                    `<div class="code-icon">📈</div><div class="code-text">${rules.length} adet CSS kuralı bulundu</div>`
                ]
        },
        {
            id: 'bad-animations',
            title: 'Performansı düşük animasyonlardan kaçının',
            value: (metrics.badAnimationCount) + ' adet',
            target: 0,
            category: 'performance',
            description: 'Layout-triggering animasyonlar (width, height, margin, padding, top/left/right/bottom) tarayıcıyı yavaşlatır. Bunlar yerine transform ve opacity kullanın.',
            status: metrics.badAnimationCount === 0 ? 'good' : metrics.badAnimationCount <= 5 ? 'medium' : 'bad',
            problematicCodes: metrics.badAnimationCount === 0 ? 
                [`<div class="code-icon">✅</div><div class="code-text">Performansı düşük animasyon özelliği kullanılmadı</div>`] : 
                badAnimationExamples.length > 0 ? badAnimationExamples.slice(0, 3) : 
                [
                    `<div class="code-icon">⚠️</div><div class="code-text">${metrics.badAnimationCount} adet performansı düşük animasyon özelliği</div>`,
                    `<div class="code-icon">🎯</div><div class="code-text">Kötü özellikler: ${BAD_ANIMATION_PROPERTIES.join(', ')}</div>`
                ]
        },
        {
            id: 'good-animations',
            title: 'Performanslı animasyonları tercih edin',
            value: (metrics.goodAnimationCount) + ' adet',
            target: '↑ Yüksek',
            category: 'performance',
            description: 'GPU hızlandırmalı animasyonlar (transform, opacity, translate, scale, rotate) çok daha performanslıdır ve layout reflow tetiklemez.',
            status: metrics.goodAnimationCount > 0 ? 'good' : 'medium',
            problematicCodes: metrics.goodAnimationCount > 0 ? 
                (goodAnimationExamples.length > 0 ? goodAnimationExamples.slice(0, 3) : 
                [`<div class="code-icon">✅</div><div class="code-text">${metrics.goodAnimationCount} adet performanslı animasyon özelliği</div>`]) : 
                [
                    `<div class="code-icon">⚠️</div><div class="code-text">Performanslı animasyon özelliği kullanılmadı</div>`,
                    `<div class="code-icon">💡</div><div class="code-text">Önerilen özellikler: ${GOOD_ANIMATION_PROPERTIES.join(', ')}</div>`
                ]
        },
        {
            id: 'expensive-properties',
            title: 'Pahalı CSS özelliklerinin oranı',
            value: `%${parseFloat(expensivePercentage.toFixed(1))}`,
            target: 2,
            category: 'performance',
            description: 'Box-shadow, border-radius, filter gibi özellikler render performansını düşürür. Toplam deklarasyonların %2\'sinden az olmalıdır.',
            status: expensivePercentage <= 2 ? 'good' : expensivePercentage <= 10 ? 'medium' : 'bad',
            problematicCodes: expensivePercentage <= 2 ? 
                [`<div class="code-icon">✅</div><div class="code-text">Pahalı özellik oranı: %${expensivePercentage.toFixed(1)} (hedef: ≤ 2%)</div>`] : 
                expensiveExamples.length > 0 ? expensiveExamples.slice(0, 3) : 
                [
                    `<div class="code-icon">⚠️</div><div class="code-text">${metrics.expensivePropertyCount} adet pahalı CSS özelliği (%${expensivePercentage.toFixed(1)})</div>`,
                    `<div class="code-icon">💰</div><div class="code-text">Pahalı özellikler: ${EXPENSIVE_PROPERTIES.join(', ')}</div>`
                ]
        },
        {
            id: 'non-expensive-properties',
            title: 'Performanslı CSS özellikleri',
            value: (totalDeclarations - metrics.expensivePropertyCount) + " satır",
            target: '↑ Yüksek',
            category: 'performance',
            description: 'Pahalı olmayan, performanslı CSS özellikleri tercih edilmelidir. Bunlar render sırasında daha az maliyetlidir.',
            status: 'good',
            problematicCodes: (totalDeclarations - metrics.expensivePropertyCount) > 0 ? 
                (nonExpensiveExamples.length > 0 ? nonExpensiveExamples.slice(0, 3) : 
                [`<div class="code-icon">✅</div><div class="code-text">${totalDeclarations - metrics.expensivePropertyCount} adet performanslı CSS özelliği</div>`]) : 
                [`<div class="code-icon">⚠️</div><div class="code-text">Performanslı CSS özelliği bulunmadı</div>`]
        },
        {
            id: 'paint-triggering-properties',
            title: 'Boyama işlemi tetikleyen özellikler',
            value: parseFloat(metrics.paintTriggeringPercentage.toFixed(1)),
            target: 20,
            category: 'performance',
            description: 'Paint işlemi tetikleyen özellikler render performansını düşürür. %20\'nin altında olmalıdır.',
            status: metrics.paintTriggeringPercentage <= 20 ? 'good' : metrics.paintTriggeringPercentage <= 35 ? 'medium' : 'bad',
            problematicCodes: metrics.paintTriggeringPercentage <= 20 ? 
                [`<div class="code-icon">✅</div><div class="code-text">Paint tetikleyici özellikler: %${metrics.paintTriggeringPercentage.toFixed(1)} (hedef: ≤ 20%)</div>`] : 
                paintExamples.length > 0 ? paintExamples : 
                [`<div class="code-icon">⚠️</div><div class="code-text">Yüksek paint tetikleyici oranı: %${metrics.paintTriggeringPercentage.toFixed(1)}</div>`]
        },
        {
            id: 'composite-only-properties',
            title: 'Composite-only özellikler',
            value: parseFloat(metrics.compositeOnlyPercentage.toFixed(1)),
            target: '↑ Yüksek',
            category: 'performance',
            description: 'Sadece composite aşamasını etkileyen özellikler en iyi performansı sağlar. Yüksek oran iyidir.',
            status: metrics.compositeOnlyPercentage > 10 ? 'good' : metrics.compositeOnlyPercentage > 5 ? 'medium' : 'bad',
            problematicCodes: metrics.compositeOnlyPercentage > 10 ? 
                compositeExamples.length > 0 ? compositeExamples : 
                [`<div class="code-icon">✅</div><div class="code-text">Composite-only özellikler: %${metrics.compositeOnlyPercentage.toFixed(1)}</div>`] : 
                [`<div class="code-icon">⚠️</div><div class="code-text">Düşük composite-only oranı: %${metrics.compositeOnlyPercentage.toFixed(1)}</div>`]
        },
        {
            id: 'layout-triggering-properties',
            title: 'Layout tetikleyen özellikler',
            value: parseFloat(metrics.layoutTriggeringPercentage.toFixed(1)),
            target: 15,
            category: 'performance',
            description: 'Layout/reflow tetikleyen özellikler en pahalı işlemlerdir. %15\'in altında olmalıdır.',
            status: metrics.layoutTriggeringPercentage <= 15 ? 'good' : metrics.layoutTriggeringPercentage <= 25 ? 'medium' : 'bad',
            problematicCodes: metrics.layoutTriggeringPercentage <= 15 ? 
                [`<div class="code-icon">✅</div><div class="code-text">Layout tetikleyici özellikler: %${metrics.layoutTriggeringPercentage.toFixed(1)} (hedef: ≤ 15%)</div>`] : 
                layoutExamples.length > 0 ? layoutExamples : 
                [`<div class="code-icon">⚠️</div><div class="code-text">Yüksek layout tetikleyici oranı: %${metrics.layoutTriggeringPercentage.toFixed(1)}</div>`]
        },
    ];
}

// Yardımcı fonksiyon: Belirli bir metni içeren satırı bul
function getLineContaining(text, searchString, contextLength = 50) {
    const lines = text.split('\n');
    for (let i = 0; i < lines.length; i++) {
        if (lines[i].includes(searchString)) {
            const line = lines[i].trim();
            const index = line.indexOf(searchString);
            const start = Math.max(0, index - contextLength);
            const end = Math.min(line.length, index + searchString.length + contextLength);
            const context = line.substring(start, end);
            return (start > 0 ? '...' : '') + context + (end < line.length ? '...' : '');
        }
    }
    return searchString;
}

// ==================== SKOR HESAPLAMA FONKSİYONLARI ====================

// Bakım kolaylığı skoru hesapla
function calculateMaintainabilityScore(metrics) {
    let score = 100;
    const deductions = [];
   
    // 1. Max declarations per rule - 28'i geçerse
    if (metrics.maxDeclarationsPerRule > 10) {
        const excess = metrics.maxDeclarationsPerRule - 10;
        const penalty = Math.min(15, excess * 0.5);
        deductions.push(penalty);
    }
   
    // 2. Average declarations per rule
    if (metrics.avgDeclarationsPerRule > 6.15) {
        const excess = metrics.avgDeclarationsPerRule - 6.15;
        const penalty = Math.min(10, excess * 1.5);
        deductions.push(penalty);
    }
   
    // 3. Declaration duplication
    if (metrics.declarationDuplicationPercentage > 40.2) {
        const excess = metrics.declarationDuplicationPercentage - 40.2;
        const penalty = Math.min(15, excess * 0.3);
        deductions.push(penalty);
    }
   
    // 4. Empty rulesets
    if (metrics.emptyRulesets > 0) {
        const penalty = Math.min(10, metrics.emptyRulesets * 2);
        deductions.push(penalty);
    }
   
    // 5. Selector duplication
    if (metrics.selectorDuplicationPercentage > 23.5) {
        const excess = metrics.selectorDuplicationPercentage - 23.5;
        const penalty = Math.min(10, excess * 0.3);
        deductions.push(penalty);
    }
   
    // 6. Average selectors per rule
    if (metrics.avgSelectorsPerRule > 1.09) {
        const excess = metrics.avgSelectorsPerRule - 1.09;
        const penalty = Math.min(8, excess * 4);
        deductions.push(penalty);
    }
   
    // 7. Max selectors per rule
    if (metrics.maxSelectorsPerRule > 3) {
        const excess = metrics.maxSelectorsPerRule - 3;
        const penalty = Math.min(10, excess * 2);
        deductions.push(penalty);
    }
   
    const totalDeduction = deductions.reduce((sum, d) => sum + d, 0);
    score = Math.max(0, Math.min(100, Math.round(100 - totalDeduction)));
   
    return score;
}

// Kompleksite skoru hesapla - 
function calculateComplexityScore(metrics) {
    let score = 100;
    const deductions = [];
    // 1. More complex than common - %60.2 eşik
    if (metrics.moreComplexPercentage > 60.2) {
        const excess = metrics.moreComplexPercentage - 60.2;
        let penalty;
        // Kademeli ceza: Her %10'luk dilimde artan ceza
        if (excess <= 10) penalty = excess * 0.2;
        else if (excess <= 20) penalty = 2 + (excess - 10) * 0.3;
        else if (excess <= 30) penalty = 5 + (excess - 20) * 0.4;
        else penalty = 9 + (excess - 30) * 0.5;
        penalty = Math.min(20, penalty);
        deductions.push({
            type: 'moreComplex',
            penalty
        });
    }
    // 2. More specific than common - Hibrit: Hem mutlak hem göreceli
    if (metrics.moreSpecificPercentage > 63.0) {
        const excess = metrics.moreSpecificPercentage - 63.0;
        // Göreceli ceza
        const relativePenalty = (excess / 63.0) * 12;
        // Kademeli mutlak ceza
        let absolutePenalty = 0;
        if (excess > 5) absolutePenalty += 1;
        if (excess > 15) absolutePenalty += 2;
        if (excess > 25) absolutePenalty += 3;
        const penalty = Math.min(18, relativePenalty + absolutePenalty);
        deductions.push({
            type: 'moreSpecific',
            penalty
        });
    }
    // 3. Max selector complexity - 6 sınır
    const maxComplexityExcess = Math.max(0, metrics.maxSelectorComplexity - 6);
    if (maxComplexityExcess > 0) {
        // Üstel ceza: Kompleksite arttıkça ceza katlanarak artar
        const penalty = Math.min(25, Math.pow(maxComplexityExcess, 1.3) * 2.5);
        deductions.push({
            type: 'maxComplexity',
            penalty
        });
    }
    // 4. Import rules - Sıfır tolerans
    if (metrics.importRules > 0) {
        const penalty = Math.min(20, metrics.importRules * 8);
        deductions.push({
            type: 'importRules',
            penalty
        });
    }
    // 5. Average selector complexity - 1.95 ideal
    const avgComplexityDiff = metrics.avgSelectorComplexity - 1.95;
    if (avgComplexityDiff > 0) {
        // Logaritmik ceza: Küçük farklar hafif, büyük farklar orta
        const penalty = Math.min(15, Math.log1p(avgComplexityDiff * 2) * 6);
        deductions.push({
            type: 'avgComplexity',
            penalty
        });
    }
    // 6. ID selector percentage - %7.1 eşik
    if (metrics.idSelectorPercentage > 7.1) {
        const excess = metrics.idSelectorPercentage - 7.1;
        // Karesel ceza: Fazlalık arttıkça ceza artar
        const penalty = Math.min(12, Math.pow(excess / 10, 2) * 20);
        deductions.push({
            type: 'idSelectors',
            penalty
        });
    }
    // 7. Important usage - %0.6 çok düşük tolerans
    if (metrics.importantPercentage > 0.6) {
        const excess = metrics.importantPercentage - 0.6;
        // Katı ceza: !important kötü bir uygulama
        const penalty = Math.min(15, excess * 10);
        deductions.push({
            type: 'importantUsage',
            penalty
        });
    }
    // Toplam ceza
    const totalDeduction = deductions.reduce((sum, d) => sum + d.penalty, 0);
    score = Math.max(0, Math.min(100, Math.round(100 - totalDeduction)));
    return score;
}

// Performans skoru hesapla - (cezalar iyice yumuşatıldı + expensive yüzde bazlı)
function calculatePerformanceScore(metrics, totalDeclarations) {
    let score = 100;
    const deductions = [];

    // 1. File size - medyan 62.2 KB (en önemli)
    if (metrics.fileSizeKB > 62.2) {
        const excess = metrics.fileSizeKB - 62.2;
        // Daha yumuşak ceza: Her 20KB için 1 puan
        const penalty = Math.min(15, Math.floor(excess / 20) + (excess % 20 > 0 ? 1 : 0));
        deductions.push({ type: 'fileSize', penalty });
    }

    // 2. Comment size - Çok hafif ceza
    if (metrics.commentSizeBytes > 142) {
        const excess = metrics.commentSizeBytes - 142;
        // Her 500B için 1 puan
        const penalty = Math.min(5, Math.floor(excess / 500) + (excess % 500 > 0 ? 1 : 0));
        deductions.push({ type: 'commentSize', penalty });
    }

    // 3. Embedded content - Hafif ceza
    if (metrics.embeddedContentBytes > 0) {
        // Sadece çok büyükse ceza
        const penalty = metrics.embeddedContentBytes > 5000 ? 3 : 
                       metrics.embeddedContentBytes > 1000 ? 2 : 
                       metrics.embeddedContentBytes > 500 ? 1 : 0;
        deductions.push({ type: 'embeddedContent', penalty });
    }

    // 4. Source lines of code - Orta dereceli
    if (metrics.sourceLinesOfCode > 2649) {
        const excess = metrics.sourceLinesOfCode - 2649;
        // Her 500 satır için 1 puan
        const penalty = Math.min(8, Math.floor(excess / 500) + (excess % 500 > 0 ? 1 : 0));
        deductions.push({ type: 'sloc', penalty });
    }

    // 5. Bad animations - Hafif ceza
    if (metrics.badAnimationCount > 0) {
        // Sadece çok fazlaysa ceza
        const penalty = metrics.badAnimationCount > 10 ? 5 :
                       metrics.badAnimationCount > 5 ? 3 :
                       metrics.badAnimationCount > 2 ? 1 : 0;
        deductions.push({ type: 'badAnimations', penalty });
    }

    // 6. Expensive properties - Yüzde bazlı, yumuşak
    if (totalDeclarations > 0) {
        const expensivePercentage = (metrics.expensivePropertyCount / totalDeclarations) * 100;
        if (expensivePercentage > 2) {
            const excess = expensivePercentage - 2;
            // Her %2.5 için 1 puan
            const penalty = Math.min(8, Math.floor(excess / 2.5) + (excess % 2.5 > 0 ? 1 : 0));
            deductions.push({ type: 'expensiveProps', penalty });
        }
    }

    // YENİ METRİKLER - ÇOK HAFİF CEZALAR:
    
    // 7. Paint triggering properties - Çok hafif
    if (metrics.paintTriggeringPercentage > 20) {
        const excess = metrics.paintTriggeringPercentage - 20;
        // Sadece çok yüksekse ceza: Her %10 için 1 puan
        const penalty = Math.min(5, Math.floor(excess / 10));
        if (penalty > 0) {
            deductions.push({ type: 'paintTriggering', penalty });
        }
    }
    
    // 8. Composite-only properties - Çok hafif
    if (metrics.compositeOnlyPercentage < 10) {
        const deficit = 10 - metrics.compositeOnlyPercentage;
        // Sadece çok düşükse ceza: Her %10 eksik için 1 puan
        const penalty = Math.min(4, Math.floor(deficit / 10));
        if (penalty > 0) {
            deductions.push({ type: 'lowComposite', penalty });
        }
    }
    
    // 9. Layout triggering properties - Hafif
    if (metrics.layoutTriggeringPercentage > 15) {
        const excess = metrics.layoutTriggeringPercentage - 15;
        // Orta dereceli: Her %5 için 1 puan
        const penalty = Math.min(6, Math.floor(excess / 5) + (excess % 5 > 0 ? 1 : 0));
        deductions.push({ type: 'layoutTriggering', penalty });
    }

    // Toplam ceza
    const totalDeduction = deductions.reduce((sum, d) => sum + d.penalty, 0);
    
    // POZİTİF BONUSLAR (performansı artırır):
    let bonuses = 0;
    
    // 1. Good animations bonus (önemli)
    if (metrics.goodAnimationCount > 0) {
        bonuses += Math.min(5, Math.floor(metrics.goodAnimationCount / 2));
    }
    
    // 2. Composite-only properties bonus (önemli)
    if (metrics.compositeOnlyPercentage > 20) {
        bonuses += Math.min(5, Math.floor((metrics.compositeOnlyPercentage - 20) / 5));
    }
    
    // 3. Low expensive properties bonus
    if (totalDeclarations > 0) {
        const expensivePercentage = (metrics.expensivePropertyCount / totalDeclarations) * 100;
        if (expensivePercentage < 1) {
            bonuses += 2;
        } else if (expensivePercentage < 2) {
            bonuses += 1;
        }
    }
    
    // 4. Small file size bonus
    if (metrics.fileSizeKB < 30) {
        bonuses += 3;
    } else if (metrics.fileSizeKB < 45) {
        bonuses += 2;
    } else if (metrics.fileSizeKB < 62.2) {
        bonuses += 1;
    }
    
    // 5. Low layout triggering bonus
    if (metrics.layoutTriggeringPercentage < 10) {
        bonuses += 2;
    } else if (metrics.layoutTriggeringPercentage < 15) {
        bonuses += 1;
    }

    // HESAPLAMA: Başlangıç 100, maksimum bonus 15, maksimum ceza 40
    score = Math.max(0, Math.min(100, Math.round(100 - totalDeduction + bonuses)));

    return score;
}
// Genel skor hesapla
function calculateOverallScore(maintainability, complexity, performance) {
    const weights = {
        maintainability: 0.40,
        complexity: 0.35,
        performance: 0.25
    };
   
    let baseScore = Math.round(
        (maintainability * weights.maintainability) +
        (complexity * weights.complexity) +
        (performance * weights.performance)
    );
   
    const minCategoryScore = Math.min(maintainability, complexity, performance);
   
    if (minCategoryScore < 60) {
        const penalty = (60 - minCategoryScore) * 0.3;
        baseScore -= penalty;
    } else if (minCategoryScore < 70) {
        const penalty = (70 - minCategoryScore) * 0.1;
        baseScore -= penalty;
    }
   
    if (maintainability > 80 && complexity > 80 && performance > 80) {
        baseScore += 2;
    }
   
    return Math.max(0, Math.min(100, Math.round(baseScore)));
}

// Raporu göster 
function displayAnalysisReport(results) {
    // istatistik
    const validRules = cssRules.filter(r => r.selector && r.properties);
    const totalProperties = validRules.reduce((sum, rule) => {
        if (rule.properties) {
            const props = rule.properties.split(';').filter(p => p.trim());
            return sum + props.length;
        }
        return sum;
    }, 0);
    const originalSize = originalCSS.length;
    const minifiedSize = minifiedCSS.length;
    const saving = originalSize - minifiedSize;
    const savingPercent = originalSize > 0 ? Math.round((saving / originalSize) * 100) : 0;
    const lineCount = originalCSS.split('\n').length;
    // istatistik son

    const reportContainer = document.getElementById('report-css-container');
    if (!reportContainer) {
        console.error('Report container bulunamadı!');
        return;
    }
   
    const maintainabilityGrade = getGrade(results.maintainability.score);
    const complexityGrade = getGrade(results.complexity.score);
    const performanceGrade = getGrade(results.performance.score);
    
    // ==================== METRİKLERİ ÖNERİLERLE HAZIRLA ====================
    results.allMetrics = addSuggestionsToMetrics(results.allMetrics, results);

    // Kategorilere ayır
    results.categories.all = results.allMetrics;
    results.categories.maintainability = results.allMetrics.filter(m => m.category === 'maintainability');
    results.categories.complexity = results.allMetrics.filter(m => m.category === 'complexity');
    results.categories.performance = results.allMetrics.filter(m => m.category === 'performance');

    // Orijinal metrikleri de güncelle
    results.maintainability.metrics = results.categories.maintainability;
    results.complexity.metrics = results.categories.complexity;
    results.performance.metrics = results.categories.performance;
   
    let html = `
        <div class="css-analysis-report">
            <div class="section-title mt0">
                <span>🎯 CSS Raporu</span>
                <div class="report-footer">
                    <div class="square-div"><div class="square green"></div>90-100</div>
                    <div class="square-div"><div class="square orange"></div>60-90</div>
                    <div class="square-div"><div class="square red"></div>0-60</div>
                </div>
            </div>
            <div class="score-summary">
                <div class="stats-grid">
                    <div class="stat-card">
                        <p>Orijinal</p>${formatBytes(originalSize)}
                    </div>
                    <div class="stat-card">
                        <p>Minify</p>${formatBytes(minifiedSize)}
                    </div>
                    <div class="stat-card">
                        <p>Kazanç</p>
                        <span class="stat-number">${savingPercent}</span>
                        <small>%</small>
                    </div>
                    <div class="stat-card">
                        <p>Bakım</p>
                        <span class="stat-number" style="color: ${maintainabilityGrade.color}">${results.maintainability.score}</span>
                        <small>${maintainabilityGrade.grade}</small>
                    </div>
                    <div class="stat-card">
                        <p>Karmaşıklık</p>
                        <span class="stat-number" style="color: ${complexityGrade.color}">${results.complexity.score}</span>
                        <small>${complexityGrade.grade}</small>
                    </div>
                    <div class="stat-card">
                        <p>Performans</p>
                        <span class="stat-number" style="color: ${performanceGrade.color}">${results.performance.score}</span>
                        <small>${performanceGrade.grade}</small>
                    </div>
                </div>
            </div>

            <!-- METRİK LİSTESİ -->
            <div class="metrics-list-section">
                <div class="metric-head">
                    <div class="section-title">📈 Metrik Detayı</div>
                    <data class="data-btn mobil" data data-size="0.8" onclick="openMenu('metrik')"><i icon="menu-grid-o"></i></data>
                    <fieldset id="metrik-list-menu">
                        <label for="filter-all" class="filter-radio-label"><input type="radio" id="filter-all" name="filter-type" value="all" checked>Hepsi</label>
                        <label for="filter-maintainability" class="filter-radio-label"><input type="radio" id="filter-maintainability" name="filter-type" value="maintainability">Bakım</label>
                        <label for="filter-complexity" class="filter-radio-label"><input type="radio" id="filter-complexity" name="filter-type" value="complexity">Karmaşıklık</label>
                        <label for="filter-performance" class="filter-radio-label"><input type="radio" id="filter-performance" name="filter-type" value="performance">Performans</label>
                    </fieldset>
                </div>
                <div class="metrics-container">
                    ${renderMetricsList(results.allMetrics, 'all')}
                </div>
            </div>
        </div>
    `;
  
    reportContainer.innerHTML = html;
    reportContainer.classList.remove("hidden");
    // Filtreleme işlevselliğini ekle (aynı)
    initializeRadioFilters(results);
}

// Metrik listesini render et
function renderMetricsList(metrics, category) {
    // Metrikleri status değerine göre sırala: bad > medium > good > unknown
    const statusOrder = { bad: 0, medium: 1, good: 2, unknown: 3 };
    
    const sortedMetrics = [...(metrics || [])].sort((a, b) => {
        const aStatus = a.status || 'unknown';
        const bStatus = b.status || 'unknown';
        return statusOrder[aStatus] - statusOrder[bStatus];
    });
    
    return `
        <div class="metrics-grid" data-category="${category}">
            ${sortedMetrics.map(metric => `
                <details class="accordion metric-card" data-category="${metric.category}">
                    <summary class="metric-header" data-status="${metric.status}"><div class="metric-title">${metric.title}</div></summary>
                    <div class="metric-content" data-status="${metric.status}">
                        <div class="metric-value-display"><span class="current-value">${formatMetricValue(metric.value, metric.id)}</span></div>
                        ${metric.category !== 'error' ? `
                        <div class="metric-progress">
                            <div class="progress-bar">
                                <div class="progress-fill ${metric.status}" style="width: ${calculateProgressPercentage(metric.value, metric.target, metric.id)}%"></div>
                            </div>
                        </div>` : ''}
                        <p class="metric-description">${metric.description}</p>
                        ${metric.problematicCodes && metric.problematicCodes.length > 0 ?
                            metric.problematicCodes.map(code => {
                                if (typeof code === 'string' && code.startsWith('<details')) {return code;}
                                const getClassByEmoji = (text) => {
                                    if (text.includes('<div class="code-icon">✅</div>') || text.includes('<div class="code-icon">✨</div>')) return "success";
                                    if (text.includes('<div class="code-icon">🎉</div>') || text.includes('<div class="code-icon">💡</div>') || text.includes('<div class="code-icon">📊</div>') || text.includes('<div class="code-icon">🎯</div>') || text.includes('<div class="code-icon">🔍</div>') || text.includes('<div class="code-icon">📈</div>')) return "info";
                                    if (text.includes('<div class="code-icon">⚠️</div>') || text.includes('<div class="code-icon">‼️</div>') || text.includes('<div class="code-icon">🎬</div>') || text.includes('<div class="code-icon">⚡</div>') || text.includes('<div class="code-icon">💸</div>') || text.includes('<div class="code-icon">📏</div>') || text.includes('<div class="code-icon">💬</div>') || text.includes('<div class="code-icon">📦</div>') || text.includes('<div class="code-icon">📝</div>') || text.includes('<div class="code-icon">🎨</div>') || text.includes('<div class="code-icon">📐</div>')) return "warning";
                                    if (text.includes('<div class="code-icon">❌</div>') || text.includes('<div class="code-icon">🚫</div>')) return "error";
                                    return "default";
                                };
                                return `<div class="example-code-item ${getClassByEmoji(code)}">${code}</div>`;
                            }).join('')
                        : ''}
                    </div>
                    <div class="metric-footer" data-status="${metric.status}">
                        <span class="${metric.category}">${getCategoryName(metric.category)}</span> • 
                        <span>${getStatusText(metric.status)}</span> • 
                        <span class="metric-id">${metric.id}</span>
                    </div>
                </details>
            `).join('')}
        </div>
    `;
}

// Yardımcı fonksiyonlar
function findLineNumber(cssText, searchString) {
    if (!searchString || !cssText) return 0;
    const lines = cssText.split('\n');
    for (let i = 0; i < lines.length; i++) {
        if (lines[i].includes(searchString.substring(0, Math.min(50, searchString.length)))) {return i + 1;}
    }
    return 0;
}

function truncateText(text, maxLength) {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength - 3) + '...';
}

function formatProblematicCode(problem, category) {
    switch (problem.type) {
        case 'many_declarations':
            return `${category.toUpperCase()}: Rule with too many declarations - ${problem.selector} (${problem.declarationCount} declarations)`;
        case 'duplicate_declaration':
            return `${category.toUpperCase()}: Duplicate declaration - ${problem.property}: ${problem.value} (${problem.count} times)`;
        case 'empty_ruleset':
            return `${category.toUpperCase()}: Empty ruleset - ${problem.selector}`;
        case 'duplicate_selector':
            return `${category.toUpperCase()}: Duplicate selector - ${problem.selector} (${problem.count} times)`;
        case 'many_selectors':
            return `${category.toUpperCase()}: Rule with too many selectors - ${problem.selector} (${problem.selectorCount} selectors)`;
        case 'complex_selector':
            return `${category.toUpperCase()}: Complex selector - ${problem.selector} (complexity: ${problem.complexity})`;
        case 'specific_selector':
            return `${category.toUpperCase()}: Specific selector - ${problem.selector} (specificity: ${problem.specificity})`;
        case 'highly_complex_selector':
            return `${category.toUpperCase()}: Highly complex selector - ${problem.selector} (complexity: ${problem.complexity})`;
        case 'id_selector':
            return `${category.toUpperCase()}: ID selector - ${problem.selector}`;
        case 'important_rule':
            return `${category.toUpperCase()}: !important usage - ${problem.context}`;
        case 'import_rule':
            return `${category.toUpperCase()}: @import rule - ${problem.rule}`;
        case 'bad_animation':
            return `${category.toUpperCase()}: Bad animation property - ${problem.property}: ${problem.value}`;
        case 'expensive_property':
            return `${category.toUpperCase()}: Expensive property - ${problem.property}: ${problem.value}`;
        case 'large_comment':
            return `${category.toUpperCase()}: Large comment - ${problem.comment} (${problem.length} chars)`;
        case 'embedded_content':
            return `${category.toUpperCase()}: Embedded content - ${problem.content}`;
        default:
            return `${category.toUpperCase()}: Unknown problem`;
    }
}

// CSS Rapor Fonksiyonu
function reportCSS() {
    let cssText = '';
   
    const cssContainer = document.querySelector('#container div[data-language="css"]');
   
    if (cssContainer && getCSS().trim()) {
        cssText = getCSS();
    } else {
        return;
    }
   
    if (!cssText.trim()) {
        AlertBox('CSS kodu bulunamadı!', 'warning');
        return;
    }
   
    try {
        // CSS'yi parse et
        const rules = parseCSSForAnalysis(cssText);
        const selectors = extractAllSelectors(rules);
        const declarations = extractAllDeclarations(rules);
       
        // DEBUG: Konsola verileri yazdır
        // console.log('Rules:', rules);
        // console.log('Selectors:', selectors);
        // console.log('Declarations:', declarations);
       
        // Tüm metrikleri hesapla
        const analysisResults = calculateAllMetrics(cssText, rules, selectors, declarations);
       
        // Kaynak bilgisini ekle
        analysisResults.sourceInfo = {
            hasMinifiedCSS: cssContainer ? getCSS().trim().length > 0 : false,
            timestamp: new Date().toISOString()
        };
       
        // Sonuçları göster
        displayAnalysisReport(analysisResults);
        openMenuFuc();
       
    } catch (error) {
        console.error('Analiz hatası:', error);
        AlertBox('Analiz hatası: ' + error.message, 'error');
    }
}

function parseCSSForAnalysis(cssText) {
    const rules = [];
    const cleanedCSS = cssText.replace(/\/\*[\s\S]*?\*\//g, ''); // Yorumları kaldır
    let i = 0;
   
    while (i < cleanedCSS.length) {
        // @ kurallarını atla (basit analiz için)
        if (cleanedCSS[i] === '@') {
            let end = i + 1;
            let braceDepth = 0;
            while (end < cleanedCSS.length) {
                if (cleanedCSS[end] === '{') braceDepth++;
                if (cleanedCSS[end] === '}') braceDepth--;
                if (braceDepth === 0 && cleanedCSS[end] === '}') {
                    end++;
                    break;
                }
                end++;
            }
            i = end;
            continue;
        }
       
        // Normal kural arama
        const ruleStart = cleanedCSS.indexOf('{', i);
        if (ruleStart === -1) break;
       
        const selector = cleanedCSS.substring(i, ruleStart).trim();
       
        let ruleEnd = ruleStart + 1;
        let braceDepth = 1;
        while (ruleEnd < cleanedCSS.length && braceDepth > 0) {
            if (cleanedCSS[ruleEnd] === '{') braceDepth++;
            if (cleanedCSS[ruleEnd] === '}') braceDepth--;
            ruleEnd++;
        }
       
        const declarations = cleanedCSS.substring(ruleStart + 1, ruleEnd - 1).trim();
       
        const rule = {
            selector: selector,
            declarations: declarations.split(';')
                .filter(dec => dec.trim())
                .map(dec => {
                    const [property, ...valueParts] = dec.split(':');
                    return {
                        property: property ? property.trim() : '',
                        value: valueParts.length > 0 ? valueParts.join(':').trim() : '',
                        full: dec.trim()
                    };
                }),
            selectorCount: selector.split(',').length,
            declarationCount: declarations.split(';').filter(d => d.trim()).length
        };
       
        if (rule.selector) { // && rule.declarations.length > 0
            rules.push(rule);
        }
       
        i = ruleEnd;
    }
   
    return rules;
}

// Tüm seçicileri çıkar
function extractAllSelectors(rules) {
    return rules.flatMap(rule =>
        rule.selector.split(',').map(s => s.trim()).filter(s => s)
    );
}

// Tüm deklarasyonları çıkar
function extractAllDeclarations(rules) {
    return rules.flatMap(rule => rule.declarations.filter(d => d.property && d.value));
}

// Bayt formatı
function formatBytes(bytes) {
    if (bytes < 1024) return '<span class="stat-number">'+ bytes +'</span><small> B</small>';
    if (bytes < 1024 * 1024) return '<span class="stat-number">'+ (bytes / 1024).toFixed(1) +'</span><small> KB</small>';
    return '<span class="stat-number">'+  (bytes / (1024 * 1024)).toFixed(1) +'</span><small> MB</small>';
}

// Seçici kompleksitesini hesapla
function calculateSelectorComplexity(selector) {
    if (!selector) return 0;
   
    let complexity = 0;
   
    // IDs
    complexity += (selector.match(/#/g) || []).length * 100;
    // Classes
    complexity += (selector.match(/\./g) || []).length * 10;
    // Attributes
    complexity += (selector.match(/\[/g) || []).length * 10;
    // Pseudo-classes/elements
    complexity += (selector.match(/::?[a-z-]+(?:\([^)]+\))?/gi) || []).length * 10;
    // Elements
    complexity += (selector.match(/^[a-z]+|[ >+~][a-z]+/gi) || []).length * 1;
    // Combinators
    complexity += (selector.match(/[ >+~]/g) || []).length * 1;
   
    return complexity;
}

// Seçici spesifisitesini hesapla
function calculateSelectorSpecificity(selector) {
    if (!selector) return { a: 0, b: 0, c: 0, total: 0 };
   
    let a = 0, b = 0, c = 0;
   
    // IDs (#id)
    const idMatches = selector.match(/#[a-zA-Z][\w-]*/g);
    a = idMatches ? idMatches.length : 0;
   
    // Classes (.class), attributes [attr], pseudo-classes (:hover)
    const classMatches = selector.match(/\.[a-zA-Z][\w-]*/g);
    const attrMatches = selector.match(/\[[^\]]+\]/g);
    const pseudoClassMatches = selector.match(/::?[a-zA-Z-]+(?!\()/g);
    b = (classMatches ? classMatches.length : 0) +
        (attrMatches ? attrMatches.length : 0) +
        (pseudoClassMatches ? pseudoClassMatches.length : 0);
   
    // Elements (div, span, etc.)
    const elementMatches = selector.match(/(^|[ >+~])[a-zA-Z]+/g);
    c = elementMatches ? elementMatches.length : 0;
   
    return { a, b, c, total: a * 100 + b * 10 + c };
}

// Notlandırma fonksiyonu
function getGrade(score) {
    if (score >= 90) return { grade: 'A', color: '#10b981' };
    if (score >= 80) return { grade: 'B', color: '#f59e0b' };
    if (score >= 70) return { grade: 'C', color: '#f59e0b' };
    if (score >= 60) return { grade: 'D', color: '#ef4444' };
    return { grade: 'F', color: '#dc2626' };
}

function addSuggestionsToMetrics(metrics, results) {
    // results undefined olabilir kontrolü
    if (!results || !results.maintainability || !results.complexity || !results.performance) {
        console.warn('addSuggestionsToMetrics: results geçerli değil', results);
        return metrics;
    }
    
    // Eğer metrics zaten öneri eklenmişse, tekrar ekleme
    const hasSuggestionsAlready = metrics.some(m => 
        m.problematicCodes && m.problematicCodes.some(code => typeof code === 'string' && code.includes('💡'))
    );
    
    if (hasSuggestionsAlready) {
        //Öneriler zaten eklenmiş, tekrar eklenmiyor.
        return metrics;
    }
    
    const { maintainability, complexity, performance, general } = results;
    const totalDeclarations = general?.totalDeclarations || 0;
    
    // Metrik ID'leri ve karşılık gelen kontrol koşulları
    const metricConditions = {
        // Bakım kolaylığı metrikleri
        'max-declarations': maintainability.maxDeclarationsPerRule > 10,
        'avg-declarations': maintainability.avgDeclarationsPerRule > 6.15,
        'declaration-duplications': maintainability.declarationDuplicationPercentage > 40.2,
        'larger-declaration-blocks': (maintainability.largeDeclarationBlocksOver20 || 0) > 0,
        'empty-rulesets': maintainability.emptyRulesets > 0,
        'selector-duplications': maintainability.selectorDuplicationPercentage > 23.5,
        'avg-selectors': maintainability.avgSelectorsPerRule > 1.09,
        'max-selectors': maintainability.maxSelectorsPerRule > 3,
        'larger-selectorlists': maintainability.largerThanCommonSelectorPercentage > 20,
        
        // Kompleksite metrikleri
        'more-complex-than-common': (complexity.moreComplexThanCommonPercentage || 0) > 60.2,
        'more-specific-than-common': (complexity.moreSpecificThanCommonPercentage || 0) > 63.0,
        'avg-selector-complexity': (complexity.avgSelectorComplexity || 0) > 1.95,
        'avoid-complex-selectors': (complexity.maxSelectorComplexity || 0) > 6,
        'avoid-import': (complexity.importRules || 0) > 0,
        'avoid-id-selectors': (complexity.idSelectorPercentage || 0) > 7.1,
        'keep-important-low': (complexity.importantUsagePercentage || 0) > 0.6,
        
        // Performans metrikleri
        'keep-filesize-low': (performance.fileSizeKB || 0) > 62.2,
        'limit-css-comments': (performance.commentSizeBytes || 0) > 142,
        'limit-embedded-content': (performance.embeddedContentBytes || 0) > 0,
        'avoid-many-sloc': (performance.sourceLinesOfCode || 0) > 2649,
        'bad-animations': (performance.badAnimationCount || 0) > 0,
        'expensive-properties': (performance.expensivePropertyCount || 0) > 0,
        'paint-triggering-properties': (performance.paintTriggeringPercentage || 0) > 20,
        'composite-only-properties': (performance.compositeOnlyPercentage || 0) < 10,
        'layout-triggering-properties': (performance.layoutTriggeringPercentage || 0) > 15
    };
    
    // Metrik ID'leri ve öneri mesajları
    const metricSuggestions = {
        // Bakım kolaylığı önerileri
        'max-declarations': `Kural başına maksimum deklarasyon sayısı yüksek (${maintainability.maxDeclarationsPerRule}). 10'un üzerindeki kuralları bölün.`,
        'avg-declarations': `Ortalama deklarasyon sayısı yüksek (${maintainability.avgDeclarationsPerRule.toFixed(2)}). 6.15'in üzerinde ise kuralları basitleştirin.`,
        'declaration-duplications': `Yüksek deklarasyon tekrarı (%${maintainability.declarationDuplicationPercentage.toFixed(1)}). CSS değişkenleri (custom properties) kullanarak tekrarı azaltın.`,
        'larger-declaration-blocks': `${maintainability.largeDeclarationBlocksOver20 || 0} adet 20+ deklarasyon içeren kural bloğu bulundu. Büyük blokları bileşenlere ayırın.`,
        'empty-rulesets': `${maintainability.emptyRulesets} adet boş kural seti bulundu. Kullanılmayan kuralları temizleyin.`,
        'selector-duplications': `Seçici tekrarı yüksek (%${maintainability.selectorDuplicationPercentage.toFixed(1)}). Ortak seçicileri gruplayın veya bileşen bazlı CSS kullanın.`,
        'avg-selectors': `Ortalama seçici sayısı yüksek (${maintainability.avgSelectorsPerRule.toFixed(2)}). 1.09'un üzerinde ise seçicileri basitleştirin.`,
        'max-selectors': `Maksimum seçici sayısı yüksek (${maintainability.maxSelectorsPerRule}). 3'ten fazla seçici içeren kuralları bölün.`,
        'larger-selectorlists': `Ortalamadan büyük seçici listesi oranı yüksek (%${maintainability.largerThanCommonSelectorPercentage.toFixed(1)}). Uzun seçici listelerini daha küçük, anlamlı gruplara ayırın.`,
        
        // Kompleksite önerileri
        'more-complex-than-common': `Çok karmaşık seçici oranı yüksek (%${(complexity.moreComplexThanCommonPercentage || 0).toFixed(1)}). 60.2%'nin üzerinde ise seçici spesifisitesini azaltın.`,
        'more-specific-than-common': `Yüksek spesifisiteli seçici oranı fazla (%${(complexity.moreSpecificThanCommonPercentage || 0).toFixed(1)}). 63.0%'ın üzerinde ise daha genel seçiciler kullanın.`,
        'avg-selector-complexity': `Ortalama seçici kompleksitesi yüksek (${(complexity.avgSelectorComplexity || 0).toFixed(2)}). 1.95'in üzerinde ise seçicileri basitleştirin.`,
        'avoid-complex-selectors': `En karmaşık seçicinin kompleksite değeri yüksek (${complexity.maxSelectorComplexity}). 6'dan büyük seçicileri basitleştirin.`,
        'avoid-import': `${complexity.importRules} adet @import kuralı bulundu. @import render'ı engeller, bunun yerine <link> kullanın veya build aracıyla birleştirin.`,
        'avoid-id-selectors': `ID seçici kullanımı fazla (%${complexity.idSelectorPercentage.toFixed(1)}). 7.1%'in üzerinde ise class seçicilere öncelik verin.`,
        'keep-important-low': `!important kullanımı fazla (%${complexity.importantUsagePercentage.toFixed(1)}). 0.6%'nın üzerinde ise spesifisiteyi düzgün yöneterek !important'den kaçının.`,
        
        // Performans önerileri
        'keep-filesize-low': `CSS dosya boyutu büyük (${(performance.fileSizeKB || 0).toFixed(2)} KB). 62.2 KB'ın üzerinde ise minification, compression ve kullanılmayan CSS'i temizleyin.`,
        'limit-css-comments': `CSS yorumları fazla yer kaplıyor (${performance.commentSizeBytes} B). 142 B'ın üzerinde ise üretimde yorumları kaldırın veya minify edin.`,
        'limit-embedded-content': `${performance.embeddedContentBytes} B gömülü içerik bulundu. Base64 kodlamalı resimler performansı düşürür, bunun yerine harici dosya kullanın.`,
        'avoid-many-sloc': `CSS kaynak satır sayısı yüksek (${performance.sourceLinesOfCode}). 2649'un üzerinde ise modüler yapıya geçin ve tekrar eden kodları azaltın.`,
        'bad-animations': `${performance.badAnimationCount} adet performansı düşük animasyon özelliği bulundu. Layout-triggering animasyonlar yerine transform ve opacity kullanın.`,
        'expensive-properties': `${performance.expensivePropertyCount} adet pahalı CSS özelliği bulundu. Box-shadow, border-radius, filter gibi özellikleri optimize edin.`,
        'paint-triggering-properties': `Paint tetikleyici özellik oranı yüksek (%${(performance.paintTriggeringPercentage || 0).toFixed(1)}). %20'nin üzerinde ise boyama maliyetli özellikleri (color, background, border-color vb.) optimize edin.`,
        'composite-only-properties': `Composite-only özellik oranı düşük (%${(performance.compositeOnlyPercentage || 0).toFixed(1)}). %10'un altında ise transform, opacity gibi GPU hızlandırmalı özelliklere öncelik verin.`,
        'layout-triggering-properties': `Layout tetikleyici özellik oranı yüksek (%${(performance.layoutTriggeringPercentage || 0).toFixed(1)}). %15'in üzerinde ise width, height, margin, padding gibi reflow tetikleyen özellikleri azaltın.`,
        
        // Her zaman öneri eklenen metrikler (olumlu tavsiyeler)
        'good-animations': `Kullandığınız ${performance.goodAnimationCount} adet GPU hızlandırmalı animasyon özelliği iyi bir performans göstergesi. Bu tür animasyonları (transform, opacity vb.) daha fazla kullanın.`,
        'non-expensive-properties': `Kullandığınız ${totalDeclarations - performance.expensivePropertyCount} adet performanslı CSS özelliği iyi bir başlangıç. Basit ve hafif özellikleri tercih etmeye devam edin.`
    };

    // Eğer totalDeclarations varsa, pahalı özellikler için yüzde bazlı kontrol
    if (totalDeclarations > 0) {
        const expensivePercentage = (performance.expensivePropertyCount / totalDeclarations) * 100;
        if (expensivePercentage > 2) {
            metricSuggestions['expensive-properties'] = `Pahalı CSS özellikleri oranı yüksek (%${expensivePercentage.toFixed(1)}). %2'nin üzerinde ise box-shadow, border-radius, filter gibi özellikleri optimize edin.`;
        }
    }

    // good-animations ve non-expensive-properties için her zaman öneri ekle (koşulsuz)
    metricConditions['good-animations'] = true;
    metricConditions['non-expensive-properties'] = true;

    // Metrikleri güncelle
    return metrics.map(metric => {
        // Metrik için koşul kontrolü
        const shouldAddSuggestion = metricConditions[metric.id];
        const suggestionMessage = metricSuggestions[metric.id];
        
        if (shouldAddSuggestion && suggestionMessage) {
            const suggestionCode = `<div class="suggestion-item"><div class="sug-icon">💡</div><div class="sug-text">${suggestionMessage}</div></div>`;
            
            // 1. problematicCodes yoksa oluştur
            if (!metric.problematicCodes || !Array.isArray(metric.problematicCodes)) {
                metric.problematicCodes = [];
            }
            
            // 2. Aynı önerinin zaten eklenip eklenmediğini kontrol et
            const hasThisSuggestion = metric.problematicCodes.some(code => 
                typeof code === 'string' && code.includes(suggestionMessage)
            );
            
            if (!hasThisSuggestion) {
                // 3. Başarılı mesajların index'lerini bul
                const successIndices = [];
                metric.problematicCodes.forEach((code, index) => {
                    if (typeof code === 'string' && (code.includes("✅") || code.includes("🎉"))) {
                        successIndices.push(index);
                    }
                });
                
                if (successIndices.length > 0) {
                    // 4. En son success mesajından sonra ekle
                    const lastSuccessIndex = Math.max(...successIndices);
                    metric.problematicCodes.splice(lastSuccessIndex + 1, 0, suggestionCode);
                } else {
                    // 5. Hiç success mesajı yoksa en sona ekle
                    metric.problematicCodes.push(suggestionCode);
                }
            }
        }
        
        // 6. Eğer bu metrik için hiç problematicCodes yoksa ve metrik kötü durumdaysa
        if ((!metric.problematicCodes || metric.problematicCodes.length === 0) && metric.status === 'bad') {
            const defaultSuggestion = metricSuggestions[metric.id];
            if (defaultSuggestion) {metric.problematicCodes = [`<div class="suggestion-item"><div class="sug-icon">💡</div><div class="sug-text">${suggestionMessage}</div></div>`];}
        }
        
        return metric;
    });
}

// ==================== ÖNERİLER OLUŞTUR ====================
function generateSuggestions(results) {
    const suggestions = [];
    const { maintainability, complexity, performance } = results;
    
    // Bakım kolaylığı önerileri
    if (maintainability.maxDeclarationsPerRule > 10) {
        suggestions.push(`Kural başına maksimum deklarasyon sayısı yüksek (${maintainability.maxDeclarationsPerRule}). 10'un üzerindeki kuralları bölün.`);
    }
    
    if (maintainability.avgDeclarationsPerRule > 6.15) {
        suggestions.push(`Ortalama deklarasyon sayısı yüksek (${maintainability.avgDeclarationsPerRule.toFixed(2)}). 6.15'in üzerinde ise kuralları basitleştirin.`);
    }
    
    if (maintainability.declarationDuplicationPercentage > 40.2) {
        suggestions.push(`Yüksek deklarasyon tekrarı (%${maintainability.declarationDuplicationPercentage.toFixed(1)}). CSS değişkenleri (custom properties) kullanarak tekrarı azaltın.`);
    }
    
    if (maintainability.emptyRulesets > 0) {
        suggestions.push(`${maintainability.emptyRulesets} boş kural seti bulundu. Kullanılmayan kuralları temizleyin.`);
    }
    
    if (maintainability.selectorDuplicationPercentage > 23.5) {
        suggestions.push(`Seçici tekrarı yüksek (%${maintainability.selectorDuplicationPercentage.toFixed(1)}). Ortak seçicileri gruplayın veya bileşen bazlı CSS kullanın.`);
    }
    
    if (maintainability.avgSelectorsPerRule > 1.09) {
        suggestions.push(`Ortalama seçici sayısı yüksek (${maintainability.avgSelectorsPerRule.toFixed(2)}). 1.09'un üzerinde ise seçicileri basitleştirin.`);
    }
    
    if (maintainability.maxSelectorsPerRule > 3) {
        suggestions.push(`Maksimum seçici sayısı yüksek (${maintainability.maxSelectorsPerRule}). 3'ten fazla seçici içeren kuralları bölün.`);
    }
    
    // Kompleksite önerileri
    if (complexity.moreComplexThanCommonPercentage > 60.2) {
        suggestions.push(`Çok karmaşık seçici oranı yüksek (%${complexity.moreComplexThanCommonPercentage.toFixed(1)}). 60.2%'nin üzerinde ise seçici spesifisitesini azaltın.`);
    }
    
    if (complexity.moreSpecificThanCommonPercentage > 63.0) {
        suggestions.push(`Yüksek spesifisiteli seçici oranı fazla (%${complexity.moreSpecificThanCommonPercentage.toFixed(1)}). 63.0%'ın üzerinde ise daha genel seçiciler kullanın.`);
    }
    
    if (complexity.maxSelectorComplexity > 6) {
        suggestions.push(`En karmaşık seçicinin kompleksite değeri yüksek (${complexity.maxSelectorComplexity}). 6'dan büyük seçicileri basitleştirin.`);
    }
    
    if (complexity.importRules > 0) {
        suggestions.push(`${complexity.importRules} @import kuralı bulundu. @import render'ı engeller, bunun yerine <link> kullanın veya build aracıyla birleştirin.`);
    }
    
    if (complexity.avgSelectorComplexity > 1.95) {
        suggestions.push(`Ortalama seçici kompleksitesi yüksek (${complexity.avgSelectorComplexity.toFixed(2)}). 1.95'in üzerinde ise seçicileri basitleştirin.`);
    }
    
    if (complexity.idSelectorPercentage > 7.1) {
        suggestions.push(`ID seçici kullanımı fazla (%${complexity.idSelectorPercentage.toFixed(1)}). 7.1%'in üzerinde ise class seçicilere öncelik verin.`);
    }
    
    if (complexity.importantUsagePercentage > 0.6) {
        suggestions.push(`!important kullanımı fazla (%${complexity.importantUsagePercentage.toFixed(1)}). 0.6%'nın üzerinde ise spesifisiteyi düzgün yöneterek !important'den kaçının.`);
    }
    
    // Performans önerileri
    if (performance.fileSizeKB > 62.2) {
        suggestions.push(`CSS dosya boyutu büyük (${performance.fileSizeKB.toFixed(2)} KB). 62.2 KB'ın üzerinde ise minification, compression ve kullanılmayan CSS'i temizleyin.`);
    }
    
    if (performance.commentSizeBytes > 142) {
        suggestions.push(`CSS yorumları fazla yer kaplıyor (${performance.commentSizeBytes} B). 142 B'ın üzerinde ise üretimde yorumları kaldırın veya minify edin.`);
    }
    
    if (performance.embeddedContentBytes > 0) {
        suggestions.push(`${performance.embeddedContentBytes} B gömülü içerik bulundu. Base64 kodlamalı resimler performansı düşürür, bunun yerine harici dosya kullanın.`);
    }
    
    if (performance.sourceLinesOfCode > 2649) {
        suggestions.push(`CSS kaynak satır sayısı yüksek (${performance.sourceLinesOfCode}). 2649'un üzerinde ise modüler yapıya geçin ve tekrar eden kodları azaltın.`);
    }
    
    if (performance.badAnimationCount > 0) {
        suggestions.push(`${performance.badAnimationCount} performansı düşük animasyon özelliği bulundu. Layout-triggering animasyonlar yerine transform ve opacity kullanın.`);
    }
    
    if (performance.expensivePropertyCount && performance.expensivePropertyCount > 0) {
        suggestions.push(`${performance.expensivePropertyCount} pahalı CSS özelliği bulundu. Box-shadow, border-radius, filter gibi özellikleri optimize edin.`);
    }
    
    if (results.totalDeclarations && results.totalDeclarations > 0) {
        const expensivePercentage = (performance.expensivePropertyCount / results.totalDeclarations) * 100;
        if (expensivePercentage > 2) {
            suggestions.push(`Pahalı CSS özellikleri oranı yüksek (%${expensivePercentage.toFixed(1)}). %2'nin üzerinde ise box-shadow, border-radius, filter gibi özellikleri optimize edin.`);
        }
    }

    if (results.performance.paintTriggeringPercentage > 20) {
        suggestions.push(`Paint tetikleyici özellik oranı yüksek (%${results.performance.paintTriggeringPercentage.toFixed(1)}). Boyama işlemi tetikleyen özellikleri (color, background, border gibi) optimize edin.`);
    }
    
    if (results.performance.compositeOnlyPercentage < 10) {
        suggestions.push(`Composite-only özellik oranı düşük (%${results.performance.compositeOnlyPercentage.toFixed(1)}). Transform, opacity gibi GPU hızlandırmalı özellikleri daha fazla kullanın.`);
    }
    
    if (results.performance.layoutTriggeringPercentage > 15) {
        suggestions.push(`Layout tetikleyici özellik oranı yüksek (%${results.performance.layoutTriggeringPercentage.toFixed(1)}). Reflow tetikleyen özellikleri (width/height değişiklikleri, margin/padding) minimize edin.`);
    }
    
    return suggestions;
}

// Buton görünürlüğünü kontrol et
function updateReportButtonVisibility() {
    const cssReportBtn = document.getElementById('css-report');
    const cssContainer = document.querySelector('#container div[data-language="css"]');
   
    if (!cssReportBtn) return;
    const hasMinifiedCSS = cssContainer && getCSS().trim().length > 0;
   
    if (hasOriginalCSS || hasMinifiedCSS) {
        cssReportBtn.classList.remove('hidden');
    } else {
        cssReportBtn.classList.add('hidden');
    }
}

// Yardımcı fonksiyonlar
function getCategoryName(category) {
    const names = {
        'maintainability': 'bakım',
        'complexity': 'karmaşıklık',
        'performance': 'performans'
    };
    return names[category] || category;
}

function formatMetricValue(value, metricId) {
    if (metricId.includes('percentage') || metricId.includes('Percentage')) {
        return `%${value.toFixed(1)}`;
    } else if (metricId.includes('Bytes') || metricId === 'commentSizeBytes' || metricId === 'embeddedSizeBytes') {
        return `${value} B`;
    } else if (metricId.includes('KB') || metricId === 'fileSizeKB' || metricId === 'commentSizeKB' || metricId === 'embeddedSizeKB') {
        return `${value.toFixed(2)} KB`;
    } else if (metricId.includes('triggering') || metricId.includes('composite')) {
        return `%${value.toFixed(1)}`;
    }
    return value;
}

function formatTargetValue(target) {
    if (typeof target === 'string' && target.includes('↑')) {
        return target;
    }
    if (typeof target === 'number') {
        if (target >= 1000) {
            return target.toLocaleString();
        }
        return target;
    }
    return target;
}

function calculateProgressPercentage(value, target, metricId) {
    // Özel durumlar
    if (metricId === 'good-animations') {
        return value > 0 ? 100 : 0;
    }

    if (metricId === 'composite-only-properties') {
        // Yüksek değer iyidir
        if (value >= 30) return 100;
        if (value >= 20) return 80;
        if (value >= 10) return 60;
        if (value >= 5) return 40;
        return 20;
    }
    
    if (metricId === 'paint-triggering-properties' || metricId === 'layout-triggering-properties') {
        // Düşük değer iyidir
        if (value <= target) return 100;
        if (value <= target * 1.5) return 70;
        if (value <= target * 2) return 40;
        return 20;
    }
    
    if (typeof target === 'string' || target === 0) {
        // Hedef 0 ise veya string ise
        if (value === 0) return 100;
        if (value <= 10) return 80;
        if (value <= 20) return 60;
        if (value <= 30) return 40;
        if (value <= 50) return 20;
        return 10;
    }
    
    // Normal yüzde hesaplama
    const percentage = (value / target) * 100;
    
    if (metricId.includes('percentage') || 
        metricId.includes('KB') || 
        metricId.includes('Bytes') ||
        metricId.includes('Lines')) {
        // Küçük değerler iyidir
        if (value <= target) return 100;
        if (value <= target * 1.5) return 70;
        if (value <= target * 2) return 40;
        return 20;
    }
    
    // Büyük değerler iyidir (örneğin animasyon sayısı)
    if (metricId.includes('good')) {
        return Math.min(100, (value / 10) * 100);
    }
    
    return Math.min(100, percentage);
}

function getStatusText(status) {
    const texts = {
        'good': 'iyi',
        'medium': 'orta',
        'bad': 'kötü'
    };
    return texts[status] || status;
}

function initializeRadioFilters(results) {
    const radioButtons = document.querySelectorAll('input[name="filter-type"]');
    const metricsContainer = document.querySelector('.metrics-container');
  
    radioButtons.forEach(radio => {
        radio.addEventListener('change', function() {
            updateActiveRadio(this);
          
            const filter = this.value;
            let metricsToShow;
          
            switch(filter) {
                case 'maintainability':
                    metricsToShow = results.maintainability.metrics || [];
                    break;
                case 'complexity':
                    metricsToShow = results.complexity.metrics || [];
                    break;
                case 'performance':
                    metricsToShow = results.performance.metrics || [];
                    break;
                default:  // 'all'
                    metricsToShow = results.allMetrics || [];  
            }
          
            // renderMetricsList'i sadece metricsToShow ile çağır
            metricsContainer.innerHTML = renderMetricsList(metricsToShow, filter);
        });
    });
  
    const defaultRadio = document.querySelector('input[name="filter-type"]:checked');
    if (defaultRadio) {
        defaultRadio.dispatchEvent(new Event('change'));
    }
}


// Aktif radio button'ı görsel olarak güncelle (CSS için)
function updateActiveRadio(selectedRadio) {
    // Tüm radio label'larından active class'ını kaldır
    document.querySelectorAll('input[name="filter-type"]').forEach(radio => {
        const label = document.querySelector(`label[for="${radio.id}"]`);
        if (label) label.classList.remove('active');
    });
    
    // Seçilen radio'nun label'ına active class'ını ekle
    const selectedLabel = document.querySelector(`label[for="${selectedRadio.id}"]`);
    if (selectedLabel) selectedLabel.classList.add('active');
}

// Event listener'ları bağla
function initializeReportSystem() {
    const cssContainer = document.querySelector('#container div[data-language="css"]');
    if (cssContainer) {cssContainer.addEventListener('input', updateReportButtonVisibility);}
    setTimeout(updateReportButtonVisibility, 500);
}

// ============================================
// CSS DOGRULA
// ============================================
function validateCSS(cssCode) {
    if (!cssCode || cssCode.trim() === '') {
        AlertBox('CSS kodu bulunamadı!', 'warning');
        return [];
    }
   
    try {
        const validationErrors = [];
        const warnings = [];
        const lines = cssCode.split('\n');
       
        // Tanımlanmış özel değişkenler
        const definedCustomProperties = new Set();
        // Kullanılan özel değişkenler
        const usedCustomProperties = new Set();
        // Tanımlanmamış değişkenler
        const undefinedProperties = new Set();
        // Kullanılmayan tanımlanmış değişkenler
        const unusedCustomProperties = new Set();
       
        // Tüm CSS özellikleri (güncellenmiş)
        const cssProperties = new Set([
            // CSS Custom Properties
            "--*",
           
            // A
            "accent-color", "align-content", "align-items", "align-self", "all",
            "animation", "animation-composition", "animation-delay", "animation-direction",
            "animation-duration", "animation-fill-mode", "animation-iteration-count",
            "animation-name", "animation-play-state", "animation-range", "animation-range-end",
            "animation-range-start", "animation-timeline", "animation-timing-function",
            "animation-trigger", "appearance", "aspect-ratio", "azimuth",
           
            // B
            "backface-visibility", "background", "background-attachment", "background-blend-mode",
            "background-clip", "background-color", "background-image", "background-origin",
            "background-position", "background-position-block", "background-position-inline",
            "background-position-x", "background-position-y", "background-repeat",
            "background-repeat-block", "background-repeat-inline", "background-repeat-x",
            "background-repeat-y", "background-size", "baseline-shift", "baseline-source",
            "block-ellipsis", "block-size", "bookmark-label", "bookmark-level", "bookmark-state",
            "border", "border-block", "border-block-color", "border-block-end",
            "border-block-end-color", "border-block-end-radius", "border-block-end-style",
            "border-block-end-width", "border-block-start", "border-block-start-color",
            "border-block-start-radius", "border-block-start-style", "border-block-start-width",
            "border-block-style", "border-block-width", "border-bottom", "border-bottom-color",
            "border-bottom-left-radius", "border-bottom-right-radius", "border-bottom-style",
            "border-bottom-width", "border-collapse", "border-color", "border-end-end-radius",
            "border-end-start-radius", "border-image", "border-image-outset", "border-image-repeat",
            "border-image-slice", "border-image-source", "border-image-width", "border-inline",
            "border-inline-color", "border-inline-end", "border-inline-end-color",
            "border-inline-end-radius", "border-inline-end-style", "border-inline-end-width",
            "border-inline-start", "border-inline-start-color", "border-inline-start-radius",
            "border-inline-start-style", "border-inline-start-width", "border-inline-style",
            "border-inline-width", "border-left", "border-left-color", "border-left-style",
            "border-left-width", "border-radius", "border-right", "border-right-color",
            "border-right-style", "border-right-width", "border-spacing", "border-start-end-radius",
            "border-start-start-radius", "border-style", "border-top", "border-top-color",
            "border-top-left-radius", "border-top-right-radius", "border-top-style",
            "border-top-width", "border-width", "bottom", "box-decoration-break", "box-shadow",
            "box-sizing", "box-snap", "break-after", "break-before", "break-inside",
           
            // C
            "caption-side", "caret", "caret-color", "caret-shape", "clear", "clip",
            "clip-path", "clip-rule", "color", "color-adjust", "color-interpolation-filters",
            "color-scheme", "column-count", "column-fill", "column-gap", "column-rule",
            "column-rule-color", "column-rule-style", "column-rule-width", "column-span",
            "column-width", "columns", "contain", "contain-intrinsic-block-size",
            "contain-intrinsic-height", "contain-intrinsic-inline-size", "contain-intrinsic-size",
            "contain-intrinsic-width", "container", "container-name", "container-type", "content",
            "content-visibility", "continue", "counter-increment", "counter-reset", "counter-set",
            "cursor",
           
            // D
            "direction", "display", "dominant-baseline",
           
            // E
            "empty-cells",
           
            // F
            "fill", "fill-break", "fill-color", "fill-image", "fill-opacity",
            "fill-origin", "fill-position", "fill-repeat", "fill-rule", "fill-size", "filter",
            "flex", "flex-basis", "flex-direction", "flex-flow", "flex-grow", "flex-shrink",
            "flex-wrap", "float", "flood-color", "flood-opacity", "font", "font-family",
            "font-feature-settings", "font-kerning", "font-language-override", "font-optical-sizing",
            "font-palette", "font-size", "font-size-adjust", "font-stretch", "font-style",
            "font-synthesis", "font-synthesis-position", "font-synthesis-small-caps",
            "font-synthesis-style", "font-synthesis-weight", "font-variant", "font-variant-alternates",
            "font-variant-caps", "font-variant-east-asian", "font-variant-emoji",
            "font-variant-ligatures", "font-variant-numeric", "font-variant-position",
            "font-variation-settings", "font-weight", "font-width", "forced-color-adjust",
           
            // G
            "gap", "glyph-orientation-vertical", "grid", "grid-area", "grid-auto-columns",
            "grid-auto-flow", "grid-auto-rows", "grid-column", "grid-column-end", "grid-column-start",
            "grid-row", "grid-row-end", "grid-row-start", "grid-template", "grid-template-areas",
            "grid-template-columns", "grid-template-rows",
           
            // H
            "hanging-punctuation", "height", "hyphenate-character", "hyphenate-limit-chars",
            "hyphenate-limit-last", "hyphenate-limit-lines", "hyphenate-limit-zone", "hyphens",
           
            // I
            "image-orientation", "image-rendering", "image-resolution", "initial-letter",
            "initial-letter-align", "initial-letter-wrap", "inline-size", "inset", "inset-block",
            "inset-block-end", "inset-block-start", "inset-inline", "inset-inline-end",
            "inset-inline-start", "isolation",
           
            // J
            "justify-content", "justify-items", "justify-self",
           
            // L
            "left", "letter-spacing", "lighting-color", "line-break", "line-clamp", "line-height",
            "line-height-step", "line-snap", "list-style", "list-style-image", "list-style-position",
            "list-style-type",
           
            // M
            "margin", "margin-block", "margin-block-end", "margin-block-start", "margin-bottom",
            "margin-inline", "margin-inline-end", "margin-inline-start", "margin-left", "margin-right",
            "margin-top", "margin-trim", "mask", "mask-border", "mask-border-mode", "mask-border-outset",
            "mask-border-repeat", "mask-border-slice", "mask-border-source", "mask-border-width",
            "mask-clip", "mask-composite", "mask-image", "mask-mode", "mask-origin", "mask-position",
            "mask-repeat", "mask-size", "mask-type", "max-block-size", "max-height", "max-inline-size",
            "max-lines", "max-width", "min-block-size", "min-height", "min-inline-size", "min-width",
            "mix-blend-mode",
           
            // O
            "object-fit", "object-position", "offset", "offset-anchor", "offset-distance",
            "offset-path", "offset-position", "offset-rotate", "opacity", "order", "orphans",
            "outline", "outline-color", "outline-offset", "outline-style", "outline-width",
            "overflow", "overflow-anchor", "overflow-block", "overflow-clip-margin",
            "overflow-clip-margin-block", "overflow-clip-margin-block-end",
            "overflow-clip-margin-block-start", "overflow-clip-margin-bottom",
            "overflow-clip-margin-inline", "overflow-clip-margin-inline-end",
            "overflow-clip-margin-inline-start", "overflow-clip-margin-left",
            "overflow-clip-margin-right", "overflow-clip-margin-top", "overflow-inline",
            "overflow-wrap", "overflow-x", "overflow-y", "overscroll-behavior",
            "overscroll-behavior-block", "overscroll-behavior-inline", "overscroll-behavior-x",
            "overscroll-behavior-y",
           
            // P
            "padding", "padding-block", "padding-block-end", "padding-block-start", "padding-bottom",
            "padding-inline", "padding-inline-end", "padding-inline-start", "padding-left",
            "padding-right", "padding-top", "page", "page-break-after", "page-break-before",
            "page-break-inside", "pause", "pause-after", "pause-before", "perspective",
            "perspective-origin", "place-content", "place-items", "place-self", "pointer-events",
            "position", "position-anchor", "position-area", "position-try", "position-try-fallbacks",
            "position-try-order", "position-visibility", "print-color-adjust",
           
            // Q
            "quotes",
           
            // R
            "resize", "right", "rotate", "row-gap", "ruby-align", "ruby-merge", "ruby-overhang", "ruby-position",
           
            // S
            "scale", "scroll-behavior", "scroll-margin", "scroll-margin-block",
            "scroll-margin-block-end", "scroll-margin-block-start", "scroll-margin-bottom",
            "scroll-margin-inline", "scroll-margin-inline-end", "scroll-margin-inline-start",
            "scroll-margin-left", "scroll-margin-right", "scroll-margin-top", "scroll-padding",
            "scroll-padding-block", "scroll-padding-block-end", "scroll-padding-block-start",
            "scroll-padding-bottom", "scroll-padding-inline", "scroll-padding-inline-end",
            "scroll-padding-inline-start", "scroll-padding-left", "scroll-padding-right",
            "scroll-padding-top", "scroll-snap-align", "scroll-snap-stop", "scroll-snap-type",
            "scroll-timeline", "scroll-timeline-axis", "scroll-timeline-name", "scrollbar-color",
            "scrollbar-gutter", "scrollbar-width", "shape-image-threshold", "shape-margin",
            "shape-outside", "speak", "speak-as", "stroke", "stroke-align",
            "stroke-alignment", "stroke-break", "stroke-color", "stroke-dash-corner",
            "stroke-dash-justify", "stroke-dasharray", "stroke-dashoffset", "stroke-image",
            "stroke-linecap", "stroke-linejoin", "stroke-miterlimit", "stroke-opacity",
            "stroke-origin", "stroke-position", "stroke-repeat", "stroke-size", "stroke-width",
           
            // T
            "tab-size", "table-layout", "text-align", "text-align-all", "text-align-last",
            "text-autospace", "text-combine-upright", "text-decoration", "text-decoration-color",
            "text-decoration-line", "text-decoration-skip", "text-decoration-skip-ink",
            "text-decoration-style", "text-decoration-thickness", "text-emphasis",
            "text-emphasis-color", "text-emphasis-position", "text-emphasis-style", "text-indent",
            "text-justify", "text-orientation", "text-overflow", "text-shadow", "text-spacing",
            "text-spacing-trim", "text-transform", "text-underline-offset", "text-underline-position",
            "text-wrap", "text-wrap-mode", "text-wrap-style", "top", "transform", "transform-box",
            "transform-origin", "transform-style", "transition", "transition-delay",
            "transition-duration", "transition-property", "transition-timing-function", "translate",
           
            // U
            "unicode-bidi", "user-select",
           
            // V
            "vertical-align", "view-timeline", "view-timeline-axis", "view-timeline-inset",
            "view-timeline-name", "view-transition-name", "visibility", "voice-balance",
            "voice-duration", "voice-family", "voice-pitch", "voice-range", "voice-rate",
            "voice-stress", "voice-volume", "volume",
           
            // W
            "white-space", "white-space-collapse", "white-space-trim", "widows", "width",
            "will-change", "word-break", "word-spacing", "word-wrap", "writing-mode",
           
            // Z
            "z-index", "zoom"
        ]);
       
        // Geçerli CSS birimleri
        const validUnits = new Set([
            'px', 'em', 'rem', '%', 'vh', 'vw', 'vmin', 'vmax', 'cm', 'mm', 'in', 'pt', 'pc',
            'deg', 'rad', 'grad', 'turn', 's', 'ms', 'Hz', 'kHz', 'dpi', 'dpcm', 'dppx'
        ]);
       
        // Geçerli CSS fonksiyonları
        const validFunctions = new Set([
            'rgb', 'rgba', 'hsl', 'hsla', 'calc', 'var', 'url', 'linear-gradient',
            'radial-gradient', 'conic-gradient', 'repeat', 'attr', 'counter', 'counters'
        ]);
       
        // Stack yapısı ile parantez takibi
        const braceStack = [];
        const parenStack = [];
        const bracketStack = [];
       
        // Yorum takibi
        let inComment = false;
        let commentStartLine = 0;
       
        // Seçici takibi
        let inSelector = false;
        let currentSelector = '';
        let selectorStartLine = 0;
       
        lines.forEach((line, index) => {
            const lineNumber = index + 1;
            const trimmed = line.trim();
           
            // 1. YORUM KONTROLÜ
            if (!inComment && trimmed.includes('/*')) {
                inComment = true;
                commentStartLine = lineNumber;
            }
           
            if (inComment && trimmed.includes('*/')) {
                inComment = false;
            }
           
            // Yorum içindeyse diğer kontrolleri atla
            if (inComment && !trimmed.includes('*/')) {
                return;
            }
           
            // 2. PARANTEZ KONTROLÜ
            for (let i = 0; i < line.length; i++) {
                const char = line[i];
               
                switch (char) {
                    case '{':
                        braceStack.push({ line: lineNumber, char: '{' });
                        break;
                    case '}':
                        if (braceStack.length === 0) {
                            validationErrors.push(`${lineNumber}. satır: Beklenmeyen kapama süslü parantezi "}"`);
                        } else {
                            braceStack.pop();
                        }
                        break;
                    case '(':
                        parenStack.push({ line: lineNumber, char: '(' });
                        break;
                    case ')':
                        if (parenStack.length === 0) {
                            validationErrors.push(`${lineNumber}. satır: Beklenmeyen kapama parantezi ")"`);
                        } else {
                            parenStack.pop();
                        }
                        break;
                    case '[':
                        bracketStack.push({ line: lineNumber, char: '[' });
                        break;
                    case ']':
                        if (bracketStack.length === 0) {
                            validationErrors.push(`${lineNumber}. satır: Beklenmeyen kapama köşeli parantezi "]"`);
                        } else {
                            bracketStack.pop();
                        }
                        break;
                }
            }
           
            // 3. SEÇİCİ KONTROLÜ
            if (!trimmed.startsWith('@') && trimmed.includes('{') && !trimmed.includes('}')) {
                const selector = trimmed.split('{')[0].trim();
                if (selector) {
                    // Geçersiz seçici kontrolü
                    if (/^[0-9]/.test(selector)) {
                        validationErrors.push(`${lineNumber}. satır: Seçici sayı ile başlayamaz: "${selector}"`);
                    }
                    // Boş seçici kontrolü
                    if (selector === '' || selector === ' ') {
                        validationErrors.push(`${lineNumber}. satır: Boş seçici`);
                    }
                }
            }
           
            // 4. ÖZEL DEĞİŞKEN TANIMLARI
            const customPropRegex = /--([a-zA-Z0-9-]+)\s*:/g;
            let customPropMatch;
            while ((customPropMatch = customPropRegex.exec(trimmed)) !== null) {
                const propName = `--${customPropMatch[1]}`;
                definedCustomProperties.add(propName);
            }
           
            // 5. ÖZEL DEĞİŞKEN KULLANIMLARI
            const varUsageRegex = /var\(\s*(--[a-zA-Z0-9-]+)\s*(?:,\s*[^)]+)?\)/g;
            let varUsageMatch;
            while ((varUsageMatch = varUsageRegex.exec(trimmed)) !== null) {
                const propName = varUsageMatch[1].trim();
                usedCustomProperties.add(propName);
            }
           
            // 6. CSS ÖZELLİK KONTROLÜ
            if (trimmed.includes(':') && !trimmed.includes('{') && !trimmed.includes('}')) {
                // Noktalı virgül kontrolü
                if (!trimmed.endsWith(';') && !trimmed.endsWith('}')) {
                    validationErrors.push(`${lineNumber}. satır: Noktalı virgül eksik - "${trimmed.substring(0, 50)}"`);
                }
               
                // Özellik adı kontrolü
                const propertyMatch = trimmed.match(/^([a-zA-Z-]+)\s*:/);
                if (propertyMatch && !propertyMatch[1].startsWith('--')) {
                    const propertyName = propertyMatch[1].toLowerCase();
                   
                    // Özel durum: @ kuralları içindeki özellikler
                    if (!cssProperties.has(propertyName) && propertyName !== 'var') {
                        // Bazı vendor prefix'leri kontrol et
                        const vendorPrefixes = ['-webkit-', '-moz-', '-ms-', '-o-'];
                        const hasVendorPrefix = vendorPrefixes.some(prefix => propertyName.startsWith(prefix));
                       
                        if (!hasVendorPrefix) {
                            validationErrors.push(`${lineNumber}. satır: Tanınmayan CSS özelliği "${propertyName}"`);
                        }
                    }
                }
               
                // Değer kontrolü
                const valueMatch = trimmed.match(/:\s*(.+?)\s*(?:;|$)/);
                if (valueMatch) {
                    const value = valueMatch[1].trim();
                   
                    // Birim kontrolü
                    const unitRegex = /([+-]?\d*\.?\d+)([a-zA-Z%]+)/g;
                    let unitMatch;
                    while ((unitMatch = unitRegex.exec(value)) !== null) {
                        const unit = unitMatch[2];
                        if (!validUnits.has(unit.toLowerCase()) && !unit.match(/^[0-9]/)) {
                            warnings.push(`${lineNumber}. satır: Şüpheli birim "${unit}" - "${value}"`);
                        }
                    }
                   
                    // Fonksiyon kontrolü
                    const funcRegex = /([a-zA-Z-]+)\(/g;
                    let funcMatch;
                    while ((funcMatch = funcRegex.exec(value)) !== null) {
                        const funcName = funcMatch[1].toLowerCase();
                        if (!validFunctions.has(funcName) && !funcName.startsWith('--')) {
                            warnings.push(`${lineNumber}. satır: Şüpheli fonksiyon "${funcName}" - "${value}"`);
                        }
                    }
                }
            }
           
            // 7. @ KURALLARI KONTROLÜ
            if (trimmed.startsWith('@')) {
                const atRuleMatch = trimmed.match(/^@([a-zA-Z-]+)/);
                if (atRuleMatch) {
                    const atRule = atRuleMatch[1].toLowerCase();
                    const validAtRules = new Set([
                        'media', 'keyframes', 'font-face', 'import', 'charset', 'namespace',
                        'supports', 'document', 'page', 'viewport', 'counter-style'
                    ]);
                   
                    if (!validAtRules.has(atRule)) {
                        warnings.push(`${lineNumber}. satır: Şüpheli @ kuralı "@${atRule}"`);
                    }
                }
            }
           
            // 8. GEÇERSİZ KARAKTER KONTROLÜ
            const invalidChars = /[^a-zA-Z0-9\s\-_:;{}\[\]().,#@%&*+~'"^`|<>\/\\=!?-]/;
            if (invalidChars.test(line) && !line.includes('/*') && !line.includes('*/')) {
                const invalidChar = line.match(invalidChars)[0];
                warnings.push(`${lineNumber}. satır: Şüpheli karakter "${invalidChar}"`);
            }
        });
       
        // 9. KAPANMAMIŞ PARANTEZ KONTROLÜ
        braceStack.forEach(item => {validationErrors.push(`${item.line}. satır: Açılan süslü parantez kapanmamış`);});
        parenStack.forEach(item => {validationErrors.push(`${item.line}. satır: Açılan parantez kapanmamış`);});
        bracketStack.forEach(item => {validationErrors.push(`${item.line}. satır: Açılan köşeli parantez kapanmamış`);});
        // 10. KAPANMAMIŞ YORUM KONTROLÜ
        if (inComment) {validationErrors.push(`${commentStartLine}. satır: Açılan yorum kapanmamış (/* ile başladı ama */ bulunamadı)`);}
        // 11. ÖZEL DEĞİŞKEN KONTROLÜ
        // Kullanılan ama tanımlanmamış değişkenler
        usedCustomProperties.forEach(usedProp => {
            if (!definedCustomProperties.has(usedProp)) {
                undefinedProperties.add(usedProp);
                validationErrors.push(`Tanımlanmamış özel değişken kullanıldı: "${usedProp}"`);
            }
        });
       
        // Tanımlanmış ama kullanılmayan değişkenler
        definedCustomProperties.forEach(definedProp => {
            if (!usedCustomProperties.has(definedProp)) {
                unusedCustomProperties.add(definedProp);
                warnings.push(`Tanımlanmış ama kullanılmayan özel değişken: "${definedProp}"`);
            }
        });
       
        // 13. BOŞ CSS KONTROLÜ
        const isEmptyCSS = cssCode.replace(/\s/g, '').length === 0;
        if (isEmptyCSS) {validationErrors.push(`CSS kodu boş`);}
       
        // 14. DUPLICATE PROPERTY KONTROLÜ (basit)
        const propertyRegex = /([a-zA-Z-]+)\s*:/g;
        const seenProperties = new Map();
        let currentBlockProps = new Set();
       
        lines.forEach((line, index) => {
            const lineNumber = index + 1;
            const trimmed = line.trim();
           
            if (trimmed.includes('{') && !trimmed.startsWith('@')) {
                currentBlockProps.clear();
            } else if (trimmed.includes('}')) {
                currentBlockProps.clear();
            } else if (trimmed.includes(':') && !trimmed.includes('{') && !trimmed.includes('}')) {
                const propMatch = trimmed.match(/^([a-zA-Z-]+)\s*:/);
                if (propMatch) {
                    const propName = propMatch[1].toLowerCase();
                    if (currentBlockProps.has(propName)) {
                        warnings.push(`${lineNumber}. satır: Yinelenen özellik "${propName}"`);
                    }
                    currentBlockProps.add(propName);
                }
            }
        });
       
        // SONUÇLARI OLUŞTUR VE DÖNDÜR
        const metrics = [];
       
        if (validationErrors.length > 0 || warnings.length > 0) {
            if (validationErrors.length > 0) {
                metrics.push({
                    id: 'css-error',
                    value: `${validationErrors.length} adet`,
                    title: 'CSS hataları',
                    description: `CSS doğrulama tamamlandı, hatalar acilen düzeltilmelidir!`,
                    status: 'bad',
                    problematicCodes: validationErrors.map(error => `<div class="code-icon">🚫</div><div class="code-text">${error}</div>`),
                    category: 'performance'
                });
            }
           
            if (warnings.length > 0) {
                metrics.push({
                    id: 'css-warning',
                    value: `${warnings.length} adet`,
                    title: 'Uyarılar',
                    description: `CSS doğrulama tamamlandı, bu uyarıları gözden geçirin!`,
                    status: 'medium',
                    problematicCodes: warnings.map(warning => `<div class="code-icon">⚠️</div><div class="code-text">${warning}</div>`),
                    category: 'performance'
                });
            }
        }
        // KONSOLA DETAYLI BİLGİ
        // console.log("=== CSS DOĞRULAMA DETAYLARI ===");
        // console.log("Toplam satır:", lines.length);
        // console.log("Tanımlanan özel değişkenler:", Array.from(definedCustomProperties));
        // console.log("Kullanılan özel değişkenler:", Array.from(usedCustomProperties));
        // console.log("Tanımlanmamış değişkenler:", Array.from(undefinedProperties));
        // console.log("Kullanılmayan değişkenler:", Array.from(unusedCustomProperties));
        // console.log("Hatalar:", validationErrors.length);
        // console.log("Uyarılar:", warnings.length);
        // console.log("=== CSS DOĞRULAMA BİTTİ ===");
        return metrics;
    } catch (error) {
        console.error('Doğrulama hatası:', error);
        console.error('Stack trace:', error.stack);
        AlertBox('Doğrulama sırasında bir hata oluştu: ' + error.message, 'error');
    }
}

// CSS hatalarını render eden fonksiyon
function renderCSSError(cssString, category = 'all') {
    if (!cssString || cssString.trim() === '') { return '';}
    const cssValidationResults = validateCSS(cssString);
    return cssValidationResults;
}

window.reportCSS = reportCSS;
window.validateCSS = validateCSS;