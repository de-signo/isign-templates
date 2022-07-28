import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { DataService, TreeOperations } from './data.service';
import { TreeEntity } from './app-data.model';

describe('DataService', () => {
  let service: DataService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
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
      { name: "t1", item: undefined, children: undefined, parent: undefined, path: ["t1"], favorit: undefined, search: undefined, listItemView: undefined },
      { name: "t2", item: undefined, children: [
        { name: "t21", item: undefined, children: undefined, parent: undefined, path: ["t2", "t21"], favorit: undefined, search: undefined, listItemView: undefined },
        { name: "t12", item: <any>({ term1: "t12term"}), children: undefined, parent: undefined, path:  ["t2", "t12"], favorit: undefined, search: undefined, listItemView: undefined },
      ], parent: undefined, path:  ["t2"], favorit: undefined, search: undefined, listItemView: undefined }
    ];

    const tree2: TreeEntity[] = [
      { name: "t2", item: undefined, children: [
        { name: "t21", item: undefined, children: undefined, parent: undefined, path: undefined, favorit: undefined, search: undefined, listItemView: undefined },
        { name: "t12", item: <any>({ term1: "t12termb", term2: "t12term2"}), children: undefined, parent: undefined, path: undefined, favorit: undefined, search: undefined, listItemView: undefined },
        { name: "t23", item: <any>({ term1: "t23termb", term2: "t23term2"}), children: undefined, parent: undefined, path: undefined, favorit: undefined, search: undefined, listItemView: undefined },
      ], parent: undefined, path: undefined, favorit: undefined, search: undefined, listItemView: undefined },
      { name: "t3", item: undefined, children: [
        { name: "t31", item: undefined, children: undefined, parent: undefined, path: undefined, favorit: undefined, search: undefined, listItemView: undefined },
      ], parent: undefined, path: undefined, favorit: undefined, search: undefined, listItemView: undefined },
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
    expect((<TreeEntity>tree1[2].children?.[0])?.path).toEqual(["t3", "t31"]);

    // check parent
    expect(tree1[2].parent).toBe(undefined);
    expect((<TreeEntity>tree1[1].children?.[2])?.parent).toBe(tree1[1]);
    expect((<TreeEntity>tree1[2].children?.[0])?.parent).toBe(tree1[2]);
  });

  it('find path in tree', () => {
    const tree1: TreeEntity[] = [
      { name: "t1", item: undefined, children: undefined, parent: undefined, path: undefined, favorit: undefined, search: undefined, listItemView: undefined },
      { name: "t2", item: undefined, children: [
        { name: "t21", item: undefined, children: undefined, parent: undefined, path: undefined, favorit: undefined, search: undefined, listItemView: undefined },
        { name: "t22", item: <any>({ term1: "t22term"}), children: undefined, parent: undefined, path: undefined, favorit: undefined, search: undefined, listItemView: undefined },
      ], parent: undefined, path: undefined, favorit: undefined, search: undefined, listItemView: undefined }
    ];

    let t1 = TreeOperations.findPath(tree1, ["t2"]);
    expect(t1).toBeTruthy();
    let t22 = TreeOperations.findPath(tree1, ["t2", "t22"]);
    expect(t22).toBeTruthy();
    expect(t22?.item?.term1).toBe("t22term");
  })

  it('isTreeReference', () => {
    const te = { name: "t1", item: undefined, children: undefined, parent: undefined, path: undefined, favorit: undefined, search: undefined, listItemView: undefined };
    const tr = { referencePath: "t1" };

    expect(TreeOperations.isTreeReference(te)).toBeFalse();
    expect(TreeOperations.isTreeReference(tr)).toBeTrue();
  })

  it('walk tree', () => {
    const tree1: TreeEntity[] = [
      { name: "t1", item: undefined, children: undefined, parent: undefined, path: undefined, favorit: undefined, search: undefined, listItemView: undefined },
      { name: "t2", item: undefined, children: [
        { referencePath: "t1" },
        { name: "t22", item: <any>({ term1: "t22term"}), children: undefined, parent: undefined, path: undefined, favorit: undefined, search: undefined, listItemView: undefined },
      ], parent: undefined, path: undefined, favorit: undefined, search: undefined, listItemView: undefined }
    ];

    let list: string[] = [];
    TreeOperations.walkTree<void>(tree1, (te, state) => {
      list.push(te.name);
    }, undefined);
    expect(list).toEqual(["t1", "t2", "t22"]);
  })
})