import { LoaderFunction } from "react-router-dom";
import postsService from "../../services/posts/service";
import { Status } from "../../services/axios";
import { APIPostToPost, Post } from "../../services/posts/models";

const postsLoader: LoaderFunction = async () => {
    const postsResponse = await postsService.getPosts();
    if (postsResponse.status !== Status.Success) {
        throw new Response("posts not found", { status: 404 });
    }

    return postsResponse.result?.map<Post>(p => APIPostToPost(p));
}

export { postsLoader };