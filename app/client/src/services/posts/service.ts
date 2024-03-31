import { AxiosResponse } from "axios";
import { OperationStatus, axiosRequest, wrapFail, wrapSuccess } from "../axios";
import { Post } from "./models";

class PostsService {
    async getPosts(): Promise<OperationStatus<Post[]>> {
        return axiosRequest<Post[], any>("/posts/", "GET", (r: AxiosResponse<Post[]>) => wrapSuccess(r.data), (r) => wrapFail(r));
    }

    async getPost(postId: number): Promise<OperationStatus<Post>> {
        return axiosRequest<Post, any>(`/posts/${postId}`, "GET", (r: AxiosResponse<Post>) => wrapSuccess(r.data), (r) => wrapFail(r));
    }
}

const postsService = new PostsService()

export default postsService;