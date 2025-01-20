const coap = require('coap')
const server = coap.createServer({ type: 'udp6' })
const mqtt = require("mqtt");
const fs = require('fs');

// Path to the JSON file
const filePath = './options.json';
const filePath2 = '/data/options.json';

// Read the file asynchronously
fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading file:', err);
        return;
    }

    try {
        // Parse the JSON data
        const options = JSON.parse(data);
        console.log('File contents:', options);
    } catch (parseErr) {
        console.error('Error parsing JSON:', parseErr);
    }
});

// Read the file asynchronously
fs.readFile(filePath2, 'utf8', (err, data) => {
   if (err) {
       console.error('Error reading file2:', err);
       return;
   }

   try {
       // Parse the JSON data
       const options = JSON.parse(data);
       console.log('File contents2:', options);
   } catch (parseErr) {
       console.error('Error parsing JSON2:', parseErr);
   }
});
const client = mqtt.connect("mqtt://ha.brookes.cloud", {username: "mqtt", password: "G1g4b1t!"});

let regPayloadT = {
    "device_class":"temperature",
    "state_topic":"homeassistant/sensor/esp001/state",
    "unit_of_measurement":"°C",
    "value_template":"{{ value_json.temperature}}",
    "unique_id":"temp01ae",
    "device":{
       "identifiers":[
           "esp001ae"
       ],
       "name":"Spool 1",
       "manufacturer": "Example sensors Ltd.",
       "model": "Example Sensor",
       "model_id": "K9",
       "serial_number": "12AE3010545",
       "hw_version": "1.01a",
       "sw_version": "2024.1.0",
       "configuration_url": "https://example.com/sensor_portal/config"
    }
 }
 let regPayloadH = {
    "device_class":"humidity",
    "state_topic":"homeassistant/sensor/esp001/state",
    "unit_of_measurement":"%",
    "value_template":"{{ value_json.humidity}}",
    "unique_id":"hum01ae",
    "device":{
       "identifiers":[
          "esp001ae"
       ]
    }
 }

 let regPayloadB = {
   "device_class":"battery",
   "state_topic":"homeassistant/sensor/esp001/state",
   "unit_of_measurement":"%",
   "value_template":"{{ value_json.battery}}",
   "unique_id":"batt01ae",
   "device":{
      "identifiers":[
         "esp001ae"
      ]
   }
}
client.on("connect", () => {
   console.log("connected");
   client.publish("homeassistant/sensor/esp001T/config", JSON.stringify(regPayloadT));
   client.publish("homeassistant/sensor/esp001H/config", JSON.stringify(regPayloadH));
   client.publish("homeassistant/sensor/esp001B/config", JSON.stringify(regPayloadB));

//    client.publish("homeassistant/sensor/esp003H/config", '');

  });

server.on('request', (req, res) => {
   if(req.url.split('/')[1] === 'update'){
      console.log('update request')
      res.end('yes\n')
      return

   }

    const payload = req.payload.toString().split(':');
    console.log(req.url.split('/')[1], payload[0], payload[1], JSON.stringify(payload));
    client.publish(`homeassistant/sensor/esp001/state`, JSON.stringify({temperature: Number(payload[0]), humidity: Number(payload[1]), battery: Number(payload[2])}));

  res.end('Hello\n')
})

// the default CoAP port is 5683
server.listen(() => {
    console.log('CoAP server is listening on port 5683...')

})