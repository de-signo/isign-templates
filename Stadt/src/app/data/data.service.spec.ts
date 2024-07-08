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

import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { DataService, TreeOperations } from './data.service';
import { ThinTreeEntity, TreeEntity } from './app-data.model';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('DataService', () => {
  let service: DataService;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [],
    providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
});
    service = TestBed.inject(DataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

describe('TreeOperations', () => {
  it('merge tree', () => {
    const tree1: TreeEntity[] = [
      { id: "t1", name: "t1", item: undefined, children: undefined, parent: undefined, path: ["t1"], favorit: undefined, search: undefined, listItemView: undefined },
      { id: "t2", name: "t2", item: undefined, children: [
        { id: "t21", name: "t21", item: undefined, children: undefined, parent: undefined, path: ["t2", "t21"], favorit: undefined, search: undefined, listItemView: undefined },
        { id: "t12", name: "t12", item: <any>({ term1: "t12term"}), children: undefined, parent: undefined, path:  ["t2", "t12"], favorit: undefined, search: undefined, listItemView: undefined },
      ], parent: undefined, path:  ["t2"], favorit: undefined, search: undefined, listItemView: undefined }
    ];

    const tree2: ThinTreeEntity[] = [
      { id: undefined, name: "t2", item: undefined, children: [
        { id: undefined, name: "t21", item: undefined, children: undefined, favorit: undefined, search: undefined, listItemView: undefined },
        { id: undefined, name: "t12", item: <any>({ term1: "t12termb", term2: "t12term2"}), children: undefined, favorit: undefined, search: undefined, listItemView: undefined },
        { id: undefined, name: "t23", item: <any>({ term1: "t23termb", term2: "t23term2"}), children: undefined, favorit: undefined, search: undefined, listItemView: undefined },
      ], favorit: undefined, search: undefined, listItemView: undefined },
      { id: undefined, name: "t3", item: undefined, children: [
        { id: undefined, name: "t3/1", item: undefined, children: undefined, favorit: undefined, search: undefined, listItemView: undefined },
      ], favorit: undefined, search: undefined, listItemView: undefined },
    ];

    TreeOperations.mergeTree(tree1, tree2);
    expect(tree1.length).toBe(3);
    expect(tree1[1].children?.length).toBe(3);
    expect(TreeOperations.isTreeReference(tree1[1].children?.[1]!)).toBe(false);
    expect((<TreeEntity>tree1[1].children?.[1])?.item?.term1).toBe("t12termb");
    expect((<TreeEntity>tree1[1].children?.[1])?.item?.term2).toBe("t12term2");

    // check path
    expect(tree1[2].path).toEqual(["t3"]);
    expect((<TreeEntity>tree1[1].children?.[2])?.path).toEqual(["t2", "t23"]);
    expect((<TreeEntity>tree1[2].children?.[0])?.path).toEqual(["t3", "t3-1"]);

    // check parent
    expect(tree1[2].parent).toBe(undefined);
    expect((<TreeEntity>tree1[1].children?.[2])?.parent).toBe(tree1[1]);
    expect((<TreeEntity>tree1[2].children?.[0])?.parent).toBe(tree1[2]);
  });

  it('find path in tree', () => {
    const tree1: TreeEntity[] = [
      { id: "1", name: "t1", item: undefined, children: undefined, parent: undefined, path: undefined, favorit: undefined, search: undefined, listItemView: undefined },
      { id: "2", name: "t2", item: undefined, children: [
        { id: "21", name: "t21", item: undefined, children: undefined, parent: undefined, path: undefined, favorit: undefined, search: undefined, listItemView: undefined },
        { id: "2/2", name: "t22", item: <any>({ term1: "t22term"}), children: undefined, parent: undefined, path: undefined, favorit: undefined, search: undefined, listItemView: undefined },
      ], parent: undefined, path: undefined, favorit: undefined, search: undefined, listItemView: undefined }
    ];

    let t1 = TreeOperations.findPath(tree1, ["2"]);
    expect(t1).toBeTruthy();
    let t22 = TreeOperations.findPath(tree1, ["2", "2-2"]);
    expect(t22).toBeTruthy();
    expect(t22?.item?.term1).toBe("t22term");
  })

  it('isTreeReference', () => {
    const te = { id: "t1", name: "t1", item: undefined, children: undefined, parent: undefined, path: undefined, favorit: undefined, search: undefined, listItemView: undefined };
    const tr = { referencePath: "t1" };

    expect(TreeOperations.isTreeReference(te)).toBeFalse();
    expect(TreeOperations.isTreeReference(tr)).toBeTrue();
  })

  it('walk tree', () => {
    const tree1: TreeEntity[] = [
      { id: "t1", name: "t1", item: undefined, children: undefined, parent: undefined, path: undefined, favorit: undefined, search: undefined, listItemView: undefined },
      { id: "t2", name: "t2", item: undefined, children: [
        { referencePath: "t1" },
        { id: "t22", name: "t22", item: <any>({ term1: "t22term"}), children: undefined, parent: undefined, path: undefined, favorit: undefined, search: undefined, listItemView: undefined },
      ], parent: undefined, path: undefined, favorit: undefined, search: undefined, listItemView: undefined }
    ];

    let list: string[] = [];
    TreeOperations.walkTree<void>(tree1, (te, state) => {
      list.push(te.name ?? "");
    }, undefined);
    expect(list).toEqual(["t1", "t2", "t22"]);
  })
})