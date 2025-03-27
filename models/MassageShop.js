const mongoose = require('mongoose');

const MassageShopSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name'],
        unique: true,
        trim: true,
        maxlength: [50, 'Name can not be more than 50 characters']
    },
    address: {
        type: String,
        required: [true, 'Please add an address']
    },
    district: {
        type: String,
        required: [true, 'Please add a district']
    },
    province: {
        type: String,
        required: [true, 'Please add a province']
    },
    postalcode: {
        type: String,
        required: [true, 'Please add a postal code'],
        match: [
            /^[1-9]{1}[0-9]{4}$/,
            'Please add a valid postal code'
        ]
    },
    tel: {
        type: String,
        required: [true, 'Please add a telephone number'],
        match: [
            /^0([23457]{1}|[689]{1}[\d]{1})[-]?[\d]{3}[-]?[\d]{4}$/,
            'Please add a valid telephone number'
        ]
    },
    openTime: {
        type: String,
        required: [true, 'Please add an opening time']
    },
    closeTime: {
        type: String,
        required: [true, 'Please add a closing time']
    },
    isActive: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('MassageShop', MassageShopSchema);