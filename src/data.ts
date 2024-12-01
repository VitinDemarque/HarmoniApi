export const usuarios = [
  { id: 1, nome: 'John Doe', playlists: [1, 2], seguindo: [1] },
  { id: 2, nome: 'Jane Doe', playlists: [3], seguindo: [2] },
];

export const playlists = [
  { id: 1, nome: 'Rock Classics', musicas: [1, 2], usuarioId: 1 },
  { id: 2, nome: 'Pop Hits', musicas: [3], usuarioId: 1 },
];

export const musicas = [
  { id: 1, nome: 'Bohemian Rhapsody', artistaId: 1 },
  { id: 2, nome: 'Stairway to Heaven', artistaId: 2 },
  { id: 3, nome: 'Bad Guy', artistaId: 3 },
];

export const artistas = [
  { id: 1, nome: 'Queen' },
  { id: 2, nome: 'Led Zeppelin' },
  { id: 3, nome: 'Billie Eilish' },
];
