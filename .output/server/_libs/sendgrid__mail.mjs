import { t as __commonJSMin } from "../_runtime.mjs";
import { n as require_helpers, t as require_client } from "./@sendgrid/client+[...].mjs";
//#region node_modules/@sendgrid/mail/src/classes/mail-service.js
var require_mail_service = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/**
	* Dependencies
	*/
	var { Client } = require_client();
	var { classes: { Mail } } = require_helpers();
	/**
	* Mail service class
	*/
	var MailService = class {
		/**
		* Constructor
		*/
		constructor() {
			this.setClient(new Client());
			this.setSubstitutionWrappers("{{", "}}");
			this.secretRules = [];
		}
		/**
		* Set client
		*/
		setClient(client) {
			this.client = client;
			return this;
		}
		/**
		* SendGrid API key passthrough for convenience.
		*/
		setApiKey(apiKey) {
			this.client.setApiKey(apiKey);
			return this;
		}
		/**
		* Twilio Email Auth passthrough for convenience.
		*/
		setTwilioEmailAuth(username, password) {
			this.client.setTwilioEmailAuth(username, password);
		}
		/**
		* Set client timeout
		*/
		setTimeout(timeout) {
			if (typeof timeout === "undefined") return;
			this.client.setDefaultRequest("timeout", timeout);
		}
		/**
		* Set substitution wrappers
		*/
		setSubstitutionWrappers(left, right) {
			if (typeof left === "undefined" || typeof right === "undefined") throw new Error("Must provide both left and right side wrappers");
			if (!Array.isArray(this.substitutionWrappers)) this.substitutionWrappers = [];
			this.substitutionWrappers[0] = left;
			this.substitutionWrappers[1] = right;
			return this;
		}
		/**
		* Set secret rules for filtering the e-mail content
		*/
		setSecretRules(rules) {
			if (!(rules instanceof Array)) rules = [rules];
			const tmpRules = rules.map(function(rule) {
				const ruleType = typeof rule;
				if (ruleType === "string") return { pattern: new RegExp(rule) };
				else if (ruleType === "object") {
					if (rule instanceof RegExp) rule = { pattern: rule };
					else if (rule.hasOwnProperty("pattern") && typeof rule.pattern === "string") rule.pattern = new RegExp(rule.pattern);
					try {
						rule.pattern.test("");
						return rule;
					} catch (err) {}
				}
			});
			this.secretRules = tmpRules.filter(function(val) {
				return val;
			});
		}
		/**
		* Check if the e-mail is safe to be sent
		*/
		filterSecrets(body) {
			if (typeof body === "object" && !body.hasOwnProperty("content")) return;
			const self = this;
			body.content.forEach(function(data) {
				self.secretRules.forEach(function(rule) {
					if (rule.hasOwnProperty("pattern") && !rule.pattern.test(data.value)) return;
					let message = `The pattern '${rule.pattern}'`;
					if (rule.name) message += `identified by '${rule.name}'`;
					message += " was found in the Mail content!";
					throw new Error(message);
				});
			});
		}
		/**
		* Send email
		*/
		send(data, isMultiple = false, cb) {
			if (typeof isMultiple === "function") {
				cb = isMultiple;
				isMultiple = false;
			}
			if (Array.isArray(data)) {
				const promise = Promise.all(data.map((item) => {
					return this.send(item, isMultiple);
				}));
				if (cb) promise.then((result) => cb(null, result)).catch((error) => cb(error, null));
				return promise;
			}
			try {
				if (typeof data.isMultiple === "undefined") data.isMultiple = isMultiple;
				if (typeof data.substitutionWrappers === "undefined") data.substitutionWrappers = this.substitutionWrappers;
				const mail = Mail.create(data);
				const body = mail.toJSON();
				this.filterSecrets(body);
				const request = {
					method: "POST",
					url: "/v3/mail/send",
					headers: mail.headers,
					body
				};
				return this.client.request(request, cb);
			} catch (error) {
				if (cb) cb(error, null);
				return Promise.reject(error);
			}
		}
		/**
		* Send multiple emails (shortcut)
		*/
		sendMultiple(data, cb) {
			return this.send(data, true, cb);
		}
	};
	module.exports = MailService;
}));
//#endregion
//#region node_modules/@sendgrid/mail/src/mail.js
var require_mail$1 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = new (require_mail_service())();
}));
//#endregion
//#region node_modules/@sendgrid/mail/index.js
var require_mail = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var mailer = require_mail$1();
	var MailService = require_mail_service();
	module.exports = mailer;
	module.exports.MailService = MailService;
}));
//#endregion
export { require_mail as t };
