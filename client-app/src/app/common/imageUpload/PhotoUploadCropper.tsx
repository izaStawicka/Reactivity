import { Cropper } from "react-cropper";
import 'cropperjs/dist/cropper.css';

interface Props{
    imagePreview: string,
    setCropper: (cropper: Cropper) => void
}

export default function PhotoUploadCropper({imagePreview, setCropper}: Props){
    return(
        <Cropper
        guides={false}
        src={imagePreview}
        style =  {{height: 200, width: '100%'}}
        initialAspectRatio={1}
        aspectRatio={1}
        preview= '.img-preview'
        viewMode={1}
        autoCropArea = {1}
        background = {false}
        onInitialized={(cropper: Cropper) => setCropper(cropper)}
        />
    )
}