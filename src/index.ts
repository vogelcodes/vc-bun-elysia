import { Elysia } from "elysia";
import { cron } from '@elysiajs/cron'


// leads = [new Date().toISOString()].concat(leads.slice(1));
var leadsSheet = await fetch(
  "https://script.google.com/macros/s/AKfycbwIAj1HWYmqEeF7I_A3WfJGoshnPzSbQLDYir00RhgoWs1QsRj5nLAsEUIAGYuD7DfopQ/exec", {
    
     
  }
);
let leads = await leadsSheet.json();
leads = leads.slice(1).sort((a: string[], b: string[]) => {
  return new Date(b[4]).getTime() - new Date(a[4]).getTime();
});
const app = new Elysia()
.use(cron({name: "get-leads", pattern: "0 */5 * * * *", async run() {
    leadsSheet = await fetch(
    "https://script.google.com/macros/s/AKfycbwIAj1HWYmqEeF7I_A3WfJGoshnPzSbQLDYir00RhgoWs1QsRj5nLAsEUIAGYuD7DfopQ/exec", {
      
       
    }
  );
  leads = await leadsSheet.json();
  leads = leads.slice(1).sort((a: string[], b: string[]) => {
    return new Date(b[4]).getTime() - new Date(a[4]).getTime();
  });

}}))
.get("/", () => "VogelCode-API")


.get('/leads', async ({params, query})=>{
  let leadCount = leads.length;
  let page = query.page ? parseInt(query.page) : 1;
  let pageSize = query.pageSize ? parseInt(query.pageSize) : 10;
  console.log(page, pageSize)
  return Response.json(leads.slice((page-1)*pageSize, page*pageSize), );


})
.listen(3000)

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
