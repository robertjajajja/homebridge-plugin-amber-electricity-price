import { Config } from './config';
export type Device = Config & {
    uniqueId: string;
};
export type DeviceContext = {
    device: Device;
};
