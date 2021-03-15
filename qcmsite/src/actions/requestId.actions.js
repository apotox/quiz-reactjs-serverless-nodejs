import Axios from "axios";
import errorMessage from "../services/errorMessage";

import { SHOW_ALERT } from "./alert.actions";
import { OPEN_DIALOG } from "./dialog.actions";

export const SEND_REQUESTID = (payload) => {
  return (dispatch, getState, { api = Axios.create }) => {
    api()
      .post("demandInscription", {
        ...payload,
      })
      .then((result) => {
        

        // dispatch(
        //   SHOW_ALERT({
        //     show: true,
        //     message: "request id " + result.data.username,
        //   })
        // );

        dispatch(
          OPEN_DIALOG({
            title:"Merci!",
            content: "lorsque votre demande sera validée, vous recevrez un e-mail contenant votre nom d'utilisateur et mot de passe.",
            actions:[{
              label:"Okey",
              fn:()=>{
                window.location.href="/"
              }
            }],
            noCancel: true
          })
        )



      })
      .catch((err) => {
        
        dispatch(
          SHOW_ALERT({
            show: true,
            message: "Ops " + errorMessage(err),
          })
        );
      });

    
  };
};

/**
 * DELETE_USER_BY_ID
 * @param {*} id 
 */
export const DELETE_USER_BY_ID = (id,cb)=>{

  return (dispatch,_,{api = Axios.create})=>{


      api().delete(`/deleteUser/?id=${id}`)
      .then(result=>{

        dispatch(SHOW_ALERT({
          show: true,
          message: "L'utilisateur a été supprimé !"
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