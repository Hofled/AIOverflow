import React, { Component } from 'react';
import { Form, FormGroup, Label, Input, Button } from 'reactstrap';
import postsService from "../../../services/posts/service";

interface PostCreationPageState {
  title: string;
  content: string;
}

class PostCreationPage extends Component<{}, PostCreationPageState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      title: '',
      content: '',
    };
  }

  handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ title: e.target.value });
  };

  handleContentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ content: e.target.value });
  };

  handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { title, content } = this.state;
    postsService.createPost({
        content: content,
        title: title,
    });
    // Optionally, clear the form after submission
    this.setState({ title: '', content: '' });
  };

  render() {
    const { title, content } = this.state;

    return (
      <div className="container mt-4">
        <h2>Create a New Post</h2>
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

export default PostCreationPage;
