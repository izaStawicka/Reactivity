import { observer } from "mobx-react-lite"
import { Divider, Grid, Header, Item, Segment, Statistic } from "semantic-ui-react"
import { Profile } from "../../app/models/profile"
import FollowButton from "./FollowButton"

interface Props{
    profile: Profile
}

export default observer(function ProfileHeader({profile}: Props){
    return(
        <Segment>
            <Grid>
                <Grid.Column width={12}>
                    <Item.Group>
                        <Item>
                            <Item.Image src={profile.image || '/assets/user.png'} avatar size='small'/>
                            <Item.Content verticalAlign="middle">
                                <Header content={profile.displayName} as='h1'/>
                            </Item.Content>
                        </Item>
                    </Item.Group>
                </Grid.Column>
                <Grid.Column width={4}>
                    <Statistic.Group widths={2}>
                        <Statistic label='Followers' value={profile.followersCount}/>
                        <Statistic label='Following' value={profile.followingsCount}/>
                    </Statistic.Group>
                    <Divider/>
                    <FollowButton profile={profile}/>
                </Grid.Column>
            </Grid>
        </Segment>
    )
})