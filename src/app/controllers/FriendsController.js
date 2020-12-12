import User from '../models/User';
import Friends from '../models/Friends';
import mongoose from 'mongoose';

class FriendsController {
	async index(req, res) {
		const userId = req.userId;
		try {
			const user = await User.find({ id: userId });
			console.log(mongoose.Types.ObjectId(user._id))
			const teste = await User.aggregate([
				{
					"$lookup": {
						"from": Friends.collection.name,
						"let": { "friends": "$friends" },
						"pipeline": [
							{
								"$match": {
									"recipient": mongoose.Types.ObjectId(user._id),
									"$expr": { "$in": ["$_id", "$$friends"] }
								}
							},
							{ "$project": { "status": 1 } }
						],
						"as": "friends"
					}
				},
				{
					"$addFields": {
						"friendsStatus": {
							"$ifNull": [{ "$min": "$friends.status" }, 0]
						}
					}
				}
			])

			return res.status(200).json(teste);
		} catch (error) {
			return res.status(500).json({ error });
		}
	}

	async store(req, res) {
		const friendId = Number(req.params.friendId);
		const userId = req.userId;

		try {
			const userRequester = await User.findOne({ id: userId });
			const userRecipient = await User.findOne({ id: { $eq: friendId, $ne: userId } });

			if (!userRequester || !userRecipient)
				return res.status(422).json({ error: { generic: 'User not found' } });

			const friendsRequester = await Friends.findOneAndUpdate(
				{ requester: userRequester, recipient: userRecipient },
				{ $set: { status: 1 } },
				{ upsert: true, new: true }
			);
			const friendsRecipient = await Friends.findOneAndUpdate(
				{ recipient: userRequester, requester: userRecipient },
				{ $set: { status: 2 } },
				{ upsert: true, new: true }
			);
			const updateUserRequester = await User.findOneAndUpdate(
				{ _id: userRequester },
				{ $push: { friends: friendsRequester._id } }
			);
			const updateUserRecipient = await User.findOneAndUpdate(
				{ _id: userRecipient },
				{ $push: { friends: friendsRecipient._id } }
			);

			return res.status(200).json(userRecipient);
		} catch (error) {
			return res.status(500).json({ error });
		}
	}

	async update(req, res) {
		const friendId = Number(req.params.friendId);
		const userId = req.userId;
		const { acceptes } = req.body;

		try {
			const userRequester = await User.findOne({ id: friendId });
			const userRecipient = await User.findOne({ id: userId });

			if (!userRequester || !userRecipient)
				return res.status(422).json({ error: { generic: 'User not found' } });

			if (acceptes) {
				Friends.findOneAndUpdate(
					{ requester: userRequester, recipient: userRecipient },
					{ $set: { status: 3 } }
				);


				Friends.findOneAndUpdate(
					{ recipient: userRequester, requester: userRecipient },
					{ $set: { status: 3 } }
				);
			} else {
				const docA = await Friends.findOneAndRemove(
					{
						requester: userRequester,
						recipient: userRecipient
					},
					{ new: true }
				);
				const docB = await Friends.findOneAndRemove(
					{
						recipient: userRequester,
						requester: userRecipient
					},
					{ new: true }
				);

				await User.findOneAndUpdate({ _id: userRequester }, { $pull: { friends: docA._id } });
				await User.findOneAndUpdate({ _id: userRecipient }, { $pull: { friends: docB._id } });
			}

			return res.status(204).json();
		} catch (error) {
			return res.status(500).json({ error });
		}
	}
}

export default new FriendsController();
