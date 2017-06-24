# pmkdata-api

[![js-semistandard-style](https://img.shields.io/badge/code%20style-semistandard-brightgreen.svg?style=flat-square)](https://github.com/Flet/semistandard)

This repository contains the backend/REST API server of the PMK Data project. PMK Data is an application which organizes student and mentor data for PMK ITB.

# Running using Docker in development

Prerequisites: [Docker Engine](https://docs.docker.com/engine/installation/) and [Docker Compose](https://docs.docker.com/compose/install/) must be installed; Internet access for pulling NPM packages and Docker images.

Note: Docker commands might need root privileges/sudo.

1. Navigate to the project directory.
2. Run `docker-compose build`. Docker will download NPM packages (application dependencies).
3. Run `docker-compose up -d` to start the application and its supporting services (DB, Redis) in the background. Docker will download images if necessary.
4. Run `docker ps` to see running containers. Take note of the name of the container running the app service.
5. Run `docker exec <app_container_name> npm run migrate` to run the database migration (create the DB schema).
6. Run `docker exec <app_container_name> npm run seed` to populate the DB with sample data. The app can now be accessed at port 3000.

- To stop the containers, run `docker-compose stop`.
- To start the application again, simply run `docker-compose up` or `docker-compose start` to run in the background.
- Use `docker exec -ti <container_name> /bin/bash` to get a shell on a running container.
- To remove the containers, run `docker-compose down`.
- If the Dockerfile is modified, you will need to rebuild the Docker images by removing the containers and running `docker-compose build` again.
- If a DB migration or seed is modified, you will need to rerun step 5 or 6 again.

# Development guidelines

## Code style

This project uses the JS [Semistandard](https://github.com/Flet/semistandard) code style. Check your code by running `npm run lint`.
