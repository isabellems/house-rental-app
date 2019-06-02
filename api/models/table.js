var mongoose = require("mongoose"),
      Schema = mongoose.Schema,
      Mixed = Schema.Types.Mixed;


var matrixSchema = new Schema({
	vectors: { type: Mixed, default: [] }
});

module.exports = mongoose.model("Matrix", matrixSchema);