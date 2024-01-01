import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Home from "../components/Home/Home";
import NotFound from "../components/NotFound/NotFound";
import AuthorizedRoute from "../components/Authorization/AuthorizedRoute";
import Weather from "../components/Weather/Weather";

const router = createBrowserRouter([
  {
    element: <App />,
    errorElement: <NotFound />,
    children: [
      { path: "/", element: <Home /> },
      {
        path: "/weatherForecast",
        element: <AuthorizedRoute path={"/weatherForecast"} element={<Weather />} />
      },
    ],
  },
]);

export default router;
