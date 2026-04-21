package com.retail.billing.service;

import com.retail.billing.dto.OrderDTO;
import com.retail.billing.dto.OrderDTO.*;
import com.retail.billing.entity.*;
import com.retail.billing.exception.ResourceNotFoundException;
import com.retail.billing.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrderService {

    @Autowired private OrderRepository orderRepo;
    @Autowired private CustomerService customerService;
    @Autowired private ProductService productService;

    @Transactional
    public OrderResponse createOrder(OrderDTO dto) {
        Customer customer = customerService.getById(dto.getCustomerId());

        Order order = Order.builder()
                .customer(customer)
                .discountAmount(dto.getDiscountAmount() != null ? dto.getDiscountAmount() : 0.0)
                .build();

        List<OrderItem> items = dto.getItems().stream().map(itemDto -> {
            Product product = productService.getById(itemDto.getProductId());
            productService.updateStock(itemDto.getProductId(), itemDto.getQuantity());
            double subtotal = product.getPrice() * itemDto.getQuantity();
            return OrderItem.builder()
                    .order(order)
                    .product(product)
                    .quantity(itemDto.getQuantity())
                    .unitPrice(product.getPrice())
                    .subtotal(subtotal)
                    .build();
        }).collect(Collectors.toList());

        order.setOrderItems(items);
        double total = items.stream().mapToDouble(OrderItem::getSubtotal).sum();
        order.setTotalAmount(total);
        order.setFinalAmount(total - order.getDiscountAmount());
        order.setStatus(Order.OrderStatus.PENDING);

        Order saved = orderRepo.save(order);
        return toResponse(saved);
    }

    public List<OrderResponse> getAllOrders() {
        return orderRepo.findAll().stream().map(this::toResponse).collect(Collectors.toList());
    }

    public OrderResponse getById(Long id) {
        return toResponse(orderRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order", id)));
    }

    public List<OrderResponse> getByCustomer(Long customerId) {
        return orderRepo.findByCustomerId(customerId)
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    @Transactional
    public OrderResponse updateStatus(Long id, String status) {
        Order order = orderRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order", id));
        order.setStatus(Order.OrderStatus.valueOf(status.toUpperCase()));
        return toResponse(orderRepo.save(order));
    }

    public void deleteOrder(Long id) {
        orderRepo.findById(id).orElseThrow(() -> new ResourceNotFoundException("Order", id));
        orderRepo.deleteById(id);
    }

    public Double getTotalRevenue() {
        return orderRepo.getTotalRevenue();
    }

    public Long getCompletedOrderCount() {
        return orderRepo.countCompletedOrders();
    }

    private OrderResponse toResponse(Order o) {
        List<OrderResponse.ItemResponse> itemResponses = o.getOrderItems().stream()
                .map(i -> OrderResponse.ItemResponse.builder()
                        .productId(i.getProduct().getId())
                        .productName(i.getProduct().getName())
                        .quantity(i.getQuantity())
                        .unitPrice(i.getUnitPrice())
                        .subtotal(i.getSubtotal())
                        .build())
                .collect(Collectors.toList());

        return OrderResponse.builder()
                .id(o.getId())
                .customerId(o.getCustomer().getId())
                .customerName(o.getCustomer().getName())
                .orderItems(itemResponses)
                .orderDate(o.getOrderDate())
                .totalAmount(o.getTotalAmount())
                .discountAmount(o.getDiscountAmount())
                .finalAmount(o.getFinalAmount())
                .status(o.getStatus().name())
                .build();
    }
}
