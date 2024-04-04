import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Home from "../components/Home/Home";
import NotFound from "../components/NotFound/NotFound";
import Weather from "../components/Weather/Weather";

import PostsContainer from "../components/Posts/PostsContainer";
import Post from "../components/Posts/Post/Post";
import { postLoader } from "../components/Posts/Post/loader";
import postsService from "../services/posts/service";

const router = createBrowserRouter([
  {
    element: <App />,
    errorElement: <NotFound />,
    children: [
      {
        path: "/", element: <Home />, children: [
          {
            path: "weatherForecast",
            element: <Weather />
          },
        ]
      },
      {
        path: "allPosts", Component: PostsContainer,
      },
      {
        path: "post/:postId", element: <Post updatePost={postsService.updatePost} />, loader: postLoader,
      }
    ],
  },
]);

export default router;
