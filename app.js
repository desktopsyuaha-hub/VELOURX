/* =============================================
   VELOURX — app.js
   Cart, Popup, Tabs, Scroll, Product Data
   ============================================= */

/* ---- PRODUCTS DATA (100+ products) ---- */
const PRODUCTS = [
  // MEN
  { id:1,  name:"Oversized Hoodie",        cat:"men",   sub:"Hoodies",    price:69,  old:99,   img:"https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400&q=80",  badge:"Trending", new:true  },
  { id:2,  name:"Premium Linen Shirt",     cat:"men",   sub:"Shirts",     price:74,  old:null, img:"https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=400&q=80",  badge:null,       new:true  },
  { id:3,  name:"Street Sneakers",         cat:"men",   sub:"Footwear",   price:119, old:null, img:"https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80",  badge:null,       new:false },
  { id:4,  name:"Slim Chinos",             cat:"men",   sub:"Bottoms",    price:64,  old:85,   img:"https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=400&q=80",  badge:"Sale",     new:false },
  { id:5,  name:"Bomber Jacket",           cat:"men",   sub:"Jackets",    price:134, old:190,  img:"https://images.unsplash.com/photo-1544441893-675973e31985?w=400&q=80",  badge:"Sale",     new:false },
  { id:6,  name:"Graphic Tee Vol.1",       cat:"men",   sub:"T-Shirts",   price:34,  old:null, img:"https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?w=400&q=80",  badge:null,       new:true  },
  { id:7,  name:"Merino Crew Sweater",     cat:"men",   sub:"Knitwear",   price:89,  old:null, img:"https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400&q=80",  badge:null,       new:true  },
  { id:8,  name:"Classic Oxford Shirt",    cat:"men",   sub:"Shirts",     price:58,  old:null, img:"https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=400&q=80",  badge:null,       new:false },
  { id:9,  name:"Tailored Trousers",       cat:"men",   sub:"Bottoms",    price:79,  old:null, img:"https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?w=400&q=80",  badge:null,       new:true  },
  { id:10, name:"Canvas High-Tops",        cat:"men",   sub:"Footwear",   price:84,  old:110,  img:"https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=400&q=80",  badge:"Sale",     new:false },
  { id:11, name:"Denim Joggers",           cat:"men",   sub:"Bottoms",    price:62,  old:null, img:"https://images.unsplash.com/photo-1605518216938-7c31b7b14ad0?w=400&q=80",  badge:null,       new:true  },
  { id:12, name:"Puffer Vest",             cat:"men",   sub:"Jackets",    price:98,  old:null, img:"https://images.unsplash.com/photo-1611312449412-6cefac5dc3e4?w=400&q=80",  badge:null,       new:false },
  { id:13, name:"Utility Cargo Shorts",    cat:"men",   sub:"Bottoms",    price:49,  old:null, img:"https://images.unsplash.com/photo-1591195853828-11db59a44f43?w=400&q=80",  badge:null,       new:true  },
  { id:14, name:"Ribbed Tank Top",         cat:"men",   sub:"T-Shirts",   price:28,  old:null, img:"https://images.unsplash.com/photo-1594938298603-c8148c4b4de4?w=400&q=80",  badge:null,       new:false },
  { id:15, name:"Suede Loafers",           cat:"men",   sub:"Footwear",   price:145, old:180,  img:"https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=400&q=80",  badge:"Sale",     new:false },
  { id:16, name:"Windbreaker Jacket",      cat:"men",   sub:"Jackets",    price:109, old:null, img:"https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400&q=80",  badge:null,       new:true  },
  { id:17, name:"Plaid Flannel Shirt",     cat:"men",   sub:"Shirts",     price:54,  old:null, img:"https://images.unsplash.com/photo-1625910513875-d7e9291a14c2?w=400&q=80",  badge:null,       new:false },
  { id:18, name:"Pool Slides",             cat:"men",   sub:"Footwear",   price:32,  old:null, img:"https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?w=400&q=80",  badge:null,       new:false },

  // WOMEN
  { id:19, name:"Floral Midi Dress",       cat:"women", sub:"Dresses",    price:84,  old:120,  img:"https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=400&q=80",  badge:"New",      new:true  },
  { id:20, name:"Classic Denim Jacket",    cat:"women", sub:"Jackets",    price:99,  old:140,  img:"https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?w=400&q=80",  badge:"Sale",     new:false },
  { id:21, name:"Satin Co-ord Set",        cat:"women", sub:"Sets",       price:109, old:155,  img:"https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&q=80",  badge:"Hot",      new:true  },
  { id:22, name:"Wide-Leg Trousers",       cat:"women", sub:"Bottoms",    price:72,  old:null, img:"https://images.unsplash.com/photo-1551854838-212c50b4c184?w=400&q=80",  badge:null,       new:true  },
  { id:23, name:"Lace Trim Blouse",        cat:"women", sub:"Tops",       price:56,  old:null, img:"https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400&q=80",  badge:null,       new:true  },
  { id:24, name:"Blazer Power Suit",       cat:"women", sub:"Suits",      price:154, old:220,  img:"https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=400&q=80",  badge:"Sale",     new:false },
  { id:25, name:"Wrap Midi Skirt",         cat:"women", sub:"Skirts",     price:64,  old:null, img:"https://images.unsplash.com/photo-1568252542512-9fe8fe9c87bb?w=400&q=80",  badge:null,       new:true  },
  { id:26, name:"Ribbed Bodycon Dress",    cat:"women", sub:"Dresses",    price:78,  old:null, img:"https://images.unsplash.com/photo-1581044777550-4cfa0a4c5bd4?w=400&q=80",  badge:null,       new:true  },
  { id:27, name:"Chunky Knit Cardigan",    cat:"women", sub:"Knitwear",   price:88,  old:null, img:"https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400&q=80",  badge:null,       new:false },
  { id:28, name:"Pointed Mule Heels",      cat:"women", sub:"Footwear",   price:98,  old:135,  img:"https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400&q=80",  badge:"Sale",     new:false },
  { id:29, name:"Ruched Mini Dress",       cat:"women", sub:"Dresses",    price:69,  old:null, img:"https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400&q=80",  badge:null,       new:true  },
  { id:30, name:"Trench Coat",             cat:"women", sub:"Outerwear",  price:178, old:240,  img:"https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400&q=80",  badge:"Sale",     new:false },
  { id:31, name:"Flared Jeans",            cat:"women", sub:"Bottoms",    price:74,  old:null, img:"https://images.unsplash.com/photo-1604176354204-9268737828e4?w=400&q=80",  badge:null,       new:true  },
  { id:32, name:"Strappy Sandals",         cat:"women", sub:"Footwear",   price:62,  old:null, img:"https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400&q=80",  badge:null,       new:true  },
  { id:33, name:"Oversized Blazer",        cat:"women", sub:"Jackets",    price:118, old:null, img:"https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=400&q=80",  badge:null,       new:false },
  { id:34, name:"Velvet Slip Dress",       cat:"women", sub:"Dresses",    price:94,  old:130,  img:"https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80",  badge:"Sale",     new:false },
  { id:35, name:"Crop Hoodie",             cat:"women", sub:"Hoodies",    price:58,  old:null, img:"https://images.unsplash.com/photo-1516726817505-f5ed825624d8?w=400&q=80",  badge:null,       new:true  },
  { id:36, name:"Platform Sneakers",       cat:"women", sub:"Footwear",   price:109, old:null, img:"https://images.unsplash.com/photo-1539185441755-769473a23570?w=400&q=80",  badge:null,       new:true  },

  // TEENS
  { id:37, name:"Teen Cargo Pants",        cat:"teens", sub:"Bottoms",    price:58,  old:null, img:"https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=400&q=80",  badge:null,       new:true  },
  { id:38, name:"Cropped Graphic Tee",     cat:"teens", sub:"Tops",       price:32,  old:null, img:"https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=400&q=80",  badge:null,       new:true  },
  { id:39, name:"Track Suit Set",          cat:"teens", sub:"Sets",       price:74,  old:95,   img:"https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400&q=80",  badge:"Sale",     new:false },
  { id:40, name:"High-Top Sneakers",       cat:"teens", sub:"Footwear",   price:88,  old:null, img:"https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=400&q=80",  badge:null,       new:true  },
  { id:41, name:"Bucket Hat",              cat:"teens", sub:"Accessories",price:24,  old:null, img:"https://images.unsplash.com/photo-1514327605112-b887c0e61c0a?w=400&q=80",  badge:null,       new:true  },
  { id:42, name:"Ripped Skinny Jeans",     cat:"teens", sub:"Bottoms",    price:54,  old:null, img:"https://images.unsplash.com/photo-1605518216938-7c31b7b14ad0?w=400&q=80",  badge:null,       new:false },
  { id:43, name:"Puffer Jacket",           cat:"teens", sub:"Outerwear",  price:98,  old:130,  img:"https://images.unsplash.com/photo-1611312449412-6cefac5dc3e4?w=400&q=80",  badge:"Sale",     new:false },
  { id:44, name:"Tie-Dye Tee",             cat:"teens", sub:"Tops",       price:29,  old:null, img:"https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?w=400&q=80",  badge:null,       new:true  },
  { id:45, name:"Biker Shorts",            cat:"teens", sub:"Bottoms",    price:34,  old:null, img:"https://images.unsplash.com/photo-1551854838-212c50b4c184?w=400&q=80",  badge:null,       new:true  },
  { id:46, name:"Chunky Boots",            cat:"teens", sub:"Footwear",   price:114, old:140,  img:"https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400&q=80",  badge:"Sale",     new:false },
  { id:47, name:"Zip-Up Hoodie",           cat:"teens", sub:"Hoodies",    price:62,  old:null, img:"https://images.unsplash.com/photo-1516726817505-f5ed825624d8?w=400&q=80",  badge:null,       new:true  },
  { id:48, name:"Mini Backpack",           cat:"teens", sub:"Accessories",price:44,  old:null, img:"https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&q=80",  badge:null,       new:true  },
  { id:49, name:"Plaid Mini Skirt",        cat:"teens", sub:"Skirts",     price:42,  old:null, img:"https://images.unsplash.com/photo-1568252542512-9fe8fe9c87bb?w=400&q=80",  badge:null,       new:true  },
  { id:50, name:"Corset Top",              cat:"teens", sub:"Tops",       price:38,  old:null, img:"https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400&q=80",  badge:null,       new:true  },
  { id:51, name:"Wide Fit Jeans",          cat:"teens", sub:"Bottoms",    price:59,  old:null, img:"https://images.unsplash.com/photo-1604176354204-9268737828e4?w=400&q=80",  badge:null,       new:false },
  { id:52, name:"Slogan Sweatshirt",       cat:"teens", sub:"Hoodies",    price:52,  old:70,   img:"https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400&q=80",  badge:"Sale",     new:false },

  // KIDS
  { id:53, name:"Kids Colourblock Set",    cat:"kids",  sub:"Sets",       price:45,  old:65,   img:"https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=400&q=80",  badge:"New",      new:true  },
  { id:54, name:"Dino Print T-Shirt",      cat:"kids",  sub:"Tops",       price:22,  old:null, img:"https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?w=400&q=80",  badge:null,       new:true  },
  { id:55, name:"Kids Rain Jacket",        cat:"kids",  sub:"Outerwear",  price:54,  old:75,   img:"https://images.unsplash.com/photo-1611312449412-6cefac5dc3e4?w=400&q=80",  badge:"Sale",     new:false },
  { id:56, name:"Light-Up Trainers",       cat:"kids",  sub:"Footwear",   price:48,  old:null, img:"https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?w=400&q=80",  badge:null,       new:true  },
  { id:57, name:"Dungaree Overalls",       cat:"kids",  sub:"Bottoms",    price:38,  old:null, img:"https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=400&q=80",  badge:null,       new:true  },
  { id:58, name:"Floral Tutu Dress",       cat:"kids",  sub:"Dresses",    price:42,  old:null, img:"https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=400&q=80",  badge:null,       new:true  },
  { id:59, name:"Cozy Fleece Set",         cat:"kids",  sub:"Sets",       price:49,  old:null, img:"https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?w=400&q=80",  badge:null,       new:false },
  { id:60, name:"Striped Polo Shirt",      cat:"kids",  sub:"Tops",       price:26,  old:null, img:"https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?w=400&q=80",  badge:null,       new:false },
  { id:61, name:"Denim Shorts",            cat:"kids",  sub:"Bottoms",    price:30,  old:40,   img:"https://images.unsplash.com/photo-1605518216938-7c31b7b14ad0?w=400&q=80",  badge:"Sale",     new:false },
  { id:62, name:"Animal Print Leggings",   cat:"kids",  sub:"Bottoms",    price:24,  old:null, img:"https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=400&q=80",  badge:null,       new:true  },
  { id:63, name:"Waterproof Wellies",      cat:"kids",  sub:"Footwear",   price:36,  old:null, img:"https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=400&q=80",  badge:null,       new:false },
  { id:64, name:"Hooded Knit Jumper",      cat:"kids",  sub:"Knitwear",   price:40,  old:null, img:"https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400&q=80",  badge:null,       new:true  },
  { id:65, name:"Star Print Pajamas",      cat:"kids",  sub:"Sleepwear",  price:32,  old:null, img:"https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=400&q=80",  badge:null,       new:true  },
  { id:66, name:"Canvas Slip-Ons",         cat:"kids",  sub:"Footwear",   price:34,  old:null, img:"https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=400&q=80",  badge:null,       new:false },

  // Extra products to reach 100+
  { id:67, name:"Asymmetric Hem Dress",    cat:"women", sub:"Dresses",    price:86,  old:null, img:"https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400&q=80",  badge:null,       new:true  },
  { id:68, name:"Pleated Midi Skirt",      cat:"women", sub:"Skirts",     price:68,  old:null, img:"https://images.unsplash.com/photo-1568252542512-9fe8fe9c87bb?w=400&q=80",  badge:null,       new:true  },
  { id:69, name:"Sports Bra Set",          cat:"women", sub:"Activewear", price:52,  old:null, img:"https://images.unsplash.com/photo-1581044777550-4cfa0a4c5bd4?w=400&q=80",  badge:null,       new:true  },
  { id:70, name:"Leather Look Trousers",   cat:"women", sub:"Bottoms",    price:94,  old:null, img:"https://images.unsplash.com/photo-1551854838-212c50b4c184?w=400&q=80",  badge:null,       new:false },
  { id:71, name:"Faux Fur Coat",           cat:"women", sub:"Outerwear",  price:168, old:220,  img:"https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400&q=80",  badge:"Sale",     new:false },
  { id:72, name:"Broderie Blouse",         cat:"women", sub:"Tops",       price:62,  old:null, img:"https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400&q=80",  badge:null,       new:true  },
  { id:73, name:"Men's Swim Shorts",       cat:"men",   sub:"Swimwear",   price:38,  old:null, img:"https://images.unsplash.com/photo-1591195853828-11db59a44f43?w=400&q=80",  badge:null,       new:true  },
  { id:74, name:"Polo Shirt Classic",      cat:"men",   sub:"Shirts",     price:52,  old:null, img:"https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=400&q=80",  badge:null,       new:false },
  { id:75, name:"Jogger Sweatpants",       cat:"men",   sub:"Bottoms",    price:56,  old:null, img:"https://images.unsplash.com/photo-1605518216938-7c31b7b14ad0?w=400&q=80",  badge:null,       new:true  },
  { id:76, name:"Leather Derby Shoes",     cat:"men",   sub:"Footwear",   price:159, old:200,  img:"https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=400&q=80",  badge:"Sale",     new:false },
  { id:77, name:"Sherpa Fleece Jacket",    cat:"men",   sub:"Jackets",    price:118, old:null, img:"https://images.unsplash.com/photo-1544441893-675973e31985?w=400&q=80",  badge:null,       new:true  },
  { id:78, name:"Oversized Blazer",        cat:"men",   sub:"Jackets",    price:138, old:null, img:"https://images.unsplash.com/photo-1617137968427-85924c800a22?w=400&q=80",  badge:null,       new:true  },
  { id:79, name:"Teen Oversized Denim",    cat:"teens", sub:"Tops",       price:64,  old:null, img:"https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=400&q=80",  badge:null,       new:true  },
  { id:80, name:"Smiley Print Hoodie",     cat:"teens", sub:"Hoodies",    price:55,  old:null, img:"https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=400&q=80",  badge:null,       new:true  },
  { id:81, name:"Kids Swim Set",           cat:"kids",  sub:"Swimwear",   price:35,  old:null, img:"https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?w=400&q=80",  badge:null,       new:true  },
  { id:82, name:"Kids Sneakers",           cat:"kids",  sub:"Footwear",   price:42,  old:null, img:"https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=400&q=80",  badge:null,       new:false },
  { id:83, name:"Balloon Sleeve Top",      cat:"women", sub:"Tops",       price:58,  old:null, img:"https://images.unsplash.com/photo-1581044777550-4cfa0a4c5bd4?w=400&q=80",  badge:null,       new:true  },
  { id:84, name:"Paperbag Waist Trousers", cat:"women", sub:"Bottoms",    price:72,  old:null, img:"https://images.unsplash.com/photo-1551854838-212c50b4c184?w=400&q=80",  badge:null,       new:true  },
  { id:85, name:"Men's Polo Pique",        cat:"men",   sub:"Shirts",     price:46,  old:null, img:"https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=400&q=80",  badge:null,       new:false },
  { id:86, name:"Denim Cut-Off Shorts",    cat:"men",   sub:"Bottoms",    price:44,  old:null, img:"https://images.unsplash.com/photo-1591195853828-11db59a44f43?w=400&q=80",  badge:null,       new:false },
  { id:87, name:"Teen Boiler Suit",        cat:"teens", sub:"Sets",       price:68,  old:90,   img:"https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400&q=80",  badge:"Sale",     new:false },
  { id:88, name:"Kids Puffer Jacket",      cat:"kids",  sub:"Outerwear",  price:62,  old:80,   img:"https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?w=400&q=80",  badge:"Sale",     new:false },
  { id:89, name:"Sequin Party Dress",      cat:"women", sub:"Dresses",    price:118, old:160,  img:"https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400&q=80",  badge:"Sale",     new:false },
  { id:90, name:"Linen Co-ord Set",        cat:"men",   sub:"Sets",       price:118, old:null, img:"https://images.unsplash.com/photo-1617137968427-85924c800a22?w=400&q=80",  badge:null,       new:true  },
  { id:91, name:"Knit Bralette Top",       cat:"women", sub:"Tops",       price:44,  old:null, img:"https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400&q=80",  badge:null,       new:true  },
  { id:92, name:"Bootcut Jeans",           cat:"men",   sub:"Bottoms",    price:68,  old:null, img:"https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=400&q=80",  badge:null,       new:false },
  { id:93, name:"Printed Maxi Dress",      cat:"women", sub:"Dresses",    price:94,  old:null, img:"https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=400&q=80",  badge:null,       new:true  },
  { id:94, name:"Kids Graphic Hoodie",     cat:"kids",  sub:"Hoodies",    price:38,  old:null, img:"https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=400&q=80",  badge:null,       new:true  },
  { id:95, name:"Teen Acid Wash Jeans",    cat:"teens", sub:"Bottoms",    price:62,  old:null, img:"https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=400&q=80",  badge:null,       new:true  },
    { id:96, name:"Athletic Shorts",         cat:"men",   sub:"Activewear", price:36,  old:null, img:"https://images.unsplash.com/photo-1591195853828-11db59a44f43?w=400&q=80",  badge:null,       new:false },
  { id:97, name:"Sheer Layer Top",         cat:"women", sub:"Tops",       price:52,  old:null, img:"https://images.unsplash.com/photo-1581044777550-4cfa0a4c5bd4?w=400&q=80",  badge:null,       new:true  },
  { id:98, name:"Cozy Slippers",           cat:"kids",  sub:"Footwear",   price:22,  old:null, img:"https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?w=400&q=80",  badge:null,       new:false },
  { id:99, name:"Seersucker Shirt",        cat:"men",   sub:"Shirts",     price:62,  old:null, img:"https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=400&q=80",  badge:null,       new:true  },
  { id:100,name:"Cut-Out Bodysuit",        cat:"women", sub:"Tops",       price:58,  old:75,   img:"https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&q=80",  badge:"Sale",     new:false },
  { id:101,name:"Kids Jogger Set",         cat:"kids",  sub:"Sets",       price:44,  old:null, img:"https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?w=400&q=80",  badge:null,       new:true  },
  { id:102,name:"Teen Mesh Top",           cat:"teens", sub:"Tops",       price:28,  old:null, img:"https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=400&q=80",  badge:null,       new:true  },
  { id:103,name:"Resort Shirt",            cat:"men",   sub:"Shirts",     price:58,  old:null, img:"https://images.unsplash.com/photo-1625910513875-d7e9291a14c2?w=400&q=80",  badge:null,       new:true  },
  { id:104,name:"Velvet Blazer",           cat:"women", sub:"Jackets",    price:138, old:185,  img:"https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=400&q=80",  badge:"Sale",     new:false },
];

/* ---- CART MANAGEMENT ---- */
function getCart() {
  try { return JSON.parse(localStorage.getItem('velourx_cart') || '[]'); }
  catch { return []; }
}
function saveCart(cart) {
  localStorage.setItem('velourx_cart', JSON.stringify(cart));
  updateCartCount();
}
function addToCart(id, name, price) {
  const cart = getCart();
  const existing = cart.find(i => i.id === id);
  if (existing) { existing.qty += 1; }
  else { cart.push({ id, name, price, qty: 1 }); }
  saveCart(cart);
  showToast(`✓ "${name}" added to cart`);
}
function updateCartCount() {
  const cart = getCart();
  const total = cart.reduce((s, i) => s + i.qty, 0);
  const el = document.getElementById('cartCount');
  if (el) el.textContent = total;
}

/* ---- TOAST ---- */
function showToast(msg) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3000);
}

/* ---- POPUP ---- */
function initPopup() {
  const overlay = document.getElementById('popupOverlay');
  const closeBtn = document.getElementById('popupClose');
  const skipBtn  = document.getElementById('popupSkip');
  if (!overlay) return;

  const dismissed = sessionStorage.getItem('velourx_popup');
  if (!dismissed) {
    setTimeout(() => overlay.classList.add('visible'), 2200);
  }
  function closePopup() {
    overlay.classList.remove('visible');
    sessionStorage.setItem('velourx_popup', '1');
  }
  if (closeBtn) closeBtn.addEventListener('click', closePopup);
  if (skipBtn)  skipBtn.addEventListener('click', closePopup);
  overlay.addEventListener('click', e => { if (e.target === overlay) closePopup(); });
}

function claimPopupOffer(e) {
  e.preventDefault();
  const input = e.target.querySelector('input');
  const email = input.value;
  sessionStorage.setItem('velourx_popup', '1');
  document.getElementById('popupOverlay').classList.remove('visible');
  showToast(`🎉 Code VELOUR30 sent to ${email}!`);
}

function subscribeNewsletter(e) {
  e.preventDefault();
  showToast('🎉 You\'re subscribed! Check your inbox.');
  e.target.reset();
}

/* ---- NAVBAR SCROLL ---- */
function initNavbar() {
  const nav = document.getElementById('navbar');
  if (!nav) return;
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  });
}

/* ---- HAMBURGER ---- */
function initHamburger() {
  const btn  = document.getElementById('hamburger');
  const menu = document.getElementById('mobileMenu');
  if (!btn || !menu) return;
  btn.addEventListener('click', () => menu.classList.toggle('open'));
}

/* ---- HORIZONTAL SCROLL BUTTONS ---- */
function initScrollButtons() {
  document.querySelectorAll('.h-scroll-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.dataset.target;
      const track = document.getElementById(targetId);
      if (!track) return;
      const dir = btn.classList.contains('h-scroll-left') ? -1 : 1;
      track.scrollBy({ left: dir * 320, behavior: 'smooth' });
    });
  });
}

/* ---- 3D HERO CARD MOUSE TILT ---- */
function initHeroTilt() {
  const card = document.getElementById('heroCard');
  if (!card) return;
  document.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / rect.width;
    const dy = (e.clientY - cy) / rect.height;
    const inner = card.querySelector('.hero-card-inner');
    if (inner) {
      inner.style.transform = `rotateY(${dx * 16}deg) rotateX(${-dy * 10}deg) scale(1.02)`;
    }
  });
}

/* ---- BUILD PRODUCT CARD HTML ---- */
function buildCard(p) {
  const badge = p.badge ? `<span class="prod-badge ${p.badge === 'New' || p.new ? 'new-badge' : p.badge === 'Sale' ? 'sale-badge' : ''}">${p.badge || (p.new ? 'New' : '')}</span>` : (p.new ? '<span class="prod-badge new-badge">New</span>' : '');
  const oldPrice = p.old ? `<span class="prod-old">$${p.old}</span>` : '';
  return `
    <div class="prod-card" data-id="${p.id}">
      <div class="prod-img-wrap">
        <img src="${p.img}" alt="${p.name}" loading="lazy"/>
        ${badge}
        <div class="prod-actions">
          <button class="quick-add" data-id="${p.id}" data-name="${p.name}" data-price="${p.price}">Add to Cart</button>
          <button class="wish-btn" aria-label="Wishlist">♡</button>
        </div>
      </div>
      <div class="prod-info">
        <p class="prod-cat">${p.cat.charAt(0).toUpperCase()+p.cat.slice(1)} · ${p.sub}</p>
        <h3 class="prod-name">${p.name}</h3>
        <div class="prod-pricing"><span class="prod-price">$${p.price}</span>${oldPrice}</div>
      </div>
    </div>`;
}

/* ---- NEW ARRIVALS TABS ---- */
function initArrivalsTabs() {
  const grid = document.getElementById('arrivalsGrid');
  const tabs = document.querySelectorAll('.tab-btn');
  if (!grid) return;

  function renderArrivals(filter) {
    let items = filter === 'all' ? PRODUCTS.slice(0, 12) : PRODUCTS.filter(p => p.cat === filter).slice(0, 8);
    grid.innerHTML = items.map(buildCard).join('');
    bindCartButtons(grid);
  }

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      renderArrivals(tab.dataset.tab);
    });
  });

  renderArrivals('all');
}

/* ---- BIND ADD TO CART BUTTONS ---- */
function bindCartButtons(scope = document) {
  scope.querySelectorAll('.quick-add').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id    = parseInt(btn.dataset.id);
      const name  = btn.dataset.name;
      const price = parseFloat(btn.dataset.price);
      addToCart(id, name, price);
    });
  });
}

/* ---- SCROLL REVEAL ---- */
function initScrollReveal() {
  const els = document.querySelectorAll('.cat-card, .prod-card, .promise-item, .testi-card');
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.style.opacity = '1';
        e.target.style.transform = e.target.style.transform.replace('translateY(30px)', 'translateY(0)');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });

  els.forEach(el => {
    el.style.opacity = '0';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    el.style.transform += ' translateY(30px)';
    obs.observe(el);
  });
}

/* ---- INIT ---- */
document.addEventListener('DOMContentLoaded', () => {
  updateCartCount();
  initPopup();
  initNavbar();
  initHamburger();
  initScrollButtons();
  initHeroTilt();
  initArrivalsTabs();
  bindCartButtons();
  setTimeout(initScrollReveal, 100);

  // Expose to window for inline handlers
  window.claimPopupOffer   = claimPopupOffer;
  window.subscribeNewsletter = subscribeNewsletter;
});

// Export for other pages
window.PRODUCTS   = PRODUCTS;
window.getCart    = getCart;
window.saveCart   = saveCart;
window.addToCart  = addToCart;
window.showToast  = showToast;
window.buildCard  = buildCard;
window.bindCartButtons = bindCartButtons;
