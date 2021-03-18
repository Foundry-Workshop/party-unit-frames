import { MODULE_NAME } from './settings';

export const preloadTemplates = async function () {
	const templatePaths = [
		// Add paths to "module/XXX/templates"
		`/modules/${MODULE_NAME}/templates/hud/quest-tracker.html`,
    `/modules/${MODULE_NAME}/templates/hud/unit-frame-box.html`,
	];

	return loadTemplates(templatePaths);
}
