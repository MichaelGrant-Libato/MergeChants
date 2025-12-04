package com.appdevg4.mergemasters.mergechants;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@ComponentScan("com.appdevg4.mergemasters.mergechants")
public class MergechantsApplication {

	public static void main(String[] args) {
		SpringApplication.run(MergechantsApplication.class, args);
	}

}
