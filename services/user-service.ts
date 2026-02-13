import { user } from "@/constant/types/user";
import { addUser, getUser } from "@/database/user";
import { SQLiteDatabase } from "expo-sqlite";

export const addUserService = async (db: SQLiteDatabase, user: user) => {
    const response = await addUser(db, user);
    return response;
}

export const getUserService = async (db: SQLiteDatabase) => {
    const response = await getUser(db);
    return response;
}