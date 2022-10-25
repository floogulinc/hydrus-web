import { Component, ElementRef, ViewChild, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable, Subject } from 'rxjs';
import { map, share } from 'rxjs/operators';
import { MatSidenavContent } from '@angular/material/sidenav';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SwUpdate } from '@angular/service-worker';
import { environment } from 'src/environments/environment';
import { PortalOutlet, CdkPortalOutlet } from '@angular/cdk/portal';
import { MigrationService } from './migration.service';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { CUBE } from './svg-icons';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'hydrus-web';

  public refresh$: Subject<boolean> = new Subject();

  @ViewChild('toolbarActionsPortal', {read: CdkPortalOutlet}) public toolbarActionsPortal: CdkPortalOutlet;

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      share()
  );

  constructor(
    private breakpointObserver: BreakpointObserver,
    private updates: SwUpdate,
    private snackBar: MatSnackBar,
    private migrationService: MigrationService,
    iconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer
  ) {
    iconRegistry.addSvgIconLiteral('cube', sanitizer.bypassSecurityTrustHtml(CUBE));
  }

  @ViewChild(MatSidenavContent, {static: true})
  public sidenavContent: MatSidenavContent;

  public env = environment;

  ngOnInit() {
    this.migrationService.migrateLocalStorage();
    this.updates.available.subscribe(event => {
      console.log('current version is', event.current);
      console.log('available version is', event.available);
      this.snackBar.open('A new version of Hydrus Web is available', 'Refresh', {
        duration: 10000
      }).onAction().subscribe(() => {
        this.updates.activateUpdate().then(() => document.location.reload());
      });
    });
    this.updates.activated.subscribe(event => {
      console.log('old version was', event.previous);
      console.log('new version is', event.current);
    });

  }
}
