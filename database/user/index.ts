import { user } from "@/app/constant/types/user";
import { SQLiteDatabase } from "expo-sqlite";

export const addUser = ( db: SQLiteDatabase, user: user) => {
    const { firstName, lastName } = user;
    const insertQuery = ` INSERT INTO USERS ( firstName, lastName ) VALUES ( ?, ? ); `;
    const values = [firstName, lastName];

    try {
        return db.runAsync(insertQuery, values);
    } catch (error) {
        console.error(error);
        throw Error('Failed to add user');
    }
}

export const getUser = async ( db: SQLiteDatabase): Promise<user> => {
    try {
        const today = new Date();
        const todayString = today.toISOString().split('T')[0];
        const selectQuery = ` SELECT * FROM USERS `;

        const result = await db.getFirstAsync<user>(selectQuery);
     
        return result ? result : { id: 0, firstName: 'undefined', lastName: 'undefined' };
    } catch (error) {
        console.error(error);
        throw Error(' Failed to get user ');
    }
}