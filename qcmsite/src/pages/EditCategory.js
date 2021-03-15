import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import {
  Button,
  FormGroup,
  Label,
  InputGroupAddon,
  Input,
  FormText,
  InputGroup,
} from "reactstrap";
import { LOAD_CATEGORIE, SAVE_CATEGORIE,UPDATE_CATEGORIE } from "../actions/category.actions";
import Header from "../components/Header";
import Layout from "../components/Layout";
import { ListGroup, ListGroupItem } from "reactstrap";
import { FaMinus, FaPlus } from "react-icons/fa";

function EditCategory() {
  const { user } = useSelector((state) => state.appReducer);

  const [description, setDescription] = useState("");
  const [label, setLabel] = useState("");

  const dispatch = useDispatch();
  let { id } = useParams();

  const loaded = (qcm) => {
    setDescription(qcm.description)
    setLabel(qcm.label)
  };



  const create = () => {

    if(!id){
        dispatch(SAVE_CATEGORIE({
            description,
            label
        }))
    }else{
        dispatch(UPDATE_CATEGORIE({
            description,
            label
        },id))
    }

  };

  useEffect(() => {
    if (id) {
      dispatch(LOAD_CATEGORIE(id, loaded));
    }
  }, [id]);

  return (
    <Layout margin>
      <Header title={"Nouvelle Matière"} />
      <div className="form-content  box-content">
        <FormGroup>
          <Label for="label">Nom de la matière</Label>
          <Input
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            type="textarea"
            name="label"
            id="labelid"
            placeholder="exemple: Réglementation Spécifique..."
          />
        </FormGroup>

    
        <FormGroup>
          <Label for="description">Déscription</Label>
          <Input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            type="textarea"
            name="description"
            id="remarqueid"
            placeholder="..."
          />
        </FormGroup>

        <p className="note">vous pouvez les changer ultérieurement</p>

        <Button color="success" disabled={!label} style={{ marginTop: "4rem" }} onClick={create}>
          Enregistrer
        </Button>
      </div>
    </Layout>
  );
}

export default EditCategory;
