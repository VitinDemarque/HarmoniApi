import { Request, Response } from 'express';
import { Client } from 'pg';


const clientConfig = {
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: '123',
  database: 'harmoniapi'
};


export const getArtistas = async (req: Request, res: Response) => {
  const client = new Client(clientConfig);
  try {
    await client.connect();
    const result = await client.query('SELECT * FROM artista');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar artistas' });
  } finally {
    await client.end();
  }
};

export const getArtistaById = async (req: Request, res: Response) => {
  const client = new Client(clientConfig);
  const id = parseInt(req.params.id);
  try {
    await client.connect();
    const result = await client.query('SELECT * FROM artista WHERE id = $1', [id]);
    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).json({ message: 'Artista não encontrado' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar artista' });
  } finally {
    await client.end();
  }
};


export const createArtista = async (req: Request, res: Response) => {
  const client = new Client(clientConfig);
  const { nome } = req.body;
  try {
    await client.connect();
    const result = await client.query(
      'INSERT INTO artista (nome) VALUES ($1) RETURNING *',
      [nome]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao criar artista' });
  } finally {
    await client.end();
  }
};

export const updateArtista = async (req: Request, res: Response) => {
  const client = new Client(clientConfig);
  const id = parseInt(req.params.id);
  const { nome } = req.body;
  try {
    await client.connect();
    const result = await client.query(
      'UPDATE artista SET nome = $1 WHERE id = $2 RETURNING *',
      [nome, id]
    );
    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).json({ message: 'Artista não encontrado' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao atualizar artista' });
  } finally {
    await client.end();
  }
};

export const deleteArtista = async (req: Request, res: Response) => {
  const client = new Client(clientConfig);
  const id = parseInt(req.params.id);
  try {
    await client.connect();
    const result = await client.query('DELETE FROM artista WHERE id = $1', [id]);
    } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao deletar artista' });
  } finally {
    await client.end();
  }
};