import { useState , useEffect} from "react";
import { analyze ,  analyzeOverall} from "./audit";
import { pricingData } from "./pricingData";
import SavingsChart from "./chart";

import {
  FaArrowUp,
  FaArrowDown
} from "react-icons/fa";

function App() {
  //set tools 
  const [tools, setTools] = useState(()=>{
    const savedTools = localStorage.getItem("aiTools");
    return savedTools 
    ?(JSON.parse(savedTools))
    :[
       {
          model: "",
          plan: "",
          users: "",
          uses: [],
        },
    ]
  });

  const [results, setResults] = useState([]);
  //set pricebased mode
 const [priceBased, setPriceBased] = useState(() => {

  const savedMode =
    localStorage.getItem("priceMode");

  return savedMode
    ? JSON.parse(savedMode)
    : false;

});
//loading 
const [loading,setLoading] = useState(false);
//AI summary 
  const [summary, setSummary] = useState("");
//save tools to localstoarge

useEffect(()=>{
  localStorage.setItem("aiTools",JSON.stringify(tools));
},[tools])

//save pricemode to localstorage 

useEffect(()=>{
  localStorage.setItem("priceMode",JSON.stringify(priceBased));
},[priceBased]);

  function handleChange(ind, field, value) {
    const updateTools = [...tools];
    updateTools[ind][field] = value;
    setTools(updateTools);
  }

  function addTool() {
    setTools([
      ...tools,
      {
        model: "",
        plan: "",
        users: "",
        uses: [],
      },
    ]);
  }

  function delTool(ind) {
    if (tools.length <= 1) return;

    const updatedTools = tools.filter((_, index) => index !== ind);
    setTools(updatedTools);

    const updatedResults = results.filter((_, index) => index !== ind);
    setResults(updatedResults);
  }

  const mo_totalsave = Math.round(results.reduce(
    (total, r) => total + r.monthlysave,
    0
  ));

  const year_totalsave = Math.round(results.reduce(
    (total, r) => total + r.yearlysave,
    0
  ));

  const useCases = ["coding", "research", "creativity", "productivity"];

  function toggleUse(index, use) {
    const updated = [...tools];
    const currentuses = updated[index].uses;

    if (currentuses.includes(use)) {
      updated[index].uses = currentuses.filter((u) => u !== use);
    } else {
      updated[index].uses = [...currentuses, use];
    }

    setTools(updated);
  }

  return (
    <div>
      <div className="header">
        <p>Dont Overestimate for AI credits</p>
        <p>
          Use AI-Credit saver and save upto <span>$10000</span> monthly
        </p>
      </div>
<div className="total_savings">
        <h2>
          Total Monthly Savings : <span>${mo_totalsave}</span>
        </h2>
        <h2>
          Total Yearly Savings : <span>${year_totalsave}</span>
        </h2>
      </div>
      
      {tools.map((tool, index) => {
        const availablePlans = tool.model
          ? Object.keys(pricingData[tool.model])
          : [];

        return (
          <div key={index} className="inputField">
            <h3>{index + 1}.</h3>

            <select
              value={tool.model}
              onChange={(e) =>
                handleChange(index, "model", e.target.value)
              }
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
              onChange={(e) =>
                handleChange(index, "plan", e.target.value)
              }
            >
              <option value="">Select Plan</option>
              {availablePlans.map((plan) => (
                <option key={plan} value={plan}>
                  {plan}
                </option>
              ))}
            </select>

            <input
              type="number"
              value={tool.users}
              placeholder="No of users"
              onChange={(e) =>
                handleChange(index, "users", e.target.value)
              }
            />

            <div className="useCases">
              {useCases.map((use) => (
                <button
                  key={use}
                  type="button"
                  className={
                    tool.uses.includes(use)
                      ? "use selected"
                      : "use"
                  }
                  onClick={() => toggleUse(index, use)}
                >
                  <span className="checkBox">
                    {tool.uses.includes(use) ? "✔" : ""}
                  </span>
                  {use}
                </button>
              ))}
            </div>

            <button id="delTool" onClick={() => delTool(index)}>
              Delete
            </button>
          </div>
        );
      })}
<label className="priceLabel">
  <input
    type="checkbox"
    className="pricebased"
    checked={priceBased}
    onChange={(e) => setPriceBased(e.target.checked)}
  />

  Optimize only for lowest price
</label>
      <button id="addTool" onClick={addTool}>
        Add
      </button>

      <button
        id="analyzeBtn"
        onClick={async () => {
          const hasEmptyField = tools.some((tool) => {
            return (
              tool.model === "" ||
              tool.plan === "" ||
              tool.users === ""||
              tool.users === "0"
            );
          });
           if (hasEmptyField) {
            alert("Please fill all fields with valid input ");
            return;
          }
         const noUsesSelected = tools.some((tool) => {
         return tool.uses.length === 0;
         });

         if (noUsesSelected && priceBased===false) {
          alert("Please select at least one use case Or analyze in price based mode");
              return;
             }
         

          let finalResults =  [];
          const overall = analyzeOverall(tools,priceBased);
          if(overall){
             finalResults = [overall];
          }
          else{
             finalResults =
      analyze(
        tools,
        priceBased
      );
          }
          setResults(finalResults);

          const monthlySavings = finalResults.reduce(
            (total, r) => total + r.monthlysave,
            0
          );

          const yearlySavings = finalResults.reduce(
            (total, r) => total + r.yearlysave,
            0
          );
         try {

  setLoading(true);

  const response = await fetch(
    "http://localhost:5000/summary",
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        results: finalResults,
        monthlySavings,
        yearlySavings,
      }),
    }
  );

  const data = await response.json();

  setSummary(data.summary);

}
catch (err) {

  console.log("failed to generate AI summary");

}
finally {

  setLoading(false);

}
        }
      }

      >
        Analyze
      </button>

      {loading && (
        <div className="loader"
        >
          <div className="spinner"></div>
          Generating your personalized  audit summary Aof your AI setup
        </div>
        )}

      <div className="resultContainer">
        {results.map((r, index) => (
          <section key={index} className="result">
             <h3>Optimization report</h3>
             <div className="chartWrapper">
          
            <div className="reco">
            <p>
             <strong> Current Spend : </strong>{" "}
             <span className="currPrice">${r.currentPrice} </span>
            </p>
              <p>
                <strong>Recommendation:</strong>{" "}
                <span className="recommend">{r.reco}</span>
              </p>
               <p>
             <strong> Optimized Spending : </strong>{" "}
             <span className="recoPrice">${r.recoPrice} </span>
            <span
  className={
    r.grade === "up"
    ? "upIcon"
    : "downIcon"
  }>
  {
    r.grade === "up" &&
    <FaArrowUp />
  }
  {
    r.grade === "down" &&
    <FaArrowDown />
  }
</span>
    
            </p>
              <p>
                <strong>Monthly Savings:</strong>{" "}
                <span className="savings">
                  ${r.monthlysave}
                </span>
              </p>

              <p>
                <strong>Yearly Savings:</strong>{" "}
                <span className="savings">
                  ${r.yearlysave}
                </span>
              </p>
              <p>
                <strong>Reason:</strong>{" "}
                <span className="reason">
                  {r.reason}
                </span>
              </p>
            </div>
         <SavingsChart 
            currentSpend={r.currentPrice}
            optimizedSpend={r.recoPrice}
            savings={r.monthlysave}/>
            </div>
          </section>
        ))}
      </div>
      {
  summary && (

    <div className="summaryCard">

      <h2>AI Audit Summary</h2>

      <p>{summary}</p>

    </div>

  )
}
    </div>
  );
}

export default App;