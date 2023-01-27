
docker run -p 8080:8080 -e SPECIALITE=1 worker
docker run -p 8081:8081  -e SPECIALITE=2 worker
docker run -p 8081:8081  -e SPECIALITE=1 worker
docker run -p 8082:8082  -e SPECIALITE=2 worker
docker run -p 3000:8080 planner

