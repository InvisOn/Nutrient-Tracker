/**
 * Converts a string to a number using 0 as a fallback.
 */
export const toNumber = (value: any): number => {
    const num = Number(value)

    return Number.isNaN(num) ? 0 : num
}

export const isReal = (value: any) => {
    return Number(value) >= 0
}
