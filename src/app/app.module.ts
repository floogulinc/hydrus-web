import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { HttpClientModule } from '@angular/common/http';

import { FlexLayoutModule } from '@angular/flex-layout';

import { FormsModule } from '@angular/forms';

import { BrowseComponent } from './browse/browse.component';
import { SettingsComponent } from './settings/settings.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import {MatButtonModule} from '@angular/material/button';
import { LayoutModule } from '@angular/cdk/layout';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatChipsModule} from '@angular/material/chips';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { TagInputComponent } from './tag-input/tag-input.component';
import {MatCardModule} from '@angular/material/card';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatTabsModule} from '@angular/material/tabs';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatBadgeModule} from '@angular/material/badge';
import {MatMenuModule} from '@angular/material/menu';

import {PortalModule} from '@angular/cdk/portal';

import { ReactiveFormsModule } from '@angular/forms';

import { VirtualScrollerModule } from 'ngx-virtual-scroller';
import { AboutComponent } from './about/about.component';
import { PhotoswipeComponent } from './photoswipe/photoswipe.component';
import { ImageListComponent } from './image-list/image-list.component';
import { PagesComponent } from './pages/pages.component';
import { FilesPageComponent } from './files-page/files-page.component';
import { SendComponent } from './send/send.component';
import { FileInfoSheetComponent } from './file-info-sheet/file-info-sheet.component';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import {MatDialogModule} from '@angular/material/dialog';
import {MatExpansionModule} from '@angular/material/expansion';
import { NgPipesModule } from 'ngx-pipes';
import { ComicsListComponent } from './comics-list/comics-list.component';
import { ComicComponent } from './comic/comic.component';
import { ImageListLoaderComponent } from './image-list-loader/image-list-loader.component';
import { ToolbarActionsComponent } from './toolbar-actions/toolbar-actions.component';
import { AkitaNgDevtools } from '@datorama/akita-ngdevtools';
import { AkitaNgRouterStoreModule } from '@datorama/akita-ng-router-store';


const MAT_MODULES = [
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
    MatChipsModule,
    MatAutocompleteModule,
    MatCardModule,
    MatGridListModule,
    MatProgressSpinnerModule,
    MatTabsModule,
    MatBottomSheetModule,
    MatDialogModule,
    MatExpansionModule,
    MatProgressBarModule,
    MatBadgeModule,
    MatMenuModule
];


@NgModule({
  declarations: [
    AppComponent,
    BrowseComponent,
    SettingsComponent,
    TagInputComponent,
    AboutComponent,
    PhotoswipeComponent,
    ImageListComponent,
    PagesComponent,
    FilesPageComponent,
    SendComponent,
    FileInfoSheetComponent,
    ComicsListComponent,
    ComicComponent,
    ImageListLoaderComponent,
    ToolbarActionsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    HttpClientModule,
    FlexLayoutModule,
    FormsModule,
    PortalModule,
    MAT_MODULES,
    BrowserAnimationsModule,
    LayoutModule,
    ReactiveFormsModule,
    VirtualScrollerModule,
    NgPipesModule,
    environment.production ? [] : AkitaNgDevtools.forRoot(),
    AkitaNgRouterStoreModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [PhotoswipeComponent, FileInfoSheetComponent],
})
export class AppModule { }
