let Home = require('../models/home')
let User = require('../models/user')

const invalidRequest = { msg: 'Invalid Request' }
const notFound = { msg: 'Not Found' }

const Validator = require('validatorjs')

exports.add = async function (req, res) {
  // validate body
  let validator = new Validator(req.body, {
    owner: 'required',
  })
  let result = await validator.check()
  if (!result) {
    res.status(400).json(invalidRequest)
    return
  }

  // validate file exist
  req.body.photos = []
  console.log(req.files[0])
  for (let i = 0; i < req.files.length; i++) {
    if (req.files[i].fieldname === 'photos') {
      req.body.photos.push(req.files[i].path)
    }
  }

  let home = new Home(req.body)
  home = await home.save()
  result = await Home.findById(home._id).populate('owner').select('-__v')
  res.json(result)
}

exports.update = async function (req, res) {
  // validate body
  let validator = new Validator(req.body, {
    token: 'required',
    _id: 'required',
  })
  let result = await validator.check()
  if (!result) {
    res.status(400).json(invalidRequest)
    return
  }

  // validate file exist
  if(req.files.length > 0) {
    req.body.photos = []
    console.log(req.files[0])
    for (let i = 0; i < req.files.length; i++) {
      if (req.files[i].fieldname === 'photos') {
        req.body.photos.push(req.files[i].path)
      }
    }
  }

  try {
    result = await Home.findById(req.body._id);
    if (!result) {
      res.status(404).json(notFound)
      return;
    }
    if(result.owner != req.body.token) {
      res.status(403).json({msg: "You have not access to change this Home"})
      return
    }
    let home = Object.assign(result, req.body)
    home = await home.save()
    result = await Home.findById(home._id).populate('owner').select('-__v')
    res.json(result)
  }catch (e){
    res.status(400).json({msg: "Something goes wrong"})
  }
}

exports.getByHomeId = async function (req, res) {
  if (!req.params.id) {
    res.status(400).json(invalidRequest)
    return
  }
  try {
    let result = await Home.findById(req.params.id).populate('owner').select('-__v')
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

exports.getByUserId = async function (req, res) {
  if (!req.params.id) {
    res.status(400).json(invalidRequest)
    return
  }
  try {
    let result = await Home.findOne({owner: req.params.id}).populate('owner').select('-__v')
    console.log(result)
    if (result) {
      res.json(result)
    } else {
      res.status(404).json({msg: "This user doesn't have a home"})
    }
  } catch (e) {
    res.status(400).json(invalidRequest)
  }
}

exports.listAll = async function (req, res) {
  if (!req.params.id) {
    res.status(400).json(invalidRequest)
    return
  }
  try {
    let result = await Home.find({owner: {"$ne": req.params.id}}).populate('owner').select('-__v')
    console.log(result)
    if (result) {
      res.json(result)
    } else {
      res.status(404).json({msg: "This user doesn't have a home"})
    }
  } catch (e) {
    res.status(400).json(invalidRequest)
  }
}

exports.listSuggested = async function (req, res) {
  if (!req.params.id) {
    res.status(400).json(invalidRequest)
    return
  }
  try {
    let result = await Home.find({owner: {"$ne": req.params.id}}).populate('owner').select('-__v')
    console.log(result)
    if (result) {
      let ans = []
      for(let i = 0; i < result.length; i++) {
        ans.push(result[i])
      }
      ans =ans.slice(0, 10)

      shuffleArray(ans)
      res.json(ans)
    } else {
      res.status(404).json({msg: "This user doesn't have a home"})
    }
  } catch (e) {
    res.status(400).json({msg: "Something goes wrong"})
  }
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}
//
// exports.getList = async function (req, res) {
//   if (!req.params.id) {
//     res.status(400).json(invalidRequest)
//     return
//   }
//   try {
//     let result = await Notification.find({to:req.params.id}).select('-__v')
//     result = result.reverse();
//     console.log(result)
//     if (result) {
//       res.json(result)
//     } else {
//       res.status(404).json(notFound)
//     }
//   } catch (e) {
//     res.status(400).json(invalidRequest)
//   }
// }
