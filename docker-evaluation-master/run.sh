for i in {1..10}
do
  docker run -p 808{$i}:808{$i} -e  worker
done
docker run -p 3000:3000 planner

