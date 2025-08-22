import{a as L,r as a,c as M,e as R,u as K,j as e,b as g,S as o,f as k,g as Y}from"./index-CUIQzimj.js";import{h as q}from"./moment-C5S46NFB.js";import{S as H,R as Q}from"./react-paginate-uFqyLDrR.js";import{A as G}from"./arrow-left-DNEI5DBa.js";import{C as U}from"./calendar-2MlT3oTZ.js";import"./createLucideIcon-CRdo9p5N.js";const ee=()=>{const c="http://localhost:5555",r=L(),[h,D]=a.useState([]),[u,P]=a.useState([]),{id:d}=M(),{token:x}=R(t=>t.user),m=K(),[f,B]=a.useState(""),[b,y]=a.useState(0),p=5;console.log(d);const[$,n]=a.useState(!1),[w,T]=a.useState(null),[v,A]=a.useState(null),j=async()=>{try{const t=await g.get(`${c}/auth/api/calculator/getClientTxnHistory/${d}`,{headers:{"Content-Type":"application/json",Authorization:`Bearer ${x}`}});t.data.status==="Success"&&(console.log(t.data),D(t.data.data))}catch(t){console.log(t),t.response&&t.response.status===401&&o.fire({title:"Session Expired",text:"Please login again.",icon:"warning",confirmButtonText:"OK"}).then(()=>{m(k()),localStorage.removeItem("token"),r("/")})}};console.log(h);const N=async()=>{try{const t=await g.get(`${c}/auth/api/calculator/getClientDetailsById/${d}`,{headers:{"Content-Type":"application/json",Authorization:`Bearer ${x}`}});t.data.status==="Success"&&(console.log(t.data.data),P(t.data.data))}catch(t){console.log(t),t.response&&t.response.status===401&&o.fire({title:"Session Expired",text:"Please login again.",icon:"warning",confirmButtonText:"OK"}).then(()=>{m(k()),localStorage.removeItem("token"),r("/")})}};console.log(u);const C=u.client_name;console.log(C),a.useEffect(()=>{N(),j()},[]);const l=h.filter(t=>(t==null?void 0:t.txn_id)&&t.txn_id.toLowerCase().includes(f.trim().toLowerCase())),z=Math.ceil(l.length/p),_=()=>{const t=b*p,s=t+p;return l==null?void 0:l.slice(t,s)},E=({selected:t})=>{y(t)},S=_(),I=async t=>{if((await o.fire({title:"Are you sure?",text:"Do you want to delete this quotation permanently?",icon:"warning",showCancelButton:!0,confirmButtonColor:"#d33",cancelButtonColor:"#3085d6",confirmButtonText:"Yes, delete it!"})).isConfirmed)try{const i=await g.delete(`${c}/auth/api/calculator/deleteQuotationById/${t}`,{headers:{Authorization:`Bearer ${x}`}});i.data.status==="Success"?(o.fire({icon:"success",title:"Deleted!",text:"Quatation deleted successfully."}),N(),j()):o.fire({icon:"error",title:"Failed!",text:i.data.message||"Unable to delete client."})}catch(i){console.error("Error deleting client:",i),o.fire({icon:"error",title:"Error",text:"Something went wrong while deleting client."})}};return e.jsxs("div",{className:"min-h-screen bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 relative overflow-hidden",children:[e.jsxs("div",{className:"absolute inset-0 overflow-hidden",children:[e.jsx("div",{className:"absolute -top-40 -right-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse"}),e.jsx("div",{className:"absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"}),e.jsx("div",{className:"absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl animate-pulse delay-500"})]}),e.jsxs("div",{className:"relative z-10 p-6 space-y-8",children:[e.jsxs("div",{className:"flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4 lg:gap-0",children:[e.jsxs("div",{children:[e.jsx("h2",{className:"text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent",children:"Quotation History"}),e.jsxs("button",{onClick:()=>r(-1),className:"mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transform hover:scale-105 transition-all duration-200 bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-lg shadow-emerald-500/25",children:[e.jsx(G,{className:"w-4 h-4"}),"Go Back"]})]}),e.jsx("div",{className:"flex flex-col sm:flex-row gap-3 sm:gap-4",children:e.jsxs("div",{className:"relative group",children:[e.jsx(H,{className:"absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 group-hover:text-cyan-400 transition-colors"}),e.jsx("input",{type:"text",value:f,placeholder:"Search history...",className:"w-full sm:w-auto pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 backdrop-blur-sm hover:bg-gray-700/50 transition-all text-sm",onChange:t=>{B(t.target.value),y(0)}})]})})]}),e.jsx("div",{className:"bg-gray-800/30 backdrop-blur-xl rounded-2xl border border-gray-700/50 shadow-2xl overflow-hidden",children:e.jsx("div",{className:"p-8",children:e.jsx("div",{className:"overflow-x-auto",children:e.jsxs("table",{className:"w-full",children:[e.jsx("thead",{children:e.jsxs("tr",{className:"border-b border-gray-700/50",children:[e.jsx("th",{className:"text-left py-4 px-6 font-semibold text-gray-200 uppercase tracking-wider text-sm",children:"INDEX"}),e.jsx("th",{className:"text-left py-4 px-6 font-semibold text-gray-200 uppercase tracking-wider text-sm",children:"Date"}),e.jsx("th",{className:"text-left py-4 px-6 font-semibold text-gray-200 uppercase tracking-wider text-sm",children:"Client"}),e.jsx("th",{className:"text-left py-4 px-6 font-semibold text-gray-200 uppercase tracking-wider text-sm",children:"TXN ID"}),e.jsx("th",{className:"text-left py-4 px-6 font-semibold text-gray-200 uppercase tracking-wider text-sm",children:"Action"})]})}),e.jsx("tbody",{children:S.length>0?S.map((t,s)=>e.jsxs("tr",{className:"border-b border-gray-700/30 hover:bg-gray-700/20 transition-all duration-300 group",style:{animationDelay:`${s*100}ms`},children:[e.jsx("td",{className:"py-5 px-6",children:e.jsx("div",{className:"font-semibold text-white text-lg group-hover:text-cyan-300 transition-colors",children:s+1})}),e.jsx("td",{className:"py-5 px-6",children:e.jsxs("div",{className:"flex items-center gap-3 text-gray-300 group-hover:text-white transition-colors",children:[e.jsx(U,{className:"w-4 h-4 text-purple-400"}),e.jsx("span",{className:"font-medium",children:q(t.txn_date).format("DD MMMM YYYY")})]})}),e.jsx("td",{className:"py-5 px-6",children:e.jsx("div",{className:"font-semibold text-white text-lg group-hover:text-cyan-300 transition-colors",children:C})}),e.jsx("td",{className:"py-5 px-6",children:e.jsx("div",{className:"font-bold text-xl bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent",children:t.txn_id?t.txn_id:"N/A"})}),e.jsxs("td",{className:"py-5 px-6",children:[e.jsx("button",{onClick:()=>{T(t.client_id),A(t.txn_id),n(!0)},className:"inline-block px-4 py-2 rounded-full text-sm font-semibold transform hover:scale-105 transition-all duration-200 bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg shadow-orange-500/25",children:"Review"}),e.jsx("button",{onClick:()=>I(t.txn_id),className:"inline-block px-4 py-2 rounded-full text-sm font-semibold transform hover:scale-105 transition-all duration-200 bg-gradient-to-r from-red-500 to-red-500 text-white shadow-lg shadow-red-500/25 mx-2",children:"Delete"})]})]},t.id)):e.jsx("tr",{children:e.jsx("td",{colSpan:"5",className:"py-10 text-center text-gray-400",children:"No service history found for this client."})})})]})})})}),$&&e.jsx("div",{className:"fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50",children:e.jsxs("div",{className:"relative bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-md",children:[e.jsx("button",{onClick:()=>n(!1),className:"absolute top-2 right-3 text-red-600 hover:text-gray-500 text-xl font-bold","aria-label":"Close",children:"×"}),e.jsx("h2",{className:"text-lg font-semibold mb-4 text-center",children:"Select Quotation Type"}),e.jsxs("div",{className:"flex justify-center gap-4",children:[e.jsx("button",{onClick:()=>{r(`/BD/quotation/${w}/${v}?gst=1`),n(!1)},className:"bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600",children:"With GST (18%)"}),e.jsx("button",{onClick:()=>{r(`/BD/quotation/${w}/${v}?gst=0`),n(!1)},className:"bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600",children:"Without GST"})]})]})}),e.jsx(F,{children:e.jsx(Q,{previousLabel:"Previous",nextLabel:"Next",breakLabel:"...",pageCount:z,marginPagesDisplayed:2,pageRangeDisplayed:5,onPageChange:E,containerClassName:"pagination",activeClassName:"active",forcePage:b})})]})]})},F=Y.div`
  .pagination {
    display: flex;
    justify-content: center;
    padding: 10px;
    list-style: none;
    border-radius: 5px;
  }

  .pagination li {
    margin: 0 5px;
  }

  .pagination li a {
    display: block;
    padding: 8px 16px;
    border: 1px solid #e6ecf1;
    color: #a73418;
    cursor: pointer;
    text-decoration: none;
    border-radius: 5px;
    box-shadow: 0px 0px 1px #000;
    font-size: 14px; /* Default font size */
  }

  .pagination li.active a {
    background-color: #fef9c3;
    color: #d7a548;
    border: 1px solid #fef9c3;
  }

  .pagination li.disabled a {
    color: #166556;
    cursor: not-allowed;
    background-color: #dcfce7;
    border: 1px solid #dcfce7;
  }

  .pagination li a:hover:not(.active) {
    background-color: #dcfce7;
    color: #166556;
  }

  /* Responsive adjustments for smaller screens */
  @media (max-width: 768px) {
    .pagination {
      padding: 5px;
      flex-wrap: wrap;
    }

    .pagination li {
      margin: 2px;
    }

    .pagination li a {
      padding: 6px 10px;
      font-size: 12px;
    }
  }

  @media (max-width: 480px) {
    .pagination {
      padding: 5px;
    }

    .pagination li {
      margin: 2px;
    }

    .pagination li a {
      padding: 4px 8px;
      font-size: 10px;
    }

    /* Hide the previous and next labels for extra-small screens */
    .pagination li:first-child a::before {
      content: "«";
      margin-right: 5px;
    }

    .pagination li:last-child a::after {
      content: "»";
      margin-left: 5px;
    }
  }
`;export{ee as default};
