const express = require('express');
const cors = require("cors");
require("dotenv").config(); 
const app = express();
//middle
app.use(cors());
app.use(express.json());

const Groq =  require('groq-sdk');

const groq = new Groq({
 apiKey: process.env.GROQ_API_KEY
});

app.post("/summary",async(req,res)=>{
    try{
    const {results, monthlySavings,
 yearlySavings } = req.body;
 
    //prompt
    const prompt = `
Generate a professional customized AI spend audit summary.

Monthly savings: ${monthlySavings}
Yearly savings: ${yearlySavings}

Recommendations:
${results.map(r => r.reco).join(", ")}

Keep response under 80 words.
`;
//send to AI
const chatCompletion = await groq.chat.completions.create({
 messages: [
   {
     role: "user",
     content: prompt
   }
 ],

 model: "llama-3.3-70b-versatile"
});
//extract ai summary
const summary =
chatCompletion.choices[0].message.content;
//return json 
res.json({
 summary: summary
});
    }
    catch(err){
        console.log(err);
        res.status(500).json({
  summary:
  "AI summary temporarily unavailable."
});
    }
})

app.listen(5000, ()=>{
 console.log("Server running ");

});