export const postsPrefix = "/posts";
export const commentsPrefix = "/comments";

export const PostPaths = {
  SetVote: (id: number) => `${postsPrefix}/${id}/setLikeScore`  
};