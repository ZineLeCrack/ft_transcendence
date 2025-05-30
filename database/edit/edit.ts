import bcrypt from 'bcrypt';
import { getDb_user } from '../database.js';
import fs from 'fs';
import { FastifyInstance } from 'fastify';
import { request } from 'http';

export default async function editRoutes(fastify: FastifyInstance)
{
    fastify.post('/edit', async (request, reply) => {
        const {current, newpass , IdUser} = request.body as {current: string, newpass: string, IdUser: string};
        if (!newpass || !current)
        {
            reply.status(400).send('imcomplete data');
            return;
        }
        try {
            const db = await getDb_user();
            const mypass =  await db.get('SELECT password FROM users WHERE id = ?', [IdUser]);
            const match = await bcrypt.compare(current, mypass.password);
            if (match)
            {
                try {
                    const newhash = await bcrypt.hash(newpass.toString(), 10);
                    await db.run('UPDATE users SET password = ? WHERE id = ?', [newhash, IdUser]);
                } 
                catch (error) {
                    reply.status(500).send("erreur co database");
                    console.log(error);
                }
                console.log("password edit sucess");
                reply.status(200).send("nice");
            }
            else {
                reply.status(401).send("invalid mdp");
            }
        } 
        catch (error) {
            console.log(error);
            reply.status(500).send(error);
        }
    });
}
