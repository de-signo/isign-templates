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