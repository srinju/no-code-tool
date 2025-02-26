
require("dotenv").config();

import OpenAI from 'openai';
import { BASE_PROMPT, getSystemPrompt } from './prompts';
import express from 'express';
import { basePrompt as basePromptNode} from './defaults/node';
import { basePrompt as basePromptReact } from './defaults/react';
import cors from 'cors';



const app = express();
app.use(express.json());
app.use(cors());

const openai = new OpenAI({
    apiKey: process.env.OPEN_AI_API_KEY,
});


//get the template >>
app.post('/template' , async (req , res) => {

    try {
        
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
                prompts : [`Here is an artifact that contains all files of the project visible to you.\nConsider the contents of ALL files in the project.\n\n${basePromptNode}\n\nHere is a list of files that exist on the file system but are not being shown to you:\n\n  - .gitignore\n  - package-lock.json\n` ],
                uiPrompts : basePromptNode
            });
            return;
        }

        if(answer === 'react'){
            res.json({
                prompts : [BASE_PROMPT , `Here is an artifact that contains all files of the project visible to you.\nConsider the contents of ALL files in the project.\n\n${basePromptReact}\n\nHere is a list of files that exist on the file system but are not being shown to you:\n\n  - .gitignore\n  - package-lock.json\n`],
                uiPrompts : basePromptReact
            });
            return;
        }

        res.status(400).json({
            error : "not a framework registered error!!"
        });

    } catch (error) {
        console.error("there was an error while getting the template from the user's message in the /template endpoint!");
        res.status(500).json({
            message : "Internal Server Error in /template"
        });
    }
    
});


app.post('/chat' , async (req,res) => {
    try {
        //when the user instructs the LLM that make a todo node backend then it hits /template then it generates the prompts to send the llm and we make the request with that prompts only
        const messages = req.body.messages;

        const response = await openai.chat.completions.create({
            model: "gpt-4o",
            store: true,
            //stream : true,
            messages: [{
                "role" : "system",
                "content" : getSystemPrompt()
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

        console.log("response from the llm in the /chat endpoint >> : " , response.choices[0].message.content);

        res.json({
            "message" : "LLM response generated successfully and sent to the frontend!!",
            response : response.choices[0].message.content
        });

    } catch (error) {
        console.error("there was an error while sending the messages to the LLM in the /chat endpoint!!");
        res.status(500).json({
            message : "Internal Server Error in /chat"
        });
    }
});


const PORT = 8080;
app.listen(PORT , () => {
    console.log(`server is running on port : ${PORT}`);
})