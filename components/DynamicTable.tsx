import Constants from 'expo-constants';
import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { DataTable } from 'react-native-paper';

type Column = {
    title: string,
    numeric?: boolean
};

type Row = {
    [key: string]: string | number
};

type Props = {
    columns: Column[],
    rows: Row[],
    column_map: { [key: string]: string },
};

const DynamicTable: React.FC<Props> = ({ columns, rows, column_map }) => {

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
                            style={{
                                // backgroundColor: done ? "#1c9963" : "#fff",
                                borderWidth: 0.5,

                            }}
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
    );
};

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
});

export default DynamicTable;
