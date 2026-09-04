import mongoose from "mongoose";

// 1- create a schema
// 2- create a model based off of that schema

const noteSchema = new mongoose.Schema(
  {
    // the device id the note belongs to
    owner: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: 10000,
    },
  },
  { timestamps: true }, // createdAt, updatedAt
);

// covers both halves of the list query: filter by owner, sort by newest first
noteSchema.index({ owner: 1, createdAt: -1 });

const Note = mongoose.model("Note", noteSchema);

export default Note;
