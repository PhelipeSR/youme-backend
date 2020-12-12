import jwt from 'jsonwebtoken';

module.exports = function (rec, res, next) {
  const authHeader = rec.headers.authorization;

	if (!authHeader)
	return res.status(401).json({ error: { generic: 'No token provided' } });

	const parts = authHeader.split(' ');

	if (parts.length !== 2)
	return res.status(401).json({ error: { generic: 'Token error' } });

	const [schema, token] = parts;

	if (!/^Bearer$/i.test(schema))
	return res.status(401).json({ error: { generic: 'Token malformatted' } });

	jwt.verify(token, process.env.APP_SECRET, (err, decoded) => {
		if (err)
			return res.status(401).json({ error: { generic: 'Token invalid' } });

		rec.userId = Number(decoded.id);

		return next();
	});
}
