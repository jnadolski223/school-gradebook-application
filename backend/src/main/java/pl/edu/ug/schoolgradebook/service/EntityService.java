package pl.edu.ug.schoolgradebook.service;

import org.springframework.data.repository.CrudRepository;
import pl.edu.ug.schoolgradebook.exception.EntityNotFoundException;

public abstract class EntityService {
    protected <T, ID> T getOrThrow(CrudRepository<T, ID> repository, Class<T> entityClass, ID entityId) {
        return repository
                .findById(entityId)
                .orElseThrow(() -> new EntityNotFoundException(entityClass, entityId.toString()));
    }
}
