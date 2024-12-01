export interface Musica {
  id: number;
  nome: string;
  artistaId: number;  
}

export const musicas: Musica[] = [
  { id: 1, nome: 'Bohemian Rhapsody', artistaId: 1 },
  { id: 2, nome: 'Stairway to Heaven', artistaId: 2 },
  { id: 3, nome: 'Bad Guy', artistaId: 3 },
];
  