   import { pricingData } from "./pricingData";
   //analyze
   export function analyze(tools){
    const res = [];
    tools.forEach((tool) => {

      const model = tool.model;
      const plan = tool.plan;
      const users = Number(tool.users);
       //user spends
       const curr_price = pricingData[model]?.[plan];
       
      //conditions
      switch(model){

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

case "copilot" :
    if(plan==="team" && users<=2){
         //recommended spending
            const reco_price = pricingData[model]["pro"];
           //monthly savings
            const mo_save = (curr_price - reco_price)*users;
            const year_save = mo_save * 12;
          //push to array
           res.push({
           model : model,
           plan : plan ,
           reco :  "Gemini Pro Plan",
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

    //case default 
    default :
        res.push({
            model:model,
            plan:plan,
            reco : "No recommendation found !",
            monthlysave:0,
            yearlysave:0
        })
      }
    })

return res; //set to results
   }
