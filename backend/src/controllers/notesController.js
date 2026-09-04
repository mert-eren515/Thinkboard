import Note from "../models/Note.js";

// mongoose throws for a malformed id and for schema violations; both are the
// caller's mistake, so neither should come back as a 500
function respondWithError(error, res, label) {
  if (error.name === "CastError") {
    return res.status(404).json({ message: "Note not found" });
  }

  if (error.name === "ValidationError") {
    const [firstError] = Object.values(error.errors);
    return res.status(400).json({ message: firstError.message });
  }

  console.error(`Error in ${label} controller`, error);
  res.status(500).json({ message: "Internal server error" });
}

export async function getAllNotes(req, res) {
  try {
    const notes = await Note.find({ owner: req.ownerId }).sort({
      createdAt: -1, // -1 will sort in desc. order (newest first)
    });
    res.status(200).json(notes);
  } catch (error) {
    respondWithError(error, res, "getAllNotes");
  }
}

export async function getNoteById(req, res) {
  try {
    // owner is part of the query so nobody can read a note by guessing its id
    const note = await Note.findOne({
      _id: req.params.id,
      owner: req.ownerId,
    });
    if (!note) return res.status(404).json({ message: "Note not found!" });
    res.json(note);
  } catch (error) {
    respondWithError(error, res, "getNoteById");
  }
}

export async function createNote(req, res) {
  try {
    const { title, content } = req.body;
    const note = new Note({ title, content, owner: req.ownerId });

    const savedNote = await note.save();
    res.status(201).json(savedNote);
  } catch (error) {
    respondWithError(error, res, "createNote");
  }
}

export async function updateNote(req, res) {
  try {
    const { title, content } = req.body;
    const updatedNote = await Note.findOneAndUpdate(
      { _id: req.params.id, owner: req.ownerId },
      { title, content },
      {
        new: true,
        runValidators: true, // off by default, so updates would skip the schema
      },
    );

    if (!updatedNote)
      return res.status(404).json({ message: "Note not found" });

    res.status(200).json(updatedNote);
  } catch (error) {
    respondWithError(error, res, "updateNote");
  }
}

export async function deleteNote(req, res) {
  try {
    const deletedNote = await Note.findOneAndDelete({
      _id: req.params.id,
      owner: req.ownerId,
    });
    if (!deletedNote)
      return res.status(404).json({ message: "Note not found" });
    res.status(200).json({ message: "Note deleted successfully!" });
  } catch (error) {
    respondWithError(error, res, "deleteNote");
  }
}
