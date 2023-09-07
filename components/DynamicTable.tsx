import React, { useEffect, useState } from 'react'
import { View, StyleSheet, ScrollView, TouchableOpacity, Text } from 'react-native'
import * as SQLite from "expo-sqlite"

type TableProps = {
    columnsHeader: string[],
    flexColumn: { columnIndex: number, flex: number },
    numericCols: number[],
    primaryKeyCol: number,
    onPressRow: (id: number) => void,
    database: SQLite.Database,
    sql: string
}

const DynamicTable: React.FC<TableProps> = ({
    columnsHeader,
    flexColumn = { columnIndex: 0, flex: 1 },
    numericCols,
    primaryKeyCol,
    onPressRow,
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

    const rowArray: string[][] = []
    for (let i = 0; i < rows.length; i++) {
        rowArray.push(Object.values(rows[i]))
    }

    useEffect(() => { database.transaction(getRows) }, [])

    return (
        <View style={{ flex: 1 }}>
            <View style={styles.header}>
                {columnsHeader.map((value, headerIndex) => (
                    <Text
                        key={headerIndex}
                        style={[
                            styles.headerText,
                            { textAlign: numericCols.includes(headerIndex) ? 'right' : 'left' },
                            { flex: headerIndex == flexColumn.columnIndex ? flexColumn.flex : 1 }
                        ]}>
                        {value}
                    </Text>
                ))}
            </View>
            {/* todo perhaps have an option to disable `TouchableOpacity`? */}
            <ScrollView style={styles.scrollView}>
                {rowArray.map((row) => (
                    <TouchableOpacity
                        key={Number(row[primaryKeyCol])}
                        onPress={() => onPressRow(Number(row[primaryKeyCol]))}
                        style={{ borderWidth: 0.2 }}>
                        <View style={styles.rows}>
                            {row.filter((_, index) => index !== primaryKeyCol).map((value, cellIndex) => (
                                <Text
                                    key={cellIndex}
                                    style={[
                                        styles.rowText,
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
    headerText: {
        fontSize: 11,
        fontWeight: 'bold'
    },
    rowText: {
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
    scrollView: {
        backgroundColor: "#f0f0f0",
        flex: 1
    }

})

export default DynamicTable
