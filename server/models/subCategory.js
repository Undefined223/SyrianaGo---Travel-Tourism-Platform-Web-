const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const SubcategorySchema = new Schema({
   name: {
    en: { type: String, required: true },
    fr: { type: String, required: true },
    ar: { type: String, required: true }
  },
});


const SubCategory = mongoose.model('SubCategory', SubcategorySchema);
module.exports = SubCategory