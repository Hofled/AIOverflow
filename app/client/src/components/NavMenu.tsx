import { useReducer } from 'react';
import { Collapse, Navbar, NavbarBrand, NavbarToggler, NavItem, NavLink } from 'reactstrap';
import { Link } from 'react-router-dom';
import './NavMenu.css';

interface State {
  collapsed: boolean
}

type NavAction =
  | { type: "toggleCollapsed"; };

const initialState = { collapsed: true };

function stateReducer(state: State, action: NavAction): State {
  switch (action.type) {
    case "toggleCollapsed":
      return { ...state, collapsed: !state.collapsed };
    default:
      throw new Error("Unknown action");
  }
}

export default function NavMenu() {
  const [state, dispatch] = useReducer(stateReducer, initialState);

  const toggleNavbar = () => { dispatch({ type: "toggleCollapsed" }) }

  return (
    <header>
      <Navbar className="navbar-expand-sm navbar-toggleable-sm ng-white border-bottom box-shadow" container light>
        <NavbarBrand tag={Link} to="/">AIOverflow</NavbarBrand>
        <NavbarToggler onClick={toggleNavbar} className="mr-2" />
        <Collapse className="d-sm-inline-flex flex-sm-row-reverse" isOpen={!state.collapsed} navbar>
          <ul className="navbar-nav flex-grow">
            <NavItem>
              <NavLink tag={Link} className="text-dark" to="/">Home</NavLink>
            </NavItem>
            <NavItem>
              <NavLink tag={Link} className="text-dark" to="/weatherForecast">Weather</NavLink>
            </NavItem>
          </ul>
        </Collapse>
      </Navbar>
    </header>
  )
}
