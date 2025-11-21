# Instrucciones de Compilación - Product Microservice

## Problema Común

Si ves el error: `SpringApplication cannot be resolved`, significa que el proyecto no se ha compilado correctamente con Gradle.

## Solución

### Opción 1: Compilar con Gradle (Recomendado)

1. Abre una terminal en la carpeta del microservicio:
```bash
cd Microservicios/Product
```

2. Compila el proyecto:
```bash
# Windows
gradlew.bat build

# Linux/Mac
./gradlew build
```

3. Ejecuta el microservicio:
```bash
# Windows
gradlew.bat bootRun

# Linux/Mac
./gradlew bootRun
```

### Opción 2: Usar Maven (Si prefieres)

Si quieres convertir el proyecto a Maven, puedes crear un `pom.xml`, pero es más fácil usar Gradle.

### Opción 3: Refrescar en el IDE

1. En VS Code, presiona `Ctrl+Shift+P` (o `Cmd+Shift+P` en Mac)
2. Escribe "Java: Clean Java Language Server Workspace"
3. Selecciona y confirma
4. Reinicia VS Code

### Opción 4: Verificar que las dependencias estén descargadas

```bash
cd Microservicios/Product
gradlew.bat dependencies
```

## Verificación

Después de compilar, verifica que el proyecto funciona:

1. El microservicio debería iniciar en el puerto 8082
2. Accede a: `http://localhost:8082/swagger-ui/index.html`
3. O prueba: `http://localhost:8082/v1/productos`

## Notas

- **NO ejecutes** el archivo `.java` directamente desde el IDE
- **SIEMPRE** compila primero con Gradle/Maven
- Los packages han sido corregidos de `main.java.com.example.Product` a `com.example.Product`

