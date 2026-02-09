package pl.edu.ug.schoolgradebook.exception;

public class EntityNotFoundException extends RuntimeException {
    public <T> EntityNotFoundException(Class<T> entityClass, String id) {
        super(entityClass.getSimpleName() + " with ID " + id + " not found");
    }
}
