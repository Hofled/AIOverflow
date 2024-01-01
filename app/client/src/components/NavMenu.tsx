import { Component, useReducer } from 'react';
import { Button, Collapse, Navbar, NavbarBrand, NavbarToggler, NavItem, NavLink } from 'reactstrap';
import { Link } from 'react-router-dom';
import './NavMenu.css';
import LoginModal from './Authorization/Login/LoginModal';

interface State {
  collapsed: boolean
  isLoginModalOpen: boolean
}

export default class NavMenu extends Component<{}, State> {
  constructor(props: {}) {
    super(props);

    this.state = {
      collapsed: true,
      isLoginModalOpen: false,
    };
  }

  toggleLoginModal = () => {
    this.setState({ isLoginModalOpen: !this.state.isLoginModalOpen });
  }

  render() {
    return (
      <header>
        <Navbar className="navbar-expand-sm navbar-toggleable-sm ng-white border-bottom box-shadow" container light>
          <NavbarBrand tag={Link} to="/">AIOverflow</NavbarBrand>
          <NavbarToggler onClick={() => this.setState({ collapsed: !this.state.collapsed })} className="mr-2" />
          <Collapse className="d-sm-inline-flex flex-sm-row-reverse" isOpen={!this.state.collapsed} navbar>
            <ul className="navbar-nav flex-grow">
              <NavItem>
                <NavLink tag={Link} className="text-dark" to="/">Home</NavLink>
              </NavItem>
              <NavItem>
                <NavLink tag={Link} className="text-dark" to="/weatherForecast">Weather</NavLink>
              </NavItem>
              <NavItem>
                <Button color="primary" className="text-dark" onClick={this.toggleLoginModal}>Login</Button>
              </NavItem>
            </ul>
          </Collapse>
        </Navbar>

        <LoginModal
          isOpen={this.state.isLoginModalOpen}
          toggle={this.toggleLoginModal}
          onLogin={() => console.log('Login completed')}
          onRegister={() => console.log('Registration completed')} />
      </header>
    )
  }
}
