import { Request, Response } from 'express';
import { Client } from 'pg';

const clientConfig = {
  host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: '123',
    database: 'harmoniapi'
};


export const getUsuarios = async (req: Request, res: Response) => {
  const client = new Client(clientConfig);
  try {
    await client.connect();
    const result = await client.query('SELECT * FROM usuario');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar usuários' });
  } finally {
    await client.end();
  }
};


export const getUsuarioById = async (req: Request, res: Response) => {
  const client = new Client(clientConfig);
  const id = parseInt(req.params.id);
  try {
    await client.connect();
    const result = await client.query('SELECT * FROM usuario WHERE id = $1', [id]);
    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).json({ message: 'Usuário não encontrado' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar usuário' });
  } finally {
    await client.end();
  }
};


export const createUsuario = async (req: Request, res: Response) => {
  const client = new Client(clientConfig);
  const { nome } = req.body;
  try {
    await client.connect();
    //criar id pela api usando o v7
    const result = await client.query(
      'INSERT INTO usuario (nome) VALUES ($1) RETURNING *',
      [nome]
    );//query raw, devemos usar o query build
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao criar usuário' });
  } finally {
    await client.end();
  }
};


export const updateUsuario = async (req: Request, res: Response) => {
  const client = new Client(clientConfig);
  const { nome } = req.body;
  try {
    const id = parseInt(req.params.id); //uuid v7
    await client.connect();
    const result = await client.query(
      'UPDATE usuario SET nome = $1 WHERE id = $2 RETURNING *',
      [nome, id]
    );
    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).json({ message: 'Usuário não encontrado' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao atualizar usuário' });
  } finally {
    await client.end();
  }
};


export const deleteUsuario = async (req: Request, res: Response) => {
  const client = new Client(clientConfig);
  const id = parseInt(req.params.id);
  try {
    await client.connect();
    const result = await client.query('DELETE FROM usuario WHERE id = $1', [id]);
    if (typeof result.rowCount === 'number' && result.rowCount > 0) {  
      res.status(200).json({ message: 'Usuário deletado com sucesso' });
    } else {
      res.status(404).json({ message: 'Usuário não encontrado' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao deletar usuário' });
  } finally {
    await client.end();
  }
};
