import React, { Component } from 'react';
import { Card, CardBody, CardTitle, CardText, Row, Col, Form, FormGroup, Label, Input, Button } from 'reactstrap';
import { Post as PostProps, UpdatePost, Comment } from "../../../services/posts/models";
import { LoaderDataProp, withLoaderData } from '../../../routing/wrappers';
import { Status } from '../../../services/axios';
import postsService, { PostUpdater } from '../../../services/posts/service';
import PostComment from './Comment/Comment';

interface PostState {
    isEditing: boolean;
    title: string;
    lastSetTitle: string;
    content: string;
    lastSetContent: string;
    newComment: string;
    comments: Comment[];
}

type Props = LoaderDataProp<PostProps> & PostUpdater;

class Post extends Component<Props, PostState> {
    constructor(props: Props) {
        super(props);
        this.state = {
            title: '',
            lastSetTitle: '',
            content: '',
            lastSetContent: '',
            newComment: '',
            isEditing: false,
            comments: [],
        };
    }

    componentDidMount(): void {
        let data = this.props.loaderData;
        const { title, content, comments } = data;
        comments.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        this.setState({ title: title, content: content, comments: comments, lastSetTitle: title, lastSetContent: content });
    }

    handleEdit = () => {
        this.setState({ isEditing: true });
    };

    handleSave = async () => {
        const updatedPost: UpdatePost = {
            title: this.state.title,
            content: this.state.content,
        }

        const res = await this.props.updatePost(this.props.loaderData.id, updatedPost);
        if (res.status !== Status.Success) {
            console.error("failed updating post");
            this.setState({ title: this.state.lastSetTitle, content: this.state.lastSetContent, isEditing: false });
            return;
        }

        this.setState({ lastSetTitle: this.state.title, lastSetContent: this.state.content, isEditing: false });
    };

    handleCancel = () => {
        const { lastSetTitle, lastSetContent } = this.state;
        this.setState({ title: lastSetTitle, content: lastSetContent, isEditing: false });
    };

    handleCommentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ newComment: e.target.value });
    };

    handleSubmitComment = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const response = await postsService.addPostComment({ postId: this.props.loaderData.id, content: this.state.newComment });
        if (response.status !== Status.Success) {
            console.error("failed adding comment");
            return;
        }

        let newCommentState = {};

        if (response.result) {
            // Add the new comment to the list of comments
            newCommentState = { comments: [...this.state.comments, response.result] };
        }

        // After submitting the comment, you might want to clear the comment input
        this.setState({ ...this.state, ...newCommentState, newComment: '' });
    };


    handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ title: e.target.value });
    };

    handleContentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ content: e.target.value });
    };

    render() {
        let data = this.props.loaderData;
        const { id, author } = data;
        const { newComment, isEditing, title, content } = this.state;

        return (
            <div className="my-4 mx-4">
                <Card className="my-4 mx-4">
                    <CardBody>
                        {isEditing ? (
                            <Form>
                                <FormGroup>
                                    <Label for={`title-${id}`}>Title:</Label>
                                    <Input type="text" id={`title-${id}`} value={title} onChange={this.handleTitleChange} />
                                </FormGroup>
                                <FormGroup>
                                    <Label for={`content-${id}`}>Content:</Label>
                                    <Input type="textarea" id={`content-${id}`} value={content} onChange={this.handleContentChange} />
                                </FormGroup>
                                <Button color="primary" onClick={this.handleSave}>Save</Button>{' '}
                                <Button color="secondary" onClick={this.handleCancel}>Cancel</Button>
                            </Form>
                        ) : (
                            <>
                                <CardTitle tag="h5">{title}</CardTitle>
                                <CardText>{content}</CardText>
                                <div>
                                    <small>Posted by {author.name}</small>
                                </div>
                                <Button color="primary" onClick={this.handleEdit}>Edit</Button>
                            </>
                        )}
                    </CardBody>
                </Card>
                <div className="mt-4">
                    <h6>Comments</h6>
                    {this.state.comments?.map(comment => (
                        <Row key={comment.id}>
                            <Col sm="12" key={comment.id}>
                                <PostComment
                                    key={comment.id}
                                    author={comment.author}
                                    content={comment.content}
                                    createdAt={comment.createdAt}
                                    editedAt={comment.editedAt}
                                    id={comment.id}
                                ></PostComment>
                            </Col>
                        </Row>
                    ))}
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

export default withLoaderData<PostProps>(Post);
