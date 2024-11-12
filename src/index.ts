import express, { Request, Response } from 'express';
import usuarioRoutes from './routes/usuarioRoutes';
import playlistRoutes from './routes/playlistRoutes';
import musicaRoutes from './routes/musicaRoutes';
import artistaRoutes from './routes/artistaRoutes';

const app = express();


app.use(express.json());

app.use('/usuarios', usuarioRoutes);
app.use('/playlists', playlistRoutes);
app.use('/musicas', musicaRoutes);
app.use('/artistas', artistaRoutes);



app.get('/', (req: Request, res: Response) => {
  res.send('Bem-vindo à API de Streaming de Música!');
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
