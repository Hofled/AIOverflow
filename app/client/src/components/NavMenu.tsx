import { Component } from 'react';
import { Button, Collapse, Navbar, NavbarBrand, NavbarToggler, NavItem, NavLink } from 'reactstrap';
import { Link } from 'react-router-dom';
import './NavMenu.css';
import LoginModal from './Authorization/Login/LoginModal';
import Avatar from './Avatar/Avatar';
import authService from '../services/auth/service';
import { postRoutes } from '../routing/consts';

interface State {
  collapsed: boolean;
  isLoginModalOpen: boolean;
  loggedIn: boolean;
}

interface Props {
}

class NavMenu extends Component<Props, State> {
  private authServiceSubID?: number = undefined;

  constructor(props: Props) {
    super(props);

    this.state = {
      collapsed: true,
      isLoginModalOpen: false,
      loggedIn: false
    };
  }

  async componentDidMount() {
    this.authServiceSubID = authService.subscribe((authenticated) => {
      this.setState({ loggedIn: authenticated });
    });

    const loggedIn = authService.isAuthenticated();
    this.setState({ loggedIn: loggedIn });
  }

  componentWillUnmount(): void {
    if (this.authServiceSubID === undefined) return;
    authService.unsubscribe(this.authServiceSubID);
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
                <NavLink tag={Link} className="text-dark" to={`${postRoutes.all}`}>Posts</NavLink>
              </NavItem>
              <NavItem>
                <NavLink tag={Link} className="text-dark" to="/">Home</NavLink>
              </NavItem>
              {
                <NavItem>
                  {
                    !this.state.loggedIn ?
                      <Button color="primary" className="text-dark" onClick={this.toggleLoginModal}>Login</Button>
                      : <Avatar size='md' />
                  }
                </NavItem>
              }
            </ul>
          </Collapse>
        </Navbar>

        {this.state.isLoginModalOpen ?
          <LoginModal
            toggle={this.toggleLoginModal}
            onLogin={() => this.setState({ loggedIn: true })}
            onRegister={() => this.setState({ loggedIn: true })} /> : null}
      </header>
    )
  }
}

export default NavMenu;