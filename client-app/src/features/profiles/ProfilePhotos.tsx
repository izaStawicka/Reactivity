import { observer } from "mobx-react-lite";
import { Photo, Profile } from "../../app/models/profile";
import { Button, Card, Grid, Header, Image, Tab } from "semantic-ui-react";
import { useStore } from "../../app/stores/store";
import { SyntheticEvent, useState } from "react";
import PhotoUploadWidget from "../../app/common/imageUpload/PhotoUploadWidget";


interface Props{
    profile: Profile
}

export default observer(function ProfilePhotos({profile}: Props){
    const {profileStore : {isCurrentUser, uploadPhoto, uploading, loading, setMain, deletePhoto}} = useStore();
    const [addPhotoMode, setPhotoMode] = useState(false);
    const [target, setTarget] = useState('');

    function handleUpload(file: Blob){
        uploadPhoto(file).then(()=> setPhotoMode(false))
    }

    function handleSetMain(photo: Photo, e: SyntheticEvent<HTMLButtonElement>){
        setTarget(e.currentTarget.name);
        setMain(photo);
    }

    function handleDeletePhoto(photo: Photo, e: SyntheticEvent<HTMLButtonElement>){
        setTarget(e.currentTarget.name);
        deletePhoto(photo);
    }

    return(
        <Tab.Pane>
            <Grid>
                <Grid.Column width={16}>
                    <Header content='Photos' icon = 'image' floated="left"/>
                    {isCurrentUser && (
                        <Button basic content={addPhotoMode ? 'Cancel' : 'AddPhoto'}
                            onClick={() => setPhotoMode(!addPhotoMode)} floated='right'/>
                    )}                   
                </Grid.Column>
                <Grid.Column width={16}>
                    {addPhotoMode ? (
                        <PhotoUploadWidget uploadPhoto = {handleUpload} loading={uploading}/>
                    ) : (
                        <Card.Group itemsPerRow={5}>
                        {profile.photos?.map(photo=> (
                            <Card key={photo.id}>
                                <Image src={photo.url}/>
                                {isCurrentUser && (
                                     <Button.Group fluid widths={2}>
                                     <Button basic content='Main' disabled={photo.isMain} onClick={e=> handleSetMain(photo, e)} 
                                        loading={loading && target === 'main' + photo.id} name={'main' + photo.id} color='green'/>
                                     <Button basic icon='trash' color="red" disabled={photo.isMain} onClick={e => handleDeletePhoto(photo, e)}
                                        loading={loading && target === photo.id} name={photo.id}/>
                                 </Button.Group>                   
                                )}    
                            </Card>
                        ))}
                    </Card.Group>
                    )}
                </Grid.Column>
            </Grid>
        </Tab.Pane>
    )
})