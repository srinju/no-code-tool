"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv").config();
const openai_1 = __importDefault(require("openai"));
const prompts_1 = require("./prompts");
const express_1 = __importDefault(require("express"));
const node_1 = require("./defaults/node");
const react_1 = require("./defaults/react");
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    origin: 'https://builtitai.vercel.app/',
    methods: ['GET', 'POST'],
    credentials: true
}));
const openai = new openai_1.default({
    apiKey: process.env.OPEN_AI_API_KEY,
});
//get the template >>
app.post('/template', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //get the prompt>
        const prompt = req.body.prompt;
        //let answer = '';
        const response = yield openai.chat.completions.create({
            model: "gpt-4o",
            store: true,
            //stream : true,
            messages: [{
                    "role": "system",
                    "content": "Response should be a single word , dont thik that is dont return any <think> tag .Return either node or react based on what do you think this project should be . Only return a single word either 'node' or 'react' . CRITICAL : DO NOT RETURN ANYTHING ELSE"
                }, {
                    "role": "user",
                    "content": prompt
                },],
        });
        const answer = response.choices[0].message.content; //get only the content
        console.log("response from the ai is : ", answer);
        if (answer === 'node') {
            res.json({
                prompts: [`Here is an artifact that contains all files of the project visible to you.\nConsider the contents of ALL files in the project.\n\n${node_1.basePrompt}\n\nHere is a list of files that exist on the file system but are not being shown to you:\n\n  - .gitignore\n  - package-lock.json\n`],
                uiPrompts: node_1.basePrompt
            });
            return;
        }
        if (answer === 'react') {
            res.json({
                prompts: [prompts_1.BASE_PROMPT, `Here is an artifact that contains all files of the project visible to you.\nConsider the contents of ALL files in the project.\n\n${react_1.basePrompt}\n\nHere is a list of files that exist on the file system but are not being shown to you:\n\n  - .gitignore\n  - package-lock.json\n`],
                uiPrompts: react_1.basePrompt
            });
            return;
        }
        res.status(400).json({
            error: "not a framework registered error!!"
        });
    }
    catch (error) {
        console.error("there was an error while getting the template from the user's message in the /template endpoint!");
        res.status(500).json({
            message: "Internal Server Error in /template"
        });
    }
}));
app.post('/chat', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //when the user instructs the LLM that make a todo node backend then it hits /template then it generates the prompts to send the llm and we make the request with that prompts only
        const messages = req.body.messages;
        const response = yield openai.chat.completions.create({
            model: "gpt-4o",
            store: true,
            //stream : true,
            messages: [{
                    "role": "system",
                    "content": (0, prompts_1.getSystemPrompt)()
                }, ...messages]
        });
        /*
        let fullResponse = '';

        for await (const chunk of response) {
            let content = (chunk.choices[0]?.delta?.content || "");
            process.stdout.write(content);
            fullResponse += content;
        }
        */
        console.log("response from the llm in the /chat endpoint >> : ", response.choices[0].message.content);
        res.json({
            "message": "LLM response generated successfully and sent to the frontend!!",
            response: response.choices[0].message.content
        });
    }
    catch (error) {
        console.error("there was an error while sending the messages to the LLM in the /chat endpoint!!");
        res.status(500).json({
            message: "Internal Server Error in /chat"
        });
    }
}));
const PORT = 8080;
app.listen(PORT, () => {
    console.log(`server is running on port : ${PORT}`);
});
