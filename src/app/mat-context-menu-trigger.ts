// https://gist.github.com/Eugeny/8935314c874c9fd784c942ebcf0679f9

import { ConnectedPosition, FlexibleConnectedPositionStrategy } from '@angular/cdk/overlay'
import { Directive, HostListener, Input } from '@angular/core'
import { MatMenuPanel, MatMenuTrigger } from '@angular/material/menu'
import { fromEvent, merge } from 'rxjs'

// @Directive declaration styled same as matMenuTriggerFor
// with different selector and exportAs.
@Directive({
  selector: `[appMatContextMenuTriggerFor]`,
  host: {
    'class': 'mat-menu-trigger',
  },
  exportAs: 'appMatContextMenuTrigger',
})
export class MatContextMenuTriggerDirective extends MatMenuTrigger {
  private lastMouseEvent: MouseEvent | null = null

  // Duplicate the code for the matMenuTriggerFor binding
  // using a new property and the public menu accessors.
  @Input('appMatContextMenuTriggerFor')
  get menu_again () {
    return this.menu!
  }
  set menu_again (menu: MatMenuPanel) {
    this.menu = menu
  }

  // Override _handleMousedown, and call super._handleMousedown
  // with a new MouseEvent having button numbers 2 and 0 reversed.
  _handleMousedown (event: MouseEvent): void {
    this.lastMouseEvent = event
    super._handleMousedown(new MouseEvent(event.type, Object.assign({}, event, { button: event.button === 0 ? 2 : event.button === 2 ? 0 : event.button })))
  }

  // Override _handleClick to make existing binding to clicks do nothing.
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  _handleClick (): void { }

  // Create a place to store the host element.
  private hostElement: EventTarget | null = null

  // Listen for contextmenu events (right-clicks), then:
  //  1) Store the hostElement for use in later events.
  //  2) Prevent browser default action.
  //  3) Call super._handleClick to open the menu as expected.
  @HostListener('contextmenu', ['$event'])
  _handleContextMenu (event: MouseEvent): void {
    this.lastMouseEvent = event
    this.hostElement = event.target
    if (event.shiftKey) return // Hold a shift key to open original context menu. Delete this line if not desired behavior.
    event.preventDefault()
    super._handleClick(event)
  }

  ngAfterContentInit () {
    // Can't just override a private method due to how the lib is compiled
    this['_setPosition'] = (menu, positionStrategy: FlexibleConnectedPositionStrategy) => {
      let positions: ConnectedPosition[] = []
      super['_setPosition'](menu, {
        withPositions: (p) => {
          positions = p
        },
      })
      positionStrategy.withPositions(positions)
      if (this.lastMouseEvent) {
        positionStrategy.setOrigin({ x: this.lastMouseEvent.clientX, y: this.lastMouseEvent.clientY })
      }
      positionStrategy.withViewportMargin(10)
    }
  }

  // The complex logic below is to handle submenus and hasBackdrop===false well.
  // Listen for click and contextmenu (right-click) events on entire document.
  // If this menu is open, one of the following conditional actions.
  //   1) If the click came from the overlay backdrop, close the menu and prevent default.
  //   2) If the click came inside the overlay container, it was on a menu. If it was
  //      a contextmenu event, prevent default and re-dispatch it as a click.
  //   3) If the event did not come from our host element, close the menu.
  private contextListenerSub = merge(
    fromEvent(document, 'contextmenu'),
    fromEvent(document, 'click'),
  ).subscribe(event => {
    if (this.menuOpen) {
      if (event.target) {
        const target = event.target as HTMLElement
        if (target.classList.contains('cdk-overlay-backdrop')) {
          event.preventDefault()
          this.closeMenu()
        } else {
          if (target !== this.hostElement) { this.closeMenu() }
        }
      }
    }
  })

  // When destroyed, stop listening for the contextmenu events above,
  // null the host element reference, then call super.
  ngOnDestroy () {
    this.contextListenerSub.unsubscribe()
    this.hostElement = null
    super.ngOnDestroy()
  }
}
