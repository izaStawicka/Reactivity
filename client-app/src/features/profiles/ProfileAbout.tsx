import { Button, Grid, Header, Tab } from "semantic-ui-react";
import { useStore } from "../../app/stores/store";
import { useState } from "react";
import ProfileEdit from "./ProfileEdit";
import { observer } from "mobx-react-lite";

export default observer(function ProfileAbout(){
    const {profileStore: {profile, updateProfile, isCurrentUser}} = useStore();
    const [editMode, setEditMode] = useState(false);

    return(
        <Tab.Pane>
            <Grid>
                <Grid.Column width={16}>
                    <Header icon='user' content={`About ${profile?.displayName}`} floated="left"/>
                    {isCurrentUser && (
                          <Button basic color={'grey'} content={editMode ? 'Cancel' : 'Edit'} floated="right" 
                          onClick={() => setEditMode(!editMode)}/>
                    )}                 
                </Grid.Column>
                <Grid.Column width={16}>
                    {editMode ? 
                        <ProfileEdit profile={profile!} updateProfile={updateProfile} setEditMode={setEditMode}/> :
                        <span style={{whiteSpace: 'pre-wrap'}}>{profile?.bio}</span>
                    }
                </Grid.Column>
            </Grid>
        </Tab.Pane>
    )
})