import { Request, Response } from 'express';
import { Client } from 'pg';

const clientConfig = {
  host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: '123',
    database: 'harmoniapi'
};

export const getPlaylists = async (req: Request, res: Response) => {
  const client = new Client(clientConfig);
  
  try {
    const usuarioId = req.query.usuarioId; 
    if(!usuarioId){
      res.status(400);
      throw new Error("faltou campo de usuario")
    }
    const page = parseInt(req.query.page as string) || 1; 
    const limit = parseInt(req.query.limit as string) || 10; 
    const offset = (page - 1) * limit;
    // const user = buscarUsuarioPorId(id);
    // if(!user){
    //   res.status(404);
    //   throw new Error("Usuario inexistente no banco")
    // }
    await client.connect();
    const result = await client.query(
      `SELECT p.*, 
              ARRAY_AGG(m.id) AS musicas_ids, 
              ARRAY_AGG(m.nome) AS musicas_nomes
       FROM playlist p
       LEFT JOIN playlist_musicas pm ON p.id = pm.playlist_id
       LEFT JOIN musica m ON pm.musica_id = m.id
       WHERE ($1::UUID IS NULL OR p.usuario_id = $1)  
       GROUP BY p.id
       ORDER BY p.id
       LIMIT $2 OFFSET $3`,
      [usuarioId || null, limit, offset]
    );

    const countResult = await client.query(
      `SELECT COUNT(*) FROM playlist p
       WHERE ($1::UUID IS NULL OR p.usuario_id = $1)`,
      [usuarioId || null]
    );
    const totalPlaylists = parseInt(countResult.rows[0].count);
    
    res.json({
      total: totalPlaylists,
      page,
      limit,
      playlists: result.rows,
    });
  } catch (err: any) {
    const message = err.sqlMessage || err.message || 'Erro ao buscar playlists';
    console.error(message);
    res.status(500).json(message);
  } finally {
    await client.end();
  }
};

export const getPlaylistById = async (req: Request, res: Response) => {
  const client = new Client(clientConfig);
  const id = parseInt(req.params.id);
  try {
    await client.connect();
    const result = await client.query(
      `SELECT p.*, 
              ARRAY_AGG(m.id) AS musicas_ids, 
              ARRAY_AGG(m.nome) AS musicas_nomes
       FROM playlist p
       LEFT JOIN playlist_musicas pm ON p.id = pm.playlist_id
       LEFT JOIN musica m ON pm.musica_id = m.id
       WHERE p.id = $1
       GROUP BY p.id`,
      [id]
    );

    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).json({ message: 'Playlist não encontrada' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar playlist' });
  } finally {
    await client.end();
  }
};


export const createPlaylist = async (req: Request, res: Response) => {
  const client = new Client(clientConfig);
  const { nome, musicas, usuarioId } = req.body;

  try {
    await client.connect();
    const result = await client.query(
      'INSERT INTO playlist (nome, usuario_id) VALUES ($1, $2) RETURNING *',
      [nome, usuarioId]
    );

    const novaPlaylist = result.rows[0];

    if (musicas && musicas.length > 0) {
      const promises = musicas.map(async (musicaId: number) => {
        return client.query(
          'INSERT INTO playlist_musicas (playlist_id, musica_id) VALUES ($1, $2)',
          [novaPlaylist.id, musicaId]
        );
      });
      await Promise.all(promises);
    }

    res.status(201).json(novaPlaylist);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao criar playlist' });
  } finally {
    await client.end();
  }
};


export const updatePlaylist = async (req: Request, res: Response) => {
  const client = new Client(clientConfig);
  const id = parseInt(req.params.id);
  const { nome, musicas } = req.body;
  try {
    await client.connect();
    const result = await client.query(
      'UPDATE playlist SET nome = $1, musicas = $2 WHERE id = $3 RETURNING *',
      [nome, musicas, id]
    );
    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).json({ message: 'Playlist não encontrada' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao atualizar playlist' });
  } finally {
    await client.end();
  }
};


export const deletePlaylist = async (req: Request, res: Response) => {
  const client = new Client(clientConfig);
  const id = parseInt(req.params.id);
  try {
    await client.connect();
    const result = await client.query('DELETE FROM playlist WHERE id = $1', [id]);
    if (typeof result.rowCount === 'number' && result.rowCount > 0) {  
      res.status(200).json({ message: 'Playlist deletada com sucesso' });
    } else {
      res.status(404).json({ message: 'Playlist não encontrada' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao deletar playlist' });
  } finally {
    await client.end();
  }
};
