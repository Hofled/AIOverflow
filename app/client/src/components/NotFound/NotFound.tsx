import "./NotFound.css"
import { Component } from 'react'
import { Link } from 'react-router-dom'
import { Button, Col, Container, Row } from 'reactstrap'

type Props = {}

type State = {}

export default class NotFound extends Component<Props, State> {
  state = {}

  render() {
    return (
      <Container className="not-found">
        <Row className="text-center">
          <Col>
            <h1 className="display-1">404</h1>
            <p className="lead">Page Not Found</p>
            <p>The page you are looking for does not exist.</p>
            <Link to="/">
              <Button color="primary">Go Home</Button>
            </Link>
          </Col>
        </Row>
      </Container>
    )
  }
}