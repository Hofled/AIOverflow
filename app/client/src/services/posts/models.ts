interface Author {
    id: number;
    name: string;
}

export interface APILike {
    id: number;
    user: Author;
    score: number;
    createdAt: string;
}

export interface Like {
    id: number;
    user: Author;
    score: number;
    createdAt: Date;
}

export let APILikeToLike = (like: APILike): Like => {
    return {
        id: like.id,
        user: like.user,
        score: like.score,
        createdAt: new Date(like.createdAt),
    };
};

let APILikeMapToLikeMap = (likes: Map<number, APILike>): Map<number, Like> => {
    let newLikes = new Map<number, Like>();

    if (likes.size === 0) {
        return newLikes;
    }

    for (let [id, like] of likes) {
        newLikes.set(id, APILikeToLike(like));
    }

    return newLikes;
};

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
};


export interface NewComment {
    content: string;
    postId: number;
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
    likes: Map<number, APILike>;
}

export interface Post {
    id: number;
    userId: number;
    title: string;
    content: string;
    createdAt: Date;
    editedAt?: Date | null;
    author: Author;
    comments: Comment[];
    likes: Map<number, Like>;
}

export let APIPostToPost = (post: APIPost): Post => {
    const likesMap = new Map<number, APILike>();
    for (let [k, v] of Object.entries(post.likes)) {
        likesMap.set(parseInt(k), v as APILike);
    }
    return {
        id: post.id,
        userId: post.userId,
        title: post.title,
        content: post.content,
        createdAt: new Date(post.createdAt),
        editedAt: post.editedAt ? new Date(post.editedAt) : null,
        author: post.author,
        comments: post.comments.map(c => APICommentToComment(c)),
        likes: APILikeMapToLikeMap(likesMap),
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
