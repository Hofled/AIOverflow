import { AxiosHeaders, AxiosResponse } from "axios";
import { OperationStatus, axiosRequest, wrapFail, wrapSuccess } from "../axios";
import { APIPost, NewPost, Post, UpdatePost } from "./models";
import { postsPrefix } from "./consts";

class PostsService {
    async getPosts(): Promise<OperationStatus<APIPost[]>> {
        return axiosRequest<Post[], any>(`${postsPrefix}/`, "GET", (r: AxiosResponse<Post[]>) => wrapSuccess(r.data), (r) => wrapFail(r));
    }

    async getPost(postId: number): Promise<OperationStatus<APIPost>> {
        return axiosRequest<Post, any>(`${postsPrefix}/${postId}`, "GET", (r: AxiosResponse<Post>) => wrapSuccess(r.data), (r) => wrapFail(r));
    }

    async updatePost(postID: number, updatePost: UpdatePost): Promise<OperationStatus<null>> {
        return axiosRequest<Post, any>(`${postsPrefix}/${postID}`, "PUT", (r: AxiosResponse<Post>) => wrapSuccess(r.data), (r) => wrapFail(r), updatePost);
    }

    async createPost(newPost: NewPost): Promise<OperationStatus<APIPost>> {
        const jwtToken = localStorage.getItem('token');
        if (!jwtToken) {
            return wrapFail();
        }

        return axiosRequest<Post, any>(`${postsPrefix}/`, "POST", (r: AxiosResponse<Post>) => wrapSuccess(r.data), (r) => wrapFail(r), newPost, new AxiosHeaders({ 'Authorization': `Bearer ${jwtToken}` }));
    }
}

const postsService = new PostsService()

export default postsService;