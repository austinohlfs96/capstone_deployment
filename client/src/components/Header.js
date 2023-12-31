import React, { useState, useEffect, useCallback } from 'react';
import {useDispatch} from "react-redux"
import { useNavigate } from 'react-router-dom';
import { Header, Segment, Button, Image, Sticky } from 'semantic-ui-react'
import { useSelector } from "react-redux"
import { logout, fetchCurrentUser, setCurrentCoach, addError } from '../features/coach/coachSlice'
import { useToasts } from 'react-toast-notifications';
import { getToken } from '../utils/main';
import { checkToken } from '../utils/main';


function Head() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { addToast } = useToasts();
  const coach = useSelector((state) => state.coach.data);
  const handleNewError = useCallback((error) => {
    addToast(error, { appearance: 'error', autoDismiss: true });
  }, [addToast]);


  useEffect(() => {
    if (!coach) {
      fetch("/auth/me",{
        headers: {
              Authorization: `Bearer ${localStorage.getItem('jwt_token')}`,
            }
      })
      .then(res => {
        if (res.ok) {
          res.json().then(coach => dispatch(setCurrentCoach(coach)))
        } else if (res.status === 422) {
          fetch("/auth/refresh", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${localStorage.getItem('refresh_token')}`,
            }
          })
          .then(res => {
            if (res.ok) {
              res.json().then(resObj => {
                dispatch(setCurrentCoach(resObj.coach))
                localStorage.setItem("jwt_token", resObj.jwt_token)
               
              })
            } else {
              
              res.json().then(errorObj => {
                dispatch(addError(errorObj.message));
                // handleNewError("You have been signed out please sign in to use account services");
              });
            }
          })
        } else {
          handleLogout()
          res.json().then(errorObj => handleNewError(errorObj.message || errorObj.msg))
        }
      })
      .catch(error => {
        dispatch(addError(error));
        dispatch(logout())
        // handleNewError(error);
      });
    }
  }, [handleNewError, coach])


  const handleLogout = () => {
    localStorage.removeItem("jwt_token")
    localStorage.removeItem("refresh_token")
    dispatch(logout())
    navigate("/")
 }
  
  return (
    <div  >
    
        <Sticky >
      <Segment style={{ background: 'rgba(255, 255, 255, 0.8)' }}>
      <Header id="login" as='h3' textAlign='right'>
    </Header>
    <div onClick={() => navigate('/')}>
    <Header id="title" as='h3' textAlign='left' >
    <Image src='https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/Valknut.svg/1200px-Valknut.svg.png' size='small' onClick={() => navigate('/')}/>
     Æsir Performance Tunes
    </Header>
    </div> 
    <Header id='headerButtons' as='h3' textAlign='center'>
    <Button secondary onClick={() => navigate('/')}>About</Button>
    <Button secondary onClick={() => navigate('/tuningservices')}>Services</Button>
    <Button secondary onClick={() => navigate('/gallery')}>Gallery</Button>
    <Button secondary onClick={() => navigate('/athletespotlight')}>Athlete Spotlight</Button>
    <Button secondary onClick={() => navigate('/contact')}>Contact Us</Button>
    {!coach && (
  <>
    <Button primary onClick={() => navigate('/login')}>Login</Button>
    <Button secondary onClick={() => navigate('/signup')}>Register</Button>
  </>
)}
    {coach && (
  <>
    <Button primary onClick={() => navigate('/coachespage')}>Profile</Button>
    <Button secondary onClick={handleLogout}>Logout</Button>
  </>
)}
    
    </Header>
  </Segment>
  </Sticky>
    </div>
  );
}

export default Head;