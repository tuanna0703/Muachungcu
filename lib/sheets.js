// lib/sheets.js — Kết nối Google Sheets qua Service Account
const SHEET_ID = process.env.GOOGLE_SHEET_ID;
const SERVICE_ACCOUNT_EMAIL = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
const PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n");

async function getAccessToken() {
  const header = { alg: "RS256", typ: "JWT" };
  const now = Math.floor(Date.now() / 1000);
  const claim = { iss: SERVICE_ACCOUNT_EMAIL, scope: "https://www.googleapis.com/auth/spreadsheets.readonly", aud: "https://oauth2.googleapis.com/token", exp: now + 3600, iat: now };
  const encode = (obj) => btoa(JSON.stringify(obj)).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,"");
  const headerB64 = encode(header);
  const claimB64 = encode(claim);
  const signingInput = `${headerB64}.${claimB64}`;
  const keyData = PRIVATE_KEY.replace("-----BEGIN RSA PRIVATE KEY-----","").replace("-----END RSA PRIVATE KEY-----","").replace("-----BEGIN PRIVATE KEY-----","").replace("-----END PRIVATE KEY-----","").replace(/\s/g,"");
  const binaryKey = Uint8Array.from(atob(keyData),(c)=>c.charCodeAt(0));
  const cryptoKey = await crypto.subtle.importKey("pkcs8", binaryKey, { name:"RSASSA-PKCS1-v1_5", hash:"SHA-256" }, false, ["sign"]);
  const signature = await crypto.subtle.sign("RSASSA-PKCS1-v1_5", cryptoKey, new TextEncoder().encode(signingInput));
  const sigB64 = btoa(String.fromCharCode(...new Uint8Array(signature))).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,"");
  const jwt = `${signingInput}.${sigB64}`;
  const tokenRes = await fetch("https://oauth2.googleapis.com/token", { method:"POST", headers:{"Content-Type":"application/x-www-form-urlencoded"}, body: new URLSearchParams({ grant_type:"urn:ietf:params:oauth:grant-type:jwt-bearer", assertion:jwt }) });
  const tokenData = await tokenRes.json();
  return tokenData.access_token;
}

async function readRange(sheetName) {
  const token = await getAccessToken();
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${encodeURIComponent(sheetName)}`;
  const res = await fetch(url, { headers:{ Authorization:`Bearer ${token}` } });
  const data = await res.json();
  return data.values || [];
}

function rowsToObjects(rows) {
  if (!rows || rows.length < 2) return [];
  const [headers, ...dataRows] = rows;
  return dataRows.filter(row=>row.some(cell=>cell!=="")).map(row=>headers.reduce((obj,header,i)=>{ obj[header.trim()]=row[i]?.trim()||""; return obj; },{}));
}

export async function getDuAn() { return rowsToObjects(await readRange("du_an")); }
export async function getDuAnById(id) { const all = await getDuAn(); return all.find(p=>p.id===id)||null; }
export async function getGiaCa(duAnId) { return rowsToObjects(await readRange("gia_ca")).filter(g=>g.du_an_id===duAnId); }
export async function getAllGiaCa() { return rowsToObjects(await readRange("gia_ca")); }
export async function getReviews(duAnId) { return rowsToObjects(await readRange("reviews")).filter(r=>r.du_an_id===duAnId); }
