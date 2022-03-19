import React, { Component, useState } from 'react'
import xButton from '../../img/x.png'
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';


const Month = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const useStyles = makeStyles((theme) => ({
    root: {
        '& > *': {
          margin: theme.spacing(1),
          width: '25ch',
        },
    },
    container: {
      display: 'flex',
      flexWrap: 'wrap',
    },
    textField: {
      margin: theme.spacing(1),
      width: 200,
    },
}));

const GroupName = ({
    setGroup,
    handleCloseGroupNameBox,
    userName, token,
    sendData
}) => {
    const classes = useStyles();

    // add group name
    const onSubmit = async () => {
        const groupname = document.getElementById('standard-basic').value;
        setGroup(groupname);
        sendData({
            task: 'group',
            payload: {
                username: userName,
                group: groupname,
                token: token
            }
        })
        handleCloseGroupNameBox();
    }
    
    return (
        <>
            <div className="GroupNameBox">
                <div className="GroupNameBox__title">{"Fill a Group Name!"}</div>
                <img className="GroupNameBox__xButton" src={xButton} onClick={() => handleCloseGroupNameBox()}/>
                <div className="GroupNameBox__Name">
                    <form className={classes.root} noValidate autoComplete="off">
                        <TextField
                            id="standard-basic"
                            label="Group Name"
                        />
                    </form>
                </div>
                <div className={`${classes.root} GroupNameBox__submit`}>
                    <Button variant="outlined" color="primary" onClick={onSubmit}>
                        Confirm
                    </Button>
                </div>
                
            </div>
        </>
    )
}

export default GroupName