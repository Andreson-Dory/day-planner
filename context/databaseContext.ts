import { createContext } from "react";
import { SQLiteDatabase } from "expo-sqlite";

export const DatabaseContext = createContext<SQLiteDatabase | null>(null);
