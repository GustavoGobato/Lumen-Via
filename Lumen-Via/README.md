# Lumen Via - Soluções Inteligentes para Cidades

O Lumen Via é um projeto inovador que combina tecnologia sustentável e mobilidade urbana para criar cidades mais inteligentes e eficientes.

## Funcionalidades Principais

- **Via Verde**: Sistema de roteirização otimizada para entregadores
- **Postes Solares**: Iluminação pública autossustentável
- **Semáforos Inteligentes**: Sistema de geração de energia piezoelétrica
- **Manutenção Inteligente**: Sistema de reporte e monitoramento

## Tecnologias Utilizadas

- HTML5
- CSS3
- JavaScript
- Leaflet.js (para mapas)
- OpenRouteService API (para cálculo de rotas)

## Como Usar

1. Clone o repositório
2. Abra o arquivo `index.html` em seu navegador
3. Para usar o Via Verde, clique no botão correspondente na página inicial

## Contribuição

Contribuições são bem-vindas! Por favor, leia as diretrizes de contribuição antes de enviar um pull request.

## Licença

Este projeto está licenciado sob a licença MIT - veja o arquivo LICENSE para mais detalhes.

## Backend (Node.js + MongoDB)

1. Entre na pasta `backend`.
2. Instale as dependências:
   ```sh
   npm install
   ```
3. Crie um arquivo `.env` com:
   ```
   MONGODB_URI=mongodb://localhost:27017/lumenvia
   PORT=5000
   ```
4. Inicie o servidor:
   ```sh
   npm start
   ```

O frontend já está integrado para consumir a API de denúncias.
