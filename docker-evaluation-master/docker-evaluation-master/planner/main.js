require('dotenv').config()
const fetch = require('node-fetch')
const express = require('express')

const port = process.env.PORT || 3000
const nbTasks = parseInt(process.env.TASKS) || 20


const randInt = (min, max) => Math.floor(Math.random() * (max - min)) + min
const taskType = () => (randInt(0, 2) ? 'mult' : 'add')
const args = () => ({ a: randInt(0, 40), b: randInt(0, 40) })

const generateTasks = (i) =>
  new Array(i).fill(1).map((_) => ({ type: taskType(), args: args() }))

let workers = [
   { url: 'http://localhost:8080', id: '0' }, {url : 'http://localhost:8081'},  {url : 'http://localhost:8082'},  {url : 'http://localhost:8083'}
]

const app = express()
app.use(express.json())
app.use(
  express.urlencoded({
    extended: true,
  })
)

app.get('/', (req, res) => {
  res.send(JSON.stringify(workers))
})

/*
    un worker peut s'abonner dans la liste du planner 
*/
app.post('/register', (req, res) => {
  const { url, id } = req.body
  console.log(`Register: adding ${url} worker: ${id}`)
  workers.push({ url, id })  //ajouté 
  res.send('ok')
})

let tasks = generateTasks(nbTasks)
let taskToDo = nbTasks

const wait = (mili) =>
  new Promise((resolve, reject) => setTimeout(resolve, mili))

const sendTask = async (worker, task) => {
  console.log(`=> ${worker.url}/${task.type}`, task)  // on affiche l'envoi 
  workers = workers.filter((w) => w.id !== worker.id) // on enleve le worker  car il n'est plus disponible 
  tasks = tasks.filter((t) => t !== task)     //on enleve cette tache 
  const request = fetch(`${worker.url}/${task.type}`, { // on fait realement l'envoi 
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',  //les données envoyées sont des objets JSON
    },
    body: JSON.stringify(task.args),      // ici l'argument envoyées 
  })
    .then((res) => {
      workers = [...workers, worker] // on rajoute  le worker car il est maintenant disponible 
      return res.json()
    })
    .then((res) => {
      taskToDo -= 1 // une tache realisé donc on duminue le nombre de tache à realiser 
      console.log('---')
      console.log(nbTasks - taskToDo, '/', nbTasks, ':')
      console.log(task, 'has res', res)
      console.log('---')
      return res
    })
    .catch((err) => {
      console.error(task, ' failed', err.message)
      tasks = [...tasks, task]
    })
}

const main = async () => {
  console.log(tasks)
  while (taskToDo > 0) {
    await wait(100)
    if (workers.length === 0 || tasks.length === 0) continue  // si on a pas de tache ou aucun worker n'est dipo => continue 
    sendTask(workers[0], tasks[0]) //choisir le premier worker dispo avec la premiere tache dans la liste 
  }
  console.log('end of tasks')
  server.close()
}

const server = app.listen(port, () => {
  console.log(`Register listening at http://localhost:${port}`)
  console.log('starting tasks...')
  main()
})
