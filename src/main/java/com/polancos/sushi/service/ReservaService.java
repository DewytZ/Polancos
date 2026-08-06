package com.polancos.sushi.service;

import com.polancos.sushi.entity.Reserva;
import com.polancos.sushi.entity.Sucursal;
import com.polancos.sushi.exception.AforoCompletoException;
import com.polancos.sushi.repository.ReservaRepository;
import com.polancos.sushi.repository.SucursalRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.time.LocalTime;

@Service
public class ReservaService {

    private final ReservaRepository reservaRepository;
    private final SucursalRepository sucursalRepository;

    @Autowired
    public ReservaService(ReservaRepository reservaRepository, SucursalRepository sucursalRepository) {
        this.reservaRepository = reservaRepository;
        this.sucursalRepository = sucursalRepository;
    }

    @Transactional
    public Reserva crearReserva(String nombre, String whatsapp, LocalDate fecha, LocalTime hora, int personas, String nombreSucursal) {
        // 1. Buscar Sucursal
        Sucursal sucursal = sucursalRepository.findByNombre(nombreSucursal)
                .orElseThrow(() -> new IllegalArgumentException("La sucursal seleccionada '" + nombreSucursal + "' no es válida."));

        // 2. Validar Horarios de Servicio
        if (hora.isBefore(sucursal.getHoraApertura()) || hora.isAfter(sucursal.getHoraCierre())) {
            throw new IllegalArgumentException("El horario seleccionado está fuera del horario de servicio para " + 
                    sucursal.getNombre() + " (" + sucursal.getHoraApertura() + " a " + sucursal.getHoraCierre() + ").");
        }

        // 3. Validar Aforo con ventana de traslape de 1 hora y 59 minutos (119 minutos)
        LocalTime startTime = hora.minusMinutes(119);
        LocalTime endTime = hora.plusMinutes(119);

        // Ajustar en caso de desbordamiento ( midnight wraps) para mantener consultas válidas
        if (endTime.isBefore(startTime)) {
            endTime = LocalTime.MAX;
        }
        if (startTime.isAfter(endTime)) {
            startTime = LocalTime.MIN;
        }

        int totalReserved = reservaRepository.sumReservedGuestsInTimeWindow(sucursal, fecha, startTime, endTime);
        if (totalReserved + personas > sucursal.getAforoMax()) {
            int disponibles = sucursal.getAforoMax() - totalReserved;
            if (disponibles < 0) {
                disponibles = 0;
            }
            throw new AforoCompletoException(
                    "Lo sentimos, el aforo para este horario está completo en la sucursal " + sucursal.getNombre() + 
                    ". Solo quedan " + disponibles + " lugares disponibles para esta hora.", 
                    disponibles
            );
        }

        // 4. Formatear Teléfono WhatsApp
        String rawPhone = whatsapp.replaceAll("[^0-9]", "");
        if (rawPhone.length() == 10) {
            rawPhone = "52" + rawPhone;
        }

        // 5. Generar Enlace de WhatsApp
        java.time.format.DateTimeFormatter dateFormatter = java.time.format.DateTimeFormatter.ofPattern("dd/MM/yyyy");
        String fechaFormateada = fecha.format(dateFormatter);
        String textMessage = "Hola " + nombre + ", te contactamos de Polanco's Roll para confirmar tu reservación para " + 
                personas + " personas el dia " + fechaFormateada + " a las " + hora + ".";
        String waLink = "";
        try {
            String encodedText = URLEncoder.encode(textMessage, StandardCharsets.UTF_8.toString());
            waLink = "https://wa.me/" + rawPhone + "?text=" + encodedText;
        } catch (Exception e) {
            waLink = "https://wa.me/" + rawPhone;
        }

        // 6. Registrar Reserva
        Reserva reserva = new Reserva(nombre, whatsapp, fecha, hora, personas, sucursal);
        reserva.setWaLink(waLink);
        reserva.setEstado("Pendiente");

        return reservaRepository.save(reserva);
    }
}
