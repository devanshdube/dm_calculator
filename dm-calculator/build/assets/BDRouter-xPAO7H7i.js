const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/QuotationBD-wFoP0l76.js","assets/index-CUIQzimj.js","assets/index-D7t5u2c2.css","assets/moment-C5S46NFB.js","assets/Dg 2copy-CYzL2Iiy.js","assets/AdsCampaignCalciBD-Jbx6I1Z2.js","assets/AddService-axg-dVXC.js","assets/sparkles-CAvjEyTx.js","assets/createLucideIcon-CRdo9p5N.js","assets/arrow-left-DNEI5DBa.js","assets/user-CFrnBhbL.js","assets/package-B9hhfpZ0.js","assets/HistoryBD-Cxt_2Zp4.js","assets/react-paginate-uFqyLDrR.js","assets/calendar-2MlT3oTZ.js","assets/CalculatorBD-J2OqZBPn.js","assets/sticky-note-B-od-k2n.js","assets/x-DHWZQomu.js","assets/BusinessDeveloperDashboard-DsyY5CnD.js","assets/plus-B8NtCj_r.js","assets/mail-C6BzRBwP.js","assets/list-BcizAkah.js"])))=>i.map(i=>d[i]);
import{j as e,r as s,R as r,h as t,g as a,_ as i}from"./index-CUIQzimj.js";const o=s.lazy(()=>i(()=>import("./QuotationBD-wFoP0l76.js"),__vite__mapDeps([0,1,2,3,4]))),n=s.lazy(()=>i(()=>import("./AdsCampaignCalciBD-Jbx6I1Z2.js"),__vite__mapDeps([5,1,2]))),d=s.lazy(()=>i(()=>import("./AddService-axg-dVXC.js"),__vite__mapDeps([6,1,2,7,8,9,10,11]))),l=s.lazy(()=>i(()=>import("./HistoryBD-Cxt_2Zp4.js"),__vite__mapDeps([12,1,2,3,13,8,9,14]))),p=s.lazy(()=>i(()=>import("./CalculatorBD-J2OqZBPn.js"),__vite__mapDeps([15,1,2,11,8,16,17]))),c=s.lazy(()=>i(()=>import("./BusinessDeveloperDashboard-DsyY5CnD.js"),__vite__mapDeps([18,1,2,13,8,19,10,20,14,17,3,21]))),m=()=>e.jsx(e.Fragment,{children:e.jsx(x,{children:e.jsx(s.Suspense,{fallback:e.jsx("div",{className:"loading-container",children:e.jsxs("div",{className:"spinner-wrapper",children:[e.jsx("div",{className:"spinner-ring"}),e.jsx("div",{className:"spinner-center",children:"DM"})]})}),children:e.jsxs(r,{children:[e.jsx(t,{path:"dashboard",element:e.jsx(c,{})}),e.jsx(t,{path:"AddService/:id/:proposalId",element:e.jsx(d,{})}),e.jsx(t,{path:"client/service/history/:id",element:e.jsx(l,{})}),e.jsx(t,{path:"calculator/:id/:proposalId",element:e.jsx(p,{})}),e.jsx(t,{path:"Adscalculator/:id/:proposalId",element:e.jsx(n,{})}),e.jsx(t,{path:"quotation/:id/:txn_id",element:e.jsx(o,{})})]})})})}),x=a.div`
  .spinner-wrapper {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 9999;
    width: 100vw;
    height: 100vh;
    background: linear-gradient(135deg, #e3f2fd, #fce4ec);
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .spinner-ring {
    width: 150px;
    height: 150px;
    border: 8px solid transparent;
    border-top: 8px solid #dc620b;
    border-right: 8px solid #dc620b;
    border-radius: 50%;
    animation: spin 1.2s linear infinite;
    box-shadow: 0 0 8px rgba(238, 101, 3, 0.6);
    position: absolute;
  }

  .spinner-center {
    font-size: 20px;
    font-weight: bold;
    color: #dc620b;
    z-index: 1;
    animation: pulse 1.5s ease-in-out infinite;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  @keyframes pulse {
    0%,
    100% {
      transform: scale(1);
      opacity: 0.8;
    }
    50% {
      transform: scale(1.2);
      opacity: 1;
    }
  }
`;export{m as default};
