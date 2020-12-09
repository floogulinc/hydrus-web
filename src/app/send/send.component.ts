import { Component, OnInit } from '@angular/core';
import { HydrusAddService, AddUrlOptions } from '../hydrus-add.service';
import { Validators, FormControl, FormGroup } from '@angular/forms';
import { switchMap, debounceTime, catchError } from 'rxjs/operators';
import { of, forkJoin } from 'rxjs';
import { HydrusURLInfo, HydrusURLFiles } from '../hydrus-url';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SaucenaoService, SaucenaoResults } from '../saucenao.service';

@Component({
  selector: 'app-send',
  templateUrl: './send.component.html',
  styleUrls: ['./send.component.scss']
})
export class SendComponent implements OnInit {

  // tslint:disable-next-line: max-line-length
  public static urlRegex: RegExp = /([-a-zA-Z0-9^\p{L}\p{C}\u00a1-\uffff@:%_\+.~#?&//=]{2,256}){1}(\.[a-z]{2,4}){1}(\:[0-9]*)?(\/[-a-zA-Z0-9\u00a1-\uffff\(\)@:%,_\+.~#?&//=]*)?([-a-zA-Z0-9\(\)@:%,_\+.~#?&//=]*)?/;

  public saucenaoLoading = false;

  constructor(
    private addService: HydrusAddService,
    private route: ActivatedRoute,
    private snackbar: MatSnackBar,
    private router: Router,
    private saucenaoService: SaucenaoService
  ) { }

  currentUrlInfo: HydrusURLInfo;
  currentUrlFiles: HydrusURLFiles;

  sendForm = new FormGroup({
    sendUrl: new FormControl('', [
      Validators.required,
      Validators.pattern(SendComponent.urlRegex)
    ]),
    destPageName: new FormControl('')
  });

  get sendUrl() {
    return this.sendForm.get('sendUrl');
  }

  saucenaoResults: SaucenaoResults[];

  ngOnInit(): void {
    this.sendUrl.valueChanges.pipe(
      debounceTime(200),
      switchMap(val => val && this.sendUrl.valid ? forkJoin([
        this.addService.getUrlInfo(val).pipe(
          catchError(() => of(null))
        ),
        this.addService.getUrlFiles(val).pipe(
          catchError(() => of(null))
        )
      ]) : of([null, null])),
    ).subscribe((res) => {
      [this.currentUrlInfo, this.currentUrlFiles] = res;
    });

    this.route.queryParamMap.subscribe(params => {
      if (params.has('url')) {
        this.sendUrl.setValue(params.get('url'));
        this.sendUrl.markAsTouched();
      } else {
        const possibleParams = ['text', 'title'];
        const param = possibleParams.find(p => params.has(p) && SendComponent.urlRegex.test(params.get(p)));
        if (param) {
          this.sendUrl.setValue(params.get(param).match(SendComponent.urlRegex)[0]);
          this.sendUrl.markAsTouched();
        }
      }
    });
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
    this.addService.addUrl(url, options).subscribe(res => {
      this.snackbar.open(res.human_result_text, undefined, {
        duration: 5000
      });
      if (reset) {
        this.resetForm();
      }
    }, error => {
      console.log(error);
      this.snackbar.open(`Error: ${error.message}`, undefined, {
        duration: 10000
      });
    });
  }

  onSubmit() {
    this.send(this.sendForm.value.sendUrl, true);
  }

  saucenaoLookup() {
    this.saucenaoLoading = true;
    this.saucenaoResults = null;
    const lookupUrl = this.sendForm.value.sendUrl;
    this.saucenaoService.search(lookupUrl).subscribe(
      results => {
        this.saucenaoLoading = false;
        this.saucenaoResults = results;
      },
      err => {
        this.saucenaoLoading = false;
        this.snackbar.open('Error: ' + err.message, undefined, {
          duration: 5000
        });
        console.log(err);
      });
  }

}
