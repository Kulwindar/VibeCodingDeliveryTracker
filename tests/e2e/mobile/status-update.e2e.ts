import { by, element, expect } from 'detox';

describe('Status Update Flow', () => {
  it('status buttons disabled for passed states', async () => {
    await device.reloadReactNative();
    await expect(element(by.id('status-button-picked_up'))).toBeDisabled();
  });

  it('status transitions work forward only', async () => {
    await element(by.id('status-button-in_transit')).tap();
    await expect(element(by.id('status-button-in_transit'))).toBeDisabled();
    await expect(element(by.id('status-button-delivered'))).toBeEnabled();
  });
});