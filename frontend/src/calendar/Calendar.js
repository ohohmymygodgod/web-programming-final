import React, { Component, useEffect, useState } from 'react'
import './Calendar.css'

import SideBar from "./component/SideBar"
import CalendarDay from "./component/CalendarDay"
import AddBox from "./component/AddBox"
import GroupName from "./component/GroupName"

const Month = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const dayNum = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];


const Calendar = ({
    mode, setMode,
    token, setToken,
    userName, setUserName,
    schedule, setSchedule,
    state, setState,
    group, setGroup,
    requested, setRequested,
    sendData
}) => {
    // 今天的日期
    const [todayDate, setTodayDate] = useState(new Date())
    // 點選的日期
    const [currentDate, setCurrentDate] = useState({
        year: todayDate.toString().split(' ')[3],
        month: todayDate.toString().split(' ')[1],
        day: todayDate.toString().split(' ')[2],
    })
    // click plus buttom
    const [clickPlus, setClickPlus] = useState(false);
    // add group bottom
    const [addGroup, setAddGroup] = useState(false);
    const [timerID, setTimerID] = useState(false);
    // 是否有group了
    const [firstClickGroup, setFirstClickGroup] = useState(true)


    // When group is changed, request data from data base
    // When group is not "", set firstClickGroup to false
    useEffect(() => {
        if(group === ''){
          setFirstClickGroup(true)
        }else{
          setFirstClickGroup(false)
        }
        sendData({
            task: 'requestSchedule',
            payload: {
                username: userName,
                group: group,
                token: token
            }
        });
    }, [group])

    // 計時器
    useEffect(() => {
        if (!timerID){
            setTimerID(setInterval(() => {
                setTodayDate(new Date())
            }, 1000))
        }
    }, [todayDate])
    
    // current month -=1 
    const handleLeft = () => {
        if(currentDate.month === 'Jan'){
            const temp = currentDate;
            temp.year = (parseInt(currentDate.year)-1).toString()
            temp.month = 'Dec'
            temp.day = '1'
            setCurrentDate({...temp});
        }else{
            const temp = currentDate;
            temp.month = Month[Month.indexOf(currentDate.month)-1]
            temp.day = '1'
            setCurrentDate({...temp})
        }
    }
    // current month += 1
    const handleRight = () => {
        if(currentDate.month === 'Dec'){
            const temp = currentDate;
            temp.year = (parseInt(currentDate.year)+1).toString()
            temp.month = 'Jan'
            temp.day = '1'
            setCurrentDate({...temp});
        }else{
            const temp = currentDate;
            temp.month = Month[Month.indexOf(currentDate.month)+1]
            temp.day = '1'
            setCurrentDate({...temp})
        }
    }
    // current day += 1
    const handleDown = () => {
        if(parseInt(currentDate.day)+1 > dayNum[Month.indexOf(currentDate.month)]){
            if(currentDate.month === 'Dec'){
                const temp = currentDate;
                temp.year = (parseInt(currentDate.year)+1).toString()
                temp.month = 'Jan'
                temp.day = '1'
                setCurrentDate({...temp});
            }else{
                const temp = currentDate;
                temp.month = Month[Month.indexOf(currentDate.month)+1]
                temp.day = '1'
                setCurrentDate({...temp})
            }
        }else{
            const temp = currentDate;
            temp.day = (parseInt(currentDate.day)+1).toString();
            setCurrentDate({...temp});
        }
    }
    // current day -= 1 
    const handleUp = () => {
        if(currentDate.day == 1){
            if(currentDate.month === 'Jan'){
                const temp = currentDate;
                temp.year = (parseInt(currentDate.year)-1).toString()
                temp.month = 'Dec'
                temp.day = dayNum[Month.indexOf(temp.month)]
                setCurrentDate({...temp});
            }else{
                const temp = currentDate;
                temp.month = Month[Month.indexOf(currentDate.month)-1]
                temp.day = dayNum[Month.indexOf(temp.month)]
                setCurrentDate({...temp})
            }
        }else{
            const temp = currentDate;
            temp.day = (parseInt(currentDate.day)-1).toString();
            setCurrentDate({...temp});
        }
    }

    // set currentDate to todayDate
    const handleBackToToday = () => {
        const temp = {
            year: todayDate.toString().split(' ')[3],
            month: todayDate.toString().split(' ')[1],
            day: todayDate.toString().split(' ')[2],
        }
        setCurrentDate({...temp})
    }

    // open edit todo 
    const handleOpenAddBox = () => {
        setClickPlus(true);
    }
    // close edit todo
    const handleCloseAddBox = () => {
        setClickPlus(false);
    }
    // open edit group name 
    const handleOpenGroupNameBox = () => {
        setAddGroup(true);
    }
    // close edit group name
    const handleCloseGroupNameBox = () => {
        setAddGroup(false);
    }
    // when click on the day's grid, set current day to that grid
    const handleClickOnDay = (i) => {
        const temp = currentDate;
        temp.day = i.toString();
        setCurrentDate({...temp});
    }

    // change the completed state of the task
    const changeTaskComplete = async (element) => {
        let newitem = schedule;
        element.completed = !element.completed;
        newitem[newitem.indexOf(element)] = element;
        await setSchedule([...newitem]);
    }

    
    return (
        <div className="calendar-contain">
            {clickPlus? 
            <AddBox 
                firstClickGroup={firstClickGroup}
                setFirstClickGroup={setFirstClickGroup}
                handleCloseAddBox={handleCloseAddBox}
                handleOpenGroupNameBox={handleOpenGroupNameBox}
                userName={userName} group={group} token={token}
                sendData={sendData} currentDate={currentDate}
            />:""}
            {addGroup?
            <GroupName
                setGroup={setGroup}
                handleCloseGroupNameBox={handleCloseGroupNameBox}
                userName={userName} token={token}
                sendData={sendData}
            />:""}
            <SideBar 
                clickPlus={clickPlus} addGroup={addGroup}
                firstClickGroup={firstClickGroup} setFirstClickGroup={setFirstClickGroup}
                todayDate={todayDate} currentDate={currentDate}
                handleUp={handleUp} handleDown={handleDown}
                token={token} setToken={setToken}
                userName={userName} setUserName={setUserName}
                handleOpenAddBox={handleOpenAddBox} handleOpenGroupNameBox={handleOpenGroupNameBox}
                schedule={schedule} setSchedule={setSchedule}
                state={state} setState={setState}
                group={group} requested={requested}
                sendData={sendData}
                changeTaskComplete={changeTaskComplete}
            />
            <CalendarDay 
                clickPlus={clickPlus} addGroup={addGroup}
                handleLeft={handleLeft} handleRight={handleRight}
                state={state} group={group} requested={requested}
                schedule={schedule}
                todayDate={todayDate} currentDate={currentDate}
                handleClickOnDay={handleClickOnDay} handleBackToToday={handleBackToToday}
            />
        </div>
    )
    
}

export default Calendar