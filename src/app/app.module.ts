import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {RouteReuseStrategy} from '@angular/router';

import {IonicModule, IonicRouteStrategy} from '@ionic/angular';
import {SplashScreen} from '@ionic-native/splash-screen/ngx';

import {AppComponent} from './app.component';
import {AppRoutingModule} from './app-routing.module';
import {Insomnia} from '@ionic-native/insomnia/ngx';
import {NativeAudio} from '@ionic-native/native-audio/ngx';
import {SettingsComponent} from './settings/settings.component';
import {FormsModule} from '@angular/forms';
import {ScreenOrientation} from '@ionic-native/screen-orientation/ngx';
import { IonicStorageModule } from '@ionic/storage';
import {HistoryComponent} from './history/history.component';

@NgModule({
  declarations: [
    AppComponent,
    SettingsComponent,
    HistoryComponent
  ],
  entryComponents: [SettingsComponent, HistoryComponent],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    FormsModule,
    IonicStorageModule.forRoot()],
  providers: [
    SplashScreen,
    NativeAudio,
    ScreenOrientation,
    {provide: RouteReuseStrategy, useClass: IonicRouteStrategy},
    Insomnia
  ],
  exports: [
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
