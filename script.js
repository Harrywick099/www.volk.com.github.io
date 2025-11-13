/* script.js — used by both index.html and dashboard.html */
try{
const u = new URL(url);
if(u.hostname.includes('youtube.com')) return u.searchParams.get('v');
if(u.hostname === 'youtu.be') return u.pathname.slice(1);
return null;
}catch(e){ return null }
}


// ========== Index.html behavior ==========
async function initIndex(){
const el = document.getElementById('lessons-list');
const psec = document.getElementById('player-section');
const playerWrap = document.getElementById('player-wrap');
const ptitle = document.getElementById('player-title');
const pdesc = document.getElementById('player-desc');
const closeBtn = document.getElementById('close-player');


const data = await fetchLessons();
document.title = data.siteTitle || document.title;
document.querySelector('h1').textContent = data.siteTitle || 'Volka English';


function openPlayer(lesson){
const id = ytIdFromUrl(lesson.youtube);
if(!id){ alert('Invalid YouTube link'); return }
ptitle.textContent = lesson.title;
pdesc.textContent = lesson.description || '';
playerWrap.innerHTML = `<iframe width="100%" height="480" src="https://www.youtube.com/embed/${id}?rel=0" frameborder="0" allowfullscreen></iframe>`;
psec.classList.remove('hidden');
window.scrollTo({top:0, behavior:'smooth'});
}


if(!data.lessons || data.lessons.length===0){ el.innerHTML = '<div class="muted">No lessons yet.</div>'; return }
el.innerHTML = '';
data.lessons.forEach(l=>{
const card = document.createElement('div'); card.className='lesson';
const h = document.createElement('h4'); h.textContent = l.title; card.appendChild(h);
const d = document.createElement('div'); d.className='muted'; d.textContent = l.course || '';
card.appendChild(d);
const p = document.createElement('p'); p.textContent = l.description || ''; card.appendChild(p);
const open = document.createElement('button'); open.className='btn small'; open.textContent='Open'; open.onclick = ()=> openPlayer(l);
card.appendChild(open);
el.appendChild(card);
});


closeBtn.addEventListener('click', ()=>{ psec.classList.add('hidden'); playerWrap.innerHTML=''; });


document.getElementById('open-dashboard').addEventListener('click', ()=>{ location.href = 'dashboard.html' });
}


// ========== Dashboard behavior ==========
function initDashboard(){
const preview = document.getElementById('preview');
let lessons = [];


function renderPreview(){
preview.innerHTML = '';
if(lessons.length===0) preview.innerHTML = '<div class="muted">No lessons yet</div>';
lessons.forEach(l=>{
const div = document.createElement('div'); div.className='lesson';
const h = document.createElement('h4'); h.textContent = l.title; div.appendChild(h);
const d = document.createElement('div'); d.className='muted'; d.textContent = l.course || ''; div.appendChild(d);
const p = document.createElement('p'); p.textContent = l.description || ''; div.appendChild(p);
preview.appendChild(div);
});
}


document.getElementById('add-lesson').addEventListener('click', ()=>{
const title = document.getElementById('title').value.trim();
const yt = document.getElementById('ytlink').value.trim();
const desc = document.getElementById('desc').value.trim();
const course = document.getElementById('course').value.trim();
if(!title || !yt){ return alert('Title and YouTube link required') }
const id = 'l' + Date.now();
lessons.unshift({ id, title, description: desc, youtube: yt, course });
renderPreview();
document.getElementById('title').value=''; document.getElementById('ytlink').value=''; document.getElementById('desc').value=''; document.getElementById('course').value='';
});


document.getElementById('export-json').addEventListener('click', ()=>{
const siteTitle = prompt('Site title for lessons.json', APP.data?.siteTitle || 'Volka English');
const out = { siteTitle, lessons };
const blob = new Blob([JSON.stringify(out, null, 2)], {type:'application/json'});
const url = URL.createObjectURL(blob);
const a = document.createElement('a'); a.href = url; a.download = 'lessons.json'; a.click(); URL.revokeObjectURL(url);
alert('JSON exported. Replace lessons.json in the repo with this file and push to GitHub.');
});


document.getElementById('clear').addEventListener('click', ()=>{ if(confirm('Clear preview lessons?')){ lessons = []; renderPreview(); } });


document.getElementById('load-json
