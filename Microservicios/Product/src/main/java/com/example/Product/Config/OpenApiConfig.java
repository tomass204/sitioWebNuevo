package com.example.Product.Config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Product Microservice API")
                        .version("1.0")
                        .description("API para gestión de productos en Gaming Hub"))
                .addServersItem(new Server().url("http://localhost:8082"));
    }
}
