const router = require('express').Router()

const userController = require('./controller/userController')
const notificationController = require('./controller/notificationController')
const homeController = require('./controller/homeController')

router.get('/api/', (req, res) => {
  res.send('Up and running')
})

router.post('/api/user/add', userController.add);
router.post('/api/user/update', userController.update);
router.post('/api/user/login', userController.login);
router.get('/api/user/:id', userController.get);

router.post('/api/notification/add', notificationController.add);
router.get('/api/notification/remove/:id', notificationController.remove);
router.get('/api/notification/user/:id', notificationController.getList);

router.post('/api/home/add', homeController.add);
router.post('/api/home/update', homeController.update);
router.get('/api/home/:id', homeController.getByHomeId);
router.get('/api/home/user/:id', homeController.getByUserId);
router.get('/api/home/all/:id', homeController.listAll);
router.get('/api/home/suggested/:id', homeController.listSuggested);

module.exports = router
