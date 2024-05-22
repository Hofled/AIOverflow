export const commentsPrefix = "/comments";
export const CommentPaths = {
  SetVote: (id: number) => `${commentsPrefix}/${id}/setLikeScore`
};
