import { Component, ChangeEvent, FormEvent } from 'react';
import { Button, Modal, ModalHeader, ModalBody, Form, FormGroup, Label, Input } from 'reactstrap';
import authService from '../../../services/authorization/service';
import { AuthenticationResultStatus } from '../../../services/authorization/models';

// Define the LoginProps interface
interface LoginProps {
  isOpen: boolean;
  toggle: () => void;
  onLogin?: () => void;
  onRegister?: () => void;
}

// Define the LoginState interface
interface LoginState {
  username: string;
  password: string;
}

// Define the Login component as a class component
class Login extends Component<LoginProps, LoginState> {
  constructor(props: LoginProps) {
    super(props);
    this.state = {
      username: '',
      password: '',
    };
  }

  // Function to handle changes in the username input
  handleUsernameChange = (e: ChangeEvent<HTMLInputElement>) => {
    this.setState({ username: e.target.value });
  };

  // Function to handle changes in the password input
  handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    this.setState({ password: e.target.value });
  };

  handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    const { username, password } = this.state;
    let result = await authService.signIn(username, password);
    switch (result.status) {
      case AuthenticationResultStatus.Success:
        this.props.onLogin && this.props.onLogin();
        break;
      case AuthenticationResultStatus.Fail:
        // TODO handle failed authentication, display error text
        break;
      default:
        console.error("Unrecognized authentication result");
        break;
    }

  };

  handleRegister = () => {
    this.props.onRegister && this.props.onRegister();
  };

  render() {
    const { isOpen, toggle } = this.props;
    const { username, password } = this.state;

    return (
      <Modal isOpen={isOpen} toggle={toggle}>
        <ModalHeader toggle={toggle}>Login</ModalHeader>
        <ModalBody>
          <Form onSubmit={this.handleLogin}>
            <FormGroup>
              <Label for="username">Username</Label>
              <Input
                type="text"
                name="username"
                id="username"
                placeholder="Username"
                value={username}
                onChange={this.handleUsernameChange}
              />
            </FormGroup>
            <FormGroup>
              <Label for="password">Password</Label>
              <Input
                type="password"
                name="password"
                id="password"
                placeholder="Password"
                value={password}
                onChange={this.handlePasswordChange}
              />
            </FormGroup>
            <Button color="primary" type="submit">
              Login
            </Button>
            <Button color="secondary" onClick={this.handleRegister}>
              Register
            </Button>
          </Form>
        </ModalBody>
      </Modal>
    );
  }
}

export default Login;
