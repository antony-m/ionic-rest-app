import {Component, HostListener, Input, OnInit} from '@angular/core';
import { ModalController } from '@ionic/angular';
import {gradients} from './gradients';
import {defaultSettings} from './defaultSettings';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit {
  @Input() settings: any;
  @Input() setGradients: () => void;
  gradients = gradients;
  constructor(public modalController: ModalController) { }

  ngOnInit() {}

  @HostListener('document:ionBackButton', ['$event'])
  public async overrideHardwareBackAction($event: any) {
    await this.modalController.dismiss({
      dismissed: true
    });
  }

  onChangeColor() {
    this.setGradients();
  }

  onClickRestoreDefaults() {
    // tslint:disable-next-line:forin
    for (const k in defaultSettings) {
        this.settings[k] = defaultSettings[k];
    }
    this.setGradients();
  }

  async close() {
    await this.modalController.dismiss(this.settings);
  }
}
