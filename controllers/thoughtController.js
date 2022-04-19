const { User, Thought } = require('../models');

const thoughtController = {
  //get all thoughts
  getAllThoughts: async (req, res) => {
    await Thought.find()
      .then((thoughtDb) => res.json(thoughtDb))
      .catch((error) => res.status(500).json(error));
  },

  //get single thought
  getSingleThought: async (req, res) => {
    await Thought.findById(req.params.id)
      .then((thoughtDb) => {
        !thoughtDb
          ? res.status(404).json({ message: 'No thought found with this id' })
          : res.json(thoughtDb);
      })
      .catch((error) => res.status(500).json(error));
  },

  //create thought
  createThought: async (req, res) => {
    await Thought.create(req.body)
      .then(async (newThought) => {
        await User.findOneAndUpdate(
          { _id: req.body.userId },
          { $addToSet: { thoughts: newThought._id } },
          { new: true }
        );
      })
      .then((thoughtDb) => {
        !thoughtDb
          ? res.status(404).json({
              message: 'Thought was created but no user was found with this id',
            })
          : res.json(newThought);
      })
      .catch((error) => res.status(500).json(error));
  },

  // update thought
  updateThought: async (req, res) => {
    await Thought.findOneAndUpdate(
      { _id: req.params.id },
      { $set: req.body },
      { runValidators: true, new: true }
    )
      .then((thoughtDb) => {
        !thoughtDb
          ? res.status(404).json({ message: 'No thought found with this id' })
          : res.json(thoughtDb);
      })
      .catch((error) => res.status(500).json(error));
  },

  // delete thought
  deleteThought: async (req, res) => {
    await Thought.findOneAndRemove({ _id: req.params.id })
      .then((thoughtDb) => {
        if (!thoughtDb) {
          res.status(404).json({ message: 'No thought found with this id' });
        }
        if (thoughtDb) {
          User.findOneAndUpdate(
            { _id: thoughtDb.userId },
            { $pull: { thoughts: req.params.id } },
            { new: true }
          ).then(res.json({ message: 'Thought has been deleted' }));
        }
      })
      .catch((error) => res.status(500).json(error));
  },

  // add thought reaction
  addThoughtReaction: async (req, res) => {
    await Thought.findOneAndUpdate(
      { _id: req.params.id },
      { $addToSet: { reactions: req.body } },
      { runValidators: true, new: true }
    )
      .then((thoughtDb) => {
        !thoughtDb
          ? res.status(404).json({ message: 'No thought found with this id!' })
          : res.json(thoughtDb);
      })
      .catch((error) => res.status(500).json(error));
  },

  //delete thought reaction
  deleteThoughtReaction: async (req, res) => {
    await Thought.findOneAndUpdate(
      { _id: req.params.id },
      { $pull: { reactions: { _id: req.params.reactionId } } },
      { runValidators: true, new: true }
    )
      .then((thoughtDb) => {
        !thoughtDb
          ? res.status(404).json({ message: 'No thought found with this id!' })
          : res.json(thoughtDb);
      })
      .catch((error) => res.status(500).json(error));
  },
};

module.exports = thoughtController;
