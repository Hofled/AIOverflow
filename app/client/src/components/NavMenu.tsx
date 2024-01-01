import { Component } from 'react';
import { Button, Collapse, Navbar, NavbarBrand, NavbarToggler, NavItem, NavLink } from 'reactstrap';
import { Link } from 'react-router-dom';
import './NavMenu.css';
import LoginModal from './Authorization/Login/LoginModal';
import Avatar from './Avatar/Avatar';
import authService from '../services/auth/service';

interface State {
  collapsed: boolean
  isLoginModalOpen: boolean
  loggedIn: boolean // TODO move to store
  username?: string // TODO move to store
}

export default class NavMenu extends Component<{}, State> {
  constructor(props: {}) {
    super(props);

    this.state = {
      collapsed: true,
      isLoginModalOpen: false,
      loggedIn: false
    };
  }

  async componentDidMount() {
    this.setState({ loggedIn: await authService.isAuthenticated() });
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
              {
                <NavItem>
                  {
                    !this.state.loggedIn ?
                      <Button color="primary" className="text-dark" onClick={this.toggleLoginModal}>Login</Button>
                      : <Avatar username={this.state.username || ""} size='md' />
                  }
                </NavItem>
              }
            </ul>
          </Collapse>
        </Navbar>

        <LoginModal
          isOpen={this.state.isLoginModalOpen}
          toggle={this.toggleLoginModal}
          onLogin={username => this.setState({ loggedIn: true, username })}
          onRegister={username => this.setState({ loggedIn: true, username })} />
      </header>
    )
  }
}
