// import Vector from './vector';
var Vector = require('./vector');

/**
 * The mask class acts as sort of a bit mask that can reduce the dimensionality of vectors by a random projection.
 *
 * @private
 */
class Mask {
  /**
   * Construct a new mask.
   *
   * @param {number} d The dimensionality of vectors to mask.
   * @param {number} k The number of dimensions in vector projections.
   */
  constructor(d, k) {
    const m = this.m = new Array(k);

    for (let i = 0; i < k; i++) {
      m[i] = Math.random() * d | 0;
    }
  }

  /**
   * Project a vector, reducing it to a dimensionality specified by this mask.
   *
   * @param {Vector} v The vector to project.
   * @return {Vector} The projected vector.
   */
  project(v) {
    const m = this.m;
    const n = m.length;
    const c = new Array(n);

    for (let i = 0; i < n; i++) {
      c[i] = v.get(m[i]);
    }

    return new Vector(c);
  }
}

module.exports = Mask;
