import React, { useEffect, useMemo } from "react";
import Header from "../components/Header";
import Layout from "../components/Layout";
import { useDispatch, useSelector } from "react-redux";
import { LOAD_USERS_LIST, RESET_USER_PASSWORD, SET_USERS_LIST } from "../actions/app.actions";
import TABLE from "../components/TABLE";
import { FaEye, FaLock, FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";
import ReactTooltip from "react-tooltip";
import { OPEN_DIALOG } from "../actions/dialog.actions";
import { DELETE_USER_BY_ID } from "../actions/requestId.actions";

const defaultFilters = {
  limit: 15,
  skip: 0,
};

/**
 * COMPONENT
 */
function ListUsers() {
  const dispatch = useDispatch();

  const { listusers, totalUsers } = useSelector((state) => state.appReducer);
  const load = (filters = defaultFilters) => {
    dispatch(LOAD_USERS_LIST(filters));
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
              onClick={() => handleDeleteClick(item)}
              data-tip="Supprimer"
              role="button"
              color="#fd3a69"
              className="ibtn"
            />
            <FaLock
              data-tip="Changer le mot de passe"
              role="button"
              color="#4CAF50"
              className="ibtn"
              onClick={() => handleChangePassword(item)}
            />
            <Link data-tip="Ouvrir le profile" to={`/profile/${item.username}`}>
              {" "}
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
        text: "role",
        type: "text",
      },
      {
        name: "username",
        text: "ID",
        type: "text",
      },
      {
        name: "wilaya",
        text: "Department",
        type: "text",
      },
    ],
    []
  );

  const handleChangePassword = (item) => {
    dispatch(
      OPEN_DIALOG({
        content: `un nouveau mot de passe sera généré de manière aléatoire pour <b>${item.username}</b>`,
        title: "Changer le mot de passe?",
        className: "resetpassword",
        actions: [
          {
            label: "Oui, changer le mot de passe",
            fn: () => dispatch(RESET_USER_PASSWORD(item.id)),
          },
        ],
      })
    );
  };
  const handleDeleteClick = (item) => {
    dispatch(
      OPEN_DIALOG({
        content: `êtes-vous sûr de vouloir supprimer le compte de <b>${item.fullname}</b> (${item.username})`,
        title: `Confirmation `,
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

  useEffect(() => {
    load();
    return () => {
      dispatch(SET_USERS_LIST({ list: [], total: 0 }));
    };
  }, []);

  const gopage = (page) => {
    load({
      ...defaultFilters,
      skip: page * defaultFilters.limit,
    });
  };

  const gosearch = (query) => {
    load({
      ...defaultFilters,
      query,
    });
  };

  return (
    <Layout>
      <Header title="Les Utilisateurs" />

      <div className="dashboard">
        <div className="leftside"></div>
        <div className="content">
          <TABLE
            caption={`liste des utilisateurs actifs`}
            gosearch={gosearch}
            cols={cols}
            data={listusers}
            total={totalUsers}
            perpage={defaultFilters.limit}
            gopage={gopage}
          />
        </div>
      </div>

      <ReactTooltip key={`${Math.floor(Math.random() * 9999).toString(16)}`} />
    </Layout>
  );
}

export default ListUsers;
