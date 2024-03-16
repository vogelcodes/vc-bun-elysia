import { Elysia } from "elysia";
import { html } from '@elysiajs/html'
import { cron } from '@elysiajs/cron'

//HOTMART

async function getData() {
  async function getAccessToken() {
    try {
      const response = await fetch(
        "https://api-sec-vlc.hotmart.com/security/oauth/token?grant_type=client_credentials",
        {
          method: "POST",
          headers: config.headers,
          body: JSON.stringify(data),
        }
      );
      return await response.json();
    } catch (error) {
      console.error(error);
    }
  }
  const clientId = process.env.CLIENT_ID;
  const clientSecret = process.env.CLIENT_SECRET;
  const basicAuth = Buffer.from(`${clientId}:${clientSecret}`).toString(
    "base64"
  );
  const data = {
    client_id: clientId,
    client_secret: clientSecret,
    grant_type: "client_credentials",
  };

  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${basicAuth}`,
    },
  };

  // Call getAccessToken() once at the beginning of the script and store the resulting access token in a constant

  async function init() {
    let { access_token } = await getAccessToken();
    async function makeApiRequest() {
      // Reuse the access_token in subsequent API requests
      const queryParams = {
        start_date: new Date("2022-02-18T08:30:00.000Z").getTime(),
        end_date: new Date().getTime(),
        max_results: 1000,
        transaction_status: "APPROVED",
      };

      const apiConfig = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
        next: {
          revalidate: 600,
        },
      };
      let payments;
      try {
        payments = await fetch(
          `https://developers.hotmart.com/payments/api/v1/sales/history?max_results=${queryParams.max_results}&transaction_status=APPROVED,COMPLETE&start_date=${queryParams.start_date}&end_date=${queryParams.end_date}`,
          apiConfig
        );

      } catch (error) {
        console.error(error);
      }
      return payments?.json();
    }
    const apiResponse = makeApiRequest();
    return apiResponse;
  }
  const response = await init();
  return response;
}

// leads = [new Date().toISOString()].concat(leads.slice(1));
var leadsSheet = await fetch(
  "https://script.google.com/macros/s/AKfycbwIAj1HWYmqEeF7I_A3WfJGoshnPzSbQLDYir00RhgoWs1QsRj5nLAsEUIAGYuD7DfopQ/exec", {
    
     
  }
);
let leads: string[][] = await leadsSheet.json();
leads = leads.slice(1).sort((a: string[], b: string[]) => {
  return new Date(b[4]).getTime() - new Date(a[4]).getTime();
});
let sales = await getData();
let clientsEmail = sales.items.map((client: { buyer: { email: string; }; }) => client.buyer.email);

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
.use(cron({name: "get-sales", pattern: "0 */5 * * * *", async run() {
  sales = await getData();
  clientsEmail = sales.items.map((client: { buyer: { email: string; }; }) => client.buyer.email);
}
}))


// .get('/leads', async ({params, query})=>{
//   let leadCount = leads.length;
//   let page = query.page ? parseInt(query.page) : 1;
//   let pageSize = query.pageSize ? parseInt(query.pageSize) : 10;
//   console.log(page, pageSize)
//   return Response.json(leads.slice((page-1)*pageSize, page*pageSize), );
  
  
// })
.use(html()).get('/leads-html', ({query}) =>{
  let leadCount = leads.length;
  let page = query.page ? parseInt(query.page) : 1;
  let pageSize = query.pageSize ? parseInt(query.pageSize) : 10;
  console.log(page)

  return (
    <>
      <div className="grid grid-cols-1 gap-4 text-gray-700">
        {leads.slice(((page - 1)*pageSize),page*pageSize).map((lead, index) => {
          let bgColor = "bg-white";
          // check if lead[8] is a valid JSON
          let leadLocation = { city: "N/A", region_code: "", country_code: "" };
          try {
            leadLocation = JSON.parse(lead[8]);
          } catch (e) {
            // console.log("lead[8] is not a valid JSON");
          }
          
          // console.log(leadLocation);
          if (clientsEmail.includes(lead[0].trim())) {
              bgColor = "bg-green-300";
            }
            if (lead[1] == "" && lead[0] == "") {
              return null;
            }
            const urlPath = lead[6].split("?")[0];
            const urlParams = new URLSearchParams(lead[6].split("?")[1]);
            
            const utmSource =
            urlParams.get("utm_source") ?? urlParams.get("source");
            
            const utmContent = urlParams.get("utm_content");
            const utmAdset = urlParams.get("utm_adset");
            const utmMedium = urlParams.get("utm_medium");
            
            return (
            <div id={index} className={`${bgColor} rounded-lg shadow-md p-4`}>
              <p className="text-gray-500">
                {new Date(lead[4]).toLocaleString("pt-BR", {
                  timeZone: "America/Sao_Paulo",
                })}{" "}
                {leadLocation.city}
                {", " +
                  leadLocation.region_code +
                  ", " +
                  leadLocation.country_code}
              </p>
              <h2 className="text-lg font-semibold">{lead[2]}</h2>
              <p className="text-gray-500">{lead[0]}</p>
              <a href={`https://wa.me/${lead[1].replace("+", "").trim()}`}>
                {lead[1]}
              </a>
              <p className="text-gray-500"> CTA:{" " + lead[5]}</p>

              <p>
                <span className="px-2 py-1 font-bold bg-slate-100">URL:</span>
                {urlPath}{" "}
                <span className="px-2 py-1 font-bold bg-slate-100">Fonte:</span>{" "}
                {utmSource ?? "N/A"}{" "}
                <span className="px-2 py-1 font-bold bg-slate-100">Mídia:</span>{" "}
                {utmMedium ?? "N/A"}{" "}
                <span className="px-2 py-1 font-bold bg-slate-100">
                  CjAnúncios:
                </span>{" "}
                {utmAdset ?? "N/A"}{" "}
                <span className="px-2 py-1 font-bold bg-slate-100">Ad:</span>
                {utmContent ?? "N/A"}
              </p>
            </div>
          );
        })}
      <button hx-get={`/leads-html?page=${page+1}`} hx-swap="outerHTML" hx-trigger="revealed" >
        {" "}
        Mais Leads
      </button>
      </div>
</>


)
} 
)
.get("/leads", () => (  <html lang='en'>
<head>
<script src="https://unpkg.com/htmx.org@1.9.11" integrity="sha384-0gxUXCCR8yv9FM2b+U3FDbsKthCI66oH5IA9fHppQq9DDMHuMauqq1ZHBpJxQ0J0" crossorigin="anonymous"></script>
<script src="https://cdn.tailwindcss.com"></script>
    <title>Hello World</title>
</head>
<body className="bg-slate-800 text-zinc-200">
<div className="flex flex-col items-center">
<h1 className="text-2xl font-bold mb-4">Leads</h1>
      <button hx-get="/leads-html" hx-trigger="load" hx-swap="outerHTML">
        {" "}
        Get More Leads
      </button>
</div>
           </body>
        </html>

))
.listen(3000)

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
  );
