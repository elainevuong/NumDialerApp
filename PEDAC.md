3 Environments
- API - 4830
- Backend - 8000
- FrontEnd - 3000

API -> accepts a POST request to /call that consists of a phone number and a web hook URL

Available Phone Numbers:
13018040009 <status> <data-id: 0>
19842068287 <status> <data-id: 1>
15512459377 <status> <data-id: 2>
19362072765 <status>
18582210308 <status>
13018040009 <status>
19842068287 <status>
15512459377 <status>
19362072765 <status>

WebhookURL -> is a path in the Backend
POST BackEnd/Call
  - when the API 

Front-End
  < Call >
  Phone Number 1 <Status>
  Phone Number 2 <Status>
  Phone Number 3 <Status>
Flow
  - when we Click the Call Button
  - probably send some GET Request to the Backend
    - Back-End needs to send up to 3 calls at a time to the API Server
      - Back-End needs to provide a Endpoint / Webhook URL
      - localhost8000:/calls
      - the API Server when it's ready, it will send back a POST request to localhost8000:/calls
        - when the Backend receives a webhook POST from the API Server, it needs to update some kind of data (in memory)
        - we need the Backend to PUSH (socket.io -> websocket) push the received data to the Front-End