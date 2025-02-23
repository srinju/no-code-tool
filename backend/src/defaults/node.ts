


export const basePrompt = 'The following is a list of all project files and their complete contents that are currently visible and accessible to you.<boltArtifact id=\"project-import\" title=\"Project Files\"><boltAction type=\"file\" filePath=\"index.js\">// run `node index.js` in the terminal\n\nconsole.log(`Hello Node.js v${process.versions.node}!`);\n</boltAction><boltAction type=\"file\" filePath=\"package.json\">{\n  \"name\": \"node-starter\",\n  \"private\": true,\n  \"scripts\": {\n    \"test\": \"echo \\\"Error: no test specified\\\" && exit 1\"\n  }\n}\n</boltAction></boltArtifact>\n\nHere is a list of files that exist on the file system but are not shown to you:\n\n - .gitignore\n - package-lock.json\n';

export const nodeUiPrompt = `.env:
\`\`\`
DATABASE_URL="postgresql://user:password@localhost:5432/mydatabase"
PORT=5000
JWT_SECRET="your_secret_key"
\`\`\`

.eslintrc.js:
\`\`\`
module.exports = {
  env: {
    node: true,
    es2021: true,
  },
  extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 12,
    sourceType: "module",
  },
  plugins: ["@typescript-eslint"],
  rules: {
    "no-console": "warn",
  },
};
\`\`\`

package.json:
\`\`\`
{
  "name": "nodejs-backend",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "ts-node-dev --respawn --transpile-only src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js",
    "lint": "eslint . --ext .ts"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "jsonwebtoken": "^9.0.2",
    "prisma": "^5.0.0",
    "zod": "^3.22.4"
  },
  "devDependencies": {
    "@types/cors": "^2.8.13",
    "@types/express": "^4.17.21",
    "@types/jsonwebtoken": "^9.0.2",
    "@typescript-eslint/eslint-plugin": "^6.2.0",
    "@typescript-eslint/parser": "^6.2.0",
    "eslint": "^9.9.1",
    "ts-node-dev": "^2.0.0",
    "typescript": "^5.5.3"
  }
}
\`\`\`

prisma/schema.prisma:
\`\`\`
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id       String  @id @default(uuid())
  email    String  @unique
  password String
  createdAt DateTime @default(now())
}
\`\`\`

src/index.ts:
\`\`\`
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "API is running!" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(\`Server running on port \${PORT}\`);
});
\`\`\`

src/routes/auth.ts:
\`\`\`
import express from "express";
import { z } from "zod";

const router = express.Router();

const userSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

router.post("/login", (req, res) => {
  const result = userSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ error: result.error });
  }

  res.json({ message: "Login successful" });
});

export default router;
\`\`\`

tsconfig.json:
\`\`\`
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "node",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "outDir": "./dist"
  },
  "include": ["src"]
}
\`\`\``




