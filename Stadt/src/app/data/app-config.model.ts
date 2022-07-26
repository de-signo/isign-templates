import { Item } from "./app-data.model";


export interface IItemSource {
  name: string|undefined;
  type: string;
}

export interface IFixedItemSource extends IItemSource {
  type: "fixed";
  category: string;
  items: Item[];
}

export interface IDataImportItemSource extends IItemSource {
  type: "dataimport";
  category: string;
  dataSourceKey: string;  // field key of data import
}

export interface IFileItemSource extends IItemSource {
  type: "file";
  url: string;
}

export interface IAppConfig {
  sources: (IFileItemSource|IDataImportItemSource|IFixedItemSource)[];
}