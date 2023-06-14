import { observer } from "mobx-react-lite";
import { useStore } from "../../app/stores/store";
import { Card, Grid, Header, Tab } from "semantic-ui-react";
import ProfileCard from "./ProfileCard";

export default observer(function ProfileFollowings(){
    const {profileStore: {loadingFollowings, followings, profile, activeTab}} = useStore();

    return(
        <Tab.Pane loading={loadingFollowings}>
            <Grid>
                <Grid.Column width={16}>
                    <Header floated="left" icon={'user'} 
                    content={activeTab===3 ?  profile?.displayName + ' is followed by: ' : profile?.displayName + ' is following '} />
                </Grid.Column>
                <Grid.Column width={16}>
                    <Card.Group itemsPerRow={5}>
                        {followings.map(following => (
                            <ProfileCard profile={following!} key={following.userName}/>
                        ))}
                    </Card.Group>
                </Grid.Column>
            </Grid>
        </Tab.Pane>
    )
})