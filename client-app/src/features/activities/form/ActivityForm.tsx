import React, { useEffect, useState } from 'react';
import { Button, Header, Segment } from 'semantic-ui-react';
import { useStore } from '../../../app/stores/store';
import { observer } from 'mobx-react-lite';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Activity } from '../../../app/models/activity';
import LoadingComponent from '../../../app/layout/LoadingComponent';
import {v4 as uuid} from 'uuid';
import { Formik,  Form} from 'formik';
import * as Yup from 'yup';
import MyTextInput from '../../../app/common/form/MyTextInput';
import MyTextArea from '../../../app/common/form/MyTextArea';
import MySelectInput from '../../../app/common/form/MySelectInput';
import { categoryOptions} from '../../../app/common/options/categoryOptions';
import MyDateInput from '../../../app/common/form/MyDateInput';


export default observer(function ActivityForm()
{
    const {activityStore} = useStore();
    const {updateActivity, createActivity, loading, loadingInitial, loadActivity} = activityStore;
    const {id} = useParams();
    const navigate = useNavigate();

    const[activity, setActivity] = useState<Activity>(
        {
            id:'',
            title:'',
            category:'',
            description:'',
            date: null,
            city:'',
            venue:''
        }
    );

    const validationSchema = Yup.object({
        title: Yup.string().required('The activity title is required'),
        description: Yup.string().required('The activity description is required'),
        category: Yup.string().required(),
        date: Yup.string().required('Date is required'),
        city: Yup.string().required(),
        venue: Yup.string().required()
    })

    useEffect(() => {
        if(id) loadActivity(id).then((activity) => {
            setActivity(activity!)
        })
    }, [loadActivity, id])


    function handleFormSubmit(activity: Activity)
    {
        if(activity.id.length === 0){
            let newActivity: Activity = {
                ...activity,
                id: uuid() 
            }
            createActivity(newActivity).then(() => navigate(`/activities/${newActivity.id}`))
        }else{
            updateActivity(activity).then(() => navigate(`/activities/${activity.id}`))
        }
    }

    if(loadingInitial) return <LoadingComponent content='Loading activity...'/>

    return(
        <Segment clearing>
            <Formik enableReinitialize initialValues={activity} onSubmit={values=> handleFormSubmit(values)} validationSchema={validationSchema}>
                {({handleSubmit, isValid, dirty, isSubmitting}) => (
                    <Form className='ui form' onSubmit={handleSubmit} autoComplete='off'>
                        <Header sub content='Activity details' color='teal'/>
                        <MyTextInput placeholder='Title'  name='title'/>
                        <MyTextArea rows={3} placeholder='Description'  name='description'/>
                        <MySelectInput options={categoryOptions} placeholder='Category'  name='category'/>
                        <MyDateInput placeholderText='Date'  name='date' showTimeSelect dateFormat={'MMMM d, yyyy h:mm aa'} timeCaption='time'/>
                        <Header sub content='Location details' color='teal'/>
                        <MyTextInput placeholder='City'  name='city'/>
                        <MyTextInput placeholder='Venue' name='venue'/>
                        <Button loading={loading} floated='right' positive type='submit'  content='Submit'
                            disabled={!isValid || !dirty || isSubmitting}/>
                        <Button as={Link} to='/activities' floated='right' type='button' content='Cancel'/>
                </Form> 
                )}
            </Formik>
        </Segment>
    )
})