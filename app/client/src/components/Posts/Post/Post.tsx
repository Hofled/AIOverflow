import React, { Component } from 'react';
import { Card, CardBody, CardTitle, CardText, Row, Col, Form, FormGroup, Label, Input, Button } from 'reactstrap';
import { Post as PostProps } from "../../../services/posts/models";
import { LoaderDataProp, withLoaderData } from '../../../routing/wrappers';

interface Comment {
    id: number;
    content: string;
}

interface PostState {
    newComment: string;
}

type PostModel = PostProps & { comments: Comment[] };

type Props = LoaderDataProp<PostModel>;

class Post extends Component<Props, PostState> {
    constructor(props: Props) {
        super(props);
        this.state = {
            newComment: '',
        };
    }

    handleCommentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ newComment: e.target.value });
    };

    handleSubmitComment = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // Here you would submit the new comment to your backend API
        console.log('Submitted comment:', this.state.newComment);
        // After submitting the comment, you might want to clear the comment input
        this.setState({ newComment: '' });
    };

    render() {
        let data = this.props.loaderData;
        const { id, title, content, author, comments } = data;
        const { newComment } = this.state;

        return (
            <div className="my-4 mx-4">
                <Card className="my-4 mx-4">
                    <CardBody>
                        <CardTitle tag="h5">{title}</CardTitle>
                        <CardText>{content}</CardText>
                        <div>
                            <small>Posted by {author.name}</small>
                        </div>
                    </CardBody>
                </Card>
                <div className="mt-4">
                <h6>Comments</h6>
                <Row>
                    <Col sm="12">
                        <ul className="list-unstyled">
                            {comments?.map(comment => (
                                <li key={comment.id}>{comment.content}</li>
                            ))}
                        </ul>
                    </Col>
                </Row>
                </div>
                <Row>
                    <Col sm="12">
                        <Form onSubmit={this.handleSubmitComment}>
                            <FormGroup>
                                <Label for={`comment-${id}`}>Add a comment:</Label>
                                <Input
                                    type="text"
                                    name={`comment-${id}`}
                                    id={`comment-${id}`}
                                    value={newComment}
                                    onChange={this.handleCommentChange}
                                />
                            </FormGroup>
                            <Button type="submit" color="primary">Submit</Button>
                        </Form>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default withLoaderData<PostModel>(Post);
