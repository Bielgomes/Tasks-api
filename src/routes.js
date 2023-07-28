import { randomUUID } from 'node:crypto' 
import { Database } from './database.js'
import { buildRoutePath } from './utils/build-route-path.js'

const database = new Database()

export const routes = [
  {
    method: 'POST',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const { title, description } = req.body

      const task = {
        id: randomUUID(),
        title: title,
        description: description,
        completed_at: null,
        created_at: new Date(),
        updated_at: new Date()
      }

      database.insert('tasks', task)

      return res.writeHead(201).end('Criando uma tarefa')
    }
  },
  {
    method: 'GET',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const tasks = database.select('tasks')

      return res.end(JSON.stringify(tasks))
    }
  },
  {
    method: 'PUT',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params
      const { title, description } = req.body

      const task = database.select('tasks', { id })

      if (task.length === 0) {
        return res.writeHead(404).end('Task not found')
      } else {
        const updatedTask = {
          ...task,
          title: title,
          description: description,
          updated_at: new Date()
        }

        database.update('tasks', id, updatedTask)

        return res.end(JSON.stringify(updatedTask))
      }
    }
  },
  {
    method: 'DELETE',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params

      database.delete('tasks', id)

      return res.writeHead(204).end()
    }
  },
  {
    method: 'PATCH',
    path: buildRoutePath('/tasks/:id/complete'),
    handler: (req, res) => {
      const { id } = req.params

      const task = database.select('tasks', { id })

      if (task.length === 0) {
        return res.writeHead(404).end('Task not found')
      }

      if (!task[0].completed_at) {
        database.update('tasks', id, {
          title: task[0].title,
          description: task[0].description,
          completed_at: new Date(),
          created_at: task[0].created_at,
          updated_at: new Date()
        })

        return res.end('Tarefa completa')
      }

      return res.end('Tarefa já está completa')
    }
  }
]