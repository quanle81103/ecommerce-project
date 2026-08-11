package com.ecommerce.ecommerce.serviceImpl;

import com.ecommerce.ecommerce.dao.Conversation;
import com.ecommerce.ecommerce.dao.Message;
import com.ecommerce.ecommerce.dao.Shop;
import com.ecommerce.ecommerce.dao.User;
import com.ecommerce.ecommerce.dto.ConversationDto;
import com.ecommerce.ecommerce.dto.MessageDto;
import com.ecommerce.ecommerce.exception.ResourceNotFound;
import com.ecommerce.ecommerce.repository.ConversationRepository;
import com.ecommerce.ecommerce.repository.MessageRepository;
import com.ecommerce.ecommerce.repository.ShopRepository;
import com.ecommerce.ecommerce.repository.UserRepository;
import com.ecommerce.ecommerce.util.AuthUtil;
import com.ecommerce.ecommerce.util.MapperUtil;
import lombok.RequiredArgsConstructor;
import org.mapstruct.Mapper;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;


@Service
@RequiredArgsConstructor
public class ConversationServiceImpl {
    private final ConversationRepository conversationRepository;
    private final UserServiceImpl userService;
    private final MessageRepository messageRepository;
    private final MessageServiceImpl messageService;
    private final ShopRepository shopRepository;

    public ConversationDto.ConversationResponse createConversation (ConversationDto.ConversationRequest request, Long userId) {
        Optional<Conversation> conversation = conversationRepository.findByBuyer_IdAndShop_Id(userId, request.getShopId());

        if (conversation.isPresent()) {
            return toResponse(conversation.get());
        }

        Shop shop = shopRepository.findById(request.getShopId()).orElseThrow(() -> new ResourceNotFound("Shop with id [%s] not found".formatted(request.getShopId())));
        User user = MapperUtil.mapObject(userService.getUserById(userId), User.class);
        Conversation newConversation = Conversation.builder()
                .buyer(user)
                .shop(shop)
                .createdAt(LocalDateTime.now())
                .build();

        conversationRepository.save(newConversation);

        return toResponse(newConversation);
    }

    public List<ConversationDto.ConversationResponse> getConversations (Long userId) {
        List<Conversation> conversations = conversationRepository.findByBuyer_Id(userId);
        return MapperUtil.mapList(conversations, ConversationDto.ConversationResponse.class);
    }

    public List<MessageDto.MessageChatReponse> getMessages (Long conversationId, Long userId) {
        Conversation conversation = conversationRepository.findById(conversationId).orElseThrow(() -> new ResourceNotFound("Conversation not found"));
        if (!conversation.getBuyer().getId().equals(userId)
                && !conversation.getShop().getUser().getId().equals(userId)) {
            throw new AccessDeniedException("Fobidden: User with id [%s] are not permitted to access this conversation".formatted(conversation.getBuyer().getId()));
        }
        List<Message> messages = messageRepository.findByConversation_IdOrderByCreatedAtAsc(conversationId);

        return messages.stream().map(messageService::toMessageChatResponse).toList();
    }

    private ConversationDto.ConversationResponse toResponse(Conversation conversation) {

        ConversationDto.ConversationResponse response = new ConversationDto.ConversationResponse();

        response.setId(conversation.getId());
        response.setShopId(conversation.getShop().getId());
        response.setShopName(conversation.getShop().getFromName());
        response.setLastMessage(conversation.getLastMessage());
        response.setLastMessageAt(conversation.getLastMessageAt());
        response.setUnreadCount(0);

        return response;
    }

    // shop means seller
    public List<ConversationDto.SellerConversationResponse> getConversationOfSeller() {
        Long userId = AuthUtil.getCurrentUserId();

        Shop shop = shopRepository.findByUser_Id(userId).orElseThrow(() -> new ResourceNotFound("Shop with user id [%s] not found".formatted(userId)));

        List<Conversation> conversations = conversationRepository.findByShop_IdOrderByLastMessageAtDesc(shop.getId());

        return conversations.stream().map(this::toSellerResponse).toList();
    }

    private ConversationDto.SellerConversationResponse toSellerResponse(Conversation conversation) {
        String name = conversation.getBuyer().getFirstName() + conversation.getBuyer().getLastName();
        return ConversationDto.SellerConversationResponse
                .builder()
                .id(conversation.getId())
                .buyerId(conversation.getBuyer().getId())
                .buyerName(name)
                .lastMessage(conversation.getLastMessage())
                .lastMessageAt(conversation.getLastMessageAt())
                .build();
    }

    private ConversationDto.BuyerConversationResponse toBuyerResponse(Conversation conversation) {
        return ConversationDto.BuyerConversationResponse
                .builder()
                .id(conversation.getId())
                .shopId(conversation.getShop().getId())
                .shopName(conversation.getShop().getFromName())
                .lastMessage(conversation.getLastMessage())
                .lastMessageAt(conversation.getLastMessageAt())
                .build();
    }

    public List<ConversationDto.BuyerConversationResponse> getConversationsOfBuyer() {
        Long userId = AuthUtil.getCurrentUserId();

        List<Conversation> conversations = conversationRepository.findByBuyer_IdOrderByLastMessageAtDesc(userId);

        return conversations.stream().map(this::toBuyerResponse).toList();
    }
}
