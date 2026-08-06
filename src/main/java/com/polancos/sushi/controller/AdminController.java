package com.polancos.sushi.controller;

import com.polancos.sushi.entity.Reserva;
import com.polancos.sushi.entity.Sucursal;
import com.polancos.sushi.repository.ReservaRepository;
import com.polancos.sushi.repository.SucursalRepository;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final ReservaRepository reservaRepository;
    private final SucursalRepository sucursalRepository;

    @Value("${admin.username:admin}")
    private String adminUsername;

    @Value("${admin.password:Polancos2026!}")
    private String adminPassword;

    @Autowired
    public AdminController(ReservaRepository reservaRepository, SucursalRepository sucursalRepository) {
        this.reservaRepository = reservaRepository;
        this.sucursalRepository = sucursalRepository;
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(@RequestBody Map<String, String> payload, HttpServletResponse response) {
        String username = payload.get("username");
        String password = payload.get("password");

        Map<String, String> result = new HashMap<>();

        if (adminUsername.equals(username) && adminPassword.equals(password)) {
            // Generar Cookie de Sesión
            Cookie cookie = new Cookie("admin_session", "authenticated");
            cookie.setPath("/");
            cookie.setMaxAge(24 * 60 * 60); // 1 día de sesión
            cookie.setHttpOnly(true);
            response.addCookie(cookie);

            result.put("result", "success");
            return ResponseEntity.ok(result);
        } else {
            result.put("result", "error");
            result.put("error", "Usuario o contraseña incorrectos.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(result);
        }
    }

    @GetMapping("/reservas")
    public ResponseEntity<?> obtenerReservas(
            @RequestParam("fecha") String fechaStr,
            @RequestParam("sucursal") String sucursalStr) {

        try {
            LocalDate fecha = LocalDate.parse(fechaStr);
            Sucursal sucursal = sucursalRepository.findByNombre(sucursalStr)
                    .orElseThrow(() -> new IllegalArgumentException("Sucursal no válida."));

            List<Reserva> reservas = reservaRepository.findBySucursalAndFechaOrderByHoraAsc(sucursal, fecha);
            return ResponseEntity.ok(reservas);

        } catch (IllegalArgumentException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Error al consultar las reservaciones.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    @PutMapping("/reservas/{id}/estado")
    public ResponseEntity<Map<String, Object>> actualizarEstado(
            @PathVariable("id") Long id,
            @RequestBody Map<String, String> payload) {

        Map<String, Object> response = new HashMap<>();
        try {
            String nuevoEstado = payload.get("estado");
            if (nuevoEstado == null || (!nuevoEstado.equals("Pendiente") && !nuevoEstado.equals("Confirmada") && !nuevoEstado.equals("Cancelada"))) {
                throw new IllegalArgumentException("Estado no válido.");
            }

            Reserva reserva = reservaRepository.findById(id)
                    .orElseThrow(() -> new IllegalArgumentException("Reserva no encontrada."));

            reserva.setEstado(nuevoEstado);
            reservaRepository.save(reserva);

            response.put("result", "success");
            response.put("id", id);
            response.put("estado", nuevoEstado);

            return ResponseEntity.ok(response);

        } catch (IllegalArgumentException e) {
            response.put("result", "error");
            response.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        } catch (Exception e) {
            response.put("result", "error");
            response.put("error", "Error al actualizar la reservación.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
}
