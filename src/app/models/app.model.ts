import { NavigatorModel } from "projects/twx-navigator/src/lib/navigator.model";

export class AppModel {
  id: string;
  name: string;
  path: string;
  description: string;
  color_logo: string;
  white_logo: string;
  version: string;
  page: string;
  menu: NavigatorModel;

  constructor() {
    this.id = "";
    this.name = "";
    this.path = "";
    this.description = "";
    this.color_logo = "";
    this.white_logo = "";
    this.version = "";
    this.page = "";
    this.menu = new NavigatorModel();
  }
}
