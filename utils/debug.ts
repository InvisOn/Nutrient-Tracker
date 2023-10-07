const consoleLogHelper = (...msg: any) => {
    const newMsg: any = []

    for (const m of msg) {
        if (typeof m === 'string' && m.slice(-1) === ":") {
            newMsg.push("\n\t" + m)
        } else {
            newMsg.push(m)
            continue
        }
    }

    const now = new Date()
    const hours = String(now.getHours()).padStart(2, '0')
    const minutes = String(now.getMinutes()).padStart(2, '0')
    const seconds = String(now.getSeconds()).padStart(2, '0')

    return [`${hours}:${minutes}:${seconds}\n`, ...newMsg]
}

/**
 * Logs the message to the console. Will indent strings ending with colon.
 * @param msg
 */
export const consoleLogTime = (...msg: any) => {
    console.log(...consoleLogHelper(...msg))
}

/**
 * Logs the error message to the console. Will indent strings ending with colon.
 * @param msg
 */
export const consoleLogTimeError = (...msg: any) => {
    console.error(...consoleLogHelper(...msg))

}

/**
 * Logs `tx.executeSql(sqlStatement, args, ...executeSqlDebug())` output and errors to the console.
 * @returns An array with logging arrow functions.
 */
export const consoleLogTimeSqlCallbacks = () => {
    return [
        (_: any, resultSet: any) => consoleLogTime("successCallback executeSql", "resultSet:", resultSet),
        (_: any, error: any) => {
            consoleLogTimeError("errorCallback executeSql", "error:", error)
            return true
        }
    ]
}
