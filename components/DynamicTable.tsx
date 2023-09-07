import React, { useEffect, useState } from 'react'
import { View, StyleSheet, ScrollView, TouchableOpacity, Text } from 'react-native'
import { DataTable } from 'react-native-paper'
import * as SQLite from "expo-sqlite"

type Props = {
    columns: {
        title: string,
        numeric?: boolean
    }[],
    column_map: { [key: string]: string },
    database: SQLite.Database,
    sql: string
}

const numericCol = (
    isNumeric: boolean,
    colIndex: number,
    row: any,
    col: { title: string, numeric?: boolean }
) => {
    if (isNumeric) {
        return (
            <DataTable.Cell key={colIndex} numeric={col.numeric}>
                {row[col.title]}
            </DataTable.Cell>
        )
    } else {
        <DataTable.Cell key={colIndex} numeric={col.numeric}>
            {row[col.title]}
        </DataTable.Cell>
    }
}

const DynamicTable: React.FC<Props> = ({ columns, column_map, database, sql }) => {
    const [rows, setRows] = useState<any[]>([])

    const getRows = (tx: SQLite.SQLTransaction) => {
        tx.executeSql(
            sql,
            [],
            (_, { rows }) => { setRows(rows._array.reverse()) }
        )
    }

    useEffect(() => { database.transaction(getRows) }, [])

    return (
        <View style={styles.container}>
            <DataTable>
                <DataTable.Header>
                    {columns.map((col, index) => (
                        <DataTable.Title key={index} numeric={col.numeric}>
                            {column_map[col.title]}
                        </DataTable.Title>
                    ))}
                </DataTable.Header>
            </DataTable>
            <ScrollView style={styles.scrollView}>
                <DataTable>
                    {rows.map((row, rowIndex) => (
                        <TouchableOpacity
                            key={rowIndex}
                            // onPress={() => onPressItem && onPressItem(id)}
                            style={{ borderWidth: 0.5 }}
                        >
                            <DataTable.Row key={rowIndex}>
                                {columns.map((col, colIndex) => (
                                    <DataTable.Cell key={colIndex} numeric={col.numeric}>
                                        {row[col.title]}
                                    </DataTable.Cell>
                                ))}
                            </DataTable.Row>
                        </TouchableOpacity>
                    ))}
                </DataTable>
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 6,
        flexDirection: "column",
    },
    scrollView: {
        backgroundColor: "#f0f0f0",
    }
})

export default DynamicTable
