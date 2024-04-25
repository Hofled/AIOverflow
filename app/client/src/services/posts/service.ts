import { AxiosHeaders, AxiosResponse } from "axios";
import { OperationStatus, axiosRequest, wrapFail, wrapSuccess } from "../axios";
import { APIPost, NewComment, NewPost, UpdatePost, APIComment, APICommentToComment } from "./models";
import { commentsPrefix, postsPrefix } from "./consts";

export interface PostUpdater {
    updatePost(postID: number, updatePost: UpdatePost): Promise<OperationStatus<null>>;
}

class PostsService implements PostUpdater {
    async getPosts(): Promise<OperationStatus<APIPost[]>> {
        return axiosRequest<APIPost[], any>(`${postsPrefix}/`, "GET", (r: AxiosResponse<APIPost[]>) => wrapSuccess(r.data), (r) => wrapFail(r));
    }

    async getPost(postId: number): Promise<OperationStatus<APIPost>> {
        return axiosRequest<APIPost, any>(`${postsPrefix}/${postId}`, "GET", (r: AxiosResponse<APIPost>) => wrapSuccess(r.data), (r) => wrapFail(r));
    }

    async updatePost(postID: number, updatePost: UpdatePost): Promise<OperationStatus<null>> {
        return axiosRequest<APIPost, any>(`${postsPrefix}/${postID}`, "PUT", (r: AxiosResponse<APIPost>) => wrapSuccess(r.data), (r) => wrapFail(r), updatePost);
    }

    async createPost(newPost: NewPost): Promise<OperationStatus<APIPost>> {
        const jwtToken = localStorage.getItem('token');
        if (!jwtToken) {
            return wrapFail();
        }

        return axiosRequest<APIPost, any>(`${postsPrefix}/`, "POST", (r: AxiosResponse<APIPost>) => wrapSuccess(r.data), (r) => wrapFail(r), newPost, new AxiosHeaders({ 'Authorization': `Bearer ${jwtToken}` }));
    }

    async addPostComment(newComment: NewComment): Promise<OperationStatus<APIComment>> {
        const jwtToken = localStorage.getItem('token');
        if (!jwtToken) {
            return wrapFail();
        }

        return axiosRequest<APIComment, any>(`${commentsPrefix}/`, "POST", (r: AxiosResponse<APIComment>) => wrapSuccess(APICommentToComment(r.data)), (r) => wrapFail(r), newComment, new AxiosHeaders({ 'Authorization': `Bearer ${jwtToken}` }));
    }
}

const postsService = new PostsService()

export default postsService;