package com.example.Imagenes.service;

import com.example.Imagenes.model.Imagen;
import com.example.Imagenes.repository.ImagenRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentMatchers;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.MediaType;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class ImagenServiceTest {

    @Mock
    private ImagenRepository repository;

    @InjectMocks
    private ImagenService service;

    @Test
    void crear() throws IOException {
        MultipartFile archivo = mock(MultipartFile.class);
        when(archivo.getOriginalFilename()).thenReturn("test.jpg");
        when(archivo.getInputStream()).thenReturn(Files.newInputStream(Paths.get("src/test/resources/test.jpg")));
        lenient().when(archivo.getBytes()).thenReturn("test image content".getBytes());

        List<MultipartFile> archivos = List.of(archivo);
        Long entidadID = 1L;
        String tipoEntidad = "publicacion";

        when(repository.save(ArgumentMatchers.any(Imagen.class))).thenAnswer(invocation -> {
            Imagen saved = invocation.getArgument(0);
            saved.setImagenID(1L);
            return saved;
        });

        // Mock the rutaBase property using reflection
        ImagenService spyService = spy(service);
        try {
            java.lang.reflect.Field rutaBaseField = ImagenService.class.getDeclaredField("rutaBase");
            rutaBaseField.setAccessible(true);
            rutaBaseField.set(spyService, "C:/temp");
        } catch (Exception e) {
            // Ignore
        }

        List<Imagen> result = spyService.crear(entidadID, tipoEntidad, archivos);

        assertNotNull(result);
        assertEquals(1, result.size());
        assertNotNull(result.get(0).getImagenID());
        verify(repository, times(1)).save(ArgumentMatchers.any(Imagen.class));
    }

    @Test
    void buscarPorEntidad() {
        Long entidadID = 1L;
        String tipoEntidad = "publicacion";

        Imagen imagen = new Imagen();
        imagen.setImagenID(1L);
        imagen.setEntidadID(entidadID);
        imagen.setTipoEntidad(tipoEntidad);
        imagen.setNombre("test.jpg");
        imagen.setActivo(true);
        imagen.setFechaCreacion(LocalDateTime.now());

        List<Imagen> imagenes = List.of(imagen);

        when(repository.findAllByEntidadIDAndTipoEntidadAndActivoTrue(entidadID, tipoEntidad)).thenReturn(imagenes);

        List<Imagen> result = service.buscarPorEntidad(entidadID, tipoEntidad);

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(imagen.getImagenID(), result.get(0).getImagenID());
        verify(repository, times(1)).findAllByEntidadIDAndTipoEntidadAndActivoTrue(entidadID, tipoEntidad);
    }

    @Test
    void obtenerImagenPorId() throws IOException {
        Long id = 1L;

        Imagen imagen = new Imagen();
        imagen.setImagenID(id);
        imagen.setEntidadID(1L);
        imagen.setTipoEntidad("publicacion");
        imagen.setNombre("test.jpg");
        imagen.setActivo(true);
        imagen.setFechaCreacion(LocalDateTime.now());

        when(repository.findById(id)).thenReturn(Optional.of(imagen));

        // Mock the rutaBase property using reflection
        ImagenService spyService = spy(service);
        try {
            java.lang.reflect.Field rutaBaseField = ImagenService.class.getDeclaredField("rutaBase");
            rutaBaseField.setAccessible(true);
            rutaBaseField.set(spyService, "src/test/resources");
        } catch (Exception e) {
            // Ignore
        }

        Optional<Resource> result = spyService.obtenerImagenPorId(id);

        // The test file exists, so result should be present
        // Note: This test assumes the file exists in the test resources
        // If the file does not exist, the test will fail, which is expected behavior
        assertTrue(result.isPresent());
        verify(repository, times(1)).findById(id);
    }

    @Test
    void obtenerImagenPorIdNotFound() {
        Long id = 1L;

        when(repository.findById(id)).thenReturn(Optional.empty());

        Optional<Resource> result = service.obtenerImagenPorId(id);

        assertFalse(result.isPresent());
        verify(repository, times(1)).findById(id);
    }

    @Test
    void obtenerContentType() throws IOException {
        Path tempFile = Files.createTempFile("test", ".jpg");
        Resource recurso = new UrlResource(tempFile.toUri());

        MediaType result = service.obtenerContentType(recurso);

        assertEquals(MediaType.IMAGE_JPEG, result);
        Files.deleteIfExists(tempFile);
    }
}
