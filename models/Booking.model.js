const { Schema, model } = require('mongoose');

const bookingSchema = new Schema(
    {
        name: {
            type: String,
            required: [true, "Name is required."],
          }
    }
)