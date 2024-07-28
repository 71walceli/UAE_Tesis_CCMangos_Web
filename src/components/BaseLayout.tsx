import React, { ReactNode, useState } from "react";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import Offcanvas from "react-bootstrap/Offcanvas";
import Accordion from 'react-bootstrap/Accordion';
import ListGroup from 'react-bootstrap/ListGroup';

import banner from './../assets/brand.png'
import { useAuth } from "./../context/AuthContext";


interface BaseLayoutProps {
  PageName?: string;
  children: ReactNode;
}

export const BaseLayout: React.FC<BaseLayoutProps> = (
  props: BaseLayoutProps
) => {
  const { children, PageName } = props;
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleLinkClick = () => setShow(true);
  const { logout, UserData } = useAuth();
    
  return (
    <>
      {/* TODO On computer size, always display main nav. */}
      <Offcanvas show={show} onHide={handleClose}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Plant Trace</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <SidebarMenu />
        </Offcanvas.Body>
      </Offcanvas>
      <Navbar collapseOnSelect expand="lg" className="bg-body-tertiary">
        <div className="container-fluid">
          <Navbar.Brand onClick={handleShow}>
            <i
              className="bi bi-list"
              style={{ fontSize: "2rem", color: "black" }}
            ></i>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Navbar.Brand href="/">
              {!PageName ? <img
                src={banner}
                width="100"
                height="100%"
                className="d-inline-block align-top"
                alt="React Bootstrap logo"
              /> : <h5>{PageName}</h5>}


            </Navbar.Brand>
            <Nav className="me-auto">
             {/*  <Nav.Link href="#features">Features</Nav.Link>
              <Nav.Link href="#pricing">Pricing</Nav.Link> */}

            </Nav>
            <Nav>
              <Nav.Link disabled>
              {UserData?.rol}
              </Nav.Link>
              <NavDropdown title={<><i className="bi bi-person-circle text-dark icon-username"></i> {UserData?.user} </>} id="navbarScrollingDropdown">
                <NavDropdown.Item href="/auth/porfile">Perfil</NavDropdown.Item>
                <NavDropdown.Item href="#action4">
                  Admin
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item
                  href="#action5"
                  onClick={() => {
                    logout();
                    handleLinkClick();
                  }}
                >
                  Cerrar sesión
                </NavDropdown.Item>
              </NavDropdown>
              {/* <Nav.Link disabled>
                Producción
              </Nav.Link> */}
            </Nav>
          </Navbar.Collapse>
        </div>
      </Navbar>
      <main>{children}</main>
    </>
  );

  function SidebarMenu() {
    return <Accordion>
      <Accordion.Item eventKey="1">
        <Accordion.Header>
          <i className="bi bi-signpost-2"></i> &nbsp;Producción
        </Accordion.Header>
        <Accordion.Body>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <Nav.Link href="/weather/sync">
                <i className="bi bi-lightning-charge-fill"></i>
                &nbsp;&nbsp;Datos edafoclimáticos
              </Nav.Link>
            </ListGroup.Item>
            <ListGroup.Item>
              <Nav.Link href="/crop/production">
                <i className="bi bi-lightning-charge-fill"></i>
                &nbsp;&nbsp;Cosechas
              </Nav.Link>
            </ListGroup.Item>
            <ListGroup.Item>
              <Nav.Link href="/crop/readings">
                <i className="bi bi-list-check"></i>
                &nbsp;&nbsp;Control de árboles
              </Nav.Link>
            </ListGroup.Item>
          </ListGroup>
        </Accordion.Body>
      </Accordion.Item>
      <Accordion.Item eventKey="2">
        <Accordion.Header>
          <i className="bi bi-graph-up-arrow"></i>
          &nbsp;Estimaciones
        </Accordion.Header>
        <Accordion.Body>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <Nav.Link href="/pred/analytics">
                <i className="bi bi-bar-chart-fill"></i>
                &nbsp;&nbsp;Estadísticas
              </Nav.Link>
            </ListGroup.Item>
            <ListGroup.Item>
              <Nav.Link href="/pred/averange">
                <i className="bi bi-graph-up"></i>
                &nbsp;&nbsp;Estimaciones
              </Nav.Link>
            </ListGroup.Item>
          </ListGroup>
        </Accordion.Body>
      </Accordion.Item>
      <Accordion.Item eventKey="3">
        <Accordion.Header>
          <i className="bi bi-person-gear"></i> &nbsp;Configuración
        </Accordion.Header>
        <Accordion.Body>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <Nav.Link href="/crop/areas">
                <i className="bi bi-map-fill"></i>
                &nbsp;&nbsp;Áreas
              </Nav.Link>
            </ListGroup.Item>
            <ListGroup.Item>
              <Nav.Link href="/crop/lots">
                <i className="bi bi-map-fill"></i>
                &nbsp;&nbsp;Lotes
              </Nav.Link>
            </ListGroup.Item>
            <ListGroup.Item>
              <Nav.Link href="/crop/trees">
                <i className="bi bi-tree-fill"></i>
                &nbsp;&nbsp;Árboles de Mango
              </Nav.Link>
            </ListGroup.Item>
            <ListGroup.Item>
              <Nav.Link href="/auth/users">
                <i className="bi bi-people-fill"></i>
                &nbsp;&nbsp;Usuarios
              </Nav.Link>
            </ListGroup.Item>
            <ListGroup.Item>
              <Nav.Link href="/crop/affection">
                <i className="bi bi-virus"></i>
                &nbsp;&nbsp;Enfermedad
              </Nav.Link>
            </ListGroup.Item>
            <ListGroup.Item>
              <Nav.Link href="/crop/variety">
                <i className="bi bi-dna"></i>
                &nbsp;&nbsp;Variedad
              </Nav.Link>
            </ListGroup.Item>
          </ListGroup>
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>;
  }
};
