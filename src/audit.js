import { pricingData } from "./pricingData";

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


// CHECK IF MODEL IS CAPABLE
function iscapablePlan(model, plan, uses) {

  const capabilities =
    pricingData[model][plan].capabilities;

  for (const use of uses) {

    // if any selected use is weak
    if (capabilities[use] < 7) {

      return false;

    }

  }

  return true;

}

//find valid tream size 

function isvalidSize(model,plan,users){
  const planData = pricingData[model][plan];
  if(users < planData.minUsers){
    return false;
  }
  if(users > planData.maxUsers){
    return false;
  }
  return true;
}


// REASON FUNCTION
function getRecommendationReason(
  currentModel,
  currentPlan,
  bestModel,
  bestPlan,
  currentPrice,
  recommendedPrice,
  currentScore,
  bestScore,
  users
) {

  if (

    currentModel === bestModel &&
    currentPlan === bestPlan

  ) {

    return "Your current AI setup already provides a strong balance between pricing and performance.";

  }
  
// BETTER TEAM FIT
  const bestLimits =
    pricingData[bestModel][bestPlan];

  if (
 currentPlan !== bestPlan &&
 (
   users < pricingData[currentModel][currentPlan].minUsers ||
   users > pricingData[currentModel][currentPlan].maxUsers
 )
) {

    return `${bestModel} ${bestPlan} is a better fit for your current team size and usage requirements.`;

  }


  // BETTER VALUE SCORE
  if (bestScore > currentScore) {

    // CHEAPER + BETTER
    if (recommendedPrice < currentPrice) {

      return `${bestModel} ${bestPlan} offers better value while also reducing overall subscription cost.`;

    }

    // BETTER PERFORMANCE
    return `${bestModel} ${bestPlan} provides stronger capabilities and better productivity value for your selected use cases.`;

  }


  // DEFAULT
  return `Based on your selected use cases and team size, ${bestModel} ${bestPlan} appears to be a more optimized choice.`;

}


//fallback plan 
function getFallbackPlan(model, users) {

  const plans =
    Object.keys(pricingData[model]);

  for (const plan of plans) {

    const currentPlan =
      pricingData[model][plan];

    if (

      users >= currentPlan.minUsers &&

      users <= currentPlan.maxUsers

    ) {

      return plan;

    }

  }

  // if nothing matches
  return null;

}
//get grade
function getGrade(currPrice,recoPrice){
  if(currPrice < recoPrice){
    return "up";
  }
  else if(currPrice === recoPrice){
 return "same";
  }
  else{
    return "down";
  }
}
//one recommendation function 
export function analyzeOverall(tools, priceBased){
  //get all uses
  const allUses = [];
  tools.forEach((tool)=>{
    tool.uses.forEach((use)=>{
      if(!allUses.includes(use)){
        allUses.push(use);
      }
    })
  })
  // get total max users 
 let totalUsers = 0 ;
  tools.forEach((tool)=>{
    //get the most user
   if(Number(tool.users) > totalUsers){

    totalUsers = Number(tool.users);

  }
  });

  //get current price 
  let currentTotalPrice = 0;
  tools.forEach((tool)=>{
    const price = pricingData[tool.model][tool.plan].price;

    currentTotalPrice += price * Number(tool.users);
  });

//track best 
  let bestModel = null;
let bestPlan = null;
let bestPrice = Infinity;
let bestScore = 0;

Object.keys(pricingData).forEach((model) => {

  Object.keys(pricingData[model]).forEach((plan) => {
   //check valid size
   if(!isvalidSize(model, plan, totalUsers)){
  return;
}
//check capabilty 
if(!iscapablePlan(model, plan, allUses)){
  return;
}

//total price 
const price =
  pricingData[model][plan].price
  * totalUsers;
//score
const score =
  getValueScore(model, plan, allUses);
 //analyze only based on price
  if(priceBased){

  if(price < bestPrice){

    bestPrice = price;
    bestModel = model;
    bestPlan = plan;
    bestScore = score;

  }

}
//normal value based analyze
else{
   if(score > bestScore){

    bestScore = score;
    bestPrice = price;
    bestModel = model;
    bestPlan = plan;

  }

}


});

});
// if no single best found
if(!bestModel || bestPrice >= currentTotalPrice){
  return null;
}
const monthlysave =
  currentTotalPrice - bestPrice;

const yearlysave =
  monthlysave * 12;
  //return object
 return {

  reco:
    `${bestModel} ${bestPlan}`,

  reason:
    `A single AI stack can handle all selected use cases more efficiently.`,

  monthlysave:
    Math.round(monthlysave),

  yearlysave:
    Math.round(yearlysave),

  currentPrice:
    currentTotalPrice,

  recoPrice:
    bestPrice,

  grade:
    getGrade(
      currentTotalPrice,
      bestPrice
    )

};


}



// MAIN ANALYZE FUNCTION
export function analyze(tools, priceBased) {

  const results = [];

  tools.forEach((tool) => {

    let foundBetterOption = false;

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

    let bestPrice =
      currentPrice;


    
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
            if (!isvalidSize(model,plan,users))
               {
              return;
            }


            // CAPABILITY FILTER
            if (

              !iscapablePlan(
                model,
                plan,
                uses
              )

            ) {

              return;

            }


            // SCORE
            const score =
              getValueScore(
                model,
                plan,
                uses
              );


            const price =
              pricingData[model]
              [plan]
              .price;


            // PRICE BASED MODE
            if (priceBased) {

              if (price < bestPrice) {

                bestPrice = price;

                bestModel = model;

                bestPlan = plan;

                bestScore = score;

                foundBetterOption = true;

              }

            }


      
            else {

              if (score > bestScore) {

                bestScore = score;

                bestModel = model;

                bestPlan = plan;

                bestPrice = price;

                foundBetterOption = true;

              }

            }

          });

      });


    // FALLBACK
    if (!foundBetterOption) {

      const fallbackPlan =
        getFallbackPlan(
          currentModel,
          users
        );
      if (!fallbackPlan) {

  bestModel = currentModel;
  bestPlan = currentPlan;
    

}
        else{
      bestModel =
        currentModel;

      bestPlan =
        fallbackPlan;
      
     
      }
       bestScore =
        getValueScore(
          bestModel,
          bestPlan,
          uses
        );
    }


    // RECOMMENDED PRICE
    const recommendedPrice =
      pricingData[bestModel]
      [bestPlan]
      .price;


    // SAVINGS
    const monthlysave =
      (currentPrice - recommendedPrice)
      * users;


    const yearlysave =
      monthlysave * 12;


    // REASON
    const reason =
      getRecommendationReason(
        currentModel,
        currentPlan,
        bestModel,
        bestPlan,
        currentPrice,
        recommendedPrice,
        currentScore,
        bestScore,
        users
      );

  const grade = getGrade(currentPrice,recommendedPrice);
       

    // FINAL RESULT
    if (

      bestModel !== currentModel ||
      bestPlan !== currentPlan

    ) {

      results.push({



        currentModel : currentModel , 
        currentPlan :currentPlan,
         reco:
          `${bestModel} ${bestPlan}`,

        reason:
          reason,

        monthlysave:
          monthlysave > 0
            ? Math.round(monthlysave)
            : 0,

        yearlysave:
          yearlysave > 0
            ? Math.round(yearlysave)
            : 0,
        currentPrice:currentPrice,
        recoPrice:  recommendedPrice,
        grade : grade
      });

    }



    // ALREADY OPTIMIZED
    else {

      results.push({

      

        reco:
          "Already optimized",

        reason:
          "Your current setup already appears optimized for your selected use cases and team size.",

        monthlysave:
          0,

        yearlysave:
          0,
       currentPrice:currentPrice,
        recoPrice:  recommendedPrice
      });

    }

  });

  return results;

}