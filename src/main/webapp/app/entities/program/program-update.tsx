import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col, Label } from 'reactstrap';
import { AvFeedback, AvForm, AvGroup, AvInput, AvField } from 'availity-reactstrap-validation';
import { setFileData, openFile, byteSize, translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';

import { IUser } from 'app/shared/model/user.model';
import { getUsers } from 'app/modules/administration/user-management/user-management.reducer';
import { getEntity, updateEntity, createEntity, setBlob, reset } from './program.reducer';
import { IProgram } from 'app/shared/model/program.model';
import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';

export interface IProgramUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const ProgramUpdate = (props: IProgramUpdateProps) => {
  const [isNew] = useState(!props.match.params || !props.match.params.id);

  const { programEntity, users, loading, updating } = props;

  const { cover, coverContentType } = programEntity;

  const handleClose = () => {
    props.history.push('/program' + props.location.search);
  };

  useEffect(() => {
    if (isNew) {
      props.reset();
    } else {
      props.getEntity(props.match.params.id);
    }

    props.getUsers();
  }, []);

  const onBlobChange = (isAnImage, name) => event => {
    setFileData(event, (contentType, data) => props.setBlob(name, data, contentType), isAnImage);
  };

  const clearBlob = name => () => {
    props.setBlob(name, undefined, undefined);
  };

  useEffect(() => {
    if (props.updateSuccess) {
      handleClose();
    }
  }, [props.updateSuccess]);

  const saveEntity = (event, errors, values) => {
    if (errors.length === 0) {
      const entity = {
        ...programEntity,
        ...values,
        user: users.find(it => it.id.toString() === values.userId.toString()),
      };

      if (isNew) {
        props.createEntity(entity);
      } else {
        props.updateEntity(entity);
      }
    }
  };

  return (
    <div>
      <Row className="justify-content-center">
        <Col md="8">
          <h2 id="myskoolApp.program.home.createOrEditLabel" data-cy="ProgramCreateUpdateHeading">
            Create or edit a Program
          </h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <AvForm model={isNew ? {} : programEntity} onSubmit={saveEntity}>
              {!isNew ? (
                <AvGroup>
                  <Label for="program-id">ID</Label>
                  <AvInput id="program-id" type="text" className="form-control" name="id" required readOnly />
                </AvGroup>
              ) : null}
              <AvGroup>
                <AvGroup>
                  <Label id="coverLabel" for="cover">
                    Cover
                  </Label>
                  <br />
                  {cover ? (
                    <div>
                      {coverContentType ? (
                        <a onClick={openFile(coverContentType, cover)}>
                          <img src={`data:${coverContentType};base64,${cover}`} style={{ maxHeight: '100px' }} />
                        </a>
                      ) : null}
                      <br />
                      <Row>
                        <Col md="11">
                          <span>
                            {coverContentType}, {byteSize(cover)}
                          </span>
                        </Col>
                        <Col md="1">
                          <Button color="danger" onClick={clearBlob('cover')}>
                            <FontAwesomeIcon icon="times-circle" />
                          </Button>
                        </Col>
                      </Row>
                    </div>
                  ) : null}
                  <input id="file_cover" data-cy="cover" type="file" onChange={onBlobChange(true, 'cover')} accept="image/*" />
                  <AvInput
                    type="hidden"
                    name="cover"
                    value={cover}
                    validate={{
                      required: { value: true, errorMessage: 'This field is required.' },
                    }}
                  />
                </AvGroup>
              </AvGroup>
              <AvGroup>
                <Label id="titleLabel" for="program-title">
                  Title
                </Label>
                <AvField
                  id="program-title"
                  data-cy="title"
                  type="text"
                  name="title"
                  validate={{
                    required: { value: true, errorMessage: 'This field is required.' },
                    minLength: { value: 5, errorMessage: 'This field is required to be at least 5 characters.' },
                    maxLength: { value: 30, errorMessage: 'This field cannot be longer than 30 characters.' },
                  }}
                />
              </AvGroup>
              <AvGroup>
                <Label id="descriptionLabel" for="program-description">
                  Description
                </Label>
                <AvField
                  id="program-description"
                  data-cy="description"
                  type="text"
                  name="description"
                  validate={{
                    required: { value: true, errorMessage: 'This field is required.' },
                    maxLength: { value: 300, errorMessage: 'This field cannot be longer than 300 characters.' },
                  }}
                />
              </AvGroup>
              <AvGroup>
                <Label id="startDateLabel" for="program-startDate">
                  Start Date
                </Label>
                <AvField
                  id="program-startDate"
                  data-cy="startDate"
                  type="date"
                  className="form-control"
                  name="startDate"
                  validate={{
                    required: { value: true, errorMessage: 'This field is required.' },
                  }}
                />
              </AvGroup>
              <AvGroup>
                <Label id="endDateLabel" for="program-endDate">
                  End Date
                </Label>
                <AvField
                  id="program-endDate"
                  data-cy="endDate"
                  type="date"
                  className="form-control"
                  name="endDate"
                  validate={{
                    required: { value: true, errorMessage: 'This field is required.' },
                  }}
                />
              </AvGroup>
              <AvGroup>
                <Label id="tagsLabel" for="program-tags">
                  Tags
                </Label>
                <AvField
                  id="program-tags"
                  data-cy="tags"
                  type="text"
                  name="tags"
                  validate={{
                    minLength: { value: 3, errorMessage: 'This field is required to be at least 3 characters.' },
                    maxLength: { value: 30, errorMessage: 'This field cannot be longer than 30 characters.' },
                  }}
                />
              </AvGroup>
              <AvGroup>
                <Label for="program-user">User</Label>
                <AvInput id="program-user" data-cy="user" type="select" className="form-control" name="userId">
                  <option value="" key="0" />
                  {users
                    ? users.map(otherEntity => (
                        <option value={otherEntity.id} key={otherEntity.id}>
                          {otherEntity.login}
                        </option>
                      ))
                    : null}
                </AvInput>
              </AvGroup>
              <Button tag={Link} id="cancel-save" to="/program" replace color="info">
                <FontAwesomeIcon icon="arrow-left" />
                &nbsp;
                <span className="d-none d-md-inline">Back</span>
              </Button>
              &nbsp;
              <Button color="primary" id="save-entity" data-cy="entityCreateSaveButton" type="submit" disabled={updating}>
                <FontAwesomeIcon icon="save" />
                &nbsp; Save
              </Button>
            </AvForm>
          )}
        </Col>
      </Row>
    </div>
  );
};

const mapStateToProps = (storeState: IRootState) => ({
  users: storeState.userManagement.users,
  programEntity: storeState.program.entity,
  loading: storeState.program.loading,
  updating: storeState.program.updating,
  updateSuccess: storeState.program.updateSuccess,
});

const mapDispatchToProps = {
  getUsers,
  getEntity,
  updateEntity,
  setBlob,
  createEntity,
  reset,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(ProgramUpdate);
