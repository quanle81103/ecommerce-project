package com.ecommerce.ecommerce.util.Mapper;

import org.modelmapper.ModelMapper;

import java.util.List;
import java.util.stream.Collectors;

public class MapperUtil {
    private static final ModelMapper modelMapper = new ModelMapper();

    public static <S, D> D mapObject(S source, Class<D> destinationType) {
        return modelMapper.map(source, destinationType);
    }

    public static <S, D> List<D> mapList(List<S> sources, Class<D> destinationType) {
        return sources.stream().map(source -> mapObject(source, destinationType)).collect(Collectors.toList());
    }
}
