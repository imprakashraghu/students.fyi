import { NextResponse } from "next/server";
import { createEdgeRouter } from "next-connect";
import OpenAI from "openai";

const router = createEdgeRouter()

function getConsequence(type, val) {
    if (type === 'work') {
        return `at a company ${val} role`
    } else if (type === 'project') {
        return `${val} technologies`
    } else if (type === 'certification') {
        return `${val}`
    }
}

const openai = new OpenAI({
    apiKey: process.env.OPEN_AI_KEY,
})

router
.post(async (req) => {
    try {
        
        const payload = await req.json()

        const prompt = `I had completed ${payload[0].block_type} ${payload[0].title?'with':''} ${payload[0].title} ${payload[0]?.block_type==='work'?'as':payload[0]?.block_type==='project'?'using':'in'} ${payload[0].subtitle} and I probably wanted to do a ${payload[1]?.block_type} ${payload[1].title} ${payload[1]?.block_type==='project'?'using ':''}${payload[1].block_type==='certification'?'with ':''}${getConsequence(payload[1].block_type, payload[1].subtitle)}. What are the things or ways I am supposed to do, in order to reach it. Make sure the output is in json array, format with keys: action, description, course_or_website_references. Maximum of items should be less than 5 and minimum of 2. Make sure the output is an array and all items in value must be string. Output format: {result: [json_objects]}`

        const chatCompletion = await openai.chat.completions.create({
            messages: [{ role: "user", content: prompt }],
            model: "gpt-3.5-turbo-0125",
            response_format: {"type": "json_object"}
        })
        const result = JSON.parse(chatCompletion?.choices[0]?.message?.content?.trim()?.replace('/\n/g','')) || null
    
        
        return NextResponse.json({ data: result?.action!==undefined?[result]:result },{ status: 200 })

    } catch(error) {
        console.log(error)
        return NextResponse.json({ message: error?.message||'Internal Server Error' }, { status: 200 })
    }
})

export async function POST(_request, ctx) {
    return router.run(_request, ctx)
}