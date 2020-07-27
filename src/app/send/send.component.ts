import { Component, OnInit } from '@angular/core';
import { HydrusAddService, AddUrlOptions } from '../hydrus-add.service';
import { Validators, FormControl, FormGroup, AbstractControl } from '@angular/forms';
import { switchMap, debounceTime, share, throttleTime, tap, skipWhile, filter, catchError } from 'rxjs/operators';
import { Observable, of, forkJoin } from 'rxjs';
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
          catchError(e => of(null))
        ),
        this.addService.getUrlFiles(val).pipe(
          catchError(e => of(null))
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

  onSubmit() {
    const options: AddUrlOptions = {};
    if (this.sendForm.value.destPageName !== '') {
      options.destination_page_name = this.sendForm.value.destPageName;
    }
    this.addService.addUrl(this.sendForm.value.sendUrl, options).subscribe(res => {
      this.snackbar.open(res.human_result_text, undefined, {
        duration: 5000
      });
      this.sendUrl.reset();
      this.sendUrl.setErrors(null);
      this.router.navigate(['/send']);
    }, error => {
      console.log(error);
      this.snackbar.open(`Error: ${error.error}`, undefined, {
        duration: 10000
      });
    });
  }

  saucenaoLookup() {
    const lookupUrl = this.sendForm.value.sendUrl;
    this.saucenaoService.search(lookupUrl).subscribe(
      results => this.saucenaoResults = results,
      err => this.snackbar.open(err, undefined, {
        duration: 5000
      }));
  }

}
