/* 
 *  Copyright (C) 2024 DE SIGNO GmbH
 *  
 *  This program is dual licensed. If you did not license the program under
 *  different terms, the following applies:
 *  
 *  This program is free software: You can redistribute it and/or modify
 *  it under the terms of the GNU Affero General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *  
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU Affero General Public License for more details.
 *  
 *  You should have received a copy of the GNU Affero General Public License
 *  along with this program.  If not, see <https://www.gnu.org/licenses/>.
 *  
 */

export interface ThinTreeEntity {
  id: string|number|undefined;   // unique id for referencing
  name: string|undefined;           // name for display
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
