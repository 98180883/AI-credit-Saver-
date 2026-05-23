import { useState } from "react";
import { analyze } from "./audit";
function App() {

  const [tools, setTools] = useState([
    {
     model : "",
     plan : "",
     users:"",
     uses:[]
    }
  ]);
  //result 
  const [results,setResults] = useState([]);
  //change function 
  function handleChange(ind , field , value){
      const updateTools = [...tools]; // make a copy
      updateTools[ind][field] = value;
      setTools(updateTools);
  }

  //addTool
  function addTool(){
    setTools([
      ...tools, // keeping old enteries
      //creating new tool
      {
        model : "",
     plan : "",
     users:"",
    uses:[]
      }
    ])
  }
  //delete tool 

  function delTool(ind){
    if(tools.length <= 1){
      return ;
    }
    const updatedTools = tools.filter((_,index) => index !== ind);
    setTools(updatedTools);
    const updtedresult = results.filter((_,index) => index !== ind);
    setResults(updtedresult);
  }

//monthly total savings

const mo_totalsave = results.reduce((total , r) => {
  return total + r.monthlysave;
},
0
)
//yearly save 
const year_totalsave = results.reduce((total , r) => {
  return total + r.yearlysave;
},
0
)

//usecases 
const useCases = [
  "coding",
  "research",
  "creativity",
  "productivity",
];
//function to toggle uses

   function toggleUse(index,use){
    const updated = [...tools];
    const currentuses = updated[index].uses;
    //check if exist then delete
    if(currentuses.includes(use)){
      updated[index].uses = currentuses.filter(u => u!=use);
    }
    //add
    else{
      updated[index].uses= [...currentuses,use];
    }

  setTools(updated);
   }

  return (
   <div>
     <div className="header"><p>Dont Overestimate for AI credits </p> 
     <p>Use AI-Credit saver and save upto <span>$10000 </span>monthly</p>
     </div>
      {tools.map((tool, index) => (
        <div key={index} className="inputField">
       <h3>{index+1}. </h3>

         <select
      value={tool.model}
      onChange= {(e) => {
        handleChange(index , "model" , e.target.value)
      }}
    >
       <option value="">Select Model</option>

  <option value="chatgpt">ChatGPT</option>

  <option value="claude">Claude</option>

  <option value="cursor">Cursor</option>

  <option value="copilot">Copilot</option>

  <option value="perplexity">Perplexity</option>

</select>

      <select
      value={tool.plan}
      onChange= {(e) => {
        handleChange(index , "plan" , e.target.value)
      }}
    >
         <option value="">Select Plan</option>

  <option value="pro">Pro</option>

  <option value="team">Team</option>


</select>

     <input
      type="number"
      value={tool.users}
      placeholder="No of users"
      onChange= {(e) => {
        handleChange(index , "users" , e.target.value)
      }}
    />
<div className="useCases">

  {useCases.map((use) => (

    <button
      type="button"

      key={use}

      className={
        tool.uses.includes(use)
          ? "use selected"
          : "use"
      }

      onClick={() => toggleUse(index, use)}
    >

      <span className="checkBox">

        {
          tool.uses.includes(use)
            ? "✔"
            : ""
        }

      </span>

      {use}

    </button>

  ))}

</div>

    <button id="delTool" onClick={() => delTool(index)}> Delete</button>
     </div>
     ))}


     <button id="addTool" onClick={addTool}>Add</button>
     <button id="analyzeBtn" onClick={()=>{
      const res = analyze(tools);
<<<<<<< HEAD
      setResults(res)
=======
      setResults(res);
      const monthlySavings = res.reduce((total, r) => {
  return total + r.monthlysave;
}, 0);

const yearlySavings = res.reduce((total, r) => {
  return total + r.yearlysave;
}, 0);
      const response = await fetch(
 "http://localhost:5000/summary",

 {
   method: "POST",

   headers: {
     "Content-Type": "application/json"
   },

   body: JSON.stringify({

     results: res,
monthlySavings,
yearlySavings
   })
 }
);
const data = await response.json();
const summary = data.summary;
setSummary(summary);
>>>>>>> fe0bfbf (Improved recommendation logic based on usesof model and point based system based on use and plan price)
     }}>Analyze</button>

      <div className="total_savings">
        <h2>Total Monthly Savings : <span>${mo_totalsave}</span></h2>
        <h2>Total Yearly Savings : <span>${year_totalsave}</span></h2>
      </div>

<div className="resultContainer">
     {results.map((r,index) => (
      <section key={index} className="result">
       <h3>Model : {r.model} 
        <br />
        Plan : {r.plan}</h3>
        <div className="reco">
       <p>Recommendation : <span className="recommend"> {r.reco}</span>
        </p>
        <p>Monthly Savings :  <span className="savings">${r.monthlysave}</span>
        </p>
        <p>Yearly Savings : <span className="savings">${r.yearlysave}</span>
        </p>
        </div>
      </section>
     ))}
    </div>  
    </div>
  );
}

export default App;