import { Request, Response } from 'express';
import knex from 'knex';
import dotenv from 'dotenv';
import { v7 as uuidv7 } from 'uuid';
import { db } from '../config/db';

dotenv.config();

export const getArtistas = async (req: Request, res: Response): Promise<void> => {
  try {
    const artistas = await db('artista').select('*');  
    res.json(artistas);
  } catch (err: any) {
    const mensagem = err.sqlMessage || err.message || 'Erro ao buscar artistas';
    res.json({ mensagem });
  }
};

export const getArtistaById = async (req: Request, res: Response): Promise<void> => {
  const id = req.params.id;

  try {
    const artista = await db('artista').where({ id }).first();  
    if (artista) {
      res.json(artista);
    } else {
      res.status(404).json({ mensagem: 'Artista não encontrado' });
    }
  } catch (err: any) {
    const mensagem = err.sqlMessage || err.message || 'Erro ao buscar artista';
    res.json({ mensagem });
  }
};

export const createArtista = async (req: Request, res: Response): Promise<void> => {
  const { nome } = req.body;

  if (!nome || typeof nome !== 'string') {
    res.status(400).json({ error: 'Nome é obrigatório e deve ser uma string' });
    return;
  }

  const id = uuidv7();

  try {
    const [novoArtista] = await db('artista').insert({ id, nome }).returning('*');  
    res.status(201).json(novoArtista);
  } catch (err: any) {
    const mensagem = err.sqlMessage || err.message || 'Erro ao criar artista';
    res.json({ mensagem });
  }
};

export const updateArtista = async (req: Request, res: Response): Promise<void> => {
  const id = req.params.id;
  const { nome } = req.body;

  if (!nome || typeof nome !== 'string') {
    res.status(400).json({ error: 'Nome é obrigatório e deve ser uma string' });
    return;
  }

  try {
    const [artistaAtualizado] = await db('artista')
      .where({ id })
      .update({ nome })
      .returning('*');  

    if (artistaAtualizado) {
      res.json(artistaAtualizado);
    } else {
      res.status(404).json({ mensagem: 'Artista não encontrado' });
    }
  } catch (err: any) {
    const mensagem = err.sqlMessage || err.message || 'Erro ao atualizar artista';
    res.json({ mensagem });
  }
};

export const deleteArtista = async (req: Request, res: Response): Promise<void> => {
  const id = req.params.id;

  try {
    const [artistaDeletado] = await db('artista').where({ id }).del().returning('*');  

    if (artistaDeletado) {
      res.json({ mensagem: 'Artista deletado com sucesso' });
    } else {
      res.status(404).json({ mensagem: 'Artista não encontrado' });
    }
  } catch (err: any) {
    const mensagem = err.sqlMessage || err.message || 'Erro ao deletar artista';
    res.json({ mensagem });
  }
};
