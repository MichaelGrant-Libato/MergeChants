package com.appdevg4.mergemasters.mergechants.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.http.ResponseEntity;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.util.StringUtils;

import java.nio.file.*;
import java.io.IOException;
import java.util.*;

@RestController
@RequestMapping("/api/files")
@CrossOrigin(origins = "http://localhost:3000")   // 👈 ADD THIS
public class FileUploadController {

    private final Path root = Paths.get("uploads");

    public FileUploadController() throws IOException {
        Files.createDirectories(root);
    }

    @PostMapping("/upload")
    public ResponseEntity<List<String>> upload(@RequestParam("files") List<MultipartFile> files)
            throws IOException {

        List<String> urls = new ArrayList<>();

        for (MultipartFile file : files) {
            String filename = UUID.randomUUID() + "_" +
                    StringUtils.cleanPath(file.getOriginalFilename());

            Files.copy(file.getInputStream(), root.resolve(filename),
                       StandardCopyOption.REPLACE_EXISTING);

            // URL that React will later use
            urls.add("/uploads/" + filename);
        }

        return ResponseEntity.ok(urls);
    }
}

