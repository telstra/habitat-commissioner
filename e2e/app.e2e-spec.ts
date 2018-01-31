import { HabitatCommisionerV2Page } from './app.po';

describe('habitat-commisioner-v2 App', () => {
  let page: HabitatCommisionerV2Page;

  beforeEach(() => {
    page = new HabitatCommisionerV2Page();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!');
  });
});
