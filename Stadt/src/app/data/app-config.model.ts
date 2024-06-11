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

import { Item, TreeEntity } from "./app-data.model";


export interface IItemSource {
  name: string|undefined;
  type: string;
}

export interface IFixedItemSource extends IItemSource {
  type: "fixed";
  tree: TreeEntity[];
}

export interface IDataImportItemSource extends IItemSource {
  type: "dataimport";
  category: string;
  search: true|undefined;
  listItemView: 'name'|'item-detail'|undefined;
  mapTo: 'leaf-item'|'group-with-reference-id'|undefined;
  dataSourceKey: string;  // field key of data import
}

export interface IFileItemSource extends IItemSource {
  type: "file";
  url: string;
}

export interface IListOptions {
  defaultItemView: 'name'|'item-detail'|undefined;
}

export interface ISearchOptions {
  showFavorits: boolean|undefined;
  fillUpResults: boolean|undefined;
}

export interface IAppConfig {
  list: IListOptions|undefined;
  search: ISearchOptions|undefined;
  sources: (IFileItemSource|IDataImportItemSource|IFixedItemSource)[];
}