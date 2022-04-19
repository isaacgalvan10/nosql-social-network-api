const { User, Thought } = require('../models');

const userController = {
  //get all users
  getAllUsers: async (req, res) => {
    await User.find()
      .populate('thoughts')
      .populate('friends')
      .then((allUsers) => res.json(allUsers))
      .catch((error) => res.status(500).json(error));
  },

  //get one user
  getSingleUser: async (req, res) => {
    await User.findById(req.params.id)
      .populate('thoughts')
      .populate('friends')
      .then((singleUser) => res.json(singleUser))
      .catch((error) => res.status(500).json(error));
  },

  //create new user
  createUser: async (req, res) => {
    await User.create(req.body)
      .then((newUser) => res.json(newUser))
      .catch((error) => res.status(500).json(error));
  },

  //update user
  updateUser: async (req, res) => {
    await User.findOneAndUpdate(
      { _id: req.params.id },
      { $set: req.body },
      { runValidators: true, new: true }
    )
      .then((userDb) => {
        !userDb
          ? res.status(404).json({ message: 'No user found with this id' })
          : res.json(userDb);
      })
      .catch((error) => res.status(500).json(error));
  },

  //delete user
  deleteUser: async (req, res) => {
    await User.findOneAndDelete({ _id: req.params.id })
      .then((userDb) => {
        !userDb
          ? res.status(404).json({ message: 'No user found with this id' })
          : //delete all thoughts related to the user
            Thought.deleteMany({ _id: { $in: userDb.thoughts } }).then(
              res.json({ message: 'User and Thoughts have been deleted' })
            );
      })
      .catch((error) => res.status(500).json(error));
  },

  //add friend
  addFriend: async (req, res) => {
    await User.findOneAndUpdate(
      { _id: req.params.id },
      { $addToSet: { friends: req.params.friendId } },
      { runValidators: true, new: true }
    ).then((userDb) => {
      !userDb
        ? res.status(404).json({ message: 'No user found with this id' })
        : res.json(userDb);
    });
  },

  // delete friend
  deleteFriend: async (req, res) => {
    await User.findOneAndUpdate(
      { _id: req.params.id },
      { $pull: { friends: req.params.friendId } },
      { runValidators: true, new: true }
    )
      .then((userDb) => {
        !userDb
          ? res.status(404).json({ message: 'No user found with this id' })
          : res.json(userDb);
      })
      .catch((error) => res.status(500).json(error));
  },
};

module.exports = userController;
