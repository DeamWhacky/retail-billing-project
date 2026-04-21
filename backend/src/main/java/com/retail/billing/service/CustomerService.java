package com.retail.billing.service;

import com.retail.billing.entity.Customer;
import com.retail.billing.exception.ResourceNotFoundException;
import com.retail.billing.repository.CustomerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CustomerService {

    @Autowired
    private CustomerRepository customerRepo;

    public List<Customer> getAllCustomers() {
        return customerRepo.findAll();
    }

    public Customer getById(Long id) {
        return customerRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Customer", id));
    }

    public List<Customer> searchByName(String name) {
        return customerRepo.findByNameContainingIgnoreCase(name);
    }

    public Customer create(Customer customer) {
        if (customerRepo.existsByEmail(customer.getEmail()))
            throw new RuntimeException("Email already registered: " + customer.getEmail());
        return customerRepo.save(customer);
    }

    public Customer update(Long id, Customer updated) {
        Customer existing = getById(id);
        existing.setName(updated.getName());
        existing.setPhone(updated.getPhone());
        existing.setAddress(updated.getAddress());
        existing.setCity(updated.getCity());
        existing.setPincode(updated.getPincode());
        return customerRepo.save(existing);
    }

    public void delete(Long id) {
        getById(id);
        customerRepo.deleteById(id);
    }
}
