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
import { ViewModelService } from '../data/view-model.service';

import { CategoryViewComponent } from './category-view.component';
import { TemplateService } from '@isign/forms-templates';

describe('CategoryViewComponent', () => {
  let component: CategoryViewComponent;
  let fixture: ComponentFixture<CategoryViewComponent>;
  let fakeData = { tree: of([]) };
  let fakeVM = { clear: ()=>{} };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CategoryViewComponent ],
      providers: [
        { provide: DataService, useValue: fakeData },
        { provide: ViewModelService, useValue: fakeVM },
        { provide: TemplateService, useValue: { getTemplate: () => ({ parameters: { } }) }},
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoryViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
