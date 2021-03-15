
import { get } from "lodash";

export default (err)=>{
    return get(err.response,"data.message",err.message)
}