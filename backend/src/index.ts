
require("dotenv").config();

import OpenAI from 'openai';
import { BASE_PROMPT, getSystemPrompt } from './prompts';
import express from 'express';
import { basePrompt as basePromptNode } from './defaults/node';
import { basePrompt as basePromptReact } from './defaults/react';


const app = express();
app.use(express.json());

const openai = new OpenAI({
    apiKey: process.env.OPEN_AI_API_KEY,
});


//get the template >>
app.post('/template' , async (req , res) => {

    //get the prompt>
    const prompt = req.body.prompt;
    //let answer = '';

    const response = await openai.chat.completions.create({
        model: "gpt-4o",
        store: true,
        //stream : true,
        messages: [{
    
            "role" : "system",
            "content" : "Response should be a single word , dont thik that is dont return any <think> tag .Return either node or react based on what do you think this project should be . Only return a single word either 'node' or 'react' . CRITICAL : DO NOT RETURN ANYTHING ELSE"
        },{
            "role" : "user",
            "content" : prompt
        },],
    });

    const answer = response.choices[0].message.content ; //get only the content

    console.log("response from the ai is : " , answer);


    if(answer === 'node'){
        res.json({
            prompts : [basePromptNode ]
        });
        return;
    }

    if(answer === 'react'){
        res.json({
            prompts : [BASE_PROMPT , basePromptReact]
        });
        return;
    }

    res.status(400).json({
        error : "not a framework registered error!!"
    });
    
});


async function main() {

    const message = await openai.chat.completions.create({
        model: "gpt-4o",
        store: true,
        stream : true,
        messages: [{

            "role" : "system",
            "content" : getSystemPrompt()
        },{
            "role" : "user",
            "content" : "create a node backend for a todo app"
        },{
            role : "user",
            "content" : BASE_PROMPT //FOR ALL DESIGNS WALA LINE
    
        },{
            //running commands for specific frameworks should be there>
            "role" : "user",
            "content" : "<bolt_running_commands>\n</bolt_running_commands>\n\nCurrent Message:\n\ncreate a node backend for a todo app\n\nFile Changes:\n\nHere is a list of all files that have been modified since the start of the conversation.\nThis information serves as the true contents of these files!\n\nThe contents include either the full file contents or a diff (when changes are smaller and localized).\n\nUse it to:\n - Understand the latest file modifications\n - Ensure your suggestions build upon the most recent version of the files\n - Make informed decisions about changes\n - Ensure suggestions are compatible with existing code\n\nvite.config.ts:\n```\n\n```\n\nHere is a list of files that exist on the file system but are not being shown to you:\n\n  - /home/project/.bolt/config.json"
    
        },],
    });

    for await (const chunk of message) {
        process.stdout.write(chunk.choices[0]?.delta?.content || "")
    }

    console.log(message);
}

//main();


const PORT = 3000;
app.listen(PORT , () => {
    console.log(`server is running on port : ${PORT}`);
})