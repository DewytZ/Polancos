package com.polancos.sushi.exception;

public class AforoCompletoException extends RuntimeException {
    private final int disponibles;

    public AforoCompletoException(String message, int disponibles) {
        super(message);
        this.disponibles = disponibles;
    }

    public int getDisponibles() {
        return disponibles;
    }
}
