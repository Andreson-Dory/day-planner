import { GET_USER, GET_USER_ERROR, GET_USER_SUCCESS } from "@/constant";
import { getUserService, addUserService } from "@/services/user-service";
import { SQLiteDatabase } from "expo-sqlite";
import { Dispatch } from "react";

export const addUserAction = (db: SQLiteDatabase, user: any) => {
    return async (dispatch: Dispatch<any>) => {
        try {
            await addUserService(db, user);
            dispatch(getUserAction(db));
        } catch (error) {
            console.error(error);
        }
    };
}

export const getUserAction = ( db: SQLiteDatabase ) => {
    return async (disptach: Dispatch<any>) => {
            disptach({type: GET_USER});
    
            try {
                const response = await getUserService(db);
                disptach({ type: GET_USER_SUCCESS, payload: response });
            } catch (error) {
                console.error(error);            
                disptach({ type: GET_USER_ERROR });
            }
        }
}