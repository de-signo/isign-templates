
export class Category {
  name: string = "";
  items: Item[] = [];
}

export class Item {
  id: string = "";
  term1: string = "";
  term2: string = "";
  house: string = "";
  level: string = "";
  room: string = "";
  phone: string = "";
  email: string = "";
  map: string = "";
  info: string = "";
  favorit: number = 0;
}

export class ItemWithIndex extends Item {
  constructor(item: Item, index: {cat: number, item: number}) {
    super();
    Object.assign(this, item);
    this.index = index;
  }

  index!: {cat: number, item: number};
}