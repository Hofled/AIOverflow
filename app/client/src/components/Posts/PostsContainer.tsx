import { Component } from 'react';
import PostsPage from './Posts';
import PostsService from '../../services/posts/service';
import { Status } from '../../services/axios';
import { Post } from '../../services/posts/models';

interface PostsContainerState {
    posts: Post[];
}

export default class PostsContainer extends Component<{}, PostsContainerState> {
    constructor(props: {}) {
        super(props);
        this.state = {
            posts: [],
        };
    }

    componentDidMount() {
        this.fetchPosts();
    }

    fetchPosts = async () => {
        try {
            const postsResponse = await PostsService.getPosts();
            if (postsResponse.status != Status.Success) {
                throw new Error('Failed to fetch posts');
            }
            const posts: Post[] | undefined = postsResponse.result;
            this.setState({ posts: posts || [] });
        } catch (error) {
            console.error('Error fetching posts:', error);
        }
    };

    render() {
        return <PostsPage posts={this.state.posts} />;
    }
}