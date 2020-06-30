// Service endpoints:
//
//  GET student - returns a list of all students
//  GET students/:studentId - returns details of a specific student by student id
//  GET student?search= - returns a list of students filtered on name matching the given query
//  GET grades/:studentId - returns all grades for a given student by student id
//  POST grade - records a new grade, returns success status in JSON response and stores the new grade in the database
//  POST register - creates a new user, returns success status in JSON response and stores the new user in the database

const express = require('express')
const bodyParser = require('body-parser');
const app = express()
const port = 4761

app.use(bodyParser.json());

const Pool = require('pg').Pool
const pool = new Pool({
  user: 'pgdb',
  host: 'localhost',
  database: 'pgdb',
  password: '123',
  port: 5432,
})

let students = []

app.get('/students', (req, res) => {
  const search = req.query.search

  if (search) {
    console.log('GET /students?search=' + search)
    
    pool.query('SELECT * FROM student WHERE LOWER(name) LIKE LOWER($1)', ['%' + search + '%'], (error, results) => {
      if (error) {
        throw error
      }
      res.status(200).json(results.rows)
    })
  } else {
    console.log('GET /students')

    pool.query('SELECT * FROM student ORDER BY student_id ASC', (error, results) => {
      if (error) {
        throw error
      }
      res.status(200).json(results.rows)
    })
  }
})

app.get('/students/:studentId', (req, res) => {
  const studentId = parseInt(req.params.studentId, 10)

  console.log('GET /students/' + studentId)

  pool.query('SELECT * FROM student WHERE student_id = $1', [studentId], (error, results) => {
    if (error) {
      throw error
    }
    res.status(200).json(results.rows)
  })
})

app.get('/grades/:studentId', (req, res) => {
  const studentId = parseInt(req.params.studentId, 10)

  console.log('GET /grades/' + studentId)

  pool.query('SELECT * FROM grade WHERE student_id = $1', [studentId], (error, results) => {
    if (error) {
      throw error
    }
    res.status(200).json(results.rows)
  })
})

app.post('/grades', (req, res) => {
  const studentId = parseInt(req.body.studentId, 10)
  const grade = parseInt(req.body.grade, 10)

  console.log('POST /grades {studentId:' + studentId + ', grade:' + grade + '}')

  if (!Number.isInteger(studentId) || !Number.isInteger(grade)) {
    res.status(400).send({success:false, msg:'studentId or grade not defined'})
  } else {
    pool.query('INSERT INTO grade (student_id, grade) VALUES($1, $2)', [studentId, grade], (error, results) => {
      if (error) {
        throw error
      }
      res.send({success:true})
    })
  }
})

app.post('/register', (req, res) => {
  const name = req.body.name

  console.log('post /register {name:' + name + '}')

  if (!name) {
    res.status(404).send({success:false, msg: 'name not defined'})
  }

  pool.query('INSERT INTO student (name) VALUES($1)', [name], (error, results) => {
    if (error) {
      throw error
    }
    res.send({success:true})
  })
})

app.listen(port, () => console.log(`app listening at http://localhost:${port}`))

