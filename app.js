const express = require('express')
const bodyParser = require('body-parser');
const app = express()
const port = 4761

app.use(bodyParser.json());

let students = []

app.get('/students', (req, res) => {
  const search = req.query.search

  if (search) {
    console.log('GET /students?search=' + search)
    res.send(students.filter(student => student.name.includes(search)))
  } else {
    console.log('GET /students')
    res.send(students)
  }
})

app.get('/students/:studentId', (req, res) => {
  const studentId = parseInt(req.params.studentId, 10)

  console.log('GET /students/' + studentId)

  if (studentId >= students.length) {
    res.status(404).send({msg: 'student not found'})
  }

  res.send(student=students[studentId])
})

app.get('/grades/:studentId', (req, res) => {
  const studentId = parseInt(req.params.studentId, 10)

  console.log('GET /grades/' + studentId)
  
  if (studentId >= students.length) {
    res.status(404).send({msg: 'student not found'})
  } else {
    res.send(students[studentId].grades)
  }
})

app.post('/grades', (req, res, next) => {
  const studentId = parseInt(req.body.studentId, 10)
  const grade = parseInt(req.body.grade, 10)

  console.log('POST /grades {studentId:' + studentId + ', grade:' + grade + '}')

  if (!Number.isInteger(studentId) || !Number.isInteger(grade)) {
    res.status(400).send({success:false, msg:'studentId or grade not defined'})
  } else if (studentId >= students.length) {
    res.status(404).send({success:false, msg:'student not found'})
  } else {
    students[studentId].grades.push(grade)
    res.send({success:true})
  }
})

app.post('/register', (req, res, next) => {
  const name = req.body.name

  console.log('post /register {name:' + name + '}')

  if (!name) {
    res.status(404).send({success:false, msg: 'name not defined'})
  }

  let student = {}
  student.name = name
  student.grades = []
  students.push(student)

  res.send({success:true})
})

app.listen(port, () => console.log(`app listening at http://localhost:${port}`))

