import { Component } from 'react';
import { Container, Row, Col } from 'reactstrap';
import { Post as PostProps } from "../../services/posts/models";
import PostCard from './PostCard/PostCard';

interface PostsPageProps {
    posts: PostProps[];
}

class PostsPage extends Component<PostsPageProps> {
    render() {
        const { posts } = this.props;
        return (
            <Container>
                <h1>Posts</h1>
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


export default PostsPage;
