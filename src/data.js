export const fmt = n => "$" + n.toFixed(2);

/* ================= DATA ================= */
export const PRODUCTS = [
 {id:"p01",name:"Oval Woven Wall Hanging – Purple Bloom",price:15,old:null,cat:"Woven",img:"assets/p01-oval-wall-hanging.jpg",rating:5,rev:34,badge:"Your Product",mine:true,desc:"Oval palm-leaf wall hanging with rings of purple, pink and teal around a natural straw heart — photographed with its plain woven twin."},
 {id:"p02",name:"Shimmer Tassel Woven Mat – Pink & Gold",price:15,old:null,cat:"Woven",img:"assets/p02-shimmer-tassel-mat.jpg",rating:5,rev:27,badge:"Your Product",mine:true,desc:"Silver-shimmer coil mat edged with pink and marigold tassels — it catches the light at parties and festive tables."},
 {id:"p03",name:"Natural Straw Star Mat with Rainbow Tassels",price:15,old:null,cat:"Woven",img:"assets/p03-straw-star-mat.jpg",rating:4.5,rev:31,badge:"Your Product",mine:true,desc:"Natural straw woven into a bold star pattern and finished with a rainbow tassel fringe all the way round."},
 {id:"p04",name:"Mirror Centre Woven Mat – Red & Gold",price:15,old:null,cat:"Woven",img:"assets/p04-mirror-mat-red-gold.jpg",rating:5,rev:48,badge:"Your Product",mine:true,desc:"Metallic red and gold weave with a real mirror at its centre — made for festive trays, gifts and celebration décor."},
 {id:"p05",name:"Geometric Woven Placemat Pair – Pink & Teal",price:15,old:null,cat:"Woven",img:"assets/p05-geometric-placemat-pair.jpg",rating:5,rev:39,badge:"Your Product",mine:true,desc:"A pair of coil placemats in pink, teal and natural straw with bold geometric rings. Sold as a set of two."},
 {id:"p06",name:"Checkerboard Spiral Woven Mat",price:15,old:null,cat:"Woven",img:"assets/p06-checkerboard-spiral-mat.jpg",rating:4.5,rev:22,badge:"Your Product",mine:true,desc:"Checkerboard spiral of violet, rose and natural straw spiralling into a bright pink heart at the centre."},
 {id:"p07",name:"Starburst Mirror Woven Mat – Purple",price:15,old:null,cat:"Woven",img:"assets/p07-starburst-mirror-mat.jpg",rating:5,rev:26,badge:"Your Product",mine:true,desc:"Deep purple starburst weave around a mirror centre — a wall piece that doubles as striking table décor."},
 {id:"p08",name:"Mirror Woven Mat Set – Pink & Green",price:15,old:null,cat:"Woven",img:"assets/p08-mirror-mat-set-pink-green.jpg",rating:5,rev:33,badge:"Your Product",mine:true,desc:"A festive set of mirror-centre woven mats in pink and green — for serving trays, walls and celebrations."},
 {id:"p09",name:"Colourful Woven Straw Mat with Tassel Fringe",price:15,old:null,cat:"Woven",img:"assets/p09-tassel-fringe-mat.jpg",rating:5,rev:41,badge:"Your Product",mine:true,desc:"Natural straw round mat ringed with rainbow tassels — hand-woven for floors, walls and festive table settings."},
 {id:"p10",name:"Colourful Spiral Woven Placemat",price:15,old:null,cat:"Woven",img:"assets/p10-spiral-placemat.jpg",rating:5,rev:36,badge:"Your Product",mine:true,desc:"Hypnotic spiral of red, green, blue and yellow — a hand-woven placemat that turns every meal into a celebration."},
 {id:"p11",name:"Colourful Radial Woven Placemat",price:15,old:null,cat:"Woven",img:"assets/p11-radial-placemat.jpg",rating:4.5,rev:29,badge:"Your Product",mine:true,desc:"Sunburst radial weave in navy, pink, teal and gold with a zig-zag rim. Dining table, wall art or gift — it does it all."},
 {id:"p12",name:"Colourful Radial Woven Mandala Mat",price:15,old:null,cat:"Woven",img:"assets/p12-mandala-mat.jpg",rating:5,rev:52,badge:"Your Product",mine:true,desc:"Bold black mandala mat with pink, teal and yellow diamond motifs. A statement centrepiece, woven entirely by hand."}
];

export const NEW_COLLECTION = [
 {id:"n01",name:"Mirror Mat — Pink & Green Spiral",price:15,old:null,cat:"Woven",img:"assets/n01-mirror-mat-room.jpg",rating:5,rev:9,badge:"New",desc:"A pink and green spiral mirror mat photographed in a bright room setting — soft, fresh and made for walls and festive trays."},
 {id:"n02",name:"Mirror Mat — Rainbow Spiral",price:15,old:null,cat:"Woven",img:"assets/n02-rainbow-mirror-mat.jpg",rating:5,rev:12,badge:"New",desc:"Full rainbow spirals around a mirror centre, shown on deep maroon cloth. Our most colourful new piece."},
 {id:"n08",name:"Kaleidoscope Woven Mat",price:15,old:null,cat:"Woven",img:"assets/n08-kaleidoscope-mat.jpg",rating:5,rev:7,badge:"New",desc:"Orange, green and black kaleidoscope diamonds on a clean white background — a bold geometric statement mat."},
 {id:"n20",name:"Woven Display Tray",price:15,old:null,cat:"Woven",img:"assets/n20-display-tray.jpg",rating:5,rev:11,badge:"New",desc:"A multicolour woven tray shown standing on its display stand — pink, teal, purple and yellow in a festival pattern."}
];
/* The remaining new-collection photos (lookbook + lifestyle) as full Shop products,
   so every picture on the site can be found — and bought — in the Shop. */
export const NEW_SHOP_EXTRA = [
 {id:"n03",name:"Geometric Star Mat",price:15,old:null,cat:"Woven",img:"assets/n03-geometric-star-mat.jpg",rating:5,rev:8,badge:"New",desc:"Geometric star woven mat in maroon, black, blue and yellow — a bold patterned piece for walls and table centres."},
 {id:"n04",name:"Sunset Coiled Basket",price:15,old:null,cat:"Woven",img:"assets/n04-coiled-basket.jpg",rating:5,rev:6,badge:"New",desc:"Coiled basket in sunset shades of orange, red and purple, photographed on wood — woven ring by ring by hand."},
 {id:"n05",name:"Yellow Star & Zigzag Mat",price:15,old:null,cat:"Woven",img:"assets/n05-yellow-star-mat.jpg",rating:5,rev:10,badge:"New",desc:"Sunshine-yellow star and zigzag woven mat on a clean white background — bright, cheerful and made to lift a room."},
 {id:"n06",name:"Bold Star Basket",price:15,old:null,cat:"Woven",img:"assets/n06-star-basket-hand.jpg",rating:5,rev:7,badge:"New",desc:"Bold star-pattern woven basket photographed against a stone wall — deep colours and a strong geometric weave."},
 {id:"n07",name:"Star Basket — Teal & Rust",price:15,old:null,cat:"Woven",img:"assets/n07-star-basket-teal.jpg",rating:5,rev:13,badge:"New",desc:"Star basket in teal and rust on natural straw — 34 cm diameter × 6 cm height, straight from the lookbook shelves."},
 {id:"n09",name:"Star Placemats — Set of 4",price:15,old:null,cat:"Woven",img:"assets/n09-star-placemats-set.jpg",rating:5,rev:9,badge:"New",desc:"A matching set of four star woven placemats shown on wood — made for shared meals and festive tables."},
 {id:"n10",name:"Pink Star Floral Mat",price:15,old:null,cat:"Woven",img:"assets/n10-pink-star-floral.jpg",rating:5,rev:6,badge:"New",desc:"Pink star floral woven mat in soft blossom tones on white — gentle colours around a bold star heart."},
 {id:"n11",name:"Multicolour Coiled Mat",price:15,old:null,cat:"Woven",img:"assets/n11-multicolour-coiled-mat.jpg",rating:5,rev:8,badge:"New",desc:"Multicolour coiled woven mat with a red rim, shown on dark cloth — rich rings of hand-dyed straw."},
 {id:"n12",name:"Sun Zigzag Basket",price:15,old:null,cat:"Woven",img:"assets/n12-sun-zigzag-basket.jpg",rating:5,rev:7,badge:"New",desc:"Sun zigzag woven basket with a cream centre and a sun-ray rim — warm, bright and entirely hand-woven."},
 {id:"n13",name:"Pink & Teal Star Mat",price:15,old:null,cat:"Woven",img:"assets/n13-pink-teal-star.jpg",rating:5,rev:11,badge:"New",desc:"Pink and teal star woven mat, photographed on cork — a festival-colour star for walls and tables."},
 {id:"n14",name:"Yellow Star Zigzag Mat",price:15,old:null,cat:"Woven",img:"assets/n14-yellow-star-zigzag.jpg",rating:5,rev:5,badge:"New",desc:"Yellow star zigzag woven mat with a striped rim and star centre — sunshine colours in every ring."},
 {id:"n15",name:"Woven Tray Collection — Six Trays",price:15,old:null,cat:"Woven",img:"assets/n15-tray-collection.jpg",rating:5,rev:12,badge:"New",desc:"The new tray collection — six colourful woven trays together, each one coiled and stitched entirely by hand."},
 {id:"n16",name:"Solid Colour Placemats — Dining Set",price:15,old:null,cat:"Woven",img:"assets/n16-table-placemats.jpg",rating:5,rev:6,badge:"New",desc:"Solid colour woven placemats set out on a dining table, ready for dinner — simple, sturdy and hand-woven."},
 {id:"n17",name:"Rainbow Spiral Placemat",price:15,old:null,cat:"Woven",img:"assets/n17-rainbow-placemat-cutlery.jpg",rating:5,rev:10,badge:"New",desc:"Rainbow spiral woven placemat styled with cutlery and glass — turns an everyday meal into a celebration."},
 {id:"n18",name:"Pastel Placemats on Wood",price:15,old:null,cat:"Woven",img:"assets/n18-pastel-table.jpg",rating:5,rev:7,badge:"New",desc:"Pastel spiral woven placemats on a wooden table with a vase — soft colours, fine hand weave."},
 {id:"n19",name:"Sunrise Bowls & Coasters Set",price:15,old:null,cat:"Woven",img:"assets/n19-sunrise-flatlay.jpg",rating:5,rev:9,badge:"New",desc:"Sunrise coiled bowls, coasters and trivet in one flat-lay — warm morning colours, woven as a matching set."}
];
export const DEALS = [
 {id:"deal-1",pieces:1,price:15,img:"assets/n13-pink-teal-star.jpg"},
 {id:"deal-4",pieces:4,price:22,img:"assets/n09-star-placemats-set.jpg",pop:true},
 {id:"deal-8",pieces:8,price:30,img:"assets/n15-tray-collection.jpg"},
 {id:"deal-12",pieces:12,price:36,img:"assets/n16-table-placemats.jpg"},
 {id:"deal-16",pieces:16,price:40,img:"assets/n19-sunrise-flatlay.jpg",best:true}
];
export const STACK_GROUPS = [
 {n:"01",title:"The Signature Twelve",img:"assets/p10-spiral-placemat.jpg",meta:"12 Pieces • The Original Collection",desc:"Where it all began — spirals, starbursts, mirror centres and mandalas in festival colours, each one coiled and stitched entirely by hand, ring by patient ring.",item:{id:"p10",name:"Colourful Spiral Woven Placemat",price:15,img:"assets/p10-spiral-placemat.jpg"}},
 {n:"02",title:"The New Collection",img:"assets/n15-tray-collection.jpg",meta:"New Pieces • Fresh off the Loom",desc:"Six woven trays, mirror mats and pastel placemats in spirals, stars and florals — the newest work from the bench, photographed the day it was finished.",item:{id:"n20",name:"Woven Display Tray",price:15,img:"assets/n20-display-tray.jpg"}},
 {n:"03",title:"Mirror Centres",img:"assets/n02-rainbow-mirror-mat.jpg",meta:"Mirror Mats • Rainbow & Gold",desc:"A real mirror set into the heart of the weave. Made for festive trays, gifts and celebration décor — the pieces guests always ask about first.",item:{id:"n02",name:"Mirror Mat — Rainbow Spiral",price:15,img:"assets/n02-rainbow-mirror-mat.jpg"}},
 {n:"04",title:"Tassels & Fringe",img:"assets/p09-tassel-fringe-mat.jpg",meta:"Fringe Pieces • Made to Catch the Light",desc:"Natural straw finished with a rainbow of hand-tied tassels. Floors, walls and party tables — these are the joyful ones, woven to be celebrated with.",item:{id:"p09",name:"Colourful Woven Straw Mat with Tassel Fringe",price:15,img:"assets/p09-tassel-fringe-mat.jpg"}},
 {n:"05",title:"Stars & Baskets",img:"assets/n07-star-basket-teal.jpg",meta:"The Lookbook • Stars, Suns & Coils",desc:"Bold star baskets, sun-zigzag rims and coiled bowls from the lookbook shelves — deep teals, rust and sunshine yellow on natural straw.",item:{id:"n07",name:"Star Basket — Teal & Rust",price:15,img:"assets/n07-star-basket-teal.jpg"}}
];
export const NEW_PREVIEW = [
 {id:"n03",price:15,img:"assets/n03-geometric-star-mat.jpg",cap:"Geometric Star Mat",sub:"Maroon, black, blue & yellow"},
 {id:"n04",price:15,img:"assets/n04-coiled-basket.jpg",cap:"Sunset Coiled Basket",sub:"Orange, red & purple on wood"},
 {id:"n05",price:15,img:"assets/n05-yellow-star-mat.jpg",cap:"Yellow Star & Zigzag Mat",sub:"Sunshine star on white"},
 {id:"n06",price:15,img:"assets/n06-star-basket-hand.jpg",cap:"Bold Star Basket",sub:"Against a stone wall"},
 {id:"n07",price:15,img:"assets/n07-star-basket-teal.jpg",cap:"Star Basket — Teal & Rust",sub:"34 cm diameter x 6 cm height"},
 {id:"n10",price:15,img:"assets/n10-pink-star-floral.jpg",cap:"Pink Star Floral Mat",sub:"Blossom tones on white"},
 {id:"n11",price:15,img:"assets/n11-multicolour-coiled-mat.jpg",cap:"Multicolour Coiled Mat",sub:"Red rim on dark cloth"},
 {id:"n12",price:15,img:"assets/n12-sun-zigzag-basket.jpg",cap:"Sun Zigzag Basket",sub:"Cream centre, sun-ray rim"},
 {id:"n13",price:15,img:"assets/n13-pink-teal-star.jpg",cap:"Pink & Teal Star Mat",sub:"Star weave on cork"},
 {id:"n14",price:15,img:"assets/n14-yellow-star-zigzag.jpg",cap:"Yellow Star Zigzag Mat",sub:"Striped rim, star centre"}
];
export const NEW_LIFESTYLE = [
 {id:"n15",price:15,img:"assets/n15-tray-collection.jpg",cap:"The New Tray Collection",sub:"Six woven trays together"},
 {id:"n16",price:15,img:"assets/n16-table-placemats.jpg",cap:"At the Dining Table",sub:"Solid colour placemats, set for dinner"},
 {id:"n17",price:15,img:"assets/n17-rainbow-placemat-cutlery.jpg",cap:"Rainbow Spiral Placemat",sub:"Styled with cutlery & glass"},
 {id:"n18",price:15,img:"assets/n18-pastel-table.jpg",cap:"Pastel Placemats on Wood",sub:"On a wooden table with a vase"},
 {id:"n19",price:15,img:"assets/n19-sunrise-flatlay.jpg",cap:"Sunrise Bowls & Coasters",sub:"Bowls, coasters & trivet flat-lay"},
 {id:"n09",price:15,img:"assets/n09-star-placemats-set.jpg",cap:"Star Placemats — Set of 4",sub:"A matching set on wood"}
];

export const CATS = ["All","Woven"];
export const TESTIS = [
 {q:"The mandala mat is even more beautiful in person. The colours pop and you can feel the handwork in every ring.",n:"Ayesha R.",w:"Lahore — bought the Mandala Mat"},
 {q:"The tassel fringe mat sits in the middle of our dining table and every guest asks where it is from. You can feel the handwork in it.",n:"Sana K.",w:"Karachi — bought the Tassel Fringe Mat"},
 {q:"Ordered the spiral placemats for our café tables. Three months of daily use and they still look brand new.",n:"Fatima S.",w:"Islamabad — bought Spiral Placemats ×12"}
];
export const CHAPTERS = [
 {t:0,label:"🎬 The Collection"},{t:5,label:"🌈 Spirals & Stars"},{t:10,label:"🪞 Mirror Centres"},{t:15,label:"🎀 Tassels & Fringe"},{t:20,label:"✨ All 10 Pieces"}
];
export const stars = r => "★★★★★".slice(0,Math.round(r)) + "☆☆☆☆☆".slice(0,5-Math.round(r));


export const POLICIES = {
  returns:{eyebrow:"Policies / Returns & Exchange",title:"Returns & Exchange Policy",intro:"Every Crafts from Hands piece is woven by hand and checked before it leaves the workshop. If something still goes wrong, here is exactly how we put it right.",sections:[
    {h:"You have 7 days",ps:["You can return or exchange an item within ",["b","7 days of delivery"]," if it arrives ",["b","damaged, defective, or different from what you ordered"],". Just contact us within those 7 days and tell us your order number — we will guide you through the return."]},
    {h:"Items must be unused",ps:["To be returned or exchanged, an item must be ",["b","unused and in its original condition"]," — please keep it away from water, food and strong smells until you are sure you are keeping it, and send it back in its original packaging where possible."]},
    {h:"Handmade means one of one",ps:["Because every piece is woven entirely by hand, ",["b","small variations in colour, weave and size are natural"]," — they are the signature of the maker's hands, and they are ",["b","not defects"],". No two pieces are ever exactly alike, and the piece you receive may differ very slightly from its photograph for this reason."]},
    {h:"Refunds & exchanges",ps:["Your refund or exchange is processed ",["b","after the returned item reaches us and has been checked"],". Approved refunds go back to the original payment method (or, for Cash on Delivery orders, by bank transfer); approved exchanges are dispatched once the returned piece is received."]},
    {h:"How to start a return",ps:["Email us at ",["b","mkaleem9755@gmail.com"]," or message us on WhatsApp at ",["b","+92 335 9993942"]," with your order number and, for damaged or wrong items, a photo of the issue. We reply within 1 working day."]}]},
  shipping:{eyebrow:"Policies / Shipping & Delivery",title:"Shipping & Delivery",intro:"Wherever you are — across Pakistan or across the world — your woven pieces are packed with the same care they were made with.",sections:[
    {h:"Delivery charges",ps:["Delivery is a flat ",["b","$6.95 on orders under $75"],", and ",["b","FREE on all orders of $75 or more"],". The charge (or the free delivery) is shown in your order summary before you pay — there are no surprise fees at the door."]},
    {h:"Delivery times",lis:["Within Pakistan: 3–5 working days","International orders: 7–14 working days"]},
    {h:"Packing & dispatch",ps:["Orders are ",["b","packed carefully and dispatched after order confirmation"]," — each piece is wrapped plastic-free, with the maker's name on the parcel. Working days are Monday to Saturday; orders confirmed on a Sunday or public holiday are dispatched the next working day."]},
    {h:"Cash on Delivery",ps:["", ["b","Cash on Delivery is available within Pakistan"], " — order online and pay the rider in cash when your parcel arrives. Card and wallet payments are also accepted at checkout."]}]},
  privacy:{eyebrow:"Policies / Privacy",title:"Privacy Policy",intro:"Your details belong to you. This page explains, in plain words, what we collect, why, and what we never do with it.",sections:[
    {h:"What we use your details for",ps:["We collect your ",["b","name, phone number, delivery address and email address"]," only to ",["b","process and deliver your order"]," — confirming it, packing it, handing it to the courier, and contacting you about its delivery. We do not use your details for anything unrelated to your order."]},
    {h:"Payments stay with the payment provider",ps:["Card and wallet payments are handled on the ",["b","payment provider's own secure page"],". ",["b","Crafts from Hands never sees or stores your card details"]," — they go directly between you and the payment provider."]},
    {h:"We never sell your information",ps:["Your personal information is ",["b","never sold"],", and it is never shared with advertisers. The only people who see the details they need are the courier delivering your parcel and the payment provider processing your payment."]},
    {h:"Ask us to remove your details",ps:["You can ask for your details to be removed at any time — email ",["b","mkaleem9755@gmail.com"]," or WhatsApp ",["b","+92 335 9993942"]," and we will delete your contact details from our records. (Order records we are required to keep for accounts/tax are kept only as long as the law requires.)"]}]}
};
