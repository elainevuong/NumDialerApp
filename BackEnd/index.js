const express = require('express')
const axios = require('axios')
const app = express()
const PORT = 8000

let numberIdx = 0;

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

const phoneNumbersInProgress = {
}

app.use(express.json()); // middleware to access the request body

app.get('/', (req, res) => {
  res.send('Hello!')
})

// making 10 async functions running at most at the same time

// first 3 calls at the same time, BUT you are not dialing 4th call once one of the first 3 ones resolves

// 3 calls === 3 requests to the server  -> you get 3 responses back (with call ids). When you get response, 
// async function is resolved 

// you are subscribed to 3 webhooks for these 3 phone numbers that you dialed

// only when you get status completed for one of these phone numbers you can dial another number

function initialCalls(phoneNumbers) { // logic to determine which phone numbers are getting dispatched
  let phoneCalls = [];

  for (let idx = numberIdx; idx < 3; idx++) {
    numberIdx = idx
    phoneCalls.push(processPhoneNumber(phoneNumbers[idx], idx))
  }
  return phoneCalls;
  // let copyNumbers = [...phoneNumbers]
  // let currIndex = 0

  // return new Promise ((resolve, reject) => {
  //   let numberCompleted = 0;
  //   let numberRunning = 0;

  //   const callNextNumber = () => {
  //     numberRunning += 1

  //     let currentNumber = copyNumbers.shift()
  //     processPhoneNumber(currentNumber, currIndex).then(() => {
  //       numberRunning -= 1
  //       numberCompleted += 1

  //       console.log(`Number Requests Running: ${numberRunning}`)
  //       console.log(`Number Requests Completed: ${numberCompleted}`)
  //       console.log(`Remaining Requests: ${copyNumbers}`)

  //       if (numberCompleted === phoneNumbers.length) {
  //         resolve()
  //       } else if (copyNumbers.length > 0) {
  //         callNextNumber()
  //         currIndex++
  //       }
  //     })
  //   }

  //   let index = 0
  //   while (copyNumbers.length > 0 && index < maxCalls) {
  //     callNextNumber()
  //     index++
  //     currIndex++
  //   }
  // })
}

const processPhoneNumber = async (phoneNumber, index) => {  // logic to set up and send phone number to API
  const webhookURL = `http://localhost:8000/webhooks/phone/${phoneNumber}`
  const phoneNumObject = {
    phone: String(phoneNumber),
    webhookURL
  }
  const response = await axios.post(`http://localhost:4830/call`, phoneNumObject)
  const id = response.data.id
  if (!(id in phoneNumbersInProgress)) {
    const phoneNumberProperties = {
      phoneNumber: phoneNumber,
      position: index,
      status: 'idle'
    }

    phoneNumbersInProgress[id] = phoneNumberProperties;
    return id;
  }
  // return new Promise((resolve, reject) => {


  //   const sendPostRequest = async () => {
  //     try {
  //       console.log(`Sending Post Request for Phone Number: ${phoneNumber}, Index Number: ${index}`)
        
       
  //       console.log(`this is the response Id for Number: ${phoneNumber}: id: ${id}`)
        
        
  //       resolve()
  //     } catch (err) {
  //       console.log(err)
  //     }
  //   }
    
  //   sendPostRequest()
  // })
};

app.post('/webhooks/phone/:phoneId', (req, res) => {  //path that an API response is going to follow to send it's data
  console.log('webhook response received')
  
  let body = req.body

  console.log(body)


  let id = req.body.id
  let status = req.body.status

  if (status === "completed" && numberIdx < phoneNumbers.length - 1) {
    numberIdx++
    let phoneNumber = phoneNumbers[numberIdx]

    processPhoneNumber(phoneNumber, numberIdx)
    // dial next number
  }

  phoneNumbersInProgress[id].status = status

  console.log(phoneNumbersInProgress)
  res.status(200).send()
})

// calling numbers and waiting for all of them to resolve
app.get('/startCall', async (req, res) => { //path for when the user clicks the call button
  let response = await Promise.all(initialCalls(phoneNumbers)); // [1270, 1271, 1272]
  // callNumbers(phoneNumbers, 3).then(done => 
  //   res.send('success!')
  // )
  res.send("Success")
})

app.listen(PORT, () => {
  console.log(`app listening on port ${PORT}`)
})