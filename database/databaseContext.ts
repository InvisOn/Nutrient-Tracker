import { consoleLogTimeSqlCallbacks } from "@/utils/debug"
import { openDatabase, Database, SQLTransaction } from "expo-sqlite"
import { createContext } from 'react'

// todo If I want to change to field names to be more descriptive (fat -> fat_per_hectogram)it is a hassle to change it everywhere in the code base. Perhaps an ORM can help?
// optional features
// keep a table of all nutrient goals set
const createDatabase = (): Database => {
    const database = openDatabase("food.db")

    const createTable = (tx: SQLTransaction) => {
        // !! temporary, to prevent the db from ballooning in size when debugging.
        tx.executeSql("DROP TABLE foods;");
        tx.executeSql("DROP TABLE food_consumed;");
        tx.executeSql("DROP TABLE nutrient_goals;");

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
            `CREATE TABLE IF NOT EXISTS nutrient_goals (
                id_goal INTEGER PRIMARY KEY NOT NULL CHECK (id_goal = 1),
                grams_protein INTEGER NOT NULL,
                grams_fat INTEGER NOT NULL,
                grams_carbs REAL NOT NULL);`
        )

        // !! temporary, to fill the tables for debugging purposes.
        tx.executeSql("INSERT INTO nutrient_goals (grams_protein, grams_fat, grams_carbs) VALUES (?, ?, ?);", [1, 2, 3])

        for (let i = 1; i <= 20; i++) {
            tx.executeSql("INSERT INTO foods (name, protein, fat, carbs, energy) VALUES (?, ?, ?, ?, ?);", [
                `Food ${i}`,
                i,
                i,
                i,
                i
            ])
        }

        for (let i = 1; i <= 20; i++) {
            tx.executeSql("INSERT INTO food_consumed (id_food, grams_consumed) VALUES (?, ?);",
                [i, i])
        }

        tx.executeSql("SELECT * FROM food_consumed", [], ...consoleLogTimeSqlCallbacks('executeSql', 'SELECT food_consumed'))
    }

    database.transaction(createTable, ...consoleLogTimeSqlCallbacks())

    return database
}

export const DatabaseContext = createContext(createDatabase())
