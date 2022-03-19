require('dotenv-defaults').config()

const http = require('http')
const express = require('express')
const mongoose = require('mongoose')
const WebSocket = require('ws')
const md5 = require('js-md5');

const Message = require('./models/Message')
const User = require('./models/User')
const Schedule = require('./models/Schedule')

const app = express()
const server = http.createServer(app)
const wss = new WebSocket.Server({ server })

if (!process.env.MONGO_URL) {
  console.error('Missing MONGO_URL!!!')
  process.exit(1)
}

mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

const db = mongoose.connection

db.on('error', (error) => {
  console.error(error)
})

db.once('open', () => {
  console.log('MongoDB connected!')

  wss.on('connection', ws => {
    const sendData = (data) => {
      ws.send(JSON.stringify(data))
    }

    ws.send(JSON.stringify(['init', ""]));

    ws.onmessage = async (input) => {
      const { data } = input
      const {task, payload} = JSON.parse(data)
      console.log(task)

      switch (task) {
        // request to login
        case 'checkToken': { // payload : {token}
            var { token } = payload;
            var user = await User.find({"token": token});
            if ( user.length ){
                ws.send(JSON.stringify(['validToken', user[0]]));
            }else{
                ws.send(JSON.stringify(['invalidToken', ""]));
            }
            break
        }
        // request to signup
        case 'signup': { // payload : {username, password}
            var { username , password } = payload;
            // fail if username exist
            var user = await User.find({"username": username});
            if (user.length){
                ws.send(JSON.stringify(['failedRegister', ""]));
                break;
            }
            var token = md5(md5(username) + md5(password))
            var group = "";
            var dataToSave = new User({
                username: username, 
                password: password, 
                group: group, 
                token: token
            })
            dataToSave.save()
                .then(item => {
                    console.log("User saved to database");
                    ws.send(JSON.stringify(['successRegister', ""]));
                })
                .catch(err => {
                    console.log("unable to save to database");
                });
            break
        }
        // request to login
        case 'login': { // payload : {username, password}
            var { username , password } = payload;
            var user = await User.find({"username": username, "password": password});
            if ( user.length ){
                ws.send(JSON.stringify(['successLogin', user[0]]));
            }else{
                ws.send(JSON.stringify(['failedLogin', ""]));
            }
            break
        }
        // request to send message
        case 'inputMessage': { // payload : Message schema + token ({ {message} , token })
            var { mes , token } = payload;
            var user = await User.find({"username": mes.username, "token": token});
            if (user.length <= 0) {
                ws.send(JSON.stringify(['invalidTokenOrUsername', ""]));
                break;
            }
            if (user[0].group != mes.group) {
                ws.send(JSON.stringify(['invalidGroup', ""]));
                break;
            }
            var dataToSave = new Message(mes);
            dataToSave.save()
                .then(item => {
                    console.log("item saved to database");
                    wss.clients.forEach(function each(client) {
                        client.send(JSON.stringify(['newMessage', mes]))
                    });
                })
                .catch(err => {
                    console.log("unable to save to database");
                });
            break
        }
        // request to get messages after login
        case 'requestMessage': { // payload : { username , group , token }
            var { username, group , token } = payload;
            var user = await User.find({"username": username, "token": token});
            if (user.length <= 0) {
                ws.send(JSON.stringify(['invalidTokenOrUsername', ""]));
                break;
            }
            if (user[0].group != group) {
                ws.send(JSON.stringify(['invalidGroup', ""]));
                break;
            }
            var messages = await Message.find({"group": group});
            ws.send(JSON.stringify(['messages', messages]))
            break
        }
        // request to change group name
        case 'group': { // payload : username + group name + token ({ username , group , token })
            var { username, group , token } = payload;
            var user = await User.find({"username": username, "token": token});
            if (user.length <= 0) {
                ws.send(JSON.stringify(['invalidTokenOrUsername', ""]));
                break;
            }
            await User.updateOne({"username": username}, {$set: {"group": group}})
            ws.send(JSON.stringify(['setNewGroupName', group]));
            break;
        }
        // request to clear messages of a group
        case 'clear': { // payload : username + group name + token ({ username , group , token })
            var { username, group , token } = payload;
            var user = await User.find({"username": username, "token": token});
            if (user.length <= 0) {
                ws.send(JSON.stringify(['invalidTokenOrUsername', ""]));
                break;
            }
            if (user[0].group != group) {
                ws.send(JSON.stringify(['invalidGroup', ""]));
                break;
            }
            Message.deleteMany({"group" : group})
            .then(() => {
                wss.clients.forEach(function each(client) {
                    client.send(JSON.stringify(['deleted', payload]))
                });
            })

          break
        }
        // request to send schedule
        case 'inputSchedule': { // payload : Schedule schema + username + token ({ {schedule} , username , token })
            var { sche , username , token } = payload;
            var user = await User.find({"username": username, "token": token});
            if (user.length <= 0) {
                ws.send(JSON.stringify(['invalidTokenOrUsername', ""]));
                break;
            }
            var dataToSave = new Schedule(sche);
            dataToSave.save()
                .then(item => {
                    console.log("item saved to database");
                    wss.clients.forEach(function each(client) {
                        client.send(JSON.stringify(['newSchedule', item]))
                    });
                })
                .catch(err => {
                    console.log("unable to save to database");
                });
            break
        }
        // request to get schedules after login
        case 'requestSchedule': { // payload : { username , group , token }
            var { username, group , token } = payload;
            var user = await User.find({"username": username, "token": token});
            if (user.length <= 0) {
                ws.send(JSON.stringify(['invalidTokenOrUsername', ""]));
                break;
            }
            if (user[0].group != group) {
                ws.send(JSON.stringify(['invalidGroup', ""]));
                break;
            }
            var groupSchedule = await Schedule.find({"visibility": 1, "name": group});
            var personalSchedule = await Schedule.find({"visibility": 0, "name": username});
            var schedules = [...groupSchedule, ...personalSchedule];
            ws.send(JSON.stringify(['schedules', schedules]));
            break;
        }
        // request to get schedules after login
        case 'deleteSchedule': { // payload : { username , data , token }
            var { username, dataToDelete , token } = payload;
            var user = await User.find({"username": username, "token": token});
            if (user.length <= 0) {
                ws.send(JSON.stringify(['invalidTokenOrUsername', ""]));
                break;
            }
            for(var i=0 ; i<dataToDelete.length ; ++i) {
                await Schedule.deleteOne({
                    "_id": dataToDelete[i]._id
                    // "Year": dataToDelete[i].Year,
                    // "Month": dataToDelete[i].Month,
                    // "Date": dataToDelete[i].Date,
                    // "Time": dataToDelete[i].Time,
                    // "visibility": dataToDelete[i].visibility,
                    // "name": dataToDelete[i].name,
                    // "data": dataToDelete[i].data,
                });
            }
            wss.clients.forEach(function each(client) {
                client.send(JSON.stringify(['deleteSchedule', dataToDelete]));
            });
            break;
        }
        default:
          break
      }
    }
  })

  const PORT = process.env.port || 4000

  server.listen(PORT, () => {
    console.log(`Listening on http://localhost:${PORT}`)
  })
})
