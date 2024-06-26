import React, { Component } from 'react';
import { Card, CardBody, CardTitle, CardText, Row, Col, Form, FormGroup, Label, Input, Button, Badge } from 'reactstrap';
import { Post as PostProps, UpdatePost, Like } from "../../../services/posts/models";
import { Comment } from "../../../services/comments/models";
import { LoaderDataProp, withLoaderData } from '../../../routing/wrappers';
import { Status } from '../../../services/axios';
import postsService, { PostUpdater } from '../../../services/posts/service';
import PostComment from './Comment/Comment';
import { FaThumbsDown, FaThumbsUp } from 'react-icons/fa';
import "./Post.css";
import { RootState } from '../../../state/reducers';
import { connect } from 'react-redux';
import commentsService from '../../../services/comments/service';

interface PostState {
    isEditing: boolean;
    title: string;
    lastSetTitle: string;
    content: string;
    lastSetContent: string;
    newComment: string;
    comments: Comment[];
    likes: Map<number, Like>;
    likeCount: number;
    dislikeCount: number;
    userLiked: boolean;
    userDisliked: boolean;
}

const mapStateToProps = (state: RootState) => ({
    userId: state.identity.id,
});

type Props = LoaderDataProp<PostProps> & PostUpdater & { userId: number };

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
            likes: new Map<number, Like>(),
            likeCount: 0,
            dislikeCount: 0,
            userLiked: false,
            userDisliked: false,
        };
    }

    componentDidMount(): void {
        let data = this.props.loaderData;
        const { title, content, comments, likes } = data;
        const likeCount = Array.from(likes.values()).reduce((acc, cur) => cur.score === 1 ? acc + 1 : acc, 0);
        const dislikeCount = Array.from(likes.values()).reduce((acc, cur) => cur.score === -1 ? acc + 1 : acc, 0);
        const userLiked = likes.get(this.props.userId)?.score === 1;
        const userDisliked = likes.get(this.props.userId)?.score === -1;
        comments.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        this.setState({
            title: title,
            content: content,
            comments: comments,
            likes: likes,
            likeCount: likeCount,
            dislikeCount: dislikeCount,
            userLiked: userLiked,
            userDisliked: userDisliked,
            lastSetTitle: title,
            lastSetContent: content
        });
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
        const response = await commentsService.addPostComment({ postId: this.props.loaderData.id, content: this.state.newComment });
        if (response.status !== Status.Success) {
            console.error("failed adding comment");
            return;
        }

        let newCommentState = {};

        if (response.result) {
            // Add the new comment to the list of comments
            newCommentState = { comments: [...this.state.comments, response.result] };
        }

        this.setState({ ...newCommentState, newComment: '' });
    };


    handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ title: e.target.value });
    };

    handleContentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ content: e.target.value });
    };

    handleLike = async () => {
        await this.submitLike(this.state.userLiked ? 0 : 1);
    };

    handleDislike = async () => {
        await this.submitLike(this.state.userDisliked ? 0 : -1);
    };

    async submitLike(score: number) {
        const response = await postsService.setPostVoteScore(this.props.loaderData.id, score);
        if (response.status !== Status.Success) {
            console.error("failed adding like");
            return;
        }


        let likeCounts = { likeCount: this.state.likeCount, dislikeCount: this.state.dislikeCount };
        let likeState: { userLiked: boolean, userDisliked: boolean };

        const newScore = response.result;
        switch (newScore) {
            case 1:
                {
                    likeCounts.likeCount += 1;
                    if (this.state.userDisliked) {
                        likeCounts.dislikeCount -= 1;
                    }

                    likeState = { userLiked: true, userDisliked: false };
                    break;
                }
            case -1:
                {
                    likeCounts.dislikeCount += 1;
                    if (this.state.userLiked) {
                        likeCounts.likeCount -= 1;
                    }

                    likeState = { userLiked: false, userDisliked: true };
                    break;
                }
            case 0:
                {
                    if (this.state.userLiked) {
                        likeCounts.likeCount -= 1;
                    }
                    else if (this.state.userDisliked) {
                        likeCounts.dislikeCount -= 1;
                    }

                    likeState = { userLiked: false, userDisliked: false };
                    break;
                }
            default:
                console.error("invalid score");
                return;
        }

        this.setState({ ...likeState, ...likeCounts });
    }

    render() {
        let data = this.props.loaderData;
        const { id, author, createdAt, editedAt } = data;
        const { newComment, isEditing, title, content, likeCount, dislikeCount, userLiked, userDisliked } = this.state;

        return (
            <div className="my-4 mx-4">
                <Card className="my-4 mx-4">
                    <Row className="post-header">
                        <Col xs="auto" className="d-flex align-items-center">
                            <div className={`like-indicator ${userLiked ? 'active' : ''}`} onClick={this.handleLike}>
                                <FaThumbsUp />
                                <span>{likeCount}</span>
                            </div>
                        </Col>
                        <Col>
                            <div className={`like-indicator ${userDisliked ? 'active' : ''}`} onClick={this.handleDislike}>
                                <FaThumbsDown />
                                <span>{dislikeCount}</span>
                            </div>
                        </Col>
                    </Row>
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
                                    <small>Posted by {author.name} on {createdAt.toLocaleString()} | {editedAt ? `Last edited on ${editedAt.toLocaleString()}` : ''}</small>
                                </div>
                                <Button color="primary" onClick={this.handleEdit}>Edit</Button>
                            </>
                        )}
                    </CardBody>
                </Card>
                <div className="mt-4">
                    <h6>Comments {<Badge color="primary" pill>{this.state.comments.length}</Badge>}</h6>
                    {this.state.comments?.map(comment => (
                        <Row key={comment.id}>
                            <Col sm="12" key={comment.id}>
                                <PostComment
                                    id={comment.id}
                                    key={comment.id}
                                    author={comment.author}
                                    content={comment.content}
                                    createdAt={comment.createdAt}
                                    editedAt={comment.editedAt}
                                    likes={comment.likes}
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

export default connect(mapStateToProps)(withLoaderData<PostProps>(Post));
