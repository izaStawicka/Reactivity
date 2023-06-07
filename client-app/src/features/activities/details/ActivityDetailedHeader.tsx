import React from 'react';
import { Activity } from '../../../app/models/activity';
import { observer } from 'mobx-react-lite';
import { Button, Header, Image, Item, Label, Segment } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { useStore } from '../../../app/stores/store';


const activityImageStyle = {
    filter: 'brightness(30%)'
};

const activityImageTextStyle = {
    position:'absolute',
    bottom: '15%',
    left: '5%',
    width: '100%',
    heigh: 'auto',
    color: 'white'
};

interface Props{
    activity:Activity
}

export default observer(function ActivityDetailedHeader({activity}:Props){
    const {activityStore : {updateAttendance, loading, cancelActivityToggle}} = useStore();

    return(
        <Segment.Group>
            <Segment basic attached='top' style={{padding: 0}}>
                {activity.isCancelled && (
                    <Label color='red' style={{position: "absolute", zIndex: "1000", left: -14, top: 20}} ribbon content="Cancelled"/>
                )}
                <Image src={`/assets/categoryImages/${activity.category}.jpg`} fluid style={activityImageStyle}/>
                <Segment style={activityImageTextStyle} basic>
                    <Item.Group>
                        <Item>
                            <Item.Content>
                                <Header size='huge' content={activity.title} style={{color: 'white'}}/>
                                <p>{format(activity.date!, "dd MMM yyyy")}</p>
                                <p>Hosted by <strong><Link to={`/profiles/${activity.host?.userName}`}>{activity.host?.displayName}</Link></strong></p>
                            </Item.Content>
                        </Item>
                    </Item.Group>
                </Segment>
                <Segment clearing attached='bottom'>
                    {activity.isHost ? (     
                        <>
                            <Button color={activity.isCancelled ? "green" : "red"} floated="left" basic 
                                content={activity.isCancelled ? "Re-activate Activity" : "Cancell Activity"} loading={loading}
                                onClick={cancelActivityToggle}/>
                            <Button color='orange' floated='right' as={Link} to={`/manage/${activity.id}`} 
                                disabled={activity.isCancelled}>Manage Event</Button>
                        </>                   
                    ) : activity.isGoing ? (
                        <Button onClick={updateAttendance} loading={loading} disabled={activity.isCancelled}>Cancel attendance</Button>
                    ): (
                        <Button onClick={updateAttendance} loading={loading} disabled={activity.isCancelled} color='teal'>Join Activity</Button>
                    )}                     
                </Segment>
            </Segment>
        </Segment.Group>
    )
})