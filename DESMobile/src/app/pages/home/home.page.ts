import { Component } from '@angular/core';
import { IonContent } from '@ionic/angular/standalone';
import { PageBodyComponent } from '../../layout/page-body/page-body.component';
import { PageHeaderHomeComponent } from '../../layout/page-header-home/page-header-home.component';
import { QuickActionTileComponent } from '../../components/quick-action-tile/quick-action-tile.component';
import { OrderActiveCardComponent } from '../../components/order-active-card/order-active-card.component';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [
    IonContent,
    PageBodyComponent,
    PageHeaderHomeComponent,
    QuickActionTileComponent,
    OrderActiveCardComponent,
  ],
})
export class HomePage {
  constructor() {}
}
