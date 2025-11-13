import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
registerLocaleData(localeFr);

// Filtrer les warnings ApexCharts passive event listeners
const originalWarn = console.warn;
console.warn = function(...args: any[]) {
  const message = args[0]?.toString?.() || '';
  if (message.includes('Unable to preventDefault inside passive event listener')) {
    return; // Ignorer ce warning spécifique
  }
  originalWarn.apply(console, args);
};

platformBrowserDynamic().bootstrapModule(AppModule, {
  ngZoneEventCoalescing: true,
})
  .catch(err => console.error(err));
