import { LoaderFunction } from "react-router-dom";
import postsService from "../../services/posts/service";
import { Status } from "../../services/axios";
import { Post } from "../../services/posts/models";

const postsLoader: LoaderFunction<Post[]> = async () => {
    const postsResponse = await postsService.getPosts();
    if (postsResponse.status !== Status.Success) {
        throw new Response("posts not found", { status: 404 });
    }

    return postsResponse.result;
}

export { postsLoader };