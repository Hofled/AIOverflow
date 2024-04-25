import { Component } from 'react';
import { Card, CardBody, CardTitle, CardText } from 'reactstrap';
import { Comment } from "../../../../services/posts/models";

class PostComment extends Component<Comment> {
  render() {
    const { content, author, createdAt, editedAt } = this.props;

    return (
      <Card className="mb-3">
        <CardBody>
          <CardTitle className="font-weight-bold">{author.name}</CardTitle>
          <CardText>{content}</CardText>
          <div className="text-muted">Created At: {new Date(createdAt).toLocaleString()}</div>
          {editedAt && <div className="text-muted">Edited At: {new Date(editedAt).toLocaleString()}</div>}
        </CardBody>
      </Card>
    );
  }
}

export default PostComment;
