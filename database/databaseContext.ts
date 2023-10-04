import { openDatabase, Database, SQLTransaction } from "expo-sqlite"
import { createContext } from 'react'

const createDatabase = (): Database => {
    const database = openDatabase("food.db")

    const createTable = (tx: SQLTransaction) => {
        tx.executeSql("DROP TABLE IF EXISTS foods;"); // !! temporary, to prevent the db from ballooning in size when debugging.
        tx.executeSql(
            "CREATE TABLE IF NOT EXISTS foods (id INTEGER PRIMARY KEY NOT NULL, name TEXT, protein REAL, fat REAL, carbs REAL, energy REAL);"
        )

        // !! temporary, to fill the table for debugging purposes.
        for (let i = 1; i <= 20; i++) {
            tx.executeSql("INSERT INTO foods (name, protein, fat, carbs, energy) VALUES (?, ?, ?, ?, ?)", [
                `Food ${i}`,
                i,
                i,
                i,
                i
            ])
        }
    }

    database.transaction(createTable)

    return database
}

export const DatabaseContext = createContext(createDatabase())
