package io.myskool.repository;

import io.myskool.domain.Program;
import java.util.List;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Program entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ProgramRepository extends JpaRepository<Program, Long> {
    @Query("select program from Program program where program.user.login = ?#{principal.username}")
    List<Program> findByUserIsCurrentUser();
}
