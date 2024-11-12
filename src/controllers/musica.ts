import { Request, Response } from 'express';
import { Client } from 'pg'; // Importe o Client ao invés do Pool

// Configuração da conexão
const clientConfig = {
  host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: '123',
    database: 'harmoniapi'
};

export const getMusicas = async (req: Request, res: Response) => {
  const client = new Client(clientConfig);
  const { artistaId, page, limit } = req.query; 

  const pageNumber = parseInt(page as string) || 1; 
  const limitNumber = parseInt(limit as string) || 10; 
  const offset = (pageNumber - 1) * limitNumber; 

  try {
    await client.connect();
    let result;
    
    if (artistaId) {
      result = await client.query(
        'SELECT * FROM musica WHERE artista_id = $1 LIMIT $2 OFFSET $3',
        [artistaId, limitNumber, offset]
      );
    } else {
      result = await client.query('SELECT * FROM musica LIMIT $1 OFFSET $2', [limitNumber, offset]);
    }

    const countResult = await client.query('SELECT COUNT(*) FROM musica' + (artistaId ? ' WHERE artista_id = $1' : ''), artistaId ? [artistaId] : []);
    const totalMusicas = parseInt(countResult.rows[0].count);

    res.json({
      total: totalMusicas,
      page: pageNumber,
      limit: limitNumber,
      musicas: result.rows,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar músicas' });
  } finally {
    await client.end();
  }
};

export const getMusicaById = async (req: Request, res: Response) => {
  const client = new Client(clientConfig);
  const id = parseInt(req.params.id);
  try {
    await client.connect();
    const result = await client.query('SELECT * FROM musica WHERE id = $1', [id]);
    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).json({ message: 'Música não encontrada' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar música' });
  } finally {
    await client.end();
  }
};


export const createMusica = async (req: Request, res: Response) => {
  const client = new Client(clientConfig);
  const { nome, artistaId } = req.body;
  try {
    await client.connect();
    const result = await client.query(
      'INSERT INTO musica (nome, artista_id) VALUES ($1, $2) RETURNING *',
      [nome, artistaId]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao criar música' });
  } finally {
    await client.end();
  }
};


export const updateMusica = async (req: Request, res: Response) => {
  const client = new Client(clientConfig);
  const id = parseInt(req.params.id);
  const { nome, artistaId } = req.body;
  try {
    await client.connect();
    const result = await client.query(
      'UPDATE musica SET nome = $1, artista_id = $2 WHERE id = $3 RETURNING *',
      [nome, artistaId, id]
    );
    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).json({ message: 'Música não encontrada' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao atualizar música' });
  } finally {
    await client.end();
  }
};

export const deleteMusica = async (req: Request, res: Response) => {
  const client = new Client(clientConfig);
  const id = parseInt(req.params.id);
  try {
    await client.connect();
    const result = await client.query('DELETE FROM musica WHERE id = $1', [id]);
    if (typeof result.rowCount === 'number' && result.rowCount > 0) {  
      res.status(200).json({ message: 'Música deletada com sucesso' });
    } else {
      res.status(404).json({ message: 'Música não encontrada' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao deletar música' });
  } finally {
    await client.end();
  }
};
