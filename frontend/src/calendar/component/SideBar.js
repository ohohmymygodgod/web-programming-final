import React, { Component, useEffect, useState } from 'react'
import bar from '../../img/menu.png'
import plus from '../../img/plus.png'
import downArrow from '../../img/down-arrow.png'
import upArrow from '../../img/up-arrow.png'

import SideBarList from './SideBarList'

import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import GroupIcon from '@material-ui/icons/Group';
import PersonIcon from '@material-ui/icons/Person';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import AllInboxIcon from '@material-ui/icons/AllInbox';

const StyledMenu = withStyles({
    paper: {
      border: '1px solid #d3d4d5',
    },
  })((props) => (
    <Menu
      elevation={0}
      getContentAnchorEl={null}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'center',
      }}
      {...props}
    />
  ));
  
  const StyledMenuItem = withStyles((theme) => ({
    root: {
      '&:focus': {
        backgroundColor: theme.palette.primary.main,
        '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
          color: theme.palette.common.white,
        },
      },
    },
  }))(MenuItem);

const SideBar = ({
  clickPlus, addGroup,
  firstClickGroup, setFirstClickGroup,
  todayDate, currentDate,
  handleUp, handleDown,
  token, setToken,
  userName, setUserName,
  handleOpenAddBox, handleOpenGroupNameBox,
  schedule, setSchedule,
  state, setState, 
  group, requested,
  sendData,
  changeTaskComplete
}) => {
    const [anchorEl, setAnchorEl] = React.useState(null);

    // 變換觀看模式
    const changeState = (msg) => {
        if(msg === 'group' && firstClickGroup === true){
          handleOpenGroupNameBox(true);
          setFirstClickGroup(false)
        }
        handleClose();
        setState(msg);
    }

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    
    const handleClose = () => {
      setAnchorEl(null);
    };
    
    // 登出
    const logOut = () => {
        setToken('')
        setUserName('')
        window.localStorage.clear()
        window.location.reload()
    }

    // 清除所有已完成的 task
    const clearAllCompleted = () => {
        const toDelete = schedule.filter(e => (e.completed === true))
        sendData({
            task: 'deleteSchedule', 
            payload: { username: userName, dataToDelete: toDelete, token: token }
        })
    }

    return (
        <div className={clickPlus || addGroup? "calendar__sidebar disabled":"calendar__sidebar"}>
            <div className="sidebar__nav">
                <Button
                    aria-controls="customized-menu"
                    aria-haspopup="true"
                    variant="contained"
                    color=""
                    onClick={handleClick}
                >
                    Menu
                </Button>
                <StyledMenu
                    id="customized-menu"
                    anchorEl={anchorEl}
                    keepMounted
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                >
                        <StyledMenuItem>
                            <ListItemIcon onClick={logOut}>
                                <ExitToAppIcon fontSize="small" />
                            </ListItemIcon>
                            <ListItemText primary="Logout" />
                        </StyledMenuItem>
                        <StyledMenuItem onClick={() => changeState('personal')}>
                            <ListItemIcon>
                                <PersonIcon fontSize="small" />
                            </ListItemIcon>
                            <ListItemText primary="Personal" />
                        </StyledMenuItem>
                        <StyledMenuItem onClick={() => changeState('group')}>
                            <ListItemIcon>
                                <GroupIcon fontSize="small" />
                            </ListItemIcon>
                            <ListItemText primary="Group" />
                        </StyledMenuItem>
                        <StyledMenuItem onClick={() => changeState('all')}>
                            <ListItemIcon>
                                <AllInboxIcon fontSize="small" />
                            </ListItemIcon>
                            <ListItemText primary="All" />
                        </StyledMenuItem>
                </StyledMenu>
                <img src={plus} className="plus" onClick={() => handleOpenAddBox()} />
                <img src={downArrow} className="downArrow" onClick={() => handleDown()} />
                <img src={upArrow} className="upArrow" onClick={() => handleUp()} />
                <div className="clearAllCompleted" onClick={clearAllCompleted}>Clear</div>
                <div className="sidebar__nav__time">{`${todayDate.toString().split(' ')[1]} ${todayDate.toString().split(' ')[2]} ${todayDate.toString().split(' ')[3]}`}</div>
            </div>
            <h2 className="sidebar__heading">{`${currentDate.year} ${currentDate.month} ${currentDate.day}`}<br /></h2>
            <SideBarList 
                schedule={schedule} setSchedule={setSchedule}
                state={state} token={token} userName={userName} group={group} requested={requested}
                currentDate={currentDate} sendData={sendData}
                changeTaskComplete={changeTaskComplete}
            />
        </div>
    )
}

export default SideBar