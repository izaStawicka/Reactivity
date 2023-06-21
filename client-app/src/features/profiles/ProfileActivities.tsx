import { observer } from "mobx-react-lite";
import { useStore } from "../../app/stores/store";
import { Tab, Grid, Header, Card, TabProps, Image} from "semantic-ui-react";
import { SyntheticEvent, useEffect } from "react";
import { Link } from "react-router-dom";
import { format } from "date-fns";

export default observer(function ProfileActivities(){
    const {profileStore: {loadingActivities, getEvents, userActivities, profile}} = useStore();

    useEffect(() => {
        getEvents(profile!.userName)
    }, [getEvents, profile])

    const handleTabChange = (e: SyntheticEvent, data: TabProps) => {
        getEvents(profile?.userName!, panes[data.activeIndex as number].pane.key);
    }

    const panes = [
        {menuItem: 'Future Events', pane: {key: 'future'}},
        {menuItem: 'Past Events', pane: {key: 'past'}},
        {menuItem: 'Hosting', pane: {key: 'hosting'}}
    ]

    return (
        <Tab.Pane loading={loadingActivities}>
            <Grid>
                <Grid.Column width={16}>
                    <Header floated='left' icon='calendar' content={'Activities'} />
                </Grid.Column>
                <Grid.Column width={16}>
                    <Tab
                        panes={panes}
                        menu={{ secondary: true, pointing: true }}
                        onTabChange={(e, data) => handleTabChange(e, data)}
                    />
                    <br />
                    <Card.Group itemsPerRow={4}>
                        {userActivities.map((activity) => (
                            <Card
                                as={Link}
                                to={`/activities/${activity.id}`}
                                key={activity.id}
                            >
                                <Image
                                    src={`/assets/categoryImages/${activity.category}.jpg`}
                                    style={{ minHeight: 100, objectFit: 'cover' }}
                                />
                                <Card.Content>
                                    <Card.Header textAlign='center'>{activity.title}</Card.Header>
                                    <Card.Meta textAlign='center'>
                                        <div>{format(new Date(activity.date), 'do LLL')}</div>
                                        <div>{format(new Date(activity.date), 'h:mm a')}</div>
                                    </Card.Meta>
                                </Card.Content>
                            </Card>
                        ))}
                    </Card.Group>
                </Grid.Column>
            </Grid>
        </Tab.Pane>
    );
});