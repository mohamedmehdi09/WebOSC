## Getting Started

### Prerequisites:
1. PostgreSQL
2. Node.js

### Cloning:
```bash
git clone https://github.com/OSCAnnaba/another-project.git
```
And change directory to `another-project` with the command: `cd another-project`

### Switch Branch:
`progres` is the current branch
```bash
git branch progres
```

### Install Node Stuff:
1. Execute `npm i` in terminal
2. Create a `.env` file in the project root folder and copy the content of `.env.template` into it
3. Execute `npx prisma db push` in terminal
4. Execute `npx prisma generate` in terminal
5. Execute `npm run dev` in terminal

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result!
