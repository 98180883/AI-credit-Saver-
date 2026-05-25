import { useState } from "react";
import { analyze } from "./audit";
import { pricingData } from "./pricingData";

function App() {
  const [tools, setTools] = useState([
    {
      model: "",
      plan: "",
      users: "",
      uses: [],
    },
  ]);

  const [results, setResults] = useState([]);
  const [priceBased, setPriceBased] = useState(false);
  const [summary, setSummary] = useState("");

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

  const mo_totalsave = results.reduce(
    (total, r) => total + r.monthlysave,
    0
  );

  const year_totalsave = results.reduce(
    (total, r) => total + r.yearlysave,
    0
  );

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

      <label>
        <input
          type="checkbox"
          checked={priceBased}
          onChange={(e) => setPriceBased(e.target.checked)}
        />
        Optimize purely for lowest price
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
              tool.users === ""
            );
          });

          if (hasEmptyField) {
            alert("Please fill all fields");
            return;
          }

          const res = analyze(tools, priceBased);
          setResults(res);

          const monthlySavings = res.reduce(
            (total, r) => total + r.monthlysave,
            0
          );

          const yearlySavings = res.reduce(
            (total, r) => total + r.yearlysave,
            0
          );

          await fetch("http://localhost:5000/summary", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              results: res,
              monthlySavings,
              yearlySavings,
            }),
          });

          const response = await fetch(
            "http://localhost:5000/summary"
          );
          const data = await response.json();
          setSummary(data.summary);
        }}
      >
        Analyze
      </button>

      <div className="total_savings">
        <h2>
          Total Monthly Savings : <span>${mo_totalsave}</span>
        </h2>
        <h2>
          Total Yearly Savings : <span>${year_totalsave}</span>
        </h2>
      </div>

      <div className="resultContainer">
        {results.map((r, index) => (
          <section key={index} className="result">
            <h3>
              Using : {r.model} {r.plan}
            </h3>

            <div className="reco">
              <p>
                <strong>Recommendation:</strong>{" "}
                <span className="recommend">{r.reco}</span>
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
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}

export default App;