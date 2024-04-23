import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Home from "../components/Home/Home";
import NotFound from "../components/NotFound/NotFound";
import Weather from "../components/Weather/Weather";

// Post
import Post from "../components/Posts/Post/Post";
import { postLoader } from "../components/Posts/Post/loader";
// Posts
import Posts from "../components/Posts/Posts";
import { postsLoader } from "../components/Posts/loader";

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
        path: "allPosts", element: <Posts />, loader: postsLoader,
      },
      {
        path: "post/:postId", element: <Post updatePost={postsService.updatePost} />, loader: postLoader,
      }
    ],
  },
]);

export default router;
