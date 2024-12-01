import { Request, Response } from 'express';
import knex from 'knex';
import dotenv from 'dotenv';
import { v7 as uuidv7 } from 'uuid';  
import { db } from '../config/db';

dotenv.config();


export const getUsuarios = async (req: Request, res: Response): Promise<void> => {
  try {
    const usuarios = await db('usuario').select('*');
    res.json(usuarios);
  } catch (err: any) {
    const mensagem = err.sqlMessage || err.message || "Erro ao buscar usuários";
    res.json({ mensagem });
  }
};

export const getUsuarioById = async (req: Request, res: Response): Promise<void> => {
  const id = req.params.id;  

  try {
    const usuario = await db('usuario').where({ id }).first();

    if (usuario) {
      res.json(usuario);
    } else {
      res.status(404).json({ mensagem: "Usuário não encontrado" });
    }
  } catch (err: any) {
    const mensagem = err.sqlMessage || err.message || "Erro ao buscar usuário";
    res.json({ mensagem });
  }
};

export const createUsuario = async (req: Request, res: Response): Promise<void> => {
  const { nome } = req.body;

  if (!nome) {
    res.status(400).json({ mensagem: "O campo nome é obrigatório" });
    return;
  }

  try {
    const novoId = uuidv7();  
    const [novoUsuario] = await db('usuario').insert({ id: novoId, nome }).returning('*');
    res.status(201).json(novoUsuario);
  } catch (err: any) {
    const mensagem = err.sqlMessage || err.message || "Erro ao criar usuário";
    res.json({ mensagem });
  }
};

export const updateUsuario = async (req: Request, res: Response): Promise<void> => {
  const id = req.params.id;  
  const { nome } = req.body;

  if (!nome) {
    res.json({ mensagem: "O campo nome é obrigatório" });
    return;
  }

  try {
    const [usuarioAtualizado] = await db('usuario')
      .where({ id })
      .update({ nome })
      .returning('*');

    if (usuarioAtualizado) {
      res.json(usuarioAtualizado);
    } else {
      res.status(404).json({ mensagem: "Usuário não encontrado" });
    }
  } catch (err: any) {
    const mensagem = err.sqlMessage || err.message || "Erro ao atualizar usuário";
    res.json({ mensagem });
  }
};

export const deleteUsuario = async (req: Request, res: Response): Promise<void> => {
  const id = req.params.id;  

  try {
    const resultado = await db('usuario').where({ id }).del();

    if (resultado > 0) {
      res.json({ mensagem: "Usuário deletado com sucesso" });
    } else {
      res.status(404).json({ mensagem: "Usuário não encontrado" });
    }
  } catch (err: any) {
    const mensagem = err.sqlMessage || err.message || "Erro ao deletar usuário";
    res.json({ mensagem });
  }
};
