import { type FC } from "react";
import type { robotsProps } from "../interfaces/images.interfaces";

interface Props {
  robots: robotsProps[];
}

import { UserService } from './src/services/UserService';
UserService.initializeDefaultUsers();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
  