import { User } from '../models';
import { Op } from 'sequelize';


class UserController {
	async index(req, res) {
		const searchText = req.query.search ?? '';
		const offset = req.query.offset ?? 0;
		const limit = 10;
		const userId = req.userId;

		try {
			const users = await User.findAll({
        where: {
          [Op.and]: [{
            id: { [Op.ne]: userId },
          },{
            [Op.or]: [{
              username: { [Op.iLike]: `%${searchText}%` }
            }, {
              email: { [Op.iLike]: `%${searchText}%` }
            }]
          }]
        },
        offset: offset * limit,
        limit: limit,
        order: [['username', 'ASC']]
      });

			return res.status(200).json(users);
		} catch (error) {
			return res.status(500).json({ error });
		}
	}

	async store(req, res) {
		try {
      const user = await User.create(req.body);

			return res.status(201).json({
        id: user.id,
        username: user.username,
        email: user.email,
        updatedAt: user.updatedAt,
        createdAt: user.createdAt
      });
		} catch (error) {
			return res.status(500).json({ error });
		}
	}

	async update(req, res) {
		const { id } = req.params;
    const { email, username } = req.body;

		if (req.userId !== Number(id))
			return res.status(403).json({ error: { generic: 'Unauthorized request' } });

		try {
      const userToUpdate = await User.update({ username, email }, {
        where: { id: id },
        returning: true,
        plain: true
      });

			if (!userToUpdate)
				return res.status(422).json({ error: { generic: 'User not found' } });

			return res.status(200).json({
        id: userToUpdate[1].dataValues.id,
        username: userToUpdate[1].dataValues.username,
        email: userToUpdate[1].dataValues.email,
        updatedAt: userToUpdate[1].dataValues.updatedAt,
        createdAt: userToUpdate[1].dataValues.createdAt
      });
		} catch (error) {
			return res.status(500).json({ error });
		}
	}

	async delete(req, res) {
		const { id } = req.params;

		if (req.userId !== Number(id))
			return res.status(403).json({ error: { generic: 'Unauthorized request' } });

		try {
      const userToDelete = await User.destroy({
        where: { id: id }
      });

			if (!userToDelete)
				return res.status(422).json({ error: { generic: 'User not found' } });

			return res.status(204).json();
		} catch (error) {
			return res.status(500).json({ error });
		}
	}
}

export default new UserController();
