import { Request, Response } from 'express';
import knex from 'knex';
import { v7 as uuidv7 } from 'uuid';
import dotenv from 'dotenv';

dotenv.config();

const db = knex({
  client: 'pg',
  connection: {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432'),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
  },
});

export const getMusicas = async (req: Request, res: Response): Promise<void> => {
  const { artistaId, page, limit } = req.query;
  const pageNumber = parseInt(page as string) || 1;
  const limitNumber = parseInt(limit as string) || 10;
  const offset = (pageNumber - 1) * limitNumber;

  try {
    if (artistaId && isNaN(Number(artistaId))) {
      throw new Error('artistaId deve ser um número');
    }

    let result;

    if (artistaId) {
      result = await db('musica')
        .where({ artista_id: Number(artistaId) })
        .limit(limitNumber)
        .offset(offset);
    } else {
      result = await db('musica').limit(limitNumber).offset(offset);
    }

    const countQuery = db('musica')
      .count('* as total')
      .modify((queryBuilder) => {
        if (artistaId) {
          queryBuilder.where({ artista_id: Number(artistaId) });
        }
      });

    const countResult = await countQuery;
    const totalMusicas = countResult[0].total;

    res.json({
      total: totalMusicas,
      page: pageNumber,
      limit: limitNumber,
      musicas: result,
    });
  } catch (err: any) {
    const mensagem = err.sqlMessage || err.message || 'Erro ao buscar músicas';
    res.json({ mensagem });
  }
};

export const getMusicaById = async (req: Request, res: Response): Promise<void> => {
  const id = req.params.id;

  try {
    const result = await db('musica').where({ id }).first();

    if (result) {
      res.json(result);
    } else {
      res.status(404).json({ mensagem: 'Música não encontrada' });
    }
  } catch (err: any) {
    const mensagem = err.sqlMessage || err.message || 'Erro ao buscar música';
    res.json({ mensagem });
  }
};

export const createMusica = async (req: Request, res: Response): Promise<void> => {
  const { nome, artistaId } = req.body;

  try {
    if (!nome || typeof nome !== 'string') {
      throw new Error('Nome é obrigatório e deve ser uma string');
    }

    if (!artistaId || isNaN(Number(artistaId))) {
      throw new Error('artistaId é obrigatório e deve ser um número');
    }

    const id = uuidv7();

    const [novoMusica] = await db('musica')
      .insert({ id, nome, artista_id: Number(artistaId) })
      .returning('*');

    res.status(201).json(novoMusica);
  } catch (err: any) {
    const mensagem = err.sqlMessage || err.message || 'Erro ao criar música';
    res.json({ mensagem });
  }
};

export const updateMusica = async (req: Request, res: Response): Promise<void> => {
  const id = req.params.id;
  const { nome, artistaId } = req.body;

  try {
    if (!nome || typeof nome !== 'string') {
      throw new Error('Nome é obrigatório e deve ser uma string');
    }

    if (!artistaId || isNaN(Number(artistaId))) {
      throw new Error('artistaId é obrigatório e deve ser um número');
    }

    const [musicaAtualizada] = await db('musica')
      .where({ id })
      .update({ nome, artista_id: Number(artistaId) })
      .returning('*');

    if (musicaAtualizada) {
      res.json(musicaAtualizada);
    } else {
      res.status(404).json({ mensagem: 'Música não encontrada' });
    }
  } catch (err: any) {
    const mensagem = err.sqlMessage || err.message || 'Erro ao atualizar música';
    res.json({ mensagem });
  }
};

export const deleteMusica = async (req: Request, res: Response): Promise<void> => {
  const id = req.params.id;

  try {
    const [musicaDeletada] = await db('musica').where({ id }).del().returning('*');

    if (musicaDeletada) {
      res.status(200).json({ message: 'Música deletada com sucesso' });
    } else {
      res.status(404).json({ mensagem: 'Música não encontrada' });
    }
  } catch (err: any) {
    const mensagem = err.sqlMessage || err.message || 'Erro ao deletar música';
    res.json({ mensagem });
  }
};
