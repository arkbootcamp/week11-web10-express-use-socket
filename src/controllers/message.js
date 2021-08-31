const messageModel = require('../models/message')
const helpers = require('../helpers/helpers') 
const getMessageById =(req, res)=>{
  const idReceiver = req.params.idReceiver
  const idSender = req.idUser
  console.log('idReciver', idReceiver);
  console.log('idSender', idSender);
  messageModel.getMessageById(idSender, idReceiver)
  .then((result)=>{
    helpers.response(res, result, 200)
  })
  .catch((err)=>{
    console.log(err);
  })
}

module.exports = {
  getMessageById
}