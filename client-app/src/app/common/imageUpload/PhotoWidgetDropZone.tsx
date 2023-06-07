import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Header, Icon } from "semantic-ui-react";

interface Props{
    setFiles: (files: any) => void;
}

export default function PhotoWidgetDropZone({setFiles}: Props){
    const onDrop = useCallback((acceptedFiles: any) => {
        setFiles(acceptedFiles.map((file: any) => (
            Object.assign(file, {
                preview: URL.createObjectURL(file)
            })
        )))
    }, [setFiles]) 

    const dzStyle = {
        textAlign: 'center' as 'center',
        border: 'dashed 3px #eee',
        borderColor: '#eee',
        borderRadius: '5px',
        paddingTop: '30px',
        height: 200 
    }

    const dzStyleActive = {
        borderColor: 'green'
    }
    
    const {getRootProps, isDragActive, getInputProps} = useDropzone({onDrop})

    return(
        <div {...getRootProps()} style={isDragActive ? {...dzStyle, ...dzStyleActive} : dzStyle}>
            <input {...getInputProps()} />
            <Icon size="huge" name='upload'/>
            <Header content='Drop imagine here'/>
        </div>
    )
}