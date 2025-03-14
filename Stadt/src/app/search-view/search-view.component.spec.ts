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

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { DataService } from '../data/data.service';

import { SearchViewComponent } from './search-view.component';
import { TemplateInstance, TemplateService } from '@isign/forms-templates';

describe('SearchViewComponent', () => {
  let component: SearchViewComponent;
  let fixture: ComponentFixture<SearchViewComponent>;
  let fakeData = { getSearchResults: (s: string) => of([]) };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SearchViewComponent ],
      providers: [
        { provide: TemplateService, useValue: { getTemplate: () => ({ parameters: { } }) }},
        { provide: DataService, useValue: fakeData }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
