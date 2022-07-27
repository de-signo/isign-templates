
export interface TreeEntity {
  name: string;
  children: TreeEntity[]|undefined;
  item: Item|undefined;

  // view
  listItemView: 'name'|'item-detail'|undefined;

  // function
  search: true|undefined
  favorit: number|undefined;

  // tree structure
  path: string[]|undefined;
  parent: TreeEntity|undefined;
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
}
