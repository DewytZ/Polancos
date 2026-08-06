package com.polancos.sushi.controller;

import com.polancos.sushi.entity.Reserva;
import com.polancos.sushi.service.ReservaService;
import com.polancos.sushi.exception.AforoCompletoException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/reservas")
public class ReservaController {

    private final ReservaService reservaService;

    @Autowired
    public ReservaController(ReservaService reservaService) {
        this.reservaService = reservaService;
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> crearReserva(@RequestBody Map<String, Object> payload) {
        Map<String, Object> response = new HashMap<>();
        try {
            String nombre = (String) payload.get("nombre");
            String whatsapp = (String) payload.get("whatsapp");
            LocalDate fecha = LocalDate.parse((String) payload.get("fecha"));
            LocalTime hora = LocalTime.parse((String) payload.get("hora"));
            int personas = Integer.parseInt(payload.get("personas").toString());
            String sucursal = (String) payload.get("sucursal");

            Reserva reserva = reservaService.crearReserva(nombre, whatsapp, fecha, hora, personas, sucursal);

            response.put("result", "success");
            response.put("reservaId", reserva.getId());
            response.put("waLink", reserva.getWaLink());

            return ResponseEntity.ok(response);

        } catch (AforoCompletoException e) {
            response.put("result", "error");
            response.put("error", e.getMessage());
            response.put("disponibles", e.getDisponibles());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);

        } catch (IllegalArgumentException e) {
            response.put("result", "error");
            response.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);

        } catch (Exception e) {
            response.put("result", "error");
            response.put("error", "Error interno del servidor. Por favor intente más tarde.");
            response.put("details", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
}
