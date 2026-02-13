import { useEffect, useState, ReactNode } from "react";
import { SQLiteDatabase } from "expo-sqlite";
import { connectToDatabase, createTables } from "@/database/db";
import { DatabaseContext } from "./databaseContext";

type Props = {
  children: ReactNode;
};

export const DatabaseProvider = ({ children }: Props) => {
  const [db, setDb] = useState<SQLiteDatabase | null>(null);

  useEffect(() => {
    const init = async () => {
      const database = await connectToDatabase();
      setDb(database);
      await createTables(database); 
    };

    init();
  }, []);

  if (!db) {
    return null;
  }

  return (
    <DatabaseContext.Provider value={db}>
      {children}
    </DatabaseContext.Provider>
  );
};
