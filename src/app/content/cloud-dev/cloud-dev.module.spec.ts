import { CloudDevModule } from './cloud-dev.module';

describe('CloudDevModule', () => {
  let cloudDevModule: CloudDevModule;

  beforeEach(() => {
    cloudDevModule = new CloudDevModule();
  });

  it('should create an instance', () => {
    expect(cloudDevModule).toBeTruthy();
  });
});
