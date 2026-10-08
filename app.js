const KEY="masari-v1";
const initial={
 study:[
  {id:"khaleel",name:"خليل",active:"قرة العين بشرح ورقات إمام الحرمين",field:"أصول الفقه",lessons:16,done:0},
  {id:"shinqiti",name:"أكاديمية الشيخ محمد الشنقيطي",active:"متن الورقات",field:"أصول الفقه",lessons:12,done:0},
  {id:"mahdara",name:"المحظرة الشنقيطية",active:"التجويد — تحفة الأطفال",field:"تجويد",lessons:9,done:0}
 ],
 reading:[
  {id:"project",name:"مشروع الكتاب",book:"التاريخ الفكري للأفكار",target:50,pages:0},
  {id:"foundation",name:"التأسيس",book:"كتاب تأسيسي — اختره لاحقًا",target:30,pages:0},
  {id:"literature",name:"الأدب",book:"رواية — اخترها لاحقًا",target:20,pages:0}
 ],
 reviews:[]
};
let state=JSON.parse(localStorage.getItem(KEY)||"null")||initial;
function save(){localStorage.setItem(KEY,JSON.stringify(state))}
function esc(s){return String(s).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]))}
function pct(a,b){return b?Math.round(a/b*100):0}
function renderToday(){
 let completed=state.study.reduce((a,x)=>a+x.done,0), total=state.study.reduce((a,x)=>a+x.lessons,0);
 document.querySelector("#todayPct").textContent=pct(completed,total)+"%";
 document.querySelector("#studyCount").textContent=`${completed}/${total} درس`;
 document.querySelector("#studyToday").innerHTML=state.study.map((x,i)=>`
 <div class="item"><div class="item-top"><div><div class="title">${esc(x.name)} — ${esc(x.active)}</div><div class="meta">${esc(x.field)} · الدرس التالي ${x.done+1} من ${x.lessons}</div></div></div>
 <div class="bar"><i style="width:${pct(x.done,x.lessons)}%"></i></div>
 <div class="chips"><span class="chip">🎧 محاضرة</span><span class="chip">📄 تفريغ</span><span class="chip">📝 اختبار اختياري</span></div>
 <button class="action" onclick="completeLesson(${i})">إغلاق الدرس ${x.done+1}</button></div>`).join("");
 document.querySelector("#reviewCount").textContent=`${state.reviews.length} مراجعة`;
 document.querySelector("#reviews").innerHTML=state.reviews.length?state.reviews.map((r,i)=>`<div class="item"><div class="title">🔄 ${esc(r)}</div><button class="action secondary" onclick="finishReview(${i})">تمت المراجعة</button></div>`).join(""):`<div class="item"><div class="meta">لا توجد مراجعات مستحقة الآن.</div></div>`;
 document.querySelector("#readingCount").textContent="100 صفحة/يوم";
 document.querySelector("#readingToday").innerHTML=state.reading.map((x,i)=>`<div class="item"><div class="item-top"><div><div class="title">${esc(x.name)}</div><div class="meta">${esc(x.book)} · الهدف اليوم ${x.target} صفحة</div></div></div><button class="action" onclick="addPages(${i})">سجّل صفحات اليوم</button></div>`).join("");
}
function renderStudy(){document.querySelector("#studyTracks").innerHTML=state.study.map((x,i)=>`<div class="item"><div class="title">${esc(x.name)}</div><div class="meta">المادة النشطة: ${esc(x.active)} · ${esc(x.field)}</div><div class="bar"><i style="width:${pct(x.done,x.lessons)}%"></i></div><div class="meta">${x.done}/${x.lessons} درس</div></div>`).join("")}
function renderReading(){document.querySelector("#readingTracks").innerHTML=state.reading.map((x,i)=>`<div class="item"><div class="title">${esc(x.name)}</div><div class="meta">${esc(x.book)}</div><div class="chips"><span class="chip">${x.target} صفحة/يوم</span><span class="chip">${x.pages} صفحة مسجلة</span></div><button class="action secondary" onclick="renameBook(${i})">تعديل الكتاب</button></div>`).join("")}
function renderStats(){
 let lessons=state.study.reduce((a,x)=>a+x.done,0), total=state.study.reduce((a,x)=>a+x.lessons,0);
 document.querySelector("#statsGrid").innerHTML=`<div class="stat">الدروس المنجزة<strong>${lessons}</strong></div><div class="stat">الدروس المتبقية<strong>${total-lessons}</strong></div><div class="stat">الصفحات المسجلة<strong>${state.reading.reduce((a,x)=>a+x.pages,0)}</strong></div><div class="stat">المراجعات المستحقة<strong>${state.reviews.length}</strong></div>`;
}
function render(){renderToday();renderStudy();renderReading();renderStats()}
function completeLesson(i){
 let x=state.study[i]; if(x.done>=x.lessons)return;
 x.done++;
 const due=new Date(); due.setDate(due.getDate()+1);
 state.reviews.push(`${x.name} — ${x.active} — الدرس ${x.done} (مراجعة غدًا)`);
 save();render();
}
function finishReview(i){state.reviews.splice(i,1);save();render()}
function addPages(i){let n=prompt("كم صفحة قرأت اليوم؟",state.reading[i].target);if(n&&+n>0){state.reading[i].pages+=+n;save();render()}}
function renameBook(i){let n=prompt("اسم الكتاب",state.reading[i].book);if(n){state.reading[i].book=n;save();render()}}
document.querySelectorAll(".nav-btn").forEach(b=>b.onclick=()=>{document.querySelectorAll(".nav-btn").forEach(x=>x.classList.remove("active"));b.classList.add("active");document.querySelectorAll(".page").forEach(p=>p.classList.remove("active"));document.querySelector("#"+b.dataset.page).classList.add("active")});
document.querySelector("#resetBtn").onclick=()=>{if(confirm("حذف التقدم المحلي وإعادة البداية؟")){localStorage.removeItem(KEY);location.reload()}};
render();