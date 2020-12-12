import { User, Recovery } from '../models';
import { Op } from 'sequelize';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import transporter from '../../modules/email'


class AuthController {
	async authenticate(req, res) {
		try {
			const { email, password } = req.body;

			const user = await User.scope('withPassword').findOne({
        where: {email}
      });

			if (!user || await !bcrypt.compareSync(password, user.password))
        return res.status(400).json({ error: { generic: 'Authentication failed.' } });

			const token = jwt.sign({ id: user.id }, process.env.APP_SECRET, {
				expiresIn: 86400
      });

			return res.status(200).json({
        id: user.id,
        username: user.username,
        email: user.email,
        token
      });
		} catch (error) {
			return res.status(500).json({ error });
		}
  }

  async recoveryPassword(req, res){
    try {
			const { email } = req.body;

			const user = await User.findOne({
        where: {email}
      });

			if (!user)
        return res.status(400).json({ error: { generic: 'Account not found.' } });

      const now = new Date();
      const token = crypto.randomBytes(25).toString('hex');

      const recovery = await Recovery.create({
        user_id: user.id,
        token: token,
        status: 'new',
        date: now.setHours(now.getHours() + 2)
      });

      if (!recovery)
        return res.status(400).json({ error: { generic: 'Error generate token.' } });

      transporter.sendMail({
        to: user.email,
        from: '"YouMe 💬" <youme@contact.com>',
        subject: 'Password Reset Link',
        template: 'password_recovery',
        context: { token: token }
      });

			return res.status(204).json();
		} catch (error) {
			return res.status(500).json({ error });
		}
  }

  async resetPassword(req, res){
    try {
      const { password } = req.body;
      const { token } = req.params;

			const recovery = await Recovery.findOne({
        where: {
          token,
          status: 'new',
          date: { [Op.gte]: new Date() }
        },
        include: { association: 'user' }
      });

			if (!recovery)
        return res.status(400).json({ error: { generic: 'Invalid token.' } });

      const userToUpdate = await User.update({ password }, {
        where: { id: recovery.user.id }
      });

      recovery.status = 'used';
      recovery.save();

			return res.status(200).json(recovery);
		} catch (error) {
			return res.status(500).json({ error });
		}
  }
}

export default new AuthController();
