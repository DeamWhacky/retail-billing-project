package com.retail.billing.service;

import com.retail.billing.entity.Product;
import com.retail.billing.exception.ResourceNotFoundException;
import com.retail.billing.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepo;

    public List<Product> getAllProducts() {
        return productRepo.findAll();
    }

    public Product getById(Long id) {
        return productRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product", id));
    }

    public List<Product> getByCategory(String category) {
        return productRepo.findByCategory(category);
    }

    public List<Product> searchByName(String name) {
        return productRepo.findByNameContainingIgnoreCase(name);
    }

    public Product create(Product product) {
        return productRepo.save(product);
    }

    public Product update(Long id, Product updated) {
        Product existing = getById(id);
        existing.setName(updated.getName());
        existing.setCategory(updated.getCategory());
        existing.setPrice(updated.getPrice());
        existing.setStockQuantity(updated.getStockQuantity());
        existing.setDescription(updated.getDescription());
        existing.setImageUrl(updated.getImageUrl());
        return productRepo.save(existing);
    }

    public void delete(Long id) {
        getById(id); // throws if not found
        productRepo.deleteById(id);
    }

    public Product updateStock(Long id, int quantity) {
        Product p = getById(id);
        if (p.getStockQuantity() < quantity)
            throw new RuntimeException("Insufficient stock for product: " + p.getName());
        p.setStockQuantity(p.getStockQuantity() - quantity);
        return productRepo.save(p);
    }
}
