package com.ecommerce.ecommerce.dao;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.beans.factory.annotation.Value;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity

public class Shop {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String description;
    private String logoUrl;

    @ManyToOne(cascade = {CascadeType.DETACH, CascadeType.PERSIST, CascadeType.REFRESH, CascadeType.MERGE})
    @JoinColumn(name = "user_id")
    private User user;

    @OneToMany(mappedBy = "shop", fetch = FetchType.LAZY, cascade = {CascadeType.DETACH, CascadeType.PERSIST, CascadeType.REFRESH, CascadeType.MERGE})
    private List<Product> products;

    @Column(name = "ghn_token")
    private String ghnToken;

    @Column(name = "ghn_shop_id")
    private Integer ghnShopId;

    @Column(name = "ghn_connected")
    private boolean ghnConnected;

    private String fromName;

    private String fromPhone;

    private String fromAddress;

    private String fromWardName;

    private String fromDistrictName;

    private String fromProvinceName;
}
