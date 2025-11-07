@echo off
start "Usuarios" cmd /k "cd Usuarios && mvn spring-boot:run"
start "ComentariosYRespuestas" cmd /k "cd ComentariosYRespuestas && mvn spring-boot:run"
start "Debate" cmd /k "cd Debate && mvn spring-boot:run"
start "Favoritos" cmd /k "cd Favoritos && mvn spring-boot:run"
start "Moderacion" cmd /k "cd Moderacion && mvn spring-boot:run"
start "Reaccion" cmd /k "cd Reaccion && mvn spring-boot:run"
start "Noticias-Publicaciones" cmd /k "cd Noticias-Publicaciones && mvn spring-boot:run"
