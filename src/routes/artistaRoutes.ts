import express from "express";
import {
  getArtistas,
  getArtistaById,
  createArtista,
  updateArtista,
  deleteArtista
} from '../controllers/artista';

const router = express.Router();


router.get('/', getArtistas); 
router.get('/:id', getArtistaById); 
router.post('/criar', createArtista); 
router.put('/:id', updateArtista); 
router.delete('/:id', deleteArtista); 

export default router;
