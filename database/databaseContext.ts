import { openDatabase, Database, SQLTransaction } from "expo-sqlite"
import { createContext } from 'react'

const createDatabase = (): Database => {
    const database = openDatabase("food.db")

    const createTable = (tx: SQLTransaction) => {
        // !! temporary, to prevent the db from ballooning in size when debugging.
        tx.executeSql("--sql DROP TABLE foods;");
        tx.executeSql("--sql DROP TABLE food_consumed;");

        tx.executeSql(
            // todo I want to change to field names to be more descriptive (fat -> fat_per_hectogram)
            // Currently it is a hassle to change it everywhere in the code base.
            // Perhaps an ORM can help?
            `CREATE TABLE IF NOT EXISTS foods (
                id_food INTEGER PRIMARY KEY NOT NULL,
                name TEXT NOT NULL,
                protein REAL NOT NULL,
                fat REAL NOT NULL,
                carbs REAL NOT NULL,
                energy REAL NOT NULL);`)

        tx.executeSql(
            `CREATE TABLE IF NOT EXISTS food_consumed (
                id_consumed INTEGER PRIMARY KEY NOT NULL,
                id_food INTEGER NOT NULL,
                grams_consumed REAL NOT NULL,
            FOREIGN KEY (id_food)
                REFERENCES foods (id_food));`
        )

        // !! temporary, to fill the table for debugging purposes.
        for (let i = 1; i <= 20; i++) {
            tx.executeSql("INSERT INTO foods (name, protein, fat, carbs, energy) VALUES (?, ?, ?, ?, ?);", [
                `Food ${i}`,
                i,
                i,
                i,
                i
            ])
        }

        // !! temporary, to fill the table for debugging purposes.
        for (let i = 1; i <= 20; i++) {
            tx.executeSql("INSERT INTO food_consumed (id_food, grams_consumed) VALUES (?, ?);",
                [i, i])

        }
    }

    database.transaction(createTable)

    return database
}

export const DatabaseContext = createContext(createDatabase())
