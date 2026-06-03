import { useState , useEffect} from "react";
import { analyze ,  analyzeOverall} from "./audit";
import { pricingData } from "./pricingData";
import SavingsChart from "./chart";
import { useRef } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";



import {
  FaArrowUp,
  FaArrowDown
} from "react-icons/fa";
import { FaFileDownload } from "react-icons/fa";
import { FaHistory } from "react-icons/fa";
import {IoMdAddCircle } from "react-icons/io";
import { IoAnalyticsSharp } from "react-icons/io5";
import { MdBolt } from "react-icons/md";
import {MdDeleteOutline } from "react-icons/md";
import { MdCheckBoxOutlineBlank } from "react-icons/md";
import { IoMdCheckbox } from "react-icons/io";
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

//history button state toggle 
const [showHist ,setshowHist] = useState(false)
//history using localstoage 
const [lastreports , setlastReports] = useState(()=>{
  const savedReports = localStorage.getItem("reportHist");
  return savedReports ? JSON.parse(savedReports) : []
})
//open and close history cards details 
const [openCards,setopenCards]=useState({});
//error message 
const [errMsg,seterrMsg]=useState("");
//save tools to localstoarge
useEffect(()=>{
  localStorage.setItem("aiTools",JSON.stringify(tools));
},[tools])

//save pricemode to localstorage 
useEffect(()=>{
  localStorage.setItem("priceMode",JSON.stringify(priceBased));
},[priceBased]);

//save report history to localstoarge
useEffect(()=>{
  localStorage.setItem("reportHist",JSON.stringify(lastreports));
},[lastreports]);



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
//pdf export 
const reportRef = useRef();

async function exportPdf() {
  //if null
  

  const canvsObject = await html2canvas(reportRef.current);
  const imgData = canvsObject.toDataURL("image/png");
  const newPdf = new jsPDF({orientation: "landscape"});

  const pageWidth = newPdf.internal.pageSize.getWidth();
  const pageHeight = newPdf.internal.pageSize.getHeight();

  const imgWidth = pageWidth;
  //maintain aspect ratio
  const imgHeight = (canvsObject.height * imgWidth) / canvsObject.width;
  const y =(pageHeight - imgHeight) / 2;

  newPdf.addImage(
  imgData,
  "PNG",
  0,
  y,
  imgWidth,
  imgHeight
);
 newPdf.save("AI-Cost-Saver-Report.pdf");
}



  return (
    <div className="main">
      
      <div className="header">

  <div className="headerTitle">
    <span><MdBolt className="headerIcon"/> AI-Spend Optimizer</span>

    <p>Don't Overestimate for AI Credits</p>
  </div>

  <p>
    Use AI-Credit Saver and save up to <span>$10000</span> monthly
  </p>

</div>
{results.length>0 &&
<div className="total_savings">
        <h2>
          Total Monthly Savings : <span>${mo_totalsave}</span>
        </h2>
        <h2>
          Total Yearly Savings : <span>${year_totalsave}</span>
        </h2>
      </div>
}
 <h3>Tell us about your current AI setup</h3>

      {tools.map((tool, index) => {
        const availablePlans = tool.model
          ? Object.keys(pricingData[tool.model])
          : [];

        return (
         <div key={index} className="inputField">
            
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
              { useCases.map((use) => (
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
                  
                   {tool.uses.includes(use) ? <IoMdCheckbox />:  <MdCheckBoxOutlineBlank/>}
                  
                  {use}
                </button>
              ))}
            </div>

            <button id="delTool" onClick={() => delTool(index)}>
              Delete <MdDeleteOutline className="icons"/>
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
        Add <IoMdAddCircle className="icons"/>
      </button>

      <button
        id="analyzeBtn"
        onClick={async () => {
          seterrMsg("");
          const hasEmptyField = tools.some((tool) => {
            return (
              tool.model === "" ||
              tool.plan === "" ||
              tool.users === ""||
              tool.users === "0"
            );
          });
           if (hasEmptyField) {
            seterrMsg("Please fill all fields with valid input ");
            return;
          }
         const noUsesSelected = tools.some((tool) => {
         return tool.uses.length === 0;
         });

         if (noUsesSelected && priceBased===false) {
         seterrMsg("Please select at least one use case Or analyze in price based mode");
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
           const monthlySavings = finalResults.reduce(
            (total, r) => total + r.monthlysave,
            0
          );

          const yearlySavings = finalResults.reduce(
            (total, r) => total + r.yearlysave,
            0
          );
          setResults(finalResults);
          setlastReports(prev=>[{
            date : new Date().toLocaleString(),
            tools:[...tools],
            results:finalResults,
            monthlySavings,
            yearlySavings
          },
        ...prev
      ].slice(0,3));

         
         try {

  setLoading(true);

  const response = await fetch(
    "https://ai-credit-saver.onrender.com/summary",
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
      <IoAnalyticsSharp className="icons"/> Analyze
      </button>
 
 {
  errMsg && 
  <div className="errMsg">
    <p>{errMsg}</p>
  </div>
 }
   

    {results.length>0 &&
      <div className="resultContainer">
        {results.map((r, index) => (
          <section key={index} 
          className="result"
           ref = {index===0 ? reportRef : null}>
            
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
                <button className="downloadBtn" onClick={exportPdf}>
                <FaFileDownload className="Icon"/> Download AI-Powered Optimization Report 
                 </button>
            </div>
         <SavingsChart 
            currentSpend={r.currentPrice}
            optimizedSpend={r.recoPrice}
            savings={r.monthlysave}/>
            </div>
            
          </section>
        ))}
      </div>
}      
        {loading && !summary && (
        <div className="loader"
        >
          <div className="spinner"></div>
          Generating your personalized AI audit summary
        </div>
        )}
      
      {
  summary && (

    <div className="summaryCard">

      <h2>AI Audit Summary</h2>

      <p>{summary}</p>

    </div>

  )
}<button className="historyBtn" onClick={() => setshowHist(!showHist)}>
  <FaHistory className="icons" />
  <span>{showHist ? "Hide History" : "History"}</span>
</button>
        {
        showHist && (<div className="histSection">
           
           {lastreports.map((audit,index)=>(
       <div key={index} className="histCard">
                <p>
                  Date : {audit.date}
                </p>
               
                 <p>
                 <span className="setup">Optimized AI setup :</span> <span className="model">{audit.results[0].reco}</span>
                  </p>
                <p>
                  <span className="setup">Monthly Savings: </span> <span className="savings">${audit.monthlySavings}</span>
                  </p>
                  <p>
                   <span className="setup">Yearly Savings :</span> <span className="savings">${audit.yearlySavings}</span> 
                  </p>
                 <button 
                 className="showDetailsBtn" 
                 onClick={()=>{
                  setopenCards(prev=>({
                    ...prev,
                    [index]:!prev[index]
                  }))
                 }}
                 >
                  {
                    openCards[index] 
                    ? "Hide details"
                    :"Show details"
                  }
                 </button>
                 {openCards[index] && (
                   <div className="currentSetup">
                 <h4>Current Setup :</h4>
                 {audit.tools.map((tool,index)=>(
                 <div key={index}>
                 <p>
                  <span className="setup">Model: </span> 
                  <span className="model">
                    {tool.model} {tool.plan}
                     ({tool.users} users) </span>
                </p>

                <p>
               <span className="setup">Uses: </span>{tool.uses.join(", ")}
                </p>
                <p>
                <span className="setup">Current Spending: </span> <span className="currSpend">${audit.results[0].currentPrice} </span>  
                </p>
                <p>
                 <span className="setup">Optimized Spending: </span> <span className="savings">${audit.results[0].recoPrice}  </span> 
                </p>
          
         </div>
  ))}
</div>
                 )}
               </div>
           ))}
           
          </div>
          )
          }
    </div>
  );
}

export default App;