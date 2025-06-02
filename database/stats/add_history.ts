import { FastifyInstance } from 'fastify';
import { getDb_user } from '../database.js';

export default async function addhistoryRoutes(fastify: FastifyInstance) {
  fastify.post('/addhistory', async (request, reply) => {
    const { Id1, Id2, score1, score2 } = request.body as { Id1: string, Id2: string, score1: number, score2: number };

    try {
      const db = await getDb_user();
      await db.run(
        `
        INSERT INTO history (id_player1, id_player2, point_player1, point_player2, game_date) values (?, ?, ?, ?, '27/05/25 17:48');
        `,
        [Id1, Id2, score1, score2] // DAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAATE AAAAAA CHANGEEEEEEEEEEEEEEEEEEEEEEEEEER
      );
      reply.send({ success: true });
    } catch (err) {
      console.error(err);
      reply.status(500).send('Error');
    }
  });
}
// cela ne marche pas car les requetes sont lancées deux fois a la fin d'une partie pour quelle raison ??
// ducoup le Id1 est null ce qui fait que la requete crash

//erreur dans les logs :

//[Error: SQLITE_CONSTRAINT: NOT NULL constraint failed: history.id_player1] {
//  errno: 19,
//  code: 'SQLITE_CONSTRAINT'
//}


//erreur 500 dans le navigateur en double et websocket qui se connecte en double