import { Router } from 'express';
import {
  getMusicas,
  getMusicaById,
  createMusica,
  updateMusica,
  deleteMusica
} from '../controllers/musica';

const router = Router();


router.get('/', getMusicas); 
router.get('/:id', getMusicaById); 
router.post('/', createMusica); 
router.put('/:id', updateMusica); 
router.delete('/:id', deleteMusica); 

export default router;
