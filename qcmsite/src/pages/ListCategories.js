import React, { useEffect, useMemo } from "react";
import Header from "../components/Header";
import Layout from "../components/Layout";
import { useDispatch, useSelector } from "react-redux";

import TABLE from "../components/TABLE";
import { FaEdit, FaEye, FaTrash} from 'react-icons/fa'
import { Link } from "react-router-dom";
import ReactTooltip from "react-tooltip";
import { DELETE_CATEGORY_BY_ID, LOAD_CATEGORIES_LIST, SET_CATEGORIES_LIST } from "../actions/category.actions";
import { OPEN_DIALOG } from "../actions/dialog.actions";
const defaultFilters = {
  limit: 10,
  skip: 0,
};


function ListCategories() {
  const dispatch = useDispatch();


  const { listcategories,totalCategories } = useSelector((state) => state.appReducer);

  const cols = useMemo(()=>[
    {
      name: "action",
      text: "actions",
      type: "custom",
      
      k: "1",
      href: (item) => (
        <>
          <FaTrash onClick={()=>handleDeleteClick(item)} data-tip="Supprimer" role="button" color="#fd3a69" className="ibtn" />
          <Link   to={`/category/${item._id}`}> <FaEdit data-tip="Editer" color="#4CAF50" className="ibtn" /></Link>
        </>
      ),
    },
    {
      name: "label",
      text: "Désignation",
      type: "text",
    },
    {
      name: "description",
      text: "Description",
      type: "text"
    }
  ],[])

  const load = (filters = defaultFilters) => {
    dispatch(LOAD_CATEGORIES_LIST(filters));
  };

  useEffect(() => {
    load();
    return () => {
      dispatch(SET_CATEGORIES_LIST({list:[],total:0}));
    };
  }, []);

  // useEffect(() => {
  //   console.log("listcategories", listcategories);
  // }, [listcategories]);
  const gopage= (page)=>{
    load({
      ...defaultFilters,
      skip: page * defaultFilters.limit
    })
  }

  const handleDeleteClick = (item) => {
    dispatch(
      OPEN_DIALOG({
        content: `cette matière sera supprimée <b>${item.label}</b>`,
        title: "Supprimer? ",
        className: "supprimer",
        actions: [
          {
            label: "Oui, supprimer",
            fn: () => dispatch(DELETE_CATEGORY_BY_ID(item.id, load)),
          },
        ],
      })
    );
  };

  return (
    <Layout>
      <Header title="Categories" /> 

      <div className="dashboard">
        <div className="leftside"></div>

        <div className="content">
          <TABLE caption={`liste des matières (${totalCategories})`} cols={cols} data={listcategories} total={totalCategories} perpage={defaultFilters.limit} gopage={gopage} />
        </div>

        <ReactTooltip key={`x-${Math.floor(Math.random()*99199).toString(16)}`}/>
      </div>

      
    </Layout>
  );
}

export default ListCategories;
