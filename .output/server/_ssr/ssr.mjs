import { o as __toESM } from "../_runtime.mjs";
import { t as require_main } from "../_libs/dotenv.mjs";
import { t as require_nodemailer } from "../_libs/nodemailer.mjs";
import { t as Pool } from "../_libs/pg.mjs";
import fs from "node:fs";
import path from "node:path";
import { Buffer } from "node:buffer";
import { mkdir, readFile, writeFile } from "node:fs/promises";
//#region node_modules/.nitro/vite/services/ssr/index.js
var import_main = require_main();
var import_nodemailer = /* @__PURE__ */ __toESM(require_nodemailer());
var lastCapturedError;
var TTL_MS = 5e3;
function record(error) {
	lastCapturedError = {
		error,
		at: Date.now()
	};
}
if (typeof globalThis.addEventListener === "function") {
	globalThis.addEventListener("error", (event) => record(event.error ?? event));
	globalThis.addEventListener("unhandledrejection", (event) => record(event.reason));
}
function consumeLastCapturedError() {
	if (!lastCapturedError) return void 0;
	if (Date.now() - lastCapturedError.at > TTL_MS) {
		lastCapturedError = void 0;
		return;
	}
	const { error } = lastCapturedError;
	lastCapturedError = void 0;
	return error;
}
function getSmtpPort() {
	return Number(process.env.SMTP_PORT ?? 587);
}
function getSmtpSecure() {
	if (process.env.SMTP_SECURE) return process.env.SMTP_SECURE === "true";
	return getSmtpPort() === 465;
}
async function sendVerificationEmail({ email, code }) {
	try {
		const from = process.env.SMTP_FROM ?? process.env.SMTP_USER;
		if (!from) throw new Error("SMTP_FROM or SMTP_USER is not configured");
		const smtpHost = process.env.SMTP_HOST;
		const smtpUser = process.env.SMTP_USER;
		const smtpPass = process.env.SMTP_PASS;
		const smtpPort = process.env.SMTP_PORT;
		const smtpSecure = process.env.SMTP_SECURE;
		console.log("=== SMTP Configuration Debug ===");
		console.log(`SMTP_HOST: ${smtpHost}`);
		console.log(`SMTP_USER: ${smtpUser}`);
		console.log(`SMTP_PASS: ${smtpPass ? "***SET***" : "NOT SET"}`);
		console.log(`SMTP_PORT: ${smtpPort}`);
		console.log(`SMTP_SECURE: ${smtpSecure}`);
		console.log(`SMTP_FROM: ${from}`);
		console.log(`Target Email: ${email}`);
		console.log(`Verification Code: ${code}`);
		console.log("================================");
		if (!smtpHost) throw new Error("SMTP_HOST environment variable is not configured");
		if (!smtpUser) throw new Error("SMTP_USER environment variable is not configured");
		if (!smtpPass) throw new Error("SMTP_PASS environment variable is not configured");
		console.log(`Attempting to send verification email to ${email} via SMTP host: ${smtpHost}`);
		await import_nodemailer.default.createTransport({
			host: smtpHost,
			port: getSmtpPort(),
			secure: getSmtpSecure(),
			auth: {
				user: smtpUser,
				pass: smtpPass
			}
		}).sendMail({
			from,
			to: email,
			subject: "🎰 Your Lucky Verification Code - Unlock Your Lottery Experience",
			text: `Your verification code is ${code}. Enter this code to complete your registration and start exploring our lottery prizes.`,
			html: `
        <div style="font-family:'Segoe UI',Arial,sans-serif;line-height:1.6;color:#0a1628;background:linear-gradient(135deg,#0a1628 0%,#1a2744 100%);padding:40px 20px">
          <div style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:20px;overflow:hidden;box-shadow:0 20px 60px rgba(232,168,56,0.3)">
            <!-- Header with Lottery Theme -->
            <div style="background:linear-gradient(135deg,#e8a838 0%,#f5c763 100%);padding:40px 30px;text-align:center">
              <div style="font-size:48px;margin-bottom:10px">🎰</div>
              <h1 style="margin:0;color:#0a1628;font-size:28px;font-weight:800;letter-spacing:-0.5px">Your Lucky Moment Awaits</h1>
              <p style="margin:10px 0 0;color:#0a1628;font-size:16px;opacity:0.8">Verify your account to unlock exclusive lottery prizes</p>
            </div>
            
            <!-- Main Content -->
            <div style="padding:40px 30px">
              <p style="margin:0 0 20px;font-size:16px;color:#4a5568">You're one step away from discovering amazing lottery prizes! Enter your verification code below to complete your registration:</p>
              
              <!-- Verification Code Box -->
              <div style="background:linear-gradient(135deg,#0a1628 0%,#1a2744 100%);border-radius:16px;padding:30px;text-align:center;margin:30px 0;box-shadow:0 10px 30px rgba(10,22,40,0.2)">
                <p style="margin:0 0 15px;color:#e8a838;font-size:14px;font-weight:600;letter-spacing:2px;text-transform:uppercase">Your Verification Code</p>
                <div style="font-size:42px;font-weight:800;letter-spacing:8px;color:#ffffff;margin:0;font-family:'Courier New',monospace">${code}</div>
                <p style="margin:15px 0 0;color:#ffffff;font-size:12px;opacity:0.6">Valid for 10 minutes</p>
              </div>
              
              <!-- Excitement Elements -->
              <div style="display:flex;justify-content:center;gap:15px;margin:30px 0">
                <div style="background:#fff7ed;border:2px solid #e8a838;border-radius:12px;padding:15px 20px;text-align:center;flex:1">
                  <div style="font-size:24px;margin-bottom:5px">🏆</div>
                  <div style="font-size:12px;font-weight:600;color:#0a1628">Grand Prizes</div>
                </div>
                <div style="background:#fff7ed;border:2px solid #e8a838;border-radius:12px;padding:15px 20px;text-align:center;flex:1">
                  <div style="font-size:24px;margin-bottom:5px">💎</div>
                  <div style="font-size:12px;font-weight:600;color:#0a1628">Premium Rewards</div>
                </div>
                <div style="background:#fff7ed;border:2px solid #e8a838;border-radius:12px;padding:15px 20px;text-align:center;flex:1">
                  <div style="font-size:24px;margin-bottom:5px">🎁</div>
                  <div style="font-size:12px;font-weight:600;color:#0a1628">Daily Draws</div>
                </div>
              </div>
              
              <p style="margin:20px 0 0;font-size:14px;color:#718096">If you didn't request this code, you can safely ignore this email.</p>
            </div>
            
            <!-- Footer -->
            <div style="background:#f7fafc;padding:20px 30px;text-align:center;border-top:1px solid #e2e8f0">
              <p style="margin:0;font-size:12px;color:#718096">© 2024 Linz Lottery Platform. Your luck starts here!</p>
            </div>
          </div>
        </div>
      `
		});
		console.log(`Verification email sent successfully to ${email}`);
	} catch (error) {
		console.error(`Failed to send verification email to ${email}:`, error);
		if (error instanceof Error) throw new Error(`Email sending failed: ${error.message}`);
		throw new Error("Email sending failed due to unknown error");
	}
}
function renderErrorPage() {
	return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>This page didn't load</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>
      body { font: 15px/1.5 system-ui, -apple-system, sans-serif; background: #fafafa; color: #111; display: grid; place-items: center; min-height: 100vh; margin: 0; padding: 1.5rem; }
      .card { max-width: 28rem; width: 100%; text-align: center; padding: 2rem; }
      h1 { font-size: 1.25rem; margin: 0 0 0.5rem; }
      p { color: #4b5563; margin: 0 0 1.5rem; }
      .actions { display: flex; gap: 0.5rem; justify-content: center; flex-wrap: wrap; }
      a, button { padding: 0.5rem 1rem; border-radius: 0.375rem; font: inherit; cursor: pointer; text-decoration: none; border: 1px solid transparent; }
      .primary { background: #111; color: #fff; }
      .secondary { background: #fff; color: #111; border-color: #d1d5db; }
    </style>
  </head>
  <body>
    <div class="card">
      <h1>This page didn't load</h1>
      <p>Something went wrong on our end. You can try refreshing or head back home.</p>
      <div class="actions">
        <button class="primary" onclick="location.reload()">Try again</button>
        <a class="secondary" href="/">Go home</a>
      </div>
    </div>
  </body>
</html>`;
}
var STORE_PATH = path.join(process.cwd(), ".data", "store.json");
var DEFAULT_STORE = {
	vehicles: [],
	users: [],
	activity: [],
	chats: [],
	uploads: [],
	"anonymous-downloads": [],
	"verification-codes": [],
	news: []
};
var pool;
var initialized = false;
function getDatabaseUrl() {
	return process.env.DATABASE_URL;
}
function getPool() {
	const databaseUrl = getDatabaseUrl();
	if (!databaseUrl) return void 0;
	if (!pool) pool = new Pool({
		connectionString: databaseUrl,
		ssl: databaseUrl.includes("sslmode=require") || process.env.PGSSLMODE === "require" ? { rejectUnauthorized: false } : void 0
	});
	return pool;
}
async function ensurePostgresTable() {
	const db = getPool();
	if (!db || initialized) return;
	await db.query(`
    create table if not exists app_store (
      key text primary key,
      value jsonb not null,
      updated_at timestamptz not null default now()
    )
  `);
	await db.query(`
    create table if not exists upload_assets (
      id text primary key,
      name text not null,
      type text not null,
      size integer not null,
      data_base64 text not null,
      created_at timestamptz not null default now()
    )
  `);
	initialized = true;
}
async function readFileStore() {
	try {
		return {
			...DEFAULT_STORE,
			...JSON.parse(await readFile(STORE_PATH, "utf8"))
		};
	} catch {
		return DEFAULT_STORE;
	}
}
async function writeFileStore(store) {
	await mkdir(path.dirname(STORE_PATH), { recursive: true });
	await writeFile(STORE_PATH, JSON.stringify(store, null, 2));
}
async function readStoreCollection(key) {
	const db = getPool();
	if (db) {
		await ensurePostgresTable();
		return (await db.query("select value from app_store where key = $1", [key])).rows[0]?.value ?? [];
	}
	return (await readFileStore())[key] ?? [];
}
async function deleteFromStoreCollection(key, predicate) {
	const db = getPool();
	if (db) {
		await ensurePostgresTable();
		try {
			console.log(`Attempting direct PostgreSQL delete from key: ${key}`);
			const client = await db.connect();
			try {
				await client.query("BEGIN");
				const currentData = (await client.query("select value from app_store where key = $1", [key])).rows[0]?.value ?? [];
				console.log(`Current data for key ${key}: ${currentData.length} items`);
				const matchingItems = currentData.filter((item) => predicate(item));
				console.log(`Found ${matchingItems.length} items matching deletion predicate`);
				const filteredData = currentData.filter((item) => !predicate(item));
				console.log(`Filtered ${currentData.length} items to ${filteredData.length} items for key: ${key}`);
				await client.query(`
            insert into app_store (key, value, updated_at)
            values ($1, $2::jsonb, now())
            on conflict (key)
            do update set value = excluded.value, updated_at = now()
          `, [key, JSON.stringify(filteredData)]);
				await client.query("COMMIT");
				console.log(`Successfully deleted from PostgreSQL key: ${key}, remaining items: ${filteredData.length}`);
				return true;
			} catch (error) {
				await client.query("ROLLBACK");
				console.error(`Transaction failed for delete from key ${key}:`, error);
				throw error;
			} finally {
				client.release();
			}
		} catch (error) {
			console.error(`Error deleting from PostgreSQL for key ${key}:`, error);
			throw error;
		}
	}
	console.log(`Deleting from file system key: ${key}`);
	const store = await readFileStore();
	const currentData = store[key] ?? [];
	console.log(`Current data for key ${key}: ${currentData.length} items`);
	const matchingItems = currentData.filter((item) => predicate(item));
	console.log(`Found ${matchingItems.length} items matching deletion predicate`);
	const filteredData = currentData.filter((item) => !predicate(item));
	await writeFileStore({
		...store,
		[key]: filteredData
	});
	console.log(`Successfully deleted from file system key: ${key}, remaining items: ${filteredData.length}`);
	return true;
}
async function writeStoreCollection(key, value) {
	const db = getPool();
	if (db) {
		await ensurePostgresTable();
		try {
			console.log(`Writing to PostgreSQL key: ${key}, items: ${value.length}`);
			const client = await db.connect();
			try {
				await client.query("BEGIN");
				await client.query(`
            insert into app_store (key, value, updated_at)
            values ($1, $2::jsonb, now())
            on conflict (key)
            do update set value = excluded.value, updated_at = now()
          `, [key, JSON.stringify(value)]);
				await client.query("COMMIT");
				console.log(`Successfully wrote to PostgreSQL key: ${key}`);
			} catch (error) {
				await client.query("ROLLBACK");
				console.error(`Transaction failed for key ${key}:`, error);
				throw error;
			} finally {
				client.release();
			}
			return;
		} catch (error) {
			console.error(`Error writing to PostgreSQL for key ${key}:`, error);
			throw error;
		}
	}
	console.log(`Writing to file system key: ${key}, items: ${value.length}`);
	await writeFileStore({
		...await readFileStore(),
		[key]: value
	});
}
async function readUploadAsset(id) {
	const db = getPool();
	if (db) {
		await ensurePostgresTable();
		const row = (await db.query("select id, name, type, size, data_base64, created_at from upload_assets where id = $1", [id])).rows[0];
		if (!row) return void 0;
		return {
			id: row.id,
			name: row.name,
			type: row.type,
			size: row.size,
			dataBase64: row.data_base64,
			createdAt: row.created_at.toISOString()
		};
	}
	return (await readStoreCollection("uploads")).find((upload) => upload.id === id);
}
async function writeUploadAsset(upload) {
	const db = getPool();
	if (db) {
		await ensurePostgresTable();
		await db.query(`
        insert into upload_assets (id, name, type, size, data_base64, created_at)
        values ($1, $2, $3, $4, $5, $6)
        on conflict (id)
        do update set
          name = excluded.name,
          type = excluded.type,
          size = excluded.size,
          data_base64 = excluded.data_base64,
          created_at = excluded.created_at
      `, [
			upload.id,
			upload.name,
			upload.type,
			upload.size,
			upload.dataBase64,
			upload.createdAt
		]);
		return;
	}
	await writeStoreCollection("uploads", [upload, ...(await readStoreCollection("uploads")).filter((item) => item.id !== upload.id)]);
}
if ([
	"SMTP_HOST",
	"SMTP_USER",
	"SMTP_PASS",
	"SMTP_FROM",
	"DATABASE_URL"
].every((k) => Boolean(process.env[k]))) {
	console.log("Using direct environment variables (Render.com standard)");
	for (const k of [
		"SMTP_HOST",
		"SMTP_USER",
		"SMTP_PASS",
		"SMTP_FROM",
		"DATABASE_URL"
	]) console.log(`${k}: ${process.env[k] ? "SET" : "NOT SET"}`);
} else {
	const envFiles = [path.resolve(process.cwd(), ".env.local"), process.env.RENDER_ENV_FILE ? path.resolve("/etc/secrets", process.env.RENDER_ENV_FILE) : "/etc/secrets/.env.local"];
	console.log("Checking environment files:", envFiles);
	let loadedEnvPath = null;
	for (const envFile of envFiles) if (fs.existsSync(envFile)) {
		if ((0, import_main.config)({
			path: envFile,
			override: false
		}).parsed) {
			loadedEnvPath = envFile;
			console.log(`Loaded environment from ${envFile}`);
			break;
		}
	}
	if (!loadedEnvPath) {
		console.warn("Warning: No environment file found and direct environment variables are incomplete.");
		console.warn("SMTP and database features may not work. On Render.com, set variables in the dashboard or upload a secrets file and set RENDER_ENV_FILE.");
	}
}
var chatSubscribers = /* @__PURE__ */ new Map();
function createSseChannel(onCancel) {
	let controller = null;
	const stream = new ReadableStream({
		start(ctrl) {
			controller = ctrl;
			ctrl.enqueue(new TextEncoder().encode(":ok\n\n"));
		},
		cancel() {
			onCancel();
			controller = null;
		}
	});
	return {
		response: new Response(stream, { headers: {
			"Content-Type": "text/event-stream",
			"Cache-Control": "no-cache",
			Connection: "keep-alive"
		} }),
		send(data) {
			if (!controller) return;
			try {
				controller.enqueue(new TextEncoder().encode(`data: ${JSON.stringify(data)}\n\n`));
			} catch {}
		},
		close() {
			if (!controller) return;
			try {
				controller.close();
			} finally {
				controller = null;
			}
		}
	};
}
var serverEntryPromise;
var fallbackVerificationCodes = /* @__PURE__ */ new Map();
var activeVisitors = /* @__PURE__ */ new Map();
var VISITOR_TIMEOUT = 300 * 1e3;
var newsSubscribers = /* @__PURE__ */ new Set();
setInterval(() => {
	const now = Date.now();
	let cleaned = 0;
	for (const [userId, visitor] of activeVisitors) if (now - visitor.lastSeen > VISITOR_TIMEOUT) {
		activeVisitors.delete(userId);
		cleaned++;
	}
	if (cleaned > 0) console.log(`Cleaned up ${cleaned} inactive visitors`);
}, 60 * 1e3);
function generateVerificationCode() {
	return Math.floor(1e5 + Math.random() * 9e5).toString();
}
async function storeVerificationCode(email, code) {
	const expiresAt = Date.now() + 600 * 1e3;
	const entry = {
		email: email.toLowerCase(),
		code,
		expiresAt
	};
	try {
		await writeStoreCollection("verification-codes", [...(await readStoreCollection("verification-codes")).filter((c) => c.email !== email.toLowerCase()), entry]);
		console.log(`Stored verification code for ${email} in database`);
	} catch (error) {
		console.error(`Database storage failed for ${email}, using fallback in-memory storage:`, error);
		fallbackVerificationCodes.set(email.toLowerCase(), {
			code,
			expiresAt
		});
	}
}
async function getVerificationCode(email) {
	try {
		const entry = (await readStoreCollection("verification-codes")).find((c) => c.email === email.toLowerCase());
		if (entry) {
			if (Date.now() > entry.expiresAt) {
				await clearVerificationCode(email);
				return null;
			}
			return entry.code;
		}
	} catch (error) {
		console.error(`Database read failed for ${email}, checking fallback:`, error);
	}
	const entry = fallbackVerificationCodes.get(email.toLowerCase());
	if (!entry) return null;
	if (Date.now() > entry.expiresAt) {
		fallbackVerificationCodes.delete(email.toLowerCase());
		return null;
	}
	return entry.code;
}
async function clearVerificationCode(email) {
	try {
		await writeStoreCollection("verification-codes", (await readStoreCollection("verification-codes")).filter((c) => c.email !== email.toLowerCase()));
		console.log(`Cleared verification code for ${email} from database`);
	} catch (error) {
		console.error(`Database clear failed for ${email}, clearing fallback:`, error);
	}
	fallbackVerificationCodes.delete(email.toLowerCase());
}
var ADMIN_EMAIL = "linzadmin@linz.com";
var ADMIN_PASSWORD = "123qwe123QWE'";
var MAX_UPLOAD_BYTES = 8 * 1024 * 1024;
var defaultAdmin = {
	email: ADMIN_EMAIL,
	username: "Linz Admin",
	password: ADMIN_PASSWORD,
	avatar: "https://api.dicebear.com/9.x/initials/svg?seed=LA&backgroundColor=e8a838&textColor=0a1628",
	location: "Linz",
	country: "Austria",
	role: "admin"
};
async function getServerEntry() {
	if (!serverEntryPromise) serverEntryPromise = import("./server-BMhSRkWq.mjs").then((m) => m.default ?? m);
	return serverEntryPromise;
}
async function normalizeCatastrophicSsrResponse(response) {
	if (response.status < 500) return response;
	if (!(response.headers.get("content-type") ?? "").includes("application/json")) return response;
	const body = await response.clone().text();
	if (!isH3SwallowedErrorBody(body)) return response;
	console.error(consumeLastCapturedError() ?? /* @__PURE__ */ new Error(`h3 swallowed SSR error: ${body}`));
	return new Response(renderErrorPage(), {
		status: 500,
		headers: { "content-type": "text/html; charset=utf-8" }
	});
}
function isH3SwallowedErrorBody(body) {
	try {
		const payload = JSON.parse(body);
		return payload.unhandled === true && payload.message === "HTTPError";
	} catch {
		return false;
	}
}
function jsonResponse(data, init) {
	return new Response(JSON.stringify(data), {
		...init,
		headers: {
			"content-type": "application/json; charset=utf-8",
			...init?.headers
		}
	});
}
async function readJsonBody(request) {
	try {
		return await request.json();
	} catch {
		throw new Error("Invalid JSON body");
	}
}
function formString(form, name) {
	return String(form.get(name) ?? "");
}
function formNumber(form, name) {
	return Number(form.get(name) ?? 0);
}
function createId() {
	return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}
function createNumericId() {
	return Date.now() + Math.floor(Math.random() * 1e4);
}
async function saveUploadFile(file) {
	if (file.size > MAX_UPLOAD_BYTES) throw new Error(`File is too large. Maximum upload size is ${Math.round(MAX_UPLOAD_BYTES / 1024 / 1024)} MB.`);
	const id = createId();
	const buffer = Buffer.from(await file.arrayBuffer());
	const upload = {
		id,
		name: file.name,
		type: file.type || "application/octet-stream",
		size: file.size,
		dataBase64: buffer.toString("base64"),
		createdAt: (/* @__PURE__ */ new Date()).toISOString()
	};
	await writeUploadAsset(upload);
	return {
		id,
		url: `/api/uploads/${id}`,
		name: upload.name,
		size: upload.size,
		type: upload.type
	};
}
async function saveUploadFiles(files) {
	return Promise.all(files.filter((file) => file.size > 0).map(saveUploadFile));
}
function formFiles(form, name) {
	return form.getAll(name).flatMap((value) => {
		if (value instanceof File && value.size > 0) return [value];
		if (value instanceof Blob && typeof value.name === "string" && value.size > 0) return [new File([value], value.name, { type: value.type })];
		return [];
	});
}
async function vehicleFromMultipartForm(form) {
	const cardUploads = await saveUploadFiles(formFiles(form, "cardImages"));
	const galleryUploads = await saveUploadFiles(formFiles(form, "galleryImages"));
	const allVehicleImages = [...cardUploads, ...galleryUploads].map((upload) => upload.url);
	const detailsPackageFile = formFiles(form, "detailsPackage")[0];
	const detailsPackageUpload = detailsPackageFile ? await saveUploadFile(detailsPackageFile) : void 0;
	const formStringWithDefault = (form, name) => {
		return String(form.get(name) ?? "").trim() || "unknown";
	};
	const name = formStringWithDefault(form, "name") || formStringWithDefault(form, "vehicle");
	const prizeTier = formString(form, "prizeTier");
	const prizeAmount = formNumber(form, "prizeAmount") || 0;
	const odds = formStringWithDefault(form, "odds");
	const ticketPrice = formNumber(form, "ticketPrice") || 0;
	const totalTickets = formNumber(form, "totalTickets") || 0;
	const drawUrl = formStringWithDefault(form, "drawUrl") || formStringWithDefault(form, "drawLocation");
	return {
		id: createNumericId(),
		name,
		prizeTier: prizeTier || void 0,
		prizeAmount: prizeAmount || void 0,
		odds: odds || void 0,
		ticketPrice: ticketPrice || void 0,
		totalTickets: totalTickets || void 0,
		drawUrl: drawUrl || void 0,
		vehicle: name,
		model: formStringWithDefault(form, "model"),
		price: formNumber(form, "price") || 0,
		weeklyRepayment: formNumber(form, "weeklyRepayment") || 0,
		mileage: formNumber(form, "mileage") || 0,
		tag: formString(form, "tag") || "PREMIUM",
		color: formStringWithDefault(form, "color"),
		image: allVehicleImages[0] ?? "",
		images: cardUploads.length > 0 ? cardUploads.map((upload) => upload.url) : allVehicleImages,
		galleryImages: allVehicleImages,
		specs: formStringWithDefault(form, "specs"),
		make: formStringWithDefault(form, "make"),
		bodyType: formStringWithDefault(form, "bodyType"),
		year: formStringWithDefault(form, "year"),
		condition: formStringWithDefault(form, "condition"),
		fuelType: formStringWithDefault(form, "fuelType"),
		cylinders: formStringWithDefault(form, "cylinders"),
		driveType: formStringWithDefault(form, "driveType"),
		engineType: formStringWithDefault(form, "engineType"),
		capacityCc: formStringWithDefault(form, "capacityCc"),
		power: formStringWithDefault(form, "power"),
		torque: formStringWithDefault(form, "torque"),
		releaseDate: formStringWithDefault(form, "releaseDate"),
		buildDate: formStringWithDefault(form, "buildDate"),
		complianceDate: formStringWithDefault(form, "complianceDate"),
		modelYear: formStringWithDefault(form, "modelYear"),
		detailsPackage: detailsPackageUpload ? {
			name: detailsPackageUpload.name,
			size: detailsPackageUpload.size,
			url: detailsPackageUpload.url
		} : void 0
	};
}
function normalizeEmail(email) {
	return String(email ?? "").trim().toLowerCase();
}
function userToSession(user) {
	const { password: _password, ...sessionUser } = user;
	return sessionUser;
}
async function readUsersRecord() {
	const users = await readStoreCollection("users");
	const record = Object.fromEntries(users.map((user) => [normalizeEmail(user.email), user]));
	if (!record[ADMIN_EMAIL]) {
		record[ADMIN_EMAIL] = defaultAdmin;
		await writeUsersRecord(record);
	}
	return record;
}
async function writeUsersRecord(users) {
	const normalizedUsers = Object.fromEntries(Object.values(users).map((user) => {
		const email = normalizeEmail(user.email);
		return [email, {
			...user,
			email
		}];
	}));
	if (!normalizedUsers[ADMIN_EMAIL]) normalizedUsers[ADMIN_EMAIL] = defaultAdmin;
	await writeStoreCollection("users", Object.values(normalizedUsers));
	return normalizedUsers;
}
function getChatKey(vehicleId, email) {
	return `${vehicleId}:${normalizeEmail(email)}`;
}
async function readChatThread(vehicleId, email) {
	const key = getChatKey(vehicleId, email);
	return (await readStoreCollection("chats")).find((thread) => thread.key === key) ?? {
		key,
		messages: []
	};
}
async function listChatThreadsForEmail(email) {
	const normalizedEmail = normalizeEmail(email);
	return (await readStoreCollection("chats")).filter((thread) => thread.key.endsWith(`:${normalizedEmail}`));
}
function broadcastChatMessage(threadKey, message) {
	const subscribers = chatSubscribers.get(threadKey);
	if (!subscribers) return;
	for (const send of Array.from(subscribers)) try {
		send({ message });
	} catch (error) {
		console.error(`Failed to send SSE update for thread ${threadKey}:`, error);
	}
}
async function writeChatThread(thread) {
	await writeStoreCollection("chats", [thread, ...(await readStoreCollection("chats")).filter((item) => item.key !== thread.key)]);
}
async function handleApiRequest(request) {
	const url = new URL(request.url);
	if (!url.pathname.startsWith("/api/")) return void 0;
	if (url.pathname === "/api/health") return jsonResponse({
		ok: true,
		smtpConfigured: Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS)
	});
	if (url.pathname === "/api/debug-env") return jsonResponse({
		ok: true,
		loadedEnvPath: loadedEnvPath ?? "none",
		smtpHost: process.env.SMTP_HOST ? "configured" : "missing",
		smtpUser: process.env.SMTP_USER ? "configured" : "missing",
		smtpPass: process.env.SMTP_PASS ? "configured" : "missing",
		smtpFrom: process.env.SMTP_FROM ? "configured" : "missing"
	});
	const uploadMatch = url.pathname.match(/^\/api\/uploads\/([a-z0-9-]+)$/i);
	if (uploadMatch && request.method === "GET") {
		const upload = await readUploadAsset(uploadMatch[1]);
		if (!upload) return jsonResponse({ error: "Upload not found" }, { status: 404 });
		return new Response(Buffer.from(upload.dataBase64, "base64"), { headers: {
			"content-type": upload.type,
			"cache-control": "public, max-age=31536000, immutable"
		} });
	}
	if (url.pathname === "/api/uploads" && request.method === "POST") {
		console.log("=== UPLOAD ENDPOINT REACHED ===");
		let file = null;
		try {
			const value = (await request.formData()).get("file");
			file = value instanceof File ? value : null;
			console.log(`File upload request: ${file?.name || "no file"} (${file?.size || 0} bytes)`);
		} catch (error) {
			console.error("Upload form parsing error:", error);
			return jsonResponse({ error: error instanceof Error ? error.message : "Invalid upload body" }, { status: 400 });
		}
		if (!file || file.size === 0) {
			console.error("No file or empty file provided");
			return jsonResponse({ error: "A file is required" }, { status: 400 });
		}
		try {
			console.log("Starting file save process");
			const result = await saveUploadFile(file);
			console.log("File saved successfully:", result.id);
			return jsonResponse(result, { status: 201 });
		} catch (error) {
			console.error("File save error:", error);
			return jsonResponse({ error: error instanceof Error ? error.message : "Upload failed" }, { status: 400 });
		}
	}
	console.log(`Incoming request: ${request.method} ${url.pathname}`);
	if (url.pathname === "/health" && request.method === "GET") return jsonResponse({
		status: "ok",
		timestamp: (/* @__PURE__ */ new Date()).toISOString(),
		environment: loadedEnvPath ? "file" : "system",
		smtpConfigured: !!(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS),
		databaseConfigured: !!process.env.DATABASE_URL
	});
	if (url.pathname === "/api/send-verification-email" && request.method === "POST") {
		console.log("=== VERIFICATION EMAIL ENDPOINT REACHED ===");
		console.log("Received verification email request");
		let payload;
		try {
			payload = await readJsonBody(request);
			console.log(`Email verification request for: ${payload.email}`);
		} catch (error) {
			console.error("JSON parsing error:", error);
			return jsonResponse({ error: error instanceof Error ? error.message : "Invalid JSON body" }, { status: 400 });
		}
		const email = String(payload.email ?? "").trim().toLowerCase();
		if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
			console.error(`Invalid email format: ${email}`);
			return jsonResponse({ error: "A valid email is required" }, { status: 400 });
		}
		try {
			const code = generateVerificationCode();
			console.log(`Generated verification code for ${email}`);
			await storeVerificationCode(email, code);
			console.log(`Stored verification code for ${email}`);
			await sendVerificationEmail({
				email,
				code
			});
			console.log(`Sent verification email to ${email}`);
			return jsonResponse({ ok: true });
		} catch (error) {
			const message = error instanceof Error ? error.message : "Verification email could not be sent";
			console.error(`Signup process failed for ${email}:`, message, error);
			return jsonResponse({ error: message }, { status: 500 });
		}
	}
	if (url.pathname === "/api/verify-code" && request.method === "POST") {
		let payload;
		try {
			payload = await readJsonBody(request);
		} catch (error) {
			return jsonResponse({ error: error instanceof Error ? error.message : "Invalid JSON body" }, { status: 400 });
		}
		const email = String(payload.email ?? "").trim().toLowerCase();
		const code = String(payload.code ?? "").trim();
		if (!email || !code) return jsonResponse({ error: "Email and code are required" }, { status: 400 });
		const storedCode = await getVerificationCode(email);
		if (!storedCode) return jsonResponse({ error: "Invalid or expired code" }, { status: 400 });
		if (storedCode !== code) return jsonResponse({ error: "Invalid code" }, { status: 400 });
		await clearVerificationCode(email);
		return jsonResponse({ ok: true });
	}
	if (url.pathname === "/api/auth/login" && request.method === "POST") {
		let payload;
		try {
			payload = await readJsonBody(request);
		} catch (error) {
			return jsonResponse({ error: error instanceof Error ? error.message : "Invalid JSON body" }, { status: 400 });
		}
		const email = normalizeEmail(payload.email);
		const password = String(payload.password ?? "");
		const user = (await readUsersRecord())[email];
		if (!user || user.password !== password) return jsonResponse({ error: "Email or password is incorrect." }, { status: 401 });
		return jsonResponse(userToSession(user));
	}
	if (url.pathname === "/api/users" && request.method === "GET") return jsonResponse(await readUsersRecord());
	if (url.pathname === "/api/users" && request.method === "POST") {
		let user;
		try {
			user = await readJsonBody(request);
		} catch (error) {
			return jsonResponse({ error: error instanceof Error ? error.message : "Invalid JSON body" }, { status: 400 });
		}
		const email = normalizeEmail(user.email);
		if (!email || !user.username || !user.password) return jsonResponse({ error: "Email, username, and password are required" }, { status: 400 });
		const users = await readUsersRecord();
		users[email] = {
			...user,
			email,
			role: user.role ?? "user"
		};
		await writeUsersRecord(users);
		return jsonResponse(userToSession(users[email]), { status: 201 });
	}
	if (url.pathname === "/api/users" && request.method === "PUT") {
		let users;
		try {
			users = await readJsonBody(request);
		} catch (error) {
			return jsonResponse({ error: error instanceof Error ? error.message : "Invalid JSON body" }, { status: 400 });
		}
		return jsonResponse(await writeUsersRecord(users));
	}
	const userMatch = url.pathname.match(/^\/api\/users\/(.+)$/);
	if (userMatch && request.method === "DELETE") {
		const email = normalizeEmail(decodeURIComponent(userMatch[1]));
		const users = await readUsersRecord();
		if (email !== ADMIN_EMAIL) {
			delete users[email];
			await writeUsersRecord(users);
		}
		return jsonResponse({ ok: true });
	}
	if (url.pathname === "/api/activity" && request.method === "GET") return jsonResponse(await readStoreCollection("activity"));
	if (url.pathname === "/api/visitor-count" && request.method === "GET") {
		const now = Date.now();
		let activeCount = 0;
		let guestCount = 0;
		let registeredCount = 0;
		for (const visitor of activeVisitors.values()) if (now - visitor.lastSeen < VISITOR_TIMEOUT) {
			activeCount++;
			if (visitor.isGuest) guestCount++;
			else registeredCount++;
		}
		return jsonResponse({
			currentActiveVisitors: activeCount,
			registeredUsers: registeredCount,
			guests: guestCount,
			lastUpdated: (/* @__PURE__ */ new Date()).toISOString()
		});
	}
	if (url.pathname === "/api/download-count" && request.method === "GET") {
		const users = await readUsersRecord();
		const anonymousDownloads = await readStoreCollection("anonymous-downloads");
		let registeredDownloadCount = 0;
		for (const user of Object.values(users)) if (user.downloads && user.downloads.length > 0) registeredDownloadCount += user.downloads.length;
		const anonymousDownloadCount = anonymousDownloads.length;
		return jsonResponse({
			totalDownloads: registeredDownloadCount + anonymousDownloadCount,
			registeredDownloads: registeredDownloadCount,
			anonymousDownloads: anonymousDownloadCount,
			lastUpdated: (/* @__PURE__ */ new Date()).toISOString()
		});
	}
	if (url.pathname === "/api/visitor-heartbeat" && request.method === "POST") {
		let payload;
		try {
			payload = await readJsonBody(request);
		} catch (error) {
			return jsonResponse({ error: error instanceof Error ? error.message : "Invalid JSON body" }, { status: 400 });
		}
		const userId = payload.userId || "guest";
		const isGuest = payload.isGuest !== false;
		const now = Date.now();
		activeVisitors.set(userId, {
			userId,
			lastSeen: now,
			isGuest
		});
		console.log(`Visitor heartbeat: ${userId} (guest: ${isGuest})`);
		return jsonResponse({
			ok: true,
			activeCount: activeVisitors.size
		});
	}
	if (url.pathname === "/api/visitor-leave" && request.method === "POST") {
		let payload;
		try {
			payload = await readJsonBody(request);
		} catch (error) {
			return jsonResponse({ error: error instanceof Error ? error.message : "Invalid JSON body" }, { status: 400 });
		}
		const userId = payload.userId || "guest";
		activeVisitors.delete(userId);
		console.log(`Visitor left: ${userId}`);
		return jsonResponse({
			ok: true,
			activeCount: activeVisitors.size
		});
	}
	if (url.pathname === "/api/activity" && request.method === "POST") {
		let payload;
		try {
			payload = await readJsonBody(request);
		} catch (error) {
			return jsonResponse({ error: error instanceof Error ? error.message : "Invalid JSON body" }, { status: 400 });
		}
		const action = String(payload.action ?? "").trim();
		if (!action) return jsonResponse({ error: "Action is required" }, { status: 400 });
		const item = {
			action,
			detail: String(payload.detail ?? ""),
			user: normalizeEmail(payload.user) || "guest",
			at: (/* @__PURE__ */ new Date()).toISOString()
		};
		await writeStoreCollection("activity", [item, ...await readStoreCollection("activity")].slice(0, 120));
		return jsonResponse(item, { status: 201 });
	}
	if (url.pathname === "/api/chats" && request.method === "GET") {
		const requestedEmail = String(url.searchParams.get("email") ?? "");
		if (!requestedEmail) return jsonResponse({ error: "Email query parameter is required" }, { status: 400 });
		return jsonResponse(await listChatThreadsForEmail(requestedEmail));
	}
	const chatStreamMatch = url.pathname.match(/^\/api\/chats\/(\d+)\/(.+)\/stream$/);
	if (chatStreamMatch && request.method === "GET") {
		const threadKey = getChatKey(Number(chatStreamMatch[1]), decodeURIComponent(chatStreamMatch[2]));
		let sendFn;
		const channel = createSseChannel(() => {
			const subscribers = chatSubscribers.get(threadKey);
			if (!subscribers) return;
			subscribers.delete(sendFn);
			if (subscribers.size === 0) chatSubscribers.delete(threadKey);
		});
		sendFn = (data) => channel.send(data);
		const currentSubscribers = chatSubscribers.get(threadKey) ?? /* @__PURE__ */ new Set();
		currentSubscribers.add(sendFn);
		chatSubscribers.set(threadKey, currentSubscribers);
		return channel.response;
	}
	const chatMatch = url.pathname.match(/^\/api\/chats\/(\d+)\/(.+)$/);
	if (chatMatch && request.method === "GET") return jsonResponse((await readChatThread(Number(chatMatch[1]), decodeURIComponent(chatMatch[2]))).messages);
	if (chatMatch && request.method === "POST") {
		let payload;
		try {
			payload = await readJsonBody(request);
		} catch (error) {
			return jsonResponse({ error: error instanceof Error ? error.message : "Invalid JSON body" }, { status: 400 });
		}
		const body = String(payload.body ?? "").trim();
		if (!body) return jsonResponse({ error: "Message body is required" }, { status: 400 });
		const thread = await readChatThread(Number(chatMatch[1]), decodeURIComponent(chatMatch[2]));
		const message = {
			from: payload.from === "admin" ? "admin" : "user",
			body,
			at: (/* @__PURE__ */ new Date()).toISOString()
		};
		thread.messages = [...thread.messages, message];
		await writeChatThread(thread);
		broadcastChatMessage(thread.key, message);
		return jsonResponse(thread.messages, { status: 201 });
	}
	if (url.pathname === "/api/vehicles" && request.method === "GET") return jsonResponse(await readStoreCollection("vehicles"));
	if (url.pathname === "/api/vehicles" && request.method === "POST") {
		let vehicle;
		try {
			vehicle = (request.headers.get("content-type") ?? "").includes("multipart/form-data") ? await vehicleFromMultipartForm(await request.formData()) : await readJsonBody(request);
		} catch (error) {
			return jsonResponse({ error: error instanceof Error ? error.message : "Invalid vehicle body" }, { status: 400 });
		}
		const vehicles = await readStoreCollection("vehicles");
		if (vehicles.some((item) => item.id === vehicle.id)) vehicle.id = createNumericId();
		await writeStoreCollection("vehicles", [vehicle, ...vehicles]);
		return jsonResponse(vehicle, { status: 201 });
	}
	if (url.pathname === "/api/news" && request.method === "GET") try {
		const news = await readStoreCollection("news");
		if (news.length === 0) {
			const initialNews = [{
				id: createId(),
				title: "Welcome to Linz Lottery Platform",
				content: "We're excited to launch our new lottery platform with amazing prizes and real-time updates!",
				category: "announcement",
				image: "https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?w=800&h=450&fit=crop",
				timestamp: (/* @__PURE__ */ new Date()).toISOString()
			}, {
				id: createId(),
				title: "First Grand Prize Draw Coming Soon",
				content: "Our first grand prize draw will be announced soon. Stay tuned for details!",
				category: "draw",
				image: "https://images.unsplash.com/photo-1555449372-5c3d6d6e8c8c?w=800&h=450&fit=crop",
				timestamp: (/* @__PURE__ */ new Date(Date.now() - 36e5)).toISOString()
			}];
			await writeStoreCollection("news", initialNews);
			return jsonResponse(initialNews);
		}
		return jsonResponse(news);
	} catch (error) {
		console.error("Error fetching news:", error);
		return jsonResponse([], { status: 500 });
	}
	if (url.pathname === "/api/news" && request.method === "POST") {
		let newsItem;
		try {
			newsItem = await readJsonBody(request);
		} catch (error) {
			return jsonResponse({ error: error instanceof Error ? error.message : "Invalid news body" }, { status: 400 });
		}
		if (!newsItem.title || !newsItem.content || !newsItem.category || !newsItem.image) return jsonResponse({ error: "Title, content, category, and image are required" }, { status: 400 });
		const newItem = {
			id: createId(),
			title: newsItem.title,
			content: newsItem.content,
			category: newsItem.category,
			image: newsItem.image,
			link: newsItem.link,
			timestamp: (/* @__PURE__ */ new Date()).toISOString()
		};
		await writeStoreCollection("news", [newItem, ...await readStoreCollection("news")]);
		for (const subscriber of newsSubscribers) try {
			subscriber({
				type: "news_update",
				news: [newItem]
			});
		} catch (error) {
			console.error("Failed to broadcast news update:", error);
		}
		return jsonResponse(newItem, { status: 201 });
	}
	if (url.pathname === "/api/news" && request.method === "DELETE") {
		let payload;
		try {
			payload = await readJsonBody(request);
		} catch (error) {
			return jsonResponse({ error: error instanceof Error ? error.message : "Invalid JSON body" }, { status: 400 });
		}
		if (!payload.id) return jsonResponse({ error: "News item ID is required" }, { status: 400 });
		return jsonResponse({ success: await deleteFromStoreCollection("news", (item) => item.id === payload.id) });
	}
	if (url.pathname === "/api/news/stream" && request.method === "GET") {
		const channel = createSseChannel(() => {
			newsSubscribers.delete(sendFn);
		});
		const sendFn = (data) => channel.send(data);
		newsSubscribers.add(sendFn);
		try {
			const news = await readStoreCollection("news");
			channel.send({
				type: "initial_news",
				news
			});
		} catch (error) {
			console.error("Failed to send initial news:", error);
			channel.send({
				type: "initial_news",
				news: []
			});
		}
		return channel.response;
	}
	console.log(`Request: ${request.method} ${url.pathname}`);
	const vehicleMatch = url.pathname.match(/^\/api\/vehicles\/(\d+)$/);
	console.log(`Vehicle match result:`, vehicleMatch);
	if (vehicleMatch && request.method === "GET") {
		const id = Number(vehicleMatch[1]);
		const vehicle = (await readStoreCollection("vehicles")).find((item) => item.id === id);
		return vehicle ? jsonResponse(vehicle) : jsonResponse({ error: "Vehicle not found" }, { status: 404 });
	}
	if (vehicleMatch && request.method === "DELETE") {
		const id = Number(vehicleMatch[1]);
		try {
			console.log(`Attempting to delete vehicle with ID: ${id} (type: ${typeof id})`);
			const vehicles = await readStoreCollection("vehicles");
			console.log(`Current vehicles in database: ${vehicles.length}`);
			const vehicleToDelete = vehicles.find((item) => {
				console.log(`Comparing vehicle ID ${item.id} (type: ${typeof item.id}) with ${id}`);
				return Number(item.id) === id;
			});
			if (!vehicleToDelete) {
				console.error(`Vehicle with ID ${id} not found in database`);
				return jsonResponse({ error: "Vehicle not found in database" }, { status: 404 });
			}
			console.log(`Found vehicle to delete: ${vehicleToDelete.name} (ID: ${vehicleToDelete.id})`);
			if (!await deleteFromStoreCollection("vehicles", (item) => Number(item.id) === id)) {
				console.error(`Failed to delete vehicle with ID ${id}`);
				return jsonResponse({ error: "Failed to delete vehicle" }, { status: 500 });
			}
			const verificationVehicles = await readStoreCollection("vehicles");
			if (verificationVehicles.some((item) => Number(item.id) === id)) {
				console.error(`Vehicle with ID ${id} still exists after deletion attempt`);
				return jsonResponse({ error: "Deletion failed - vehicle still exists in database" }, { status: 500 });
			}
			console.log(`Successfully deleted vehicle with ID ${id}. Remaining vehicles: ${verificationVehicles.length}`);
			return jsonResponse({
				ok: true,
				remainingCount: verificationVehicles.length
			});
		} catch (error) {
			console.error(`Error deleting vehicle with ID ${id}:`, error);
			return jsonResponse({ error: error instanceof Error ? error.message : "Failed to delete vehicle" }, { status: 500 });
		}
	}
	if (url.pathname.startsWith("/api/")) console.log(`Unmatched API route: ${request.method} ${url.pathname}`);
	if (url.pathname === "/api/track-download" && request.method === "POST") {
		let payload;
		try {
			payload = await readJsonBody(request);
		} catch (error) {
			return jsonResponse({ error: error instanceof Error ? error.message : "Invalid JSON body" }, { status: 400 });
		}
		const email = normalizeEmail(payload.email);
		const vehicleId = Number(payload.vehicleId);
		const vehicleName = String(payload.vehicleName ?? "");
		const timestamp = String(payload.timestamp ?? (/* @__PURE__ */ new Date()).toISOString());
		if (!email || !vehicleId || !vehicleName) return jsonResponse({ error: "Email, vehicleId, and vehicleName are required" }, { status: 400 });
		const users = await readUsersRecord();
		const user = users[email];
		if (!user) return jsonResponse({ error: "User not found" }, { status: 404 });
		if (!user.downloads) user.downloads = [];
		const existingDownload = user.downloads.find((d) => d.vehicleId === vehicleId);
		if (existingDownload) {
			existingDownload.completed = true;
			existingDownload.timestamp = timestamp;
		} else user.downloads.push({
			vehicleId,
			vehicleName,
			timestamp,
			completed: true
		});
		await writeUsersRecord(users);
		return jsonResponse({
			ok: true,
			downloads: user.downloads
		});
	}
	if (url.pathname === "/api/track-anonymous-download" && request.method === "POST") {
		let payload;
		try {
			payload = await readJsonBody(request);
		} catch (error) {
			return jsonResponse({ error: error instanceof Error ? error.message : "Invalid JSON body" }, { status: 400 });
		}
		const vehicleId = Number(payload.vehicleId);
		const vehicleName = String(payload.vehicleName ?? "");
		const timestamp = String(payload.timestamp ?? (/* @__PURE__ */ new Date()).toISOString());
		if (!vehicleId || !vehicleName) return jsonResponse({ error: "VehicleId and vehicleName are required" }, { status: 400 });
		const anonymousDownloads = await readStoreCollection("anonymous-downloads");
		const existingDownload = anonymousDownloads.find((d) => d.vehicleId === vehicleId);
		if (existingDownload) {
			existingDownload.count++;
			existingDownload.timestamp = timestamp;
		} else anonymousDownloads.push({
			vehicleId,
			vehicleName,
			timestamp,
			count: 1
		});
		await writeStoreCollection("anonymous-downloads", anonymousDownloads);
		return jsonResponse({ ok: true });
	}
	if (url.pathname === "/api/anonymous-downloads" && request.method === "GET") return jsonResponse(await readStoreCollection("anonymous-downloads"));
	return jsonResponse({ error: "API route not found" }, { status: 404 });
}
var server_default = { async fetch(request, env, ctx) {
	try {
		const apiResponse = await handleApiRequest(request);
		if (apiResponse) return apiResponse;
		return await normalizeCatastrophicSsrResponse(await (await getServerEntry()).fetch(request, env, ctx));
	} catch (error) {
		console.error(error);
		return new Response(renderErrorPage(), {
			status: 500,
			headers: { "content-type": "text/html; charset=utf-8" }
		});
	}
} };
//#endregion
export { server_default as default, renderErrorPage as t };
