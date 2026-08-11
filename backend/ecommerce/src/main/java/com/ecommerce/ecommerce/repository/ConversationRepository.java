package com.ecommerce.ecommerce.repository;

import com.ecommerce.ecommerce.dao.Conversation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ConversationRepository extends JpaRepository<Conversation, Long> {
    Optional<Conversation> findByBuyer_IdAndShop_Id(Long userId, Long shopId);
    List<Conversation> findByBuyer_Id(Long userId);
    List<Conversation> findByShop_IdOrderByLastMessageAtDesc(Long shopId);
    List<Conversation> findByBuyer_IdOrderByLastMessageAtDesc(Long buyerId);
}
