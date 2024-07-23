package com.project.shop_online_be.Service;

import com.project.shop_online_be.Model.Address;
import com.project.shop_online_be.Repository.AddressRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AddressService {
    private final AddressRepository addressRepository;

    public Address createAddress (Address address) {
        Optional<Address> sameAddress = addressRepository.findTheSameAddress(
              address.getProvinces().getValue(),
              address.getProvinces().getLabel(),
              address.getDistricts().getValue(),
              address.getDistricts().getLabel(),
              address.getCommunes().getValue(),
              address.getCommunes().getLabel(),
              address.getAddressDetail());
        if(sameAddress.isEmpty()) {
            addressRepository.save(address);
        }
        return sameAddress.orElseGet(() -> addressRepository.save(address));
    }

}
