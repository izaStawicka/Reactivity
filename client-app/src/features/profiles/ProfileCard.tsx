import { observer } from "mobx-react-lite";
import { Link } from "react-router-dom";
import { Card, Icon, Image } from "semantic-ui-react";
import { Profile } from "../../app/models/profile";

interface Props{
    profile: Profile
}

export default observer(function ProfileCard({profile}: Props){
    function truncrate(str: string | undefined){
        if( str && str.length > 40){
            return str.substring(0, 37) + '...'
        }else{
            return str
        }
    }

    return(
        <Card as={Link} to={`/profile/${profile.userName}`}>
            <Image src={profile.image || "/assets/user.png"}/>
            <Card.Content>
                <Card.Header>{profile.displayName}</Card.Header>
                <Card.Description>{truncrate(profile.bio)}</Card.Description>
            </Card.Content>
            <Card.Content extra>
                <Icon name="user"/>
                20 followers
            </Card.Content>
        </Card>
    )
})