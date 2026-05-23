import { pricingData } from "./pricingData";


<<<<<<< HEAD
        case "chatgpt" :
            if(plan === "team" && users <= 2)  
            {
           //recommended spending
            const reco_price = pricingData[model]["pro"];
           //monthly savings
            const mo_save = (curr_price - reco_price)*users;
            const year_save = mo_save * 12;
          //push to array
           res.push({
           model : model,
           plan : plan ,
           reco :  "ChatGpt Pro Plan",
           monthlysave : mo_save,
           yearlysave : year_save
   })
}
 else if( plan==="team" && users>=3){
    
        //recommended spending
            const reco_price = pricingData["claude"]["team"];
        //monthly savings
            const mo_save = (curr_price - reco_price)*users;
            const year_save = mo_save * 12;
         res.push({
           model : model,
           plan : plan ,
           reco :  "Claude Team Plan",
           monthlysave : mo_save,
           yearlysave : year_save
   })
 }
 else {
   res.push({
      model,
      plan,
      reco : "Already optimized",
      monthlysave : 0,
      yearlysave : 0
   });
}
    break ;
 case "claude" :
    if(plan.toLowerCase() === "team" && users <= 2)  
            {
           //recommended spending
            const reco_price = pricingData[model]["pro"];
           //monthly savings
            const mo_save = (curr_price - reco_price)*users;
            const year_save = mo_save * 12;
          //push to array
           res.push({
           model : model,
           plan : plan ,
           reco :  "claude Pro Plan",
           monthlysave : mo_save,
           yearlysave : year_save
   })
}
else {
   res.push({
      model,
      plan,
      reco : "Already optimized",
      monthlysave : 0,
      yearlysave : 0
   });
}
 break;
    case "perplexity" :
        if(plan === "team" && users<=2){
            //recommended spending
            const reco_price = pricingData[model]["pro"];
           //monthly savings
            const mo_save = (curr_price - reco_price)*users;
            const year_save = mo_save * 12;
          //push to array
           res.push({
           model : model,
           plan : plan ,
           reco :  "Perplexity Pro Plan",
           monthlysave : mo_save,
           yearlysave : year_save
   })
        }
        
        else if(plan==="team" && users>=3){
            //recommended spending
            const reco_price = pricingData["claude"]["team"];
        //monthly savings
            const mo_save = (curr_price - reco_price)*users;
            const year_save = mo_save * 12;
         res.push({
           model : model,
           plan : plan ,
           reco :  "Claude Team Plan",
           monthlysave : mo_save,
           yearlysave : year_save
   })
        }
        else {
   res.push({
      model,
      plan,
      reco : "Already optimized",
      monthlysave : 0,
      yearlysave : 0
   });
}
break;
=======
>>>>>>> fe0bfbf (Improved recommendation logic based on usesof model and point based system based on use and plan price)

// CAPABILITY SCORE


function getCapabilityScore(model, plan, uses) {

  const capabilities =
    pricingData[model][plan].capabilities;

  let total = 0;

  uses.forEach((use) => {

    total += capabilities[use];

  });

  return total;

}


// VALUE SCORE

function getValueScore(model, plan, uses) {

  const capabilityScore =
    getCapabilityScore(model, plan, uses);

  const price =
    pricingData[model][plan].price;

  return capabilityScore / price;

}

// CAPABILITY 


function isValidPlan(model, plan, uses) {

  const capabilities =
    pricingData[model][plan].capabilities;

  for (const use of uses) {

    // if any selected use is weak
    if (capabilities[use] < 8) {

      return false;

    }

  }

  return true;

}

// BUSINESS

function isBusinessValid(plan, users) {

  // team plan unnecessary
  // for very small usage

  if (plan === "team" && users <= 2) {

    return false;

  }

  // check if 

  if (
    (plan === "pro" ||
     plan === "go" ||
     plan === "plus")
     &&
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

    const currentModel =
      tool.model;

    const currentPlan =
      tool.plan;

    const users =
      Number(tool.users);

    const uses =
      tool.uses;


    // CURRENT PLAN INFO


    const currentPrice =
      pricingData[currentModel]
      [currentPlan]
      .price;

    const currentScore =
      getValueScore(
        currentModel,
        currentPlan,
        uses
      );



    // TRACK BEST OPTION


    let bestScore =
      currentScore;

    let bestModel =
      currentModel;

    let bestPlan =
      currentPlan;



    // LOOP ALL MODELS

    Object.keys(pricingData)
      .forEach((model) => {

        Object.keys(pricingData[model])
          .forEach((plan) => {


            // SKIP SAME PLAN
         
            if (
              model === currentModel &&
              plan === currentPlan
            ) {

              return;

            }



          
            // BUSINESS FILTER
           

            if (
              !isBusinessValid(
                plan,
                users
              )
            ) {

              return;

            }



          
            // CAPABILITY FILTER
           

            if (
              !isValidPlan(
                model,
                plan,
                uses
              )
            ) {

              return;

            }



            // SCORE THIS PLAN
     
            const score =
              getValueScore(
                model,
                plan,
                uses
              );



          
            // BETTER OPTION FOUND
            
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


    
    // RECOMMENDATION
  

    if (
      bestModel !== currentModel ||
      bestPlan !== currentPlan
    ) {

      const recommendedPrice =
        pricingData[bestModel]
        [bestPlan]
        .price;


      const monthlysave =
        (currentPrice - recommendedPrice)
        * users;


      const yearlysave =
        monthlysave * 12;



      results.push({

        model:
          currentModel,

        plan:
          currentPlan,

        reco:
          `${bestModel} ${bestPlan}`,

        monthlysave:
          monthlysave > 0
            ? monthlysave
            : 0,

        yearlysave:
          yearlysave > 0
            ? yearlysave
            : 0

      });

    }



    // ALREADY OPTIMIZED

    else {

      results.push({

        model:
          currentModel,

        plan:
          currentPlan,

        reco:
          "Already optimized",

        monthlysave: 0,

        yearlysave: 0

      });

    }

  });


  return results;

}