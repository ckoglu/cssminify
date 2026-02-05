// main.js
"use strict";
(self.webpackChunkmirror = self.webpackChunkmirror || []).push([
    [792], {
        237(t, a, o) {
            var e = o(723),
                s = o(898),
                n = o(730),
                r = o(404),
                c = o(421),
                m = o(874),
                i = o(720);

            // Token tanımlamaları
            const p = m.cr.define([
                { tag: i._A.keyword, class: "tok-keyword" }, 
                { tag: i._A.propertyName, class: "tok-propertyName" },
                { tag: i._A.className, class: "tok-className" },
                { tag: i._A.number, class: "tok-number" },
                { tag: i._A.string, class: "tok-string" },
                { tag: i._A.comment, class: "tok-comment" },
                { tag: i._A.punctuation, class: "tok-punctuation" },
                { tag: i._A.operator, class: "tok-operator" },
                { tag: i._A.atom, class: "tok-atom" },
                { tag: i._A.meta, class: "tok-meta" },
                { tag: i._A.definition(i._A.propertyName), class: "tok-propertyName" }
            ]);

            // Editor oluştur
            const editor = new s.Lz({
                doc: "",
                extensions: [e.oQ, (0, n.AH)(), (0, r.yU)(), c.Ei, (0, m.y9)(p)],
                parent: document.getElementById("container")
            });
            
            window.editor = editor;
        }
    },
    t => { t.O(0, [96], () => t(t.s = 237)), t.O() }
]);