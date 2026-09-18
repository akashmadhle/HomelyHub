import slugify from "slugify";
import mongoose from "mongoose";

const propertySchema = new mongoose.Schema({
    propertyName:{
        type: String,
        required: [true, "Please Enter Your Property NAme"],
    },
    description: {
        type: String,
        required: [true, "Please Add Information about your Property"]
    },
    extraInfo: {
        type: String,
        default: "No Extra Information"
    },
    propertyType: {
        type: String,
        enum: ["House", "Apartment", "Villa", "Land" , "Hotel"],
        default: "House"
    },
    roomType: {
        type: String,
        enum: ["Single Room", "Double Room", "Shared Room", "Entire Home"],
        default: "Single Room"
    },
    maximumGuest: {
        type: Number,
        required: [true, "Please Enter MAximum Number of Guests that can Occupy"]
    },
    amenities: [
        {
             name: {
                type: String,
                required: true,
                enum: [
                    "Wi-Fi",
                    "Air Conditioning",
                    "Kitchen",
                    "Heating",
                    "Washer",
                    "Dryer",
                    "Free Parking on Premises",
                    "TV",
                    "Iron",
                    "Hair Dryer",
                    "Pool"
                ]
            },
            icon: {
                type: String,
                required: true
            }

        }
    ],
    images: {
        type: [
            {
                public_id: {
                    tyepe: String
                },
                url: {
                    type: String,
                    required: true
                }
            }
        ],
        validate: {
            validator: function(arr){
                return arr.length >=6;
            },
            message: "The images must contain atleast 6 images"

        }
    },
    price: {
        type: Number,
        required: [true, "Please Enter the Price of Per Night"],
        default:1500
    },
    address: {
        area:String,
        city:String,
        state:String,
        pincode:Number
    },
    
    currentBookings: [
        {
            bookingId:{
                type: mongoose.Schema.Types.ObjectId,
                ref: "Booking"
            },
            fromDate:{
                type:Date
            },
            toDate:{
                type:Date
            },
            userId:{
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            }
        }

    ],

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },

    slug:String,
    checkInTime: {type:String,default:"11:00"},
    checkOutTime: {type:String,default:"13:00"}
    
})

propertySchema.pre("save", function(){
    this.slug =slugify(this.propertyName,{lower:true});
    
})

propertySchema.pre("save", function(){
    this.address.city = this.address.city.toLowerCase().replaceAll(" ","")
    
})

// const Property = mongoose.model("Property", propertySchema);
const Property = mongoose.models.Property || mongoose.model("Property", propertySchema);


export{Property};
