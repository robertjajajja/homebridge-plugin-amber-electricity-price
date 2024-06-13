/**
 * Returns the current interval's forecasted price comprised of the weighted average of 5-minute actual prices
 * and 5-minute forecast prices. In the last 5-minutes of the interval, the price represents the final price
 * for that interval.
 */
export interface CurrentInterval {
    type: 'CurrentInterval';
    /**
     * Date the interval belongs to (in NEM time). This may be different to the date component of nemTime,
     * as the last interval of the day ends at 12:00 the following day. Formatted as a ISO 8601 date
     *
     * @example '2021-05-05'
     */
    date: string;
    /**
     * Length of the interval in minutes.
     */
    duration: 5 | 15 | 30;
    /**
     * Start time of the interval in UTC. Formatted as a ISO 8601 time
     *
     * @example 2021-05-05T02:00:01Z
     */
    startTime: string;
    /**
     * End time of the interval in UTC. Formatted as a ISO 8601 time
     *
     * @example '2021-05-05T02:30:00Z'
     */
    endTime: string;
    /**
     * The interval's NEM time. This represents the time at the end of the interval UTC+10. Formatted as a ISO 8601 time
     *
     * @example '2021-05-06T12:30:00+10:00'
     */
    nemTime: string;
    /**
     * Number of cents you will pay per kilowatt-hour (c/kWh) - includes GST
     *
     * @example 24.33
     */
    perKwh: number;
    /**
     * Percentage of renewables in the grid 0 - 100
     *
     * @example 45
     */
    renewables: number;
    /**
     * NEM spot price (c/kWh). This is the price generators get paid to generate electricity,
     * and what drives the variable component of your perKwh price - includes GST
     *
     * @example 6.12
     */
    spotPerKwh: number;
    /**
     * Meter channel type
     *
     * @example 'general'
     */
    channelType: 'general' | 'controlledLoad' | 'feedIn';
    /**
     * Indicates whether this interval will potentially spike, or is currently in a spike state
     */
    spikeStatus: 'none' | 'potential' | 'spike';
    /**
     * Unknown field
     */
    tariffInformation?: {
        /**
         * Unknown field
         */
        demandWindow: boolean;
    } | null | undefined;
    /**
     * Describes the current price.
     * Gives you an indication of how cheap the price is in relation to the average VMO and DMO. Note: Negative is no longer used.
     * It has been replaced with extremelyLow.
     */
    descriptor: 'negative' | 'extremelyLow' | 'veryLow' | 'low' | 'neutral' | 'high' | 'spike';
    /**
     * When prices are particularly volatile, the API may return a range of NEM spot prices (c/kWh) that are possible.
     */
    range?: {
        /**
         * Estimated minimum price (c/kWh)
         */
        min: number;
        /**
         * Estimated minimum price (c/kWh)
         */
        max: number;
    } | null | undefined;
    /**
     * Shows true the current price is an estimate. Shows false is the price has been locked in.
     */
    estimate: boolean;
}
