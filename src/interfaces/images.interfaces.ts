export interface robotsProps {
  series: number;
  id: number;
  name: string;
  weapon: string;
  avatar: string;
  sprite1: string;
  weakness: string;
  stageImg: string;
}

export interface responseProps {
  ok: boolean;
  statusCode: string;
  robots: robotsProps[];
}

export interface responseNameProps {
  ok: string;
  statusCode: number;
  robot: robotsProps;
}
