import { NavigatorModule } from './navigator.module';

describe('NavigatorModule', () => {
  let navigatorModule: NavigatorModule;

  beforeEach(() => {
    navigatorModule = new NavigatorModule();
  });

  it('should create an instance', () => {
    expect(navigatorModule).toBeTruthy();
  });
});
