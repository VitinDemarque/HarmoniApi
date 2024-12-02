import { Request, Response } from 'express';
import knex from 'knex';
import dotenv from 'dotenv';
import { v7 as uuidv7 } from 'uuid';  
import { db } from '../data/db';

dotenv.config();

export const getPlaylists = async (req: Request, res: Response): Promise<void> => {
  try {
    const usuarioId = req.query.usuarioId as string;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = (page - 1) * limit;

    if (!usuarioId) {
      throw new Error('Faltou campo de usuário (usuarioId)');
    }

    const playlists = await db('playlist as p')
      .leftJoin('playlist_musicas as pm', 'p.id', 'pm.playlist_id')
      .leftJoin('musica as m', 'pm.musica_id', 'm.id')
      .select(
        'p.id',
        'p.nome',
        'p.usuario_id',
        db.raw('ARRAY_AGG(m.id) AS musicas_ids'),
        db.raw('ARRAY_AGG(m.nome) AS musicas_nomes')
      )
      .where('p.usuario_id', usuarioId)
      .groupBy('p.id')
      .orderBy('p.id')
      .limit(limit)
      .offset(offset);

    const totalPlaylists = await db('playlist as p')
      .where('p.usuario_id', usuarioId)
      .count('* as total')
      .first();

    res.json({
      total: totalPlaylists?.total || 0,
      page,
      limit,
      playlists,
    });
  } catch (err: any) {
    const mensagem = err.sqlMessage || err.message || 'Erro ao buscar playlists';
    res.json({ mensagem });
  }
};

export const getPlaylistById = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id;

    const playlist = await db('playlist as p')
      .leftJoin('playlist_musicas as pm', 'p.id', 'pm.playlist_id')
      .leftJoin('musica as m', 'pm.musica_id', 'm.id')
      .select(
        'p.id',
        'p.nome',
        'p.usuario_id',
        db.raw('ARRAY_AGG(m.id) AS musicas_ids'),
        db.raw('ARRAY_AGG(m.nome) AS musicas_nomes')
      )
      .where('p.id', id)
      .groupBy('p.id')
      .first();

    if (!playlist) {
      res.status(404).json({ mensagem: 'Playlist não encontrada' });
      return;
    }

    res.json(playlist);
  } catch (err: any) {
    const mensagem = err.sqlMessage || err.message || 'Erro ao buscar playlist';
    res.json({ mensagem });
  }
};

export const createPlaylist = async (req: Request, res: Response): Promise<void> => {
  try {
    const { nome, musicas, usuarioId } = req.body;

    if (!nome || !usuarioId) {
      res.status(400).json({ error: 'Campos obrigatórios: nome e usuarioId' });
      return;
    }

    const id = uuidv7(); 

    const [novaPlaylist] = await db('playlist')
      .insert({ id, nome, usuario_id: usuarioId })
      .returning('*');

    if (musicas && Array.isArray(musicas)) {
      const playlistMusicas = musicas.map((musicaId: number) => ({
        playlist_id: id,
        musica_id: musicaId,
      }));
      await db('playlist_musicas').insert(playlistMusicas);
    }

    res.status(201).json(novaPlaylist);
  } catch (err: any) {
    const mensagem = err.sqlMessage || err.message || 'Erro ao criar playlist';
    res.json({ mensagem });
  }
};

export const updatePlaylist = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id;
    const { nome, musicas } = req.body;

    const [playlistAtualizada] = await db('playlist')
      .where('id', id)
      .update({ nome })
      .returning('*');

    if (!playlistAtualizada) {
      res.status(404).json({ mensagem: 'Playlist não encontrada' });
      return;
    }

    if (musicas && Array.isArray(musicas)) {
      await db('playlist_musicas').where('playlist_id', id).delete();
      const playlistMusicas = musicas.map((musicaId: number) => ({
        playlist_id: id,
        musica_id: musicaId,
      }));
      await db('playlist_musicas').insert(playlistMusicas);
    }

    res.json(playlistAtualizada);
  } catch (err: any) {
    const mensagem = err.sqlMessage || err.message || 'Erro ao atualizar playlist';
    res.json({ mensagem });
  }
};

export const deletePlaylist = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id;

    const rowsDeleted = await db('playlist').where('id', id).delete();

    if (!rowsDeleted) {
      res.status(404).json({ mensagem: 'Playlist não encontrada' });
      return;
    }

    res.status(200).json({ message: 'Playlist deletada com sucesso' });
  } catch (err: any) {
    const mensagem = err.sqlMessage || err.message || 'Erro ao deletar playlist';
    res.json({ mensagem });
  }
};
