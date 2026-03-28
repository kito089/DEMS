import { Component } from '@angular/core';
import { IonContent, IonButton } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import { ConfigService } from '../../services/config.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { ContentHeadingComponent } from '../../components/content-heading/content-heading.component';

@Component({
  standalone: true,
  selector: 'app-setup',
  templateUrl: './setup.page.html',
  styleUrls: ['./setup.page.scss'],
  imports: [IonContent, IonButton, CommonModule, ContentHeadingComponent],
})export class SetupPage {

  constructor(
    private config: ConfigService,
    private http: HttpClient,
    private router: Router
  ) { }

  async scanQR() {
    const result = await BarcodeScanner.scan();

    if (result.barcodes.length > 0) {

      const barcode = result.barcodes[0];

      if (!barcode || !barcode.rawValue) {
        console.error("QR inválido");
        return;
      }

      const url = barcode.rawValue;
      console.log("QR:", url);

      // Guardar base URL (quitamos /login)
      const baseUrl = url.replace('/login', '');

      await this.config.setApiUrl(baseUrl);

      // Registrar dispositivo
      try {
        await firstValueFrom(
          this.http.post(`${baseUrl}/register`, {})
        );
      } catch (error) {
        console.error("Error en register:", error);
      }

      // Ir a home
      console.log('navegando...');
      this.router.navigate(['/home']).then(res => {
        console.log('resultado navegación:', res);
      });
    }
  }
}