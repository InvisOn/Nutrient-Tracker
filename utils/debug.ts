/**
 * Logs the message to console. Will indent strings ending with colon.
 * @param msg
 */
export const consoleLogClock = (isError: boolean, ...msg: any) => {
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

    if (isError) {
        console.error(`${hours}:${minutes}:${seconds}`, "\n", ...newMsg, "\n")
    } else {
        console.log(`${hours}:${minutes}:${seconds}`, "\n", ...newMsg, "\n")
    }
}
