import React, { Component, useState, useEffect } from 'react'

const Month = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const dayNum = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

const Days = ({
    state, group, requested,
    schedule,
    todayDate, currentDate,
    handleClickOnDay
}) => {

    const temp = schedule
    const [mySchedule, setMySchedule] = useState([...temp]);
    useEffect(() => {
        if(state == 'all'){
            let temp = schedule
            setMySchedule([...temp])
        }else if(state == 'personal'){
            let temp = schedule
            temp = temp.filter(e => (e.visibility === 0))
            setMySchedule([...temp])
        }else if(state == 'group'){
            let temp = schedule
            temp = temp.filter(e => (e.name === group && e.visibility === 1))
            setMySchedule([...temp])
        }
    }, [requested, state, schedule, group])

    const currentMonth = Month.indexOf(currentDate.month);
    const firstDay = new Date(`${currentDate.year}-${currentDate.month}-1`).getDay();
    // push blank until the day(Mon to Sun) is the first day's day.
    const days = [];
    for (let i = 0; i < firstDay; i++) {
        days.push((<li key={-i} className="days__disabled" id={i}></li>));
    }
    for (let day = 1; day <= dayNum[currentMonth]; day++) {
        // numnber of task of this day
        const n_task = mySchedule.filter(element => 
            element.Year === parseInt(currentDate.year) && element.Month === Month.indexOf(currentDate.month) && element.Date === day
        ).length
        
        days.push((
            <li key={day} className="days" id={day} onClick={() => handleClickOnDay(day)}>
                <h1 className={day === parseInt(todayDate.toString().split(' ')[2]) ? "today" : ""}>{day}</h1>
                <p className="NumOfTask">{n_task === 0? "" : `${n_task} Task`}</p>
            </li>
        ))
    }

    return (
        <ul className="calendar__days__day__container">
            {days.map(item => item)}
        </ul>
        
    )
}

export default Days