class CountMinSketch {
  constructor(rows = 3, width = 16) {
    this.rows = rows;
    this.width = width;
    this.table = Array.from({ length: rows }, () => new Array(width).fill(0));
  }

  #index(value, row) {
    const base = [...value].reduce((sum, char) => sum + char.charCodeAt(0), 0);
    return (base * (row + 3) + row * 11) % this.width;
  }

  increment(value, count = 1) {
    for (let row = 0; row < this.rows; row += 1) {
      this.table[row][this.#index(value, row)] += count;
    }
  }

  estimate(value) {
    let min = Number.POSITIVE_INFINITY;
    for (let row = 0; row < this.rows; row += 1) {
      min = Math.min(min, this.table[row][this.#index(value, row)]);
    }
    return min;
  }
}

module.exports = { CountMinSketch };
