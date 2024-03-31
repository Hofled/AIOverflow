interface Author {
    name: string;
}

export interface Post {
    id: number;
    title: string;
    content: string;
    createdAt: Date;
    editedAt?: Date | null;
    author: Author;
}