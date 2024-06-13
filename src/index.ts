import { API } from 'homebridge';

import { PLATFORM_NAME } from './settings.js';
import { AmberElectricityHomebridgePlatform } from './platform.js';
import { PlatformPluginConstructor } from 'homebridge/lib/api';

/**
 * This method registers the platform with Homebridge
 */
export default (api: API) => {
  api.registerPlatform(PLATFORM_NAME, AmberElectricityHomebridgePlatform as unknown as PlatformPluginConstructor);
};
