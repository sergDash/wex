/*!
 * wex-code: подсветка кода в стиле Torchlight для Wex 3 / Quas.
 * Без зависимостей и без jQuery. Языки: php, js, html, css, json, blade.
 * CSS встроен и вставляется в <head> сам (отключить: install(Wex, { css: false })).
 *
 * Аннотации (в комментарии в конце строки или отдельной строкой):
 *   // [tl! highlight]   подсветить строку            (hl)
 *   // [tl! ++]           строка добавлена (diff)
 *   // [tl! --]           строка удалена (diff)
 *   // [tl! focus]        сфокусировать, остальное тускнеет
 *   // [tl! fold]         свернуть тело блока { ... }, начатого на этой строке
 *   // [tl! collapse:5]   свернуть 5 строк, идущих ниже
 *   // [tl! highlight:3]  диапазон: эта строка и ещё 2 (если аннотация одна на строке, то 3 строки ниже)
 *   Можно несколько флагов: // [tl! ++ focus]
 *   Допустимые комментарии: двойной слэш, решётка, слэш-звёздочка, html-комментарий, blade-комментарий
 */

// ───────────── 1. Токенайзер: автомат со стеком состояний ─────────────
const r = (t, re, o) => Object.assign({ t, re: new RegExp(re.source, 'y' + re.flags) }, o);
const rg = (g, re, o) => Object.assign({ g, re: new RegExp(re.source, 'y' + re.flags) }, o);
const WS = r('text', /\s+/);
const notAfter = (...a) => (l) => !(l && a.includes(l.s));
const after = (...a) => (l) => !!l && a.includes(l.s);
const noWordBefore = (l, src, pos) => !/[\w.]/.test(src[pos - 1] || '');
const G = {};

const IDENT = '[A-Za-z_$][\\w$]*';
const JS_KW = 'as async await break case catch class const continue debugger default delete do else export extends finally for from function if import in instanceof let new of return static switch throw try typeof var void while with yield';
const PHP_KW = 'abstract and array as break callable case catch class clone const continue declare default do echo else elseif empty enddeclare endfor endforeach endif endswitch endwhile enum extends final finally fn for foreach function global goto if implements include include_once instanceof insteadof interface isset list match namespace new or print private protected public readonly require require_once return static switch throw trait try unset use var while xor yield';
const BLADE_KW = 'if|elseif|else|endif|foreach|endforeach|forelse|endforelse|for|endfor|while|endwhile|unless|endunless|isset|endisset|empty|endempty|auth|endauth|guest|endguest|can|cannot|canany|endcan|endcannot|endcanany|error|enderror|switch|case|default|break|continue|endswitch|php|endphp|json|class|style|checked|selected|disabled|readonly|required|csrf|method|include|includeIf|includeWhen|includeUnless|includeFirst|each|extends|section|endsection|yield|parent|show|stop|append|overwrite|push|pushOnce|endpush|endPushOnce|prepend|endprepend|stack|once|endonce|props|aware|use|inject|vite|env|endenv|production|endproduction|lang|endlang|component|endcomponent|slot|endslot|livewire|fragment|endfragment|dd|dump|hasSection|sectionMissing|verbatim|endverbatim|session|endsession|context|endcontext|pushIf|teleport';

// ── JS ──
const jsMember = notAfter('.', '?.');
const jsRegexOK = (l) =>
    !l || l.t === 'o' ||
    (l.t === 'p' && /[({[,;:]$/.test(l.s)) ||
    (l.t === 'k' && /^(return|typeof|case|in|of|delete|void|throw|new|else|do|yield|await)$/.test(l.s));
const jsRules = [
    WS,
    r('cm', /\/\/[^\n]*/), r('cm', /\/\*[\s\S]*?(?:\*\/|$)/),
    r('s', /'(?:\\.|[^'\\\n])*'?/), r('s', /"(?:\\.|[^"\\\n])*"?/),
    r('s', /`/, { push: 'tpl' }),
    r('s', /\/(?![*/])(?:\\.|\[(?:\\.|[^\]\\\n])*\]|[^/\\\n[])+\/[a-z]*/, { when: jsRegexOK }),
    r('n', /0[xX][\da-fA-F_]+n?|0[bB][01_]+n?|0[oO][0-7_]+n?|(?:\d[\d_]*\.?[\d_]*|\.\d[\d_]*)(?:[eE][+-]?\d+)?n?/),
    r('k', new RegExp('\\b(?:' + JS_KW.split(' ').join('|') + ')\\b'), { when: jsMember }),
    r('c', /\b(?:true|false|null|undefined|NaN|Infinity|this|super)\b/, { when: jsMember }),
    r('cl', /[A-Z][\w$]*/),
    r('f', new RegExp(IDENT + '(?=\\s*\\()')),
    r('pr', new RegExp(IDENT + '(?=\\s*:)'), { when: (l) => !!l && l.t === 'p' && /[{,]$/.test(l.s) }),
    r('text', new RegExp(IDENT)),
    r('o', /\.\.\.|\?\.(?!\d)|=>|[+\-*/%=<>!&|^~?:]+/),
    r('p', /[{}()[\];,.]/),
];
G.js = jsRules;
G.tpl = [
    r('s', /`/, { pop: true }),
    r('e', /\\[\s\S]/),
    r('e', /\$\{/, { push: 'jsin' }),
    r('s', /[^`\\$]+|\$/),
];
// блок { ... } внутри ${} / {$} : закрывающая скобка интерполяции отличается от вложенной
const braced = (name, rules) => {
    G[name] = [r('p', /\{/, { push: name + 'N' }), r('e', /\}/, { pop: true }), ...rules];
    G[name + 'N'] = [r('p', /\{/, { push: name + 'N' }), r('p', /\}/, { pop: true }), ...rules];
};
braced('jsin', jsRules);

// ── JSON ──
G.json = [
    WS,
    r('cm', /\/\/[^\n]*/), r('cm', /\/\*[\s\S]*?(?:\*\/|$)/),
    r('pr', /"(?:\\.|[^"\\\n])*"(?=\s*:)/),
    r('s', /"(?:\\.|[^"\\\n])*"?/),
    r('n', /-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?/),
    r('c', /\b(?:true|false|null)\b/),
    r('p', /[{}[\],:]/),
];

// ── CSS (name: имя состояния, end: правило выхода для <style>) ──
function cssStates(name, end) {
    const blk = name + 'B';
    const e = end ? [end] : [];
    const common = [
        WS, r('cm', /\/\*[\s\S]*?(?:\*\/|$)/),
        r('s', /'(?:\\.|[^'\\\n])*'?/), r('s', /"(?:\\.|[^"\\\n])*"?/),
    ];
    G[name] = [
        ...e, ...common,
        r('k', /@[\w-]+/),
        r('p', /\{/, { push: blk }),
        r('sel', /[.#][\w-]+/),
        r('sel', /::?[\w-]+/),
        r('n', /-?(?:\d+\.?\d*|\.\d+)(?:%|[a-zA-Z]+)?/),
        r('tag', /[\w-]+/),
        r('p', /[>+~*,()[\]=;:|^$}]/),
    ];
    G[blk] = [
        ...e, ...common,
        r('p', /\}/, { pop: true }),
        r('p', /\{/, { push: blk }),
        r('pr', /(?:--|-?[A-Za-z_])[\w-]*(?=\s*:(?!:))/, { when: (l) => !l || (l.t === 'p' && /[{};]$/.test(l.s)) }),
        r('v', /--[\w-]+/),
        rg(['f', 'p', 's', 'p'], /(url)(\()((?!["'])[^)]*)(\))/),
        r('f', /[\w-]+(?=\()/),
        r('k', /!\s*important\b/),
        r('n', /#[\da-fA-F]{3,8}\b/),
        r('n', /[+-]?(?:\d+\.?\d*|\.\d+)(?:%|[a-zA-Z]+)?/),
        r('text', /-?[A-Za-z_][\w-]*/),
        r('o', /[+\-*/]/),
        r('p', /[:;,()[\]]/),
    ];
}
cssStates('css', null);

// ── PHP ──
const phpMember = notAfter('->', '?->', '::');
const phpCore = [
    WS,
    r('p', /#\[/), r('cm', /#[^\n]*/), r('cm', /\/\/[^\n]*/), r('cm', /\/\*[\s\S]*?(?:\*\/|$)/),
    r('s', /'(?:\\[\s\S]|[^'\\])*'?/),
    r('s', /<<<(["']?)(\w+)\1\r?\n[\s\S]*?\r?\n[ \t]*\2\b/),
    r('s', /"/, { push: 'phpdq' }),
    r('s', /`[^`]*`?/),
    r('c', /\$this\b/),
    r('v', /\$[A-Za-z_]\w*/),
    r('n', /0[xX][\da-fA-F_]+|0[bB][01_]+|(?:\d[\d_]*\.?[\d_]*|\.\d[\d_]*)(?:[eE][+-]?\d+)?/),
    r('k', /class\b/, { when: after('::') }),
    r('k', new RegExp('\\b(?:' + PHP_KW.split(' ').join('|') + ')\\b', 'i'), { when: phpMember }),
    r('c', /\b(?:true|false|null)\b/i, { when: phpMember }),
    r('c', /__[A-Z]+__/),
    r('c', /[A-Z][A-Z0-9_]*\b/, { when: after('::') }),
    r('cl', /\b(?:int|float|string|bool|void|mixed|never|object|iterable|callable|self|parent)\b(?!\s*\()/, { when: phpMember }),
    r('cl', /\\?[A-Za-z_]\w*(?:\\[A-Za-z_]\w*)+/),
    r('cl', /\\?[A-Z]\w*/),
    r('f', /[A-Za-z_]\w*(?=\s*\()/),
    r('pr', /[A-Za-z_]\w*/, { when: after('->', '?->') }),
    r('text', /[A-Za-z_]\w*/),
    r('o', /\?->|->|::|=>|\.\.\.|[+\-*/%=<>!&|^~?.:@]+/),
    r('p', /[{}()[\],;]/),
];
G.php = [
    r('k', /<\?(?:php\b|=)?/i),
    r('k', /\?>/, { pop: true, push: 'html' }),
    ...phpCore,
];
G.phpE = [r('k', /\?>/, { pop: true }), ...phpCore];
G.phpdq = [
    r('s', /"/, { pop: true }),
    r('e', /\\[\s\S]/),
    r('e', /\{(?=\$)/, { push: 'phpin' }),
    r('v', /\$[A-Za-z_]\w*/),
    r('s', /[^"\\$]+|\$/),
];
braced('phpin', phpCore);

// ── Blade ──
const bladeCore = [
    r('cm', /\{\{--[\s\S]*?(?:--\}\}|$)/),
    r('s', /@\{\{[\s\S]*?\}\}/),
    r('e', /\{!!/, { push: 'bladeRaw' }),
    r('e', /\{\{/, { push: 'bladeEcho' }),
];
const bladeKnown = [
    rg(['d', 'text', 'p'], new RegExp('(@(?:' + BLADE_KW + '))([ \\t]*)(\\()'), { push: 'bladeArgs' }),
    r('d', new RegExp('@(?:' + BLADE_KW + ')\\b')),
];
const bladeFull = [
    ...bladeCore,
    r('d', /@php\b(?!\s*\()/, { push: 'bladePhp', when: noWordBefore }),
    rg(['d', 'text', 'p'], /(@[A-Za-z_]\w*)([ \t]*)(\()/, { push: 'bladeArgs', when: noWordBefore }),
    r('d', /@[A-Za-z_]\w*/, { when: noWordBefore }),
];
G.bladeEcho = [r('e', /\}\}/, { pop: true }), ...phpCore];
G.bladeRaw = [r('e', /!!\}/, { pop: true }), ...phpCore];
G.bladePhp = [r('d', /@endphp\b/, { pop: true }), ...phpCore];
G.bladeArgs = [r('p', /\(/, { push: 'bladeArgs' }), r('p', /\)/, { pop: true }), ...phpCore];

// ── HTML / Blade (общий построитель) ──
G.mustache = [r('e', /\}\}/, { pop: true }), ...jsRules]; // {{ expr }} в шаблонах Wex
function markup(name, blade) {
    const bl = blade ? bladeCore : [];
    const dk = blade ? bladeKnown : [];
    const tag = name + 'Tag', tagS = name + 'TagS', tagY = name + 'TagY';
    const js = name + 'Js', css = name + 'Css';
    const tagRules = (next) => [
        WS, ...bl, ...dk,
        r('p', /\/?>/, next ? { pop: true, push: next } : { pop: true }),
        r('p', /=/), r('s', /"[^"]*"?/), r('s', /'[^']*'?/),
        r('at', /[^\s=>/"'{]+/),
    ];
    G[name] = [
        ...(blade ? bladeFull : [r('e', /\{\{/, { push: 'mustache' })]),
        r('cm', /<!--[\s\S]*?(?:-->|$)/),
        r('k', /<![A-Za-z][^>]*>/),
        r('k', /<\?(?:php\b|=)?/i, { push: 'phpE' }),
        rg(['p', 'tag'], /(<)(script)(?=[\s>/])/i, { push: tagS }),
        rg(['p', 'tag'], /(<)(style)(?=[\s>/])/i, { push: tagY }),
        rg(['p', 'tag'], /(<\/?)([A-Za-z][\w:.-]*)/, { push: tag }),
        r('e', /&[A-Za-z#]\w*;/),
        r('text', /[^<&{@]+/),
    ];
    G[tag] = tagRules(null);
    G[tagS] = tagRules(js);
    G[tagY] = tagRules(css);
    G[js] = [rg(['p', 'tag', 'p'], /(<\/)(script)(\s*>)/i, { pop: true }), ...bl, ...dk, ...jsRules];
    cssStates(css, rg(['p', 'tag', 'p'], /(<\/)(style)(\s*>)/i, { pop: true }));
}
markup('html', false);
markup('blade', true);

const LANG = {
    js: 'js', javascript: 'js', mjs: 'js', cjs: 'js', jsx: 'js', ts: 'js', typescript: 'js',
    json: 'json', jsonc: 'json', css: 'css',
    html: 'html', htm: 'html', xml: 'html', svg: 'html', vue: 'html', phtml: 'html',
    php: 'php', blade: 'blade', 'blade.php': 'blade',
};
const norm = (l) => String(l || '').toLowerCase().trim().replace(/^language-/, '');

function run(src, start) {
    const out = [];
    const stack = [start];
    let pos = 0, last = null;
    const emit = (t, s) => {
        if (!s) return;
        const p = out[out.length - 1];
        if (t === 'text' && p && p[0] === 'text') p[1] += s; else out.push([t, s]);
        if (t !== 'text' && t !== 'cm') last = { t, s };
    };
    while (pos < src.length) {
        const rules = G[stack[stack.length - 1]];
        let m = null, hit = null;
        for (const c of rules) {
            if (c.when && !c.when(last, src, pos)) continue;
            c.re.lastIndex = pos;
            const x = c.re.exec(src);
            if (x && x[0].length) { m = x; hit = c; break; }
        }
        if (!m) { emit('text', src[pos++]); continue; }
        pos += m[0].length;
        if (hit.g) hit.g.forEach((t, i) => emit(t, m[i + 1])); else emit(hit.t, m[0]);
        if (hit.pop) stack.pop();
        if (hit.push) stack.push(hit.push);
        if (!stack.length) stack.push(start);
    }
    return out;
}

/** [[тип, текст], ...] без потерь: склейка текстов равна исходнику. */
export function tokenize(src, lang) {
    const l = LANG[norm(lang)];
    return l ? run(String(src), l) : [['text', String(src)]];
}

// ───────────── 2. Аннотации [tl! ...] ─────────────
const ANN = /[ \t]*(?:\/\/|#|\/\*|<!--|\{\{--)[ \t]*\[tl!\s*([^\]]*?)\s*\][ \t]*(?:\*\/|-->|--\}\})?[ \t]*$/;
const FLAG = { highlight: 'hl', hl: 'hl', '++': 'add', add: 'add', '--': 'del', del: 'del', remove: 'del', focus: 'focus', fold: 'fold', collapse: 'collapse' };

function parseFlags(s) {
    const out = [];
    s.split(/\s+/).forEach((w) => {
        if (!w) return;
        const [a, b] = w.split(':');
        const k = FLAG[a];
        if (k) out.push({ k, n: b ? parseInt(b, 10) || 0 : 0 });
    });
    return out;
}

function prepare(code, dedent) {
    let lines = String(code).replace(/\r\n?/g, '\n').replace(/^\s*\n/, '').replace(/\s+$/, '').split('\n');
    if (dedent) {
        const ind = Math.min(...lines.filter((l) => l.trim()).map((l) => /^[ \t]*/.exec(l)[0].length));
        if (ind > 0 && ind < Infinity) lines = lines.map((l) => l.slice(ind));
    }
    const rows = [];
    let carry = [], hide = 0, pendingFold = false;
    for (const line of lines) {
        const m = ANN.exec(line);
        const text = m ? line.slice(0, m.index) : line;
        const alone = !!m && !text.trim();
        const row = { text, f: {}, hidden: false, fold: false };
        if (!alone) {
            carry = carry.filter((c) => { row.f[c.k] = true; return --c.left > 0; });
            if (hide > 0) { row.hidden = true; hide--; }
            if (pendingFold) { row.fold = true; pendingFold = false; }
        }
        for (const { k, n } of m ? parseFlags(m[1]) : []) {
            if (k === 'fold') { if (alone) pendingFold = true; else row.fold = true; }
            else if (k === 'collapse') hide += n || 1;
            else if (alone) carry.push({ k, left: n || 1 });
            else { row.f[k] = true; if (n > 1) carry.push({ k, left: n - 1 }); }
        }
        if (!alone) rows.push(row);
    }
    return rows;
}

function splitLines(toks, n) {
    const lines = [[]];
    for (const [t, s] of toks) {
        s.split('\n').forEach((p, i) => {
            if (i) lines.push([]);
            if (p) lines[lines.length - 1].push([t, p]);
        });
    }
    while (lines.length < n) lines.push([]);
    return lines;
}

// тело блока { ... }, начатого на строке i: [строка с «{», строка с парной «}»]
function foldRange(lines, i) {
    let depth = 0, open = -1;
    for (let j = i; j < lines.length; j++) {
        for (const [t, s] of lines[j]) {
            if (t !== 'p') continue;
            for (const ch of s) {
                if (ch === '{') { if (!depth) open = j; depth++; }
                else if (ch === '}' && depth && !--depth) return [open, j];
            }
        }
    }
    return null;
}

// ───────────── 3. Рендер ─────────────
const DEFAULTS = {
    numbers: false, copy: true, title: '', start: 1, dedent: true,
    copyLabel: 'Copy', copiedLabel: 'Copied', foldLabel: (n) => n + (n === 1 ? ' line' : ' lines'),
};
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const escA = (s) => esc(s).replace(/"/g, '&quot;');

function build(code, lang, opts) {
    const o = Object.assign({}, DEFAULTS, opts);
    const rows = prepare(code, o.dedent);
    const lines = splitLines(tokenize(rows.map((x) => x.text).join('\n'), lang), rows.length);
    rows.forEach((x, i) => {
        if (!x.fold) return;
        const fr = foldRange(lines, i);
        if (fr) for (let k = fr[0] + 1; k < fr[1]; k++) rows[k].hidden = true;
    });
    let focus = false;
    const lineHtml = (i) => {
        const cls = ['tl-line'];
        for (const k in rows[i].f) { cls.push('tl-' + k); if (k === 'focus') focus = true; }
        const body = lines[i].map(([t, s]) => (t === 'text' ? esc(s) : '<span class="tl-' + t + '">' + esc(s) + '</span>')).join('');
        return '<span class="' + cls.join(' ') + '" data-n="' + (o.start + i) + '">' + body + '</span>';
    };
    let html = '';
    for (let i = 0; i < rows.length;) {
        if (!rows[i].hidden) { html += lineHtml(i++); continue; }
        let j = i, inner = '';
        while (j < rows.length && rows[j].hidden) inner += lineHtml(j++);
        html += '<span class="tl-fold"><button type="button" class="tl-fold-btn" aria-expanded="false">' +
            '<span class="tl-fold-lb">' + esc(o.foldLabel(j - i)) + '</span></button><span class="tl-fold-body">' + inner + '</span></span>';
        i = j;
    }
    const head = o.title || o.copy
        ? '<span class="tl-head' + (o.title ? '' : ' tl-bare') + '"><span class="tl-title">' + esc(o.title) + '</span>' +
        (o.copy ? '<button type="button" class="tl-copy" data-copied="' + escA(o.copiedLabel) + '">' + esc(o.copyLabel) + '</button>' : '') + '</span>'
        : '';
    return {
        cls: 'tl' + (o.numbers ? ' tl-nums' : '') + (focus ? ' tl-has-focus' : ''),
        inner: head + '<code class="tl-code">' + html + '</code>',
    };
}

/** Строка с готовым <pre class="tl">…</pre>. */
export function highlight(code, lang, opts) {
    const b = build(code, lang, opts);
    bind(); // делегирование кликов fold/copy ставится один раз
    return '<pre class="' + b.cls + '" data-lang="' + escA(norm(lang)) + '">' + b.inner + '</pre>';
}

// ───────────── 4a. CSS (встроен, подключается автоматически) ─────────────

export const css = String.raw`/* Darcula — IntelliJ IDEA color scheme */

:root {
    --tl-bg: #2b2b2b;
    --tl-fg: #a9b7c6;
    --tl-border: #454545;
    --tl-muted: #808080;
    --tl-gutter: #606366;

    --tl-hl: rgba(255, 255, 255, .055);
    --tl-accent: #cc7832;

    --tl-add: rgba(98, 150, 85, .15);
    --tl-add-fg: #629755;
    --tl-del: rgba(204, 78, 78, .15);
    --tl-del-fg: #cc5555;

    /* Syntax highlighting */
    --tl-k: #cc7832;       /* Keywords */
    --tl-c: #9876aa;       /* Constants */
    --tl-s: #6a8759;       /* Strings */
    --tl-n: #6897bb;       /* Numbers */
    --tl-cm: #808080;      /* Comments */

    --tl-f: #ffc66d;       /* Functions */
    --tl-cl: #a9b7c6;      /* Classes */
    --tl-v: #9876aa;       /* Variables */
    --tl-o: #a9b7c6;       /* Operators */
    --tl-p: #a9b7c6;       /* Punctuation */

    --tl-tag: #e8bf6a;     /* HTML tags */
    --tl-at: #bababa;      /* Attributes */
    --tl-pr: #a9b7c6;      /* Properties */
    --tl-d: #cc7832;       /* Decorators */
    --tl-e: #cc7832;       /* Exceptions */
    --tl-sel: #629755;     /* Selected */
}

.dark, :root.dark, [data-theme="dark"] {
    --tl-bg: #2b2b2b;
    --tl-fg: #a9b7c6;
    --tl-border: #454545;
    --tl-muted: #808080;
    --tl-gutter: #606366;

    --tl-hl: rgba(255, 255, 255, .055);
    --tl-accent: #cc7832;

    --tl-add: rgba(98, 150, 85, .15);
    --tl-add-fg: #629755;
    --tl-del: rgba(204, 78, 78, .15);
    --tl-del-fg: #cc5555;

    --tl-k: #cc7832;
    --tl-c: #9876aa;
    --tl-s: #6a8759;
    --tl-n: #6897bb;
    --tl-cm: #808080;

    --tl-f: #ffc66d;
    --tl-cl: #a9b7c6;
    --tl-v: #9876aa;
    --tl-o: #a9b7c6;
    --tl-p: #a9b7c6;

    --tl-tag: #e8bf6a;
    --tl-at: #bababa;
    --tl-pr: #a9b7c6;
    --tl-d: #cc7832;
    --tl-e: #cc7832;
    --tl-sel: #629755;
}

@media (prefers-color-scheme: dark) {
    :root:not(.light):not([data-theme]) {
        --tl-bg: #2b2b2b;
        --tl-fg: #a9b7c6;
        --tl-border: #454545;
        --tl-muted: #808080;
        --tl-gutter: #606366;

        --tl-hl: rgba(255, 255, 255, .055);
        --tl-accent: #cc7832;

        --tl-add: rgba(98, 150, 85, .15);
        --tl-add-fg: #629755;
        --tl-del: rgba(204, 78, 78, .15);
        --tl-del-fg: #cc5555;

        --tl-k: #cc7832;
        --tl-c: #9876aa;
        --tl-s: #6a8759;
        --tl-n: #6897bb;
        --tl-cm: #808080;

        --tl-f: #ffc66d;
        --tl-cl: #a9b7c6;
        --tl-v: #9876aa;
        --tl-o: #a9b7c6;
        --tl-p: #a9b7c6;

        --tl-tag: #e8bf6a;
        --tl-at: #bababa;
        --tl-pr: #a9b7c6;
        --tl-d: #cc7832;
        --tl-e: #cc7832;
        --tl-sel: #629755;
    }
}

/* Container */
.tl {
    --tl-mark: .6rem;
    position: relative;
    margin: 1rem 0;
    padding: 0;
    background: var(--tl-bg);
    color: var(--tl-fg);
    border: 1px solid var(--tl-border);
    border-radius: .5rem;
    font: 13.5px/1.65 ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace;
    white-space: pre;
    tab-size: 4;
    overflow-x: auto;
    -webkit-text-size-adjust: 100%;
    -webkit-overflow-scrolling: touch;
}

.tl-nums { --tl-mark: 3.1rem; }

.tl-code {
    display: block;
    min-width: max-content;
    padding: .8rem 0;
    font: inherit;
    background: none;
    color: inherit;
}

/* Header */
.tl-head {
    position: sticky;
    left: 0;
    z-index: 2;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: .4rem .6rem .4rem .9rem;
    border-bottom: 1px solid var(--tl-border);
    color: var(--tl-muted);
    font-size: .92em;
}

.tl-bare {
    height: 0;
    padding: 0;
    border: 0;
    justify-content: flex-end;
}

.tl-bare .tl-copy { margin: .45rem .5rem 0 0; }

.tl-copy {
    appearance: none;
    -webkit-appearance: none;
    font: inherit;
    color: var(--tl-muted);
    cursor: pointer;
    background: #313335;
    border: 1px solid var(--tl-border);
    border-radius: .3rem;
    padding: .1rem .55rem;
}

.tl-copy:hover {
    color: #ffc66d;
    border-color: #cc7832;
}

.tl-copy:focus-visible,
.tl-fold-btn:focus-visible {
    outline: 2px solid var(--tl-accent);
    outline-offset: -2px;
}

.tl-bare .tl-copy {
    opacity: 0;
    transition: opacity .15s;
}

.tl:hover .tl-bare .tl-copy,
.tl-bare .tl-copy:focus-visible { opacity: 1; }

@media (hover: none) {
    .tl-bare .tl-copy { opacity: 1; }
}

/* Lines */
.tl-line {
    display: block;
    position: relative;
    min-height: 1.65em;
    padding: 0 1.25rem 0 1.75rem;
}

.tl-nums .tl-line { padding-left: 4.4rem; }

.tl-nums .tl-line::before {
    content: attr(data-n);
    position: absolute;
    left: 0;
    width: 2.6rem;
    text-align: right;
    color: var(--tl-gutter);
    -webkit-user-select: none;
    user-select: none;
}

.tl-hl {
    background: var(--tl-hl);
    box-shadow: inset 2px 0 0 var(--tl-accent);
}

.tl-add { background: var(--tl-add); }
.tl-del { background: var(--tl-del); }

.tl-add::after,
.tl-del::after {
    position: absolute;
    left: var(--tl-mark);
    -webkit-user-select: none;
    user-select: none;
}

.tl-add::after {
    content: "+";
    color: var(--tl-add-fg);
}

.tl-del::after {
    content: "\2212";
    color: var(--tl-del-fg);
}

/* Focus */
.tl-has-focus .tl-line:not(.tl-focus) {
    opacity: .42;
    transition: opacity .2s;
}

.tl-has-focus:hover .tl-line { opacity: 1; }

/* Fold */
.tl-fold { display: block; }

.tl-fold:not(.tl-open) > .tl-fold-body {
    display: none;
}

.tl-fold-btn {
    appearance: none;
    -webkit-appearance: none;
    display: block;
    width: 100%;
    text-align: left;
    cursor: pointer;
    font: inherit;
    color: var(--tl-muted);
    background: none;
    border: 0;
    min-height: 1.65em;
    padding: 0 1.25rem 0 1.75rem;
}

.tl-nums .tl-fold-btn { padding-left: 4.4rem; }

.tl-fold-btn:hover {
    background: var(--tl-hl);
    color: var(--tl-fg);
}

.tl-fold-btn::before {
    content: "\25B8";
    display: inline-block;
    width: 1.3em;
    transition: transform .15s;
}

.tl-open > .tl-fold-btn::before {
    transform: rotate(90deg);
}

@media (prefers-reduced-motion: reduce) {
    .tl-fold-btn::before,
    .tl-has-focus .tl-line {
        transition: none;
    }
}

/* Tokens */
.tl-k  { color: var(--tl-k); }
.tl-c  { color: var(--tl-c); }
.tl-s  { color: var(--tl-s); }
.tl-n  { color: var(--tl-n); }
.tl-cm { color: var(--tl-cm); font-style: italic; }
.tl-f  { color: var(--tl-f); }
.tl-cl { color: var(--tl-cl); }
.tl-v  { color: var(--tl-v); }
.tl-o  { color: var(--tl-o); }
.tl-p  { color: var(--tl-p); }
.tl-tag { color: var(--tl-tag); }
.tl-at { color: var(--tl-at); }
.tl-pr { color: var(--tl-pr); }
.tl-d  { color: var(--tl-d); font-weight: 600; }
.tl-e  { color: var(--tl-e); }
.tl-sel { color: var(--tl-sel); }
`;

let cssOn = true;
function injectCss() {
    if (!cssOn || typeof document === 'undefined' || document.getElementById('wex-code-css')) return;
    const st = document.createElement('style');
    st.id = 'wex-code-css';
    st.textContent = css;
    // в начало <head>, чтобы свои стили проекта (Quas) могли переопределять переменные и правила
    document.head.insertBefore(st, document.head.firstChild);
}

// ───────────── 4. DOM ─────────────
let bound = false;
function bind() {
    if (bound || typeof document === 'undefined') return;
    bound = true;
    injectCss();
    document.addEventListener('click', (e) => {
        const el = e.target && e.target.closest && e.target.closest('.tl-fold-btn, .tl-copy');
        if (!el) return;
        if (el.classList.contains('tl-fold-btn')) {
            const open = el.parentNode.classList.toggle('tl-open');
            el.setAttribute('aria-expanded', String(open));
            return;
        }
        const pre = el.closest('.tl');
        const text = Array.prototype.filter.call(pre.querySelectorAll('.tl-line'), (l) => !l.classList.contains('tl-del'))
            .map((l) => l.textContent).join('\n'); // удалённые (--) строки не копируем
        const done = () => {
            const old = el.textContent;
            el.textContent = el.getAttribute('data-copied') || 'Copied';
            setTimeout(() => { el.textContent = old; }, 1500);
        };
        const fallback = () => {
            const ta = document.createElement('textarea');
            ta.value = text; ta.style.cssText = 'position:fixed;opacity:0';
            document.body.appendChild(ta); ta.select();
            try { document.execCommand('copy'); done(); } catch (_) { /* нет доступа к буферу */ }
            document.body.removeChild(ta);
        };
        if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(done, fallback);
        else fallback();
    });
}

/** Подсветить <pre> (или <pre><code>) на месте: элемент не заменяется, поэтому безопасно для Wex. */
export function highlightElement(el, o) {
    o = o || {};
    if (el.tagName === 'CODE' && el.parentNode && el.parentNode.tagName === 'PRE') el = el.parentNode;
    if (el._tlLang == null) {
        const c = el.querySelector && el.querySelector('code[class*="language-"]');
        const m = c && /language-([\w.-]+)/.exec(c.className);
        el._tlLang = el.getAttribute('data-lang') || el.getAttribute('lang') || (m && m[1]) || '';
    }
    if (o.code == null && el._tlSrc == null) el._tlSrc = el.textContent;
    const code = o.code != null ? o.code : el._tlSrc;
    const lang = o.lang || el._tlLang;
    const d = (k) => el.getAttribute('data-' + k);
    const opts = Object.assign({}, o);
    if (opts.numbers == null && d('numbers') != null) opts.numbers = d('numbers') !== 'false';
    if (opts.title == null && d('title') != null) opts.title = d('title');
    if (opts.copy == null && d('copy') != null) opts.copy = d('copy') !== 'false';
    if (opts.start == null && d('start') != null) opts.start = parseInt(d('start'), 10) || 1;
    const b = build(code, lang, opts);
    el.classList.remove('tl-nums', 'tl-has-focus');
    b.cls.split(' ').forEach((c) => el.classList.add(c));
    el.setAttribute('data-lang', norm(lang));
    el.innerHTML = b.inner;
    bind();
    return el;
}

/** Без Wex: подсветить все pre[data-lang], pre[lang] и pre > code.language-*. */
export function highlightAll(root) {
    const scope = root || document;
    const seen = [];
    scope.querySelectorAll('pre[data-lang], pre[lang], pre > code[class*="language-"]').forEach((n) => {
        const pre = n.tagName === 'CODE' ? n.parentNode : n;
        if (seen.indexOf(pre) < 0 && !pre.classList.contains('tl')) { seen.push(pre); highlightElement(pre); }
    });
}

// ───────────── 5. Плагин Wex ─────────────
/**
 * Регистрирует директиву-атрибут w-code (имя = точное имя атрибута, как в доке Wex 3).
 * Вызывать ДО создания view: WexCode.install(Wex, { css: false, name: 'w-code', defaults: { numbers: true } })
 *   <pre w-code="'php'">…</pre>
 *   <pre w-code="{ lang: 'blade', code: snippet, title: 'x.blade.php', numbers: true }"></pre>
 * Значение атрибута Wex не интерполирует; выражение считается через this.scope.parse (ScopeX).
 */
export function install(Wex, settings) {
    const s = settings || {};
    Object.assign(DEFAULTS, s.defaults || {});
    if (s.css === false) cssOn = false; // свой CSS: { css: false }
    const W = Wex || (typeof window !== 'undefined' ? window.Wex : null);
    if (!W || typeof W.directive !== 'function') throw new Error('wex-code: Wex.directive не найден');
    const name = s.name || 'w-code';
    const render = function ($el, attrs) {
        const el = $el && $el[0] ? $el[0] : $el; // мини-$ или голый элемент
        let v;
        try {
            if (attrs && typeof attrs.get === 'function') v = attrs.get();
            else if (this && this.scope && attrs && attrs[name]) v = this.scope.parse(attrs[name]);
        } catch (e) {
            if (typeof console !== 'undefined') console.warn('wex-code: ошибка в выражении ' + name, e);
        }
        const o = typeof v === 'string' ? { lang: v } : v || {};
        // updated бежит на любое изменение state view: не перерисовываем без причины
        const sig = [o.lang, o.title, o.numbers, o.start, o.copy, o.code].join('\u0001');
        if (el._tlSig === sig && el.classList.contains('tl')) return;
        el._tlSig = sig;
        highlightElement(el, o);
    };
    W.directive(name, { mounted: render, updated: render });
}

const api = { install, highlight, highlightElement, highlightAll, tokenize, css, defaults: DEFAULTS };
if (typeof window !== 'undefined') window.WexCode = api;
export default api;