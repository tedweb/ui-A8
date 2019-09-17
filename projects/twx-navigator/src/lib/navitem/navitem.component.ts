import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NavItemModel } from './navitem.model';

@Component({
  selector: 'twx-navitem',
  templateUrl: './navitem.component.html',
  styleUrls: ['../navigator.component.css']
})
export class NavItemComponent {
  _isResizable: boolean;
  _isMinimized: boolean;
  _buttonHeight: number;
  @Input() menuList: NavItemModel[];
  @Input() isNested: boolean;
  @Input() chevron_transform: string = '';
  @Output() menuSelect = new EventEmitter<NavItemModel[]>();

  constructor() { }


  get isMinimized(): boolean {
    return this._isMinimized;
  }

  @Input() set isMinimized(value: boolean) {
    this._isMinimized = value;
  }


  get isResizable(): boolean {
    return this._isResizable;
  }

  @Input() set isResizable(value: boolean) {
    this._isResizable = value;
  }


  get buttonHeight(): number {
    return this._buttonHeight;
  }

  @Input() set buttonHeight(value: number) {
    this._buttonHeight = value;
  }


  onClick(menu: NavItemModel) {
    this.menuSelect.emit([menu]);
  }

  onMenuSelect(pathStack: NavItemModel[]) {
    var pathFound: boolean = false;

    for (let menuItem of this.menuList) {
      for (let subItem of menuItem.items) {
        var targetId: string = pathStack[0].id;
        if (subItem.id === targetId) {
          pathStack.unshift(menuItem);
          pathFound = true;
          break;
        }
      }

      if (pathFound) {
        break;
      }
    }

    this.menuSelect.emit(pathStack);
  }

}
