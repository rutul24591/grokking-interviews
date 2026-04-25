class DynamicArray {
  constructor(initialCapacity = 2) {
    this.capacity = initialCapacity;
    this.length = 0;
    this.buffer = new Array(this.capacity);
  }

  append(value) {
    this.#ensureCapacity(this.length + 1);
    this.buffer[this.length++] = value;
  }

  insertAt(index, value) {
    if (index < 0 || index > this.length) {
      throw new RangeError("insert index out of bounds");
    }
    this.#ensureCapacity(this.length + 1);
    for (let cursor = this.length; cursor > index; cursor -= 1) {
      this.buffer[cursor] = this.buffer[cursor - 1];
    }
    this.buffer[index] = value;
    this.length += 1;
  }

  removeAt(index) {
    if (index < 0 || index >= this.length) {
      throw new RangeError("remove index out of bounds");
    }
    const removed = this.buffer[index];
    for (let cursor = index; cursor < this.length - 1; cursor += 1) {
      this.buffer[cursor] = this.buffer[cursor + 1];
    }
    this.buffer[this.length - 1] = undefined;
    this.length -= 1;
    return removed;
  }

  update(index, value) {
    if (index < 0 || index >= this.length) {
      throw new RangeError("update index out of bounds");
    }
    this.buffer[index] = value;
  }

  toArray() {
    return this.buffer.slice(0, this.length);
  }

  #ensureCapacity(targetLength) {
    if (targetLength <= this.capacity) return;
    while (this.capacity < targetLength) this.capacity *= 2;
    const next = new Array(this.capacity);
    for (let index = 0; index < this.length; index += 1) {
      next[index] = this.buffer[index];
    }
    this.buffer = next;
  }
}

module.exports = { DynamicArray };
