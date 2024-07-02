import type { PlaywrightTestConfig } from '@playwright/test';

const config: PlaywrightTestConfig = {
	webServer: {
		command: 'npm run build && npm run preview',
		port: 4173
	},
	testDir: 'tests',
	workers: 1,
	testMatch: /(.+\.)?(test|spec)\.[jt]s/
};

export default config;
