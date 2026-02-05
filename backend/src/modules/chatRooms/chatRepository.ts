// chat Repository
import { db } from "../../config/db";

export const create = async (dataObj: any) => {

    const [result]: any = db.query("INSERT INTO chat_rooms ( name, is_group, created_by ) VALUES ( ?,?,? )", [dataObj.name, dataObj.is_group, dataObj.created_by]);
    return result;
}