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

const AddBox = ({
    firstClickGroup, setFirstClickGroup,
    handleCloseAddBox, handleOpenGroupNameBox,
    userName, group, token, currentDate,
    sendData
}) => {
    const classes = useStyles();

    // 把數字補成兩位(01)
    const paddingLeft = (str, length) => {
        if(str.length >= length)
            return str;
        else
            return paddingLeft("0"+str,length);
    }
    // schedule 屬性
    const [viewType, setViewType] = useState("personal")
    // 變換schedule 屬性
    const handleChange = (e) => {
        setViewType(e.target.value)
    }

    // adding new task
    const onSubmit = async () => {
        const title = document.getElementById('standard-basic').value;
        const startDate = document.getElementById('date').value;      
        const year = startDate.split('-')[0]
        const month = startDate.split('-')[1]
        const date = startDate.split('-')[2]
        const startTime = document.getElementById('time').value;
        if(viewType === 'group' && firstClickGroup){ // 如果還沒有 group，則跳到 add group
            handleCloseAddBox();
            handleOpenGroupNameBox(true);
            setFirstClickGroup(false)
            return ;
        }
        const sche = {
            Year: parseInt(year),
            Month: parseInt(month),
            Date: parseInt(date),
            Time: startTime,
            visibility: (viewType === "personal" ? 0 : 1),
            name: (viewType === "personal" ? userName : group),
            data: title,
            completed: false,
        }
        sendData({
            task: 'inputSchedule',
            payload: {
                sche: sche,
                username: userName,
                token: token
            }
        })
        handleCloseAddBox();
    }
    
    return (
        <>
            <div className="AddBox">
                <div className="AddBox__title">{"Edit Todo!"}</div>
                <img className="AddBox__xButton" src={xButton} onClick={() => handleCloseAddBox()}/>
                <div className="AddBox__Name">
                    <form className={classes.root} noValidate autoComplete="off">
                        <TextField
                            id="standard-basic"
                            label="Title"
                        />
                    </form>
                </div>
                <div className="AddBox__timePicker">
                    <form className={classes.container} noValidate>
                        <TextField
                            id="date"
                            label="Start Date"
                            type="date"
                            defaultValue={`${currentDate.year}-${paddingLeft(String(Month.indexOf(currentDate.month)), 2)}-${currentDate.day}`}
                            className={classes.textField}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                        <TextField
                            id="time"
                            label="Start Time"
                            type="time"
                            defaultValue="00:00"
                            className={classes.textField}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            inputProps={{
                                step: 300, // 5 min
                            }}
                        />
                    </form>
                </div>
                <div>
                <FormControl className="SelectGroup" component="fieldset">
                    <FormLabel component="legend"></FormLabel>
                    <RadioGroup aria-label="Select group" name="Select group" value={viewType} onChange={handleChange}>
                        <FormControlLabel value="personal" control={<Radio />} label="Personal" /><FormControlLabel value="group" control={<Radio />} label="Group" />
                    </RadioGroup>
                </FormControl>
                </div>
                <div className={`${classes.root} AddBox__submit`}>
                    <Button variant="outlined" color="primary" onClick={onSubmit}>
                        Confirm
                    </Button>
                </div>
                
            </div>
        </>
    )
}

export default AddBox