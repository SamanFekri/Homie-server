let User = require('../models/user')

const invalidRequest = { msg: 'Invalid Request' }
const notFound = { msg: 'Not Found' }

const Validator = require('validatorjs')

exports.add = async function (req, res) {
  // validate body
  console.log(req.body.name);
  console.log(req.body.email);
  console.log(req.body.password);
  console.log("=================");
  let validator = new Validator(req.body, {
    name: 'required',
    password: 'required',
    email: 'required|email',
  })
  let result = await validator.check()
  if (!result) {
    res.status(400).json(invalidRequest)
    return
  }

  // validate file exist
  console.log(req.files[0])
  for (let i = 0; i < req.files.length; i++) {
    if (req.files[i].fieldname === 'photo') {
      req.body.photo = req.files[i].path
      break
    }
  }

  result = await User.findOne({'email': req.body.email});
  let ans = {}
  if(result) {
    ans = {msg: "This email exists in the system"}
    ans = Object.assign(ans, result._doc)
    res.status(400).json(ans)
    return;
  }
  let user = new User(req.body)
  user = await user.save()
  console.log("salam " + user)
  result = await User.findById(user._id).select('-__v')
  res.json(result)
}

exports.update = async function (req, res) {
  let ans = {}
  console.log(req.body.name);
  console.log(req.body.email);
  console.log(req.body.token);
  console.log(req.body.city);
  console.log(req.body.phone);
  console.log("------------------")
  // validate body
  let validator = new Validator(req.body, {
    token:'required',
  })
  let result = await validator.check()
  if (!result) {
    res.status(400).json(invalidRequest)
    return
  }
  req.body._id = req.body.token

  // validate file exist
  console.log(req.files[0])
  for (let i = 0; i < req.files.length; i++) {
    if (req.files[i].fieldname === 'photo') {
      req.body.photo = req.files[i].path
      break
    }
  }

  result = await User.findById(req.body._id).select('-__v')
  if(!result) {
    ans.msg = "User not found"
    ans._id = req.body._id
    res.status(404).json(ans)
    return
  }

  if(req.body.email && req.body.email !== result.email) {
    result = await User.findOne({'email': req.body.email});
    if(result) {
      ans = {msg: "This email exists in the system"}
      ans = Object.assign(ans, result._doc)
      res.status(400).json(ans)
      return;
    }
  }

  let user = Object.assign(result, req.body)
  user = await user.save()
  res.json(user)
}

exports.login = async function (req, res) {
  let ans = {}
  // validate body
  let validator = new Validator(req.body, {
    email:'required|email',
    password:'required',
  })
  let result = await validator.check()
  if (!result) {
    res.status(400).json(invalidRequest)
    return
  }

  result = await User.findOne({email: req.body.email}).select('-__v')
  if(!result) {
    ans.msg = "Email not found"
    res.status(404).json(ans)
    return
  }

  if(result.password !== req.body.password) {
    ans.msg = "Password is incorrect"
    res.status(403).json(ans)
    return
  }

  ans.token = result._id;
  ans = Object.assign(ans, result._doc)
  res.json(ans)
}

exports.get = async function (req, res) {
  if (!req.params.id) {
    res.status(400).json(invalidRequest)
    return
  }
  try {
    let result = await User.findById(req.params.id).select('-__v')
    console.log(result)
    if (result) {
      res.json(result)
    } else {
      res.status(404).json(notFound)
    }
  } catch (e) {
    res.status(400).json(invalidRequest)
  }
}
