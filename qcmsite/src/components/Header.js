import React, { useState } from "react";
import { FaProcedures, FaRoute, FaUser } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  NavbarText,
  Badge,
  Button,
} from "reactstrap";
import { DEL_USER } from "../actions/login.actions";
import logo from "../images/logo-v2-512.png";

function Header({ title }) {
  const [isOpen, setisOpen] = useState(false);
  const { user, connected } = useSelector((state) => state.appReducer);
  const dispatch = useDispatch();
  const toggle = () => setisOpen(!isOpen);
  const history = useHistory();

  return (
    <Navbar expand="md" color={title ? "dark" : ""}>
      <NavbarBrand href="/">
        <div className="logo-container">
          <img alt="vtc formation logo" src={logo} />

          {title ? (
            <div onClick={() => history.goBack()} className="desc">
              {title}
            </div>
          ) : (
            ""
          )}
        </div>
      </NavbarBrand>

      <NavbarToggler onClick={toggle} />
      <Collapse isOpen={isOpen} navbar>
        <Nav className="mr-auto" navbar>
          {connected && user.role == "admin" && (
            <UncontrolledDropdown nav inNavbar>
              <DropdownToggle nav caret>
                Espace Administratif
              </DropdownToggle>
              <DropdownMenu right>
                <DropdownItem typeof="a" href="/#/list_users">
                  les Utilisateurs
                </DropdownItem>
                <DropdownItem typeof="a" href="/#/list_requests">
                  Demandes d'inscription
                </DropdownItem>
                <DropdownItem divider />
                <DropdownItem typeof="a" href="/#/list_qcms">
                  QCMs
                </DropdownItem>

                <DropdownItem typeof="a" href="/#/qcm">
                  Nouveau QCM
                </DropdownItem>

                <DropdownItem divider />
                <DropdownItem typeof="a" href="/#/list_categories">
                  Matières
                </DropdownItem>

                <DropdownItem typeof="a" href="/#/category">
                  Nouvelle Matière
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
          )}

          {connected && (
            <>
              <NavItem>
                <FaRoute />
                <NavLink href="/#/progress">Progression</NavLink>
              </NavItem>
              <NavItem>
                <FaUser />
                <NavLink href={`/#/me`}>Profile</NavLink>
              </NavItem>
            </>
          )}

          {!connected && (
            <>
              <NavItem>
                <NavLink href="/#/request">Crée un Compte</NavLink>
              </NavItem>

              <NavItem>
                <NavLink href="/#/login">Connexion</NavLink>
              </NavItem>
            </>
          )}
        </Nav>

        {connected && (
          <NavbarText>
            <Button
              onClick={() => {
                window.location.href = "/";
                dispatch(DEL_USER());
              }}
              color="danger"
            >
              Déconnexion
            </Button>
          </NavbarText>
        )}
      </Collapse>
    </Navbar>
  );
}

export default Header;
