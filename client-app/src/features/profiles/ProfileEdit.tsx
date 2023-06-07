import { Form, Formik } from "formik"
import { observer } from "mobx-react-lite"
import { Button, Segment } from "semantic-ui-react"
import { Profile } from "../../app/models/profile"
import * as Yup from 'yup';
import MyTextInput from "../../app/common/form/MyTextInput";
import MyTextArea from "../../app/common/form/MyTextArea";



interface Props{
    profile: Profile,
    updateProfile: (profile: Partial<Profile>) => Promise<void>,
    setEditMode: (edit: boolean) => void;
}

export default observer(function ProfileEdit({profile, updateProfile, setEditMode}: Props){

    const validationSchema = Yup.object({
        displayName: Yup.string().required('Displayname is a required field'),
    })


    return(
     <Segment clearing>
        <Formik enableReinitialize initialValues={{
            bio: profile.bio,
            displayName: profile.displayName
        }} onSubmit={values=> updateProfile(values).then(() => setEditMode(false))} 
        validationSchema={validationSchema}>
            {({handleSubmit, isValid, dirty, isSubmitting}) => (
                <Form className="ui form">
                    <MyTextInput name='displayName' placeholder="DisplayName"/>
                    <MyTextArea name='bio' placeholder="Bio" rows={5}/>
                    <Button positive type='submit' content='Update profile' loading={isSubmitting} disabled={!isValid || !dirty || isSubmitting}/>
                </Form>
            )}
        </Formik>
     </Segment>
    )
})