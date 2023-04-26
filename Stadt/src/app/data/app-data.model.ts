
export interface ThinTreeEntity {
  id: string|number|undefined;   // unique id for referencing
  name: string;           // name for display
  children: (ThinTreeEntity|TreeReference)[]|undefined;
  item: Item|undefined;

  // view
  listItemView: 'name'|'item-detail'|undefined;

  // function
  search: true|undefined
  favorit: number|undefined;
}

export interface TreeEntity extends ThinTreeEntity {
  id: string|number;
  children: (TreeEntity|TreeReference)[]|undefined;

  // tree structure
  path: string[]|undefined;
  parent: TreeEntity|undefined;
}

export interface TreeReference {
  referencePath: string[]|string;
}

export class Item {
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
