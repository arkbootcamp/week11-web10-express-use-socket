const messageModel = require('../models/message')
const helpers = require('../helpers/helpers') 
const moment = require('moment')
moment.locale('id')
const getMessageById =(req, res)=>{
  const idReceiver = req.params.idReceiver
  const idSender = req.idUser
  console.log('idReciver', idReceiver);
  console.log('idSender', idSender);
  messageModel.getMessageById(idSender, idReceiver)
  .then((result)=>{
    const dataMessage = result.map((item)=>{
      item.created_at = moment(item.created_at).format('LT')
      return item
    })
    helpers.response(res, dataMessage, 200)
  })
  .catch((err)=>{
    console.log(err);
  })
}

module.exports = {
  getMessageById
}