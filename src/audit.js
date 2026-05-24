import { pricingData } from "./pricingData";

// CAPABILITY SCORE
function getCapabilityScore(model, plan, uses) {
  const capabilities = pricingData[model][plan].capabilities;

  let total = 0;

  uses.forEach((use) => {
    total += capabilities[use];
  });

  return total;
}

// VALUE SCORE
function getValueScore(model, plan, uses) {
  const capabilityScore = getCapabilityScore(model, plan, uses);
  const price = pricingData[model][plan].price;

  return capabilityScore / price;
}

// CAPABILITY CHECK
function isValidPlan(model, plan, uses) {
  const capabilities = pricingData[model][plan].capabilities;

  for (const use of uses) {
    if (capabilities[use] < 8) {
      return false;
    }
  }

  return true;
}

// BUSINESS RULES
function isBusinessValid(plan, users) {
  if (plan === "team" && users <= 2) return false;

  if (
    (plan === "pro" || plan === "go" || plan === "plus") &&
    users >= 5
  ) {
    return false;
  }

  return true;
}

function getFallbackPlan(model, users) {
  const plans = Object.keys(pricingData[model]);

  if (users <= 2) {
    return plans.includes("pro") ? "pro" : plans[0];
  }

  if (users >= 5) {
    return plans.includes("team") ? "team" : "pro";
  }

  return plans[0];
}

// MAIN ANALYZE FUNCTION
export function analyze(tools) {
  let foundBetterOption = false;
  const results = [];

  tools.forEach((tool) => {
    const currentModel = tool.model;
    const currentPlan = tool.plan;
    const users = Number(tool.users);
    const uses = tool.uses;

    const currentPrice =
      pricingData[currentModel][currentPlan].price;

    const currentScore =
      getValueScore(currentModel, currentPlan, uses);

    let bestScore = currentScore;
    let bestModel = currentModel;
    let bestPlan = currentPlan;

    Object.keys(pricingData).forEach((model) => {
      Object.keys(pricingData[model]).forEach((plan) => {
        if (model === currentModel && plan === currentPlan) return;

        if (!isBusinessValid(plan, users)) return;

        if (!isValidPlan(model, plan, uses)) return;

        const score = getValueScore(model, plan, uses);

        if (score > bestScore) {
          bestScore = score;
          bestModel = model;
          bestPlan = plan;
          foundBetterOption = true;
        }
      });
    });

    if (!foundBetterOption) {
      const fallbackPlan = getFallbackPlan(currentModel, users);

      bestModel = currentModel;
      bestPlan = fallbackPlan;
      bestScore = getValueScore(currentModel, fallbackPlan, uses);
    }

    if (bestModel !== currentModel || bestPlan !== currentPlan) {
      const recommendedPrice =
        pricingData[bestModel][bestPlan].price;

      const monthlysave =
        (currentPrice - recommendedPrice) * users;

      const yearlysave = monthlysave * 12;

      results.push({
        model: currentModel,
        plan: currentPlan,
        reco: `${bestModel} ${bestPlan}`,
        monthlysave: monthlysave > 0 ? monthlysave : 0,
        yearlysave: yearlysave > 0 ? yearlysave : 0,
      });
    } else {
      results.push({
        model: currentModel,
        plan: currentPlan,
        reco: "Already optimized",
        monthlysave: 0,
        yearlysave: 0,
      });
    }
  });

  return results;
}