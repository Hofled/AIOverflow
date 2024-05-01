import { Component, ChangeEvent, FormEvent } from 'react';
import { Button, Modal, ModalHeader, ModalBody, Form, FormGroup, Label, Input, Alert, Container, Row } from 'reactstrap';
import authService from '../../../services/auth/service';
import { Status } from '../../../services/axios';

// Define the LoginProps interface
interface LoginProps {
  toggle: () => void;
  onLogin?: () => void;
  onRegister?: () => void;
}

// Define the LoginState interface
interface LoginState {
  usernameToSubmit: string;
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
      usernameToSubmit: '',
      password: '',
      loggedIn: false
    };
  }

  componentWillUnmount(): void {
    this.setState({
      error: undefined,
      successMessage: undefined
    })
  }

  // Function to handle changes in the username input
  handleUsernameChange = (e: ChangeEvent<HTMLInputElement>) => {
    this.setState({ usernameToSubmit: e.target.value });
  };

  // Function to handle changes in the password input
  handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    this.setState({ password: e.target.value });
  };

  handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    const { usernameToSubmit, password } = this.state;
    const result = await authService.login(usernameToSubmit, password);
    switch (result.status) {
      case Status.Success:
        this.setState({ error: undefined, loggedIn: true, successMessage: "Successfully logged in!" });
        this.props.onLogin && this.props.onLogin();
        break;
      case Status.Fail:
        this.setState({ error: result.error, loggedIn: false });
        break;
      default:
        this.setState({ error: "Unrecognized authentication result", loggedIn: false });
        break;
    }
  };

  handleRegister = async () => {
    const result = await authService.register(this.state.usernameToSubmit, this.state.password);
    if (result.status !== Status.Success) {
      this.setState({ error: result.error, loggedIn: false });
      return;
    }
    this.props.onRegister && this.props.onRegister();
  };

  getFooterContent = (): React.ReactElement => {
    if (this.state.error) {
      return <Alert color="danger">{this.state.error}</Alert>;
    }
    else if (this.state.loggedIn && this.state.successMessage) {
      return <Alert color="success">{this.state.successMessage}</Alert>;
    }
    return <></>;
  }

  render() {
    const { toggle } = this.props;
    const { usernameToSubmit, password } = this.state;

    return (
      <Modal isOpen={true} toggle={toggle}>
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
                value={usernameToSubmit}
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
            <Container>
              <Row>
                <Button color="primary" type="submit">
                  Login
                </Button>
                <Button color="secondary" onClick={this.handleRegister}>
                  Register
                </Button>
              </Row>
            </Container>
          </Form>
        </ModalBody>
        {this.getFooterContent()}
      </Modal>
    );
  }
}

export default Login;
