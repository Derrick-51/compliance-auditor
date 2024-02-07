import { importProvidersFrom, mergeApplicationConfig } from '@angular/core';
import { AppComponent } from './app/app.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideClientHydration, BrowserModule, bootstrapApplication } from '@angular/platform-browser';


bootstrapApplication(AppComponent, {
    providers: [
        importProvidersFrom(BrowserModule),
        provideClientHydration(),
        provideAnimationsAsync()
    ]
})
  .catch(err => console.error(err));
