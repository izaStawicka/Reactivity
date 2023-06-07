import { observer } from "mobx-react-lite"
import { Button, Divider, Grid, Header, Item, Reveal, Segment, Statistic } from "semantic-ui-react"
import { Profile } from "../../app/models/profile"

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
                        <Statistic label='Followers' value='5'/>
                        <Statistic label='Following' value='42'/>
                    </Statistic.Group>
                    <Divider/>
                    <Reveal animated="move">
                        <Reveal.Content visible style={{width: '100%'}}>
                            <Button fluid color="teal" content='Following'/>
                        </Reveal.Content>
                        <Reveal.Content hidden style={{width: '100%'}}>
                            <Button color={true ? 'red' : 'green'} content={true ? 'Unfollow' : 'Follow'} basic fluid/>
                        </Reveal.Content>
                    </Reveal>
                </Grid.Column>
            </Grid>
        </Segment>
    )
})