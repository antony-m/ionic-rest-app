import {Component, HostListener, Input, OnInit} from '@angular/core';
import {ModalController} from '@ionic/angular';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss'],
})
export class HistoryComponent implements OnInit {
  @Input() history: any;
  constructor(public modalController: ModalController) { }

  ngOnInit() {}

  onClickClear() {
    if (this.history.length > 0 && window.confirm('Are you sure you want to clear history?')) {
      this.history.length = 0;
    }
  }

  @HostListener('document:ionBackButton', ['$event'])
  public async overrideHardwareBackAction($event: any) {
    await this.modalController.dismiss({
      dismissed: true
    });
  }

  async close() {
    await this.modalController.dismiss();
  }
}
