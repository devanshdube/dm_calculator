import{a as z,r as s,c as A,e as L,u as M,j as e,b as $,S as R,f as E,g as I}from"./index-CUIQzimj.js";import{h as H}from"./moment-C5S46NFB.js";import{S as Y,R as q}from"./react-paginate-uFqyLDrR.js";import{C as U}from"./calendar-2MlT3oTZ.js";import"./createLucideIcon-CRdo9p5N.js";const X=()=>{const f="http://localhost:5555",o=z(),[d,b]=s.useState([]),{id:y}=A(),{currentUser:v,token:j}=L(t=>t.user),N=M(),[i,w]=s.useState(""),[x,p]=s.useState(0),c=5;console.log(y),console.log(v);const[S,r]=s.useState(!1),[g,C]=s.useState(null),[h,k]=s.useState(null),P=async()=>{try{const t=await $.get(`${f}/auth/api/calculator/getAllClientsTxnHistory`,{headers:{"Content-Type":"application/json",Authorization:`Bearer ${j}`}});if(t.data.status==="Success"){const a=[],u=new Set;for(const l of t.data.data)l.txn_id&&!u.has(l.txn_id)&&(u.add(l.txn_id),a.push(l));b(a)}}catch(t){console.log(t),t.response&&t.response.status===401&&R.fire({title:"Session Expired",text:"Please login again.",icon:"warning",confirmButtonText:"OK"}).then(()=>{N(E()),localStorage.removeItem("token"),o("/")})}};console.log(d),s.useEffect(()=>{P()},[]);const n=d.filter(t=>{if(!i.trim())return!0;const a=i.trim().toLowerCase();return(t==null?void 0:t.txn_id)&&t.txn_id.toLowerCase().includes(a)||(t==null?void 0:t.client_name)&&t.client_name.toLowerCase().includes(a)});console.log("Filtered:",n.length,n);const _=Math.ceil(n.length/c),D=()=>{const t=x*c,a=t+c;return n==null?void 0:n.slice(t,a)},T=({selected:t})=>{p(t)},m=D();return e.jsxs("div",{className:"min-h-screen bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 relative overflow-hidden",children:[e.jsxs("div",{className:"absolute inset-0 overflow-hidden",children:[e.jsx("div",{className:"absolute -top-40 -right-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse"}),e.jsx("div",{className:"absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"}),e.jsx("div",{className:"absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl animate-pulse delay-500"})]}),e.jsxs("div",{className:"relative z-10 p-6 space-y-8",children:[e.jsxs("div",{className:"flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4 lg:gap-0",children:[e.jsx("div",{children:e.jsx("h2",{className:"text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent",children:"History"})}),e.jsx("div",{className:"flex flex-col sm:flex-row gap-3 sm:gap-4",children:e.jsxs("div",{className:"relative group",children:[e.jsx(Y,{className:"absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 group-hover:text-cyan-400 transition-colors"}),e.jsx("input",{type:"text",value:i,placeholder:"Search history...",className:"w-full sm:w-auto pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 backdrop-blur-sm hover:bg-gray-700/50 transition-all text-sm",onChange:t=>{w(t.target.value),p(0)}})]})})]}),e.jsx("div",{className:"bg-gray-800/30 backdrop-blur-xl rounded-2xl border border-gray-700/50 shadow-2xl overflow-hidden",children:e.jsx("div",{className:"p-8",children:e.jsx("div",{className:"overflow-x-auto",children:e.jsxs("table",{className:"w-full",children:[e.jsx("thead",{children:e.jsxs("tr",{className:"border-b border-gray-700/50",children:[e.jsx("th",{className:"text-left py-4 px-6 font-semibold text-gray-200 uppercase tracking-wider text-sm",children:"INDEX"}),e.jsx("th",{className:"text-left py-4 px-6 font-semibold text-gray-200 uppercase tracking-wider text-sm",children:"Date"}),e.jsx("th",{className:"text-left py-4 px-6 font-semibold text-gray-200 uppercase tracking-wider text-sm",children:"Client"}),e.jsx("th",{className:"text-left py-4 px-6 font-semibold text-gray-200 uppercase tracking-wider text-sm",children:"TXN ID"}),e.jsx("th",{className:"text-left py-4 px-6 font-semibold text-gray-200 uppercase tracking-wider text-sm",children:"Action"})]})}),e.jsx("tbody",{children:m.length>0?m.map((t,a)=>e.jsxs("tr",{className:"border-b border-gray-700/30 hover:bg-gray-700/20 transition-all duration-300 group",style:{animationDelay:`${a*100}ms`},children:[e.jsx("td",{className:"py-5 px-6",children:e.jsx("div",{className:"font-semibold text-white text-lg group-hover:text-cyan-300 transition-colors",children:a+1})}),e.jsx("td",{className:"py-5 px-6",children:e.jsxs("div",{className:"flex items-center gap-3 text-gray-300 group-hover:text-white transition-colors",children:[e.jsx(U,{className:"w-4 h-4 text-purple-400"}),e.jsx("span",{className:"font-medium",children:H(t.txn_date).format("DD MMMM YYYY")})]})}),e.jsx("td",{className:"py-5 px-6",children:e.jsx("div",{className:"font-semibold text-white text-lg group-hover:text-cyan-300 transition-colors",children:t.client_name})}),e.jsx("td",{className:"py-5 px-6",children:e.jsx("div",{className:"font-bold text-xl bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent",children:t.txn_id?t.txn_id:"N/A"})}),e.jsx("td",{className:"py-5 px-6",children:e.jsx("button",{onClick:()=>{C(t.client_id),k(t.txn_id),r(!0)},className:"inline-block px-4 py-2 rounded-full text-sm font-semibold transform hover:scale-105 transition-all duration-200 bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg shadow-orange-500/25",children:"Quotation"})})]},t.id)):e.jsx("tr",{children:e.jsx("td",{colSpan:"5",className:"py-10 text-center text-gray-400",children:"No service history found for this client."})})})]})})})}),S&&e.jsx("div",{className:"fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50",children:e.jsxs("div",{className:"relative bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-md",children:[e.jsx("button",{onClick:()=>r(!1),className:"absolute top-2 right-3 text-red-600 hover:text-gray-500 text-xl font-bold","aria-label":"Close",children:"×"}),e.jsx("h2",{className:"text-lg font-semibold mb-4 text-center",children:"Select Quotation Type"}),e.jsxs("div",{className:"flex justify-center gap-4",children:[e.jsx("button",{onClick:()=>{o(`/admin/quotation/${g}/${h}?gst=1`),r(!1)},className:"bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600",children:"With GST (18%)"}),e.jsx("button",{onClick:()=>{o(`/admin/quotation/${g}/${h}?gst=0`),r(!1)},className:"bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600",children:"Without GST"})]})]})}),e.jsx(B,{children:e.jsx(q,{previousLabel:"Previous",nextLabel:"Next",breakLabel:"...",pageCount:_,marginPagesDisplayed:2,pageRangeDisplayed:5,onPageChange:T,containerClassName:"pagination",activeClassName:"active",forcePage:x})})]})]})},B=I.div`
  .pagination {
    display: flex;
    justify-content: center;
    padding: 10px;
    list-style: none;
    border-radius: 5px;
    margin-bottom: 1.5rem;
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
`;export{X as default};
