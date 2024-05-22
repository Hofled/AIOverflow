import { Component } from 'react';
import { Card, CardBody, CardTitle, CardText, Row, Col } from 'reactstrap';
import { Like } from "../../../../services/posts/models";
import { Comment } from "../../../../services/comments/models";
import { FaThumbsDown, FaThumbsUp } from 'react-icons/fa';
import { RootState } from '../../../../state/reducers';
import { connect } from 'react-redux';
import commentsService from '../../../../services/comments/service';
import { Status } from '../../../../services/axios';
import "./Comment.css";

interface CommentState {
  isEditing: boolean;
  content: string;
  lastSetContent: string;
  likes: Map<number, Like>;
  likeCount: number;
  dislikeCount: number;
  userLiked: boolean;
  userDisliked: boolean;
}

const mapStateToProps = (state: RootState) => ({
  userId: state.identity.id,
});

type Props = Comment & { userId: number | undefined };

class PostComment extends Component<Props, CommentState> {
  constructor(props: Props) {
    super(props);
    this.state = {
      isEditing: false,
      content: '',
      lastSetContent: '',
      likes: new Map<number, Like>(),
      likeCount: 0,
      dislikeCount: 0,
      userLiked: false,
      userDisliked: false,
    };
  }

  componentDidMount(): void {
    let data = this.props;
    const { content, likes } = data;
    const likeCount = Array.from(likes.values()).reduce((acc, cur) => cur.score === 1 ? acc + 1 : acc, 0);
    const dislikeCount = Array.from(likes.values()).reduce((acc, cur) => cur.score === -1 ? acc + 1 : acc, 0);
    const userLiked = this.props.userId == undefined ? false : likes.get(this.props.userId)?.score === 1;
    const userDisliked = this.props.userId == undefined ? false : likes.get(this.props.userId)?.score === -1;

    this.setState({
      content: content,
      likes: likes,
      likeCount: likeCount,
      dislikeCount: dislikeCount,
      userLiked: userLiked,
      userDisliked: userDisliked,
      lastSetContent: content,
    });
  }

  handleLike = async () => {
    await this.submitLike(this.state.userLiked ? 0 : 1);
  };

  handleDislike = async () => {
    await this.submitLike(this.state.userDisliked ? 0 : -1);
  };

  async submitLike(score: number) {
    const response = await commentsService.setCommentVoteScore(this.props.id, score);
    if (response.status !== Status.Success) {
      console.error("failed adding like");
      return;
    }


    let likeCounts = { likeCount: this.state.likeCount, dislikeCount: this.state.dislikeCount };
    let likeState: { userLiked: boolean, userDisliked: boolean };

    const newScore = response.result;
    switch (newScore) {
      case 1:
        {
          likeCounts.likeCount += 1;
          if (this.state.userDisliked) {
            likeCounts.dislikeCount -= 1;
          }

          likeState = { userLiked: true, userDisliked: false };
          break;
        }
      case -1:
        {
          likeCounts.dislikeCount += 1;
          if (this.state.userLiked) {
            likeCounts.likeCount -= 1;
          }

          likeState = { userLiked: false, userDisliked: true };
          break;
        }
      case 0:
        {
          if (this.state.userLiked) {
            likeCounts.likeCount -= 1;
          }
          else if (this.state.userDisliked) {
            likeCounts.dislikeCount -= 1;
          }

          likeState = { userLiked: false, userDisliked: false };
          break;
        }
      default:
        console.error("invalid score");
        return;
    }

    this.setState({ ...likeState, ...likeCounts });
  }

  render() {
    const { content, author, createdAt, editedAt } = this.props;

    const { userLiked, userDisliked, likeCount, dislikeCount } = this.state;

    return (
      <Card className="mb-3">
        <Row className="comment-header">
          <Col xs="auto" className="d-flex align-items-center">
            <div className={`like-indicator ${userLiked ? 'active' : ''}`} onClick={this.handleLike}>
              <FaThumbsUp />
              <span>{likeCount}</span>
            </div>
          </Col>
          <Col>
            <div className={`like-indicator ${userDisliked ? 'active' : ''}`} onClick={this.handleDislike}>
              <FaThumbsDown />
              <span>{dislikeCount}</span>
            </div>
          </Col>
        </Row>

        <CardBody>
          <CardTitle className="font-weight-bold">{author.name}</CardTitle>
          <CardText>{content}</CardText>
          <div className="text-muted">Created At: {new Date(createdAt).toLocaleString()}</div>
          {editedAt && <div className="text-muted">Edited At: {new Date(editedAt).toLocaleString()}</div>}
        </CardBody>
      </Card>
    );
  }
}

export default connect(mapStateToProps)(PostComment);
