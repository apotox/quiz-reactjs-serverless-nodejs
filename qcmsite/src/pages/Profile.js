import moment from "moment";
import React, { useEffect, useState } from "react";
import {
  FaCheckCircle,
  FaPhoneAlt,
  FaUserAlt,
  FaUserCircle,
} from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { LOAD_PROFILE } from "../actions/profile.actions";
import Header from "../components/Header";
import Layout from "../components/Layout";
import Empty from "./Empty";

function Profile() {
  const { profile } = useSelector((state) => state.profileReducer);
  const dispatch = useDispatch();
  let { id } = useParams();


 // const {edited,setEdited} = useState(profile)

  useEffect(() => {
    if (id) {
      dispatch(LOAD_PROFILE(id));
    }
  }, [id]);

  if (!profile) return <Empty />;
  return (
    <Layout>
      <Header title={profile.fullname} />

      <div className="dashboard">
        <div className="profile">
          <div className="head">
            <div className="pic">
              <FaUserCircle size="96" color="#ccc" />
            </div>
            <div className="infos">
              <h4>
                {profile.fullname}{" "}
                {profile.isActive ? (
                  <FaCheckCircle color="#03A9F4" size="1.2rem" />
                ) : (
                  ""
                )}
              </h4>
              <a href={`tel://${profile.mobile}`}>
                {" "}
                <FaPhoneAlt /> {profile.mobile}
              </a>
              <p className="date">
                {profile.wilaya} - crée le{" "}
                {moment(profile.createdAt).format("YYYY-MM-DD hh:mm")}
              </p>
            </div>
          </div>

          <div className="content">
            <ul>
              <li>Prénom: {profile.firstname}</li>
              <li>Nom: {profile.lastname}</li>

              <li>Adress: {profile.address}</li>

              <li>E-mail: {profile.email}</li>

              <li>Département: {profile.wilaya}</li>

              <li>
                Role: <select value={profile.role}>
                  <option value="student">Étudiant(e)</option>
                  {/* <option value="admin">Administrateur</option> */}
                </select>
              </li>

              <li>
                Inscription:{" "}
                {moment(profile.createdAt).format("YYYY-MM-DD hh:mm")}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Profile;
