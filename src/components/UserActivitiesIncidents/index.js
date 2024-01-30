import React, {Component} from 'react';
import Paper from 'Components/Paper';
import Preloader from 'Components/Preloader';
import ActionsHistory from 'Components/ActionsHistory';
import TablePaginator from 'Components/Table/TablePaginator';
import Button from 'Components/Button';
import {autobind} from 'core-decorators';
import exportResults from "Helpers/exportResults";

export default class UserActivitiesIncidents extends Component {
    static defaultProps = {
        data: []
    }

    @autobind exportIncidentUserActivities() {
        const {incident_user_activities, filters} = this.props;
        exportResults(incident_user_activities, filters);
    }

    render() {
        const {
            data, incidentsUrl, onUpdateUserActivity, onPaginationChange,
            pagination, loading, wasFiltersChanged, onShowAllActions,
            incidentsWithAllActions
        } = this.props;
        if (!!loading) {
            return (<Preloader height="120px"/>)
        }
        if (!data || !data.length) {
            return null;
        }
        return (
            <div className="grid">
                <div className="page__header">
                    <div className="page__header-title">
                        Actions History for Selected Incidents
                    </div>
                    <Button size="big" status="black" onClick={this.exportIncidentUserActivities}>Export to
                        CSV</Button>
                </div>
                {data.map(incident => {
                    const incidentUrl = `${incidentsUrl}/${incident.id}`;
                    return (
                        <div className="grid__row" key={incident.id}>
                            <div className="grid__col grid__col--12">
                                <Paper>
                                    <Paper.Header>
                                        <Paper.Title small>
                                            <a href={`${incidentUrl}/edit`} target="_blank">
                                                Incident #{incident.incident_id}
                                            </a>
                                        </Paper.Title>
                                        {!incidentsWithAllActions[incident.id] && wasFiltersChanged && (
                                            <Button status="link"
                                                    onClick={() => onShowAllActions(incident)}>
                                                Show All Actions
                                            </Button>
                                        )}
                                    </Paper.Header>
                                    <Paper.Body>
                                        <ActionsHistory data={incident.user_activities}
                                                        onUpdateAction={action => onUpdateUserActivity(incident, action)}
                                                        incidentUrl={incidentUrl}/>
                                    </Paper.Body>
                                </Paper>
                            </div>
                        </div>
                    )
                })}
                <div className="grid__row">
                    <div className="grid__col grid__col--12">
                        <TablePaginator pagination={pagination}
                                        onPaginationChange={onPaginationChange}/>
                    </div>
                </div>
            </div>
        );
    }
}
