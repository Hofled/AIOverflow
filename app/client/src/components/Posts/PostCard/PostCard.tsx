import React, { Component } from 'react';
import { Card, CardBody, CardTitle, CardText, Badge } from 'reactstrap';
import { Link } from 'react-router-dom';
import { postRoot } from '../../../routing/consts';
import { Post as PostProps } from "../../../services/posts/models";
import "./PostCard.css";

class PostCard extends Component<PostProps, {}> {
  render() {
    const { id, title, content, author, createdAt, editedAt, comments } = this.props;
    return (
      <Card className="mb-4">
        <div className="comment-count-badge">
          <Badge color="primary" pill>{comments.length}</Badge>
        </div>
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
