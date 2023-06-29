import { Link } from "react-router-dom";
import { Container, Header, Segment, Image, Button, Divider } from "semantic-ui-react";
import { useStore } from "../../../app/stores/store";
import { observer } from "mobx-react-lite";
import LoginForm from "../../users/LoginForm";
import RegisterForm from "../../users/RegisterForm";
import FacebookLogin from "@greatsumini/react-facebook-login";

export default observer( function HomePage(){
    const {userStore, modalStore} = useStore();

    return(
       <Segment inverted textAlign="center" vertical className="masthead">
            <Container text>
                <Header as='h1' inverted>
                    <Image size='massive' src='/assets/logo.png' alt='logo' style={{marginBottom: 12}}/>
                    Reactivities
                </Header>
                {userStore.isLoggedIn ? (
                    <>
                        <Header as='h2' inverted content='Welcome to Reactivities!!!'/>
                        <Button as={Link} to='/activities' content='Go to Activities!'/>
                    </>
                ) : (
                    <>
                        <Button onClick={() => modalStore.openModal(<LoginForm/>)} size='huge' inverted>Login!</Button>
                        <Button size='huge' onClick={() => modalStore.openModal(<RegisterForm/>)} inverted>Register!</Button>
                        <Divider inverted horizontal>Or</Divider>
                        <Button as={FacebookLogin} color="facebook" appId="998373901184431" size="huge" inverted content="Login with Facebook"
                            onSuccess={(response: any) => {
                                //userStore.facebookLogin(response.accessToken)}}
                            console.log("success", response)}}
                            onFail={(response: any) => console.log("failed ", response)}
                            loading={userStore.fbLoading}/>
                    </>
                )}
            </Container>
       </Segment>
    )
})