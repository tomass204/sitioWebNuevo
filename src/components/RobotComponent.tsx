import { useLocation, useNavigate } from "react-router-dom";
import type { robotsProps } from "../interfaces/images.interfaces";

export const RobotComponent = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { robot } = location.state as { robot: robotsProps } || {};

  const handleGoBack = () => {
    navigate(-1);
  };

  if (!robot) {
    return (
      <div className="robot-container">
        <button onClick={handleGoBack} className="back-button">
          Volver
        </button>
        <div className="error-message">No se encontraron los datos del robot</div>
      </div>
    );
  }

  return (
    <div className="robot-container">
      <button onClick={handleGoBack}>Volver</button>
      <div className="robot-detail">
        <img className="robot-detail-image" src={robot.avatar} alt={robot.name} />
      </div>
      <div className="robot-detail-info">
        <h1 className="montserrat-bold">{robot.name}</h1>
        <p className="robot-id montserrat-light">ID: {robot.id}</p>
        <p className="robot-id montserrat-light">Nombre: {robot.name}</p>
        <p className="robot-id montserrat-light">Weapon: {robot.weapon}</p>
        {robot.weakness && (
          <p className="robot-id montserrat-light">Weakness: {robot.weakness}</p>
        )}
        {robot.stageImg && (
          <img src={robot.stageImg} alt={`Stage of ${robot.name}`} />
        )}
      </div>
    </div>
  );
};
