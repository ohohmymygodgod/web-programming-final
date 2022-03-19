import React, { Component, useState, useEffect } from 'react'
import delete_png from '../../img/delete.png'

const Month = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const SideBarList = ({
    schedule, setSchedule,
    state, token, userName, group, requested,
    currentDate, sendData,
    changeTaskComplete
}) => {

    const temp = schedule
    const [mySchedule, setMySchedule] = useState([...temp]);
    // click the trash can button, then delete that task.
    const deleteOneTask = (task) => {
        let newSchedule = schedule
        newSchedule.filter(e => (e._id !== task._id));
        setSchedule([...newSchedule])
        let toDelete = []
        toDelete.push(task);
        sendData({
            task: 'deleteSchedule', 
            payload: { username: userName, dataToDelete: toDelete, token: token }
        })
    }

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
            temp = temp.filter(e => (e.visibility === 1))
            setMySchedule([...temp])
        }
    }, [requested, state, schedule, group])

    return (
        <ul className="sidebar__list">
            {mySchedule.filter(element => 
                element.Year === parseInt(currentDate.year) && element.Month === Month.indexOf(currentDate.month) && element.Date === parseInt(currentDate.day)
                /* only select today's task*/
            )
            .map(element => {
                return (
                    <li key={element._id} className={element.completed? "sidebar__list-item sidebar__list-item--complete" : "sidebar__list-item" }>
                        <input
                            id={element.id}
                            defaultChecked={element.completed}
                            onChange={() => changeTaskComplete(element)}
                            type="checkbox"
                            className="sidebar__list-checkbox"
                        />
                        <label htmlFor={element.id}></label>
                        <span className="list-item__time">{element.Time}</span>
                        <img src={delete_png} className="delete_png" onClick={() => deleteOneTask(element)} />
                        <p className="list-item__data">{element.data}</p>
                    </li>
                )
            })}
        </ul>
        
    )
}

export default SideBarList