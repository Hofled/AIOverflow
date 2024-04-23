import { AxiosResponse } from "axios";
import { OperationStatus, axiosRequest, wrapFail, wrapSuccess } from "../axios";
import { APIPost, Post } from "./models";

class PostsService {
    async getPosts(): Promise<OperationStatus<APIPost[]>> {
        return axiosRequest<Post[], any>("/posts/", "GET", (r: AxiosResponse<Post[]>) => wrapSuccess(r.data), (r) => wrapFail(r));
    }

    async getPost(postId: number): Promise<OperationStatus<APIPost>> {
        return axiosRequest<Post, any>(`/posts/${postId}`, "GET", (r: AxiosResponse<Post>) => wrapSuccess(r.data), (r) => wrapFail(r));
    }

    async updatePost(post: Post): Promise<OperationStatus<null>> {
        return axiosRequest<Post, any>(`/posts/${post.id}`, "PUT", (r: AxiosResponse<Post>) => wrapSuccess(r.data), (r) => wrapFail(r), post);
    }
}

const postsService = new PostsService()

export default postsService;