import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {useDispatch} from "react-redux"
import { RegisterUser, LoginUser } from '../../store/userStore';
import {  useHistory  } from 'react-router-dom'

import { TextField, Button, Grid } from '@material-ui/core';

const Auth = (props) => {
    const [register, setRegister ] = useState(false);
    const dispatch = useDispatch()
    const history= useHistory()


    const formik = useFormik({
        initialValues:{ email:'',password:'' , firstname : "" , lastname : "" },
        validationSchema:Yup.object({
            email:Yup.string()
            .required('Sorry the email is required')
            .email('This is not a valid email'),
            firstname:register && Yup.string().required("firstname is required"),
              lastname:register && Yup.string().required('lastname is required'),
            password:Yup.string()
            .required('Sorry the password is required')
        }),
        onSubmit:async(values,{resetForm})=>{
        if(register){
            dispatch(RegisterUser(values))
            history.push("/Aboutme")
     
        }else{
                dispatch(LoginUser(values))
            history.push("/Aboutme")

         
        }
        }
    });

    const errorHelper = (formik, values) => ({
        error: formik.errors[values] && formik.touched[values] ? true:false,
        helperText: formik.errors[values] && formik.touched[values] ? formik.errors[values] : null
    })
     
    
    return(
        <>
        <Grid container justifyContent="center" alignItems="center" style={{minHeight:"100vh"}} spacing={7}>
          
        
            <div className=" text-center  "   style={{marginTop:"100px" , width : "250px" }}>
                <h1>{register ? "Sign Up" : "Log In"}</h1>
                <form className="mt-3" onSubmit={formik.handleSubmit}>
                    <div className="form-group">
                        <TextField
                            style={{width:'100%'}}
                            name="email"
                            label="Enter your email"
                            variant="outlined"
                            {...formik.getFieldProps('email')}
                            {...errorHelper(formik,'email')}
                        />
                    </div>
                   { register  &&
                   <div>
                    <div className="form-group">
                        <TextField
                            style={{width:'100%'}}
                            name="firstname"
                            label="Enter your firstname"
                            variant="outlined"
                            {...formik.getFieldProps('firstname')}
                            {...errorHelper(formik,'firstname')}
                        />
                    </div>

                    <div className="form-group">
                        <TextField
                            style={{width:'100%'}}
                            name="lastname"
                            label="Enter your lastname"
                            variant="outlined"
                            {...formik.getFieldProps('lastname')}
                            {...errorHelper(formik,'lastname')}
                        />
                    </div>
                    </div>
                    }
                    <div className="form-group">
                        <TextField
                            style={{width:'100%'}}
                            name="password"
                            label="Enter your password"
                            type="password"
                            variant="outlined"
                            {...formik.getFieldProps('password')}
                            {...errorHelper(formik,'password')}
                        />
                    </div>
                    <div className="d-flex flex-column justify-content-center ">
                    <Button     disableRipple variant="contained" color="primary" type="submit" size="large">
                        {register ? 'Register':'Login'}
                    </Button>
                    <Button 
                        className="mt-3"
                        variant="outlined" 
                        color="secondary" 
                        size="small"
                        onClick={()=> setRegister(!register)}
                        disableRipple
                    >
                        Want to {!register ? 'Register':'Login'} ?
                    </Button>
</div>
                </form>

            </div>
        </Grid>
        </>
    )
}

export default Auth;