import { PlatformConfig } from 'homebridge';
export interface Config {
    name: string;
    refreshInterval: number;
    apiKey: string;
    siteId: string;
}
export type AmberElectricityConfig = PlatformConfig & Config;
