import { Component } from 'react';
import { Container, Row, Col, Button } from 'reactstrap';
import { Post as PostProps } from "../../services/posts/models";
import PostCard from './PostCard/PostCard';
import { LoaderDataProp, withLoaderData } from '../../routing/wrappers';
import { Link } from 'react-router-dom';

interface PostsState {
    posts: PostProps[];
}

class PostsPage extends Component<LoaderDataProp<PostProps[]>, PostsState> {
    constructor(props: LoaderDataProp<PostProps[]>) {
        super(props);
        this.state = {
            posts: [],
        };
    }

    componentDidMount(): void {
        const data = this.props.loaderData;
        data.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        this.setState({ posts: data });
    }

    render() {
        const { posts } = this.state;
        return (
            // a button for creating a new post, which routes to a post creation page
            <Container>
                <h1>Posts</h1>
                <Col className='d-flex justify-content-center'>
                    <Link to="/create-post">
                        <Button color="primary">
                            Create Post
                        </Button>
                    </Link>
                </Col>
                <Row className='justify-content-center my-4'>
                    {posts.map((post, index) => (
                        <Row key={post.id} className={`justify-content-center ${(index > 0) ? "mt-4" : ""}`}>
                            <Col md="4" key={post.id}>
                                <PostCard
                                    key={post.id}
                                    userId={post.userId}
                                    author={post.author}
                                    content={post.content}
                                    createdAt={post.createdAt}
                                    id={post.id}
                                    title={post.title}
                                    editedAt={post.editedAt}
                                />
                            </Col>
                        </Row>
                    ))}
                </Row>
            </Container>
        );
    }
}


export default withLoaderData<PostProps[]>(PostsPage);
