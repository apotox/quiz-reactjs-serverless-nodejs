import React, { useState } from "react";
import { Button, FormGroup, Label, Input, FormText } from "reactstrap";
import Header from "../components/Header";
import Layout from "../components/Layout";
import { departments } from "../services/wilayas";
import { useDispatch } from "react-redux";
import { SEND_REQUESTID } from "../actions/requestId.actions";

function RequestId() {
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [address, setAddress] = useState("");
  const [lastname, setLastname] = useState("");
  const [firstname, setFirstname] = useState("");
  const [wilaya, setWilaya] = useState("Batna");

  const [remarque, setRemarque] = useState("");

  const dispatch = useDispatch();

  const create = () => {
    dispatch(
      SEND_REQUESTID({
        email,
        mobile,
        address,
        firstname,
        lastname,
        wilaya,
        remarque,
      })
    );
  };

  return (
    <Layout margin>
      <Header title="Demande d'inscription" />

      <div className="form-content">
        <p className="note">
          {" "}
          veillez remplir ce formulaire, vous allez recevoir un E-MAIL contenant votre nom d'utilisateur et mot de passe.
        </p>
        

        <FormGroup>
          <Label for="lastname">Nom</Label>
          <Input
            value={lastname}
            onChange={(e) => setLastname(e.target.value)}
            type="text"
            name="lastname"
            id="lastnameid"
            placeholder=""
          />
        </FormGroup>

        <FormGroup>
          <Label for="firstname">Prénom</Label>
          <Input
            value={firstname}
            onChange={(e) => setFirstname(e.target.value)}
            type="text"
            name="firstname"
            id="firstnameid"
            placeholder=""
          />
        </FormGroup>

        <FormGroup>
          <Label for="mobile">Mobile</Label>
          <Input
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            type="phone"
            name="mobile"
            id="mobileid"
            placeholder="0777..."
          />
        </FormGroup>

        <FormGroup>
          <Label for="email">E-mail</Label>
          <Input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            name="email"
            id="emailid"
            placeholder="votre electronique adresse"
          />
        </FormGroup>

        
        <FormGroup>
          <Label for="address">Adresse</Label>
          <Input
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            type="text"
            name="address"
            id="addressid"
            placeholder="rue .."
          />
        </FormGroup>

        <FormGroup>
          <Label for="wilaya">Département</Label>
          <Input
            type="select"
            value={wilaya}
            name="wilaya"
            id="wilayaid"
            onChange={(e) => setWilaya(e.target.value)}
          >
            {departments.map((w) => (
              <option key={w.formatted_name} value={w.name}>
                ({w.code}) - {w.name} 
              </option>
            ))}
          </Input>
        </FormGroup>

        <FormGroup>
          <Label for="address">Remarque</Label>
          <Input
            value={remarque}
            onChange={(e) => setRemarque(e.target.value)}
            type="textarea"
            name="remarque"
            id="remarqueid"
            placeholder="..."
          />
        </FormGroup>

        <Button color="success" onClick={create}>Continuer</Button>
      </div>
    </Layout>
  );
}

export default RequestId;
