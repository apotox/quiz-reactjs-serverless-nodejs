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
import { LOAD_QCM, SAVE_QCM, UPDATE_QCM } from "../actions/qcm.actions";
import Header from "../components/Header";
import Layout from "../components/Layout";
import { ListGroup, ListGroupItem } from "reactstrap";
import { FaMinus, FaPlus } from "react-icons/fa";
import { LOAD_ALL_CATEGORIES } from "../actions/category.actions";
const initQcm = {
  question: "",
  valid: [],
  suggestions: [],
  note: "",
  category: "",
};
function EditQcm() {
  const { user } = useSelector((state) => state.appReducer);
  // let [qcm, setQcm] = useState({
  //   question: "",
  //   valid: [],
  //   suggestions: [],
  //   note: "",
  //   category: "",
  //   createdBy: "",
  //   code: "",
  // });

  const [question, setQuestion] = useState("");
  const [note, setNote] = useState("");

  const [valid, setValid] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [hasImage, sethasImage] = useState(false);
  const [category, setCategory] = useState("");
  const [newSuggestion, setNewSuggestion] = useState("");
  const [categories, setCategories] = useState([]);
  const [imageUrl, setImageUrl] = useState("");
  const dispatch = useDispatch();

  const loadCategories = () => {
    dispatch(LOAD_ALL_CATEGORIES(setCategories));
  };

  let { id } = useParams();

  const loaded = (qcm) => {
    //setQcm(qcm);
    let { question, suggestions, valid, note, category, imageUrl } = qcm;
    setQuestion(question);
    setSuggestions(suggestions);
    setNote(note);
    setCategory(category);
    setValid(valid);
    sethasImage(imageUrl != "");
    setImageUrl(imageUrl);
  };

  useEffect(() => {
    if (id) {
      dispatch(LOAD_QCM(id, loaded));
    }
  }, [id]);

  useEffect(() => {
    loadCategories();
  }, []);

  const addQuestion = () => {
    setSuggestions([...suggestions, newSuggestion]);
    setValid([...valid, false]);
    setNewSuggestion("");
  };

  const rmQcm = (index) => {
    let t = suggestions;
    t.splice(index, 1);
    setSuggestions([...t]);

    let v = valid;
    v.splice(index, 1);
    setValid([...v]);
  };

  const isValid = (index) => {
    return valid[index];
  };

  const toggle = (index) => {
    let t = valid;
    t[index] = typeof t[index] == "undefined" ? true : !t[index];
    setValid([...t]);
  };

  const save = () => {
    if (!id) {
      dispatch(
        SAVE_QCM(
          {
            question,
            valid,
            suggestions,
            note,
            category,
            imageUrl: hasImage ? imageUrl : "",
          },
          () => {
            setImageUrl(hasImage ? "/assets/":"")
            //sethasImage(hasImage)
            setQuestion("");
            setSuggestions([]);
            setValid([]);
          }
        )
      );
    } //update
    else {
      dispatch(
        UPDATE_QCM(
          {
            question,
            valid,
            suggestions,
            note,
            category,
            imageUrl: hasImage ? imageUrl : "",
          },
          id
        )
      );
    }
  };

  return (
    <Layout margin>
      <Header title={"QCM"} />

      <div className="form-content box-content">
        <FormGroup>
          <Label for="category">Matière</Label>
          <Input
            type="select"
            value={category}
            name="category"
            id="categoryid"
            onChange={(e) => setCategory(e.target.value)}
          >
            <option key={"none"} value={""}>
              selectionez une matière
            </option>

            {categories.map((w) => (
              <option key={w.id} value={w.id}>
                {w.label}
              </option>
            ))}
          </Input>
        </FormGroup>

        <FormGroup>
          <Label for="address">Question</Label>
          <Input
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            type="text"
            name="question"
            id="questionid"
            placeholder="saisissez la question..."
          />
        </FormGroup>

        <FormGroup check>
          <Label check>
            <Input
              type="checkbox"
              checked={hasImage}
              onClick={() => sethasImage(!hasImage)}
            />{" "}
            avec une image ?
          </Label>
        </FormGroup>

        {hasImage && (
          <FormGroup>
            <Input
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              type="text"
              name="imageUrl"
              id="imageUrlid"
              placeholder="https://imgexample.com/image.jpg"
            />
          </FormGroup>
        )}

        <p className="note">la question ne doit pas etre déja existante.</p>

        <Label>Ajouter des suggestions (propositions)</Label>

        <ListGroup className="suggestions">
          <ListGroupItem style={{ display: "flex", marginBottom: "1rem" }}>
            <InputGroup>
              <Input
                value={newSuggestion}
                onChange={(e) => setNewSuggestion(e.target.value)}
                type="text"
                name="question"
                id="questionid"
                placeholder="exemple: A - premiere proposition"
              />
              <InputGroupAddon addonType="append">
                <Button
                  disabled={!newSuggestion}
                  color="success"
                  onClick={addQuestion}
                >
                  <FaPlus />
                </Button>
              </InputGroupAddon>
            </InputGroup>
          </ListGroupItem>

          {suggestions.length ? (
            <Label>Couchez la/les bonne(s) réponse(s)</Label>
          ) : (
            ""
          )}

          {suggestions.map((sug, index) => (
            <ListGroupItem
              key={`sug-${index}`}
              style={{
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <div
                style={{
                  padding: "0.4rem",
                }}
              >
                <FormGroup check>
                  <Label check>
                    <Input
                      type="checkbox"
                      checked={isValid(index)}
                      onClick={() => toggle(index)}
                    />{" "}
                    {sug}
                  </Label>
                </FormGroup>
              </div>

              <Button size="sm" color="danger" onClick={() => rmQcm(index)}>
                <FaMinus />
              </Button>
            </ListGroupItem>
          ))}
        </ListGroup>

        <FormGroup>
          <Label for="address">Remarque</Label>
          <Input
            value={note}
            onChange={(e) => setNote(e.target.value)}
            type="textarea"
            name="remarque"
            id="remarqueid"
            placeholder="Attention! l'Utilisateur peut voir le contenu de cette remarque."
          />
        </FormGroup>

        <Button
          disabled={!suggestions.length || !question || !category}
          style={{ marginTop: "4rem" }}
          onClick={save}
          color="success"
        >
          Enregistrer
        </Button>
      </div>
    </Layout>
  );
}

export default EditQcm;
