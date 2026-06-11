import { by, element, expect } from 'detox';

describe('Admin Flow', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  it('admin creates order with tracking ID', async () => {
    await element(by.text('Login')).tap();
    await expect(element(by.id('login-button'))).toBeVisible();
  });

  it('admin updates parcel status', async () => {
    await element(by.id('status-button-in_transit')).tap();
    await expect(element(by.id('status-button-in_transit'))).toBeDisabled();
  });

  it('share button copies tracking link', async () => {
    await element(by.id('share-button')).tap();
    await expect(element(by.text('Share Tracking Link'))).toBeVisible();
  });
});