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
    
    fastify.post('/info', async (request, reply) => {
        const {username, email , IdUser} = request.body as {username: string, email: string, IdUser: string};
        if (!username && !email)
        {
            reply.status(400).send('incomplete data');
            return;
        }
        try {
            const db = await getDb_user();
            if (username && email)
            {
                try {
                   await db.run('UPDATE users SET name = ?, email = ? WHERE id = ?', [username, email, IdUser]);
                } 
                catch (error) {
                    reply.status(500).send("erreur co database");
                    console.log(error);
                }
                console.log("info edit sucess");
                reply.status(200).send("nice");
            }
            else if (username && !email) {
                try {
                   await db.run('UPDATE users SET name = ? WHERE id = ?', [username, IdUser]);
                } 
                catch (error) {
                    reply.status(500).send("erreur co database");
                    console.log(error);
                }
                console.log("username edit sucess");
                reply.status(200).send("nice");
            }
            else if (!username && email)
            {
                try {
                   await db.run('UPDATE users SET email = ? WHERE id = ?', [email, IdUser]);
                } 
                catch (error) {
                    reply.status(500).send("erreur co database");
                    console.log(error);
                }
                console.log("email edit sucess");
                reply.status(200).send("nice");
            }
        } 
        catch (error) {
            console.log(error);
            reply.status(500).send(error);
        }
    });
}
