import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClickThrottleConfig } from './click-throttle.service';
import { TouchClickDirective } from './touchclick.directive';


@NgModule({
  declarations: [
    TouchClickDirective
  ],
  exports: [
    TouchClickDirective
  ]
})
export class TemplateClickModule { 
  public static forRoot(options?: { throttleClicks: number }): ModuleWithProviders<TemplateClickModule> {
    return {
      ngModule: TemplateClickModule,
      providers: [
        { provide: ClickThrottleConfig, useValue: <ClickThrottleConfig>{ throttleClicks: options?.throttleClicks ?? 200 }}
      ],
    };
  }
}
