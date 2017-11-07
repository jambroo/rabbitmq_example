'use strict';

const express = require('express');
const amqp = require('amqplib/callback_api');

const PORT = 8080;
const HOST = '0.0.0.0';

const app = express();
app.get('/', (req, res) => {
  amqp.connect('amqp://rabbit', function(err, conn) {
    conn.createChannel(function(err, ch) {
      var q = 'hello';

      ch.assertQueue(q, {durable: false});

      ch.consume(q, function(msg) {
        let incoming = msg.content.toString();
        console.log(" [x] Received %s", incoming);
        res.send(`Incoming message: ${incoming}.`);
      }, {noAck: true});

      setTimeout(function() { conn.close(); }, 1000);
    });
  });
});

app.get('/send', (req, res) => {
  amqp.connect('amqp://rabbit', function(err, conn) {
    conn.createChannel(function(err, ch) {
      var q = 'hello';

      ch.assertQueue(q, {durable: false});
      ch.sendToQueue(q, new Buffer('Hello World!'));

      setTimeout(function() { conn.close(); res.send("Sent message!\n"); }, 500);
    });
  });
})

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
