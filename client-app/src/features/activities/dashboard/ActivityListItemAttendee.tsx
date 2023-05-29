import { observer } from "mobx-react-lite";
import { Image, List, Popup } from "semantic-ui-react";
import { Link } from "react-router-dom";
import { Profile } from "../../../app/models/profile";
import ProfileCard from "../../profiles/ProfileCard";

interface Props{
    attendees: Profile[]
}

export default observer(function ActivityListItemAttendee({attendees}: Props)
{
    return(
        <List horizontal>
            {attendees.map(attendee=> (
                <Popup key={attendee.userName} hoverable trigger={
                    <List.Item as={Link} to={`/profiles/${attendee.userName}`} key={attendee.userName}>
                    <Image circular src={attendee.image || `/assets/user.png`} size='mini'/>
                </List.Item>
                }>
                    <Popup.Content>
                        <ProfileCard profile={attendee}/>
                    </Popup.Content>
                </Popup>
            ))}
        </List>
    )
}

)