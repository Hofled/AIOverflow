import React, { Component } from 'react';
import { Form, FormGroup, Label, Input, Button, Alert } from 'reactstrap';
import postsService from "../../../services/posts/service";
import { withNavigation } from '../../../routing/wrappers';
import { NavigateFunction } from 'react-router-dom';
import { Status } from '../../../services/axios';

interface NavigateProps {
  navigate: NavigateFunction;
}

interface PostCreationPageState {
  title: string;
  content: string;
  errorMessage: string | null;
}

class PostCreationPage extends Component<NavigateProps, PostCreationPageState> {
  constructor(props: NavigateProps) {
    super(props);
    this.state = {
      title: '',
      content: '',
      errorMessage: null, // Initialize error message as null
    };
  }

  handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ title: e.target.value });
  };

  handleContentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ content: e.target.value });
  };

  handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { title, content } = this.state;
    const response = await postsService.createPost({
      content: content,
      title: title,
    });

    if (response.status !== Status.Success) {
      this.setState({ errorMessage: 'Failed to create post' }); // Update error message state
      return;
    }

    this.props.navigate(`/post/${response.result?.id}`);
    this.setState({ title: '', content: '', errorMessage: null }); // Clear error message after successful submission
  };

  render() {
    const { title, content, errorMessage } = this.state;

    return (
      <div className="container mt-4">
        <h2>Create a New Post</h2>
        {errorMessage && (
          <Alert color="danger">
            {errorMessage}
          </Alert>
        )}
        <Form onSubmit={this.handleSubmit}>
          <FormGroup>
            <Label for="title">Title</Label>
            <Input type="text" name="title" id="title" value={title} onChange={this.handleTitleChange} required />
          </FormGroup>
          <FormGroup>
            <Label for="content">Content</Label>
            <Input type="textarea" name="content" id="content" value={content} onChange={this.handleContentChange} required />
          </FormGroup>
          <Button color="primary">Create Post</Button>
        </Form>
      </div>
    );
  }
}

export default withNavigation(PostCreationPage);
