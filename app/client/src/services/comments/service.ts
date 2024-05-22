import { AxiosResponse, AxiosHeaders } from "axios";
import { OperationStatus, wrapFail, axiosRequest, wrapSuccess } from "../axios";
import { NewComment } from "./models";
import { APICommentToComment } from "./models";
import { Comment } from "./models";
import { APIComment } from "./models";
import { CommentPaths, commentsPrefix } from "./consts";

class CommentsService {
    async addPostComment(newComment: NewComment): Promise<OperationStatus<Comment>> {
        const jwtToken = localStorage.getItem('token');
        if (!jwtToken) {
            return wrapFail();
        }

        return axiosRequest<APIComment, Comment>(`${commentsPrefix}/`, "POST", (r: AxiosResponse<APIComment>) => wrapSuccess(APICommentToComment(r.data)), (r) => wrapFail(r), newComment, new AxiosHeaders({ 'Authorization': `Bearer ${jwtToken}` }));
    }

    async setCommentVoteScore(commentId: number, score: number): Promise<OperationStatus<number>> {
        const jwtToken = localStorage.getItem('token');
        if (!jwtToken) {
            return wrapFail();
        }

        return axiosRequest<number, number>(CommentPaths.SetVote(commentId), "POST", (r: AxiosResponse<number>) => wrapSuccess(r.data), (r) => wrapFail(r), { score }, new AxiosHeaders({ 'Authorization': `Bearer ${jwtToken}` }));
    }
}

const commentsService = new CommentsService();

export default commentsService;