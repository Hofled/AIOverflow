import { APILikeMapToLikeMap } from "../posts/models";
import { Like } from "../posts/models";
import { Author, APILike } from "../posts/models";

export interface APIComment {
    id: number;
    content: string;
    createdAt: string;
    editedAt?: string | null;
    author: Author;
    likes: Map<number, APILike>;
}

export interface Comment {
    id: number;
    content: string;
    createdAt: Date;
    editedAt?: Date | null;
    author: Author;
    likes: Map<number, Like>;
}

export let APICommentToComment = (comment: APIComment): Comment => {
    const likesMap = new Map<number, APILike>();
    for (let [k, v] of Object.entries(comment.likes)) {
        likesMap.set(parseInt(k), v as APILike);
    }
    return {
        id: comment.id,
        content: comment.content,
        createdAt: new Date(comment.createdAt),
        editedAt: comment.editedAt ? new Date(comment.editedAt) : null,
        author: comment.author,
        likes: APILikeMapToLikeMap(likesMap),
    };
}

export interface NewComment {
    content: string;
    postId: number;
}
