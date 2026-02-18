const transcationModel = require('../models/transcation.model');
const ledgerModel = require('../models/ledger.model');
const accountModel = require('../models/account.model');
const emailService = require('../config/services/email.service');


async function createTranscation(req,res){
  const { fromAccount, toAccount, amount, idempotencyKey } = req.body;

  if(!fromAccount || !toAccount || !amount || !idempotencyKey){
    return res.status(400).json({message: "All fields are required"});
  }

const fromUserAccount = await accountModel.findOne({ 
  _id: fromAccount
})

const toUserAccount = await accountModel.findOne({
  _id: toAccount
})

if(!fromUserAccount || !toUserAccount){
  return res.status(400).json({
    message: "Invalid fromaccount or toaccount"
  })
}

const isAlreadyTranscatonExists = await transcationModel.findOne({
  idempotencyKey: idempotencyKey
})

if(isAlreadyTranscatonExists){
  if(isAlreadyTranscatonExists.status==="COMPLETED"){
    return res.status(200).json({
      message: "Transcation already processed",
      transaction: isAlreadyTranscatonExists
    })
  }

  if(isAlreadyTranscatonExists.status === "PENDING"){
    return res.status(200).json({
      message: "Transcation is still processing",

    })
  }

  if(isAlreadyTranscatonExists.status === "FAILED"){
    return res.status(500).json({
      message: "Transaction processing failed, please retry"
    })
  }

  if(isAlreadyTranscatonExists.status === "REVERSED"){
     return res.status(500).json({
      message: "Transaction was reversed, please retry"
     })
  }
}


if(fromUserAccount.status !== "ACTIVE" || toUserAccount.status !== "ACTIVE"){
  return res.status(400).json({
      message: "Both fromAccount and toAccount must be active"
  })
}


const balance = await fromUserAccount.getBalance()

}