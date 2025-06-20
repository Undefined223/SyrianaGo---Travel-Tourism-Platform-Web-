const mongoose = require("mongoose");
const Schema = mongoose.Schema;




const categorySchema = new Schema({
    name: {
        en: { type: String, required: true },
        fr: { type: String, required: true },
        ar: { type: String, required: true }
    },
    slug: {
        en: { type: String, required: true },
        fr: { type: String, required: true },
        ar: { type: String, required: true }
    },
    icon: { type: String, required: true },
    subCategory: [{ type: Schema.Types.ObjectId, ref: 'SubCategory' }]
});
const Category = mongoose.model('Category', categorySchema);
module.exports = Category