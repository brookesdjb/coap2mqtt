const coap = require('coap')
const server = coap.createServer({ type: 'udp6' })
const mqtt = require("mqtt");
const fs = require('fs');
// const dgram = require('dgram'); // For joining multicast groups
// const coapPacket = require('coap-packet');

// Path to the JSON file
const filePath = '/data/options.json';

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


const client = mqtt.connect("mqtt://ha.brookes.cloud", {username: "mqtt", password: "G1g4b1t!"});

let regPayloadT = (deviceId) => (

    {
    "device_class":"temperature",
    "state_topic":`homeassistant/sensor/${deviceId}/state`,
    "unit_of_measurement":"°C",
    "value_template":"{{ value_json.temperature}}",
    "unique_id":`${deviceId}_tempae`,
    "device":{
       "identifiers":[
           `${deviceId}ae`
       ],
       "name":"Spool 1",
       "manufacturer": "Example sensors Ltd.",
       "model": "Example Sensor",
       "model_id": "K9",
       "serial_number": `${deviceId}_12AE3010545`,
       "hw_version": "1.01a",
       "sw_version": "2024.1.0",
       "configuration_url": "https://example.com/sensor_portal/config"
    }
 });
 let regPayloadH = (deviceId) => ({
    "device_class":"humidity",
    "state_topic":`homeassistant/sensor/${deviceId}/state`,
    "unit_of_measurement":"%",
    "value_template":"{{ value_json.humidity}}",
    "unique_id":`${deviceId}_humae`,
    "device":{
       "identifiers":[
          `${deviceId}ae`
       ]
    }
 })

 let regPayloadB = (deviceId) => ({
   "device_class":"battery",
   "state_topic":`homeassistant/sensor/${deviceId}/state`,
   "unit_of_measurement":"%",
   "value_template":"{{ value_json.battery}}",
   "unique_id":`${deviceId}_battae`,
   "device":{
      "identifiers":[
         `${deviceId}ae`
      ]
   }
})

client.on("connect", () => {
   console.log("connected");
   client.publish("homeassistant/sensor/esp001T/config", JSON.stringify(regPayloadT("esp001")));
   client.publish("homeassistant/sensor/esp001H/config", JSON.stringify(regPayloadH("esp001")));
   client.publish("homeassistant/sensor/esp001B/config", JSON.stringify(regPayloadB("esp001")));

   client.publish("homeassistant/sensor/esp002T/config", JSON.stringify(regPayloadT("esp002")));
   client.publish("homeassistant/sensor/esp002H/config", JSON.stringify(regPayloadH("esp002")));
   client.publish("homeassistant/sensor/esp002B/config", JSON.stringify(regPayloadB("esp002")));

   client.publish("homeassistant/sensor/esp003T/config", JSON.stringify(regPayloadT("esp003")));
   client.publish("homeassistant/sensor/esp003H/config", JSON.stringify(regPayloadH("esp003")));
   client.publish("homeassistant/sensor/esp003B/config", JSON.stringify(regPayloadB("esp003")));
//    client.publish("homeassistant/sensor/esp003H/config", '');

  });

server.on('request', (req, res) => {
   if(req.url.split('/')[1] === 'update'){
      console.log('update request')
      res.end('yes\n')
      return

   }
console.log(req.payload.toString())
    const payload = req.payload.toString().split(':');
    console.log(req.url.split('/')[1], payload[0], payload[1], JSON.stringify(payload));
    client.publish(`homeassistant/sensor/esp001/state`, JSON.stringify({temperature: Number(payload[0]), humidity: Number(payload[1]), battery: Number(payload[2])}));

  res.end('Hello\n')
})

// // Multicast Address and Port
// const multicastAddr = 'ff05::1';
// const port = 5683;

// // Join the multicast group
// const socket = dgram.createSocket({ type: 'udp6', reuseAddr: true });
// socket.bind(port, () => {
//     socket.addMembership(multicastAddr);
//     console.log(`Joined multicast group: ${multicastAddr}`);
// });



// the default CoAP port is 5683
server.listen(() => {
    console.log('CoAP server is listening on port 5683...')

})