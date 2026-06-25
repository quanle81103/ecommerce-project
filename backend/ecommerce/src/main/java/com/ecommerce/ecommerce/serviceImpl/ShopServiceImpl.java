package com.ecommerce.ecommerce.serviceImpl;

import com.ecommerce.ecommerce.dao.Role;
import com.ecommerce.ecommerce.dao.Shop;
import com.ecommerce.ecommerce.dao.User;
import com.ecommerce.ecommerce.dto.ShopDto;
import com.ecommerce.ecommerce.exception.ResourceNotFound;
import com.ecommerce.ecommerce.repository.RoleRepository;
import com.ecommerce.ecommerce.repository.ShopRepository;
import com.ecommerce.ecommerce.repository.UserRepository;
import com.ecommerce.ecommerce.service.ShopService;
import com.ecommerce.ecommerce.util.MapperUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ShopServiceImpl implements ShopService {
    private final GhnServiceImpl ghnService;
    private final S3ServiceImpl s3Service;
    private final ShopRepository shopRepository;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final S3Client s3Client;
    @Value("${aws.s3.bucket}")
    private String bucketName;

    @Transactional
    @Override
    public ShopDto.ShopResponse createShop(ShopDto.CreateShopRequest request, MultipartFile file) throws IOException {
        String logo_Url = s3Service.uploadFile(file, "shops");
        Shop shop = new Shop();
        shop.setDescription(request.getDescription());
        // get LogoUrl, Logo image was uploaded to aws
        shop.setLogoUrl(logo_Url);
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new ResourceNotFound("User with id [%s] not found".formatted(request.getUserId())));
        shop.setUser(user);

        Role shopOwnerRole = roleRepository.findByName("ROLE_SHOP_OWNER")
                .orElseThrow(() -> new IllegalStateException("ROLE_SHOP_OWNER not seeded"));
        if (user.getRoles().stream().noneMatch(r -> r.getName().equals(shopOwnerRole.getName()))) {
            user.getRoles().add(shopOwnerRole);
            userRepository.save(user);
        }

        return MapperUtil.mapObject(shopRepository.save(shop), ShopDto.ShopResponse.class);
    }

    @Override
    public ShopDto.ShopResponse getShopById(Long shopId) {
        return MapperUtil.mapObject(shopRepository.findById(shopId).orElseThrow(() -> new ResourceNotFound("Shop with id [%s] not found".formatted(shopId))), ShopDto.ShopResponse.class);
    }

    @Override
    public List<ShopDto.ShopResponse> getAllShops() {
        return MapperUtil.mapList(shopRepository.findAll(), ShopDto.ShopResponse.class);
    }


    @Override
    public void deleteShop(Long shopId) {

    }

    @Transactional
    @Override
    public void connectGhn(Long shopId, Long userId, String ghnToken, Integer ghnShopId) {
        Shop shop = shopRepository.findById(shopId).orElseThrow(() -> new ResourceNotFound("Shop not exist"));
        if (shop.getUser() == null || !shop.getUser().getId().equals(userId)) {
            throw new AccessDeniedException("You do not own this shop");
        }
        String ghnshopId = String.valueOf(ghnShopId);
        if (ghnService.verifyGhnCredentials(ghnToken, String.valueOf(ghnShopId))) {
            shop.setGhnToken(ghnToken);
            shop.setGhnShopId(ghnShopId);
            shop.setFromName(ghnService.getInfo(ghnToken, ghnshopId).getName());
            shop.setFromWardName(ghnService.getWardName(ghnToken, ghnshopId));
            shop.setFromDistrictName(ghnService.getDistrictName(ghnToken, ghnshopId));
            shop.setFromProvinceName(ghnService.getProvinceName(ghnToken, ghnshopId));
            shop.setFromAddress(ghnService.getInfo(ghnToken, ghnshopId).getAddress());
            shop.setFromPhone(ghnService.getInfo(ghnToken, ghnshopId).getPhone());
            shop.setGhnConnected(true);
        }

        shopRepository.save(shop);
    }

    @Override
    public Page<ShopDto.ShopResponse> getAll(Pageable pageable) {
        return shopRepository.findAll(pageable).map(s -> MapperUtil.mapObject(s, ShopDto.ShopResponse.class));
    }
}
