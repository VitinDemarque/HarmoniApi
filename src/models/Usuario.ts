export interface Usuario {
  id: number;
  nome: string;
  playlists: number[];
  seguindo: number[];  
}


export const usuarios: Usuario[] = [
  { id: 1, nome: 'John Doe', playlists: [1, 2], seguindo: [1] },
  { id: 2, nome: 'Jane Doe', playlists: [3], seguindo: [2] },
];
