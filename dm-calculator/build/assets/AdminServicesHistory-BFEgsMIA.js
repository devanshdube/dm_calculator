import{r as o,e as P,u as k,a as L,j as a,b as c,S as D,f as w,g as $}from"./index-CUIQzimj.js";import{S as E,R}from"./react-paginate-uFqyLDrR.js";import"./createLucideIcon-CRdo9p5N.js";const T=()=>{const n="http://localhost:5555",[r,f]=o.useState(""),[p,x]=o.useState(0),d=7,[g,y]=o.useState([]),{currentUser:b,token:m}=P(e=>e.user),v=k(),j=L();console.log(b),console.log(m);const h=async()=>{try{const e=await c.get(`${n}/auth/api/calculator/api/services/details/all`,{headers:{Authorization:`Bearer ${m}`}});e.data.status==="Success"&&(console.log(e.data.data),y(e.data.data))}catch(e){console.error("Error fetching data:",e),e.response&&e.response.status===401&&D.fire({title:"Session Expired",text:"Please login again.",icon:"warning",confirmButtonText:"OK"}).then(()=>{v(w()),localStorage.removeItem("token"),j("/")})}};o.useEffect(()=>{h()},[]),console.log(g);const N=async e=>{var i,u;try{if(e.editing_type_id)await c.delete(`${n}/auth/api/calculator/deleteEditingType/${e.editing_type_id}`);else if(e.category_id){const t=await c.delete(`${n}/auth/api/calculator/deleteCategory/${e.category_id}`);t.data.status!=="Success"&&alert(t.data.message||"Cannot delete category")}else if(e.service_id){const t=await c.delete(`${n}/auth/api/calculator/deleteService/${e.service_id}`);t.data.status!=="Success"&&alert(t.data.message||"Cannot delete service")}h()}catch(t){console.error("Delete failed:",t),alert(((u=(i=t==null?void 0:t.response)==null?void 0:i.data)==null?void 0:u.message)||"Something went wrong")}},l=g.filter(e=>(e==null?void 0:e.service_name)&&e.service_name.toLowerCase().includes(r.trim().toLowerCase())||(e==null?void 0:e.category_name)&&e.category_name.toLowerCase().includes(r.trim().toLowerCase())||(e==null?void 0:e.editing_type_name)&&e.editing_type_name.toLowerCase().includes(r.trim().toLowerCase())),S=Math.ceil(l.length/d),_=()=>{const e=p*d,i=e+d;return l==null?void 0:l.slice(e,i)},C=({selected:e})=>{x(e)},s=_();return a.jsx(a.Fragment,{children:a.jsxs("div",{className:"space-y-6",children:[a.jsxs("div",{className:"flex justify-between items-center",children:[a.jsx("h2",{className:"text-2xl font-bold text-gray-300",children:"Services History"}),a.jsx("div",{className:"flex gap-3",children:a.jsxs("div",{className:"relative",children:[a.jsx(E,{className:"absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4"}),a.jsx("input",{type:"search",value:r,placeholder:"Search history...",className:"pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500",onChange:e=>{f(e.target.value),x(0)}})]})})]}),a.jsx("div",{className:"bg-white rounded-xl shadow-sm border border-gray-200",children:a.jsxs("div",{className:"p-6",children:[a.jsx("div",{className:"overflow-x-auto",children:a.jsxs("table",{className:"w-full",children:[a.jsx("thead",{children:a.jsxs("tr",{className:"border-b border-gray-200",children:[a.jsx("th",{className:"text-left py-3 px-4 font-semibold text-gray-900",children:"Services"}),a.jsx("th",{className:"text-left py-3 px-4 font-semibold text-gray-900",children:"Categories"}),a.jsx("th",{className:"text-left py-3 px-4 font-semibold text-gray-900",children:"Editing Type"}),a.jsx("th",{className:"text-left py-3 px-4 font-semibold text-gray-900",children:"Amount"}),a.jsx("th",{className:"text-left py-3 px-4 font-semibold text-gray-900",children:"Action"})]})}),a.jsx("tbody",{children:s&&s.length>0?s==null?void 0:s.map(e=>a.jsxs("tr",{className:"border-b border-gray-100 hover:bg-gray-50 transition-colors",children:[a.jsx("td",{className:"py-4 px-4",children:a.jsx("div",{className:"font-medium text-gray-900",children:e.service_name})}),a.jsx("td",{className:"py-4 px-4",children:a.jsx("div",{className:"text-gray-700",children:e.category_name})}),a.jsx("td",{className:"py-4 px-4",children:a.jsx("div",{className:"text-gray-700",children:e.editing_type_name})}),a.jsx("td",{className:"py-4 px-4",children:a.jsx("div",{className:"text-gray-700",children:e.amount})}),a.jsx("td",{className:"py-4 px-4",children:a.jsx("button",{onClick:()=>N(e),className:"inline-block px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800",children:"Delete"})})]})):a.jsx("div",{className:"text-center text-gray-500 py-6",children:a.jsx("p",{children:"No Services Found"})})})]})}),a.jsx(z,{children:a.jsx(R,{previousLabel:"Previous",nextLabel:"Next",breakLabel:"...",pageCount:S,marginPagesDisplayed:2,pageRangeDisplayed:5,onPageChange:C,containerClassName:"pagination",activeClassName:"active",forcePage:p})})]})})]})})},z=$.div`
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
`;export{T as default};
