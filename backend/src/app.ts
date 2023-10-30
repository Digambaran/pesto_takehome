

import * as express from 'express'

import addUser from './routes/users.addUser'

import addTodo from './routes/todos.addTodo';
// import deleteTodo from 'routes/todos.deleteTodo';
// import listTodos from 'routes/todos.listTodos';
// import updateTodo from 'routes/todos.updateTodo';

const app = express()


app.use(express.json())

app.use("/users", addUser)

app.use("/todos", addTodo)
// app.use("/todos", updateTodo)
// app.use("/todos", listTodos)
// app.use("/todos", deleteTodo)



export default app
// add todo
// update todo
// delete todo
// list todo - based on user
// default is guest user


