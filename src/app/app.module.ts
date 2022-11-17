import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { HttpClientModule } from '@angular/common/http';

import {NgxLocalStorageModule} from 'ngx-localstorage';

import { FormsModule } from '@angular/forms';

import { BrowseComponent } from './browse/browse.component';
import { SettingsComponent } from './settings/settings.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import {MatLegacyButtonModule as MatButtonModule} from '@angular/material/legacy-button';
import { LayoutModule } from '@angular/cdk/layout';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyListModule as MatListModule } from '@angular/material/legacy-list';
import {MatLegacyFormFieldModule as MatFormFieldModule} from '@angular/material/legacy-form-field';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import {MatLegacySnackBarModule as MatSnackBarModule} from '@angular/material/legacy-snack-bar';
import {MatLegacyChipsModule as MatChipsModule} from '@angular/material/legacy-chips';
import {MatLegacyAutocompleteModule as MatAutocompleteModule} from '@angular/material/legacy-autocomplete';
import { TagInputComponent } from './tag-input/tag-input.component';
import {MatLegacyCardModule as MatCardModule} from '@angular/material/legacy-card';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatLegacyProgressSpinnerModule as MatProgressSpinnerModule} from '@angular/material/legacy-progress-spinner';
import {MatLegacyTabsModule as MatTabsModule} from '@angular/material/legacy-tabs';
import {MatLegacyProgressBarModule as MatProgressBarModule} from '@angular/material/legacy-progress-bar';
import {MatBadgeModule} from '@angular/material/badge';
import {MatLegacyMenuModule as MatMenuModule} from '@angular/material/legacy-menu';
import {MatLegacySlideToggleModule as MatSlideToggleModule} from '@angular/material/legacy-slide-toggle';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatLegacySelectModule as MatSelectModule} from '@angular/material/legacy-select';
import {MatLegacyTooltipModule as MatTooltipModule} from '@angular/material/legacy-tooltip';
import {MatLegacyTableModule as MatTableModule} from '@angular/material/legacy-table';

import {PortalModule} from '@angular/cdk/portal';
import {ScrollingModule} from '@angular/cdk/scrolling';
import {ClipboardModule} from '@angular/cdk/clipboard';

import { ReactiveFormsModule } from '@angular/forms';

import { LetModule } from '@rx-angular/template/let';
import { PushModule } from '@rx-angular/template/push';

import { VirtualScrollerModule } from '@floogulinc/ngx-virtual-scroller';
import { AboutComponent } from './about/about.component';
import { ImageListComponent } from './image-list/image-list.component';
import { PagesComponent } from './pages/pages.component';
import { FilesPageComponent } from './files-page/files-page.component';
import { SendComponent } from './send/send.component';
import { FileInfoSheetComponent } from './file-info-sheet/file-info-sheet.component';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import {MatLegacyDialogModule as MatDialogModule} from '@angular/material/legacy-dialog';
import {MatExpansionModule} from '@angular/material/expansion';
import { NgPipesModule } from 'ngx-pipes';
import { ImageListLoaderComponent } from './image-list-loader/image-list-loader.component';
import { ToolbarActionsComponent } from './toolbar-actions/toolbar-actions.component';
import { JoinPipe } from './utils/join.pipe';
import { TagInputDialogComponent } from './tag-input-dialog/tag-input-dialog.component';
import { TagNamespaceClassPipe } from './utils/tag-utils';
import { SystemPredicateDialogComponent } from './system-predicate-dialog/system-predicate-dialog.component';
import { MatNativeDateModule } from '@angular/material/core';
import { SaucenaoDialogComponent } from './saucenao-dialog/saucenao-dialog.component';
import { MrBonesDialogComponent } from './mr-bones-dialog/mr-bones-dialog.component';
import { ByteSizePipe } from './byte-size.pipe';


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
    MatMenuModule,
    MatSlideToggleModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatButtonToggleModule,
    MatSelectModule,
    MatTooltipModule,
    MatTableModule
];


@NgModule({
    declarations: [
        AppComponent,
        BrowseComponent,
        SettingsComponent,
        TagInputComponent,
        AboutComponent,
        ImageListComponent,
        PagesComponent,
        FilesPageComponent,
        SendComponent,
        FileInfoSheetComponent,
        ImageListLoaderComponent,
        ToolbarActionsComponent,
        JoinPipe,
        TagInputDialogComponent,
        TagNamespaceClassPipe,
        SystemPredicateDialogComponent,
        SaucenaoDialogComponent,
        MrBonesDialogComponent,
        ByteSizePipe
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
        HttpClientModule,
        FormsModule,
        PortalModule,
        ScrollingModule,
        MAT_MODULES,
        NgxLocalStorageModule.forRoot({ prefix: environment.localStoragePrefix }),
        BrowserAnimationsModule,
        LayoutModule,
        ReactiveFormsModule,
        VirtualScrollerModule,
        NgPipesModule,
        ClipboardModule,
        LetModule,
        PushModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
