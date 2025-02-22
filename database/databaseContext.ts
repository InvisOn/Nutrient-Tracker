import { openDatabase, Database, SQLTransaction } from "expo-sqlite"
import { createContext } from 'react'

function createDatabase(): Database {
    const Database = openDatabase("nutrients.db")

    const createTable = (tx: SQLTransaction) => {
        tx.executeSql(
            `CREATE TABLE IF NOT EXISTS foods (
                id_food INTEGER PRIMARY KEY NOT NULL,
                name TEXT NOT NULL,
                protein REAL NOT NULL,
                fat REAL NOT NULL,
                carbs REAL NOT NULL,
                energy REAL NOT NULL);`
        )

        tx.executeSql(
            `CREATE TABLE IF NOT EXISTS food_consumed (
                        id_consumed INTEGER PRIMARY KEY NOT NULL,
                        id_food INTEGER NOT NULL,
                        grams_consumed REAL NOT NULL,
                        date_consumed TIMESTAMP DEFAULT (date('now','localtime')),
                        time_consumed DATE DEFAULT (time('now','localtime')),
                    FOREIGN KEY (id_food)
                        REFERENCES foods (id_food));`
        )

        tx.executeSql(
            `CREATE TABLE IF NOT EXISTS nutrients_goal (
                id_goal INTEGER PRIMARY KEY NOT NULL CHECK (id_goal = 1),
                grams_protein INTEGER NOT NULL,
                grams_fat INTEGER NOT NULL,
                grams_carbs REAL NOT NULL);`
        )

        // This is easier then having the rest of the code be able to handle an empty database.
        tx.executeSql("INSERT INTO nutrients_goal (grams_protein, grams_fat, grams_carbs) VALUES (?, ?, ?);", [0, 0, 0])
    }

    Database.transaction(createTable)

    return Database
}

export const DatabaseContext = createContext(createDatabase())
