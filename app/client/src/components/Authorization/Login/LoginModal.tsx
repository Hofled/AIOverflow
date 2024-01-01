import { Component, ChangeEvent, FormEvent } from 'react';
import { Button, Modal, ModalHeader, ModalBody, Form, FormGroup, Label, Input, Alert, ModalFooter } from 'reactstrap';
import authService from '../../../services/auth/service';
import { AuthResultStatus } from '../../../services/auth/models';

// Define the LoginProps interface
interface LoginProps {
  isOpen: boolean;
  toggle: () => void;
  onLogin?: (username: string) => void;
  onRegister?: (username: string) => void;
}

// Define the LoginState interface
interface LoginState {
  username: string;
  password: string;
  error?: string;
  loggedIn: boolean;
  successMessage?: string;
}

// Define the Login component as a class component
class Login extends Component<LoginProps, LoginState> {
  constructor(props: LoginProps) {
    super(props);
    this.state = {
      username: '',
      password: '',
      loggedIn: false
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
    const result = await authService.login(username, password);
    switch (result.status) {
      case AuthResultStatus.Success:
        this.setState({ error: undefined, loggedIn: true, successMessage: result.message });
        this.props.onLogin && this.props.onLogin(this.state.username);
        break;
      case AuthResultStatus.Fail:
        this.setState({ error: result.message, loggedIn: false });
        break;
      default:
        this.setState({ error: "Unrecognized authentication result", loggedIn: false });
        break;
    }
  };

  handleRegister = async () => {
    const result = await authService.register(this.state.username, this.state.password);
    if (result.status != AuthResultStatus.Success) {
      this.setState({ error: result.message, loggedIn: false });
      return;
    }
    this.props.onRegister && this.props.onRegister(this.state.username);
  };

  getFooterContent = (): React.ReactElement => {
    if (this.state.error) { return <Alert color="danger">{this.state.error}</Alert> }
    else if (this.state.loggedIn && this.state.successMessage) { return <Alert color="success">{this.state.successMessage}</Alert> }
    return <></>;
  }

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
        {this.getFooterContent()}
      </Modal>
    );
  }
}

export default Login;
