const products = [
  { id:'m-command', gender:'men', name:'The Command', cut:'Men’s structured winter trench', price:472, image:'assets/men-command.webp', tag:'Military cut', color:'Black', description:'A commanding double-breasted silhouette cut from dense winter wool, with a high collar, broad lapels and a quilted thermal lining.' },
  { id:'m-regent', gender:'men', name:'The Regent', cut:'Men’s English winter trench', price:424, image:'assets/men-english.webp', tag:'English cut', color:'Camel', description:'Classic English trench architecture reworked for deep winter in warm wool-cashmere, with a storm flap, epaulettes and full-length coverage.' },
  { id:'m-metro', gender:'men', name:'The Metropolitan', cut:'Men’s minimalist winter trench', price:372, image:'assets/men-modern.webp', tag:'Modern cut', color:'Slate', description:'A clean single-breasted trench with concealed closure, sculpted shoulder and an uninterrupted long line for modern city dressing.' },
  { id:'w-command', gender:'women', name:'The Command', cut:'Women’s structured winter trench', price:472, image:'assets/women-command.webp', tag:'Military cut', color:'Black', description:'A refined, full-length double-breasted trench with a high collar and precise waist, engineered in dense wool for a severe New York winter.' },
  { id:'w-regent', gender:'women', name:'The Regent', cut:'Women’s English winter trench', price:424, image:'assets/women-english.webp', tag:'English cut', color:'Camel', description:'An elegant English silhouette with storm flap, belt and warm wool-cashmere construction, offering complete coverage without excess bulk.' },
  { id:'w-metro', gender:'women', name:'The Metropolitan', cut:'Women’s minimalist winter trench', price:372, image:'assets/women-modern.webp', tag:'Modern cut', color:'Slate', description:'A minimal wrap trench with a soft architectural line, hidden fastening and insulated interior for understated winter protection.' }
];

const grid = document.querySelector('[data-product-grid]');
const money = value => new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0}).format(value);
grid.innerHTML = products.map(p => `<article class="product-card" data-gender="${p.gender}">
  <button class="product-image" type="button" data-product="${p.id}" aria-label="View ${p.name}, ${p.cut}">
    <img src="${p.image}" alt="${p.cut} in ${p.color}" loading="lazy"><span class="product-tag">${p.tag}</span>
  </button><div class="product-info"><h3>${p.name}</h3><p>${p.cut}</p><strong>${money(p.price)}</strong></div></article>`).join('');

const filter = value => {
  document.querySelectorAll('.filter').forEach(b => b.classList.toggle('active',b.dataset.filter===value));
  document.querySelectorAll('.product-card').forEach(card => card.hidden = value!=='all' && card.dataset.gender!==value);
};
document.querySelectorAll('.filter').forEach(b => b.addEventListener('click',()=>filter(b.dataset.filter)));
document.querySelectorAll('[data-filter-link]').forEach(a => a.addEventListener('click',()=>filter(a.dataset.filterLink)));

const dialog = document.querySelector('[data-product-dialog]');
const dialogContent = document.querySelector('[data-product-dialog-content]');
let selectedSize = 'M';
function openProduct(id){
  const p=products.find(x=>x.id===id); selectedSize='M';
  dialogContent.innerHTML=`<div class="product-detail"><img src="${p.image}" alt="${p.cut} in ${p.color}"><div class="product-detail-copy"><p class="eyebrow">${p.gender==='men'?"Men's":"Women's"} collection</p><h2>${p.name}</h2><p class="price">${money(p.price)}</p><p class="description">${p.description}</p><label>Select size</label><div class="sizes">${['XS','S','M','L','XL'].map(s=>`<button class="size ${s==='M'?'selected':''}" type="button" data-size="${s}">${s}</button>`).join('')}</div><button class="button button-dark button-full" type="button" data-add="${p.id}">Add to bag</button></div></div>`;
  dialog.showModal(); document.body.classList.add('locked');
  dialogContent.querySelectorAll('[data-size]').forEach(b=>b.addEventListener('click',()=>{ selectedSize=b.dataset.size; dialogContent.querySelectorAll('[data-size]').forEach(x=>x.classList.toggle('selected',x===b)); }));
  dialogContent.querySelector('[data-add]').addEventListener('click',()=>{ addToCart(p,selectedSize); dialog.close(); openCart(); });
}
grid.addEventListener('click',e=>{ const b=e.target.closest('[data-product]'); if(b) openProduct(b.dataset.product); });
document.querySelector('[data-close-product]').addEventListener('click',()=>dialog.close());
dialog.addEventListener('close',()=>document.body.classList.remove('locked'));

let cart = JSON.parse(localStorage.getItem('irtur-cart')||'[]');
const cartDrawer=document.querySelector('[data-cart]'), overlay=document.querySelector('[data-overlay]');
function saveCart(){ localStorage.setItem('irtur-cart',JSON.stringify(cart)); renderCart(); }
function addToCart(product,size){ const found=cart.find(x=>x.id===product.id&&x.size===size); if(found) found.quantity++; else cart.push({id:product.id,size,quantity:1}); saveCart(); }
function renderCart(){
  const count=cart.reduce((a,x)=>a+x.quantity,0); document.querySelector('[data-cart-count]').textContent=count;
  const items=document.querySelector('[data-cart-items]'), empty=document.querySelector('[data-cart-empty]'), summary=document.querySelector('[data-cart-summary]');
  empty.hidden=count>0; summary.hidden=count===0;
  items.innerHTML=cart.map((x,i)=>{const p=products.find(v=>v.id===x.id);return `<div class="cart-item"><img src="${p.image}" alt=""><div><h3>${p.name}</h3><p>${p.color} · Size ${x.size} · Qty ${x.quantity}</p><strong>${money(p.price*x.quantity)}</strong></div><button class="cart-remove" type="button" data-remove="${i}">Remove</button></div>`}).join('');
  document.querySelector('[data-cart-total]').textContent=money(cart.reduce((a,x)=>a+products.find(p=>p.id===x.id).price*x.quantity,0));
  items.querySelectorAll('[data-remove]').forEach(b=>b.addEventListener('click',()=>{cart.splice(Number(b.dataset.remove),1);saveCart();}));
}
function openCart(){ cartDrawer.classList.add('open'); cartDrawer.setAttribute('aria-hidden','false'); overlay.hidden=false; document.body.classList.add('locked'); }
function closeCart(){ cartDrawer.classList.remove('open'); cartDrawer.setAttribute('aria-hidden','true'); overlay.hidden=true; document.body.classList.remove('locked'); }
document.querySelector('[data-open-cart]').addEventListener('click',openCart); document.querySelector('[data-close-cart]').addEventListener('click',closeCart); overlay.addEventListener('click',closeCart);

const checkout=document.querySelector('[data-checkout-dialog]');
document.querySelector('[data-checkout]').addEventListener('click',()=>{closeCart();checkout.showModal();document.body.classList.add('locked');});
document.querySelectorAll('[data-close-checkout]').forEach(b=>b.addEventListener('click',()=>checkout.close()));
checkout.addEventListener('close',()=>document.body.classList.remove('locked'));
document.querySelector('[data-checkout-form]').addEventListener('submit',e=>{e.preventDefault();e.target.hidden=true;document.querySelector('[data-checkout-success]').hidden=false;cart=[];saveCart();});
renderCart();
