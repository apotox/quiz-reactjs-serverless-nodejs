import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { Button, FormGroup, Label, Input, FormText } from "reactstrap";
import Header from "../components/Header";
import { useDispatch, useSelector } from "react-redux";
import { DO_LOGIN } from "../actions/login.actions";

function Login() {
  const [username, setUsername] = useState(process.env.NODE_ENV == "development" ? "safi-c5866":"");
  const {user} = useSelector(state => state.appReducer)
  const [password, setPassword] = useState(process.env.NODE_ENV == "development" ? "123456789":"");

  const dispatch = useDispatch();

  const try_login = () => {
    dispatch(
      DO_LOGIN({
        username,
        password,
      })
    );
  };

  useEffect(()=>{
     if(user){
       window.location.hash='/'
     }
  },[user])
  return (
    <Layout margin>
      <Header title={"Connexion"} />
      <div className="form-content box">
        <FormGroup>
          <Label for="username">Nom d'Utilisateur</Label>
          <Input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            type="text"
            name="username"
            id="usernameid"
            placeholder=""
          />
        </FormGroup>

        <FormGroup>
          <Label for="password">Mot de passe</Label>
          <Input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            name="password"
            id="passwordid"
            placeholder=""
          />
        </FormGroup>

        <Button onClick={try_login} color="success">Connexion</Button>
      </div>
    </Layout>
  );
}

export default Login;
