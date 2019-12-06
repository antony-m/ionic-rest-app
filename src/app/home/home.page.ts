import {AfterViewInit, Component, OnDestroy, ViewChild} from '@angular/core';
import {Insomnia} from '@ionic-native/insomnia/ngx';
import {IonRouterOutlet, ModalController, Platform} from '@ionic/angular';
import {NativeAudio} from '@ionic-native/native-audio/ngx';
import {SettingsComponent} from '../settings/settings.component';
import {defaultSettings} from '../settings/defaultSettings';
import {ScreenOrientation} from '@ionic-native/screen-orientation/ngx';
import {gradients} from '../settings/gradients';
import { Storage } from '@ionic/storage';
import {HistoryComponent} from '../history/history.component';

const INITIAL_SUBTITLE = 'Tap to start/reset timer';
const TIMER_SUBTITLE = 'Remaining Time';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements AfterViewInit, OnDestroy {
  @ViewChild(IonRouterOutlet, null) routerOutlet: IonRouterOutlet;
  percent = 0;
  radius = 100;
  timer: any = false;
  progress = 0;
  sets = 0;
  minutes: any;
  seconds: any;
  subscription: any;
  subtitle = INITIAL_SUBTITLE;
  settings = {...defaultSettings};
  history = [];
  outerStrokeColor: any;
  outerStrokeGradientStopColor: any;
  title: string;
  totalSeconds: number;

  elapsed: any = {
    h: '00',
    m: '00',
    s: '00',
  };

  overallTimer: any = false;

  constructor(public platform: Platform,
              private insomnia: Insomnia,
              private nativeAudio: NativeAudio,
              public modalController: ModalController,
              private screenOrientation: ScreenOrientation,
              private storage: Storage) {
    this.platform.ready().then(() => {
      // add reading from device memory
      this.storage.get('restAppSettings').then((val) => {
        if (val) {
          this.settings = JSON.parse(val);
        } else {
          this.settings = {...defaultSettings};
        }
        this.initSettings();
      });
      this.storage.get('restAppHistory').then((val) => {
        if (val) {
          this.history = JSON.parse(val);
        }
      });
      // set to portrait
      this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);
      this.nativeAudio.preloadSimple('uniqId', 'assets/audio/bell-ring.mp3').then(() => {
      }, (error) => {
        console.log(error);
      });
    });
  }

  initSettings() {
    this.setGradients();
    this.title = this.getTitle();
    this.totalSeconds = this.getTotalSeconds();
  }

  ngAfterViewInit() {
    this.subscription = this.platform.backButton.subscribeWithPriority(0, () => {
      if (window.confirm('Are you sure you want to quit?')) {
        (navigator as any).app.exitApp();
        this.storage.set('restAppSettings', JSON.stringify(this.settings));
        if (this.getElapsedTime() > 0) {
          this.history.push({
            date: new Date(),
            trainingTime: `${this.elapsed.h}:${this.elapsed.m}:${this.elapsed.s}`
          });
        }
        this.storage.set('restAppHistory', JSON.stringify(this.history));
      }
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  setGradients() {
    this.outerStrokeColor = this.getGradientsProperty('outerStrokeColor');
    this.outerStrokeGradientStopColor = this.getGradientsProperty('outerStrokeGradientStopColor');
  }

  getGradientsProperty(property) {
    return gradients.find((gradient) =>
      gradient.name === this.settings.circleColor)[property];
  }

  getElapsedTime() {
    return Number(this.elapsed.h)
      + Number(this.elapsed.m)
      + Number(this.elapsed.s);
  }

  onChangeRestTime(e: string) {
    this.settings.fullTime = e;
    if (this.timer) {
      this.startTimer();
    }
    this.title = this.getTitle();
  }

  getTitle() {
    this.totalSeconds = this.getTotalSeconds();
    const remaining = this.totalSeconds - this.progress < 0 ? 0 : this.totalSeconds - this.progress;
    return remaining + 's';
  }

  getTotalSeconds() {
    const timeSplit = this.settings.fullTime.split(':');
    this.minutes = timeSplit[1];
    this.seconds = timeSplit[2];
    return Math.floor(this.minutes * 60) + parseInt(this.seconds, 10);
  }

  startTimer() {
    this.subtitle = TIMER_SUBTITLE;
    this.sets++;
    if (this.timer) {
      clearInterval(this.timer);
    }

    if (!this.overallTimer) {
      this.progressTimer();
      this.insomnia.keepAwake();
    }

    this.timer = false;
    this.percent = 0;
    this.progress = 0;

    this.totalSeconds = this.getTotalSeconds();
    this.title = this.getTitle();

    this.timer = setInterval(() => {
      this.progress++;
      this.percent = (this.progress / this.totalSeconds) * 100;
      this.title = this.getTitle();
      if (this.percent >= this.radius) {
        clearInterval(this.timer);
        if (this.settings.soundEnabled) {
          this.nativeAudio.play('uniqId');
        }
      }
    }, 1000);
  }

  progressTimer() {
    const countDownDate = new Date();
    this.overallTimer = setInterval(() => {
      const now = new Date().getTime();
      const distance = now - countDownDate.getTime();

      this.elapsed.h = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      this.elapsed.m = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      this.elapsed.s = Math.floor((distance % (1000 * 60)) / 1000);

      this.elapsed.h = this.pad(this.elapsed.h, 2);
      this.elapsed.m = this.pad(this.elapsed.m, 2);
      this.elapsed.s = this.pad(this.elapsed.s, 2);
    }, 1000);
  }

  pad(num, size) {
    let s = num + '';
    while (s.length < size) {
      s = '0' + s;
    }
    return s;
  }

  resetSets() {
    this.sets = 0;
  }

  stopTime() {
    if (window.confirm('Are you sure you want to reset training?')) {
      this.subtitle = INITIAL_SUBTITLE;
      this.sets = 0;
      clearInterval(this.timer);
      clearInterval(this.overallTimer);
      this.overallTimer = false;
      this.timer = false;
      this.percent = 0;
      this.progress = 0;
      this.elapsed = {
        h: '00',
        m: '00',
        s: '00'
      };
      this.title = this.getTitle();
      this.insomnia.allowSleepAgain();
    }
  }

  showSettingsModal() {
    this.presentSettingsModal().then(() => {
    });
  }

  async presentSettingsModal() {
    const modal = await this.modalController.create({
      component: SettingsComponent,
      componentProps: {
        settings: this.settings,
        setGradients: this.setGradients.bind(this)
      }
    });

    await modal.present().then(() => {
    });
  }

  showHistoryModal() {
    this.presentHistoryModal().then(() => {
    });
  }

  async presentHistoryModal() {
    const modal = await this.modalController.create({
      component: HistoryComponent,
      componentProps: {
        history: this.history
      }
    });

    await modal.present().then(() => {
    });
  }
}
