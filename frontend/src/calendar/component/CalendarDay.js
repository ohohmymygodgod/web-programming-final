import React, { Component } from 'react'

import Days from './Days';

import leftArrow from '../../img/left-arrow.png'
import rightArrow from '../../img/right-arrow.png'

const CalendarDay = ({
    clickPlus, addGroup,
    handleLeft, handleRight,
    todayDate, currentDate,
    state, group, requested,
    schedule,
    handleClickOnDay, handleBackToToday
}) => {
    return (
        <div className={clickPlus || addGroup? "calendar__days disabled" : "calendar__days"}>
            <div className="calendar__days__nav">
                <img src={leftArrow} className="leftArrow" onClick={() => handleLeft()} />
                <div className="calendar__days__nav__selectedMonth">
                    {`${currentDate.month} ${currentDate.year}`}
                </div>
                <img src={rightArrow} className="rightArrow" onClick={() => handleRight()} />
                <div className="calendar__days__nav__today" onClick={() => handleBackToToday()} >
                    Today
                </div>
            </div>
            <div className="calendar__days__container">
                <ul className="calendar__days__title__container">
                    <li className="days__title">Sun</li>
                    <li className="days__title">Mon</li>
                    <li className="days__title">Tue</li>
                    <li className="days__title">Wen</li>
                    <li className="days__title">Thu</li>
                    <li className="days__title">Fri</li>
                    <li className="days__title">Sat</li>
                </ul>
                <Days 
                    state={state} group={group} requested={requested}
                    schedule={schedule}
                    todayDate={todayDate} currentDate={currentDate}
                    handleClickOnDay={handleClickOnDay}
                />
            </div>
        </div>
    )
}

export default CalendarDay