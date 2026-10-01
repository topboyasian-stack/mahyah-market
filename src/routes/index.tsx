import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";

type Product = {
  id:number;
  name:string;
  category:string;
  price:number;
  oldPrice?:number;
  rating:string;
  verified?:boolean;
  deal?:string;
  art:string;
  description:string;
};

type Route = {
  view:"home"|"listing"|"product"|"cart"|"checkout"|"support";
  category:string;
  query:string;
  productId:number|null;
};

const categories = ["All","Phones & Tablets","Computers","TV & Audio","Appliances","Accessories"];

const products:Product[] = [
  {id:1,name:"Itel 8KG Front Load Automatic Washing Machine",category:"Appliances",price:420000,oldPrice:450000,rating:"4.9",verified:true,deal:"7% OFF",art:"washer",description:"A practical 8KG front-load washing machine presented with clear pricing, delivery information and an easy checkout path."},
  {id:2,name:"Itel Split Inverter Air Conditioner",category:"Appliances",price:385000,oldPrice:410000,rating:"4.8",verified:true,art:"ac",description:"A clean inverter split AC listing with the key purchase information kept visible before checkout."},
  {id:3,name:"Smart Android LED Television",category:"TV & Audio",price:285000,rating:"4.8",verified:true,art:"tv",description:"A smart LED television for home entertainment, shown in a simple product-first marketplace layout."},
  {id:4,name:"Wireless Bluetooth Speaker",category:"TV & Audio",price:68500,rating:"4.7",verified:true,art:"speaker",description:"Portable wireless audio for everyday listening with a clear price and fast route to checkout."},
  {id:5,name:"Fast-Charge Power Bank 20,000mAh",category:"Accessories",price:38500,rating:"4.9",verified:true,deal:"HOT DEAL",art:"power",description:"A high-capacity power bank listing with the important capacity and price information immediately visible."},
  {id:6,name:"Android Smartphone — 128GB",category:"Phones & Tablets",price:195000,rating:"4.8",verified:true,art:"phone",description:"A 128GB Android smartphone product page designed to make comparison and purchase straightforward."},
  {id:7,name:"Everyday Laptop Backpack",category:"Computers",price:42000,rating:"4.7",verified:true,art:"bag",description:"A simple laptop-carry option presented inside the computer category."},
  {id:8,name:"Wireless Keyboard & Mouse Combo",category:"Computers",price:32500,rating:"4.8",verified:true,art:"keyboard",description:"A wireless keyboard and mouse combo for home, office and everyday computer setups."}
];

const naira = (value:number) => "₦" + value.toLocaleString("en-NG");

function readRoute():Route {
  const raw = window.location.hash.replace(/^#\/?/, "");
  if (!raw) return {view:"home",category:"All",query:"",productId:null};
  const parts = raw.split("/");
  if (parts[0] === "category") return {view:"listing",category:decodeURIComponent(parts.slice(1).join("/") || "All"),query:"",productId:null};
  if (parts[0] === "search") return {view:"listing",category:"All",query:decodeURIComponent(parts.slice(1).join("/")),productId:null};
  if (parts[0] === "deals") return {view:"listing",category:"Deals",query:"",productId:null};
  if (parts[0] === "product") return {view:"product",category:"All",query:"",productId:Number(parts[1]) || null};
  if (parts[0] === "cart") return {view:"cart",category:"All",query:"",productId:null};
  if (parts[0] === "checkout") return {view:"checkout",category:"All",query:"",productId:null};
  if (parts[0] === "support") return {view:"support",category:"All",query:"",productId:null};
  return {view:"home",category:"All",query:"",productId:null};
}

function SearchIcon(){return <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.8" cy="10.8" r="6.8" fill="none" stroke="currentColor" strokeWidth="1.8"/><path d="m16 16 5 5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>}
function BagIcon(){return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 8h12l1 12H5z" fill="none" stroke="currentColor" strokeWidth="1.7"/><path d="M9 9V7a3 3 0 0 1 6 0v2" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/></svg>}
function UserIcon(){return <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="3.5" fill="none" stroke="currentColor" strokeWidth="1.7"/><path d="M5.5 20c.8-3.5 3-5.2 6.5-5.2s5.7 1.7 6.5 5.2" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/></svg>}
function Chevron(){return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 9 6 6 6-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
function Arrow(){return <span aria-hidden="true">↗</span>}

function Brand(){
  return <span className="brand-mark-wrap">
    <span className="brand-mark"><span>M</span></span>
    <span className="brand-word">MAH-YAH <b>GADGETS</b></span>
  </span>
}

function ProductArt({kind}:{kind:string}){
  return <svg viewBox="0 0 520 380" className="product-art" role="img" aria-label="Product illustration">
    <rect width="520" height="380" rx="22" fill="#EDF5FF"/>
    <circle cx="430" cy="74" r="46" fill="#DCEAFF"/>
    <circle cx="86" cy="315" r="66" fill="#F2F8FF"/>
    {kind==="washer"&&<><rect x="118" y="42" width="284" height="292" rx="24" fill="#F8FAFC" stroke="#C7D2E0" strokeWidth="4"/><rect x="142" y="65" width="236" height="48" rx="12" fill="#E4EAF0"/><circle cx="167" cy="89" r="9" fill="#0B63E5"/><rect x="190" y="82" width="100" height="14" rx="7" fill="#94A3B8"/><rect x="305" y="79" width="48" height="20" rx="9" fill="#D1FAE5"/><circle cx="206" cy="208" r="92" fill="#C9D5E0"/><circle cx="206" cy="208" r="72" fill="#22364C"/><circle cx="206" cy="208" r="53" fill="#0F172A"/><circle cx="185" cy="188" r="18" fill="#234667" opacity=".8"/><rect x="295" y="173" width="63" height="9" rx="4" fill="#94A3B8"/><rect x="295" y="192" width="47" height="9" rx="4" fill="#CBD5E1"/><rect x="295" y="211" width="57" height="9" rx="4" fill="#CBD5E1"/></>}
    {kind==="ac"&&<><rect x="72" y="111" width="376" height="146" rx="28" fill="#F9FBFD" stroke="#C7D2E0" strokeWidth="4"/><rect x="96" y="143" width="328" height="65" rx="14" fill="#E2EAF2"/><path d="M117 174h286" stroke="#9FB0C0" strokeWidth="7" strokeDasharray="14 12" strokeLinecap="round"/><circle cx="385" cy="128" r="8" fill="#16A34A"/><rect x="127" y="229" width="96" height="10" rx="5" fill="#0B63E5"/><rect x="239" y="229" width="128" height="10" rx="5" fill="#CBD5E1"/></>}
    {kind==="tv"&&<><rect x="64" y="48" width="392" height="242" rx="22" fill="#071426" stroke="#64748B" strokeWidth="4"/><rect x="84" y="69" width="352" height="198" rx="14" fill="#173A66"/><path d="M112 220c54-78 92-72 142-18 48-70 101-55 156 11" fill="none" stroke="#79B5FF" strokeWidth="13" strokeLinecap="round"/><circle cx="345" cy="118" r="38" fill="#0B63E5" opacity=".42"/><rect x="207" y="304" width="106" height="13" rx="7" fill="#64748B"/><rect x="168" y="317" width="184" height="10" rx="5" fill="#CBD5E1"/></>}
    {kind==="speaker"&&<><rect x="142" y="46" width="236" height="288" rx="42" fill="#15243A"/><rect x="160" y="64" width="200" height="252" rx="34" fill="#233B57"/><circle cx="260" cy="145" r="58" fill="#0F172A" stroke="#6EAFFF" strokeWidth="7"/><circle cx="260" cy="145" r="19" fill="#0B63E5"/><circle cx="260" cy="246" r="40" fill="#0F172A" stroke="#94A3B8" strokeWidth="6"/><circle cx="260" cy="246" r="10" fill="#94A3B8"/></>}
    {kind==="power"&&<><rect x="162" y="38" width="196" height="304" rx="28" fill="#FFFFFF" stroke="#C7D2E0" strokeWidth="4"/><rect x="188" y="76" width="144" height="54" rx="13" fill="#12253E"/><text x="215" y="111" fill="#D6E8FF" fontSize="22" fontFamily="Arial" fontWeight="700">20,000</text><circle cx="260" cy="214" r="52" fill="#0B63E5"/><path d="M260 176v76M222 214h76" stroke="#fff" strokeWidth="9" strokeLinecap="round"/><text x="219" y="299" fill="#64748B" fontSize="16" fontFamily="Arial">FAST CHARGE</text></>}
    {kind==="phone"&&<><rect x="164" y="26" width="192" height="326" rx="34" fill="#DDE7F1" stroke="#93A4B6" strokeWidth="4"/><rect x="180" y="47" width="160" height="284" rx="24" fill="#0F2946"/><rect x="194" y="62" width="132" height="236" rx="18" fill="#193F68"/><circle cx="260" cy="176" r="53" fill="#0B63E5" opacity=".32"/><circle cx="242" cy="158" r="17" fill="#8CC3FF"/><circle cx="278" cy="158" r="17" fill="#CBD5E1"/><rect x="221" y="275" width="78" height="6" rx="3" fill="#7EA0C3"/></>}
    {kind==="bag"&&<><path d="M110 112h300l-27 222H137z" fill="#193B62"/><path d="M177 114c0-76 166-76 166 0" fill="none" stroke="#0B63E5" strokeWidth="19"/><rect x="156" y="171" width="208" height="11" rx="5" fill="#6D8BAA"/><rect x="156" y="198" width="120" height="8" rx="4" fill="#90A7BE"/></>}
    {kind==="keyboard"&&<><rect x="55" y="91" width="300" height="158" rx="18" fill="#F8FAFC" stroke="#B8C6D5" strokeWidth="4"/>{Array.from({length:32},(_,i)=><rect key={i} x={76+(i%8)*32} y={114+Math.floor(i/8)*30} width="24" height="20" rx="5" fill="#8293A6"/>)}<rect x="160" y="222" width="125" height="9" rx="4" fill="#CBD5E1"/><rect x="384" y="147" width="80" height="92" rx="18" fill="#F8FAFC" stroke="#B8C6D5" strokeWidth="4"/><circle cx="424" cy="178" r="13" fill="#0B63E5"/><circle cx="424" cy="212" r="13" fill="#DCEAFF"/></>}
  </svg>
}

function ProductCard({product,onDetails,onAdd}:{product:Product;onDetails:(p:Product)=>void;onAdd:(p:Product)=>void}){
  return <article className="product-card">
    <button className="product-image-button" onClick={()=>onDetails(product)} aria-label={"View " + product.name}>
      <div className="product-image"><ProductArt kind={product.art}/>{product.deal&&<span className="product-badge">{product.deal}</span>}{product.verified&&<span className="verified-badge">✓ Verified</span>}</div>
    </button>
    <div className="product-info">
      <div className="product-meta"><span>{product.category}</span><span>★ {product.rating}</span></div>
      <button className="product-title" onClick={()=>onDetails(product)}>{product.name}</button>
      <div className="product-price-row"><div><strong>{naira(product.price)}</strong>{product.oldPrice&&<del>{naira(product.oldPrice)}</del>}</div></div>
      <div className="product-actions"><button className="details-btn" onClick={()=>onDetails(product)}>View details</button><button className="add-btn" onClick={()=>onAdd(product)}>Add <span>+</span></button></div>
    </div>
  </article>
}

function Header({cartCount,onSearch}:{cartCount:number;onSearch:(q:string)=>void}){
  const [search,setSearch] = useState("");
  const [menu,setMenu] = useState(false);
  const submit = (e:FormEvent) => {e.preventDefault(); if(search.trim()) onSearch(search.trim());};
  return <header className="site-header">
    <div className="header-inner">
      <button className="brand-button" onClick={()=>window.location.hash="#/"}><Brand/></button>
      <form className="header-search" onSubmit={submit}><SearchIcon/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search gadgets, appliances & more"/><button type="submit">Search</button></form>
      <div className="header-tools">
        <span className="currency">₦ NGN</span>
        <button className="tool-button" aria-label="Customer account"><UserIcon/><span>Account</span></button>
        <button className="tool-button cart-tool" onClick={()=>window.location.hash="#/cart"} aria-label="Open cart"><BagIcon/><span>Cart</span>{cartCount>0&&<em>{cartCount}</em>}</button>
      </div>
    </div>
    <div className="nav-row">
      <div className="nav-inner">
        <button className="category-trigger" onClick={()=>setMenu(!menu)}>Categories <Chevron/></button>
        <nav>
          <button onClick={()=>window.location.hash="#/"}>Home</button>
          <button onClick={()=>window.location.hash="#/deals"}>Deals</button>
          <button onClick={()=>window.location.hash="#/support"}>Customer care</button>
        </nav>
        <div className="nav-note"><span className="green-dot"></span> Secure checkout • Nationwide delivery</div>
      </div>
      {menu&&<div className="category-menu">{categories.slice(1).map(item=><button key={item} onClick={()=>{window.location.hash="#/category/" + encodeURIComponent(item);setMenu(false)}}>{item}<span>→</span></button>)}</div>}
    </div>
  </header>
}

export function Index(){
  const [route,setRoute] = useState<Route>(()=>readRoute());
  const [cart,setCart] = useState<number[]>([]);
  const [notice,setNotice] = useState("");
  const selectedProduct = route.productId ? products.find(p=>p.id===route.productId) || null : null;

  useEffect(()=>{
    const handler=()=>{setRoute(readRoute());window.scrollTo({top:0,left:0,behavior:"instant" as ScrollBehavior});};
    window.addEventListener("hashchange",handler);
    return()=>window.removeEventListener("hashchange",handler);
  },[]);

  function go(path:string){window.location.hash="#/" + path}
  function addToCart(product:Product, buyNow=false){
    setCart(items=>[...items,product.id]);
    setNotice(product.name + " added to cart");
    window.setTimeout(()=>setNotice(""),2200);
    if(buyNow) go("checkout");
  }
  function removeFromCart(index:number){setCart(items=>items.filter((_,i)=>i!==index))}
  function categoryProducts(){
    return products.filter(p=>{
      const categoryMatch=route.category==="All" || route.category==="Deals" ? true : p.category===route.category;
      const dealMatch=route.category==="Deals" ? Boolean(p.deal) : true;
      const queryMatch=!route.query || p.name.toLowerCase().includes(route.query.toLowerCase());
      return categoryMatch && dealMatch && queryMatch;
    });
  }
  const listing = useMemo(()=>categoryProducts(),[route.category,route.query]);
  const cartProducts = cart.map(id=>products.find(p=>p.id===id)).filter(Boolean) as Product[];
  const cartTotal = cartProducts.reduce((sum,p)=>sum+p.price,0);

  return <div className="store-shell">
    <div className="announcement"><div><strong>Same-day delivery in Owerri</strong><span>•</span> Shop gadgets, appliances & electronics with confidence</div><button onClick={()=>go("support")}>Need help? Chat with us</button></div>
    <Header cartCount={cart.length} onSearch={q=>go("search/" + encodeURIComponent(q))}/>

    {route.view==="home"&&<Home onCategory={(c)=>go("category/" + encodeURIComponent(c))} onProduct={(p)=>go("product/" + p.id)} onAdd={addToCart} onDeals={()=>go("deals")}/>}
    {route.view==="listing"&&<Listing title={route.category==="All" ? "Shop all gadgets" : route.category==="Deals" ? "Deals worth seeing" : route.category} subtitle={route.query ? "Search results for “" + route.query + "”" : "Browse this collection without leaving the shopping experience."} products={listing} onProduct={p=>go("product/" + p.id)} onAdd={addToCart} onCategory={c=>go("category/" + encodeURIComponent(c))}/>}
    {route.view==="product"&&selectedProduct&&<ProductDetail product={selectedProduct} onBack={()=>go("category/" + encodeURIComponent(selectedProduct.category))} onAdd={addToCart} onBuy={p=>addToCart(p,true)} onProduct={p=>go("product/" + p.id)}/>}
    {route.view==="cart"&&<Cart products={cartProducts} total={cartTotal} onRemove={removeFromCart} onShop={()=>go("")} onCheckout={()=>go("checkout")} onProduct={p=>go("product/" + p.id)}/>}
    {route.view==="checkout"&&<Checkout products={cartProducts} total={cartTotal} onBack={()=>go("cart")} onShop={()=>go("")} />}
    {route.view==="support"&&<Support onShop={()=>go("")} onWhatsApp={()=>window.open("https://wa.me/2349152122459","_blank")}/>}
    {route.view==="home"&&<Footer onNav={go}/>}
    {route.view!=="home"&&<Footer onNav={go}/>}
    {notice&&<div className="toast" role="status"><span>✓</span>{notice}</div>}
    <a className="whatsapp-float" href="https://wa.me/2349152122459" target="_blank" rel="noreferrer" aria-label="Chat on WhatsApp">⌕</a>
  </div>
}

function Home({onCategory,onProduct,onAdd,onDeals}:{onCategory:(c:string)=>void;onProduct:(p:Product)=>void;onAdd:(p:Product)=>void;onDeals:()=>void}){
  const featured=products.slice(0,4);
  const categoryCards=[
    {name:"Phones & Tablets",label:"PHONES",kind:"phone"},
    {name:"Computers",label:"COMPUTING",kind:"keyboard"},
    {name:"TV & Audio",label:"ENTERTAINMENT",kind:"tv"},
    {name:"Appliances",label:"HOME",kind:"washer"},
    {name:"Accessories",label:"ACCESSORIES",kind:"power"}
  ];
  return <main className="page mahyah-home">
    <section className="graphic-hero wrap">
      <div className="graphic-copy">
        <span className="eyebrow blue">MAH-YAH MARKET · GADGETS FOR EVERYDAY LIFE</span>
        <h1>Your tech.<br/><span>Your home.</span><br/>Your way.</h1>
        <p>Phones, computers, entertainment, appliances and everyday tech — curated into one fast, mobile-friendly shopping experience.</p>
        <div className="hero-buttons"><button className="primary-btn" onClick={()=>onCategory("All")}>Start shopping <Arrow/></button><button className="secondary-btn" onClick={onDeals}>See deals</button></div>
        <div className="graphic-trust"><span>✓ Paystack ready</span><span>✓ Delivery across Nigeria</span><span>✓ WhatsApp support</span></div>
      </div>
      <div className="graphic-collage" aria-label="Featured MAH-YAH products">
        <div className="collage-orb orb-one"></div><div className="collage-orb orb-two"></div>
        <div className="collage-label"><small>MAH-YAH</small><strong>TECH + HOME</strong></div>
        <button className="collage-card collage-main" onClick={()=>onProduct(products[0])}><ProductArt kind="washer"/><div><span>FEATURED DEAL · 7% OFF</span><strong>Itel 8KG Washing Machine</strong><b>₦420,000</b></div></button>
        <button className="collage-card collage-phone" onClick={()=>onProduct(products[5])}><ProductArt kind="phone"/><span>ANDROID · 128GB</span></button>
        <button className="collage-card collage-power" onClick={()=>onProduct(products[4])}><ProductArt kind="power"/><span>20,000mAh · FAST CHARGE</span></button>
      </div>
    </section>

    <section className="mobile-category-strip wrap">
      <div className="strip-heading"><div><span className="eyebrow">SHOP BY CATEGORY</span><h2>Pick a lane.</h2></div><button onClick={()=>onCategory("All")}>All products →</button></div>
      <div className="graphic-category-grid">{categoryCards.map((item,i)=><button key={item.name} className={"graphic-category gc-"+(i+1)} onClick={()=>onCategory(item.name)}>
        <div className="category-mini-art"><ProductArt kind={item.kind}/></div><div className="category-label"><small>{item.label}</small><strong>{item.name}</strong><span>Shop now ↗</span></div>
      </button>)}</div>
    </section>

    <section className="mobile-trust wrap">
      <div><b>01</b><strong>Clear prices</strong><small>No hunting through the page for the important details.</small></div>
      <div><b>02</b><strong>Simple checkout</strong><small>Browse first, then move cleanly into delivery and Paystack.</small></div>
      <div><b>03</b><strong>Human support</strong><small>WhatsApp stays one tap away when you need help.</small></div>
    </section>

    <section className="section wrap graphic-products">
      <div className="section-heading"><div><span className="eyebrow">TRENDING NOW</span><h2>Good tech, without the clutter.</h2></div><button className="text-link" onClick={()=>onCategory("All")}>View all →</button></div>
      <div className="product-grid home-products">{featured.map(p=><ProductCard key={p.id} product={p} onDetails={onProduct} onAdd={onAdd}/>)}</div>
    </section>

    <section className="editorial-panel wrap">
      <div><span className="eyebrow">THE MAH-YAH FEEL</span><h2>A shopping experience designed for the phone in your hand.</h2><p>Large product visuals, short paths and obvious actions make the sample feel closer to a modern shopping app than a long traditional storefront.</p></div>
      <div className="editorial-actions"><button className="primary-btn" onClick={()=>onCategory("Appliances")}>Explore appliances <Arrow/></button><button className="secondary-btn" onClick={onDeals}>Browse deals</button></div>
    </section>
  </main>
}
function Listing({title,subtitle,products,onProduct,onAdd,onCategory}:{title:string;subtitle:string;products:Product[];onProduct:(p:Product)=>void;onAdd:(p:Product)=>void;onCategory:(c:string)=>void}){
  const [sort,setSort]=useState("featured");
  const sorted=useMemo(()=>{
    const copy=[...products];
    if(sort==="low") copy.sort((a,b)=>a.price-b.price);
    if(sort==="high") copy.sort((a,b)=>b.price-a.price);
    if(sort==="rating") copy.sort((a,b)=>Number(b.rating)-Number(a.rating));
    return copy;
  },[products,sort]);
  return <main className="page"><section className="listing-hero wrap"><div className="breadcrumbs"><button onClick={()=>onCategory("All")}>Home</button><span>/</span><span>{title}</span></div><span className="eyebrow blue">SHOP COLLECTION</span><h1>{title}</h1><p>{subtitle}</p></section>
    <section className="listing-content wrap">
      <aside className="listing-sidebar"><strong>Browse categories</strong>{categories.map(c=><button key={c} onClick={()=>onCategory(c)} className={title===c || (title==="Shop all gadgets"&&c==="All") ? "side-active":""}>{c}<span>→</span></button>)}<div className="sidebar-help"><span>Need help?</span><strong>Chat with MAH-YAH</strong><small>WhatsApp support is one click away.</small><a href="https://wa.me/2349152122459">Open WhatsApp →</a></div></aside>
      <div className="listing-main"><div className="listing-toolbar"><span><strong>{sorted.length}</strong> products</span><label>Sort <select value={sort} onChange={e=>setSort(e.target.value)}><option value="featured">Featured</option><option value="low">Price: low to high</option><option value="high">Price: high to low</option><option value="rating">Top rated</option></select></label></div>{sorted.length ? <div className="product-grid">{sorted.map(p=><ProductCard key={p.id} product={p} onDetails={onProduct} onAdd={onAdd}/>)}</div> : <div className="empty-state"><strong>No matching products yet.</strong><p>Try another category or search term.</p><button className="primary-btn" onClick={()=>onCategory("All")}>View all products</button></div>}</div>
    </section>
  </main>
}

function ProductDetail({product,onBack,onAdd,onBuy,onProduct}:{product:Product;onBack:()=>void;onAdd:(p:Product)=>void;onBuy:(p:Product)=>void;onProduct:(p:Product)=>void}){
  const related=products.filter(p=>p.category===product.category&&p.id!==product.id).slice(0,3);
  const [quantity,setQuantity]=useState(1);
  return <main className="page"><section className="product-page wrap">
    <div className="breadcrumbs"><button onClick={onBack}>← Back to collection</button><span>/</span><span>{product.category}</span><span>/</span><strong>{product.name}</strong></div>
    <div className="product-detail"><div className="detail-media"><ProductArt kind={product.art}/>{product.deal&&<span className="detail-badge">{product.deal}</span>}</div><div className="detail-copy"><span className="eyebrow blue">{product.category}</span><h1>{product.name}</h1><div className="rating-row"><span>★ {product.rating}</span><span>•</span><span>✓ Verified listing</span></div><div className="price-block"><strong>{naira(product.price)}</strong>{product.oldPrice&&<del>{naira(product.oldPrice)}</del>}</div><p className="detail-description">{product.description}</p><div className="delivery-card"><span>▣</span><div><strong>Delivery information</strong><small>Delivery options and final charges can be confirmed during checkout.</small></div></div><div className="quantity-row"><span>Quantity</span><div><button onClick={()=>setQuantity(Math.max(1,quantity-1))}>−</button><strong>{quantity}</strong><button onClick={()=>setQuantity(quantity+1)}>+</button></div></div><div className="detail-actions"><button className="secondary-btn" onClick={()=>{for(let i=0;i<quantity;i++)onAdd(product)}}>Add to cart</button><button className="primary-btn" onClick={()=>onBuy(product)}>Buy now <Arrow/></button></div><div className="secure-line"><span>✓</span> Secure checkout</div></div></div>
  </section><section className="section wrap"><div className="section-heading"><div><span className="eyebrow">You may also like</span><h2>More from {product.category}.</h2></div></div><div className="product-grid">{related.map(p=><ProductCard key={p.id} product={p} onDetails={onProduct} onAdd={onAdd}/>)}</div></section></main>
}

function Cart({products,total,onRemove,onShop,onCheckout,onProduct}:{products:Product[];total:number;onRemove:(index:number)=>void;onShop:()=>void;onCheckout:()=>void;onProduct:(p:Product)=>void}){
  return <main className="page"><section className="listing-hero wrap"><div className="breadcrumbs"><button onClick={onShop}>Home</button><span>/</span><span>Cart</span></div><span className="eyebrow blue">YOUR SHOPPING BAG</span><h1>Your cart.</h1><p>Review your selected products before moving to delivery and payment.</p></section><section className="cart-layout wrap">
    <div className="cart-list">{products.length ? products.map((p,i)=><article className="cart-item" key={i}><button className="cart-thumb" onClick={()=>onProduct(p)}><ProductArt kind={p.art}/></button><div className="cart-item-copy"><span>{p.category}</span><button onClick={()=>onProduct(p)}>{p.name}</button><strong>{naira(p.price)}</strong></div><button className="remove-btn" onClick={()=>onRemove(i)}>Remove</button></article>) : <div className="empty-state large"><strong>Your cart is empty.</strong><p>Choose a product and it will appear here.</p><button className="primary-btn" onClick={onShop}>Continue shopping</button></div>}</div>
    <aside className="order-summary"><span className="eyebrow">Order summary</span><h2>Checkout total</h2><div className="summary-line"><span>Items</span><strong>{products.length}</strong></div><div className="summary-line"><span>Subtotal</span><strong>{naira(total)}</strong></div><div className="summary-line"><span>Delivery</span><span>Calculated at checkout</span></div><div className="summary-total"><span>Total</span><strong>{naira(total)}</strong></div><button className="primary-btn full" disabled={!products.length} onClick={onCheckout}>Proceed to checkout <Arrow/></button><small>Paystack is shown as the intended online payment gateway for the sample.</small></aside>
  </section></main>
}

function Checkout({products,total,onBack,onShop}:{products:Product[];total:number;onBack:()=>void;onShop:()=>void}){
  const [submitted,setSubmitted]=useState(false);
  return <main className="page"><section className="checkout-head wrap"><div className="breadcrumbs"><button onClick={onBack}>← Back to cart</button><span>/</span><span>Checkout</span></div><span className="eyebrow blue">SAFE & SIMPLE CHECKOUT</span><h1>Delivery details.</h1><p>Keep customer information clear and separate from the browsing experience.</p></section><section className="checkout-layout wrap">
    <form className="checkout-form" onSubmit={e=>{e.preventDefault();setSubmitted(true)}}><div className="form-card"><h2>Contact information</h2><div className="form-grid"><label>Full name<input required placeholder="Customer name"/></label><label>Phone number<input required placeholder="0800 000 0000"/></label><label className="wide">Email address<input type="email" placeholder="name@example.com"/></label></div></div><div className="form-card"><h2>Delivery address</h2><div className="form-grid"><label className="wide">Street address<input required placeholder="House number, street and area"/></label><label>City<input required placeholder="Owerri"/></label><label>State<input required placeholder="Imo"/></label><label className="wide">Note for merchant<textarea placeholder="Anything the store should know?"></textarea></label></div></div><div className="payment-card"><div><span className="paystack-logo">P</span><div><strong>Paystack</strong><small>Online payment gateway</small></div></div><span>✓ Secure</span></div>{submitted&&<div className="demo-notice">Checkout preview submitted. In a production version, this button would pass the order to the connected Paystack checkout.</div>}<button className="primary-btn full" type="submit" disabled={!products.length}>Continue to Paystack <Arrow/></button><small className="form-note">This sample intentionally uses a preview flow; live payment credentials can be connected for the final store.</small></form>
    <aside className="checkout-summary-card"><span className="eyebrow">Your order</span>{products.length ? products.map((p,i)=><div className="mini-item" key={i}><div><strong>{p.name}</strong><small>{p.category}</small></div><span>{naira(p.price)}</span></div>) : <div className="empty-order"><strong>No items yet.</strong><button onClick={onShop}>Return to shop</button></div>}<div className="summary-total"><span>Total</span><strong>{naira(total)}</strong></div><div className="checkout-note">Delivery options and final shipping cost are confirmed before payment.</div></aside>
  </section></main>
}

function Support({onShop,onWhatsApp}:{onShop:()=>void;onWhatsApp:()=>void}){
  return <main className="page"><section className="support-hero wrap"><div><span className="eyebrow blue">CUSTOMER CARE</span><h1>Need help choosing the right gadget?</h1><p>Support should feel like part of the store, not an afterthought. This screen gives customers one clear place to ask questions before purchase.</p><div className="hero-buttons"><button className="primary-btn" onClick={onWhatsApp}>Chat on WhatsApp <Arrow/></button><button className="secondary-btn" onClick={onShop}>Back to shop</button></div></div><div className="support-card"><div><span>01</span><strong>Product questions</strong><small>Ask about a product before you buy.</small></div><div><span>02</span><strong>Delivery questions</strong><small>Confirm delivery details for your location.</small></div><div><span>03</span><strong>Payment help</strong><small>Get help with the checkout flow.</small></div></div></section><section className="section wrap support-faq"><div><span className="eyebrow">Designed for clarity</span><h2>Helpful information without the clutter.</h2></div><div className="faq-grid"><article><strong>How do I choose a product?</strong><p>Open a category, compare product cards, then open the dedicated product screen for the full purchase view.</p></article><article><strong>Can I ask before ordering?</strong><p>Yes. The WhatsApp support action remains visible so customers can contact the store before payment.</p></article><article><strong>Where does payment happen?</strong><p>The checkout screen is kept separate from browsing, with Paystack clearly presented as the intended online gateway.</p></article><article><strong>How does delivery work?</strong><p>The store can confirm the exact delivery option and charge during checkout rather than burying it on the product page.</p></article></div></section></main>
}

function Footer({onNav}:{onNav:(path:string)=>void}){
  return <footer><div className="footer-main wrap"><div className="footer-brand-block"><button className="brand-button" onClick={()=>onNav("")}><Brand/></button><p>Gadgets, electronics and appliances presented in a cleaner, easier-to-navigate marketplace experience.</p></div><div><strong>Shop</strong><button onClick={()=>onNav("")}>All products</button><button onClick={()=>onNav("deals")}>Deals</button><button onClick={()=>onNav("category/" + encodeURIComponent("Appliances"))}>Appliances</button></div><div><strong>Customer care</strong><button onClick={()=>onNav("support")}>Support</button><a href="https://wa.me/2349152122459">WhatsApp</a><button onClick={()=>onNav("checkout")}>Checkout</button></div><div><strong>Payment</strong><span className="paystack-pill">Paystack</span><small>Online checkout gateway</small></div></div><div className="footer-bottom wrap"><span>© 2026 MAH-YAH</span><span>Gadgets • Electronics • Appliances</span></div></footer>
}
