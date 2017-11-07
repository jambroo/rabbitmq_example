'use strict';

const express = require('express');
const amqp = require('amqplib');
const bodyParser = require('body-parser')

const PORT = 8080;
const HOST = '0.0.0.0';
const RABBIT_HOST = 'rabbit';
const NO_MESSAGES = 'NO_MESSAGES';
const QUEUE_NAME = 'test';

const app = express();
const open = amqp.connect(`amqp://${RABBIT_HOST}`);

app.use(bodyParser());

app.get('/', (req, res) => {
  open.then((conn) => {
    return conn.createChannel();
  }).then(function(ch) {
    let q = 'test';

    return ch.assertQueue(QUEUE_NAME).then(function(ok) {
      if (ok.messageCount == 0) {
        return NO_MESSAGES;
      }

      return ch.get(QUEUE_NAME, (msg) => {
        if (msg !== null) {
          ch.ack(msg);
        }
      });
    });
  }).then((msg) => {
    if (msg === NO_MESSAGES) {
      res.send({ message: "No messages. Waiting..." });
    } else {
      res.send({ message: `Message received: ${msg.content.toString()}` });
    }
  }).catch(console.warn);
});

app.post('/send', (req, res) => {
  let msg = req.body.message;
  if (!msg) {
    res.send({ message: "Please provide message in POST parameter." });
    return;
  }

  open.then(function(conn) {
    return conn.createChannel();
  }).then(function(ch) {
    return ch.assertQueue(QUEUE_NAME).then(function(ok) {
      let result = ch.sendToQueue(QUEUE_NAME, new Buffer(msg))

      res.send((result) ? { message: "Message Sent." } : { message: "An error has occurred while sending message." });

      return result;
    });
  }).catch(console.warn);
});

app.listen(PORT, HOST);

console.log(`Running on http://${HOST}:${PORT}`);
