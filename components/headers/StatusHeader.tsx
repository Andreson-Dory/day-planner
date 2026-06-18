import React, { useState } from "react"
import StatusButton from "../button/StatusButton";
import Row from "../row";
import { StyleSheet } from "react-native";

type Props = {
    filter: 'All' | 'Pending' | 'Completed';
    setFilter: React.Dispatch<React.SetStateAction<"Completed" | "All" | "Pending">>;
}

export default function StatusHeader ({ filter, setFilter } : Props) {

    const handleClickAll = () => {
        setFilter("All");
    } 

    const handleClickPending = () => {
        setFilter("Pending");
    }

    const handleClickCompleted = () => {
        setFilter("Completed")
    }

    return (
        <Row style= {styles.row}>
            <StatusButton type='All' filter={filter} onPress={handleClickAll} />
            <StatusButton type='Pending' filter={filter} onPress={handleClickPending} />
            <StatusButton type='Completed' filter={filter} onPress={handleClickCompleted} />
        </Row>
    )
}

const styles = StyleSheet.create({
    row: {
        marginHorizontal: 10,
    }
})