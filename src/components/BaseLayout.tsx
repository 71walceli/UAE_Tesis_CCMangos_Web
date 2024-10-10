import React, { ReactNode } from "react";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import { Link } from "react-router-dom";

import { useAuth } from "./../context/AuthContext";


interface BaseLayoutProps {
  PageName?: string;
  children: ReactNode;
}

export const BaseLayout: React.FC<BaseLayoutProps> = (
  props: BaseLayoutProps
) => {
  const { children, PageName } = props;
  const { logout, UserData } = useAuth();

  const publicUrl = process.env.PUBLIC_URL || ""

  return (
    <>
      <Navbar collapseOnSelect expand="lg" className="bg-body-tertiary">
        <div className="container-fluid">
          <Link to={`${publicUrl}/home`}>
            <Navbar.Brand>
              <i className="bi bi-house" style={{ fontSize: "2rem", color: "black" }}/>
            </Navbar.Brand>
          </Link>
          <Navbar.Brand href="/">
            <h5>{PageName}</h5>
          </Navbar.Brand>
          
          <Nav>
            <Nav.Link disabled>
            {UserData?.rol}
            </Nav.Link>
            <NavDropdown id="navbarScrollingDropdown"
              title={<><i className="bi bi-person-circle text-dark icon-username" /> {UserData?.user} </>} 
            >
              <NavDropdown.Item href="/auth/porfile">Perfil</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#action5" onClick={() => logout()}>
                Cerrar sesión
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </div>
      </Navbar>
      <main>{children}</main>
    </>
  );
};
