import { Directive, ElementRef, Renderer2, OnInit } from '@angular/core';

@Directive({
  selector: '[upIcon]',
})
export class UpIconDirective implements OnInit {
  private svgContent = `
  <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
    <polygon class="st0" points="12.1,0.61 3.27,11.97 7.69,11.97 7.69,23.33 16.52,23.33 16.52,11.97 20.94,11.97 "/>
  </svg>
  `;
  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnInit(): void {
    this.renderer.setProperty(this.el.nativeElement, 'innerHTML', this.svgContent);
  }
}
