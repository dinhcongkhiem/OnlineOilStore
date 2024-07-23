package com.project.shop_online_be.Controller;

import com.project.shop_online_be.Request.DeliveryRequest;
import com.project.shop_online_be.Service.DeliveryService;
import com.project.shop_online_be.Service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.data.domain.Page;
import org.springframework.data.web.PagedModel;
import org.springframework.data.web.PagedResourcesAssembler;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RequestMapping("/api/v1/admin")
@RestController
@RequiredArgsConstructor
public class AdminController {
    private final OrderService orderService;
    private final DeliveryService deliveryService;

    @GetMapping("/order")
    public ResponseEntity<?> findAll(
            @RequestParam(defaultValue = "0") Integer page,
            @RequestParam List<Integer> statusFilter,
            @RequestParam(required = false) @DateTimeFormat(fallbackPatterns = "dd/MM/yyyy") Date startDate,
            @RequestParam(required = false) @DateTimeFormat(fallbackPatterns = "dd/MM/yyyy") Date endDate,
            PagedResourcesAssembler assembler
    ) {
        return ResponseEntity.ok(assembler.toModel(orderService.getOrder(page, startDate, endDate, statusFilter)));
    }

    @PatchMapping("/order")
    public ResponseEntity<?> updateStatus(@RequestParam int status, @RequestParam Long orderId) {
        try {
            return orderService.updateStatusOrder(status, orderId);
        } catch (NoSuchElementException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/delivery")
    public ResponseEntity<?> getDelivery(
            @RequestParam(defaultValue = "0") Integer page,
            @RequestParam List<Integer> statusFilter,
            @RequestParam(required = false) @DateTimeFormat(fallbackPatterns = "dd/MM/yyyy") Date startDate,
            @RequestParam(required = false) @DateTimeFormat(fallbackPatterns = "dd/MM/yyyy") Date endDate,
            PagedResourcesAssembler assembler) {
        return ResponseEntity.ok(assembler.toModel(deliveryService.getDeliveries(page, startDate, endDate, statusFilter)));
    }

    @PostMapping("/delivery-update")
    public ResponseEntity<?> updateDeliveryStatus(
            @RequestBody List<String> deliveriesAlias,
            @RequestParam(defaultValue = "0") Integer page,
            @RequestParam List<Integer> statusFilter,
            @RequestParam(required = false) @DateTimeFormat(fallbackPatterns = "dd/MM/yyyy") Date startDate,
            @RequestParam(required = false) @DateTimeFormat(fallbackPatterns = "dd/MM/yyyy") Date endDate,
            PagedResourcesAssembler assembler) {
        return ResponseEntity.ok(
                assembler.toModel(deliveryService.
                        handleUpdateStatus(deliveriesAlias, page, startDate, endDate, statusFilter)));
    }

    @GetMapping("/delivery-cancel")
    public ResponseEntity<?> updateDeliveryStatus(
            @RequestParam String deliveryAlias) {
        Boolean isSuccess = deliveryService.cancelDelivery(deliveryAlias);
        if (isSuccess) {
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/delivery-label")
    public ResponseEntity<byte[]> printLabel(@RequestParam String deliveryAlias) {
        byte[] pdfData = deliveryService.printLabel(deliveryAlias);
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDispositionFormData("attachment", deliveryAlias + ".pdf");
        headers.setContentLength(pdfData.length);


        return ResponseEntity.ok()
                .headers(headers)
                .contentLength(pdfData.length)
                .body(pdfData);

    }

    @GetMapping("/delivery-exists")
    public ResponseEntity<?> getDeliveryExists(
            @RequestParam Long orderId) {
        return ResponseEntity.ok(deliveryService.isExistsDelivery(orderId));
    }

    @PostMapping("/delivery")
    public ResponseEntity<?> createDelivery(@RequestBody DeliveryRequest deliveryRequest) {
        Boolean isSuccess = deliveryService.createDelivery(deliveryRequest);
        if (isSuccess) {
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.badRequest().build();
    }


}
