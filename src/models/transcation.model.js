const mongoose = require("mongoose");

const transcationSchema = new mongoose.Schema({
    fromAccount: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "account",
      required: [true, "Transcation must be associated with a from account"],
      index: true
    },
    toAccount: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "account",
      required: [true, "Transcation must be associated with a to account"],
      index: true
    },
    status: {
      type: String,
      enum: {
        values: ["PENDING", "COMPLETE", "FAILED", "REVERSED"],
        message: "Status can be either PENDING,COMPLETE,FAILED Or REVERSED"
      },
      default: "PENDING"
    },
    amount: {
      type: Number,
      required: [true, "Amount is required for creating an account"],
      min: [0,"Transcation  amount cant be negative"]
    },
    idempotencyKey: {
      type: String,
      required: [true, "Idempotency key is required for transcation"],
      index: true,
      unique: true
    }
},{
  timestamps: true
})

const transcationModel = mongoose.model("transcation", transcationSchema)

module.exports = transcationModel;