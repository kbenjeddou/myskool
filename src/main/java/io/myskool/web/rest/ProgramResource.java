package io.myskool.web.rest;

import io.myskool.domain.Program;
import io.myskool.repository.ProgramRepository;
import io.myskool.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.PaginationUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link io.myskool.domain.Program}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class ProgramResource {

    private final Logger log = LoggerFactory.getLogger(ProgramResource.class);

    private static final String ENTITY_NAME = "program";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ProgramRepository programRepository;

    public ProgramResource(ProgramRepository programRepository) {
        this.programRepository = programRepository;
    }

    /**
     * {@code POST  /programs} : Create a new program.
     *
     * @param program the program to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new program, or with status {@code 400 (Bad Request)} if the program has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/programs")
    public ResponseEntity<Program> createProgram(@Valid @RequestBody Program program) throws URISyntaxException {
        log.debug("REST request to save Program : {}", program);
        if (program.getId() != null) {
            throw new BadRequestAlertException("A new program cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Program result = programRepository.save(program);
        return ResponseEntity
            .created(new URI("/api/programs/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /programs/:id} : Updates an existing program.
     *
     * @param id the id of the program to save.
     * @param program the program to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated program,
     * or with status {@code 400 (Bad Request)} if the program is not valid,
     * or with status {@code 500 (Internal Server Error)} if the program couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/programs/{id}")
    public ResponseEntity<Program> updateProgram(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody Program program
    ) throws URISyntaxException {
        log.debug("REST request to update Program : {}, {}", id, program);
        if (program.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, program.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!programRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Program result = programRepository.save(program);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, program.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /programs/:id} : Partial updates given fields of an existing program, field will ignore if it is null
     *
     * @param id the id of the program to save.
     * @param program the program to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated program,
     * or with status {@code 400 (Bad Request)} if the program is not valid,
     * or with status {@code 404 (Not Found)} if the program is not found,
     * or with status {@code 500 (Internal Server Error)} if the program couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/programs/{id}", consumes = "application/merge-patch+json")
    public ResponseEntity<Program> partialUpdateProgram(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Program program
    ) throws URISyntaxException {
        log.debug("REST request to partial update Program partially : {}, {}", id, program);
        if (program.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, program.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!programRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Program> result = programRepository
            .findById(program.getId())
            .map(
                existingProgram -> {
                    if (program.getCover() != null) {
                        existingProgram.setCover(program.getCover());
                    }
                    if (program.getCoverContentType() != null) {
                        existingProgram.setCoverContentType(program.getCoverContentType());
                    }
                    if (program.getTitle() != null) {
                        existingProgram.setTitle(program.getTitle());
                    }
                    if (program.getDescription() != null) {
                        existingProgram.setDescription(program.getDescription());
                    }
                    if (program.getStartDate() != null) {
                        existingProgram.setStartDate(program.getStartDate());
                    }
                    if (program.getEndDate() != null) {
                        existingProgram.setEndDate(program.getEndDate());
                    }
                    if (program.getTags() != null) {
                        existingProgram.setTags(program.getTags());
                    }

                    return existingProgram;
                }
            )
            .map(programRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, program.getId().toString())
        );
    }

    /**
     * {@code GET  /programs} : get all the programs.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of programs in body.
     */
    @GetMapping("/programs")
    public ResponseEntity<List<Program>> getAllPrograms(Pageable pageable) {
        log.debug("REST request to get a page of Programs");
        Page<Program> page = programRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /programs/:id} : get the "id" program.
     *
     * @param id the id of the program to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the program, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/programs/{id}")
    public ResponseEntity<Program> getProgram(@PathVariable Long id) {
        log.debug("REST request to get Program : {}", id);
        Optional<Program> program = programRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(program);
    }

    /**
     * {@code DELETE  /programs/:id} : delete the "id" program.
     *
     * @param id the id of the program to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/programs/{id}")
    public ResponseEntity<Void> deleteProgram(@PathVariable Long id) {
        log.debug("REST request to delete Program : {}", id);
        programRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
