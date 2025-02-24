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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
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
app.use((0, cors_1.default)());
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
    var _a, e_1, _b, _c;
    var _d, _e;
    try {
        //when the user instructs the LLM that make a todo node backend then it hits /template then it generates the prompts to send the llm and we make the request with that prompts only
        const messages = req.body.messages;
        const response = yield openai.chat.completions.create({
            model: "gpt-4o",
            store: true,
            stream: true,
            messages: [{
                    "role": "system",
                    "content": (0, prompts_1.getSystemPrompt)()
                }, ...messages]
        });
        try {
            for (var _f = true, response_1 = __asyncValues(response), response_1_1; response_1_1 = yield response_1.next(), _a = response_1_1.done, !_a; _f = true) {
                _c = response_1_1.value;
                _f = false;
                const chunk = _c;
                process.stdout.write(((_e = (_d = chunk.choices[0]) === null || _d === void 0 ? void 0 : _d.delta) === null || _e === void 0 ? void 0 : _e.content) || "");
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (!_f && !_a && (_b = response_1.return)) yield _b.call(response_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        console.log("response from the llm in the /chat endpoint >> : ", response);
        res.json({
            "message": "LLM response generated successfully and sent to the frontend!!",
            response: response
        });
    }
    catch (error) {
        console.error("there was an error while sending the messages to the LLM in the /chat endpoint!!");
        res.status(500).json({
            message: "Internal Server Error in /chat"
        });
    }
}));
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`server is running on port : ${PORT}`);
});
