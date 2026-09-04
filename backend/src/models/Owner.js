import mongoose from "mongoose";

// the uuid itself is the _id, so mongo's built-in unique index on _id
// is what guarantees no two devices ever share an owner id
const ownerSchema = new mongoose.Schema({ _id: String }, { timestamps: true });

const Owner = mongoose.model("Owner", ownerSchema);

export default Owner;
