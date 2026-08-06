package com.polancos.sushi.repository;

import com.polancos.sushi.entity.Reserva;
import com.polancos.sushi.entity.Sucursal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.time.LocalTime;

public interface ReservaRepository extends JpaRepository<Reserva, Long> {

    @Query("SELECT COALESCE(SUM(r.personas), 0) FROM Reserva r " +
           "WHERE r.sucursal = :sucursal " +
           "AND r.fecha = :fecha " +
           "AND r.estado != 'Cancelada' " +
           "AND r.hora >= :startTime " +
           "AND r.hora <= :endTime")
    int sumReservedGuestsInTimeWindow(
            @Param("sucursal") Sucursal sucursal,
            @Param("fecha") LocalDate fecha,
            @Param("startTime") LocalTime startTime,
            @Param("endTime") LocalTime endTime
    );
}
