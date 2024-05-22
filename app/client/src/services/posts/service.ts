import { AxiosHeaders, AxiosResponse } from "axios";
import { OperationStatus, axiosRequest, wrapFail, wrapSuccess } from "../axios";
import { APIPost, Post, NewPost, UpdatePost, APIPostToPost } from "./models";
import { PostPaths, postsPrefix } from "./consts";

export interface PostUpdater {
    updatePost(postID: number, updatePost: UpdatePost): Promise<OperationStatus<null>>;
}

class PostsService implements PostUpdater {
    async getPosts(): Promise<OperationStatus<Post[]>> {
        return axiosRequest<APIPost[], Post[]>(`${postsPrefix}/`, "GET", (r: AxiosResponse<APIPost[]>) => wrapSuccess(r.data.map<Post>(p => APIPostToPost(p))), (r) => wrapFail(r));
    }

    async getPost(postId: number): Promise<OperationStatus<Post>> {
        return axiosRequest<APIPost, Post>(`${postsPrefix}/${postId}`, "GET", (r: AxiosResponse<APIPost>) => wrapSuccess(APIPostToPost(r.data)), (r) => wrapFail(r));
    }

    async updatePost(postID: number, updatePost: UpdatePost): Promise<OperationStatus<null>> {
        return axiosRequest<null, null>(`${postsPrefix}/${postID}`, "PUT", (r: AxiosResponse<null>) => wrapSuccess(), (r) => wrapFail(r), updatePost);
    }

    async createPost(newPost: NewPost): Promise<OperationStatus<Post>> {
        const jwtToken = localStorage.getItem('token');
        if (!jwtToken) {
            return wrapFail();
        }

        return axiosRequest<APIPost, Post>(`${postsPrefix}/`, "POST", (r: AxiosResponse<APIPost>) => wrapSuccess(APIPostToPost(r.data)), (r) => wrapFail(r), newPost, new AxiosHeaders({ 'Authorization': `Bearer ${jwtToken}` }));
    }

    async setPostVoteScore(postId: number, score: number): Promise<OperationStatus<number>> {
        const jwtToken = localStorage.getItem('token');
        if (!jwtToken) {
            return wrapFail();
        }

        return axiosRequest<number, number>(PostPaths.SetVote(postId), "POST", (r: AxiosResponse<number>) => wrapSuccess(r.data), (r) => wrapFail(r), { score }, new AxiosHeaders({ 'Authorization': `Bearer ${jwtToken}` }));
    }
}

const postsService = new PostsService()

export default postsService;