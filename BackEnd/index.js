const express = require('express')
const axios = require('axios')
const app = express()
const PORT = 8000

const phoneNumbers = [
  13018040009,
  19842068287,
  15512459377, 
  19362072765, 
  18582210308, 
  13018040009,
  19842068287,
  15512459377,
  19362072765,
]

app.use(express.json()); // middleware to access the request body

app.get('/', (req, res) => {
  res.send('Hello!')
})

/*
function processPhoneNumberTest(phoneNumber) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log('------------')
      console.log(`processing phone number: ${phoneNumber}`)
      resolve(phoneNumber)
    }, 3000)
  })
}
*/

function callNumbers(phoneNumbers, maxCalls = 3) {
  let copyNumbers = [...phoneNumbers]
  // console.log(copyNumbers)

  return new Promise ((resolve, reject) => {
    let numberCompleted = 0;
    let numberRunning = 0;

    const callNextNumber = () => {
      numberRunning += 1

      processPhoneNumber(copyNumbers.shift()).then(() => {
        numberRunning -= 1
        numberCompleted += 1

        /*
        console.log(`Numbers Completed: ${numberCompleted}`)
        console.log(`Numbers of Calls In Progress: ${numberRunning}`)
        console.log(`Remaining Numbers: ${copyNumbers}`)
        console.log('-------------------')
        */

        if (numberCompleted === phoneNumbers.length) {
          // console.log('Complete')
          resolve()
        } else if (copyNumbers.length > 0) {
          // console.log('calling next number', )
          callNextNumber()
        }
      })
    }

    let index = 0
    while (copyNumbers.length > 0 && index < maxCalls) {
      callNextNumber()
      index++
    }
  })
}

const processPhoneNumber = async (phoneNumber) => {
  return new Promise((resolve, reject) => {
    console.log('within process Phone Number')
    const webhookURL = `http://localhost:8000/webhooks/phone/${phoneNumber}`
    console.log(phoneNumber)
    const phoneNumObject = {
      phone: String(phoneNumber),
      webhookURL
    }
    const sendPostRequest = async () => {
      try {
        console.log(`Sending Post Request for Phone Number: ${phoneNumber}`)
        const response = await axios.post(`http://localhost:4830/call`, phoneNumObject)
        console.log(response.data)
        resolve()
      } catch (err) {
        console.log(err)
      }
    }
  
    sendPostRequest()

  })
};


app.get('/startAllCalls', (req, res) => {
  // Front End - clicks button - causes us to be directed to this route
  // loop through the phone numbers and dispatch 3 at a time
  // and I need to make requests to the API Server

  // I need Axios(?)


})

app.post('/webhooks/phone/:phoneId', (req, res) => {
  console.log(req.params)
  let body = req.body
  console.log(body)
  res.status(200).send()
})

app.get('/startCall', (req, res) => {
  callNumbers(phoneNumbers, 3).then(done => 
    res.send('success!')
  )
})

app.listen(PORT, () => {
  console.log(`app listening on port ${PORT}`)
})

/*
  - front-end -> user is going to click 'call'
      -> sends a Get Request to the path on the back-end that is /startAllCalls
    - when the user clicks call
    - we want to dispatch the first 3 phone numbers to start calling
    - use the 'callNumbers' functionality

    BackEnd Server - needs to send a NEW REQUEST to the API Server
      (?) -> we're within the /startAllCalls




  POST Request
  {
    phoneNumber: 13018040009,
    webHookURL: /callWebhook
  }

  Response from APIServer
  {
    id: 1283 
  }

  BackEnd Object Representation
  {
    id#1273: {
      phoneNumber: 13018040009,
      status: ringing,
      position: 0
    },
    1274: {
      phoneNumber:
      status:
      position: 1
    }
  }


  Front-End/Back-End Communication
  {
    position: id
  }

  13018040009 
  19842068287,
  15512459377, 
  19362072765, 
  18582210308, 
  13018040009,
  19842068287,
  15512459377,
  19362072765,

  If a Webhook comes through on the backend
  affects id 1283
  From the id get the position
  Front-End -> now it knows which phone number based on position
  to update
    go into that position
      change the status from ringing -> answered -> completed

  
  Front-End
    - id -> phoneNumber(?) -> status
  
  if status = ringing, create a new object and add it to the array




  [
    {
      phoneNumber: 777777777
      status: rignging
      id: 1273
    }
 
  ]
  

array[0].id

  When the Back-End gets a Webhook response from the API Server
    - Back-End Updates the Back-End Object Representation


  13018040009 idle

  13018040009 ringing

  13018040009 answered

  13018040009 completed

*/