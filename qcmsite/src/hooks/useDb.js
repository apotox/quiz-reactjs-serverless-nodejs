import react,{ useEffect, useState } from "react"
import LocalStorage from "lowdb/adapters/LocalStorage";
import low from "lowdb";


function useDb(){

    const [mydb,setDb] = useState(null)

    useEffect(() => {
        console.log("connect to db")
        const adapter = new LocalStorage("db");
        const db = low(adapter);
        db.defaults({ [process.env.REACT_APP_DB_NAME]: [], user: {}, count: 0 }).write();

        setDb(db)
        return () => {
            
        }
    }, [])

    return mydb



}

export default useDb