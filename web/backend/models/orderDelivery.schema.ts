import mongoose, { mongo } from 'mongoose'
import { boolean, date } from 'zod'

// we are going to deal with order delivery 

const orderDeriverySchema = new mongoose.Schema({
    orderID:{
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Order',
        required: true,
        unique: true
    },
    delivered:{
        type: Boolean,
        required: false
    },
    deliveredAt:{
        type: Date,
        required: true,
        unique: false,
        default: new Date()
    }
    
})

const OrderDelivery = mongoose.model('OrderDelivery',orderDeriverySchema)
export default OrderDelivery;