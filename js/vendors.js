"use strict";
(self.webpackChunkmirror = self.webpackChunkmirror || []).push([
    [96], {
        365(t, e, i) {
            i.d(e, {
                PH: () => p,
                Qj: () => f,
                RY: () => R,
                Z6: () => h,
                cF: () => s,
                fI: () => c,
                iX: () => B,
                rr: () => E,
                uY: () => o
            });
            const s = 1024;
            let n = 0;
            class r {
                constructor(t, e) {
                    this.from = t, this.to = e
                }
            }
            class o {
                constructor(t = {}) {
                    this.id = n++, this.perNode = !!t.perNode, this.deserialize = t.deserialize || (() => {
                        throw new Error("This node type doesn't define a deserialize function")
                    }), this.combine = t.combine || null
                }
                add(t) {
                    if (this.perNode) throw new RangeError("Can't add per-node props to node types");
                    return "function" != typeof t && (t = h.match(t)), e => {
                        let i = t(e);
                        return void 0 === i ? null : [this, i]
                    }
                }
            }
            o.closedBy = new o({
                deserialize: t => t.split(" ")
            }), o.openedBy = new o({
                deserialize: t => t.split(" ")
            }), o.group = new o({
                deserialize: t => t.split(" ")
            }), o.isolate = new o({
                deserialize: t => {
                    if (t && "rtl" != t && "ltr" != t && "auto" != t) throw new RangeError("Invalid value for isolate: " + t);
                    return t || "auto"
                }
            }), o.contextHash = new o({
                perNode: !0
            }), o.lookAhead = new o({
                perNode: !0
            }), o.mounted = new o({
                perNode: !0
            });
            class l {
                constructor(t, e, i, s = !1) {
                    this.tree = t, this.overlay = e, this.parser = i, this.bracketed = s
                }
                static get(t) {
                    return t && t.props && t.props[o.mounted.id]
                }
            }
            const a = Object.create(null);
            class h {
                constructor(t, e, i, s = 0) {
                    this.name = t, this.props = e, this.id = i, this.flags = s
                }
                static define(t) {
                    let e = t.props && t.props.length ? Object.create(null) : a,
                        i = (t.top ? 1 : 0) | (t.skipped ? 2 : 0) | (t.error ? 4 : 0) | (null == t.name ? 8 : 0),
                        s = new h(t.name || "", e, t.id, i);
                    if (t.props)
                        for (let i of t.props)
                            if (Array.isArray(i) || (i = i(s)), i) {
                                if (i[0].perNode) throw new RangeError("Can't store a per-node prop on a node type");
                                e[i[0].id] = i[1]
                            } return s
                }
                prop(t) {
                    return this.props[t.id]
                }
                get isTop() {
                    return (1 & this.flags) > 0
                }
                get isSkipped() {
                    return (2 & this.flags) > 0
                }
                get isError() {
                    return (4 & this.flags) > 0
                }
                get isAnonymous() {
                    return (8 & this.flags) > 0
                }
                is(t) {
                    if ("string" == typeof t) {
                        if (this.name == t) return !0;
                        let e = this.prop(o.group);
                        return !!e && e.indexOf(t) > -1
                    }
                    return this.id == t
                }
                static match(t) {
                    let e = Object.create(null);
                    for (let i in t)
                        for (let s of i.split(" ")) e[s] = t[i];
                    return t => {
                        for (let i = t.prop(o.group), s = -1; s < (i ? i.length : 0); s++) {
                            let n = e[s < 0 ? t.name : i[s]];
                            if (n) return n
                        }
                    }
                }
            }
            h.none = new h("", Object.create(null), 0, 8);
            class c {
                constructor(t) {
                    this.types = t;
                    for (let e = 0; e < t.length; e++)
                        if (t[e].id != e) throw new RangeError("Node type ids should correspond to array positions when creating a node set")
                }
                extend(...t) {
                    let e = [];
                    for (let i of this.types) {
                        let s = null;
                        for (let e of t) {
                            let t = e(i);
                            if (t) {
                                s || (s = Object.assign({}, i.props));
                                let e = t[1],
                                    n = t[0];
                                n.combine && n.id in s && (e = n.combine(s[n.id], e)), s[n.id] = e
                            }
                        }
                        e.push(s ? new h(i.name, s, i.id, i.flags) : i)
                    }
                    return new c(e)
                }
            }
            const u = new WeakMap,
                d = new WeakMap;
            var f;
            ! function(t) {
                t[t.ExcludeBuffers = 1] = "ExcludeBuffers", t[t.IncludeAnonymous = 2] = "IncludeAnonymous", t[t.IgnoreMounts = 4] = "IgnoreMounts", t[t.IgnoreOverlays = 8] = "IgnoreOverlays", t[t.EnterBracketed = 16] = "EnterBracketed"
            }(f || (f = {}));
            class p {
                constructor(t, e, i, s, n) {
                    if (this.type = t, this.children = e, this.positions = i, this.length = s, this.props = null, n && n.length) {
                        this.props = Object.create(null);
                        for (let [t, e] of n) this.props["number" == typeof t ? t : t.id] = e
                    }
                }
                toString() {
                    let t = l.get(this);
                    if (t && !t.overlay) return t.tree.toString();
                    let e = "";
                    for (let t of this.children) {
                        let i = t.toString();
                        i && (e && (e += ","), e += i)
                    }
                    return this.type.name ? (/\W/.test(this.type.name) && !this.type.isError ? JSON.stringify(this.type.name) : this.type.name) + (e.length ? "(" + e + ")" : "") : e
                }
                cursor(t = 0) {
                    return new M(this.topNode, t)
                }
                cursorAt(t, e = 0, i = 0) {
                    let s = u.get(this) || this.topNode,
                        n = new M(s);
                    return n.moveTo(t, e), u.set(this, n._tree), n
                }
                get topNode() {
                    return new y(this, 0, 0, null)
                }
                resolve(t, e = 0) {
                    let i = b(u.get(this) || this.topNode, t, e, !1);
                    return u.set(this, i), i
                }
                resolveInner(t, e = 0) {
                    let i = b(d.get(this) || this.topNode, t, e, !0);
                    return d.set(this, i), i
                }
                resolveStack(t, e = 0) {
                    return function(t, e, i) {
                        let s = t.resolveInner(e, i),
                            n = null;
                        for (let t = s instanceof y ? s : s.context.parent; t; t = t.parent)
                            if (t.index < 0) {
                                let r = t.parent;
                                (n || (n = [s])).push(r.resolve(e, i)), t = r
                            } else {
                                let r = l.get(t.tree);
                                if (r && r.overlay && r.overlay[0].from <= e && r.overlay[r.overlay.length - 1].to >= e) {
                                    let o = new y(r.tree, r.overlay[0].from + t.from, -1, t);
                                    (n || (n = [s])).push(b(o, e, i, !1))
                                }
                            } return n ? C(n) : s
                    }(this, t, e)
                }
                iterate(t) {
                    let {
                        enter: e,
                        leave: i,
                        from: s = 0,
                        to: n = this.length
                    } = t, r = t.mode || 0, o = (r & f.IncludeAnonymous) > 0;
                    for (let t = this.cursor(r | f.IncludeAnonymous);;) {
                        let r = !1;
                        if (t.from <= n && t.to >= s && (!o && t.type.isAnonymous || !1 !== e(t))) {
                            if (t.firstChild()) continue;
                            r = !0
                        }
                        for (; r && i && (o || !t.type.isAnonymous) && i(t), !t.nextSibling();) {
                            if (!t.parent()) return;
                            r = !0
                        }
                    }
                }
                prop(t) {
                    return t.perNode ? this.props ? this.props[t.id] : void 0 : this.type.prop(t)
                }
                get propValues() {
                    let t = [];
                    if (this.props)
                        for (let e in this.props) t.push([+e, this.props[e]]);
                    return t
                }
                balance(t = {}) {
                    return this.children.length <= 8 ? this : D(h.none, this.children, this.positions, 0, this.children.length, 0, this.length, (t, e, i) => new p(this.type, t, e, i, this.propValues), t.makeTree || ((t, e, i) => new p(h.none, t, e, i)))
                }
                static build(t) {
                    return function(t) {
                        var e;
                        let {
                            buffer: i,
                            nodeSet: n,
                            maxBufferLength: r = s,
                            reused: l = [],
                            minRepeatType: a = n.types.length
                        } = t, h = Array.isArray(i) ? new m(i, i.length) : i, c = n.types, u = 0, d = 0;

                        function f(t, e, i, s, m, O) {
                            let {
                                id: x,
                                start: k,
                                end: S,
                                size: C
                            } = h, A = d, M = u;
                            if (C < 0) {
                                if (h.next(), -1 == C) {
                                    let e = l[x];
                                    return i.push(e), void s.push(k - t)
                                }
                                if (-3 == C) return void(u = x);
                                if (-4 == C) return void(d = x);
                                throw new RangeError(`Unrecognized record size: ${C}`)
                            }
                            let Q, T, P = c[x],
                                R = k - t;
                            if (S - k <= r && (T = function(t, e) {
                                    let i = h.fork(),
                                        s = 0,
                                        n = 0,
                                        o = 0,
                                        l = i.end - r,
                                        c = {
                                            size: 0,
                                            start: 0,
                                            skip: 0
                                        };
                                    t: for (let r = i.pos - t; i.pos > r;) {
                                        let t = i.size;
                                        if (i.id == e && t >= 0) {
                                            c.size = s, c.start = n, c.skip = o, o += 4, s += 4, i.next();
                                            continue
                                        }
                                        let h = i.pos - t;
                                        if (t < 0 || h < r || i.start < l) break;
                                        let u = i.id >= a ? 4 : 0,
                                            d = i.start;
                                        for (i.next(); i.pos > h;) {
                                            if (i.size < 0) {
                                                if (-3 != i.size && -4 != i.size) break t;
                                                u += 4
                                            } else i.id >= a && (u += 4);
                                            i.next()
                                        }
                                        n = d, s += t, o += u
                                    }
                                    return (e < 0 || s == t) && (c.size = s, c.start = n, c.skip = o), c.size > 4 ? c : void 0
                                }(h.pos - e, m))) {
                                let e = new Uint16Array(T.size - T.skip),
                                    i = h.pos - T.size,
                                    s = e.length;
                                for (; h.pos > i;) s = y(T.start, e, s);
                                Q = new g(e, S - T.start, n), R = T.start - t
                            } else {
                                let t = h.pos - C;
                                h.next();
                                let e = [],
                                    i = [],
                                    s = x >= a ? x : -1,
                                    n = 0,
                                    l = S;
                                for (; h.pos > t;) s >= 0 && h.id == s && h.size >= 0 ? (h.end <= l - r && (b(e, i, k, n, h.end, l, s, A, M), n = e.length, l = h.end), h.next()) : O > 2500 ? v(k, t, e, i) : f(k, t, e, i, s, O + 1);
                                if (s >= 0 && n > 0 && n < e.length && b(e, i, k, n, k, l, s, A, M), e.reverse(), i.reverse(), s > -1 && n > 0) {
                                    let t = function(t, e) {
                                        return (i, s, n) => {
                                            let r, l, a = 0,
                                                h = i.length - 1;
                                            if (h >= 0 && (r = i[h]) instanceof p) {
                                                if (!h && r.type == t && r.length == n) return r;
                                                (l = r.prop(o.lookAhead)) && (a = s[h] + r.length + l)
                                            }
                                            return w(t, i, s, n, a, e)
                                        }
                                    }(P, M);
                                    Q = D(P, e, i, 0, e.length, 0, S - k, t, t)
                                } else Q = w(P, e, i, S - k, A - S, M)
                            }
                            i.push(Q), s.push(R)
                        }

                        function v(t, e, i, s) {
                            let o = [],
                                l = 0,
                                a = -1;
                            for (; h.pos > e;) {
                                let {
                                    id: t,
                                    start: e,
                                    end: i,
                                    size: s
                                } = h;
                                if (s > 4) h.next();
                                else {
                                    if (a > -1 && e < a) break;
                                    a < 0 && (a = i - r), o.push(t, e, i), l++, h.next()
                                }
                            }
                            if (l) {
                                let e = new Uint16Array(4 * l),
                                    r = o[o.length - 2];
                                for (let t = o.length - 3, i = 0; t >= 0; t -= 3) e[i++] = o[t], e[i++] = o[t + 1] - r, e[i++] = o[t + 2] - r, e[i++] = i;
                                i.push(new g(e, o[2] - r, n)), s.push(r - t)
                            }
                        }

                        function b(t, e, i, s, r, o, l, a, h) {
                            let c = [],
                                u = [];
                            for (; t.length > s;) c.push(t.pop()), u.push(e.pop() + i - r);
                            t.push(w(n.types[l], c, u, o - r, a - o, h)), e.push(r - i)
                        }

                        function w(t, e, i, s, n, r, l) {
                            if (r) {
                                let t = [o.contextHash, r];
                                l = l ? [t].concat(l) : [t]
                            }
                            if (n > 25) {
                                let t = [o.lookAhead, n];
                                l = l ? [t].concat(l) : [t]
                            }
                            return new p(t, e, i, s, l)
                        }

                        function y(t, e, i) {
                            let {
                                id: s,
                                start: n,
                                end: r,
                                size: o
                            } = h;
                            if (h.next(), o >= 0 && s < a) {
                                let l = i;
                                if (o > 4) {
                                    let s = h.pos - (o - 4);
                                    for (; h.pos > s;) i = y(t, e, i)
                                }
                                e[--i] = l, e[--i] = r - t, e[--i] = n - t, e[--i] = s
                            } else - 3 == o ? u = s : -4 == o && (d = s);
                            return i
                        }
                        let O = [],
                            x = [];
                        for (; h.pos > 0;) f(t.start || 0, t.bufferStart || 0, O, x, -1, 0);
                        let k = null !== (e = t.length) && void 0 !== e ? e : O.length ? x[0] + O[0].length : 0;
                        return new p(c[t.topID], O.reverse(), x.reverse(), k)
                    }(t)
                }
            }
            p.empty = new p(h.none, [], [], 0);
            class m {
                constructor(t, e) {
                    this.buffer = t, this.index = e
                }
                get id() {
                    return this.buffer[this.index - 4]
                }
                get start() {
                    return this.buffer[this.index - 3]
                }
                get end() {
                    return this.buffer[this.index - 2]
                }
                get size() {
                    return this.buffer[this.index - 1]
                }
                get pos() {
                    return this.index
                }
                next() {
                    this.index -= 4
                }
                fork() {
                    return new m(this.buffer, this.index)
                }
            }
            class g {
                constructor(t, e, i) {
                    this.buffer = t, this.length = e, this.set = i
                }
                get type() {
                    return h.none
                }
                toString() {
                    let t = [];
                    for (let e = 0; e < this.buffer.length;) t.push(this.childString(e)), e = this.buffer[e + 3];
                    return t.join(",")
                }
                childString(t) {
                    let e = this.buffer[t],
                        i = this.buffer[t + 3],
                        s = this.set.types[e],
                        n = s.name;
                    if (/\W/.test(n) && !s.isError && (n = JSON.stringify(n)), i == (t += 4)) return n;
                    let r = [];
                    for (; t < i;) r.push(this.childString(t)), t = this.buffer[t + 3];
                    return n + "(" + r.join(",") + ")"
                }
                findChild(t, e, i, s, n) {
                    let {
                        buffer: r
                    } = this, o = -1;
                    for (let l = t; l != e && !(v(n, s, r[l + 1], r[l + 2]) && (o = l, i > 0)); l = r[l + 3]);
                    return o
                }
                slice(t, e, i) {
                    let s = this.buffer,
                        n = new Uint16Array(e - t),
                        r = 0;
                    for (let o = t, l = 0; o < e;) {
                        n[l++] = s[o++], n[l++] = s[o++] - i;
                        let e = n[l++] = s[o++] - i;
                        n[l++] = s[o++] - t, r = Math.max(r, e)
                    }
                    return new g(n, r, this.set)
                }
            }

            function v(t, e, i, s) {
                switch (t) {
                    case -2:
                        return i < e;
                    case -1:
                        return s >= e && i < e;
                    case 0:
                        return i < e && s > e;
                    case 1:
                        return i <= e && s > e;
                    case 2:
                        return s > e;
                    case 4:
                        return !0
                }
            }

            function b(t, e, i, s) {
                for (var n; t.from == t.to || (i < 1 ? t.from >= e : t.from > e) || (i > -1 ? t.to <= e : t.to < e);) {
                    let e = !s && t instanceof y && t.index < 0 ? null : t.parent;
                    if (!e) return t;
                    t = e
                }
                let r = s ? 0 : f.IgnoreOverlays;
                if (s)
                    for (let s = t, o = s.parent; o; s = o, o = s.parent) s instanceof y && s.index < 0 && (null === (n = o.enter(e, i, r)) || void 0 === n ? void 0 : n.from) != s.from && (t = o);
                for (;;) {
                    let s = t.enter(e, i, r);
                    if (!s) return t;
                    t = s
                }
            }
            class w {
                cursor(t = 0) {
                    return new M(this, t)
                }
                getChild(t, e = null, i = null) {
                    let s = O(this, t, e, i);
                    return s.length ? s[0] : null
                }
                getChildren(t, e = null, i = null) {
                    return O(this, t, e, i)
                }
                resolve(t, e = 0) {
                    return b(this, t, e, !1)
                }
                resolveInner(t, e = 0) {
                    return b(this, t, e, !0)
                }
                matchContext(t) {
                    return x(this.parent, t)
                }
                enterUnfinishedNodesBefore(t) {
                    let e = this.childBefore(t),
                        i = this;
                    for (; e;) {
                        let t = e.lastChild;
                        if (!t || t.to != e.to) break;
                        t.type.isError && t.from == t.to ? (i = e, e = t.prevSibling) : e = t
                    }
                    return i
                }
                get node() {
                    return this
                }
                get next() {
                    return this.parent
                }
            }
            class y extends w {
                constructor(t, e, i, s) {
                    super(), this._tree = t, this.from = e, this.index = i, this._parent = s
                }
                get type() {
                    return this._tree.type
                }
                get name() {
                    return this._tree.type.name
                }
                get to() {
                    return this.from + this._tree.length
                }
                nextChild(t, e, i, s, n = 0) {
                    var r;
                    for (let o = this;;) {
                        for (let {
                                children: a,
                                positions: h
                            } = o._tree, c = e > 0 ? a.length : -1; t != c; t += e) {
                            let c = a[t],
                                u = h[t] + o.from;
                            if (n & f.EnterBracketed && c instanceof p && null === (null === (r = l.get(c)) || void 0 === r ? void 0 : r.overlay) && (u >= i || u + c.length <= i) || v(s, i, u, u + c.length))
                                if (c instanceof g) {
                                    if (n & f.ExcludeBuffers) continue;
                                    let r = c.findChild(0, c.buffer.length, e, i - u, s);
                                    if (r > -1) return new S(new k(o, c, t, u), null, r)
                                } else if (n & f.IncludeAnonymous || !c.type.isAnonymous || Q(c)) {
                                let r;
                                if (!(n & f.IgnoreMounts) && (r = l.get(c)) && !r.overlay) return new y(r.tree, u, t, o);
                                let a = new y(c, u, t, o);
                                return n & f.IncludeAnonymous || !a.type.isAnonymous ? a : a.nextChild(e < 0 ? c.children.length - 1 : 0, e, i, s, n)
                            }
                        }
                        if (n & f.IncludeAnonymous || !o.type.isAnonymous) return null;
                        if (t = o.index >= 0 ? o.index + e : e < 0 ? -1 : o._parent._tree.children.length, o = o._parent, !o) return null
                    }
                }
                get firstChild() {
                    return this.nextChild(0, 1, 0, 4)
                }
                get lastChild() {
                    return this.nextChild(this._tree.children.length - 1, -1, 0, 4)
                }
                childAfter(t) {
                    return this.nextChild(0, 1, t, 2)
                }
                childBefore(t) {
                    return this.nextChild(this._tree.children.length - 1, -1, t, -2)
                }
                prop(t) {
                    return this._tree.prop(t)
                }
                enter(t, e, i = 0) {
                    let s;
                    if (!(i & f.IgnoreOverlays) && (s = l.get(this._tree)) && s.overlay) {
                        let n = t - this.from,
                            r = i & f.EnterBracketed && s.bracketed;
                        for (let {
                                from: t,
                                to: i
                            }
                            of s.overlay)
                            if ((e > 0 || r ? t <= n : t < n) && (e < 0 || r ? i >= n : i > n)) return new y(s.tree, s.overlay[0].from + this.from, -1, this)
                    }
                    return this.nextChild(0, 1, t, e, i)
                }
                nextSignificantParent() {
                    let t = this;
                    for (; t.type.isAnonymous && t._parent;) t = t._parent;
                    return t
                }
                get parent() {
                    return this._parent ? this._parent.nextSignificantParent() : null
                }
                get nextSibling() {
                    return this._parent && this.index >= 0 ? this._parent.nextChild(this.index + 1, 1, 0, 4) : null
                }
                get prevSibling() {
                    return this._parent && this.index >= 0 ? this._parent.nextChild(this.index - 1, -1, 0, 4) : null
                }
                get tree() {
                    return this._tree
                }
                toTree() {
                    return this._tree
                }
                toString() {
                    return this._tree.toString()
                }
            }

            function O(t, e, i, s) {
                let n = t.cursor(),
                    r = [];
                if (!n.firstChild()) return r;
                if (null != i)
                    for (let t = !1; !t;)
                        if (t = n.type.is(i), !n.nextSibling()) return r;
                for (;;) {
                    if (null != s && n.type.is(s)) return r;
                    if (n.type.is(e) && r.push(n.node), !n.nextSibling()) return null == s ? r : []
                }
            }

            function x(t, e, i = e.length - 1) {
                for (let s = t; i >= 0; s = s.parent) {
                    if (!s) return !1;
                    if (!s.type.isAnonymous) {
                        if (e[i] && e[i] != s.name) return !1;
                        i--
                    }
                }
                return !0
            }
            class k {
                constructor(t, e, i, s) {
                    this.parent = t, this.buffer = e, this.index = i, this.start = s
                }
            }
            class S extends w {
                get name() {
                    return this.type.name
                }
                get from() {
                    return this.context.start + this.context.buffer.buffer[this.index + 1]
                }
                get to() {
                    return this.context.start + this.context.buffer.buffer[this.index + 2]
                }
                constructor(t, e, i) {
                    super(), this.context = t, this._parent = e, this.index = i, this.type = t.buffer.set.types[t.buffer.buffer[i]]
                }
                child(t, e, i) {
                    let {
                        buffer: s
                    } = this.context, n = s.findChild(this.index + 4, s.buffer[this.index + 3], t, e - this.context.start, i);
                    return n < 0 ? null : new S(this.context, this, n)
                }
                get firstChild() {
                    return this.child(1, 0, 4)
                }
                get lastChild() {
                    return this.child(-1, 0, 4)
                }
                childAfter(t) {
                    return this.child(1, t, 2)
                }
                childBefore(t) {
                    return this.child(-1, t, -2)
                }
                prop(t) {
                    return this.type.prop(t)
                }
                enter(t, e, i = 0) {
                    if (i & f.ExcludeBuffers) return null;
                    let {
                        buffer: s
                    } = this.context, n = s.findChild(this.index + 4, s.buffer[this.index + 3], e > 0 ? 1 : -1, t - this.context.start, e);
                    return n < 0 ? null : new S(this.context, this, n)
                }
                get parent() {
                    return this._parent || this.context.parent.nextSignificantParent()
                }
                externalSibling(t) {
                    return this._parent ? null : this.context.parent.nextChild(this.context.index + t, t, 0, 4)
                }
                get nextSibling() {
                    let {
                        buffer: t
                    } = this.context, e = t.buffer[this.index + 3];
                    return e < (this._parent ? t.buffer[this._parent.index + 3] : t.buffer.length) ? new S(this.context, this._parent, e) : this.externalSibling(1)
                }
                get prevSibling() {
                    let {
                        buffer: t
                    } = this.context, e = this._parent ? this._parent.index + 4 : 0;
                    return this.index == e ? this.externalSibling(-1) : new S(this.context, this._parent, t.findChild(e, this.index, -1, 0, 4))
                }
                get tree() {
                    return null
                }
                toTree() {
                    let t = [],
                        e = [],
                        {
                            buffer: i
                        } = this.context,
                        s = this.index + 4,
                        n = i.buffer[this.index + 3];
                    if (n > s) {
                        let r = i.buffer[this.index + 1];
                        t.push(i.slice(s, n, r)), e.push(0)
                    }
                    return new p(this.type, t, e, this.to - this.from)
                }
                toString() {
                    return this.context.buffer.childString(this.index)
                }
            }

            function C(t) {
                if (!t.length) return null;
                let e = 0,
                    i = t[0];
                for (let s = 1; s < t.length; s++) {
                    let n = t[s];
                    (n.from > i.from || n.to < i.to) && (i = n, e = s)
                }
                let s = i instanceof y && i.index < 0 ? null : i.parent,
                    n = t.slice();
                return s ? n[e] = s : n.splice(e, 1), new A(n, i)
            }
            class A {
                constructor(t, e) {
                    this.heads = t, this.node = e
                }
                get next() {
                    return C(this.heads)
                }
            }
            class M {
                get name() {
                    return this.type.name
                }
                constructor(t, e = 0) {
                    if (this.buffer = null, this.stack = [], this.index = 0, this.bufferNode = null, this.mode = e & ~f.EnterBracketed, t instanceof y) this.yieldNode(t);
                    else {
                        this._tree = t.context.parent, this.buffer = t.context;
                        for (let e = t._parent; e; e = e._parent) this.stack.unshift(e.index);
                        this.bufferNode = t, this.yieldBuf(t.index)
                    }
                }
                yieldNode(t) {
                    return !!t && (this._tree = t, this.type = t.type, this.from = t.from, this.to = t.to, !0)
                }
                yieldBuf(t, e) {
                    this.index = t;
                    let {
                        start: i,
                        buffer: s
                    } = this.buffer;
                    return this.type = e || s.set.types[s.buffer[t]], this.from = i + s.buffer[t + 1], this.to = i + s.buffer[t + 2], !0
                }
                yield(t) {
                    return !!t && (t instanceof y ? (this.buffer = null, this.yieldNode(t)) : (this.buffer = t.context, this.yieldBuf(t.index, t.type)))
                }
                toString() {
                    return this.buffer ? this.buffer.buffer.childString(this.index) : this._tree.toString()
                }
                enterChild(t, e, i) {
                    if (!this.buffer) return this.yield(this._tree.nextChild(t < 0 ? this._tree._tree.children.length - 1 : 0, t, e, i, this.mode));
                    let {
                        buffer: s
                    } = this.buffer, n = s.findChild(this.index + 4, s.buffer[this.index + 3], t, e - this.buffer.start, i);
                    return !(n < 0) && (this.stack.push(this.index), this.yieldBuf(n))
                }
                firstChild() {
                    return this.enterChild(1, 0, 4)
                }
                lastChild() {
                    return this.enterChild(-1, 0, 4)
                }
                childAfter(t) {
                    return this.enterChild(1, t, 2)
                }
                childBefore(t) {
                    return this.enterChild(-1, t, -2)
                }
                enter(t, e, i = this.mode) {
                    return this.buffer ? !(i & f.ExcludeBuffers) && this.enterChild(1, t, e) : this.yield(this._tree.enter(t, e, i))
                }
                parent() {
                    if (!this.buffer) return this.yieldNode(this.mode & f.IncludeAnonymous ? this._tree._parent : this._tree.parent);
                    if (this.stack.length) return this.yieldBuf(this.stack.pop());
                    let t = this.mode & f.IncludeAnonymous ? this.buffer.parent : this.buffer.parent.nextSignificantParent();
                    return this.buffer = null, this.yieldNode(t)
                }
                sibling(t) {
                    if (!this.buffer) return !!this._tree._parent && this.yield(this._tree.index < 0 ? null : this._tree._parent.nextChild(this._tree.index + t, t, 0, 4, this.mode));
                    let {
                        buffer: e
                    } = this.buffer, i = this.stack.length - 1;
                    if (t < 0) {
                        let t = i < 0 ? 0 : this.stack[i] + 4;
                        if (this.index != t) return this.yieldBuf(e.findChild(t, this.index, -1, 0, 4))
                    } else {
                        let t = e.buffer[this.index + 3];
                        if (t < (i < 0 ? e.buffer.length : e.buffer[this.stack[i] + 3])) return this.yieldBuf(t)
                    }
                    return i < 0 && this.yield(this.buffer.parent.nextChild(this.buffer.index + t, t, 0, 4, this.mode))
                }
                nextSibling() {
                    return this.sibling(1)
                }
                prevSibling() {
                    return this.sibling(-1)
                }
                atLastNode(t) {
                    let e, i, {
                        buffer: s
                    } = this;
                    if (s) {
                        if (t > 0) {
                            if (this.index < s.buffer.buffer.length) return !1
                        } else
                            for (let t = 0; t < this.index; t++)
                                if (s.buffer.buffer[t + 3] < this.index) return !1;
                        ({
                            index: e,
                            parent: i
                        } = s)
                    } else({
                        index: e,
                        _parent: i
                    } = this._tree);
                    for (; i;
                        ({
                            index: e,
                            _parent: i
                        } = i))
                        if (e > -1)
                            for (let s = e + t, n = t < 0 ? -1 : i._tree.children.length; s != n; s += t) {
                                let t = i._tree.children[s];
                                if (this.mode & f.IncludeAnonymous || t instanceof g || !t.type.isAnonymous || Q(t)) return !1
                            }
                    return !0
                }
                move(t, e) {
                    if (e && this.enterChild(t, 0, 4)) return !0;
                    for (;;) {
                        if (this.sibling(t)) return !0;
                        if (this.atLastNode(t) || !this.parent()) return !1
                    }
                }
                next(t = !0) {
                    return this.move(1, t)
                }
                prev(t = !0) {
                    return this.move(-1, t)
                }
                moveTo(t, e = 0) {
                    for (;
                        (this.from == this.to || (e < 1 ? this.from >= t : this.from > t) || (e > -1 ? this.to <= t : this.to < t)) && this.parent(););
                    for (; this.enterChild(1, t, e););
                    return this
                }
                get node() {
                    if (!this.buffer) return this._tree;
                    let t = this.bufferNode,
                        e = null,
                        i = 0;
                    if (t && t.context == this.buffer) t: for (let s = this.index, n = this.stack.length; n >= 0;) {
                        for (let r = t; r; r = r._parent)
                            if (r.index == s) {
                                if (s == this.index) return r;
                                e = r, i = n + 1;
                                break t
                            } s = this.stack[--n]
                    }
                    for (let t = i; t < this.stack.length; t++) e = new S(this.buffer, e, this.stack[t]);
                    return this.bufferNode = new S(this.buffer, e, this.index)
                }
                get tree() {
                    return this.buffer ? null : this._tree._tree
                }
                iterate(t, e) {
                    for (let i = 0;;) {
                        let s = !1;
                        if (this.type.isAnonymous || !1 !== t(this)) {
                            if (this.firstChild()) {
                                i++;
                                continue
                            }
                            this.type.isAnonymous || (s = !0)
                        }
                        for (;;) {
                            if (s && e && e(this), s = this.type.isAnonymous, !i) return;
                            if (this.nextSibling()) break;
                            this.parent(), i--, s = !0
                        }
                    }
                }
                matchContext(t) {
                    if (!this.buffer) return x(this.node.parent, t);
                    let {
                        buffer: e
                    } = this.buffer, {
                        types: i
                    } = e.set;
                    for (let s = t.length - 1, n = this.stack.length - 1; s >= 0; n--) {
                        if (n < 0) return x(this._tree, t, s);
                        let r = i[e.buffer[this.stack[n]]];
                        if (!r.isAnonymous) {
                            if (t[s] && t[s] != r.name) return !1;
                            s--
                        }
                    }
                    return !0
                }
            }

            function Q(t) {
                return t.children.some(t => t instanceof g || !t.type.isAnonymous || Q(t))
            }
            const T = new WeakMap;

            function P(t, e) {
                if (!t.isAnonymous || e instanceof g || e.type != t) return 1;
                let i = T.get(e);
                if (null == i) {
                    i = 1;
                    for (let s of e.children) {
                        if (s.type != t || !(s instanceof p)) {
                            i = 1;
                            break
                        }
                        i += P(t, s)
                    }
                    T.set(e, i)
                }
                return i
            }

            function D(t, e, i, s, n, r, o, l, a) {
                let h = 0;
                for (let i = s; i < n; i++) h += P(t, e[i]);
                let c = Math.ceil(1.5 * h / 8),
                    u = [],
                    d = [];
                return function e(i, s, n, o, l) {
                    for (let h = n; h < o;) {
                        let n = h,
                            f = s[h],
                            p = P(t, i[h]);
                        for (h++; h < o; h++) {
                            let e = P(t, i[h]);
                            if (p + e >= c) break;
                            p += e
                        }
                        if (h == n + 1) {
                            if (p > c) {
                                let t = i[n];
                                e(t.children, t.positions, 0, t.children.length, s[n] + l);
                                continue
                            }
                            u.push(i[n])
                        } else {
                            let e = s[h - 1] + i[h - 1].length - f;
                            u.push(D(t, i, s, n, h, f, e, null, a))
                        }
                        d.push(f + l - r)
                    }
                }(e, i, s, n, 0), (l || a)(u, d, o)
            }
            class R {
                constructor() {
                    this.map = new WeakMap
                }
                setBuffer(t, e, i) {
                    let s = this.map.get(t);
                    s || this.map.set(t, s = new Map), s.set(e, i)
                }
                getBuffer(t, e) {
                    let i = this.map.get(t);
                    return i && i.get(e)
                }
                set(t, e) {
                    t instanceof S ? this.setBuffer(t.context.buffer, t.index, e) : t instanceof y && this.map.set(t.tree, e)
                }
                get(t) {
                    return t instanceof S ? this.getBuffer(t.context.buffer, t.index) : t instanceof y ? this.map.get(t.tree) : void 0
                }
                cursorSet(t, e) {
                    t.buffer ? this.setBuffer(t.buffer.buffer, t.index, e) : this.map.set(t.tree, e)
                }
                cursorGet(t) {
                    return t.buffer ? this.getBuffer(t.buffer.buffer, t.index) : this.map.get(t.tree)
                }
            }
            class E {
                constructor(t, e, i, s, n = !1, r = !1) {
                    this.from = t, this.to = e, this.tree = i, this.offset = s, this.open = (n ? 1 : 0) | (r ? 2 : 0)
                }
                get openStart() {
                    return (1 & this.open) > 0
                }
                get openEnd() {
                    return (2 & this.open) > 0
                }
                static addTree(t, e = [], i = !1) {
                    let s = [new E(0, t.length, t, 0, !1, i)];
                    for (let i of e) i.to > t.length && s.push(i);
                    return s
                }
                static applyChanges(t, e, i = 128) {
                    if (!e.length) return t;
                    let s = [],
                        n = 1,
                        r = t.length ? t[0] : null;
                    for (let o = 0, l = 0, a = 0;; o++) {
                        let h = o < e.length ? e[o] : null,
                            c = h ? h.fromA : 1e9;
                        if (c - l >= i)
                            for (; r && r.from < c;) {
                                let e = r;
                                if (l >= e.from || c <= e.to || a) {
                                    let t = Math.max(e.from, l) - a,
                                        i = Math.min(e.to, c) - a;
                                    e = t >= i ? null : new E(t, i, e.tree, e.offset + a, o > 0, !!h)
                                }
                                if (e && s.push(e), r.to > c) break;
                                r = n < t.length ? t[n++] : null
                            }
                        if (!h) break;
                        l = h.toA, a = h.toA - h.toB
                    }
                    return s
                }
            }
            class B {
                startParse(t, e, i) {
                    return "string" == typeof t && (t = new L(t)), i = i ? i.length ? i.map(t => new r(t.from, t.to)) : [new r(0, 0)] : [new r(0, t.length)], this.createParse(t, e || [], i)
                }
                parse(t, e, i) {
                    let s = this.startParse(t, e, i);
                    for (;;) {
                        let t = s.advance();
                        if (t) return t
                    }
                }
            }
            class L {
                constructor(t) {
                    this.string = t
                }
                get length() {
                    return this.string.length
                }
                chunk(t) {
                    return this.string.slice(t)
                }
                get lineChunks() {
                    return !1
                }
                read(t, e) {
                    return this.string.slice(t, e)
                }
            }
            new o({
                perNode: !0
            })
        },
        404(t, e, i) {
            i.d(e, {
                Bc: () => st,
                OO: () => dt,
                wm: () => K,
                yU: () => ut
            });
            var s = i(638),
                n = i(898),
                r = i(874);
            class o {
                constructor(t, e, i, s) {
                    this.state = t, this.pos = e, this.explicit = i, this.view = s, this.abortListeners = [], this.abortOnDocChange = !1
                }
                tokenBefore(t) {
                    let e = (0, r.mv)(this.state).resolveInner(this.pos, -1);
                    for (; e && t.indexOf(e.name) < 0;) e = e.parent;
                    return e ? {
                        from: e.from,
                        to: this.pos,
                        text: this.state.sliceDoc(e.from, this.pos),
                        type: e.type
                    } : null
                }
                matchBefore(t) {
                    let e = this.state.doc.lineAt(this.pos),
                        i = Math.max(e.from, this.pos - 250),
                        s = e.text.slice(i - e.from, this.pos - e.from),
                        n = s.search(c(t, !1));
                    return n < 0 ? null : {
                        from: i + n,
                        to: this.pos,
                        text: s.slice(n)
                    }
                }
                get aborted() {
                    return null == this.abortListeners
                }
                addEventListener(t, e, i) {
                    "abort" == t && this.abortListeners && (this.abortListeners.push(e), i && i.onDocChange && (this.abortOnDocChange = !0))
                }
            }

            function l(t) {
                let e = Object.keys(t).join(""),
                    i = /\w/.test(e);
                return i && (e = e.replace(/\w/g, "")), `[${i?"\\w":""}${e.replace(/[^\w\s]/g,"\\$&")}]`
            }
            class a {
                constructor(t, e, i, s) {
                    this.completion = t, this.source = e, this.match = i, this.score = s
                }
            }

            function h(t) {
                return t.selection.main.from
            }

            function c(t, e) {
                var i;
                let {
                    source: s
                } = t, n = e && "^" != s[0], r = "$" != s[s.length - 1];
                return n || r ? new RegExp(`${n?"^":""}(?:${s})${r?"$":""}`, null !== (i = t.flags) && void 0 !== i ? i : t.ignoreCase ? "i" : "") : t
            }
            const u = s.YH.define();

            function d(t, e, i, n) {
                let {
                    main: r
                } = t.selection, o = i - r.from, l = n - r.from;
                return {
                    ...t.changeByRange(a => {
                        if (a != r && i != n && t.sliceDoc(a.from + o, a.from + l) != t.sliceDoc(i, n)) return {
                            range: a
                        };
                        let h = t.toText(e);
                        return {
                            changes: {
                                from: a.from + o,
                                to: n == r.from ? a.to : a.from + l,
                                insert: h
                            },
                            range: s.OF.cursor(a.from + o + h.length)
                        }
                    }),
                    scrollIntoView: !0,
                    userEvent: "input.complete"
                }
            }
            const f = new WeakMap;

            function p(t) {
                if (!Array.isArray(t)) return t;
                let e = f.get(t);
                return e || f.set(t, e = function(t) {
                    let e = t.map(t => "string" == typeof t ? {
                            label: t
                        } : t),
                        [i, s] = e.every(t => /^\w+$/.test(t.label)) ? [/\w*$/, /\w+$/] : function(t) {
                            let e = Object.create(null),
                                i = Object.create(null);
                            for (let {
                                    label: s
                                }
                                of t) {
                                e[s[0]] = !0;
                                for (let t = 1; t < s.length; t++) i[s[t]] = !0
                            }
                            let s = l(e) + l(i) + "*$";
                            return [new RegExp("^" + s), new RegExp(s)]
                        }(e);
                    return t => {
                        let n = t.matchBefore(s);
                        return n || t.explicit ? {
                            from: n ? n.from : t.pos,
                            options: e,
                            validFor: i
                        } : null
                    }
                }(t)), e
            }
            const m = s.Pe.define(),
                g = s.Pe.define();
            class v {
                constructor(t) {
                    this.pattern = t, this.chars = [], this.folded = [], this.any = [], this.precise = [], this.byWord = [], this.score = 0, this.matched = [];
                    for (let e = 0; e < t.length;) {
                        let i = (0, s.vS)(t, e),
                            n = (0, s.Fh)(i);
                        this.chars.push(i);
                        let r = t.slice(e, e + n),
                            o = r.toUpperCase();
                        this.folded.push((0, s.vS)(o == r ? r.toLowerCase() : o, 0)), e += n
                    }
                    this.astral = t.length != this.chars.length
                }
                ret(t, e) {
                    return this.score = t, this.matched = e, this
                }
                match(t) {
                    if (0 == this.pattern.length) return this.ret(-100, []);
                    if (t.length < this.pattern.length) return null;
                    let {
                        chars: e,
                        folded: i,
                        any: n,
                        precise: r,
                        byWord: o
                    } = this;
                    if (1 == e.length) {
                        let n = (0, s.vS)(t, 0),
                            r = (0, s.Fh)(n),
                            o = r == t.length ? 0 : -100;
                        if (n == e[0]);
                        else {
                            if (n != i[0]) return null;
                            o += -200
                        }
                        return this.ret(o, [0, r])
                    }
                    let l = t.indexOf(this.pattern);
                    if (0 == l) return this.ret(t.length == this.pattern.length ? 0 : -100, [0, this.pattern.length]);
                    let a = e.length,
                        h = 0;
                    if (l < 0) {
                        for (let r = 0, o = Math.min(t.length, 200); r < o && h < a;) {
                            let o = (0, s.vS)(t, r);
                            o != e[h] && o != i[h] || (n[h++] = r), r += (0, s.Fh)(o)
                        }
                        if (h < a) return null
                    }
                    let c = 0,
                        u = 0,
                        d = !1,
                        f = 0,
                        p = -1,
                        m = -1,
                        g = /[a-z]/.test(t),
                        v = !0;
                    for (let n = 0, h = Math.min(t.length, 200), b = 0; n < h && u < a;) {
                        let h = (0, s.vS)(t, n);
                        l < 0 && (c < a && h == e[c] && (r[c++] = n), f < a && (h == e[f] || h == i[f] ? (0 == f && (p = n), m = n + 1, f++) : f = 0));
                        let w, y = h < 255 ? h >= 48 && h <= 57 || h >= 97 && h <= 122 ? 2 : h >= 65 && h <= 90 ? 1 : 0 : (w = (0, s.MK)(h)) != w.toLowerCase() ? 1 : w != w.toUpperCase() ? 2 : 0;
                        (!n || 1 == y && g || 0 == b && 0 != y) && (e[u] == h || i[u] == h && (d = !0) ? o[u++] = n : o.length && (v = !1)), b = y, n += (0, s.Fh)(h)
                    }
                    return u == a && 0 == o[0] && v ? this.result((d ? -200 : 0) - 100, o, t) : f == a && 0 == p ? this.ret(-200 - t.length + (m == t.length ? 0 : -100), [0, m]) : l > -1 ? this.ret(-700 - t.length, [l, l + this.pattern.length]) : f == a ? this.ret(-900 - t.length, [p, m]) : u == a ? this.result((d ? -200 : 0) - 100 - 700 + (v ? 0 : -1100), o, t) : 2 == e.length ? null : this.result((n[0] ? -700 : 0) - 200 - 1100, n, t)
                }
                result(t, e, i) {
                    let n = [],
                        r = 0;
                    for (let t of e) {
                        let e = t + (this.astral ? (0, s.Fh)((0, s.vS)(i, t)) : 1);
                        r && n[r - 1] == t ? n[r - 1] = e : (n[r++] = t, n[r++] = e)
                    }
                    return this.ret(t - i.length, n)
                }
            }
            class b {
                constructor(t) {
                    this.pattern = t, this.matched = [], this.score = 0, this.folded = t.toLowerCase()
                }
                match(t) {
                    if (t.length < this.pattern.length) return null;
                    let e = t.slice(0, this.pattern.length),
                        i = e == this.pattern ? 0 : e.toLowerCase() == this.folded ? -200 : null;
                    return null == i ? null : (this.matched = [0, e.length], this.score = i + (t.length == this.pattern.length ? 0 : -100), this)
                }
            }
            const w = s.sj.define({
                combine: t => (0, s.QR)(t, {
                    activateOnTyping: !0,
                    activateOnCompletion: () => !1,
                    activateOnTypingDelay: 100,
                    selectOnOpen: !0,
                    override: null,
                    closeOnBlur: !0,
                    maxRenderedOptions: 100,
                    defaultKeymap: !0,
                    tooltipClass: () => "",
                    optionClass: () => "",
                    aboveCursor: !1,
                    icons: !0,
                    addToOptions: [],
                    positionInfo: O,
                    filterStrict: !1,
                    compareCompletions: (t, e) => (t.sortText || t.label).localeCompare(e.sortText || e.label),
                    interactionDelay: 75,
                    updateSyncTime: 100
                }, {
                    defaultKeymap: (t, e) => t && e,
                    closeOnBlur: (t, e) => t && e,
                    icons: (t, e) => t && e,
                    tooltipClass: (t, e) => i => y(t(i), e(i)),
                    optionClass: (t, e) => i => y(t(i), e(i)),
                    addToOptions: (t, e) => t.concat(e),
                    filterStrict: (t, e) => t || e
                })
            });

            function y(t, e) {
                return t ? e ? t + " " + e : t : e
            }

            function O(t, e, i, s, r, o) {
                let l, a, h = t.textDirection == n.OP.RTL,
                    c = h,
                    u = !1,
                    d = "top",
                    f = e.left - r.left,
                    p = r.right - e.right,
                    m = s.right - s.left,
                    g = s.bottom - s.top;
                if (c && f < Math.min(m, p) ? c = !1 : !c && p < Math.min(m, f) && (c = !0), m <= (c ? f : p)) l = Math.max(r.top, Math.min(i.top, r.bottom - g)) - e.top, a = Math.min(400, c ? f : p);
                else {
                    u = !0, a = Math.min(400, (h ? e.right : r.right - e.left) - 30);
                    let t = r.bottom - e.bottom;
                    t >= g || t > e.top ? l = i.bottom - e.top : (d = "bottom", l = e.bottom - i.top)
                }
                return {
                    style: `${d}: ${l/((e.bottom-e.top)/o.offsetHeight)}px; max-width: ${a/((e.right-e.left)/o.offsetWidth)}px`,
                    class: "css-completionInfo-" + (u ? h ? "left-narrow" : "right-narrow" : c ? "left" : "right")
                }
            }

            function x(t, e, i) {
                if (t <= i) return {
                    from: 0,
                    to: t
                };
                if (e < 0 && (e = 0), e <= t >> 1) {
                    let t = Math.floor(e / i);
                    return {
                        from: t * i,
                        to: (t + 1) * i
                    }
                }
                let s = Math.floor((t - e) / i);
                return {
                    from: t - (s + 1) * i,
                    to: t - s * i
                }
            }
            class k {
                constructor(t, e, i) {
                    this.view = t, this.stateField = e, this.applyCompletion = i, this.info = null, this.infoDestroy = null, this.placeInfoReq = {
                        read: () => this.measureInfo(),
                        write: t => this.placeInfo(t),
                        key: this
                    }, this.space = null, this.currentClass = "";
                    let s = t.state.field(e),
                        {
                            options: n,
                            selected: r
                        } = s.open,
                        o = t.state.facet(w);
                    this.optionContent = function(t) {
                        let e = t.addToOptions.slice();
                        return t.icons && e.push({
                            render(t) {
                                let e = document.createElement("div");
                                return e.classList.add("css-completionIcon"), t.type && e.classList.add(...t.type.split(/\s+/g).map(t => "css-completionIcon-" + t)), e.setAttribute("aria-hidden", "true"), e
                            },
                            position: 20
                        }), e.push({
                            render(t, e, i, s) {
                                let n = document.createElement("span");
                                n.className = "css-completionLabel";
                                let r = t.displayLabel || t.label,
                                    o = 0;
                                for (let t = 0; t < s.length;) {
                                    let e = s[t++],
                                        i = s[t++];
                                    e > o && n.appendChild(document.createTextNode(r.slice(o, e)));
                                    let l = n.appendChild(document.createElement("span"));
                                    l.appendChild(document.createTextNode(r.slice(e, i))), l.className = "css-completionMatchedText", o = i
                                }
                                return o < r.length && n.appendChild(document.createTextNode(r.slice(o))), n
                            },
                            position: 50
                        }, {
                            render(t) {
                                if (!t.detail) return null;
                                let e = document.createElement("span");
                                return e.className = "css-completionDetail", e.textContent = t.detail, e
                            },
                            position: 80
                        }), e.sort((t, e) => t.position - e.position).map(t => t.render)
                    }(o), this.optionClass = o.optionClass, this.tooltipClass = o.tooltipClass, this.range = x(n.length, r, o.maxRenderedOptions), this.dom = document.createElement("div"), this.dom.className = "css-tooltip-autocomplete", this.updateTooltipClass(t.state), this.dom.addEventListener("mousedown", i => {
                        let {
                            options: s
                        } = t.state.field(e).open;
                        for (let e, n = i.target; n && n != this.dom; n = n.parentNode)
                            if ("LI" == n.nodeName && (e = /-(\d+)$/.exec(n.id)) && +e[1] < s.length) return this.applyCompletion(t, s[+e[1]]), void i.preventDefault()
                    }), this.dom.addEventListener("focusout", e => {
                        let i = t.state.field(this.stateField, !1);
                        i && i.tooltip && t.state.facet(w).closeOnBlur && e.relatedTarget != t.contentDOM && t.dispatch({
                            effects: g.of(null)
                        })
                    }), this.showOptions(n, s.id)
                }
                mount() {
                    this.updateSel()
                }
                showOptions(t, e) {
                    this.list && this.list.remove(), this.list = this.dom.appendChild(this.createListBox(t, e, this.range)), this.list.addEventListener("scroll", () => {
                        this.info && this.view.requestMeasure(this.placeInfoReq)
                    })
                }
                update(t) {
                    var e;
                    let i = t.state.field(this.stateField),
                        s = t.startState.field(this.stateField);
                    if (this.updateTooltipClass(t.state), i != s) {
                        let {
                            options: n,
                            selected: r,
                            disabled: o
                        } = i.open;
                        s.open && s.open.options == n || (this.range = x(n.length, r, t.state.facet(w).maxRenderedOptions), this.showOptions(n, i.id)), this.updateSel(), o != (null === (e = s.open) || void 0 === e ? void 0 : e.disabled) && this.dom.classList.toggle("css-tooltip-autocomplete-disabled", !!o)
                    }
                }
                updateTooltipClass(t) {
                    let e = this.tooltipClass(t);
                    if (e != this.currentClass) {
                        for (let t of this.currentClass.split(" ")) t && this.dom.classList.remove(t);
                        for (let t of e.split(" ")) t && this.dom.classList.add(t);
                        this.currentClass = e
                    }
                }
                positioned(t) {
                    this.space = t, this.info && this.view.requestMeasure(this.placeInfoReq)
                }
                updateSel() {
                    let t = this.view.state.field(this.stateField),
                        e = t.open;
                    (e.selected > -1 && e.selected < this.range.from || e.selected >= this.range.to) && (this.range = x(e.options.length, e.selected, this.view.state.facet(w).maxRenderedOptions), this.showOptions(e.options, t.id));
                    let i = this.updateSelectedOption(e.selected);
                    if (i) {
                        this.destroyInfo();
                        let {
                            completion: s
                        } = e.options[e.selected], {
                            info: r
                        } = s;
                        if (!r) return;
                        let o = "string" == typeof r ? document.createTextNode(r) : r(s);
                        if (!o) return;
                        "then" in o ? o.then(e => {
                            e && this.view.state.field(this.stateField, !1) == t && this.addInfoPane(e, s)
                        }).catch(t => (0, n.c_)(this.view.state, t, "completion info")) : (this.addInfoPane(o, s), i.setAttribute("aria-describedby", this.info.id))
                    }
                }
                addInfoPane(t, e) {
                    this.destroyInfo();
                    let i = this.info = document.createElement("div");
                    if (i.className = "css-tooltip css-completionInfo", i.id = "css-completionInfo-" + Math.floor(65535 * Math.random()).toString(16), null != t.nodeType) i.appendChild(t), this.infoDestroy = null;
                    else {
                        let {
                            dom: e,
                            destroy: s
                        } = t;
                        i.appendChild(e), this.infoDestroy = s || null
                    }
                    this.dom.appendChild(i), this.view.requestMeasure(this.placeInfoReq)
                }
                updateSelectedOption(t) {
                    let e = null;
                    for (let i = this.list.firstChild, s = this.range.from; i; i = i.nextSibling, s++) "LI" == i.nodeName && i.id ? s == t ? i.hasAttribute("aria-selected") || (i.setAttribute("aria-selected", "true"), e = i) : i.hasAttribute("aria-selected") && (i.removeAttribute("aria-selected"), i.removeAttribute("aria-describedby")) : s--;
                    return e && function(t, e) {
                        let i = t.getBoundingClientRect(),
                            s = e.getBoundingClientRect(),
                            n = i.height / t.offsetHeight;
                        s.top < i.top ? t.scrollTop -= (i.top - s.top) / n : s.bottom > i.bottom && (t.scrollTop += (s.bottom - i.bottom) / n)
                    }(this.list, e), e
                }
                measureInfo() {
                    let t = this.dom.querySelector("[aria-selected]");
                    if (!t || !this.info) return null;
                    let e = this.dom.getBoundingClientRect(),
                        i = this.info.getBoundingClientRect(),
                        s = t.getBoundingClientRect(),
                        n = this.space;
                    if (!n) {
                        let t = this.dom.ownerDocument.documentElement;
                        n = {
                            left: 0,
                            top: 0,
                            right: t.clientWidth,
                            bottom: t.clientHeight
                        }
                    }
                    return s.top > Math.min(n.bottom, e.bottom) - 10 || s.bottom < Math.max(n.top, e.top) + 10 ? null : this.view.state.facet(w).positionInfo(this.view, e, s, i, n, this.dom)
                }
                placeInfo(t) {
                    this.info && (t ? (t.style && (this.info.style.cssText = t.style), this.info.className = "css-tooltip css-completionInfo " + (t.class || "")) : this.info.style.cssText = "top: -1e6px")
                }
                createListBox(t, e, i) {
                    const s = document.createElement("ul");
                    s.id = e, s.setAttribute("role", "listbox"), s.setAttribute("aria-expanded", "true"), s.setAttribute("aria-label", this.view.state.phrase("Completions")), s.addEventListener("mousedown", t => {
                        t.target == s && t.preventDefault()
                    });
                    let n = null;
                    for (let r = i.from; r < i.to; r++) {
                        let {
                            completion: o,
                            match: l
                        } = t[r], {
                            section: a
                        } = o;
                        if (a) {
                            let t = "string" == typeof a ? a : a.name;
                            t != n && (r > i.from || 0 == i.from) && (n = t, "string" != typeof a && a.header ? s.appendChild(a.header(a)) : s.appendChild(document.createElement("completion-section")).textContent = t)
                        }
                        const h = s.appendChild(document.createElement("li"));
                        h.id = e + "-" + r, h.setAttribute("role", "option");
                        let c = this.optionClass(o);
                        c && (h.className = c);
                        for (let t of this.optionContent) {
                            let e = t(o, this.view.state, this.view, l);
                            e && h.appendChild(e)
                        }
                    }
                    return i.from && s.classList.add("css-completionListIncompleteTop"), i.to < t.length && s.classList.add("css-completionListIncompleteBottom"), s
                }
                destroyInfo() {
                    this.info && (this.infoDestroy && this.infoDestroy(), this.info.remove(), this.info = null)
                }
                destroy() {
                    this.destroyInfo()
                }
            }

            function S(t, e) {
                return i => new k(i, t, e)
            }

            function C(t) {
                return 100 * (t.boost || 0) + (t.apply ? 10 : 0) + (t.info ? 5 : 0) + (t.type ? 1 : 0)
            }
            class A {
                constructor(t, e, i, s, n, r) {
                    this.options = t, this.attrs = e, this.tooltip = i, this.timestamp = s, this.selected = n, this.disabled = r
                }
                setSelected(t, e) {
                    return t == this.selected || t >= this.options.length ? this : new A(this.options, P(e, t), this.tooltip, this.timestamp, t, this.disabled)
                }
                static build(t, e, i, s, n, r) {
                    if (s && !r && t.some(t => t.isPending)) return s.setDisabled();
                    let o = function(t, e) {
                        let i = [],
                            s = null,
                            n = null,
                            r = t => {
                                i.push(t);
                                let {
                                    section: e
                                } = t.completion;
                                if (e) {
                                    s || (s = []);
                                    let t = "string" == typeof e ? e : e.name;
                                    s.some(e => e.name == t) || s.push("string" == typeof e ? {
                                        name: t
                                    } : e)
                                }
                            },
                            o = e.facet(w);
                        for (let s of t)
                            if (s.hasResult()) {
                                let t = s.result.getMatch;
                                if (!1 === s.result.filter)
                                    for (let e of s.result.options) r(new a(e, s.source, t ? t(e) : [], 1e9 - i.length));
                                else {
                                    let i, l = e.sliceDoc(s.from, s.to),
                                        h = o.filterStrict ? new b(l) : new v(l);
                                    for (let e of s.result.options)
                                        if (i = h.match(e.label)) {
                                            let o = e.displayLabel ? t ? t(e, i.matched) : [] : i.matched,
                                                l = i.score + (e.boost || 0);
                                            if (r(new a(e, s.source, o, l)), "object" == typeof e.section && "dynamic" === e.section.rank) {
                                                let {
                                                    name: t
                                                } = e.section;
                                                n || (n = Object.create(null)), n[t] = Math.max(l, n[t] || -1e9)
                                            }
                                        }
                                }
                            } if (s) {
                            let t = Object.create(null),
                                e = 0,
                                r = (t, e) => ("dynamic" === t.rank && "dynamic" === e.rank ? n[e.name] - n[t.name] : 0) || ("number" == typeof t.rank ? t.rank : 1e9) - ("number" == typeof e.rank ? e.rank : 1e9) || (t.name < e.name ? -1 : 1);
                            for (let i of s.sort(r)) e -= 1e5, t[i.name] = e;
                            for (let e of i) {
                                let {
                                    section: i
                                } = e.completion;
                                i && (e.score += t["string" == typeof i ? i : i.name])
                            }
                        }
                        let l = [],
                            h = null,
                            c = o.compareCompletions;
                        for (let t of i.sort((t, e) => e.score - t.score || c(t.completion, e.completion))) {
                            let e = t.completion;
                            !h || h.label != e.label || h.detail != e.detail || null != h.type && null != e.type && h.type != e.type || h.apply != e.apply || h.boost != e.boost ? l.push(t) : C(t.completion) > C(h) && (l[l.length - 1] = t), h = t.completion
                        }
                        return l
                    }(t, e);
                    if (!o.length) return s && t.some(t => t.isPending) ? s.setDisabled() : null;
                    let l = e.facet(w).selectOnOpen ? 0 : -1;
                    if (s && s.selected != l && -1 != s.selected) {
                        let t = s.options[s.selected].completion;
                        for (let e = 0; e < o.length; e++)
                            if (o[e].completion == t) {
                                l = e;
                                break
                            }
                    }
                    return new A(o, P(i, l), {
                        pos: t.reduce((t, e) => e.hasResult() ? Math.min(t, e.from) : t, 1e8),
                        create: F,
                        above: n.aboveCursor
                    }, s ? s.timestamp : Date.now(), l, !1)
                }
                map(t) {
                    return new A(this.options, this.attrs, {
                        ...this.tooltip,
                        pos: t.mapPos(this.tooltip.pos)
                    }, this.timestamp, this.selected, this.disabled)
                }
                setDisabled() {
                    return new A(this.options, this.attrs, this.tooltip, this.timestamp, this.selected, !0)
                }
            }
            class M {
                constructor(t, e, i) {
                    this.active = t, this.id = e, this.open = i
                }
                static start() {
                    return new M(D, "css-ac-" + Math.floor(2e6 * Math.random()).toString(36), null)
                }
                update(t) {
                    let {
                        state: e
                    } = t, i = e.facet(w), s = (i.override || e.languageDataAt("autocomplete", h(e)).map(p)).map(e => (this.active.find(t => t.source == e) || new E(e, this.active.some(t => 0 != t.state) ? 1 : 0)).update(t, i));
                    s.length == this.active.length && s.every((t, e) => t == this.active[e]) && (s = this.active);
                    let n = this.open,
                        r = t.effects.some(t => t.is(L));
                    n && t.docChanged && (n = n.map(t.changes)), t.selection || s.some(e => e.hasResult() && t.changes.touchesRange(e.from, e.to)) || ! function(t, e) {
                        if (t == e) return !0;
                        for (let i = 0, s = 0;;) {
                            for (; i < t.length && !t[i].hasResult();) i++;
                            for (; s < e.length && !e[s].hasResult();) s++;
                            let n = i == t.length,
                                r = s == e.length;
                            if (n || r) return n == r;
                            if (t[i++].result != e[s++].result) return !1
                        }
                    }(s, this.active) || r ? n = A.build(s, e, this.id, n, i, r) : n && n.disabled && !s.some(t => t.isPending) && (n = null), !n && s.every(t => !t.isPending) && s.some(t => t.hasResult()) && (s = s.map(t => t.hasResult() ? new E(t.source, 0) : t));
                    for (let e of t.effects) e.is(N) && (n = n && n.setSelected(e.value, this.id));
                    return s == this.active && n == this.open ? this : new M(s, this.id, n)
                }
                get tooltip() {
                    return this.open ? this.open.tooltip : null
                }
                get attrs() {
                    return this.open ? this.open.attrs : this.active.length ? Q : T
                }
            }
            const Q = {
                    "aria-autocomplete": "list"
                },
                T = {};

            function P(t, e) {
                let i = {
                    "aria-autocomplete": "list",
                    "aria-haspopup": "listbox",
                    "aria-controls": t
                };
                return e > -1 && (i["aria-activedescendant"] = t + "-" + e), i
            }
            const D = [];

            function R(t, e) {
                if (t.isUserEvent("input.complete")) {
                    let i = t.annotation(u);
                    if (i && e.activateOnCompletion(i)) return 12
                }
                let i = t.isUserEvent("input.type");
                return i && e.activateOnTyping ? 5 : i ? 1 : t.isUserEvent("delete.backward") ? 2 : t.selection ? 8 : t.docChanged ? 16 : 0
            }
            class E {
                constructor(t, e, i = !1) {
                    this.source = t, this.state = e, this.explicit = i
                }
                hasResult() {
                    return !1
                }
                get isPending() {
                    return 1 == this.state
                }
                update(t, e) {
                    let i = R(t, e),
                        s = this;
                    (8 & i || 16 & i && this.touches(t)) && (s = new E(s.source, 0)), 4 & i && 0 == s.state && (s = new E(this.source, 1)), s = s.updateFor(t, i);
                    for (let e of t.effects)
                        if (e.is(m)) s = new E(s.source, 1, e.value);
                        else if (e.is(g)) s = new E(s.source, 0);
                    else if (e.is(L))
                        for (let t of e.value) t.source == s.source && (s = t);
                    return s
                }
                updateFor(t, e) {
                    return this.map(t.changes)
                }
                map(t) {
                    return this
                }
                touches(t) {
                    return t.changes.touchesRange(h(t.state))
                }
            }
            class B extends E {
                constructor(t, e, i, s, n, r) {
                    super(t, 3, e), this.limit = i, this.result = s, this.from = n, this.to = r
                }
                hasResult() {
                    return !0
                }
                updateFor(t, e) {
                    var i;
                    if (!(3 & e)) return this.map(t.changes);
                    let s = this.result;
                    s.map && !t.changes.empty && (s = s.map(s, t.changes));
                    let n = t.changes.mapPos(this.from),
                        r = t.changes.mapPos(this.to, 1),
                        l = h(t.state);
                    if (l > r || !s || 2 & e && (h(t.startState) == this.from || l < this.limit)) return new E(this.source, 4 & e ? 1 : 0);
                    let a = t.changes.mapPos(this.limit);
                    return function(t, e, i, s) {
                        if (!t) return !1;
                        let n = e.sliceDoc(i, s);
                        return "function" == typeof t ? t(n, i, s, e) : c(t, !0).test(n)
                    }(s.validFor, t.state, n, r) ? new B(this.source, this.explicit, a, s, n, r) : s.update && (s = s.update(s, n, r, new o(t.state, l, !1))) ? new B(this.source, this.explicit, a, s, s.from, null !== (i = s.to) && void 0 !== i ? i : h(t.state)) : new E(this.source, 1, this.explicit)
                }
                map(t) {
                    return t.empty ? this : (this.result.map ? this.result.map(this.result, t) : this.result) ? new B(this.source, this.explicit, t.mapPos(this.limit), this.result, t.mapPos(this.from), t.mapPos(this.to, 1)) : new E(this.source, 0)
                }
                touches(t) {
                    return t.changes.touchesRange(this.from, this.to)
                }
            }
            const L = s.Pe.define({
                    map: (t, e) => t.map(t => t.map(e))
                }),
                N = s.Pe.define(),
                I = s.sU.define({
                    create: () => M.start(),
                    update: (t, e) => t.update(e),
                    provide: t => [n.DK.from(t, t => t.tooltip), n.Lz.contentAttributes.from(t, t => t.attrs)]
                });

            function z(t, e) {
                const i = e.completion.apply || e.completion.label;
                let s = t.state.field(I).active.find(t => t.source == e.source);
                return s instanceof B && ("string" == typeof i ? t.dispatch({
                    ...d(t.state, i, s.from, s.to),
                    annotations: u.of(e.completion)
                }) : i(t, e.completion, s.from, s.to), !0)
            }
            const F = S(I, z);

            function $(t, e = "option") {
                return i => {
                    let s = i.state.field(I, !1);
                    if (!s || !s.open || s.open.disabled || Date.now() - s.open.timestamp < i.state.facet(w).interactionDelay) return !1;
                    let r, o = 1;
                    "page" == e && (r = (0, n.Eg)(i, s.open.tooltip)) && (o = Math.max(2, Math.floor(r.dom.offsetHeight / r.dom.querySelector("li").offsetHeight) - 1));
                    let {
                        length: l
                    } = s.open.options, a = s.open.selected > -1 ? s.open.selected + o * (t ? 1 : -1) : t ? 0 : l - 1;
                    return a < 0 ? a = "page" == e ? 0 : l - 1 : a >= l && (a = "page" == e ? l - 1 : 0), i.dispatch({
                        effects: N.of(a)
                    }), !0
                }
            }
            const W = t => !!t.state.field(I, !1) && (t.dispatch({
                effects: m.of(!0)
            }), !0);
            class V {
                constructor(t, e) {
                    this.active = t, this.context = e, this.time = Date.now(), this.updates = [], this.done = void 0
                }
            }
            const j = n.Z9.fromClass(class {
                    constructor(t) {
                        this.view = t, this.debounceUpdate = -1, this.running = [], this.debounceAccept = -1, this.pendingStart = !1, this.composing = 0;
                        for (let e of t.state.field(I).active) e.isPending && this.startQuery(e)
                    }
                    update(t) {
                        let e = t.state.field(I),
                            i = t.state.facet(w);
                        if (!t.selectionSet && !t.docChanged && t.startState.field(I) == e) return;
                        let s = t.transactions.some(t => {
                            let e = R(t, i);
                            return 8 & e || (t.selection || t.docChanged) && !(3 & e)
                        });
                        for (let e = 0; e < this.running.length; e++) {
                            let i = this.running[e];
                            if (s || i.context.abortOnDocChange && t.docChanged || i.updates.length + t.transactions.length > 50 && Date.now() - i.time > 1e3) {
                                for (let t of i.context.abortListeners) try {
                                    t()
                                } catch (t) {
                                    (0, n.c_)(this.view.state, t)
                                }
                                i.context.abortListeners = null, this.running.splice(e--, 1)
                            } else i.updates.push(...t.transactions)
                        }
                        this.debounceUpdate > -1 && clearTimeout(this.debounceUpdate), t.transactions.some(t => t.effects.some(t => t.is(m))) && (this.pendingStart = !0);
                        let r = this.pendingStart ? 50 : i.activateOnTypingDelay;
                        if (this.debounceUpdate = e.active.some(t => t.isPending && !this.running.some(e => e.active.source == t.source)) ? setTimeout(() => this.startUpdate(), r) : -1, 0 != this.composing)
                            for (let e of t.transactions) e.isUserEvent("input.type") ? this.composing = 2 : 2 == this.composing && e.selection && (this.composing = 3)
                    }
                    startUpdate() {
                        this.debounceUpdate = -1, this.pendingStart = !1;
                        let {
                            state: t
                        } = this.view, e = t.field(I);
                        for (let t of e.active) t.isPending && !this.running.some(e => e.active.source == t.source) && this.startQuery(t);
                        this.running.length && e.open && e.open.disabled && (this.debounceAccept = setTimeout(() => this.accept(), this.view.state.facet(w).updateSyncTime))
                    }
                    startQuery(t) {
                        let {
                            state: e
                        } = this.view, i = h(e), s = new o(e, i, t.explicit, this.view), r = new V(t, s);
                        this.running.push(r), Promise.resolve(t.source(s)).then(t => {
                            r.context.aborted || (r.done = t || null, this.scheduleAccept())
                        }, t => {
                            this.view.dispatch({
                                effects: g.of(null)
                            }), (0, n.c_)(this.view.state, t)
                        })
                    }
                    scheduleAccept() {
                        this.running.every(t => void 0 !== t.done) ? this.accept() : this.debounceAccept < 0 && (this.debounceAccept = setTimeout(() => this.accept(), this.view.state.facet(w).updateSyncTime))
                    }
                    accept() {
                        var t;
                        this.debounceAccept > -1 && clearTimeout(this.debounceAccept), this.debounceAccept = -1;
                        let e = [],
                            i = this.view.state.facet(w),
                            s = this.view.state.field(I);
                        for (let n = 0; n < this.running.length; n++) {
                            let r = this.running[n];
                            if (void 0 === r.done) continue;
                            if (this.running.splice(n--, 1), r.done) {
                                let s = h(r.updates.length ? r.updates[0].startState : this.view.state),
                                    n = Math.min(s, r.done.from + (r.active.explicit ? 0 : 1)),
                                    o = new B(r.active.source, r.active.explicit, n, r.done, r.done.from, null !== (t = r.done.to) && void 0 !== t ? t : s);
                                for (let t of r.updates) o = o.update(t, i);
                                if (o.hasResult()) {
                                    e.push(o);
                                    continue
                                }
                            }
                            let o = s.active.find(t => t.source == r.active.source);
                            if (o && o.isPending)
                                if (null == r.done) {
                                    let t = new E(r.active.source, 0);
                                    for (let e of r.updates) t = t.update(e, i);
                                    t.isPending || e.push(t)
                                } else this.startQuery(o)
                        }(e.length || s.open && s.open.disabled) && this.view.dispatch({
                            effects: L.of(e)
                        })
                    }
                }, {
                    eventHandlers: {
                        blur(t) {
                            let e = this.view.state.field(I, !1);
                            if (e && e.tooltip && this.view.state.facet(w).closeOnBlur) {
                                let i = e.open && (0, n.Eg)(this.view, e.open.tooltip);
                                i && i.dom.contains(t.relatedTarget) || setTimeout(() => this.view.dispatch({
                                    effects: g.of(null)
                                }), 10)
                            }
                        },
                        compositionstart() {
                            this.composing = 1
                        },
                        compositionend() {
                            3 == this.composing && setTimeout(() => this.view.dispatch({
                                effects: m.of(!1)
                            }), 20), this.composing = 0
                        }
                    }
                }),
                q = "object" == typeof navigator && /Win/.test(navigator.platform),
                H = s.Nb.highest(n.Lz.domEventHandlers({
                    keydown(t, e) {
                        let i = e.state.field(I, !1);
                        if (!i || !i.open || i.open.disabled || i.open.selected < 0 || t.key.length > 1 || t.ctrlKey && (!q || !t.altKey) || t.metaKey) return !1;
                        let s = i.open.options[i.open.selected],
                            n = i.active.find(t => t.source == s.source),
                            r = s.completion.commitCharacters || n.result.commitCharacters;
                        return r && r.indexOf(t.key) > -1 && z(e, s), !1
                    }
                })),
                _ = n.Lz.baseTheme({

                }),
                X = {
                    brackets: ["(", "[", "{", "'", '"'],
                    before: ")]}:;>",
                    stringPrefixes: []
                },
                Y = s.Pe.define({
                    map(t, e) {
                        let i = e.mapPos(t, -1, s.iR.TrackAfter);
                        return null == i ? void 0 : i
                    }
                }),
                U = new class extends s.FB {};
            U.startSide = 1, U.endSide = -1;
            const G = s.sU.define({
                create: () => s.om.empty,
                update(t, e) {
                    if (t = t.map(e.changes), e.selection) {
                        let i = e.state.doc.lineAt(e.selection.main.head);
                        t = t.update({
                            filter: t => t >= i.from && t <= i.to
                        })
                    }
                    for (let i of e.effects) i.is(Y) && (t = t.update({
                        add: [U.range(i.value, i.value + 1)]
                    }));
                    return t
                }
            });

            function K() {
                return [it, G]
            }
            const Z = "()[]{}<>«»»«［］｛｝";

            function J(t) {
                for (let e = 0; e < 16; e += 2)
                    if (Z.charCodeAt(e) == t) return Z.charAt(e + 1);
                return (0, s.MK)(t < 128 ? t : t + 1)
            }

            function tt(t, e) {
                return t.languageDataAt("closeBrackets", e)[0] || X
            }
            const et = "object" == typeof navigator && /Android\b/.test(navigator.userAgent),
                it = n.Lz.inputHandler.of((t, e, i, n) => {
                    if ((et ? t.composing : t.compositionStarted) || t.state.readOnly) return !1;
                    let r = t.state.selection.main;
                    if (n.length > 2 || 2 == n.length && 1 == (0, s.Fh)((0, s.vS)(n, 0)) || e != r.from || i != r.to) return !1;
                    let o = function(t, e) {
                        let i = tt(t, t.selection.main.head),
                            n = i.brackets || X.brackets;
                        for (let r of n) {
                            let o = J((0, s.vS)(r, 0));
                            if (e == r) return o == r ? at(t, r, n.indexOf(r + r + r) > -1, i) : ot(t, r, o, i.before || X.before);
                            if (e == o && nt(t, t.selection.main.from)) return lt(t, 0, o)
                        }
                        return null
                    }(t.state, n);
                    return !!o && (t.dispatch(o), !0)
                }),
                st = [{
                    key: "Backspace",
                    run: ({
                        state: t,
                        dispatch: e
                    }) => {
                        if (t.readOnly) return !1;
                        let i = tt(t, t.selection.main.head).brackets || X.brackets,
                            n = null,
                            r = t.changeByRange(e => {
                                if (e.empty) {
                                    let n = function(t, e) {
                                        let i = t.sliceString(e - 2, e);
                                        return (0, s.Fh)((0, s.vS)(i, 0)) == i.length ? i : i.slice(1)
                                    }(t.doc, e.head);
                                    for (let r of i)
                                        if (r == n && rt(t.doc, e.head) == J((0, s.vS)(r, 0))) return {
                                            changes: {
                                                from: e.head - r.length,
                                                to: e.head + r.length
                                            },
                                            range: s.OF.cursor(e.head - r.length)
                                        }
                                }
                                return {
                                    range: n = e
                                }
                            });
                        return n || e(t.update(r, {
                            scrollIntoView: !0,
                            userEvent: "delete.backward"
                        })), !n
                    }
                }];

            function nt(t, e) {
                let i = !1;
                return t.field(G).between(0, t.doc.length, t => {
                    t == e && (i = !0)
                }), i
            }

            function rt(t, e) {
                let i = t.sliceString(e, e + 2);
                return i.slice(0, (0, s.Fh)((0, s.vS)(i, 0)))
            }

            function ot(t, e, i, n) {
                let r = null,
                    o = t.changeByRange(o => {
                        if (!o.empty) return {
                            changes: [{
                                insert: e,
                                from: o.from
                            }, {
                                insert: i,
                                from: o.to
                            }],
                            effects: Y.of(o.to + e.length),
                            range: s.OF.range(o.anchor + e.length, o.head + e.length)
                        };
                        let l = rt(t.doc, o.head);
                        return !l || /\s/.test(l) || n.indexOf(l) > -1 ? {
                            changes: {
                                insert: e + i,
                                from: o.head
                            },
                            effects: Y.of(o.head + e.length),
                            range: s.OF.cursor(o.head + e.length)
                        } : {
                            range: r = o
                        }
                    });
                return r ? null : t.update(o, {
                    scrollIntoView: !0,
                    userEvent: "input.type"
                })
            }

            function lt(t, e, i) {
                let n = null,
                    r = t.changeByRange(e => e.empty && rt(t.doc, e.head) == i ? {
                        changes: {
                            from: e.head,
                            to: e.head + i.length,
                            insert: i
                        },
                        range: s.OF.cursor(e.head + i.length)
                    } : n = {
                        range: e
                    });
                return n ? null : t.update(r, {
                    scrollIntoView: !0,
                    userEvent: "input.type"
                })
            }

            function at(t, e, i, n) {
                let o = n.stringPrefixes || X.stringPrefixes,
                    l = null,
                    a = t.changeByRange(n => {
                        if (!n.empty) return {
                            changes: [{
                                insert: e,
                                from: n.from
                            }, {
                                insert: e,
                                from: n.to
                            }],
                            effects: Y.of(n.to + e.length),
                            range: s.OF.range(n.anchor + e.length, n.head + e.length)
                        };
                        let a, h = n.head,
                            c = rt(t.doc, h);
                        if (c == e) {
                            if (ht(t, h)) return {
                                changes: {
                                    insert: e + e,
                                    from: h
                                },
                                effects: Y.of(h + e.length),
                                range: s.OF.cursor(h + e.length)
                            };
                            if (nt(t, h)) {
                                let n = i && t.sliceDoc(h, h + 3 * e.length) == e + e + e ? e + e + e : e;
                                return {
                                    changes: {
                                        from: h,
                                        to: h + n.length,
                                        insert: n
                                    },
                                    range: s.OF.cursor(h + n.length)
                                }
                            }
                        } else {
                            if (i && t.sliceDoc(h - 2 * e.length, h) == e + e && (a = ct(t, h - 2 * e.length, o)) > -1 && ht(t, a)) return {
                                changes: {
                                    insert: e + e + e + e,
                                    from: h
                                },
                                effects: Y.of(h + e.length),
                                range: s.OF.cursor(h + e.length)
                            };
                            if (t.charCategorizer(h)(c) != s.Je.Word && ct(t, h, o) > -1 && ! function(t, e, i, s) {
                                    let n = (0, r.mv)(t).resolveInner(e, -1),
                                        o = s.reduce((t, e) => Math.max(t, e.length), 0);
                                    for (let r = 0; r < 5; r++) {
                                        let r = t.sliceDoc(n.from, Math.min(n.to, n.from + i.length + o)),
                                            l = r.indexOf(i);
                                        if (!l || l > -1 && s.indexOf(r.slice(0, l)) > -1) {
                                            let e = n.firstChild;
                                            for (; e && e.from == n.from && e.to - e.from > i.length + l;) {
                                                if (t.sliceDoc(e.to - i.length, e.to) == i) return !1;
                                                e = e.firstChild
                                            }
                                            return !0
                                        }
                                        let a = n.to == e && n.parent;
                                        if (!a) break;
                                        n = a
                                    }
                                    return !1
                                }(t, h, e, o)) return {
                                changes: {
                                    insert: e + e,
                                    from: h
                                },
                                effects: Y.of(h + e.length),
                                range: s.OF.cursor(h + e.length)
                            }
                        }
                        return {
                            range: l = n
                        }
                    });
                return l ? null : t.update(a, {
                    scrollIntoView: !0,
                    userEvent: "input.type"
                })
            }

            function ht(t, e) {
                let i = (0, r.mv)(t).resolveInner(e + 1);
                return i.parent && i.from == e
            }

            function ct(t, e, i) {
                let n = t.charCategorizer(e);
                if (n(t.sliceDoc(e - 1, e)) != s.Je.Word) return e;
                for (let r of i) {
                    let i = e - r.length;
                    if (t.sliceDoc(i, e) == r && n(t.sliceDoc(i - 1, i)) != s.Je.Word) return i
                }
                return -1
            }

            function ut(t = {}) {
                return [H, I, w.of(t), j, ft, _]
            }
            const dt = [{
                    key: "Ctrl-Space",
                    run: W
                }, {
                    mac: "Alt-`",
                    run: W
                }, {
                    mac: "Alt-i",
                    run: W
                }, {
                    key: "Escape",
                    run: t => {
                        let e = t.state.field(I, !1);
                        return !(!e || !e.active.some(t => 0 != t.state) || (t.dispatch({
                            effects: g.of(null)
                        }), 0))
                    }
                }, {
                    key: "ArrowDown",
                    run: $(!0)
                }, {
                    key: "ArrowUp",
                    run: $(!1)
                }, {
                    key: "PageDown",
                    run: $(!0, "page")
                }, {
                    key: "PageUp",
                    run: $(!1, "page")
                }, {
                    key: "Enter",
                    run: t => {
                        let e = t.state.field(I, !1);
                        return !(t.state.readOnly || !e || !e.open || e.open.selected < 0 || e.open.disabled || Date.now() - e.open.timestamp < t.state.facet(w).interactionDelay) && z(t, e.open.options[e.open.selected])
                    }
                }],
                ft = s.Nb.highest(n.w4.computeN([w], t => t.facet(w).defaultKeymap ? [dt] : []))
        },
        417(t, e, i) {
            i.d(e, {
                G: () => o
            });
            const s = "undefined" == typeof Symbol ? "__c" : Symbol.for("c"),
                n = "undefined" == typeof Symbol ? "__styleSet" + Math.floor(1e8 * Math.random()) : Symbol("styleSet"),
                r = "undefined" != typeof globalThis ? globalThis : "undefined" != typeof window ? window : {};
            class o {
                constructor(t, e) {
                    this.rules = [];
                    let {
                        finish: i
                    } = e || {};

                    function s(t) {
                        return /^@/.test(t) ? [t] : t.split(/,\s*/)
                    }

                    function n(t, e, r, o) {
                        let l = [],
                            a = /^@(\w+)\b/.exec(t[0]),
                            h = a && "keyframes" == a[1];
                        if (a && null == e) return r.push(t[0] + ";");
                        for (let i in e) {
                            let o = e[i];
                            if (/&/.test(i)) n(i.split(/,\s*/).map(e => t.map(t => e.replace(/&/, t))).reduce((t, e) => t.concat(e)), o, r);
                            else if (o && "object" == typeof o) {
                                if (!a) throw new RangeError("The value of a property (" + i + ") should be a primitive value.");
                                n(s(i), o, l, h)
                            } else null != o && l.push(i.replace(/_.*/, "").replace(/[A-Z]/g, t => "-" + t.toLowerCase()) + ": " + o + ";")
                        }(l.length || h) && r.push((!i || a || o ? t : t.map(i)).join(", ") + " {" + l.join(" ") + "}")
                    }
                    for (let e in t) n(s(e), t[e], this.rules)
                }
                getRules() {
                    return this.rules.join("\n")
                }
                static newName() {
                    let t = r[s] || 1;
                    return r[s] = t + 1, "c" + t.toString(36)
                }
                static mount(t, e, i) {
                    let s = t[n],
                        r = i && i.nonce;
                    s ? r && s.setNonce(r) : s = new a(t, r), s.mount(Array.isArray(e) ? e : [e], t)
                }
            }
            let l = new Map;
            class a {
                constructor(t, e) {
                    let i = t.ownerDocument || t,
                        s = i.defaultView;
                    if (!t.head && t.adoptedStyleSheets && s.CSSStyleSheet) {
                        let e = l.get(i);
                        if (e) return t[n] = e;
                        this.sheet = new s.CSSStyleSheet, l.set(i, this)
                    } else this.styleTag = i.createElement("style"), e && this.styleTag.setAttribute("nonce", e);
                    this.modules = [], t[n] = this
                }
                mount(t, e) {
                    let i = this.sheet,
                        s = 0,
                        n = 0;
                    for (let e = 0; e < t.length; e++) {
                        let r = t[e],
                            o = this.modules.indexOf(r);
                        if (o < n && o > -1 && (this.modules.splice(o, 1), n--, o = -1), -1 == o) {
                            if (this.modules.splice(n++, 0, r), i)
                                for (let t = 0; t < r.rules.length; t++) i.insertRule(r.rules[t], s++)
                        } else {
                            for (; n < o;) s += this.modules[n++].rules.length;
                            s += r.rules.length, n++
                        }
                    }
                    if (i) e.adoptedStyleSheets.indexOf(this.sheet) < 0 && (e.adoptedStyleSheets = [this.sheet, ...e.adoptedStyleSheets]);
                    else {
                        let t = "";
                        for (let e = 0; e < this.modules.length; e++) t += this.modules[e].getRules() + "\n";
                        this.styleTag.textContent = t;
                        let i = e.head || e;
                        this.styleTag.parentNode != i && i.insertBefore(this.styleTag, i.firstChild)
                    }
                }
                setNonce(t) {
                    this.styleTag && this.styleTag.getAttribute("nonce") != t && this.styleTag.setAttribute("nonce", t)
                }
            }
        },
        421(t, e, i) {
            i.d(e, {
                Ei: () => O
            });
            var s = i(898),
                n = i(365),
                r = i(874);
            const o = new Map([
                ["aliceblue", "#f0f8ff"],
                ["antiquewhite", "#faebd7"],
                ["aqua", "#00ffff"],
                ["aquamarine", "#7fffd4"],
                ["azure", "#f0ffff"],
                ["beige", "#f5f5dc"],
                ["bisque", "#ffe4c4"],
                ["black", "#000000"],
                ["blanchedalmond", "#ffebcd"],
                ["blue", "#0000ff"],
                ["blueviolet", "#8a2be2"],
                ["brown", "#a52a2a"],
                ["burlywood", "#deb887"],
                ["cadetblue", "#5f9ea0"],
                ["chartreuse", "#7fff00"],
                ["chocolate", "#d2691e"],
                ["coral", "#ff7f50"],
                ["cornflowerblue", "#6495ed"],
                ["cornsilk", "#fff8dc"],
                ["crimson", "#dc143c"],
                ["cyan", "#00ffff"],
                ["darkblue", "#00008b"],
                ["darkcyan", "#008b8b"],
                ["darkgoldenrod", "#b8860b"],
                ["darkgray", "#a9a9a9"],
                ["darkgreen", "#006400"],
                ["darkgrey", "#a9a9a9"],
                ["darkkhaki", "#bdb76b"],
                ["darkmagenta", "#8b008b"],
                ["darkolivegreen", "#556b2f"],
                ["darkorange", "#ff8c00"],
                ["darkorchid", "#9932cc"],
                ["darkred", "#8b0000"],
                ["darksalmon", "#e9967a"],
                ["darkseagreen", "#8fbc8f"],
                ["darkslateblue", "#483d8b"],
                ["darkslategray", "#2f4f4f"],
                ["darkslategrey", "#2f4f4f"],
                ["darkturquoise", "#00ced1"],
                ["darkviolet", "#9400d3"],
                ["deeppink", "#ff1493"],
                ["deepskyblue", "#00bfff"],
                ["dimgray", "#696969"],
                ["dimgrey", "#696969"],
                ["dodgerblue", "#1e90ff"],
                ["firebrick", "#b22222"],
                ["floralwhite", "#fffaf0"],
                ["forestgreen", "#228b22"],
                ["fuchsia", "#ff00ff"],
                ["gainsboro", "#dcdcdc"],
                ["ghostwhite", "#f8f8ff"],
                ["goldenrod", "#daa520"],
                ["gold", "#ffd700"],
                ["gray", "#808080"],
                ["green", "#008000"],
                ["greenyellow", "#adff2f"],
                ["grey", "#808080"],
                ["honeydew", "#f0fff0"],
                ["hotpink", "#ff69b4"],
                ["indianred", "#cd5c5c"],
                ["indigo", "#4b0082"],
                ["ivory", "#fffff0"],
                ["khaki", "#f0e68c"],
                ["lavenderblush", "#fff0f5"],
                ["lavender", "#e6e6fa"],
                ["lawngreen", "#7cfc00"],
                ["lemonchiffon", "#fffacd"],
                ["lightblue", "#add8e6"],
                ["lightcoral", "#f08080"],
                ["lightcyan", "#e0ffff"],
                ["lightgoldenrodyellow", "#fafad2"],
                ["lightgray", "#d3d3d3"],
                ["lightgreen", "#90ee90"],
                ["lightgrey", "#d3d3d3"],
                ["lightpink", "#ffb6c1"],
                ["lightsalmon", "#ffa07a"],
                ["lightseagreen", "#20b2aa"],
                ["lightskyblue", "#87cefa"],
                ["lightslategray", "#778899"],
                ["lightslategrey", "#778899"],
                ["lightsteelblue", "#b0c4de"],
                ["lightyellow", "#ffffe0"],
                ["lime", "#00ff00"],
                ["limegreen", "#32cd32"],
                ["linen", "#faf0e6"],
                ["magenta", "#ff00ff"],
                ["maroon", "#800000"],
                ["mediumaquamarine", "#66cdaa"],
                ["mediumblue", "#0000cd"],
                ["mediumorchid", "#ba55d3"],
                ["mediumpurple", "#9370db"],
                ["mediumseagreen", "#3cb371"],
                ["mediumslateblue", "#7b68ee"],
                ["mediumspringgreen", "#00fa9a"],
                ["mediumturquoise", "#48d1cc"],
                ["mediumvioletred", "#c71585"],
                ["midnightblue", "#191970"],
                ["mintcream", "#f5fffa"],
                ["mistyrose", "#ffe4e1"],
                ["moccasin", "#ffe4b5"],
                ["navajowhite", "#ffdead"],
                ["navy", "#000080"],
                ["oldlace", "#fdf5e6"],
                ["olive", "#808000"],
                ["olivedrab", "#6b8e23"],
                ["orange", "#ffa500"],
                ["orangered", "#ff4500"],
                ["orchid", "#da70d6"],
                ["palegoldenrod", "#eee8aa"],
                ["palegreen", "#98fb98"],
                ["paleturquoise", "#afeeee"],
                ["palevioletred", "#db7093"],
                ["papayawhip", "#ffefd5"],
                ["peachpuff", "#ffdab9"],
                ["peru", "#cd853f"],
                ["pink", "#ffc0cb"],
                ["plum", "#dda0dd"],
                ["powderblue", "#b0e0e6"],
                ["purple", "#800080"],
                ["rebeccapurple", "#663399"],
                ["red", "#ff0000"],
                ["rosybrown", "#bc8f8f"],
                ["royalblue", "#4169e1"],
                ["saddlebrown", "#8b4513"],
                ["salmon", "#fa8072"],
                ["sandybrown", "#f4a460"],
                ["seagreen", "#2e8b57"],
                ["seashell", "#fff5ee"],
                ["sienna", "#a0522d"],
                ["silver", "#c0c0c0"],
                ["skyblue", "#87ceeb"],
                ["slateblue", "#6a5acd"],
                ["slategray", "#708090"],
                ["slategrey", "#708090"],
                ["snow", "#fffafa"],
                ["springgreen", "#00ff7f"],
                ["steelblue", "#4682b4"],
                ["tan", "#d2b48c"],
                ["teal", "#008080"],
                ["thistle", "#d8bfd8"],
                ["tomato", "#ff6347"],
                ["turquoise", "#40e0d0"],
                ["violet", "#ee82ee"],
                ["wheat", "#f5deb3"],
                ["white", "#ffffff"],
                ["whitesmoke", "#f5f5f5"],
                ["yellow", "#ffff00"],
                ["yellowgreen", "#9acd32"]
            ]);
            const l = new WeakMap;
            var a = function(t) {
                return t.rgb = "RGB", t.hex = "HEX", t.named = "NAMED", t.hsl = "HSL", t
            }(a || (a = {}));
            const h = /rgb(?:a)?\(\s*(\d{1,3}%?)\s*,?\s*(\d{1,3}%?)\s*,?\s*(\d{1,3}%?)\s*([,/]\s*0?\.?\d+%?)?\)/,
                c = /hsl\(\s*(\d{1,3})\s*,\s*(\d{1,3})%\s*,\s*(\d{1,3})%\s*(,\s*0?\.\d+)?\)/,
                u = /(^|\b)(#[0-9a-f]{3,9})(\b|$)/i;

            function d(t, e) {
                const i = [],
                    n = (0, r.mv)(t.state);
                for (const o of t.visibleRanges) n.iterate({
                    from: o.from,
                    to: o.to,
                    enter: ({
                        type: o,
                        from: l,
                        to: a
                    }) => {
                        var h;
                        const c = e(n, l, a, o.name, t.state.doc, null === (h = t.state.facet(r.BH)) || void 0 === h ? void 0 : h.name);
                        if (c)
                            if (Array.isArray(c))
                                for (const t of c) i.push(s.NZ.widget({
                                    widget: new w(t),
                                    side: 1
                                }).range(t.from));
                            else i.push(s.NZ.widget({
                                widget: new w(c),
                                side: 1
                            }).range(c.from))
                    }
                });
                return s.NZ.set(i)
            }

            function f(t) {
                let e;
                if (t.endsWith("%")) {
                    const i = Number(t.slice(0, -1));
                    e = Math.round(i / 100 * 255)
                } else e = Number(t);
                return p(e)
            }

            function p(t) {
                const e = t.toString(16);
                return 1 === e.length ? "0" + e : e
            }

            function m(t) {
                const e = t.slice(1, 3),
                    i = t.slice(3, 5),
                    s = t.slice(5, 7);
                return [parseInt(e, 16), parseInt(i, 16), parseInt(s, 16)]
            }

            function g(t) {
                return t < 0 ? t + 1 : t > 1 ? t - 1 : t
            }

            function v(t, e, i) {
                return 6 * i < 1 ? e + 6 * (t - e) * i : 2 * i < 1 ? t : 3 * i < 2 ? e + (t - e) * (.666 - i) * 6 : e
            }
            const b = "css-color-picker-wrapper";
            class w extends s.xO {
                constructor(t) {
                    var {
                        color: e
                    } = t, i = function(t, e) {
                        var i = {};
                        for (var s in t) Object.prototype.hasOwnProperty.call(t, s) && e.indexOf(s) < 0 && (i[s] = t[s]);
                        if (null != t && "function" == typeof Object.getOwnPropertySymbols) {
                            var n = 0;
                            for (s = Object.getOwnPropertySymbols(t); n < s.length; n++) e.indexOf(s[n]) < 0 && Object.prototype.propertyIsEnumerable.call(t, s[n]) && (i[s[n]] = t[s[n]])
                        }
                        return i
                    }(t, ["color"]);
                    super(), this.state = i, this.color = e
                }
                eq(t) {
                    return t.state.colorType === this.state.colorType && t.color === this.color && t.state.from === this.state.from && t.state.to === this.state.to && t.state.alpha === this.state.alpha
                }
                toDOM() {
                    const t = document.createElement("input");
                    l.set(t, this.state), t.type = "color", t.value = this.color;
                    const e = document.createElement("span");
                    return e.appendChild(t), e.className = b, e
                }
                ignoreEvent() {
                    return !1
                }
            }
            const y = s.Lz.baseTheme({
                    [`.${b}`]: {
                        display: "inline-flex",
                        outline: "1px solid #000000",
                        marginRight: "5px",
                        height: "10px",
                        width: "10px",
                        transform: "translateY(1px)"
                    },
                    [`.${b} input[type="color"]`]: {
                        cursor: "pointer",
                        height: "100%",
                        width: "100%",
                        padding: 0,
                        border: "none",
                        "&::-webkit-color-swatch-wrapper": {padding: 0 },
                        "&::-webkit-color-swatch": {border: "none"},
                        "&::-moz-color-swatch": {border: "none"}
                    }
                }),
                O = [(t => s.Z9.fromClass(class {
                    constructor(e) {
                        this.decorations = d(e, t.discoverColors)
                    }
                    update(e) {
                        (e.docChanged || e.viewportChanged) && (this.decorations = d(e.view, t.discoverColors))
                    }
                }, {
                    decorations: t => t.decorations,
                    eventHandlers: {
                        change: (t, e) => {
                            const i = t.target;
                            if ("INPUT" !== i.nodeName || !i.parentElement || !i.parentElement.classList.contains(b)) return !1;
                            const s = l.get(i);
                            let n = i.value + s.alpha;
                            if (s.colorType === a.rgb) n = `rgb(${m(i.value).join(", ")}${s.alpha})`;
                            else if (s.colorType === a.named)
                                for (const [t, e] of o.entries()) e === i.value && (n = t);
                            else if (s.colorType === a.hsl) {
                                const [t, e, r] = m(i.value), [o, l, a] = function(t, e, i) {
                                    const s = t / 255,
                                        n = e / 255,
                                        r = i / 255,
                                        o = Math.min(s, n, r),
                                        l = Math.max(s, n, r),
                                        a = (l + o) / 2;
                                    if (l === o) return [0, 0, a];
                                    let h, c;
                                    for (h = a <= .5 ? (l - o) / (l + o) : (l - o) / (2 - l - o), c = l === s ? (n - r) / (l - o) : n === l ? 2 + (r - s) / (l - o) : 4 + (s - n) / (l - o), c = Math.round(60 * c); c < 0;) c += 360;
                                    return [c, h, a]
                                }(t, e, r);
                                n = `hsl(${o}, ${Math.round(100*l)}%, ${Math.round(100*a)}%${s.alpha})`
                            }
                            return e.dispatch({
                                changes: {
                                    from: s.from,
                                    to: s.to,
                                    insert: n
                                }
                            }), !0
                        }
                    }
                }))({
                    discoverColors: function t(e, i, s, r, l, d) {
                        var m;
                        switch (r) {
                            case "AttributeValue": {
                                const s = e.resolveInner(i, 0).tree;
                                if (!s) return null;
                                const r = null === (m = s.prop(n.uY.mounted)) || void 0 === m ? void 0 : m.tree;
                                if ("Styles" !== (null == r ? void 0 : r.type.name)) return null;
                                const o = [];
                                return r.iterate({
                                    from: 0,
                                    to: r.length,
                                    enter: ({
                                        type: s,
                                        from: n,
                                        to: r
                                    }) => {
                                        const a = t(e, i + 1 + n, i + 1 + r, s.name, l);
                                        if (a) {
                                            if (Array.isArray(a)) throw new Error("Unexpected nested overlays");
                                            o.push(a)
                                        }
                                    }
                                }), o
                            }
                            case "CallExpression": {
                                const t = function(t) {
                                    switch (t.slice(0, 3)) {
                                        case "rgb": {
                                            const e = h.exec(t);
                                            if (!e) return null;
                                            const [i, s, n, r, o] = e, l = function(t, e, i) {
                                                return `#${f(t)}${f(e)}${f(i)}`
                                            }(s, n, r);
                                            return {
                                                colorType: a.rgb,
                                                color: l,
                                                alpha: o || ""
                                            }
                                        }
                                        case "hsl": {
                                            const e = c.exec(t);
                                            if (!e) return null;
                                            const [i, s, n, r, o] = e, l = function(t, e, i) {
                                                const s = Number(e) / 100,
                                                    n = Number(i) / 100,
                                                    [r, o, l] = function(t, e, i) {
                                                        if (0 === e) {
                                                            const t = Math.round(255 * i);
                                                            return [t, t, t]
                                                        }
                                                        let s;
                                                        s = i < .5 ? i * (1 + e) : i + e - i * e;
                                                        const n = 2 * i - s,
                                                            r = g(.333 + (t /= 360)),
                                                            o = t,
                                                            l = g(t - .333),
                                                            a = v(s, n, r),
                                                            h = v(s, n, o),
                                                            c = v(s, n, l);
                                                        return [Math.round(255 * a), Math.round(255 * h), Math.round(255 * c)]
                                                    }(Number(t), s, n);
                                                return `#${p(r)}${p(o)}${p(l)}`
                                            }(s, n, r);
                                            return {
                                                colorType: a.hsl,
                                                color: l,
                                                alpha: o || ""
                                            }
                                        }
                                        default:
                                            return null
                                    }
                                }(l.sliceString(i, s));
                                return t ? Object.assign(Object.assign({}, t), {
                                    from: i,
                                    to: s
                                }) : null
                            }
                            case "ColorLiteral": {
                                const t = function(t) {
                                    if (!u.exec(t)) return null;
                                    const [e, i] = function(t) {
                                        return 4 === t.length ? [`#${t[1].repeat(2)}${t[2].repeat(2)}${t[3].repeat(2)}`, ""] : 5 === t.length ? [`#${t[1].repeat(2)}${t[2].repeat(2)}${t[3].repeat(2)}`, t[4].repeat(2)] : 9 === t.length ? [`#${t.slice(1,-2)}`, t.slice(-2)] : [t, ""]
                                    }(t);
                                    return {
                                        colorType: a.hex,
                                        color: e,
                                        alpha: i
                                    }
                                }(l.sliceString(i, s));
                                return t ? Object.assign(Object.assign({}, t), {
                                    from: i,
                                    to: s
                                }) : null
                            }
                            case "ValueName": {
                                const t = function(t) {
                                    const e = o.get(t);
                                    return e ? {
                                        colorType: a.named,
                                        color: e,
                                        alpha: ""
                                    } : null
                                }(l.sliceString(i, s));
                                return t ? Object.assign(Object.assign({}, t), {
                                    from: i,
                                    to: s
                                }) : null
                            }
                            default:
                                return null
                        }
                    }
                }), y]
        },
        638(t, e, i) {
            i.d(e, {
                YH: () => ut,
                Gu: () => P,
                VR: () => D,
                Je: () => xt,
                OF: () => F,
                $t: () => Ct,
                sj: () => V,
                iR: () => T,
                Nb: () => K,
                om: () => Rt,
                vB: () => Et,
                FB: () => Mt,
                Pe: () => pt,
                sU: () => U,
                EY: () => p,
                ZX: () => mt,
                vS: () => C,
                Fh: () => M,
                QR: () => At,
                y$: () => qt,
                zK: () => S,
                kn: () => Ht,
                MK: () => A
            });
            let s = [],
                n = [];

            function r(t) {
                if (t < 768) return !1;
                for (let e = 0, i = s.length;;) {
                    let r = e + i >> 1;
                    if (t < s[r]) i = r;
                    else {
                        if (!(t >= n[r])) return !0;
                        e = r + 1
                    }
                    if (e == i) return !1
                }
            }

            function o(t) {
                return t >= 127462 && t <= 127487
            }

            function l(t, e, i = !0, s = !0) {
                return (i ? a : h)(t, e, s)
            }

            function a(t, e, i) {
                if (e == t.length) return e;
                e && u(t.charCodeAt(e)) && d(t.charCodeAt(e - 1)) && e--;
                let s = c(t, e);
                for (e += f(s); e < t.length;) {
                    let n = c(t, e);
                    if (8205 == s || 8205 == n || i && r(n)) e += f(n), s = n;
                    else {
                        if (!o(n)) break;
                        {
                            let i = 0,
                                s = e - 2;
                            for (; s >= 0 && o(c(t, s));) i++, s -= 2;
                            if (i % 2 == 0) break;
                            e += 2
                        }
                    }
                }
                return e
            }

            function h(t, e, i) {
                for (; e > 0;) {
                    let s = a(t, e - 2, i);
                    if (s < e) return s;
                    e--
                }
                return 0
            }

            function c(t, e) {
                let i = t.charCodeAt(e);
                if (!d(i) || e + 1 == t.length) return i;
                let s = t.charCodeAt(e + 1);
                return u(s) ? s - 56320 + (i - 55296 << 10) + 65536 : i
            }

            function u(t) {
                return t >= 56320 && t < 57344
            }

            function d(t) {
                return t >= 55296 && t < 56320
            }

            function f(t) {
                return t < 65536 ? 1 : 2
            }(() => {
                let t = "lc,34,7n,7,7b,19,,,,2,,2,,,20,b,1c,l,g,,2t,7,2,6,2,2,,4,z,,u,r,2j,b,1m,9,9,,o,4,,9,,3,,5,17,3,3b,f,,w,1j,,,,4,8,4,,3,7,a,2,t,,1m,,,,2,4,8,,9,,a,2,q,,2,2,1l,,4,2,4,2,2,3,3,,u,2,3,,b,2,1l,,4,5,,2,4,,k,2,m,6,,,1m,,,2,,4,8,,7,3,a,2,u,,1n,,,,c,,9,,14,,3,,1l,3,5,3,,4,7,2,b,2,t,,1m,,2,,2,,3,,5,2,7,2,b,2,s,2,1l,2,,,2,4,8,,9,,a,2,t,,20,,4,,2,3,,,8,,29,,2,7,c,8,2q,,2,9,b,6,22,2,r,,,,,,1j,e,,5,,2,5,b,,10,9,,2u,4,,6,,2,2,2,p,2,4,3,g,4,d,,2,2,6,,f,,jj,3,qa,3,t,3,t,2,u,2,1s,2,,7,8,,2,b,9,,19,3,3b,2,y,,3a,3,4,2,9,,6,3,63,2,2,,1m,,,7,,,,,2,8,6,a,2,,1c,h,1r,4,1c,7,,,5,,14,9,c,2,w,4,2,2,,3,1k,,,2,3,,,3,1m,8,2,2,48,3,,d,,7,4,,6,,3,2,5i,1m,,5,ek,,5f,x,2da,3,3x,,2o,w,fe,6,2x,2,n9w,4,,a,w,2,28,2,7k,,3,,4,,p,2,5,,47,2,q,i,d,,12,8,p,b,1a,3,1c,,2,4,2,2,13,,1v,6,2,2,2,2,c,,8,,1b,,1f,,,3,2,2,5,2,,,16,2,8,,6m,,2,,4,,fn4,,kh,g,g,g,a6,2,gt,,6a,,45,5,1ae,3,,2,5,4,14,3,4,,4l,2,fx,4,ar,2,49,b,4w,,1i,f,1k,3,1d,4,2,2,1x,3,10,5,,8,1q,,c,2,1g,9,a,4,2,,2n,3,2,,,2,6,,4g,,3,8,l,2,1l,2,,,,,m,,e,7,3,5,5f,8,2,3,,,n,,29,,2,6,,,2,,,2,,2,6j,,2,4,6,2,,2,r,2,2d,8,2,,,2,2y,,,,2,6,,,2t,3,2,4,,5,77,9,,2,6t,,a,2,,,4,,40,4,2,2,4,,w,a,14,6,2,4,8,,9,6,2,3,1a,d,,2,ba,7,,6,,,2a,m,2,7,,2,,2,3e,6,3,,,2,,7,,,20,2,3,,,,9n,2,f0b,5,1n,7,t4,,1r,4,29,,f5k,2,43q,,,3,4,5,8,8,2,7,u,4,44,3,1iz,1j,4,1e,8,,e,,m,5,,f,11s,7,,h,2,7,,2,,5,79,7,c5,4,15s,7,31,7,240,5,gx7k,2o,3k,6o".split(",").map(t => t ? parseInt(t, 36) : 1);
                for (let e = 0, i = 0; e < t.length; e++)(e % 2 ? n : s).push(i += t[e])
            })();
            class p {
                lineAt(t) {
                    if (t < 0 || t > this.length) throw new RangeError(`Invalid position ${t} in document of length ${this.length}`);
                    return this.lineInner(t, !1, 1, 0)
                }
                line(t) {
                    if (t < 1 || t > this.lines) throw new RangeError(`Invalid line number ${t} in ${this.lines}-line document`);
                    return this.lineInner(t, !0, 1, 0)
                }
                replace(t, e, i) {
                    [t, e] = k(this, t, e);
                    let s = [];
                    return this.decompose(0, t, s, 2), i.length && i.decompose(0, i.length, s, 3), this.decompose(e, this.length, s, 1), g.from(s, this.length - (e - t) + i.length)
                }
                append(t) {
                    return this.replace(this.length, this.length, t)
                }
                slice(t, e = this.length) {
                    [t, e] = k(this, t, e);
                    let i = [];
                    return this.decompose(t, e, i, 0), g.from(i, e - t)
                }
                eq(t) {
                    if (t == this) return !0;
                    if (t.length != this.length || t.lines != this.lines) return !1;
                    let e = this.scanIdentical(t, 1),
                        i = this.length - this.scanIdentical(t, -1),
                        s = new w(this),
                        n = new w(t);
                    for (let t = e, r = e;;) {
                        if (s.next(t), n.next(t), t = 0, s.lineBreak != n.lineBreak || s.done != n.done || s.value != n.value) return !1;
                        if (r += s.value.length, s.done || r >= i) return !0
                    }
                }
                iter(t = 1) {
                    return new w(this, t)
                }
                iterRange(t, e = this.length) {
                    return new y(this, t, e)
                }
                iterLines(t, e) {
                    let i;
                    if (null == t) i = this.iter();
                    else {
                        null == e && (e = this.lines + 1);
                        let s = this.line(t).from;
                        i = this.iterRange(s, Math.max(s, e == this.lines + 1 ? this.length : e <= 1 ? 0 : this.line(e - 1).to))
                    }
                    return new O(i)
                }
                toString() {
                    return this.sliceString(0)
                }
                toJSON() {
                    let t = [];
                    return this.flatten(t), t
                }
                constructor() {}
                static of (t) {
                    if (0 == t.length) throw new RangeError("A document must have at least one line");
                    return 1 != t.length || t[0] ? t.length <= 32 ? new m(t) : g.from(m.split(t, [])) : p.empty
                }
            }
            class m extends p {
                constructor(t, e = function(t) {
                    let e = -1;
                    for (let i of t) e += i.length + 1;
                    return e
                }(t)) {
                    super(), this.text = t, this.length = e
                }
                get lines() {
                    return this.text.length
                }
                get children() {
                    return null
                }
                lineInner(t, e, i, s) {
                    for (let n = 0;; n++) {
                        let r = this.text[n],
                            o = s + r.length;
                        if ((e ? i : o) >= t) return new x(s, o, i, r);
                        s = o + 1, i++
                    }
                }
                decompose(t, e, i, s) {
                    let n = t <= 0 && e >= this.length ? this : new m(b(this.text, t, e), Math.min(e, this.length) - Math.max(0, t));
                    if (1 & s) {
                        let t = i.pop(),
                            e = v(n.text, t.text.slice(), 0, n.length);
                        if (e.length <= 32) i.push(new m(e, t.length + n.length));
                        else {
                            let t = e.length >> 1;
                            i.push(new m(e.slice(0, t)), new m(e.slice(t)))
                        }
                    } else i.push(n)
                }
                replace(t, e, i) {
                    if (!(i instanceof m)) return super.replace(t, e, i);
                    [t, e] = k(this, t, e);
                    let s = v(this.text, v(i.text, b(this.text, 0, t)), e),
                        n = this.length + i.length - (e - t);
                    return s.length <= 32 ? new m(s, n) : g.from(m.split(s, []), n)
                }
                sliceString(t, e = this.length, i = "\n") {
                    [t, e] = k(this, t, e);
                    let s = "";
                    for (let n = 0, r = 0; n <= e && r < this.text.length; r++) {
                        let o = this.text[r],
                            l = n + o.length;
                        n > t && r && (s += i), t < l && e > n && (s += o.slice(Math.max(0, t - n), e - n)), n = l + 1
                    }
                    return s
                }
                flatten(t) {
                    for (let e of this.text) t.push(e)
                }
                scanIdentical() {
                    return 0
                }
                static split(t, e) {
                    let i = [],
                        s = -1;
                    for (let n of t) i.push(n), s += n.length + 1, 32 == i.length && (e.push(new m(i, s)), i = [], s = -1);
                    return s > -1 && e.push(new m(i, s)), e
                }
            }
            class g extends p {
                constructor(t, e) {
                    super(), this.children = t, this.length = e, this.lines = 0;
                    for (let e of t) this.lines += e.lines
                }
                lineInner(t, e, i, s) {
                    for (let n = 0;; n++) {
                        let r = this.children[n],
                            o = s + r.length,
                            l = i + r.lines - 1;
                        if ((e ? l : o) >= t) return r.lineInner(t, e, i, s);
                        s = o + 1, i = l + 1
                    }
                }
                decompose(t, e, i, s) {
                    for (let n = 0, r = 0; r <= e && n < this.children.length; n++) {
                        let o = this.children[n],
                            l = r + o.length;
                        if (t <= l && e >= r) {
                            let n = s & ((r <= t ? 1 : 0) | (l >= e ? 2 : 0));
                            r >= t && l <= e && !n ? i.push(o) : o.decompose(t - r, e - r, i, n)
                        }
                        r = l + 1
                    }
                }
                replace(t, e, i) {
                    if ([t, e] = k(this, t, e), i.lines < this.lines)
                        for (let s = 0, n = 0; s < this.children.length; s++) {
                            let r = this.children[s],
                                o = n + r.length;
                            if (t >= n && e <= o) {
                                let l = r.replace(t - n, e - n, i),
                                    a = this.lines - r.lines + l.lines;
                                if (l.lines < a >> 4 && l.lines > a >> 6) {
                                    let n = this.children.slice();
                                    return n[s] = l, new g(n, this.length - (e - t) + i.length)
                                }
                                return super.replace(n, o, l)
                            }
                            n = o + 1
                        }
                    return super.replace(t, e, i)
                }
                sliceString(t, e = this.length, i = "\n") {
                    [t, e] = k(this, t, e);
                    let s = "";
                    for (let n = 0, r = 0; n < this.children.length && r <= e; n++) {
                        let o = this.children[n],
                            l = r + o.length;
                        r > t && n && (s += i), t < l && e > r && (s += o.sliceString(t - r, e - r, i)), r = l + 1
                    }
                    return s
                }
                flatten(t) {
                    for (let e of this.children) e.flatten(t)
                }
                scanIdentical(t, e) {
                    if (!(t instanceof g)) return 0;
                    let i = 0,
                        [s, n, r, o] = e > 0 ? [0, 0, this.children.length, t.children.length] : [this.children.length - 1, t.children.length - 1, -1, -1];
                    for (;; s += e, n += e) {
                        if (s == r || n == o) return i;
                        let l = this.children[s],
                            a = t.children[n];
                        if (l != a) return i + l.scanIdentical(a, e);
                        i += l.length + 1
                    }
                }
                static from(t, e = t.reduce((t, e) => t + e.length + 1, -1)) {
                    let i = 0;
                    for (let e of t) i += e.lines;
                    if (i < 32) {
                        let i = [];
                        for (let e of t) e.flatten(i);
                        return new m(i, e)
                    }
                    let s = Math.max(32, i >> 5),
                        n = s << 1,
                        r = s >> 1,
                        o = [],
                        l = 0,
                        a = -1,
                        h = [];

                    function c(t) {
                        let e;
                        if (t.lines > n && t instanceof g)
                            for (let e of t.children) c(e);
                        else t.lines > r && (l > r || !l) ? (u(), o.push(t)) : t instanceof m && l && (e = h[h.length - 1]) instanceof m && t.lines + e.lines <= 32 ? (l += t.lines, a += t.length + 1, h[h.length - 1] = new m(e.text.concat(t.text), e.length + 1 + t.length)) : (l + t.lines > s && u(), l += t.lines, a += t.length + 1, h.push(t))
                    }

                    function u() {
                        0 != l && (o.push(1 == h.length ? h[0] : g.from(h, a)), a = -1, l = h.length = 0)
                    }
                    for (let e of t) c(e);
                    return u(), 1 == o.length ? o[0] : new g(o, e)
                }
            }

            function v(t, e, i = 0, s = 1e9) {
                for (let n = 0, r = 0, o = !0; r < t.length && n <= s; r++) {
                    let l = t[r],
                        a = n + l.length;
                    a >= i && (a > s && (l = l.slice(0, s - n)), n < i && (l = l.slice(i - n)), o ? (e[e.length - 1] += l, o = !1) : e.push(l)), n = a + 1
                }
                return e
            }

            function b(t, e, i) {
                return v(t, [""], e, i)
            }
            p.empty = new m([""], 0);
            class w {
                constructor(t, e = 1) {
                    this.dir = e, this.done = !1, this.lineBreak = !1, this.value = "", this.nodes = [t], this.offsets = [e > 0 ? 1 : (t instanceof m ? t.text.length : t.children.length) << 1]
                }
                nextInner(t, e) {
                    for (this.done = this.lineBreak = !1;;) {
                        let i = this.nodes.length - 1,
                            s = this.nodes[i],
                            n = this.offsets[i],
                            r = n >> 1,
                            o = s instanceof m ? s.text.length : s.children.length;
                        if (r == (e > 0 ? o : 0)) {
                            if (0 == i) return this.done = !0, this.value = "", this;
                            e > 0 && this.offsets[i - 1]++, this.nodes.pop(), this.offsets.pop()
                        } else if ((1 & n) == (e > 0 ? 0 : 1)) {
                            if (this.offsets[i] += e, 0 == t) return this.lineBreak = !0, this.value = "\n", this;
                            t--
                        } else if (s instanceof m) {
                            let n = s.text[r + (e < 0 ? -1 : 0)];
                            if (this.offsets[i] += e, n.length > Math.max(0, t)) return this.value = 0 == t ? n : e > 0 ? n.slice(t) : n.slice(0, n.length - t), this;
                            t -= n.length
                        } else {
                            let n = s.children[r + (e < 0 ? -1 : 0)];
                            t > n.length ? (t -= n.length, this.offsets[i] += e) : (e < 0 && this.offsets[i]--, this.nodes.push(n), this.offsets.push(e > 0 ? 1 : (n instanceof m ? n.text.length : n.children.length) << 1))
                        }
                    }
                }
                next(t = 0) {
                    return t < 0 && (this.nextInner(-t, -this.dir), t = this.value.length), this.nextInner(t, this.dir)
                }
            }
            class y {
                constructor(t, e, i) {
                    this.value = "", this.done = !1, this.cursor = new w(t, e > i ? -1 : 1), this.pos = e > i ? t.length : 0, this.from = Math.min(e, i), this.to = Math.max(e, i)
                }
                nextInner(t, e) {
                    if (e < 0 ? this.pos <= this.from : this.pos >= this.to) return this.value = "", this.done = !0, this;
                    t += Math.max(0, e < 0 ? this.pos - this.to : this.from - this.pos);
                    let i = e < 0 ? this.pos - this.from : this.to - this.pos;
                    t > i && (t = i), i -= t;
                    let {
                        value: s
                    } = this.cursor.next(t);
                    return this.pos += (s.length + t) * e, this.value = s.length <= i ? s : e < 0 ? s.slice(s.length - i) : s.slice(0, i), this.done = !this.value, this
                }
                next(t = 0) {
                    return t < 0 ? t = Math.max(t, this.from - this.pos) : t > 0 && (t = Math.min(t, this.to - this.pos)), this.nextInner(t, this.cursor.dir)
                }
                get lineBreak() {
                    return this.cursor.lineBreak && "" != this.value
                }
            }
            class O {
                constructor(t) {
                    this.inner = t, this.afterBreak = !0, this.value = "", this.done = !1
                }
                next(t = 0) {
                    let {
                        done: e,
                        lineBreak: i,
                        value: s
                    } = this.inner.next(t);
                    return e && this.afterBreak ? (this.value = "", this.afterBreak = !1) : e ? (this.done = !0, this.value = "") : i ? this.afterBreak ? this.value = "" : (this.afterBreak = !0, this.next()) : (this.value = s, this.afterBreak = !1), this
                }
                get lineBreak() {
                    return !1
                }
            }
            "undefined" != typeof Symbol && (p.prototype[Symbol.iterator] = function() {
                return this.iter()
            }, w.prototype[Symbol.iterator] = y.prototype[Symbol.iterator] = O.prototype[Symbol.iterator] = function() {
                return this
            });
            class x {
                constructor(t, e, i, s) {
                    this.from = t, this.to = e, this.number = i, this.text = s
                }
                get length() {
                    return this.to - this.from
                }
            }

            function k(t, e, i) {
                return [e = Math.max(0, Math.min(t.length, e)), Math.max(e, Math.min(t.length, i))]
            }

            function S(t, e, i = !0, s = !0) {
                return l(t, e, i, s)
            }

            function C(t, e) {
                let i = t.charCodeAt(e);
                if (!((s = i) >= 55296 && s < 56320 && e + 1 != t.length)) return i;
                var s;
                let n = t.charCodeAt(e + 1);
                return function(t) {
                    return t >= 56320 && t < 57344
                }(n) ? n - 56320 + (i - 55296 << 10) + 65536 : i
            }

            function A(t) {
                return t <= 65535 ? String.fromCharCode(t) : (t -= 65536, String.fromCharCode(55296 + (t >> 10), 56320 + (1023 & t)))
            }

            function M(t) {
                return t < 65536 ? 1 : 2
            }
            const Q = /\r\n?|\n/;
            var T = function(t) {
                return t[t.Simple = 0] = "Simple", t[t.TrackDel = 1] = "TrackDel", t[t.TrackBefore = 2] = "TrackBefore", t[t.TrackAfter = 3] = "TrackAfter", t
            }(T || (T = {}));
            class P {
                constructor(t) {
                    this.sections = t
                }
                get length() {
                    let t = 0;
                    for (let e = 0; e < this.sections.length; e += 2) t += this.sections[e];
                    return t
                }
                get newLength() {
                    let t = 0;
                    for (let e = 0; e < this.sections.length; e += 2) {
                        let i = this.sections[e + 1];
                        t += i < 0 ? this.sections[e] : i
                    }
                    return t
                }
                get empty() {
                    return 0 == this.sections.length || 2 == this.sections.length && this.sections[1] < 0
                }
                iterGaps(t) {
                    for (let e = 0, i = 0, s = 0; e < this.sections.length;) {
                        let n = this.sections[e++],
                            r = this.sections[e++];
                        r < 0 ? (t(i, s, n), s += n) : s += r, i += n
                    }
                }
                iterChangedRanges(t, e = !1) {
                    B(this, t, e)
                }
                get invertedDesc() {
                    let t = [];
                    for (let e = 0; e < this.sections.length;) {
                        let i = this.sections[e++],
                            s = this.sections[e++];
                        s < 0 ? t.push(i, s) : t.push(s, i)
                    }
                    return new P(t)
                }
                composeDesc(t) {
                    return this.empty ? t : t.empty ? this : N(this, t)
                }
                mapDesc(t, e = !1) {
                    return t.empty ? this : L(this, t, e)
                }
                mapPos(t, e = -1, i = T.Simple) {
                    let s = 0,
                        n = 0;
                    for (let r = 0; r < this.sections.length;) {
                        let o = this.sections[r++],
                            l = this.sections[r++],
                            a = s + o;
                        if (l < 0) {
                            if (a > t) return n + (t - s);
                            n += o
                        } else {
                            if (i != T.Simple && a >= t && (i == T.TrackDel && s < t && a > t || i == T.TrackBefore && s < t || i == T.TrackAfter && a > t)) return null;
                            if (a > t || a == t && e < 0 && !o) return t == s || e < 0 ? n : n + l;
                            n += l
                        }
                        s = a
                    }
                    if (t > s) throw new RangeError(`Position ${t} is out of range for changeset of length ${s}`);
                    return n
                }
                touchesRange(t, e = t) {
                    for (let i = 0, s = 0; i < this.sections.length && s <= e;) {
                        let n = s + this.sections[i++];
                        if (this.sections[i++] >= 0 && s <= e && n >= t) return !(s < t && n > e) || "cover";
                        s = n
                    }
                    return !1
                }
                toString() {
                    let t = "";
                    for (let e = 0; e < this.sections.length;) {
                        let i = this.sections[e++],
                            s = this.sections[e++];
                        t += (t ? " " : "") + i + (s >= 0 ? ":" + s : "")
                    }
                    return t
                }
                toJSON() {
                    return this.sections
                }
                static fromJSON(t) {
                    if (!Array.isArray(t) || t.length % 2 || t.some(t => "number" != typeof t)) throw new RangeError("Invalid JSON representation of ChangeDesc");
                    return new P(t)
                }
                static create(t) {
                    return new P(t)
                }
            }
            class D extends P {
                constructor(t, e) {
                    super(t), this.inserted = e
                }
                apply(t) {
                    if (this.length != t.length) throw new RangeError("Applying change set to a document with the wrong length");
                    return B(this, (e, i, s, n, r) => t = t.replace(s, s + (i - e), r), !1), t
                }
                mapDesc(t, e = !1) {
                    return L(this, t, e, !0)
                }
                invert(t) {
                    let e = this.sections.slice(),
                        i = [];
                    for (let s = 0, n = 0; s < e.length; s += 2) {
                        let r = e[s],
                            o = e[s + 1];
                        if (o >= 0) {
                            e[s] = o, e[s + 1] = r;
                            let l = s >> 1;
                            for (; i.length < l;) i.push(p.empty);
                            i.push(r ? t.slice(n, n + r) : p.empty)
                        }
                        n += r
                    }
                    return new D(e, i)
                }
                compose(t) {
                    return this.empty ? t : t.empty ? this : N(this, t, !0)
                }
                map(t, e = !1) {
                    return t.empty ? this : L(this, t, e, !0)
                }
                iterChanges(t, e = !1) {
                    B(this, t, e)
                }
                get desc() {
                    return P.create(this.sections)
                }
                filter(t) {
                    let e = [],
                        i = [],
                        s = [],
                        n = new I(this);
                    t: for (let r = 0, o = 0;;) {
                        let l = r == t.length ? 1e9 : t[r++];
                        for (; o < l || o == l && 0 == n.len;) {
                            if (n.done) break t;
                            let t = Math.min(n.len, l - o);
                            R(s, t, -1);
                            let r = -1 == n.ins ? -1 : 0 == n.off ? n.ins : 0;
                            R(e, t, r), r > 0 && E(i, e, n.text), n.forward(t), o += t
                        }
                        let a = t[r++];
                        for (; o < a;) {
                            if (n.done) break t;
                            let t = Math.min(n.len, a - o);
                            R(e, t, -1), R(s, t, -1 == n.ins ? -1 : 0 == n.off ? n.ins : 0), n.forward(t), o += t
                        }
                    }
                    return {
                        changes: new D(e, i),
                        filtered: P.create(s)
                    }
                }
                toJSON() {
                    let t = [];
                    for (let e = 0; e < this.sections.length; e += 2) {
                        let i = this.sections[e],
                            s = this.sections[e + 1];
                        s < 0 ? t.push(i) : 0 == s ? t.push([i]) : t.push([i].concat(this.inserted[e >> 1].toJSON()))
                    }
                    return t
                }
                static of (t, e, i) {
                    let s = [],
                        n = [],
                        r = 0,
                        o = null;

                    function l(t = !1) {
                        if (!t && !s.length) return;
                        r < e && R(s, e - r, -1);
                        let i = new D(s, n);
                        o = o ? o.compose(i.map(o)) : i, s = [], n = [], r = 0
                    }
                    return function t(a) {
                        if (Array.isArray(a))
                            for (let e of a) t(e);
                        else if (a instanceof D) {
                            if (a.length != e) throw new RangeError(`Mismatched change set length (got ${a.length}, expected ${e})`);
                            l(), o = o ? o.compose(a.map(o)) : a
                        } else {
                            let {
                                from: t,
                                to: o = t,
                                insert: h
                            } = a;
                            if (t > o || t < 0 || o > e) throw new RangeError(`Invalid change range ${t} to ${o} (in doc of length ${e})`);
                            let c = h ? "string" == typeof h ? p.of(h.split(i || Q)) : h : p.empty,
                                u = c.length;
                            if (t == o && 0 == u) return;
                            t < r && l(), t > r && R(s, t - r, -1), R(s, o - t, u), E(n, s, c), r = o
                        }
                    }(t), l(!o), o
                }
                static empty(t) {
                    return new D(t ? [t, -1] : [], [])
                }
                static fromJSON(t) {
                    if (!Array.isArray(t)) throw new RangeError("Invalid JSON representation of ChangeSet");
                    let e = [],
                        i = [];
                    for (let s = 0; s < t.length; s++) {
                        let n = t[s];
                        if ("number" == typeof n) e.push(n, -1);
                        else {
                            if (!Array.isArray(n) || "number" != typeof n[0] || n.some((t, e) => e && "string" != typeof t)) throw new RangeError("Invalid JSON representation of ChangeSet");
                            if (1 == n.length) e.push(n[0], 0);
                            else {
                                for (; i.length < s;) i.push(p.empty);
                                i[s] = p.of(n.slice(1)), e.push(n[0], i[s].length)
                            }
                        }
                    }
                    return new D(e, i)
                }
                static createSet(t, e) {
                    return new D(t, e)
                }
            }

            function R(t, e, i, s = !1) {
                if (0 == e && i <= 0) return;
                let n = t.length - 2;
                n >= 0 && i <= 0 && i == t[n + 1] ? t[n] += e : n >= 0 && 0 == e && 0 == t[n] ? t[n + 1] += i : s ? (t[n] += e, t[n + 1] += i) : t.push(e, i)
            }

            function E(t, e, i) {
                if (0 == i.length) return;
                let s = e.length - 2 >> 1;
                if (s < t.length) t[t.length - 1] = t[t.length - 1].append(i);
                else {
                    for (; t.length < s;) t.push(p.empty);
                    t.push(i)
                }
            }

            function B(t, e, i) {
                let s = t.inserted;
                for (let n = 0, r = 0, o = 0; o < t.sections.length;) {
                    let l = t.sections[o++],
                        a = t.sections[o++];
                    if (a < 0) n += l, r += l;
                    else {
                        let h = n,
                            c = r,
                            u = p.empty;
                        for (; h += l, c += a, a && s && (u = u.append(s[o - 2 >> 1])), !(i || o == t.sections.length || t.sections[o + 1] < 0);) l = t.sections[o++], a = t.sections[o++];
                        e(n, h, r, c, u), n = h, r = c
                    }
                }
            }

            function L(t, e, i, s = !1) {
                let n = [],
                    r = s ? [] : null,
                    o = new I(t),
                    l = new I(e);
                for (let t = -1;;) {
                    if (o.done && l.len || l.done && o.len) throw new Error("Mismatched change set lengths");
                    if (-1 == o.ins && -1 == l.ins) {
                        let t = Math.min(o.len, l.len);
                        R(n, t, -1), o.forward(t), l.forward(t)
                    } else if (l.ins >= 0 && (o.ins < 0 || t == o.i || 0 == o.off && (l.len < o.len || l.len == o.len && !i))) {
                        let e = l.len;
                        for (R(n, l.ins, -1); e;) {
                            let i = Math.min(o.len, e);
                            o.ins >= 0 && t < o.i && o.len <= i && (R(n, 0, o.ins), r && E(r, n, o.text), t = o.i), o.forward(i), e -= i
                        }
                        l.next()
                    } else {
                        if (!(o.ins >= 0)) {
                            if (o.done && l.done) return r ? D.createSet(n, r) : P.create(n);
                            throw new Error("Mismatched change set lengths")
                        } {
                            let e = 0,
                                i = o.len;
                            for (; i;)
                                if (-1 == l.ins) {
                                    let t = Math.min(i, l.len);
                                    e += t, i -= t, l.forward(t)
                                } else {
                                    if (!(0 == l.ins && l.len < i)) break;
                                    i -= l.len, l.next()
                                } R(n, e, t < o.i ? o.ins : 0), r && t < o.i && E(r, n, o.text), t = o.i, o.forward(o.len - i)
                        }
                    }
                }
            }

            function N(t, e, i = !1) {
                let s = [],
                    n = i ? [] : null,
                    r = new I(t),
                    o = new I(e);
                for (let t = !1;;) {
                    if (r.done && o.done) return n ? D.createSet(s, n) : P.create(s);
                    if (0 == r.ins) R(s, r.len, 0, t), r.next();
                    else if (0 != o.len || o.done) {
                        if (r.done || o.done) throw new Error("Mismatched change set lengths");
                        {
                            let e = Math.min(r.len2, o.len),
                                i = s.length;
                            if (-1 == r.ins) {
                                let i = -1 == o.ins ? -1 : o.off ? 0 : o.ins;
                                R(s, e, i, t), n && i && E(n, s, o.text)
                            } else - 1 == o.ins ? (R(s, r.off ? 0 : r.len, e, t), n && E(n, s, r.textBit(e))) : (R(s, r.off ? 0 : r.len, o.off ? 0 : o.ins, t), n && !o.off && E(n, s, o.text));
                            t = (r.ins > e || o.ins >= 0 && o.len > e) && (t || s.length > i), r.forward2(e), o.forward(e)
                        }
                    } else R(s, 0, o.ins, t), n && E(n, s, o.text), o.next()
                }
            }
            class I {
                constructor(t) {
                    this.set = t, this.i = 0, this.next()
                }
                next() {
                    let {
                        sections: t
                    } = this.set;
                    this.i < t.length ? (this.len = t[this.i++], this.ins = t[this.i++]) : (this.len = 0, this.ins = -2), this.off = 0
                }
                get done() {
                    return -2 == this.ins
                }
                get len2() {
                    return this.ins < 0 ? this.len : this.ins
                }
                get text() {
                    let {
                        inserted: t
                    } = this.set, e = this.i - 2 >> 1;
                    return e >= t.length ? p.empty : t[e]
                }
                textBit(t) {
                    let {
                        inserted: e
                    } = this.set, i = this.i - 2 >> 1;
                    return i >= e.length && !t ? p.empty : e[i].slice(this.off, null == t ? void 0 : this.off + t)
                }
                forward(t) {
                    t == this.len ? this.next() : (this.len -= t, this.off += t)
                }
                forward2(t) {
                    -1 == this.ins ? this.forward(t) : t == this.ins ? this.next() : (this.ins -= t, this.off += t)
                }
            }
            class z {
                constructor(t, e, i) {
                    this.from = t, this.to = e, this.flags = i
                }
                get anchor() {
                    return 32 & this.flags ? this.to : this.from
                }
                get head() {
                    return 32 & this.flags ? this.from : this.to
                }
                get empty() {
                    return this.from == this.to
                }
                get assoc() {
                    return 8 & this.flags ? -1 : 16 & this.flags ? 1 : 0
                }
                get bidiLevel() {
                    let t = 7 & this.flags;
                    return 7 == t ? null : t
                }
                get goalColumn() {
                    let t = this.flags >> 6;
                    return 16777215 == t ? void 0 : t
                }
                map(t, e = -1) {
                    let i, s;
                    return this.empty ? i = s = t.mapPos(this.from, e) : (i = t.mapPos(this.from, 1), s = t.mapPos(this.to, -1)), i == this.from && s == this.to ? this : new z(i, s, this.flags)
                }
                extend(t, e = t) {
                    if (t <= this.anchor && e >= this.anchor) return F.range(t, e);
                    let i = Math.abs(t - this.anchor) > Math.abs(e - this.anchor) ? t : e;
                    return F.range(this.anchor, i)
                }
                eq(t, e = !1) {
                    return !(this.anchor != t.anchor || this.head != t.head || this.goalColumn != t.goalColumn || e && this.empty && this.assoc != t.assoc)
                }
                toJSON() {
                    return {
                        anchor: this.anchor,
                        head: this.head
                    }
                }
                static fromJSON(t) {
                    if (!t || "number" != typeof t.anchor || "number" != typeof t.head) throw new RangeError("Invalid JSON representation for SelectionRange");
                    return F.range(t.anchor, t.head)
                }
                static create(t, e, i) {
                    return new z(t, e, i)
                }
            }
            class F {
                constructor(t, e) {
                    this.ranges = t, this.mainIndex = e
                }
                map(t, e = -1) {
                    return t.empty ? this : F.create(this.ranges.map(i => i.map(t, e)), this.mainIndex)
                }
                eq(t, e = !1) {
                    if (this.ranges.length != t.ranges.length || this.mainIndex != t.mainIndex) return !1;
                    for (let i = 0; i < this.ranges.length; i++)
                        if (!this.ranges[i].eq(t.ranges[i], e)) return !1;
                    return !0
                }
                get main() {
                    return this.ranges[this.mainIndex]
                }
                asSingle() {
                    return 1 == this.ranges.length ? this : new F([this.main], 0)
                }
                addRange(t, e = !0) {
                    return F.create([t].concat(this.ranges), e ? 0 : this.mainIndex + 1)
                }
                replaceRange(t, e = this.mainIndex) {
                    let i = this.ranges.slice();
                    return i[e] = t, F.create(i, this.mainIndex)
                }
                toJSON() {
                    return {
                        ranges: this.ranges.map(t => t.toJSON()),
                        main: this.mainIndex
                    }
                }
                static fromJSON(t) {
                    if (!t || !Array.isArray(t.ranges) || "number" != typeof t.main || t.main >= t.ranges.length) throw new RangeError("Invalid JSON representation for EditorSelection");
                    return new F(t.ranges.map(t => z.fromJSON(t)), t.main)
                }
                static single(t, e = t) {
                    return new F([F.range(t, e)], 0)
                }
                static create(t, e = 0) {
                    if (0 == t.length) throw new RangeError("A selection needs at least one range");
                    for (let i = 0, s = 0; s < t.length; s++) {
                        let n = t[s];
                        if (n.empty ? n.from <= i : n.from < i) return F.normalized(t.slice(), e);
                        i = n.to
                    }
                    return new F(t, e)
                }
                static cursor(t, e = 0, i, s) {
                    return z.create(t, t, (0 == e ? 0 : e < 0 ? 8 : 16) | (null == i ? 7 : Math.min(6, i)) | (null != s ? s : 16777215) << 6)
                }
                static range(t, e, i, s) {
                    let n = (null != i ? i : 16777215) << 6 | (null == s ? 7 : Math.min(6, s));
                    return e < t ? z.create(e, t, 48 | n) : z.create(t, e, (e > t ? 8 : 0) | n)
                }
                static normalized(t, e = 0) {
                    let i = t[e];
                    t.sort((t, e) => t.from - e.from), e = t.indexOf(i);
                    for (let i = 1; i < t.length; i++) {
                        let s = t[i],
                            n = t[i - 1];
                        if (s.empty ? s.from <= n.to : s.from < n.to) {
                            let r = n.from,
                                o = Math.max(s.to, n.to);
                            i <= e && e--, t.splice(--i, 2, s.anchor > s.head ? F.range(o, r) : F.range(r, o))
                        }
                    }
                    return new F(t, e)
                }
            }

            function $(t, e) {
                for (let i of t.ranges)
                    if (i.to > e) throw new RangeError("Selection points outside of document")
            }
            let W = 0;
            class V {
                constructor(t, e, i, s, n) {
                    this.combine = t, this.compareInput = e, this.compare = i, this.isStatic = s, this.id = W++, this.default = t([]), this.extensions = "function" == typeof n ? n(this) : n
                }
                get reader() {
                    return this
                }
                static define(t = {}) {
                    return new V(t.combine || (t => t), t.compareInput || ((t, e) => t === e), t.compare || (t.combine ? (t, e) => t === e : j), !!t.static, t.enables)
                }
                of(t) {
                    return new q([], this, 0, t)
                }
                compute(t, e) {
                    if (this.isStatic) throw new Error("Can't compute a static facet");
                    return new q(t, this, 1, e)
                }
                computeN(t, e) {
                    if (this.isStatic) throw new Error("Can't compute a static facet");
                    return new q(t, this, 2, e)
                }
                from(t, e) {
                    return e || (e = t => t), this.compute([t], i => e(i.field(t)))
                }
            }

            function j(t, e) {
                return t == e || t.length == e.length && t.every((t, i) => t === e[i])
            }
            class q {
                constructor(t, e, i, s) {
                    this.dependencies = t, this.facet = e, this.type = i, this.value = s, this.id = W++
                }
                dynamicSlot(t) {
                    var e;
                    let i = this.value,
                        s = this.facet.compareInput,
                        n = this.id,
                        r = t[n] >> 1,
                        o = 2 == this.type,
                        l = !1,
                        a = !1,
                        h = [];
                    for (let i of this.dependencies) "doc" == i ? l = !0 : "selection" == i ? a = !0 : 1 & (null !== (e = t[i.id]) && void 0 !== e ? e : 1) || h.push(t[i.id]);
                    return {
                        create: t => (t.values[r] = i(t), 1),
                        update(t, e) {
                            if (l && e.docChanged || a && (e.docChanged || e.selection) || _(t, h)) {
                                let e = i(t);
                                if (o ? !H(e, t.values[r], s) : !s(e, t.values[r])) return t.values[r] = e, 1
                            }
                            return 0
                        },
                        reconfigure: (t, e) => {
                            let l, a = e.config.address[n];
                            if (null != a) {
                                let n = st(e, a);
                                if (this.dependencies.every(i => i instanceof V ? e.facet(i) === t.facet(i) : !(i instanceof U) || e.field(i, !1) == t.field(i, !1)) || (o ? H(l = i(t), n, s) : s(l = i(t), n))) return t.values[r] = n, 0
                            } else l = i(t);
                            return t.values[r] = l, 1
                        }
                    }
                }
            }

            function H(t, e, i) {
                if (t.length != e.length) return !1;
                for (let s = 0; s < t.length; s++)
                    if (!i(t[s], e[s])) return !1;
                return !0
            }

            function _(t, e) {
                let i = !1;
                for (let s of e) 1 & it(t, s) && (i = !0);
                return i
            }

            function X(t, e, i) {
                let s = i.map(e => t[e.id]),
                    n = i.map(t => t.type),
                    r = s.filter(t => !(1 & t)),
                    o = t[e.id] >> 1;

                function l(t) {
                    let i = [];
                    for (let e = 0; e < s.length; e++) {
                        let r = st(t, s[e]);
                        if (2 == n[e])
                            for (let t of r) i.push(t);
                        else i.push(r)
                    }
                    return e.combine(i)
                }
                return {
                    create(t) {
                        for (let e of s) it(t, e);
                        return t.values[o] = l(t), 1
                    },
                    update(t, i) {
                        if (!_(t, r)) return 0;
                        let s = l(t);
                        return e.compare(s, t.values[o]) ? 0 : (t.values[o] = s, 1)
                    },
                    reconfigure(t, n) {
                        let r = _(t, s),
                            a = n.config.facets[e.id],
                            h = n.facet(e);
                        if (a && !r && j(i, a)) return t.values[o] = h, 0;
                        let c = l(t);
                        return e.compare(c, h) ? (t.values[o] = h, 0) : (t.values[o] = c, 1)
                    }
                }
            }
            const Y = V.define({
                static: !0
            });
            class U {
                constructor(t, e, i, s, n) {
                    this.id = t, this.createF = e, this.updateF = i, this.compareF = s, this.spec = n, this.provides = void 0
                }
                static define(t) {
                    let e = new U(W++, t.create, t.update, t.compare || ((t, e) => t === e), t);
                    return t.provide && (e.provides = t.provide(e)), e
                }
                create(t) {
                    let e = t.facet(Y).find(t => t.field == this);
                    return ((null == e ? void 0 : e.create) || this.createF)(t)
                }
                slot(t) {
                    let e = t[this.id] >> 1;
                    return {
                        create: t => (t.values[e] = this.create(t), 1),
                        update: (t, i) => {
                            let s = t.values[e],
                                n = this.updateF(s, i);
                            return this.compareF(s, n) ? 0 : (t.values[e] = n, 1)
                        },
                        reconfigure: (t, i) => {
                            let s, n = t.facet(Y),
                                r = i.facet(Y);
                            return (s = n.find(t => t.field == this)) && s != r.find(t => t.field == this) ? (t.values[e] = s.create(t), 1) : null != i.config.address[this.id] ? (t.values[e] = i.field(this), 0) : (t.values[e] = this.create(t), 1)
                        }
                    }
                }
                init(t) {
                    return [this, Y.of({
                        field: this,
                        create: t
                    })]
                }
                get extension() {
                    return this
                }
            }

            function G(t) {
                return e => new Z(e, t)
            }
            const K = {
                highest: G(0),
                high: G(1),
                default: G(2),
                low: G(3),
                lowest: G(4)
            };
            class Z {
                constructor(t, e) {
                    this.inner = t, this.prec = e
                }
            }
            class J {
                of(t) {
                    return new tt(this, t)
                }
                reconfigure(t) {
                    return J.reconfigure.of({
                        compartment: this,
                        extension: t
                    })
                }
                get(t) {
                    return t.config.compartments.get(this)
                }
            }
            class tt {
                constructor(t, e) {
                    this.compartment = t, this.inner = e
                }
            }
            class et {
                constructor(t, e, i, s, n, r) {
                    for (this.base = t, this.compartments = e, this.dynamicSlots = i, this.address = s, this.staticValues = n, this.facets = r, this.statusTemplate = []; this.statusTemplate.length < i.length;) this.statusTemplate.push(0)
                }
                staticFacet(t) {
                    let e = this.address[t.id];
                    return null == e ? t.default : this.staticValues[e >> 1]
                }
                static resolve(t, e, i) {
                    let s = [],
                        n = Object.create(null),
                        r = new Map;
                    for (let i of function(t, e, i) {
                            let s = [
                                    [],
                                    [],
                                    [],
                                    [],
                                    []
                                ],
                                n = new Map;
                            return function t(r, o) {
                                let l = n.get(r);
                                if (null != l) {
                                    if (l <= o) return;
                                    let t = s[l].indexOf(r);
                                    t > -1 && s[l].splice(t, 1), r instanceof tt && i.delete(r.compartment)
                                }
                                if (n.set(r, o), Array.isArray(r))
                                    for (let e of r) t(e, o);
                                else if (r instanceof tt) {
                                    if (i.has(r.compartment)) throw new RangeError("Duplicate use of compartment in extensions");
                                    let s = e.get(r.compartment) || r.inner;
                                    i.set(r.compartment, s), t(s, o)
                                } else if (r instanceof Z) t(r.inner, r.prec);
                                else if (r instanceof U) s[o].push(r), r.provides && t(r.provides, o);
                                else if (r instanceof q) s[o].push(r), r.facet.extensions && t(r.facet.extensions, 2);
                                else {
                                    let e = r.extension;
                                    if (!e) throw new Error(`Unrecognized extension value in extension set (${r}). This sometimes happens because multiple instances of @codemirror/state are loaded, breaking instanceof checks.`);
                                    t(e, o)
                                }
                            }(t, 2), s.reduce((t, e) => t.concat(e))
                        }(t, e, r)) i instanceof U ? s.push(i) : (n[i.facet.id] || (n[i.facet.id] = [])).push(i);
                    let o = Object.create(null),
                        l = [],
                        a = [];
                    for (let t of s) o[t.id] = a.length << 1, a.push(e => t.slot(e));
                    let h = null == i ? void 0 : i.config.facets;
                    for (let t in n) {
                        let e = n[t],
                            s = e[0].facet,
                            r = h && h[t] || [];
                        if (e.every(t => 0 == t.type))
                            if (o[s.id] = l.length << 1 | 1, j(r, e)) l.push(i.facet(s));
                            else {
                                let t = s.combine(e.map(t => t.value));
                                l.push(i && s.compare(t, i.facet(s)) ? i.facet(s) : t)
                            }
                        else {
                            for (let t of e) 0 == t.type ? (o[t.id] = l.length << 1 | 1, l.push(t.value)) : (o[t.id] = a.length << 1, a.push(e => t.dynamicSlot(e)));
                            o[s.id] = a.length << 1, a.push(t => X(t, s, e))
                        }
                    }
                    let c = a.map(t => t(o));
                    return new et(t, r, c, o, l, n)
                }
            }

            function it(t, e) {
                if (1 & e) return 2;
                let i = e >> 1,
                    s = t.status[i];
                if (4 == s) throw new Error("Cyclic dependency between fields and/or facets");
                if (2 & s) return s;
                t.status[i] = 4;
                let n = t.computeSlot(t, t.config.dynamicSlots[i]);
                return t.status[i] = 2 | n
            }

            function st(t, e) {
                return 1 & e ? t.config.staticValues[e >> 1] : t.values[e >> 1]
            }
            const nt = V.define(),
                rt = V.define({
                    combine: t => t.some(t => t),
                    static: !0
                }),
                ot = V.define({
                    combine: t => t.length ? t[0] : void 0,
                    static: !0
                }),
                lt = V.define(),
                at = V.define(),
                ht = V.define(),
                ct = V.define({
                    combine: t => !!t.length && t[0]
                });
            class ut {
                constructor(t, e) {
                    this.type = t, this.value = e
                }
                static define() {
                    return new dt
                }
            }
            class dt {
                of(t) {
                    return new ut(this, t)
                }
            }
            class ft {
                constructor(t) {
                    this.map = t
                }
                of(t) {
                    return new pt(this, t)
                }
            }
            class pt {
                constructor(t, e) {
                    this.type = t, this.value = e
                }
                map(t) {
                    let e = this.type.map(this.value, t);
                    return void 0 === e ? void 0 : e == this.value ? this : new pt(this.type, e)
                }
                is(t) {
                    return this.type == t
                }
                static define(t = {}) {
                    return new ft(t.map || (t => t))
                }
                static mapEffects(t, e) {
                    if (!t.length) return t;
                    let i = [];
                    for (let s of t) {
                        let t = s.map(e);
                        t && i.push(t)
                    }
                    return i
                }
            }
            pt.reconfigure = pt.define(), pt.appendConfig = pt.define();
            class mt {
                constructor(t, e, i, s, n, r) {
                    this.startState = t, this.changes = e, this.selection = i, this.effects = s, this.annotations = n, this.scrollIntoView = r, this._doc = null, this._state = null, i && $(i, e.newLength), n.some(t => t.type == mt.time) || (this.annotations = n.concat(mt.time.of(Date.now())))
                }
                static create(t, e, i, s, n, r) {
                    return new mt(t, e, i, s, n, r)
                }
                get newDoc() {
                    return this._doc || (this._doc = this.changes.apply(this.startState.doc))
                }
                get newSelection() {
                    return this.selection || this.startState.selection.map(this.changes)
                }
                get state() {
                    return this._state || this.startState.applyTransaction(this), this._state
                }
                annotation(t) {
                    for (let e of this.annotations)
                        if (e.type == t) return e.value
                }
                get docChanged() {
                    return !this.changes.empty
                }
                get reconfigured() {
                    return this.startState.config != this.state.config
                }
                isUserEvent(t) {
                    let e = this.annotation(mt.userEvent);
                    return !(!e || !(e == t || e.length > t.length && e.slice(0, t.length) == t && "." == e[t.length]))
                }
            }

            function gt(t, e) {
                let i = [];
                for (let s = 0, n = 0;;) {
                    let r, o;
                    if (s < t.length && (n == e.length || e[n] >= t[s])) r = t[s++], o = t[s++];
                    else {
                        if (!(n < e.length)) return i;
                        r = e[n++], o = e[n++]
                    }!i.length || i[i.length - 1] < r ? i.push(r, o) : i[i.length - 1] < o && (i[i.length - 1] = o)
                }
            }

            function vt(t, e, i) {
                var s;
                let n, r, o;
                return i ? (n = e.changes, r = D.empty(e.changes.length), o = t.changes.compose(e.changes)) : (n = e.changes.map(t.changes), r = t.changes.mapDesc(e.changes, !0), o = t.changes.compose(n)), {
                    changes: o,
                    selection: e.selection ? e.selection.map(r) : null === (s = t.selection) || void 0 === s ? void 0 : s.map(n),
                    effects: pt.mapEffects(t.effects, n).concat(pt.mapEffects(e.effects, r)),
                    annotations: t.annotations.length ? t.annotations.concat(e.annotations) : e.annotations,
                    scrollIntoView: t.scrollIntoView || e.scrollIntoView
                }
            }

            function bt(t, e, i) {
                let s = e.selection,
                    n = Ot(e.annotations);
                return e.userEvent && (n = n.concat(mt.userEvent.of(e.userEvent))), {
                    changes: e.changes instanceof D ? e.changes : D.of(e.changes || [], i, t.facet(ot)),
                    selection: s && (s instanceof F ? s : F.single(s.anchor, s.head)),
                    effects: Ot(e.effects),
                    annotations: n,
                    scrollIntoView: !!e.scrollIntoView
                }
            }

            function wt(t, e, i) {
                let s = bt(t, e.length ? e[0] : {}, t.doc.length);
                e.length && !1 === e[0].filter && (i = !1);
                for (let n = 1; n < e.length; n++) {
                    !1 === e[n].filter && (i = !1);
                    let r = !!e[n].sequential;
                    s = vt(s, bt(t, e[n], r ? s.changes.newLength : t.doc.length), r)
                }
                let n = mt.create(t, s.changes, s.selection, s.effects, s.annotations, s.scrollIntoView);
                return function(t) {
                    let e = t.startState,
                        i = e.facet(ht),
                        s = t;
                    for (let n = i.length - 1; n >= 0; n--) {
                        let r = i[n](t);
                        r && Object.keys(r).length && (s = vt(s, bt(e, r, t.changes.newLength), !0))
                    }
                    return s == t ? t : mt.create(e, t.changes, t.selection, s.effects, s.annotations, s.scrollIntoView)
                }(i ? function(t) {
                    let e = t.startState,
                        i = !0;
                    for (let s of e.facet(lt)) {
                        let e = s(t);
                        if (!1 === e) {
                            i = !1;
                            break
                        }
                        Array.isArray(e) && (i = !0 === i ? e : gt(i, e))
                    }
                    if (!0 !== i) {
                        let s, n;
                        if (!1 === i) n = t.changes.invertedDesc, s = D.empty(e.doc.length);
                        else {
                            let e = t.changes.filter(i);
                            s = e.changes, n = e.filtered.mapDesc(e.changes).invertedDesc
                        }
                        t = mt.create(e, s, t.selection && t.selection.map(n), pt.mapEffects(t.effects, n), t.annotations, t.scrollIntoView)
                    }
                    let s = e.facet(at);
                    for (let i = s.length - 1; i >= 0; i--) {
                        let n = s[i](t);
                        t = n instanceof mt ? n : Array.isArray(n) && 1 == n.length && n[0] instanceof mt ? n[0] : wt(e, Ot(n), !1)
                    }
                    return t
                }(n) : n)
            }
            mt.time = ut.define(), mt.userEvent = ut.define(), mt.addToHistory = ut.define(), mt.remote = ut.define();
            const yt = [];

            function Ot(t) {
                return null == t ? yt : Array.isArray(t) ? t : [t]
            }
            var xt = function(t) {
                return t[t.Word = 0] = "Word", t[t.Space = 1] = "Space", t[t.Other = 2] = "Other", t
            }(xt || (xt = {}));
            const kt = /[\u00df\u0587\u0590-\u05f4\u0600-\u06ff\u3040-\u309f\u30a0-\u30ff\u3400-\u4db5\u4e00-\u9fcc\uac00-\ud7af]/;
            let St;
            try {
                St = new RegExp("[\\p{Alphabetic}\\p{Number}_]", "u")
            } catch (t) {}
            class Ct {
                constructor(t, e, i, s, n, r) {
                    this.config = t, this.doc = e, this.selection = i, this.values = s, this.status = t.statusTemplate.slice(), this.computeSlot = n, r && (r._state = this);
                    for (let t = 0; t < this.config.dynamicSlots.length; t++) it(this, t << 1);
                    this.computeSlot = null
                }
                field(t, e = !0) {
                    let i = this.config.address[t.id];
                    if (null != i) return it(this, i), st(this, i);
                    if (e) throw new RangeError("Field is not present in this state")
                }
                update(...t) {
                    return wt(this, t, !0)
                }
                applyTransaction(t) {
                    let e, i = this.config,
                        {
                            base: s,
                            compartments: n
                        } = i;
                    for (let e of t.effects) e.is(J.reconfigure) ? (i && (n = new Map, i.compartments.forEach((t, e) => n.set(e, t)), i = null), n.set(e.value.compartment, e.value.extension)) : e.is(pt.reconfigure) ? (i = null, s = e.value) : e.is(pt.appendConfig) && (i = null, s = Ot(s).concat(e.value));
                    i ? e = t.startState.values.slice() : (i = et.resolve(s, n, this), e = new Ct(i, this.doc, this.selection, i.dynamicSlots.map(() => null), (t, e) => e.reconfigure(t, this), null).values);
                    let r = t.startState.facet(rt) ? t.newSelection : t.newSelection.asSingle();
                    new Ct(i, t.newDoc, r, e, (e, i) => i.update(e, t), t)
                }
                replaceSelection(t) {
                    return "string" == typeof t && (t = this.toText(t)), this.changeByRange(e => ({
                        changes: {
                            from: e.from,
                            to: e.to,
                            insert: t
                        },
                        range: F.cursor(e.from + t.length)
                    }))
                }
                changeByRange(t) {
                    let e = this.selection,
                        i = t(e.ranges[0]),
                        s = this.changes(i.changes),
                        n = [i.range],
                        r = Ot(i.effects);
                    for (let i = 1; i < e.ranges.length; i++) {
                        let o = t(e.ranges[i]),
                            l = this.changes(o.changes),
                            a = l.map(s);
                        for (let t = 0; t < i; t++) n[t] = n[t].map(a);
                        let h = s.mapDesc(l, !0);
                        n.push(o.range.map(h)), s = s.compose(a), r = pt.mapEffects(r, a).concat(pt.mapEffects(Ot(o.effects), h))
                    }
                    return {
                        changes: s,
                        selection: F.create(n, e.mainIndex),
                        effects: r
                    }
                }
                changes(t = []) {
                    return t instanceof D ? t : D.of(t, this.doc.length, this.facet(Ct.lineSeparator))
                }
                toText(t) {
                    return p.of(t.split(this.facet(Ct.lineSeparator) || Q))
                }
                sliceDoc(t = 0, e = this.doc.length) {
                    return this.doc.sliceString(t, e, this.lineBreak)
                }
                facet(t) {
                    let e = this.config.address[t.id];
                    return null == e ? t.default : (it(this, e), st(this, e))
                }
                toJSON(t) {
                    let e = {
                        doc: this.sliceDoc(),
                        selection: this.selection.toJSON()
                    };
                    if (t)
                        for (let i in t) {
                            let s = t[i];
                            s instanceof U && null != this.config.address[s.id] && (e[i] = s.spec.toJSON(this.field(t[i]), this))
                        }
                    return e
                }
                static fromJSON(t, e = {}, i) {
                    if (!t || "string" != typeof t.doc) throw new RangeError("Invalid JSON representation for EditorState");
                    let s = [];
                    if (i)
                        for (let e in i)
                            if (Object.prototype.hasOwnProperty.call(t, e)) {
                                let n = i[e],
                                    r = t[e];
                                s.push(n.init(t => n.spec.fromJSON(r, t)))
                            } return Ct.create({
                        doc: t.doc,
                        selection: F.fromJSON(t.selection),
                        extensions: e.extensions ? s.concat([e.extensions]) : s
                    })
                }
                static create(t = {}) {
                    let e = et.resolve(t.extensions || [], new Map),
                        i = t.doc instanceof p ? t.doc : p.of((t.doc || "").split(e.staticFacet(Ct.lineSeparator) || Q)),
                        s = t.selection ? t.selection instanceof F ? t.selection : F.single(t.selection.anchor, t.selection.head) : F.single(0);
                    return $(s, i.length), e.staticFacet(rt) || (s = s.asSingle()), new Ct(e, i, s, e.dynamicSlots.map(() => null), (t, e) => e.create(t), null)
                }
                get tabSize() {
                    return this.facet(Ct.tabSize)
                }
                get lineBreak() {
                    return this.facet(Ct.lineSeparator) || "\n"
                }
                get readOnly() {
                    return this.facet(ct)
                }
                phrase(t, ...e) {
                    for (let e of this.facet(Ct.phrases))
                        if (Object.prototype.hasOwnProperty.call(e, t)) {
                            t = e[t];
                            break
                        } return e.length && (t = t.replace(/\$(\$|\d*)/g, (t, i) => {
                        if ("$" == i) return "$";
                        let s = +(i || 1);
                        return !s || s > e.length ? t : e[s - 1]
                    })), t
                }
                languageDataAt(t, e, i = -1) {
                    let s = [];
                    for (let n of this.facet(nt))
                        for (let r of n(this, e, i)) Object.prototype.hasOwnProperty.call(r, t) && s.push(r[t]);
                    return s
                }
                charCategorizer(t) {
                    let e = this.languageDataAt("wordChars", t);
                    return i = e.length ? e[0] : "", t => {
                        if (!/\S/.test(t)) return xt.Space;
                        if (function(t) {
                                if (St) return St.test(t);
                                for (let e = 0; e < t.length; e++) {
                                    let i = t[e];
                                    if (/\w/.test(i) || i > "" && (i.toUpperCase() != i.toLowerCase() || kt.test(i))) return !0
                                }
                                return !1
                            }(t)) return xt.Word;
                        for (let e = 0; e < i.length; e++)
                            if (t.indexOf(i[e]) > -1) return xt.Word;
                        return xt.Other
                    };
                    var i
                }
                wordAt(t) {
                    let {
                        text: e,
                        from: i,
                        length: s
                    } = this.doc.lineAt(t), n = this.charCategorizer(t), r = t - i, o = t - i;
                    for (; r > 0;) {
                        let t = S(e, r, !1);
                        if (n(e.slice(t, r)) != xt.Word) break;
                        r = t
                    }
                    for (; o < s;) {
                        let t = S(e, o);
                        if (n(e.slice(o, t)) != xt.Word) break;
                        o = t
                    }
                    return r == o ? null : F.range(r + i, o + i)
                }
            }

            function At(t, e, i = {}) {
                let s = {};
                for (let e of t)
                    for (let t of Object.keys(e)) {
                        let n = e[t],
                            r = s[t];
                        if (void 0 === r) s[t] = n;
                        else if (r === n || void 0 === n);
                        else {
                            if (!Object.hasOwnProperty.call(i, t)) throw new Error("Config merge conflict for field " + t);
                            s[t] = i[t](r, n)
                        }
                    }
                for (let t in e) void 0 === s[t] && (s[t] = e[t]);
                return s
            }
            Ct.allowMultipleSelections = rt, Ct.tabSize = V.define({
                combine: t => t.length ? t[0] : 4
            }), Ct.lineSeparator = ot, Ct.readOnly = ct, Ct.phrases = V.define({
                compare(t, e) {
                    let i = Object.keys(t),
                        s = Object.keys(e);
                    return i.length == s.length && i.every(i => t[i] == e[i])
                }
            }), Ct.languageData = nt, Ct.changeFilter = lt, Ct.transactionFilter = at, Ct.transactionExtender = ht, J.reconfigure = pt.define();
            class Mt {
                eq(t) {
                    return this == t
                }
                range(t, e = t) {
                    return Tt.create(t, e, this)
                }
            }

            function Qt(t, e) {
                return t == e || t.constructor == e.constructor && t.eq(e)
            }
            Mt.prototype.startSide = Mt.prototype.endSide = 0, Mt.prototype.point = !1, Mt.prototype.mapMode = T.TrackDel;
            class Tt {
                constructor(t, e, i) {
                    this.from = t, this.to = e, this.value = i
                }
                static create(t, e, i) {
                    return new Tt(t, e, i)
                }
            }

            function Pt(t, e) {
                return t.from - e.from || t.value.startSide - e.value.startSide
            }
            class Dt {
                constructor(t, e, i, s) {
                    this.from = t, this.to = e, this.value = i, this.maxPoint = s
                }
                get length() {
                    return this.to[this.to.length - 1]
                }
                findIndex(t, e, i, s = 0) {
                    let n = i ? this.to : this.from;
                    for (let r = s, o = n.length;;) {
                        if (r == o) return r;
                        let s = r + o >> 1,
                            l = n[s] - t || (i ? this.value[s].endSide : this.value[s].startSide) - e;
                        if (s == r) return l >= 0 ? r : o;
                        l >= 0 ? o = s : r = s + 1
                    }
                }
                between(t, e, i, s) {
                    for (let n = this.findIndex(e, -1e9, !0), r = this.findIndex(i, 1e9, !1, n); n < r; n++)
                        if (!1 === s(this.from[n] + t, this.to[n] + t, this.value[n])) return !1
                }
                map(t, e) {
                    let i = [],
                        s = [],
                        n = [],
                        r = -1,
                        o = -1;
                    for (let l = 0; l < this.value.length; l++) {
                        let a, h, c = this.value[l],
                            u = this.from[l] + t,
                            d = this.to[l] + t;
                        if (u == d) {
                            let t = e.mapPos(u, c.startSide, c.mapMode);
                            if (null == t) continue;
                            if (a = h = t, c.startSide != c.endSide && (h = e.mapPos(u, c.endSide), h < a)) continue
                        } else if (a = e.mapPos(u, c.startSide), h = e.mapPos(d, c.endSide), a > h || a == h && c.startSide > 0 && c.endSide <= 0) continue;
                        (h - a || c.endSide - c.startSide) < 0 || (r < 0 && (r = a), c.point && (o = Math.max(o, h - a)), i.push(c), s.push(a - r), n.push(h - r))
                    }
                    return {
                        mapped: i.length ? new Dt(s, n, i, o) : null,
                        pos: r
                    }
                }
            }
            class Rt {
                constructor(t, e, i, s) {
                    this.chunkPos = t, this.chunk = e, this.nextLayer = i, this.maxPoint = s
                }
                static create(t, e, i, s) {
                    return new Rt(t, e, i, s)
                }
                get length() {
                    let t = this.chunk.length - 1;
                    return t < 0 ? 0 : Math.max(this.chunkEnd(t), this.nextLayer.length)
                }
                get size() {
                    if (this.isEmpty) return 0;
                    let t = this.nextLayer.size;
                    for (let e of this.chunk) t += e.value.length;
                    return t
                }
                chunkEnd(t) {
                    return this.chunkPos[t] + this.chunk[t].length
                }
                update(t) {
                    let {
                        add: e = [],
                        sort: i = !1,
                        filterFrom: s = 0,
                        filterTo: n = this.length
                    } = t, r = t.filter;
                    if (0 == e.length && !r) return this;
                    if (i && (e = e.slice().sort(Pt)), this.isEmpty) return e.length ? Rt.of(e) : this;
                    let o = new Lt(this, null, -1).goto(0),
                        l = 0,
                        a = [],
                        h = new Et;
                    for (; o.value || l < e.length;)
                        if (l < e.length && (o.from - e[l].from || o.startSide - e[l].value.startSide) >= 0) {
                            let t = e[l++];
                            h.addInner(t.from, t.to, t.value) || a.push(t)
                        } else 1 == o.rangeIndex && o.chunkIndex < this.chunk.length && (l == e.length || this.chunkEnd(o.chunkIndex) < e[l].from) && (!r || s > this.chunkEnd(o.chunkIndex) || n < this.chunkPos[o.chunkIndex]) && h.addChunk(this.chunkPos[o.chunkIndex], this.chunk[o.chunkIndex]) ? o.nextChunk() : ((!r || s > o.to || n < o.from || r(o.from, o.to, o.value)) && (h.addInner(o.from, o.to, o.value) || a.push(Tt.create(o.from, o.to, o.value))), o.next());
                    return h.finishInner(this.nextLayer.isEmpty && !a.length ? Rt.empty : this.nextLayer.update({
                        add: a,
                        filter: r,
                        filterFrom: s,
                        filterTo: n
                    }))
                }
                map(t) {
                    if (t.empty || this.isEmpty) return this;
                    let e = [],
                        i = [],
                        s = -1;
                    for (let n = 0; n < this.chunk.length; n++) {
                        let r = this.chunkPos[n],
                            o = this.chunk[n],
                            l = t.touchesRange(r, r + o.length);
                        if (!1 === l) s = Math.max(s, o.maxPoint), e.push(o), i.push(t.mapPos(r));
                        else if (!0 === l) {
                            let {
                                mapped: n,
                                pos: l
                            } = o.map(r, t);
                            n && (s = Math.max(s, n.maxPoint), e.push(n), i.push(l))
                        }
                    }
                    let n = this.nextLayer.map(t);
                    return 0 == e.length ? n : new Rt(i, e, n || Rt.empty, s)
                }
                between(t, e, i) {
                    if (!this.isEmpty) {
                        for (let s = 0; s < this.chunk.length; s++) {
                            let n = this.chunkPos[s],
                                r = this.chunk[s];
                            if (e >= n && t <= n + r.length && !1 === r.between(n, t - n, e - n, i)) return
                        }
                        this.nextLayer.between(t, e, i)
                    }
                }
                iter(t = 0) {
                    return Nt.from([this]).goto(t)
                }
                get isEmpty() {
                    return this.nextLayer == this
                }
                static iter(t, e = 0) {
                    return Nt.from(t).goto(e)
                }
                static compare(t, e, i, s, n = -1) {
                    let r = t.filter(t => t.maxPoint > 0 || !t.isEmpty && t.maxPoint >= n),
                        o = e.filter(t => t.maxPoint > 0 || !t.isEmpty && t.maxPoint >= n),
                        l = Bt(r, o, i),
                        a = new zt(r, l, n),
                        h = new zt(o, l, n);
                    i.iterGaps((t, e, i) => Ft(a, t, h, e, i, s)), i.empty && 0 == i.length && Ft(a, 0, h, 0, 0, s)
                }
                static eq(t, e, i = 0, s) {
                    null == s && (s = 999999999);
                    let n = t.filter(t => !t.isEmpty && e.indexOf(t) < 0),
                        r = e.filter(e => !e.isEmpty && t.indexOf(e) < 0);
                    if (n.length != r.length) return !1;
                    if (!n.length) return !0;
                    let o = Bt(n, r),
                        l = new zt(n, o, 0).goto(i),
                        a = new zt(r, o, 0).goto(i);
                    for (;;) {
                        if (l.to != a.to || !$t(l.active, a.active) || l.point && (!a.point || !Qt(l.point, a.point))) return !1;
                        if (l.to > s) return !0;
                        l.next(), a.next()
                    }
                }
                static spans(t, e, i, s, n = -1) {
                    let r = new zt(t, null, n).goto(e),
                        o = e,
                        l = r.openStart;
                    for (;;) {
                        let t = Math.min(r.to, i);
                        if (r.point) {
                            let i = r.activeForPoint(r.to),
                                n = r.pointFrom < e ? i.length + 1 : r.point.startSide < 0 ? i.length : Math.min(i.length, l);
                            s.point(o, t, r.point, i, n, r.pointRank), l = Math.min(r.openEnd(t), i.length)
                        } else t > o && (s.span(o, t, r.active, l), l = r.openEnd(t));
                        if (r.to > i) return l + (r.point && r.to > i ? 1 : 0);
                        o = r.to, r.next()
                    }
                }
                static of (t, e = !1) {
                    let i = new Et;
                    for (let s of t instanceof Tt ? [t] : e ? function(t) {
                            if (t.length > 1)
                                for (let e = t[0], i = 1; i < t.length; i++) {
                                    let s = t[i];
                                    if (Pt(e, s) > 0) return t.slice().sort(Pt);
                                    e = s
                                }
                            return t
                        }(t) : t) i.add(s.from, s.to, s.value);
                    return i.finish()
                }
                static join(t) {
                    if (!t.length) return Rt.empty;
                    let e = t[t.length - 1];
                    for (let i = t.length - 2; i >= 0; i--)
                        for (let s = t[i]; s != Rt.empty; s = s.nextLayer) e = new Rt(s.chunkPos, s.chunk, e, Math.max(s.maxPoint, e.maxPoint));
                    return e
                }
            }
            Rt.empty = new Rt([], [], null, -1), Rt.empty.nextLayer = Rt.empty;
            class Et {
                finishChunk(t) {
                    this.chunks.push(new Dt(this.from, this.to, this.value, this.maxPoint)), this.chunkPos.push(this.chunkStart), this.chunkStart = -1, this.setMaxPoint = Math.max(this.setMaxPoint, this.maxPoint), this.maxPoint = -1, t && (this.from = [], this.to = [], this.value = [])
                }
                constructor() {
                    this.chunks = [], this.chunkPos = [], this.chunkStart = -1, this.last = null, this.lastFrom = -1e9, this.lastTo = -1e9, this.from = [], this.to = [], this.value = [], this.maxPoint = -1, this.setMaxPoint = -1, this.nextLayer = null
                }
                add(t, e, i) {
                    this.addInner(t, e, i) || (this.nextLayer || (this.nextLayer = new Et)).add(t, e, i)
                }
                addInner(t, e, i) {
                    let s = t - this.lastTo || i.startSide - this.last.endSide;
                    if (s <= 0 && (t - this.lastFrom || i.startSide - this.last.startSide) < 0) throw new Error("Ranges must be added sorted by `from` position and `startSide`");
                    return !(s < 0 || (250 == this.from.length && this.finishChunk(!0), this.chunkStart < 0 && (this.chunkStart = t), this.from.push(t - this.chunkStart), this.to.push(e - this.chunkStart), this.last = i, this.lastFrom = t, this.lastTo = e, this.value.push(i), i.point && (this.maxPoint = Math.max(this.maxPoint, e - t)), 0))
                }
                addChunk(t, e) {
                    if ((t - this.lastTo || e.value[0].startSide - this.last.endSide) < 0) return !1;
                    this.from.length && this.finishChunk(!0), this.setMaxPoint = Math.max(this.setMaxPoint, e.maxPoint), this.chunks.push(e), this.chunkPos.push(t);
                    let i = e.value.length - 1;
                    return this.last = e.value[i], this.lastFrom = e.from[i] + t, this.lastTo = e.to[i] + t, !0
                }
                finish() {
                    return this.finishInner(Rt.empty)
                }
                finishInner(t) {
                    if (this.from.length && this.finishChunk(!1), 0 == this.chunks.length) return t;
                    let e = Rt.create(this.chunkPos, this.chunks, this.nextLayer ? this.nextLayer.finishInner(t) : t, this.setMaxPoint);
                    return this.from = null, e
                }
            }

            function Bt(t, e, i) {
                let s = new Map;
                for (let e of t)
                    for (let t = 0; t < e.chunk.length; t++) e.chunk[t].maxPoint <= 0 && s.set(e.chunk[t], e.chunkPos[t]);
                let n = new Set;
                for (let t of e)
                    for (let e = 0; e < t.chunk.length; e++) {
                        let r = s.get(t.chunk[e]);
                        null == r || (i ? i.mapPos(r) : r) != t.chunkPos[e] || (null == i ? void 0 : i.touchesRange(r, r + t.chunk[e].length)) || n.add(t.chunk[e])
                    }
                return n
            }
            class Lt {
                constructor(t, e, i, s = 0) {
                    this.layer = t, this.skip = e, this.minPoint = i, this.rank = s
                }
                get startSide() {
                    return this.value ? this.value.startSide : 0
                }
                get endSide() {
                    return this.value ? this.value.endSide : 0
                }
                goto(t, e = -1e9) {
                    return this.chunkIndex = this.rangeIndex = 0, this.gotoInner(t, e, !1), this
                }
                gotoInner(t, e, i) {
                    for (; this.chunkIndex < this.layer.chunk.length;) {
                        let e = this.layer.chunk[this.chunkIndex];
                        if (!(this.skip && this.skip.has(e) || this.layer.chunkEnd(this.chunkIndex) < t || e.maxPoint < this.minPoint)) break;
                        this.chunkIndex++, i = !1
                    }
                    if (this.chunkIndex < this.layer.chunk.length) {
                        let s = this.layer.chunk[this.chunkIndex].findIndex(t - this.layer.chunkPos[this.chunkIndex], e, !0);
                        (!i || this.rangeIndex < s) && this.setRangeIndex(s)
                    }
                    this.next()
                }
                forward(t, e) {
                    (this.to - t || this.endSide - e) < 0 && this.gotoInner(t, e, !0)
                }
                next() {
                    for (;;) {
                        if (this.chunkIndex == this.layer.chunk.length) {
                            this.from = this.to = 1e9, this.value = null;
                            break
                        } {
                            let t = this.layer.chunkPos[this.chunkIndex],
                                e = this.layer.chunk[this.chunkIndex],
                                i = t + e.from[this.rangeIndex];
                            if (this.from = i, this.to = t + e.to[this.rangeIndex], this.value = e.value[this.rangeIndex], this.setRangeIndex(this.rangeIndex + 1), this.minPoint < 0 || this.value.point && this.to - this.from >= this.minPoint) break
                        }
                    }
                }
                setRangeIndex(t) {
                    if (t == this.layer.chunk[this.chunkIndex].value.length) {
                        if (this.chunkIndex++, this.skip)
                            for (; this.chunkIndex < this.layer.chunk.length && this.skip.has(this.layer.chunk[this.chunkIndex]);) this.chunkIndex++;
                        this.rangeIndex = 0
                    } else this.rangeIndex = t
                }
                nextChunk() {
                    this.chunkIndex++, this.rangeIndex = 0, this.next()
                }
                compare(t) {
                    return this.from - t.from || this.startSide - t.startSide || this.rank - t.rank || this.to - t.to || this.endSide - t.endSide
                }
            }
            class Nt {
                constructor(t) {
                    this.heap = t
                }
                static from(t, e = null, i = -1) {
                    let s = [];
                    for (let n = 0; n < t.length; n++)
                        for (let r = t[n]; !r.isEmpty; r = r.nextLayer) r.maxPoint >= i && s.push(new Lt(r, e, i, n));
                    return 1 == s.length ? s[0] : new Nt(s)
                }
                get startSide() {
                    return this.value ? this.value.startSide : 0
                }
                goto(t, e = -1e9) {
                    for (let i of this.heap) i.goto(t, e);
                    for (let t = this.heap.length >> 1; t >= 0; t--) It(this.heap, t);
                    return this.next(), this
                }
                forward(t, e) {
                    for (let i of this.heap) i.forward(t, e);
                    for (let t = this.heap.length >> 1; t >= 0; t--) It(this.heap, t);
                    (this.to - t || this.value.endSide - e) < 0 && this.next()
                }
                next() {
                    if (0 == this.heap.length) this.from = this.to = 1e9, this.value = null, this.rank = -1;
                    else {
                        let t = this.heap[0];
                        this.from = t.from, this.to = t.to, this.value = t.value, this.rank = t.rank, t.value && t.next(), It(this.heap, 0)
                    }
                }
            }

            function It(t, e) {
                for (let i = t[e];;) {
                    let s = 1 + (e << 1);
                    if (s >= t.length) break;
                    let n = t[s];
                    if (s + 1 < t.length && n.compare(t[s + 1]) >= 0 && (n = t[s + 1], s++), i.compare(n) < 0) break;
                    t[s] = i, t[e] = n, e = s
                }
            }
            class zt {
                constructor(t, e, i) {
                    this.minPoint = i, this.active = [], this.activeTo = [], this.activeRank = [], this.minActive = -1, this.point = null, this.pointFrom = 0, this.pointRank = 0, this.to = -1e9, this.endSide = 0, this.openStart = -1, this.cursor = Nt.from(t, e, i)
                }
                goto(t, e = -1e9) {
                    return this.cursor.goto(t, e), this.active.length = this.activeTo.length = this.activeRank.length = 0, this.minActive = -1, this.to = t, this.endSide = e, this.openStart = -1, this.next(), this
                }
                forward(t, e) {
                    for (; this.minActive > -1 && (this.activeTo[this.minActive] - t || this.active[this.minActive].endSide - e) < 0;) this.removeActive(this.minActive);
                    this.cursor.forward(t, e)
                }
                removeActive(t) {
                    Wt(this.active, t), Wt(this.activeTo, t), Wt(this.activeRank, t), this.minActive = jt(this.active, this.activeTo)
                }
                addActive(t) {
                    let e = 0,
                        {
                            value: i,
                            to: s,
                            rank: n
                        } = this.cursor;
                    for (; e < this.activeRank.length && (n - this.activeRank[e] || s - this.activeTo[e]) > 0;) e++;
                    Vt(this.active, e, i), Vt(this.activeTo, e, s), Vt(this.activeRank, e, n), t && Vt(t, e, this.cursor.from), this.minActive = jt(this.active, this.activeTo)
                }
                next() {
                    let t = this.to,
                        e = this.point;
                    this.point = null;
                    let i = this.openStart < 0 ? [] : null;
                    for (;;) {
                        let s = this.minActive;
                        if (s > -1 && (this.activeTo[s] - this.cursor.from || this.active[s].endSide - this.cursor.startSide) < 0) {
                            if (this.activeTo[s] > t) {
                                this.to = this.activeTo[s], this.endSide = this.active[s].endSide;
                                break
                            }
                            this.removeActive(s), i && Wt(i, s)
                        } else {
                            if (!this.cursor.value) {
                                this.to = this.endSide = 1e9;
                                break
                            }
                            if (this.cursor.from > t) {
                                this.to = this.cursor.from, this.endSide = this.cursor.startSide;
                                break
                            } {
                                let t = this.cursor.value;
                                if (t.point) {
                                    if (!(e && this.cursor.to == this.to && this.cursor.from < this.cursor.to)) {
                                        this.point = t, this.pointFrom = this.cursor.from, this.pointRank = this.cursor.rank, this.to = this.cursor.to, this.endSide = t.endSide, this.cursor.next(), this.forward(this.to, this.endSide);
                                        break
                                    }
                                    this.cursor.next()
                                } else this.addActive(i), this.cursor.next()
                            }
                        }
                    }
                    if (i) {
                        this.openStart = 0;
                        for (let e = i.length - 1; e >= 0 && i[e] < t; e--) this.openStart++
                    }
                }
                activeForPoint(t) {
                    if (!this.active.length) return this.active;
                    let e = [];
                    for (let i = this.active.length - 1; i >= 0 && !(this.activeRank[i] < this.pointRank); i--)(this.activeTo[i] > t || this.activeTo[i] == t && this.active[i].endSide >= this.point.endSide) && e.push(this.active[i]);
                    return e.reverse()
                }
                openEnd(t) {
                    let e = 0;
                    for (let i = this.activeTo.length - 1; i >= 0 && this.activeTo[i] > t; i--) e++;
                    return e
                }
            }

            function Ft(t, e, i, s, n, r) {
                t.goto(e), i.goto(s);
                let o = s + n,
                    l = s,
                    a = s - e,
                    h = !!r.boundChange;
                for (let e = !1;;) {
                    let s = t.to + a - i.to,
                        n = s || t.endSide - i.endSide,
                        c = n < 0 ? t.to + a : i.to,
                        u = Math.min(c, o);
                    if (t.point || i.point ? (t.point && i.point && Qt(t.point, i.point) && $t(t.activeForPoint(t.to), i.activeForPoint(i.to)) || r.comparePoint(l, u, t.point, i.point), e = !1) : (e && r.boundChange(l), u > l && !$t(t.active, i.active) && r.compareRange(l, u, t.active, i.active), h && u < o && (s || t.openEnd(c) != i.openEnd(c)) && (e = !0)), c > o) break;
                    l = c, n <= 0 && t.next(), n >= 0 && i.next()
                }
            }

            function $t(t, e) {
                if (t.length != e.length) return !1;
                for (let i = 0; i < t.length; i++)
                    if (t[i] != e[i] && !Qt(t[i], e[i])) return !1;
                return !0
            }

            function Wt(t, e) {
                for (let i = e, s = t.length - 1; i < s; i++) t[i] = t[i + 1];
                t.pop()
            }

            function Vt(t, e, i) {
                for (let i = t.length - 1; i >= e; i--) t[i + 1] = t[i];
                t[e] = i
            }

            function jt(t, e) {
                let i = -1,
                    s = 1e9;
                for (let n = 0; n < e.length; n++)(e[n] - s || t[n].endSide - t[i].endSide) < 0 && (i = n, s = e[n]);
                return i
            }

            function qt(t, e, i = t.length) {
                let s = 0;
                for (let n = 0; n < i && n < t.length;) 9 == t.charCodeAt(n) ? (s += e - s % e, n++) : (s++, n = S(t, n));
                return s
            }

            function Ht(t, e, i, s) {
                for (let s = 0, n = 0;;) {
                    if (n >= e) return s;
                    if (s == t.length) break;
                    n += 9 == t.charCodeAt(s) ? i - n % i : 1, s = S(t, s)
                }
                return !0 === s ? -1 : t.length
            }
        },
        720(t, e, i) {
            i.d(e, {
                DM: () => d,
                _A: () => T,
                az: () => u,
                pn: () => a
            });
            var s = i(365);
            let n = 0;
            class r {
                constructor(t, e, i, s) {
                    this.name = t, this.set = e, this.base = i, this.modified = s, this.id = n++
                }
                toString() {
                    let {
                        name: t
                    } = this;
                    for (let e of this.modified) e.name && (t = `${e.name}(${t})`);
                    return t
                }
                static define(t, e) {
                    let i = "string" == typeof t ? t : "?";
                    if (t instanceof r && (e = t), null == e ? void 0 : e.base) throw new Error("Can not derive from a modified tag");
                    let s = new r(i, [], null, []);
                    if (s.set.push(s), e)
                        for (let t of e.set) s.set.push(t);
                    return s
                }
                static defineModifier(t) {
                    let e = new l(t);
                    return t => t.modified.indexOf(e) > -1 ? t : l.get(t.base || t, t.modified.concat(e).sort((t, e) => t.id - e.id))
                }
            }
            let o = 0;
            class l {
                constructor(t) {
                    this.name = t, this.instances = [], this.id = o++
                }
                static get(t, e) {
                    if (!e.length) return t;
                    let i = e[0].instances.find(i => {
                        return i.base == t && (s = e, n = i.modified, s.length == n.length && s.every((t, e) => t == n[e]));
                        var s, n
                    });
                    if (i) return i;
                    let s = [],
                        n = new r(t.name, s, t, e);
                    for (let t of e) t.instances.push(n);
                    let o = function(t) {
                        let e = [
                            []
                        ];
                        for (let i = 0; i < t.length; i++)
                            for (let s = 0, n = e.length; s < n; s++) e.push(e[s].concat(t[i]));
                        return e.sort((t, e) => e.length - t.length)
                    }(e);
                    for (let e of t.set)
                        if (!e.modified.length)
                            for (let t of o) s.push(l.get(e, t));
                    return n
                }
            }

            function a(t) {
                let e = Object.create(null);
                for (let i in t) {
                    let s = t[i];
                    Array.isArray(s) || (s = [s]);
                    for (let t of i.split(" "))
                        if (t) {
                            let i = [],
                                n = 2,
                                r = t;
                            for (let e = 0;;) {
                                if ("..." == r && e > 0 && e + 3 == t.length) {
                                    n = 1;
                                    break
                                }
                                let s = /^"(?:[^"\\]|\\.)*?"|[^\/!]+/.exec(r);
                                if (!s) throw new RangeError("Invalid path: " + t);
                                if (i.push("*" == s[0] ? "" : '"' == s[0][0] ? JSON.parse(s[0]) : s[0]), e += s[0].length, e == t.length) break;
                                let o = t[e++];
                                if (e == t.length && "!" == o) {
                                    n = 0;
                                    break
                                }
                                if ("/" != o) throw new RangeError("Invalid path: " + t);
                                r = t.slice(e)
                            }
                            let o = i.length - 1,
                                l = i[o];
                            if (!l) throw new RangeError("Invalid path: " + t);
                            let a = new c(s, n, o > 0 ? i.slice(0, o) : null);
                            e[l] = a.sort(e[l])
                        }
                }
                return h.add(e)
            }
            const h = new s.uY({
                combine(t, e) {
                    let i, s, n;
                    for (; t || e;) {
                        if (!t || e && t.depth >= e.depth ? (n = e, e = e.next) : (n = t, t = t.next), i && i.mode == n.mode && !n.context && !i.context) continue;
                        let r = new c(n.tags, n.mode, n.context);
                        i ? i.next = r : s = r, i = r
                    }
                    return s
                }
            });
            class c {
                constructor(t, e, i, s) {
                    this.tags = t, this.mode = e, this.context = i, this.next = s
                }
                get opaque() {
                    return 0 == this.mode
                }
                get inherit() {
                    return 1 == this.mode
                }
                sort(t) {
                    return !t || t.depth < this.depth ? (this.next = t, this) : (t.next = this.sort(t.next), t)
                }
                get depth() {
                    return this.context ? this.context.length : 0
                }
            }

            function u(t, e) {
                let i = Object.create(null);
                for (let e of t)
                    if (Array.isArray(e.tag))
                        for (let t of e.tag) i[t.id] = e.class;
                    else i[e.tag.id] = e.class;
                let {
                    scope: s,
                    all: n = null
                } = e || {};
                return {
                    style: t => {
                        let e = n;
                        for (let s of t)
                            for (let t of s.set) {
                                let s = i[t.id];
                                if (s) {
                                    e = e ? e + " " + s : s;
                                    break
                                }
                            }
                        return e
                    },
                    scope: s
                }
            }

            function d(t, e, i, s = 0, n = t.length) {
                let r = new f(s, Array.isArray(e) ? e : [e], i);
                r.highlightRange(t.cursor(), s, n, "", r.highlighters), r.flush(n)
            }
            c.empty = new c([], 2, null);
            class f {
                constructor(t, e, i) {
                    this.at = t, this.highlighters = e, this.span = i, this.class = ""
                }
                startSpan(t, e) {
                    e != this.class && (this.flush(t), t > this.at && (this.at = t), this.class = e)
                }
                flush(t) {
                    t > this.at && this.class && this.span(this.at, t, this.class)
                }
                highlightRange(t, e, i, n, r) {
                    let {
                        type: o,
                        from: l,
                        to: a
                    } = t;
                    if (l >= i || a <= e) return;
                    o.isTop && (r = this.highlighters.filter(t => !t.scope || t.scope(o)));
                    let u = n,
                        d = function(t) {
                            let e = t.type.prop(h);
                            for (; e && e.context && !t.matchContext(e.context);) e = e.next;
                            return e || null
                        }(t) || c.empty,
                        f = function(t, e) {
                            let i = null;
                            for (let s of t) {
                                let t = s.style(e);
                                t && (i = i ? i + " " + t : t)
                            }
                            return i
                        }(r, d.tags);
                    if (f && (u && (u += " "), u += f, 1 == d.mode && (n += (n ? " " : "") + f)), this.startSpan(Math.max(e, l), u), d.opaque) return;
                    let p = t.tree && t.tree.prop(s.uY.mounted);
                    if (p && p.overlay) {
                        let s = t.node.enter(p.overlay[0].from + l, 1),
                            o = this.highlighters.filter(t => !t.scope || t.scope(p.tree.type)),
                            h = t.firstChild();
                        for (let c = 0, d = l;; c++) {
                            let f = c < p.overlay.length ? p.overlay[c] : null,
                                m = f ? f.from + l : a,
                                g = Math.max(e, d),
                                v = Math.min(i, m);
                            if (g < v && h)
                                for (; t.from < v && (this.highlightRange(t, g, v, n, r), this.startSpan(Math.min(v, t.to), u), !(t.to >= m) && t.nextSibling()););
                            if (!f || m > i) break;
                            d = f.to + l, d > e && (this.highlightRange(s.cursor(), Math.max(e, f.from + l), Math.min(i, d), "", o), this.startSpan(Math.min(i, d), u))
                        }
                        h && t.parent()
                    } else if (t.firstChild()) {
                        p && (n = "");
                        do {
                            if (!(t.to <= e)) {
                                if (t.from >= i) break;
                                this.highlightRange(t, e, i, n, r), this.startSpan(Math.min(i, t.to), u)
                            }
                        } while (t.nextSibling());
                        t.parent()
                    }
                }
            }
            const p = r.define,
                m = p(),
                g = p(),
                v = p(g),
                b = p(g),
                w = p(),
                y = p(w),
                O = p(w),
                x = p(),
                k = p(x),
                S = p(),
                C = p(),
                A = p(),
                M = p(A),
                Q = p(),
                T = {
                    comment: m,
                    lineComment: p(m),
                    blockComment: p(m),
                    docComment: p(m),
                    name: g,
                    variableName: p(g),
                    typeName: v,
                    tagName: p(v),
                    propertyName: b,
                    attributeName: p(b),
                    className: p(g),
                    labelName: p(g),
                    namespace: p(g),
                    macroName: p(g),
                    literal: w,
                    string: y,
                    docString: p(y),
                    character: p(y),
                    attributeValue: p(y),
                    number: O,
                    integer: p(O),
                    float: p(O),
                    bool: p(w),
                    regexp: p(w),
                    escape: p(w),
                    color: p(w),
                    url: p(w),
                    keyword: S,
                    self: p(S),
                    null: p(S),
                    atom: p(S),
                    unit: p(S),
                    modifier: p(S),
                    operatorKeyword: p(S),
                    controlKeyword: p(S),
                    definitionKeyword: p(S),
                    moduleKeyword: p(S),
                    operator: C,
                    derefOperator: p(C),
                    arithmeticOperator: p(C),
                    logicOperator: p(C),
                    bitwiseOperator: p(C),
                    compareOperator: p(C),
                    updateOperator: p(C),
                    definitionOperator: p(C),
                    typeOperator: p(C),
                    controlOperator: p(C),
                    punctuation: A,
                    separator: p(A),
                    bracket: M,
                    angleBracket: p(M),
                    squareBracket: p(M),
                    paren: p(M),
                    brace: p(M),
                    content: x,
                    heading: k,
                    heading1: p(k),
                    heading2: p(k),
                    heading3: p(k),
                    heading4: p(k),
                    heading5: p(k),
                    heading6: p(k),
                    contentSeparator: p(x),
                    list: p(x),
                    quote: p(x),
                    emphasis: p(x),
                    strong: p(x),
                    link: p(x),
                    monospace: p(x),
                    strikethrough: p(x),
                    inserted: p(),
                    deleted: p(),
                    changed: p(),
                    invalid: p(),
                    meta: Q,
                    documentMeta: p(Q),
                    annotation: p(Q),
                    processingInstruction: p(Q),
                    definition: r.defineModifier("definition"),
                    constant: r.defineModifier("constant"),
                    function: r.defineModifier("function"),
                    standard: r.defineModifier("standard"),
                    local: r.defineModifier("local"),
                    special: r.defineModifier("special")
                };
            for (let t in T) {
                let e = T[t];
                e instanceof r && (e.name = t)
            }
            u([{
                tag: T.link,
                class: "tok-link"
            }, {
                tag: T.heading,
                class: "tok-heading"
            }, {
                tag: T.emphasis,
                class: "tok-emphasis"
            }, {
                tag: T.strong,
                class: "tok-strong"
            }, {
                tag: T.keyword,
                class: "tok-keyword"
            }, {
                tag: T.atom,
                class: "tok-atom"
            }, {
                tag: T.bool,
                class: "tok-bool"
            }, {
                tag: T.url,
                class: "tok-url"
            }, {
                tag: T.labelName,
                class: "tok-labelName"
            }, {
                tag: T.inserted,
                class: "tok-inserted"
            }, {
                tag: T.deleted,
                class: "tok-deleted"
            }, {
                tag: T.literal,
                class: "tok-literal"
            }, {
                tag: T.string,
                class: "tok-string"
            }, {
                tag: T.number,
                class: "tok-number"
            }, {
                tag: [T.regexp, T.escape, T.special(T.string)],
                class: "tok-string2"
            }, {
                tag: T.variableName,
                class: "tok-variableName"
            }, {
                tag: T.local(T.variableName),
                class: "tok-variableName tok-local"
            }, {
                tag: T.definition(T.variableName),
                class: "tok-variableName tok-definition"
            }, {
                tag: T.special(T.variableName),
                class: "tok-variableName2"
            }, {
                tag: T.definition(T.propertyName),
                class: "tok-propertyName tok-definition"
            }, {
                tag: T.typeName,
                class: "tok-typeName"
            }, {
                tag: T.namespace,
                class: "tok-namespace"
            }, {
                tag: T.className,
                class: "tok-className"
            }, {
                tag: T.macroName,
                class: "tok-macroName"
            }, {
                tag: T.propertyName,
                class: "tok-propertyName"
            }, {
                tag: T.operator,
                class: "tok-operator"
            }, {
                tag: T.comment,
                class: "tok-comment"
            }, {
                tag: T.meta,
                class: "tok-meta"
            }, {
                tag: T.invalid,
                class: "tok-invalid"
            }, {
                tag: T.punctuation,
                class: "tok-punctuation"
            }])
        },
        723(t, e, i) {
            i.d(e, {
                oQ: () => ei
            });
            var s = i(898),
                n = i(638),
                r = i(874),
                o = i(365);

            function l(t, e) {
                return ({
                    state: i,
                    dispatch: s
                }) => {
                    if (i.readOnly) return !1;
                    let n = t(e, i);
                    return !!n && (s(i.update(n)), !0)
                }
            }
            const a = l(f, 0),
                h = l(d, 0),
                c = l((t, e) => d(t, e, function(t) {
                    let e = [];
                    for (let i of t.selection.ranges) {
                        let s = t.doc.lineAt(i.from),
                            n = i.to <= s.to ? s : t.doc.lineAt(i.to);
                        n.from > s.from && n.from == i.to && (n = i.to == s.to + 1 ? s : t.doc.lineAt(i.to - 1));
                        let r = e.length - 1;
                        r >= 0 && e[r].to > s.from ? e[r].to = n.to : e.push({
                            from: s.from + /^\s*/.exec(s.text)[0].length,
                            to: n.to
                        })
                    }
                    return e
                }(e)), 0);

            function u(t, e) {
                let i = t.languageDataAt("commentTokens", e, 1);
                return i.length ? i[0] : {}
            }

            function d(t, e, i = e.selection.ranges) {
                let s = i.map(t => u(e, t.from).block);
                if (!s.every(t => t)) return null;
                let n = i.map((t, i) => function(t, {
                    open: e,
                    close: i
                }, s, n) {
                    let r, o, l = t.sliceDoc(s - 50, s),
                        a = t.sliceDoc(n, n + 50),
                        h = /\s*$/.exec(l)[0].length,
                        c = /^\s*/.exec(a)[0].length,
                        u = l.length - h;
                    if (l.slice(u - e.length, u) == e && a.slice(c, c + i.length) == i) return {
                        open: {
                            pos: s - h,
                            margin: h && 1
                        },
                        close: {
                            pos: n + c,
                            margin: c && 1
                        }
                    };
                    n - s <= 100 ? r = o = t.sliceDoc(s, n) : (r = t.sliceDoc(s, s + 50), o = t.sliceDoc(n - 50, n));
                    let d = /^\s*/.exec(r)[0].length,
                        f = /\s*$/.exec(o)[0].length,
                        p = o.length - f - i.length;
                    return r.slice(d, d + e.length) == e && o.slice(p, p + i.length) == i ? {
                        open: {
                            pos: s + d + e.length,
                            margin: /\s/.test(r.charAt(d + e.length)) ? 1 : 0
                        },
                        close: {
                            pos: n - f - i.length,
                            margin: /\s/.test(o.charAt(p - 1)) ? 1 : 0
                        }
                    } : null
                }(e, s[i], t.from, t.to));
                if (2 != t && !n.every(t => t)) return {
                    changes: e.changes(i.map((t, e) => n[e] ? [] : [{
                        from: t.from,
                        insert: s[e].open + " "
                    }, {
                        from: t.to,
                        insert: " " + s[e].close
                    }]))
                };
                if (1 != t && n.some(t => t)) {
                    let t = [];
                    for (let e, i = 0; i < n.length; i++)
                        if (e = n[i]) {
                            let n = s[i],
                                {
                                    open: r,
                                    close: o
                                } = e;
                            t.push({
                                from: r.pos - n.open.length,
                                to: r.pos + r.margin
                            }, {
                                from: o.pos - o.margin,
                                to: o.pos + n.close.length
                            })
                        } return {
                        changes: t
                    }
                }
                return null
            }

            function f(t, e, i = e.selection.ranges) {
                let s = [],
                    n = -1;
                for (let {
                        from: t,
                        to: r
                    }
                    of i) {
                    let i = s.length,
                        o = 1e9,
                        l = u(e, t).line;
                    if (l) {
                        for (let i = t; i <= r;) {
                            let a = e.doc.lineAt(i);
                            if (a.from > n && (t == r || r > a.from)) {
                                n = a.from;
                                let t = /^\s*/.exec(a.text)[0].length,
                                    e = t == a.length,
                                    i = a.text.slice(t, t + l.length) == l ? t : -1;
                                t < a.text.length && t < o && (o = t), s.push({
                                    line: a,
                                    comment: i,
                                    token: l,
                                    indent: t,
                                    empty: e,
                                    single: !1
                                })
                            }
                            i = a.to + 1
                        }
                        if (o < 1e9)
                            for (let t = i; t < s.length; t++) s[t].indent < s[t].line.text.length && (s[t].indent = o);
                        s.length == i + 1 && (s[i].single = !0)
                    }
                }
                if (2 != t && s.some(t => t.comment < 0 && (!t.empty || t.single))) {
                    let t = [];
                    for (let {
                            line: e,
                            token: i,
                            indent: n,
                            empty: r,
                            single: o
                        }
                        of s) !o && r || t.push({
                        from: e.from + n,
                        insert: i + " "
                    });
                    let i = e.changes(t);
                    return {
                        changes: i,
                        selection: e.selection.map(i, 1)
                    }
                }
                if (1 != t && s.some(t => t.comment >= 0)) {
                    let t = [];
                    for (let {
                            line: e,
                            comment: i,
                            token: n
                        }
                        of s)
                        if (i >= 0) {
                            let s = e.from + i,
                                r = s + n.length;
                            " " == e.text[r - e.from] && r++, t.push({
                                from: s,
                                to: r
                            })
                        } return {
                        changes: t
                    }
                }
                return null
            }
            const p = n.YH.define(),
                m = n.YH.define(),
                g = n.sj.define(),
                v = n.sj.define({
                    combine: t => (0, n.QR)(t, {
                        minDepth: 100,
                        newGroupDelay: 500,
                        joinToEvent: (t, e) => e
                    }, {
                        minDepth: Math.max,
                        newGroupDelay: Math.min,
                        joinToEvent: (t, e) => (i, s) => t(i, s) || e(i, s)
                    })
                }),
                b = n.sU.define({
                    create: () => B.empty,
                    update(t, e) {
                        let i = e.state.facet(v),
                            s = e.annotation(p);
                        if (s) {
                            let n = C.fromTransaction(e, s.selection),
                                r = s.side,
                                o = 0 == r ? t.undone : t.done;
                            return o = n ? A(o, o.length, i.minDepth, n) : T(o, e.startState.selection), new B(0 == r ? s.rest : o, 0 == r ? o : s.rest)
                        }
                        let r = e.annotation(m);
                        if ("full" != r && "before" != r || (t = t.isolate()), !1 === e.annotation(n.ZX.addToHistory)) return e.changes.empty ? t : t.addMapping(e.changes.desc);
                        let o = C.fromTransaction(e),
                            l = e.annotation(n.ZX.time),
                            a = e.annotation(n.ZX.userEvent);
                        return o ? t = t.addChanges(o, l, a, i, e) : e.selection && (t = t.addSelection(e.startState.selection, l, a, i.newGroupDelay)), "full" != r && "after" != r || (t = t.isolate()), t
                    },
                    toJSON: t => ({
                        done: t.done.map(t => t.toJSON()),
                        undone: t.undone.map(t => t.toJSON())
                    }),
                    fromJSON: t => new B(t.done.map(C.fromJSON), t.undone.map(C.fromJSON))
                });

            function w(t = {}) {
                return [b, v.of(t), s.Lz.domEventHandlers({
                    beforeinput(t, e) {
                        let i = "historyUndo" == t.inputType ? O : "historyRedo" == t.inputType ? x : null;
                        return !!i && (t.preventDefault(), i(e))
                    }
                })]
            }

            function y(t, e) {
                return function({
                    state: i,
                    dispatch: s
                }) {
                    if (!e && i.readOnly) return !1;
                    let n = i.field(b, !1);
                    if (!n) return !1;
                    let r = n.pop(t, i, e);
                    return !!r && (s(r), !0)
                }
            }
            const O = y(0, !1),
                x = y(1, !1),
                k = y(0, !0),
                S = y(1, !0);
            class C {
                constructor(t, e, i, s, n) {
                    this.changes = t, this.effects = e, this.mapped = i, this.startSelection = s, this.selectionsAfter = n
                }
                setSelAfter(t) {
                    return new C(this.changes, this.effects, this.mapped, this.startSelection, t)
                }
                toJSON() {
                    var t, e, i;
                    return {
                        changes: null === (t = this.changes) || void 0 === t ? void 0 : t.toJSON(),
                        mapped: null === (e = this.mapped) || void 0 === e ? void 0 : e.toJSON(),
                        startSelection: null === (i = this.startSelection) || void 0 === i ? void 0 : i.toJSON(),
                        selectionsAfter: this.selectionsAfter.map(t => t.toJSON())
                    }
                }
                static fromJSON(t) {
                    return new C(t.changes && n.VR.fromJSON(t.changes), [], t.mapped && n.Gu.fromJSON(t.mapped), t.startSelection && n.OF.fromJSON(t.startSelection), t.selectionsAfter.map(n.OF.fromJSON))
                }
                static fromTransaction(t, e) {
                    let i = Q;
                    for (let e of t.startState.facet(g)) {
                        let s = e(t);
                        s.length && (i = i.concat(s))
                    }
                    return !i.length && t.changes.empty ? null : new C(t.changes.invert(t.startState.doc), i, void 0, e || t.startState.selection, Q)
                }
                static selection(t) {
                    return new C(void 0, Q, void 0, void 0, t)
                }
            }

            function A(t, e, i, s) {
                let n = e + 1 > i + 20 ? e - i - 1 : 0,
                    r = t.slice(n, e);
                return r.push(s), r
            }

            function M(t, e) {
                return t.length ? e.length ? t.concat(e) : t : e
            }
            const Q = [];

            function T(t, e) {
                if (t.length) {
                    let i = t[t.length - 1],
                        s = i.selectionsAfter.slice(Math.max(0, i.selectionsAfter.length - 200));
                    return s.length && s[s.length - 1].eq(e) ? t : (s.push(e), A(t, t.length - 1, 1e9, i.setSelAfter(s)))
                }
                return [C.selection([e])]
            }

            function P(t) {
                let e = t[t.length - 1],
                    i = t.slice();
                return i[t.length - 1] = e.setSelAfter(e.selectionsAfter.slice(0, e.selectionsAfter.length - 1)), i
            }

            function D(t, e) {
                if (!t.length) return t;
                let i = t.length,
                    s = Q;
                for (; i;) {
                    let n = R(t[i - 1], e, s);
                    if (n.changes && !n.changes.empty || n.effects.length) {
                        let e = t.slice(0, i);
                        return e[i - 1] = n, e
                    }
                    e = n.mapped, i--, s = n.selectionsAfter
                }
                return s.length ? [C.selection(s)] : Q
            }

            function R(t, e, i) {
                let s = M(t.selectionsAfter.length ? t.selectionsAfter.map(t => t.map(e)) : Q, i);
                if (!t.changes) return C.selection(s);
                let r = t.changes.map(e),
                    o = e.mapDesc(t.changes, !0),
                    l = t.mapped ? t.mapped.composeDesc(o) : o;
                return new C(r, n.Pe.mapEffects(t.effects, e), l, t.startSelection.map(o), s)
            }
            const E = /^(input\.type|delete)($|\.)/;
            class B {
                constructor(t, e, i = 0, s = void 0) {
                    this.done = t, this.undone = e, this.prevTime = i, this.prevUserEvent = s
                }
                isolate() {
                    return this.prevTime ? new B(this.done, this.undone) : this
                }
                addChanges(t, e, i, s, r) {
                    let o = this.done,
                        l = o[o.length - 1];
                    return o = l && l.changes && !l.changes.empty && t.changes && (!i || E.test(i)) && (!l.selectionsAfter.length && e - this.prevTime < s.newGroupDelay && s.joinToEvent(r, function(t, e) {
                        let i = [],
                            s = !1;
                        return t.iterChangedRanges((t, e) => i.push(t, e)), e.iterChangedRanges((t, e, n, r) => {
                            for (let t = 0; t < i.length;) {
                                let e = i[t++],
                                    o = i[t++];
                                r >= e && n <= o && (s = !0)
                            }
                        }), s
                    }(l.changes, t.changes)) || "input.type.compose" == i) ? A(o, o.length - 1, s.minDepth, new C(t.changes.compose(l.changes), M(n.Pe.mapEffects(t.effects, l.changes), l.effects), l.mapped, l.startSelection, Q)) : A(o, o.length, s.minDepth, t), new B(o, Q, e, i)
                }
                addSelection(t, e, i, s) {
                    let n = this.done.length ? this.done[this.done.length - 1].selectionsAfter : Q;
                    return n.length > 0 && e - this.prevTime < s && i == this.prevUserEvent && i && /^select($|\.)/.test(i) && (r = n[n.length - 1], o = t, r.ranges.length == o.ranges.length && 0 === r.ranges.filter((t, e) => t.empty != o.ranges[e].empty).length) ? this : new B(T(this.done, t), this.undone, e, i);
                    var r, o
                }
                addMapping(t) {
                    return new B(D(this.done, t), D(this.undone, t), this.prevTime, this.prevUserEvent)
                }
                pop(t, e, i) {
                    let s = 0 == t ? this.done : this.undone;
                    if (0 == s.length) return null;
                    let n = s[s.length - 1],
                        r = n.selectionsAfter[0] || e.selection;
                    if (i && n.selectionsAfter.length) return e.update({
                        selection: n.selectionsAfter[n.selectionsAfter.length - 1],
                        annotations: p.of({
                            side: t,
                            rest: P(s),
                            selection: r
                        }),
                        userEvent: 0 == t ? "select.undo" : "select.redo",
                        scrollIntoView: !0
                    });
                    if (n.changes) {
                        let i = 1 == s.length ? Q : s.slice(0, s.length - 1);
                        return n.mapped && (i = D(i, n.mapped)), e.update({
                            changes: n.changes,
                            selection: n.startSelection,
                            effects: n.effects,
                            annotations: p.of({
                                side: t,
                                rest: i,
                                selection: r
                            }),
                            filter: !1,
                            userEvent: 0 == t ? "undo" : "redo",
                            scrollIntoView: !0
                        })
                    }
                    return null
                }
            }
            B.empty = new B(Q, Q);
            const L = [{
                key: "Mod-z",
                run: O,
                preventDefault: !0
            }, {
                key: "Mod-y",
                mac: "Mod-Shift-z",
                run: x,
                preventDefault: !0
            }, {
                linux: "Ctrl-Shift-z",
                run: x,
                preventDefault: !0
            }, {
                key: "Mod-u",
                run: k,
                preventDefault: !0
            }, {
                key: "Alt-u",
                mac: "Mod-Shift-u",
                run: S,
                preventDefault: !0
            }];

            function N(t, e) {
                return n.OF.create(t.ranges.map(e), t.mainIndex)
            }

            function I(t, e) {
                return t.update({
                    selection: e,
                    scrollIntoView: !0,
                    userEvent: "select"
                })
            }

            function z({
                state: t,
                dispatch: e
            }, i) {
                let s = N(t.selection, i);
                return !s.eq(t.selection, !0) && (e(I(t, s)), !0)
            }

            function F(t, e) {
                return n.OF.cursor(e ? t.to : t.from)
            }

            function $(t, e) {
                return z(t, i => i.empty ? t.moveByChar(i, e) : F(i, e))
            }

            function W(t) {
                return t.textDirectionAt(t.state.selection.main.head) == s.OP.LTR
            }
            const V = t => $(t, !W(t)),
                j = t => $(t, W(t));

            function q(t, e) {
                return z(t, i => i.empty ? t.moveByGroup(i, e) : F(i, e))
            }

            function H(t, e, i) {
                if (e.type.prop(i)) return !0;
                let s = e.to - e.from;
                return s && (s > 2 || /[^\s,.;:]/.test(t.sliceDoc(e.from, e.to))) || e.firstChild
            }

            function _(t, e, i) {
                let s, l, a = (0, r.mv)(t).resolveInner(e.head),
                    h = i ? o.uY.closedBy : o.uY.openedBy;
                for (let s = e.head;;) {
                    let e = i ? a.childAfter(s) : a.childBefore(s);
                    if (!e) break;
                    H(t, e, h) ? a = e : s = i ? e.to : e.from
                }
                return l = a.type.prop(h) && (s = i ? (0, r.jU)(t, a.from, 1) : (0, r.jU)(t, a.to, -1)) && s.matched ? i ? s.end.to : s.end.from : i ? a.to : a.from, n.OF.cursor(l, i ? -1 : 1)
            }

            function X(t, e) {
                return z(t, i => {
                    if (!i.empty) return F(i, e);
                    let s = t.moveVertically(i, e);
                    return s.head != i.head ? s : t.moveToLineBoundary(i, e)
                })
            }
            "undefined" != typeof Intl && Intl.Segmenter;
            const Y = t => X(t, !1),
                U = t => X(t, !0);

            function G(t) {
                let e, i = t.scrollDOM.clientHeight < t.scrollDOM.scrollHeight - 2,
                    n = 0,
                    r = 0;
                if (i) {
                    for (let e of t.state.facet(s.Lz.scrollMargins)) {
                        let i = e(t);
                        (null == i ? void 0 : i.top) && (n = Math.max(null == i ? void 0 : i.top, n)), (null == i ? void 0 : i.bottom) && (r = Math.max(null == i ? void 0 : i.bottom, r))
                    }
                    e = t.scrollDOM.clientHeight - n - r
                } else e = (t.dom.ownerDocument.defaultView || window).innerHeight;
                return {
                    marginTop: n,
                    marginBottom: r,
                    selfScroll: i,
                    height: Math.max(t.defaultLineHeight, e - 5)
                }
            }

            function K(t, e) {
                let i, n = G(t),
                    {
                        state: r
                    } = t,
                    o = N(r.selection, i => i.empty ? t.moveVertically(i, e, n.height) : F(i, e));
                if (o.eq(r.selection)) return !1;
                if (n.selfScroll) {
                    let e = t.coordsAtPos(r.selection.main.head),
                        l = t.scrollDOM.getBoundingClientRect(),
                        a = l.top + n.marginTop,
                        h = l.bottom - n.marginBottom;
                    e && e.top > a && e.bottom < h && (i = s.Lz.scrollIntoView(o.main.head, {
                        y: "start",
                        yMargin: e.top - a
                    }))
                }
                return t.dispatch(I(r, o), {
                    effects: i
                }), !0
            }
            const Z = t => K(t, !1),
                J = t => K(t, !0);

            function tt(t, e, i) {
                let s = t.lineBlockAt(e.head),
                    r = t.moveToLineBoundary(e, i);
                if (r.head == e.head && r.head != (i ? s.to : s.from) && (r = t.moveToLineBoundary(e, i, !1)), !i && r.head == s.from && s.length) {
                    let i = /^\s*/.exec(t.state.sliceDoc(s.from, Math.min(s.from + 100, s.to)))[0].length;
                    i && e.head != s.from + i && (r = n.OF.cursor(s.from + i))
                }
                return r
            }

            function et(t, e) {
                let i = N(t.state.selection, t => {
                    let i = e(t);
                    return n.OF.range(t.anchor, i.head, i.goalColumn, i.bidiLevel || void 0)
                });
                return !i.eq(t.state.selection) && (t.dispatch(I(t.state, i)), !0)
            }

            function it(t, e) {
                return et(t, i => t.moveByChar(i, e))
            }
            const st = t => it(t, !W(t)),
                nt = t => it(t, W(t));

            function rt(t, e) {
                return et(t, i => t.moveByGroup(i, e))
            }

            function ot(t, e) {
                return et(t, i => t.moveVertically(i, e))
            }
            const lt = t => ot(t, !1),
                at = t => ot(t, !0);

            function ht(t, e) {
                return et(t, i => t.moveVertically(i, e, G(t).height))
            }
            const ct = t => ht(t, !1),
                ut = t => ht(t, !0),
                dt = ({
                    state: t,
                    dispatch: e
                }) => (e(I(t, {
                    anchor: 0
                })), !0),
                ft = ({
                    state: t,
                    dispatch: e
                }) => (e(I(t, {
                    anchor: t.doc.length
                })), !0),
                pt = ({
                    state: t,
                    dispatch: e
                }) => (e(I(t, {
                    anchor: t.selection.main.anchor,
                    head: 0
                })), !0),
                mt = ({
                    state: t,
                    dispatch: e
                }) => (e(I(t, {
                    anchor: t.selection.main.anchor,
                    head: t.doc.length
                })), !0);

            function gt(t, e) {
                let {
                    state: i
                } = t, s = i.selection, r = i.selection.ranges.slice();
                for (let s of i.selection.ranges) {
                    let n = i.doc.lineAt(s.head);
                    if (e ? n.to < t.state.doc.length : n.from > 0)
                        for (let i = s;;) {
                            let s = t.moveVertically(i, e);
                            if (s.head < n.from || s.head > n.to) {
                                r.some(t => t.head == s.head) || r.push(s);
                                break
                            }
                            if (s.head == i.head) break;
                            i = s
                        }
                }
                return r.length != s.ranges.length && (t.dispatch(I(i, n.OF.create(r, r.length - 1))), !0)
            }

            function vt(t, e) {
                if (t.state.readOnly) return !1;
                let i = "delete.selection",
                    {
                        state: r
                    } = t,
                    o = r.changeByRange(s => {
                        let {
                            from: r,
                            to: o
                        } = s;
                        if (r == o) {
                            let n = e(s);
                            n < r ? (i = "delete.backward", n = bt(t, n, !1)) : n > r && (i = "delete.forward", n = bt(t, n, !0)), r = Math.min(r, n), o = Math.max(o, n)
                        } else r = bt(t, r, !1), o = bt(t, o, !0);
                        return r == o ? {
                            range: s
                        } : {
                            changes: {
                                from: r,
                                to: o
                            },
                            range: n.OF.cursor(r, r < s.head ? -1 : 1)
                        }
                    });
                return !o.changes.empty && (t.dispatch(r.update(o, {
                    scrollIntoView: !0,
                    userEvent: i,
                    effects: "delete.selection" == i ? s.Lz.announce.of(r.phrase("Selection deleted")) : void 0
                })), !0)
            }

            function bt(t, e, i) {
                if (t instanceof s.Lz)
                    for (let n of t.state.facet(s.Lz.atomicRanges).map(e => e(t))) n.between(e, e, (t, s) => {
                        t < e && s > e && (e = i ? s : t)
                    });
                return e
            }
            const wt = (t, e, i) => vt(t, s => {
                    let o, l, a = s.from,
                        {
                            state: h
                        } = t,
                        c = h.doc.lineAt(a);
                    if (i && !e && a > c.from && a < c.from + 200 && !/[^ \t]/.test(o = c.text.slice(0, a - c.from))) {
                        if ("\t" == o[o.length - 1]) return a - 1;
                        let t = (0, n.y$)(o, h.tabSize) % (0, r.tp)(h) || (0, r.tp)(h);
                        for (let e = 0; e < t && " " == o[o.length - 1 - e]; e++) a--;
                        l = a
                    } else l = (0, n.zK)(c.text, a - c.from, e, e) + c.from, l == a && c.number != (e ? h.doc.lines : 1) ? l += e ? 1 : -1 : !e && /[\ufe00-\ufe0f]/.test(c.text.slice(l - c.from, a - c.from)) && (l = (0, n.zK)(c.text, l - c.from, !1, !1) + c.from);
                    return l
                }),
                yt = t => wt(t, !1, !0),
                Ot = t => wt(t, !0, !1),
                xt = (t, e) => vt(t, i => {
                    let s = i.head,
                        {
                            state: r
                        } = t,
                        o = r.doc.lineAt(s),
                        l = r.charCategorizer(s);
                    for (let t = null;;) {
                        if (s == (e ? o.to : o.from)) {
                            s == i.head && o.number != (e ? r.doc.lines : 1) && (s += e ? 1 : -1);
                            break
                        }
                        let a = (0, n.zK)(o.text, s - o.from, e) + o.from,
                            h = o.text.slice(Math.min(s, a) - o.from, Math.max(s, a) - o.from),
                            c = l(h);
                        if (null != t && c != t) break;
                        " " == h && s == i.head || (t = c), s = a
                    }
                    return s
                }),
                kt = t => xt(t, !1);

            function St(t) {
                let e = [],
                    i = -1;
                for (let s of t.selection.ranges) {
                    let n = t.doc.lineAt(s.from),
                        r = t.doc.lineAt(s.to);
                    if (s.empty || s.to != r.from || (r = t.doc.lineAt(s.to - 1)), i >= n.number) {
                        let t = e[e.length - 1];
                        t.to = r.to, t.ranges.push(s)
                    } else e.push({
                        from: n.from,
                        to: r.to,
                        ranges: [s]
                    });
                    i = r.number + 1
                }
                return e
            }

            function Ct(t, e, i) {
                if (t.readOnly) return !1;
                let s = [],
                    r = [];
                for (let e of St(t)) {
                    if (i ? e.to == t.doc.length : 0 == e.from) continue;
                    let o = t.doc.lineAt(i ? e.to + 1 : e.from - 1),
                        l = o.length + 1;
                    if (i) {
                        s.push({
                            from: e.to,
                            to: o.to
                        }, {
                            from: e.from,
                            insert: o.text + t.lineBreak
                        });
                        for (let i of e.ranges) r.push(n.OF.range(Math.min(t.doc.length, i.anchor + l), Math.min(t.doc.length, i.head + l)))
                    } else {
                        s.push({
                            from: o.from,
                            to: e.from
                        }, {
                            from: e.to,
                            insert: t.lineBreak + o.text
                        });
                        for (let t of e.ranges) r.push(n.OF.range(t.anchor - l, t.head - l))
                    }
                }
                return !!s.length && (e(t.update({
                    changes: s,
                    scrollIntoView: !0,
                    selection: n.OF.create(r, t.selection.mainIndex),
                    userEvent: "move.line"
                })), !0)
            }

            function At(t, e, i) {
                if (t.readOnly) return !1;
                let s = [];
                for (let e of St(t)) i ? s.push({
                    from: e.from,
                    insert: t.doc.slice(e.from, e.to) + t.lineBreak
                }) : s.push({
                    from: e.to,
                    insert: t.lineBreak + t.doc.slice(e.from, e.to)
                });
                let n = t.changes(s);
                return e(t.update({
                    changes: n,
                    selection: t.selection.map(n, i ? 1 : -1),
                    scrollIntoView: !0,
                    userEvent: "input.copyline"
                })), !0
            }
            const Mt = Qt(!1);

            function Qt(t) {
                return ({
                    state: e,
                    dispatch: i
                }) => {
                    if (e.readOnly) return !1;
                    let s = e.changeByRange(i => {
                        let {
                            from: s,
                            to: l
                        } = i, a = e.doc.lineAt(s), h = !t && s == l && function(t, e) {
                            if (/\(\)|\[\]|\{\}/.test(t.sliceDoc(e - 1, e + 1))) return {
                                from: e,
                                to: e
                            };
                            let i, s = (0, r.mv)(t).resolveInner(e),
                                n = s.childBefore(e),
                                l = s.childAfter(e);
                            return n && l && n.to <= e && l.from >= e && (i = n.type.prop(o.uY.closedBy)) && i.indexOf(l.name) > -1 && t.doc.lineAt(n.to).from == t.doc.lineAt(l.from).from && !/\S/.test(t.sliceDoc(n.to, l.from)) ? {
                                from: n.to,
                                to: l.from
                            } : null
                        }(e, s);
                        t && (s = l = (l <= a.to ? a : e.doc.lineAt(l)).to);
                        let c = new r.KB(e, {
                                simulateBreak: s,
                                simulateDoubleBreak: !!h
                            }),
                            u = (0, r._v)(c, s);
                        for (null == u && (u = (0, n.y$)(/^\s*/.exec(e.doc.lineAt(s).text)[0], e.tabSize)); l < a.to && /\s/.test(a.text[l - a.from]);) l++;
                        h ? ({
                            from: s,
                            to: l
                        } = h) : s > a.from && s < a.from + 100 && !/\S/.test(a.text.slice(0, s)) && (s = a.from);
                        let d = ["", (0, r.EI)(e, u)];
                        return h && d.push((0, r.EI)(e, c.lineIndent(a.from, -1))), {
                            changes: {
                                from: s,
                                to: l,
                                insert: n.EY.of(d)
                            },
                            range: n.OF.cursor(s + 1 + d[1].length)
                        }
                    });
                    return i(e.update(s, {
                        scrollIntoView: !0,
                        userEvent: "input"
                    })), !0
                }
            }

            function Tt(t, e) {
                let i = -1;
                return t.changeByRange(s => {
                    let r = [];
                    for (let n = s.from; n <= s.to;) {
                        let o = t.doc.lineAt(n);
                        o.number > i && (s.empty || s.to > o.from) && (e(o, r, s), i = o.number), n = o.to + 1
                    }
                    let o = t.changes(r);
                    return {
                        changes: r,
                        range: n.OF.range(o.mapPos(s.anchor, 1), o.mapPos(s.head, 1))
                    }
                })
            }
            const Pt = [{
                key: "Alt-ArrowLeft",
                mac: "Ctrl-ArrowLeft",
                run: t => z(t, e => _(t.state, e, !W(t))),
                shift: t => et(t, e => _(t.state, e, !W(t)))
            }, {
                key: "Alt-ArrowRight",
                mac: "Ctrl-ArrowRight",
                run: t => z(t, e => _(t.state, e, W(t))),
                shift: t => et(t, e => _(t.state, e, W(t)))
            }, {
                key: "Alt-ArrowUp",
                run: ({
                    state: t,
                    dispatch: e
                }) => Ct(t, e, !1)
            }, {
                key: "Shift-Alt-ArrowUp",
                run: ({
                    state: t,
                    dispatch: e
                }) => At(t, e, !1)
            }, {
                key: "Alt-ArrowDown",
                run: ({
                    state: t,
                    dispatch: e
                }) => Ct(t, e, !0)
            }, {
                key: "Shift-Alt-ArrowDown",
                run: ({
                    state: t,
                    dispatch: e
                }) => At(t, e, !0)
            }, {
                key: "Mod-Alt-ArrowUp",
                run: t => gt(t, !1)
            }, {
                key: "Mod-Alt-ArrowDown",
                run: t => gt(t, !0)
            }, {
                key: "Escape",
                run: ({
                    state: t,
                    dispatch: e
                }) => {
                    let i = t.selection,
                        s = null;
                    return i.ranges.length > 1 ? s = n.OF.create([i.main]) : i.main.empty || (s = n.OF.create([n.OF.cursor(i.main.head)])), !!s && (e(I(t, s)), !0)
                }
            }, {
                key: "Mod-Enter",
                run: Qt(!0)
            }, {
                key: "Alt-l",
                mac: "Ctrl-l",
                run: ({
                    state: t,
                    dispatch: e
                }) => {
                    let i = St(t).map(({
                        from: e,
                        to: i
                    }) => n.OF.range(e, Math.min(i + 1, t.doc.length)));
                    return e(t.update({
                        selection: n.OF.create(i),
                        userEvent: "select"
                    })), !0
                }
            }, {
                key: "Mod-i",
                run: ({
                    state: t,
                    dispatch: e
                }) => {
                    let i = N(t.selection, e => {
                        let i = (0, r.mv)(t),
                            s = i.resolveStack(e.from, 1);
                        if (e.empty) {
                            let t = i.resolveStack(e.from, -1);
                            t.node.from >= s.node.from && t.node.to <= s.node.to && (s = t)
                        }
                        for (let t = s; t; t = t.next) {
                            let {
                                node: i
                            } = t;
                            if ((i.from < e.from && i.to >= e.to || i.to > e.to && i.from <= e.from) && t.next) return n.OF.range(i.to, i.from)
                        }
                        return e
                    });
                    return !i.eq(t.selection) && (e(I(t, i)), !0)
                },
                preventDefault: !0
            }, {
                key: "Mod-[",
                run: ({
                    state: t,
                    dispatch: e
                }) => !t.readOnly && (e(t.update(Tt(t, (e, i) => {
                    let s = /^\s*/.exec(e.text)[0];
                    if (!s) return;
                    let o = (0, n.y$)(s, t.tabSize),
                        l = 0,
                        a = (0, r.EI)(t, Math.max(0, o - (0, r.tp)(t)));
                    for (; l < s.length && l < a.length && s.charCodeAt(l) == a.charCodeAt(l);) l++;
                    i.push({
                        from: e.from + l,
                        to: e.from + s.length,
                        insert: a.slice(l)
                    })
                }), {
                    userEvent: "delete.dedent"
                })), !0)
            }, {
                key: "Mod-]",
                run: ({
                    state: t,
                    dispatch: e
                }) => !t.readOnly && (e(t.update(Tt(t, (e, i) => {
                    i.push({
                        from: e.from,
                        insert: t.facet(r.Xt)
                    })
                }), {
                    userEvent: "input.indent"
                })), !0)
            }, {
                key: "Mod-Alt-\\",
                run: ({
                    state: t,
                    dispatch: e
                }) => {
                    if (t.readOnly) return !1;
                    let i = Object.create(null),
                        s = new r.KB(t, {
                            overrideIndentation: t => {
                                let e = i[t];
                                return null == e ? -1 : e
                            }
                        }),
                        n = Tt(t, (e, n, o) => {
                            let l = (0, r._v)(s, e.from);
                            if (null == l) return;
                            /\S/.test(e.text) || (l = 0);
                            let a = /^\s*/.exec(e.text)[0],
                                h = (0, r.EI)(t, l);
                            (a != h || o.from < e.from + a.length) && (i[e.from] = l, n.push({
                                from: e.from,
                                to: e.from + a.length,
                                insert: h
                            }))
                        });
                    return n.changes.empty || e(t.update(n, {
                        userEvent: "indent"
                    })), !0
                }
            }, {
                key: "Shift-Mod-k",
                run: t => {
                    if (t.state.readOnly) return !1;
                    let {
                        state: e
                    } = t, i = e.changes(St(e).map(({
                        from: t,
                        to: i
                    }) => (t > 0 ? t-- : i < e.doc.length && i++, {
                        from: t,
                        to: i
                    }))), s = N(e.selection, e => {
                        let i;
                        if (t.lineWrapping) {
                            let s = t.lineBlockAt(e.head),
                                n = t.coordsAtPos(e.head, e.assoc || 1);
                            n && (i = s.bottom + t.documentTop - n.bottom + t.defaultLineHeight / 2)
                        }
                        return t.moveVertically(e, !0, i)
                    }).map(i);
                    return t.dispatch({
                        changes: i,
                        selection: s,
                        scrollIntoView: !0,
                        userEvent: "delete.line"
                    }), !0
                }
            }, {
                key: "Shift-Mod-\\",
                run: ({
                    state: t,
                    dispatch: e
                }) => function(t, e, i) {
                    let s = !1,
                        o = N(t.selection, e => {
                            let o = (0, r.jU)(t, e.head, -1) || (0, r.jU)(t, e.head, 1) || e.head > 0 && (0, r.jU)(t, e.head - 1, 1) || e.head < t.doc.length && (0, r.jU)(t, e.head + 1, -1);
                            if (!o || !o.end) return e;
                            s = !0;
                            let l = o.start.from == e.head ? o.end.to : o.end.from;
                            return i ? n.OF.range(e.anchor, l) : n.OF.cursor(l)
                        });
                    return !!s && (e(I(t, o)), !0)
                }(t, e, !1)
            }, {
                key: "Mod-/",
                run: t => {
                    let {
                        state: e
                    } = t, i = e.doc.lineAt(e.selection.main.from), s = u(t.state, i.from);
                    return s.line ? a(t) : !!s.block && c(t)
                }
            }, {
                key: "Alt-A",
                run: h
            }, {
                key: "Ctrl-m",
                mac: "Shift-Alt-m",
                run: t => (t.setTabFocusMode(), !0)
            }].concat([{
                key: "ArrowLeft",
                run: V,
                shift: st,
                preventDefault: !0
            }, {
                key: "Mod-ArrowLeft",
                mac: "Alt-ArrowLeft",
                run: t => q(t, !W(t)),
                shift: t => rt(t, !W(t)),
                preventDefault: !0
            }, {
                mac: "Cmd-ArrowLeft",
                run: t => z(t, e => tt(t, e, !W(t))),
                shift: t => et(t, e => tt(t, e, !W(t))),
                preventDefault: !0
            }, {
                key: "ArrowRight",
                run: j,
                shift: nt,
                preventDefault: !0
            }, {
                key: "Mod-ArrowRight",
                mac: "Alt-ArrowRight",
                run: t => q(t, W(t)),
                shift: t => rt(t, W(t)),
                preventDefault: !0
            }, {
                mac: "Cmd-ArrowRight",
                run: t => z(t, e => tt(t, e, W(t))),
                shift: t => et(t, e => tt(t, e, W(t))),
                preventDefault: !0
            }, {
                key: "ArrowUp",
                run: Y,
                shift: lt,
                preventDefault: !0
            }, {
                mac: "Cmd-ArrowUp",
                run: dt,
                shift: pt
            }, {
                mac: "Ctrl-ArrowUp",
                run: Z,
                shift: ct
            }, {
                key: "ArrowDown",
                run: U,
                shift: at,
                preventDefault: !0
            }, {
                mac: "Cmd-ArrowDown",
                run: ft,
                shift: mt
            }, {
                mac: "Ctrl-ArrowDown",
                run: J,
                shift: ut
            }, {
                key: "PageUp",
                run: Z,
                shift: ct
            }, {
                key: "PageDown",
                run: J,
                shift: ut
            }, {
                key: "Home",
                run: t => z(t, e => tt(t, e, !1)),
                shift: t => et(t, e => tt(t, e, !1)),
                preventDefault: !0
            }, {
                key: "Mod-Home",
                run: dt,
                shift: pt
            }, {
                key: "End",
                run: t => z(t, e => tt(t, e, !0)),
                shift: t => et(t, e => tt(t, e, !0)),
                preventDefault: !0
            }, {
                key: "Mod-End",
                run: ft,
                shift: mt
            }, {
                key: "Enter",
                run: Mt,
                shift: Mt
            }, {
                key: "Mod-a",
                run: ({
                    state: t,
                    dispatch: e
                }) => (e(t.update({
                    selection: {
                        anchor: 0,
                        head: t.doc.length
                    },
                    userEvent: "select"
                })), !0)
            }, {
                key: "Backspace",
                run: yt,
                shift: yt,
                preventDefault: !0
            }, {
                key: "Delete",
                run: Ot,
                preventDefault: !0
            }, {
                key: "Mod-Backspace",
                mac: "Alt-Backspace",
                run: kt,
                preventDefault: !0
            }, {
                key: "Mod-Delete",
                mac: "Alt-Delete",
                run: t => xt(t, !0),
                preventDefault: !0
            }, {
                mac: "Mod-Backspace",
                run: t => vt(t, e => {
                    let i = t.moveToLineBoundary(e, !1).head;
                    return e.head > i ? i : Math.max(0, e.head - 1)
                }),
                preventDefault: !0
            }, {
                mac: "Mod-Delete",
                run: t => vt(t, e => {
                    let i = t.moveToLineBoundary(e, !0).head;
                    return e.head < i ? i : Math.min(t.state.doc.length, e.head + 1)
                }),
                preventDefault: !0
            }].concat([{
                key: "Ctrl-b",
                run: V,
                shift: st,
                preventDefault: !0
            }, {
                key: "Ctrl-f",
                run: j,
                shift: nt
            }, {
                key: "Ctrl-p",
                run: Y,
                shift: lt
            }, {
                key: "Ctrl-n",
                run: U,
                shift: at
            }, {
                key: "Ctrl-a",
                run: t => z(t, e => n.OF.cursor(t.lineBlockAt(e.head).from, 1)),
                shift: t => et(t, e => n.OF.cursor(t.lineBlockAt(e.head).from))
            }, {
                key: "Ctrl-e",
                run: t => z(t, e => n.OF.cursor(t.lineBlockAt(e.head).to, -1)),
                shift: t => et(t, e => n.OF.cursor(t.lineBlockAt(e.head).to))
            }, {
                key: "Ctrl-d",
                run: Ot
            }, {
                key: "Ctrl-h",
                run: yt
            }, {
                key: "Ctrl-k",
                run: t => vt(t, e => {
                    let i = t.lineBlockAt(e.head).to;
                    return e.head < i ? i : Math.min(t.state.doc.length, e.head + 1)
                })
            }, {
                key: "Ctrl-Alt-h",
                run: kt
            }, {
                key: "Ctrl-o",
                run: ({
                    state: t,
                    dispatch: e
                }) => {
                    if (t.readOnly) return !1;
                    let i = t.changeByRange(t => ({
                        changes: {
                            from: t.from,
                            to: t.to,
                            insert: n.EY.of(["", ""])
                        },
                        range: n.OF.cursor(t.from)
                    }));
                    return e(t.update(i, {
                        scrollIntoView: !0,
                        userEvent: "input"
                    })), !0
                }
            }, {
                key: "Ctrl-t",
                run: ({
                    state: t,
                    dispatch: e
                }) => {
                    if (t.readOnly) return !1;
                    let i = t.changeByRange(e => {
                        if (!e.empty || 0 == e.from || e.from == t.doc.length) return {
                            range: e
                        };
                        let i = e.from,
                            s = t.doc.lineAt(i),
                            r = i == s.from ? i - 1 : (0, n.zK)(s.text, i - s.from, !1) + s.from,
                            o = i == s.to ? i + 1 : (0, n.zK)(s.text, i - s.from, !0) + s.from;
                        return {
                            changes: {
                                from: r,
                                to: o,
                                insert: t.doc.slice(i, o).append(t.doc.slice(r, i))
                            },
                            range: n.OF.cursor(o)
                        }
                    });
                    return !i.changes.empty && (e(t.update(i, {
                        scrollIntoView: !0,
                        userEvent: "move.character"
                    })), !0)
                }
            }, {
                key: "Ctrl-v",
                run: J
            }].map(t => ({
                mac: t.key,
                run: t.run,
                shift: t.shift
            }))));
            var Dt = i(748);
            const Rt = "function" == typeof String.prototype.normalize ? t => t.normalize("NFKD") : t => t;
            class Et {
                constructor(t, e, i = 0, s = t.length, n, r) {
                    this.test = r, this.value = {
                        from: 0,
                        to: 0
                    }, this.done = !1, this.matches = [], this.buffer = "", this.bufferPos = 0, this.iter = t.iterRange(i, s), this.bufferStart = i, this.normalize = n ? t => n(Rt(t)) : Rt, this.query = this.normalize(e)
                }
                peek() {
                    if (this.bufferPos == this.buffer.length) {
                        if (this.bufferStart += this.buffer.length, this.iter.next(), this.iter.done) return -1;
                        this.bufferPos = 0, this.buffer = this.iter.value
                    }
                    return (0, n.vS)(this.buffer, this.bufferPos)
                }
                next() {
                    for (; this.matches.length;) this.matches.pop();
                    return this.nextOverlapping()
                }
                nextOverlapping() {
                    for (;;) {
                        let t = this.peek();
                        if (t < 0) return this.done = !0, this;
                        let e = (0, n.MK)(t),
                            i = this.bufferStart + this.bufferPos;
                        this.bufferPos += (0, n.Fh)(t);
                        let s = this.normalize(e);
                        if (s.length)
                            for (let t = 0, n = i;; t++) {
                                let r = s.charCodeAt(t),
                                    o = this.match(r, n, this.bufferPos + this.bufferStart);
                                if (t == s.length - 1) {
                                    if (o) return this.value = o, this;
                                    break
                                }
                                n == i && t < e.length && e.charCodeAt(t) == r && n++
                            }
                    }
                }
                match(t, e, i) {
                    let s = null;
                    for (let e = 0; e < this.matches.length; e += 2) {
                        let n = this.matches[e],
                            r = !1;
                        this.query.charCodeAt(n) == t && (n == this.query.length - 1 ? s = {
                            from: this.matches[e + 1],
                            to: i
                        } : (this.matches[e]++, r = !0)), r || (this.matches.splice(e, 2), e -= 2)
                    }
                    return this.query.charCodeAt(0) == t && (1 == this.query.length ? s = {
                        from: e,
                        to: i
                    } : this.matches.push(1, e)), s && this.test && !this.test(s.from, s.to, this.buffer, this.bufferStart) && (s = null), s
                }
            }
            "undefined" != typeof Symbol && (Et.prototype[Symbol.iterator] = function() {
                return this
            });
            const Bt = {
                    from: -1,
                    to: -1,
                    match: /.*/.exec("")
                },
                Lt = "gm" + (null == /x/.unicode ? "" : "u");
            class Nt {
                constructor(t, e, i, s = 0, n = t.length) {
                    if (this.text = t, this.to = n, this.curLine = "", this.done = !1, this.value = Bt, /\\[sWDnr]|\n|\r|\[\^/.test(e)) return new Ft(t, e, i, s, n);
                    this.re = new RegExp(e, Lt + ((null == i ? void 0 : i.ignoreCase) ? "i" : "")), this.test = null == i ? void 0 : i.test, this.iter = t.iter();
                    let r = t.lineAt(s);
                    this.curLineStart = r.from, this.matchPos = $t(t, s), this.getLine(this.curLineStart)
                }
                getLine(t) {
                    this.iter.next(t), this.iter.lineBreak ? this.curLine = "" : (this.curLine = this.iter.value, this.curLineStart + this.curLine.length > this.to && (this.curLine = this.curLine.slice(0, this.to - this.curLineStart)), this.iter.next())
                }
                nextLine() {
                    this.curLineStart = this.curLineStart + this.curLine.length + 1, this.curLineStart > this.to ? this.curLine = "" : this.getLine(0)
                }
                next() {
                    for (let t = this.matchPos - this.curLineStart;;) {
                        this.re.lastIndex = t;
                        let e = this.matchPos <= this.to && this.re.exec(this.curLine);
                        if (e) {
                            let i = this.curLineStart + e.index,
                                s = i + e[0].length;
                            if (this.matchPos = $t(this.text, s + (i == s ? 1 : 0)), i == this.curLineStart + this.curLine.length && this.nextLine(), (i < s || i > this.value.to) && (!this.test || this.test(i, s, e))) return this.value = {
                                from: i,
                                to: s,
                                match: e
                            }, this;
                            t = this.matchPos - this.curLineStart
                        } else {
                            if (!(this.curLineStart + this.curLine.length < this.to)) return this.done = !0, this;
                            this.nextLine(), t = 0
                        }
                    }
                }
            }
            const It = new WeakMap;
            class zt {
                constructor(t, e) {
                    this.from = t, this.text = e
                }
                get to() {
                    return this.from + this.text.length
                }
                static get(t, e, i) {
                    let s = It.get(t);
                    if (!s || s.from >= i || s.to <= e) {
                        let s = new zt(e, t.sliceString(e, i));
                        return It.set(t, s), s
                    }
                    if (s.from == e && s.to == i) return s;
                    let {
                        text: n,
                        from: r
                    } = s;
                    return r > e && (n = t.sliceString(e, r) + n, r = e), s.to < i && (n += t.sliceString(s.to, i)), It.set(t, new zt(r, n)), new zt(e, n.slice(e - r, i - r))
                }
            }
            class Ft {
                constructor(t, e, i, s, n) {
                    this.text = t, this.to = n, this.done = !1, this.value = Bt, this.matchPos = $t(t, s), this.re = new RegExp(e, Lt + ((null == i ? void 0 : i.ignoreCase) ? "i" : "")), this.test = null == i ? void 0 : i.test, this.flat = zt.get(t, s, this.chunkEnd(s + 5e3))
                }
                chunkEnd(t) {
                    return t >= this.to ? this.to : this.text.lineAt(t).to
                }
                next() {
                    for (;;) {
                        let t = this.re.lastIndex = this.matchPos - this.flat.from,
                            e = this.re.exec(this.flat.text);
                        if (e && !e[0] && e.index == t && (this.re.lastIndex = t + 1, e = this.re.exec(this.flat.text)), e) {
                            let t = this.flat.from + e.index,
                                i = t + e[0].length;
                            if ((this.flat.to >= this.to || e.index + e[0].length <= this.flat.text.length - 10) && (!this.test || this.test(t, i, e))) return this.value = {
                                from: t,
                                to: i,
                                match: e
                            }, this.matchPos = $t(this.text, i + (t == i ? 1 : 0)), this
                        }
                        if (this.flat.to == this.to) return this.done = !0, this;
                        this.flat = zt.get(this.text, this.flat.from, this.chunkEnd(this.flat.from + 2 * this.flat.text.length))
                    }
                }
            }

            function $t(t, e) {
                if (e >= t.length) return e;
                let i, s = t.lineAt(e);
                for (; e < s.to && (i = s.text.charCodeAt(e - s.from)) >= 56320 && i < 57344;) e++;
                return e
            }
            "undefined" != typeof Symbol && (Nt.prototype[Symbol.iterator] = Ft.prototype[Symbol.iterator] = function() {
                return this
            });
            const Wt = {
                    highlightWordAroundCursor: !1,
                    minSelectionLength: 1,
                    maxMatches: 100,
                    wholeWords: !1
                },
                Vt = n.sj.define({
                    combine: t => (0, n.QR)(t, Wt, {
                        highlightWordAroundCursor: (t, e) => t || e,
                        minSelectionLength: Math.min,
                        maxMatches: Math.min
                    })
                });

            function jt(t) {
                let e = [Yt, Xt];
                return t && e.push(Vt.of(t)), e
            }
            const qt = s.NZ.mark({
                    class: "css-selectionMatch"
                }),
                Ht = s.NZ.mark({
                    class: "css-selectionMatch css-selectionMatch-main"
                });

            function _t(t, e, i, s) {
                return !(0 != i && t(e.sliceDoc(i - 1, i)) == n.Je.Word || s != e.doc.length && t(e.sliceDoc(s, s + 1)) == n.Je.Word)
            }
            const Xt = s.Z9.fromClass(class {
                    constructor(t) {
                        this.decorations = this.getDeco(t)
                    }
                    update(t) {
                        (t.selectionSet || t.docChanged || t.viewportChanged) && (this.decorations = this.getDeco(t.view))
                    }
                    getDeco(t) {
                        let e = t.state.facet(Vt),
                            {
                                state: i
                            } = t,
                            r = i.selection;
                        if (r.ranges.length > 1) return s.NZ.none;
                        let o, l = r.main,
                            a = null;
                        if (l.empty) {
                            if (!e.highlightWordAroundCursor) return s.NZ.none;
                            let t = i.wordAt(l.head);
                            if (!t) return s.NZ.none;
                            a = i.charCategorizer(l.head), o = i.sliceDoc(t.from, t.to)
                        } else {
                            let t = l.to - l.from;
                            if (t < e.minSelectionLength || t > 200) return s.NZ.none;
                            if (e.wholeWords) {
                                if (o = i.sliceDoc(l.from, l.to), a = i.charCategorizer(l.head), !_t(a, i, l.from, l.to) || ! function(t, e, i, s) {
                                        return t(e.sliceDoc(i, i + 1)) == n.Je.Word && t(e.sliceDoc(s - 1, s)) == n.Je.Word
                                    }(a, i, l.from, l.to)) return s.NZ.none
                            } else if (o = i.sliceDoc(l.from, l.to), !o) return s.NZ.none
                        }
                        let h = [];
                        for (let n of t.visibleRanges) {
                            let t = new Et(i.doc, o, n.from, n.to);
                            for (; !t.next().done;) {
                                let {
                                    from: n,
                                    to: r
                                } = t.value;
                                if ((!a || _t(a, i, n, r)) && (l.empty && n <= l.from && r >= l.to ? h.push(Ht.range(n, r)) : (n >= l.to || r <= l.from) && h.push(qt.range(n, r)), h.length > e.maxMatches)) return s.NZ.none
                            }
                        }
                        return s.NZ.set(h)
                    }
                }, {
                    decorations: t => t.decorations
                }),
                Yt = s.Lz.baseTheme({}),
                Ut = n.sj.define({
                    combine: t => (0, n.QR)(t, {
                        top: !1,
                        caseSensitive: !1,
                        literal: !1,
                        regexp: !1,
                        wholeWord: !1,
                        createPanel: t => new Se(t),
                        scrollToMatch: t => s.Lz.scrollIntoView(t)
                    })
                });
            class Gt {
                constructor(t) {
                    this.search = t.search, this.caseSensitive = !!t.caseSensitive, this.literal = !!t.literal, this.regexp = !!t.regexp, this.replace = t.replace || "", this.valid = !!this.search && (!this.regexp || function(t) {
                        try {
                            return new RegExp(t, Lt), !0
                        } catch (t) {
                            return !1
                        }
                    }(this.search)), this.unquoted = this.unquote(this.search), this.wholeWord = !!t.wholeWord, this.test = t.test
                }
                unquote(t) {
                    return this.literal ? t : t.replace(/\\([nrt\\])/g, (t, e) => "n" == e ? "\n" : "r" == e ? "\r" : "t" == e ? "\t" : "\\")
                }
                eq(t) {
                    return this.search == t.search && this.replace == t.replace && this.caseSensitive == t.caseSensitive && this.regexp == t.regexp && this.wholeWord == t.wholeWord && this.test == t.test
                }
                create() {
                    return this.regexp ? new se(this) : new Jt(this)
                }
                getCursor(t, e = 0, i) {
                    let s = t.doc ? t : n.$t.create({
                        doc: t
                    });
                    return null == i && (i = s.doc.length), this.regexp ? te(this, s, e, i) : Zt(this, s, e, i)
                }
            }
            class Kt {
                constructor(t) {
                    this.spec = t
                }
            }

            function Zt(t, e, i, s) {
                let r;
                var o, l;
                return t.wholeWord && (o = e.doc, l = e.charCategorizer(e.selection.main.head), r = (t, e, i, s) => ((s > t || s + i.length < e) && (s = Math.max(0, t - 2), i = o.sliceString(s, Math.min(o.length, e + 2))), !(l(ee(i, t - s)) == n.Je.Word && l(ie(i, t - s)) == n.Je.Word || l(ie(i, e - s)) == n.Je.Word && l(ee(i, e - s)) == n.Je.Word))), t.test && (r = function(t, e, i) {
                    return (s, n, r, o) => {
                        if (i && !i(s, n, r, o)) return !1;
                        let l = s >= o && n <= o + r.length ? r.slice(s - o, n - o) : e.doc.sliceString(s, n);
                        return t(l, e, s, n)
                    }
                }(t.test, e, r)), new Et(e.doc, t.unquoted, i, s, t.caseSensitive ? void 0 : t => t.toLowerCase(), r)
            }
            class Jt extends Kt {
                constructor(t) {
                    super(t)
                }
                nextMatch(t, e, i) {
                    let s = Zt(this.spec, t, i, t.doc.length).nextOverlapping();
                    if (s.done) {
                        let i = Math.min(t.doc.length, e + this.spec.unquoted.length);
                        s = Zt(this.spec, t, 0, i).nextOverlapping()
                    }
                    return s.done || s.value.from == e && s.value.to == i ? null : s.value
                }
                prevMatchInRange(t, e, i) {
                    for (let s = i;;) {
                        let i = Math.max(e, s - 1e4 - this.spec.unquoted.length),
                            n = Zt(this.spec, t, i, s),
                            r = null;
                        for (; !n.nextOverlapping().done;) r = n.value;
                        if (r) return r;
                        if (i == e) return null;
                        s -= 1e4
                    }
                }
                prevMatch(t, e, i) {
                    let s = this.prevMatchInRange(t, 0, e);
                    return s || (s = this.prevMatchInRange(t, Math.max(0, i - this.spec.unquoted.length), t.doc.length)), !s || s.from == e && s.to == i ? null : s
                }
                getReplacement(t) {
                    return this.spec.unquote(this.spec.replace)
                }
                matchAll(t, e) {
                    let i = Zt(this.spec, t, 0, t.doc.length),
                        s = [];
                    for (; !i.next().done;) {
                        if (s.length >= e) return null;
                        s.push(i.value)
                    }
                    return s
                }
                highlight(t, e, i, s) {
                    let n = Zt(this.spec, t, Math.max(0, e - this.spec.unquoted.length), Math.min(i + this.spec.unquoted.length, t.doc.length));
                    for (; !n.next().done;) s(n.value.from, n.value.to)
                }
            }

            function te(t, e, i, s) {
                let r;
                var o;
                return t.wholeWord && (o = e.charCategorizer(e.selection.main.head), r = (t, e, i) => !i[0].length || (o(ee(i.input, i.index)) != n.Je.Word || o(ie(i.input, i.index)) != n.Je.Word) && (o(ie(i.input, i.index + i[0].length)) != n.Je.Word || o(ee(i.input, i.index + i[0].length)) != n.Je.Word)), t.test && (r = function(t, e, i) {
                    return (s, n, r) => (!i || i(s, n, r)) && t(r[0], e, s, n)
                }(t.test, e, r)), new Nt(e.doc, t.search, {
                    ignoreCase: !t.caseSensitive,
                    test: r
                }, i, s)
            }

            function ee(t, e) {
                return t.slice((0, n.zK)(t, e, !1), e)
            }

            function ie(t, e) {
                return t.slice(e, (0, n.zK)(t, e))
            }
            class se extends Kt {
                nextMatch(t, e, i) {
                    let s = te(this.spec, t, i, t.doc.length).next();
                    return s.done && (s = te(this.spec, t, 0, e).next()), s.done ? null : s.value
                }
                prevMatchInRange(t, e, i) {
                    for (let s = 1;; s++) {
                        let n = Math.max(e, i - 1e4 * s),
                            r = te(this.spec, t, n, i),
                            o = null;
                        for (; !r.next().done;) o = r.value;
                        if (o && (n == e || o.from > n + 10)) return o;
                        if (n == e) return null
                    }
                }
                prevMatch(t, e, i) {
                    return this.prevMatchInRange(t, 0, e) || this.prevMatchInRange(t, i, t.doc.length)
                }
                getReplacement(t) {
                    return this.spec.unquote(this.spec.replace).replace(/\$([$&]|\d+)/g, (e, i) => {
                        if ("&" == i) return t.match[0];
                        if ("$" == i) return "$";
                        for (let e = i.length; e > 0; e--) {
                            let s = +i.slice(0, e);
                            if (s > 0 && s < t.match.length) return t.match[s] + i.slice(e)
                        }
                        return e
                    })
                }
                matchAll(t, e) {
                    let i = te(this.spec, t, 0, t.doc.length),
                        s = [];
                    for (; !i.next().done;) {
                        if (s.length >= e) return null;
                        s.push(i.value)
                    }
                    return s
                }
                highlight(t, e, i, s) {
                    let n = te(this.spec, t, Math.max(0, e - 250), Math.min(i + 250, t.doc.length));
                    for (; !n.next().done;) s(n.value.from, n.value.to)
                }
            }
            const ne = n.Pe.define(),
                re = n.Pe.define(),
                oe = n.sU.define({
                    create: t => new le(be(t).create(), null),
                    update(t, e) {
                        for (let i of e.effects) i.is(ne) ? t = new le(i.value.create(), t.panel) : i.is(re) && (t = new le(t.query, i.value ? ve : null));
                        return t
                    },
                    provide: t => s.S7.from(t, t => t.panel)
                });
            class le {
                constructor(t, e) {
                    this.query = t, this.panel = e
                }
            }
            const ae = s.NZ.mark({
                    class: "css-searchMatch"
                }),
                he = s.NZ.mark({
                    class: "css-searchMatch css-searchMatch-selected"
                }),
                ce = s.Z9.fromClass(class {
                    constructor(t) {
                        this.view = t, this.decorations = this.highlight(t.state.field(oe))
                    }
                    update(t) {
                        let e = t.state.field(oe);
                        (e != t.startState.field(oe) || t.docChanged || t.selectionSet || t.viewportChanged) && (this.decorations = this.highlight(e))
                    }
                    highlight({
                        query: t,
                        panel: e
                    }) {
                        if (!e || !t.spec.valid) return s.NZ.none;
                        let {
                            view: i
                        } = this, r = new n.vB;
                        for (let e = 0, s = i.visibleRanges, n = s.length; e < n; e++) {
                            let {
                                from: o,
                                to: l
                            } = s[e];
                            for (; e < n - 1 && l > s[e + 1].from - 500;) l = s[++e].to;
                            t.highlight(i.state, o, l, (t, e) => {
                                let s = i.state.selection.ranges.some(i => i.from == t && i.to == e);
                                r.add(t, e, s ? he : ae)
                            })
                        }
                        return r.finish()
                    }
                }, {
                    decorations: t => t.decorations
                });

            function ue(t) {
                return e => {
                    let i = e.state.field(oe, !1);
                    return i && i.query.spec.valid ? t(e, i) : Oe(e)
                }
            }
            const de = ue((t, {
                    query: e
                }) => {
                    let {
                        to: i
                    } = t.state.selection.main, s = e.nextMatch(t.state, i, i);
                    if (!s) return !1;
                    let r = n.OF.single(s.from, s.to),
                        o = t.state.facet(Ut);
                    return t.dispatch({
                        selection: r,
                        effects: [Me(t, s), o.scrollToMatch(r.main, t)],
                        userEvent: "select.search"
                    }), ye(t), !0
                }),
                fe = ue((t, {
                    query: e
                }) => {
                    let {
                        state: i
                    } = t, {
                        from: s
                    } = i.selection.main, r = e.prevMatch(i, s, s);
                    if (!r) return !1;
                    let o = n.OF.single(r.from, r.to),
                        l = t.state.facet(Ut);
                    return t.dispatch({
                        selection: o,
                        effects: [Me(t, r), l.scrollToMatch(o.main, t)],
                        userEvent: "select.search"
                    }), ye(t), !0
                }),
                pe = ue((t, {
                    query: e
                }) => {
                    let i = e.matchAll(t.state, 1e3);
                    return !(!i || !i.length || (t.dispatch({
                        selection: n.OF.create(i.map(t => n.OF.range(t.from, t.to))),
                        userEvent: "select.search.matches"
                    }), 0))
                }),
                me = ue((t, {
                    query: e
                }) => {
                    let {
                        state: i
                    } = t, {
                        from: r,
                        to: o
                    } = i.selection.main;
                    if (i.readOnly) return !1;
                    let l = e.nextMatch(i, r, r);
                    if (!l) return !1;
                    let a, h, c = l,
                        u = [],
                        d = [];
                    c.from == r && c.to == o && (h = i.toText(e.getReplacement(c)), u.push({
                        from: c.from,
                        to: c.to,
                        insert: h
                    }), c = e.nextMatch(i, c.from, c.to), d.push(s.Lz.announce.of(i.phrase("replaced match on line $", i.doc.lineAt(r).number) + ".")));
                    let f = t.state.changes(u);
                    return c && (a = n.OF.single(c.from, c.to).map(f), d.push(Me(t, c)), d.push(i.facet(Ut).scrollToMatch(a.main, t))), t.dispatch({
                        changes: f,
                        selection: a,
                        effects: d,
                        userEvent: "input.replace"
                    }), !0
                }),
                ge = ue((t, {
                    query: e
                }) => {
                    if (t.state.readOnly) return !1;
                    let i = e.matchAll(t.state, 1e9).map(t => {
                        let {
                            from: i,
                            to: s
                        } = t;
                        return {
                            from: i,
                            to: s,
                            insert: e.getReplacement(t)
                        }
                    });
                    if (!i.length) return !1;
                    let n = t.state.phrase("replaced $ matches", i.length) + ".";
                    return t.dispatch({
                        changes: i,
                        effects: s.Lz.announce.of(n),
                        userEvent: "input.replace.all"
                    }), !0
                });

            function ve(t) {
                return t.state.facet(Ut).createPanel(t)
            }

            function be(t, e) {
                var i, s, n, r, o;
                let l = t.selection.main,
                    a = l.empty || l.to > l.from + 100 ? "" : t.sliceDoc(l.from, l.to);
                if (e && !a) return e;
                let h = t.facet(Ut);
                return new Gt({
                    search: (null !== (i = null == e ? void 0 : e.literal) && void 0 !== i ? i : h.literal) ? a : a.replace(/\n/g, "\\n"),
                    caseSensitive: null !== (s = null == e ? void 0 : e.caseSensitive) && void 0 !== s ? s : h.caseSensitive,
                    literal: null !== (n = null == e ? void 0 : e.literal) && void 0 !== n ? n : h.literal,
                    regexp: null !== (r = null == e ? void 0 : e.regexp) && void 0 !== r ? r : h.regexp,
                    wholeWord: null !== (o = null == e ? void 0 : e.wholeWord) && void 0 !== o ? o : h.wholeWord
                })
            }

            function we(t) {
                let e = (0, s.ld)(t, ve);
                return e && e.dom.querySelector("[main-field]")
            }

            function ye(t) {
                let e = we(t);
                e && e == t.root.activeElement && e.select()
            }
            const Oe = t => {
                    let e = t.state.field(oe, !1);
                    if (e && e.panel) {
                        let i = we(t);
                        if (i && i != t.root.activeElement) {
                            let s = be(t.state, e.query.spec);
                            s.valid && t.dispatch({
                                effects: ne.of(s)
                            }), i.focus(), i.select()
                        }
                    } else t.dispatch({
                        effects: [re.of(!0), e ? ne.of(be(t.state, e.query.spec)) : n.Pe.appendConfig.of(Te)]
                    });
                    return !0
                },
                xe = t => {
                    let e = t.state.field(oe, !1);
                    if (!e || !e.panel) return !1;
                    let i = (0, s.ld)(t, ve);
                    return i && i.dom.contains(t.root.activeElement) && t.focus(), t.dispatch({
                        effects: re.of(!1)
                    }), !0
                },
                ke = [{
                    key: "Mod-f",
                    run: Oe,
                    scope: "editor search-panel"
                }, {
                    key: "F3",
                    run: de,
                    shift: fe,
                    scope: "editor search-panel",
                    preventDefault: !0
                }, {
                    key: "Mod-g",
                    run: de,
                    shift: fe,
                    scope: "editor search-panel",
                    preventDefault: !0
                }, {
                    key: "Escape",
                    run: xe,
                    scope: "editor search-panel"
                }, {
                    key: "Mod-Shift-l",
                    run: ({
                        state: t,
                        dispatch: e
                    }) => {
                        let i = t.selection;
                        if (i.ranges.length > 1 || i.main.empty) return !1;
                        let {
                            from: s,
                            to: r
                        } = i.main, o = [], l = 0;
                        for (let e = new Et(t.doc, t.sliceDoc(s, r)); !e.next().done;) {
                            if (o.length > 1e3) return !1;
                            e.value.from == s && (l = o.length), o.push(n.OF.range(e.value.from, e.value.to))
                        }
                        return e(t.update({
                            selection: n.OF.create(o, l),
                            userEvent: "select.search.matches"
                        })), !0
                    }
                }, {
                    key: "Mod-Alt-g",
                    run: t => {
                        let {
                            state: e
                        } = t, i = String(e.doc.lineAt(t.state.selection.main.head).number), {
                            close: r,
                            result: o
                        } = (0, s.ui)(t, {
                            label: e.phrase("Go to line"),
                            input: {
                                type: "text",
                                name: "line",
                                value: i
                            },
                            focus: !0,
                            submitLabel: e.phrase("go")
                        });
                        return o.then(i => {
                            let o = i && /^([+-])?(\d+)?(:\d+)?(%)?$/.exec(i.elements.line.value);
                            if (!o) return void t.dispatch({
                                effects: r
                            });
                            let l = e.doc.lineAt(e.selection.main.head),
                                [, a, h, c, u] = o,
                                d = c ? +c.slice(1) : 0,
                                f = h ? +h : l.number;
                            if (h && u) {
                                let t = f / 100;
                                a && (t = t * ("-" == a ? -1 : 1) + l.number / e.doc.lines), f = Math.round(e.doc.lines * t)
                            } else h && a && (f = f * ("-" == a ? -1 : 1) + l.number);
                            let p = e.doc.line(Math.max(1, Math.min(e.doc.lines, f))),
                                m = n.OF.cursor(p.from + Math.max(0, Math.min(d, p.length)));
                            t.dispatch({
                                effects: [r, s.Lz.scrollIntoView(m.from, {
                                    y: "center"
                                })],
                                selection: m
                            })
                        }), !0
                    }
                }, {
                    key: "Mod-d",
                    run: ({
                        state: t,
                        dispatch: e
                    }) => {
                        let {
                            ranges: i
                        } = t.selection;
                        if (i.some(t => t.from === t.to)) return (({
                            state: t,
                            dispatch: e
                        }) => {
                            let {
                                selection: i
                            } = t, s = n.OF.create(i.ranges.map(e => t.wordAt(e.head) || n.OF.cursor(e.head)), i.mainIndex);
                            return !s.eq(i) && (e(t.update({
                                selection: s
                            })), !0)
                        })({
                            state: t,
                            dispatch: e
                        });
                        let r = t.sliceDoc(i[0].from, i[0].to);
                        if (t.selection.ranges.some(e => t.sliceDoc(e.from, e.to) != r)) return !1;
                        let o = function(t, e) {
                            let {
                                main: i,
                                ranges: s
                            } = t.selection, n = t.wordAt(i.head), r = n && n.from == i.from && n.to == i.to;
                            for (let i = !1, n = new Et(t.doc, e, s[s.length - 1].to);;) {
                                if (n.next(), !n.done) {
                                    if (i && s.some(t => t.from == n.value.from)) continue;
                                    if (r) {
                                        let e = t.wordAt(n.value.from);
                                        if (!e || e.from != n.value.from || e.to != n.value.to) continue
                                    }
                                    return n.value
                                }
                                if (i) return null;
                                n = new Et(t.doc, e, 0, Math.max(0, s[s.length - 1].from - 1)), i = !0
                            }
                        }(t, r);
                        return !!o && (e(t.update({
                            selection: t.selection.addRange(n.OF.range(o.from, o.to), !1),
                            effects: s.Lz.scrollIntoView(o.to)
                        })), !0)
                    },
                    preventDefault: !0
                }];
            class Se {
                constructor(t) {
                    this.view = t;
                    let e = this.query = t.state.field(oe).query.spec;

                    // Button yardımcı fonksiyonu (title → data-tooltip)
                    function i(name, onclick, htmlIcerik, title = "") {
                        let btn = (0, Dt.A)("button", {
                            class: "css-button",
                            name: name,
                            onclick: onclick,
                            type: "button"
                        });
                        if (Array.isArray(htmlIcerik)) { btn.innerHTML = htmlIcerik.join(""); }
                        else { btn.innerHTML = htmlIcerik; }
                        if (title) {
                            btn.setAttribute("data-tooltip", title);  // data-title → data-tooltip
                        }
                        return btn;
                    }

                    this.commit = this.commit.bind(this);

                    // Alanlar (Inputs)
                    this.searchField = (0, Dt.A)("input", {
                        value: e.search,
                        placeholder: Ce(t, "Find (⮁ for history)"),
                        class: "css-textfield",
                        name: "search",
                        form: "",
                        "main-field": "true",
                        onchange: this.commit,
                        onkeyup: this.commit
                    });

                    this.replaceField = (0, Dt.A)("input", {
                        value: e.replace,
                        placeholder: Ce(t, "Replace"),
                        class: "css-textfield",
                        name: "replace",
                        form: "",
                        onchange: this.commit,
                        onkeyup: this.commit
                    });

                    this.caseField = (0, Dt.A)("input", { type: "checkbox", name: "case", form: "", checked: e.caseSensitive, onchange: this.commit });
                    this.reField = (0, Dt.A)("input", { type: "checkbox", name: "re", form: "", checked: e.regexp, onchange: this.commit });
                    this.wordField = (0, Dt.A)("input", { type: "checkbox", name: "word", form: "", checked: e.wholeWord, onchange: this.commit });

                    // Toggle button yardımcı fonksiyonu (title → data-tooltip)
                    const createToggle = (field, icon, title) => {
                        const btn = (0, Dt.A)("button", { 
                            type: "button", 
                            class: `css-toggle${field.checked ? " active" : ""}`
                        });
                        btn.innerHTML = icon;
                        btn.setAttribute("data-tooltip", title);  // data-title → data-tooltip
                        btn.onclick = () => {
                            field.checked = !field.checked;
                            btn.classList.toggle("active");
                            this.commit();
                        };
                        return btn;
                    };

                    // Toggle'lar
                    const caseToggle = createToggle(this.caseField, "Aa", "Büyük/Küçük Harfe Duyarlı");
                    const wordToggle = createToggle(this.wordField, "ab", "Tam Kelime");
                    const reToggle   = createToggle(this.reField, ".*", "Düzenli (Regex)");

                    // Search input + toggle’lar tek grup
                    const searchGroup = (0, Dt.A)("div", { class: "css-search-group" }, [
                        this.searchField,
                        caseToggle,
                        wordToggle,
                        reToggle
                    ]);

                    // repdown butonu
                    const rdBtn = (() => {
                        const btn = (0, Dt.A)("button", {
                            class: "css-button",
                            name: "repdown",
                            type: "button"
                        });
                        btn.innerHTML = '<data data-size="0.7"><i icon="chevron-right"></i></data>';
                        btn.setAttribute("data-tooltip", "Değiştir");  // data-title → data-tooltip

                        btn.onclick = () => {
                            const bottom = this.dom.querySelector(".css-search-bottom");
                            if (!bottom) return;
                            const isHidden = bottom.classList.toggle("hidden");
                            const icon = btn.querySelector("i");
                            if (icon) {
                                icon.setAttribute("icon", isHidden ? "chevron-right" : "chevron-down");
                            }
                            btn.setAttribute("data-tooltip", isHidden ? "Değiştir" : "Bul");
                        };
                        return btn;
                    })();

                    // Ana DOM Yapısı
                    this.dom = (0, Dt.A)("div", {
                        onkeydown: t => this.keydown(t),
                        class: "css-search css-panel"
                    }, [
                        rdBtn,
                        (0, Dt.A)("div", { class: "css-search-right" }, [
                            // Üst Satır
                            (0, Dt.A)("div", { class: "css-search-top" }, [
                                searchGroup,
                                i("next", () => de(t), [Ce(t, '<data data-size="0.7"><i icon="arrow-down"></i></data>')], "Sonraki"),
                                i("prev", () => fe(t), [Ce(t, '<data data-size="0.7"><i icon="arrow-up"></i></data>')], "Önceki"),
                                i("select", () => pe(t), [Ce(t, '<data data-size="0.7"><i icon="menu-left"></i></data>')], "Hepsi"),
                                (() => {
                                    let closeBtn = (0, Dt.A)("button", { 
                                        name: "close", 
                                        onclick: () => xe(t), 
                                        type: "button", 
                                        class: "css-button-close" 
                                    });
                                    closeBtn.innerHTML = '<data data-size="0.7"><i icon="close"></i></data>';
                                    closeBtn.setAttribute("data-tooltip", "Kapat");  // data-title → data-tooltip
                                    return closeBtn;
                                })()
                            ]),

                            // Alt Satır (readOnly ise yok)
                            ...t.state.readOnly ? [] : [
                                (0, Dt.A)("div", { class: "css-search-bottom hidden" }, [
                                    this.replaceField,
                                    i("replace", () => me(t), [Ce(t, '<data data-size="0.7"><i icon="replace"></i></data>')], "Değiştir"),
                                    i("replaceAll", () => ge(t), [Ce(t, '<data data-size="0.7"><i icon="replace-all"></i></data>')], "Tümünü Değiştir")
                                ])
                            ]
                        ])
                    ]);
                }
                commit() {
                    let t = new Gt({
                        search: this.searchField.value,
                        caseSensitive: this.caseField.checked,
                        regexp: this.reField.checked,
                        wholeWord: this.wordField.checked,
                        replace: this.replaceField.value
                    });
                    t.eq(this.query) || (this.query = t, this.view.dispatch({
                        effects: ne.of(t)
                    }))
                }
                keydown(t) {
                    (0, s.TS)(this.view, t, "search-panel") ? t.preventDefault(): 13 == t.keyCode && t.target == this.searchField ? (t.preventDefault(), (t.shiftKey ? fe : de)(this.view)) : 13 == t.keyCode && t.target == this.replaceField && (t.preventDefault(), me(this.view))
                }
                update(t) {
                    for (let e of t.transactions)
                        for (let t of e.effects) t.is(ne) && !t.value.eq(this.query) && this.setQuery(t.value)
                }
                setQuery(t) {
                    this.query = t, this.searchField.value = t.search, this.replaceField.value = t.replace, this.caseField.checked = t.caseSensitive, this.reField.checked = t.regexp, this.wordField.checked = t.wholeWord
                }
                mount() {
                    this.searchField.select()
                }
                get pos() {
                    return 80
                }
                get top() {
                    return this.view.state.facet(Ut).top
                }
            }

            function Ce(t, e) {
                return t.state.phrase(e)
            }
            const Ae = /[\s\.,:;?!]/;

            function Me(t, {
                from: e,
                to: i
            }) {
                let n = t.state.doc.lineAt(e),
                    r = t.state.doc.lineAt(i).to,
                    o = Math.max(n.from, e - 30),
                    l = Math.min(r, i + 30),
                    a = t.state.sliceDoc(o, l);
                if (o != n.from)
                    for (let t = 0; t < 30; t++)
                        if (!Ae.test(a[t + 1]) && Ae.test(a[t])) {
                            a = a.slice(t);
                            break
                        } if (l != r)
                    for (let t = a.length - 1; t > a.length - 30; t--)
                        if (!Ae.test(a[t - 1]) && Ae.test(a[t])) {
                            a = a.slice(0, t);
                            break
                        } return s.Lz.announce.of(`${t.state.phrase("current match")}. ${a} ${t.state.phrase("on line")} ${n.number}.`)
            }
            const Qe = s.Lz.baseTheme({}),
                Te = [oe, n.Nb.low(ce), Qe];
            var Pe = i(404);
            class De {
                constructor(t, e, i) {
                    this.from = t, this.to = e, this.diagnostic = i
                }
            }
            class Re {
                constructor(t, e, i) {
                    this.diagnostics = t, this.panel = e, this.selected = i
                }
                static init(t, e, i) {
                    let r = i.facet(je).markerFilter;
                    r && (t = r(t, i));
                    let o = t.slice().sort((t, e) => t.from - e.from || t.to - e.to),
                        l = new n.vB,
                        a = [],
                        h = 0,
                        c = i.doc.iter(),
                        u = 0,
                        d = i.doc.length;
                    for (let t = 0;;) {
                        let e, i, n = t == o.length ? null : o[t];
                        if (!n && !a.length) break;
                        if (a.length) e = h, i = a.reduce((t, e) => Math.min(t, e.to), n && n.from > e ? n.from : 1e8);
                        else {
                            if (e = n.from, e > d) break;
                            i = n.to, a.push(n), t++
                        }
                        for (; t < o.length;) {
                            let s = o[t];
                            if (s.from != e || !(s.to > s.from || s.to == e)) {
                                i = Math.min(s.from, i);
                                break
                            }
                            a.push(s), t++, i = Math.min(s.to, i)
                        }
                        i = Math.min(i, d);
                        let r = !1;
                        if (a.some(t => t.from == e && (t.to == i || i == d)) && (r = e == i, !r && i - e < 10)) {
                            let t = e - (u + c.value.length);
                            t > 0 && (c.next(t), u = e);
                            for (let t = e;;) {
                                if (t >= i) {
                                    r = !0;
                                    break
                                }
                                if (!c.lineBreak && u + c.value.length > t) break;
                                t = u + c.value.length, u += c.value.length, c.next()
                            }
                        }
                        let f = Je(a);
                        if (r) l.add(e, e, s.NZ.widget({
                            widget: new Xe(f),
                            diagnostics: a.slice()
                        }));
                        else {
                            let t = a.reduce((t, e) => e.markClass ? t + " " + e.markClass : t, "");
                            l.add(e, i, s.NZ.mark({
                                class: "css-lintRange css-lintRange-" + f + t,
                                diagnostics: a.slice(),
                                inclusiveEnd: a.some(t => t.to > i)
                            }))
                        }
                        if (h = i, h == d) break;
                        for (let t = 0; t < a.length; t++) a[t].to <= h && a.splice(t--, 1)
                    }
                    let f = l.finish();
                    return new Re(f, e, Ee(f))
                }
            }

            function Ee(t, e = null, i = 0) {
                let s = null;
                return t.between(i, 1e9, (t, i, {
                    spec: n
                }) => {
                    if (!(e && n.diagnostics.indexOf(e) < 0))
                        if (s) {
                            if (n.diagnostics.indexOf(s.diagnostic) < 0) return !1;
                            s = new De(s.from, i, s.diagnostic)
                        } else s = new De(t, i, e || n.diagnostics[0])
                }), s
            }
            const Be = n.Pe.define(),
                Le = n.Pe.define(),
                Ne = n.Pe.define(),
                Ie = n.sU.define({
                    create: () => new Re(s.NZ.none, null, null),
                    update(t, e) {
                        if (e.docChanged && t.diagnostics.size) {
                            let i = t.diagnostics.map(e.changes),
                                s = null,
                                n = t.panel;
                            if (t.selected) {
                                let n = e.changes.mapPos(t.selected.from, 1);
                                s = Ee(i, t.selected.diagnostic, n) || Ee(i, null, n)
                            }!i.size && n && e.state.facet(je).autoPanel && (n = null), t = new Re(i, n, s)
                        }
                        for (let i of e.effects)
                            if (i.is(Be)) {
                                let s = e.state.facet(je).autoPanel ? i.value.length ? Ue.open : null : t.panel;
                                t = Re.init(i.value, s, e.state)
                            } else i.is(Le) ? t = new Re(t.diagnostics, i.value ? Ue.open : null, t.selected) : i.is(Ne) && (t = new Re(t.diagnostics, t.panel, i.value));
                        return t
                    },
                    provide: t => [s.S7.from(t, t => t.panel), s.Lz.decorations.from(t, t => t.diagnostics)]
                }),
                ze = s.NZ.mark({
                    class: "css-lintRange css-lintRange-active"
                });

            function Fe(t, e, i) {
                let s, {
                        diagnostics: n
                    } = t.state.field(Ie),
                    r = -1,
                    o = -1;
                n.between(e - (i < 0 ? 1 : 0), e + (i > 0 ? 1 : 0), (t, n, {
                    spec: l
                }) => {
                    if (e >= t && e <= n && (t == n || (e > t || i > 0) && (e < n || i < 0))) return s = l.diagnostics, r = t, o = n, !1
                });
                let l = t.state.facet(je).tooltipFilter;
                return s && l && (s = l(s, t.state)), s ? {
                    pos: r,
                    end: o,
                    above: t.state.doc.lineAt(r).to < o,
                    create: () => ({
                        dom: $e(t, s)
                    })
                } : null
            }

            function $e(t, e) {
                return (0, Dt.A)("ul", {
                    class: "css-tooltip-lint"
                }, e.map(e => _e(t, e, !1)))
            }
            const We = t => {
                    let e = t.state.field(Ie, !1);
                    return !(!e || !e.panel || (t.dispatch({
                        effects: Le.of(!1)
                    }), 0))
                },
                Ve = [{
                    key: "Mod-Shift-m",
                    run: t => {
                        let e = t.state.field(Ie, !1);
                        var i, r;
                        e && e.panel || t.dispatch({
                            effects: (i = t.state, r = [Le.of(!0)], i.field(Ie, !1) ? r : r.concat(n.Pe.appendConfig.of(ti)))
                        });
                        let o = (0, s.ld)(t, Ue.open);
                        return o && o.dom.querySelector(".css-panel-lint ul").focus(), !0
                    },
                    preventDefault: !0
                }, {
                    key: "F8",
                    run: t => {
                        let e = t.state.field(Ie, !1);
                        if (!e) return !1;
                        let i = t.state.selection.main,
                            s = e.diagnostics.iter(i.to + 1);
                        return !(!s.value && (s = e.diagnostics.iter(0), !s.value || s.from == i.from && s.to == i.to) || (t.dispatch({
                            selection: {
                                anchor: s.from,
                                head: s.to
                            },
                            scrollIntoView: !0
                        }), 0))
                    }
                }],
                je = n.sj.define({
                    combine: t => ({
                        sources: t.map(t => t.source).filter(t => null != t),
                        ...(0, n.QR)(t.map(t => t.config), {
                            delay: 750,
                            markerFilter: null,
                            tooltipFilter: null,
                            needsRefresh: null,
                            hideOn: () => null
                        }, {
                            delay: Math.max,
                            markerFilter: qe,
                            tooltipFilter: qe,
                            needsRefresh: (t, e) => t ? e ? i => t(i) || e(i) : t : e,
                            hideOn: (t, e) => t ? e ? (i, s, n) => t(i, s, n) || e(i, s, n) : t : e,
                            autoPanel: (t, e) => t || e
                        })
                    })
                });

            function qe(t, e) {
                return t ? e ? (i, s) => e(t(i, s), s) : t : e
            }

            function He(t) {
                let e = [];
                if (t) t: for (let {
                        name: i
                    }
                    of t) {
                    for (let t = 0; t < i.length; t++) {
                        let s = i[t];
                        if (/[a-zA-Z]/.test(s) && !e.some(t => t.toLowerCase() == s.toLowerCase())) {
                            e.push(s);
                            continue t
                        }
                    }
                    e.push("")
                }
                return e
            }

            function _e(t, e, i) {
                var s;
                let n = i ? He(e.actions) : [];
                return (0, Dt.A)("li", {
                    class: "css-diagnostic css-diagnostic-" + e.severity
                }, (0, Dt.A)("span", {
                    class: "css-diagnosticText"
                }, e.renderMessage ? e.renderMessage(t) : e.message), null === (s = e.actions) || void 0 === s ? void 0 : s.map((i, s) => {
                    let r = !1,
                        o = s => {
                            if (s.preventDefault(), r) return;
                            r = !0;
                            let n = Ee(t.state.field(Ie).diagnostics, e);
                            n && i.apply(t, n.from, n.to)
                        },
                        {
                            name: l
                        } = i,
                        a = n[s] ? l.indexOf(n[s]) : -1,
                        h = a < 0 ? l : [l.slice(0, a), (0, Dt.A)("u", l.slice(a, a + 1)), l.slice(a + 1)],
                        c = i.markClass ? " " + i.markClass : "";
                    return (0, Dt.A)("button", {
                        type: "button",
                        class: "css-diagnosticAction" + c,
                        onclick: o,
                        onmousedown: o,
                        "aria-label": ` Action: ${l}${a<0?"":` (access key "${n[s]})"`}.`
                    }, h)
                }), e.source && (0, Dt.A)("div", {
                    class: "css-diagnosticSource"
                }, e.source))
            }
            class Xe extends s.xO {
                constructor(t) {
                    super(), this.sev = t
                }
                eq(t) {
                    return t.sev == this.sev
                }
                toDOM() {
                    return (0, Dt.A)("span", {
                        class: "css-lintPoint css-lintPoint-" + this.sev
                    })
                }
            }
            class Ye {
                constructor(t, e) {
                    this.diagnostic = e, this.id = "item_" + Math.floor(4294967295 * Math.random()).toString(16), this.dom = _e(t, e, !0), this.dom.id = this.id, this.dom.setAttribute("role", "option")
                }
            }
            class Ue {
                constructor(t) {
                    this.view = t, this.items = [], this.list = (0, Dt.A)("ul", {
                        tabIndex: 0,
                        role: "listbox",
                        "aria-label": this.view.state.phrase("Diagnostics"),
                        onkeydown: e => {
                            if (27 == e.keyCode) We(this.view), this.view.focus();
                            else if (38 == e.keyCode || 33 == e.keyCode) this.moveSelection((this.selectedIndex - 1 + this.items.length) % this.items.length);
                            else if (40 == e.keyCode || 34 == e.keyCode) this.moveSelection((this.selectedIndex + 1) % this.items.length);
                            else if (36 == e.keyCode) this.moveSelection(0);
                            else if (35 == e.keyCode) this.moveSelection(this.items.length - 1);
                            else if (13 == e.keyCode) this.view.focus();
                            else {
                                if (!(e.keyCode >= 65 && e.keyCode <= 90 && this.selectedIndex >= 0)) return;
                                {
                                    let {
                                        diagnostic: i
                                    } = this.items[this.selectedIndex], s = He(i.actions);
                                    for (let n = 0; n < s.length; n++)
                                        if (s[n].toUpperCase().charCodeAt(0) == e.keyCode) {
                                            let e = Ee(this.view.state.field(Ie).diagnostics, i);
                                            e && i.actions[n].apply(t, e.from, e.to)
                                        }
                                }
                            }
                            e.preventDefault()
                        },
                        onclick: t => {
                            for (let e = 0; e < this.items.length; e++) this.items[e].dom.contains(t.target) && this.moveSelection(e)
                        }
                    }), this.dom = (0, Dt.A)("div", {
                        class: "css-panel-lint"
                    }, this.list, (0, Dt.A)("button", {
                        type: "button",
                        name: "close",
                        "aria-label": this.view.state.phrase("close"),
                        onclick: () => We(this.view)
                    }, "×")), this.update()
                }
                get selectedIndex() {
                    let t = this.view.state.field(Ie).selected;
                    if (!t) return -1;
                    for (let e = 0; e < this.items.length; e++)
                        if (this.items[e].diagnostic == t.diagnostic) return e;
                    return -1
                }
                update() {
                    let {
                        diagnostics: t,
                        selected: e
                    } = this.view.state.field(Ie), i = 0, s = !1, n = null, r = new Set;
                    for (t.between(0, this.view.state.doc.length, (t, o, {
                            spec: l
                        }) => {
                            for (let t of l.diagnostics) {
                                if (r.has(t)) continue;
                                r.add(t);
                                let o, l = -1;
                                for (let e = i; e < this.items.length; e++)
                                    if (this.items[e].diagnostic == t) {
                                        l = e;
                                        break
                                    } l < 0 ? (o = new Ye(this.view, t), this.items.splice(i, 0, o), s = !0) : (o = this.items[l], l > i && (this.items.splice(i, l - i), s = !0)), e && o.diagnostic == e.diagnostic ? o.dom.hasAttribute("aria-selected") || (o.dom.setAttribute("aria-selected", "true"), n = o) : o.dom.hasAttribute("aria-selected") && o.dom.removeAttribute("aria-selected"), i++
                            }
                        }); i < this.items.length && !(1 == this.items.length && this.items[0].diagnostic.from < 0);) s = !0, this.items.pop();
                    0 == this.items.length && (this.items.push(new Ye(this.view, {
                        from: -1,
                        to: -1,
                        severity: "info",
                        message: this.view.state.phrase("No diagnostics")
                    })), s = !0), n ? (this.list.setAttribute("aria-activedescendant", n.id), this.view.requestMeasure({
                        key: this,
                        read: () => ({
                            sel: n.dom.getBoundingClientRect(),
                            panel: this.list.getBoundingClientRect()
                        }),
                        write: ({
                            sel: t,
                            panel: e
                        }) => {
                            let i = e.height / this.list.offsetHeight;
                            t.top < e.top ? this.list.scrollTop -= (e.top - t.top) / i : t.bottom > e.bottom && (this.list.scrollTop += (t.bottom - e.bottom) / i)
                        }
                    })) : this.selectedIndex < 0 && this.list.removeAttribute("aria-activedescendant"), s && this.sync()
                }
                sync() {
                    let t = this.list.firstChild;

                    function e() {
                        let e = t;
                        t = e.nextSibling, e.remove()
                    }
                    for (let i of this.items)
                        if (i.dom.parentNode == this.list) {
                            for (; t != i.dom;) e();
                            t = i.dom.nextSibling
                        } else this.list.insertBefore(i.dom, t);
                    for (; t;) e()
                }
                moveSelection(t) {
                    if (this.selectedIndex < 0) return;
                    let e = Ee(this.view.state.field(Ie).diagnostics, this.items[t].diagnostic);
                    e && this.view.dispatch({
                        selection: {
                            anchor: e.from,
                            head: e.to
                        },
                        scrollIntoView: !0,
                        effects: Ne.of(e)
                    })
                }
                static open(t) {
                    return new Ue(t)
                }
            }

            function Ge(t) {
                return function(t, e = 'viewBox="0 0 40 40"') {
                    return `url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" ${e}>${encodeURIComponent(t)}</svg>')`
                }(`<path d="m0 2.5 l2 -1.5 l1 0 l2 1.5 l1 0" stroke="${t}" fill="none" stroke-width=".7"/>`, 'width="6" height="3"')
            }
            const Ke = s.Lz.baseTheme({});

            function Ze(t) {
                return "error" == t ? 4 : "warning" == t ? 3 : "info" == t ? 2 : 1
            }

            function Je(t) {
                let e = "hint",
                    i = 1;
                for (let s of t) {
                    let t = Ze(s.severity);
                    t > i && (i = t, e = s.severity)
                }
                return e
            }
            s.wJ;
            const ti = [Ie, s.Lz.decorations.compute([Ie], t => {
                    let {
                        selected: e,
                        panel: i
                    } = t.field(Ie);
                    return e && i && e.from != e.to ? s.NZ.set([ze.range(e.from, e.to)]) : s.NZ.none
                }), (0, s.Ux)(Fe, {
                    hideOn: function(t, e) {
                        let i = e.pos,
                            s = e.end || i,
                            n = t.state.facet(je).hideOn(t, i, s);
                        if (null != n) return n;
                        let r = t.startState.doc.lineAt(e.pos);
                        return !(!t.effects.some(t => t.is(Be)) && !t.changes.touchesRange(r.from, Math.max(r.to, s)))
                    }
                }), Ke],
                ei = (() => [(0, s.$K)(), (0, s.Wu)(), (0, s.N$)(), w(), (0, r.Lv)(), (0, s.VH)(), (0, s.A)(), n.$t.allowMultipleSelections.of(!0), (0, r.WD)(), (0, r.y9)(r.Zt, {
                    fallback: !0
                }), (0, r.SG)(), (0, Pe.wm)(), (0, Pe.yU)(), (0, s.D4)(), (0, s.HJ)(), (0, s.dz)(), jt(), s.w4.of([...Pe.Bc, ...Pt, ...ke, ...L, ...r.f7, ...Pe.OO, ...Ve])])()
        },
        730(t, e, i) {
            i.d(e, {
                AH: () => lt
            });
            var s = i(365);
            class n {
                constructor(t, e, i, s, n, r, o, l, a, h = 0, c) {
                    this.p = t, this.stack = e, this.state = i, this.reducePos = s, this.pos = n, this.score = r, this.buffer = o, this.bufferBase = l, this.curContext = a, this.lookAhead = h, this.parent = c
                }
                toString() {
                    return `[${this.stack.filter((t,e)=>e%3==0).concat(this.state)}]@${this.pos}${this.score?"!"+this.score:""}`
                }
                static start(t, e, i = 0) {
                    let s = t.parser.context;
                    return new n(t, [], e, i, i, 0, [], 0, s ? new r(s, s.start) : null, 0, null)
                }
                get context() {
                    return this.curContext ? this.curContext.context : null
                }
                pushState(t, e) {
                    this.stack.push(this.state, e, this.bufferBase + this.buffer.length), this.state = t
                }
                reduce(t) {
                    var e;
                    let i = t >> 19,
                        s = 65535 & t,
                        {
                            parser: n
                        } = this.p,
                        r = this.reducePos < this.pos - 25 && this.setLookAhead(this.pos),
                        o = n.dynamicPrecedence(s);
                    if (o && (this.score += o), 0 == i) return this.pushState(n.getGoto(this.state, s, !0), this.reducePos), s < n.minRepeatTerm && this.storeNode(s, this.reducePos, this.reducePos, r ? 8 : 4, !0), void this.reduceContext(s, this.reducePos);
                    let l = this.stack.length - 3 * (i - 1) - (262144 & t ? 6 : 0),
                        a = l ? this.stack[l - 2] : this.p.ranges[0].from,
                        h = this.reducePos - a;
                    h >= 2e3 && !(null === (e = this.p.parser.nodeSet.types[s]) || void 0 === e ? void 0 : e.isAnonymous) && (a == this.p.lastBigReductionStart ? (this.p.bigReductionCount++, this.p.lastBigReductionSize = h) : this.p.lastBigReductionSize < h && (this.p.bigReductionCount = 1, this.p.lastBigReductionStart = a, this.p.lastBigReductionSize = h));
                    let c = l ? this.stack[l - 1] : 0,
                        u = this.bufferBase + this.buffer.length - c;
                    if (s < n.minRepeatTerm || 131072 & t) {
                        let t = n.stateFlag(this.state, 1) ? this.pos : this.reducePos;
                        this.storeNode(s, a, t, u + 4, !0)
                    }
                    if (262144 & t) this.state = this.stack[l];
                    else {
                        let t = this.stack[l - 3];
                        this.state = n.getGoto(t, s, !0)
                    }
                    for (; this.stack.length > l;) this.stack.pop();
                    this.reduceContext(s, a)
                }
                storeNode(t, e, i, s = 4, n = !1) {
                    if (0 == t && (!this.stack.length || this.stack[this.stack.length - 1] < this.buffer.length + this.bufferBase)) {
                        let t = this,
                            s = this.buffer.length;
                        if (0 == s && t.parent && (s = t.bufferBase - t.parent.bufferBase, t = t.parent), s > 0 && 0 == t.buffer[s - 4] && t.buffer[s - 1] > -1) {
                            if (e == i) return;
                            if (t.buffer[s - 2] >= e) return void(t.buffer[s - 2] = i)
                        }
                    }
                    if (n && this.pos != i) {
                        let n = this.buffer.length;
                        if (n > 0 && (0 != this.buffer[n - 4] || this.buffer[n - 1] < 0)) {
                            let t = !1;
                            for (let e = n; e > 0 && this.buffer[e - 2] > i; e -= 4)
                                if (this.buffer[e - 1] >= 0) {
                                    t = !0;
                                    break
                                } if (t)
                                for (; n > 0 && this.buffer[n - 2] > i;) this.buffer[n] = this.buffer[n - 4], this.buffer[n + 1] = this.buffer[n - 3], this.buffer[n + 2] = this.buffer[n - 2], this.buffer[n + 3] = this.buffer[n - 1], n -= 4, s > 4 && (s -= 4)
                        }
                        this.buffer[n] = t, this.buffer[n + 1] = e, this.buffer[n + 2] = i, this.buffer[n + 3] = s
                    } else this.buffer.push(t, e, i, s)
                }
                shift(t, e, i, s) {
                    if (131072 & t) this.pushState(65535 & t, this.pos);
                    else if (262144 & t) this.pos = s, this.shiftContext(e, i), e <= this.p.parser.maxNode && this.buffer.push(e, i, s, 4);
                    else {
                        let n = t,
                            {
                                parser: r
                            } = this.p;
                        this.pos = s, !r.stateFlag(n, 1) && (s > i || e <= r.maxNode) && (this.reducePos = s), this.pushState(n, Math.min(i, this.reducePos)), this.shiftContext(e, i), e <= r.maxNode && this.buffer.push(e, i, s, 4)
                    }
                }
                apply(t, e, i, s) {
                    65536 & t ? this.reduce(t) : this.shift(t, e, i, s)
                }
                useNode(t, e) {
                    let i = this.p.reused.length - 1;
                    (i < 0 || this.p.reused[i] != t) && (this.p.reused.push(t), i++);
                    let s = this.pos;
                    this.reducePos = this.pos = s + t.length, this.pushState(e, s), this.buffer.push(i, s, this.reducePos, -1), this.curContext && this.updateContext(this.curContext.tracker.reuse(this.curContext.context, t, this, this.p.stream.reset(this.pos - t.length)))
                }
                split() {
                    let t = this,
                        e = t.buffer.length;
                    for (; e > 0 && t.buffer[e - 2] > t.reducePos;) e -= 4;
                    let i = t.buffer.slice(e),
                        s = t.bufferBase + e;
                    for (; t && s == t.bufferBase;) t = t.parent;
                    return new n(this.p, this.stack.slice(), this.state, this.reducePos, this.pos, this.score, i, s, this.curContext, this.lookAhead, t)
                }
                recoverByDelete(t, e) {
                    let i = t <= this.p.parser.maxNode;
                    i && this.storeNode(t, this.pos, e, 4), this.storeNode(0, this.pos, e, i ? 8 : 4), this.pos = this.reducePos = e, this.score -= 190
                }
                canShift(t) {
                    for (let e = new o(this);;) {
                        let i = this.p.parser.stateSlot(e.state, 4) || this.p.parser.hasAction(e.state, t);
                        if (0 == i) return !1;
                        if (!(65536 & i)) return !0;
                        e.reduce(i)
                    }
                }
                recoverByInsert(t) {
                    if (this.stack.length >= 300) return [];
                    let e = this.p.parser.nextStates(this.state);
                    if (e.length > 8 || this.stack.length >= 120) {
                        let i = [];
                        for (let s, n = 0; n < e.length; n += 2)(s = e[n + 1]) != this.state && this.p.parser.hasAction(s, t) && i.push(e[n], s);
                        if (this.stack.length < 120)
                            for (let t = 0; i.length < 8 && t < e.length; t += 2) {
                                let s = e[t + 1];
                                i.some((t, e) => 1 & e && t == s) || i.push(e[t], s)
                            }
                        e = i
                    }
                    let i = [];
                    for (let t = 0; t < e.length && i.length < 4; t += 2) {
                        let s = e[t + 1];
                        if (s == this.state) continue;
                        let n = this.split();
                        n.pushState(s, this.pos), n.storeNode(0, n.pos, n.pos, 4, !0), n.shiftContext(e[t], this.pos), n.reducePos = this.pos, n.score -= 200, i.push(n)
                    }
                    return i
                }
                forceReduce() {
                    let {
                        parser: t
                    } = this.p, e = t.stateSlot(this.state, 5);
                    if (!(65536 & e)) return !1;
                    if (!t.validAction(this.state, e)) {
                        let i = e >> 19,
                            s = 65535 & e,
                            n = this.stack.length - 3 * i;
                        if (n < 0 || t.getGoto(this.stack[n], s, !1) < 0) {
                            let t = this.findForcedReduction();
                            if (null == t) return !1;
                            e = t
                        }
                        this.storeNode(0, this.pos, this.pos, 4, !0), this.score -= 100
                    }
                    return this.reducePos = this.pos, this.reduce(e), !0
                }
                findForcedReduction() {
                    let {
                        parser: t
                    } = this.p, e = [], i = (s, n) => {
                        if (!e.includes(s)) return e.push(s), t.allActions(s, e => {
                            if (393216 & e);
                            else if (65536 & e) {
                                let i = (e >> 19) - n;
                                if (i > 1) {
                                    let s = 65535 & e,
                                        n = this.stack.length - 3 * i;
                                    if (n >= 0 && t.getGoto(this.stack[n], s, !1) >= 0) return i << 19 | 65536 | s
                                }
                            } else {
                                let t = i(e, n + 1);
                                if (null != t) return t
                            }
                        })
                    };
                    return i(this.state, 0)
                }
                forceAll() {
                    for (; !this.p.parser.stateFlag(this.state, 2);)
                        if (!this.forceReduce()) {
                            this.storeNode(0, this.pos, this.pos, 4, !0);
                            break
                        } return this
                }
                get deadEnd() {
                    if (3 != this.stack.length) return !1;
                    let {
                        parser: t
                    } = this.p;
                    return 65535 == t.data[t.stateSlot(this.state, 1)] && !t.stateSlot(this.state, 4)
                }
                restart() {
                    this.storeNode(0, this.pos, this.pos, 4, !0), this.state = this.stack[0], this.stack.length = 0
                }
                sameState(t) {
                    if (this.state != t.state || this.stack.length != t.stack.length) return !1;
                    for (let e = 0; e < this.stack.length; e += 3)
                        if (this.stack[e] != t.stack[e]) return !1;
                    return !0
                }
                get parser() {
                    return this.p.parser
                }
                dialectEnabled(t) {
                    return this.p.parser.dialect.flags[t]
                }
                shiftContext(t, e) {
                    this.curContext && this.updateContext(this.curContext.tracker.shift(this.curContext.context, t, this, this.p.stream.reset(e)))
                }
                reduceContext(t, e) {
                    this.curContext && this.updateContext(this.curContext.tracker.reduce(this.curContext.context, t, this, this.p.stream.reset(e)))
                }
                emitContext() {
                    let t = this.buffer.length - 1;
                    (t < 0 || -3 != this.buffer[t]) && this.buffer.push(this.curContext.hash, this.pos, this.pos, -3)
                }
                emitLookAhead() {
                    let t = this.buffer.length - 1;
                    (t < 0 || -4 != this.buffer[t]) && this.buffer.push(this.lookAhead, this.pos, this.pos, -4)
                }
                updateContext(t) {
                    if (t != this.curContext.context) {
                        let e = new r(this.curContext.tracker, t);
                        e.hash != this.curContext.hash && this.emitContext(), this.curContext = e
                    }
                }
                setLookAhead(t) {
                    return !(t <= this.lookAhead || (this.emitLookAhead(), this.lookAhead = t, 0))
                }
                close() {
                    this.curContext && this.curContext.tracker.strict && this.emitContext(), this.lookAhead > 0 && this.emitLookAhead()
                }
            }
            class r {
                constructor(t, e) {
                    this.tracker = t, this.context = e, this.hash = t.strict ? t.hash(e) : 0
                }
            }
            class o {
                constructor(t) {
                    this.start = t, this.state = t.state, this.stack = t.stack, this.base = this.stack.length
                }
                reduce(t) {
                    let e = 65535 & t,
                        i = t >> 19;
                    0 == i ? (this.stack == this.start.stack && (this.stack = this.stack.slice()), this.stack.push(this.state, 0, 0), this.base += 3) : this.base -= 3 * (i - 1);
                    let s = this.start.p.parser.getGoto(this.stack[this.base - 3], e, !0);
                    this.state = s
                }
            }
            class l {
                constructor(t, e, i) {
                    this.stack = t, this.pos = e, this.index = i, this.buffer = t.buffer, 0 == this.index && this.maybeNext()
                }
                static create(t, e = t.bufferBase + t.buffer.length) {
                    return new l(t, e, e - t.bufferBase)
                }
                maybeNext() {
                    let t = this.stack.parent;
                    null != t && (this.index = this.stack.bufferBase - t.bufferBase, this.stack = t, this.buffer = t.buffer)
                }
                get id() {
                    return this.buffer[this.index - 4]
                }
                get start() {
                    return this.buffer[this.index - 3]
                }
                get end() {
                    return this.buffer[this.index - 2]
                }
                get size() {
                    return this.buffer[this.index - 1]
                }
                next() {
                    this.index -= 4, this.pos -= 4, 0 == this.index && this.maybeNext()
                }
                fork() {
                    return new l(this.stack, this.pos, this.index)
                }
            }

            function a(t, e = Uint16Array) {
                if ("string" != typeof t) return t;
                let i = null;
                for (let s = 0, n = 0; s < t.length;) {
                    let r = 0;
                    for (;;) {
                        let e = t.charCodeAt(s++),
                            i = !1;
                        if (126 == e) {
                            r = 65535;
                            break
                        }
                        e >= 92 && e--, e >= 34 && e--;
                        let n = e - 32;
                        if (n >= 46 && (n -= 46, i = !0), r += n, i) break;
                        r *= 46
                    }
                    i ? i[n++] = r : i = new e(r)
                }
                return i
            }
            class h {
                constructor() {
                    this.start = -1, this.value = -1, this.end = -1, this.extended = -1, this.lookAhead = 0, this.mask = 0, this.context = 0
                }
            }
            const c = new h;
            class u {
                constructor(t, e) {
                    this.input = t, this.ranges = e, this.chunk = "", this.chunkOff = 0, this.chunk2 = "", this.chunk2Pos = 0, this.next = -1, this.token = c, this.rangeIndex = 0, this.pos = this.chunkPos = e[0].from, this.range = e[0], this.end = e[e.length - 1].to, this.readNext()
                }
                resolveOffset(t, e) {
                    let i = this.range,
                        s = this.rangeIndex,
                        n = this.pos + t;
                    for (; n < i.from;) {
                        if (!s) return null;
                        let t = this.ranges[--s];
                        n -= i.from - t.to, i = t
                    }
                    for (; e < 0 ? n > i.to : n >= i.to;) {
                        if (s == this.ranges.length - 1) return null;
                        let t = this.ranges[++s];
                        n += t.from - i.to, i = t
                    }
                    return n
                }
                clipPos(t) {
                    if (t >= this.range.from && t < this.range.to) return t;
                    for (let e of this.ranges)
                        if (e.to > t) return Math.max(t, e.from);
                    return this.end
                }
                peek(t) {
                    let e, i, s = this.chunkOff + t;
                    if (s >= 0 && s < this.chunk.length) e = this.pos + t, i = this.chunk.charCodeAt(s);
                    else {
                        let s = this.resolveOffset(t, 1);
                        if (null == s) return -1;
                        if (e = s, e >= this.chunk2Pos && e < this.chunk2Pos + this.chunk2.length) i = this.chunk2.charCodeAt(e - this.chunk2Pos);
                        else {
                            let t = this.rangeIndex,
                                s = this.range;
                            for (; s.to <= e;) s = this.ranges[++t];
                            this.chunk2 = this.input.chunk(this.chunk2Pos = e), e + this.chunk2.length > s.to && (this.chunk2 = this.chunk2.slice(0, s.to - e)), i = this.chunk2.charCodeAt(0)
                        }
                    }
                    return e >= this.token.lookAhead && (this.token.lookAhead = e + 1), i
                }
                acceptToken(t, e = 0) {
                    let i = e ? this.resolveOffset(e, -1) : this.pos;
                    if (null == i || i < this.token.start) throw new RangeError("Token end out of bounds");
                    this.token.value = t, this.token.end = i
                }
                acceptTokenTo(t, e) {
                    this.token.value = t, this.token.end = e
                }
                getChunk() {
                    if (this.pos >= this.chunk2Pos && this.pos < this.chunk2Pos + this.chunk2.length) {
                        let {
                            chunk: t,
                            chunkPos: e
                        } = this;
                        this.chunk = this.chunk2, this.chunkPos = this.chunk2Pos, this.chunk2 = t, this.chunk2Pos = e, this.chunkOff = this.pos - this.chunkPos
                    } else {
                        this.chunk2 = this.chunk, this.chunk2Pos = this.chunkPos;
                        let t = this.input.chunk(this.pos),
                            e = this.pos + t.length;
                        this.chunk = e > this.range.to ? t.slice(0, this.range.to - this.pos) : t, this.chunkPos = this.pos, this.chunkOff = 0
                    }
                }
                readNext() {
                    return this.chunkOff >= this.chunk.length && (this.getChunk(), this.chunkOff == this.chunk.length) ? this.next = -1 : this.next = this.chunk.charCodeAt(this.chunkOff)
                }
                advance(t = 1) {
                    for (this.chunkOff += t; this.pos + t >= this.range.to;) {
                        if (this.rangeIndex == this.ranges.length - 1) return this.setDone();
                        t -= this.range.to - this.pos, this.range = this.ranges[++this.rangeIndex], this.pos = this.range.from
                    }
                    return this.pos += t, this.pos >= this.token.lookAhead && (this.token.lookAhead = this.pos + 1), this.readNext()
                }
                setDone() {
                    return this.pos = this.chunkPos = this.end, this.range = this.ranges[this.rangeIndex = this.ranges.length - 1], this.chunk = "", this.next = -1
                }
                reset(t, e) {
                    if (e ? (this.token = e, e.start = t, e.lookAhead = t + 1, e.value = e.extended = -1) : this.token = c, this.pos != t) {
                        if (this.pos = t, t == this.end) return this.setDone(), this;
                        for (; t < this.range.from;) this.range = this.ranges[--this.rangeIndex];
                        for (; t >= this.range.to;) this.range = this.ranges[++this.rangeIndex];
                        t >= this.chunkPos && t < this.chunkPos + this.chunk.length ? this.chunkOff = t - this.chunkPos : (this.chunk = "", this.chunkOff = 0), this.readNext()
                    }
                    return this
                }
                read(t, e) {
                    if (t >= this.chunkPos && e <= this.chunkPos + this.chunk.length) return this.chunk.slice(t - this.chunkPos, e - this.chunkPos);
                    if (t >= this.chunk2Pos && e <= this.chunk2Pos + this.chunk2.length) return this.chunk2.slice(t - this.chunk2Pos, e - this.chunk2Pos);
                    if (t >= this.range.from && e <= this.range.to) return this.input.read(t, e);
                    let i = "";
                    for (let s of this.ranges) {
                        if (s.from >= e) break;
                        s.to > t && (i += this.input.read(Math.max(s.from, t), Math.min(s.to, e)))
                    }
                    return i
                }
            }
            class d {
                constructor(t, e) {
                    this.data = t, this.id = e
                }
                token(t, e) {
                    let {
                        parser: i
                    } = e.p;
                    m(this.data, t, e, this.id, i.data, i.tokenPrecTable)
                }
            }
            d.prototype.contextual = d.prototype.fallback = d.prototype.extend = !1;
            class f {
                constructor(t, e, i) {
                    this.precTable = e, this.elseToken = i, this.data = "string" == typeof t ? a(t) : t
                }
                token(t, e) {
                    let i = t.pos,
                        s = 0;
                    for (;;) {
                        let i = t.next < 0,
                            n = t.resolveOffset(1, 1);
                        if (m(this.data, t, e, 0, this.data, this.precTable), t.token.value > -1) break;
                        if (null == this.elseToken) return;
                        if (i || s++, null == n) break;
                        t.reset(n, t.token)
                    }
                    s && (t.reset(i, t.token), t.acceptToken(this.elseToken, s))
                }
            }
            f.prototype.contextual = d.prototype.fallback = d.prototype.extend = !1;
            class p {
                constructor(t, e = {}) {
                    this.token = t, this.contextual = !!e.contextual, this.fallback = !!e.fallback, this.extend = !!e.extend
                }
            }

            function m(t, e, i, s, n, r) {
                let o = 0,
                    l = 1 << s,
                    {
                        dialect: a
                    } = i.p.parser;
                t: for (; 0 != (l & t[o]);) {
                    let i = t[o + 1];
                    for (let s = o + 3; s < i; s += 2)
                        if ((t[s + 1] & l) > 0) {
                            let i = t[s];
                            if (a.allows(i) && (-1 == e.token.value || e.token.value == i || v(i, e.token.value, n, r))) {
                                e.acceptToken(i);
                                break
                            }
                        } let s = e.next,
                        h = 0,
                        c = t[o + 2];
                    if (!(e.next < 0 && c > h && 65535 == t[i + 3 * c - 3])) {
                        for (; h < c;) {
                            let n = h + c >> 1,
                                r = i + n + (n << 1),
                                l = t[r],
                                a = t[r + 1] || 65536;
                            if (s < l) c = n;
                            else {
                                if (!(s >= a)) {
                                    o = t[r + 2], e.advance();
                                    continue t
                                }
                                h = n + 1
                            }
                        }
                        break
                    }
                    o = t[i + 3 * c - 1]
                }
            }

            function g(t, e, i) {
                for (let s, n = e; 65535 != (s = t[n]); n++)
                    if (s == i) return n - e;
                return -1
            }

            function v(t, e, i, s) {
                let n = g(i, s, e);
                return n < 0 || g(i, s, t) < n
            }
            const b = "undefined" != typeof process && process.env && /\bparse\b/.test(process.env.LOG);
            let w = null;

            function y(t, e, i) {
                let n = t.cursor(s.Qj.IncludeAnonymous);
                for (n.moveTo(e);;)
                    if (!(i < 0 ? n.childBefore(e) : n.childAfter(e)))
                        for (;;) {
                            if ((i < 0 ? n.to < e : n.from > e) && !n.type.isError) return i < 0 ? Math.max(0, Math.min(n.to - 1, e - 25)) : Math.min(t.length, Math.max(n.from + 1, e + 25));
                            if (i < 0 ? n.prevSibling() : n.nextSibling()) break;
                            if (!n.parent()) return i < 0 ? 0 : t.length
                        }
            }
            class O {
                constructor(t, e) {
                    this.fragments = t, this.nodeSet = e, this.i = 0, this.fragment = null, this.safeFrom = -1, this.safeTo = -1, this.trees = [], this.start = [], this.index = [], this.nextFragment()
                }
                nextFragment() {
                    let t = this.fragment = this.i == this.fragments.length ? null : this.fragments[this.i++];
                    if (t) {
                        for (this.safeFrom = t.openStart ? y(t.tree, t.from + t.offset, 1) - t.offset : t.from, this.safeTo = t.openEnd ? y(t.tree, t.to + t.offset, -1) - t.offset : t.to; this.trees.length;) this.trees.pop(), this.start.pop(), this.index.pop();
                        this.trees.push(t.tree), this.start.push(-t.offset), this.index.push(0), this.nextStart = this.safeFrom
                    } else this.nextStart = 1e9
                }
                nodeAt(t) {
                    if (t < this.nextStart) return null;
                    for (; this.fragment && this.safeTo <= t;) this.nextFragment();
                    if (!this.fragment) return null;
                    for (;;) {
                        let e = this.trees.length - 1;
                        if (e < 0) return this.nextFragment(), null;
                        let i = this.trees[e],
                            n = this.index[e];
                        if (n == i.children.length) {
                            this.trees.pop(), this.start.pop(), this.index.pop();
                            continue
                        }
                        let r = i.children[n],
                            o = this.start[e] + i.positions[n];
                        if (o > t) return this.nextStart = o, null;
                        if (r instanceof s.PH) {
                            if (o == t) {
                                if (o < this.safeFrom) return null;
                                let t = o + r.length;
                                if (t <= this.safeTo) {
                                    let e = r.prop(s.uY.lookAhead);
                                    if (!e || t + e < this.fragment.to) return r
                                }
                            }
                            this.index[e]++, o + r.length >= Math.max(this.safeFrom, t) && (this.trees.push(r), this.start.push(o), this.index.push(0))
                        } else this.index[e]++, this.nextStart = o + r.length
                    }
                }
            }
            class x {
                constructor(t, e) {
                    this.stream = e, this.tokens = [], this.mainToken = null, this.actions = [], this.tokens = t.tokenizers.map(t => new h)
                }
                getActions(t) {
                    let e = 0,
                        i = null,
                        {
                            parser: s
                        } = t.p,
                        {
                            tokenizers: n
                        } = s,
                        r = s.stateSlot(t.state, 3),
                        o = t.curContext ? t.curContext.hash : 0,
                        l = 0;
                    for (let s = 0; s < n.length; s++) {
                        if (!(1 << s & r)) continue;
                        let a = n[s],
                            h = this.tokens[s];
                        if ((!i || a.fallback) && ((a.contextual || h.start != t.pos || h.mask != r || h.context != o) && (this.updateCachedToken(h, a, t), h.mask = r, h.context = o), h.lookAhead > h.end + 25 && (l = Math.max(h.lookAhead, l)), 0 != h.value)) {
                            let s = e;
                            if (h.extended > -1 && (e = this.addActions(t, h.extended, h.end, e)), e = this.addActions(t, h.value, h.end, e), !a.extend && (i = h, e > s)) break
                        }
                    }
                    for (; this.actions.length > e;) this.actions.pop();
                    return l && t.setLookAhead(l), i || t.pos != this.stream.end || (i = new h, i.value = t.p.parser.eofTerm, i.start = i.end = t.pos, e = this.addActions(t, i.value, i.end, e)), this.mainToken = i, this.actions
                }
                getMainToken(t) {
                    if (this.mainToken) return this.mainToken;
                    let e = new h,
                        {
                            pos: i,
                            p: s
                        } = t;
                    return e.start = i, e.end = Math.min(i + 1, s.stream.end), e.value = i == s.stream.end ? s.parser.eofTerm : 0, e
                }
                updateCachedToken(t, e, i) {
                    let s = this.stream.clipPos(i.pos);
                    if (e.token(this.stream.reset(s, t), i), t.value > -1) {
                        let {
                            parser: e
                        } = i.p;
                        for (let s = 0; s < e.specialized.length; s++)
                            if (e.specialized[s] == t.value) {
                                let n = e.specializers[s](this.stream.read(t.start, t.end), i);
                                if (n >= 0 && i.p.parser.dialect.allows(n >> 1)) {
                                    1 & n ? t.extended = n >> 1 : t.value = n >> 1;
                                    break
                                }
                            }
                    } else t.value = 0, t.end = this.stream.clipPos(s + 1)
                }
                putAction(t, e, i, s) {
                    for (let e = 0; e < s; e += 3)
                        if (this.actions[e] == t) return s;
                    return this.actions[s++] = t, this.actions[s++] = e, this.actions[s++] = i, s
                }
                addActions(t, e, i, s) {
                    let {
                        state: n
                    } = t, {
                        parser: r
                    } = t.p, {
                        data: o
                    } = r;
                    for (let t = 0; t < 2; t++)
                        for (let l = r.stateSlot(n, t ? 2 : 1);; l += 3) {
                            if (65535 == o[l]) {
                                if (1 != o[l + 1]) {
                                    0 == s && 2 == o[l + 1] && (s = this.putAction(M(o, l + 2), e, i, s));
                                    break
                                }
                                l = M(o, l + 2)
                            }
                            o[l] == e && (s = this.putAction(M(o, l + 1), e, i, s))
                        }
                    return s
                }
            }
            class k {
                constructor(t, e, i, s) {
                    this.parser = t, this.input = e, this.ranges = s, this.recovering = 0, this.nextStackID = 9812, this.minStackPos = 0, this.reused = [], this.stoppedAt = null, this.lastBigReductionStart = -1, this.lastBigReductionSize = 0, this.bigReductionCount = 0, this.stream = new u(e, s), this.tokens = new x(t, this.stream), this.topTerm = t.top[1];
                    let {
                        from: r
                    } = s[0];
                    this.stacks = [n.start(this, t.top[0], r)], this.fragments = i.length && this.stream.end - r > 4 * t.bufferLength ? new O(i, t.nodeSet) : null
                }
                get parsedPos() {
                    return this.minStackPos
                }
                advance() {
                    let t, e, i = this.stacks,
                        s = this.minStackPos,
                        n = this.stacks = [];
                    if (this.bigReductionCount > 300 && 1 == i.length) {
                        let [t] = i;
                        for (; t.forceReduce() && t.stack.length && t.stack[t.stack.length - 2] >= this.lastBigReductionStart;);
                        this.bigReductionCount = this.lastBigReductionSize = 0
                    }
                    for (let r = 0; r < i.length; r++) {
                        let o = i[r];
                        for (;;) {
                            if (this.tokens.mainToken = null, o.pos > s) n.push(o);
                            else {
                                if (this.advanceStack(o, n, i)) continue;
                                {
                                    t || (t = [], e = []), t.push(o);
                                    let i = this.tokens.getMainToken(o);
                                    e.push(i.value, i.end)
                                }
                            }
                            break
                        }
                    }
                    if (!n.length) {
                        let e = t && function(t) {
                            let e = null;
                            for (let i of t) {
                                let t = i.p.stoppedAt;
                                (i.pos == i.p.stream.end || null != t && i.pos > t) && i.p.parser.stateFlag(i.state, 2) && (!e || e.score < i.score) && (e = i)
                            }
                            return e
                        }(t);
                        if (e) return b && console.log("Finish with " + this.stackID(e)), this.stackToTree(e);
                        if (this.parser.strict) throw b && t && console.log("Stuck with token " + (this.tokens.mainToken ? this.parser.getName(this.tokens.mainToken.value) : "none")), new SyntaxError("No parse at " + s);
                        this.recovering || (this.recovering = 5)
                    }
                    if (this.recovering && t) {
                        let i = null != this.stoppedAt && t[0].pos > this.stoppedAt ? t[0] : this.runRecovery(t, e, n);
                        if (i) return b && console.log("Force-finish " + this.stackID(i)), this.stackToTree(i.forceAll())
                    }
                    if (this.recovering) {
                        let t = 1 == this.recovering ? 1 : 3 * this.recovering;
                        if (n.length > t)
                            for (n.sort((t, e) => e.score - t.score); n.length > t;) n.pop();
                        n.some(t => t.reducePos > s) && this.recovering--
                    } else if (n.length > 1) {
                        t: for (let t = 0; t < n.length - 1; t++) {
                            let e = n[t];
                            for (let i = t + 1; i < n.length; i++) {
                                let s = n[i];
                                if (e.sameState(s) || e.buffer.length > 500 && s.buffer.length > 500) {
                                    if (!((e.score - s.score || e.buffer.length - s.buffer.length) > 0)) {
                                        n.splice(t--, 1);
                                        continue t
                                    }
                                    n.splice(i--, 1)
                                }
                            }
                        }
                        n.length > 12 && (n.sort((t, e) => e.score - t.score), n.splice(12, n.length - 12))
                    }
                    this.minStackPos = n[0].pos;
                    for (let t = 1; t < n.length; t++) n[t].pos < this.minStackPos && (this.minStackPos = n[t].pos);
                    return null
                }
                stopAt(t) {
                    if (null != this.stoppedAt && this.stoppedAt < t) throw new RangeError("Can't move stoppedAt forward");
                    this.stoppedAt = t
                }
                advanceStack(t, e, i) {
                    let n = t.pos,
                        {
                            parser: r
                        } = this,
                        o = b ? this.stackID(t) + " -> " : "";
                    if (null != this.stoppedAt && n > this.stoppedAt) return t.forceReduce() ? t : null;
                    if (this.fragments) {
                        let e = t.curContext && t.curContext.tracker.strict,
                            i = e ? t.curContext.hash : 0;
                        for (let l = this.fragments.nodeAt(n); l;) {
                            let n = this.parser.nodeSet.types[l.type.id] == l.type ? r.getGoto(t.state, l.type.id) : -1;
                            if (n > -1 && l.length && (!e || (l.prop(s.uY.contextHash) || 0) == i)) return t.useNode(l, n), b && console.log(o + this.stackID(t) + ` (via reuse of ${r.getName(l.type.id)})`), !0;
                            if (!(l instanceof s.PH) || 0 == l.children.length || l.positions[0] > 0) break;
                            let a = l.children[0];
                            if (!(a instanceof s.PH && 0 == l.positions[0])) break;
                            l = a
                        }
                    }
                    let l = r.stateSlot(t.state, 4);
                    if (l > 0) return t.reduce(l), b && console.log(o + this.stackID(t) + ` (via always-reduce ${r.getName(65535&l)})`), !0;
                    if (t.stack.length >= 8400)
                        for (; t.stack.length > 6e3 && t.forceReduce(););
                    let a = this.tokens.getActions(t);
                    for (let s = 0; s < a.length;) {
                        let l = a[s++],
                            h = a[s++],
                            c = a[s++],
                            u = s == a.length || !i,
                            d = u ? t : t.split(),
                            f = this.tokens.mainToken;
                        if (d.apply(l, h, f ? f.start : d.pos, c), b && console.log(o + this.stackID(d) + ` (via ${65536&l?`reduce of ${r.getName(65535&l)}`:"shift"} for ${r.getName(h)} @ ${n}${d==t?"":", split"})`), u) return !0;
                        d.pos > n ? e.push(d) : i.push(d)
                    }
                    return !1
                }
                advanceFully(t, e) {
                    let i = t.pos;
                    for (;;) {
                        if (!this.advanceStack(t, null, null)) return !1;
                        if (t.pos > i) return S(t, e), !0
                    }
                }
                runRecovery(t, e, i) {
                    let s = null,
                        n = !1;
                    for (let r = 0; r < t.length; r++) {
                        let o = t[r],
                            l = e[r << 1],
                            a = e[1 + (r << 1)],
                            h = b ? this.stackID(o) + " -> " : "";
                        if (o.deadEnd) {
                            if (n) continue;
                            if (n = !0, o.restart(), b && console.log(h + this.stackID(o) + " (restarted)"), this.advanceFully(o, i)) continue
                        }
                        let c = o.split(),
                            u = h;
                        for (let t = 0; t < 10 && c.forceReduce() && (b && console.log(u + this.stackID(c) + " (via force-reduce)"), !this.advanceFully(c, i)); t++) b && (u = this.stackID(c) + " -> ");
                        for (let t of o.recoverByInsert(l)) b && console.log(h + this.stackID(t) + " (via recover-insert)"), this.advanceFully(t, i);
                        this.stream.end > o.pos ? (a == o.pos && (a++, l = 0), o.recoverByDelete(l, a), b && console.log(h + this.stackID(o) + ` (via recover-delete ${this.parser.getName(l)})`), S(o, i)) : (!s || s.score < c.score) && (s = c)
                    }
                    return s
                }
                stackToTree(t) {
                    return t.close(), s.PH.build({
                        buffer: l.create(t),
                        nodeSet: this.parser.nodeSet,
                        topID: this.topTerm,
                        maxBufferLength: this.parser.bufferLength,
                        reused: this.reused,
                        start: this.ranges[0].from,
                        length: t.pos - this.ranges[0].from,
                        minRepeatType: this.parser.minRepeatTerm
                    })
                }
                stackID(t) {
                    let e = (w || (w = new WeakMap)).get(t);
                    return e || w.set(t, e = String.fromCodePoint(this.nextStackID++)), e + t
                }
            }

            function S(t, e) {
                for (let i = 0; i < e.length; i++) {
                    let s = e[i];
                    if (s.pos == t.pos && s.sameState(t)) return void(e[i].score < t.score && (e[i] = t))
                }
                e.push(t)
            }
            class C {
                constructor(t, e, i) {
                    this.source = t, this.flags = e, this.disabled = i
                }
                allows(t) {
                    return !this.disabled || 0 == this.disabled[t]
                }
            }
            class A extends s.iX {
                constructor(t) {
                    if (super(), this.wrappers = [], 14 != t.version) throw new RangeError(`Parser version (${t.version}) doesn't match runtime version (14)`);
                    let e = t.nodeNames.split(" ");
                    this.minRepeatTerm = e.length;
                    for (let i = 0; i < t.repeatNodeCount; i++) e.push("");
                    let i = Object.keys(t.topRules).map(e => t.topRules[e][1]),
                        n = [];
                    for (let t = 0; t < e.length; t++) n.push([]);

                    function r(t, e, i) {
                        n[t].push([e, e.deserialize(String(i))])
                    }
                    if (t.nodeProps)
                        for (let e of t.nodeProps) {
                            let t = e[0];
                            "string" == typeof t && (t = s.uY[t]);
                            for (let i = 1; i < e.length;) {
                                let s = e[i++];
                                if (s >= 0) r(s, t, e[i++]);
                                else {
                                    let n = e[i + -s];
                                    for (let o = -s; o > 0; o--) r(e[i++], t, n);
                                    i++
                                }
                            }
                        }
                    this.nodeSet = new s.fI(e.map((e, r) => s.Z6.define({
                        name: r >= this.minRepeatTerm ? void 0 : e,
                        id: r,
                        props: n[r],
                        top: i.indexOf(r) > -1,
                        error: 0 == r,
                        skipped: t.skippedNodes && t.skippedNodes.indexOf(r) > -1
                    }))), t.propSources && (this.nodeSet = this.nodeSet.extend(...t.propSources)), this.strict = !1, this.bufferLength = s.cF;
                    let o = a(t.tokenData);
                    this.context = t.context, this.specializerSpecs = t.specialized || [], this.specialized = new Uint16Array(this.specializerSpecs.length);
                    for (let t = 0; t < this.specializerSpecs.length; t++) this.specialized[t] = this.specializerSpecs[t].term;
                    this.specializers = this.specializerSpecs.map(Q), this.states = a(t.states, Uint32Array), this.data = a(t.stateData), this.goto = a(t.goto), this.maxTerm = t.maxTerm, this.tokenizers = t.tokenizers.map(t => "number" == typeof t ? new d(o, t) : t), this.topRules = t.topRules, this.dialects = t.dialects || {}, this.dynamicPrecedences = t.dynamicPrecedences || null, this.tokenPrecTable = t.tokenPrec, this.termNames = t.termNames || null, this.maxNode = this.nodeSet.types.length - 1, this.dialect = this.parseDialect(), this.top = this.topRules[Object.keys(this.topRules)[0]]
                }
                createParse(t, e, i) {
                    let s = new k(this, t, e, i);
                    for (let n of this.wrappers) s = n(s, t, e, i);
                    return s
                }
                getGoto(t, e, i = !1) {
                    let s = this.goto;
                    if (e >= s[0]) return -1;
                    for (let n = s[e + 1];;) {
                        let e = s[n++],
                            r = 1 & e,
                            o = s[n++];
                        if (r && i) return o;
                        for (let i = n + (e >> 1); n < i; n++)
                            if (s[n] == t) return o;
                        if (r) return -1
                    }
                }
                hasAction(t, e) {
                    let i = this.data;
                    for (let s = 0; s < 2; s++)
                        for (let n, r = this.stateSlot(t, s ? 2 : 1);; r += 3) {
                            if (65535 == (n = i[r])) {
                                if (1 != i[r + 1]) {
                                    if (2 == i[r + 1]) return M(i, r + 2);
                                    break
                                }
                                n = i[r = M(i, r + 2)]
                            }
                            if (n == e || 0 == n) return M(i, r + 1)
                        }
                    return 0
                }
                stateSlot(t, e) {
                    return this.states[6 * t + e]
                }
                stateFlag(t, e) {
                    return (this.stateSlot(t, 0) & e) > 0
                }
                validAction(t, e) {
                    return !!this.allActions(t, t => t == e || null)
                }
                allActions(t, e) {
                    let i = this.stateSlot(t, 4),
                        s = i ? e(i) : void 0;
                    for (let i = this.stateSlot(t, 1); null == s; i += 3) {
                        if (65535 == this.data[i]) {
                            if (1 != this.data[i + 1]) break;
                            i = M(this.data, i + 2)
                        }
                        s = e(M(this.data, i + 1))
                    }
                    return s
                }
                nextStates(t) {
                    let e = [];
                    for (let i = this.stateSlot(t, 1);; i += 3) {
                        if (65535 == this.data[i]) {
                            if (1 != this.data[i + 1]) break;
                            i = M(this.data, i + 2)
                        }
                        if (!(1 & this.data[i + 2])) {
                            let t = this.data[i + 1];
                            e.some((e, i) => 1 & i && e == t) || e.push(this.data[i], t)
                        }
                    }
                    return e
                }
                configure(t) {
                    let e = Object.assign(Object.create(A.prototype), this);
                    if (t.props && (e.nodeSet = this.nodeSet.extend(...t.props)), t.top) {
                        let i = this.topRules[t.top];
                        if (!i) throw new RangeError(`Invalid top rule name ${t.top}`);
                        e.top = i
                    }
                    return t.tokenizers && (e.tokenizers = this.tokenizers.map(e => {
                        let i = t.tokenizers.find(t => t.from == e);
                        return i ? i.to : e
                    })), t.specializers && (e.specializers = this.specializers.slice(), e.specializerSpecs = this.specializerSpecs.map((i, s) => {
                        let n = t.specializers.find(t => t.from == i.external);
                        if (!n) return i;
                        let r = Object.assign(Object.assign({}, i), {
                            external: n.to
                        });
                        return e.specializers[s] = Q(r), r
                    })), t.contextTracker && (e.context = t.contextTracker), t.dialect && (e.dialect = this.parseDialect(t.dialect)), null != t.strict && (e.strict = t.strict), t.wrap && (e.wrappers = e.wrappers.concat(t.wrap)), null != t.bufferLength && (e.bufferLength = t.bufferLength), e
                }
                hasWrappers() {
                    return this.wrappers.length > 0
                }
                getName(t) {
                    return this.termNames ? this.termNames[t] : String(t <= this.maxNode && this.nodeSet.types[t].name || t)
                }
                get eofTerm() {
                    return this.maxNode + 1
                }
                get topNode() {
                    return this.nodeSet.types[this.top[1]]
                }
                dynamicPrecedence(t) {
                    let e = this.dynamicPrecedences;
                    return null == e ? 0 : e[t] || 0
                }
                parseDialect(t) {
                    let e = Object.keys(this.dialects),
                        i = e.map(() => !1);
                    if (t)
                        for (let s of t.split(" ")) {
                            let t = e.indexOf(s);
                            t >= 0 && (i[t] = !0)
                        }
                    let s = null;
                    for (let t = 0; t < e.length; t++)
                        if (!i[t])
                            for (let i, n = this.dialects[e[t]]; 65535 != (i = this.data[n++]);)(s || (s = new Uint8Array(this.maxTerm + 1)))[i] = 1;
                    return new C(t, i, s)
                }
                static deserialize(t) {
                    return new A(t)
                }
            }

            function M(t, e) {
                return t[e] | t[e + 1] << 16
            }

            function Q(t) {
                if (t.external) {
                    let e = t.extend ? 1 : 0;
                    return (i, s) => t.external(i, s) << 1 | e
                }
                return t.get
            }
            var T = i(720);
            const P = [9, 10, 11, 12, 13, 32, 133, 160, 5760, 8192, 8193, 8194, 8195, 8196, 8197, 8198, 8199, 8200, 8201, 8202, 8232, 8233, 8239, 8287, 12288];

            function D(t) {
                return t >= 65 && t <= 90 || t >= 97 && t <= 122 || t >= 161
            }

            function R(t) {
                return t >= 48 && t <= 57
            }

            function E(t) {
                return R(t) || t >= 97 && t <= 102 || t >= 65 && t <= 70
            }
            const B = (t, e, i) => (s, n) => {
                    for (let r = !1, o = 0, l = 0;; l++) {
                        let {
                            next: a
                        } = s;
                        if (D(a) || 45 == a || 95 == a || r && R(a)) !r && (45 != a || l > 0) && (r = !0), o === l && 45 == a && o++, s.advance();
                        else {
                            if (92 != a || 10 == s.peek(1)) {
                                r && s.acceptToken(2 == o && n.canShift(2) ? e : 40 == a ? i : t);
                                break
                            }
                            if (s.advance(), E(s.next)) {
                                do {
                                    s.advance()
                                } while (E(s.next));
                                32 == s.next && s.advance()
                            } else s.next > -1 && s.advance();
                            r = !0
                        }
                    }
                },
                L = new p(B(123, 2, 124)),
                N = new p(B(125, 3, 4)),
                I = new p(t => {
                    if (P.includes(t.peek(-1))) {
                        let {
                            next: e
                        } = t;
                        (D(e) || 95 == e || 35 == e || 46 == e || 42 == e || 91 == e || 58 == e && D(t.peek(1)) || 45 == e || 38 == e) && t.acceptToken(122)
                    }
                }),
                z = new p(t => {
                    if (!P.includes(t.peek(-1))) {
                        let {
                            next: e
                        } = t;
                        if (37 == e && (t.advance(), t.acceptToken(1)), D(e)) {
                            do {
                                t.advance()
                            } while (D(t.next) || R(t.next));
                            t.acceptToken(1)
                        }
                    }
                }),
                F = (0, T.pn)({
                    "AtKeyword import charset namespace keyframes media supports": T._A.definitionKeyword,
                    "from to selector": T._A.keyword,
                    NamespaceName: T._A.namespace,
                    KeyframeName: T._A.labelName,
                    KeyframeRangeName: T._A.operatorKeyword,
                    TagName: T._A.tagName,
                    ClassName: T._A.className,
                    PseudoClassName: T._A.constant(T._A.className),
                    IdName: T._A.labelName,
                    "FeatureName PropertyName": T._A.propertyName,
                    AttributeName: T._A.attributeName,
                    NumberLiteral: T._A.number,
                    KeywordQuery: T._A.keyword,
                    UnaryQueryOp: T._A.operatorKeyword,
                    "CallTag ValueName": T._A.atom,
                    VariableName: T._A.variableName,
                    Callee: T._A.operatorKeyword,
                    Unit: T._A.unit,
                    "UniversalSelector NestingSelector": T._A.definitionOperator,
                    "MatchOp CompareOp": T._A.compareOperator,
                    "ChildOp SiblingOp, LogicOp": T._A.logicOperator,
                    BinOp: T._A.arithmeticOperator,
                    Important: T._A.modifier,
                    Comment: T._A.blockComment,
                    ColorLiteral: T._A.color,
                    "ParenthesizedContent StringLiteral": T._A.string,
                    ":": T._A.punctuation,
                    "PseudoOp #": T._A.derefOperator,
                    "; ,": T._A.separator,
                    "( )": T._A.paren,
                    "[ ]": T._A.squareBracket,
                    "{ }": T._A.brace
                }),
                $ = {
                    __proto__: null,
                    lang: 38,
                    "nth-child": 38,
                    "nth-last-child": 38,
                    "nth-of-type": 38,
                    "nth-last-of-type": 38,
                    dir: 38,
                    "host-context": 38,
                    if: 84,
                    url: 124,
                    "url-prefix": 124,
                    domain: 124,
                    regexp: 124
                },
                W = {
                    __proto__: null,
                    or: 98,
                    and: 98,
                    not: 106,
                    only: 106,
                    layer: 170
                },
                V = {
                    __proto__: null,
                    selector: 112,
                    layer: 166
                },
                j = {
                    __proto__: null,
                    "@import": 162,
                    "@media": 174,
                    "@charset": 178,
                    "@namespace": 182,
                    "@keyframes": 188,
                    "@supports": 200,
                    "@scope": 204
                },
                q = {
                    __proto__: null,
                    to: 207
                },
                H = A.deserialize({
                    version: 14,
                    states: "EbQYQdOOO#qQdOOP#xO`OOOOQP'#Cf'#CfOOQP'#Ce'#CeO#}QdO'#ChO$nQaO'#CcO$xQdO'#CkO%TQdO'#DpO%YQdO'#DrO%_QdO'#DuO%_QdO'#DxOOQP'#FV'#FVO&eQhO'#EhOOQS'#FU'#FUOOQS'#Ek'#EkQYQdOOO&lQdO'#EOO&PQhO'#EUO&lQdO'#EWO'aQdO'#EYO'lQdO'#E]O'tQhO'#EcO(VQdO'#EeO(bQaO'#CfO)VQ`O'#D{O)[Q`O'#F`O)gQdO'#F`QOQ`OOP)qO&jO'#CaPOOO)C@t)C@tOOQP'#Cj'#CjOOQP,59S,59SO#}QdO,59SO)|QdO,59VO%TQdO,5:[O%YQdO,5:^O%_QdO,5:aO%_QdO,5:cO%_QdO,5:dO%_QdO'#ErO*XQ`O,58}O*aQdO'#DzOOQS,58},58}OOQP'#Cn'#CnOOQO'#Dn'#DnOOQP,59V,59VO*hQ`O,59VO*mQ`O,59VOOQP'#Dq'#DqOOQP,5:[,5:[OOQO'#Ds'#DsO*rQpO,5:^O+]QaO,5:aO+sQaO,5:dOOQW'#DZ'#DZO,ZQhO'#DdO,xQhO'#FaO'tQhO'#DbO-WQ`O'#DhOOQW'#F['#F[O-]Q`O,5;SO-eQ`O'#DeOOQS-E8i-E8iOOQ['#Cs'#CsO-jQdO'#CtO.QQdO'#CzO.hQdO'#C}O/OQ!pO'#DPO1RQ!jO,5:jOOQO'#DU'#DUO*mQ`O'#DTO1cQ!nO'#FXO3`Q`O'#DVO3eQ`O'#DkOOQ['#FX'#FXO-`Q`O,5:pO3jQ!bO,5:rOOQS'#E['#E[O3rQ`O,5:tO3wQdO,5:tOOQO'#E_'#E_O4PQ`O,5:wO4UQhO,5:}O%_QdO'#DgOOQS,5;P,5;PO-eQ`O,5;PO4^QdO,5;PO4fQdO,5:gO4vQdO'#EtO5TQ`O,5;zO5TQ`O,5;zPOOO'#Ej'#EjP5`O&jO,58{POOO,58{,58{OOQP1G.n1G.nOOQP1G.q1G.qO*hQ`O1G.qO*mQ`O1G.qOOQP1G/v1G/vO5kQpO1G/xO5sQaO1G/{O6ZQaO1G/}O6qQaO1G0OO7XQaO,5;^OOQO-E8p-E8pOOQS1G.i1G.iO7cQ`O,5:fO7hQdO'#DoO7oQdO'#CrOOQP1G/x1G/xO&lQdO1G/xO7vQ!jO'#DZO8UQ!bO,59vO8^QhO,5:OOOQO'#F]'#F]O8XQ!bO,59zO'tQhO,59xO8fQhO'#EvO8sQ`O,5;{O9OQhO,59|O9uQhO'#DiOOQW,5:S,5:SOOQS1G0n1G0nOOQW,5:P,5:PO9|Q!fO'#FYOOQS'#FY'#FYOOQS'#Em'#EmO;^QdO,59`OOQ[,59`,59`O;tQdO,59fOOQ[,59f,59fO<[QdO,59iOOQ[,59i,59iOOQ[,59k,59kO&lQdO,59mO<rQhO'#EQOOQW'#EQ'#EQO=WQ`O1G0UO1[QhO1G0UOOQ[,59o,59oO'tQhO'#DXOOQ[,59q,59qO=]Q#tO,5:VOOQS1G0[1G0[OOQS1G0^1G0^OOQS1G0`1G0`O=hQ`O1G0`O=mQdO'#E`OOQS1G0c1G0cOOQS1G0i1G0iO=xQaO,5:RO-`Q`O1G0kOOQS1G0k1G0kO-eQ`O1G0kO>PQ!fO1G0ROOQO1G0R1G0ROOQO,5;`,5;`O>gQdO,5;`OOQO-E8r-E8rO>tQ`O1G1fPOOO-E8h-E8hPOOO1G.g1G.gOOQP7+$]7+$]OOQP7+%d7+%dO&lQdO7+%dOOQS1G0Q1G0QO?PQaO'#F_O?ZQ`O,5:ZO?`Q!fO'#ElO@^QdO'#FWO@hQ`O,59^O@mQ!bO7+%dO&lQdO1G/bO@uQhO1G/fOOQW1G/j1G/jOOQW1G/d1G/dOAWQhO,5;bOOQO-E8t-E8tOAfQhO'#DZOAtQhO'#F^OBPQ`O'#F^OBUQ`O,5:TOOQS-E8k-E8kOOQ[1G.z1G.zOOQ[1G/Q1G/QOOQ[1G/T1G/TOOQ[1G/X1G/XOBZQdO,5:lOOQS7+%p7+%pOB`Q`O7+%pOBeQhO'#DYOBmQ`O,59sO'tQhO,59sOOQ[1G/q1G/qOBuQ`O1G/qOOQS7+%z7+%zOBzQbO'#DPOOQO'#Eb'#EbOCYQ`O'#EaOOQO'#Ea'#EaOCeQ`O'#EwOCmQdO,5:zOOQS,5:z,5:zOOQ[1G/m1G/mOOQS7+&V7+&VO-`Q`O7+&VOCxQ!fO'#EsO&lQdO'#EsOEPQdO7+%mOOQO7+%m7+%mOOQO1G0z1G0zOEdQ!bO<<IOOElQdO'#EqOEvQ`O,5;yOOQP1G/u1G/uOOQS-E8j-E8jOFOQdO'#EpOFYQ`O,5;rOOQ]1G.x1G.xOOQP<<IO<<IOOFbQdO7+$|OOQO'#D]'#D]OFiQ!bO7+%QOFqQhO'#EoOF{Q`O,5;xO&lQdO,5;xOOQW1G/o1G/oOOQO'#ES'#ESOGTQ`O1G0WOOQS<<I[<<I[O&lQdO,59tOGnQhO1G/_OOQ[1G/_1G/_OGuQ`O1G/_OOQW-E8l-E8lOOQ[7+%]7+%]OOQO,5:{,5:{O=pQdO'#ExOCeQ`O,5;cOOQS,5;c,5;cOOQS-E8u-E8uOOQS1G0f1G0fOOQS<<Iq<<IqOG}Q!fO,5;_OOQS-E8q-E8qOOQO<<IX<<IXOOQPAN>jAN>jOIUQaO,5;]OOQO-E8o-E8oOI`QdO,5;[OOQO-E8n-E8nOOQW<<Hh<<HhOOQW<<Hl<<HlOIjQhO<<HlOI{QhO,5;ZOJWQ`O,5;ZOOQO-E8m-E8mOJ]QdO1G1dOBZQdO'#EuOJgQ`O7+%rOOQW7+%r7+%rOJoQ!bO1G/`OOQ[7+$y7+$yOJzQhO7+$yPKRQ`O'#EnOOQO,5;d,5;dOOQO-E8v-E8vOOQS1G0}1G0}OKWQ`OAN>WO&lQdO1G0uOK]Q`O7+'OOOQO,5;a,5;aOOQO-E8s-E8sOOQW<<I^<<I^OOQ[<<He<<HePOQW,5;Y,5;YOOQWG23rG23rOKeQdO7+&a",
                    stateData: "Kx~O#sOS#tQQ~OW[OZ[O]TO`VOaVOi]OjWOmXO!jYO!mZO!saO!ybO!{cO!}dO#QeO#WfO#YgO#oRO~OQiOW[OZ[O]TO`VOaVOi]OjWOmXO!jYO!mZO!saO!ybO!{cO!}dO#QeO#WfO#YgO#ohO~O#m$SP~P!dO#tmO~O#ooO~O]qO`rOarOjsOmtO!juO!mwO#nvO~OpzO!^xO~P$SOc!QO#o|O#p}O~O#o!RO~O#o!TO~OW[OZ[O]TO`VOaVOjWOmXO!jYO!mZO#oRO~OS!]Oe!YO!V![O!Y!`O#q!XOp$TP~Ok$TP~P&POQ!jOe!cOm!dOp!eOr!mOt!mOz!kO!`!lO#o!bO#p!hO#}!fO~Ot!qO!`!lO#o!pO~Ot!sO#o!sO~OS!]Oe!YO!V![O!Y!`O#q!XO~Oe!vOpzO#Z!xO~O]YX`YX`!pXaYXjYXmYXpYX!^YX!jYX!mYX#nYX~O`!zO~Ok!{O#m$SXo$SX~O#m$SXo$SX~P!dO#u#OO#v#OO#w#QO~Oc#UO#o|O#p}O~OpzO!^xO~Oo$SP~P!dOe#`O~Oe#aO~Ol#bO!h#cO~O]qO`rOarOjsOmtO~Op!ia!^!ia!j!ia!m!ia#n!iad!ia~P*zOp!la!^!la!j!la!m!la#n!lad!la~P*zOR#gOS!]Oe!YOr#gOt#gO!V![O!Y!`O#q#dO#}!fO~O!R#iO!^#jOk$TXp$TX~Oe#mO~Ok#oOpzO~Oe!vO~O]#rO`#rOd#uOi#rOj#rOk#rO~P&lO]#rO`#rOi#rOj#rOk#rOl#wO~P&lO]#rO`#rOi#rOj#rOk#rOo#yO~P&lOP#zOSsXesXksXvsX!VsX!YsX!usX!wsX#qsX!TsXQsX]sX`sXdsXisXjsXmsXpsXrsXtsXzsX!`sX#osX#psX#}sXlsXosX!^sX!qsX#msX~Ov#{O!u#|O!w#}Ok$TP~P'tOe#aOS#{Xk#{Xv#{X!V#{X!Y#{X!u#{X!w#{X#q#{XQ#{X]#{X`#{Xd#{Xi#{Xj#{Xm#{Xp#{Xr#{Xt#{Xz#{X!`#{X#o#{X#p#{X#}#{Xl#{Xo#{X!^#{X!q#{X#m#{X~Oe$RO~Oe$TO~Ok$VOv#{O~Ok$WO~Ot$XO!`!lO~Op$YO~OpzO!R#iO~OpzO#Z$`O~O!q$bOk!oa#m!oao!oa~P&lOk#hX#m#hXo#hX~P!dOk!{O#m$Sao$Sa~O#u#OO#v#OO#w$hO~Ol$jO!h$kO~Op!ii!^!ii!j!ii!m!ii#n!iid!ii~P*zOp!ki!^!ki!j!ki!m!ki#n!kid!ki~P*zOp!li!^!li!j!li!m!li#n!lid!li~P*zOp#fa!^#fa~P$SOo$lO~Od$RP~P%_Od#zP~P&lO`!PXd}X!R}X!T!PX~O`$sO!T$tO~Od$uO!R#iO~Ok#jXp#jX!^#jX~P'tO!^#jOk$Tap$Ta~O!R#iOk!Uap!Ua!^!Uad!Ua`!Ua~OS!]Oe!YO!V![O!Y!`O#q$yO~Od$QP~P9dOv#{OQ#|X]#|X`#|Xd#|Xe#|Xi#|Xj#|Xk#|Xm#|Xp#|Xr#|Xt#|Xz#|X!`#|X#o#|X#p#|X#}#|Xl#|Xo#|X~O]#rO`#rOd%OOi#rOj#rOk#rO~P&lO]#rO`#rOi#rOj#rOk#rOl%PO~P&lO]#rO`#rOi#rOj#rOk#rOo%QO~P&lOe%SOS!tXk!tX!V!tX!Y!tX#q!tX~Ok%TO~Od%YOt%ZO!a%ZO~Ok%[O~Oo%cO#o%^O#}%]O~Od%dO~P$SOv#{O!^%hO!q%jOk!oi#m!oio!oi~P&lOk#ha#m#hao#ha~P!dOk!{O#m$Sio$Si~O!^%mOd$RX~P$SOd%oO~Ov#{OQ#`Xd#`Xe#`Xm#`Xp#`Xr#`Xt#`Xz#`X!^#`X!`#`X#o#`X#p#`X#}#`X~O!^%qOd#zX~P&lOd%sO~Ol%tOv#{O~OR#gOr#gOt#gO#q%vO#}!fO~O!R#iOk#jap#ja!^#ja~O`!PXd}X!R}X!^}X~O!R#iO!^%xOd$QX~O`%zO~Od%{O~O#o%|O~Ok&OO~O`&PO!R#iO~Od&ROk&QO~Od&UO~OP#zOpsX!^sXdsX~O#}%]Op#TX!^#TX~OpzO!^&WO~Oo&[O#o%^O#}%]O~Ov#{OQ#gXe#gXk#gXm#gXp#gXr#gXt#gXz#gX!^#gX!`#gX!q#gX#m#gX#o#gX#p#gX#}#gXo#gX~O!^%hO!q&`Ok!oq#m!oqo!oq~P&lOl&aOv#{O~Od#eX!^#eX~P%_O!^%mOd$Ra~Od#dX!^#dX~P&lO!^%qOd#za~Od&fO~P&lOd&gO!T&hO~Od#cX!^#cX~P9dO!^%xOd$Qa~O]&mOd&oO~OS#bae#ba!V#ba!Y#ba#q#ba~Od&qO~PG]Od&qOk&rO~Ov#{OQ#gae#gak#gam#gap#gar#gat#gaz#ga!^#ga!`#ga!q#ga#m#ga#o#ga#p#ga#}#gao#ga~Od#ea!^#ea~P$SOd#da!^#da~P&lOR#gOr#gOt#gO#q%vO#}%]O~O!R#iOd#ca!^#ca~O`&xO~O!^%xOd$Qi~P&lO]&mOd&|O~Ov#{Od|ik|i~Od&}O~PG]Ok'OO~Od'PO~O!^%xOd$Qq~Od#cq!^#cq~P&lO#s!a#t#}]#}v!m~",
                    goto: "2h$UPPPPP$VP$YP$c$uP$cP%X$cPP%_PPP%e%o%oPPPPP%oPP%oP&]P%oP%o'W%oP't'w'}'}(^'}P'}P'}P'}'}P(m'}(yP(|PP)p)v$c)|$c*SP$cP$c$cP*Y*{+YP$YP+aP+dP$YP$YP$YP+j$YP+m+p+s+z$YP$YPP$YP,P,V,f,|-[-b-l-r-x.O.U.`.f.l.rPPPPPPPPPPP.x/R/w/z0|P1U1u2O2R2U2[RnQ_^OP`kz!{$dq[OPYZ`kuvwxz!v!{#`$d%mqSOPYZ`kuvwxz!v!{#`$d%mQpTR#RqQ!OVR#SrQ#S!QS$Q!i!jR$i#U!V!mac!c!d!e!z#a#c#t#v#x#{$a$k$p$s%h%i%q%u%z&P&d&l&x'Q!U!mac!c!d!e!z#a#c#t#v#x#{$a$k$p$s%h%i%q%u%z&P&d&l&x'QU#g!Y$t&hU%`$Y%b&WR&V%_!V!iac!c!d!e!z#a#c#t#v#x#{$a$k$p$s%h%i%q%u%z&P&d&l&x'QR$S!kQ%W$RR&S%Xk!^]bf!Y![!g#i#j#m$P$R%X%xQ#e!YQ${#mQ%w$tQ&j%xR&w&hQ!ygQ#p!`Q$^!xR%f$`R#n!]!U!mac!c!d!e!z#a#c#t#v#x#{$a$k$p$s%h%i%q%u%z&P&d&l&x'QQ!qdR$X!rQ!PVR#TrQ#S!PR$i#TQ!SWR#VsQ!UXR#WtQ{UQ!wgQ#^yQ#o!_Q$U!nQ$[!uQ$_!yQ%e$^Q&Y%aQ&]%fR&v&XSjPzQ!}kQ$c!{R%k$dZiPkz!{$dR$P!gQ%}%SR&z&mR!rdR!teR$Z!tS%a$Y%bR&t&WV%_$Y%b&WQ#PmR$g#PQ`OSkPzU!a`k$dR$d!{Q$p#aY%p$p%u&d&l'QQ%u$sQ&d%qQ&l%zR'Q&xQ#t!cQ#v!dQ#x!eV$}#t#v#xQ%X$RR&T%XQ%y$zS&k%y&yR&y&lQ%r$pR&e%rQ%n$mR&c%nQyUR#]yQ%i$aR&_%iQ!|jS$e!|$fR$f!}Q&n%}R&{&nQ#k!ZR$x#kQ%b$YR&Z%bQ&X%aR&u&X__OP`kz!{$d^UOP`kz!{$dQ!VYQ!WZQ#XuQ#YvQ#ZwQ#[xQ$]!vQ$m#`R&b%mR$q#aQ!gaQ!oc[#q!c!d!e#t#v#xQ$a!zd$o#a$p$s%q%u%z&d&l&x'QQ$r#cQ%R#{S%g$a%iQ%l$kQ&^%hR&p&P]#s!c!d!e#t#v#xW!Z]b!g$PQ!ufQ#f!YQ#l![Q$v#iQ$w#jQ$z#mS%V$R%XR&i%xQ#h!YQ%w$tR&w&hR$|#mR$n#`QlPR#_zQ!_]Q!nbQ$O!gR%U$P",
                    nodeNames: "⚠ Unit VariableName VariableName QueryCallee Comment StyleSheet RuleSet UniversalSelector TagSelector TagName NestingSelector ClassSelector . ClassName PseudoClassSelector : :: PseudoClassName PseudoClassName ) ( ArgList ValueName ParenthesizedValue AtKeyword # ; ] [ BracketedValue } { BracedValue ColorLiteral NumberLiteral StringLiteral BinaryExpression BinOp CallExpression Callee IfExpression if ArgList IfBranch KeywordQuery FeatureQuery FeatureName BinaryQuery LogicOp ComparisonQuery CompareOp UnaryQuery UnaryQueryOp ParenthesizedQuery SelectorQuery selector ParenthesizedSelector CallQuery ArgList , CallLiteral CallTag ParenthesizedContent PseudoClassName ArgList IdSelector IdName AttributeSelector AttributeName MatchOp ChildSelector ChildOp DescendantSelector SiblingSelector SiblingOp Block Declaration PropertyName Important ImportStatement import Layer layer LayerName layer MediaStatement media CharsetStatement charset NamespaceStatement namespace NamespaceName KeyframesStatement keyframes KeyframeName KeyframeList KeyframeSelector KeyframeRangeName SupportsStatement supports ScopeStatement scope to AtRule Styles",
                    maxTerm: 143,
                    nodeProps: [
                        ["isolate", -2, 5, 36, ""],
                        ["openedBy", 20, "(", 28, "[", 31, "{"],
                        ["closedBy", 21, ")", 29, "]", 32, "}"]
                    ],
                    propSources: [F],
                    skippedNodes: [0, 5, 106],
                    repeatNodeCount: 15,
                    tokenData: "JQ~R!YOX$qX^%i^p$qpq%iqr({rs-ust/itu6Wuv$qvw7Qwx7cxy9Qyz9cz{9h{|:R|}>t}!O?V!O!P?t!P!Q@]!Q![AU![!]BP!]!^B{!^!_C^!_!`DY!`!aDm!a!b$q!b!cEn!c!}$q!}#OG{#O#P$q#P#QH^#Q#R6W#R#o$q#o#pHo#p#q6W#q#rIQ#r#sIc#s#y$q#y#z%i#z$f$q$f$g%i$g#BY$q#BY#BZ%i#BZ$IS$q$IS$I_%i$I_$I|$q$I|$JO%i$JO$JT$q$JT$JU%i$JU$KV$q$KV$KW%i$KW&FU$q&FU&FV%i&FV;'S$q;'S;=`Iz<%lO$q`$tSOy%Qz;'S%Q;'S;=`%c<%lO%Q`%VS!a`Oy%Qz;'S%Q;'S;=`%c<%lO%Q`%fP;=`<%l%Q~%nh#s~OX%QX^'Y^p%Qpq'Yqy%Qz#y%Q#y#z'Y#z$f%Q$f$g'Y$g#BY%Q#BY#BZ'Y#BZ$IS%Q$IS$I_'Y$I_$I|%Q$I|$JO'Y$JO$JT%Q$JT$JU'Y$JU$KV%Q$KV$KW'Y$KW&FU%Q&FU&FV'Y&FV;'S%Q;'S;=`%c<%lO%Q~'ah#s~!a`OX%QX^'Y^p%Qpq'Yqy%Qz#y%Q#y#z'Y#z$f%Q$f$g'Y$g#BY%Q#BY#BZ'Y#BZ$IS%Q$IS$I_'Y$I_$I|%Q$I|$JO'Y$JO$JT%Q$JT$JU'Y$JU$KV%Q$KV$KW'Y$KW&FU%Q&FU&FV'Y&FV;'S%Q;'S;=`%c<%lO%Qj)OUOy%Qz#]%Q#]#^)b#^;'S%Q;'S;=`%c<%lO%Qj)gU!a`Oy%Qz#a%Q#a#b)y#b;'S%Q;'S;=`%c<%lO%Qj*OU!a`Oy%Qz#d%Q#d#e*b#e;'S%Q;'S;=`%c<%lO%Qj*gU!a`Oy%Qz#c%Q#c#d*y#d;'S%Q;'S;=`%c<%lO%Qj+OU!a`Oy%Qz#f%Q#f#g+b#g;'S%Q;'S;=`%c<%lO%Qj+gU!a`Oy%Qz#h%Q#h#i+y#i;'S%Q;'S;=`%c<%lO%Qj,OU!a`Oy%Qz#T%Q#T#U,b#U;'S%Q;'S;=`%c<%lO%Qj,gU!a`Oy%Qz#b%Q#b#c,y#c;'S%Q;'S;=`%c<%lO%Qj-OU!a`Oy%Qz#h%Q#h#i-b#i;'S%Q;'S;=`%c<%lO%Qj-iS!qY!a`Oy%Qz;'S%Q;'S;=`%c<%lO%Q~-xWOY-uZr-urs.bs#O-u#O#P.g#P;'S-u;'S;=`/c<%lO-u~.gOt~~.jRO;'S-u;'S;=`.s;=`O-u~.vXOY-uZr-urs.bs#O-u#O#P.g#P;'S-u;'S;=`/c;=`<%l-u<%lO-u~/fP;=`<%l-uj/nYjYOy%Qz!Q%Q!Q![0^![!c%Q!c!i0^!i#T%Q#T#Z0^#Z;'S%Q;'S;=`%c<%lO%Qj0cY!a`Oy%Qz!Q%Q!Q![1R![!c%Q!c!i1R!i#T%Q#T#Z1R#Z;'S%Q;'S;=`%c<%lO%Qj1WY!a`Oy%Qz!Q%Q!Q![1v![!c%Q!c!i1v!i#T%Q#T#Z1v#Z;'S%Q;'S;=`%c<%lO%Qj1}YrY!a`Oy%Qz!Q%Q!Q![2m![!c%Q!c!i2m!i#T%Q#T#Z2m#Z;'S%Q;'S;=`%c<%lO%Qj2tYrY!a`Oy%Qz!Q%Q!Q![3d![!c%Q!c!i3d!i#T%Q#T#Z3d#Z;'S%Q;'S;=`%c<%lO%Qj3iY!a`Oy%Qz!Q%Q!Q![4X![!c%Q!c!i4X!i#T%Q#T#Z4X#Z;'S%Q;'S;=`%c<%lO%Qj4`YrY!a`Oy%Qz!Q%Q!Q![5O![!c%Q!c!i5O!i#T%Q#T#Z5O#Z;'S%Q;'S;=`%c<%lO%Qj5TY!a`Oy%Qz!Q%Q!Q![5s![!c%Q!c!i5s!i#T%Q#T#Z5s#Z;'S%Q;'S;=`%c<%lO%Qj5zSrY!a`Oy%Qz;'S%Q;'S;=`%c<%lO%Qd6ZUOy%Qz!_%Q!_!`6m!`;'S%Q;'S;=`%c<%lO%Qd6tS!hS!a`Oy%Qz;'S%Q;'S;=`%c<%lO%Qb7VSZQOy%Qz;'S%Q;'S;=`%c<%lO%Q~7fWOY7cZw7cwx.bx#O7c#O#P8O#P;'S7c;'S;=`8z<%lO7c~8RRO;'S7c;'S;=`8[;=`O7c~8_XOY7cZw7cwx.bx#O7c#O#P8O#P;'S7c;'S;=`8z;=`<%l7c<%lO7c~8}P;=`<%l7cj9VSeYOy%Qz;'S%Q;'S;=`%c<%lO%Q~9hOd~n9oUWQvWOy%Qz!_%Q!_!`6m!`;'S%Q;'S;=`%c<%lO%Qj:YWvW!mQOy%Qz!O%Q!O!P:r!P!Q%Q!Q![=w![;'S%Q;'S;=`%c<%lO%Qj:wU!a`Oy%Qz!Q%Q!Q![;Z![;'S%Q;'S;=`%c<%lO%Qj;bY!a`#}YOy%Qz!Q%Q!Q![;Z![!g%Q!g!h<Q!h#X%Q#X#Y<Q#Y;'S%Q;'S;=`%c<%lO%Qj<VY!a`Oy%Qz{%Q{|<u|}%Q}!O<u!O!Q%Q!Q![=^![;'S%Q;'S;=`%c<%lO%Qj<zU!a`Oy%Qz!Q%Q!Q![=^![;'S%Q;'S;=`%c<%lO%Qj=eU!a`#}YOy%Qz!Q%Q!Q![=^![;'S%Q;'S;=`%c<%lO%Qj>O[!a`#}YOy%Qz!O%Q!O!P;Z!P!Q%Q!Q![=w![!g%Q!g!h<Q!h#X%Q#X#Y<Q#Y;'S%Q;'S;=`%c<%lO%Qj>yS!^YOy%Qz;'S%Q;'S;=`%c<%lO%Qj?[WvWOy%Qz!O%Q!O!P:r!P!Q%Q!Q![=w![;'S%Q;'S;=`%c<%lO%Qj?yU]YOy%Qz!Q%Q!Q![;Z![;'S%Q;'S;=`%c<%lO%Q~@bTvWOy%Qz{@q{;'S%Q;'S;=`%c<%lO%Q~@xS!a`#t~Oy%Qz;'S%Q;'S;=`%c<%lO%QjAZ[#}YOy%Qz!O%Q!O!P;Z!P!Q%Q!Q![=w![!g%Q!g!h<Q!h#X%Q#X#Y<Q#Y;'S%Q;'S;=`%c<%lO%QjBUU`YOy%Qz![%Q![!]Bh!];'S%Q;'S;=`%c<%lO%QbBoSaQ!a`Oy%Qz;'S%Q;'S;=`%c<%lO%QjCQSkYOy%Qz;'S%Q;'S;=`%c<%lO%QhCcU!TWOy%Qz!_%Q!_!`Cu!`;'S%Q;'S;=`%c<%lO%QhC|S!TW!a`Oy%Qz;'S%Q;'S;=`%c<%lO%QlDaS!TW!hSOy%Qz;'S%Q;'S;=`%c<%lO%QjDtV!jQ!TWOy%Qz!_%Q!_!`Cu!`!aEZ!a;'S%Q;'S;=`%c<%lO%QbEbS!jQ!a`Oy%Qz;'S%Q;'S;=`%c<%lO%QjEqYOy%Qz}%Q}!OFa!O!c%Q!c!}GO!}#T%Q#T#oGO#o;'S%Q;'S;=`%c<%lO%QjFfW!a`Oy%Qz!c%Q!c!}GO!}#T%Q#T#oGO#o;'S%Q;'S;=`%c<%lO%QjGV[iY!a`Oy%Qz}%Q}!OGO!O!Q%Q!Q![GO![!c%Q!c!}GO!}#T%Q#T#oGO#o;'S%Q;'S;=`%c<%lO%QjHQSmYOy%Qz;'S%Q;'S;=`%c<%lO%QnHcSl^Oy%Qz;'S%Q;'S;=`%c<%lO%QjHtSpYOy%Qz;'S%Q;'S;=`%c<%lO%QjIVSoYOy%Qz;'S%Q;'S;=`%c<%lO%QfIhU!mQOy%Qz!_%Q!_!`6m!`;'S%Q;'S;=`%c<%lO%Q`I}P;=`<%l$q",
                    tokenizers: [I, z, L, N, 1, 2, 3, 4, new f("m~RRYZ[z{a~~g~aO#v~~dP!P!Qg~lO#w~~", 28, 129)],
                    topRules: {
                        StyleSheet: [0, 6],
                        Styles: [1, 105]
                    },
                    specialized: [{
                        term: 124,
                        get: t => $[t] || -1
                    }, {
                        term: 125,
                        get: t => W[t] || -1
                    }, {
                        term: 4,
                        get: t => V[t] || -1
                    }, {
                        term: 25,
                        get: t => j[t] || -1
                    }, {
                        term: 123,
                        get: t => q[t] || -1
                    }],
                    tokenPrec: 1963
                });
            var _ = i(874);
            let X = null;

            function Y() {
                if (!X && "object" == typeof document && document.body) {
                    let {
                        style: t
                    } = document.body, e = [], i = new Set;
                    for (let s in t) "cssText" != s && "cssFloat" != s && "string" == typeof t[s] && (/[A-Z]/.test(s) && (s = s.replace(/[A-Z]/g, t => "-" + t.toLowerCase())), i.has(s) || (e.push(s), i.add(s)));
                    X = e.sort().map(t => ({
                        type: "property",
                        label: t,
                        apply: t + ": "
                    }))
                }
                return X || []
            }
            const U = ["active", "after", "any-link", "autofill", "backdrop", "before", "checked", "cue", "default", "defined", "disabled", "empty", "enabled", "file-selector-button", "first", "first-child", "first-letter", "first-line", "first-of-type", "focus", "focus-visible", "focus-within", "fullscreen", "has", "host", "host-context", "hover", "in-range", "indeterminate", "invalid", "is", "lang", "last-child", "last-of-type", "left", "link", "marker", "modal", "not", "nth-child", "nth-last-child", "nth-last-of-type", "nth-of-type", "only-child", "only-of-type", "optional", "out-of-range", "part", "placeholder", "placeholder-shown", "read-only", "read-write", "required", "right", "root", "scope", "selection", "slotted", "target", "target-text", "valid", "visited", "where"].map(t => ({
                    type: "class",
                    label: t
                })),
                G = ["above", "absolute", "activeborder", "additive", "activecaption", "after-white-space", "ahead", "alias", "all", "all-scroll", "alphabetic", "alternate", "always", "antialiased", "appworkspace", "asterisks", "attr", "auto", "auto-flow", "avoid", "avoid-column", "avoid-page", "avoid-region", "axis-pan", "background", "backwards", "baseline", "below", "bidi-override", "blink", "block", "block-axis", "bold", "bolder", "border", "border-box", "both", "bottom", "break", "break-all", "break-word", "bullets", "button", "button-bevel", "buttonface", "buttonhighlight", "buttonshadow", "buttontext", "calc", "capitalize", "caps-lock-indicator", "caption", "captiontext", "caret", "cell", "center", "checkbox", "circle", "cjk-decimal", "clear", "clip", "close-quote", "col-resize", "collapse", "color", "color-burn", "color-dodge", "column", "column-reverse", "compact", "condensed", "contain", "content", "contents", "content-box", "context-menu", "continuous", "copy", "counter", "counters", "cover", "crop", "cross", "crosshair", "currentcolor", "cursive", "cyclic", "darken", "dashed", "decimal", "decimal-leading-zero", "default", "default-button", "dense", "destination-atop", "destination-in", "destination-out", "destination-over", "difference", "disc", "discard", "disclosure-closed", "disclosure-open", "document", "dot-dash", "dot-dot-dash", "dotted", "double", "down", "e-resize", "ease", "ease-in", "ease-in-out", "ease-out", "element", "ellipse", "ellipsis", "embed", "end", "ethiopic-abegede-gez", "ethiopic-halehame-aa-er", "ethiopic-halehame-gez", "ew-resize", "exclusion", "expanded", "extends", "extra-condensed", "extra-expanded", "fantasy", "fast", "fill", "fill-box", "fixed", "flat", "flex", "flex-end", "flex-start", "footnotes", "forwards", "from", "geometricPrecision", "graytext", "grid", "groove", "hand", "hard-light", "help", "hidden", "hide", "higher", "highlight", "highlighttext", "horizontal", "hsl", "hsla", "hue", "icon", "ignore", "inactiveborder", "inactivecaption", "inactivecaptiontext", "infinite", "infobackground", "infotext", "inherit", "initial", "inline", "inline-axis", "inline-block", "inline-flex", "inline-grid", "inline-table", "inset", "inside", "intrinsic", "invert", "italic", "justify", "keep-all", "landscape", "large", "larger", "left", "level", "lighter", "lighten", "line-through", "linear", "linear-gradient", "lines", "list-item", "listbox", "listitem", "local", "logical", "loud", "lower", "lower-hexadecimal", "lower-latin", "lower-norwegian", "lowercase", "ltr", "luminosity", "manipulation", "match", "matrix", "matrix3d", "medium", "menu", "menutext", "message-box", "middle", "min-intrinsic", "mix", "monospace", "move", "multiple", "multiple_mask_images", "multiply", "n-resize", "narrower", "ne-resize", "nesw-resize", "no-close-quote", "no-drop", "no-open-quote", "no-repeat", "none", "normal", "not-allowed", "nowrap", "ns-resize", "numbers", "numeric", "nw-resize", "nwse-resize", "oblique", "opacity", "open-quote", "optimizeLegibility", "optimizeSpeed", "outset", "outside", "outside-shape", "overlay", "overline", "padding", "padding-box", "painted", "page", "paused", "perspective", "pinch-zoom", "plus-darker", "plus-lighter", "pointer", "polygon", "portrait", "pre", "pre-line", "pre-wrap", "preserve-3d", "progress", "push-button", "radial-gradient", "radio", "read-only", "read-write", "read-write-plaintext-only", "rectangle", "region", "relative", "repeat", "repeating-linear-gradient", "repeating-radial-gradient", "repeat-x", "repeat-y", "reset", "reverse", "rgb", "rgba", "ridge", "right", "rotate", "rotate3d", "rotateX", "rotateY", "rotateZ", "round", "row", "row-resize", "row-reverse", "rtl", "run-in", "running", "s-resize", "sans-serif", "saturation", "scale", "scale3d", "scaleX", "scaleY", "scaleZ", "screen", "scroll", "scrollbar", "scroll-position", "se-resize", "self-start", "self-end", "semi-condensed", "semi-expanded", "separate", "serif", "show", "single", "skew", "skewX", "skewY", "skip-white-space", "slide", "slider-horizontal", "slider-vertical", "sliderthumb-horizontal", "sliderthumb-vertical", "slow", "small", "small-caps", "small-caption", "smaller", "soft-light", "solid", "source-atop", "source-in", "source-out", "source-over", "space", "space-around", "space-between", "space-evenly", "spell-out", "square", "start", "static", "status-bar", "stretch", "stroke", "stroke-box", "sub", "subpixel-antialiased", "svg_masks", "super", "sw-resize", "symbolic", "symbols", "system-ui", "table", "table-caption", "table-cell", "table-column", "table-column-group", "table-footer-group", "table-header-group", "table-row", "table-row-group", "text", "text-bottom", "text-top", "textarea", "textfield", "thick", "thin", "threeddarkshadow", "threedface", "threedhighlight", "threedlightshadow", "threedshadow", "to", "top", "transform", "translate", "translate3d", "translateX", "translateY", "translateZ", "transparent", "ultra-condensed", "ultra-expanded", "underline", "unidirectional-pan", "unset", "up", "upper-latin", "uppercase", "url", "var", "vertical", "vertical-text", "view-box", "visible", "visibleFill", "visiblePainted", "visibleStroke", "visual", "w-resize", "wait", "wave", "wider", "window", "windowframe", "windowtext", "words", "wrap", "wrap-reverse", "x-large", "x-small", "xor", "xx-large", "xx-small"].map(t => ({
                    type: "keyword",
                    label: t
                })).concat(["aliceblue", "antiquewhite", "aqua", "aquamarine", "azure", "beige", "bisque", "black", "blanchedalmond", "blue", "blueviolet", "brown", "burlywood", "cadetblue", "chartreuse", "chocolate", "coral", "cornflowerblue", "cornsilk", "crimson", "cyan", "darkblue", "darkcyan", "darkgoldenrod", "darkgray", "darkgreen", "darkkhaki", "darkmagenta", "darkolivegreen", "darkorange", "darkorchid", "darkred", "darksalmon", "darkseagreen", "darkslateblue", "darkslategray", "darkturquoise", "darkviolet", "deeppink", "deepskyblue", "dimgray", "dodgerblue", "firebrick", "floralwhite", "forestgreen", "fuchsia", "gainsboro", "ghostwhite", "gold", "goldenrod", "gray", "grey", "green", "greenyellow", "honeydew", "hotpink", "indianred", "indigo", "ivory", "khaki", "lavender", "lavenderblush", "lawngreen", "lemonchiffon", "lightblue", "lightcoral", "lightcyan", "lightgoldenrodyellow", "lightgray", "lightgreen", "lightpink", "lightsalmon", "lightseagreen", "lightskyblue", "lightslategray", "lightsteelblue", "lightyellow", "lime", "limegreen", "linen", "magenta", "maroon", "mediumaquamarine", "mediumblue", "mediumorchid", "mediumpurple", "mediumseagreen", "mediumslateblue", "mediumspringgreen", "mediumturquoise", "mediumvioletred", "midnightblue", "mintcream", "mistyrose", "moccasin", "navajowhite", "navy", "oldlace", "olive", "olivedrab", "orange", "orangered", "orchid", "palegoldenrod", "palegreen", "paleturquoise", "palevioletred", "papayawhip", "peachpuff", "peru", "pink", "plum", "powderblue", "purple", "rebeccapurple", "red", "rosybrown", "royalblue", "saddlebrown", "salmon", "sandybrown", "seagreen", "seashell", "sienna", "silver", "skyblue", "slateblue", "slategray", "snow", "springgreen", "steelblue", "tan", "teal", "thistle", "tomato", "turquoise", "violet", "wheat", "white", "whitesmoke", "yellow", "yellowgreen"].map(t => ({
                    type: "constant",
                    label: t
                }))),
                K = ["a", "abbr", "address", "article", "aside", "b", "bdi", "bdo", "blockquote", "body", "br", "button", "canvas", "caption", "cite", "code", "col", "colgroup", "dd", "del", "details", "dfn", "dialog", "div", "dl", "dt", "em", "figcaption", "figure", "footer", "form", "header", "hgroup", "h1", "h2", "h3", "h4", "h5", "h6", "hr", "html", "i", "iframe", "img", "input", "ins", "kbd", "label", "legend", "li", "main", "meter", "nav", "ol", "output", "p", "pre", "ruby", "section", "select", "small", "source", "span", "strong", "sub", "summary", "sup", "table", "tbody", "td", "template", "textarea", "tfoot", "th", "thead", "tr", "u", "ul"].map(t => ({
                    type: "type",
                    label: t
                })),
                Z = ["@charset", "@color-profile", "@container", "@counter-style", "@font-face", "@font-feature-values", "@font-palette-values", "@import", "@keyframes", "@layer", "@media", "@namespace", "@page", "@position-try", "@property", "@scope", "@starting-style", "@supports", "@view-transition"].map(t => ({
                    type: "keyword",
                    label: t
                })),
                J = /^(\w[\w-]*|-\w[\w-]*|)$/,
                tt = /^-(-[\w-]*)?$/,
                et = new s.RY,
                it = ["Declaration"];

            function st(t) {
                for (let e = t;;) {
                    if (e.type.isTop) return e;
                    if (!(e = e.parent)) return t
                }
            }

            function nt(t, e, i) {
                if (e.to - e.from > 4096) {
                    let n = et.get(e);
                    if (n) return n;
                    let r = [],
                        o = new Set,
                        l = e.cursor(s.Qj.IncludeAnonymous);
                    if (l.firstChild())
                        do {
                            for (let e of nt(t, l.node, i)) o.has(e.label) || (o.add(e.label), r.push(e))
                        } while (l.nextSibling());
                    return et.set(e, r), r
                } {
                    let s = [],
                        n = new Set;
                    return e.cursor().iterate(e => {
                        var r;
                        if (i(e) && e.matchContext(it) && ":" == (null === (r = e.node.nextSibling) || void 0 === r ? void 0 : r.name)) {
                            let i = t.sliceString(e.from, e.to);
                            n.has(i) || (n.add(i), s.push({
                                label: i,
                                type: "variable"
                            }))
                        }
                    }), s
                }
            }
            const rt = (t => e => {
                    let {
                        state: i,
                        pos: s
                    } = e, n = (0, _.mv)(i).resolveInner(s, -1), r = n.type.isError && n.from == n.to - 1 && "-" == i.doc.sliceString(n.from, n.to);
                    if ("PropertyName" == n.name || (r || "TagName" == n.name) && /^(Block|Styles)$/.test(n.resolve(n.to).name)) return {
                        from: n.from,
                        options: Y(),
                        validFor: J
                    };
                    if ("ValueName" == n.name) return {
                        from: n.from,
                        options: G,
                        validFor: J
                    };
                    if ("PseudoClassName" == n.name) return {
                        from: n.from,
                        options: U,
                        validFor: J
                    };
                    if (t(n) || (e.explicit || r) && function(t, e) {
                            var i;
                            if (("(" == t.name || t.type.isError) && (t = t.parent || t), "ArgList" != t.name) return !1;
                            let s = null === (i = t.parent) || void 0 === i ? void 0 : i.firstChild;
                            return "Callee" == (null == s ? void 0 : s.name) && "var" == e.sliceString(s.from, s.to)
                        }(n, i.doc)) return {
                        from: t(n) || r ? n.from : s,
                        options: nt(i.doc, st(n), t),
                        validFor: tt
                    };
                    if ("TagName" == n.name) {
                        for (let {
                                parent: t
                            } = n; t; t = t.parent)
                            if ("Block" == t.name) return {
                                from: n.from,
                                options: Y(),
                                validFor: J
                            };
                        return {
                            from: n.from,
                            options: K,
                            validFor: J
                        }
                    }
                    if ("AtKeyword" == n.name) return {
                        from: n.from,
                        options: Z,
                        validFor: J
                    };
                    if (!e.explicit) return null;
                    let o = n.resolve(s),
                        l = o.childBefore(s);
                    return l && ":" == l.name && "PseudoClassSelector" == o.name ? {
                        from: s,
                        options: U,
                        validFor: J
                    } : l && ":" == l.name && "Declaration" == o.name || "ArgList" == o.name ? {
                        from: s,
                        options: G,
                        validFor: J
                    } : "Block" == o.name || "Styles" == o.name ? {
                        from: s,
                        options: Y(),
                        validFor: J
                    } : null
                })(t => "VariableName" == t.name),
                ot = _.bj.define({
                    name: "css",
                    parser: H.configure({
                        props: [_.Oh.add({
                            Declaration: (0, _.mz)()
                        }), _.b_.add({
                            "Block KeyframeList": _.yd
                        })]
                    }),
                    languageData: {
                        commentTokens: {
                            block: {
                                open: "/*",
                                close: "*/"
                            }
                        },
                        indentOnInput: /^\s*\}$/,
                        wordChars: "-"
                    }
                });

            function lt() {
                return new _.Yy(ot, ot.data.of({
                    autocomplete: rt
                }))
            }
        },
        748(t, e, i) {
            function s() {
                var t = arguments[0];
                "string" == typeof t && (t = document.createElement(t));
                var e = 1,
                    i = arguments[1];
                if (i && "object" == typeof i && null == i.nodeType && !Array.isArray(i)) {
                    for (var s in i)
                        if (Object.prototype.hasOwnProperty.call(i, s)) {
                            var r = i[s];
                            "string" == typeof r ? t.setAttribute(s, r) : null != r && (t[s] = r)
                        } e++
                }
                for (; e < arguments.length; e++) n(t, arguments[e]);
                return t
            }

            function n(t, e) {
                if ("string" == typeof e) t.appendChild(document.createTextNode(e));
                else if (null == e);
                else if (null != e.nodeType) t.appendChild(e);
                else {
                    if (!Array.isArray(e)) throw new RangeError("Unsupported child node: " + e);
                    for (var i = 0; i < e.length; i++) n(t, e[i])
                }
            }
            i.d(e, {
                A: () => s
            })
        },
        874(t, e, i) {
            i.d(e, {
                BH: () => k,
                EI: () => Q,
                KB: () => P,
                Lv: () => ht,
                Oh: () => D,
                SG: () => At,
                WD: () => z,
                Xt: () => A,
                Yy: () => S,
                Zt: () => bt,
                _v: () => T,
                b_: () => $,
                bj: () => f,
                cr: () => ut,
                f7: () => tt,
                jU: () => Pt,
                mv: () => p,
                mz: () => I,
                tp: () => M,
                y9: () => mt,
                yd: () => W
            });
            var s, n = i(365),
                r = i(638),
                o = i(898),
                l = i(720),
                a = i(417);
            const h = new n.uY;
            const c = new n.uY;
            class u {
                constructor(t, e, i = [], s = "") {
                    this.data = t, this.name = s, r.$t.prototype.hasOwnProperty("tree") || Object.defineProperty(r.$t.prototype, "tree", {
                        get() {
                            return p(this)
                        }
                    }), this.parser = e, this.extension = [k.of(this), r.$t.languageData.of((t, e, i) => {
                        let s = d(t, e, i),
                            n = s.type.prop(h);
                        if (!n) return [];
                        let r = t.facet(n),
                            o = s.type.prop(c);
                        if (o) {
                            let n = s.resolve(e - s.from, i);
                            for (let e of o)
                                if (e.test(n, t)) {
                                    let i = t.facet(e.facet);
                                    return "replace" == e.type ? i : i.concat(r)
                                }
                        }
                        return r
                    })].concat(i)
                }
                isActiveAt(t, e, i = -1) {
                    return d(t, e, i).type.prop(h) == this.data
                }
                findRegions(t) {
                    let e = t.facet(k);
                    if ((null == e ? void 0 : e.data) == this.data) return [{
                        from: 0,
                        to: t.doc.length
                    }];
                    if (!e || !e.allowsNesting) return [];
                    let i = [],
                        s = (t, e) => {
                            if (t.prop(h) == this.data) return void i.push({
                                from: e,
                                to: e + t.length
                            });
                            let r = t.prop(n.uY.mounted);
                            if (r) {
                                if (r.tree.prop(h) == this.data) {
                                    if (r.overlay)
                                        for (let t of r.overlay) i.push({
                                            from: t.from + e,
                                            to: t.to + e
                                        });
                                    else i.push({
                                        from: e,
                                        to: e + t.length
                                    });
                                    return
                                }
                                if (r.overlay) {
                                    let t = i.length;
                                    if (s(r.tree, r.overlay[0].from + e), i.length > t) return
                                }
                            }
                            for (let i = 0; i < t.children.length; i++) {
                                let r = t.children[i];
                                r instanceof n.PH && s(r, t.positions[i] + e)
                            }
                        };
                    return s(p(t), 0), i
                }
                get allowsNesting() {
                    return !0
                }
            }

            function d(t, e, i) {
                let s = t.facet(k),
                    r = p(t).topNode;
                if (!s || s.allowsNesting)
                    for (let t = r; t; t = t.enter(e, i, n.Qj.ExcludeBuffers | n.Qj.EnterBracketed)) t.type.isTop && (r = t);
                return r
            }
            u.setState = r.Pe.define();
            class f extends u {
                constructor(t, e, i) {
                    super(t, e, [], i), this.parser = e
                }
                static define(t) {
                    let e = (i = t.languageData, r.sj.define({
                        combine: i ? t => t.concat(i) : void 0
                    }));
                    var i;
                    return new f(e, t.parser.configure({
                        props: [h.add(t => t.isTop ? e : void 0)]
                    }), t.name)
                }
                configure(t, e) {
                    return new f(this.data, this.parser.configure(t), e || this.name)
                }
                get allowsNesting() {
                    return this.parser.hasWrappers()
                }
            }

            function p(t) {
                let e = t.field(u.state, !1);
                return e ? e.tree : n.PH.empty
            }
            class m {
                constructor(t) {
                    this.doc = t, this.cursorPos = 0, this.string = "", this.cursor = t.iter()
                }
                get length() {
                    return this.doc.length
                }
                syncTo(t) {
                    return this.string = this.cursor.next(t - this.cursorPos).value, this.cursorPos = t + this.string.length, this.cursorPos - this.string.length
                }
                chunk(t) {
                    return this.syncTo(t), this.string
                }
                get lineChunks() {
                    return !0
                }
                read(t, e) {
                    let i = this.cursorPos - this.string.length;
                    return t < i || e >= this.cursorPos ? this.doc.sliceString(t, e) : this.string.slice(t - i, e - i)
                }
            }
            let g = null;
            class v {
                constructor(t, e, i = [], s, n, r, o, l) {
                    this.parser = t, this.state = e, this.fragments = i, this.tree = s, this.treeLen = n, this.viewport = r, this.skipped = o, this.scheduleOn = l, this.parse = null, this.tempSkipped = []
                }
                static create(t, e, i) {
                    return new v(t, e, [], n.PH.empty, 0, i, [], null)
                }
                startParse() {
                    return this.parser.startParse(new m(this.state.doc), this.fragments)
                }
                work(t, e) {
                    return null != e && e >= this.state.doc.length && (e = void 0), this.tree != n.PH.empty && this.isDone(null != e ? e : this.state.doc.length) ? (this.takeTree(), !0) : this.withContext(() => {
                        var i;
                        if ("number" == typeof t) {
                            let e = Date.now() + t;
                            t = () => Date.now() > e
                        }
                        for (this.parse || (this.parse = this.startParse()), null != e && (null == this.parse.stoppedAt || this.parse.stoppedAt > e) && e < this.state.doc.length && this.parse.stopAt(e);;) {
                            let s = this.parse.advance();
                            if (s) {
                                if (this.fragments = this.withoutTempSkipped(n.rr.addTree(s, this.fragments, null != this.parse.stoppedAt)), this.treeLen = null !== (i = this.parse.stoppedAt) && void 0 !== i ? i : this.state.doc.length, this.tree = s, this.parse = null, !(this.treeLen < (null != e ? e : this.state.doc.length))) return !0;
                                this.parse = this.startParse()
                            }
                            if (t()) return !1
                        }
                    })
                }
                takeTree() {
                    let t, e;
                    this.parse && (t = this.parse.parsedPos) >= this.treeLen && ((null == this.parse.stoppedAt || this.parse.stoppedAt > t) && this.parse.stopAt(t), this.withContext(() => {
                        for (; !(e = this.parse.advance()););
                    }), this.treeLen = t, this.tree = e, this.fragments = this.withoutTempSkipped(n.rr.addTree(this.tree, this.fragments, !0)), this.parse = null)
                }
                withContext(t) {
                    let e = g;
                    g = this;
                    try {
                        return t()
                    } finally {
                        g = e
                    }
                }
                withoutTempSkipped(t) {
                    for (let e; e = this.tempSkipped.pop();) t = b(t, e.from, e.to);
                    return t
                }
                changes(t, e) {
                    let {
                        fragments: i,
                        tree: s,
                        treeLen: r,
                        viewport: o,
                        skipped: l
                    } = this;
                    if (this.takeTree(), !t.empty) {
                        let e = [];
                        if (t.iterChangedRanges((t, i, s, n) => e.push({
                                fromA: t,
                                toA: i,
                                fromB: s,
                                toB: n
                            })), i = n.rr.applyChanges(i, e), s = n.PH.empty, r = 0, o = {
                                from: t.mapPos(o.from, -1),
                                to: t.mapPos(o.to, 1)
                            }, this.skipped.length) {
                            l = [];
                            for (let e of this.skipped) {
                                let i = t.mapPos(e.from, 1),
                                    s = t.mapPos(e.to, -1);
                                i < s && l.push({
                                    from: i,
                                    to: s
                                })
                            }
                        }
                    }
                    return new v(this.parser, e, i, s, r, o, l, this.scheduleOn)
                }
                updateViewport(t) {
                    if (this.viewport.from == t.from && this.viewport.to == t.to) return !1;
                    this.viewport = t;
                    let e = this.skipped.length;
                    for (let e = 0; e < this.skipped.length; e++) {
                        let {
                            from: i,
                            to: s
                        } = this.skipped[e];
                        i < t.to && s > t.from && (this.fragments = b(this.fragments, i, s), this.skipped.splice(e--, 1))
                    }
                    return !(this.skipped.length >= e || (this.reset(), 0))
                }
                reset() {
                    this.parse && (this.takeTree(), this.parse = null)
                }
                skipUntilInView(t, e) {
                    this.skipped.push({
                        from: t,
                        to: e
                    })
                }
                static getSkippingParser(t) {
                    return new class extends n.iX {
                        createParse(e, i, s) {
                            let r = s[0].from,
                                o = s[s.length - 1].to;
                            return {
                                parsedPos: r,
                                advance() {
                                    let e = g;
                                    if (e) {
                                        for (let t of s) e.tempSkipped.push(t);
                                        t && (e.scheduleOn = e.scheduleOn ? Promise.all([e.scheduleOn, t]) : t)
                                    }
                                    return this.parsedPos = o, new n.PH(n.Z6.none, [], [], o - r)
                                },
                                stoppedAt: null,
                                stopAt() {}
                            }
                        }
                    }
                }
                isDone(t) {
                    t = Math.min(t, this.state.doc.length);
                    let e = this.fragments;
                    return this.treeLen >= t && e.length && 0 == e[0].from && e[0].to >= t
                }
                static get() {
                    return g
                }
            }

            function b(t, e, i) {
                return n.rr.applyChanges(t, [{
                    fromA: e,
                    toA: i,
                    fromB: e,
                    toB: i
                }])
            }
            class w {
                constructor(t) {
                    this.context = t, this.tree = t.tree
                }
                apply(t) {
                    if (!t.docChanged && this.tree == this.context.tree) return this;
                    let e = this.context.changes(t.changes, t.state),
                        i = this.context.treeLen == t.startState.doc.length ? void 0 : Math.max(t.changes.mapPos(this.context.treeLen), e.viewport.to);
                    return e.work(20, i) || e.takeTree(), new w(e)
                }
                static init(t) {
                    let e = Math.min(3e3, t.doc.length),
                        i = v.create(t.facet(k).parser, t, {
                            from: 0,
                            to: e
                        });
                    return i.work(20, e) || i.takeTree(), new w(i)
                }
            }
            u.state = r.sU.define({
                create: w.init,
                update(t, e) {
                    for (let t of e.effects)
                        if (t.is(u.setState)) return t.value;
                    return e.startState.facet(k) != e.state.facet(k) ? w.init(e.state) : t.apply(e)
                }
            });
            let y = t => {
                let e = setTimeout(() => t(), 500);
                return () => clearTimeout(e)
            };
            "undefined" != typeof requestIdleCallback && (y = t => {
                let e = -1,
                    i = setTimeout(() => {
                        e = requestIdleCallback(t, {
                            timeout: 400
                        })
                    }, 100);
                return () => e < 0 ? clearTimeout(i) : cancelIdleCallback(e)
            });
            const O = "undefined" != typeof navigator && (null === (s = navigator.scheduling) || void 0 === s ? void 0 : s.isInputPending) ? () => navigator.scheduling.isInputPending() : null,
                x = o.Z9.fromClass(class {
                    constructor(t) {
                        this.view = t, this.working = null, this.workScheduled = 0, this.chunkEnd = -1, this.chunkBudget = -1, this.work = this.work.bind(this), this.scheduleWork()
                    }
                    update(t) {
                        let e = this.view.state.field(u.state).context;
                        (e.updateViewport(t.view.viewport) || this.view.viewport.to > e.treeLen) && this.scheduleWork(), (t.docChanged || t.selectionSet) && (this.view.hasFocus && (this.chunkBudget += 50), this.scheduleWork()), this.checkAsyncSchedule(e)
                    }
                    scheduleWork() {
                        if (this.working) return;
                        let {
                            state: t
                        } = this.view, e = t.field(u.state);
                        e.tree == e.context.tree && e.context.isDone(t.doc.length) || (this.working = y(this.work))
                    }
                    work(t) {
                        this.working = null;
                        let e = Date.now();
                        if (this.chunkEnd < e && (this.chunkEnd < 0 || this.view.hasFocus) && (this.chunkEnd = e + 3e4, this.chunkBudget = 3e3), this.chunkBudget <= 0) return;
                        let {
                            state: i,
                            viewport: {
                                to: s
                            }
                        } = this.view, n = i.field(u.state);
                        if (n.tree == n.context.tree && n.context.isDone(s + 1e5)) return;
                        let r = Date.now() + Math.min(this.chunkBudget, 100, t && !O ? Math.max(25, t.timeRemaining() - 5) : 1e9),
                            o = n.context.treeLen < s && i.doc.length > s + 1e3,
                            l = n.context.work(() => O && O() || Date.now() > r, s + (o ? 0 : 1e5));
                        this.chunkBudget -= Date.now() - e, (l || this.chunkBudget <= 0) && (n.context.takeTree(), this.view.dispatch({
                            effects: u.setState.of(new w(n.context))
                        })), this.chunkBudget > 0 && (!l || o) && this.scheduleWork(), this.checkAsyncSchedule(n.context)
                    }
                    checkAsyncSchedule(t) {
                        t.scheduleOn && (this.workScheduled++, t.scheduleOn.then(() => this.scheduleWork()).catch(t => (0, o.c_)(this.view.state, t)).then(() => this.workScheduled--), t.scheduleOn = null)
                    }
                    destroy() {
                        this.working && this.working()
                    }
                    isWorking() {
                        return !!(this.working || this.workScheduled > 0)
                    }
                }, {
                    eventHandlers: {
                        focus() {
                            this.scheduleWork()
                        }
                    }
                }),
                k = r.sj.define({
                    combine: t => t.length ? t[0] : null,
                    enables: t => [u.state, x, o.Lz.contentAttributes.compute([t], e => {
                        let i = e.facet(t);
                        return i && i.name ? {
                            "data-language": i.name
                        } : {}
                    })]
                });
            class S {
                constructor(t, e = []) {
                    this.language = t, this.support = e, this.extension = [t, e]
                }
            }
            const C = r.sj.define(),
                A = r.sj.define({
                    combine: t => {
                        if (!t.length) return "  ";
                        let e = t[0];
                        if (!e || /\S/.test(e) || Array.from(e).some(t => t != e[0])) throw new Error("Invalid indent unit: " + JSON.stringify(t[0]));
                        return e
                    }
                });

            function M(t) {
                let e = t.facet(A);
                return 9 == e.charCodeAt(0) ? t.tabSize * e.length : e.length
            }

            function Q(t, e) {
                let i = "",
                    s = t.tabSize,
                    n = t.facet(A)[0];
                if ("\t" == n) {
                    for (; e >= s;) i += "\t", e -= s;
                    n = " "
                }
                for (let t = 0; t < e; t++) i += n;
                return i
            }

            function T(t, e) {
                t instanceof r.$t && (t = new P(t));
                for (let i of t.state.facet(C)) {
                    let s = i(t, e);
                    if (void 0 !== s) return s
                }
                let i = p(t.state);
                return i.length >= e ? function(t, e, i) {
                    let s = e.resolveStack(i),
                        n = e.resolveInner(i, -1).resolve(i, 0).enterUnfinishedNodesBefore(i);
                    if (n != s.node) {
                        let t = [];
                        for (let e = n; e && !(e.from < s.node.from || e.to > s.node.to || e.from == s.node.from && e.type == s.node.type); e = e.parent) t.push(e);
                        for (let e = t.length - 1; e >= 0; e--) s = {
                            node: t[e],
                            next: s
                        }
                    }
                    return R(s, t, i)
                }(t, i, e) : null
            }
            class P {
                constructor(t, e = {}) {
                    this.state = t, this.options = e, this.unit = M(t)
                }
                lineAt(t, e = 1) {
                    let i = this.state.doc.lineAt(t),
                        {
                            simulateBreak: s,
                            simulateDoubleBreak: n
                        } = this.options;
                    return null != s && s >= i.from && s <= i.to ? n && s == t ? {
                        text: "",
                        from: t
                    } : (e < 0 ? s < t : s <= t) ? {
                        text: i.text.slice(s - i.from),
                        from: s
                    } : {
                        text: i.text.slice(0, s - i.from),
                        from: i.from
                    } : i
                }
                textAfterPos(t, e = 1) {
                    if (this.options.simulateDoubleBreak && t == this.options.simulateBreak) return "";
                    let {
                        text: i,
                        from: s
                    } = this.lineAt(t, e);
                    return i.slice(t - s, Math.min(i.length, t + 100 - s))
                }
                column(t, e = 1) {
                    let {
                        text: i,
                        from: s
                    } = this.lineAt(t, e), n = this.countColumn(i, t - s), r = this.options.overrideIndentation ? this.options.overrideIndentation(s) : -1;
                    return r > -1 && (n += r - this.countColumn(i, i.search(/\S|$/))), n
                }
                countColumn(t, e = t.length) {
                    return (0, r.y$)(t, this.state.tabSize, e)
                }
                lineIndent(t, e = 1) {
                    let {
                        text: i,
                        from: s
                    } = this.lineAt(t, e), n = this.options.overrideIndentation;
                    if (n) {
                        let t = n(s);
                        if (t > -1) return t
                    }
                    return this.countColumn(i, i.search(/\S|$/))
                }
                get simulatedBreak() {
                    return this.options.simulateBreak || null
                }
            }
            const D = new n.uY;

            function R(t, e, i) {
                for (let s = t; s; s = s.next) {
                    let t = E(s.node);
                    if (t) return t(L.create(e, i, s))
                }
                return 0
            }

            function E(t) {
                let e = t.type.prop(D);
                if (e) return e;
                let i, s = t.firstChild;
                if (s && (i = s.type.prop(n.uY.closedBy))) {
                    let e = t.lastChild,
                        s = e && i.indexOf(e.name) > -1;
                    return t => function(t, e, i, s, n) {
                        let r = t.textAfter,
                            o = r.match(/^\s*/)[0].length,
                            l = s && r.slice(o, o + s.length) == s || n == t.pos + o,
                            a = e ? function(t) {
                                let e = t.node,
                                    i = e.childAfter(e.from),
                                    s = e.lastChild;
                                if (!i) return null;
                                let n = t.options.simulateBreak,
                                    r = t.state.doc.lineAt(i.from),
                                    o = null == n || n <= r.from ? r.to : Math.min(r.to, n);
                                for (let t = i.to;;) {
                                    let n = e.childAfter(t);
                                    if (!n || n == s) return null;
                                    if (!n.type.isSkipped) {
                                        if (n.from >= o) return null;
                                        let t = /^ */.exec(r.text.slice(i.to - r.from))[0].length;
                                        return {
                                            from: i.from,
                                            to: i.to + t
                                        }
                                    }
                                    t = n.to
                                }
                            }(t) : null;
                        return a ? l ? t.column(a.from) : t.column(a.to) : t.baseIndent + (l ? 0 : t.unit * i)
                    }(t, !0, 1, void 0, s && ! function(t) {
                        return t.pos == t.options.simulateBreak && t.options.simulateDoubleBreak
                    }(t) ? e.from : void 0)
                }
                return null == t.parent ? B : null
            }

            function B() {
                return 0
            }
            class L extends P {
                constructor(t, e, i) {
                    super(t.state, t.options), this.base = t, this.pos = e, this.context = i
                }
                get node() {
                    return this.context.node
                }
                static create(t, e, i) {
                    return new L(t, e, i)
                }
                get textAfter() {
                    return this.textAfterPos(this.pos)
                }
                get baseIndent() {
                    return this.baseIndentFor(this.node)
                }
                baseIndentFor(t) {
                    let e = this.state.doc.lineAt(t.from);
                    for (;;) {
                        let i = t.resolve(e.from);
                        for (; i.parent && i.parent.from == i.from;) i = i.parent;
                        if (N(i, t)) break;
                        e = this.state.doc.lineAt(i.from)
                    }
                    return this.lineIndent(e.from)
                }
                continue () {
                    return R(this.context.next, this.base, this.pos)
                }
            }

            function N(t, e) {
                for (let i = e; i; i = i.parent)
                    if (t == i) return !0;
                return !1
            }

            function I({
                except: t,
                units: e = 1
            } = {}) {
                return i => {
                    let s = t && t.test(i.textAfter);
                    return i.baseIndent + (s ? 0 : e * i.unit)
                }
            }

            function z() {
                return r.$t.transactionFilter.of(t => {
                    if (!t.docChanged || !t.isUserEvent("input.type") && !t.isUserEvent("input.complete")) return t;
                    let e = t.startState.languageDataAt("indentOnInput", t.startState.selection.main.head);
                    if (!e.length) return t;
                    let i = t.newDoc,
                        {
                            head: s
                        } = t.newSelection.main,
                        n = i.lineAt(s);
                    if (s > n.from + 200) return t;
                    let r = i.sliceString(n.from, s);
                    if (!e.some(t => t.test(r))) return t;
                    let {
                        state: o
                    } = t, l = -1, a = [];
                    for (let {
                            head: t
                        }
                        of o.selection.ranges) {
                        let e = o.doc.lineAt(t);
                        if (e.from == l) continue;
                        l = e.from;
                        let i = T(o, e.from);
                        if (null == i) continue;
                        let s = /^\s*/.exec(e.text)[0],
                            n = Q(o, i);
                        s != n && a.push({
                            from: e.from,
                            to: e.from + s.length,
                            insert: n
                        })
                    }
                    return a.length ? [t, {
                        changes: a,
                        sequential: !0
                    }] : t
                })
            }
            const F = r.sj.define(),
                $ = new n.uY;

            function W(t) {
                let e = t.firstChild,
                    i = t.lastChild;
                return e && e.to < i.from ? {
                    from: e.to,
                    to: i.type.isError ? t.to : i.from
                } : null
            }

            function V(t) {
                let e = t.lastChild;
                return e && e.to == t.to && e.type.isError
            }

            function j(t, e, i) {
                for (let s of t.facet(F)) {
                    let n = s(t, e, i);
                    if (n) return n
                }
                return function(t, e, i) {
                    let s = p(t);
                    if (s.length < i) return null;
                    let n = null;
                    for (let r = s.resolveStack(i, 1); r; r = r.next) {
                        let o = r.node;
                        if (o.to <= i || o.from > i) continue;
                        if (n && o.from < e) break;
                        let l = o.type.prop($);
                        if (l && (o.to < s.length - 50 || s.length == t.doc.length || !V(o))) {
                            let s = l(o, t);
                            s && s.from <= i && s.from >= e && s.to > i && (n = s)
                        }
                    }
                    return n
                }(t, e, i)
            }

            function q(t, e) {
                let i = e.mapPos(t.from, 1),
                    s = e.mapPos(t.to, -1);
                return i >= s ? void 0 : {
                    from: i,
                    to: s
                }
            }
            const H = r.Pe.define({
                    map: q
                }),
                _ = r.Pe.define({
                    map: q
                });

            function X(t) {
                let e = [];
                for (let {
                        head: i
                    }
                    of t.state.selection.ranges) e.some(t => t.from <= i && t.to >= i) || e.push(t.lineBlockAt(i));
                return e
            }
            const Y = r.sU.define({
                create: () => o.NZ.none,
                update(t, e) {
                    e.isUserEvent("delete") && e.changes.iterChangedRanges((e, i) => t = U(t, e, i)), t = t.map(e.changes);
                    for (let i of e.effects)
                        if (i.is(H) && !K(t, i.value.from, i.value.to)) {
                            let {
                                preparePlaceholder: s
                            } = e.state.facet(it), n = s ? o.NZ.replace({
                                widget: new ot(s(e.state, i.value))
                            }) : rt;
                            t = t.update({
                                add: [n.range(i.value.from, i.value.to)]
                            })
                        } else i.is(_) && (t = t.update({
                            filter: (t, e) => i.value.from != t || i.value.to != e,
                            filterFrom: i.value.from,
                            filterTo: i.value.to
                        }));
                    return e.selection && (t = U(t, e.selection.main.head)), t
                },
                provide: t => o.Lz.decorations.from(t),
                toJSON(t, e) {
                    let i = [];
                    return t.between(0, e.doc.length, (t, e) => {
                        i.push(t, e)
                    }), i
                },
                fromJSON(t) {
                    if (!Array.isArray(t) || t.length % 2) throw new RangeError("Invalid JSON for fold state");
                    let e = [];
                    for (let i = 0; i < t.length;) {
                        let s = t[i++],
                            n = t[i++];
                        if ("number" != typeof s || "number" != typeof n) throw new RangeError("Invalid JSON for fold state");
                        e.push(rt.range(s, n))
                    }
                    return o.NZ.set(e, !0)
                }
            });

            function U(t, e, i = e) {
                let s = !1;
                return t.between(e, i, (t, n) => {
                    t < i && n > e && (s = !0)
                }), s ? t.update({
                    filterFrom: e,
                    filterTo: i,
                    filter: (t, s) => t >= i || s <= e
                }) : t
            }

            function G(t, e, i) {
                var s;
                let n = null;
                return null === (s = t.field(Y, !1)) || void 0 === s || s.between(e, i, (t, e) => {
                    (!n || n.from > t) && (n = {
                        from: t,
                        to: e
                    })
                }), n
            }

            function K(t, e, i) {
                let s = !1;
                return t.between(e, e, (t, n) => {
                    t == e && n == i && (s = !0)
                }), s
            }

            function Z(t, e) {
                return t.field(Y, !1) ? e : e.concat(r.Pe.appendConfig.of(st()))
            }

            function J(t, e, i = !0) {
                let s = t.state.doc.lineAt(e.from).number,
                    n = t.state.doc.lineAt(e.to).number;
                return o.Lz.announce.of(`${t.state.phrase(i?"Folded lines":"Unfolded lines")} ${s} ${t.state.phrase("to")} ${n}.`)
            }
            const tt = [{
                    key: "Ctrl-Shift-[",
                    mac: "Cmd-Alt-[",
                    run: t => {
                        for (let e of X(t)) {
                            let i = j(t.state, e.from, e.to);
                            if (i) return t.dispatch({
                                effects: Z(t.state, [H.of(i), J(t, i)])
                            }), !0
                        }
                        return !1
                    }
                }, {
                    key: "Ctrl-Shift-]",
                    mac: "Cmd-Alt-]",
                    run: t => {
                        if (!t.state.field(Y, !1)) return !1;
                        let e = [];
                        for (let i of X(t)) {
                            let s = G(t.state, i.from, i.to);
                            s && e.push(_.of(s), J(t, s, !1))
                        }
                        return e.length && t.dispatch({
                            effects: e
                        }), e.length > 0
                    }
                }, {
                    key: "Ctrl-Alt-[",
                    run: t => {
                        let {
                            state: e
                        } = t, i = [];
                        for (let s = 0; s < e.doc.length;) {
                            let n = t.lineBlockAt(s),
                                r = j(e, n.from, n.to);
                            r && i.push(H.of(r)), s = (r ? t.lineBlockAt(r.to) : n).to + 1
                        }
                        return i.length && t.dispatch({
                            effects: Z(t.state, i)
                        }), !!i.length
                    }
                }, {
                    key: "Ctrl-Alt-]",
                    run: t => {
                        let e = t.state.field(Y, !1);
                        if (!e || !e.size) return !1;
                        let i = [];
                        return e.between(0, t.state.doc.length, (t, e) => {
                            i.push(_.of({
                                from: t,
                                to: e
                            }))
                        }), t.dispatch({
                            effects: i
                        }), !0
                    }
                }],
                et = {
                    placeholderDOM: null,
                    preparePlaceholder: null,
                    placeholderText: "⋯"
                },
                it = r.sj.define({
                    combine: t => (0, r.QR)(t, et)
                });

            function st(t) {
                let e = [Y, ct];
                return t && e.push(it.of(t)), e
            }

            function nt(t, e) {
                let {
                    state: i
                } = t, s = i.facet(it), n = e => {
                    let i = t.lineBlockAt(t.posAtDOM(e.target)),
                        s = G(t.state, i.from, i.to);
                    s && t.dispatch({
                        effects: _.of(s)
                    }), e.preventDefault()
                };
                if (s.placeholderDOM) return s.placeholderDOM(t, n, e);
                let r = document.createElement("span");
                return r.textContent = s.placeholderText, r.setAttribute("aria-label", i.phrase("folded code")), r.title = i.phrase("unfold"), r.className = "css-foldPlaceholder", r.onclick = n, r
            }
            const rt = o.NZ.replace({
                widget: new class extends o.xO {
                    toDOM(t) {
                        return nt(t, null)
                    }
                }
            });
            class ot extends o.xO {
                constructor(t) {
                    super(), this.value = t
                }
                eq(t) {
                    return this.value == t.value
                }
                toDOM(t) {
                    return nt(t, this.value)
                }
            }
            const lt = {
                openText: '<i icon="chevron-down"></i>',
                closedText: '<i icon="chevron-right"></i>',
                markerDOM: null,
                domEventHandlers: {},
                foldingChanged: () => !1
            };
            class at extends o.wJ {
                constructor(t, e) {
                    super(), this.config = t, this.open = e
                }
                eq(t) {
                    return this.config == t.config && this.open == t.open
                }
                toDOM(t) {
                    if (this.config.markerDOM) return this.config.markerDOM(this.open);
                    let e = document.createElement("span");
                    e.innerHTML = this.open ? this.config.openText : this.config.closedText;
                    e.dataset.size = "0.8"; 
                    e.dataset.title = t.state.phrase(this.open ? "fold" : "unfold"); 
                    return e;
                }
            }

            function ht(t = {}) {
                let e = {
                        ...lt,
                        ...t
                    },
                    i = new at(e, !0),
                    s = new at(e, !1),
                    n = o.Z9.fromClass(class {
                        constructor(t) {
                            this.from = t.viewport.from, this.markers = this.buildMarkers(t)
                        }
                        update(t) {
                            (t.docChanged || t.viewportChanged || t.startState.facet(k) != t.state.facet(k) || t.startState.field(Y, !1) != t.state.field(Y, !1) || p(t.startState) != p(t.state) || e.foldingChanged(t)) && (this.markers = this.buildMarkers(t.view))
                        }
                        buildMarkers(t) {
                            let e = new r.vB;
                            for (let n of t.viewportLineBlocks) {
                                let r = G(t.state, n.from, n.to) ? s : j(t.state, n.from, n.to) ? i : null;
                                r && e.add(n.from, n.from, r)
                            }
                            return e.finish()
                        }
                    }),
                    {
                        domEventHandlers: l
                    } = e;
                return [n, (0, o.cU)({
                    class: "css-foldGutter",
                    markers(t) {
                        var e;
                        return (null === (e = t.plugin(n)) || void 0 === e ? void 0 : e.markers) || r.om.empty
                    },
                    initialSpacer: () => new at(e, !1),
                    domEventHandlers: {
                        ...l,
                        click: (t, e, i) => {
                            if (l.click && l.click(t, e, i)) return !0;
                            let s = G(t.state, e.from, e.to);
                            if (s) return t.dispatch({
                                effects: _.of(s)
                            }), !0;
                            let n = j(t.state, e.from, e.to);
                            return !!n && (t.dispatch({
                                effects: H.of(n)
                            }), !0)
                        }
                    }
                }), st()]
            }
            const ct = o.Lz.baseTheme({});
            class ut {
                constructor(t, e) {
                    let i;

                    function s(t) {
                        let e = a.G.newName();
                        return (i || (i = Object.create(null)))["." + e] = t, e
                    }
                    this.specs = t;
                    const n = "string" == typeof e.all ? e.all : e.all ? s(e.all) : void 0,
                        r = e.scope;
                    this.scope = r instanceof u ? t => t.prop(h) == r.data : r ? t => t == r : void 0, this.style = (0, l.az)(t.map(t => ({
                        tag: t.tag,
                        class: t.class || s(Object.assign({}, t, {
                            tag: null
                        }))
                    })), {
                        all: n
                    }).style, this.module = i ? new a.G(i) : null, this.themeType = e.themeType
                }
                static define(t, e) {
                    return new ut(t, e || {})
                }
            }
            const dt = r.sj.define(),
                ft = r.sj.define({
                    combine: t => t.length ? [t[0]] : null
                });

            function pt(t) {
                let e = t.facet(dt);
                return e.length ? e : t.facet(ft)
            }

            function mt(t, e) {
                let i, s = [vt];
                return t instanceof ut && (t.module && s.push(o.Lz.styleModule.of(t.module)), i = t.themeType), (null == e ? void 0 : e.fallback) ? s.push(ft.of(t)) : i ? s.push(dt.computeN([o.Lz.darkTheme], e => e.facet(o.Lz.darkTheme) == ("dark" == i) ? [t] : [])) : s.push(dt.of(t)), s
            }
            class gt {
                constructor(t) {
                    this.markCache = Object.create(null), this.tree = p(t.state), this.decorations = this.buildDeco(t, pt(t.state)), this.decoratedTo = t.viewport.to
                }
                update(t) {
                    let e = p(t.state),
                        i = pt(t.state),
                        s = i != pt(t.startState),
                        {
                            viewport: n
                        } = t.view,
                        r = t.changes.mapPos(this.decoratedTo, 1);
                    e.length < n.to && !s && e.type == this.tree.type && r >= n.to ? (this.decorations = this.decorations.map(t.changes), this.decoratedTo = r) : (e != this.tree || t.viewportChanged || s) && (this.tree = e, this.decorations = this.buildDeco(t.view, i), this.decoratedTo = n.to)
                }
                buildDeco(t, e) {
                    if (!e || !this.tree.length) return o.NZ.none;
                    let i = new r.vB;
                    for (let {
                            from: s,
                            to: n
                        }
                        of t.visibleRanges)(0, l.DM)(this.tree, e, (t, e, s) => {
                        i.add(t, e, this.markCache[s] || (this.markCache[s] = o.NZ.mark({
                            class: s
                        })))
                    }, s, n);
                    return i.finish()
                }
            }
            const vt = r.Nb.high(o.Z9.fromClass(gt, {
                    decorations: t => t.decorations
                })),
                bt = ut.define([{
                    tag: l._A.meta,
                    color: "#404740"
                }, {
                    tag: l._A.link,
                    textDecoration: "underline"
                }, {
                    tag: l._A.heading,
                    textDecoration: "underline",
                    fontWeight: "bold"
                }, {
                    tag: l._A.emphasis,
                    fontStyle: "italic"
                }, {
                    tag: l._A.strong,
                    fontWeight: "bold"
                }, {
                    tag: l._A.strikethrough,
                    textDecoration: "line-through"
                }, {
                    tag: l._A.keyword,
                    color: "#708"
                }, {
                    tag: [l._A.atom, l._A.bool, l._A.url, l._A.contentSeparator, l._A.labelName],
                    color: "#219"
                }, {
                    tag: [l._A.literal, l._A.inserted],
                    color: "#164"
                }, {
                    tag: [l._A.string, l._A.deleted],
                    color: "#a11"
                }, {
                    tag: [l._A.regexp, l._A.escape, l._A.special(l._A.string)],
                    color: "#e40"
                }, {
                    tag: l._A.definition(l._A.variableName),
                    color: "#00f"
                }, {
                    tag: l._A.local(l._A.variableName),
                    color: "#30a"
                }, {
                    tag: [l._A.typeName, l._A.namespace],
                    color: "#085"
                }, {
                    tag: l._A.className,
                    color: "#167"
                }, {
                    tag: [l._A.special(l._A.variableName), l._A.macroName],
                    color: "#256"
                }, {
                    tag: l._A.definition(l._A.propertyName),
                    color: "#00c"
                }, {
                    tag: l._A.comment,
                    color: "#940"
                }, {
                    tag: l._A.invalid,
                    color: "#f00"
                }]),
                wt = o.Lz.baseTheme({

                }),
                yt = "()[]{}",
                Ot = r.sj.define({
                    combine: t => (0, r.QR)(t, {
                        afterCursor: !0,
                        brackets: yt,
                        maxScanDistance: 1e4,
                        renderMatch: St
                    })
                }),
                xt = o.NZ.mark({
                    class: "css-matchingBracket"
                }),
                kt = o.NZ.mark({
                    class: "css-nonmatchingBracket"
                });

            function St(t) {
                let e = [],
                    i = t.matched ? xt : kt;
                return e.push(i.range(t.start.from, t.start.to)), t.end && e.push(i.range(t.end.from, t.end.to)), e
            }
            const Ct = [r.sU.define({
                create: () => o.NZ.none,
                update(t, e) {
                    if (!e.docChanged && !e.selection) return t;
                    let i = [],
                        s = e.state.facet(Ot);
                    for (let t of e.state.selection.ranges) {
                        if (!t.empty) continue;
                        let n = Pt(e.state, t.head, -1, s) || t.head > 0 && Pt(e.state, t.head - 1, 1, s) || s.afterCursor && (Pt(e.state, t.head, 1, s) || t.head < e.state.doc.length && Pt(e.state, t.head + 1, -1, s));
                        n && (i = i.concat(s.renderMatch(n, e.state)))
                    }
                    return o.NZ.set(i, !0)
                },
                provide: t => o.Lz.decorations.from(t)
            }), wt];

            function At(t = {}) {
                return [Ot.of(t), Ct]
            }
            const Mt = new n.uY;

            function Qt(t, e, i) {
                let s = t.prop(e < 0 ? n.uY.openedBy : n.uY.closedBy);
                if (s) return s;
                if (1 == t.name.length) {
                    let s = i.indexOf(t.name);
                    if (s > -1 && s % 2 == (e < 0 ? 1 : 0)) return [i[s + e]]
                }
                return null
            }

            function Tt(t) {
                let e = t.type.prop(Mt);
                return e ? e(t.node) : t
            }

            function Pt(t, e, i, s = {}) {
                let n = s.maxScanDistance || 1e4,
                    r = s.brackets || yt,
                    o = p(t),
                    l = o.resolveInner(e, i);
                for (let t = l; t; t = t.parent) {
                    let s = Qt(t.type, i, r);
                    if (s && t.from < t.to) {
                        let n = Tt(t);
                        if (n && (i > 0 ? e >= n.from && e < n.to : e > n.from && e <= n.to)) return Dt(0, 0, i, t, n, s, r)
                    }
                }
                return function(t, e, i, s, n, r, o) {
                    let l = i < 0 ? t.sliceDoc(e - 1, e) : t.sliceDoc(e, e + 1),
                        a = o.indexOf(l);
                    if (a < 0 || a % 2 == 0 != i > 0) return null;
                    let h = {
                            from: i < 0 ? e - 1 : e,
                            to: i > 0 ? e + 1 : e
                        },
                        c = t.doc.iterRange(e, i > 0 ? t.doc.length : 0),
                        u = 0;
                    for (let t = 0; !c.next().done && t <= r;) {
                        let r = c.value;
                        i < 0 && (t += r.length);
                        let l = e + t * i;
                        for (let t = i > 0 ? 0 : r.length - 1, e = i > 0 ? r.length : -1; t != e; t += i) {
                            let e = o.indexOf(r[t]);
                            if (!(e < 0 || s.resolveInner(l + t, 1).type != n))
                                if (e % 2 == 0 == i > 0) u++;
                                else {
                                    if (1 == u) return {
                                        start: h,
                                        end: {
                                            from: l + t,
                                            to: l + t + 1
                                        },
                                        matched: e >> 1 == a >> 1
                                    };
                                    u--
                                }
                        }
                        i > 0 && (t += r.length)
                    }
                    return c.done ? {
                        start: h,
                        matched: !1
                    } : null
                }(t, e, i, o, l.type, n, r)
            }

            function Dt(t, e, i, s, n, r, o) {
                let l = s.parent,
                    a = {
                        from: n.from,
                        to: n.to
                    },
                    h = 0,
                    c = null == l ? void 0 : l.cursor();
                if (c && (i < 0 ? c.childBefore(s.from) : c.childAfter(s.to)))
                    do {
                        if (i < 0 ? c.to <= s.from : c.from >= s.to) {
                            if (0 == h && r.indexOf(c.type.name) > -1 && c.from < c.to) {
                                let t = Tt(c);
                                return {
                                    start: a,
                                    end: t ? {
                                        from: t.from,
                                        to: t.to
                                    } : void 0,
                                    matched: !0
                                }
                            }
                            if (Qt(c.type, i, o)) h++;
                            else if (Qt(c.type, -i, o)) {
                                if (0 == h) {
                                    let t = Tt(c);
                                    return {
                                        start: a,
                                        end: t && t.from < t.to ? {
                                            from: t.from,
                                            to: t.to
                                        } : void 0,
                                        matched: !1
                                    }
                                }
                                h--
                            }
                        }
                    } while (i < 0 ? c.prevSibling() : c.nextSibling());
                return {
                    start: a,
                    matched: !1
                }
            }
            const Rt = Object.create(null),
                Et = [n.Z6.none],
                Bt = [],
                Lt = Object.create(null),
                Nt = Object.create(null);
            for (let [t, e] of [
                    ["variable", "variableName"],
                    ["variable-2", "variableName.special"],
                    ["string-2", "string.special"],
                    ["def", "variableName.definition"],
                    ["tag", "tagName"],
                    ["attribute", "attributeName"],
                    ["type", "typeName"],
                    ["builtin", "variableName.standard"],
                    ["qualifier", "modifier"],
                    ["error", "invalid"],
                    ["header", "heading"],
                    ["property", "propertyName"]
                ]) Nt[t] = zt(Rt, e);

            function It(t, e) {
                Bt.indexOf(t) > -1 || (Bt.push(t), console.warn(e))
            }

            function zt(t, e) {
                let i = [];
                for (let s of e.split(" ")) {
                    let e = [];
                    for (let i of s.split(".")) {
                        let s = t[i] || l._A[i];
                        s ? "function" == typeof s ? e.length ? e = e.map(s) : It(i, `Modifier ${i} used at start of tag`) : e.length ? It(i, `Tag ${i} used as modifier`) : e = Array.isArray(s) ? s : [s] : It(i, `Unknown highlighting tag ${i}`)
                    }
                    for (let t of e) i.push(t)
                }
                if (!i.length) return 0;
                let s = e.replace(/ /g, "_"),
                    r = s + " " + i.map(t => t.id),
                    o = Lt[r];
                if (o) return o.id;
                let a = Lt[r] = n.Z6.define({
                    id: Et.length,
                    name: s,
                    props: [(0, l.pn)({
                        [s]: i
                    })]
                });
                return Et.push(a), a.id
            }
            o.OP.RTL, o.OP.LTR
        },
        898(t, e, i) {
            i.d(e, {
                NZ: () => D,
                OP: () => ot,
                Lz: () => gs,
                wJ: () => Vn,
                Z9: () => qt,
                xO: () => T,
                HJ: () => pn,
                VH: () => zs,
                A: () => Xs,
                ld: () => En,
                Eg: () => Pn,
                cU: () => Xn,
                dz: () => on,
                Wu: () => dr,
                N$: () => en,
                Ux: () => Tn,
                w4: () => Ss,
                $K: () => ar,
                c_: () => $t,
                D4: () => un,
                TS: () => Ms,
                ui: () => zn,
                S7: () => In,
                DK: () => Sn
            });
            for (var s = i(638), n = i(417), r = {
                    8: "Backspace",
                    9: "Tab",
                    10: "Enter",
                    12: "NumLock",
                    13: "Enter",
                    16: "Shift",
                    17: "Control",
                    18: "Alt",
                    20: "CapsLock",
                    27: "Escape",
                    32: " ",
                    33: "PageUp",
                    34: "PageDown",
                    35: "End",
                    36: "Home",
                    37: "ArrowLeft",
                    38: "ArrowUp",
                    39: "ArrowRight",
                    40: "ArrowDown",
                    44: "PrintScreen",
                    45: "Insert",
                    46: "Delete",
                    59: ";",
                    61: "=",
                    91: "Meta",
                    92: "Meta",
                    106: "*",
                    107: "+",
                    108: ",",
                    109: "-",
                    110: ".",
                    111: "/",
                    144: "NumLock",
                    145: "ScrollLock",
                    160: "Shift",
                    161: "Shift",
                    162: "Control",
                    163: "Control",
                    164: "Alt",
                    165: "Alt",
                    173: "-",
                    186: ";",
                    187: "=",
                    188: ",",
                    189: "-",
                    190: ".",
                    191: "/",
                    192: "`",
                    219: "[",
                    220: "\\",
                    221: "]",
                    222: "'"
                }, o = {
                    48: ")",
                    49: "!",
                    50: "@",
                    51: "#",
                    52: "$",
                    53: "%",
                    54: "^",
                    55: "&",
                    56: "*",
                    57: "(",
                    59: ":",
                    61: "+",
                    173: "_",
                    186: ":",
                    187: "+",
                    188: "<",
                    189: "_",
                    190: ">",
                    191: "?",
                    192: "~",
                    219: "{",
                    220: "|",
                    221: "}",
                    222: '"'
                }, l = "undefined" != typeof navigator && /Mac/.test(navigator.platform), a = "undefined" != typeof navigator && /MSIE \d|Trident\/(?:[7-9]|\d{2,})\..*rv:(\d+)/.exec(navigator.userAgent), h = 0; h < 10; h++) r[48 + h] = r[96 + h] = String(h);
            for (h = 1; h <= 24; h++) r[h + 111] = "F" + h;
            for (h = 65; h <= 90; h++) r[h] = String.fromCharCode(h + 32), o[h] = String.fromCharCode(h);
            for (var c in r) o.hasOwnProperty(c) || (o[c] = r[c]);
            var u = i(748);
            let d = "undefined" != typeof navigator ? navigator : {
                    userAgent: "",
                    vendor: "",
                    platform: ""
                },
                f = "undefined" != typeof document ? document : {
                    documentElement: {
                        style: {}
                    }
                };
            const p = /Edge\/(\d+)/.exec(d.userAgent),
                m = /MSIE \d/.test(d.userAgent),
                g = /Trident\/(?:[7-9]|\d{2,})\..*rv:(\d+)/.exec(d.userAgent),
                v = !!(m || g || p),
                b = !v && /gecko\/(\d+)/i.test(d.userAgent),
                w = !v && /Chrome\/(\d+)/.exec(d.userAgent),
                y = "webkitFontSmoothing" in f.documentElement.style,
                O = !v && /Apple Computer/.test(d.vendor),
                x = O && (/Mobile\/\w+/.test(d.userAgent) || d.maxTouchPoints > 2);
            var k = {
                mac: x || /Mac/.test(d.platform),
                windows: /Win/.test(d.platform),
                linux: /Linux|X11/.test(d.platform),
                ie: v,
                ie_version: m ? f.documentMode || 6 : g ? +g[1] : p ? +p[1] : 0,
                gecko: b,
                gecko_version: b ? +(/Firefox\/(\d+)/.exec(d.userAgent) || [0, 0])[1] : 0,
                chrome: !!w,
                chrome_version: w ? +w[1] : 0,
                ios: x,
                android: /Android\b/.test(d.userAgent),
                webkit: y,
                webkit_version: y ? +(/\bAppleWebKit\/(\d+)/.exec(d.userAgent) || [0, 0])[1] : 0,
                safari: O,
                safari_version: O ? +(/\bVersion\/(\d+(\.\d+)?)/.exec(d.userAgent) || [0, 0])[1] : 0,
                tabSize: null != f.documentElement.style.tabSize ? "tab-size" : "-moz-tab-size"
            };

            function S(t, e) {
                for (let i in t) "class" == i && e.class ? e.class += " " + t.class : "style" == i && e.style ? e.style += ";" + t.style : e[i] = t[i];
                return e
            }
            const C = Object.create(null);

            function A(t, e, i) {
                if (t == e) return !0;
                t || (t = C), e || (e = C);
                let s = Object.keys(t),
                    n = Object.keys(e);
                if (s.length - (i && s.indexOf(i) > -1 ? 1 : 0) != n.length - (i && n.indexOf(i) > -1 ? 1 : 0)) return !1;
                for (let r of s)
                    if (r != i && (-1 == n.indexOf(r) || t[r] !== e[r])) return !1;
                return !0
            }

            function M(t, e, i) {
                let s = !1;
                if (e)
                    for (let n in e) i && n in i || (s = !0, "style" == n ? t.style.cssText = "" : t.removeAttribute(n));
                if (i)
                    for (let n in i) e && e[n] == i[n] || (s = !0, "style" == n ? t.style.cssText = i[n] : t.setAttribute(n, i[n]));
                return s
            }

            function Q(t) {
                let e = Object.create(null);
                for (let i = 0; i < t.attributes.length; i++) {
                    let s = t.attributes[i];
                    e[s.name] = s.value
                }
                return e
            }
            class T {
                eq(t) {
                    return !1
                }
                updateDOM(t, e) {
                    return !1
                }
                compare(t) {
                    return this == t || this.constructor == t.constructor && this.eq(t)
                }
                get estimatedHeight() {
                    return -1
                }
                get lineBreaks() {
                    return 0
                }
                ignoreEvent(t) {
                    return !0
                }
                coordsAt(t, e, i) {
                    return null
                }
                get isHidden() {
                    return !1
                }
                get editable() {
                    return !1
                }
                destroy(t) {}
            }
            var P = function(t) {
                return t[t.Text = 0] = "Text", t[t.WidgetBefore = 1] = "WidgetBefore", t[t.WidgetAfter = 2] = "WidgetAfter", t[t.WidgetRange = 3] = "WidgetRange", t
            }(P || (P = {}));
            class D extends s.FB {
                constructor(t, e, i, s) {
                    super(), this.startSide = t, this.endSide = e, this.widget = i, this.spec = s
                }
                get heightRelevant() {
                    return !1
                }
                static mark(t) {
                    return new R(t)
                }
                static widget(t) {
                    let e = Math.max(-1e4, Math.min(1e4, t.side || 0)),
                        i = !!t.block;
                    return e += i && !t.inlineOrder ? e > 0 ? 3e8 : -4e8 : e > 0 ? 1e8 : -1e8, new B(t, e, e, i, t.widget || null, !1)
                }
                static replace(t) {
                    let e, i, s = !!t.block;
                    if (t.isBlockGap) e = -5e8, i = 4e8;
                    else {
                        let {
                            start: n,
                            end: r
                        } = L(t, s);
                        e = (n ? s ? -3e8 : -1 : 5e8) - 1, i = 1 + (r ? s ? 2e8 : 1 : -6e8)
                    }
                    return new B(t, e, i, s, t.widget || null, !0)
                }
                static line(t) {
                    return new E(t)
                }
                static set(t, e = !1) {
                    return s.om.of(t, e)
                }
                hasHeight() {
                    return !!this.widget && this.widget.estimatedHeight > -1
                }
            }
            D.none = s.om.empty;
            class R extends D {
                constructor(t) {
                    let {
                        start: e,
                        end: i
                    } = L(t);
                    super(e ? -1 : 5e8, i ? 1 : -6e8, null, t), this.tagName = t.tagName || "span", this.attrs = t.class && t.attributes ? S(t.attributes, {
                        class: t.class
                    }) : t.class ? {
                        class: t.class
                    } : t.attributes || C
                }
                eq(t) {
                    return this == t || t instanceof R && this.tagName == t.tagName && A(this.attrs, t.attrs)
                }
                range(t, e = t) {
                    if (t >= e) throw new RangeError("Mark decorations may not be empty");
                    return super.range(t, e)
                }
            }
            R.prototype.point = !1;
            class E extends D {
                constructor(t) {
                    super(-2e8, -2e8, null, t)
                }
                eq(t) {
                    return t instanceof E && this.spec.class == t.spec.class && A(this.spec.attributes, t.spec.attributes)
                }
                range(t, e = t) {
                    if (e != t) throw new RangeError("Line decoration ranges must be zero-length");
                    return super.range(t, e)
                }
            }
            E.prototype.mapMode = s.iR.TrackBefore, E.prototype.point = !0;
            class B extends D {
                constructor(t, e, i, n, r, o) {
                    super(e, i, r, t), this.block = n, this.isReplace = o, this.mapMode = n ? e <= 0 ? s.iR.TrackBefore : s.iR.TrackAfter : s.iR.TrackDel
                }
                get type() {
                    return this.startSide != this.endSide ? P.WidgetRange : this.startSide <= 0 ? P.WidgetBefore : P.WidgetAfter
                }
                get heightRelevant() {
                    return this.block || !!this.widget && (this.widget.estimatedHeight >= 5 || this.widget.lineBreaks > 0)
                }
                eq(t) {
                    return t instanceof B && ((e = this.widget) == (i = t.widget) || !!(e && i && e.compare(i))) && this.block == t.block && this.startSide == t.startSide && this.endSide == t.endSide;
                    var e, i
                }
                range(t, e = t) {
                    if (this.isReplace && (t > e || t == e && this.startSide > 0 && this.endSide <= 0)) throw new RangeError("Invalid range for replacement decoration");
                    if (!this.isReplace && e != t) throw new RangeError("Widget decorations can only have zero-length ranges");
                    return super.range(t, e)
                }
            }

            function L(t, e = !1) {
                let {
                    inclusiveStart: i,
                    inclusiveEnd: s
                } = t;
                return null == i && (i = t.inclusive), null == s && (s = t.inclusive), {
                    start: null != i ? i : e,
                    end: null != s ? s : e
                }
            }

            function N(t, e, i, s = 0) {
                let n = i.length - 1;
                n >= 0 && i[n] + s >= t ? i[n] = Math.max(i[n], e) : i.push(t, e)
            }
            B.prototype.point = !0;
            class I extends s.FB {
                constructor(t, e) {
                    super(), this.tagName = t, this.attributes = e
                }
                eq(t) {
                    return t == this || t instanceof I && this.tagName == t.tagName && A(this.attributes, t.attributes)
                }
                static create(t) {
                    return new I(t.tagName, t.attributes || C)
                }
                static set(t, e = !1) {
                    return s.om.of(t, e)
                }
            }

            function z(t) {
                let e;
                return e = 11 == t.nodeType ? t.getSelection ? t : t.ownerDocument : t, e.getSelection()
            }

            function F(t, e) {
                return !!e && (t == e || t.contains(1 != e.nodeType ? e.parentNode : e))
            }

            function $(t, e) {
                if (!e.anchorNode) return !1;
                try {
                    return F(t, e.anchorNode)
                } catch (t) {
                    return !1
                }
            }

            function W(t) {
                return 3 == t.nodeType ? tt(t, 0, t.nodeValue.length).getClientRects() : 1 == t.nodeType ? t.getClientRects() : []
            }

            function V(t, e, i, s) {
                return !!i && (H(t, e, i, s, -1) || H(t, e, i, s, 1))
            }

            function j(t) {
                for (var e = 0;; e++)
                    if (!(t = t.previousSibling)) return e
            }

            function q(t) {
                return 1 == t.nodeType && /^(DIV|P|LI|UL|OL|BLOCKQUOTE|DD|DT|H\d|SECTION|PRE)$/.test(t.nodeName)
            }

            function H(t, e, i, s, n) {
                for (;;) {
                    if (t == i && e == s) return !0;
                    if (e == (n < 0 ? 0 : _(t))) {
                        if ("DIV" == t.nodeName) return !1;
                        let i = t.parentNode;
                        if (!i || 1 != i.nodeType) return !1;
                        e = j(t) + (n < 0 ? 0 : 1), t = i
                    } else {
                        if (1 != t.nodeType) return !1;
                        if (1 == (t = t.childNodes[e + (n < 0 ? -1 : 0)]).nodeType && "false" == t.contentEditable) return !1;
                        e = n < 0 ? _(t) : 0
                    }
                }
            }

            function _(t) {
                return 3 == t.nodeType ? t.nodeValue.length : t.childNodes.length
            }

            function X(t, e) {
                let i = e ? t.left : t.right;
                return {
                    left: i,
                    right: i,
                    top: t.top,
                    bottom: t.bottom
                }
            }

            function Y(t) {
                let e = t.visualViewport;
                return e ? {
                    left: 0,
                    right: e.width,
                    top: 0,
                    bottom: e.height
                } : {
                    left: 0,
                    right: t.innerWidth,
                    top: 0,
                    bottom: t.innerHeight
                }
            }

            function U(t, e) {
                let i = e.width / t.offsetWidth,
                    s = e.height / t.offsetHeight;
                return (i > .995 && i < 1.005 || !isFinite(i) || Math.abs(e.width - t.offsetWidth) < 1) && (i = 1), (s > .995 && s < 1.005 || !isFinite(s) || Math.abs(e.height - t.offsetHeight) < 1) && (s = 1), {
                    scaleX: i,
                    scaleY: s
                }
            }
            I.prototype.startSide = I.prototype.endSide = -1;
            class G {
                constructor() {
                    this.anchorNode = null, this.anchorOffset = 0, this.focusNode = null, this.focusOffset = 0
                }
                eq(t) {
                    return this.anchorNode == t.anchorNode && this.anchorOffset == t.anchorOffset && this.focusNode == t.focusNode && this.focusOffset == t.focusOffset
                }
                setRange(t) {
                    let {
                        anchorNode: e,
                        focusNode: i
                    } = t;
                    this.set(e, Math.min(t.anchorOffset, e ? _(e) : 0), i, Math.min(t.focusOffset, i ? _(i) : 0))
                }
                set(t, e, i, s) {
                    this.anchorNode = t, this.anchorOffset = e, this.focusNode = i, this.focusOffset = s
                }
            }
            let K, Z = null;

            function J(t) {
                if (t.setActive) return t.setActive();
                if (Z) return t.focus(Z);
                let e = [];
                for (let i = t; i && (e.push(i, i.scrollTop, i.scrollLeft), i != i.ownerDocument); i = i.parentNode);
                if (t.focus(null == Z ? {
                        get preventScroll() {
                            return Z = {
                                preventScroll: !0
                            }, !0
                        }
                    } : void 0), !Z) {
                    Z = !1;
                    for (let t = 0; t < e.length;) {
                        let i = e[t++],
                            s = e[t++],
                            n = e[t++];
                        i.scrollTop != s && (i.scrollTop = s), i.scrollLeft != n && (i.scrollLeft = n)
                    }
                }
            }

            function tt(t, e, i = e) {
                let s = K || (K = document.createRange());
                return s.setEnd(t, i), s.setStart(t, e), s
            }

            function et(t, e, i, s) {
                let n = {
                    key: e,
                    code: e,
                    keyCode: i,
                    which: i,
                    cancelable: !0
                };
                s && ({
                    altKey: n.altKey,
                    ctrlKey: n.ctrlKey,
                    shiftKey: n.shiftKey,
                    metaKey: n.metaKey
                } = s);
                let r = new KeyboardEvent("keydown", n);
                r.synthetic = !0, t.dispatchEvent(r);
                let o = new KeyboardEvent("keyup", n);
                return o.synthetic = !0, t.dispatchEvent(o), r.defaultPrevented || o.defaultPrevented
            }

            function it(t) {
                return t.scrollTop > Math.max(1, t.scrollHeight - t.clientHeight - 4)
            }

            function st(t, e) {
                for (let i = t, s = e;;) {
                    if (3 == i.nodeType && s > 0) return {
                        node: i,
                        offset: s
                    };
                    if (1 == i.nodeType && s > 0) {
                        if ("false" == i.contentEditable) return null;
                        i = i.childNodes[s - 1], s = _(i)
                    } else {
                        if (!i.parentNode || q(i)) return null;
                        s = j(i), i = i.parentNode
                    }
                }
            }

            function nt(t, e) {
                for (let i = t, s = e;;) {
                    if (3 == i.nodeType && s < i.nodeValue.length) return {
                        node: i,
                        offset: s
                    };
                    if (1 == i.nodeType && s < i.childNodes.length) {
                        if ("false" == i.contentEditable) return null;
                        i = i.childNodes[s], s = 0
                    } else {
                        if (!i.parentNode || q(i)) return null;
                        s = j(i) + 1, i = i.parentNode
                    }
                }
            }
            k.safari && k.safari_version >= 26 && (Z = !1);
            class rt {
                constructor(t, e, i = !0) {
                    this.node = t, this.offset = e, this.precise = i
                }
                static before(t, e) {
                    return new rt(t.parentNode, j(t), e)
                }
                static after(t, e) {
                    return new rt(t.parentNode, j(t) + 1, e)
                }
            }
            var ot = function(t) {
                return t[t.LTR = 0] = "LTR", t[t.RTL = 1] = "RTL", t
            }(ot || (ot = {}));
            const lt = ot.LTR,
                at = ot.RTL;

            function ht(t) {
                let e = [];
                for (let i = 0; i < t.length; i++) e.push(1 << +t[i]);
                return e
            }
            const ct = ht("88888888888888888888888888888888888666888888787833333333337888888000000000000000000000000008888880000000000000000000000000088888888888888888888888888888888888887866668888088888663380888308888800000000000000000000000800000000000000000000000000000008"),
                ut = ht("4444448826627288999999999992222222222222222222222222222222222222222222222229999999999999999999994444444444644222822222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222999999949999999229989999223333333333"),
                dt = Object.create(null),
                ft = [];
            for (let t of ["()", "[]", "{}"]) {
                let e = t.charCodeAt(0),
                    i = t.charCodeAt(1);
                dt[e] = i, dt[i] = -e
            }

            function pt(t) {
                return t <= 247 ? ct[t] : 1424 <= t && t <= 1524 ? 2 : 1536 <= t && t <= 1785 ? ut[t - 1536] : 1774 <= t && t <= 2220 ? 4 : 8192 <= t && t <= 8204 ? 256 : 64336 <= t && t <= 65023 ? 4 : 1
            }
            const mt = /[\u0590-\u05f4\u0600-\u06ff\u0700-\u08ac\ufb50-\ufdff]/;
            class gt {
                get dir() {
                    return this.level % 2 ? at : lt
                }
                constructor(t, e, i) {
                    this.from = t, this.to = e, this.level = i
                }
                side(t, e) {
                    return this.dir == e == t ? this.to : this.from
                }
                forward(t, e) {
                    return t == (this.dir == e)
                }
                static find(t, e, i, s) {
                    let n = -1;
                    for (let r = 0; r < t.length; r++) {
                        let o = t[r];
                        if (o.from <= e && o.to >= e) {
                            if (o.level == i) return r;
                            (n < 0 || (0 != s ? s < 0 ? o.from < e : o.to > e : t[n].level > o.level)) && (n = r)
                        }
                    }
                    if (n < 0) throw new RangeError("Index out of range");
                    return n
                }
            }

            function vt(t, e) {
                if (t.length != e.length) return !1;
                for (let i = 0; i < t.length; i++) {
                    let s = t[i],
                        n = e[i];
                    if (s.from != n.from || s.to != n.to || s.direction != n.direction || !vt(s.inner, n.inner)) return !1
                }
                return !0
            }
            const bt = [];

            function wt(t, e, i, s, n, r, o) {
                let l = s % 2 ? 2 : 1;
                if (s % 2 == n % 2)
                    for (let a = e, h = 0; a < i;) {
                        let e = !0,
                            c = !1;
                        if (h == r.length || a < r[h].from) {
                            let t = bt[a];
                            t != l && (e = !1, c = 16 == t)
                        }
                        let u = e || 1 != l ? null : [],
                            d = e ? s : s + 1,
                            f = a;
                        t: for (;;)
                            if (h < r.length && f == r[h].from) {
                                if (c) break t;
                                let p = r[h];
                                if (!e)
                                    for (let t = p.to, e = h + 1;;) {
                                        if (t == i) break t;
                                        if (!(e < r.length && r[e].from == t)) {
                                            if (bt[t] == l) break t;
                                            break
                                        }
                                        t = r[e++].to
                                    }
                                h++, u ? u.push(p) : (p.from > a && o.push(new gt(a, p.from, d)), yt(t, p.direction == lt != !(d % 2) ? s + 1 : s, n, p.inner, p.from, p.to, o), a = p.to), f = p.to
                            } else {
                                if (f == i || (e ? bt[f] != l : bt[f] == l)) break;
                                f++
                            } u ? wt(t, a, f, s + 1, n, u, o) : a < f && o.push(new gt(a, f, d)), a = f
                    } else
                        for (let a = i, h = r.length; a > e;) {
                            let i = !0,
                                c = !1;
                            if (!h || a > r[h - 1].to) {
                                let t = bt[a - 1];
                                t != l && (i = !1, c = 16 == t)
                            }
                            let u = i || 1 != l ? null : [],
                                d = i ? s : s + 1,
                                f = a;
                            t: for (;;)
                                if (h && f == r[h - 1].to) {
                                    if (c) break t;
                                    let p = r[--h];
                                    if (!i)
                                        for (let t = p.from, i = h;;) {
                                            if (t == e) break t;
                                            if (!i || r[i - 1].to != t) {
                                                if (bt[t - 1] == l) break t;
                                                break
                                            }
                                            t = r[--i].from
                                        }
                                    u ? u.push(p) : (p.to < a && o.push(new gt(p.to, a, d)), yt(t, p.direction == lt != !(d % 2) ? s + 1 : s, n, p.inner, p.from, p.to, o), a = p.from), f = p.from
                                } else {
                                    if (f == e || (i ? bt[f - 1] != l : bt[f - 1] == l)) break;
                                    f--
                                } u ? wt(t, f, a, s + 1, n, u, o) : f < a && o.push(new gt(f, a, d)), a = f
                        }
            }

            function yt(t, e, i, s, n, r, o) {
                let l = e % 2 ? 2 : 1;
                ! function(t, e, i, s, n) {
                    for (let r = 0; r <= s.length; r++) {
                        let o = r ? s[r - 1].to : e,
                            l = r < s.length ? s[r].from : i,
                            a = r ? 256 : n;
                        for (let e = o, i = a, s = a; e < l; e++) {
                            let n = pt(t.charCodeAt(e));
                            512 == n ? n = i : 8 == n && 4 == s && (n = 16), bt[e] = 4 == n ? 2 : n, 7 & n && (s = n), i = n
                        }
                        for (let t = o, e = a, s = a; t < l; t++) {
                            let n = bt[t];
                            if (128 == n) t < l - 1 && e == bt[t + 1] && 24 & e ? n = bt[t] = e : bt[t] = 256;
                            else if (64 == n) {
                                let n = t + 1;
                                for (; n < l && 64 == bt[n];) n++;
                                let r = t && 8 == e || n < i && 8 == bt[n] ? 1 == s ? 1 : 8 : 256;
                                for (let e = t; e < n; e++) bt[e] = r;
                                t = n - 1
                            } else 8 == n && 1 == s && (bt[t] = 1);
                            e = n, 7 & n && (s = n)
                        }
                    }
                }(t, n, r, s, l),
                function(t, e, i, s, n) {
                    let r = 1 == n ? 2 : 1;
                    for (let o = 0, l = 0, a = 0; o <= s.length; o++) {
                        let h = o ? s[o - 1].to : e,
                            c = o < s.length ? s[o].from : i;
                        for (let e, i, s, o = h; o < c; o++)
                            if (i = dt[e = t.charCodeAt(o)])
                                if (i < 0) {
                                    for (let t = l - 3; t >= 0; t -= 3)
                                        if (ft[t + 1] == -i) {
                                            let e = ft[t + 2],
                                                i = 2 & e ? n : 4 & e ? 1 & e ? r : n : 0;
                                            i && (bt[o] = bt[ft[t]] = i), l = t;
                                            break
                                        }
                                } else {
                                    if (189 == ft.length) break;
                                    ft[l++] = o, ft[l++] = e, ft[l++] = a
                                }
                        else if (2 == (s = bt[o]) || 1 == s) {
                            let t = s == n;
                            a = t ? 0 : 1;
                            for (let e = l - 3; e >= 0; e -= 3) {
                                let i = ft[e + 2];
                                if (2 & i) break;
                                if (t) ft[e + 2] |= 2;
                                else {
                                    if (4 & i) break;
                                    ft[e + 2] |= 4
                                }
                            }
                        }
                    }
                }(t, n, r, s, l),
                function(t, e, i, s) {
                    for (let n = 0, r = s; n <= i.length; n++) {
                        let o = n ? i[n - 1].to : t,
                            l = n < i.length ? i[n].from : e;
                        for (let a = o; a < l;) {
                            let o = bt[a];
                            if (256 == o) {
                                let o = a + 1;
                                for (;;)
                                    if (o == l) {
                                        if (n == i.length) break;
                                        o = i[n++].to, l = n < i.length ? i[n].from : e
                                    } else {
                                        if (256 != bt[o]) break;
                                        o++
                                    } let h = 1 == r,
                                    c = h == (1 == (o < e ? bt[o] : s)) ? h ? 1 : 2 : s;
                                for (let e = o, s = n, r = s ? i[s - 1].to : t; e > a;) e == r && (e = i[--s].from, r = s ? i[s - 1].to : t), bt[--e] = c;
                                a = o
                            } else r = o, a++
                        }
                    }
                }(n, r, s, l), wt(t, n, r, e, i, s, o)
            }

            function Ot(t) {
                return [new gt(0, t, 0)]
            }
            let xt = "";

            function kt(t, e, i, n, r) {
                var o;
                let l = n.head - t.from,
                    a = gt.find(e, l, null !== (o = n.bidiLevel) && void 0 !== o ? o : -1, n.assoc),
                    h = e[a],
                    c = h.side(r, i);
                if (l == c) {
                    let t = a += r ? 1 : -1;
                    if (t < 0 || t >= e.length) return null;
                    h = e[a = t], l = h.side(!r, i), c = h.side(r, i)
                }
                let u = (0, s.zK)(t.text, l, h.forward(r, i));
                (u < h.from || u > h.to) && (u = c), xt = t.text.slice(Math.min(l, u), Math.max(l, u));
                let d = a == (r ? e.length - 1 : 0) ? null : e[a + (r ? 1 : -1)];
                return d && u == c && d.level + (r ? 0 : 1) < h.level ? s.OF.cursor(d.side(!r, i) + t.from, d.forward(r, i) ? 1 : -1, d.level) : s.OF.cursor(u + t.from, h.forward(r, i) ? -1 : 1, h.level)
            }

            function St(t, e, i) {
                for (let s = e; s < i; s++) {
                    let e = pt(t.charCodeAt(s));
                    if (1 == e) return lt;
                    if (2 == e || 4 == e) return at
                }
                return lt
            }
            const Ct = s.sj.define(),
                At = s.sj.define(),
                Mt = s.sj.define(),
                Qt = s.sj.define(),
                Tt = s.sj.define(),
                Pt = s.sj.define(),
                Dt = s.sj.define(),
                Rt = s.sj.define(),
                Et = s.sj.define(),
                Bt = s.sj.define({
                    combine: t => t.some(t => t)
                }),
                Lt = s.sj.define({
                    combine: t => t.some(t => t)
                }),
                Nt = s.sj.define();
            class It {
                constructor(t, e = "nearest", i = "nearest", s = 5, n = 5, r = !1) {
                    this.range = t, this.y = e, this.x = i, this.yMargin = s, this.xMargin = n, this.isSnapshot = r
                }
                map(t) {
                    return t.empty ? this : new It(this.range.map(t), this.y, this.x, this.yMargin, this.xMargin, this.isSnapshot)
                }
                clip(t) {
                    return this.range.to <= t.doc.length ? this : new It(s.OF.cursor(t.doc.length), this.y, this.x, this.yMargin, this.xMargin, this.isSnapshot)
                }
            }
            const zt = s.Pe.define({
                    map: (t, e) => t.map(e)
                }),
                Ft = s.Pe.define();

            function $t(t, e, i) {
                let s = t.facet(Qt);
                s.length ? s[0](e) : window.onerror && window.onerror(String(e), i, void 0, void 0, e) || (i ? console.error(i + ":", e) : console.error(e))
            }
            const Wt = s.sj.define({
                combine: t => !t.length || t[0]
            });
            let Vt = 0;
            const jt = s.sj.define({
                combine: t => t.filter((e, i) => {
                    for (let s = 0; s < i; s++)
                        if (t[s].plugin == e.plugin) return !1;
                    return !0
                })
            });
            class qt {
                constructor(t, e, i, s, n) {
                    this.id = t, this.create = e, this.domEventHandlers = i, this.domEventObservers = s, this.baseExtensions = n(this), this.extension = this.baseExtensions.concat(jt.of({
                        plugin: this,
                        arg: void 0
                    }))
                }
                of(t) {
                    return this.baseExtensions.concat(jt.of({
                        plugin: this,
                        arg: t
                    }))
                }
                static define(t, e) {
                    const {
                        eventHandlers: i,
                        eventObservers: s,
                        provide: n,
                        decorations: r
                    } = e || {};
                    return new qt(Vt++, t, i, s, t => {
                        let e = [];
                        return r && e.push(Yt.of(e => {
                            let i = e.plugin(t);
                            return i ? r(i) : D.none
                        })), n && e.push(n(t)), e
                    })
                }
                static fromClass(t, e) {
                    return qt.define((e, i) => new t(e, i), e)
                }
            }
            class Ht {
                constructor(t) {
                    this.spec = t, this.mustUpdate = null, this.value = null
                }
                get plugin() {
                    return this.spec && this.spec.plugin
                }
                update(t) {
                    if (this.value) {
                        if (this.mustUpdate) {
                            let t = this.mustUpdate;
                            if (this.mustUpdate = null, this.value.update) try {
                                this.value.update(t)
                            } catch (e) {
                                if ($t(t.state, e, "CodeMirror plugin crashed"), this.value.destroy) try {
                                    this.value.destroy()
                                } catch (t) {}
                                this.deactivate()
                            }
                        }
                    } else if (this.spec) try {
                        this.value = this.spec.plugin.create(t, this.spec.arg)
                    } catch (e) {
                        $t(t.state, e, "CodeMirror plugin crashed"), this.deactivate()
                    }
                    return this
                }
                destroy(t) {
                    var e;
                    if (null === (e = this.value) || void 0 === e ? void 0 : e.destroy) try {
                        this.value.destroy()
                    } catch (e) {
                        $t(t.state, e, "CodeMirror plugin crashed")
                    }
                }
                deactivate() {
                    this.spec = this.value = null
                }
            }
            const _t = s.sj.define(),
                Xt = s.sj.define(),
                Yt = s.sj.define(),
                Ut = s.sj.define(),
                Gt = s.sj.define(),
                Kt = s.sj.define(),
                Zt = s.sj.define();

            function Jt(t, e) {
                let i = t.state.facet(Zt);
                if (!i.length) return i;
                let n = i.map(e => e instanceof Function ? e(t) : e),
                    r = [];
                return s.om.spans(n, e.from, e.to, {
                    point() {},
                    span(t, i, s, n) {
                        let o = t - e.from,
                            l = i - e.from,
                            a = r;
                        for (let t = s.length - 1; t >= 0; t--, n--) {
                            let i, r = s[t].spec.bidiIsolate;
                            if (null == r && (r = St(e.text, o, l)), n > 0 && a.length && (i = a[a.length - 1]).to == o && i.direction == r) i.to = l, a = i.inner;
                            else {
                                let t = {
                                    from: o,
                                    to: l,
                                    direction: r,
                                    inner: []
                                };
                                a.push(t), a = t.inner
                            }
                        }
                    }
                }), r
            }
            const te = s.sj.define();

            function ee(t) {
                let e = 0,
                    i = 0,
                    s = 0,
                    n = 0;
                for (let r of t.state.facet(te)) {
                    let o = r(t);
                    o && (null != o.left && (e = Math.max(e, o.left)), null != o.right && (i = Math.max(i, o.right)), null != o.top && (s = Math.max(s, o.top)), null != o.bottom && (n = Math.max(n, o.bottom)))
                }
                return {
                    left: e,
                    right: i,
                    top: s,
                    bottom: n
                }
            }
            const ie = s.sj.define();
            class se {
                constructor(t, e, i, s) {
                    this.fromA = t, this.toA = e, this.fromB = i, this.toB = s
                }
                join(t) {
                    return new se(Math.min(this.fromA, t.fromA), Math.max(this.toA, t.toA), Math.min(this.fromB, t.fromB), Math.max(this.toB, t.toB))
                }
                addToSet(t) {
                    let e = t.length,
                        i = this;
                    for (; e > 0; e--) {
                        let s = t[e - 1];
                        if (!(s.fromA > i.toA)) {
                            if (s.toA < i.fromA) break;
                            i = i.join(s), t.splice(e - 1, 1)
                        }
                    }
                    return t.splice(e, 0, i), t
                }
                static extendWithRanges(t, e) {
                    if (0 == e.length) return t;
                    let i = [];
                    for (let s = 0, n = 0, r = 0;;) {
                        let o = s < t.length ? t[s].fromB : 1e9,
                            l = n < e.length ? e[n] : 1e9,
                            a = Math.min(o, l);
                        if (1e9 == a) break;
                        let h = a + r,
                            c = a,
                            u = h;
                        for (;;)
                            if (n < e.length && e[n] <= c) {
                                let i = e[n + 1];
                                n += 2, c = Math.max(c, i);
                                for (let e = s; e < t.length && t[e].fromB <= c; e++) r = t[e].toA - t[e].toB;
                                u = Math.max(u, i + r)
                            } else {
                                if (!(s < t.length && t[s].fromB <= c)) break;
                                {
                                    let e = t[s++];
                                    c = Math.max(c, e.toB), u = Math.max(u, e.toA), r = e.toA - e.toB
                                }
                            } i.push(new se(h, u, a, c))
                    }
                    return i
                }
            }
            class ne {
                constructor(t, e, i) {
                    this.view = t, this.state = e, this.transactions = i, this.flags = 0, this.startState = t.state, this.changes = s.VR.empty(this.startState.doc.length);
                    for (let t of i) this.changes = this.changes.compose(t.changes);
                    let n = [];
                    this.changes.iterChangedRanges((t, e, i, s) => n.push(new se(t, e, i, s))), this.changedRanges = n
                }
                static create(t, e, i) {
                    return new ne(t, e, i)
                }
                get viewportChanged() {
                    return (4 & this.flags) > 0
                }
                get viewportMoved() {
                    return (8 & this.flags) > 0
                }
                get heightChanged() {
                    return (2 & this.flags) > 0
                }
                get geometryChanged() {
                    return this.docChanged || (18 & this.flags) > 0
                }
                get focusChanged() {
                    return (1 & this.flags) > 0
                }
                get docChanged() {
                    return !this.changes.empty
                }
                get selectionSet() {
                    return this.transactions.some(t => t.selection)
                }
                get empty() {
                    return 0 == this.flags && 0 == this.transactions.length
                }
            }
            const re = [];
            class oe {
                constructor(t, e, i = 0) {
                    this.dom = t, this.length = e, this.flags = i, this.parent = null, t.cmTile = this
                }
                get breakAfter() {
                    return 1 & this.flags
                }
                get children() {
                    return re
                }
                isWidget() {
                    return !1
                }
                get isHidden() {
                    return !1
                }
                isComposite() {
                    return !1
                }
                isLine() {
                    return !1
                }
                isText() {
                    return !1
                }
                isBlock() {
                    return !1
                }
                get domAttrs() {
                    return null
                }
                sync(t) {
                    if (this.flags |= 2, 4 & this.flags) {
                        this.flags &= -5;
                        let t = this.domAttrs;
                        t && function(t, e) {
                            for (let i = t.attributes.length - 1; i >= 0; i--) {
                                let s = t.attributes[i].name;
                                null == e[s] && t.removeAttribute(s)
                            }
                            for (let i in e) {
                                let s = e[i];
                                "style" == i ? t.style.cssText = s : t.getAttribute(i) != s && t.setAttribute(i, s)
                            }
                        }(this.dom, t)
                    }
                }
                toString() {
                    return this.constructor.name + (this.children.length ? `(${this.children})` : "") + (this.breakAfter ? "#" : "")
                }
                destroy() {
                    this.parent = null
                }
                setDOM(t) {
                    this.dom = t, t.cmTile = this
                }
                get posAtStart() {
                    return this.parent ? this.parent.posBefore(this) : 0
                }
                get posAtEnd() {
                    return this.posAtStart + this.length
                }
                posBefore(t, e = this.posAtStart) {
                    let i = e;
                    for (let e of this.children) {
                        if (e == t) return i;
                        i += e.length + e.breakAfter
                    }
                    throw new RangeError("Invalid child in posBefore")
                }
                posAfter(t) {
                    return this.posBefore(t) + t.length
                }
                covers(t) {
                    return !0
                }
                coordsIn(t, e) {
                    return null
                }
                domPosFor(t, e) {
                    let i = j(this.dom),
                        s = this.length ? t > 0 : e > 0;
                    return new rt(this.parent.dom, i + (s ? 1 : 0), 0 == t || t == this.length)
                }
                markDirty(t) {
                    this.flags &= -3, t && (this.flags |= 4), this.parent && 2 & this.parent.flags && this.parent.markDirty(!1)
                }
                get overrideDOMText() {
                    return null
                }
                get root() {
                    for (let t = this; t; t = t.parent)
                        if (t instanceof he) return t;
                    return null
                }
                static get(t) {
                    return t.cmTile
                }
            }
            class le extends oe {
                constructor(t) {
                    super(t, 0), this._children = []
                }
                isComposite() {
                    return !0
                }
                get children() {
                    return this._children
                }
                get lastChild() {
                    return this.children.length ? this.children[this.children.length - 1] : null
                }
                append(t) {
                    this.children.push(t), t.parent = this
                }
                sync(t) {
                    if (2 & this.flags) return;
                    super.sync(t);
                    let e, i = this.dom,
                        s = null,
                        n = (null == t ? void 0 : t.node) == i ? t : null,
                        r = 0;
                    for (let o of this.children) {
                        if (o.sync(t), r += o.length + o.breakAfter, e = s ? s.nextSibling : i.firstChild, n && e != o.dom && (n.written = !0), o.dom.parentNode == i)
                            for (; e && e != o.dom;) e = ae(e);
                        else i.insertBefore(o.dom, e);
                        s = o.dom
                    }
                    for (e = s ? s.nextSibling : i.firstChild, n && e && (n.written = !0); e;) e = ae(e);
                    this.length = r
                }
            }

            function ae(t) {
                let e = t.nextSibling;
                return t.parentNode.removeChild(t), e
            }
            class he extends le {
                constructor(t, e) {
                    super(e), this.view = t
                }
                owns(t) {
                    for (; t; t = t.parent)
                        if (t == this) return !0;
                    return !1
                }
                isBlock() {
                    return !0
                }
                nearest(t) {
                    for (;;) {
                        if (!t) return null;
                        let e = oe.get(t);
                        if (e && this.owns(e)) return e;
                        t = t.parentNode
                    }
                }
                blockTiles(t) {
                    for (let e = [], i = this, s = 0, n = 0;;)
                        if (s == i.children.length) {
                            if (!e.length) return;
                            i = i.parent, i.breakAfter && n++, s = e.pop()
                        } else {
                            let r = i.children[s++];
                            if (r instanceof ce) e.push(s), i = r, s = 0;
                            else {
                                let e = n + r.length,
                                    i = t(r, n);
                                if (void 0 !== i) return i;
                                n = e + r.breakAfter
                            }
                        }
                }
                resolveBlock(t, e) {
                    let i, s, n = -1,
                        r = -1;
                    if (this.blockTiles((o, l) => {
                            let a = l + o.length;
                            if (t >= l && t <= a) {
                                if (o.isWidget() && e >= -1 && e <= 1) {
                                    if (32 & o.flags) return !0;
                                    16 & o.flags && (i = void 0)
                                }(l < t || t == a && (e < -1 ? o.length : o.covers(1))) && (!i || !o.isWidget() && i.isWidget()) && (i = o, n = t - l), (a > t || t == l && (e > 1 ? o.length : o.covers(-1))) && (!s || !o.isWidget() && s.isWidget()) && (s = o, r = t - l)
                            }
                        }), !i && !s) throw new Error("No tile at position " + t);
                    return i && e < 0 || !s ? {
                        tile: i,
                        offset: n
                    } : {
                        tile: s,
                        offset: r
                    }
                }
            }
            class ce extends le {
                constructor(t, e) {
                    super(t), this.wrapper = e
                }
                isBlock() {
                    return !0
                }
                covers(t) {
                    return !!this.children.length && (t < 0 ? this.children[0].covers(-1) : this.lastChild.covers(1))
                }
                get domAttrs() {
                    return this.wrapper.attributes
                }
                static of (t, e) {
                    let i = new ce(e || document.createElement(t.tagName), t);
                    return e || (i.flags |= 4), i
                }
            }
            class ue extends le {
                constructor(t, e) {
                    super(t), this.attrs = e
                }
                isLine() {
                    return !0
                }
                static start(t, e, i) {
                    let s = new ue(e || document.createElement("div"), t);
                    return e && i || (s.flags |= 4), s
                }
                get domAttrs() {
                    return this.attrs
                }
                resolveInline(t, e, i) {
                    let s = null,
                        n = -1,
                        r = null,
                        o = -1;
                    ! function t(l, a) {
                        for (let h = 0, c = 0; h < l.children.length && c <= a; h++) {
                            let u = l.children[h],
                                d = c + u.length;
                            d >= a && (u.isComposite() ? t(u, a - c) : (!r || r.isHidden && (e > 0 || i && de(r, u))) && (d > a || 32 & u.flags) ? (r = u, o = a - c) : (c < a || 16 & u.flags && !u.isHidden) && (s = u, n = a - c)), c = d
                        }
                    }(this, t);
                    let l = (e < 0 ? s : r) || s || r;
                    return l ? {
                        tile: l,
                        offset: l == s ? n : o
                    } : null
                }
                coordsIn(t, e) {
                    let i = this.resolveInline(t, e, !0);
                    return i ? i.tile.coordsIn(Math.max(0, i.offset), e) : function(t) {
                        let e = t.dom.lastChild;
                        if (!e) return t.dom.getBoundingClientRect();
                        let i = W(e);
                        return i[i.length - 1] || null
                    }(this)
                }
                domIn(t, e) {
                    let i = this.resolveInline(t, e);
                    if (i) {
                        let {
                            tile: t,
                            offset: s
                        } = i;
                        if (this.dom.contains(t.dom)) return t.isText() ? new rt(t.dom, Math.min(t.dom.nodeValue.length, s)) : t.domPosFor(s, 16 & t.flags ? 1 : 32 & t.flags ? -1 : e);
                        let n = i.tile.parent,
                            r = !1;
                        for (let t of n.children) {
                            if (r) return new rt(t.dom, 0);
                            t == i.tile && (r = !0)
                        }
                    }
                    return new rt(this.dom, 0)
                }
            }

            function de(t, e) {
                let i = t.coordsIn(0, 1),
                    s = e.coordsIn(0, 1);
                return i && s && s.top < i.bottom
            }
            class fe extends le {
                constructor(t, e) {
                    super(t), this.mark = e
                }
                get domAttrs() {
                    return this.mark.attrs
                }
                static of (t, e) {
                    let i = new fe(e || document.createElement(t.tagName), t);
                    return e || (i.flags |= 4), i
                }
            }
            class pe extends oe {
                constructor(t, e) {
                    super(t, e.length), this.text = e
                }
                sync(t) {
                    2 & this.flags || (super.sync(t), this.dom.nodeValue != this.text && (t && t.node == this.dom && (t.written = !0), this.dom.nodeValue = this.text))
                }
                isText() {
                    return !0
                }
                toString() {
                    return JSON.stringify(this.text)
                }
                coordsIn(t, e) {
                    let i = this.dom.nodeValue.length;
                    t > i && (t = i);
                    let s = t,
                        n = t,
                        r = 0;
                    0 == t && e < 0 || t == i && e >= 0 ? k.chrome || k.gecko || (t ? (s--, r = 1) : n < i && (n++, r = -1)) : e < 0 ? s-- : n < i && n++;
                    let o = tt(this.dom, s, n).getClientRects();
                    if (!o.length) return null;
                    let l = o[(r ? r < 0 : e >= 0) ? 0 : o.length - 1];
                    return k.safari && !r && 0 == l.width && (l = Array.prototype.find.call(o, t => t.width) || l), r ? X(l, r < 0) : l || null
                }
                static of (t, e) {
                    let i = new pe(e || document.createTextNode(t), t);
                    return e || (i.flags |= 2), i
                }
            }
            class me extends oe {
                constructor(t, e, i, s) {
                    super(t, e, s), this.widget = i
                }
                isWidget() {
                    return !0
                }
                get isHidden() {
                    return this.widget.isHidden
                }
                covers(t) {
                    return !(48 & this.flags) && (this.flags & (t < 0 ? 64 : 128)) > 0
                }
                coordsIn(t, e) {
                    return this.coordsInWidget(t, e, !1)
                }
                coordsInWidget(t, e, i) {
                    let s = this.widget.coordsAt(this.dom, t, e);
                    if (s) return s;
                    if (i) return X(this.dom.getBoundingClientRect(), this.length ? 0 == t : e <= 0);
                    {
                        let e = this.dom.getClientRects(),
                            i = null;
                        if (!e.length) return null;
                        let s = !!(16 & this.flags) || !(32 & this.flags) && t > 0;
                        for (let n = s ? e.length - 1 : 0; i = e[n], !(t > 0 ? 0 == n : n == e.length - 1 || i.top < i.bottom); n += s ? -1 : 1);
                        return X(i, !s)
                    }
                }
                get overrideDOMText() {
                    if (!this.length) return s.EY.empty;
                    let {
                        root: t
                    } = this;
                    if (!t) return s.EY.empty;
                    let e = this.posAtStart;
                    return t.view.state.doc.slice(e, e + this.length)
                }
                destroy() {
                    super.destroy(), this.widget.destroy(this.dom)
                }
                static of (t, e, i, s, n) {
                    return n || (n = t.toDOM(e), t.editable || (n.contentEditable = "false")), new me(n, i, t, s)
                }
            }
            class ge extends oe {
                constructor(t) {
                    let e = document.createElement("img");
                    e.className = "css-widgetBuffer", e.setAttribute("aria-hidden", "true"), super(e, 0, t)
                }
                get isHidden() {
                    return !0
                }
                get overrideDOMText() {
                    return s.EY.empty
                }
                coordsIn(t) {
                    return this.dom.getBoundingClientRect()
                }
            }
            class ve {
                constructor(t) {
                    this.index = 0, this.beforeBreak = !1, this.parents = [], this.tile = t
                }
                advance(t, e, i) {
                    let {
                        tile: s,
                        index: n,
                        beforeBreak: r,
                        parents: o
                    } = this;
                    for (; t || e > 0;)
                        if (s.isComposite())
                            if (r) {
                                if (!t) break;
                                i && i.break(), t--, r = !1
                            } else if (n == s.children.length) {
                        if (!t && !o.length) break;
                        i && i.leave(s), r = !!s.breakAfter, ({
                            tile: s,
                            index: n
                        } = o.pop()), n++
                    } else {
                        let l = s.children[n],
                            a = l.breakAfter;
                        !(e > 0 ? l.length <= t : l.length < t) || i && !1 === i.skip(l, 0, l.length) && l.isComposite ? (o.push({
                            tile: s,
                            index: n
                        }), s = l, n = 0, i && l.isComposite() && i.enter(l)) : (r = !!a, n++, t -= l.length)
                    } else if (n == s.length) r = !!s.breakAfter, ({
                        tile: s,
                        index: n
                    } = o.pop()), n++;
                    else {
                        if (!t) break;
                        {
                            let e = Math.min(t, s.length - n);
                            i && i.skip(s, n, n + e), t -= e, n += e
                        }
                    }
                    return this.tile = s, this.index = n, this.beforeBreak = r, this
                }
                get root() {
                    return this.parents.length ? this.parents[0].tile : this.tile
                }
            }
            class be {
                constructor(t, e, i, s) {
                    this.from = t, this.to = e, this.wrapper = i, this.rank = s
                }
            }
            class we {
                constructor(t, e, i) {
                    this.cache = t, this.root = e, this.blockWrappers = i, this.curLine = null, this.lastBlock = null, this.afterWidget = null, this.pos = 0, this.wrappers = [], this.wrapperPos = 0
                }
                addText(t, e, i, s) {
                    var n;
                    this.flushBuffer();
                    let r = this.ensureMarks(e, i),
                        o = r.lastChild;
                    !o || !o.isText() || 8 & o.flags ? r.append(s || pe.of(t, null === (n = this.cache.find(pe)) || void 0 === n ? void 0 : n.dom)) : (this.cache.reused.set(o, 2), (r.children[r.children.length - 1] = new pe(o.dom, o.text + t)).parent = r), this.pos += t.length, this.afterWidget = null
                }
                addComposition(t, e) {
                    let i = this.curLine;
                    i.dom != e.line.dom && (i.setDOM(this.cache.reused.has(e.line) ? Ae(e.line.dom) : e.line.dom), this.cache.reused.set(e.line, 2));
                    let s = i;
                    for (let t = e.marks.length - 1; t >= 0; t--) {
                        let i = e.marks[t],
                            n = s.lastChild;
                        if (n instanceof fe && n.mark.eq(i.mark)) n.dom != i.dom && n.setDOM(Ae(i.dom)), s = n;
                        else {
                            if (this.cache.reused.get(i)) {
                                let t = oe.get(i.dom);
                                t && t.setDOM(Ae(i.dom))
                            }
                            let t = fe.of(i.mark, i.dom);
                            s.append(t), s = t
                        }
                        this.cache.reused.set(i, 2)
                    }
                    let n = oe.get(t.text);
                    n && this.cache.reused.set(n, 2);
                    let r = new pe(t.text, t.text.nodeValue);
                    r.flags |= 8, s.append(r)
                }
                addInlineWidget(t, e, i) {
                    let s = this.afterWidget && 48 & t.flags && (48 & this.afterWidget.flags) == (48 & t.flags);
                    s || this.flushBuffer();
                    let n = this.ensureMarks(e, i);
                    s || 16 & t.flags || n.append(this.getBuffer(1)), n.append(t), this.pos += t.length, this.afterWidget = t
                }
                addMark(t, e, i) {
                    this.flushBuffer(), this.ensureMarks(e, i).append(t), this.pos += t.length, this.afterWidget = null
                }
                addBlockWidget(t) {
                    this.getBlockPos().append(t), this.pos += t.length, this.lastBlock = t, this.endLine()
                }
                continueWidget(t) {
                    (this.afterWidget || this.lastBlock).length += t, this.pos += t
                }
                addLineStart(t, e) {
                    var i;
                    t || (t = Ce);
                    let s = ue.start(t, e || (null === (i = this.cache.find(ue)) || void 0 === i ? void 0 : i.dom), !!e);
                    this.getBlockPos().append(this.lastBlock = this.curLine = s)
                }
                addLine(t) {
                    this.getBlockPos().append(t), this.pos += t.length, this.lastBlock = t, this.endLine()
                }
                addBreak() {
                    this.lastBlock.flags |= 1, this.endLine(), this.pos++
                }
                addLineStartIfNotCovered(t) {
                    this.blockPosCovered() || this.addLineStart(t)
                }
                ensureLine(t) {
                    this.curLine || this.addLineStart(t)
                }
                ensureMarks(t, e) {
                    var i;
                    let s = this.curLine;
                    for (let n = t.length - 1; n >= 0; n--) {
                        let r, o = t[n];
                        if (e > 0 && (r = s.lastChild) && r instanceof fe && r.mark.eq(o)) s = r, e--;
                        else {
                            let t = fe.of(o, null === (i = this.cache.find(fe, t => t.mark.eq(o))) || void 0 === i ? void 0 : i.dom);
                            s.append(t), s = t, e = 0
                        }
                    }
                    return s
                }
                endLine() {
                    if (this.curLine) {
                        this.flushBuffer();
                        let t = this.curLine.lastChild;
                        t && Se(this.curLine, !1) && ("BR" == t.dom.nodeName || !t.isWidget() || k.ios && Se(this.curLine, !0)) || this.curLine.append(this.cache.findWidget(Qe, 0, 32) || new me(Qe.toDOM(), 0, Qe, 32)), this.curLine = this.afterWidget = null
                    }
                }
                updateBlockWrappers() {
                    this.wrapperPos > this.pos + 1e4 && (this.blockWrappers.goto(this.pos), this.wrappers.length = 0);
                    for (let t = this.wrappers.length - 1; t >= 0; t--) this.wrappers[t].to < this.pos && this.wrappers.splice(t, 1);
                    for (let t = this.blockWrappers; t.value && t.from <= this.pos; t.next())
                        if (t.to >= this.pos) {
                            let e = new be(t.from, t.to, t.value, t.rank),
                                i = this.wrappers.length;
                            for (; i > 0 && (this.wrappers[i - 1].rank - e.rank || this.wrappers[i - 1].to - e.to) < 0;) i--;
                            this.wrappers.splice(i, 0, e)
                        } this.wrapperPos = this.pos
                }
                getBlockPos() {
                    var t;
                    this.updateBlockWrappers();
                    let e = this.root;
                    for (let i of this.wrappers) {
                        let s = e.lastChild;
                        if (i.from < this.pos && s instanceof ce && s.wrapper.eq(i.wrapper)) e = s;
                        else {
                            let s = ce.of(i.wrapper, null === (t = this.cache.find(ce, t => t.wrapper.eq(i.wrapper))) || void 0 === t ? void 0 : t.dom);
                            e.append(s), e = s
                        }
                    }
                    return e
                }
                blockPosCovered() {
                    let t = this.lastBlock;
                    return null != t && !t.breakAfter && (!t.isWidget() || (160 & t.flags) > 0)
                }
                getBuffer(t) {
                    let e = 2 | (t < 0 ? 16 : 32),
                        i = this.cache.find(ge, void 0, 1);
                    return i && (i.flags = e), i || new ge(e)
                }
                flushBuffer() {
                    !this.afterWidget || 32 & this.afterWidget.flags || (this.afterWidget.parent.append(this.getBuffer(-1)), this.afterWidget = null)
                }
            }
            class ye {
                constructor(t) {
                    this.skipCount = 0, this.text = "", this.textOff = 0, this.cursor = t.iter()
                }
                skip(t) {
                    this.textOff + t <= this.text.length ? this.textOff += t : (this.skipCount += t - (this.text.length - this.textOff), this.text = "", this.textOff = 0)
                }
                next(t) {
                    if (this.textOff == this.text.length) {
                        let {
                            value: e,
                            lineBreak: i,
                            done: s
                        } = this.cursor.next(this.skipCount);
                        if (this.skipCount = 0, s) throw new Error("Ran out of text content when drawing inline views");
                        this.text = e;
                        let n = this.textOff = Math.min(t, e.length);
                        return i ? null : e.slice(0, n)
                    }
                    let e = Math.min(this.text.length, this.textOff + t),
                        i = this.text.slice(this.textOff, e);
                    return this.textOff = e, i
                }
            }
            const Oe = [me, ue, pe, fe, ge, ce, he];
            for (let t = 0; t < Oe.length; t++) Oe[t].bucket = t;
            class xe {
                constructor(t) {
                    this.view = t, this.buckets = Oe.map(() => []), this.index = Oe.map(() => 0), this.reused = new Map
                }
                add(t) {
                    let e = t.constructor.bucket,
                        i = this.buckets[e];
                    i.length < 6 ? i.push(t) : i[this.index[e] = (this.index[e] + 1) % 6] = t
                }
                find(t, e, i = 2) {
                    let s = t.bucket,
                        n = this.buckets[s],
                        r = this.index[s];
                    for (let t = n.length - 1; t >= 0; t--) {
                        let o = (t + r) % n.length,
                            l = n[o];
                        if ((!e || e(l)) && !this.reused.has(l)) return n.splice(o, 1), o < r && this.index[s]--, this.reused.set(l, i), l
                    }
                    return null
                }
                findWidget(t, e, i) {
                    let s = this.buckets[0];
                    if (s.length)
                        for (let n = 0, r = 0;; n++) {
                            if (n == s.length) {
                                if (r) return null;
                                r = 1, n = 0
                            }
                            let o = s[n];
                            if (!this.reused.has(o) && (0 == r ? o.widget.compare(t) : o.widget.constructor == t.constructor && t.updateDOM(o.dom, this.view))) return s.splice(n, 1), n < this.index[0] && this.index[0]--, o.widget == t && o.length == e && (497 & o.flags) == i ? (this.reused.set(o, 1), o) : (this.reused.set(o, 2), new me(o.dom, e, t, -498 & o.flags | i))
                        }
                }
                reuse(t) {
                    return this.reused.set(t, 1), t
                }
                maybeReuse(t, e = 2) {
                    if (!this.reused.has(t)) return this.reused.set(t, e), t.dom
                }
                clear() {
                    for (let t = 0; t < this.buckets.length; t++) this.buckets[t].length = this.index[t] = 0
                }
            }
            class ke {
                constructor(t, e, i, n, r) {
                    this.view = t, this.decorations = n, this.disallowBlockEffectsFor = r, this.openWidget = !1, this.openMarks = 0, this.cache = new xe(t), this.text = new ye(t.state.doc), this.builder = new we(this.cache, new he(t, t.contentDOM), s.om.iter(i)), this.cache.reused.set(e, 2), this.old = new ve(e), this.reuseWalker = {
                        skip: (t, e, i) => {
                            if (this.cache.add(t), t.isComposite()) return !1
                        },
                        enter: t => this.cache.add(t),
                        leave: () => {},
                        break: () => {}
                    }
                }
                run(t, e) {
                    let i = e && this.getCompositionContext(e.text);
                    for (let s = 0, n = 0, r = 0;;) {
                        let o = r < t.length ? t[r++] : null,
                            l = o ? o.fromA : this.old.root.length;
                        if (l > s) {
                            let t = l - s;
                            this.preserve(t, !r, !o), s = l, n += t
                        }
                        if (!o) break;
                        e && o.fromA <= e.range.fromA && o.toA >= e.range.toA ? (this.forward(o.fromA, e.range.fromA, e.range.fromA < e.range.toA ? 1 : -1), this.emit(n, e.range.fromB), this.cache.clear(), this.builder.addComposition(e, i), this.text.skip(e.range.toB - e.range.fromB), this.forward(e.range.fromA, o.toA), this.emit(e.range.toB, o.toB)) : (this.forward(o.fromA, o.toA), this.emit(n, o.toB)), n = o.toB, s = o.toA
                    }
                    return this.builder.curLine && this.builder.endLine(), this.builder.root
                }
                preserve(t, e, i) {
                    let s = function(t) {
                            let e = [];
                            for (let i = t.parents.length; i > 1; i--) {
                                let s = i == t.parents.length ? t.tile : t.parents[i].tile;
                                s instanceof fe && e.push(s.mark)
                            }
                            return e
                        }(this.old),
                        n = this.openMarks;
                    this.old.advance(t, i ? 1 : -1, {
                        skip: (t, e, i) => {
                            if (t.isWidget())
                                if (this.openWidget) this.builder.continueWidget(i - e);
                                else {
                                    let r = i > 0 || e < t.length ? me.of(t.widget, this.view, i - e, 496 & t.flags, this.cache.maybeReuse(t)) : this.cache.reuse(t);
                                    256 & r.flags ? (r.flags &= -2, this.builder.addBlockWidget(r)) : (this.builder.ensureLine(null), this.builder.addInlineWidget(r, s, n), n = s.length)
                                }
                            else if (t.isText()) this.builder.ensureLine(null), e || i != t.length ? (this.cache.add(t), this.builder.addText(t.text.slice(e, i), s, n)) : this.builder.addText(t.text, s, n, this.cache.reuse(t)), n = s.length;
                            else if (t.isLine()) t.flags &= -2, this.cache.reused.set(t, 1), this.builder.addLine(t);
                            else if (t instanceof ge) this.cache.add(t);
                            else {
                                if (!(t instanceof fe)) return !1;
                                this.builder.ensureLine(null), this.builder.addMark(t, s, n), this.cache.reused.set(t, 1), n = s.length
                            }
                            this.openWidget = !1
                        },
                        enter: t => {
                            t.isLine() ? this.builder.addLineStart(t.attrs, this.cache.maybeReuse(t)) : (this.cache.add(t), t instanceof fe && s.unshift(t.mark)), this.openWidget = !1
                        },
                        leave: t => {
                            t.isLine() ? s.length && (s.length = n = 0) : t instanceof fe && (s.shift(), n = Math.min(n, s.length))
                        },
                        break: () => {
                            this.builder.addBreak(), this.openWidget = !1
                        }
                    }), this.text.skip(t)
                }
                emit(t, e) {
                    let i = null,
                        n = this.builder,
                        r = 0,
                        o = s.om.spans(this.decorations, t, e, {
                            point: (t, e, s, o, l, a) => {
                                if (s instanceof B) {
                                    if (this.disallowBlockEffectsFor[a]) {
                                        if (s.block) throw new RangeError("Block decorations may not be specified via plugins");
                                        if (e > this.view.state.doc.lineAt(t).to) throw new RangeError("Decorations that replace line breaks may not be specified via plugins")
                                    }
                                    if (r = o.length, l > o.length) n.continueWidget(e - t);
                                    else {
                                        let r = s.widget || (s.block ? Me.block : Me.inline),
                                            a = function(t) {
                                                let e = t.isReplace ? (t.startSide < 0 ? 64 : 0) | (t.endSide > 0 ? 128 : 0) : t.startSide > 0 ? 32 : 16;
                                                return t.block && (e |= 256), e
                                            }(s),
                                            h = this.cache.findWidget(r, e - t, a) || me.of(r, this.view, e - t, a);
                                        s.block ? (s.startSide > 0 && n.addLineStartIfNotCovered(i), n.addBlockWidget(h)) : (n.ensureLine(i), n.addInlineWidget(h, o, l))
                                    }
                                    i = null
                                } else i = function(t, e) {
                                    let i = e.spec.attributes,
                                        s = e.spec.class;
                                    return i || s ? (t || (t = {
                                        class: "css-line"
                                    }), i && S(i, t), s && (t.class += " " + s), t) : t
                                }(i, s);
                                e > t && this.text.skip(e - t)
                            },
                            span: (t, e, s, r) => {
                                for (let o = t; o < e;) {
                                    let t = this.text.next(Math.min(512, e - o));
                                    null == t ? (n.addLineStartIfNotCovered(i), n.addBreak(), o++) : (n.ensureLine(i), n.addText(t, s, r), o += t.length), i = null
                                }
                            }
                        });
                    n.addLineStartIfNotCovered(i), this.openWidget = o > r, this.openMarks = o
                }
                forward(t, e, i = 1) {
                    e - t <= 10 ? this.old.advance(e - t, i, this.reuseWalker) : (this.old.advance(5, -1, this.reuseWalker), this.old.advance(e - t - 10, -1), this.old.advance(5, i, this.reuseWalker))
                }
                getCompositionContext(t) {
                    let e = [],
                        i = null;
                    for (let s = t.parentNode;; s = s.parentNode) {
                        let t = oe.get(s);
                        if (s == this.view.contentDOM) break;
                        t instanceof fe ? e.push(t) : (null == t ? void 0 : t.isLine()) ? i = t : "DIV" != s.nodeName || i || s == this.view.contentDOM ? e.push(fe.of(new R({
                            tagName: s.nodeName.toLowerCase(),
                            attributes: Q(s)
                        }), s)) : i = new ue(s, Ce)
                    }
                    return {
                        line: i,
                        marks: e
                    }
                }
            }

            function Se(t, e) {
                let i = t => {
                    for (let s of t.children)
                        if ((e ? s.isText() : s.length) || i(s)) return !0;
                    return !1
                };
                return i(t)
            }
            const Ce = {
                class: "css-line"
            };

            function Ae(t) {
                let e = oe.get(t);
                return e && e.setDOM(t.cloneNode()), t
            }
            class Me extends T {
                constructor(t) {
                    super(), this.tag = t
                }
                eq(t) {
                    return t.tag == this.tag
                }
                toDOM() {
                    return document.createElement(this.tag)
                }
                updateDOM(t) {
                    return t.nodeName.toLowerCase() == this.tag
                }
                get isHidden() {
                    return !0
                }
            }
            Me.inline = new Me("span"), Me.block = new Me("div");
            const Qe = new class extends T {
                toDOM() {
                    return document.createElement("br")
                }
                get isHidden() {
                    return !0
                }
                get editable() {
                    return !0
                }
            };
            class Te {
                constructor(t) {
                    this.view = t, this.decorations = [], this.blockWrappers = [], this.dynamicDecorationMap = [!1], this.domChanged = null, this.hasComposition = null, this.editContextFormatting = D.none, this.lastCompositionAfterCursor = !1, this.minWidth = 0, this.minWidthFrom = 0, this.minWidthTo = 0, this.impreciseAnchor = null, this.impreciseHead = null, this.forceSelection = !1, this.lastUpdate = Date.now(), this.updateDeco(), this.tile = new he(t, t.contentDOM), this.updateInner([new se(0, 0, 0, t.state.doc.length)], null)
                }
                update(t) {
                    var e;
                    let i = t.changedRanges;
                    this.minWidth > 0 && i.length && (i.every(({
                        fromA: t,
                        toA: e
                    }) => e < this.minWidthFrom || t > this.minWidthTo) ? (this.minWidthFrom = t.changes.mapPos(this.minWidthFrom, 1), this.minWidthTo = t.changes.mapPos(this.minWidthTo, 1)) : this.minWidth = this.minWidthFrom = this.minWidthTo = 0), this.updateEditContextFormatting(t);
                    let n = -1;
                    this.view.inputState.composing >= 0 && !this.view.observer.editContext && ((null === (e = this.domChanged) || void 0 === e ? void 0 : e.newSel) ? n = this.domChanged.newSel.head : function(t, e) {
                        let i = !1;
                        return e && t.iterChangedRanges((t, s) => {
                            t < e.to && s > e.from && (i = !0)
                        }), i
                    }(t.changes, this.hasComposition) || t.selectionSet || (n = t.state.selection.main.head));
                    let r = n > -1 ? function(t, e, i) {
                        let s = De(t, i);
                        if (!s) return null;
                        let {
                            node: n,
                            from: r,
                            to: o
                        } = s, l = n.nodeValue;
                        if (/[\n\r]/.test(l)) return null;
                        if (t.state.doc.sliceString(s.from, s.to) != l) return null;
                        let a = e.invertedDesc;
                        return {
                            range: new se(a.mapPos(r), a.mapPos(o), r, o),
                            text: n
                        }
                    }(this.view, t.changes, n) : null;
                    if (this.domChanged = null, this.hasComposition) {
                        let {
                            from: e,
                            to: s
                        } = this.hasComposition;
                        i = new se(e, s, t.changes.mapPos(e, -1), t.changes.mapPos(s, 1)).addToSet(i.slice())
                    }
                    this.hasComposition = r ? {
                        from: r.range.fromB,
                        to: r.range.toB
                    } : null, (k.ie || k.chrome) && !r && t && t.state.doc.lines != t.startState.doc.lines && (this.forceSelection = !0);
                    let o = this.decorations,
                        l = this.blockWrappers;
                    this.updateDeco();
                    let a = function(t, e, i) {
                        let n = new Re;
                        return s.om.compare(t, e, i, n), n.changes
                    }(o, this.decorations, t.changes);
                    a.length && (i = se.extendWithRanges(i, a));
                    let h = function(t, e, i) {
                        let n = new Ee;
                        return s.om.compare(t, e, i, n), n.changes
                    }(l, this.blockWrappers, t.changes);
                    return h.length && (i = se.extendWithRanges(i, h)), r && !i.some(t => t.fromA <= r.range.fromA && t.toA >= r.range.toA) && (i = r.range.addToSet(i.slice())), !(2 & this.tile.flags && 0 == i.length || (this.updateInner(i, r), t.transactions.length && (this.lastUpdate = Date.now()), 0))
                }
                updateInner(t, e) {
                    this.view.viewState.mustMeasureContent = !0;
                    let {
                        observer: i
                    } = this.view;
                    i.ignore(() => {
                        if (e || t.length) {
                            let i = this.tile,
                                s = new ke(this.view, i, this.blockWrappers, this.decorations, this.dynamicDecorationMap);
                            this.tile = s.run(t, e), Pe(i, s.cache.reused)
                        }
                        this.tile.dom.style.height = this.view.viewState.contentHeight / this.view.scaleY + "px", this.tile.dom.style.flexBasis = this.minWidth ? this.minWidth + "px" : "";
                        let s = k.chrome || k.ios ? {
                            node: i.selectionRange.focusNode,
                            written: !1
                        } : void 0;
                        this.tile.sync(s), !s || !s.written && i.selectionRange.focusNode == s.node && this.tile.dom.contains(s.node) || (this.forceSelection = !0), this.tile.dom.style.height = ""
                    });
                    let s = [];
                    if (this.view.viewport.from || this.view.viewport.to < this.view.state.doc.length)
                        for (let t of this.tile.children) t.isWidget() && t.widget instanceof Be && s.push(t.dom);
                    i.updateGaps(s)
                }
                updateEditContextFormatting(t) {
                    this.editContextFormatting = this.editContextFormatting.map(t.changes);
                    for (let e of t.transactions)
                        for (let t of e.effects) t.is(Ft) && (this.editContextFormatting = t.value)
                }
                updateSelection(t = !1, e = !1) {
                    !t && this.view.observer.selectionRange.focusNode || this.view.observer.readSelectionRange();
                    let {
                        dom: i
                    } = this.tile, s = this.view.root.activeElement, n = s == i, r = !n && !(this.view.state.facet(Wt) || i.tabIndex > -1) && $(i, this.view.observer.selectionRange) && !(s && i.contains(s));
                    if (!(n || e || r)) return;
                    let o = this.forceSelection;
                    this.forceSelection = !1;
                    let l, a, h = this.view.state.selection.main;
                    if (h.empty ? a = l = this.inlineDOMNearPos(h.anchor, h.assoc || 1) : (a = this.inlineDOMNearPos(h.head, h.head == h.from ? 1 : -1), l = this.inlineDOMNearPos(h.anchor, h.anchor == h.from ? 1 : -1)), k.gecko && h.empty && !this.hasComposition && 1 == (c = l).node.nodeType && c.node.firstChild && (0 == c.offset || "false" == c.node.childNodes[c.offset - 1].contentEditable) && (c.offset == c.node.childNodes.length || "false" == c.node.childNodes[c.offset].contentEditable)) {
                        let t = document.createTextNode("");
                        this.view.observer.ignore(() => l.node.insertBefore(t, l.node.childNodes[l.offset] || null)), l = a = new rt(t, 0), o = !0
                    }
                    var c;
                    let u = this.view.observer.selectionRange;
                    !o && u.focusNode && (V(l.node, l.offset, u.anchorNode, u.anchorOffset) && V(a.node, a.offset, u.focusNode, u.focusOffset) || this.suppressWidgetCursorChange(u, h)) || (this.view.observer.ignore(() => {
                        k.android && k.chrome && i.contains(u.focusNode) && function(t, e) {
                            for (let i = t; i && i != e; i = i.assignedSlot || i.parentNode)
                                if (1 == i.nodeType && "false" == i.contentEditable) return !0;
                            return !1
                        }(u.focusNode, i) && (i.blur(), i.focus({
                            preventScroll: !0
                        }));
                        let t = z(this.view.root);
                        if (t)
                            if (h.empty) {
                                if (k.gecko) {
                                    let t = (e = l.node, n = l.offset, 1 != e.nodeType ? 0 : (n && "false" == e.childNodes[n - 1].contentEditable ? 1 : 0) | (n < e.childNodes.length && "false" == e.childNodes[n].contentEditable ? 2 : 0));
                                    if (t && 3 != t) {
                                        let e = (1 == t ? st : nt)(l.node, l.offset);
                                        e && (l = new rt(e.node, e.offset))
                                    }
                                }
                                t.collapse(l.node, l.offset), null != h.bidiLevel && void 0 !== t.caretBidiLevel && (t.caretBidiLevel = h.bidiLevel)
                            } else if (t.extend) {
                            t.collapse(l.node, l.offset);
                            try {
                                t.extend(a.node, a.offset)
                            } catch (t) {}
                        } else {
                            let e = document.createRange();
                            h.anchor > h.head && ([l, a] = [a, l]), e.setEnd(a.node, a.offset), e.setStart(l.node, l.offset), t.removeAllRanges(), t.addRange(e)
                        }
                        var e, n;
                        r && this.view.root.activeElement == i && (i.blur(), s && s.focus())
                    }), this.view.observer.setSelectionRange(l, a)), this.impreciseAnchor = l.precise ? null : new rt(u.anchorNode, u.anchorOffset), this.impreciseHead = a.precise ? null : new rt(u.focusNode, u.focusOffset)
                }
                suppressWidgetCursorChange(t, e) {
                    return this.hasComposition && e.empty && V(t.focusNode, t.focusOffset, t.anchorNode, t.anchorOffset) && this.posFromDOM(t.focusNode, t.focusOffset) == e.head
                }
                enforceCursorAssoc() {
                    if (this.hasComposition) return;
                    let {
                        view: t
                    } = this, e = t.state.selection.main, i = z(t.root), {
                        anchorNode: s,
                        anchorOffset: n
                    } = t.observer.selectionRange;
                    if (!(i && e.empty && e.assoc && i.modify)) return;
                    let r = this.lineAt(e.head, e.assoc);
                    if (!r) return;
                    let o = r.posAtStart;
                    if (e.head == o || e.head == o + r.length) return;
                    let l = this.coordsAt(e.head, -1),
                        a = this.coordsAt(e.head, 1);
                    if (!l || !a || l.bottom > a.top) return;
                    let h = this.domAtPos(e.head + e.assoc, e.assoc);
                    i.collapse(h.node, h.offset), i.modify("move", e.assoc < 0 ? "forward" : "backward", "lineboundary"), t.observer.readSelectionRange();
                    let c = t.observer.selectionRange;
                    t.docView.posFromDOM(c.anchorNode, c.anchorOffset) != e.from && i.collapse(s, n)
                }
                posFromDOM(t, e) {
                    let i = this.tile.nearest(t);
                    if (!i) return 2 & this.tile.dom.compareDocumentPosition(t) ? 0 : this.view.state.doc.length;
                    let s = i.posAtStart;
                    if (!i.isComposite()) return i.isText() ? t == i.dom ? s + e : s + (e ? i.length : 0) : s;
                    {
                        let n;
                        if (t == i.dom) n = i.dom.childNodes[e];
                        else {
                            let s = 0 == _(t) ? 0 : 0 == e ? -1 : 1;
                            for (;;) {
                                let e = t.parentNode;
                                if (e == i.dom) break;
                                0 == s && e.firstChild != e.lastChild && (s = t == e.firstChild ? -1 : 1), t = e
                            }
                            n = s < 0 ? t : t.nextSibling
                        }
                        if (n == i.dom.firstChild) return s;
                        for (; n && !oe.get(n);) n = n.nextSibling;
                        if (!n) return s + i.length;
                        for (let t = 0, e = s;; t++) {
                            let s = i.children[t];
                            if (s.dom == n) return e;
                            e += s.length + s.breakAfter
                        }
                    }
                }
                domAtPos(t, e) {
                    let {
                        tile: i,
                        offset: s
                    } = this.tile.resolveBlock(t, e);
                    return i.isWidget() ? i.domPosFor(t, e) : i.domIn(s, e)
                }
                inlineDOMNearPos(t, e) {
                    let i, s, n = -1,
                        r = !1,
                        o = -1,
                        l = !1;
                    return this.tile.blockTiles((e, a) => {
                        if (e.isWidget()) {
                            if (32 & e.flags && a >= t) return !0;
                            16 & e.flags && (r = !0)
                        } else {
                            let h = a + e.length;
                            if (a <= t && (i = e, n = t - a, r = h < t), h >= t && !s && (s = e, o = t - a, l = a > t), a > t && s) return !0
                        }
                    }), i || s ? (r && s ? i = null : l && i && (s = null), i && e < 0 || !s ? i.domIn(n, e) : s.domIn(o, e)) : this.domAtPos(t, e)
                }
                coordsAt(t, e) {
                    let {
                        tile: i,
                        offset: s
                    } = this.tile.resolveBlock(t, e);
                    return i.isWidget() ? i.widget instanceof Be ? null : i.coordsInWidget(s, e, !0) : i.coordsIn(s, e)
                }
                lineAt(t, e) {
                    let {
                        tile: i
                    } = this.tile.resolveBlock(t, e);
                    return i.isLine() ? i : null
                }
                coordsForChar(t) {
                    let {
                        tile: e,
                        offset: i
                    } = this.tile.resolveBlock(t, 1);
                    return e.isLine() ? function t(e, i) {
                        if (e.isComposite())
                            for (let s of e.children) {
                                if (s.length >= i) {
                                    let e = t(s, i);
                                    if (e) return e
                                }
                                if ((i -= s.length) < 0) break
                            } else if (e.isText() && i < e.length) {
                                let t = (0, s.zK)(e.text, i);
                                if (t == i) return null;
                                let n = tt(e.dom, i, t).getClientRects();
                                for (let t = 0; t < n.length; t++) {
                                    let e = n[t];
                                    if (t == n.length - 1 || e.top < e.bottom && e.left < e.right) return e
                                }
                            } return null
                    }(e, i) : null
                }
                measureVisibleLineHeights(t) {
                    let e = [],
                        {
                            from: i,
                            to: s
                        } = t,
                        n = this.view.contentDOM.clientWidth,
                        r = n > Math.max(this.view.scrollDOM.clientWidth, this.minWidth) + 1,
                        o = -1,
                        l = this.view.textDirection == ot.LTR,
                        a = 0,
                        h = (t, c, u) => {
                            for (let d = 0; d < t.children.length && !(c > s); d++) {
                                let s = t.children[d],
                                    f = c + s.length,
                                    p = s.dom.getBoundingClientRect(),
                                    {
                                        height: m
                                    } = p;
                                if (u && !d && (a += p.top - u.top), s instanceof ce) f > i && h(s, c, p);
                                else if (c >= i && (a > 0 && e.push(-a), e.push(m + a), a = 0, r)) {
                                    let t = s.dom.lastChild,
                                        e = t ? W(t) : [];
                                    if (e.length) {
                                        let t = e[e.length - 1],
                                            i = l ? t.right - p.left : p.right - t.left;
                                        i > o && (o = i, this.minWidth = n, this.minWidthFrom = c, this.minWidthTo = f)
                                    }
                                }
                                u && d == t.children.length - 1 && (a += u.bottom - p.bottom), c = f + s.breakAfter
                            }
                        };
                    return h(this.tile, 0, null), e
                }
                textDirectionAt(t) {
                    let {
                        tile: e
                    } = this.tile.resolveBlock(t, 1);
                    return "rtl" == getComputedStyle(e.dom).direction ? ot.RTL : ot.LTR
                }
                measureTextSize() {
                    let t = this.tile.blockTiles(t => {
                        if (t.isLine() && t.children.length && t.length <= 20) {
                            let e, i = 0;
                            for (let s of t.children) {
                                if (!s.isText() || /[^ -~]/.test(s.text)) return;
                                let t = W(s.dom);
                                if (1 != t.length) return;
                                i += t[0].width, e = t[0].height
                            }
                            if (i) return {
                                lineHeight: t.dom.getBoundingClientRect().height,
                                charWidth: i / t.length,
                                textHeight: e
                            }
                        }
                    });
                    if (t) return t;
                    let e, i, s, n = document.createElement("div");
                    return n.className = "css-line", n.style.width = "99999px", n.style.position = "absolute", n.textContent = "abc def ghi jkl mno pqr stu", this.view.observer.ignore(() => {
                        this.tile.dom.appendChild(n);
                        let t = W(n.firstChild)[0];
                        e = n.getBoundingClientRect().height, i = t && t.width ? t.width / 27 : 7, s = t && t.height ? t.height : e, n.remove()
                    }), {
                        lineHeight: e,
                        charWidth: i,
                        textHeight: s
                    }
                }
                computeBlockGapDeco() {
                    let t = [],
                        e = this.view.viewState;
                    for (let i = 0, s = 0;; s++) {
                        let n = s == e.viewports.length ? null : e.viewports[s],
                            r = n ? n.from - 1 : this.view.state.doc.length;
                        if (r > i) {
                            let s = (e.lineBlockAt(r).bottom - e.lineBlockAt(i).top) / this.view.scaleY;
                            t.push(D.replace({
                                widget: new Be(s),
                                block: !0,
                                inclusive: !0,
                                isBlockGap: !0
                            }).range(i, r))
                        }
                        if (!n) break;
                        i = n.to + 1
                    }
                    return D.set(t)
                }
                updateDeco() {
                    let t = 1,
                        e = this.view.state.facet(Yt).map(e => (this.dynamicDecorationMap[t++] = "function" == typeof e) ? e(this.view) : e),
                        i = !1,
                        n = this.view.state.facet(Gt).map((t, e) => {
                            let s = "function" == typeof t;
                            return s && (i = !0), s ? t(this.view) : t
                        });
                    for (n.length && (this.dynamicDecorationMap[t++] = i, e.push(s.om.join(n))), this.decorations = [this.editContextFormatting, ...e, this.computeBlockGapDeco(), this.view.viewState.lineGapDeco]; t < this.decorations.length;) this.dynamicDecorationMap[t++] = !1;
                    this.blockWrappers = this.view.state.facet(Ut).map(t => "function" == typeof t ? t(this.view) : t)
                }
                scrollIntoView(t) {
                    if (t.isSnapshot) {
                        let e = this.view.viewState.lineBlockAt(t.range.head);
                        return this.view.scrollDOM.scrollTop = e.top - t.yMargin, void(this.view.scrollDOM.scrollLeft = t.xMargin)
                    }
                    for (let e of this.view.state.facet(Nt)) try {
                        if (e(this.view, t.range, t)) return !0
                    } catch (t) {
                        $t(this.view.state, t, "scroll handler")
                    }
                    let e, {
                            range: i
                        } = t,
                        s = this.coordsAt(i.head, i.empty ? i.assoc : i.head > i.anchor ? -1 : 1);
                    if (!s) return;
                    !i.empty && (e = this.coordsAt(i.anchor, i.anchor > i.head ? -1 : 1)) && (s = {
                        left: Math.min(s.left, e.left),
                        top: Math.min(s.top, e.top),
                        right: Math.max(s.right, e.right),
                        bottom: Math.max(s.bottom, e.bottom)
                    });
                    let n = ee(this.view),
                        r = {
                            left: s.left - n.left,
                            top: s.top - n.top,
                            right: s.right + n.right,
                            bottom: s.bottom + n.bottom
                        },
                        {
                            offsetWidth: o,
                            offsetHeight: l
                        } = this.view.scrollDOM;
                    ! function(t, e, i, s, n, r, o, l) {
                        let a = t.ownerDocument,
                            h = a.defaultView || window;
                        for (let c = t, u = !1; c && !u;)
                            if (1 == c.nodeType) {
                                let t, d = c == a.body,
                                    f = 1,
                                    p = 1;
                                if (d) t = Y(h);
                                else {
                                    if (/^(fixed|sticky)$/.test(getComputedStyle(c).position) && (u = !0), c.scrollHeight <= c.clientHeight && c.scrollWidth <= c.clientWidth) {
                                        c = c.assignedSlot || c.parentNode;
                                        continue
                                    }
                                    let e = c.getBoundingClientRect();
                                    ({
                                        scaleX: f,
                                        scaleY: p
                                    } = U(c, e)), t = {
                                        left: e.left,
                                        right: e.left + c.clientWidth * f,
                                        top: e.top,
                                        bottom: e.top + c.clientHeight * p
                                    }
                                }
                                let m = 0,
                                    g = 0;
                                if ("nearest" == n) e.top < t.top ? (g = e.top - (t.top + o), i > 0 && e.bottom > t.bottom + g && (g = e.bottom - t.bottom + o)) : e.bottom > t.bottom && (g = e.bottom - t.bottom + o, i < 0 && e.top - g < t.top && (g = e.top - (t.top + o)));
                                else {
                                    let s = e.bottom - e.top,
                                        r = t.bottom - t.top;
                                    g = ("center" == n && s <= r ? e.top + s / 2 - r / 2 : "start" == n || "center" == n && i < 0 ? e.top - o : e.bottom - r + o) - t.top
                                }
                                if ("nearest" == s ? e.left < t.left ? (m = e.left - (t.left + r), i > 0 && e.right > t.right + m && (m = e.right - t.right + r)) : e.right > t.right && (m = e.right - t.right + r, i < 0 && e.left < t.left + m && (m = e.left - (t.left + r))) : m = ("center" == s ? e.left + (e.right - e.left) / 2 - (t.right - t.left) / 2 : "start" == s == l ? e.left - r : e.right - (t.right - t.left) + r) - t.left, m || g)
                                    if (d) h.scrollBy(m, g);
                                    else {
                                        let t = 0,
                                            i = 0;
                                        if (g) {
                                            let t = c.scrollTop;
                                            c.scrollTop += g / p, i = (c.scrollTop - t) * p
                                        }
                                        if (m) {
                                            let e = c.scrollLeft;
                                            c.scrollLeft += m / f, t = (c.scrollLeft - e) * f
                                        }
                                        e = {
                                            left: e.left - t,
                                            top: e.top - i,
                                            right: e.right - t,
                                            bottom: e.bottom - i
                                        }, t && Math.abs(t - m) < 1 && (s = "nearest"), i && Math.abs(i - g) < 1 && (n = "nearest")
                                    } if (d) break;
                                (e.top < t.top || e.bottom > t.bottom || e.left < t.left || e.right > t.right) && (e = {
                                    left: Math.max(e.left, t.left),
                                    right: Math.min(e.right, t.right),
                                    top: Math.max(e.top, t.top),
                                    bottom: Math.min(e.bottom, t.bottom)
                                }), c = c.assignedSlot || c.parentNode
                            } else {
                                if (11 != c.nodeType) break;
                                c = c.host
                            }
                    }(this.view.scrollDOM, r, i.head < i.anchor ? -1 : 1, t.x, t.y, Math.max(Math.min(t.xMargin, o), -o), Math.max(Math.min(t.yMargin, l), -l), this.view.textDirection == ot.LTR)
                }
                lineHasWidget(t) {
                    let e = t => t.isWidget() || t.children.some(e);
                    return e(this.tile.resolveBlock(t, 1).tile)
                }
                destroy() {
                    Pe(this.tile)
                }
            }

            function Pe(t, e) {
                let i = null == e ? void 0 : e.get(t);
                if (1 != i) {
                    null == i && t.destroy();
                    for (let i of t.children) Pe(i, e)
                }
            }

            function De(t, e) {
                let i = t.observer.selectionRange;
                if (!i.focusNode) return null;
                let s = st(i.focusNode, i.focusOffset),
                    n = nt(i.focusNode, i.focusOffset),
                    r = s || n;
                if (n && s && n.node != s.node) {
                    let e = oe.get(n.node);
                    if (!e || e.isText() && e.text != n.node.nodeValue) r = n;
                    else if (t.docView.lastCompositionAfterCursor) {
                        let t = oe.get(s.node);
                        !t || t.isText() && t.text != s.node.nodeValue || (r = n)
                    }
                }
                if (t.docView.lastCompositionAfterCursor = r != s, !r) return null;
                let o = e - r.offset;
                return {
                    from: o,
                    to: o + r.node.nodeValue.length,
                    node: r.node
                }
            }
            let Re = class {
                constructor() {
                    this.changes = []
                }
                compareRange(t, e) {
                    N(t, e, this.changes)
                }
                comparePoint(t, e) {
                    N(t, e, this.changes)
                }
                boundChange(t) {
                    N(t, t, this.changes)
                }
            };
            class Ee {
                constructor() {
                    this.changes = []
                }
                compareRange(t, e) {
                    N(t, e, this.changes)
                }
                comparePoint() {}
                boundChange(t) {
                    N(t, t, this.changes)
                }
            }
            class Be extends T {
                constructor(t) {
                    super(), this.height = t
                }
                toDOM() {
                    let t = document.createElement("div");
                    return t.className = "css-gap", this.updateDOM(t), t
                }
                eq(t) {
                    return t.height == this.height
                }
                updateDOM(t) {
                    return t.style.height = this.height + "px", !0
                }
                get editable() {
                    return !0
                }
                get estimatedHeight() {
                    return this.height
                }
                ignoreEvent() {
                    return !1
                }
            }

            function Le(t, e, i) {
                let s = t.lineBlockAt(e);
                if (Array.isArray(s.type)) {
                    let t;
                    for (let n of s.type) {
                        if (n.from > e) break;
                        if (!(n.to < e)) {
                            if (n.from < e && n.to > e) return n;
                            t && (n.type != P.Text || t.type == n.type && !(i < 0 ? n.from < e : n.to > e)) || (t = n)
                        }
                    }
                    return t || s
                }
                return s
            }

            function Ne(t, e, i, s) {
                let n = t.state.doc.lineAt(e.head),
                    r = t.bidiSpans(n),
                    o = t.textDirectionAt(n.from);
                for (let l = e, a = null;;) {
                    let e = kt(n, r, o, l, i),
                        h = xt;
                    if (!e) {
                        if (n.number == (i ? t.state.doc.lines : 1)) return l;
                        h = "\n", n = t.state.doc.line(n.number + (i ? 1 : -1)), r = t.bidiSpans(n), e = t.visualLineSide(n, !i)
                    }
                    if (a) {
                        if (!a(h)) return l
                    } else {
                        if (!s) return e;
                        a = s(h)
                    }
                    l = e
                }
            }

            function Ie(t, e, i) {
                for (;;) {
                    let s = 0;
                    for (let n of t) n.between(e - 1, e + 1, (t, n, r) => {
                        if (e > t && e < n) {
                            let r = s || i || (e - t < n - e ? -1 : 1);
                            e = r < 0 ? t : n, s = r
                        }
                    });
                    if (!s) return e
                }
            }

            function ze(t, e) {
                let i = null;
                for (let n = 0; n < e.ranges.length; n++) {
                    let r = e.ranges[n],
                        o = null;
                    if (r.empty) {
                        let e = Ie(t, r.from, 0);
                        e != r.from && (o = s.OF.cursor(e, -1))
                    } else {
                        let e = Ie(t, r.from, -1),
                            i = Ie(t, r.to, 1);
                        e == r.from && i == r.to || (o = s.OF.range(r.from == r.anchor ? e : i, r.from == r.head ? e : i))
                    }
                    o && (i || (i = e.ranges.slice()), i[n] = o)
                }
                return i ? s.OF.create(i, e.mainIndex) : e
            }

            function Fe(t, e, i) {
                let n = Ie(t.state.facet(Kt).map(e => e(t)), i.from, e.head > i.from ? -1 : 1);
                return n == i.from ? i : s.OF.cursor(n, n < i.from ? 1 : -1)
            }
            class $e {
                constructor(t, e) {
                    this.pos = t, this.assoc = e
                }
            }

            function We(t, e, i, n) {
                let r, o = t.contentDOM.getBoundingClientRect(),
                    l = o.top + t.viewState.paddingTop,
                    {
                        x: a,
                        y: h
                    } = e,
                    c = h - l;
                for (;;) {
                    if (c < 0) return new $e(0, 1);
                    if (c > t.viewState.docHeight) return new $e(t.state.doc.length, -1);
                    if (r = t.elementAtHeight(c), null == n) break;
                    if (r.type == P.Text) {
                        let e = t.docView.coordsAt(n < 0 ? r.from : r.to, n);
                        if (e && (n < 0 ? e.top <= c + l : e.bottom >= c + l)) break
                    }
                    let e = t.viewState.heightOracle.textHeight / 2;
                    c = n > 0 ? r.bottom + e : r.top - e
                }
                if (t.viewport.from >= r.to || t.viewport.to <= r.from) {
                    if (i) return null;
                    if (r.type == P.Text) {
                        let e = function(t, e, i, n, r) {
                            let o = Math.round((n - e.left) * t.defaultCharacterWidth);
                            if (t.lineWrapping && i.height > 1.5 * t.defaultLineHeight) {
                                let e = t.viewState.heightOracle.textHeight;
                                o += Math.floor((r - i.top - .5 * (t.defaultLineHeight - e)) / e) * t.viewState.heightOracle.lineLength
                            }
                            let l = t.state.sliceDoc(i.from, i.to);
                            return i.from + (0, s.kn)(l, o, t.state.tabSize)
                        }(t, o, r, a, h);
                        return new $e(e, e == r.from ? 1 : -1)
                    }
                }
                if (r.type != P.Text) return c < (r.top + r.bottom) / 2 ? new $e(r.from, 1) : new $e(r.to, -1);
                let u = t.docView.lineAt(r.from, 2);
                return u && u.length == r.length || (u = t.docView.lineAt(r.from, -2)), Ve(t, u, r.from, a, h)
            }

            function Ve(t, e, i, n, r) {
                let o = -1,
                    l = null,
                    a = 1e9,
                    h = 1e9,
                    c = r,
                    u = r,
                    d = (t, e) => {
                        for (let i = 0; i < t.length; i++) {
                            let s = t[i];
                            if (s.top == s.bottom) continue;
                            let d = s.left > n ? s.left - n : s.right < n ? n - s.right : 0,
                                f = s.top > r ? s.top - r : s.bottom < r ? r - s.bottom : 0;
                            s.top <= u && s.bottom >= c && (c = Math.min(s.top, c), u = Math.max(s.bottom, u), f = 0), (o < 0 || (f - h || d - a) < 0) && (o >= 0 && h && a < d && l.top <= u - 2 && l.bottom >= c + 2 ? h = 0 : (o = e, a = d, h = f, l = s))
                        }
                    };
                if (e.isText()) {
                    for (let t = 0; t < e.length;) {
                        let i = (0, s.zK)(e.text, t);
                        if (d(tt(e.dom, t, i).getClientRects(), t), !a && !h) break;
                        t = i
                    }
                    return n > (l.left + l.right) / 2 == (je(t, o + i) == ot.LTR) ? new $e(i + (0, s.zK)(e.text, o), -1) : new $e(i + o, 1)
                } {
                    if (!e.length) return new $e(i, 1);
                    for (let t = 0; t < e.children.length; t++) {
                        let i = e.children[t];
                        if (!(48 & i.flags || (d((1 == i.dom.nodeType ? i.dom : tt(i.dom, 0, i.length)).getClientRects(), t), a || h))) break
                    }
                    let s = e.children[o],
                        c = e.posBefore(s, i);
                    return s.isComposite() || s.isText() ? Ve(t, s, c, Math.max(l.left, Math.min(l.right, n)), r) : n > (l.left + l.right) / 2 == (je(t, o + i) == ot.LTR) ? new $e(c + s.length, -1) : new $e(c, 1)
                }
            }

            function je(t, e) {
                let i = t.state.doc.lineAt(e);
                return t.bidiSpans(i)[gt.find(t.bidiSpans(i), e - i.from, -1, 1)].dir
            }
            const qe = "￿";
            class He {
                constructor(t, e) {
                    this.points = t, this.view = e, this.text = "", this.lineSeparator = e.state.facet(s.$t.lineSeparator)
                }
                append(t) {
                    this.text += t
                }
                lineBreak() {
                    this.text += qe
                }
                readRange(t, e) {
                    if (!t) return this;
                    let i = t.parentNode;
                    for (let s = t;;) {
                        this.findPointBefore(i, s);
                        let t = this.text.length;
                        this.readNode(s);
                        let n = oe.get(s),
                            r = s.nextSibling;
                        if (r == e) {
                            (null == n ? void 0 : n.breakAfter) && !r && i != this.view.contentDOM && this.lineBreak();
                            break
                        }
                        let o = oe.get(r);
                        (n && o ? n.breakAfter : (n ? n.breakAfter : q(s)) || q(r) && ("BR" != s.nodeName || (null == n ? void 0 : n.isWidget())) && this.text.length > t) && !Xe(r, e) && this.lineBreak(), s = r
                    }
                    return this.findPointBefore(i, e), this
                }
                readTextNode(t) {
                    let e = t.nodeValue;
                    for (let i of this.points) i.node == t && (i.pos = this.text.length + Math.min(i.offset, e.length));
                    for (let i = 0, s = this.lineSeparator ? null : /\r\n?|\n/g;;) {
                        let n, r = -1,
                            o = 1;
                        if (this.lineSeparator ? (r = e.indexOf(this.lineSeparator, i), o = this.lineSeparator.length) : (n = s.exec(e)) && (r = n.index, o = n[0].length), this.append(e.slice(i, r < 0 ? e.length : r)), r < 0) break;
                        if (this.lineBreak(), o > 1)
                            for (let e of this.points) e.node == t && e.pos > this.text.length && (e.pos -= o - 1);
                        i = r + o
                    }
                }
                readNode(t) {
                    let e = oe.get(t),
                        i = e && e.overrideDOMText;
                    if (null != i) {
                        this.findPointInside(t, i.length);
                        for (let t = i.iter(); !t.next().done;) t.lineBreak ? this.lineBreak() : this.append(t.value)
                    } else 3 == t.nodeType ? this.readTextNode(t) : "BR" == t.nodeName ? t.nextSibling && this.lineBreak() : 1 == t.nodeType && this.readRange(t.firstChild, null)
                }
                findPointBefore(t, e) {
                    for (let i of this.points) i.node == t && t.childNodes[i.offset] == e && (i.pos = this.text.length)
                }
                findPointInside(t, e) {
                    for (let i of this.points)(3 == t.nodeType ? i.node == t : t.contains(i.node)) && (i.pos = this.text.length + (_e(t, i.node, i.offset) ? e : 0))
                }
            }

            function _e(t, e, i) {
                for (;;) {
                    if (!e || i < _(e)) return !1;
                    if (e == t) return !0;
                    i = j(e) + 1, e = e.parentNode
                }
            }

            function Xe(t, e) {
                let i;
                for (; t != e && t; t = t.nextSibling) {
                    let e = oe.get(t);
                    if (!(null == e ? void 0 : e.isWidget())) return !1;
                    e && (i || (i = [])).push(e)
                }
                if (i)
                    for (let t of i) {
                        let e = t.overrideDOMText;
                        if (null == e ? void 0 : e.length) return !1
                    }
                return !0
            }
            class Ye {
                constructor(t, e) {
                    this.node = t, this.offset = e, this.pos = -1
                }
            }
            class Ue {
                constructor(t, e, i, n) {
                    this.typeOver = n, this.bounds = null, this.text = "", this.domChanged = e > -1;
                    let {
                        impreciseHead: r,
                        impreciseAnchor: o
                    } = t.docView;
                    if (t.state.readOnly && e > -1) this.newSel = null;
                    else if (e > -1 && (this.bounds = Ge(t.docView.tile, e, i, 0))) {
                        let e = r || o ? [] : function(t) {
                                let e = [];
                                if (t.root.activeElement != t.contentDOM) return e;
                                let {
                                    anchorNode: i,
                                    anchorOffset: s,
                                    focusNode: n,
                                    focusOffset: r
                                } = t.observer.selectionRange;
                                return i && (e.push(new Ye(i, s)), n == i && r == s || e.push(new Ye(n, r))), e
                            }(t),
                            i = new He(e, t);
                        i.readRange(this.bounds.startDOM, this.bounds.endDOM), this.text = i.text, this.newSel = function(t, e) {
                            if (0 == t.length) return null;
                            let i = t[0].pos,
                                n = 2 == t.length ? t[1].pos : i;
                            return i > -1 && n > -1 ? s.OF.single(i + e, n + e) : null
                        }(e, this.bounds.from)
                    } else {
                        let e = t.observer.selectionRange,
                            i = r && r.node == e.focusNode && r.offset == e.focusOffset || !F(t.contentDOM, e.focusNode) ? t.state.selection.main.head : t.docView.posFromDOM(e.focusNode, e.focusOffset),
                            n = o && o.node == e.anchorNode && o.offset == e.anchorOffset || !F(t.contentDOM, e.anchorNode) ? t.state.selection.main.anchor : t.docView.posFromDOM(e.anchorNode, e.anchorOffset),
                            l = t.viewport;
                        if ((k.ios || k.chrome) && t.state.selection.main.empty && i != n && (l.from > 0 || l.to < t.state.doc.length)) {
                            let e = Math.min(i, n),
                                s = Math.max(i, n),
                                r = l.from - e,
                                o = l.to - s;
                            0 != r && 1 != r && 0 != e || 0 != o && -1 != o && s != t.state.doc.length || (i = 0, n = t.state.doc.length)
                        }
                        t.inputState.composing > -1 && t.state.selection.ranges.length > 1 ? this.newSel = t.state.selection.replaceRange(s.OF.range(n, i)) : this.newSel = s.OF.single(n, i)
                    }
                }
            }

            function Ge(t, e, i, s) {
                if (t.isComposite()) {
                    let n = -1,
                        r = -1,
                        o = -1,
                        l = -1;
                    for (let a = 0, h = s, c = s; a < t.children.length; a++) {
                        let s = t.children[a],
                            u = h + s.length;
                        if (h < e && u > i) return Ge(s, e, i, h);
                        if (u >= e && -1 == n && (n = a, r = h), h > i && s.dom.parentNode == t.dom) {
                            o = a, l = c;
                            break
                        }
                        c = u, h = u + s.breakAfter
                    }
                    return {
                        from: r,
                        to: l < 0 ? s + t.length : l,
                        startDOM: (n ? t.children[n - 1].dom.nextSibling : null) || t.dom.firstChild,
                        endDOM: o < t.children.length && o >= 0 ? t.children[o].dom : null
                    }
                }
                return t.isText() ? {
                    from: s,
                    to: s + t.length,
                    startDOM: t.dom,
                    endDOM: t.dom.nextSibling
                } : null
            }

            function Ke(t, e) {
                let i, {
                        newSel: n
                    } = e,
                    r = t.state.selection.main,
                    o = t.inputState.lastKeyTime > Date.now() - 100 ? t.inputState.lastKeyCode : -1;
                if (e.bounds) {
                    let {
                        from: n,
                        to: l
                    } = e.bounds, a = r.from, h = null;
                    (8 === o || k.android && e.text.length < l - n) && (a = r.to, h = "end");
                    let c = Je(t.state.doc.sliceString(n, l, qe), e.text, a - n, h);
                    c && (k.chrome && 13 == o && c.toB == c.from + 2 && e.text.slice(c.from, c.toB) == qe + qe && c.toB--, i = {
                        from: n + c.from,
                        to: n + c.toA,
                        insert: s.EY.of(e.text.slice(c.from, c.toB).split(qe))
                    })
                } else n && (!t.hasFocus && t.state.facet(Wt) || ti(n, r)) && (n = null);
                if (!i && !n) return !1;
                if (!i && e.typeOver && !r.empty && n && n.main.empty ? i = {
                        from: r.from,
                        to: r.to,
                        insert: t.state.doc.slice(r.from, r.to)
                    } : (k.mac || k.android) && i && i.from == i.to && i.from == r.head - 1 && /^\. ?$/.test(i.insert.toString()) && "off" == t.contentDOM.getAttribute("autocorrect") ? (n && 2 == i.insert.length && (n = s.OF.single(n.main.anchor - 1, n.main.head - 1)), i = {
                        from: i.from,
                        to: i.to,
                        insert: s.EY.of([i.insert.toString().replace(".", " ")])
                    }) : i && i.from >= r.from && i.to <= r.to && (i.from != r.from || i.to != r.to) && r.to - r.from - (i.to - i.from) <= 4 ? i = {
                        from: r.from,
                        to: r.to,
                        insert: t.state.doc.slice(r.from, i.from).append(i.insert).append(t.state.doc.slice(i.to, r.to))
                    } : t.state.doc.lineAt(r.from).to < r.to && t.docView.lineHasWidget(r.to) && t.inputState.insertingTextAt > Date.now() - 50 ? i = {
                        from: r.from,
                        to: r.to,
                        insert: t.state.toText(t.inputState.insertingText)
                    } : k.chrome && i && i.from == i.to && i.from == r.head && "\n " == i.insert.toString() && t.lineWrapping && (n && (n = s.OF.single(n.main.anchor - 1, n.main.head - 1)), i = {
                        from: r.from,
                        to: r.to,
                        insert: s.EY.of([" "])
                    }), i) return Ze(t, i, n, o);
                if (n && !ti(n, r)) {
                    let e = !1,
                        i = "select";
                    return t.inputState.lastSelectionTime > Date.now() - 50 && ("select" == t.inputState.lastSelectionOrigin && (e = !0), i = t.inputState.lastSelectionOrigin, "select.pointer" == i && (n = ze(t.state.facet(Kt).map(e => e(t)), n))), t.dispatch({
                        selection: n,
                        scrollIntoView: e,
                        userEvent: i
                    }), !0
                }
                return !1
            }

            function Ze(t, e, i, n = -1) {
                if (k.ios && t.inputState.flushIOSKey(e)) return !0;
                let r = t.state.selection.main;
                if (k.android && (e.to == r.to && (e.from == r.from || e.from == r.from - 1 && " " == t.state.sliceDoc(e.from, r.from)) && 1 == e.insert.length && 2 == e.insert.lines && et(t.contentDOM, "Enter", 13) || (e.from == r.from - 1 && e.to == r.to && 0 == e.insert.length || 8 == n && e.insert.length < e.to - e.from && e.to > r.head) && et(t.contentDOM, "Backspace", 8) || e.from == r.from && e.to == r.to + 1 && 0 == e.insert.length && et(t.contentDOM, "Delete", 46))) return !0;
                let o, l = e.insert.toString();
                t.inputState.composing >= 0 && t.inputState.composing++;
                let a = () => o || (o = function(t, e, i) {
                    let n, r = t.state,
                        o = r.selection.main,
                        l = -1;
                    if (e.from == e.to && e.from < o.from || e.from > o.to) {
                        let i = e.from < o.from ? -1 : 1,
                            s = i < 0 ? o.from : o.to,
                            n = Ie(r.facet(Kt).map(e => e(t)), s, i);
                        e.from == n && (l = n)
                    }
                    if (l > -1) n = {
                        changes: e,
                        selection: s.OF.cursor(e.from + e.insert.length, -1)
                    };
                    else if (e.from >= o.from && e.to <= o.to && e.to - e.from >= (o.to - o.from) / 3 && (!i || i.main.empty && i.main.from == e.from + e.insert.length) && t.inputState.composing < 0) {
                        let i = o.from < e.from ? r.sliceDoc(o.from, e.from) : "",
                            s = o.to > e.to ? r.sliceDoc(e.to, o.to) : "";
                        n = r.replaceSelection(t.state.toText(i + e.insert.sliceString(0, void 0, t.state.lineBreak) + s))
                    } else {
                        let l = r.changes(e),
                            a = i && i.main.to <= l.newLength ? i.main : void 0;
                        if (r.selection.ranges.length > 1 && (t.inputState.composing >= 0 || t.inputState.compositionPendingChange) && e.to <= o.to + 10 && e.to >= o.to - 10) {
                            let h, c = t.state.sliceDoc(e.from, e.to),
                                u = i && De(t, i.main.head);
                            if (u) {
                                let t = e.insert.length - (e.to - e.from);
                                h = {
                                    from: u.from,
                                    to: u.to - t
                                }
                            } else h = t.state.doc.lineAt(o.head);
                            let d = o.to - e.to;
                            n = r.changeByRange(i => {
                                if (i.from == o.from && i.to == o.to) return {
                                    changes: l,
                                    range: a || i.map(l)
                                };
                                let n = i.to - d,
                                    u = n - c.length;
                                if (t.state.sliceDoc(u, n) != c || n >= h.from && u <= h.to) return {
                                    range: i
                                };
                                let f = r.changes({
                                        from: u,
                                        to: n,
                                        insert: e.insert
                                    }),
                                    p = i.to - o.to;
                                return {
                                    changes: f,
                                    range: a ? s.OF.range(Math.max(0, a.anchor + p), Math.max(0, a.head + p)) : i.map(f)
                                }
                            })
                        } else n = {
                            changes: l,
                            selection: a && r.selection.replaceRange(a)
                        }
                    }
                    let a = "input.type";
                    return (t.composing || t.inputState.compositionPendingChange && t.inputState.compositionEndedAt > Date.now() - 50) && (t.inputState.compositionPendingChange = !1, a += ".compose", t.inputState.compositionFirstChange && (a += ".start", t.inputState.compositionFirstChange = !1)), r.update(n, {
                        userEvent: a,
                        scrollIntoView: !0
                    })
                }(t, e, i));
                return t.state.facet(Pt).some(i => i(t, e.from, e.to, l, a)) || t.dispatch(a()), !0
            }

            function Je(t, e, i, s) {
                let n = Math.min(t.length, e.length),
                    r = 0;
                for (; r < n && t.charCodeAt(r) == e.charCodeAt(r);) r++;
                if (r == n && t.length == e.length) return null;
                let o = t.length,
                    l = e.length;
                for (; o > 0 && l > 0 && t.charCodeAt(o - 1) == e.charCodeAt(l - 1);) o--, l--;
                return "end" == s && (i -= o + Math.max(0, r - Math.min(o, l)) - r), o < r && t.length < e.length ? (r -= i <= r && i >= o ? r - i : 0, l = r + (l - o), o = r) : l < r && (r -= i <= r && i >= l ? r - i : 0, o = r + (o - l), l = r), {
                    from: r,
                    toA: o,
                    toB: l
                }
            }

            function ti(t, e) {
                return e.head == t.main.head && e.anchor == t.main.anchor
            }
            class ei {
                setSelectionOrigin(t) {
                    this.lastSelectionOrigin = t, this.lastSelectionTime = Date.now()
                }
                constructor(t) {
                    this.view = t, this.lastKeyCode = 0, this.lastKeyTime = 0, this.lastTouchTime = 0, this.lastFocusTime = 0, this.lastScrollTop = 0, this.lastScrollLeft = 0, this.pendingIOSKey = void 0, this.tabFocusMode = -1, this.lastSelectionOrigin = null, this.lastSelectionTime = 0, this.lastContextMenu = 0, this.scrollHandlers = [], this.handlers = Object.create(null), this.composing = -1, this.compositionFirstChange = null, this.compositionEndedAt = 0, this.compositionPendingKey = !1, this.compositionPendingChange = !1, this.insertingText = "", this.insertingTextAt = 0, this.mouseSelection = null, this.draggedContent = null, this.handleEvent = this.handleEvent.bind(this), this.notifiedFocused = t.hasFocus, k.safari && t.contentDOM.addEventListener("input", () => null), k.gecko && function(t) {
                        Ci.has(t) || (Ci.add(t), t.addEventListener("copy", () => {}), t.addEventListener("cut", () => {}))
                    }(t.contentDOM.ownerDocument)
                }
                handleEvent(t) {
                    (function(t, e) {
                        if (!e.bubbles) return !0;
                        if (e.defaultPrevented) return !1;
                        for (let i, s = e.target; s != t.contentDOM; s = s.parentNode)
                            if (!s || 11 == s.nodeType || (i = oe.get(s)) && i.isWidget() && !i.isHidden && i.widget.ignoreEvent(e)) return !1;
                        return !0
                    })(this.view, t) && !this.ignoreDuringComposition(t) && ("keydown" == t.type && this.keydown(t) || (0 != this.view.updateState ? Promise.resolve().then(() => this.runHandlers(t.type, t)) : this.runHandlers(t.type, t)))
                }
                runHandlers(t, e) {
                    let i = this.handlers[t];
                    if (i) {
                        for (let t of i.observers) t(this.view, e);
                        for (let t of i.handlers) {
                            if (e.defaultPrevented) break;
                            if (t(this.view, e)) {
                                e.preventDefault();
                                break
                            }
                        }
                    }
                }
                ensureHandlers(t) {
                    let e = si(t),
                        i = this.handlers,
                        s = this.view.contentDOM;
                    for (let t in e)
                        if ("scroll" != t) {
                            let n = !e[t].handlers.length,
                                r = i[t];
                            r && n != !r.handlers.length && (s.removeEventListener(t, this.handleEvent), r = null), r || s.addEventListener(t, this.handleEvent, {
                                passive: n
                            })
                        } for (let t in i) "scroll" == t || e[t] || s.removeEventListener(t, this.handleEvent);
                    this.handlers = e
                }
                keydown(t) {
                    if (this.lastKeyCode = t.keyCode, this.lastKeyTime = Date.now(), 9 == t.keyCode && this.tabFocusMode > -1 && (!this.tabFocusMode || Date.now() <= this.tabFocusMode)) return !0;
                    if (this.tabFocusMode > 0 && 27 != t.keyCode && oi.indexOf(t.keyCode) < 0 && (this.tabFocusMode = -1), k.android && k.chrome && !t.synthetic && (13 == t.keyCode || 8 == t.keyCode)) return this.view.observer.delayAndroidKey(t.key, t.keyCode), !0;
                    let e;
                    return !k.ios || t.synthetic || t.altKey || t.metaKey || !((e = ni.find(e => e.keyCode == t.keyCode)) && !t.ctrlKey || ri.indexOf(t.key) > -1 && t.ctrlKey && !t.shiftKey) ? (229 != t.keyCode && this.view.observer.forceFlush(), !1) : (this.pendingIOSKey = e || t, setTimeout(() => this.flushIOSKey(), 250), !0)
                }
                flushIOSKey(t) {
                    let e = this.pendingIOSKey;
                    return !!e && !("Enter" == e.key && t && t.from < t.to && /^\S+$/.test(t.insert.toString())) && (this.pendingIOSKey = void 0, et(this.view.contentDOM, e.key, e.keyCode, e instanceof KeyboardEvent ? e : void 0))
                }
                ignoreDuringComposition(t) {
                    return !(!/^key/.test(t.type) || t.synthetic) && (this.composing > 0 || !!(k.safari && !k.ios && this.compositionPendingKey && Date.now() - this.compositionEndedAt < 100) && (this.compositionPendingKey = !1, !0))
                }
                startMouseSelection(t) {
                    this.mouseSelection && this.mouseSelection.destroy(), this.mouseSelection = t
                }
                update(t) {
                    this.view.observer.update(t), this.mouseSelection && this.mouseSelection.update(t), this.draggedContent && t.docChanged && (this.draggedContent = this.draggedContent.map(t.changes)), t.transactions.length && (this.lastKeyCode = this.lastSelectionTime = 0)
                }
                destroy() {
                    this.mouseSelection && this.mouseSelection.destroy()
                }
            }

            function ii(t, e) {
                return (i, s) => {
                    try {
                        return e.call(t, s, i)
                    } catch (t) {
                        $t(i.state, t)
                    }
                }
            }

            function si(t) {
                let e = Object.create(null);

                function i(t) {
                    return e[t] || (e[t] = {
                        observers: [],
                        handlers: []
                    })
                }
                for (let e of t) {
                    let t = e.spec,
                        s = t && t.plugin.domEventHandlers,
                        n = t && t.plugin.domEventObservers;
                    if (s)
                        for (let t in s) {
                            let n = s[t];
                            n && i(t).handlers.push(ii(e.value, n))
                        }
                    if (n)
                        for (let t in n) {
                            let s = n[t];
                            s && i(t).observers.push(ii(e.value, s))
                        }
                }
                for (let t in hi) i(t).handlers.push(hi[t]);
                for (let t in ci) i(t).observers.push(ci[t]);
                return e
            }
            const ni = [{
                    key: "Backspace",
                    keyCode: 8,
                    inputType: "deleteContentBackward"
                }, {
                    key: "Enter",
                    keyCode: 13,
                    inputType: "insertParagraph"
                }, {
                    key: "Enter",
                    keyCode: 13,
                    inputType: "insertLineBreak"
                }, {
                    key: "Delete",
                    keyCode: 46,
                    inputType: "deleteContentForward"
                }],
                ri = "dthko",
                oi = [16, 17, 18, 20, 91, 92, 224, 225];

            function li(t) {
                return .7 * Math.max(0, t) + 8
            }
            class ai {
                constructor(t, e, i, n) {
                    this.view = t, this.startEvent = e, this.style = i, this.mustSelect = n, this.scrollSpeed = {
                        x: 0,
                        y: 0
                    }, this.scrolling = -1, this.lastEvent = e, this.scrollParents = function(t) {
                        let e, i, s = t.ownerDocument;
                        for (let n = t.parentNode; n && !(n == s.body || e && i);)
                            if (1 == n.nodeType) !i && n.scrollHeight > n.clientHeight && (i = n), !e && n.scrollWidth > n.clientWidth && (e = n), n = n.assignedSlot || n.parentNode;
                            else {
                                if (11 != n.nodeType) break;
                                n = n.host
                            } return {
                            x: e,
                            y: i
                        }
                    }(t.contentDOM), this.atoms = t.state.facet(Kt).map(e => e(t));
                    let r = t.contentDOM.ownerDocument;
                    r.addEventListener("mousemove", this.move = this.move.bind(this)), r.addEventListener("mouseup", this.up = this.up.bind(this)), this.extend = e.shiftKey, this.multiple = t.state.facet(s.$t.allowMultipleSelections) && function(t, e) {
                        let i = t.state.facet(Ct);
                        return i.length ? i[0](e) : k.mac ? e.metaKey : e.ctrlKey
                    }(t, e), this.dragging = !(! function(t, e) {
                        let {
                            main: i
                        } = t.state.selection;
                        if (i.empty) return !1;
                        let s = z(t.root);
                        if (!s || 0 == s.rangeCount) return !0;
                        let n = s.getRangeAt(0).getClientRects();
                        for (let t = 0; t < n.length; t++) {
                            let i = n[t];
                            if (i.left <= e.clientX && i.right >= e.clientX && i.top <= e.clientY && i.bottom >= e.clientY) return !0
                        }
                        return !1
                    }(t, e) || 1 != wi(e)) && null
                }
                start(t) {
                    !1 === this.dragging && this.select(t)
                }
                move(t) {
                    if (0 == t.buttons) return this.destroy();
                    if (this.dragging || null == this.dragging && (e = this.startEvent, i = t, Math.max(Math.abs(e.clientX - i.clientX), Math.abs(e.clientY - i.clientY)) < 10)) return;
                    var e, i;
                    this.select(this.lastEvent = t);
                    let s = 0,
                        n = 0,
                        r = 0,
                        o = 0,
                        l = this.view.win.innerWidth,
                        a = this.view.win.innerHeight;
                    this.scrollParents.x && ({
                        left: r,
                        right: l
                    } = this.scrollParents.x.getBoundingClientRect()), this.scrollParents.y && ({
                        top: o,
                        bottom: a
                    } = this.scrollParents.y.getBoundingClientRect());
                    let h = ee(this.view);
                    t.clientX - h.left <= r + 6 ? s = -li(r - t.clientX) : t.clientX + h.right >= l - 6 && (s = li(t.clientX - l)), t.clientY - h.top <= o + 6 ? n = -li(o - t.clientY) : t.clientY + h.bottom >= a - 6 && (n = li(t.clientY - a)), this.setScrollSpeed(s, n)
                }
                up(t) {
                    null == this.dragging && this.select(this.lastEvent), this.dragging || t.preventDefault(), this.destroy()
                }
                destroy() {
                    this.setScrollSpeed(0, 0);
                    let t = this.view.contentDOM.ownerDocument;
                    t.removeEventListener("mousemove", this.move), t.removeEventListener("mouseup", this.up), this.view.inputState.mouseSelection = this.view.inputState.draggedContent = null
                }
                setScrollSpeed(t, e) {
                    this.scrollSpeed = {
                        x: t,
                        y: e
                    }, t || e ? this.scrolling < 0 && (this.scrolling = setInterval(() => this.scroll(), 50)) : this.scrolling > -1 && (clearInterval(this.scrolling), this.scrolling = -1)
                }
                scroll() {
                    let {
                        x: t,
                        y: e
                    } = this.scrollSpeed;
                    t && this.scrollParents.x && (this.scrollParents.x.scrollLeft += t, t = 0), e && this.scrollParents.y && (this.scrollParents.y.scrollTop += e, e = 0), (t || e) && this.view.win.scrollBy(t, e), !1 === this.dragging && this.select(this.lastEvent)
                }
                select(t) {
                    let {
                        view: e
                    } = this, i = ze(this.atoms, this.style.get(t, this.extend, this.multiple));
                    !this.mustSelect && i.eq(e.state.selection, !1 === this.dragging) || this.view.dispatch({
                        selection: i,
                        userEvent: "select.pointer"
                    }), this.mustSelect = !1
                }
                update(t) {
                    t.transactions.some(t => t.isUserEvent("input.type")) ? this.destroy() : this.style.update(t) && setTimeout(() => this.select(this.lastEvent), 20)
                }
            }
            const hi = Object.create(null),
                ci = Object.create(null),
                ui = k.ie && k.ie_version < 15 || k.ios && k.webkit_version < 604;

            function di(t, e, i) {
                for (let s of t.facet(e)) i = s(i, t);
                return i
            }

            function fi(t, e) {
                e = di(t.state, Rt, e);
                let i, {
                        state: n
                    } = t,
                    r = 1,
                    o = n.toText(e),
                    l = o.lines == n.selection.ranges.length;
                if (null != Oi && n.selection.ranges.every(t => t.empty) && Oi == o.toString()) {
                    let t = -1;
                    i = n.changeByRange(i => {
                        let a = n.doc.lineAt(i.from);
                        if (a.from == t) return {
                            range: i
                        };
                        t = a.from;
                        let h = n.toText((l ? o.line(r++).text : e) + n.lineBreak);
                        return {
                            changes: {
                                from: a.from,
                                insert: h
                            },
                            range: s.OF.cursor(i.from + h.length)
                        }
                    })
                } else i = l ? n.changeByRange(t => {
                    let e = o.line(r++);
                    return {
                        changes: {
                            from: t.from,
                            to: t.to,
                            insert: e.text
                        },
                        range: s.OF.cursor(t.from + e.length)
                    }
                }) : n.replaceSelection(o);
                t.dispatch(i, {
                    userEvent: "input.paste",
                    scrollIntoView: !0
                })
            }

            function pi(t, e, i, n) {
                if (1 == n) return s.OF.cursor(e, i);
                if (2 == n) return function(t, e, i = 1) {
                    let n = t.charCategorizer(e),
                        r = t.doc.lineAt(e),
                        o = e - r.from;
                    if (0 == r.length) return s.OF.cursor(e);
                    0 == o ? i = 1 : o == r.length && (i = -1);
                    let l = o,
                        a = o;
                    i < 0 ? l = (0, s.zK)(r.text, o, !1) : a = (0, s.zK)(r.text, o);
                    let h = n(r.text.slice(l, a));
                    for (; l > 0;) {
                        let t = (0, s.zK)(r.text, l, !1);
                        if (n(r.text.slice(t, l)) != h) break;
                        l = t
                    }
                    for (; a < r.length;) {
                        let t = (0, s.zK)(r.text, a);
                        if (n(r.text.slice(a, t)) != h) break;
                        a = t
                    }
                    return s.OF.range(l + r.from, a + r.from)
                }(t.state, e, i);
                {
                    let n = t.docView.lineAt(e, i),
                        r = t.state.doc.lineAt(n ? n.posAtEnd : e),
                        o = n ? n.posAtStart : r.from,
                        l = n ? n.posAtEnd : r.to;
                    return l < t.state.doc.length && l == r.to && l++, s.OF.range(o, l)
                }
            }
            ci.scroll = t => {
                t.inputState.lastScrollTop = t.scrollDOM.scrollTop, t.inputState.lastScrollLeft = t.scrollDOM.scrollLeft
            }, hi.keydown = (t, e) => (t.inputState.setSelectionOrigin("select"), 27 == e.keyCode && 0 != t.inputState.tabFocusMode && (t.inputState.tabFocusMode = Date.now() + 2e3), !1), ci.touchstart = (t, e) => {
                t.inputState.lastTouchTime = Date.now(), t.inputState.setSelectionOrigin("select.pointer")
            }, ci.touchmove = t => {
                t.inputState.setSelectionOrigin("select.pointer")
            }, hi.mousedown = (t, e) => {
                if (t.observer.flush(), t.inputState.lastTouchTime > Date.now() - 2e3) return !1;
                let i = null;
                for (let s of t.state.facet(Mt))
                    if (i = s(t, e), i) break;
                if (i || 0 != e.button || (i = function(t, e) {
                        let i = t.posAndSideAtCoords({
                                x: e.clientX,
                                y: e.clientY
                            }, !1),
                            n = wi(e),
                            r = t.state.selection;
                        return {
                            update(t) {
                                t.docChanged && (i.pos = t.changes.mapPos(i.pos), r = r.map(t.changes))
                            },
                            get(e, o, l) {
                                let a, h = t.posAndSideAtCoords({
                                        x: e.clientX,
                                        y: e.clientY
                                    }, !1),
                                    c = pi(t, h.pos, h.assoc, n);
                                if (i.pos != h.pos && !o) {
                                    let e = pi(t, i.pos, i.assoc, n),
                                        r = Math.min(e.from, c.from),
                                        o = Math.max(e.to, c.to);
                                    c = r < c.from ? s.OF.range(r, o) : s.OF.range(o, r)
                                }
                                return o ? r.replaceRange(r.main.extend(c.from, c.to)) : l && 1 == n && r.ranges.length > 1 && (a = function(t, e) {
                                    for (let i = 0; i < t.ranges.length; i++) {
                                        let {
                                            from: n,
                                            to: r
                                        } = t.ranges[i];
                                        if (n <= e && r >= e) return s.OF.create(t.ranges.slice(0, i).concat(t.ranges.slice(i + 1)), t.mainIndex == i ? 0 : t.mainIndex - (t.mainIndex > i ? 1 : 0))
                                    }
                                    return null
                                }(r, h.pos)) ? a : l ? r.addRange(c) : s.OF.create([c])
                            }
                        }
                    }(t, e)), i) {
                    let s = !t.hasFocus;
                    t.inputState.startMouseSelection(new ai(t, e, i, s)), s && t.observer.ignore(() => {
                        J(t.contentDOM);
                        let e = t.root.activeElement;
                        e && !e.contains(t.contentDOM) && e.blur()
                    });
                    let n = t.inputState.mouseSelection;
                    if (n) return n.start(e), !1 === n.dragging
                } else t.inputState.setSelectionOrigin("select.pointer");
                return !1
            };
            const mi = k.ie && k.ie_version <= 11;
            let gi = null,
                vi = 0,
                bi = 0;

            function wi(t) {
                if (!mi) return t.detail;
                let e = gi,
                    i = bi;
                return gi = t, bi = Date.now(), vi = !e || i > Date.now() - 400 && Math.abs(e.clientX - t.clientX) < 2 && Math.abs(e.clientY - t.clientY) < 2 ? (vi + 1) % 3 : 1
            }

            function yi(t, e, i, s) {
                if (!(i = di(t.state, Rt, i))) return;
                let n = t.posAtCoords({
                        x: e.clientX,
                        y: e.clientY
                    }, !1),
                    {
                        draggedContent: r
                    } = t.inputState,
                    o = s && r && function(t, e) {
                        let i = t.state.facet(At);
                        return i.length ? i[0](e) : k.mac ? !e.altKey : !e.ctrlKey
                    }(t, e) ? {
                        from: r.from,
                        to: r.to
                    } : null,
                    l = {
                        from: n,
                        insert: i
                    },
                    a = t.state.changes(o ? [o, l] : l);
                t.focus(), t.dispatch({
                    changes: a,
                    selection: {
                        anchor: a.mapPos(n, -1),
                        head: a.mapPos(n, 1)
                    },
                    userEvent: o ? "move.drop" : "input.drop"
                }), t.inputState.draggedContent = null
            }
            hi.dragstart = (t, e) => {
                let {
                    selection: {
                        main: i
                    }
                } = t.state;
                if (e.target.draggable) {
                    let n = t.docView.tile.nearest(e.target);
                    if (n && n.isWidget()) {
                        let t = n.posAtStart,
                            e = t + n.length;
                        (t >= i.to || e <= i.from) && (i = s.OF.range(t, e))
                    }
                }
                let {
                    inputState: n
                } = t;
                return n.mouseSelection && (n.mouseSelection.dragging = !0), n.draggedContent = i, e.dataTransfer && (e.dataTransfer.setData("Text", di(t.state, Et, t.state.sliceDoc(i.from, i.to))), e.dataTransfer.effectAllowed = "copyMove"), !1
            }, hi.dragend = t => (t.inputState.draggedContent = null, !1), hi.drop = (t, e) => {
                if (!e.dataTransfer) return !1;
                if (t.state.readOnly) return !0;
                let i = e.dataTransfer.files;
                if (i && i.length) {
                    let s = Array(i.length),
                        n = 0,
                        r = () => {
                            ++n == i.length && yi(t, e, s.filter(t => null != t).join(t.state.lineBreak), !1)
                        };
                    for (let t = 0; t < i.length; t++) {
                        let e = new FileReader;
                        e.onerror = r, e.onload = () => {
                            /[\x00-\x08\x0e-\x1f]{2}/.test(e.result) || (s[t] = e.result), r()
                        }, e.readAsText(i[t])
                    }
                    return !0
                } {
                    let i = e.dataTransfer.getData("Text");
                    if (i) return yi(t, e, i, !0), !0
                }
                return !1
            }, hi.paste = (t, e) => {
                if (t.state.readOnly) return !0;
                t.observer.flush();
                let i = ui ? null : e.clipboardData;
                return i ? (fi(t, i.getData("text/plain") || i.getData("text/uri-list")), !0) : (function(t) {
                    let e = t.dom.parentNode;
                    if (!e) return;
                    let i = e.appendChild(document.createElement("textarea"));
                    i.style.cssText = "position: fixed; left: -10000px; top: 10px", i.focus(), setTimeout(() => {
                        t.focus(), i.remove(), fi(t, i.value)
                    }, 50)
                }(t), !1)
            };
            let Oi = null;
            hi.copy = hi.cut = (t, e) => {
                let i = z(t.root);
                if (i && !$(t.contentDOM, i)) return !1;
                let {
                    text: s,
                    ranges: n,
                    linewise: r
                } = function(t) {
                    let e = [],
                        i = [],
                        s = !1;
                    for (let s of t.selection.ranges) s.empty || (e.push(t.sliceDoc(s.from, s.to)), i.push(s));
                    if (!e.length) {
                        let n = -1;
                        for (let {
                                from: s
                            }
                            of t.selection.ranges) {
                            let r = t.doc.lineAt(s);
                            r.number > n && (e.push(r.text), i.push({
                                from: r.from,
                                to: Math.min(t.doc.length, r.to + 1)
                            })), n = r.number
                        }
                        s = !0
                    }
                    return {
                        text: di(t, Et, e.join(t.lineBreak)),
                        ranges: i,
                        linewise: s
                    }
                }(t.state);
                if (!s && !r) return !1;
                Oi = r ? s : null, "cut" != e.type || t.state.readOnly || t.dispatch({
                    changes: n,
                    scrollIntoView: !0,
                    userEvent: "delete.cut"
                });
                let o = ui ? null : e.clipboardData;
                return o ? (o.clearData(), o.setData("text/plain", s), !0) : (function(t, e) {
                    let i = t.dom.parentNode;
                    if (!i) return;
                    let s = i.appendChild(document.createElement("textarea"));
                    s.style.cssText = "position: fixed; left: -10000px; top: 10px", s.value = e, s.focus(), s.selectionEnd = e.length, s.selectionStart = 0, setTimeout(() => {
                        s.remove(), t.focus()
                    }, 50)
                }(t, s), !1)
            };
            const xi = s.YH.define();

            function ki(t, e) {
                let i = [];
                for (let s of t.facet(Dt)) {
                    let n = s(t, e);
                    n && i.push(n)
                }
                return i.length ? t.update({
                    effects: i,
                    annotations: xi.of(!0)
                }) : null
            }

            function Si(t) {
                setTimeout(() => {
                    let e = t.hasFocus;
                    if (e != t.inputState.notifiedFocused) {
                        let i = ki(t.state, e);
                        i ? t.dispatch(i) : t.update([])
                    }
                }, 10)
            }
            ci.focus = t => {
                t.inputState.lastFocusTime = Date.now(), t.scrollDOM.scrollTop || !t.inputState.lastScrollTop && !t.inputState.lastScrollLeft || (t.scrollDOM.scrollTop = t.inputState.lastScrollTop, t.scrollDOM.scrollLeft = t.inputState.lastScrollLeft), Si(t)
            }, ci.blur = t => {
                t.observer.clearSelectionRange(), Si(t)
            }, ci.compositionstart = ci.compositionupdate = t => {
                t.observer.editContext || (null == t.inputState.compositionFirstChange && (t.inputState.compositionFirstChange = !0), t.inputState.composing < 0 && (t.inputState.composing = 0))
            }, ci.compositionend = t => {
                t.observer.editContext || (t.inputState.composing = -1, t.inputState.compositionEndedAt = Date.now(), t.inputState.compositionPendingKey = !0, t.inputState.compositionPendingChange = t.observer.pendingRecords().length > 0, t.inputState.compositionFirstChange = null, k.chrome && k.android ? t.observer.flushSoon() : t.inputState.compositionPendingChange ? Promise.resolve().then(() => t.observer.flush()) : setTimeout(() => {
                    t.inputState.composing < 0 && t.docView.hasComposition && t.update([])
                }, 50))
            }, ci.contextmenu = t => {
                t.inputState.lastContextMenu = Date.now()
            }, hi.beforeinput = (t, e) => {
                var i, s;
                if ("insertText" != e.inputType && "insertCompositionText" != e.inputType || (t.inputState.insertingText = e.data, t.inputState.insertingTextAt = Date.now()), "insertReplacementText" == e.inputType && t.observer.editContext) {
                    let s = null === (i = e.dataTransfer) || void 0 === i ? void 0 : i.getData("text/plain"),
                        n = e.getTargetRanges();
                    if (s && n.length) {
                        let e = n[0],
                            i = t.posAtDOM(e.startContainer, e.startOffset),
                            r = t.posAtDOM(e.endContainer, e.endOffset);
                        return Ze(t, {
                            from: i,
                            to: r,
                            insert: t.state.toText(s)
                        }, null), !0
                    }
                }
                let n;
                if (k.chrome && k.android && (n = ni.find(t => t.inputType == e.inputType)) && (t.observer.delayAndroidKey(n.key, n.keyCode), "Backspace" == n.key || "Delete" == n.key)) {
                    let e = (null === (s = window.visualViewport) || void 0 === s ? void 0 : s.height) || 0;
                    setTimeout(() => {
                        var i;
                        ((null === (i = window.visualViewport) || void 0 === i ? void 0 : i.height) || 0) > e + 10 && t.hasFocus && (t.contentDOM.blur(), t.focus())
                    }, 100)
                }
                return k.ios && "deleteContentForward" == e.inputType && t.observer.flushSoon(), k.safari && "insertText" == e.inputType && t.inputState.composing >= 0 && setTimeout(() => ci.compositionend(t, e), 20), !1
            };
            const Ci = new Set,
                Ai = ["pre-wrap", "normal", "pre-line", "break-spaces"];
            let Mi = !1;

            function Qi() {
                Mi = !1
            }
            class Ti {
                constructor(t) {
                    this.lineWrapping = t, this.doc = s.EY.empty, this.heightSamples = {}, this.lineHeight = 14, this.charWidth = 7, this.textHeight = 14, this.lineLength = 30
                }
                heightForGap(t, e) {
                    let i = this.doc.lineAt(e).number - this.doc.lineAt(t).number + 1;
                    return this.lineWrapping && (i += Math.max(0, Math.ceil((e - t - i * this.lineLength * .5) / this.lineLength))), this.lineHeight * i
                }
                heightForLine(t) {
                    return this.lineWrapping ? (1 + Math.max(0, Math.ceil((t - this.lineLength) / Math.max(1, this.lineLength - 5)))) * this.lineHeight : this.lineHeight
                }
                setDoc(t) {
                    return this.doc = t, this
                }
                mustRefreshForWrapping(t) {
                    return Ai.indexOf(t) > -1 != this.lineWrapping
                }
                mustRefreshForHeights(t) {
                    let e = !1;
                    for (let i = 0; i < t.length; i++) {
                        let s = t[i];
                        s < 0 ? i++ : this.heightSamples[Math.floor(10 * s)] || (e = !0, this.heightSamples[Math.floor(10 * s)] = !0)
                    }
                    return e
                }
                refresh(t, e, i, s, n, r) {
                    let o = Ai.indexOf(t) > -1,
                        l = Math.abs(e - this.lineHeight) > .3 || this.lineWrapping != o || Math.abs(i - this.charWidth) > .1;
                    if (this.lineWrapping = o, this.lineHeight = e, this.charWidth = i, this.textHeight = s, this.lineLength = n, l) {
                        this.heightSamples = {};
                        for (let t = 0; t < r.length; t++) {
                            let e = r[t];
                            e < 0 ? t++ : this.heightSamples[Math.floor(10 * e)] = !0
                        }
                    }
                    return l
                }
            }
            class Pi {
                constructor(t, e) {
                    this.from = t, this.heights = e, this.index = 0
                }
                get more() {
                    return this.index < this.heights.length
                }
            }
            class Di {
                constructor(t, e, i, s, n) {
                    this.from = t, this.length = e, this.top = i, this.height = s, this._content = n
                }
                get type() {
                    return "number" == typeof this._content ? P.Text : Array.isArray(this._content) ? this._content : this._content.type
                }
                get to() {
                    return this.from + this.length
                }
                get bottom() {
                    return this.top + this.height
                }
                get widget() {
                    return this._content instanceof B ? this._content.widget : null
                }
                get widgetLineBreaks() {
                    return "number" == typeof this._content ? this._content : 0
                }
                join(t) {
                    let e = (Array.isArray(this._content) ? this._content : [this]).concat(Array.isArray(t._content) ? t._content : [t]);
                    return new Di(this.from, this.length + t.length, this.top, this.height + t.height, e)
                }
            }
            var Ri = function(t) {
                return t[t.ByPos = 0] = "ByPos", t[t.ByHeight = 1] = "ByHeight", t[t.ByPosNoHeight = 2] = "ByPosNoHeight", t
            }(Ri || (Ri = {}));
            const Ei = .001;
            class Bi {
                constructor(t, e, i = 2) {
                    this.length = t, this.height = e, this.flags = i
                }
                get outdated() {
                    return (2 & this.flags) > 0
                }
                set outdated(t) {
                    this.flags = (t ? 2 : 0) | -3 & this.flags
                }
                setHeight(t) {
                    this.height != t && (Math.abs(this.height - t) > Ei && (Mi = !0), this.height = t)
                }
                replace(t, e, i) {
                    return Bi.of(i)
                }
                decomposeLeft(t, e) {
                    e.push(this)
                }
                decomposeRight(t, e) {
                    e.push(this)
                }
                applyChanges(t, e, i, s) {
                    let n = this,
                        r = i.doc;
                    for (let o = s.length - 1; o >= 0; o--) {
                        let {
                            fromA: l,
                            toA: a,
                            fromB: h,
                            toB: c
                        } = s[o], u = n.lineAt(l, Ri.ByPosNoHeight, i.setDoc(e), 0, 0), d = u.to >= a ? u : n.lineAt(a, Ri.ByPosNoHeight, i, 0, 0);
                        for (c += d.to - a, a = d.to; o > 0 && u.from <= s[o - 1].toA;) l = s[o - 1].fromA, h = s[o - 1].fromB, o--, l < u.from && (u = n.lineAt(l, Ri.ByPosNoHeight, i, 0, 0));
                        h += u.from - l, l = u.from;
                        let f = Vi.build(i.setDoc(r), t, h, c);
                        n = Li(n, n.replace(l, a, f))
                    }
                    return n.updateHeight(i, 0)
                }
                static empty() {
                    return new zi(0, 0, 0)
                }
                static of (t) {
                    if (1 == t.length) return t[0];
                    let e = 0,
                        i = t.length,
                        s = 0,
                        n = 0;
                    for (;;)
                        if (e == i)
                            if (s > 2 * n) {
                                let n = t[e - 1];
                                n.break ? t.splice(--e, 1, n.left, null, n.right) : t.splice(--e, 1, n.left, n.right), i += 1 + n.break, s -= n.size
                            } else {
                                if (!(n > 2 * s)) break;
                                {
                                    let e = t[i];
                                    e.break ? t.splice(i, 1, e.left, null, e.right) : t.splice(i, 1, e.left, e.right), i += 2 + e.break, n -= e.size
                                }
                            }
                    else if (s < n) {
                        let i = t[e++];
                        i && (s += i.size)
                    } else {
                        let e = t[--i];
                        e && (n += e.size)
                    }
                    let r = 0;
                    return null == t[e - 1] ? (r = 1, e--) : null == t[e] && (r = 1, i++), new $i(Bi.of(t.slice(0, e)), r, Bi.of(t.slice(i)))
                }
            }

            function Li(t, e) {
                return t == e ? t : (t.constructor != e.constructor && (Mi = !0), e)
            }
            Bi.prototype.size = 1;
            const Ni = D.replace({});
            class Ii extends Bi {
                constructor(t, e, i) {
                    super(t, e), this.deco = i, this.spaceAbove = 0
                }
                mainBlock(t, e) {
                    return new Di(e, this.length, t + this.spaceAbove, this.height - this.spaceAbove, this.deco || 0)
                }
                blockAt(t, e, i, s) {
                    return this.spaceAbove && t < i + this.spaceAbove ? new Di(s, 0, i, this.spaceAbove, Ni) : this.mainBlock(i, s)
                }
                lineAt(t, e, i, s, n) {
                    let r = this.mainBlock(s, n);
                    return this.spaceAbove ? this.blockAt(0, i, s, n).join(r) : r
                }
                forEachLine(t, e, i, s, n, r) {
                    t <= n + this.length && e >= n && r(this.lineAt(0, Ri.ByPos, i, s, n))
                }
                setMeasuredHeight(t) {
                    let e = t.heights[t.index++];
                    e < 0 ? (this.spaceAbove = -e, e = t.heights[t.index++]) : this.spaceAbove = 0, this.setHeight(e)
                }
                updateHeight(t, e = 0, i = !1, s) {
                    return s && s.from <= e && s.more && this.setMeasuredHeight(s), this.outdated = !1, this
                }
                toString() {
                    return `block(${this.length})`
                }
            }
            class zi extends Ii {
                constructor(t, e, i) {
                    super(t, e, null), this.collapsed = 0, this.widgetHeight = 0, this.breaks = 0, this.spaceAbove = i
                }
                mainBlock(t, e) {
                    return new Di(e, this.length, t + this.spaceAbove, this.height - this.spaceAbove, this.breaks)
                }
                replace(t, e, i) {
                    let s = i[0];
                    return 1 == i.length && (s instanceof zi || s instanceof Fi && 4 & s.flags) && Math.abs(this.length - s.length) < 10 ? (s instanceof Fi ? s = new zi(s.length, this.height, this.spaceAbove) : s.height = this.height, this.outdated || (s.outdated = !1), s) : Bi.of(i)
                }
                updateHeight(t, e = 0, i = !1, s) {
                    return s && s.from <= e && s.more ? this.setMeasuredHeight(s) : (i || this.outdated) && (this.spaceAbove = 0, this.setHeight(Math.max(this.widgetHeight, t.heightForLine(this.length - this.collapsed)) + this.breaks * t.lineHeight)), this.outdated = !1, this
                }
                toString() {
                    return `line(${this.length}${this.collapsed?-this.collapsed:""}${this.widgetHeight?":"+this.widgetHeight:""})`
                }
            }
            class Fi extends Bi {
                constructor(t) {
                    super(t, 0)
                }
                heightMetrics(t, e) {
                    let i, s = t.doc.lineAt(e).number,
                        n = t.doc.lineAt(e + this.length).number,
                        r = n - s + 1,
                        o = 0;
                    if (t.lineWrapping) {
                        let e = Math.min(this.height, t.lineHeight * r);
                        i = e / r, this.length > r + 1 && (o = (this.height - e) / (this.length - r - 1))
                    } else i = this.height / r;
                    return {
                        firstLine: s,
                        lastLine: n,
                        perLine: i,
                        perChar: o
                    }
                }
                blockAt(t, e, i, s) {
                    let {
                        firstLine: n,
                        lastLine: r,
                        perLine: o,
                        perChar: l
                    } = this.heightMetrics(e, s);
                    if (e.lineWrapping) {
                        let n = s + (t < e.lineHeight ? 0 : Math.round(Math.max(0, Math.min(1, (t - i) / this.height)) * this.length)),
                            r = e.doc.lineAt(n),
                            a = o + r.length * l,
                            h = Math.max(i, t - a / 2);
                        return new Di(r.from, r.length, h, a, 0)
                    } {
                        let s = Math.max(0, Math.min(r - n, Math.floor((t - i) / o))),
                            {
                                from: l,
                                length: a
                            } = e.doc.line(n + s);
                        return new Di(l, a, i + o * s, o, 0)
                    }
                }
                lineAt(t, e, i, s, n) {
                    if (e == Ri.ByHeight) return this.blockAt(t, i, s, n);
                    if (e == Ri.ByPosNoHeight) {
                        let {
                            from: e,
                            to: s
                        } = i.doc.lineAt(t);
                        return new Di(e, s - e, 0, 0, 0)
                    }
                    let {
                        firstLine: r,
                        perLine: o,
                        perChar: l
                    } = this.heightMetrics(i, n), a = i.doc.lineAt(t), h = o + a.length * l, c = a.number - r, u = s + o * c + l * (a.from - n - c);
                    return new Di(a.from, a.length, Math.max(s, Math.min(u, s + this.height - h)), h, 0)
                }
                forEachLine(t, e, i, s, n, r) {
                    t = Math.max(t, n), e = Math.min(e, n + this.length);
                    let {
                        firstLine: o,
                        perLine: l,
                        perChar: a
                    } = this.heightMetrics(i, n);
                    for (let h = t, c = s; h <= e;) {
                        let e = i.doc.lineAt(h);
                        if (h == t) {
                            let i = e.number - o;
                            c += l * i + a * (t - n - i)
                        }
                        let s = l + a * e.length;
                        r(new Di(e.from, e.length, c, s, 0)), c += s, h = e.to + 1
                    }
                }
                replace(t, e, i) {
                    let s = this.length - e;
                    if (s > 0) {
                        let t = i[i.length - 1];
                        t instanceof Fi ? i[i.length - 1] = new Fi(t.length + s) : i.push(null, new Fi(s - 1))
                    }
                    if (t > 0) {
                        let e = i[0];
                        e instanceof Fi ? i[0] = new Fi(t + e.length) : i.unshift(new Fi(t - 1), null)
                    }
                    return Bi.of(i)
                }
                decomposeLeft(t, e) {
                    e.push(new Fi(t - 1), null)
                }
                decomposeRight(t, e) {
                    e.push(null, new Fi(this.length - t - 1))
                }
                updateHeight(t, e = 0, i = !1, s) {
                    let n = e + this.length;
                    if (s && s.from <= e + this.length && s.more) {
                        let i = [],
                            r = Math.max(e, s.from),
                            o = -1;
                        for (s.from > e && i.push(new Fi(s.from - e - 1).updateHeight(t, e)); r <= n && s.more;) {
                            let e = t.doc.lineAt(r).length;
                            i.length && i.push(null);
                            let n = s.heights[s.index++],
                                l = 0;
                            n < 0 && (l = -n, n = s.heights[s.index++]), -1 == o ? o = n : Math.abs(n - o) >= Ei && (o = -2);
                            let a = new zi(e, n, l);
                            a.outdated = !1, i.push(a), r += e + 1
                        }
                        r <= n && i.push(null, new Fi(n - r).updateHeight(t, r));
                        let l = Bi.of(i);
                        return (o < 0 || Math.abs(l.height - this.height) >= Ei || Math.abs(o - this.heightMetrics(t, e).perLine) >= Ei) && (Mi = !0), Li(this, l)
                    }
                    return (i || this.outdated) && (this.setHeight(t.heightForGap(e, e + this.length)), this.outdated = !1), this
                }
                toString() {
                    return `gap(${this.length})`
                }
            }
            class $i extends Bi {
                constructor(t, e, i) {
                    super(t.length + e + i.length, t.height + i.height, e | (t.outdated || i.outdated ? 2 : 0)), this.left = t, this.right = i, this.size = t.size + i.size
                }
                get break() {
                    return 1 & this.flags
                }
                blockAt(t, e, i, s) {
                    let n = i + this.left.height;
                    return t < n ? this.left.blockAt(t, e, i, s) : this.right.blockAt(t, e, n, s + this.left.length + this.break)
                }
                lineAt(t, e, i, s, n) {
                    let r = s + this.left.height,
                        o = n + this.left.length + this.break,
                        l = e == Ri.ByHeight ? t < r : t < o,
                        a = l ? this.left.lineAt(t, e, i, s, n) : this.right.lineAt(t, e, i, r, o);
                    if (this.break || (l ? a.to < o : a.from > o)) return a;
                    let h = e == Ri.ByPosNoHeight ? Ri.ByPosNoHeight : Ri.ByPos;
                    return l ? a.join(this.right.lineAt(o, h, i, r, o)) : this.left.lineAt(o, h, i, s, n).join(a)
                }
                forEachLine(t, e, i, s, n, r) {
                    let o = s + this.left.height,
                        l = n + this.left.length + this.break;
                    if (this.break) t < l && this.left.forEachLine(t, e, i, s, n, r), e >= l && this.right.forEachLine(t, e, i, o, l, r);
                    else {
                        let a = this.lineAt(l, Ri.ByPos, i, s, n);
                        t < a.from && this.left.forEachLine(t, a.from - 1, i, s, n, r), a.to >= t && a.from <= e && r(a), e > a.to && this.right.forEachLine(a.to + 1, e, i, o, l, r)
                    }
                }
                replace(t, e, i) {
                    let s = this.left.length + this.break;
                    if (e < s) return this.balanced(this.left.replace(t, e, i), this.right);
                    if (t > this.left.length) return this.balanced(this.left, this.right.replace(t - s, e - s, i));
                    let n = [];
                    t > 0 && this.decomposeLeft(t, n);
                    let r = n.length;
                    for (let t of i) n.push(t);
                    if (t > 0 && Wi(n, r - 1), e < this.length) {
                        let t = n.length;
                        this.decomposeRight(e, n), Wi(n, t)
                    }
                    return Bi.of(n)
                }
                decomposeLeft(t, e) {
                    let i = this.left.length;
                    if (t <= i) return this.left.decomposeLeft(t, e);
                    e.push(this.left), this.break && (i++, t >= i && e.push(null)), t > i && this.right.decomposeLeft(t - i, e)
                }
                decomposeRight(t, e) {
                    let i = this.left.length,
                        s = i + this.break;
                    if (t >= s) return this.right.decomposeRight(t - s, e);
                    t < i && this.left.decomposeRight(t, e), this.break && t < s && e.push(null), e.push(this.right)
                }
                balanced(t, e) {
                    return t.size > 2 * e.size || e.size > 2 * t.size ? Bi.of(this.break ? [t, null, e] : [t, e]) : (this.left = Li(this.left, t), this.right = Li(this.right, e), this.setHeight(t.height + e.height), this.outdated = t.outdated || e.outdated, this.size = t.size + e.size, this.length = t.length + this.break+e.length, this)
                }
                updateHeight(t, e = 0, i = !1, s) {
                    let {
                        left: n,
                        right: r
                    } = this, o = e + n.length + this.break, l = null;
                    return s && s.from <= e + n.length && s.more ? l = n = n.updateHeight(t, e, i, s) : n.updateHeight(t, e, i), s && s.from <= o + r.length && s.more ? l = r = r.updateHeight(t, o, i, s) : r.updateHeight(t, o, i), l ? this.balanced(n, r) : (this.height = this.left.height + this.right.height, this.outdated = !1, this)
                }
                toString() {
                    return this.left + (this.break ? " " : "-") + this.right
                }
            }

            function Wi(t, e) {
                let i, s;
                null == t[e] && (i = t[e - 1]) instanceof Fi && (s = t[e + 1]) instanceof Fi && t.splice(e - 1, 3, new Fi(i.length + 1 + s.length))
            }
            class Vi {
                constructor(t, e) {
                    this.pos = t, this.oracle = e, this.nodes = [], this.lineStart = -1, this.lineEnd = -1, this.covering = null, this.writtenTo = t
                }
                get isCovered() {
                    return this.covering && this.nodes[this.nodes.length - 1] == this.covering
                }
                span(t, e) {
                    if (this.lineStart > -1) {
                        let t = Math.min(e, this.lineEnd),
                            i = this.nodes[this.nodes.length - 1];
                        i instanceof zi ? i.length += t - this.pos : (t > this.pos || !this.isCovered) && this.nodes.push(new zi(t - this.pos, -1, 0)), this.writtenTo = t, e > t && (this.nodes.push(null), this.writtenTo++, this.lineStart = -1)
                    }
                    this.pos = e
                }
                point(t, e, i) {
                    if (t < e || i.heightRelevant) {
                        let s = i.widget ? i.widget.estimatedHeight : 0,
                            n = i.widget ? i.widget.lineBreaks : 0;
                        s < 0 && (s = this.oracle.lineHeight);
                        let r = e - t;
                        i.block ? this.addBlock(new Ii(r, s, i)) : (r || n || s >= 5) && this.addLineDeco(s, n, r)
                    } else e > t && this.span(t, e);
                    this.lineEnd > -1 && this.lineEnd < this.pos && (this.lineEnd = this.oracle.doc.lineAt(this.pos).to)
                }
                enterLine() {
                    if (this.lineStart > -1) return;
                    let {
                        from: t,
                        to: e
                    } = this.oracle.doc.lineAt(this.pos);
                    this.lineStart = t, this.lineEnd = e, this.writtenTo < t && ((this.writtenTo < t - 1 || null == this.nodes[this.nodes.length - 1]) && this.nodes.push(this.blankContent(this.writtenTo, t - 1)), this.nodes.push(null)), this.pos > t && this.nodes.push(new zi(this.pos - t, -1, 0)), this.writtenTo = this.pos
                }
                blankContent(t, e) {
                    let i = new Fi(e - t);
                    return this.oracle.doc.lineAt(t).to == e && (i.flags |= 4), i
                }
                ensureLine() {
                    this.enterLine();
                    let t = this.nodes.length ? this.nodes[this.nodes.length - 1] : null;
                    if (t instanceof zi) return t;
                    let e = new zi(0, -1, 0);
                    return this.nodes.push(e), e
                }
                addBlock(t) {
                    this.enterLine();
                    let e = t.deco;
                    e && e.startSide > 0 && !this.isCovered && this.ensureLine(), this.nodes.push(t), this.writtenTo = this.pos = this.pos + t.length, e && e.endSide > 0 && (this.covering = t)
                }
                addLineDeco(t, e, i) {
                    let s = this.ensureLine();
                    s.length += i, s.collapsed += i, s.widgetHeight = Math.max(s.widgetHeight, t), s.breaks += e, this.writtenTo = this.pos = this.pos + i
                }
                finish(t) {
                    let e = 0 == this.nodes.length ? null : this.nodes[this.nodes.length - 1];
                    !(this.lineStart > -1) || e instanceof zi || this.isCovered ? (this.writtenTo < this.pos || null == e) && this.nodes.push(this.blankContent(this.writtenTo, this.pos)) : this.nodes.push(new zi(0, -1, 0));
                    let i = t;
                    for (let t of this.nodes) t instanceof zi && t.updateHeight(this.oracle, i), i += t ? t.length : 1;
                    return this.nodes
                }
                static build(t, e, i, n) {
                    let r = new Vi(i, t);
                    return s.om.spans(e, i, n, r, 0), r.finish(i)
                }
            }
            class ji {
                constructor() {
                    this.changes = []
                }
                compareRange() {}
                comparePoint(t, e, i, s) {
                    (t < e || i && i.heightRelevant || s && s.heightRelevant) && N(t, e, this.changes, 5)
                }
            }

            function qi(t, e) {
                let i = t.getBoundingClientRect(),
                    s = t.ownerDocument,
                    n = s.defaultView || window,
                    r = Math.max(0, i.left),
                    o = Math.min(n.innerWidth, i.right),
                    l = Math.max(0, i.top),
                    a = Math.min(n.innerHeight, i.bottom);
                for (let e = t.parentNode; e && e != s.body;)
                    if (1 == e.nodeType) {
                        let i = e,
                            s = window.getComputedStyle(i);
                        if ((i.scrollHeight > i.clientHeight || i.scrollWidth > i.clientWidth) && "visible" != s.overflow) {
                            let s = i.getBoundingClientRect();
                            r = Math.max(r, s.left), o = Math.min(o, s.right), l = Math.max(l, s.top), a = Math.min(e == t.parentNode ? n.innerHeight : a, s.bottom)
                        }
                        e = "absolute" == s.position || "fixed" == s.position ? i.offsetParent : i.parentNode
                    } else {
                        if (11 != e.nodeType) break;
                        e = e.host
                    } return {
                    left: r - i.left,
                    right: Math.max(r, o) - i.left,
                    top: l - (i.top + e),
                    bottom: Math.max(l, a) - (i.top + e)
                }
            }

            function Hi(t, e) {
                let i = t.getBoundingClientRect();
                return {
                    left: 0,
                    right: i.right - i.left,
                    top: e,
                    bottom: i.bottom - (i.top + e)
                }
            }
            class _i {
                constructor(t, e, i, s) {
                    this.from = t, this.to = e, this.size = i, this.displaySize = s
                }
                static same(t, e) {
                    if (t.length != e.length) return !1;
                    for (let i = 0; i < t.length; i++) {
                        let s = t[i],
                            n = e[i];
                        if (s.from != n.from || s.to != n.to || s.size != n.size) return !1
                    }
                    return !0
                }
                draw(t, e) {
                    return D.replace({
                        widget: new Xi(this.displaySize * (e ? t.scaleY : t.scaleX), e)
                    }).range(this.from, this.to)
                }
            }
            class Xi extends T {
                constructor(t, e) {
                    super(), this.size = t, this.vertical = e
                }
                eq(t) {
                    return t.size == this.size && t.vertical == this.vertical
                }
                toDOM() {
                    let t = document.createElement("div");
                    return this.vertical ? t.style.height = this.size + "px" : (t.style.width = this.size + "px", t.style.height = "2px", t.style.display = "inline-block"), t
                }
                get estimatedHeight() {
                    return this.vertical ? this.size : -1
                }
            }
            class Yi {
                constructor(t) {
                    this.state = t, this.pixelViewport = {
                        left: 0,
                        right: window.innerWidth,
                        top: 0,
                        bottom: 0
                    }, this.inView = !0, this.paddingTop = 0, this.paddingBottom = 0, this.contentDOMWidth = 0, this.contentDOMHeight = 0, this.editorHeight = 0, this.editorWidth = 0, this.scrollTop = 0, this.scrolledToBottom = !1, this.scaleX = 1, this.scaleY = 1, this.scrollAnchorPos = 0, this.scrollAnchorHeight = -1, this.scaler = Zi, this.scrollTarget = null, this.printing = !1, this.mustMeasureContent = !0, this.defaultTextDirection = ot.LTR, this.visibleRanges = [], this.mustEnforceCursorAssoc = !1;
                    let e = t.facet(Xt).some(t => "function" != typeof t && "css-lineWrapping" == t.class);
                    this.heightOracle = new Ti(e), this.stateDeco = Ji(t), this.heightMap = Bi.empty().applyChanges(this.stateDeco, s.EY.empty, this.heightOracle.setDoc(t.doc), [new se(0, 0, 0, t.doc.length)]);
                    for (let t = 0; t < 2 && (this.viewport = this.getViewport(0, null), this.updateForViewport()); t++);
                    this.updateViewportLines(), this.lineGaps = this.ensureLineGaps([]), this.lineGapDeco = D.set(this.lineGaps.map(t => t.draw(this, !1))), this.computeVisibleRanges()
                }
                updateForViewport() {
                    let t = [this.viewport],
                        {
                            main: e
                        } = this.state.selection;
                    for (let i = 0; i <= 1; i++) {
                        let s = i ? e.head : e.anchor;
                        if (!t.some(({
                                from: t,
                                to: e
                            }) => s >= t && s <= e)) {
                            let {
                                from: e,
                                to: i
                            } = this.lineBlockAt(s);
                            t.push(new Ui(e, i))
                        }
                    }
                    return this.viewports = t.sort((t, e) => t.from - e.from), this.updateScaler()
                }
                updateScaler() {
                    let t = this.scaler;
                    return this.scaler = this.heightMap.height <= 7e6 ? Zi : new ts(this.heightOracle, this.heightMap, this.viewports), t.eq(this.scaler) ? 0 : 2
                }
                updateViewportLines() {
                    this.viewportLines = [], this.heightMap.forEachLine(this.viewport.from, this.viewport.to, this.heightOracle.setDoc(this.state.doc), 0, 0, t => {
                        this.viewportLines.push(es(t, this.scaler))
                    })
                }
                update(t, e = null) {
                    this.state = t.state;
                    let i = this.stateDeco;
                    this.stateDeco = Ji(this.state);
                    let n = t.changedRanges,
                        r = se.extendWithRanges(n, function(t, e, i) {
                            let n = new ji;
                            return s.om.compare(t, e, i, n, 0), n.changes
                        }(i, this.stateDeco, t ? t.changes : s.VR.empty(this.state.doc.length))),
                        o = this.heightMap.height,
                        l = this.scrolledToBottom ? null : this.scrollAnchorAt(this.scrollTop);
                    Qi(), this.heightMap = this.heightMap.applyChanges(this.stateDeco, t.startState.doc, this.heightOracle.setDoc(this.state.doc), r), (this.heightMap.height != o || Mi) && (t.flags |= 2), l ? (this.scrollAnchorPos = t.changes.mapPos(l.from, -1), this.scrollAnchorHeight = l.top) : (this.scrollAnchorPos = -1, this.scrollAnchorHeight = o);
                    let a = r.length ? this.mapViewport(this.viewport, t.changes) : this.viewport;
                    (e && (e.range.head < a.from || e.range.head > a.to) || !this.viewportIsAppropriate(a)) && (a = this.getViewport(0, e));
                    let h = a.from != this.viewport.from || a.to != this.viewport.to;
                    this.viewport = a, t.flags |= this.updateForViewport(), (h || !t.changes.empty || 2 & t.flags) && this.updateViewportLines(), (this.lineGaps.length || this.viewport.to - this.viewport.from > 4e3) && this.updateLineGaps(this.ensureLineGaps(this.mapLineGaps(this.lineGaps, t.changes))), t.flags |= this.computeVisibleRanges(t.changes), e && (this.scrollTarget = e), !this.mustEnforceCursorAssoc && (t.selectionSet || t.focusChanged) && t.view.lineWrapping && t.state.selection.main.empty && t.state.selection.main.assoc && !t.state.facet(Lt) && (this.mustEnforceCursorAssoc = !0)
                }
                measure(t) {
                    let e = t.contentDOM,
                        i = window.getComputedStyle(e),
                        n = this.heightOracle,
                        r = i.whiteSpace;
                    this.defaultTextDirection = "rtl" == i.direction ? ot.RTL : ot.LTR;
                    let o = this.heightOracle.mustRefreshForWrapping(r) || this.mustMeasureContent,
                        l = e.getBoundingClientRect(),
                        a = o || this.mustMeasureContent || this.contentDOMHeight != l.height;
                    this.contentDOMHeight = l.height, this.mustMeasureContent = !1;
                    let h = 0,
                        c = 0;
                    if (l.width && l.height) {
                        let {
                            scaleX: t,
                            scaleY: i
                        } = U(e, l);
                        (t > .005 && Math.abs(this.scaleX - t) > .005 || i > .005 && Math.abs(this.scaleY - i) > .005) && (this.scaleX = t, this.scaleY = i, h |= 16, o = a = !0)
                    }
                    let u = (parseInt(i.paddingTop) || 0) * this.scaleY,
                        d = (parseInt(i.paddingBottom) || 0) * this.scaleY;
                    this.paddingTop == u && this.paddingBottom == d || (this.paddingTop = u, this.paddingBottom = d, h |= 18), this.editorWidth != t.scrollDOM.clientWidth && (n.lineWrapping && (a = !0), this.editorWidth = t.scrollDOM.clientWidth, h |= 16);
                    let f = t.scrollDOM.scrollTop * this.scaleY;
                    this.scrollTop != f && (this.scrollAnchorHeight = -1, this.scrollTop = f), this.scrolledToBottom = it(t.scrollDOM);
                    let p = (this.printing ? Hi : qi)(e, this.paddingTop),
                        m = p.top - this.pixelViewport.top,
                        g = p.bottom - this.pixelViewport.bottom;
                    this.pixelViewport = p;
                    let v = this.pixelViewport.bottom > this.pixelViewport.top && this.pixelViewport.right > this.pixelViewport.left;
                    if (v != this.inView && (this.inView = v, v && (a = !0)), !this.inView && !this.scrollTarget && ! function(t) {
                            let e = t.getBoundingClientRect(),
                                i = t.ownerDocument.defaultView || window;
                            return e.left < i.innerWidth && e.right > 0 && e.top < i.innerHeight && e.bottom > 0
                        }(t.dom)) return 0;
                    let b = l.width;
                    if (this.contentDOMWidth == b && this.editorHeight == t.scrollDOM.clientHeight || (this.contentDOMWidth = l.width, this.editorHeight = t.scrollDOM.clientHeight, h |= 16), a) {
                        let e = t.docView.measureVisibleLineHeights(this.viewport);
                        if (n.mustRefreshForHeights(e) && (o = !0), o || n.lineWrapping && Math.abs(b - this.contentDOMWidth) > n.charWidth) {
                            let {
                                lineHeight: i,
                                charWidth: s,
                                textHeight: l
                            } = t.docView.measureTextSize();
                            o = i > 0 && n.refresh(r, i, s, l, Math.max(5, b / s), e), o && (t.docView.minWidth = 0, h |= 16)
                        }
                        m > 0 && g > 0 ? c = Math.max(m, g) : m < 0 && g < 0 && (c = Math.min(m, g)), Qi();
                        for (let i of this.viewports) {
                            let r = i.from == this.viewport.from ? e : t.docView.measureVisibleLineHeights(i);
                            this.heightMap = (o ? Bi.empty().applyChanges(this.stateDeco, s.EY.empty, this.heightOracle, [new se(0, 0, 0, t.state.doc.length)]) : this.heightMap).updateHeight(n, 0, o, new Pi(i.from, r))
                        }
                        Mi && (h |= 2)
                    }
                    let w = !this.viewportIsAppropriate(this.viewport, c) || this.scrollTarget && (this.scrollTarget.range.head < this.viewport.from || this.scrollTarget.range.head > this.viewport.to);
                    return w && (2 & h && (h |= this.updateScaler()), this.viewport = this.getViewport(c, this.scrollTarget), h |= this.updateForViewport()), (2 & h || w) && this.updateViewportLines(), (this.lineGaps.length || this.viewport.to - this.viewport.from > 4e3) && this.updateLineGaps(this.ensureLineGaps(o ? [] : this.lineGaps, t)), h |= this.computeVisibleRanges(), this.mustEnforceCursorAssoc && (this.mustEnforceCursorAssoc = !1, t.docView.enforceCursorAssoc()), h
                }
                get visibleTop() {
                    return this.scaler.fromDOM(this.pixelViewport.top)
                }
                get visibleBottom() {
                    return this.scaler.fromDOM(this.pixelViewport.bottom)
                }
                getViewport(t, e) {
                    let i = .5 - Math.max(-.5, Math.min(.5, t / 1e3 / 2)),
                        s = this.heightMap,
                        n = this.heightOracle,
                        {
                            visibleTop: r,
                            visibleBottom: o
                        } = this,
                        l = new Ui(s.lineAt(r - 1e3 * i, Ri.ByHeight, n, 0, 0).from, s.lineAt(o + 1e3 * (1 - i), Ri.ByHeight, n, 0, 0).to);
                    if (e) {
                        let {
                            head: t
                        } = e.range;
                        if (t < l.from || t > l.to) {
                            let i, r = Math.min(this.editorHeight, this.pixelViewport.bottom - this.pixelViewport.top),
                                o = s.lineAt(t, Ri.ByPos, n, 0, 0);
                            i = "center" == e.y ? (o.top + o.bottom) / 2 - r / 2 : "start" == e.y || "nearest" == e.y && t < l.from ? o.top : o.bottom - r, l = new Ui(s.lineAt(i - 500, Ri.ByHeight, n, 0, 0).from, s.lineAt(i + r + 500, Ri.ByHeight, n, 0, 0).to)
                        }
                    }
                    return l
                }
                mapViewport(t, e) {
                    let i = e.mapPos(t.from, -1),
                        s = e.mapPos(t.to, 1);
                    return new Ui(this.heightMap.lineAt(i, Ri.ByPos, this.heightOracle, 0, 0).from, this.heightMap.lineAt(s, Ri.ByPos, this.heightOracle, 0, 0).to)
                }
                viewportIsAppropriate({
                    from: t,
                    to: e
                }, i = 0) {
                    if (!this.inView) return !0;
                    let {
                        top: s
                    } = this.heightMap.lineAt(t, Ri.ByPos, this.heightOracle, 0, 0), {
                        bottom: n
                    } = this.heightMap.lineAt(e, Ri.ByPos, this.heightOracle, 0, 0), {
                        visibleTop: r,
                        visibleBottom: o
                    } = this;
                    return (0 == t || s <= r - Math.max(10, Math.min(-i, 250))) && (e == this.state.doc.length || n >= o + Math.max(10, Math.min(i, 250))) && s > r - 2e3 && n < o + 2e3
                }
                mapLineGaps(t, e) {
                    if (!t.length || e.empty) return t;
                    let i = [];
                    for (let s of t) e.touchesRange(s.from, s.to) || i.push(new _i(e.mapPos(s.from), e.mapPos(s.to), s.size, s.displaySize));
                    return i
                }
                ensureLineGaps(t, e) {
                    let i = this.heightOracle.lineWrapping,
                        n = i ? 1e4 : 2e3,
                        r = n >> 1,
                        o = n << 1;
                    if (this.defaultTextDirection != ot.LTR && !i) return [];
                    let l = [],
                        a = (n, o, h, c) => {
                            if (o - n < r) return;
                            let u = this.state.selection.main,
                                d = [u.from];
                            u.empty || d.push(u.to);
                            for (let t of d)
                                if (t > n && t < o) return a(n, t - 10, h, c), void a(t + 10, o, h, c);
                            let f = function(t, e) {
                                for (let i of t)
                                    if (e(i)) return i
                            }(t, t => t.from >= h.from && t.to <= h.to && Math.abs(t.from - n) < r && Math.abs(t.to - o) < r && !d.some(e => t.from < e && t.to > e));
                            if (!f) {
                                if (o < h.to && e && i && e.visibleRanges.some(t => t.from <= o && t.to >= o)) {
                                    let t = e.moveToLineBoundary(s.OF.cursor(o), !1, !0).head;
                                    t > n && (o = t)
                                }
                                let t = this.gapSize(h, n, o, c);
                                f = new _i(n, o, t, i || t < 2e6 ? t : 2e6)
                            }
                            l.push(f)
                        },
                        h = e => {
                            if (e.length < o || e.type != P.Text) return;
                            let r = function(t, e, i) {
                                let n = [],
                                    r = t,
                                    o = 0;
                                return s.om.spans(i, t, e, {
                                    span() {},
                                    point(t, e) {
                                        t > r && (n.push({
                                            from: r,
                                            to: t
                                        }), o += t - r), r = e
                                    }
                                }, 20), r < e && (n.push({
                                    from: r,
                                    to: e
                                }), o += e - r), {
                                    total: o,
                                    ranges: n
                                }
                            }(e.from, e.to, this.stateDeco);
                            if (r.total < o) return;
                            let l, h, c = this.scrollTarget ? this.scrollTarget.range.head : null;
                            if (i) {
                                let t, i, s = n / this.heightOracle.lineLength * this.heightOracle.lineHeight;
                                if (null != c) {
                                    let n = Ki(r, c),
                                        o = ((this.visibleBottom - this.visibleTop) / 2 + s) / e.height;
                                    t = n - o, i = n + o
                                } else t = (this.visibleTop - e.top - s) / e.height, i = (this.visibleBottom - e.top + s) / e.height;
                                l = Gi(r, t), h = Gi(r, i)
                            } else {
                                let i = r.total * this.heightOracle.charWidth,
                                    s = n * this.heightOracle.charWidth,
                                    o = 0;
                                if (i > 2e6)
                                    for (let i of t) i.from >= e.from && i.from < e.to && i.size != i.displaySize && i.from * this.heightOracle.charWidth + o < this.pixelViewport.left && (o = i.size - i.displaySize);
                                let a, u, d = this.pixelViewport.left + o,
                                    f = this.pixelViewport.right + o;
                                if (null != c) {
                                    let t = Ki(r, c),
                                        e = ((f - d) / 2 + s) / i;
                                    a = t - e, u = t + e
                                } else a = (d - s) / i, u = (f + s) / i;
                                l = Gi(r, a), h = Gi(r, u)
                            }
                            l > e.from && a(e.from, l, e, r), h < e.to && a(h, e.to, e, r)
                        };
                    for (let t of this.viewportLines) Array.isArray(t.type) ? t.type.forEach(h) : h(t);
                    return l
                }
                gapSize(t, e, i, s) {
                    let n = Ki(s, i) - Ki(s, e);
                    return this.heightOracle.lineWrapping ? t.height * n : s.total * this.heightOracle.charWidth * n
                }
                updateLineGaps(t) {
                    _i.same(t, this.lineGaps) || (this.lineGaps = t, this.lineGapDeco = D.set(t.map(t => t.draw(this, this.heightOracle.lineWrapping))))
                }
                computeVisibleRanges(t) {
                    let e = this.stateDeco;
                    this.lineGaps.length && (e = e.concat(this.lineGapDeco));
                    let i = [];
                    s.om.spans(e, this.viewport.from, this.viewport.to, {
                        span(t, e) {
                            i.push({
                                from: t,
                                to: e
                            })
                        },
                        point() {}
                    }, 20);
                    let n = 0;
                    if (i.length != this.visibleRanges.length) n = 12;
                    else
                        for (let e = 0; e < i.length && !(8 & n); e++) {
                            let s = this.visibleRanges[e],
                                r = i[e];
                            s.from == r.from && s.to == r.to || (n |= 4, t && t.mapPos(s.from, -1) == r.from && t.mapPos(s.to, 1) == r.to || (n |= 8))
                        }
                    return this.visibleRanges = i, n
                }
                lineBlockAt(t) {
                    return t >= this.viewport.from && t <= this.viewport.to && this.viewportLines.find(e => e.from <= t && e.to >= t) || es(this.heightMap.lineAt(t, Ri.ByPos, this.heightOracle, 0, 0), this.scaler)
                }
                lineBlockAtHeight(t) {
                    return t >= this.viewportLines[0].top && t <= this.viewportLines[this.viewportLines.length - 1].bottom && this.viewportLines.find(e => e.top <= t && e.bottom >= t) || es(this.heightMap.lineAt(this.scaler.fromDOM(t), Ri.ByHeight, this.heightOracle, 0, 0), this.scaler)
                }
                scrollAnchorAt(t) {
                    let e = this.lineBlockAtHeight(t + 8);
                    return e.from >= this.viewport.from || this.viewportLines[0].top - t > 200 ? e : this.viewportLines[0]
                }
                elementAtHeight(t) {
                    return es(this.heightMap.blockAt(this.scaler.fromDOM(t), this.heightOracle, 0, 0), this.scaler)
                }
                get docHeight() {
                    return this.scaler.toDOM(this.heightMap.height)
                }
                get contentHeight() {
                    return this.docHeight + this.paddingTop + this.paddingBottom
                }
            }
            class Ui {
                constructor(t, e) {
                    this.from = t, this.to = e
                }
            }

            function Gi({
                total: t,
                ranges: e
            }, i) {
                if (i <= 0) return e[0].from;
                if (i >= 1) return e[e.length - 1].to;
                let s = Math.floor(t * i);
                for (let t = 0;; t++) {
                    let {
                        from: i,
                        to: n
                    } = e[t], r = n - i;
                    if (s <= r) return i + s;
                    s -= r
                }
            }

            function Ki(t, e) {
                let i = 0;
                for (let {
                        from: s,
                        to: n
                    }
                    of t.ranges) {
                    if (e <= n) {
                        i += e - s;
                        break
                    }
                    i += n - s
                }
                return i / t.total
            }
            const Zi = {
                toDOM: t => t,
                fromDOM: t => t,
                scale: 1,
                eq(t) {
                    return t == this
                }
            };

            function Ji(t) {
                let e = t.facet(Yt).filter(t => "function" != typeof t),
                    i = t.facet(Gt).filter(t => "function" != typeof t);
                return i.length && e.push(s.om.join(i)), e
            }
            class ts {
                constructor(t, e, i) {
                    let s = 0,
                        n = 0,
                        r = 0;
                    this.viewports = i.map(({
                        from: i,
                        to: n
                    }) => {
                        let r = e.lineAt(i, Ri.ByPos, t, 0, 0).top,
                            o = e.lineAt(n, Ri.ByPos, t, 0, 0).bottom;
                        return s += o - r, {
                            from: i,
                            to: n,
                            top: r,
                            bottom: o,
                            domTop: 0,
                            domBottom: 0
                        }
                    }), this.scale = (7e6 - s) / (e.height - s);
                    for (let t of this.viewports) t.domTop = r + (t.top - n) * this.scale, r = t.domBottom = t.domTop + (t.bottom - t.top), n = t.bottom
                }
                toDOM(t) {
                    for (let e = 0, i = 0, s = 0;; e++) {
                        let n = e < this.viewports.length ? this.viewports[e] : null;
                        if (!n || t < n.top) return s + (t - i) * this.scale;
                        if (t <= n.bottom) return n.domTop + (t - n.top);
                        i = n.bottom, s = n.domBottom
                    }
                }
                fromDOM(t) {
                    for (let e = 0, i = 0, s = 0;; e++) {
                        let n = e < this.viewports.length ? this.viewports[e] : null;
                        if (!n || t < n.domTop) return i + (t - s) / this.scale;
                        if (t <= n.domBottom) return n.top + (t - n.domTop);
                        i = n.bottom, s = n.domBottom
                    }
                }
                eq(t) {
                    return t instanceof ts && this.scale == t.scale && this.viewports.length == t.viewports.length && this.viewports.every((e, i) => e.from == t.viewports[i].from && e.to == t.viewports[i].to)
                }
            }

            function es(t, e) {
                if (1 == e.scale) return t;
                let i = e.toDOM(t.top),
                    s = e.toDOM(t.bottom);
                return new Di(t.from, t.length, i, s - i, Array.isArray(t._content) ? t._content.map(t => es(t, e)) : t._content)
            }
            const is = s.sj.define({
                    combine: t => t.join(" ")
                }),
                ss = s.sj.define({
                    combine: t => t.indexOf(!0) > -1
                }),
                ns = n.G.newName(),
                rs = n.G.newName(),
                os = n.G.newName(),
                ls = {
                    "&light": "." + rs,
                    "&dark": "." + os
                };

            function as(t, e, i) {
                return new n.G(e, {
                    finish: e => /&/.test(e) ? e.replace(/&\w*/, e => {
                        if ("&" == e) return t;
                        if (!i || !i[e]) throw new RangeError(`Unsupported selector: ${e}`);
                        return i[e]
                    }) : t + " " + e
                })
            }
            const hs = as("." + ns, {
   
                }, ls),
                cs = {
                    childList: !0,
                    characterData: !0,
                    subtree: !0,
                    attributes: !0,
                    characterDataOldValue: !0
                },
                us = k.ie && k.ie_version <= 11;
            class ds {
                constructor(t) {
                    this.view = t, this.active = !1, this.editContext = null, this.selectionRange = new G, this.selectionChanged = !1, this.delayedFlush = -1, this.resizeTimeout = -1, this.queue = [], this.delayedAndroidKey = null, this.flushingAndroidKey = -1, this.lastChange = 0, this.scrollTargets = [], this.intersection = null, this.resizeScroll = null, this.intersecting = !1, this.gapIntersection = null, this.gaps = [], this.printQuery = null, this.parentCheck = -1, this.dom = t.contentDOM, this.observer = new MutationObserver(e => {
                        for (let t of e) this.queue.push(t);
                        (k.ie && k.ie_version <= 11 || k.ios && t.composing) && e.some(t => "childList" == t.type && t.removedNodes.length || "characterData" == t.type && t.oldValue.length > t.target.nodeValue.length) ? this.flushSoon() : this.flush()
                    }), !window.EditContext || !k.android || !1 === t.constructor.EDIT_CONTEXT || k.chrome && k.chrome_version < 126 || (this.editContext = new ms(t), t.state.facet(Wt) && (t.contentDOM.editContext = this.editContext.editContext)), us && (this.onCharData = t => {
                        this.queue.push({
                            target: t.target,
                            type: "characterData",
                            oldValue: t.prevValue
                        }), this.flushSoon()
                    }), this.onSelectionChange = this.onSelectionChange.bind(this), this.onResize = this.onResize.bind(this), this.onPrint = this.onPrint.bind(this), this.onScroll = this.onScroll.bind(this), window.matchMedia && (this.printQuery = window.matchMedia("print")), "function" == typeof ResizeObserver && (this.resizeScroll = new ResizeObserver(() => {
                        var t;
                        (null === (t = this.view.docView) || void 0 === t ? void 0 : t.lastUpdate) < Date.now() - 75 && this.onResize()
                    }), this.resizeScroll.observe(t.scrollDOM)), this.addWindowListeners(this.win = t.win), this.start(), "function" == typeof IntersectionObserver && (this.intersection = new IntersectionObserver(t => {
                        this.parentCheck < 0 && (this.parentCheck = setTimeout(this.listenForScroll.bind(this), 1e3)), t.length > 0 && t[t.length - 1].intersectionRatio > 0 != this.intersecting && (this.intersecting = !this.intersecting, this.intersecting != this.view.inView && this.onScrollChanged(document.createEvent("Event")))
                    }, {
                        threshold: [0, .001]
                    }), this.intersection.observe(this.dom), this.gapIntersection = new IntersectionObserver(t => {
                        t.length > 0 && t[t.length - 1].intersectionRatio > 0 && this.onScrollChanged(document.createEvent("Event"))
                    }, {})), this.listenForScroll(), this.readSelectionRange()
                }
                onScrollChanged(t) {
                    this.view.inputState.runHandlers("scroll", t), this.intersecting && this.view.measure()
                }
                onScroll(t) {
                    this.intersecting && this.flush(!1), this.editContext && this.view.requestMeasure(this.editContext.measureReq), this.onScrollChanged(t)
                }
                onResize() {
                    this.resizeTimeout < 0 && (this.resizeTimeout = setTimeout(() => {
                        this.resizeTimeout = -1, this.view.requestMeasure()
                    }, 50))
                }
                onPrint(t) {
                    ("change" != t.type && t.type || t.matches) && (this.view.viewState.printing = !0, this.view.measure(), setTimeout(() => {
                        this.view.viewState.printing = !1, this.view.requestMeasure()
                    }, 500))
                }
                updateGaps(t) {
                    if (this.gapIntersection && (t.length != this.gaps.length || this.gaps.some((e, i) => e != t[i]))) {
                        this.gapIntersection.disconnect();
                        for (let e of t) this.gapIntersection.observe(e);
                        this.gaps = t
                    }
                }
                onSelectionChange(t) {
                    let e = this.selectionChanged;
                    if (!this.readSelectionRange() || this.delayedAndroidKey) return;
                    let {
                        view: i
                    } = this, s = this.selectionRange;
                    if (i.state.facet(Wt) ? i.root.activeElement != this.dom : !$(this.dom, s)) return;
                    let n = s.anchorNode && i.docView.tile.nearest(s.anchorNode);
                    n && n.isWidget() && n.widget.ignoreEvent(t) ? e || (this.selectionChanged = !1) : (k.ie && k.ie_version <= 11 || k.android && k.chrome) && !i.state.selection.main.empty && s.focusNode && V(s.focusNode, s.focusOffset, s.anchorNode, s.anchorOffset) ? this.flushSoon() : this.flush(!1)
                }
                readSelectionRange() {
                    let {
                        view: t
                    } = this, e = z(t.root);
                    if (!e) return !1;
                    let i = k.safari && 11 == t.root.nodeType && t.root.activeElement == this.dom && function(t, e) {
                        if (e.getComposedRanges) {
                            let i = e.getComposedRanges(t.root)[0];
                            if (i) return ps(t, i)
                        }
                        let i = null;

                        function s(t) {
                            t.preventDefault(), t.stopImmediatePropagation(), i = t.getTargetRanges()[0]
                        }
                        return t.contentDOM.addEventListener("beforeinput", s, !0), t.dom.ownerDocument.execCommand("indent"), t.contentDOM.removeEventListener("beforeinput", s, !0), i ? ps(t, i) : null
                    }(this.view, e) || e;
                    if (!i || this.selectionRange.eq(i)) return !1;
                    let s = $(this.dom, i);
                    return s && !this.selectionChanged && t.inputState.lastFocusTime > Date.now() - 200 && t.inputState.lastTouchTime < Date.now() - 300 && function(t, e) {
                        let i = e.focusNode,
                            s = e.focusOffset;
                        if (!i || e.anchorNode != i || e.anchorOffset != s) return !1;
                        for (s = Math.min(s, _(i));;)
                            if (s) {
                                if (1 != i.nodeType) return !1;
                                let t = i.childNodes[s - 1];
                                "false" == t.contentEditable ? s-- : (i = t, s = _(i))
                            } else {
                                if (i == t) return !0;
                                s = j(i), i = i.parentNode
                            }
                    }(this.dom, i) ? (this.view.inputState.lastFocusTime = 0, t.docView.updateSelection(), !1) : (this.selectionRange.setRange(i), s && (this.selectionChanged = !0), !0)
                }
                setSelectionRange(t, e) {
                    this.selectionRange.set(t.node, t.offset, e.node, e.offset), this.selectionChanged = !1
                }
                clearSelectionRange() {
                    this.selectionRange.set(null, 0, null, 0)
                }
                listenForScroll() {
                    this.parentCheck = -1;
                    let t = 0,
                        e = null;
                    for (let i = this.dom; i;)
                        if (1 == i.nodeType) !e && t < this.scrollTargets.length && this.scrollTargets[t] == i ? t++ : e || (e = this.scrollTargets.slice(0, t)), e && e.push(i), i = i.assignedSlot || i.parentNode;
                        else {
                            if (11 != i.nodeType) break;
                            i = i.host
                        } if (t < this.scrollTargets.length && !e && (e = this.scrollTargets.slice(0, t)), e) {
                        for (let t of this.scrollTargets) t.removeEventListener("scroll", this.onScroll);
                        for (let t of this.scrollTargets = e) t.addEventListener("scroll", this.onScroll)
                    }
                }
                ignore(t) {
                    if (!this.active) return t();
                    try {
                        return this.stop(), t()
                    } finally {
                        this.start(), this.clear()
                    }
                }
                start() {
                    this.active || (this.observer.observe(this.dom, cs), us && this.dom.addEventListener("DOMCharacterDataModified", this.onCharData), this.active = !0)
                }
                stop() {
                    this.active && (this.active = !1, this.observer.disconnect(), us && this.dom.removeEventListener("DOMCharacterDataModified", this.onCharData))
                }
                clear() {
                    this.processRecords(), this.queue.length = 0, this.selectionChanged = !1
                }
                delayAndroidKey(t, e) {
                    var i;
                    if (!this.delayedAndroidKey) {
                        let t = () => {
                            let t = this.delayedAndroidKey;
                            t && (this.clearDelayedAndroidKey(), this.view.inputState.lastKeyCode = t.keyCode, this.view.inputState.lastKeyTime = Date.now(), !this.flush() && t.force && et(this.dom, t.key, t.keyCode))
                        };
                        this.flushingAndroidKey = this.view.win.requestAnimationFrame(t)
                    }
                    this.delayedAndroidKey && "Enter" != t || (this.delayedAndroidKey = {
                        key: t,
                        keyCode: e,
                        force: this.lastChange < Date.now() - 50 || !!(null === (i = this.delayedAndroidKey) || void 0 === i ? void 0 : i.force)
                    })
                }
                clearDelayedAndroidKey() {
                    this.win.cancelAnimationFrame(this.flushingAndroidKey), this.delayedAndroidKey = null, this.flushingAndroidKey = -1
                }
                flushSoon() {
                    this.delayedFlush < 0 && (this.delayedFlush = this.view.win.requestAnimationFrame(() => {
                        this.delayedFlush = -1, this.flush()
                    }))
                }
                forceFlush() {
                    this.delayedFlush >= 0 && (this.view.win.cancelAnimationFrame(this.delayedFlush), this.delayedFlush = -1), this.flush()
                }
                pendingRecords() {
                    for (let t of this.observer.takeRecords()) this.queue.push(t);
                    return this.queue
                }
                processRecords() {
                    let t = this.pendingRecords();
                    t.length && (this.queue = []);
                    let e = -1,
                        i = -1,
                        s = !1;
                    for (let n of t) {
                        let t = this.readMutation(n);
                        t && (t.typeOver && (s = !0), -1 == e ? ({
                            from: e,
                            to: i
                        } = t) : (e = Math.min(t.from, e), i = Math.max(t.to, i)))
                    }
                    return {
                        from: e,
                        to: i,
                        typeOver: s
                    }
                }
                readChange() {
                    let {
                        from: t,
                        to: e,
                        typeOver: i
                    } = this.processRecords(), s = this.selectionChanged && $(this.dom, this.selectionRange);
                    if (t < 0 && !s) return null;
                    t > -1 && (this.lastChange = Date.now()), this.view.inputState.lastFocusTime = 0, this.selectionChanged = !1;
                    let n = new Ue(this.view, t, e, i);
                    return this.view.docView.domChanged = {
                        newSel: n.newSel ? n.newSel.main : null
                    }, n
                }
                flush(t = !0) {
                    if (this.delayedFlush >= 0 || this.delayedAndroidKey) return !1;
                    t && this.readSelectionRange();
                    let e = this.readChange();
                    if (!e) return this.view.requestMeasure(), !1;
                    let i = this.view.state,
                        s = Ke(this.view, e);
                    return this.view.state == i && (e.domChanged || e.newSel && !ti(this.view.state.selection, e.newSel.main)) && this.view.update([]), s
                }
                readMutation(t) {
                    let e = this.view.docView.tile.nearest(t.target);
                    if (!e || e.isWidget()) return null;
                    if (e.markDirty("attributes" == t.type), "childList" == t.type) {
                        let i = fs(e, t.previousSibling || t.target.previousSibling, -1),
                            s = fs(e, t.nextSibling || t.target.nextSibling, 1);
                        return {
                            from: i ? e.posAfter(i) : e.posAtStart,
                            to: s ? e.posBefore(s) : e.posAtEnd,
                            typeOver: !1
                        }
                    }
                    return "characterData" == t.type ? {
                        from: e.posAtStart,
                        to: e.posAtEnd,
                        typeOver: t.target.nodeValue == t.oldValue
                    } : null
                }
                setWindow(t) {
                    t != this.win && (this.removeWindowListeners(this.win), this.win = t, this.addWindowListeners(this.win))
                }
                addWindowListeners(t) {
                    t.addEventListener("resize", this.onResize), this.printQuery ? this.printQuery.addEventListener ? this.printQuery.addEventListener("change", this.onPrint) : this.printQuery.addListener(this.onPrint) : t.addEventListener("beforeprint", this.onPrint), t.addEventListener("scroll", this.onScroll), t.document.addEventListener("selectionchange", this.onSelectionChange)
                }
                removeWindowListeners(t) {
                    t.removeEventListener("scroll", this.onScroll), t.removeEventListener("resize", this.onResize), this.printQuery ? this.printQuery.removeEventListener ? this.printQuery.removeEventListener("change", this.onPrint) : this.printQuery.removeListener(this.onPrint) : t.removeEventListener("beforeprint", this.onPrint), t.document.removeEventListener("selectionchange", this.onSelectionChange)
                }
                update(t) {
                    this.editContext && (this.editContext.update(t), t.startState.facet(Wt) != t.state.facet(Wt) && (t.view.contentDOM.editContext = t.state.facet(Wt) ? this.editContext.editContext : null))
                }
                destroy() {
                    var t, e, i;
                    this.stop(), null === (t = this.intersection) || void 0 === t || t.disconnect(), null === (e = this.gapIntersection) || void 0 === e || e.disconnect(), null === (i = this.resizeScroll) || void 0 === i || i.disconnect();
                    for (let t of this.scrollTargets) t.removeEventListener("scroll", this.onScroll);
                    this.removeWindowListeners(this.win), clearTimeout(this.parentCheck), clearTimeout(this.resizeTimeout), this.win.cancelAnimationFrame(this.delayedFlush), this.win.cancelAnimationFrame(this.flushingAndroidKey), this.editContext && (this.view.contentDOM.editContext = null, this.editContext.destroy())
                }
            }

            function fs(t, e, i) {
                for (; e;) {
                    let s = oe.get(e);
                    if (s && s.parent == t) return s;
                    let n = e.parentNode;
                    e = n != t.dom ? n : i > 0 ? e.nextSibling : e.previousSibling
                }
                return null
            }

            function ps(t, e) {
                let i = e.startContainer,
                    s = e.startOffset,
                    n = e.endContainer,
                    r = e.endOffset,
                    o = t.docView.domAtPos(t.state.selection.main.anchor, 1);
                return V(o.node, o.offset, n, r) && ([i, s, n, r] = [n, r, i, s]), {
                    anchorNode: i,
                    anchorOffset: s,
                    focusNode: n,
                    focusOffset: r
                }
            }
            class ms {
                constructor(t) {
                    this.from = 0, this.to = 0, this.pendingContextChange = null, this.handlers = Object.create(null), this.composing = null, this.resetRange(t.state);
                    let e = this.editContext = new window.EditContext({
                        text: t.state.doc.sliceString(this.from, this.to),
                        selectionStart: this.toContextPos(Math.max(this.from, Math.min(this.to, t.state.selection.main.anchor))),
                        selectionEnd: this.toContextPos(t.state.selection.main.head)
                    });
                    this.handlers.textupdate = i => {
                        let n = t.state.selection.main,
                            {
                                anchor: r,
                                head: o
                            } = n,
                            l = this.toEditorPos(i.updateRangeStart),
                            a = this.toEditorPos(i.updateRangeEnd);
                        t.inputState.composing >= 0 && !this.composing && (this.composing = {
                            contextBase: i.updateRangeStart,
                            editorBase: l,
                            drifted: !1
                        });
                        let h = a - l > i.text.length;
                        l == this.from && r < this.from ? l = r : a == this.to && r > this.to && (a = r);
                        let c = Je(t.state.sliceDoc(l, a), i.text, (h ? n.from : n.to) - l, h ? "end" : null);
                        if (!c) {
                            let e = s.OF.single(this.toEditorPos(i.selectionStart), this.toEditorPos(i.selectionEnd));
                            return void(ti(e, n) || t.dispatch({
                                selection: e,
                                userEvent: "select"
                            }))
                        }
                        let u = {
                            from: c.from + l,
                            to: c.toA + l,
                            insert: s.EY.of(i.text.slice(c.from, c.toB).split("\n"))
                        };
                        if ((k.mac || k.android) && u.from == o - 1 && /^\. ?$/.test(i.text) && "off" == t.contentDOM.getAttribute("autocorrect") && (u = {
                                from: l,
                                to: a,
                                insert: s.EY.of([i.text.replace(".", " ")])
                            }), this.pendingContextChange = u, !t.state.readOnly) {
                            let e = this.to - this.from + (u.to - u.from + u.insert.length);
                            Ze(t, u, s.OF.single(this.toEditorPos(i.selectionStart, e), this.toEditorPos(i.selectionEnd, e)))
                        }
                        this.pendingContextChange && (this.revertPending(t.state), this.setSelection(t.state)), u.from < u.to && !u.insert.length && t.inputState.composing >= 0 && !/[\\p{Alphabetic}\\p{Number}_]/.test(e.text.slice(Math.max(0, i.updateRangeStart - 1), Math.min(e.text.length, i.updateRangeStart + 1))) && this.handlers.compositionend(i)
                    }, this.handlers.characterboundsupdate = i => {
                        let s = [],
                            n = null;
                        for (let e = this.toEditorPos(i.rangeStart), r = this.toEditorPos(i.rangeEnd); e < r; e++) {
                            let i = t.coordsForChar(e);
                            n = i && new DOMRect(i.left, i.top, i.right - i.left, i.bottom - i.top) || n || new DOMRect, s.push(n)
                        }
                        e.updateCharacterBounds(i.rangeStart, s)
                    }, this.handlers.textformatupdate = e => {
                        let i = [];
                        for (let t of e.getTextFormats()) {
                            let e = t.underlineStyle,
                                s = t.underlineThickness;
                            if (!/none/i.test(e) && !/none/i.test(s)) {
                                let n = this.toEditorPos(t.rangeStart),
                                    r = this.toEditorPos(t.rangeEnd);
                                if (n < r) {
                                    let t = `text-decoration: underline ${/^[a-z]/.test(e)?e+" ":"Dashed"==e?"dashed ":"Squiggle"==e?"wavy ":""}${/thin/i.test(s)?1:2}px`;
                                    i.push(D.mark({
                                        attributes: {
                                            style: t
                                        }
                                    }).range(n, r))
                                }
                            }
                        }
                        t.dispatch({
                            effects: Ft.of(D.set(i))
                        })
                    }, this.handlers.compositionstart = () => {
                        t.inputState.composing < 0 && (t.inputState.composing = 0, t.inputState.compositionFirstChange = !0)
                    }, this.handlers.compositionend = () => {
                        if (t.inputState.composing = -1, t.inputState.compositionFirstChange = null, this.composing) {
                            let {
                                drifted: e
                            } = this.composing;
                            this.composing = null, e && this.reset(t.state)
                        }
                    };
                    for (let t in this.handlers) e.addEventListener(t, this.handlers[t]);
                    this.measureReq = {
                        read: t => {
                            this.editContext.updateControlBounds(t.contentDOM.getBoundingClientRect());
                            let e = z(t.root);
                            e && e.rangeCount && this.editContext.updateSelectionBounds(e.getRangeAt(0).getBoundingClientRect())
                        }
                    }
                }
                applyEdits(t) {
                    let e = 0,
                        i = !1,
                        s = this.pendingContextChange;
                    return t.changes.iterChanges((n, r, o, l, a) => {
                        if (i) return;
                        let h = a.length - (r - n);
                        if (s && r >= s.to) {
                            if (s.from == n && s.to == r && s.insert.eq(a)) return s = this.pendingContextChange = null, e += h, void(this.to += h);
                            s = null, this.revertPending(t.state)
                        }
                        if (n += e, (r += e) <= this.from) this.from += h, this.to += h;
                        else if (n < this.to) {
                            if (n < this.from || r > this.to || this.to - this.from + a.length > 3e4) return void(i = !0);
                            this.editContext.updateText(this.toContextPos(n), this.toContextPos(r), a.toString()), this.to += h
                        }
                        e += h
                    }), s && !i && this.revertPending(t.state), !i
                }
                update(t) {
                    let e = this.pendingContextChange,
                        i = t.startState.selection.main;
                    this.composing && (this.composing.drifted || !t.changes.touchesRange(i.from, i.to) && t.transactions.some(t => !t.isUserEvent("input.type") && t.changes.touchesRange(this.from, this.to))) ? (this.composing.drifted = !0, this.composing.editorBase = t.changes.mapPos(this.composing.editorBase)) : this.applyEdits(t) && this.rangeIsValid(t.state) ? (t.docChanged || t.selectionSet || e) && this.setSelection(t.state) : (this.pendingContextChange = null, this.reset(t.state)), (t.geometryChanged || t.docChanged || t.selectionSet) && t.view.requestMeasure(this.measureReq)
                }
                resetRange(t) {
                    let {
                        head: e
                    } = t.selection.main;
                    this.from = Math.max(0, e - 1e4), this.to = Math.min(t.doc.length, e + 1e4)
                }
                reset(t) {
                    this.resetRange(t), this.editContext.updateText(0, this.editContext.text.length, t.doc.sliceString(this.from, this.to)), this.setSelection(t)
                }
                revertPending(t) {
                    let e = this.pendingContextChange;
                    this.pendingContextChange = null, this.editContext.updateText(this.toContextPos(e.from), this.toContextPos(e.from + e.insert.length), t.doc.sliceString(e.from, e.to))
                }
                setSelection(t) {
                    let {
                        main: e
                    } = t.selection, i = this.toContextPos(Math.max(this.from, Math.min(this.to, e.anchor))), s = this.toContextPos(e.head);
                    this.editContext.selectionStart == i && this.editContext.selectionEnd == s || this.editContext.updateSelection(i, s)
                }
                rangeIsValid(t) {
                    let {
                        head: e
                    } = t.selection.main;
                    return !(this.from > 0 && e - this.from < 500 || this.to < t.doc.length && this.to - e < 500 || this.to - this.from > 3e4)
                }
                toEditorPos(t, e = this.to - this.from) {
                    t = Math.min(t, e);
                    let i = this.composing;
                    return i && i.drifted ? i.editorBase + (t - i.contextBase) : t + this.from
                }
                toContextPos(t) {
                    let e = this.composing;
                    return e && e.drifted ? e.contextBase + (t - e.editorBase) : t - this.from
                }
                destroy() {
                    for (let t in this.handlers) this.editContext.removeEventListener(t, this.handlers[t])
                }
            }
            class gs {
                get state() {
                    return this.viewState.state
                }
                get viewport() {
                    return this.viewState.viewport
                }
                get visibleRanges() {
                    return this.viewState.visibleRanges
                }
                get inView() {
                    return this.viewState.inView
                }
                get composing() {
                    return !!this.inputState && this.inputState.composing > 0
                }
                get compositionStarted() {
                    return !!this.inputState && this.inputState.composing >= 0
                }
                get root() {
                    return this._root
                }
                get win() {
                    return this.dom.ownerDocument.defaultView || window
                }
                constructor(t = {}) {
                    var e;
                    this.plugins = [], 
                    this.pluginMap = new Map, 
                    this.editorAttrs = {}, 
                    this.contentAttrs = {}, 
                    this.bidiCache = [], 
                    this.destroyed = !1, 
                    this.updateState = 2, 
                    this.measureScheduled = -1, 
                    this.measureRequests = [], 
                    this.contentDOM = document.createElement("div"), 
                    this.scrollDOM = document.createElement("div"), 
                    this.scrollDOM.tabIndex = -1, 
                    this.scrollDOM.className = "css-scroller", 
                    this.scrollDOM.appendChild(this.contentDOM), 
                    this.announceDOM = document.createElement("div"), 
                    this.announceDOM.className = "css-announced", 
                    this.announceDOM.setAttribute("aria-live", "polite"), 
                    this.dom = document.createElement("div"), 
                    this.dom.appendChild(this.announceDOM), 
                    this.dom.appendChild(this.scrollDOM), 
                    t.parent && t.parent.appendChild(this.dom);
                    let {dispatch: i} = t;
                    this.dispatchTransactions = t.dispatchTransactions || i && (t => t.forEach(t => i(t, this))) || (t => this.update(t)), this.dispatch = this.dispatch.bind(this), this._root = t.root || function(t) {
                        for (; t;) {
                            if (t && (9 == t.nodeType || 11 == t.nodeType && t.host)) return t;
                            t = t.assignedSlot || t.parentNode
                        }
                        return null
                    }(t.parent) || document, this.viewState = new Yi(t.state || s.$t.create(t)), t.scrollTo && t.scrollTo.is(zt) && (this.viewState.scrollTarget = t.scrollTo.value.clip(this.viewState.state)), this.plugins = this.state.facet(jt).map(t => new Ht(t));
                    for (let t of this.plugins) t.update(this);
                    this.observer = new ds(this), this.inputState = new ei(this), this.inputState.ensureHandlers(this.plugins), this.docView = new Te(this), this.mountStyles(), this.updateAttrs(), this.updateState = 0, this.requestMeasure(), (null === (e = document.fonts) || void 0 === e ? void 0 : e.ready) && document.fonts.ready.then(() => {
                        this.viewState.mustMeasureContent = !0, this.requestMeasure()
                    })
                }
                dispatch(...t) {
                    let e = 1 == t.length && t[0] instanceof s.ZX ? t : 1 == t.length && Array.isArray(t[0]) ? t[0] : [this.state.update(...t)];
                    this.dispatchTransactions(e, this)
                }
                update(t) {
                    if (0 != this.updateState) throw new Error("Calls to EditorView.update are not allowed while an update is in progress");
                    let e, i = !1,
                        n = !1,
                        r = this.state;
                    for (let e of t) {
                        if (e.startState != r) throw new RangeError("Trying to update state with a transaction that doesn't start from the previous state.");
                        r = e.state
                    }
                    if (this.destroyed) return void(this.viewState.state = r);
                    let o = this.hasFocus,
                        l = 0,
                        a = null;
                    t.some(t => t.annotation(xi)) ? (this.inputState.notifiedFocused = o, l = 1) : o != this.inputState.notifiedFocused && (this.inputState.notifiedFocused = o, a = ki(r, o), a || (l = 1));
                    let h = this.observer.delayedAndroidKey,
                        c = null;
                    if (h ? (this.observer.clearDelayedAndroidKey(), c = this.observer.readChange(), (c && !this.state.doc.eq(r.doc) || !this.state.selection.eq(r.selection)) && (c = null)) : this.observer.clear(), r.facet(s.$t.phrases) != this.state.facet(s.$t.phrases)) return this.setState(r);
                    e = ne.create(this, r, t), e.flags |= l;
                    let u = this.viewState.scrollTarget;
                    try {
                        this.updateState = 2;
                        for (let e of t) {
                            if (u && (u = u.map(e.changes)), e.scrollIntoView) {
                                let {
                                    main: t
                                } = e.state.selection;
                                u = new It(t.empty ? t : s.OF.cursor(t.head, t.head > t.anchor ? -1 : 1))
                            }
                            for (let t of e.effects) t.is(zt) && (u = t.value.clip(this.state))
                        }
                        this.viewState.update(e, u), this.bidiCache = ws.update(this.bidiCache, e.changes), e.empty || (this.updatePlugins(e), this.inputState.update(e)), i = this.docView.update(e), this.state.facet(ie) != this.styleModules && this.mountStyles(), n = this.updateAttrs(), this.showAnnouncements(t), this.docView.updateSelection(i, t.some(t => t.isUserEvent("select.pointer")))
                    } finally {
                        this.updateState = 0
                    }
                    if (e.startState.facet(is) != e.state.facet(is) && (this.viewState.mustMeasureContent = !0), (i || n || u || this.viewState.mustEnforceCursorAssoc || this.viewState.mustMeasureContent) && this.requestMeasure(), i && this.docViewUpdate(), !e.empty)
                        for (let t of this.state.facet(Tt)) try {
                            t(e)
                        } catch (t) {
                            $t(this.state, t, "update listener")
                        }(a || c) && Promise.resolve().then(() => {
                            a && this.state == a.startState && this.dispatch(a), c && !Ke(this, c) && h.force && et(this.contentDOM, h.key, h.keyCode)
                        })
                }
                setState(t) {
                    if (0 != this.updateState) throw new Error("Calls to EditorView.setState are not allowed while an update is in progress");
                    if (this.destroyed) return void(this.viewState.state = t);
                    this.updateState = 2;
                    let e = this.hasFocus;
                    try {
                        for (let t of this.plugins) t.destroy(this);
                        this.viewState = new Yi(t), this.plugins = t.facet(jt).map(t => new Ht(t)), this.pluginMap.clear();
                        for (let t of this.plugins) t.update(this);
                        this.docView.destroy(), this.docView = new Te(this), this.inputState.ensureHandlers(this.plugins), this.mountStyles(), this.updateAttrs(), this.bidiCache = []
                    } finally {
                        this.updateState = 0
                    }
                    e && this.focus(), this.requestMeasure()
                }
                updatePlugins(t) {
                    let e = t.startState.facet(jt),
                        i = t.state.facet(jt);
                    if (e != i) {
                        let s = [];
                        for (let n of i) {
                            let i = e.indexOf(n);
                            if (i < 0) s.push(new Ht(n));
                            else {
                                let e = this.plugins[i];
                                e.mustUpdate = t, s.push(e)
                            }
                        }
                        for (let e of this.plugins) e.mustUpdate != t && e.destroy(this);
                        this.plugins = s, this.pluginMap.clear()
                    } else
                        for (let e of this.plugins) e.mustUpdate = t;
                    for (let t = 0; t < this.plugins.length; t++) this.plugins[t].update(this);
                    e != i && this.inputState.ensureHandlers(this.plugins)
                }
                docViewUpdate() {
                    for (let t of this.plugins) {
                        let e = t.value;
                        if (e && e.docViewUpdate) try {
                            e.docViewUpdate(this)
                        } catch (t) {
                            $t(this.state, t, "doc view update listener")
                        }
                    }
                }
                measure(t = !0) {
                    if (this.destroyed) return;
                    if (this.measureScheduled > -1 && this.win.cancelAnimationFrame(this.measureScheduled), this.observer.delayedAndroidKey) return this.measureScheduled = -1, void this.requestMeasure();
                    this.measureScheduled = 0, t && this.observer.forceFlush();
                    let e = null,
                        i = this.scrollDOM,
                        s = i.scrollTop * this.scaleY,
                        {
                            scrollAnchorPos: n,
                            scrollAnchorHeight: r
                        } = this.viewState;
                    Math.abs(s - this.viewState.scrollTop) > 1 && (r = -1), this.viewState.scrollAnchorHeight = -1;
                    try {
                        for (let t = 0;; t++) {
                            if (r < 0)
                                if (it(i)) n = -1, r = this.viewState.heightMap.height;
                                else {
                                    let t = this.viewState.scrollAnchorAt(s);
                                    n = t.from, r = t.top
                                } this.updateState = 1;
                            let o = this.viewState.measure(this);
                            if (!o && !this.measureRequests.length && null == this.viewState.scrollTarget) break;
                            if (t > 5) {
                                console.warn(this.measureRequests.length ? "Measure loop restarted more than 5 times" : "Viewport failed to stabilize");
                                break
                            }
                            let l = [];
                            4 & o || ([this.measureRequests, l] = [l, this.measureRequests]);
                            let a = l.map(t => {
                                    try {
                                        return t.read(this)
                                    } catch (t) {
                                        return $t(this.state, t), bs
                                    }
                                }),
                                h = ne.create(this, this.state, []),
                                c = !1;
                            h.flags |= o, e ? e.flags |= o : e = h, this.updateState = 2, h.empty || (this.updatePlugins(h), this.inputState.update(h), this.updateAttrs(), c = this.docView.update(h), c && this.docViewUpdate());
                            for (let t = 0; t < l.length; t++)
                                if (a[t] != bs) try {
                                    let e = l[t];
                                    e.write && e.write(a[t], this)
                                } catch (t) {
                                    $t(this.state, t)
                                }
                            if (c && this.docView.updateSelection(!0), !h.viewportChanged && 0 == this.measureRequests.length) {
                                if (this.viewState.editorHeight) {
                                    if (this.viewState.scrollTarget) {
                                        this.docView.scrollIntoView(this.viewState.scrollTarget), this.viewState.scrollTarget = null, r = -1;
                                        continue
                                    } {
                                        let t = (n < 0 ? this.viewState.heightMap.height : this.viewState.lineBlockAt(n).top) - r;
                                        if (t > 1 || t < -1) {
                                            s += t, i.scrollTop = s / this.scaleY, r = -1;
                                            continue
                                        }
                                    }
                                }
                                break
                            }
                        }
                    } finally {
                        this.updateState = 0, this.measureScheduled = -1
                    }
                    if (e && !e.empty)
                        for (let t of this.state.facet(Tt)) t(e)
                }
                get themeClasses() {
                    return ns + " " + (this.state.facet(ss) ? os : rs) + " " + this.state.facet(is)
                }
                updateAttrs() {
                    let t = ys(this, _t, {
                            class: "css-editor" + (this.hasFocus ? " css-focused " : " ") + this.themeClasses
                        }),
                        e = {
                            spellcheck: "false",
                            autocorrect: "off",
                            autocapitalize: "off",
                            writingsuggestions: "false",
                            translate: "no",
                            contenteditable: this.state.facet(Wt) ? "true" : "false",
                            class: "css-content",
                            style: `${k.tabSize}: ${this.state.tabSize}`,
                            role: "textbox",
                            "aria-multiline": "true"
                        };
                    this.state.readOnly && (e["aria-readonly"] = "true"), ys(this, Xt, e);
                    let i = this.observer.ignore(() => {
                        let i = M(this.contentDOM, this.contentAttrs, e),
                            s = M(this.dom, this.editorAttrs, t);
                        return i || s
                    });
                    return this.editorAttrs = t, this.contentAttrs = e, i
                }
                showAnnouncements(t) {
                    let e = !0;
                    for (let i of t)
                        for (let t of i.effects) t.is(gs.announce) && (e && (this.announceDOM.textContent = ""), e = !1, this.announceDOM.appendChild(document.createElement("div")).textContent = t.value)
                }
                mountStyles() {
                    this.styleModules = this.state.facet(ie);
                    let t = this.state.facet(gs.cspNonce);
                    n.G.mount(this.root, this.styleModules.concat(hs).reverse(), t ? {
                        nonce: t
                    } : void 0)
                }
                readMeasured() {
                    if (2 == this.updateState) throw new Error("Reading the editor layout isn't allowed during an update");
                    0 == this.updateState && this.measureScheduled > -1 && this.measure(!1)
                }
                requestMeasure(t) {
                    if (this.measureScheduled < 0 && (this.measureScheduled = this.win.requestAnimationFrame(() => this.measure())), t) {
                        if (this.measureRequests.indexOf(t) > -1) return;
                        if (null != t.key)
                            for (let e = 0; e < this.measureRequests.length; e++)
                                if (this.measureRequests[e].key === t.key) return void(this.measureRequests[e] = t);
                        this.measureRequests.push(t)
                    }
                }
                plugin(t) {
                    let e = this.pluginMap.get(t);
                    return (void 0 === e || e && e.plugin != t) && this.pluginMap.set(t, e = this.plugins.find(e => e.plugin == t) || null), e && e.update(this).value
                }
                get documentTop() {
                    return this.contentDOM.getBoundingClientRect().top + this.viewState.paddingTop
                }
                get documentPadding() {
                    return {
                        top: this.viewState.paddingTop,
                        bottom: this.viewState.paddingBottom
                    }
                }
                get scaleX() {
                    return this.viewState.scaleX
                }
                get scaleY() {
                    return this.viewState.scaleY
                }
                elementAtHeight(t) {
                    return this.readMeasured(), this.viewState.elementAtHeight(t)
                }
                lineBlockAtHeight(t) {
                    return this.readMeasured(), this.viewState.lineBlockAtHeight(t)
                }
                get viewportLineBlocks() {
                    return this.viewState.viewportLines
                }
                lineBlockAt(t) {
                    return this.viewState.lineBlockAt(t)
                }
                get contentHeight() {
                    return this.viewState.contentHeight
                }
                moveByChar(t, e, i) {
                    return Fe(this, t, Ne(this, t, e, i))
                }
                moveByGroup(t, e) {
                    return Fe(this, t, Ne(this, t, e, e => function(t, e, i) {
                        let n = t.state.charCategorizer(e),
                            r = n(i);
                        return t => {
                            let e = n(t);
                            return r == s.Je.Space && (r = e), r == e
                        }
                    }(this, t.head, e)))
                }
                visualLineSide(t, e) {
                    let i = this.bidiSpans(t),
                        n = this.textDirectionAt(t.from),
                        r = i[e ? i.length - 1 : 0];
                    return s.OF.cursor(r.side(e, n) + t.from, r.forward(!e, n) ? 1 : -1)
                }
                moveToLineBoundary(t, e, i = !0) {
                    return function(t, e, i, n) {
                        let r = Le(t, e.head, e.assoc || -1),
                            o = n && r.type == P.Text && (t.lineWrapping || r.widgetLineBreaks) ? t.coordsAtPos(e.assoc < 0 && e.head > r.from ? e.head - 1 : e.head) : null;
                        if (o) {
                            let e = t.dom.getBoundingClientRect(),
                                n = t.textDirectionAt(r.from),
                                l = t.posAtCoords({
                                    x: i == (n == ot.LTR) ? e.right - 1 : e.left + 1,
                                    y: (o.top + o.bottom) / 2
                                });
                            if (null != l) return s.OF.cursor(l, i ? -1 : 1)
                        }
                        return s.OF.cursor(i ? r.to : r.from, i ? -1 : 1)
                    }(this, t, e, i)
                }
                moveVertically(t, e, i) {
                    return Fe(this, t, function(t, e, i, n) {
                        let r = e.head,
                            o = i ? 1 : -1;
                        if (r == (i ? t.state.doc.length : 0)) return s.OF.cursor(r, e.assoc);
                        let l, a = e.goalColumn,
                            h = t.contentDOM.getBoundingClientRect(),
                            c = t.coordsAtPos(r, e.assoc || -1),
                            u = t.documentTop;
                        if (c) null == a && (a = c.left - h.left), l = o < 0 ? c.top : c.bottom;
                        else {
                            let e = t.viewState.lineBlockAt(r);
                            null == a && (a = Math.min(h.right - h.left, t.defaultCharacterWidth * (r - e.from))), l = (o < 0 ? e.top : e.bottom) + u
                        }
                        let d = We(t, {
                            x: h.left + a,
                            y: l + (null != n ? n : t.viewState.heightOracle.textHeight >> 1) * o
                        }, !1, o);
                        return s.OF.cursor(d.pos, d.assoc, void 0, a)
                    }(this, t, e, i))
                }
                domAtPos(t, e = 1) {
                    return this.docView.domAtPos(t, e)
                }
                posAtDOM(t, e = 0) {
                    return this.docView.posFromDOM(t, e)
                }
                posAtCoords(t, e = !0) {
                    this.readMeasured();
                    let i = We(this, t, e);
                    return i && i.pos
                }
                posAndSideAtCoords(t, e = !0) {
                    return this.readMeasured(), We(this, t, e)
                }
                coordsAtPos(t, e = 1) {
                    this.readMeasured();
                    let i = this.docView.coordsAt(t, e);
                    if (!i || i.left == i.right) return i;
                    let s = this.state.doc.lineAt(t),
                        n = this.bidiSpans(s);
                    return X(i, n[gt.find(n, t - s.from, -1, e)].dir == ot.LTR == e > 0)
                }
                coordsForChar(t) {
                    return this.readMeasured(), this.docView.coordsForChar(t)
                }
                get defaultCharacterWidth() {
                    return this.viewState.heightOracle.charWidth
                }
                get defaultLineHeight() {
                    return this.viewState.heightOracle.lineHeight
                }
                get textDirection() {
                    return this.viewState.defaultTextDirection
                }
                textDirectionAt(t) {
                    return !this.state.facet(Bt) || t < this.viewport.from || t > this.viewport.to ? this.textDirection : (this.readMeasured(), this.docView.textDirectionAt(t))
                }
                get lineWrapping() {
                    return this.viewState.heightOracle.lineWrapping
                }
                bidiSpans(t) {
                    if (t.length > vs) return Ot(t.length);
                    let e, i = this.textDirectionAt(t.from);
                    for (let s of this.bidiCache)
                        if (s.from == t.from && s.dir == i && (s.fresh || vt(s.isolates, e = Jt(this, t)))) return s.order;
                    e || (e = Jt(this, t));
                    let s = function(t, e, i) {
                        if (!t) return [new gt(0, 0, e == at ? 1 : 0)];
                        if (e == lt && !i.length && !mt.test(t)) return Ot(t.length);
                        if (i.length)
                            for (; t.length > bt.length;) bt[bt.length] = 256;
                        let s = [],
                            n = e == lt ? 0 : 1;
                        return yt(t, n, n, i, 0, t.length, s), s
                    }(t.text, i, e);
                    return this.bidiCache.push(new ws(t.from, t.to, i, e, !0, s)), s
                }
                get hasFocus() {
                    var t;
                    return (this.dom.ownerDocument.hasFocus() || k.safari && (null === (t = this.inputState) || void 0 === t ? void 0 : t.lastContextMenu) > Date.now() - 3e4) && this.root.activeElement == this.contentDOM
                }
                focus() {
                    this.observer.ignore(() => {
                        J(this.contentDOM), this.docView.updateSelection()
                    })
                }
                setRoot(t) {
                    this._root != t && (this._root = t, this.observer.setWindow((9 == t.nodeType ? t : t.ownerDocument).defaultView || window), this.mountStyles())
                }
                destroy() {
                    this.root.activeElement == this.contentDOM && this.contentDOM.blur();
                    for (let t of this.plugins) t.destroy(this);
                    this.plugins = [], this.inputState.destroy(), this.docView.destroy(), this.dom.remove(), this.observer.destroy(), this.measureScheduled > -1 && this.win.cancelAnimationFrame(this.measureScheduled), this.destroyed = !0
                }
                static scrollIntoView(t, e = {}) {
                    return zt.of(new It("number" == typeof t ? s.OF.cursor(t) : t, e.y, e.x, e.yMargin, e.xMargin))
                }
                scrollSnapshot() {
                    let {
                        scrollTop: t,
                        scrollLeft: e
                    } = this.scrollDOM, i = this.viewState.scrollAnchorAt(t);
                    return zt.of(new It(s.OF.cursor(i.from), "start", "start", i.top - t, e, !0))
                }
                setTabFocusMode(t) {
                    null == t ? this.inputState.tabFocusMode = this.inputState.tabFocusMode < 0 ? 0 : -1 : "boolean" == typeof t ? this.inputState.tabFocusMode = t ? 0 : -1 : 0 != this.inputState.tabFocusMode && (this.inputState.tabFocusMode = Date.now() + t)
                }
                static domEventHandlers(t) {
                    return qt.define(() => ({}), {
                        eventHandlers: t
                    })
                }
                static domEventObservers(t) {
                    return qt.define(() => ({}), {
                        eventObservers: t
                    })
                }
                static theme(t, e) {
                    let i = n.G.newName(),
                        s = [is.of(i), ie.of(as(`.${i}`, t))];
                    return e && e.dark && s.push(ss.of(!0)), s
                }
                static baseTheme(t) {
                    return s.Nb.lowest(ie.of(as("." + ns, t, ls)))
                }
                static findFromDOM(t) {
                    var e;
                    let i = t.querySelector(".css-content"),
                        s = i && oe.get(i) || oe.get(t);
                    return (null === (e = null == s ? void 0 : s.root) || void 0 === e ? void 0 : e.view) || null
                }
            }
            gs.styleModule = ie, gs.inputHandler = Pt, gs.clipboardInputFilter = Rt, gs.clipboardOutputFilter = Et, gs.scrollHandler = Nt, gs.focusChangeEffect = Dt, gs.perLineTextDirection = Bt, gs.exceptionSink = Qt, gs.updateListener = Tt, gs.editable = Wt, gs.mouseSelectionStyle = Mt, gs.dragMovesSelection = At, gs.clickAddsSelectionRange = Ct, gs.decorations = Yt, gs.blockWrappers = Ut, gs.outerDecorations = Gt, gs.atomicRanges = Kt, gs.bidiIsolatedRanges = Zt, gs.scrollMargins = te, gs.darkTheme = ss, gs.cspNonce = s.sj.define({
                combine: t => t.length ? t[0] : ""
            }), gs.contentAttributes = Xt, gs.editorAttributes = _t, gs.lineWrapping = gs.contentAttributes.of({
                class: "css-lineWrapping"
            }), gs.announce = s.Pe.define();
            const vs = 4096,
                bs = {};
            class ws {
                constructor(t, e, i, s, n, r) {
                    this.from = t, this.to = e, this.dir = i, this.isolates = s, this.fresh = n, this.order = r
                }
                static update(t, e) {
                    if (e.empty && !t.some(t => t.fresh)) return t;
                    let i = [],
                        s = t.length ? t[t.length - 1].dir : ot.LTR;
                    for (let n = Math.max(0, t.length - 10); n < t.length; n++) {
                        let r = t[n];
                        r.dir != s || e.touchesRange(r.from, r.to) || i.push(new ws(e.mapPos(r.from, 1), e.mapPos(r.to, -1), r.dir, r.isolates, !1, r.order))
                    }
                    return i
                }
            }

            function ys(t, e, i) {
                for (let s = t.state.facet(e), n = s.length - 1; n >= 0; n--) {
                    let e = s[n],
                        r = "function" == typeof e ? e(t) : e;
                    r && S(r, i)
                }
                return i
            }
            const Os = k.mac ? "mac" : k.windows ? "win" : k.linux ? "linux" : "key";

            function xs(t, e, i) {
                return e.altKey && (t = "Alt-" + t), e.ctrlKey && (t = "Ctrl-" + t), e.metaKey && (t = "Meta-" + t), !1 !== i && e.shiftKey && (t = "Shift-" + t), t
            }
            const ks = s.Nb.default(gs.domEventHandlers({
                    keydown: (t, e) => Ps(As(e.state), t, e, "editor")
                })),
                Ss = s.sj.define({
                    enables: ks
                }),
                Cs = new WeakMap;

            function As(t) {
                let e = t.facet(Ss),
                    i = Cs.get(e);
                return i || Cs.set(e, i = function(t, e = Os) {
                    let i = Object.create(null),
                        s = Object.create(null),
                        n = (t, e) => {
                            let i = s[t];
                            if (null == i) s[t] = e;
                            else if (i != e) throw new Error("Key binding " + t + " is used both as a regular binding and as a multi-stroke prefix")
                        },
                        r = (t, s, r, o, l) => {
                            var a, h;
                            let c = i[t] || (i[t] = Object.create(null)),
                                u = s.split(/ (?!$)/).map(t => function(t, e) {
                                    const i = t.split(/-(?!$)/);
                                    let s, n, r, o, l = i[i.length - 1];
                                    "Space" == l && (l = " ");
                                    for (let t = 0; t < i.length - 1; ++t) {
                                        const l = i[t];
                                        if (/^(cmd|meta|m)$/i.test(l)) o = !0;
                                        else if (/^a(lt)?$/i.test(l)) s = !0;
                                        else if (/^(c|ctrl|control)$/i.test(l)) n = !0;
                                        else if (/^s(hift)?$/i.test(l)) r = !0;
                                        else {
                                            if (!/^mod$/i.test(l)) throw new Error("Unrecognized modifier name: " + l);
                                            "mac" == e ? o = !0 : n = !0
                                        }
                                    }
                                    return s && (l = "Alt-" + l), n && (l = "Ctrl-" + l), o && (l = "Meta-" + l), r && (l = "Shift-" + l), l
                                }(t, e));
                            for (let e = 1; e < u.length; e++) {
                                let i = u.slice(0, e).join(" ");
                                n(i, !0), c[i] || (c[i] = {
                                    preventDefault: !0,
                                    stopPropagation: !1,
                                    run: [e => {
                                        let s = Qs = {
                                            view: e,
                                            prefix: i,
                                            scope: t
                                        };
                                        return setTimeout(() => {
                                            Qs == s && (Qs = null)
                                        }, 4e3), !0
                                    }]
                                })
                            }
                            let d = u.join(" ");
                            n(d, !1);
                            let f = c[d] || (c[d] = {
                                preventDefault: !1,
                                stopPropagation: !1,
                                run: (null === (h = null === (a = c._any) || void 0 === a ? void 0 : a.run) || void 0 === h ? void 0 : h.slice()) || []
                            });
                            r && f.run.push(r), o && (f.preventDefault = !0), l && (f.stopPropagation = !0)
                        };
                    for (let s of t) {
                        let t = s.scope ? s.scope.split(" ") : ["editor"];
                        if (s.any)
                            for (let e of t) {
                                let t = i[e] || (i[e] = Object.create(null));
                                t._any || (t._any = {
                                    preventDefault: !1,
                                    stopPropagation: !1,
                                    run: []
                                });
                                let {
                                    any: n
                                } = s;
                                for (let e in t) t[e].run.push(t => n(t, Ts))
                            }
                        let n = s[e] || s.key;
                        if (n)
                            for (let e of t) r(e, n, s.run, s.preventDefault, s.stopPropagation), s.shift && r(e, "Shift-" + n, s.shift, s.preventDefault, s.stopPropagation)
                    }
                    return i
                }(e.reduce((t, e) => t.concat(e), []))), i
            }

            function Ms(t, e, i) {
                return Ps(As(t.state), e, t, i)
            }
            let Qs = null,
                Ts = null;

            function Ps(t, e, i, n) {
                Ts = e;
                let h = function(t) {
                        var e = !(l && t.metaKey && t.shiftKey && !t.ctrlKey && !t.altKey || a && t.shiftKey && t.key && 1 == t.key.length || "Unidentified" == t.key) && t.key || (t.shiftKey ? o : r)[t.keyCode] || t.key || "Unidentified";
                        return "Esc" == e && (e = "Escape"), "Del" == e && (e = "Delete"), "Left" == e && (e = "ArrowLeft"), "Up" == e && (e = "ArrowUp"), "Right" == e && (e = "ArrowRight"), "Down" == e && (e = "ArrowDown"), e
                    }(e),
                    c = (0, s.vS)(h, 0),
                    u = (0, s.Fh)(c) == h.length && " " != h,
                    d = "",
                    f = !1,
                    p = !1,
                    m = !1;
                Qs && Qs.view == i && Qs.scope == n && (d = Qs.prefix + " ", oi.indexOf(e.keyCode) < 0 && (p = !0, Qs = null));
                let g, v, b = new Set,
                    w = t => {
                        if (t) {
                            for (let e of t.run)
                                if (!b.has(e) && (b.add(e), e(i))) return t.stopPropagation && (m = !0), !0;
                            t.preventDefault && (t.stopPropagation && (m = !0), p = !0)
                        }
                        return !1
                    },
                    y = t[n];
                return y && (w(y[d + xs(h, e, !u)]) ? f = !0 : !u || !(e.altKey || e.metaKey || e.ctrlKey) || k.windows && e.ctrlKey && e.altKey || k.mac && e.altKey && !e.ctrlKey && !e.metaKey || !(g = r[e.keyCode]) || g == h ? u && e.shiftKey && w(y[d + xs(h, e, !0)]) && (f = !0) : (w(y[d + xs(g, e, !0)]) || e.shiftKey && (v = o[e.keyCode]) != h && v != g && w(y[d + xs(v, e, !1)])) && (f = !0), !f && w(y._any) && (f = !0)), p && (f = !0), f && m && e.stopPropagation(), Ts = null, f
            }
            class Ds {
                constructor(t, e, i, s, n) {
                    this.className = t, this.left = e, this.top = i, this.width = s, this.height = n
                }
                draw() {
                    let t = document.createElement("div");
                    return t.className = this.className, this.adjust(t), t
                }
                update(t, e) {
                    return e.className == this.className && (this.adjust(t), !0)
                }
                adjust(t) {
                    t.style.left = this.left + "px", t.style.top = this.top + "px", null != this.width && (t.style.width = this.width + "px"), t.style.height = this.height + "px"
                }
                eq(t) {
                    return this.left == t.left && this.top == t.top && this.width == t.width && this.height == t.height && this.className == t.className
                }
                static forRange(t, e, i) {
                    if (i.empty) {
                        let s = t.coordsAtPos(i.head, i.assoc || 1);
                        if (!s) return [];
                        let n = Rs(t);
                        return [new Ds(e, s.left - n.left, s.top - n.top, null, s.bottom - s.top)]
                    }
                    return function(t, e, i) {
                        if (i.to <= t.viewport.from || i.from >= t.viewport.to) return [];
                        let s = Math.max(i.from, t.viewport.from),
                            n = Math.min(i.to, t.viewport.to),
                            r = t.textDirection == ot.LTR,
                            o = t.contentDOM,
                            l = o.getBoundingClientRect(),
                            a = Rs(t),
                            h = o.querySelector(".css-line"),
                            c = h && window.getComputedStyle(h),
                            u = l.left + (c ? parseInt(c.paddingLeft) + Math.min(0, parseInt(c.textIndent)) : 0),
                            d = l.right - (c ? parseInt(c.paddingRight) : 0),
                            f = Le(t, s, 1),
                            p = Le(t, n, -1),
                            m = f.type == P.Text ? f : null,
                            g = p.type == P.Text ? p : null;
                        if (m && (t.lineWrapping || f.widgetLineBreaks) && (m = Es(t, s, 1, m)), g && (t.lineWrapping || p.widgetLineBreaks) && (g = Es(t, n, -1, g)), m && g && m.from == g.from && m.to == g.to) return b(w(i.from, i.to, m));
                        {
                            let e = m ? w(i.from, null, m) : y(f, !1),
                                s = g ? w(null, i.to, g) : y(p, !0),
                                n = [];
                            return (m || f).to < (g || p).from - (m && g ? 1 : 0) || f.widgetLineBreaks > 1 && e.bottom + t.defaultLineHeight / 2 < s.top ? n.push(v(u, e.bottom, d, s.top)) : e.bottom < s.top && t.elementAtHeight((e.bottom + s.top) / 2).type == P.Text && (e.bottom = s.top = (e.bottom + s.top) / 2), b(e).concat(n).concat(b(s))
                        }

                        function v(t, i, s, n) {
                            return new Ds(e, t - a.left, i - a.top, s - t, n - i)
                        }

                        function b({
                            top: t,
                            bottom: e,
                            horizontal: i
                        }) {
                            let s = [];
                            for (let n = 0; n < i.length; n += 2) s.push(v(i[n], t, i[n + 1], e));
                            return s
                        }

                        function w(e, i, s) {
                            let n = 1e9,
                                o = -1e9,
                                l = [];

                            function a(e, i, a, h, c) {
                                let f = t.coordsAtPos(e, e == s.to ? -2 : 2),
                                    p = t.coordsAtPos(a, a == s.from ? 2 : -2);
                                f && p && (n = Math.min(f.top, p.top, n), o = Math.max(f.bottom, p.bottom, o), c == ot.LTR ? l.push(r && i ? u : f.left, r && h ? d : p.right) : l.push(!r && h ? u : p.left, !r && i ? d : f.right))
                            }
                            let h = null != e ? e : s.from,
                                c = null != i ? i : s.to;
                            for (let s of t.visibleRanges)
                                if (s.to > h && s.from < c)
                                    for (let n = Math.max(s.from, h), r = Math.min(s.to, c);;) {
                                        let s = t.state.doc.lineAt(n);
                                        for (let o of t.bidiSpans(s)) {
                                            let t = o.from + s.from,
                                                l = o.to + s.from;
                                            if (t >= r) break;
                                            l > n && a(Math.max(t, n), null == e && t <= h, Math.min(l, r), null == i && l >= c, o.dir)
                                        }
                                        if (n = s.to + 1, n >= r) break
                                    }
                            return 0 == l.length && a(h, null == e, c, null == i, t.textDirection), {
                                top: n,
                                bottom: o,
                                horizontal: l
                            }
                        }

                        function y(t, e) {
                            let i = l.top + (e ? t.top : t.bottom);
                            return {
                                top: i,
                                bottom: i,
                                horizontal: []
                            }
                        }
                    }(t, e, i)
                }
            }

            function Rs(t) {
                let e = t.scrollDOM.getBoundingClientRect();
                return {
                    left: (t.textDirection == ot.LTR ? e.left : e.right - t.scrollDOM.clientWidth * t.scaleX) - t.scrollDOM.scrollLeft * t.scaleX,
                    top: e.top - t.scrollDOM.scrollTop * t.scaleY
                }
            }

            function Es(t, e, i, s) {
                let n = t.coordsAtPos(e, 2 * i);
                if (!n) return s;
                let r = t.dom.getBoundingClientRect(),
                    o = (n.top + n.bottom) / 2,
                    l = t.posAtCoords({
                        x: r.left + 1,
                        y: o
                    }),
                    a = t.posAtCoords({
                        x: r.right - 1,
                        y: o
                    });
                return null == l || null == a ? s : {
                    from: Math.max(s.from, Math.min(l, a)),
                    to: Math.min(s.to, Math.max(l, a))
                }
            }
            class Bs {
                constructor(t, e) {
                    this.view = t, this.layer = e, this.drawn = [], this.scaleX = 1, this.scaleY = 1, this.measureReq = {
                        read: this.measure.bind(this),
                        write: this.draw.bind(this)
                    }, this.dom = t.scrollDOM.appendChild(document.createElement("div")), this.dom.classList.add("css-layer"), e.above && this.dom.classList.add("css-layer-above"), e.class && this.dom.classList.add(e.class), this.scale(), this.dom.setAttribute("aria-hidden", "true"), this.setOrder(t.state), t.requestMeasure(this.measureReq), e.mount && e.mount(this.dom, t)
                }
                update(t) {
                    t.startState.facet(Ls) != t.state.facet(Ls) && this.setOrder(t.state), (this.layer.update(t, this.dom) || t.geometryChanged) && (this.scale(), t.view.requestMeasure(this.measureReq))
                }
                docViewUpdate(t) {
                    !1 !== this.layer.updateOnDocViewUpdate && t.requestMeasure(this.measureReq)
                }
                setOrder(t) {
                    let e = 0,
                        i = t.facet(Ls);
                    for (; e < i.length && i[e] != this.layer;) e++;
                    this.dom.style.zIndex = String((this.layer.above ? 150 : -1) - e)
                }
                measure() {
                    return this.layer.markers(this.view)
                }
                scale() {
                    let {
                        scaleX: t,
                        scaleY: e
                    } = this.view;
                    t == this.scaleX && e == this.scaleY || (this.scaleX = t, this.scaleY = e, this.dom.style.transform = `scale(${1/t}, ${1/e})`)
                }
                draw(t) {
                    if (t.length != this.drawn.length || t.some((t, e) => {
                            return i = t, s = this.drawn[e], !(i.constructor == s.constructor && i.eq(s));
                            var i, s
                        })) {
                        let e = this.dom.firstChild,
                            i = 0;
                        for (let s of t) s.update && e && s.constructor && this.drawn[i].constructor && s.update(e, this.drawn[i]) ? (e = e.nextSibling, i++) : this.dom.insertBefore(s.draw(), e);
                        for (; e;) {
                            let t = e.nextSibling;
                            e.remove(), e = t
                        }
                        this.drawn = t, k.safari && k.safari_version >= 26 && (this.dom.style.display = this.dom.firstChild ? "" : "none")
                    }
                }
                destroy() {
                    this.layer.destroy && this.layer.destroy(this.dom, this.view), this.dom.remove()
                }
            }
            const Ls = s.sj.define();

            function Ns(t) {
                return [qt.define(e => new Bs(e, t)), Ls.of(t)]
            }
            const Is = s.sj.define({
                combine: t => (0, s.QR)(t, {
                    cursorBlinkRate: 1200,
                    drawRangeCursor: !0
                }, {
                    cursorBlinkRate: (t, e) => Math.min(t, e),
                    drawRangeCursor: (t, e) => t || e
                })
            });

            function zs(t = {}) {
                return [Is.of(t), $s, Vs, js, Lt.of(!0)]
            }

            function Fs(t) {
                return t.startState.facet(Is) != t.state.facet(Is)
            }
            const $s = Ns({
                above: !0,
                markers(t) {
                    let {
                        state: e
                    } = t, i = e.facet(Is), n = [];
                    for (let r of e.selection.ranges) {
                        let o = r == e.selection.main;
                        if (r.empty || i.drawRangeCursor) {
                            let e = o ? "css-cursor css-cursor-primary" : "css-cursor css-cursor-secondary",
                                i = r.empty ? r : s.OF.cursor(r.head, r.head > r.anchor ? -1 : 1);
                            for (let s of Ds.forRange(t, e, i)) n.push(s)
                        }
                    }
                    return n
                },
                update(t, e) {
                    t.transactions.some(t => t.selection) && (e.style.animationName = "css-blink" == e.style.animationName ? "css-blink2" : "css-blink");
                    let i = Fs(t);
                    return i && Ws(t.state, e), t.docChanged || t.selectionSet || i
                },
                mount(t, e) {
                    Ws(e.state, t)
                },
                class: "css-cursorLayer"
            });

            function Ws(t, e) {
                e.style.animationDuration = t.facet(Is).cursorBlinkRate + "ms"
            }
            const Vs = Ns({
                    above: !1,
                    markers: t => t.state.selection.ranges.map(e => e.empty ? [] : Ds.forRange(t, "css-selectionBackground", e)).reduce((t, e) => t.concat(e)),
                    update: (t, e) => t.docChanged || t.selectionSet || t.viewportChanged || Fs(t),
                    class: "css-selectionLayer"
                }),
                js = s.Nb.highest(gs.theme({
                    ".css-line": {
                        "& ::selection, &::selection": {
                            backgroundColor: "transparent"
                        },
                        caretColor: "transparent"
                    },
                    ".css-content": {
                        caretColor: "transparent",
                        "& :focus": {
                            caretColor: "initial",
                            "&::selection, & ::selection": {
                                backgroundColor: "Highlight"
                            }
                        }
                    }
                })),
                qs = s.Pe.define({
                    map: (t, e) => null == t ? null : e.mapPos(t)
                }),
                Hs = s.sU.define({
                    create: () => null,
                    update: (t, e) => (null != t && (t = e.changes.mapPos(t)), e.effects.reduce((t, e) => e.is(qs) ? e.value : t, t))
                }),
                _s = qt.fromClass(class {
                    constructor(t) {
                        this.view = t, this.cursor = null, this.measureReq = {
                            read: this.readPos.bind(this),
                            write: this.drawCursor.bind(this)
                        }
                    }
                    update(t) {
                        var e;
                        let i = t.state.field(Hs);
                        null == i ? null != this.cursor && (null === (e = this.cursor) || void 0 === e || e.remove(), this.cursor = null) : (this.cursor || (this.cursor = this.view.scrollDOM.appendChild(document.createElement("div")), this.cursor.className = "css-dropCursor"), (t.startState.field(Hs) != i || t.docChanged || t.geometryChanged) && this.view.requestMeasure(this.measureReq))
                    }
                    readPos() {
                        let {
                            view: t
                        } = this, e = t.state.field(Hs), i = null != e && t.coordsAtPos(e);
                        if (!i) return null;
                        let s = t.scrollDOM.getBoundingClientRect();
                        return {
                            left: i.left - s.left + t.scrollDOM.scrollLeft * t.scaleX,
                            top: i.top - s.top + t.scrollDOM.scrollTop * t.scaleY,
                            height: i.bottom - i.top
                        }
                    }
                    drawCursor(t) {
                        if (this.cursor) {
                            let {
                                scaleX: e,
                                scaleY: i
                            } = this.view;
                            t ? (this.cursor.style.left = t.left / e + "px", this.cursor.style.top = t.top / i + "px", this.cursor.style.height = t.height / i + "px") : this.cursor.style.left = "-100000px"
                        }
                    }
                    destroy() {
                        this.cursor && this.cursor.remove()
                    }
                    setDropPos(t) {
                        this.view.state.field(Hs) != t && this.view.dispatch({
                            effects: qs.of(t)
                        })
                    }
                }, {
                    eventObservers: {
                        dragover(t) {
                            this.setDropPos(this.view.posAtCoords({
                                x: t.clientX,
                                y: t.clientY
                            }))
                        },
                        dragleave(t) {
                            t.target != this.view.contentDOM && this.view.contentDOM.contains(t.relatedTarget) || this.setDropPos(null)
                        },
                        dragend() {
                            this.setDropPos(null)
                        },
                        drop() {
                            this.setDropPos(null)
                        }
                    }
                });

            function Xs() {
                return [Hs, _s]
            }

            function Ys(t, e, i, s, n) {
                e.lastIndex = 0;
                for (let r, o = t.iterRange(i, s), l = i; !o.next().done; l += o.value.length)
                    if (!o.lineBreak)
                        for (; r = e.exec(o.value);) n(l + r.index, r)
            }
            class Us {
                constructor(t) {
                    const {
                        regexp: e,
                        decoration: i,
                        decorate: s,
                        boundary: n,
                        maxLength: r = 1e3
                    } = t;
                    if (!e.global) throw new RangeError("The regular expression given to MatchDecorator should have its 'g' flag set");
                    if (this.regexp = e, s) this.addMatch = (t, e, i, n) => s(n, i, i + t[0].length, t, e);
                    else if ("function" == typeof i) this.addMatch = (t, e, s, n) => {
                        let r = i(t, e, s);
                        r && n(s, s + t[0].length, r)
                    };
                    else {
                        if (!i) throw new RangeError("Either 'decorate' or 'decoration' should be provided to MatchDecorator");
                        this.addMatch = (t, e, s, n) => n(s, s + t[0].length, i)
                    }
                    this.boundary = n, this.maxLength = r
                }
                createDeco(t) {
                    let e = new s.vB,
                        i = e.add.bind(e);
                    for (let {
                            from: e,
                            to: s
                        }
                        of
                        function(t, e) {
                            let i = t.visibleRanges;
                            if (1 == i.length && i[0].from == t.viewport.from && i[0].to == t.viewport.to) return i;
                            let s = [];
                            for (let {
                                    from: n,
                                    to: r
                                }
                                of i) n = Math.max(t.state.doc.lineAt(n).from, n - e), r = Math.min(t.state.doc.lineAt(r).to, r + e), s.length && s[s.length - 1].to >= n ? s[s.length - 1].to = r : s.push({
                                from: n,
                                to: r
                            });
                            return s
                        }(t, this.maxLength)) Ys(t.state.doc, this.regexp, e, s, (e, s) => this.addMatch(s, t, e, i));
                    return e.finish()
                }
                updateDeco(t, e) {
                    let i = 1e9,
                        s = -1;
                    return t.docChanged && t.changes.iterChanges((e, n, r, o) => {
                        o >= t.view.viewport.from && r <= t.view.viewport.to && (i = Math.min(r, i), s = Math.max(o, s))
                    }), t.viewportMoved || s - i > 1e3 ? this.createDeco(t.view) : s > -1 ? this.updateRange(t.view, e.map(t.changes), i, s) : e
                }
                updateRange(t, e, i, s) {
                    for (let n of t.visibleRanges) {
                        let r = Math.max(n.from, i),
                            o = Math.min(n.to, s);
                        if (o >= r) {
                            let i = t.state.doc.lineAt(r),
                                s = i.to < o ? t.state.doc.lineAt(o) : i,
                                l = Math.max(n.from, i.from),
                                a = Math.min(n.to, s.to);
                            if (this.boundary) {
                                for (; r > i.from; r--)
                                    if (this.boundary.test(i.text[r - 1 - i.from])) {
                                        l = r;
                                        break
                                    } for (; o < s.to; o++)
                                    if (this.boundary.test(s.text[o - s.from])) {
                                        a = o;
                                        break
                                    }
                            }
                            let h, c = [],
                                u = (t, e, i) => c.push(i.range(t, e));
                            if (i == s)
                                for (this.regexp.lastIndex = l - i.from;
                                    (h = this.regexp.exec(i.text)) && h.index < a - i.from;) this.addMatch(h, t, h.index + i.from, u);
                            else Ys(t.state.doc, this.regexp, l, a, (e, i) => this.addMatch(i, t, e, u));
                            e = e.update({
                                filterFrom: l,
                                filterTo: a,
                                filter: (t, e) => t < l || e > a,
                                add: c
                            })
                        }
                    }
                    return e
                }
            }
            const Gs = null != /x/.unicode ? "gu" : "g",
                Ks = new RegExp("[\0-\b\n--­؜​‎‏\u2028\u2029‭‮⁦⁧⁩\ufeff￹-￼]", Gs),
                Zs = {
                    0: "null",
                    7: "bell",
                    8: "backspace",
                    10: "newline",
                    11: "vertical tab",
                    13: "carriage return",
                    27: "escape",
                    8203: "zero width space",
                    8204: "zero width non-joiner",
                    8205: "zero width joiner",
                    8206: "left-to-right mark",
                    8207: "right-to-left mark",
                    8232: "line separator",
                    8237: "left-to-right override",
                    8238: "right-to-left override",
                    8294: "left-to-right isolate",
                    8295: "right-to-left isolate",
                    8297: "pop directional isolate",
                    8233: "paragraph separator",
                    65279: "zero width no-break space",
                    65532: "object replacement"
                };
            let Js = null;
            const tn = s.sj.define({
                combine(t) {
                    let e = (0, s.QR)(t, {
                        render: null,
                        specialChars: Ks,
                        addSpecialChars: null
                    });
                    return (e.replaceTabs = ! function() {
                        var t;
                        if (null == Js && "undefined" != typeof document && document.body) {
                            let e = document.body.style;
                            Js = null != (null !== (t = e.tabSize) && void 0 !== t ? t : e.MozTabSize)
                        }
                        return Js || !1
                    }()) && (e.specialChars = new RegExp("\t|" + e.specialChars.source, Gs)), e.addSpecialChars && (e.specialChars = new RegExp(e.specialChars.source + "|" + e.addSpecialChars.source, Gs)), e
                }
            });

            function en(t = {}) {
                return [tn.of(t), sn || (sn = qt.fromClass(class {
                    constructor(t) {
                        this.view = t, this.decorations = D.none, this.decorationCache = Object.create(null), this.decorator = this.makeDecorator(t.state.facet(tn)), this.decorations = this.decorator.createDeco(t)
                    }
                    makeDecorator(t) {
                        return new Us({
                            regexp: t.specialChars,
                            decoration: (e, i, n) => {
                                let {
                                    doc: r
                                } = i.state, o = (0, s.vS)(e[0], 0);
                                if (9 == o) {
                                    let t = r.lineAt(n),
                                        e = i.state.tabSize,
                                        o = (0, s.y$)(t.text, e, n - t.from);
                                    return D.replace({
                                        widget: new rn((e - o % e) * this.view.defaultCharacterWidth / this.view.scaleX)
                                    })
                                }
                                return this.decorationCache[o] || (this.decorationCache[o] = D.replace({
                                    widget: new nn(t, o)
                                }))
                            },
                            boundary: t.replaceTabs ? void 0 : /[^]/
                        })
                    }
                    update(t) {
                        let e = t.state.facet(tn);
                        t.startState.facet(tn) != e ? (this.decorator = this.makeDecorator(e), this.decorations = this.decorator.createDeco(t.view)) : this.decorations = this.decorator.updateDeco(t, this.decorations)
                    }
                }, {
                    decorations: t => t.decorations
                }))]
            }
            let sn = null;
            class nn extends T {
                constructor(t, e) {
                    super(), this.options = t, this.code = e
                }
                eq(t) {
                    return t.code == this.code
                }
                toDOM(t) {
                    let e = function(t) {
                            return t >= 32 ? "•" : 10 == t ? "␤" : String.fromCharCode(9216 + t)
                        }(this.code),
                        i = t.state.phrase("Control character") + " " + (Zs[this.code] || "0x" + this.code.toString(16)),
                        s = this.options.render && this.options.render(this.code, i, e);
                    if (s) return s;
                    let n = document.createElement("span");
                    return n.textContent = e, n.title = i, n.setAttribute("aria-label", i), n.className = "css-specialChar", n
                }
                ignoreEvent() {
                    return !1
                }
            }
            class rn extends T {
                constructor(t) {
                    super(), this.width = t
                }
                eq(t) {
                    return t.width == this.width
                }
                toDOM() {
                    let t = document.createElement("span");
                    return t.textContent = "\t", t.className = "css-tab", t.style.width = this.width + "px", t
                }
                ignoreEvent() {
                    return !1
                }
            }

            function on() {
                return an
            }
            const ln = D.line({
                    class: "css-activeLine"
                }),
                an = qt.fromClass(class {
                    constructor(t) {
                        this.decorations = this.getDeco(t)
                    }
                    update(t) {
                        (t.docChanged || t.selectionSet) && (this.decorations = this.getDeco(t.view))
                    }
                    getDeco(t) {
                        let e = -1,
                            i = [];
                        for (let s of t.state.selection.ranges) {
                            let n = t.lineBlockAt(s.head);
                            n.from > e && (i.push(ln.range(n.from)), e = n.from)
                        }
                        return D.set(i)
                    }
                }, {
                    decorations: t => t.decorations
                }),
                hn = 2e3;

            function cn(t, e) {
                let i = t.posAtCoords({
                        x: e.clientX,
                        y: e.clientY
                    }, !1),
                    n = t.state.doc.lineAt(i),
                    r = i - n.from,
                    o = r > hn ? -1 : r == n.length ? function(t, e) {
                        let i = t.coordsAtPos(t.viewport.from);
                        return i ? Math.round(Math.abs((i.left - e) / t.defaultCharacterWidth)) : -1
                    }(t, e.clientX) : (0, s.y$)(n.text, t.state.tabSize, i - n.from);
                return {
                    line: n.number,
                    col: o,
                    off: r
                }
            }

            function un(t) {
                let e = (null == t ? void 0 : t.eventFilter) || (t => t.altKey && 0 == t.button);
                return gs.mouseSelectionStyle.of((t, i) => e(i) ? function(t, e) {
                    let i = cn(t, e),
                        n = t.state.selection;
                    return i ? {
                        update(t) {
                            if (t.docChanged) {
                                let e = t.changes.mapPos(t.startState.doc.line(i.line).from),
                                    s = t.state.doc.lineAt(e);
                                i = {
                                    line: s.number,
                                    col: i.col,
                                    off: Math.min(i.off, s.length)
                                }, n = n.map(t.changes)
                            }
                        },
                        get(e, r, o) {
                            let l = cn(t, e);
                            if (!l) return n;
                            let a = function(t, e, i) {
                                let n = Math.min(e.line, i.line),
                                    r = Math.max(e.line, i.line),
                                    o = [];
                                if (e.off > hn || i.off > hn || e.col < 0 || i.col < 0) {
                                    let l = Math.min(e.off, i.off),
                                        a = Math.max(e.off, i.off);
                                    for (let e = n; e <= r; e++) {
                                        let i = t.doc.line(e);
                                        i.length <= a && o.push(s.OF.range(i.from + l, i.to + a))
                                    }
                                } else {
                                    let l = Math.min(e.col, i.col),
                                        a = Math.max(e.col, i.col);
                                    for (let e = n; e <= r; e++) {
                                        let i = t.doc.line(e),
                                            n = (0, s.kn)(i.text, l, t.tabSize, !0);
                                        if (n < 0) o.push(s.OF.cursor(i.to));
                                        else {
                                            let e = (0, s.kn)(i.text, a, t.tabSize);
                                            o.push(s.OF.range(i.from + n, i.from + e))
                                        }
                                    }
                                }
                                return o
                            }(t.state, i, l);
                            return a.length ? o ? s.OF.create(a.concat(n.ranges)) : s.OF.create(a) : n
                        }
                    } : null
                }(t, i) : null)
            }
            const dn = {
                    Alt: [18, t => !!t.altKey],
                    Control: [17, t => !!t.ctrlKey],
                    Shift: [16, t => !!t.shiftKey],
                    Meta: [91, t => !!t.metaKey]
                },
                fn = {
                    style: "cursor: crosshair"
                };

            function pn(t = {}) {
                let [e, i] = dn[t.key || "Alt"], s = qt.fromClass(class {
                    constructor(t) {
                        this.view = t, this.isDown = !1
                    }
                    set(t) {
                        this.isDown != t && (this.isDown = t, this.view.update([]))
                    }
                }, {
                    eventObservers: {
                        keydown(t) {
                            this.set(t.keyCode == e || i(t))
                        },
                        keyup(t) {
                            t.keyCode != e && i(t) || this.set(!1)
                        },
                        mousemove(t) {
                            this.set(i(t))
                        }
                    }
                });
                return [s, gs.contentAttributes.of(t => {
                    var e;
                    return (null === (e = t.plugin(s)) || void 0 === e ? void 0 : e.isDown) ? fn : null
                })]
            }
            const mn = "-10000px";
            class gn {
                constructor(t, e, i, s) {
                    this.facet = e, this.createTooltipView = i, this.removeTooltipView = s, this.input = t.state.facet(e), this.tooltips = this.input.filter(t => t);
                    let n = null;
                    this.tooltipViews = this.tooltips.map(t => n = i(t, n))
                }
                update(t, e) {
                    var i;
                    let s = t.state.facet(this.facet),
                        n = s.filter(t => t);
                    if (s === this.input) {
                        for (let e of this.tooltipViews) e.update && e.update(t);
                        return !1
                    }
                    let r = [],
                        o = e ? [] : null;
                    for (let i = 0; i < n.length; i++) {
                        let s = n[i],
                            l = -1;
                        if (s) {
                            for (let t = 0; t < this.tooltips.length; t++) {
                                let e = this.tooltips[t];
                                e && e.create == s.create && (l = t)
                            }
                            if (l < 0) r[i] = this.createTooltipView(s, i ? r[i - 1] : null), o && (o[i] = !!s.above);
                            else {
                                let s = r[i] = this.tooltipViews[l];
                                o && (o[i] = e[l]), s.update && s.update(t)
                            }
                        }
                    }
                    for (let t of this.tooltipViews) r.indexOf(t) < 0 && (this.removeTooltipView(t), null === (i = t.destroy) || void 0 === i || i.call(t));
                    return e && (o.forEach((t, i) => e[i] = t), e.length = o.length), this.input = s, this.tooltips = n, this.tooltipViews = r, !0
                }
            }

            function vn(t) {
                let e = t.dom.ownerDocument.documentElement;
                return {
                    top: 0,
                    left: 0,
                    bottom: e.clientHeight,
                    right: e.clientWidth
                }
            }
            const bn = s.sj.define({
                    combine: t => {
                        var e, i, s;
                        return {
                            position: k.ios ? "absolute" : (null === (e = t.find(t => t.position)) || void 0 === e ? void 0 : e.position) || "fixed",
                            parent: (null === (i = t.find(t => t.parent)) || void 0 === i ? void 0 : i.parent) || null,
                            tooltipSpace: (null === (s = t.find(t => t.tooltipSpace)) || void 0 === s ? void 0 : s.tooltipSpace) || vn
                        }
                    }
                }),
                wn = new WeakMap,
                yn = qt.fromClass(class {
                    constructor(t) {
                        this.view = t, this.above = [], this.inView = !0, this.madeAbsolute = !1, this.lastTransaction = 0, this.measureTimeout = -1;
                        let e = t.state.facet(bn);
                        this.position = e.position, this.parent = e.parent, this.classes = t.themeClasses, this.createContainer(), this.measureReq = {
                            read: this.readMeasure.bind(this),
                            write: this.writeMeasure.bind(this),
                            key: this
                        }, this.resizeObserver = "function" == typeof ResizeObserver ? new ResizeObserver(() => this.measureSoon()) : null, this.manager = new gn(t, Sn, (t, e) => this.createTooltip(t, e), t => {
                            this.resizeObserver && this.resizeObserver.unobserve(t.dom), t.dom.remove()
                        }), this.above = this.manager.tooltips.map(t => !!t.above), this.intersectionObserver = "function" == typeof IntersectionObserver ? new IntersectionObserver(t => {
                            Date.now() > this.lastTransaction - 50 && t.length > 0 && t[t.length - 1].intersectionRatio < 1 && this.measureSoon()
                        }, {
                            threshold: [1]
                        }) : null, this.observeIntersection(), t.win.addEventListener("resize", this.measureSoon = this.measureSoon.bind(this)), this.maybeMeasure()
                    }
                    createContainer() {
                        this.parent ? (this.container = document.createElement("div"), this.container.style.position = "relative", this.container.className = this.view.themeClasses, this.parent.appendChild(this.container)) : this.container = this.view.dom
                    }
                    observeIntersection() {
                        if (this.intersectionObserver) {
                            this.intersectionObserver.disconnect();
                            for (let t of this.manager.tooltipViews) this.intersectionObserver.observe(t.dom)
                        }
                    }
                    measureSoon() {
                        this.measureTimeout < 0 && (this.measureTimeout = setTimeout(() => {
                            this.measureTimeout = -1, this.maybeMeasure()
                        }, 50))
                    }
                    update(t) {
                        t.transactions.length && (this.lastTransaction = Date.now());
                        let e = this.manager.update(t, this.above);
                        e && this.observeIntersection();
                        let i = e || t.geometryChanged,
                            s = t.state.facet(bn);
                        if (s.position != this.position && !this.madeAbsolute) {
                            this.position = s.position;
                            for (let t of this.manager.tooltipViews) t.dom.style.position = this.position;
                            i = !0
                        }
                        if (s.parent != this.parent) {
                            this.parent && this.container.remove(), this.parent = s.parent, this.createContainer();
                            for (let t of this.manager.tooltipViews) this.container.appendChild(t.dom);
                            i = !0
                        } else this.parent && this.view.themeClasses != this.classes && (this.classes = this.container.className = this.view.themeClasses);
                        i && this.maybeMeasure()
                    }
                    createTooltip(t, e) {
                        let i = t.create(this.view),
                            s = e ? e.dom : null;
                        if (i.dom.classList.add("css-tooltip"), t.arrow && !i.dom.querySelector(".css-tooltip > .css-tooltip-arrow")) {
                            let t = document.createElement("div");
                            t.className = "css-tooltip-arrow", i.dom.appendChild(t)
                        }
                        return i.dom.style.position = this.position, i.dom.style.top = mn, i.dom.style.left = "0px", this.container.insertBefore(i.dom, s), i.mount && i.mount(this.view), this.resizeObserver && this.resizeObserver.observe(i.dom), i
                    }
                    destroy() {
                        var t, e, i;
                        this.view.win.removeEventListener("resize", this.measureSoon);
                        for (let e of this.manager.tooltipViews) e.dom.remove(), null === (t = e.destroy) || void 0 === t || t.call(e);
                        this.parent && this.container.remove(), null === (e = this.resizeObserver) || void 0 === e || e.disconnect(), null === (i = this.intersectionObserver) || void 0 === i || i.disconnect(), clearTimeout(this.measureTimeout)
                    }
                    readMeasure() {
                        let t = 1,
                            e = 1,
                            i = !1;
                        if ("fixed" == this.position && this.manager.tooltipViews.length) {
                            let {
                                dom: t
                            } = this.manager.tooltipViews[0];
                            if (k.safari) {
                                let e = t.getBoundingClientRect();
                                i = Math.abs(e.top + 1e4) > 1 || Math.abs(e.left) > 1
                            } else i = !!t.offsetParent && t.offsetParent != this.container.ownerDocument.body
                        }
                        if (i || "absolute" == this.position)
                            if (this.parent) {
                                let i = this.parent.getBoundingClientRect();
                                i.width && i.height && (t = i.width / this.parent.offsetWidth, e = i.height / this.parent.offsetHeight)
                            } else({
                                scaleX: t,
                                scaleY: e
                            } = this.view.viewState);
                        let s = this.view.scrollDOM.getBoundingClientRect(),
                            n = ee(this.view);
                        return {
                            visible: {
                                left: s.left + n.left,
                                top: s.top + n.top,
                                right: s.right - n.right,
                                bottom: s.bottom - n.bottom
                            },
                            parent: this.parent ? this.container.getBoundingClientRect() : this.view.dom.getBoundingClientRect(),
                            pos: this.manager.tooltips.map((t, e) => {
                                let i = this.manager.tooltipViews[e];
                                return i.getCoords ? i.getCoords(t.pos) : this.view.coordsAtPos(t.pos)
                            }),
                            size: this.manager.tooltipViews.map(({
                                dom: t
                            }) => t.getBoundingClientRect()),
                            space: this.view.state.facet(bn).tooltipSpace(this.view),
                            scaleX: t,
                            scaleY: e,
                            makeAbsolute: i
                        }
                    }
                    writeMeasure(t) {
                        var e;
                        if (t.makeAbsolute) {
                            this.madeAbsolute = !0, this.position = "absolute";
                            for (let t of this.manager.tooltipViews) t.dom.style.position = "absolute"
                        }
                        let {
                            visible: i,
                            space: s,
                            scaleX: n,
                            scaleY: r
                        } = t, o = [];
                        for (let l = 0; l < this.manager.tooltips.length; l++) {
                            let a = this.manager.tooltips[l],
                                h = this.manager.tooltipViews[l],
                                {
                                    dom: c
                                } = h,
                                u = t.pos[l],
                                d = t.size[l];
                            if (!u || !1 !== a.clip && (u.bottom <= Math.max(i.top, s.top) || u.top >= Math.min(i.bottom, s.bottom) || u.right < Math.max(i.left, s.left) - .1 || u.left > Math.min(i.right, s.right) + .1)) {
                                c.style.top = mn;
                                continue
                            }
                            let f = a.arrow ? h.dom.querySelector(".css-tooltip-arrow") : null,
                                p = f ? 7 : 0,
                                m = d.right - d.left,
                                g = null !== (e = wn.get(h)) && void 0 !== e ? e : d.bottom - d.top,
                                v = h.offset || kn,
                                b = this.view.textDirection == ot.LTR,
                                w = d.width > s.right - s.left ? b ? s.left : s.right - d.width : b ? Math.max(s.left, Math.min(u.left - (f ? 14 : 0) + v.x, s.right - m)) : Math.min(Math.max(s.left, u.left - m + (f ? 14 : 0) - v.x), s.right - m),
                                y = this.above[l];
                            !a.strictSide && (y ? u.top - g - p - v.y < s.top : u.bottom + g + p + v.y > s.bottom) && y == s.bottom - u.bottom > u.top - s.top && (y = this.above[l] = !y);
                            let O = (y ? u.top - s.top : s.bottom - u.bottom) - p;
                            if (O < g && !1 !== h.resize) {
                                if (O < this.view.defaultLineHeight) {
                                    c.style.top = mn;
                                    continue
                                }
                                wn.set(h, g), c.style.height = (g = O) / r + "px"
                            } else c.style.height && (c.style.height = "");
                            let x = y ? u.top - g - p - v.y : u.bottom + p + v.y,
                                k = w + m;
                            if (!0 !== h.overlap)
                                for (let t of o) t.left < k && t.right > w && t.top < x + g && t.bottom > x && (x = y ? t.top - g - 2 - p : t.bottom + p + 2);
                            if ("absolute" == this.position ? (c.style.top = (x - t.parent.top) / r + "px", On(c, (w - t.parent.left) / n)) : (c.style.top = x / r + "px", On(c, w / n)), f) {
                                let t = u.left + (b ? v.x : -v.x) - (w + 14 - 7);
                                f.style.left = t / n + "px"
                            }!0 !== h.overlap && o.push({
                                left: w,
                                top: x,
                                right: k,
                                bottom: x + g
                            }), c.classList.toggle("css-tooltip-above", y), c.classList.toggle("css-tooltip-below", !y), h.positioned && h.positioned(t.space)
                        }
                    }
                    maybeMeasure() {
                        if (this.manager.tooltips.length && (this.view.inView && this.view.requestMeasure(this.measureReq), this.inView != this.view.inView && (this.inView = this.view.inView, !this.inView)))
                            for (let t of this.manager.tooltipViews) t.dom.style.top = mn
                    }
                }, {
                    eventObservers: {
                        scroll() {
                            this.maybeMeasure()
                        }
                    }
                });

            function On(t, e) {
                let i = parseInt(t.style.left, 10);
                (isNaN(i) || Math.abs(e - i) > 1) && (t.style.left = e + "px")
            }
            const xn = gs.baseTheme({

                }),
                kn = {
                    x: 0,
                    y: 0
                },
                Sn = s.sj.define({
                    enables: [yn, xn]
                }),
                Cn = s.sj.define({
                    combine: t => t.reduce((t, e) => t.concat(e), [])
                });
            class An {
                static create(t) {
                    return new An(t)
                }
                constructor(t) {
                    this.view = t, this.mounted = !1, this.dom = document.createElement("div"), this.dom.classList.add("css-tooltip-hover"), this.manager = new gn(t, Cn, (t, e) => this.createHostedView(t, e), t => t.dom.remove())
                }
                createHostedView(t, e) {
                    let i = t.create(this.view);
                    return i.dom.classList.add("css-tooltip-section"), this.dom.insertBefore(i.dom, e ? e.dom.nextSibling : this.dom.firstChild), this.mounted && i.mount && i.mount(this.view), i
                }
                mount(t) {
                    for (let e of this.manager.tooltipViews) e.mount && e.mount(t);
                    this.mounted = !0
                }
                positioned(t) {
                    for (let e of this.manager.tooltipViews) e.positioned && e.positioned(t)
                }
                update(t) {
                    this.manager.update(t)
                }
                destroy() {
                    var t;
                    for (let e of this.manager.tooltipViews) null === (t = e.destroy) || void 0 === t || t.call(e)
                }
                passProp(t) {
                    let e;
                    for (let i of this.manager.tooltipViews) {
                        let s = i[t];
                        if (void 0 !== s)
                            if (void 0 === e) e = s;
                            else if (e !== s) return
                    }
                    return e
                }
                get offset() {
                    return this.passProp("offset")
                }
                get getCoords() {
                    return this.passProp("getCoords")
                }
                get overlap() {
                    return this.passProp("overlap")
                }
                get resize() {
                    return this.passProp("resize")
                }
            }
            const Mn = Sn.compute([Cn], t => {
                let e = t.facet(Cn);
                return 0 === e.length ? null : {
                    pos: Math.min(...e.map(t => t.pos)),
                    end: Math.max(...e.map(t => {
                        var e;
                        return null !== (e = t.end) && void 0 !== e ? e : t.pos
                    })),
                    create: An.create,
                    above: e[0].above,
                    arrow: e.some(t => t.arrow)
                }
            });
            class Qn {
                constructor(t, e, i, s, n) {
                    this.view = t, this.source = e, this.field = i, this.setHover = s, this.hoverTime = n, this.hoverTimeout = -1, this.restartTimeout = -1, this.pending = null, this.lastMove = {
                        x: 0,
                        y: 0,
                        target: t.dom,
                        time: 0
                    }, this.checkHover = this.checkHover.bind(this), t.dom.addEventListener("mouseleave", this.mouseleave = this.mouseleave.bind(this)), t.dom.addEventListener("mousemove", this.mousemove = this.mousemove.bind(this))
                }
                update() {
                    this.pending && (this.pending = null, clearTimeout(this.restartTimeout), this.restartTimeout = setTimeout(() => this.startHover(), 20))
                }
                get active() {
                    return this.view.state.field(this.field)
                }
                checkHover() {
                    if (this.hoverTimeout = -1, this.active.length) return;
                    let t = Date.now() - this.lastMove.time;
                    t < this.hoverTime ? this.hoverTimeout = setTimeout(this.checkHover, this.hoverTime - t) : this.startHover()
                }
                startHover() {
                    clearTimeout(this.restartTimeout);
                    let {
                        view: t,
                        lastMove: e
                    } = this, i = t.docView.tile.nearest(e.target);
                    if (!i) return;
                    let s, n = 1;
                    if (i.isWidget()) s = i.posAtStart;
                    else {
                        if (s = t.posAtCoords(e), null == s) return;
                        let i = t.coordsAtPos(s);
                        if (!i || e.y < i.top || e.y > i.bottom || e.x < i.left - t.defaultCharacterWidth || e.x > i.right + t.defaultCharacterWidth) return;
                        let r = t.bidiSpans(t.state.doc.lineAt(s)).find(t => t.from <= s && t.to >= s),
                            o = r && r.dir == ot.RTL ? -1 : 1;
                        n = e.x < i.left ? -o : o
                    }
                    let r = this.source(t, s, n);
                    if (null == r ? void 0 : r.then) {
                        let e = this.pending = {
                            pos: s
                        };
                        r.then(i => {
                            this.pending == e && (this.pending = null, !i || Array.isArray(i) && !i.length || t.dispatch({
                                effects: this.setHover.of(Array.isArray(i) ? i : [i])
                            }))
                        }, e => $t(t.state, e, "hover tooltip"))
                    } else !r || Array.isArray(r) && !r.length || t.dispatch({
                        effects: this.setHover.of(Array.isArray(r) ? r : [r])
                    })
                }
                get tooltip() {
                    let t = this.view.plugin(yn),
                        e = t ? t.manager.tooltips.findIndex(t => t.create == An.create) : -1;
                    return e > -1 ? t.manager.tooltipViews[e] : null
                }
                mousemove(t) {
                    var e, i;
                    this.lastMove = {
                        x: t.clientX,
                        y: t.clientY,
                        target: t.target,
                        time: Date.now()
                    }, this.hoverTimeout < 0 && (this.hoverTimeout = setTimeout(this.checkHover, this.hoverTime));
                    let {
                        active: s,
                        tooltip: n
                    } = this;
                    if (s.length && n && ! function(t, e) {
                            let i, {
                                left: s,
                                right: n,
                                top: r,
                                bottom: o
                            } = t.getBoundingClientRect();
                            if (i = t.querySelector(".css-tooltip-arrow")) {
                                let t = i.getBoundingClientRect();
                                r = Math.min(t.top, r), o = Math.max(t.bottom, o)
                            }
                            return e.clientX >= s - 4 && e.clientX <= n + 4 && e.clientY >= r - 4 && e.clientY <= o + 4
                        }(n.dom, t) || this.pending) {
                        let {
                            pos: n
                        } = s[0] || this.pending, r = null !== (i = null === (e = s[0]) || void 0 === e ? void 0 : e.end) && void 0 !== i ? i : n;
                        (n == r ? this.view.posAtCoords(this.lastMove) == n : function(t, e, i, s, n) {
                            let r = t.scrollDOM.getBoundingClientRect(),
                                o = t.documentTop + t.documentPadding.top + t.contentHeight;
                            if (r.left > s || r.right < s || r.top > n || Math.min(r.bottom, o) < n) return !1;
                            let l = t.posAtCoords({
                                x: s,
                                y: n
                            }, !1);
                            return l >= e && l <= i
                        }(this.view, n, r, t.clientX, t.clientY)) || (this.view.dispatch({
                            effects: this.setHover.of([])
                        }), this.pending = null)
                    }
                }
                mouseleave(t) {
                    clearTimeout(this.hoverTimeout), this.hoverTimeout = -1;
                    let {
                        active: e
                    } = this;
                    if (e.length) {
                        let {
                            tooltip: e
                        } = this;
                        e && e.dom.contains(t.relatedTarget) ? this.watchTooltipLeave(e.dom) : this.view.dispatch({
                            effects: this.setHover.of([])
                        })
                    }
                }
                watchTooltipLeave(t) {
                    let e = i => {
                        t.removeEventListener("mouseleave", e), this.active.length && !this.view.dom.contains(i.relatedTarget) && this.view.dispatch({
                            effects: this.setHover.of([])
                        })
                    };
                    t.addEventListener("mouseleave", e)
                }
                destroy() {
                    clearTimeout(this.hoverTimeout), clearTimeout(this.restartTimeout), this.view.dom.removeEventListener("mouseleave", this.mouseleave), this.view.dom.removeEventListener("mousemove", this.mousemove)
                }
            }

            function Tn(t, e = {}) {
                let i = s.Pe.define(),
                    n = s.sU.define({
                        create: () => [],
                        update(t, n) {
                            if (t.length && (e.hideOnChange && (n.docChanged || n.selection) ? t = [] : e.hideOn && (t = t.filter(t => !e.hideOn(n, t))), n.docChanged)) {
                                let e = [];
                                for (let i of t) {
                                    let t = n.changes.mapPos(i.pos, -1, s.iR.TrackDel);
                                    if (null != t) {
                                        let s = Object.assign(Object.create(null), i);
                                        s.pos = t, null != s.end && (s.end = n.changes.mapPos(s.end)), e.push(s)
                                    }
                                }
                                t = e
                            }
                            for (let e of n.effects) e.is(i) && (t = e.value), e.is(Dn) && (t = []);
                            return t
                        },
                        provide: t => Cn.from(t)
                    });
                return {
                    active: n,
                    extension: [n, qt.define(s => new Qn(s, t, n, i, e.hoverTime || 300)), Mn]
                }
            }

            function Pn(t, e) {
                let i = t.plugin(yn);
                if (!i) return null;
                let s = i.manager.tooltips.indexOf(e);
                return s < 0 ? null : i.manager.tooltipViews[s]
            }
            const Dn = s.Pe.define(),
                Rn = s.sj.define({
                    combine(t) {
                        let e, i;
                        for (let s of t) e = e || s.topContainer, i = i || s.bottomContainer;
                        return {
                            topContainer: e,
                            bottomContainer: i
                        }
                    }
                });

            function En(t, e) {
                let i = t.plugin(Bn),
                    s = i ? i.specs.indexOf(e) : -1;
                return s > -1 ? i.panels[s] : null
            }
            const Bn = qt.fromClass(class {
                constructor(t) {
                    this.input = t.state.facet(In), this.specs = this.input.filter(t => t), this.panels = this.specs.map(e => e(t));
                    let e = t.state.facet(Rn);
                    this.top = new Ln(t, !0, e.topContainer), this.bottom = new Ln(t, !1, e.bottomContainer), this.top.sync(this.panels.filter(t => t.top)), this.bottom.sync(this.panels.filter(t => !t.top));
                    for (let t of this.panels) t.dom.classList.add("css-panel"), t.mount && t.mount()
                }
                update(t) {
                    let e = t.state.facet(Rn);
                    this.top.container != e.topContainer && (this.top.sync([]), this.top = new Ln(t.view, !0, e.topContainer)), this.bottom.container != e.bottomContainer && (this.bottom.sync([]), this.bottom = new Ln(t.view, !1, e.bottomContainer)), this.top.syncClasses(), this.bottom.syncClasses();
                    let i = t.state.facet(In);
                    if (i != this.input) {
                        let e = i.filter(t => t),
                            s = [],
                            n = [],
                            r = [],
                            o = [];
                        for (let i of e) {
                            let e, l = this.specs.indexOf(i);
                            l < 0 ? (e = i(t.view), o.push(e)) : (e = this.panels[l], e.update && e.update(t)), s.push(e), (e.top ? n : r).push(e)
                        }
                        this.specs = e, this.panels = s, this.top.sync(n), this.bottom.sync(r);
                        for (let t of o) t.dom.classList.add("css-panel"), t.mount && t.mount()
                    } else
                        for (let e of this.panels) e.update && e.update(t)
                }
                destroy() {
                    this.top.sync([]), this.bottom.sync([])
                }
            }, {
                provide: t => gs.scrollMargins.of(e => {
                    let i = e.plugin(t);
                    return i && {
                        top: i.top.scrollMargin(),
                        bottom: i.bottom.scrollMargin()
                    }
                })
            });
            class Ln {
                constructor(t, e, i) {
                    this.view = t, this.top = e, this.container = i, this.dom = void 0, this.classes = "", this.panels = [], this.syncClasses()
                }
                sync(t) {
                    for (let e of this.panels) e.destroy && t.indexOf(e) < 0 && e.destroy();
                    this.panels = t, this.syncDOM()
                }
                syncDOM() {
                    if (0 == this.panels.length) {
                        if (this.dom) {
                            this.dom.remove();
                            this.dom = void 0;
                        }
                        return;
                    }

                    if (!this.dom) {
                        this.dom = document.createElement("div");
                        this.dom.className = "css-panels";  // top olsun olmasın aynı class
                    }

                    // Doğru ID ile searchContainer al
                    let searchContainer = document.getElementById("searchContainer");

                    // Hedef: Öncelikle searchContainer, yoksa fallback view.dom
                    let targetContainer = searchContainer || this.view.dom;

                    // Eğer dom başka bir parent'taysa önce kaldır, sonra hedefe ekle
                    if (this.dom.parentNode && this.dom.parentNode !== targetContainer) {
                        this.dom.parentNode.removeChild(this.dom);
                    }

                    if (this.dom.parentNode !== targetContainer) {
                        targetContainer.appendChild(this.dom);
                    }

                    // Panel sıralamasını koru
                    let t = this.dom.firstChild;
                    for (let e of this.panels) {
                        if (e.dom.parentNode == this.dom) {
                            for (; t && t != e.dom;) t = Nn(t);
                            t = t ? t.nextSibling : null;
                        } else {
                            this.dom.insertBefore(e.dom, t);
                        }
                    }

                    // Fazla kalanları temizle
                    while (t) {
                        let next = t.nextSibling;
                        t.remove();
                        t = next;
                    }
                }
                scrollMargin() {
                    return !this.dom || this.container ? 0 : Math.max(0, this.top ? this.dom.getBoundingClientRect().bottom - Math.max(0, this.view.scrollDOM.getBoundingClientRect().top) : Math.min(innerHeight, this.view.scrollDOM.getBoundingClientRect().bottom) - this.dom.getBoundingClientRect().top)
                }
                syncClasses() {
                    if (this.container && this.classes != this.view.themeClasses) {
                        for (let t of this.classes.split(" ")) t && this.container.classList.remove(t);
                        for (let t of (this.classes = this.view.themeClasses).split(" ")) t && this.container.classList.add(t)
                    }
                }
            }

            function Nn(t) {
                let e = t.nextSibling;
                return t.remove(), e
            }
            const In = s.sj.define({
                enables: Bn
            });

            function zn(t, e) {
                let i, n = new Promise(t => i = t),
                    r = t => function(t, e, i) {
                        let s = e.content ? e.content(t, () => o(null)) : null;
                        if (!s) {
                            if (s = (0, u.A)("form"), e.input) {
                                let t = (0, u.A)("input", e.input);
                                /^(text|password|number|email|tel|url)$/.test(t.type) && t.classList.add("css-textfield"), t.name || (t.name = "input"), s.appendChild((0, u.A)("label", (e.label || "") + ": ", t))
                            } else s.appendChild(document.createTextNode(e.label || ""));
                            s.appendChild(document.createTextNode(" ")), s.appendChild((0, u.A)("button", {
                                class: "css-button",
                                type: "submit"
                            }, e.submitLabel || "OK"))
                        }
                        let n = "FORM" == s.nodeName ? [s] : s.querySelectorAll("form");
                        for (let t = 0; t < n.length; t++) {
                            let e = n[t];
                            e.addEventListener("keydown", t => {
                                27 == t.keyCode ? (t.preventDefault(), o(null)) : 13 == t.keyCode && (t.preventDefault(), o(e))
                            }), e.addEventListener("submit", t => {
                                t.preventDefault(), o(e)
                            })
                        }
                        let r = (0, u.A)("div", s, (0, u.A)("button", {
                            onclick: () => o(null),
                            "aria-label": t.state.phrase("close"),
                            class: "css-dialog-close",
                            type: "button"
                        }, ["×"]));

                        function o(e) {
                            r.contains(r.ownerDocument.activeElement) && t.focus(), i(e)
                        }
                        return e.class && (r.className = e.class), r.classList.add("css-dialog"), {
                            dom: r,
                            top: e.top,
                            mount: () => {
                                if (e.focus) {
                                    let t;
                                    t = "string" == typeof e.focus ? s.querySelector(e.focus) : s.querySelector("input") || s.querySelector("button"), t && "select" in t ? t.select() : t && "focus" in t && t.focus()
                                }
                            }
                        }
                    }(t, e, i);
                t.state.field(Fn, !1) ? t.dispatch({
                    effects: $n.of(r)
                }) : t.dispatch({
                    effects: s.Pe.appendConfig.of(Fn.init(() => [r]))
                });
                let o = Wn.of(r);
                return {
                    close: o,
                    result: n.then(e => ((t.win.queueMicrotask || (e => t.win.setTimeout(e, 10)))(() => {
                        t.state.field(Fn).indexOf(r) > -1 && t.dispatch({
                            effects: o
                        })
                    }), e))
                }
            }
            const Fn = s.sU.define({
                    create: () => [],
                    update(t, e) {
                        for (let i of e.effects) i.is($n) ? t = [i.value].concat(t) : i.is(Wn) && (t = t.filter(t => t != i.value));
                        return t
                    },
                    provide: t => In.computeN([t], e => e.field(t))
                }),
                $n = s.Pe.define(),
                Wn = s.Pe.define();
            class Vn extends s.FB {
                compare(t) {
                    return this == t || this.constructor == t.constructor && this.eq(t)
                }
                eq(t) {
                    return !1
                }
                destroy(t) {}
            }
            Vn.prototype.elementClass = "", Vn.prototype.toDOM = void 0, Vn.prototype.mapMode = s.iR.TrackBefore, Vn.prototype.startSide = Vn.prototype.endSide = -1, Vn.prototype.point = !0;
            const jn = s.sj.define(),
                qn = s.sj.define(),
                Hn = {
                    class: "",
                    renderEmptyElements: !1,
                    elementStyle: "",
                    markers: () => s.om.empty,
                    lineMarker: () => null,
                    widgetMarker: () => null,
                    lineMarkerChange: null,
                    initialSpacer: null,
                    updateSpacer: null,
                    domEventHandlers: {},
                    side: "before"
                },
                _n = s.sj.define();

            function Xn(t) {
                return [Un(), _n.of({
                    ...Hn,
                    ...t
                })]
            }
            const Yn = s.sj.define({
                combine: t => t.some(t => t)
            });

            function Un(t) {
                let e = [Gn];
                return t && !1 === t.fixed && e.push(Yn.of(!0)), e
            }
            const Gn = qt.fromClass(class {
                constructor(t) {
                    this.view = t, this.domAfter = null, this.prevViewport = t.viewport, this.dom = document.createElement("div"), this.dom.className = "css-gutters css-gutters-before", this.dom.setAttribute("aria-hidden", "true"), this.dom.style.minHeight = this.view.contentHeight / this.view.scaleY + "px", this.gutters = t.state.facet(_n).map(e => new tr(t, e)), this.fixed = !t.state.facet(Yn);
                    for (let t of this.gutters) "after" == t.config.side ? this.getDOMAfter().appendChild(t.dom) : this.dom.appendChild(t.dom);
                    this.fixed && (this.dom.style.position = "sticky"), this.syncGutters(!1), t.scrollDOM.insertBefore(this.dom, t.contentDOM)
                }
                getDOMAfter() {
                    return this.domAfter || (this.domAfter = document.createElement("div"), this.domAfter.className = "css-gutters css-gutters-after", this.domAfter.setAttribute("aria-hidden", "true"), this.domAfter.style.minHeight = this.view.contentHeight / this.view.scaleY + "px", this.domAfter.style.position = this.fixed ? "sticky" : "", this.view.scrollDOM.appendChild(this.domAfter)), this.domAfter
                }
                update(t) {
                    if (this.updateGutters(t)) {
                        let e = this.prevViewport,
                            i = t.view.viewport,
                            s = Math.min(e.to, i.to) - Math.max(e.from, i.from);
                        this.syncGutters(s < .8 * (i.to - i.from))
                    }
                    if (t.geometryChanged) {
                        let t = this.view.contentHeight / this.view.scaleY + "px";
                        this.dom.style.minHeight = t, this.domAfter && (this.domAfter.style.minHeight = t)
                    }
                    this.view.state.facet(Yn) != !this.fixed && (this.fixed = !this.fixed, this.dom.style.position = this.fixed ? "sticky" : "", this.domAfter && (this.domAfter.style.position = this.fixed ? "sticky" : "")), this.prevViewport = t.view.viewport
                }
                syncGutters(t) {
                    let e = this.dom.nextSibling;
                    t && (this.dom.remove(), this.domAfter && this.domAfter.remove());
                    let i = s.om.iter(this.view.state.facet(jn), this.view.viewport.from),
                        n = [],
                        r = this.gutters.map(t => new Jn(t, this.view.viewport, -this.view.documentPadding.top));
                    for (let t of this.view.viewportLineBlocks)
                        if (n.length && (n = []), Array.isArray(t.type)) {
                            let e = !0;
                            for (let s of t.type)
                                if (s.type == P.Text && e) {
                                    Zn(i, n, s.from);
                                    for (let t of r) t.line(this.view, s, n);
                                    e = !1
                                } else if (s.widget)
                                for (let t of r) t.widget(this.view, s)
                        } else if (t.type == P.Text) {
                        Zn(i, n, t.from);
                        for (let e of r) e.line(this.view, t, n)
                    } else if (t.widget)
                        for (let e of r) e.widget(this.view, t);
                    for (let t of r) t.finish();
                    t && (this.view.scrollDOM.insertBefore(this.dom, e), this.domAfter && this.view.scrollDOM.appendChild(this.domAfter))
                }
                updateGutters(t) {
                    let e = t.startState.facet(_n),
                        i = t.state.facet(_n),
                        n = t.docChanged || t.heightChanged || t.viewportChanged || !s.om.eq(t.startState.facet(jn), t.state.facet(jn), t.view.viewport.from, t.view.viewport.to);
                    if (e == i)
                        for (let e of this.gutters) e.update(t) && (n = !0);
                    else {
                        n = !0;
                        let s = [];
                        for (let n of i) {
                            let i = e.indexOf(n);
                            i < 0 ? s.push(new tr(this.view, n)) : (this.gutters[i].update(t), s.push(this.gutters[i]))
                        }
                        for (let t of this.gutters) t.dom.remove(), s.indexOf(t) < 0 && t.destroy();
                        for (let t of s) "after" == t.config.side ? this.getDOMAfter().appendChild(t.dom) : this.dom.appendChild(t.dom);
                        this.gutters = s
                    }
                    return n
                }
                destroy() {
                    for (let t of this.gutters) t.destroy();
                    this.dom.remove(), this.domAfter && this.domAfter.remove()
                }
            }, {
                provide: t => gs.scrollMargins.of(e => {
                    let i = e.plugin(t);
                    if (!i || 0 == i.gutters.length || !i.fixed) return null;
                    let s = i.dom.offsetWidth * e.scaleX,
                        n = i.domAfter ? i.domAfter.offsetWidth * e.scaleX : 0;
                    return e.textDirection == ot.LTR ? {
                        left: s,
                        right: n
                    } : {
                        right: s,
                        left: n
                    }
                })
            });

            function Kn(t) {
                return Array.isArray(t) ? t : [t]
            }

            function Zn(t, e, i) {
                for (; t.value && t.from <= i;) t.from == i && e.push(t.value), t.next()
            }
            class Jn {
                constructor(t, e, i) {
                    this.gutter = t, this.height = i, this.i = 0, this.cursor = s.om.iter(t.markers, e.from)
                }
                addElement(t, e, i) {
                    let {
                        gutter: s
                    } = this, n = (e.top - this.height) / t.scaleY, r = e.height / t.scaleY;
                    if (this.i == s.elements.length) {
                        let e = new er(t, r, n, i);
                        s.elements.push(e), s.dom.appendChild(e.dom)
                    } else s.elements[this.i].update(t, r, n, i);
                    this.height = e.bottom, this.i++
                }
                line(t, e, i) {
                    let s = [];
                    Zn(this.cursor, s, e.from), i.length && (s = s.concat(i));
                    let n = this.gutter.config.lineMarker(t, e, s);
                    n && s.unshift(n);
                    let r = this.gutter;
                    (0 != s.length || r.config.renderEmptyElements) && this.addElement(t, e, s)
                }
                widget(t, e) {
                    let i = this.gutter.config.widgetMarker(t, e.widget, e),
                        s = i ? [i] : null;
                    for (let i of t.state.facet(qn)) {
                        let n = i(t, e.widget, e);
                        n && (s || (s = [])).push(n)
                    }
                    s && this.addElement(t, e, s)
                }
                finish() {
                    let t = this.gutter;
                    for (; t.elements.length > this.i;) {
                        let e = t.elements.pop();
                        t.dom.removeChild(e.dom), e.destroy()
                    }
                }
            }
            class tr {
                constructor(t, e) {
                    this.view = t, this.config = e, this.elements = [], this.spacer = null, this.dom = document.createElement("div"), this.dom.className = "css-gutter" + (this.config.class ? " " + this.config.class : "");
                    for (let i in e.domEventHandlers) this.dom.addEventListener(i, s => {
                        let n, r = s.target;
                        if (r != this.dom && this.dom.contains(r)) {
                            for (; r.parentNode != this.dom;) r = r.parentNode;
                            let t = r.getBoundingClientRect();
                            n = (t.top + t.bottom) / 2
                        } else n = s.clientY;
                        let o = t.lineBlockAtHeight(n - t.documentTop);
                        e.domEventHandlers[i](t, o, s) && s.preventDefault()
                    });
                    this.markers = Kn(e.markers(t)), e.initialSpacer && (this.spacer = new er(t, 0, 0, [e.initialSpacer(t)]), this.dom.appendChild(this.spacer.dom), this.spacer.dom.style.cssText += "visibility: hidden; pointer-events: none")
                }
                update(t) {
                    let e = this.markers;
                    if (this.markers = Kn(this.config.markers(t.view)), this.spacer && this.config.updateSpacer) {
                        let e = this.config.updateSpacer(this.spacer.markers[0], t);
                        e != this.spacer.markers[0] && this.spacer.update(t.view, 0, 0, [e])
                    }
                    let i = t.view.viewport;
                    return !s.om.eq(this.markers, e, i.from, i.to) || !!this.config.lineMarkerChange && this.config.lineMarkerChange(t)
                }
                destroy() {
                    for (let t of this.elements) t.destroy()
                }
            }
            class er {
                constructor(t, e, i, s) {
                    this.height = -1, this.above = 0, this.markers = [], this.dom = document.createElement("div"), this.dom.className = "css-gutterElement", this.update(t, e, i, s)
                }
                update(t, e, i, s) {
                    this.height != e && (this.height = e, this.dom.style.height = e + "px"), this.above != i && (this.dom.style.marginTop = (this.above = i) ? i + "px" : ""),
                        function(t, e) {
                            if (t.length != e.length) return !1;
                            for (let i = 0; i < t.length; i++)
                                if (!t[i].compare(e[i])) return !1;
                            return !0
                        }(this.markers, s) || this.setMarkers(t, s)
                }
                setMarkers(t, e) {
                    let i = "css-gutterElement",
                        s = this.dom.firstChild;
                    for (let n = 0, r = 0;;) {
                        let o = r,
                            l = n < e.length ? e[n++] : null,
                            a = !1;
                        if (l) {
                            let t = l.elementClass;
                            t && (i += " " + t);
                            for (let t = r; t < this.markers.length; t++)
                                if (this.markers[t].compare(l)) {
                                    o = t, a = !0;
                                    break
                                }
                        } else o = this.markers.length;
                        for (; r < o;) {
                            let t = this.markers[r++];
                            if (t.toDOM) {
                                t.destroy(s);
                                let e = s.nextSibling;
                                s.remove(), s = e
                            }
                        }
                        if (!l) break;
                        l.toDOM && (a ? s = s.nextSibling : this.dom.insertBefore(l.toDOM(t), s)), a && r++
                    }
                    this.dom.className = i, this.markers = e
                }
                destroy() {
                    this.setMarkers(null, [])
                }
            }
            const ir = s.sj.define(),
                sr = s.sj.define(),
                nr = s.sj.define({
                    combine: t => (0, s.QR)(t, {
                        formatNumber: String,
                        domEventHandlers: {}
                    }, {
                        domEventHandlers(t, e) {
                            let i = Object.assign({}, t);
                            for (let t in e) {
                                let s = i[t],
                                    n = e[t];
                                i[t] = s ? (t, e, i) => s(t, e, i) || n(t, e, i) : n
                            }
                            return i
                        }
                    })
                });
            class rr extends Vn {
                constructor(t) {
                    super(), this.number = t
                }
                eq(t) {
                    return this.number == t.number
                }
                toDOM() {
                    return document.createTextNode(this.number)
                }
            }

            function or(t, e) {
                return t.state.facet(nr).formatNumber(e, t.state)
            }
            const lr = _n.compute([nr], t => ({
                class: "css-lineNumbers",
                renderEmptyElements: !1,
                markers: t => t.state.facet(ir),
                lineMarker: (t, e, i) => i.some(t => t.toDOM) ? null : new rr(or(t, t.state.doc.lineAt(e.from).number)),
                widgetMarker: (t, e, i) => {
                    for (let s of t.state.facet(sr)) {
                        let n = s(t, e, i);
                        if (n) return n
                    }
                    return null
                },
                lineMarkerChange: t => t.startState.facet(nr) != t.state.facet(nr),
                initialSpacer: t => new rr(or(t, hr(t.state.doc.lines))),
                updateSpacer(t, e) {
                    let i = or(e.view, hr(e.view.state.doc.lines));
                    return i == t.number ? t : new rr(i)
                },
                domEventHandlers: t.facet(nr).domEventHandlers,
                side: "before"
            }));

            function ar(t = {}) {
                return [nr.of(t), Un(), lr]
            }

            function hr(t) {
                let e = 9;
                for (; e < t;) e = 10 * e + 9;
                return e
            }
            const cr = new class extends Vn {
                    constructor() {
                        super(...arguments), this.elementClass = "css-activeLineGutter"
                    }
                },
                ur = jn.compute(["selection"], t => {
                    let e = [],
                        i = -1;
                    for (let s of t.selection.ranges) {
                        let n = t.doc.lineAt(s.head).from;
                        n > i && (i = n, e.push(cr.range(n)))
                    }
                    return s.om.of(e)
                });

            function dr() {
                return ur
            }
        }
    }
]);