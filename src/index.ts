import { Elysia } from "elysia";

const app = new Elysia().get("/", () => "VogelCode-API")

.get('/leads', async ()=>{  
  const gsResponse = await fetch(
    "https://script.google.com/macros/s/AKfycbwIAj1HWYmqEeF7I_A3WfJGoshnPzSbQLDYir00RhgoWs1QsRj5nLAsEUIAGYuD7DfopQ/exec",
  );
  let leads = await gsResponse.json();

  leads = leads.slice(1).sort((a: string[], b: string[]) => {
    return new Date(b[4]).getTime() - new Date(a[4]).getTime();
  });
  // leads = [new Date().toISOString()].concat(leads.slice(1));
  return Response.json(leads);


  return leads.json()
})
.listen(3000)

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
