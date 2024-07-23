package com.project.shop_online_be.Service;

import com.project.shop_online_be.Model.Category;
import com.project.shop_online_be.Repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;

@Service
@RequiredArgsConstructor
public class CategoryService {
    private final CategoryRepository categoryRepository;

    public List<Category> findAll(){
        return categoryRepository.findAll();
    }

    public List<Category> findThree(){
        return categoryRepository.findThreeCategory();
    }

    public Category findById(Long id){
       return categoryRepository.findById(id).orElseThrow(NoSuchElementException::new);
    }


}
