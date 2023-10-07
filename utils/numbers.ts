/**
 * Converts a string to a number using 0 as a fallback.
 * @param value Value to convert.
 * @returns Converted value.
 */
export const toNumber = (value: any): number => {
    const num = Number(value)

    return Number.isNaN(num) ? 0 : num
}

/**
 * Round a number to the given decimal place.
 * @param n Number to round.
 * @param place Decimal place to round to.
 * @returns Rounded number.
 */
export const roundTo = (n: number, place: number) => {
    return Number(Math.round(Number(String(n) + "e+" + String(place))) + "e-" + place);
}
