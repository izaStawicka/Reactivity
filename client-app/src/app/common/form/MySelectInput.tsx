import { useField } from "formik";
import { Form, Label, Select } from "semantic-ui-react";

interface Props{
    name: string,
    placeholder: string,
    label?: string,
    options: any,
}

export default function MySelectInput(props: Props){
    const [field, meta, helper] = useField(props.name);

    return(
        <Form.Field error={meta.touched && !!meta.error}>
            <label>{props.label}</label>    
            <Select
                clearable
                options = {props.options}
                value = {field.value || null} 
                onChange={(e, d) =>  helper.setValue(d.value)}
                onBlur={() => helper.setTouched(true)}
                placeholder={props.placeholder}/>
            {meta.touched && meta.error ? <Label color='red' basic content={meta.error}/> : null}
        </Form.Field>
        
    )
}