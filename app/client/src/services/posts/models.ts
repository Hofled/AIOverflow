interface Author {
    name: string;
}

export interface APIComment {
    id: number;
    content: string;
    createdAt: string;
    editedAt?: string | null;
    author: Author;
}

export interface Comment {
    id: number;
    content: string;
    createdAt: Date;
    editedAt?: Date | null;
    author: Author;
}

export interface APIPost {
    id: number;
    userId: number;
    title: string;
    content: string;
    createdAt: string;
    editedAt?: string | null;
    author: Author;
    comments: APIComment[];
}

export let APICommentToComment = (comment: APIComment): Comment => {
    return {
        id: comment.id,
        content: comment.content,
        createdAt: new Date(comment.createdAt),
        editedAt: comment.editedAt ? new Date(comment.editedAt) : null,
        author: comment.author,
    };
};

export interface Post {
    id: number;
    userId: number;
    title: string;
    content: string;
    createdAt: Date;
    editedAt?: Date | null;
    author: Author;
    comments: Comment[];
}

export let APIPostToPost = (post: APIPost): Post => {
    return {
        id: post.id,
        userId: post.userId,
        title: post.title,
        content: post.content,
        createdAt: new Date(post.createdAt),
        editedAt: post.editedAt ? new Date(post.editedAt) : null,
        author: post.author,
        comments: post.comments.map(c => APICommentToComment(c)),
    };
};

export interface UpdatePost {
    title: string;
    content: string;
}

export interface NewPost {
    title: string;
    content: string;
}

export interface NewComment {
    content: string;
    postId: number;
}