let Notification = require('../models/notification')
let User = require('../models/user')

const invalidRequest = { msg: 'Invalid Request' }
const notFound = { msg: 'Not Found' }

const Validator = require('validatorjs')

exports.add = async function (req, res) {
  // validate body
  let validator = new Validator(req.body, {
    text: 'required',
    show_btn: 'required',
    from: 'required',
    to: 'required',
  })
  let result = await validator.check()
  if (!result) {
    res.status(400).json(invalidRequest)
    return
  }
  req.body.removed = false
  let notification = new Notification(req.body)
  notification = await notification.save()
  result = await Notification.findById(notification._id).populate('from').populate('to').select('-__v')
  res.json(result)
}

exports.remove = async function (req, res) {
  if (!req.params.id) {
    res.status(400).json(invalidRequest)
    return
  }
  try {
    let result = await Notification.findById(req.params.id).select('-__v')
    console.log(result)
    if (result) {
      result.removed = true;
      result = await result.save()
      res.json(result)
    } else {
      res.status(404).json(notFound)
    }
  } catch (e) {
    res.status(400).json(invalidRequest)
  }
}

exports.getList = async function (req, res) {
  if (!req.params.id) {
    res.status(400).json(invalidRequest)
    return
  }
  try {
    let result = await Notification
        .find({to:req.params.id, removed: false})
        .populate('from')
        .populate('to')
        .select('-__v')

    result = result.reverse();
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
