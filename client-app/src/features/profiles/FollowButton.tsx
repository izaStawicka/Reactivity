import { observer } from "mobx-react-lite";
import { Profile } from "../../app/models/profile";
import { Button, Reveal } from "semantic-ui-react";
import { useStore } from "../../app/stores/store";
import { SyntheticEvent } from "react";

interface Props{
    profile: Profile
}

export default observer(function FollowButton({profile}: Props){
    const { profileStore: { loading, updateFollowing }, userStore } = useStore();

    function handleFollow(e: SyntheticEvent, userName: string) {
        e.preventDefault()
        profile.isFollowing ? updateFollowing(userName, false) : updateFollowing(userName, true)
    }

    if (profile.userName === userStore.user?.userName) return null;

    return (
        <Reveal animated="move">
            <Reveal.Content visible style={{ width: '100%' }}>
                <Button fluid color="teal" content={profile.isFollowing ? 'Following' : 'Not following'} />
            </Reveal.Content>
            <Reveal.Content hidden style={{ width: '100%' }}>
                <Button color={profile.isFollowing ? 'red' : 'green'} content={profile.isFollowing ? 'Unfollow' : 'Follow'} 
                    basic fluid
                    loading={loading} onClick={e => handleFollow(e, profile.userName)} />
            </Reveal.Content>
        </Reveal>
    )
})