export const Point = {
    latitude: Number,
    longitude: Number,
  };
  
  export const Obra = {
    id: String,
    nome: String,
    responsavel: String,
    dataInicio: String,
    previsaoTermino: String,
    localizacao: Point,
    foto: String, 
    descricao: String,
  };
  
  export const Fiscalizacao = {
    id: String,
    obraId: String,
    data: String,
    status: 'Em Dia' | 'Atrasada' | 'Parada',
    observacoes: String,
    localizacao: Point,
    foto: String,
  };