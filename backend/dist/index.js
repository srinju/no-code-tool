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
const app = (0, express_1.default)();
app.use(express_1.default.json());
const openai = new openai_1.default({
    apiKey: process.env.OPEN_AI_API_KEY,
});
//get the template >>
app.post('/template', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
            prompts: [node_1.basePrompt]
        });
        return;
    }
    if (answer === 'react') {
        res.json({
            prompts: [prompts_1.BASE_PROMPT, react_1.basePrompt]
        });
        return;
    }
    res.status(400).json({
        error: "not a framework registered error!!"
    });
}));
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, e_1, _b, _c;
        var _d, _e;
        const message = yield openai.chat.completions.create({
            model: "gpt-4o",
            store: true,
            stream: true,
            messages: [{
                    "role": "system",
                    "content": (0, prompts_1.getSystemPrompt)()
                }, {
                    "role": "user",
                    "content": "create a node backend for a todo app"
                }, {
                    role: "user",
                    "content": prompts_1.BASE_PROMPT //FOR ALL DESIGNS WALA LINE
                }, {
                    //running commands for specific frameworks should be there>
                    "role": "user",
                    "content": "<bolt_running_commands>\n</bolt_running_commands>\n\nCurrent Message:\n\ncreate a node backend for a todo app\n\nFile Changes:\n\nHere is a list of all files that have been modified since the start of the conversation.\nThis information serves as the true contents of these files!\n\nThe contents include either the full file contents or a diff (when changes are smaller and localized).\n\nUse it to:\n - Understand the latest file modifications\n - Ensure your suggestions build upon the most recent version of the files\n - Make informed decisions about changes\n - Ensure suggestions are compatible with existing code\n\nvite.config.ts:\n```\n\n```\n\nHere is a list of files that exist on the file system but are not being shown to you:\n\n  - /home/project/.bolt/config.json"
                },],
        });
        try {
            for (var _f = true, message_1 = __asyncValues(message), message_1_1; message_1_1 = yield message_1.next(), _a = message_1_1.done, !_a; _f = true) {
                _c = message_1_1.value;
                _f = false;
                const chunk = _c;
                process.stdout.write(((_e = (_d = chunk.choices[0]) === null || _d === void 0 ? void 0 : _d.delta) === null || _e === void 0 ? void 0 : _e.content) || "");
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (!_f && !_a && (_b = message_1.return)) yield _b.call(message_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        console.log(message);
    });
}
//main();
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`server is running on port : ${PORT}`);
});
