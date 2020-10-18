import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { KeyService } from './keys/key.service';
import { FormsModule } from '@angular/forms';
import { BlockService } from './block-service/block.service';
import { DownloadService } from './download-service/download.service';
import { ForgeComponent } from './forge/forge.component';
import { SimpleBuilderComponent } from './simple-builder/simple-builder.component';
import { LiveBuilderComponent } from './live-builder/live-builder.component';
import { TheEyeComponent } from './the-eye/the-eye.component';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    ForgeComponent,
    SimpleBuilderComponent,
    LiveBuilderComponent,
    TheEyeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [
    KeyService,
    BlockService,
    DownloadService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
