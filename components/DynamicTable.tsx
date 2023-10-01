import { View, StyleSheet, ScrollView, Text, Pressable } from 'react-native'

type TableProps = {
    columnsHeader: string[],
    flexColumn: { columnIndex: number, flex: number },
    numericCols: number[],
    primaryKeyCol: number,
    onPressRow: (id: number) => void,
    rowArray: string[][]
}

const DynamicTable: React.FC<TableProps> = ({
    columnsHeader,
    flexColumn = { columnIndex: 0, flex: 1 },
    numericCols,
    primaryKeyCol,
    onPressRow,
    rowArray
}) => {
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
