import { Router } from 'express';
import {
  getPlaylists,
  getPlaylistById,
  createPlaylist,
  updatePlaylist,
  deletePlaylist
} from '../controllers/playlist';

const router = Router();

// Definir rotas
router.get('/', getPlaylists); 
router.get('/:id', getPlaylistById); 
router.post('/', createPlaylist); 
router.put('/:id', updatePlaylist); 
router.delete('/:id', deletePlaylist); 

export default router;
