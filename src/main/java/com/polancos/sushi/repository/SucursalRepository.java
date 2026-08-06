package com.polancos.sushi.repository;

import com.polancos.sushi.entity.Sucursal;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface SucursalRepository extends JpaRepository<Sucursal, Long> {
    Optional<Sucursal> findByNombre(String nombre);
}
