# Late e Mia - API
API utilizada para gerenciar agendamentos de consultas veterinárias.

## Instalar
- Na pasta do projeto, rodar comando `npm install`

## Variáveis de ambiente
Na raiz do projeto, criar um arquivo chamado `.env` com as seguintes variáveis:
```
DATABASE_HOST= # Host de banco de dados Supabase
DATABASE_PASSWORD= # Senha do banco de dados
JWT_SECRET= # String aleatória utilizada para assinar o token JWT
ALLOWED_ORIGINS=http://localhost:3001 # Indicando o Host do frontend 
ENV=development
```

## Rodar
- Na pasta do projeto, rodar `node server.js`
