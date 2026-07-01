package com.ecommerce.ecommerce.dao;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.NaturalId;
import software.amazon.awssdk.annotations.NotNull;

import java.util.Collection;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String firstName;
    private String lastName;
    @Column(unique = true, nullable = false)
    private String email;
    private String place;
    private String password;
    private String phone;

    // ghn
    private String wardCode;
    private String wardName;
    private String districtName;
    private Integer districtId;
    private String provinceName;

    @OneToOne(mappedBy = "user", fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    private Cart cart;

//    @OneToMany(mappedBy = "payments", cascade = CascadeType.ALL)
//    private List<Payment> payments;

    @OneToMany(mappedBy = "user")
    private Set<Order> orders = new HashSet<>();

    @ManyToMany(cascade = {CascadeType.DETACH, CascadeType.REFRESH, CascadeType.MERGE}, fetch = FetchType.EAGER)
    @JoinTable(
            name = "user_role",
            joinColumns = @JoinColumn(name = "user_id", referencedColumnName = "id"),
            inverseJoinColumns = @JoinColumn(name = "role_id", referencedColumnName = "id")
    )
    private Collection<Role> roles = new HashSet<>();

}
