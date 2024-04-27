import { Component } from 'react';
import { Card, CardBody, CardTitle, CardText, Badge, Row, Col } from 'reactstrap';
import { Link } from 'react-router-dom';
import { postRoot } from '../../../routing/consts';
import { Post as PostProps } from "../../../services/posts/models";
import { FaThumbsUp, FaThumbsDown } from 'react-icons/fa';
import "./PostCard.css";

class PostCard extends Component<PostProps, {}> {
  render() {
    const { id, title, content, author, createdAt, editedAt, comments, likes } = this.props;
    const likesCount = likes.filter(like => like.score === 1).length;
    const dislikesCount = likes.filter(like => like.score === -1).length;

    return (
      <Card className="mb-4">
        <Row className="post-header">
          <Col xs="auto" className="d-flex align-items-center">
            <div className="like-indicator">
              <FaThumbsUp />
              <span>{likesCount}</span>
            </div>
          </Col>
          <Col xs="auto" className="d-flex align-items-center">
            <div className="like-indicator">
              <FaThumbsDown />
              <span>{dislikesCount}</span>
            </div>
          </Col>
          <Col xs="auto" className="d-flex align-items-center">
            <div className="comment-count-badge">
              <Badge color="primary" pill>{comments.length}</Badge>
            </div>
          </Col>
        </Row>
        <CardBody>
          <CardTitle>
            <Link className="text-dark" to={`${postRoot}/${id}`}>{title}</Link>
          </CardTitle>
          <CardText>{content}</CardText>
          <div>
            <small>Posted by {author.name} on {new Date(createdAt).toLocaleString()}</small>
            {editedAt && (
              <small style={{ marginLeft: '0.5rem' }}>
                | Last edited on {new Date(editedAt).toLocaleString()}
              </small>
            )}
          </div>
        </CardBody>
      </Card>
    );
  }
}

export default PostCard;
