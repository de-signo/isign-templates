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

import { Directive, ElementRef, Renderer2, OnInit } from '@angular/core';

@Directive({
  selector: '[homeIcon]',
})
export class HomeIconDirective implements OnInit {
  private svgContent = `
  <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
    <polygon points="11.97,1.55 0.07,11.41 2.5,11.41 2.5,22.56 10.14,22.56 10.14,16.89 13.85,16.89 13.85,22.56 21.5,22.56 21.5,11.41 23.87,11.41 "/>
    <polygon points="16.86,1.43 16.86,4.15 21.04,7.61 21.04,1.43 "/>
  </svg>
  `;
  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnInit(): void {
    this.renderer.setProperty(this.el.nativeElement, 'innerHTML', this.svgContent);
  }
}
