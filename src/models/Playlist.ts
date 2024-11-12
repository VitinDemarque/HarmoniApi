export interface Playlist {
  id: number;
  nome: string;
  musicas: number[]; 
  usuarioId: number; 
}


export const playlists: Playlist[] = [
  { id: 1, nome: 'Rock Classics', musicas: [1, 2], usuarioId: 1 },
  { id: 2, nome: 'Pop Hits', musicas: [3], usuarioId: 1 },
  { id: 3, nome: 'Indie Vibes', musicas: [1, 3], usuarioId: 2 },
];
 