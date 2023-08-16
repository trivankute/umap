# Umap
Dịch vụ bản đồ dựa trên nguồn dữ liệu mở OpenStreetMap
# Demo
[Demo tri ân](https://drive.google.com/file/d/1kblUcj2NSYARVizrT9QkvEhwkvPUKXnx/view?usp=drive_link)

[Demo sửa css lần 1](https://drive.google.com/file/d/1bBuVVzj4lEvbddVgb6WrbMl5ra6_LdW3/view?usp=drive_link)

[Demo test api vui vẻ](https://drive.google.com/file/d/1uFWvB8lY5P_8K86eaEQhOpTBB7cuZLp-/view?usp=drive_link)

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




