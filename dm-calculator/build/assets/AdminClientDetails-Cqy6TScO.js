import{a as Y,u as J,e as Q,r,j as e,b,S as n,f as V,g as A}from"./index-CUIQzimj.js";import{S as W,R as Z}from"./react-paginate-uFqyLDrR.js";import{b as ee,P as _,M as P,B as se}from"./plus-B8NtCj_r.js";import{U as x}from"./user-CFrnBhbL.js";import{M as z}from"./mail-C6BzRBwP.js";import{C as ae}from"./calendar-2MlT3oTZ.js";import{X as te}from"./x-DHWZQomu.js";import"./createLucideIcon-CRdo9p5N.js";const ge=()=>{const g="http://localhost:5555",y=Y(),B=J(),{currentUser:j,token:u}=Q(s=>s.user),N=j==null?void 0:j.name,[t,v]=r.useState(null),[i,p]=r.useState({client_name:"",client_organization:"",email:"",phone:"",address:"",dg_employee:N}),[w,E]=r.useState(!1),[F,h]=r.useState(!1),[M,R]=r.useState([]),[o,I]=r.useState(""),[L,D]=r.useState(0),C=3,[d,$]=r.useState(!1),k=()=>{h(!1),p({client_name:"",client_organization:"",email:"",phone:"",address:"",dg_employee:N})},U=()=>{v(null),p({client_name:"",client_organization:"",email:"",phone:"",address:"",dg_employee:N}),$(!1),h(!0)},c=s=>{const{name:a,value:l}=s.target;a==="phone"&&!/^\d{0,10}$/.test(l)||p(X=>({...X,[a]:l}))},q=async s=>{s.preventDefault(),E(!0);try{console.log("Submitting form data:",i);let a;d&&t?(a=await b.put(`${g}/auth/api/calculator/updateClientDetails/${t.id}`,i,{headers:{Authorization:`Bearer ${u}`,"Content-Type":"application/json"}}),console.log(a.data)):(a=await b.post(`${g}/auth/api/calculator/insertClientDetails`,i,{headers:{Authorization:`Bearer ${u}`,"Content-Type":"application/json"}}),console.log(a.data)),console.log("API response:",a.data),a.data.status==="Success"?n.fire({icon:"success",title:"Success",text:d?"Client updated successfully!":"Client added successfully!"}).then(()=>{h(!1),S()}):n.fire({icon:"error",title:"Error",text:a.data.message||"Failed to save client. Please try again."})}catch(a){console.error("Error saving client:",a),a.response?(console.error("Response data:",a.response.data),console.error("Status:",a.response.status),n.fire({icon:"error",title:`Error ${a.response.status}`,text:a.response.data.message||"Failed to save client. Please try again."})):n.fire({icon:"error",title:"Error",text:"Failed to save client. Please try again."})}finally{E(!1)}},K=async s=>{if((await n.fire({title:"Are you sure?",text:"Do you want to delete this client permanently?",icon:"warning",showCancelButton:!0,confirmButtonColor:"#d33",cancelButtonColor:"#3085d6",confirmButtonText:"Yes, delete it!"})).isConfirmed)try{const l=await b.delete(`${g}/auth/api/calculator/deleteClientById/${s}`,{headers:{Authorization:`Bearer ${u}`}});l.data.status==="Success"?(n.fire({icon:"success",title:"Deleted!",text:"Client deleted successfully."}),S()):n.fire({icon:"error",title:"Failed!",text:l.data.message||"Unable to delete client."})}catch(l){console.error("Error deleting client:",l),n.fire({icon:"error",title:"Error",text:"Something went wrong while deleting client."})}},S=async()=>{try{const s=await b.get(`${g}/auth/api/calculator/getClientDetails`,{headers:{Authorization:`Bearer ${u}`}});R(s.data.data)}catch(s){console.error("Error fetching clients:",s),n.fire({icon:"error",title:"Error",text:"Failed to fetch clients. Please try again."}),s.response&&s.response.status===401&&n.fire({title:"Session Expired",text:"Please login again.",icon:"warning",confirmButtonText:"OK"}).then(()=>{B(V()),localStorage.removeItem("token"),y("/")})}};r.useEffect(()=>{S()},[]);const f=M.filter(s=>(s==null?void 0:s.client_name)&&s.client_name.toLowerCase().includes(o.trim().toLowerCase())||(s==null?void 0:s.dg_employee)&&s.dg_employee.toLowerCase().includes(o.trim().toLowerCase())||(s==null?void 0:s.client_organization)&&s.client_organization.toLowerCase().includes(o.trim().toLowerCase())||(s==null?void 0:s.phone)&&s.phone.toLowerCase().includes(o.trim().toLowerCase())),T=Math.ceil(f.length/C),H=()=>{const s=L*C,a=s+C;return f==null?void 0:f.slice(s,a)},O=({selected:s})=>{D(s)},m=H(),G=()=>{const s=Date.now();y(`/admin/ServicesLanding/${t.id}/${s}`)};return e.jsx(e.Fragment,{children:e.jsxs("div",{className:"p-4 md:p-6 space-y-6 bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-lg",children:[e.jsxs("div",{className:"flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4",children:[e.jsx("h2",{className:"text-3xl font-semibold text-gray-800",children:"Client Details"}),e.jsxs("div",{className:"flex flex-col sm:flex-row gap-3 w-full sm:w-auto",children:[e.jsxs("div",{className:"relative",children:[e.jsx(W,{className:"absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4"}),e.jsx("input",{type:"search",value:o,placeholder:"Search clients...",className:"w-full sm:w-auto pl-10 pr-4 py-2 border border-gray-300 rounded-lg",onChange:s=>{I(s.target.value),D(0)}})]}),e.jsxs("button",{onClick:U,className:"flex items-center gap-2 px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-md transition",children:[e.jsx(ee,{className:"w-4 h-4"}),"Add Client"]})]})]}),e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-3 gap-6",children:[e.jsx("div",{className:"lg:col-span-2",children:e.jsxs("div",{className:"bg-white rounded-xl shadow-sm border border-gray-200",children:[e.jsxs("div",{className:"p-6",children:[e.jsx("h3",{className:"text-lg font-semibold mb-4",children:"All Clients"}),e.jsx("div",{className:"space-y-4",children:w?e.jsx("div",{className:"loading-overlay",children:e.jsx("div",{className:"spinner"})}):e.jsx(e.Fragment,{children:m&&m.length>0?m==null?void 0:m.map(s=>e.jsx("div",{className:`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${(t==null?void 0:t.id)===s.id?"border-blue-500 bg-blue-50":"border-gray-200"}`,onClick:()=>v(s),children:e.jsx("div",{className:"flex justify-between items-start",children:e.jsxs("div",{className:"flex-1",children:[e.jsxs("div",{className:"flex items-center gap-3 mb-2",children:[e.jsx("div",{className:"w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center",children:e.jsx(x,{className:"w-5 h-5 text-white"})}),e.jsxs("div",{children:[e.jsx("h4",{className:"font-semibold text-gray-900",children:s.client_organization}),e.jsx("p",{className:"text-sm text-gray-600",children:s.client_name})]})]}),e.jsxs("div",{className:"grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-600 break-words",children:[e.jsxs("div",{className:"flex items-center gap-2 break-words",children:[e.jsx(z,{className:"w-4 h-4"}),s.email]}),e.jsxs("div",{className:"flex items-center gap-2 break-words",children:[e.jsx(_,{className:"w-4 h-4"}),s.phone]}),e.jsxs("div",{className:"flex items-center gap-2 break-words",children:[e.jsx(P,{className:"w-4 h-4"}),s.address]}),e.jsxs("div",{className:"flex items-center gap-2 break-words",children:[e.jsx(ae,{className:"w-4 h-4"}),"Employee : ",s.dg_employee]}),e.jsx("button",{onClick:a=>{a.stopPropagation(),v(s),p({client_name:s.client_name,client_organization:s.client_organization,email:s.email,phone:s.phone,address:s.address,dg_employee:s.dg_employee}),$(!0),h(!0)},className:"inline-block px-2 py-2 rounded-full text-sm font-semibold transform hover:scale-105 transition-all duration-200 bg-gradient-to-r from-blue-500 to-blue-700 text-white shadow-lg shadow-blue-500/25",children:"Edit"}),e.jsx("button",{className:"inline-block px-2 py-2 rounded-full text-sm font-semibold transform hover:scale-105 transition-all duration-200 bg-gradient-to-r from-red-500 to-red-700 text-white shadow-lg shadow-red-500/25",onClick:()=>K(s.id),children:"Delete"})]})]})})},s.id)):e.jsx("div",{className:"text-center text-gray-500 py-6",children:e.jsx("p",{children:"No clients found"})})})})]}),e.jsx(ne,{children:e.jsx(Z,{previousLabel:"Previous",nextLabel:"Next",breakLabel:"...",pageCount:T,marginPagesDisplayed:2,pageRangeDisplayed:5,onPageChange:O,containerClassName:"pagination",activeClassName:"active",forcePage:L})})]})}),e.jsx("div",{className:"lg:col-span-1",children:t?e.jsx("div",{className:"bg-white rounded-xl shadow-sm border border-gray-200",children:e.jsxs("div",{className:"p-6",children:[e.jsx("h3",{className:"text-lg font-semibold mb-4",children:"Client Profile"}),e.jsxs("div",{className:"text-center mb-6",children:[e.jsx("div",{className:"w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-3",children:e.jsx(x,{className:"w-10 h-10 text-white"})}),e.jsx("h4",{className:"font-bold text-xl text-gray-900",children:t.client_organization}),e.jsx("p",{className:"text-gray-600",children:t.client_name})]}),e.jsxs("div",{className:"space-y-4",children:[e.jsxs("div",{className:"flex items-center gap-3 p-3 bg-gray-50 rounded-lg",children:[e.jsx(z,{className:"w-5 h-5 text-gray-500"}),e.jsx("span",{className:"text-sm",children:t.email})]}),e.jsxs("div",{className:"flex items-center gap-3 p-3 bg-gray-50 rounded-lg",children:[e.jsx(_,{className:"w-5 h-5 text-gray-500"}),e.jsx("span",{className:"text-sm",children:t.phone})]}),e.jsxs("div",{className:"flex items-center gap-3 p-3 bg-gray-50 rounded-lg",children:[e.jsx(P,{className:"w-5 h-5 text-gray-500"}),e.jsx("span",{className:"text-sm",children:t.address})]})]}),e.jsxs("div",{className:"mt-6 space-y-2",children:[e.jsx("button",{onClick:G,className:"w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors",children:"Create Proposal"}),e.jsx("button",{onClick:()=>y(`/admin/client/service/history/${t.id}`),className:"w-full px-4 py-2 bg-white text-blue-600 dark:text-sky-400 rounded-lg hover:bg-sky-300 transition-colors border-2 border-dashed border-sky-300 hover:text-white",children:"Proposal History"})]})]})}):e.jsx("div",{className:"bg-white rounded-xl shadow-sm border border-gray-200 p-6",children:e.jsxs("div",{className:"text-center text-gray-500",children:[e.jsx(x,{className:"w-12 h-12 mx-auto mb-3 opacity-50"}),e.jsx("p",{children:"Select a client to view details"})]})})})]}),F&&e.jsxs("div",{className:"fixed inset-0 z-50 flex items-center justify-center p-4",children:[e.jsx("div",{className:"absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm transition-opacity",onClick:k}),e.jsxs("div",{className:"relative bg-white w-full max-w-md rounded-xl shadow-2xl transform transition-all animate-in fade-in-0 zoom-in-95 duration-200",children:[e.jsxs("div",{className:"flex items-center justify-between p-6 border-b border-gray-100",children:[e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsx("div",{className:"w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center",children:e.jsx(x,{className:"w-5 h-5 text-blue-600"})}),e.jsx("h2",{className:"text-xl font-semibold text-gray-900",children:d?"Edit Client":"Add New Client"})]}),e.jsx("button",{onClick:k,className:"p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors",children:e.jsx(te,{className:"w-5 h-5"})})]}),e.jsxs("form",{onSubmit:q,className:"p-6 space-y-4",children:[e.jsxs("div",{children:[e.jsxs("label",{className:"block text-sm font-medium text-gray-700 mb-2",children:[e.jsx(x,{className:"w-4 h-4 inline mr-2"}),"Client Name"]}),e.jsx("input",{type:"text",name:"client_name",value:i.client_name,onChange:c,className:"w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors",placeholder:"Enter client name",required:!0})]}),e.jsxs("div",{children:[e.jsxs("label",{className:"block text-sm font-medium text-gray-700 mb-2",children:[e.jsx(se,{className:"w-4 h-4 inline mr-2"}),"Organization"]}),e.jsx("input",{type:"text",name:"client_organization",value:i.client_organization,onChange:c,className:"w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors",placeholder:"Enter organization name",required:!0})]}),e.jsxs("div",{children:[e.jsxs("label",{className:"block text-sm font-medium text-gray-700 mb-2",children:[e.jsx(z,{className:"w-4 h-4 inline mr-2"}),"Email Address"]}),e.jsx("input",{type:"email",name:"email",value:i.email,onChange:c,className:"w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors",placeholder:"Enter email address",required:!0})]}),e.jsxs("div",{children:[e.jsxs("label",{className:"block text-sm font-medium text-gray-700 mb-2",children:[e.jsx(_,{className:"w-4 h-4 inline mr-2"}),"Phone Number"]}),e.jsx("input",{type:"number",name:"phone",value:i.phone,onChange:c,className:"w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors",placeholder:"Enter phone number",required:!0,minLength:10,maxLength:10})]}),e.jsxs("div",{children:[e.jsxs("label",{className:"block text-sm font-medium text-gray-700 mb-2",children:[e.jsx(P,{className:"w-4 h-4 inline mr-2"}),"Address"]}),e.jsx("textarea",{name:"address",value:i.address,onChange:c,rows:3,className:"w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none",placeholder:"Enter full address"})]}),e.jsxs("div",{className:"flex justify-end gap-3 pt-4",children:[e.jsx("button",{type:"button",onClick:k,className:"px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium",children:"Cancel"}),e.jsx("button",{type:"submit",disabled:w,className:"px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm",children:w?d?"Updating...":"Saving...":d?"Update Client":"Save Client"})]})]})]})]})]})})};A.div`
  /* Add this CSS in your global stylesheet or in a CSS module */
  .loading-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(255, 255, 255, 0.7);
    backdrop-filter: blur(2px);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
  }

  .spinner {
    border: 4px solid #f3f3f3; /* Light grey */
    border-top: 4px solid #3498db; /* Blue */
    border-radius: 50%;
    width: 40px;
    height: 40px;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;const ne=A.div`
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
`;export{ge as default};
