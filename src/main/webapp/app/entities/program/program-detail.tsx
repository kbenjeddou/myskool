import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { openFile, byteSize, TextFormat } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './program.reducer';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface IProgramDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const ProgramDetail = (props: IProgramDetailProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const { programEntity } = props;
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="programDetailsHeading">Program</h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">ID</span>
          </dt>
          <dd>{programEntity.id}</dd>
          <dt>
            <span id="cover">Cover</span>
          </dt>
          <dd>
            {programEntity.cover ? (
              <div>
                {programEntity.coverContentType ? (
                  <a onClick={openFile(programEntity.coverContentType, programEntity.cover)}>
                    <img src={`data:${programEntity.coverContentType};base64,${programEntity.cover}`} style={{ maxHeight: '30px' }} />
                  </a>
                ) : null}
                <span>
                  {programEntity.coverContentType}, {byteSize(programEntity.cover)}
                </span>
              </div>
            ) : null}
          </dd>
          <dt>
            <span id="title">Title</span>
          </dt>
          <dd>{programEntity.title}</dd>
          <dt>
            <span id="description">Description</span>
          </dt>
          <dd>{programEntity.description}</dd>
          <dt>
            <span id="startDate">Start Date</span>
          </dt>
          <dd>
            {programEntity.startDate ? <TextFormat value={programEntity.startDate} type="date" format={APP_LOCAL_DATE_FORMAT} /> : null}
          </dd>
          <dt>
            <span id="endDate">End Date</span>
          </dt>
          <dd>{programEntity.endDate ? <TextFormat value={programEntity.endDate} type="date" format={APP_LOCAL_DATE_FORMAT} /> : null}</dd>
          <dt>
            <span id="tags">Tags</span>
          </dt>
          <dd>{programEntity.tags}</dd>
          <dt>User</dt>
          <dd>{programEntity.user ? programEntity.user.login : ''}</dd>
        </dl>
        <Button tag={Link} to="/program" replace color="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" /> <span className="d-none d-md-inline">Back</span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/program/${programEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" /> <span className="d-none d-md-inline">Edit</span>
        </Button>
      </Col>
    </Row>
  );
};

const mapStateToProps = ({ program }: IRootState) => ({
  programEntity: program.entity,
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(ProgramDetail);
