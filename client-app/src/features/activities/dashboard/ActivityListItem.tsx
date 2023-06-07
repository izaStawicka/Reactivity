import { Button, Icon, Item, Label, Segment } from "semantic-ui-react";
import { Activity } from "../../../app/models/activity";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import ActivityListItemAttendee from "./ActivityListItemAttendee";
import { observer } from "mobx-react-lite";

interface Props {
    activity: Activity
}

export default observer(function ActivityListItem({activity}:Props)
{   
    

    return(
      <Segment.Group>
        <Segment>
        {activity.isCancelled && (
                            <Label attached="top" color='red' content="Cancelled!" style={{textAlign: 'center'}}/>
                        )}
            <Item.Group>
                <Item>
                    <Item.Image size='tiny' circular src={activity.host?.image || '/assets/user.png'} style={{marginBottom: 5}}/>
                    <Item.Content>
                        <Item.Header as={Link} to={`/activities/${activity.id}`}>
                            {activity.title}
                        </Item.Header>
                        <Item.Description>
                            Hosted by <Link to={`/profiles/${activity.host?.userName}`}>{activity.host?.displayName}</Link> 
                        </Item.Description>
                        {activity.isHost && (
                            <Item.Description>
                                <Label basic color="orange" content="You're hosting this activity!"/>
                            </Item.Description>
                        )}
                        {activity.isGoing && !activity.isHost &&(
                            <Item.Description>
                                <Label basic color="green" content="You're going to the activity!"/>
                            </Item.Description>
                        )}
                    </Item.Content>
                </Item>
            </Item.Group>
        </Segment>
        <Segment>
            <span>
                <Icon name='clock'/> {format(activity.date!, 'dd MMM yyyy h: mm aa')}
                <Icon name='marker'/> {activity.venue}
            </span>
        </Segment>
        <Segment secondary>
            <ActivityListItemAttendee attendees={activity.attendees!}/>
        </Segment>
        <Segment clearing>
            <span>{activity.description}</span>
            <Button floated="right" content='View' color="teal" as={Link} to={`/activities/${activity.id}`}/>
        </Segment>
      </Segment.Group>
    )
})