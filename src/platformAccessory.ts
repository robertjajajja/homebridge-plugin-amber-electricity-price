import { Service, PlatformAccessory } from 'homebridge';

import { AmberElectricityHomebridgePlatform } from './platform.js';
import { DeviceContext } from '../types/device';
import { CurrentInterval } from '../types/current-interval';

/**
 * Platform Accessory
 * An instance of this class is created for each accessory your platform registers
 * Each accessory may expose multiple services of different service types.
 */
export class AmberElectricityPricePlatformAccessory {
  private generalService: Service;
  private feedInService: Service;

  /**
   * These are just used to create a working example
   * You should implement your own code to track the state of your accessory
   */
  private states = {
    currentAmbientLightLevel: 0,
  };

  constructor(
    private readonly platform: AmberElectricityHomebridgePlatform,
    private readonly accessory: PlatformAccessory<DeviceContext>,
  ) {
    // set accessory information
    this.accessory
      .getService(this.platform.Service.AccessoryInformation)!
      .setCharacteristic(this.platform.Characteristic.Manufacturer, 'Default-Manufacturer')
      .setCharacteristic(this.platform.Characteristic.Model, 'Default-Model')
      .setCharacteristic(this.platform.Characteristic.SerialNumber, 'Default-Serial');

    this.generalService =
      this.accessory.getService('General Service') ||
      this.accessory.addService(this.platform.Service.LightSensor, 'General Service', 'general-service');
    this.feedInService =
      this.accessory.getService('FeedIn Service') ||
      this.accessory.addService(this.platform.Service.LightSensor, 'FeedIn Service', 'feed-in-service');

    // set the service name, this is what is displayed as the default name on the Home app
    this.generalService.setCharacteristic(this.platform.Characteristic.Name, `${accessory.context.device.name} General`);
    this.feedInService.setCharacteristic(this.platform.Characteristic.Name, `${accessory.context.device.name} Feed In`);

    this.pollAndUpdateCharacteristic();

    /**
     * Updating characteristics values asynchronously.
     *
     */
    setInterval(() => this.pollAndUpdateCharacteristic(), this.accessory.context.device.refreshInterval * 60_000);
  }

  private async pollAndUpdateCharacteristic() {
    try {
      const amberResponse = await fetch(
        `https://api.amber.com.au/v1/sites/${this.accessory.context.device.siteId}/prices/current?next=0&previous=0&resolution=30`,
        { headers: { accept: 'application/json', Authorization: 'Bearer ' + this.accessory.context.device.apiKey } },
      );
      const amberData: CurrentInterval[] = await amberResponse.json();

      const generalInterval = amberData.find((d) => d.channelType === 'general');
      const feedInInterval = amberData.find((d) => d.channelType === 'feedIn');

      if (!generalInterval || !feedInInterval) {
        this.platform.log.error('Could not find general or feedIn information', { generalInterval, feedInInterval });
        return;
      }

      this.generalService.updateCharacteristic(this.platform.Characteristic.CurrentAmbientLightLevel, generalInterval.perKwh);
      this.feedInService.updateCharacteristic(this.platform.Characteristic.CurrentAmbientLightLevel, feedInInterval.perKwh);

      this.platform.log.debug('Set Characteristic for General -> ', generalInterval.perKwh);
      this.platform.log.debug('Set Characteristic for Feed In -> ', feedInInterval.perKwh);
    } catch (error) {
      this.platform.log.error('Failed to poll amber price', error);
    }
  }
}
