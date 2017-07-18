import { RockChainUiPage } from './app.po';

describe('rock-chain-ui App', () => {
  let page: RockChainUiPage;

  beforeEach(() => {
    page = new RockChainUiPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!');
  });
});
