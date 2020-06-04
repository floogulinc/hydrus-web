import { Component, OnInit } from '@angular/core';
import { HydrusAddService } from '../hydrus-add.service';
import { Validators, FormControl, FormGroup } from '@angular/forms';
import { switchMap, debounceTime, share, throttleTime, tap, skipWhile, filter, catchError } from 'rxjs/operators';
import { Observable, of, forkJoin } from 'rxjs';
import { HydrusURLInfo, HydrusURLFiles } from '../hydrus-url';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-send',
  templateUrl: './send.component.html',
  styleUrls: ['./send.component.scss']
})
export class SendComponent implements OnInit {

  public static urlRegex: RegExp = /([-a-zA-Z0-9^\p{L}\p{C}\u00a1-\uffff@:%_\+.~#?&//=]{2,256}){1}(\.[a-z]{2,4}){1}(\:[0-9]*)?(\/[-a-zA-Z0-9\u00a1-\uffff\(\)@:%,_\+.~#?&//=]*)?([-a-zA-Z0-9\(\)@:%,_\+.~#?&//=]*)?/;

  constructor(private addService: HydrusAddService, private route: ActivatedRoute, private snackbar: MatSnackBar, private router: Router) { }

  currentUrlInfo: HydrusURLInfo;
  currentUrlFiles: HydrusURLFiles;

  sendForm = new FormGroup({
    sendUrl: new FormControl('', [
      Validators.required,
      Validators.pattern(SendComponent.urlRegex)
    ]),
    destPageName: new FormControl('url import')
  });

  get sendUrl() {
    return this.sendForm.get('sendUrl');
  }

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

    this.route.queryParams.subscribe(params => {
      if(params.url) {
        this.sendUrl.setValue(params.url);
        this.sendUrl.markAsTouched();
      }
    });
  }

  onSubmit() {
    this.addService.addUrl(this.sendForm.value.sendUrl, {destination_page_name: this.sendForm.value.destPageName}).subscribe(res => {
      this.snackbar.open(res.human_result_text, undefined, {
        duration: 5000
      });
      this.router.routeReuseStrategy.shouldReuseRoute = () => false;
      this.router.navigate(['/send']);
    }, error => {
      console.log(error);
      this.snackbar.open(`Error: ${error.message}`, undefined, {
        duration: 5000
      });
    })
  }

}
