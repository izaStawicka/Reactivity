import React, { useState } from 'react';
import {Button, Header, Segment} from "semantic-ui-react";
import axios from 'axios';
import ValidityErrors from './ValidityErrors';

export default function TestErrors(){
    const baseUrl = process.env.REACT_APP_API_URL;
    const [errors, setErrors] = useState(null);

    function handleNotFound(){
        axios.get(baseUrl + 'buggy/not-found').catch(err=> console.log(err.response));
    }

    function handleBadRequest(){
        axios.get(baseUrl + 'buggy/bad-request').catch(err=> console.log(err.response));
    }

    function handleServerError(){
        axios.get(baseUrl + 'buggy/server-error').catch(err=> console.log(err.response));
    }

    function handleUnauthorised(){
        axios.get(baseUrl + "buggy/unauthorised").catch(err=> console.log(err.response));
    }

    function handleBadGuid(){
        axios.get(baseUrl + 'activities/notaguid').catch(err=> console.log(err.response));
    }

    function handleBadValidation(){
        axios.post(baseUrl + 'activities', {}).catch(err=> setErrors(err));
    }

    return(
        <>
            <Header content='Testing Errors' as='h1'/>
            <Segment>
                <Button.Group widths={7}>
                    <Button onClick={handleNotFound} primary basic content='Not Found'/>
                    <Button onClick={handleBadRequest} primary basic content='Bad Request'/>
                    <Button onClick={handleServerError} primary basic content='Server Error'/>
                    <Button onClick={handleUnauthorised} primary basic content='Unauthorised'/>
                    <Button onClick={handleBadGuid} primary basic content='Bad Guid'/>
                    <Button onClick={handleBadValidation} primary basic content='Bad Valiation'/>
                </Button.Group>
            </Segment>
            {errors && <ValidityErrors errors={errors}/>}
        </>
    )
}