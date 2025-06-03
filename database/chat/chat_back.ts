import { FastifyInstance } from 'fastify';
import { getDb_chat, getDb_user } from '../database.js';
import jwt from 'jsonwebtoken';
const JWT_SECRET = process.env.JWT_SECRET || 'votre_cle_secrete_super_longue';

export default async function chatRoutes(fastify: FastifyInstance) {

  fastify.post('/getmessages', async (_request, reply) => {
    try {
      const db = await getDb_chat();
      const messages = await db.all(`SELECT * FROM chat`);
      reply.status(200).send({ tab: messages });
    } catch (err) {
      console.error(err);
      reply.status(500).send('Server error');
    }
  });
  
  fastify.post('/verifuser', async (request, reply) => {
    const {token} = request.body as {token: string};
    try {
      let id_user;
      const db = await getDb_user();
      try {
        const decoded = jwt.verify(token, JWT_SECRET);
        id_user = (decoded as { userId: string }).userId;
      } 
      catch (err) {
        reply.status(401).send('Invalid token');
        return;
      }
      const response = await db.get(`SELECT name FROM users WHERE id = ?`, [id_user]);
      const original = response.name;
      reply.status(200).send({ original });
    } 
    catch (err) {
      console.error(err);
      reply.status(500).send('Server error');
    }
  });
}
