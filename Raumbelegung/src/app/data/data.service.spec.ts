/* 
 *  Copyright (C) 2025 DE SIGNO GmbH
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

import { TestBed, waitForAsync } from '@angular/core/testing';
import { DataService } from './data.service';
import { StyleService } from './style.service';
import { DataImportService } from '@isign/isign-services';

describe('DataService', () => {
  let service: DataService;
  let myStyle: any = {};
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: StyleService, useValue: { style: myStyle }},
        { provide: DataImportService, useValue: {}}
    ]
  });
    service = TestBed.inject(DataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should load free style data', waitForAsync(() => {
    myStyle.key = 'raumbelegung2021_free';
    myStyle.qr = "testa";
    myStyle.title = "testb";
    myStyle.subtitle = "testc";
    myStyle.participants = ["testd"];
    myStyle.date = "teste";
    myStyle.from = "testf";
    myStyle.to = "testg";

    service.load().subscribe({
      next: (data) => {
        expect(data).toBeTruthy();
        expect(data?.length == 1);
        expect(data![0].qr).toBe("testa");
        expect(data![0].title).toBe("testb");
        expect(data![0].subtitle).toBe("testc");
        expect(data![0].participants).toContain("testd");
        expect(data![0].date).toBe("teste");
        expect(data![0].from).toBe("testf");
        expect(data![0].to).toBe("testg");
      },
      error: (error) => {
        throw error;
      }
    })
  }));

  it('should load free style data', waitForAsync(() => {
    myStyle.key = 'raumbelegung_2_free';
    myStyle.qr = "test0";
    myStyle.title = "test1";
    myStyle.subtitle = "test2";
    myStyle.participants = ["test3"];
    myStyle.date = "test4";
    myStyle.from = "test5";
    myStyle.to = "test6";

    service.load().subscribe({
      next: (data) => {
        expect(data).toBeTruthy();
        expect(data?.length == 1);
        expect(data![0].qr).toBe("test0");
        expect(data![0].title).toBe("test1");
        expect(data![0].subtitle).toBe("test2");
        expect(data![0].participants).toContain("test3");
        expect(data![0].date).toBe("test4");
        expect(data![0].from).toBe("test5");
        expect(data![0].to).toBe("test6");
      },
      error: (error) => {
        throw error;
      }
    })
  }));
});
