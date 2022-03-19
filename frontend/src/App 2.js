import React, { Component, useEffect, useState } from 'react'
import Login from './Login'
import Register from './Register'
import Calendar from './calendar/Calendar'
import Loading from './Loading'
import SelectInput from '@material-ui/core/Select/SelectInput'

const client = new WebSocket('ws://localhost:4000')

const App = () => {

	// Mode to show on screen
    const [mode, setMode] = useState('loading')
    // Login data
    const [token, setToken] = useState("")
    const [userName, setUserName] = useState("")
    // All schedule
    const [schedule, setSchedule] = useState([])
    // View state of group or personal
    const [state, setState] = useState("all")
    // Group name
    const [group, setGroup] = useState("")
    // Record that if we have reequest data
	const [requested, setRequested] = useState(false)
	
	// Send data to server 
    const sendData = (data) => {
        client.send(JSON.stringify(data));
	}

	

	// Get message from server
    client.onmessage = async (message) => {
        const { data } = message
        const [task, payload] = JSON.parse(data)

        switch(task){
            case 'init':
                sendData({
                    task: 'checkToken',
                    payload: {
                        token: window.localStorage.getItem('token')
                    }
                })
                break;
            case 'failedRegister':
                // payload = ""
                alert('Username have been used!')
                break;
            case 'successRegister':
                // payload = ""
                setMode('login')
                break;
            case 'successLogin':
                // payload is User
				window.localStorage.setItem('token', payload.token);
				setToken(payload.token);
				setUserName(payload.username);
				setGroup(payload.group)
				setMode('calendar')
                break;
            case 'failedLogin':
                // payload = ""
				alert("Haven't signup!")
                setMode(() => 'register')
				break;
            case 'validToken': // User have login
                // payload is the data of User
				setToken(window.localStorage.getItem('token'));
				setUserName(payload.username);
				setGroup(payload.group)
				setMode('calendar');
				break;
            case 'invalidToken': // User haven't login
				// payload = ""
                setMode(() => 'login')
				break;
			case 'schedules':
                // payload is all schedule
				payload.sort(function(a, b){
					if(a.Time >= b.Time){
						return 1;
					};
					return -1;
				})
				setSchedule([...payload])
				setRequested(true)
				break;
			case 'newSchedule':
                // payload is newSchedule
				let newSchedule = schedule
				newSchedule.push(payload)
				newSchedule.sort(function(a, b){
					if(a.Time >= b.Time){
						return 1;
					};
					return -1;
				})
				await setSchedule([...newSchedule])
				break;
			case 'deleteSchedule':
				let deleteSchedule = schedule
				let toDelete = payload
				toDelete.forEach(element => {
					if (element.name === userName){
						deleteSchedule = deleteSchedule.filter(e => (e._id != element._id))
					}
				})
				setSchedule([...deleteSchedule])
				break;
			case 'setNewGroupName':
                // payload is group name
                setGroup(payload)
                // Fetch data after setting group name
				sendData({
					task: 'requestSchedule',
					payload: {
						username: userName,
						group: payload,
						token: token
					}
				});
				break;
			case 'invalidTokenOrUsername':
                // payload = ""
				alert('invalidTokenOrUsername')
                break;
            case 'invalidGroup':
                // payload = ""
                alert('invalidGroup')
                break;
        }
        
        client.onopen = () => {
			sendData({
				task: 'checkToken',
				payload: {
					token: window.localStorage.getItem('token')
				}
			})
        }
    }

	

	if(mode == 'loading'){
		return ( 
			<Loading />
		)
	}else if(mode == 'login'){
		return (
			<Login
				setMode={setMode}
				setUserName={setUserName}
				sendData={sendData}
			/>
		)
	}else if(mode == 'register'){
		return (
			<Register
				setMode={setMode}
				setUserName={setUserName}
				sendData={sendData}
			/>
		)
	}else if(mode == 'calendar'){
		return (
			<Calendar
				mode={mode} setMode={setMode}
				token={token} setToken={setToken}
				userName={userName} setUserName={setUserName}
				schedule={schedule} setSchedule={setSchedule}
				state={state} setState={setState}
				group={group} setGroup={setGroup}
				requested={requested} setRequested={setRequested}
				sendData={sendData}
			/>
		)
	}
	
}

export default App
