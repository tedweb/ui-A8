import { NavItemModel } from './navitem/navitem.model';

export class NavigatorModel {
  autoShrinkMenusItems: boolean;
  lockSelectMenuItems: boolean;
  isResizable: boolean;
  isMinimized: boolean;
  items: NavItemModel[];

  constructor() {
    this.autoShrinkMenusItems = true;
    this.lockSelectMenuItems = true;
    this.isResizable = true;
    this.isMinimized = true;
    this.items = [];
  }
}
