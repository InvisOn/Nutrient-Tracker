import consoleLogClock from "./debug"

/**
 * Converts a string to a number using 0 as a fallback.
 */
export const toNumber = (value: any): number => {
    const num = Number(value)

    return Number.isNaN(num) ? 0 : num
}

export const isReal = (value: string | number) => {
    const val = Number(value)

    return !Number.isNaN(val) && val >= 0
}