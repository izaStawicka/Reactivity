import { observer } from "mobx-react-lite";
import { useStore } from "../../app/stores/store";
import { ErrorMessage, Form, Formik } from "formik";
import * as Yup from "yup";
import { Button, Header} from "semantic-ui-react";
import MyTextInput from '../../app/common/form/MyTextInput';
import ValidityErrors from "../errors/ValidityErrors";

export default observer(function RegisterForm(){
    const {userStore} = useStore();

    return(
        <Formik initialValues={{userName:"", displayName:"", email: "", password: "", error: null}} 
         onSubmit={(values, {setErrors}) => userStore.register(values).catch(error=> setErrors({error: error}))}
         validationSchema={Yup.object({
            userName: Yup.string().required(),
            displayName: Yup.string().required(),
            password: Yup.string().required(),
            email: Yup.string().required()
         }          
         )}>
            {({handleSubmit, isValid, dirty, errors, isSubmitting}) => (
                <Form className="ui form error" onSubmit={handleSubmit} autoComplete="off">
                    <Header color='teal' content='Sign up to Activities!' as='h2' textAlign="center"/>
                    <MyTextInput name="userName" placeholder="UserName"/>
                    <MyTextInput name="displayName" placeholder="DisplayName"/>
                    <MyTextInput name="email" placeholder="Email"/>
                    <MyTextInput name="password" placeholder="Password" type="password"/>
                    <ErrorMessage name="error" render={() => 
                        <ValidityErrors errors = {errors.error}/>
                    }/>
                    <Button content="Register" loading={isSubmitting} disabled={!isValid || !dirty || isSubmitting} 
                        type="submit" positive fluid/>
                </Form>              
            )}
        </Formik>
    )
})