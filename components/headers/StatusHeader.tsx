import React, { useState } from "react"
import { task } from "@/constant/types/task"
import StatusButton from "../button/StatusButton";
import Row from "../row";
import { StyleSheet } from "react-native";

type Props = {
    toggle: () => void;
}

export default function StatusHeader ({ toggle } : Props) {
    const [ ongoingpressed, setOngoingPressed ] = useState(true);
    const [ completedPressed, setCompletedPressed ] = useState(false);

    const handleClickOngoing = () => {
        if (ongoingpressed) return
        setOngoingPressed(true)
        setCompletedPressed(false)
        toggle()
    }

    const handleClickCompleted = () => {
        if(completedPressed) return
        setCompletedPressed(true)
        setOngoingPressed(false)
        toggle()
    }

    return (
        <Row style= {styles.row}>
            <StatusButton type="Ongoing" onPress={handleClickOngoing} pressed={ongoingpressed} />
            <StatusButton type="Completed" onPress={handleClickCompleted} pressed={completedPressed} />
        </Row>
    )
}

const styles = StyleSheet.create({
    row: {
        marginHorizontal: 60,
    }
})