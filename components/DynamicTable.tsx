import { useState } from 'react'
import { View as NativeView, StyleSheet, ScrollView, Text as NativeText, Pressable } from 'react-native'
import { Text, View } from '@/components/Themed'


type TableProps = {
    columnsHeader: string[],
    flexColumn?: { columnIndex: number, flex: number },
    numericCols: number[],
    primaryKeyCol: number,
    onPressRow: (id: number) => void,
    highLightRowOnPress: boolean
    rowArray: (string | number)[][]
}

// TODO: LOW PRIORITY add styling to individual columns, width, text, etc.
// ? What is flexColumn for? to increase the width of a specific column. Can this be named better? Yes, make it so it can make any column any width. Is flex really the best way to control width? Probably, but look for better anyway.
const DynamicTable: React.FC<TableProps> = ({
    columnsHeader,
    flexColumn = { columnIndex: 0, flex: 1 },
    numericCols,
    primaryKeyCol,
    onPressRow,
    highLightRowOnPress,
    rowArray
}) => {
    const [selectedRow, setSelectedRow] = useState(-1)

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
            <ScrollView style={styles.scrollView}>
                {rowArray.map((row) => (
                    <Pressable
                        key={row[primaryKeyCol]}
                        onPress={() => {
                            const col = Number(row[primaryKeyCol])
                            onPressRow(col)
                            setSelectedRow(col)
                        }}
                        style={({ pressed }) => {
                            return [{
                                borderWidth: 0.2,
                                borderColor: "black",
                                backgroundColor: highLightRowOnPress && selectedRow === row[primaryKeyCol] ? "#d7d7d7" : "#f0f0f0"
                            }]
                        }}>
                        <NativeView style={styles.rows}>
                            {row.filter((_, index) => index !== primaryKeyCol).map((colValue, cellIndex) => (
                                <NativeText
                                    key={cellIndex}
                                    style={[
                                        styles.columnText,
                                        { textAlign: numericCols.includes(cellIndex) ? 'right' : 'left' },
                                        { flex: cellIndex == flexColumn.columnIndex ? flexColumn.flex : 1 }
                                    ]}>
                                    {colValue}
                                </NativeText>
                            ))}
                        </NativeView>
                    </Pressable>
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
    columnText: {
        fontSize: 11,
        // marginRight: 4
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
