const coap = require('coap')
const server = coap.createServer({ type: 'udp6' })
const mqtt = require("mqtt");
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
client.on("connect", () => {
   console.log("connected");
   client.publish("homeassistant/sensor/esp001T/config", JSON.stringify(regPayloadT));
   client.publish("homeassistant/sensor/esp001H/config", JSON.stringify(regPayloadH));
//    client.publish("homeassistant/sensor/esp003H/config", '');

  });

server.on('request', (req, res) => {
    const payload = req.payload.toString().split(':');
    console.log(req.url.split('/')[1], payload[0], payload[1])
    client.publish(`homeassistant/sensor/esp001/state`, JSON.stringify({temperature: Number(payload[0]), humidity: Number(payload[1])}));

  res.end('Hello\n')
})

// the default CoAP port is 5683
server.listen(() => {
    console.log('CoAP server is listening on port 5683...')

})