import { Component, Input, Output, EventEmitter, ViewChild, ElementRef, AfterContentInit, OnDestroy } from '@angular/core';
import { NavigatorModel } from './navigator.model';
import { NavItemModel } from './navitem/navitem.model';

@Component({
  selector: 'twx-navigator',
  templateUrl: './navigator.component.html',
  styleUrls: ['./navigator.component.css']
})
export class NavigatorComponent implements AfterContentInit {
  @ViewChild('navcontainer', { static: true }) navcontainer: ElementRef;
  @Output() menuSelect = new EventEmitter<NavItemModel>();
  @Output() menuPath = new EventEmitter<NavItemModel[]>();
  @Output() menuLoaded = new EventEmitter();
  @Output() menuCollapsed = new EventEmitter();
  @Output() menuExpanded = new EventEmitter();
  _isResizable: boolean;
  _menu: NavigatorModel;
  _buttonHeight: number = 50;
  _selectedMenu: string;
  menuList: NavItemModel[];
  _isMinimized: boolean;
  browsingPath: NavItemModel[] = [];
  selectedPath: NavItemModel[] = [];
  sizeCheckInterval = null;
  componentWidth: number = 0;
  xsThreshold: number = 600;

  constructor() {
  }

  ngAfterContentInit() {
    // Detect if a custom width has been defined.
    this.sizeCheckInterval = setInterval(() => {
      if (this.navcontainer.nativeElement) {
        var containerWidth = this.navcontainer.nativeElement.parentElement.offsetWidth;

        if (this.componentWidth !== containerWidth) {
          this.componentWidth = containerWidth;
          this.setSize();
          this.navcontainer.nativeElement.parentElement.style.width = "auto";
          clearInterval(this.sizeCheckInterval);
        }
      }
    }, 500);
  }

  onResize(event: any) {
    this.setSize();
  }

  setSize() {
    if (window.innerWidth < this.xsThreshold) {
      this.navcontainer.nativeElement.style.width = "auto";
    } else {
      this.navcontainer.nativeElement.style.width = this.componentWidth + "px";
    }
  }

  get isMinimized(): boolean {
    return this._isMinimized;
  }

  @Input() set isMinimized(value: boolean) {
    this._isMinimized = value;

    if (this._isMinimized) {
      this.menuCollapsed.emit();
    } else {
      this.menuExpanded.emit();
    }
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


  get menu(): NavigatorModel {
    return this._menu;
  }

  @Input() set menu(value: NavigatorModel) {
    if (value && value.items.length > 0) {
      if (this._menu && this.isIdentical(this._menu.items, value.items)) {
        this.renameCaptions(this.menuList, value.items);
      }
      else {
        this._menu = value;
        this.menuList = this._menu ? this.loadMenu(this._menu.items) : [];
        this._selectedMenu = '';
        this.browsingPath = [];
        this.menuLoaded.emit();
      }
    }
  }


  get selectedMenu(): string {
    return this._selectedMenu;
  }

  @Input() set selectedMenu(value: string) {
    if (value && this._selectedMenu !== value) {
      this._selectedMenu = value;
      var menuPath = this.findPathByLink(this._selectedMenu, this.menuList);
      this.takePath(menuPath);
    } else if (!value && this._selectedMenu !== value) {
      this._selectedMenu = value;
      this.takePath(null);
    }
  }


  onMenuSelect(pathRequest: NavItemModel[]) {
    this.takePath(pathRequest);
  }


  //onButtonHeightDetected(targetHeight: number) {
  //  if (targetHeight > 0) {
  //    this.buttonHeight = targetHeight;
  //  }
  //}


  onToggleNav() {
    this.isMinimized = !this.isMinimized;
  }


  private takePath(pathRequest: NavItemModel[]) {
    if (pathRequest && pathRequest.length > 0) {
      var itemsToCollapse: NavItemModel[] = [];
      var browsingPathIsLocked = this.pathIsLocked(this.browsingPath); //this.browsingPath.filter(item => item.isSelected == true).length > 0;
      var isDifferent: boolean = !this.browsingPath || (this.browsingPath.length === 0) || (this.browsingPath[this.browsingPath.length - 1].id !== pathRequest[pathRequest.length - 1].id);

      // User clicked on different menu item?  Uh oh... we have some work to do...
      if (isDifferent) {

        // Step 1: Detect delta 'SelectedPath' (into 'itemsToCollapse' variable), collapse and reassign it if clicked menu item is 'selectable'...
        if (pathRequest[pathRequest.length - 1].link !== '') {

          // Are we selecting deeper into the same menu path or accross a parallel menu path?
          if (itemsToCollapse.length === 0) {
            itemsToCollapse = this.selectedPath.filter(item => pathRequest.indexOf(item) < 0);
          }

          // Or are we selecting higer into the same menu path?
          if (itemsToCollapse.length === 0) {
            var possibleItemsToCollapse = pathRequest.filter(item => this.selectedPath.indexOf(item) < 0);
            if (!this.pathIsLocked(possibleItemsToCollapse)) {
              itemsToCollapse = possibleItemsToCollapse;
            }
          }

          // Collapse specified menu items...
          for (let item of itemsToCollapse) {
            item.containerHeight = 0;
            item.transform = '';
          }

          // Deselect existing node in the SelectedPath variable...
          if (this.selectedPath && this.selectedPath.length > 0) {
            this.selectedPath[this.selectedPath.length - 1].isSelected = false;
          }

          // Re-assign SelectedPath variable to RequestedPath variable
          this.selectedPath = pathRequest;
          this.selectedPath[this.selectedPath.length - 1].isSelected = true;
          this.menuSelect.emit(this.selectedPath[this.selectedPath.length - 1]);
          this.menuPath.emit(this.selectedPath);
        }

        // Step 2: Detect delta 'BrowsingPath' (into 'itemsToCollapse' variable), collapse and reassign it...
        // Are we browsing deeper into the same menu path or accross a parallel menu path?
        itemsToCollapse = [];
        if (itemsToCollapse.length === 0 && !browsingPathIsLocked) {
          itemsToCollapse = this.browsingPath.filter(item => pathRequest.indexOf(item) < 0);
        }

        // Or are we browsing higer into the same menu path?
        if (itemsToCollapse.length === 0 && !browsingPathIsLocked) {
          itemsToCollapse = pathRequest.filter(item => this.browsingPath.indexOf(item) < 0);
        }

        // Collapse specified menu items...
        for (let item of itemsToCollapse) {
          item.containerHeight = 0;
          item.transform = '';
        }

        this.browsingPath = pathRequest;
        browsingPathIsLocked = this.pathIsLocked(this.browsingPath);
      }

      this.resizeActiveBranch();
    }

    // A null value was specified. Collapse entire menu.
    else {
      // Collapse browsing menu items...
      for (let item of this.browsingPath) {
        item.containerHeight = 0;
        item.transform = '';
      }
      this.browsingPath = [];

      // Collapse selected menu items...
      for (let item of this.selectedPath) {
        item.isSelected = false;
        item.containerHeight = 0;
        item.transform = '';
      }
      this.selectedPath = [];
    }
  }


  private pathIsLocked(path: NavItemModel[]): boolean {
    var isLocked = path.filter(item => item.isSelected === true).length > 0;

    if (!isLocked && path.length > 0 && path[path.length - 1].items.length > 0) {
      isLocked = path[path.length - 1].items.filter(item => item.isSelected === true).length > 0;
    }

    return isLocked;
  }


  private resizeActiveBranch() {
    var currentHeight: number = 0;
    var needsExpanding = this.browsingPath[this.browsingPath.length - 1].items.length > 0 && this.browsingPath[this.browsingPath.length - 1].containerHeight === 0;
    var needsCollapsing = this.browsingPath[this.browsingPath.length - 1].items.length > 0 && this.browsingPath[this.browsingPath.length - 1].containerHeight > 0;

    for (var i = this.browsingPath.length - 1; i >= 0; i--) {
      var hasChildren = (this.browsingPath[i].items.length > 0);
      var isExpanded = this.browsingPath[i].containerHeight > 0;
      var isCollapsed = this.browsingPath[i].containerHeight === 0;
      var isRoot = (i === 0);
      var isTarget = (i === this.browsingPath.length - 1);
      var isLeaf = (this.browsingPath[i].items.length === 0) && (this.browsingPath[i].link !== '')
      var isLocked = this.selectedPath.length > i && this.selectedPath[i].id === this.browsingPath[i].id;


      if (hasChildren) {
        if (isCollapsed) {
          currentHeight += (this.browsingPath[i].items.length * this.buttonHeight);
          //if (isTarget) {
          //  currentHeight += (this.browsingPath[i].items.length * this.buttonHeight);
          //} else if (isRoot) {
          //  currentHeight += (this.browsingPath[i].items.length * this.buttonHeight);
          //} else {
          //  currentHeight += (this.browsingPath[i].items.length * this.buttonHeight);
          //}
        }

        else if (isExpanded) {
          currentHeight = isLocked || (isRoot && !isTarget) ? this.calculateContainerHeight(this.browsingPath[i].items) : 0;
          //if (isTarget) {
          //  currentHeight = isLocked ? this.calculateContainerHeight(this.browsingPath[i].items) : 0;
          //} else if (isRoot) {
          //  currentHeight = this.calculateContainerHeight(this.browsingPath[i].items);
          //} else {
          //  currentHeight += this.calculateContainerHeight(this.browsingPath[i].items);
          //}
        }

        this.browsingPath[i].containerHeight = currentHeight;
        this.browsingPath[i].transform = currentHeight > 0 ? 'rotate(180deg)' : '';
      }

    }
  }


  private calculateContainerHeight(items: NavItemModel[]): number {
    var result = 0;

    for (let item of items) {
      result += this.buttonHeight + item.containerHeight;
    }
    return result;
  }


  private findPathByLink(searchTerm: string, searchPath: NavItemModel[]): NavItemModel[] {
    var result: NavItemModel[] = [];

    if (searchPath) {
      for (let menuItem of searchPath) {
        if (menuItem.link.toUpperCase().indexOf(searchTerm.toUpperCase()) >= 0) {
          result.push(menuItem);
          break;
        } else {
          var subItemResults = this.findPathByLink(searchTerm, menuItem.items);
          if (subItemResults.length > 0) {
            result = result.concat(subItemResults);
            result.unshift(menuItem);
            break;
          }
        }
      }
    }

    return result;
  }


  private loadMenu(source: NavItemModel[]): NavItemModel[] {
    var result: NavItemModel[] = [];

    if (source) {
      for (let sourceItem of source) {
        var destinationItem = new NavItemModel();
        destinationItem.id = sourceItem.id;
        destinationItem.caption = sourceItem.caption;
        destinationItem.link = sourceItem.link;
        destinationItem.notification = sourceItem.notification;
        destinationItem.icon = sourceItem.icon;
        destinationItem.image = sourceItem.image;
        destinationItem.isSelected = (this.selectedMenu === sourceItem.link && sourceItem.link !== "");
        destinationItem.containerHeight = 0;
        destinationItem.transform = '';
        destinationItem.items = this.loadMenu(sourceItem.items);
        result.push(destinationItem);
      }
    }

    return result;
  }


  private renameCaptions(targetItems: NavItemModel[], sourceItems: NavItemModel[]) {
    for (let i in targetItems) {
      if (targetItems.length === sourceItems.length) {
        targetItems[i].caption = sourceItems[i].caption;
        this.renameCaptions(targetItems[i].items, sourceItems[i].items);
      }
    }
  }


  private isIdentical(sourceItems: NavItemModel[], comparisonItems: NavItemModel[]): boolean {
    var result = sourceItems.length === comparisonItems.length;

    if (result) {
      for (let i in sourceItems) {
        result = (sourceItems[i].id === comparisonItems[i].id) && (sourceItems[i].link === comparisonItems[i].link);

        if (result) {
          result = this.isIdentical(sourceItems[i].items, comparisonItems[i].items);
        }

        if (result === false) {
          break;
        }
      }
    }

    return result;
  };

  showCollapse(): boolean {
    return this.isResizable && window.innerWidth >= this.xsThreshold;
  }


}
