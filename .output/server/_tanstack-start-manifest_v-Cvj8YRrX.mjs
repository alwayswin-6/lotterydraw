//#region node_modules/.nitro/vite/services/ssr/assets/_tanstack-start-manifest_v-Cvj8YRrX.js
var tsrStartManifest = () => ({ routes: {
	__root__: {
		filePath: "F:/work/lottery/lotterydraw/src/routes/__root.tsx",
		children: [
			"/",
			"/admin",
			"/vehicles/$id"
		],
		preloads: [
			"/assets/index-COMJLcb1.js",
			"/assets/rolldown-runtime-CNC7AqOf.js",
			"/assets/jsx-runtime-CaR_m4Xc.js"
		],
		scripts: [{ attrs: {
			type: "module",
			async: !0,
			src: "/assets/index-COMJLcb1.js"
		} }]
	},
	"/": {
		filePath: "F:/work/lottery/lotterydraw/src/routes/index.tsx",
		children: void 0,
		preloads: [
			"/assets/routes-C9f3RpAw.js",
			"/assets/proxy-BPUov0s-.js",
			"/assets/api-D0_P4wlt.js"
		]
	},
	"/admin": {
		filePath: "F:/work/lottery/lotterydraw/src/routes/admin.tsx",
		children: ["/admin/users/$email"],
		preloads: [
			"/assets/admin-lcJvI_sg.js",
			"/assets/proxy-BPUov0s-.js",
			"/assets/api-D0_P4wlt.js"
		]
	},
	"/vehicles/$id": {
		filePath: "F:/work/lottery/lotterydraw/src/routes/vehicles/$id.tsx",
		children: void 0,
		preloads: ["/assets/_id-B4pjPp_J.js", "/assets/api-D0_P4wlt.js"]
	},
	"/admin/users/$email": {
		filePath: "F:/work/lottery/lotterydraw/src/routes/admin/users/$email.tsx",
		children: void 0,
		preloads: ["/assets/_email-D4AT6Q7X.js"]
	}
} });
//#endregion
export { tsrStartManifest };
