import { FastifyInstance } from 'fastify';
import nodemailer from 'nodemailer';
import fastifyJwt from '@fastify/jwt';
import { getDb_user } from '../database';

const EMAIL = process.env.EMAIL || 'admin@example.com';
const EMAIL_SMP = process.env.PASSWORD_SMP || 'password';
const JWT_SECRET = process.env.JWT_SECRET || 'votre_cle_secrete_super_longue';

const verificationCodes = new Map();

export default async function a2fRoutes(fastify: FastifyInstance) {
	fastify.register(fastifyJwt, {
		secret: JWT_SECRET,
	});

	fastify.post('/a2f/send', async (request, reply) => {
		const { IdUser } = request.body as { IdUser: string , userName : string, PictureProfile : string};

		if (!IdUser) {
			reply.status(400).send('Missing IdUser');
			return ;
		}

		try {
			const db = await getDb_user();
			const user = await db.get(`SELECT email FROM users WHERE id = ?`, [IdUser]);
			if (!user?.email) {
				reply.status(404).send('User not connected please connect first');
				return ;
			}

			const code = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
			verificationCodes.set(IdUser, code);

			const transporter = nodemailer.createTransport({
				service: 'gmail',
				auth: {
					user: EMAIL,
					pass: EMAIL_SMP,
				},
			});

			await transporter.sendMail({
				from: EMAIL,
				to: user.email,
				subject: 'Your 2FA code',
				text: `This is your 2FA code : ${code}`,
			});

			reply.status(200).send('Code sent');
		}
		catch (err) {
			reply.status(500).send('An error occurred while sending the code retry later');
		}
	});

	fastify.post('/a2f/verify', async (request, reply) => {
		const { IdUser, code} = request.body as { IdUser: string, code: string};

		if (!IdUser || !code) {
			reply.status(400).send('Incomplete data');
			return ;
		}

		const expectedCode = verificationCodes.get(IdUser);

		if (code === expectedCode || code === '424242') { // pas oublier d'enveler avant de finish le project
			try {
				const token = fastify.jwt.sign({ userId: IdUser	});

				verificationCodes.delete(IdUser);
				reply.status(200).send({ token });
			} catch (err) {
				reply.status(500).send('JWT error');
			}
		} else {
			reply.status(200).send('bad code');
		}
	});
}
