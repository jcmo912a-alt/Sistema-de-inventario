package com.inventario.sistema.Config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpHeaders;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.web.client.RestClient;

/**
 * Configuración del cliente HTTP que consume la API pública externa
 * Open Food Facts (https://world.openfoodfacts.org).
 *
 * Se define un único bean RestClient con:
 * - la URL base de la API externa,
 * - tiempos de espera (para que el sistema no se quede colgado si la API
 * externa no responde),
 * - un User-Agent que identifica nuestra aplicación (lo recomienda Open Food
 * Facts).
 */
@Configuration
public class httpClienteConfig {

    @Bean
    public RestClient openFoodFactsClient() {
        SimpleClientHttpRequestFactory fabrica = new SimpleClientHttpRequestFactory();
        fabrica.setConnectTimeout(5000); // 5 s para conectar
        fabrica.setReadTimeout(5000); // 5 s para recibir la respuesta

        return RestClient.builder()
                .baseUrl("https://world.openfoodfacts.org")
                .requestFactory(fabrica)
                .defaultHeader(HttpHeaders.USER_AGENT,
                        "SistemaInventario/1.0 (proyecto academico SENA)")
                .build();
    }
}
