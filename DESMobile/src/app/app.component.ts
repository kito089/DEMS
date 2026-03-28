import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { ConfigService } from './services/config.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [
    IonApp,
    IonRouterOutlet
  ]
})
export class AppComponent {

  constructor(
    private config: ConfigService,
    private router: Router
  ) {
    this.checkConfig();
  }

  async checkConfig() {
    const configured = await this.config.isConfigured();

    if (!configured) {
      this.router.navigate(['/setup']);
    }
  }
}