![amerbank](https://amerbank.com/assets/images/logo.png)

Interview test
==============

Using microservices, we will solve the following tasks:

# Create a login and registration system.

1. Users can have two roles: admin and user
20. They should be able to choose role upon registration
30. Tests for login routes and services

From the feature we can infer the messages we will need in our microservices system and we can also assign it a microservice:

Feature | Message | Service
--- | --- | ---
register | create user | user
login | get user | user

For simplifying the design we will choose to have one microservice handling both create and get user messages.

Thankfully, SenecaJS already has user, auth and admin plugins.
The `seneca-auth` plugin is not anymore usable with the new `seneca-web` versions which now has its own auth system in place.

In order to have a secure web site, we'd like to run our microservices in a protected environment. Our microservices should not be called from the internet. In AWS we can create private clusters with k8s and kops, whose instances will not be accessible from outside the cloud. To send messages into our microservices world we'll have an interface API as a bridge from internet HTTP requests and our private instances. See below an illustration of that design.

![global-design](./docs/img/global-design.png)

# Application

## Starting

Place yourself in the project's directory and run `npm start`.

## Configuration

### Ports

App | Port
--- | ---
front API | 4222
gate Service | 4333
