for i in {1..10}
do
  docker run -p 808{$i}:808{$i} worker
done
for i in {1..10}
do
  docker run -p 303{$i}:303{$i} -e SPECIALITE=2 worker
done

for i in {1..10}
do
  docker run -p 304{$i}:304{$i}  -e SPECIALITE=1 worker
done
docker run -p 3000:3000 planner

