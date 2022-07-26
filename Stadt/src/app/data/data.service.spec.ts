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
      { name: "t1", item: undefined, children: undefined, parent: undefined, path: undefined, favorit: undefined, search: undefined },
      { name: "t2", item: undefined, children: [
        { name: "t21", item: undefined, children: undefined, parent: undefined, path: undefined, favorit: undefined, search: undefined },
        { name: "t12", item: <any>({ term1: "t12term"}), children: undefined, parent: undefined, path: undefined, favorit: undefined, search: undefined },
      ], parent: undefined, path: undefined, favorit: undefined, search: undefined }
    ];

    const tree2: TreeEntity[] = [
      { name: "t2", item: undefined, children: [
        { name: "t21", item: undefined, children: undefined, parent: undefined, path: undefined, favorit: undefined, search: undefined },
        { name: "t12", item: <any>({ term1: "t12termb", term2: "t12term2"}), children: undefined, parent: undefined, path: undefined, favorit: undefined, search: undefined },
      ], parent: undefined, path: undefined, favorit: undefined, search: undefined },
      { name: "t3", item: undefined, children: undefined, parent: undefined, path: undefined, favorit: undefined, search: undefined },
    ];

    TreeOperations.mergeTree(tree1, tree2);
    expect(tree1.length).toBe(3);
    expect(tree1[1].children?.length).toBe(2);
    expect(tree1[1].children?.[1].item?.term1).toBe("t12termb");
    expect(tree1[1].children?.[1].item?.term2).toBe("t12term2");
  });

  it('find path in tree', () => {
    const tree1: TreeEntity[] = [
      { name: "t1", item: undefined, children: undefined, parent: undefined, path: undefined, favorit: undefined, search: undefined },
      { name: "t2", item: undefined, children: [
        { name: "t21", item: undefined, children: undefined, parent: undefined, path: undefined, favorit: undefined, search: undefined },
        { name: "t22", item: <any>({ term1: "t22term"}), children: undefined, parent: undefined, path: undefined, favorit: undefined, search: undefined },
      ], parent: undefined, path: undefined, favorit: undefined, search: undefined }
    ];

    let t1 = TreeOperations.findPath(tree1, ["t2"]);
    expect(t1).toBeTruthy();
    let t22 = TreeOperations.findPath(tree1, ["t2", "t22"]);
    expect(t22).toBeTruthy();
    expect(t22?.item?.term1).toBe("t22term");
  })
})