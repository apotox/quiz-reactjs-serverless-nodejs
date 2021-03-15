import React, { useEffect, useMemo } from "react";
import Header from "../components/Header";
import Layout from "../components/Layout";
import { useDispatch, useSelector } from "react-redux";
import {
  ACCEPT_REQUEST,
  LOAD_REQUESTS_LIST,
  SET_REQUESTS_LIST,
} from "../actions/app.actions";
import TABLE from "../components/TABLE";
import { FaCheckDouble, FaEye, FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";
import ReactTooltip from "react-tooltip";
import moment from "moment";
import { OPEN_DIALOG } from "../actions/dialog.actions";
import { DELETE_USER_BY_ID } from "../actions/requestId.actions";

const defaultFilters = {
  limit: 10,
  skip: 0,
};

function ListRequests() {
  const dispatch = useDispatch();
  const { listrequests, totalRequests } = useSelector(
    (state) => state.appReducer
  );

  const handleValidateClick = (item) => {
    dispatch(
      OPEN_DIALOG({

        content: `un email sera envoyé à <b>${item.email}</b> contenant un nom d'utilisateur et un mot de passe`,
        title: "Confirmation",
        className: "validate",
        actions: [
          {
            label: "Oui",
            fn: () => dispatch(ACCEPT_REQUEST(item.id)),
          },
        ],
      })
    );
  };

  const handleDeleteClick = (item) => {
    dispatch(
      OPEN_DIALOG({
        content: `êtes-vous sûr de vouloir supprimer le compte de <b>${item.fullname}</b> (${item.username})`,
        title: "Confirmation",
        className: "supprimer",
        actions: [
          {
            label: "Oui, supprimer",
            fn: () => dispatch(DELETE_USER_BY_ID(item.id, load)),
          },
        ],
      })
    );
  };
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
              role="button"
              color="#fd3a69"
              className="ibtn"
              onClick={() => handleDeleteClick(item)}
            />
            <FaCheckDouble
              data-tip="Accepter"
              role="button"
              color="#28a745"
              className="ibtn"
              onClick={() => handleValidateClick(item)}
            />
            <Link data-tip="Ouvrir le profile" to={`/profile/${item.username}`}>
              <FaEye className="ibtn" />
            </Link>
          </>
        ),
      },

      {
        name: "lastname",
        text: "Nom",
        type: "text",
      },
      {
        name: "firstname",
        text: "Prénom",
        type: "text",
      },
      {
        name: "email",
        text: "E-mail",
        type: "text",
      },
      {
        name: "mobile",
        text: "Mobile",
        type: "link",
        href: (item) => "tel://" + item.mobile,
      },
      {
        name: "role",
        text: "Role",
        type: "text",
      },
      {
        name: "username",
        text: "ID",
        type: "text",
      },
      {
        name: "wilaya",
        text: "wilaya",
        type: "text",
      },
      {
        name: "createdAt",
        text: "crée le",
        type: "custom",
        href: (item) => (
          <span>{moment(item.createdAt).format("YYYY-MM-DD hh:mm")}</span>
        ),
      },
    ],
    []
  );

  const load = (filters = defaultFilters) => {
    dispatch(LOAD_REQUESTS_LIST(filters));
  };

  useEffect(() => {
    load();
    return () => {
      dispatch(SET_REQUESTS_LIST({ list: [], total: 0 }));
    };
  }, []);

  const gopage = (page) => {
    load({
      ...defaultFilters,
      skip: page * defaultFilters.limit,
    });
  };

  useEffect(() => {
    ReactTooltip.rebuild();
  }, [listrequests]);

  return (
    <Layout>
      <Header title="les demandes" />

      <div className="dashboard">
        <div className="leftside"></div>

        <div className="content">
          <TABLE
            caption={`liste des demandes`}
            cols={cols}
            data={listrequests}
            total={totalRequests}
            perpage={defaultFilters.limit}
            gopage={gopage}
          />
        </div>
      </div>

      <ReactTooltip key={`${Math.floor(Math.random() * 9999).toString(16)}`} />
    </Layout>
  );
}

export default ListRequests;
