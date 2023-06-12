# Umap
Dịch vụ bản đồ dựa trên nguồn dữ liệu mở OpenStreetMap
## TechStack
- NodeJs 
- NextJs 
- ReactJs
- Tailwindcss
- Postgre/PostGIS
- Docker

# Setup
- nvm
- Node : 16.14.0
- Docker Desktop

## Run
- web app
    - `cd umap-web`
    - `npm install`
    - `npm run dev`

# Docker
## Build docker
- Set env vars:
    - DOCKER_HUB = xxx.xxx.xxx

- Run any the following command to build docker image    
    - `docker-compose build`
    - `docker-compose up --build`
    - `docker-compose --env-file .env build `

## Push image
- Push image to docker registry
    - `docker-compose push web4umap`




