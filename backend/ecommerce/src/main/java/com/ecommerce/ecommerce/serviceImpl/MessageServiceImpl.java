package com.ecommerce.ecommerce.serviceImpl;

import com.ecommerce.ecommerce.dao.Conversation;
import com.ecommerce.ecommerce.dao.Message;
import com.ecommerce.ecommerce.dao.User;
import com.ecommerce.ecommerce.dto.MessageDto;
import com.ecommerce.ecommerce.exception.ResourceNotFound;
import com.ecommerce.ecommerce.repository.MessageRepository;
import com.ecommerce.ecommerce.repository.ConversationRepository;
import com.ecommerce.ecommerce.repository.UserRepository;
import com.ecommerce.ecommerce.service.MessageService;
import com.ecommerce.ecommerce.util.MessageType;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class MessageServiceImpl implements MessageService {
    private final MessageRepository messageRepository;
    private final UserRepository userRepository;
    private final ConversationRepository conversationRepository;
    private final SimpMessagingTemplate messageTemplate;

    public MessageDto.MessageResponse sendMessage (MessageDto.MessageRequest request, Long conversationId, String email) {
        // find conversation between user and shop exist or not
        Conversation conversation = conversationRepository.findById(conversationId).orElseThrow(() -> new ResourceNotFound("Conversation with id [%s] not found".formatted(conversationId)));
        User sender = userRepository.findByEmail(email);

        Message message = Message.builder()
                .content(request.getContent())
                .conversation(conversation)
                .user(sender)
                .messageType(MessageType.TEXT)
                .read(false)
                .createdAt(LocalDateTime.now())
                .build();

        messageRepository.save(message);

        conversation.setLastMessage(message.getContent());
        conversation.setLastMessageAt(message.getCreatedAt());

        conversationRepository.save(conversation);

        MessageDto.MessageResponse response = toMessageResponse(message);

        messageTemplate.convertAndSend("/topic/conversations/"+conversation.getId(), response);

        return response;
    }

    public MessageDto.MessageResponse toMessageResponse(Message message) {
        MessageDto.MessageResponse response = new MessageDto.MessageResponse();

        response.setId(message.getId());
        response.setConversationId(message.getConversation().getId());
        response.setUserId(message.getUser().getId());
        response.setContent(message.getContent());
        response.setMessageType(message.getMessageType());
        response.setRead(message.isRead());
        response.setCreatedAt(message.getCreatedAt());

        return response;
    }

    public MessageDto.MessageChatReponse toMessageChatResponse(Message message) {
        MessageDto.MessageChatReponse response = new MessageDto.MessageChatReponse();
        response.setId(message.getId());
        response.setContent(message.getContent());
        response.setConversationId(message.getConversation().getId());
        response.setUserId(message.getUser().getId());
        response.setCreatedAt(message.getCreatedAt());

        return response;
    }
}
