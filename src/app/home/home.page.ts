import { Component } from '@angular/core';
import { Insomnia } from '@ionic-native/insomnia/ngx';
import {Platform} from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  percent = 0;
  radius = 100;
  fullTime = '00:02:00';
  timer: any = false;
  progress = 0;
  sets = 0;
  minutes: any = 1;
  seconds: any = 30;
  subscription: any;

  elapsed: any = {
    h: '00',
    m: '00',
    s: '00',
  };

  overallTimer: any = false;

  constructor(public platform: Platform, private insomnia: Insomnia) {}

  ionViewDidEnter() {
    this.subscription = this.platform.backButton.subscribeWithPriority(0, () => {
      if (this.constructor.name === 'HomePage') {
        if (window.confirm('Are you sure you want to quit?')) {
          (navigator as any).app.exitApp();
        }
      }
    });
  }

  ionViewWillLeave() {
    this.subscription.unsubscribe();
  }

  titleFormat() {
    const timeSplit = this.fullTime.split(':');
    this.minutes = timeSplit[1];
    this.seconds = timeSplit[2];

    const progress = this.progress;
    const totalSeconds = Math.floor(this.minutes * 60) + parseInt(this.seconds, 10);
    const remaining = totalSeconds - progress < 0 ? 0 : totalSeconds - progress;
    return remaining + 's';
  }

  startTimer() {
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

    const timeSplit = this.fullTime.split(':');
    this.minutes = timeSplit[1];
    this.seconds = timeSplit[2];

    const totalSeconds = Math.floor(this.minutes * 60) + parseInt(this.seconds, 10);

    this.timer = setInterval(() => {

      if (this.percent >= this.radius) {
        clearInterval(this.timer);
      }
      this.progress++;
      this.percent = (this.progress / totalSeconds) * 100;
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
    while (s.length < size) { s = '0' + s; }
    return s;
  }

  resetSets() {
    this.sets = 0;
  }

  stopTime() {
    if (window.confirm('Are you sure you want to reset training?')) {
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
      this.insomnia.allowSleepAgain();
    }
  }
}
