package com.retail.billing.dto;

import lombok.*;
import java.time.LocalDateTime;
import java.util.List;

@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class OrderDTO {
    private Long customerId;
    private List<OrderItemDTO> items;
    private Double discountAmount;

    @Data @NoArgsConstructor @AllArgsConstructor
    public static class OrderItemDTO {
        private Long productId;
        private Integer quantity;
    }

    @Data @NoArgsConstructor @AllArgsConstructor @Builder
    public static class OrderResponse {
        private Long id;
        private Long customerId;
        private String customerName;
        private List<ItemResponse> orderItems;
        private LocalDateTime orderDate;
        private Double totalAmount;
        private Double discountAmount;
        private Double finalAmount;
        private String status;

        @Data @NoArgsConstructor @AllArgsConstructor @Builder
        public static class ItemResponse {
            private Long productId;
            private String productName;
            private Integer quantity;
            private Double unitPrice;
            private Double subtotal;
        }
    }
}
