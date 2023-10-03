import { SQLResultSetRowList } from "expo-sqlite"

export const convertSqlRows = (rows: SQLResultSetRowList): string[][] => {
    let rowArray: string[][] = []

    for (let i = 0; i < rows._array.length; i++) {
        rowArray.push(Object.values(rows._array[i]))
    }

    return rowArray
}
