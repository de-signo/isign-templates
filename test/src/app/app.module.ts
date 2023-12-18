import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ISignPlayerExtensionsModule } from "@isign/player-extensions";
import { TemplateBaseRefModule } from "@isign/forms-templates";
import { AppComponent } from './app.component';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { FixedFocusDirective } from './fixedfocus.directive';

@NgModule({ declarations: [
        AppComponent,
        FixedFocusDirective
    ],
    bootstrap: [AppComponent], imports: [
        // enable hosting in forms show
        TemplateBaseRefModule.forRoot(),
        BrowserModule,
        ISignPlayerExtensionsModule], providers: [provideHttpClient(withInterceptorsFromDi())] })
export class AppModule { }
