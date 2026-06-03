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
just tell hello

Monthly savings:
$${monthlySavings}

Yearly savings:
$${yearlySavings}

Current models:
${results.map(r => r.currentModel).join(", ")}

Current plans:
${results.map(r => r.currentPlan).join(", ")}

Recommendations:
${results.map(r => r.reco).join(", ")}
`;
//send to AI
const chatCompletion = await groq.chat.completions.create({
 messages: [
    {
    role: "system",
    content: `You write AI audit summaries.
Maximum 30 words.
Maximum 2 sentences.
Never exceed 30 words.`
  },
  {
    role: "user",
    content: prompt
  }
 ],

 model: "llama-3.3-70b-versatile",
 max_tokens: 40
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
  "AI summary temporarily unavailable , kindly go through our optimization report and check after some time ."
});
    }
})
// Make sure it looks for process.env.PORT first!
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running `);
});
