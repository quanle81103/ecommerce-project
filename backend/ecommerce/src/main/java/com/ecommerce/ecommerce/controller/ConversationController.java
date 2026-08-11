package com.ecommerce.ecommerce.controller;

import com.ecommerce.ecommerce.dao.User;
import com.ecommerce.ecommerce.dto.ConversationDto;
import com.ecommerce.ecommerce.dto.MessageDto;
import com.ecommerce.ecommerce.response.ResponseObject;
import com.ecommerce.ecommerce.serviceImpl.ConversationServiceImpl;
import com.ecommerce.ecommerce.serviceImpl.MessageServiceImpl;
import com.ecommerce.ecommerce.util.AuthUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("${api.prefix}/conversations")
public class ConversationController {
    private final ConversationServiceImpl conversationService;
    private final MessageServiceImpl messageService;

    @PostMapping
    public ResponseObject<ConversationDto.ConversationResponse> createConversation(@RequestBody ConversationDto.ConversationRequest request) {
        Long currentUserId = AuthUtil.getCurrentUserId();
        return new ResponseObject<>(HttpStatus.OK, "Success", conversationService.createConversation(request, currentUserId));
    }

    @GetMapping
    public ResponseObject<List<ConversationDto.ConversationResponse>> getConversations() {
        Long currentUserId = AuthUtil.getCurrentUserId();
        return new ResponseObject<>(HttpStatus.OK, "Success", conversationService.getConversations(currentUserId));
    }

    // get all messages a conversation order in ascending time
    @GetMapping("{conversationId}/messages")
    public ResponseObject<List<MessageDto.MessageChatReponse>> getMessages(@PathVariable Long conversationId) {
        Long currentUserId = AuthUtil.getCurrentUserId();
        return new ResponseObject<>(HttpStatus.OK, "Success", conversationService.getMessages(conversationId, currentUserId));
    }

    @MessageMapping("/{conversationId}/messages")
    public MessageDto.MessageResponse sendMessage(@Payload MessageDto.MessageRequest request, @DestinationVariable Long conversationId, Principal principal) {
        String email = principal.getName();
        return messageService.sendMessage(request, conversationId, email);
    }

    @GetMapping("/buyer")
    public ResponseObject<List<ConversationDto.BuyerConversationResponse>> getConversationsOfBuyer() {
        return new ResponseObject<>(HttpStatus.OK, "Success", conversationService.getConversationsOfBuyer());
    }

    @GetMapping("/seller")
    public ResponseObject<List<ConversationDto.SellerConversationResponse>> getConversationsOfSeller() {
        return new ResponseObject<>(HttpStatus.OK, "Success", conversationService.getConversationOfSeller());
    }
}