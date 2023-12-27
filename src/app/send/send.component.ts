import { Component, OnDestroy, OnInit } from '@angular/core';
import { HydrusUrlService, AddUrlOptions } from '../hydrus-url.service';
import { Validators, UntypedFormControl, UntypedFormGroup, FormControl, FormGroup } from '@angular/forms';
import { switchMap, debounceTime, catchError, shareReplay, tap, startWith, map } from 'rxjs/operators';
import { of, forkJoin, combineLatest } from 'rxjs';
import { HydrusURLInfo, HydrusURLFiles } from '../hydrus-url';
import { ActivatedRoute, Router } from '@angular/router';
import { MatLegacySnackBar as MatSnackBar } from '@angular/material/legacy-snack-bar';
import { SaucenaoService, SaucenaoResults } from '../saucenao.service';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { SaucenaoDialogComponent } from '../saucenao-dialog/saucenao-dialog.component';
import { HydrusApiService } from '../hydrus-api.service';
import { HydrusFilesService } from '../hydrus-files.service';
import { SettingsService } from '../settings.service';
import { ErrorService } from '../error.service';

// eslint-disable-next-line max-len
const urlRegex: RegExp = /([-a-zA-Z0-9^\p{L}\p{C}\u00a1-\uffff@:%_\+.~#?&//=]{2,256}){1}(\.[a-z]{2,4}){1}(\:[0-9]*)?(\/[-a-zA-Z0-9\u00a1-\uffff\(\)@:%,_\+.~#?&//=]*)?([-a-zA-Z0-9\(\)@:%,_\+.~#?&//=]*)?/;

@Component({
  selector: 'app-send',
  templateUrl: './send.component.html',
  styleUrls: ['./send.component.scss']
})
export class SendComponent implements OnInit, OnDestroy {

  public saucenaoLoading = false;

  constructor(
    private urlService: HydrusUrlService,
    private route: ActivatedRoute,
    private snackbar: MatSnackBar,
    private router: Router,
    public dialog: MatDialog,
    public saucenaoService: SaucenaoService,
    public apiService: HydrusApiService,
    public fileService: HydrusFilesService,
    public settings: SettingsService,
    private errorService: ErrorService
  ) { }

  sendForm = new FormGroup({
    sendUrl: new FormControl('', [
      Validators.required,
      Validators.pattern(urlRegex)
    ]),
    destPageName: new FormControl(this.settings.appSettings.sendDefaultPage)
  });

  get sendUrl() {
    return this.sendForm.get('sendUrl');
  }

  saucenaoResults: SaucenaoResults[];

  urlFormInfo = combineLatest([this.sendUrl.valueChanges, this.sendUrl.statusChanges]).pipe(
    map(([value, status]) => ({value, status})),
    shareReplay(1)
  )

  currentUrlInfo$ = this.urlFormInfo.pipe(
    debounceTime(200),
    switchMap(({value, status}) => value && status === 'VALID' ? this.urlService.getUrlInfo(value).pipe(
      catchError(() => of(null))
    ): of(null)),
    shareReplay(1)
  );

  currentUrlFiles$ = this.urlFormInfo.pipe(
    debounceTime(200),
    switchMap(({value, status}) => value && status === 'VALID' ? this.urlService.getUrlFiles(value).pipe(
      catchError(() => of(null))
    ): of(null)),
    shareReplay(1)
  );

  currentUrlBasicFileInfo$ = this.currentUrlFiles$.pipe(
    map(v => v ? v.url_file_statuses.filter(f => f.status === 2).map(f => f.hash) : []),
    switchMap(hashes => hashes.length > 0 ? this.fileService.getBasicFilesByHash(hashes) : of(null))
  )

  urlFormInfoSub = this.urlFormInfo.subscribe();

  ngOnDestroy() {
    this.urlFormInfoSub.unsubscribe();
  }

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(params => {
      if (params.has('url')) {
        this.setUrlValueFromQuery(params.get('url'));
      } else {
        const possibleParams = ['text', 'title'];
        const param = possibleParams.find(p => params.has(p) && urlRegex.test(params.get(p)));
        if (param) {
          this.setUrlValueFromQuery(params.get(param).match(urlRegex)[0]);
        }
      }
    });
  }

  setUrlValueFromQuery(url: string) {
    if(this.settings.appSettings.sendFixDiscordUrls) {
      url = url.replace('https://media.discordapp.net', 'https://cdn.discordapp.com');
    }
    this.sendUrl.setValue(url);
    this.sendUrl.markAsTouched();
  }

  resetForm() {
    this.sendUrl.reset();
    this.saucenaoResults = null;
    this.router.navigate(['/send'], { replaceUrl: true });
  }

  send(url: string, reset?: boolean) {
    const options: AddUrlOptions = {};
    if (this.sendForm.value.destPageName !== '') {
      options.destination_page_name = this.sendForm.value.destPageName;
    }
    this.urlService.addUrl(url, options).subscribe(res => {
      this.snackbar.open(res.human_result_text, undefined, {
        duration: 5000
      });
      if (reset) {
        this.resetForm();
      }
    }, error => {
      this.errorService.handleHydrusError(error);
    });
  }

  onSubmit() {
    this.send(this.sendForm.value.sendUrl, this.settings.appSettings.sendResetFormAfterSend);
  }

  saucenaoLookup() {
    this.saucenaoLoading = true;
    this.saucenaoResults = null;
    const lookupUrl = this.sendForm.value.sendUrl;
    this.saucenaoService.search({url: lookupUrl}).subscribe(
      results => {
        this.saucenaoLoading = false;
        this.saucenaoResults = results;
      },
      err => {
        this.saucenaoLoading = false;
        this.errorService.handleHttpError(err);
      });
    /* const addUrlOptions: AddUrlOptions = {};
    if (this.sendForm.value.destPageName !== '') {
      addUrlOptions.destination_page_name = this.sendForm.value.destPageName;
    }
    SaucenaoDialogComponent.open(this.dialog, {
      urlOrFile: {
        url: this.sendForm.value.sendUrl
      },
      addUrlOptions
    }) */
  }

}
