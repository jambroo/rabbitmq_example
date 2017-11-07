# RabbitMQ

## Intro

Proof-of-concept RabbitMQ queue. Messages can be queues and are popped off and displayed.

## View Last Message

```
curl -H "Content-Type: application/json" http://localhost:8080/
```

## Queue Message

```
curl -d '{"message":"test_message"}' -H "Content-Type: application/json" -X POST http://localhost:8080/send
```
