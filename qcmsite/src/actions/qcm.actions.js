import Axios from "axios"
import errorMessage from "../services/errorMessage"
import { SHOW_ALERT } from "./alert.actions"
import { OPEN_DIALOG } from "./dialog.actions"

export const SET_QCMS_LIST = (payload)=>({
    type:'SET_QCMS_LIST',
    payload
})

export const LOAD_QCMS_LIST = ({ limit = 25, skip = 0, searchIn = "question",category="", query = "" }) =>{

    return (dispatch,_,{api = Axios.create}) =>{
        api()
        .get(`/indexQcm?searchIn=question&search=${query}&searchIn=${searchIn}${category ? "&category="+category : ""}&limit=${limit}&skip=${skip}`)
        .then(result=>{
            
            dispatch(SET_QCMS_LIST(result.data))
        })
        .catch(err=>{
            dispatch(SHOW_ALERT({
                message: errorMessage(err),
                show: true
            }))
        })


    }
}


export const LOAD_QCM = (payload,cb) =>{

    return (dispatch,_,{api = Axios.create}) =>{

        api().get(`/indexQcm?exact=true&searchIn=_id&search=${payload}`)
        .then(result=>{
            
            cb(result.data.list[0])
        })
        .catch(err=>{
            dispatch(SHOW_ALERT({
                message: errorMessage(err),
                show: true
            }))
        })


    }
}


export const SAVE_QCM=(payload,cb)=>{


    return (dispatch,_,{api = Axios.create})=>{

        api().post(`/createQcm`,payload)
        .then(_=>{

            dispatch(OPEN_DIALOG({
                content: 'Le QCM a été ajouté avec succès',
                title: 'Ajouter',
                noCancel:  true,
                actions:[]
            }))

            if(cb) cb()
        })
        .catch(err=>{

            dispatch(SHOW_ALERT({
                message: errorMessage(err)
            }))
        })


    }
}

export const UPDATE_QCM = (payload,id) =>{


    return (dispatch,_,{api = Axios.create})=>{

        api().put(`/updateQcm?id=${id}`,payload)
        .then(_=>{

            dispatch(OPEN_DIALOG({
                content: 'Le QCM a été mis à jour avec succès',
                title: 'Mettre a jour',
                noCancel:  true,
                actions:[]
            }))
        })
        .catch(err=>{

            dispatch(SHOW_ALERT({
                message: errorMessage(err),
                show: true
            }))
        })


    }
}


export const LOAD_QCMS_BY_CATEGORY=(categoryId,cb)=>{

    return (dispatch,_,{api = Axios.create})=>{

        api()
        .get(`/indexQcm?exact=true&searchIn=category&search=${categoryId}&limit=1000`)
        .then(result=>{
            
            cb(result.data)
        })
        .catch(err=>{
            dispatch(SHOW_ALERT({
                message: `cant load qcms ${errorMessage(err)}`,
                show: true
            }))
        })

    }
}

export const DELETE_QCM_BY_ID = (id,cb)=>{

    return (dispatch,_,{api = Axios.create})=>{
  
  
        api().delete(`/deleteQcm/?id=${id}`)
        .then(_=>{
  
          dispatch(SHOW_ALERT({
            show: true,
            message: "Le QCM a été supprimé."
          }))
  
         // dispatch(LOAD_REQUESTS_LIST())
          cb()
        })
        .catch(err=>{
          dispatch(SHOW_ALERT({
            show: true,
            message: errorMessage(err)
          }))
        })
  
    }
  }