export class CharStream {
  source: string;
  index: number;

  constructor(source: string) {
    this.source = source;
    this.index = 0;
  }

  withinIndex(index: number) {
    return index < this.source.length;
  }

  withinOffset(offset: number) {
    return this.withinIndex(this.index + offset);
  }

  within() {
    return this.withinIndex(this.index);
  }

  peekIndex(index: number) {
    return this.source[index];
  }

  peekOffset(offset: number) {
    return this.source[this.index + offset];
  }

  peek() {
    return this.source[this.index];
  }

  peekRange(start: number, end: number) {
    if (this.withinIndex(start) && this.withinIndex(end)) {
      return this.source.slice(start, end);
    }
  }

  is(value: string) {
    return this.peekRange(this.index, this.index + value.length) === value;
  }

  eat(value: string) {
    if (this.is(value)) {
      this.index += value.length;
    }
  }

  step() {
    if (this.within()) {
      this.index += 1;
      return this.peekIndex(-1);
    }
  }

  read(condition: (value: string) => boolean): string {
    let out = "";
    let value;
    while ((value = this.peek()) !== undefined) {
      if (condition(value)) {
        out += this.step();
      } else {
        break;
      }
    }
    return out;
  }
}
