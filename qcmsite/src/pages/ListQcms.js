import React, { useEffect, useMemo, useState } from "react";
import Header from "../components/Header";
import Layout from "../components/Layout";
import { useDispatch, useSelector } from "react-redux";
import { Button, FormGroup, Label, Input } from "reactstrap";
import TABLE from "../components/TABLE";
import {
  FaCheckDouble,
  FaEdit,
  FaEye,
  FaInfoCircle,
  FaLock,
  FaTrash,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import {
  DELETE_QCM_BY_ID,
  LOAD_QCMS_LIST,
  SET_QCMS_LIST,
} from "../actions/qcm.actions";
import ReactTooltip from "react-tooltip";
import { LOAD_ALL_CATEGORIES } from "../actions/category.actions";
import { DELETE_USER_BY_ID } from "../actions/requestId.actions";
import { OPEN_DIALOG } from "../actions/dialog.actions";
const defaultFilters = {
  limit: 10,
  skip: 0,
  category: "",
};

function ListQcms() {
  const dispatch = useDispatch();
  const [myfilters, setFilters] = useState(defaultFilters);
  const { listqcms, totalQcms } = useSelector((state) => state.appReducer);
  const [category, setCategory] = useState("");
  const [listCategories, setListCategories] = useState([]);

  const cols = useMemo(
    () => [
      {
        name: "action",
        text: "actions",
        type: "custom",

        k: "1",
        href: (item) => (
          <>
            <FaTrash
              onClick={() => handleDeleteClick(item)}
              data-tip="Supprimer"
              role="button"
              color="#fd3a69"
              className="ibtn"
            />

            <Link data-tip="Ouvrir le QCM" to={`/qcm/${item._id}`}>
              {" "}
              <FaEdit data-tip="Editer" color="#4CAF50" className="ibtn" />
            </Link>
          </>
        ),
      },
      {
        name: "question",
        text: "Question",
        type: "custom",
        k: "1",
        href: (item) => (
          <FaInfoCircle data-tip={item.question} className="ibtn" />
        ),
      },
      {
        name: "categoryLabel",
        text: "Matière",
        type: "text",
      },
      {
        name: "note",
        text: "Remarque",
        type: "text",
      },
    ],
    []
  );
  const load = (filters = defaultFilters) => {
    dispatch(LOAD_QCMS_LIST(filters));
  };

  const handleDeleteClick = (item) => {
    dispatch(
      OPEN_DIALOG({
        content: `are you sure you want to delete <b>${item.question.substr(
          0,
          10
        )}..</b>'s qcm`,
        title: "Supprimer? ",
        className: "supprimer",
        actions: [
          {
            label: "Oui, supprimer",
            fn: () => dispatch(DELETE_QCM_BY_ID(item.id, load)),
          },
        ],
      })
    );
  };

  const loadCategories = () => {
    dispatch(LOAD_ALL_CATEGORIES(setListCategories));
  };

  useEffect(() => {
    //load();
    loadCategories();
    return () => {
      dispatch(SET_QCMS_LIST({ list: [], total: 0 }));
    };
  }, []);
  const gopage = (page) => {
    setFilters({
      ...myfilters,
      skip: page * myfilters.limit,
    });
  };

  const gosearch = (query) => {
    setFilters({
      ...myfilters,
      query,
    });
  };

  useEffect(() => {
    setFilters({
      ...myfilters,
      category,
    });
  }, [category]);

  useEffect(() => {
    console.log("myfilters", myfilters);
    load(myfilters);
  }, [myfilters]);

  return (
    <Layout>
      <Header title="toutes les QCMs" />

      <div className="dashboard">
        <div className="leftside"></div>

        <div className="content">
          <FormGroup>
            {/* <Label for="category">Affichage</Label> */}
            <Input
              type="select"
              value={category}
              name="category"
              id="categoryid"
              onChange={(e) => setCategory(e.target.value)}
            >
              <option key={"null"} value={""}>
                Toutes les matières
              </option>
              {listCategories.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.label} - {w.description}
                </option>
              ))}
            </Input>
          </FormGroup>

          <TABLE
            caption={`liste des QCMs (${totalQcms})`}
            cols={cols}
            gosearch={gosearch}
            data={listqcms}
            total={totalQcms}
            perpage={myfilters.limit}
            gopage={gopage}
          />
        </div>
      </div>
    </Layout>
  );
}

export default ListQcms;
