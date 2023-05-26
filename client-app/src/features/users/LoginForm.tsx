import { ErrorMessage, Form, Formik } from "formik";
import MyTextInput from "../../app/common/form/MyTextInput";
import { Button, Header, Label } from "semantic-ui-react";
import { useStore } from "../../app/stores/store";
import { observer } from "mobx-react-lite";

export default observer(function LoginForm(){
    const {userStore} = useStore();

    return(
        <Formik initialValues={{email: '', password: '', error: null}} 
        onSubmit={(values, {setErrors})=> userStore.login(values).catch(error=> setErrors({error: "Invalid email or password"}))}>
            {({handleSubmit, isSubmitting, errors}) => (
                <Form className="ui form" autoComplete="off" onSubmit={handleSubmit}>
                    <Header as='h2' color='teal' textAlign="center" content="Login to Reactivities!"/>
                    <MyTextInput name="email" placeholder="Email"/>
                    <MyTextInput name="password" placeholder="Password" type="password"/>
                    <ErrorMessage name="error" render={()=> 
                        <Label content={errors.error} basic color='red' style={{marginBottom: 10}}/>} />
                    <Button loading={isSubmitting} content="Login" positive type="submit" fluid/>
                </Form>
            )}
        </Formik>
    )
})