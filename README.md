# RabbitMQ

## Intro

This is an example of a nodejs express app interacting with a rabbitmq service. Messages can be queued and are can also be popped off and displayed.

## View Last Message

```
curl -H "Content-Type: application/json" http://localhost:8080/
```

## Queue Message

```
curl -d '{"message":"test_message"}' -H "Content-Type: application/json" -X POST http://localhost:8080/send
```
