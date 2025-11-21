package com.example.Moderacion;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;

import com.example.Moderacion.webclient.ModeracionWebClient;

@SpringBootTest
class ModeracionApplicationTests {

	@MockBean
	private ModeracionWebClient moderacionWebClient;

	@Test
	void contextLoads() {
	}

}
