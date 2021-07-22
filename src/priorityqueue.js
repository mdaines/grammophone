class PriorityQueue {
    constructor(k = [], p = []) {
        this._popped = false;

        if (k.length !== p.length) throw new Error("Input array length mismatch");

        this.length = k.length;

        this._k = k;
        this._p = p;
        
        for (let i = k.length >>> 1; i >= 1; i--) {
            let ind = i;
            const k1 = this._k[ind];
            const p1 = this._p[ind];

            const h = 1 + (this.length >>> 1);
            const lind = this.length + 1;
            while (ind < h) {
                const l = ind << 1;

                let cp = this._p[l];
                let ck = this._k[l];
                let cind = l;

                const r = l + 1;
                if (r < lind) {
                    const rp = this._p[r];
                    if (rp < cp) {
                        cp = rp;
                        ck = this._k[r];
                        cind = r;
                    }
                }

                if (cp >= p1) break;

                this._k[ind] = ck;
                this._p[ind] = cp;

                ind = cind;
            }

            this._k[ind] = k1;
            this._p[ind] = p1;
        }
    }

    clear() {
        this.length = 0;
        this._popped = false;
    }
    push(key, priority) {
        if (this._popped) {
            this._k[1] = key;
            this._p[1] = priority;

            let ind = 1;
            const k = this._k[ind];
            const p = this._p[ind];

            const h = 1 + (this.length >>> 1);
            const lind = this.length + 1;
            while (ind < h) {
                const l = ind << 1;

                let cp = this._p[l];
                let ck = this._k[l];
                let cind = l;

                const r = l + 1;
                if (r < lind) {
                    const rp = this._p[r];
                    if (rp < cp) {
                        cp = rp;
                        ck = this._k[r];
                        cind = r;
                    }
                }

                if (cp >= p) break;

                this._k[ind] = ck;
                this._p[ind] = cp;

                ind = cind;
            }

            this._k[ind] = k;
            this._p[ind] = p;
            this._popped = false;
        } else {
            const pos = this.length + 1;
            this._k[pos] = key;
            this._p[pos] = priority;
            let ind = pos;
            const k = this._k[ind];
            const p = this._p[ind];

            while (ind > 1) {
                const pind = ind >>> 1;
                if (this._p[pind] <= p) break;

                this._k[ind] = this._k[pind];
                this._p[ind] = this._p[pind];

                ind = pind;
            }

            this._k[ind] = k;
            this._p[ind] = p;
        }

        this.length++;
    }

    pop() {
        if (this.length === 0) return undefined;
        if (this._popped) {
            this._k[1] = this._k[this.length + 1];
            this._p[1] = this._p[this.length + 1];

            let ind = 1;
            const k = this._k[ind];
            const p = this._p[ind];

            const h = 1 + (this.length >>> 1);
            const lind = this.length + 1;
            while (ind < h) {
                const l = ind << 1;

                let cp = this._p[l];
                let ck = this._k[l];
                let cind = l;

                const r = l + 1;
                if (r < lind) {
                    const rp = this._p[r];
                    if (rp < cp) {
                        cp = rp;
                        ck = this._k[r];
                        cind = r;
                    }
                }

                if (cp >= p) break;

                this._k[ind] = ck;
                this._p[ind] = cp;

                ind = cind;
            }

            this._k[ind] = k;
            this._p[ind] = p;
            this._popped = false;
        }

        this.length--;
        this._popped = true;

        return this._k[1];
    }
}