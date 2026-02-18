const transcationModel = require('../models/transcation.model');
const ledgerModel = require('../models/ledger.model');
const accountModel = require('../models/account.model');
const emailService = require('../config/services/email.service');
const mongoose = require('mongoose');

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

if(balance < amount){
  return res.status(400).json({
    message: `Insufficient balance in from account. Current balance: ${balance}, Required: ${amount}`
  })  

}



const session = await mongoose.startSession()
session.startTransaction();


const transaction = await transcationModel.create({
  fromAccount,
  toAccount,
  amount,
  idempotencyKey,
  status: "PENDING"
}, { session })

const debitLedgerEntry = await ledgerModel.create({
  account: fromAccount,
   amount: amount,
   transcation: transaction._id,
   type: "DEBIT"
}, { session })

const creditLedgerEntry = await ledgerModel.create({
  account: toAccount,
   amount: amount,
   transcation: transaction._id,
   type: "CREDIT"
}, { session })


transaction.status === "COMPLETED"
await transaction.save({ session })


await session.commitTransaction()
session.endSession()



await emailService.sendTranscationEmail(req.user.email, req.user.name, amount, toUserAccount._id)
      return res.status(201).json({
        message: "Transcation successful",
        transaction: transaction
      })

}

async function createInitialFundsTransaction(req,res){
  const { toAccount, amount, idempotencyKey } = req.body;
   if(!toAccount || !amount || !idempotencyKey){
    return res.status(400).json({
      message: "All are required feilds"
    })
   }

    const toUserAccount = await accountModel.findOne({
       _id: toAccount
    })
   if (!toUserAccount){
        return res.status(400).json({
          message: "Invalid toUserAccount"
        })
    }

    const fromUserAccount = await accountModel.findOne({
      
      user: req.user._id
    })

    if(!fromUserAccount){
      return res.status(400).json({
        message: "System user account not found"
      })
    }

    const session = await mongoose.startSession()
    session.startTransaction()
    
    const transcation = new transcationModel({
      fromAccount: fromUserAccount._id,
      toAccount,
      amount,
      idempotencyKey,
      status: "PENDING",

    })

    const debitLedgerEntry = await ledgerModel.create([{
  account: fromUserAccount._id,
   amount: amount,
   transcation: transcation._id,
   type: "DEBIT"
}], { session })


 const creditLedgerEntry = await ledgerModel.create([{
  account: toUserAccount._id,
   amount: amount,
   transcation: transcation._id,
   type: "CREDIT"
}], { session })


transcation.status === "COMPLETED"
await transcation.save({ session });

await session.commitTransaction()
await session.endSession()

return res.status(201).json({
  message: "Initial funds transaction completed successfully",
  transcation: transcation,
})





  }


module.exports = {
  createTranscation,
  createInitialFundsTransaction
}



