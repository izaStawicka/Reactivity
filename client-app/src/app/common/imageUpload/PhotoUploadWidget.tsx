import { Button, Grid, Header} from "semantic-ui-react";
import PhotoWidgetDropZone from "./PhotoWidgetDropZone";
import { useEffect, useState } from "react";
import PhotoUploadCropper from "./PhotoUploadCropper";

interface Props{
    uploadPhoto: (file: any) => void;
    loading: boolean
}

export default function PhotoUploadWidget({uploadPhoto, loading}: Props)
{
    const [files, setFiles] = useState<any>([]);
    const [cropper, setCropper] = useState<Cropper>();

    useEffect(() => {
        return () => {
            files.forEach((file: any) => {
                URL.revokeObjectURL(file)
            })
        }
    }, [files]) 

    function onCrop(){
       if(cropper){
        cropper.getCroppedCanvas().toBlob(blob=> uploadPhoto(blob))
       }
    }

    return(
        <Grid>
            <Grid.Column width={4}>
                <Header sub color='teal' content='Step 1 - Add photo'/>
                <PhotoWidgetDropZone setFiles={setFiles}/>
            </Grid.Column>
            <Grid.Column width={1}/>
            <Grid.Column width={4}>
                <Header sub color='teal' content='Step 2 - Resize Image'/>
                {files && files.length> 0 && (
                   <PhotoUploadCropper imagePreview={files[0].preview} setCropper={setCropper}/>
                )}
            </Grid.Column>
            <Grid.Column width={1}/>
            <Grid.Column width={4}>
                <Header sub color="teal" content='Step 3 - Preview & Upload'/>
                <div className='img-preview' style={{minHeight: 200, overflow: "hidden"}}/>
                {files && files.length>0 &&(
                    <Button.Group widths={2}>
                    <Button icon='check' positive onClick={onCrop} loading={loading}/>
                    <Button icon='close' onClick={() => setFiles([])} disabled={loading}/>
                </Button.Group>
                )}
            </Grid.Column>
        </Grid>
    )
}