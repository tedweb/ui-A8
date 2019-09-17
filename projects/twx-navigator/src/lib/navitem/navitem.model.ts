export class NavItemModel {
  id: string;
  caption: string;
  link: string;
  notification: string;
  icon: string;
  image: string;
  isSelected: boolean;
  containerHeight: number;
  items: NavItemModel[];
  transform: string;

  constructor() {
    this.caption = '';
    this.link = '';
    this.notification = '';
    this.icon = '';
    //this.image = '';
    this.isSelected = false;
    this.containerHeight = 0;
    this.items = [];
    this.transform = '';
  }
}
