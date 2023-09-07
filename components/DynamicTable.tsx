import React, { useEffect, useState } from 'react'
import { View, StyleSheet, ScrollView, TouchableOpacity, Text } from 'react-native'
import * as SQLite from "expo-sqlite"

type TableProps = {
    columns_header: string[],
    flexColumn: { columnIndex: number, flex: number },
    numericCols: number[],
    database: SQLite.Database,
    sql: string
}

const DynamicTable: React.FC<TableProps> = ({
    columns_header,
    flexColumn = { columnIndex: 0, flex: 1 },
    numericCols,
    database,
    sql }) => {
    const [rows, setRows] = useState<any[]>([])

    const getRows = (tx: SQLite.SQLTransaction) => {
        tx.executeSql(
            sql,
            [],
            (_, { rows }) => { setRows(rows._array.reverse()) }
        )
    }

    const row_array: string[][] = []
    for (let i = 0; i < rows.length; i++) {
        row_array.push(Object.values(rows[i]))
    }

    useEffect(() => { database.transaction(getRows) }, [])

    return (
        <View style={{ flex: 1 }}>
            <View style={styles.header}>
                {columns_header.map((value, headerIndex) => (
                    <Text
                        key={headerIndex}
                        style={[
                            styles.header_text,
                            { textAlign: numericCols.includes(headerIndex) ? 'right' : 'left' },
                            { flex: headerIndex == flexColumn.columnIndex ? flexColumn.flex : 1 }
                        ]}>
                        {value}
                    </Text>
                ))}
            </View>
            <ScrollView style={styles.scroll_view}>
                {row_array.map((row, rowIndex) => (
                    <TouchableOpacity
                        key={rowIndex}
                        // onPress={() => onPressItem && onPressItem(id)}
                        style={{ borderWidth: 0.2 }}>
                        <View style={styles.rows}>
                            {row.map((value, cellIndex) => (
                                <Text
                                    key={cellIndex}
                                    style={[
                                        styles.row_text,
                                        { textAlign: numericCols.includes(cellIndex) ? 'right' : 'left' },
                                        { flex: cellIndex == flexColumn.columnIndex ? flexColumn.flex : 1 }
                                    ]}>
                                    {value}
                                </Text>
                            ))}
                        </View>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    header_text: {
        fontSize: 11,
        fontWeight: 'bold'
    },
    row_text: {
        fontSize: 11
    },
    header: {
        flexDirection: 'row',
        margin: 11
    },
    rows: {
        flexDirection: 'row',
        marginLeft: 11,
        marginRight: 11,
        marginBottom: 8,
        marginTop: 8
    },
    scroll_view: {
        backgroundColor: "#f0f0f0",
        flex: 1
    }

})

export default DynamicTable
