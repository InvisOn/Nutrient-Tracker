import * as FileSystem from 'expo-file-system'

/**
 * Formats the arguments into an `any[]` with the first element the current 24h format time.
 * It will also tab indent strings ending with colon.
 * @param msg
 * @returns
 */
const timeFormatHelper = (...msg: any) => {
    const now = new Date()
    const hours = String(now.getHours()).padStart(2, '0')
    const minutes = String(now.getMinutes()).padStart(2, '0')
    const seconds = String(now.getSeconds()).padStart(2, '0')

    const newMsg: any[] = [`${hours}:${minutes}:${seconds}`]

    for (const m of msg) {
        if (typeof m === 'string' && m.slice(-1) === ":") {
            newMsg.push("\n\t" + m)
        } else {
            newMsg.push(m)
        }
    }

    if (newMsg.length > 1) newMsg[0] = newMsg[0] + " -"

    return newMsg
}

/**
 * Logs the message to the console with the time. Will indent strings ending with colon.
 * @param msg
 */
export const consoleLogTime = (...msg: any) => {
    console.log(...timeFormatHelper(...msg))
}

/**
 * Logs the error message to the console the time. Will indent strings ending with colon.
 * @param msg
 */
export const consoleLogTimeError = (...msg: any) => {
    console.error(...timeFormatHelper(...msg))
}

/**
 * Logs `tx.executeSql(sqlStatement, args, ...executeSqlDebug())` output and errors to the console.
 * @returns An array with logging arrow functions.
 */
export const consoleLogTimeSqlCallbacks = (type: 'transaction' | 'executeSql') => {
    if (type === 'executeSql') {
        return [
            (_: any, resultSet: any) => consoleLogTime("successCallback executeSql", "resultSet:", resultSet),
            (_: any, error: any) => {
                consoleLogTimeError("errorCallback executeSql", "error:", error)
                return true
            }
        ]
    } else if (type === 'transaction') {
        return [
            (error: any) => consoleLogTimeError("errorCallback executeSql", "error:", error),
            () => consoleLogTime("successCallback executeSql")
        ]
    }
}

/**
 * Show alert the message to the console with the time. Will indent strings ending with colon.
 * @param msg
 */
export const alertTime = (...msg: any) => {
    alert(timeFormatHelper(...msg))
}

/**
 * Checks if the given path relative to `FileSystem.documentDirectory` exists.
 * @param path Relative path to `FileSystem.documentDirectory`.
 * @param useConsoleLogTime Obviates the needs to await the promise to log to the console
 * @param useAlertTime Obviates the needs to await the promise to show an alert.
 */
export async function pathExists(path: string, useConsoleLogTime?: boolean, useAlertTime?: boolean) {
    const exists = (await FileSystem.getInfoAsync(FileSystem.documentDirectory + path)).exists

    const msg = `${path}: ${exists}.`

    if (useConsoleLogTime) consoleLogTime(msg)
    if (useAlertTime) alertTime(msg)

    return exists
}
