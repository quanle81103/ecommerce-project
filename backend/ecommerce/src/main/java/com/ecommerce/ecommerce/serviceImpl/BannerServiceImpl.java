package com.ecommerce.ecommerce.serviceImpl;

import com.ecommerce.ecommerce.dao.Banner;
import com.ecommerce.ecommerce.dao.Image;
import com.ecommerce.ecommerce.dto.BannerDto;
import com.ecommerce.ecommerce.repository.BannerRepository;
import com.ecommerce.ecommerce.util.Mapper.MapperUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.services.s3.S3Client;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BannerServiceImpl {
    private final BannerRepository bannerRepository;
    private final S3Client s3Client;
    private final S3ServiceImpl s3Service;

    @Value("${aws.s3.bucket}")
    private String bucketName;


    @Transactional
    private BannerDto.BannerResponse uploadBannerImage(MultipartFile file, String folder) throws IOException {
        String path = s3Service.uploadFile(file, folder);
        Banner banner = new Banner();
        LocalDateTime start = LocalDateTime.of(2026, 6, 23, 0, 0);
        // end is 5 days after start
        LocalDateTime end = start.plusDays(6);
        Integer maxOrder = bannerRepository.findMaxDisplayOrder();
        Image image = new Image();
        image.setImageKey(path);
        banner.setStartTime(start);
        banner.setEndTime(end);
        banner.setDisplayOrder(maxOrder == null ? 1 : maxOrder + 1);
        banner.setActive(true);
        banner.setImage(image);
        BannerDto.BannerResponse response =  MapperUtil.mapObject(bannerRepository.save(banner), BannerDto.BannerResponse.class);
        response.setBannerUrl(s3Service.getFileUrl(banner.getImage().getImageKey()));
        return response;
    }

    private boolean isActive(Banner banner) {
        LocalDateTime now = LocalDateTime.now();

        return now.isAfter(banner.getStartTime()) && now.isBefore(banner.getEndTime());
    }

    public List<BannerDto.BannerResponse> uploadBanners(List<MultipartFile> files) {
        return files.stream().map(file -> {
            try {
                return uploadBannerImage(file, "banner");
            } catch (IOException e) {
                throw new RuntimeException(e);
            }
        }).toList();
    }

    public List<BannerDto.BannerResponse> findAllActiveBannerBetweenTime() {
        LocalDateTime now = LocalDateTime.now();
        List<Banner> banners = bannerRepository.findAllActiveBannerBetween(now);

        return banners.stream().map(banner -> {
            BannerDto.BannerResponse response = MapperUtil.mapObject(banner, BannerDto.BannerResponse.class);
            response.setBannerUrl(s3Service.getFileUrl(banner.getImage().getImageKey()));
            return response;
        }).toList();
    }

    public void disableBanner(Long bannerId) {
        Banner banner = bannerRepository.findById(bannerId).orElseThrow(() -> new RuntimeException("Banner not found"));
        banner.setActive(false);
        bannerRepository.save(banner);
    }
}
