import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { LOAD_ALL_CATEGORIES } from "../actions/category.actions";

import {
  Button,
  FormGroup,
  Label,
  Input,
  InputGroup,
  InputGroupAddon,
  Badge,
} from "reactstrap";
import Header from "../components/Header";
import Layout from "../components/Layout";
import { FaArrowRight, FaMinus } from "react-icons/fa";
import { LOAD_QCMS_BY_CATEGORY } from "../actions/qcm.actions";

import shortid from "shortid";
import { useHistory } from "react-router-dom";
import useDb from "../hooks/useDb";
import { orderBy } from "lodash";

function Progress() {
  const [listCategories, setListCategories] = useState([]);
  const isLoading = useSelector((state) => state.appReducer.loading);
  const db = useDb();
  const [exams, setExams] = useState([]);
  const dispatch = useDispatch();
  const [category, setCategory] = useState("");
  const [categoryLabel, setCategoryLabel] = useState("");
  const loadCategories = () => {
    dispatch(LOAD_ALL_CATEGORIES(setListCategories));
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const LoadExams = () => {
    if (!db) return;
    let exams = db
      .get(process.env.REACT_APP_DB_NAME)
      .sortBy("createdAt")
      .value();
    setExams(exams);
  };

  useEffect(LoadExams, [db]);

  useEffect(() => {
    if (category) {
      let cat = listCategories.find((cat) => cat.id == category);
      setCategoryLabel(cat ? cat.label : "/");
    }
  }, [category]);

  const history = useHistory();

  const saveQcmsList = (data) => {
    const id = shortid.generate();

    db.get(process.env.REACT_APP_DB_NAME)
      .push({
        id,
        categoryLabel,
        createdAt: new Date().toISOString(),
        list: orderBy(data.list, (d) => d.createdAt, "asc"),
        total: data.total,
        score: 0,
        progress: 0,
      })
      .write();

    history.push(`/practice/${id}`);
  };

  const loadQcms = (categoryId) => {
    dispatch(LOAD_QCMS_BY_CATEGORY(categoryId, saveQcmsList));
  };

  const startNewExam = () => {
    loadQcms(category);
  };

  const deleteExam = (id) => {
    db.get(process.env.REACT_APP_DB_NAME)
      .remove({
        id,
      })
      .write();

    setTimeout(LoadExams, 500);
  };

  return (
    <Layout margin>
      <Header title="Progression" />

      <div className="progress-content box-content">
        <p className="note">
          commencez un nouveau teste par selectionner une Matière et cliquer sur
          le button démarrer.
        </p>
        <FormGroup>
          {/* <Label for="category">selectionez une matière</Label> */}
          <InputGroup>
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
              {listCategories.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.label} - {w.description}
                </option>
              ))}
            </Input>
            <InputGroupAddon addonType="append">
              <Button
                color="info"
                disabled={!category || isLoading}
                onClick={startNewExam}
              >
                Démarrer
              </Button>
            </InputGroupAddon>
          </InputGroup>
        </FormGroup>

        <div className="prev-exams">
          <Label>Les tests précédents: </Label>
          {exams.map((ex, index) => (
            <tr key={`ex-${index}`}>
              <td
                style={{
                  padding: "0.2rem",
                  display: "flex",
                  justifyItems: "center",
                  alignItems: "center",
                }}
              >
                <span>{ex.categoryLabel}</span>
                <Badge>
                  {ex.progress} / {ex.total}
                </Badge>
              </td>
              <td style={{ textAlign: "right" }}>
                <Button
                  size="sm"
                  color="danger"
                  onClick={() => deleteExam(ex.id)}
                >
                  <FaMinus />
                </Button>

                <Button
                  itemType="a"
                  href={`/#/practice/${ex.id}`}
                  size="sm"
                  color="success"
                >
                  continuer <FaArrowRight />
                </Button>
              </td>
            </tr>
          ))}
        </div>
      </div>
    </Layout>
  );
}

export default Progress;
