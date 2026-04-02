package com.team17.cinema.entity.converter;

import com.team17.cinema.entity.Role;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = false)
public class RoleConverter implements AttributeConverter<Role, Integer> {

    @Override
    public Integer convertToDatabaseColumn(Role attribute) {
        if (attribute == null) {
            return null;
        }
        return switch (attribute) {
            case ADMIN -> 1;
            case CUSTOMER -> 2;
        };
    }

    @Override
    public Role convertToEntityAttribute(Integer dbData) {
        if (dbData == null) {
            return null;
        }
        return switch (dbData) {
            case 1 -> Role.ADMIN;
            case 2 -> Role.CUSTOMER;
            default -> throw new IllegalArgumentException("Unknown role id: " + dbData);
        };
    }
}
