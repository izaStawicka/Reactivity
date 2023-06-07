import { Grid } from "semantic-ui-react";
import ProfileHeader from "./ProfileHeader";
import ProfileContent from "./ProfileContent";
import { observer } from "mobx-react-lite";
import { useParams } from "react-router-dom";
import { useStore } from "../../app/stores/store";
import { useEffect } from "react";
import LoadingComponent from "../../app/layout/LoadingComponent";

export default observer(function ProfilePage()
{
    const {userName} = useParams();
    const {profileStore} = useStore();
    const {profile, loadProfile, loadingProfile} = profileStore; 

    useEffect(() => {
        if(userName) loadProfile(userName) 
    }, [loadProfile, userName])
    
    if(loadingProfile) return <LoadingComponent inverted content="Loading profile..."/>

    return(
        <Grid>
            <Grid.Column width={15}>
                {profile && (
                    <>
                        <ProfileHeader profile={profile}/>
                        <ProfileContent profile={profile}/>
                    </>                   
                )}
            </Grid.Column>
        </Grid>
    )
})