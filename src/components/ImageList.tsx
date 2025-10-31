import { type FC } from "react";
import type { robotsProps } from "../interfaces/images.interfaces";

interface Props {
  robots: robotsProps[];
}

export const ImageList: FC<Props> = ({ robots }) => {
  return (
    <div className="image-list">
      {robots.map((robot) => (
        <div key={robot.id} className="robot-card">
          <img src={robot.avatar} alt={robot.name} />
          <h3>{robot.name}</h3>
          <p>ID: {robot.id}</p>
          <p>Weapon: {robot.weapon}</p>
        </div>
      ))}
    </div>
  );
};
