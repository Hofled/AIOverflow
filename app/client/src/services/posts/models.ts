interface Author {
    name: string;
}

export interface APIPost {
    id: number;
    userId: number;
    title: string;
    content: string;
    createdAt: string;
    editedAt?: string | null;
    author: Author;
}

export interface Post {
    id: number;
    userId: number;
    title: string;
    content: string;
    createdAt: Date;
    editedAt?: Date | null;
    author: Author;
}

export let APIPostToPost = (post: APIPost): Post => {
    return {
        id: post.id,
        userId: post.userId,
        title: post.title,
        content: post.content,
        createdAt: new Date(post.createdAt),
        editedAt: post.editedAt ? new Date(post.editedAt) : null,
        author: post.author
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