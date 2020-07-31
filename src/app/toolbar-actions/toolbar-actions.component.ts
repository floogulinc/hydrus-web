import { Component, OnInit, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';
import { CdkPortal, TemplatePortal } from '@angular/cdk/portal';
import { AppComponent } from '../app.component';

@Component({
  selector: 'app-toolbar-actions',
  templateUrl: './toolbar-actions.component.html',
  styleUrls: ['./toolbar-actions.component.scss']
})
export class ToolbarActionsComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild(CdkPortal) portal: CdkPortal;

  constructor(private appComponent: AppComponent) { }

  ngOnInit(): void {
    this.appComponent.toolbarActionsPortal.detach();
  }

  ngAfterViewInit(): void {
    this.appComponent.toolbarActionsPortal.attach(this.portal);
  }

  ngOnDestroy(): void {
    this.appComponent.toolbarActionsPortal.detach();
  }

}
