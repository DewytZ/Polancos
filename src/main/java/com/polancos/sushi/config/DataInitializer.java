package com.polancos.sushi.config;

import com.polancos.sushi.entity.Sucursal;
import com.polancos.sushi.repository.SucursalRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalTime;
import java.util.Arrays;

@Component
public class DataInitializer implements CommandLineRunner {

    private final SucursalRepository sucursalRepository;

    public DataInitializer(SucursalRepository sucursalRepository) {
        this.sucursalRepository = sucursalRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        if (sucursalRepository.count() == 0) {
            Sucursal universitarios = new Sucursal("Universitarios", 50, LocalTime.of(10, 0), LocalTime.of(23, 0));
            Sucursal conquista = new Sucursal("Conquista", 25, LocalTime.of(12, 0), LocalTime.of(21, 45));
            Sucursal valleAlto = new Sucursal("Valle Alto", 25, LocalTime.of(12, 0), LocalTime.of(21, 45));

            sucursalRepository.saveAll(Arrays.asList(universitarios, conquista, valleAlto));
            System.out.println(">>> Base de datos inicializada con las sucursales Conquista, Universitarios y Valle Alto.");
        }
    }
}
