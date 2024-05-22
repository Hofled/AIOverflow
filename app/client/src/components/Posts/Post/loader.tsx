import { LoaderFunction } from "react-router-dom";
import postsService from "../../../services/posts/service";
import { Status } from "../../../services/axios";
import { Post } from "../../../services/posts/models";

const postLoader: LoaderFunction<Post> = async ({ params }) => {
    if (params.postId == null) {
        throw new Response("missing 'postId' parameter", { status: 400 });
    }

    const postId = parseInt(params.postId, 10);
    const postResponse = await postsService.getPost(postId);
    if (postResponse.status !== Status.Success) {
        throw new Response("post not found", { status: 404 });
    }

    return postResponse.result;
}

export { postLoader };