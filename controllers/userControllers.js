const User = require('../models/User');


// Follow or unfollow a user
const toggleFollow = async (req, resp) => {
  try {
    const userId = req.user.id;
    const targetUserId = req.params.id;

    if (userId === targetUserId) {
      return resp.status(400).json({ message: "You can't follow yourself" });
    }

    const user = await User.findById(userId);
    const targetUser = await User.findById(targetUserId);

    if (!targetUser) return resp.status(404).json({ message: "User not found" });

    const isFollowing = user.following.includes(targetUserId);

    if (isFollowing) {
      user.following.pull(targetUserId);
      targetUser.followers.pull(userId);
    } else {
      user.following.push(targetUserId);
      targetUser.followers.push(userId);
    }

    await user.save();
    await targetUser.save();

    resp.status(200).json({ message: isFollowing ? "Unfollowed" : "Followed" });
  } catch (err) {
    resp.status(500).json({ message:err.message || 'Something went wrong' });
  }
};

module.exports =  toggleFollow;

