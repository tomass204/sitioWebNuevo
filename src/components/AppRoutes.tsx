import { useRoutes } from "react-router-dom";
import GamesTab from "./tabs/GamesTab";
import { RobotComponent } from "./RobotComponent";

export const AppRoutes = () => {
  const routes = useRoutes([
    {
      path: "/",
      element: <GamesTab currentUser={null} currentRole={null} />,
    },
    {
      path: "/robot-component",
      element: <RobotComponent />,
    },
    {
      path: "*",
      element: <div>Página no encontrada - 404</div>,
    },
  ]);

  return routes;
};
