var Mask = require('./mask');
var Vector = require('./vector');
var Map = require('./map');

 class Table {
  /**
   * Construct a lookup table for vectors of dimensionality `d` where vectors are hashed using `k`-width hash values
   * (random vector projections) into `l` sets of hashes.
   *
   * @param {number} d The number of dimensions of vectors in the table.
   * @param {number} k The width of each vector hash.
   * @param {number} l The number of hash sets to use.
   *
   * @example
   * const d = 4;
   * const k = 2;
   * const l = 2;
   * const t = Table(d, k, l);
   */
  constructor(d, k, l) {
    this.d = d;
    this.l = 0;
     
    if (k > d || l > d) {
      throw new Error('Amplification parameters cannot be greater than d');
    }

    const m = this.m = new Array(l);
    const t = this.t = new Array(l);
    var maskK = k;
    for (let i = 0; i < l; i++) {
      m[i] = new Mask(d, maskK);
      t[i] = new Map();

    }
  }

  /**
   * Get the number of vectors in the lookup table.
   *
   * @memberof Table
   * @return {number} The number of vectors in the lookup table.
   *
   * @example
   * t.add(Vector(...));
   * t.size();
   * // => 1
   */
  size() {
    return this.l;
  }

  /**
   * Add a vector `v` to the lookup table.
   *
   * @memberof Table
   * @param {Vector} v The vector to add to the lookup table.
   *
   * @example
   * const v = Vector([1, 0, 1, 0]);
   * t.add(v);
   */
  add(v) {
    const {d, t, m} = this;

    if (v.size() !== d) {
      throw new Error('Incorrect vector dimensionality');
    }

    this.l++;

    for (let i = 0, n = t.length; i < n; i++) {
      const k = m[i].project(v);
      const b = t[i].get(k, []);

      b[b.length] = v;

      t[i].set(k, b);
    }
  }

  /**
   * Query the lookup table for the nearest neighbour of a query vector `q`.
   *
   * @memberof Table
   * @param {Vector} q The query vector to look up the nearest neighbour of.
   * @return {Vector} The nearest neighbouring vector if found.
   *
   * @example
   * const q = Vector([0, 1, 0, 1]);
   * t.query(q);
   * // => Vector(...)
   */
  compare(a,b) {
    if (a.distance < b.distance)
      return -1;
    if (a.distance > b.distance)
      return 1;
    return 0;
  }


  query(q) {
    const {d, t, m} = this;

    if (q.size() !== d) {
      throw new Error('Incorrect vector dimensionality');
    }

    var nn = 3;
    var empty_vec = {vec:[], distance:1};
    let bc = [];
    let bd = [];
    let bcd = [];
    for(let i = 0; i < nn ; i++) {
      bcd.push(empty_vec);
    }
    for (let i = 0, n = t.length; i < n; i++) {
      const k = m[i].project(q);
      const b = t[i].get(k, []);

      for (let j = 0, m = b.length; j < m; j++) {
        const c = b[j];
        const d = Vector.distance(q, c);

        for (let y = 0; y < nn; y++) {
          if (d < bcd[y].distance) {
            bcd.splice(y, 1);
            bcd.push({vec:c,distance:d});
            bcd.sort(this.compare);
            break;
          }
        }
      }
    }
    return bcd;
  }

  /**
   * Check if the lookup table contains a specific vector.
   *
   * @param {Vector} v The vector to check for.
   * @return {boolean} `true` if the table contains the vector, otherwise `false`.
   */
  contains(v) {
    const {d, t, m} = this;

    if (v.size() !== d) {
      throw new Error('Incorrect vector dimensionality');
    }

    for (let i = 0, n = t.length; i < n; i++) {
      const k = m[i].project(v);
      const b = t[i].get(k, []);

      for (let j = 0, m = b.length; j < m; j++) {
        if (v.equals(b[j])) {
          return true;
        }
      }
    }

    return false;
  }
}

module.exports = Table;
