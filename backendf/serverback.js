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
Generate a customized AI spend audit summary in simple professional language.

Include:
- savings amount
- recommended model and plan
- why the recommendation is useful

Do NOT include the phrase:
"Your AI spend audit summary"

If no savings are identified AND the recommendation is already optimized,
respond with:
"Your current AI spending already appears optimized."

If no savings are identified BUT the recommended model or plan is different from the current setup,
explain that the recommendation is a better fit for the user's team size and selected use cases.
If  No valid plan found mention we could not found any valid plan for your team size ! 
Do NOT mention:
- Monthly savings: $0
- Yearly savings: $0

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

Reasons:
${results.map(r => r.reason).join(", ")}

Keep the response under 100 words.
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
  "AI summary temporarily unavailable , kindly go through our optimization report and check after some time ."
});
    }
})
// Make sure it looks for process.env.PORT first!
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
