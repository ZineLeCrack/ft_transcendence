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
            if (await bcrypt.compare(current, mypass))
            {
                try {
                    await db.run('UPDATE users SET password = ? WHERE id = ?', [newpass, IdUser]);
                } 
                catch (error) {
                    console.log(error);
                }
                console.log("password edit sucess");
                alert("password edit success");
                reply.status(200).send("nice");
            }
        } 
        catch (error) {
            console.log(error);
            reply.status(500).send("fail");
        }
    });
}
